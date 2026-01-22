export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel_type: string;
    gear_type: string;
    description: string | null;
    images: string[];
    status: string;
    created_at: string;
}

export type RootStackParamList = {
    MainTabs: undefined;
    Home: undefined;
    Detail: { vehicle: Vehicle };
    Notifications: undefined;
    Settings: undefined;
    Login: undefined;
    Register: undefined;
    EditProfile: undefined;
    LoginSecurity: undefined;
    NotificationSettings: undefined;
    PrivacySecurity: undefined;
    HelpCenter: undefined;
    Terms: undefined;
    ChatDetail: { chat: any };
    PrivacyPolicy: undefined;
    CookiePolicy: undefined;
};
