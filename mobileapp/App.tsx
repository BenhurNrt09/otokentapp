import React, { useEffect } from 'react';
// import './global.css'; // NativeWind v2 does not use this
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

import DetailScreen from './screens/DetailScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatDetailScreen from './screens/ChatDetailScreen';
import InsuranceScreen from './screens/InsuranceScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import LoginSecurityScreen from './screens/LoginSecurityScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import PrivacySecurityScreen from './screens/PrivacySecurityScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import TermsScreen from './screens/TermsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import CookiePolicyScreen from './screens/CookiePolicyScreen';
import { RootStackParamList } from './types';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { View, Text } from 'react-native';

// Setup Notifications
// Setup Notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { unreadNotificationCount, unreadMessageCount } = useApp();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb', // blue-600
        tabBarInactiveTintColor: '#64748b', // slate-500
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          let badgeCount = 0;

          if (route.name === 'Vehicles') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            badgeCount = unreadMessageCount;
          } else if (route.name === 'Insurance') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={{ position: 'relative' }}>
              <Ionicons name={iconName} size={size} color={color} />
              {badgeCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -5,
                  right: -10,
                  backgroundColor: '#ef4444',
                  borderRadius: 10,
                  minWidth: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Vehicles"
        component={HomeScreen}
        options={{ title: 'Araçlar' }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ title: 'Mesajlarım' }}
      />
      <Tab.Screen
        name="Insurance"
        component={InsuranceScreen}
        options={{ title: 'Sigorta' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isLoggedIn } = useApp();

  return (
    <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#f8fafc' }, headerShown: false }}>
      {!isLoggedIn ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
        </>
      ) : (
        // App Stack
        <>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="ChatDetail"
            component={ChatDetailScreen}
            options={{ animation: 'slide_from_right', headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="LoginSecurity" component={LoginSecurityScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="Terms" component={TermsScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="CookiePolicy" component={CookiePolicyScreen} options={{ animation: 'slide_from_right' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

// Wrap the entire app in Provider
export default function App() {
  // Notifications setup could be here or in a hook
  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        if (__DEV__) return;
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        console.log(`Error fetching update: ${error}`);
      }
    }
    onFetchUpdateAsync();
  }, []);

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      // ... (existing notification logic)
    }
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

function AppContent() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}
