-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    district TEXT NOT NULL,
    upazila TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    blood_group TEXT,
    is_donor BOOLEAN DEFAULT true,
    is_doctor BOOLEAN DEFAULT false,
    doctor_speciality TEXT,
    chamber_address TEXT,
    visit_fee TEXT,
    is_ambulance BOOLEAN DEFAULT false,
    vehicle_type TEXT,
    vehicle_number TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    total_donations INTEGER DEFAULT 0,
    avg_rating DOUBLE PRECISION DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_blocked BOOLEAN DEFAULT false,
    block_reason TEXT,
    is_admin BOOLEAN DEFAULT false,
    is_super_admin BOOLEAN DEFAULT false,
    last_seen TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.users
    FOR INSERT WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile." ON public.users
    FOR UPDATE USING (auth.uid() = auth_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS users_blood_group_idx ON public.users (blood_group);
CREATE INDEX IF NOT EXISTS users_district_idx ON public.users (district);
CREATE INDEX IF NOT EXISTS users_is_doctor_idx ON public.users (is_doctor);
CREATE INDEX IF NOT EXISTS users_is_ambulance_idx ON public.users (is_ambulance);
CREATE INDEX IF NOT EXISTS users_is_active_idx ON public.users (is_active);

-- Set admin for specific phone number
UPDATE public.users 
SET is_admin = true, is_super_admin = true 
WHERE phone = '+8801303595062';

-- Set admin for specific email (if you know the email)
-- UPDATE public.users 
-- SET is_admin = true, is_super_admin = true 
-- WHERE auth_id IN (SELECT id FROM auth.users WHERE email = 'nishat.af27@gmail.com');
