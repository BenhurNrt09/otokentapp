import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert, Linking, Modal, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { QUICK_REPLIES } from '../constants/mocks';

export default function ChatDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { chat } = route.params || {};
    const { user, isLoggedIn } = useApp();

    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);
    const [showAttachments, setShowAttachments] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Recording & Playback State
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

    // Refs for cleanup and race condition prevention
    const recordingRef = useRef<Audio.Recording | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const isAudioAction = useRef(false);

    useEffect(() => {
        loadMessages();
        const subscribe = subscribeToMessages();
        return () => {
            subscribe();
        };
    }, []);

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`chat_${chat.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `sender_id=eq.${chat.id},receiver_id=eq.${user.id}`
                },
                (payload) => {
                    const newMsg = payload.new;
                    const mapped = {
                        id: newMsg.id,
                        text: newMsg.content,
                        sender: 'other',
                        time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: newMsg.message_type || 'text',
                        mediaUrl: newMsg.media_url
                    };
                    setMessages(prev => [...prev, mapped]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const loadMessages = async () => {
        if (!isLoggedIn || !chat.id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${chat.id}),and(sender_id.eq.${chat.id},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data) {
                const mappedMessages = data.map(msg => ({
                    id: msg.id,
                    text: msg.content,
                    sender: msg.sender_id === user.id ? 'me' : 'other',
                    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: msg.message_type || 'text',
                    mediaUrl: msg.media_url
                }));
                setMessages(mappedMessages);

                // Mark messages from other user as read
                await markMessagesAsRead();
            }
        } catch (e) {
            console.error('Error loading messages:', e);
        } finally {
            setLoading(false);
        }
    };

    const markMessagesAsRead = async () => {
        if (!isLoggedIn || !chat.id) return;
        try {
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('sender_id', chat.id)
                .eq('receiver_id', user.id)
                .eq('is_read', false);
        } catch (e) {
            console.error('Error marking read:', e);
        }
    };

    // Scroll effect when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
        }
    }, [messages]);


    useEffect(() => {
        return () => {
            if (recordingRef.current) {
                recordingRef.current.stopAndUnloadAsync().catch(() => { });
            }
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
            }
        };
    }, []);

    // Sync refs with state
    useEffect(() => {
        recordingRef.current = recording || null;
    }, [recording]);

    useEffect(() => {
        soundRef.current = sound;
    }, [sound]);

    async function startRecording() {
        if (isAudioAction.current) return;
        isAudioAction.current = true;

        try {
            if (recordingRef.current) {
                try {
                    await recordingRef.current.stopAndUnloadAsync();
                } catch (e) { /* ignore */ }
            }

            if (permissionResponse?.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
            }
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(newRecording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Hata', 'Mikrofon izni gerekli veya kayıt başlatılamadı.');
        } finally {
            isAudioAction.current = false;
        }
    }

    async function stopRecording() {
        if (isAudioAction.current) return;
        console.log('Stopping recording..');
        const activeRecording = recordingRef.current;
        if (!activeRecording) {
            setRecording(undefined);
            return;
        }

        isAudioAction.current = true;

        try {
            await activeRecording.stopAndUnloadAsync();
            const uri = activeRecording.getURI();
            console.log('Recording stopped and stored at', uri);
            if (uri) {
                sendMessage(uri, 'voice');
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        } finally {
            setRecording(undefined);
            isAudioAction.current = false;
        }
    }

    async function playSound(uri: string, messageId: string) {
        if (isAudioAction.current) return;
        isAudioAction.current = true;

        try {
            if (playingMessageId === messageId && soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                setSound(null);
                setPlayingMessageId(null);
                isAudioAction.current = false;
                return;
            }

            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                setSound(null);
            }

            console.log('Loading sound..', uri);
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );

            setSound(newSound);
            setPlayingMessageId(messageId);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setPlayingMessageId(null);
                    setSound(null);
                    newSound.unloadAsync().catch(() => { });
                }
            });

        } catch (error) {
            console.error('Failed to play sound', error);
            Alert.alert('Hata', 'Ses dosyası oynatılamadı.');
        } finally {
            isAudioAction.current = false;
        }
    }

    const handleSend = () => {
        if (!messageText.trim()) return;
        sendMessage(messageText, 'text');
    };

    const sendMessage = async (content: string, type: 'text' | 'image' | 'voice' | 'location' | 'document') => {
        if (!isLoggedIn || user.id === 'guest') {
            Alert.alert('Giriş Yapın', 'Mesaj göndermek için giriş yapmalısınız.');
            return;
        }

        try {
            let finalContent = content;
            let mediaUrl = undefined;

            if (type !== 'text') {
                // If it's a media type, the 'content' passed is the URI
                // In a production app, we would upload to Supabase Storage here
                // For now, we'll store the local URI or handle accordingly
                // (Uploading logic would go here)
                mediaUrl = content;
                finalContent = type === 'image' ? 'Fotoğraf' : type === 'voice' ? 'Sesli Mesaj' : type === 'location' ? 'Konum' : 'Belge';
            }

            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    sender_id: user.id,
                    receiver_id: chat.id,
                    content: finalContent,
                    media_url: mediaUrl,
                    message_type: type,
                    is_read: false
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newMessage = {
                    id: data.id,
                    text: finalContent,
                    mediaUrl: mediaUrl,
                    sender: 'me',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: type
                };
                setMessages((prev: any) => [...prev, newMessage]);
                setMessageText('');
                if (showAttachments) setShowAttachments(false);
            }
        } catch (e) {
            console.error('Error sending message:', e);
            Alert.alert('Hata', 'Mesaj gönderilemedi.');
        }
    };

    const handleQuickReply = (text: string) => {
        sendMessage(text, 'text');
    };

    const pickImage = async (sourceType: 'camera' | 'library') => {
        let result;
        try {
            console.log(`Starting pickImage with ${sourceType}`);
            if (sourceType === 'camera') {
                const permission = await ImagePicker.requestCameraPermissionsAsync();
                console.log('Camera Permission:', permission);
                if (!permission.granted) {
                    Alert.alert('İzin Gerekli', 'Kamera izni verilmedi.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.7,
                });
            } else {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                console.log('Library Permission:', permission);
                if (!permission.granted) {
                    Alert.alert('İzin Gerekli', 'Galeri izni verilmedi.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 0.7,
                });
            }

            console.log('Picker Result:', result);
            if (!result.canceled && result.assets && result.assets.length > 0) {
                sendMessage(result.assets[0].uri, 'image');
            }
        } catch (e) {
            console.error('pickImage Error:', e);
            Alert.alert('Hata', 'Resim seçilirken bir hata oluştu.');
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                sendMessage(asset.uri, 'document');
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Hata', 'Belge seçilirken bir hata oluştu.');
        }
    };

    const handleDocumentPress = async (uri: string) => {
        try {
            // For file URIs, use FileSystem to share/open
            const supported = await Linking.canOpenURL(uri);
            if (supported) {
                await Linking.openURL(uri);
            } else {
                // Try to share the file if direct opening doesn't work
                const fileInfo = await FileSystem.getInfoAsync(uri);
                if (fileInfo.exists) {
                    // Just alert - on mobile, the file will be accessible through message
                    Alert.alert('Belge', 'Belge sisteminizde kaydedildi: ' + uri);
                } else {
                    Alert.alert('Hata', 'Belge bulunamadı.');
                }
            }
        } catch (e) {
            console.error('Error opening document:', e);
            Alert.alert('Hata', 'Belge açılamadı.');
        }
    };

    const shareLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('İzin Gerekli', 'Konum paylaşımı için izin gerekiyor.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const locationString = `https://maps.google.com/?q=${location.coords.latitude},${location.coords.longitude}`;
            sendMessage(locationString, 'location');
        } catch (e) {
            console.error(e);
            Alert.alert('Hata', 'Konum alınamadı.');
        }
    };

    const renderMessage = ({ item }: any) => {
        const isMe = item.sender === 'me';
        const isPlaying = playingMessageId === item.id;

        return (
            <View className={`mb-3 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                    <View className="w-8 h-8 bg-slate-200 rounded-full items-center justify-center mr-2 self-end mb-1">
                        {chat?.user?.avatar ? (
                            <Image source={{ uri: chat.user.avatar }} className="w-full h-full rounded-full" />
                        ) : (
                            <Ionicons name="person" size={16} color="#64748b" />
                        )}
                    </View>
                )}
                <View
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${isMe
                        ? 'bg-blue-600 rounded-br-none'
                        : 'bg-white border border-gray-100 rounded-bl-none shadow-sm'
                        }`}
                >
                    {item.type === 'image' ? (
                        <TouchableOpacity onPress={() => setSelectedImage(item.mediaUrl)}>
                            <Image source={{ uri: item.mediaUrl }} style={{ width: 200, height: 150, borderRadius: 8 }} resizeMode="cover" />
                        </TouchableOpacity>
                    ) : item.type === 'voice' ? (
                        <View className="flex-row items-center gap-2">
                            <TouchableOpacity
                                onPress={() => playSound(item.mediaUrl, item.id)}
                                className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                            >
                                <Ionicons name={isPlaying ? "square" : "play"} size={14} color="white" />
                            </TouchableOpacity>
                            <Text className={`text-base ${isMe ? 'text-white' : 'text-slate-800'}`}>
                                {isPlaying ? "Çalıyor..." : "Sesli Mesaj"}
                            </Text>
                        </View>
                    ) : item.type === 'location' ? (
                        <TouchableOpacity onPress={() => Linking.openURL(item.mediaUrl)}>
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="location" size={24} color={isMe ? 'white' : '#ef4444'} />
                                <Text className={`text-base underline ${isMe ? 'text-white' : 'text-blue-600'}`}>Konumu Gör</Text>
                            </View>
                        </TouchableOpacity>
                    ) : item.type === 'document' ? (
                        <TouchableOpacity onPress={() => Linking.openURL(item.mediaUrl)}>
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="document-text" size={24} color={isMe ? 'white' : '#f97316'} />
                                <Text className={`text-base underline ${isMe ? 'text-white' : 'text-slate-800'}`}>Belgeyi Aç</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <Text className={`text-base ${isMe ? 'text-white' : 'text-slate-800'}`}>{item.text}</Text>
                    )}

                    <View className="flex-row justify-end mt-1 items-center gap-1">
                        <Text className={`text-[10px] ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>{item.time}</Text>
                        {isMe && <Ionicons name="checkmark-done" size={12} color="#bfdbfe" />}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={'padding'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Header */}
                <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center shadow-sm z-10">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <View className="w-10 h-10 bg-slate-100 rounded-full mr-3 items-center justify-center overflow-hidden border border-gray-100">
                        {chat?.user?.avatar ? (
                            <Image source={{ uri: chat.user.avatar }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                            <Ionicons name={chat?.user?.isSupport ? "headset" : "person"} size={20} color="#64748b" />
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-slate-900">{chat?.user?.name || 'Kullanıcı'}</Text>
                        {chat?.user?.online && (
                            <Text className="text-xs text-green-600 font-medium">Çevrimiçi</Text>
                        )}
                    </View>
                </View>

                {/* Messages List - Takes available space */}
                <View className="flex-1">
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                        className="flex-1 bg-slate-50"
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                </View>

                {/* Input Area - Stays at bottom naturally in column layout */}
                <View className="bg-white p-3 border-t border-gray-100 flex-row items-end gap-2 shadow-lg">
                    <TouchableOpacity
                        onPress={() => setShowAttachments(!showAttachments)}
                        className={`p-3 rounded-full mb-0.5 transition-colors ${showAttachments ? 'bg-blue-100' : 'bg-slate-50'}`}
                    >
                        <Ionicons name="add" size={24} color={showAttachments ? "#2563eb" : "#64748b"} />
                    </TouchableOpacity>

                    <View className="flex-1 bg-slate-50 rounded-2xl border border-gray-200 px-4 py-2 min-h-[48px] justify-center">
                        <TextInput
                            value={messageText}
                            onChangeText={setMessageText}
                            placeholder={recording ? "Kayıt yapılıyor..." : "Mesaj yazın..."}
                            multiline
                            editable={!recording}
                            className="text-base text-slate-900 max-h-24"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    {messageText.trim() ? (
                        <TouchableOpacity
                            onPress={handleSend}
                            className="p-3 bg-blue-600 rounded-full mb-0.5 shadow-md shadow-blue-200"
                        >
                            <Ionicons name="send" size={20} color="white" className="ml-0.5" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            className={`p-3 rounded-full mb-0.5 ${recording ? 'bg-red-500 shadow-red-200 shadow-md animate-pulse' : 'bg-slate-50'}`}
                            onLongPress={startRecording}
                            onPressOut={stopRecording}
                            delayLongPress={200}
                        >
                            <Ionicons name={recording ? "mic" : "mic-outline"} size={24} color={recording ? "white" : "#64748b"} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Attachments - Rendered below input when visible */}
                {showAttachments && (
                    <View className="bg-white border-t border-gray-100 px-4 pt-2 pb-6 flex-row justify-around">
                        <TouchableOpacity onPress={() => pickImage('camera')} className="items-center p-2">
                            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="camera" size={24} color="#2563eb" />
                            </View>
                            <Text className="text-xs text-slate-700 font-medium">Kamera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImage('library')} className="items-center p-2">
                            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="images" size={24} color="#9333ea" />
                            </View>
                            <Text className="text-xs text-slate-700 font-medium">Galeri</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={shareLocation} className="items-center p-2">
                            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="location" size={24} color="#16a34a" />
                            </View>
                            <Text className="text-xs text-slate-700 font-medium">Konum</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickDocument} className="items-center p-2">
                            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="document-text" size={24} color="#ea580c" />
                            </View>
                            <Text className="text-xs text-slate-700 font-medium">Belge</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>

            {/* Image Zoom Modal */}
            <Modal
                visible={selectedImage !== null}
                transparent={true}
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 48,
                            right: 24,
                            zIndex: 10,
                            width: 40,
                            height: 40,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.8 }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
}
