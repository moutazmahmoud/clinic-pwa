export interface Clinic {
    id: string;
    name: string;
    specialty: string;
    area: string;
    phone: string;
    working_hours: string; // Database column is working_hours
    is_active: boolean;    // Database column is is_active
    email: string;
}

export interface Appointment {
    id: string;
    clinic_id: string;     // Database column is clinic_id
    date: string;
    time: string;
    patient_name: string;  // Database column is patient_name
    patient_phone: string; // Database column is patient_phone
    status: 'pending' | 'confirmed' | 'completed' | 'no-show';
    created_at: string;
}
