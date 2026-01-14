-- ==========================================
-- FIX: ADD MISSING UPDATE POLICIES
-- ==========================================

-- Allow Clinics to update their own profile
CREATE POLICY "Clinics can update their own profile" ON clinics
  FOR UPDATE USING ((select auth.jwt() ->> 'email') = email);

-- Allow Patients to update their own profile
CREATE POLICY "Patients can update their own profile" ON patients
  FOR UPDATE USING ((select auth.jwt() ->> 'email') = email);
