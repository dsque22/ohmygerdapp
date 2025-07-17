-- Enable RLS (Row Level Security) for all tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 120),
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    gerd_duration VARCHAR(50) CHECK (gerd_duration IN ('less_than_1_year', '1_to_5_years', '5_to_10_years', 'more_than_10_years')),
    worst_symptoms TEXT[] DEFAULT '{}',
    liao_customer_status VARCHAR(50) CHECK (liao_customer_status IN ('current_customer', 'past_customer', 'interested', 'not_interested')),
    known_triggers TEXT[] DEFAULT '{}',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily entries table
CREATE TABLE IF NOT EXISTS daily_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    discomfort_level INTEGER CHECK (discomfort_level >= 1 AND discomfort_level <= 10),
    heartburn_intensity INTEGER CHECK (heartburn_intensity >= 1 AND heartburn_intensity <= 10),
    sleep_disruption INTEGER CHECK (sleep_disruption >= 1 AND sleep_disruption <= 10),
    symptoms TEXT[] DEFAULT '{}',
    morning_dose BOOLEAN DEFAULT false,
    evening_dose BOOLEAN DEFAULT false,
    trigger_foods TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, entry_date)
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_preferences JSONB DEFAULT '{
        "daily_reminder": true,
        "weekly_summary": true,
        "push_notifications": true
    }',
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    dashboard_preferences JSONB DEFAULT '{
        "preferred_charts": ["discomfort", "heartburn", "sleep"],
        "default_time_range": "7_days"
    }',
    privacy_settings JSONB DEFAULT '{
        "data_sharing": false,
        "analytics_tracking": true
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can insert their own user" ON users;
CREATE POLICY "Users can insert their own user" ON users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Function to check if the current user is an admin (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT is_admin FROM public.users WHERE id = auth.uid();
$$
LANGUAGE sql SECURITY DEFINER;

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (is_admin_user());

-- RLS Policies for daily_entries table
DROP POLICY IF EXISTS "Users can view their own entries" ON daily_entries;
CREATE POLICY "Users can view their own entries" ON daily_entries
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own entries" ON daily_entries;
CREATE POLICY "Users can insert their own entries" ON daily_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own entries" ON daily_entries;
CREATE POLICY "Users can update their own entries" ON daily_entries
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own entries" ON daily_entries;
CREATE POLICY "Users can delete their own entries" ON daily_entries
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all entries" ON daily_entries;
CREATE POLICY "Admins can view all entries" ON daily_entries
    FOR SELECT USING (is_admin_user());

-- RLS Policies for user_settings table
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own settings" ON user_settings;
CREATE POLICY "Users can delete their own settings" ON user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- Functions to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_entries_updated_at ON daily_entries;
CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON daily_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- First, drop the trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Now, drop and re-create the function
DROP FUNCTION IF EXISTS public.create_user_profile();
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
    _first_name VARCHAR(100);
    _last_name VARCHAR(100);
    _full_name TEXT;
BEGIN
    _full_name := NEW.raw_user_meta_data->>'full_name';

    IF _full_name IS NOT NULL THEN
        -- Attempt to split full_name into first_name and last_name
        _first_name := SPLIT_PART(_full_name, ' ', 1);
        _last_name := SUBSTRING(_full_name FROM LENGTH(_first_name) + 2);
    ELSE
        _first_name := NEW.raw_user_meta_data->>'first_name';
        _last_name := NEW.raw_user_meta_data->>'last_name';
    END IF;

    INSERT INTO public.users (id, email, first_name, last_name, age, gender, gerd_duration, worst_symptoms, liao_customer_status, known_triggers)
    VALUES (
        NEW.id,
        NEW.email,
        _first_name,
        _last_name,
        (NEW.raw_user_meta_data->>'age')::INTEGER, -- Will be NULL if not provided
        NEW.raw_user_meta_data->>'gender', -- Will be NULL if not provided
        NEW.raw_user_meta_data->>'gerd_duration', -- Will be NULL if not provided
        COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'worst_symptoms')), '{}'::TEXT[]), -- Will be empty array if not provided
        NEW.raw_user_meta_data->>'liao_customer_status', -- Will be NULL if not provided
        COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'known_triggers')), '{}'::TEXT[]) -- Will be empty array if not provided
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Finally, re-create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON daily_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_entry_date ON daily_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON daily_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Common symptoms and trigger foods for the application
-- Create symptoms table
CREATE TABLE IF NOT EXISTS public.symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger_foods table
CREATE TABLE IF NOT EXISTS public.trigger_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trigger_foods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for symptoms table
DROP POLICY IF EXISTS "Users can view symptoms" ON public.symptoms;
CREATE POLICY "Users can view symptoms" ON public.symptoms FOR SELECT USING (true);

-- RLS Policies for trigger_foods table
DROP POLICY IF EXISTS "Users can view trigger foods" ON public.trigger_foods;
CREATE POLICY "Users can view trigger foods" ON public.trigger_foods FOR SELECT USING (true);

-- Insert symptoms
INSERT INTO public.symptoms (name) VALUES 
    ('heartburn'),
    ('regurgitation'),
    ('chest_pain'),
    ('difficulty_swallowing'),
    ('chronic_cough'),
    ('hoarse_voice'),
    ('bloating'),
    ('nausea')
ON CONFLICT DO NOTHING;

-- Insert trigger foods
INSERT INTO public.trigger_foods (name, category) VALUES 
    ('spicy_foods', 'spices'),
    ('citrus_fruits', 'fruits'),
    ('tomatoes', 'vegetables'),
    ('chocolate', 'sweets'),
    ('coffee', 'beverages'),
    ('alcohol', 'beverages'),
    ('fatty_foods', 'fats'),
    ('fried_foods', 'fats'),
    ('garlic', 'spices'),
    ('onions', 'vegetables'),
    ('peppermint', 'herbs'),
    ('carbonated_drinks', 'beverages')
ON CONFLICT DO NOTHING;

-- Function to delete a user account and all associated data
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void AS $$
BEGIN
  -- This will cascade and delete all related data in other tables
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;