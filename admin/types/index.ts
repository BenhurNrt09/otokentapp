export type VehicleStatus = 'yayinda' | 'satildi' | 'pasif';
export type FuelType = 'benzin' | 'dizel' | 'hibrit' | 'elektrik';
export type GearType = 'manuel' | 'otomatik';

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel_type: FuelType;
    gear_type: GearType;
    description: string | null;
    images: string[];
    status: VehicleStatus;
    created_at: string;
    updated_at?: string;
}

export interface VehicleFormData {
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel_type: FuelType;
    gear_type: GearType;
    description: string;
    images: File[];
    status: VehicleStatus;
}

// User types
export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
    id: string;
    email: string;
    name: string | null;
    surname: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserFormData {
    email: string;
    name: string;
    surname: string;
    phone: string;
    role: UserRole;
    is_active: boolean;
}
