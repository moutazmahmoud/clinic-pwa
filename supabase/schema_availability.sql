-- ==========================================
-- 5. Availability Management
-- ==========================================

-- Add slot_duration to clinics
ALTER TABLE clinics ADD COLUMN slot_duration_minutes integer DEFAULT 30;

-- 5.1 Clinic Schedules (Weekly recurring availability)
CREATE TABLE clinic_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(clinic_id, day_of_week)
);

-- 5.2 Unavailable Slots (Specific blocked times)
CREATE TABLE unavailable_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clinic_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE unavailable_slots ENABLE ROW LEVEL SECURITY;

-- Policies for clinic_schedules
CREATE POLICY "Public can view active schedules" ON clinic_schedules
  FOR SELECT USING (true);

CREATE POLICY "Clinics can manage their own schedules" ON clinic_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM clinics 
      WHERE clinics.id = clinic_schedules.clinic_id 
      AND clinics.email = (select auth.jwt() ->> 'email')
    )
  );

-- Policies for unavailable_slots
CREATE POLICY "Public can view unavailable slots" ON unavailable_slots
  FOR SELECT USING (true);

CREATE POLICY "Clinics can manage their own unavailable slots" ON unavailable_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM clinics 
      WHERE clinics.id = unavailable_slots.clinic_id 
      AND clinics.email = (select auth.jwt() ->> 'email')
    )
  );
