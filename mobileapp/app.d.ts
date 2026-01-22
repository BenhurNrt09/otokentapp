/// <reference types="nativewind/types" />
import { ViewProps, TextProps, ImageProps, TouchableOpacityProps, TextInputProps, ScrollViewProps, KeyboardAvoidingViewProps } from 'react-native';

declare module 'react-native' {
    interface ViewProps {
        className?: string;
    }
    interface TextProps {
        className?: string;
    }
    interface ImageProps {
        className?: string;
    }
    interface TouchableOpacityProps {
        className?: string;
    }
    interface TextInputProps {
        className?: string;
    }
    interface ScrollViewProps {
        className?: string;
    }
    interface KeyboardAvoidingViewProps {
        className?: string;
    }
}
