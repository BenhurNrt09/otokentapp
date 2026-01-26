export type VehicleStatus = 'active' | 'sold' | 'pending' | 'archived';
export type FuelType = 'benzin' | 'dizel' | 'hibrit' | 'elektrik';
export type GearType = 'manuel' | 'otomatik';
export type PartStatus = 'original' | 'painted' | 'changed' | 'local_painted';

export interface ExpertiseData {
    hood?: PartStatus;
    roof?: PartStatus;
    trunk?: PartStatus;
    frontBumper?: PartStatus;
    rearBumper?: PartStatus;
    frontRightFender?: PartStatus;
    frontLeftFender?: PartStatus;
    rearRightFender?: PartStatus;
    rearLeftFender?: PartStatus;
    frontRightDoor?: PartStatus;
    frontLeftDoor?: PartStatus;
    rearRightDoor?: PartStatus;
    rearLeftDoor?: PartStatus;
}

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    series: string | null;
    year: number;
    price: number;
    mileage: number;
    fuel_type: FuelType;
    gear_type: GearType;
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
    from_who: 'sahibinden_ilk' | 'sahibinden_ikinci' | 'galeriden' | 'yetkili_bayiden';
    description: string | null;
    images: string[];
    expertise_data: ExpertiseData;
    status: VehicleStatus;
    views_count: number;
    created_at: string;
    updated_at?: string;
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
