-- Add onboarding-related fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_seen_version TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;