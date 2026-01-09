-- ==========================================
-- CLINIC PWA - SUPABASE SCHEMA
-- ==========================================

-- 1. Create Clinics Table
CREATE TABLE clinics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  specialty text NOT NULL,
  area text NOT NULL,
  phone text NOT NULL,
  working_hours text NOT NULL,
  is_active boolean DEFAULT true,
  email text UNIQUE NOT NULL,
  bio text,
  image_url text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create Patients Table
CREATE TABLE patients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Create Appointments Table
CREATE TABLE appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  patient_name text NOT NULL,
  patient_phone text NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'completed', 'no-show', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLICIES FOR CLINICS
-- ==========================================

-- Public read access to active clinics
CREATE POLICY "Public clinics are viewable by everyone" ON clinics
  FOR SELECT USING (is_active = true);

-- Clinics can view their own profile
CREATE POLICY "Clinics can view their own profile" ON clinics
  FOR SELECT USING ((select auth.jwt() ->> 'email') = email);

-- Admin Management for Clinics
CREATE POLICY "Admin has full access to clinics" ON clinics
  FOR ALL USING ((select auth.jwt() ->> 'email') = 'moutaz.prof.egy@gmail.com');

-- Public can register as clinic
CREATE POLICY "Public can register as clinic" ON clinics
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- POLICIES FOR PATIENTS
-- ==========================================

-- Users can view their own patient profile
CREATE POLICY "Users can view their own patient profile" ON patients
  FOR SELECT USING ((select auth.jwt() ->> 'email') = email);

-- Public can register as patient
CREATE POLICY "Public can register as patient" ON patients
  FOR INSERT WITH CHECK (true);

-- Admin Management for Patients
CREATE POLICY "Admin has full access to patients" ON patients
  FOR ALL USING ((select auth.jwt() ->> 'email') = 'moutaz.prof.egy@gmail.com');

-- ==========================================
-- POLICIES FOR APPOINTMENTS
-- ==========================================

-- Public can book appointments (Insert)
CREATE POLICY "Public can book appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Clinics can view and manage their own appointments
CREATE POLICY "Clinics can manage their own appointments" ON appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM clinics 
      WHERE clinics.id = appointments.clinic_id 
      AND clinics.email = (select auth.jwt() ->> 'email')
    )
  );

-- Admin Management for Appointments
CREATE POLICY "Admin has full access to appointments" ON appointments
  FOR ALL USING ((select auth.jwt() ->> 'email') = 'moutaz.prof.egy@gmail.com');
