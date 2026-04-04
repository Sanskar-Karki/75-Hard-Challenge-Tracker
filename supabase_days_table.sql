-- 🛡️ Create the 'days' table for atomic 75-day tracking
-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.days (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 75),
    date DATE,
    tasks JSONB DEFAULT '[]'::jsonb,
    water_progress FLOAT DEFAULT 0.0,
    is_day_completed BOOLEAN DEFAULT false,
    weight FLOAT,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- 🛡️ Composite unique key for atomic daily updates per user
    UNIQUE(user_id, day_number)
);

-- 🛡️ Enable Row Level Security (RLS)
ALTER TABLE public.days ENABLE ROW LEVEL SECURITY;

-- 🛡️ Policy: Select Policy (Users can only read their own days)
CREATE POLICY "Users can only read their own days" 
ON public.days FOR SELECT 
USING ( (SELECT auth.uid()) = user_id );

-- 🛡️ Policy: All Access Policy (Users can manage their own days)
CREATE POLICY "Users can manage their own days" 
ON public.days FOR ALL
USING ( (SELECT auth.uid()) = user_id )
WITH CHECK ( (SELECT auth.uid()) = user_id );

-- 🛡️ Optional: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS days_user_id_idx ON public.days (user_id);
