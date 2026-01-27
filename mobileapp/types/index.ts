export interface Advertisement {
    id: string;
    title: string;
    image_url: string;
    link_url?: string;
    is_active: boolean;
    display_order: number;
}

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    series: string | null;
    year: number;
    price: number;
    mileage: number;
    fuel_type: string;
    gear_type: string;
    body_type: string | null;
    engine_capacity: string | null;
    engine_power: string | null;
    drive_type: string | null;
    color: string | null;
    warranty: boolean;
    heavy_damage_record: boolean;
    is_disabled_friendly: boolean;
    exchangeable: boolean;
    video_call_available: boolean;
    from_who: string;
    description: string | null;
    images: string[];
    expertise_data: any;
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
