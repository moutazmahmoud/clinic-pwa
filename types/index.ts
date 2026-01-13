export interface Clinic {
    id: string;
    name: string;
    specialty: string;
    area: string;
    phone: string;
    working_hours: string; // Database column is working_hours
    is_active: boolean;    // Database column is is_active
    email: string;
    bio?: string;
    image_url?: string;
    address?: string;
    slot_duration_minutes?: number;
}

export interface ClinicSchedule {
    id: string;
    clinic_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface UnavailableSlot {
    id: string;
    clinic_id: string;
    date: string;
    start_time: string;
    end_time: string;
    reason?: string;
}

export interface Appointment {
    id: string;
    clinic_id: string;     // Database column is clinic_id
    date: string;
    time: string;
    patient_name: string;  // Database column is patient_name
    patient_phone: string; // Database column is patient_phone
    patient_id?: string;   // Database column is patient_id
    status: 'pending' | 'confirmed' | 'completed' | 'no-show' | 'cancelled';
    created_at: string;
}

export interface Patient {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    created_at: string;
}
