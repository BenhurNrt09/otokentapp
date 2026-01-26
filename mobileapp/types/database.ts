// Database types generated from Supabase schema
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string | null;
                    surname: string | null;
                    phone: string | null;
                    avatar_url: string | null;
                    role: 'user' | 'admin' | 'moderator';
                    is_active: boolean;
                    deleted_at: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Tables['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Tables['users']['Insert']>;
            };
            vehicles: {
                Row: {
                    id: string;
                    user_id: string | null;
                    category_id: string | null;
                    title: string;
                    brand: string | null;
                    model: string | null;
                    year: number | null;
                    price: number | null;
                    mileage: number | null;
                    fuel_type: string | null;
                    transmission: string | null;
                    color: string | null;
                    description: string | null;
                    location: string | null;
                    status: 'active' | 'sold' | 'pending' | 'archived';
                    views_count: number;
                    is_featured: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Tables['vehicles']['Row'], 'id' | 'created_at' | 'updated_at' | 'views_count'>;
                Update: Partial<Tables['vehicles']['Insert']>;
            };
            vehicle_images: {
                Row: {
                    id: string;
                    vehicle_id: string;
                    image_url: string;
                    is_primary: boolean;
                    display_order: number;
                    created_at: string;
                };
                Insert: Omit<Tables['vehicle_images']['Row'], 'id' | 'created_at'>;
                Update: Partial<Tables['vehicle_images']['Insert']>;
            };
            messages: {
                Row: {
                    id: string;
                    sender_id: string;
                    receiver_id: string;
                    vehicle_id: string | null;
                    content: string;
                    is_read: boolean;
                    message_type: 'user' | 'support' | 'system';
                    created_at: string;
                };
                Insert: Omit<Tables['messages']['Row'], 'id' | 'created_at'>;
                Update: Partial<Tables['messages']['Insert']>;
            };
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    message: string;
                    type: 'message' | 'vehicle' | 'system' | 'promotion';
                    is_read: boolean;
                    action_url: string | null;
                    created_at: string;
                };
                Insert: Omit<Tables['notifications']['Row'], 'id' | 'created_at'>;
                Update: Partial<Tables['notifications']['Insert']>;
            };
            advertisements: {
                Row: {
                    id: string;
                    title: string | null;
                    image_url: string;
                    link_url: string | null;
                    display_order: number;
                    is_active: boolean;
                    start_date: string | null;
                    end_date: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Tables['advertisements']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Tables['advertisements']['Insert']>;
            };
            faqs: {
                Row: {
                    id: string;
                    question: string;
                    answer: string;
                    category: string | null;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Tables['faqs']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Tables['faqs']['Insert']>;
            };
            policies: {
                Row: {
                    id: string;
                    type: 'privacy' | 'terms' | 'cookie';
                    title: string;
                    content: string;
                    version: string | null;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Tables['policies']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Tables['policies']['Insert']>;
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    icon: string | null;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Tables['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Tables['categories']['Insert']>;
            };
        };
    };
};

type Tables = Database['public']['Tables'];
