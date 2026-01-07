-- Create Clinics Table
CREATE TABLE clinics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  specialty text NOT NULL,
  area text NOT NULL,
  phone text NOT NULL,
  working_hours text NOT NULL,
  is_active boolean DEFAULT true,
  email text UNIQUE NOT NULL, -- To link with auth.users if needed, or just contact
  created_at timestamptz DEFAULT now()
);

-- Create Appointments Table
CREATE TABLE appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  patient_name text NOT NULL,
  patient_phone text NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'completed', 'no-show')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies (Simple for MVP)
-- Public read access to active clinics
CREATE POLICY "Public clinics are viewable by everyone" ON clinics
  FOR SELECT USING (is_active = true);

CREATE POLICY "Clinics can view their own profile" ON clinics
  FOR SELECT USING ((select auth.jwt() ->> 'email') = email);

-- Public can insert appointments (booking)
-- For now, let's just enable access for authenticated users to everything for Admin dashboard simplicity? 
-- No, that's insecure.

-- Clinics can view their own appointments (Assuming auth.uid() links to clinic email somehow, 
-- or we need a profile table properly linked. For MVP, if we use Supabase Auth, 
-- we typically link a 'profiles' table or just trust the email match if we keep it simple.
-- Ideally: clinic_id should be linked to the auth user.
-- For this MVP rule "Keep everything simple", let's assume we will implement proper RLS later 
-- or allow clinics to query by their ID if authenticated.)


-- Create Patients Table
CREATE TABLE patients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL, -- To link with auth.users
  created_at timestamptz DEFAULT now()
);

-- Public read access to own patient profile (for now just public insert to allow registration)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own patient profile" ON patients
  FOR SELECT USING ((select auth.jwt() ->> 'email') = email);

CREATE POLICY "Public can register as patient" ON patients
  FOR INSERT WITH CHECK (true);
