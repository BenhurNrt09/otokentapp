import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast from '../components/Toast';

interface ToastContextType {
    showSuccessToast: (message: string) => void;
    showErrorToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
        visible: false,
        message: '',
        type: 'success',
    });

    const showSuccessToast = (message: string) => {
        setToast({ visible: true, message, type: 'success' });
    };

    const showErrorToast = (message: string) => {
        setToast({ visible: true, message, type: 'error' });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    return (
        <ToastContext.Provider value={{ showSuccessToast, showErrorToast }}>
            {children}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
