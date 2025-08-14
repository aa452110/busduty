-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  school_code TEXT UNIQUE NOT NULL,
  school_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  expected_buses INTEGER DEFAULT 10,
  timezone TEXT DEFAULT 'America/Denver',
  busduty_pin TEXT NOT NULL,
  office_pin TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  verified_at INTEGER,
  settings JSON DEFAULT '{}'
);

-- Verification codes table for signup
CREATE TABLE IF NOT EXISTS verification_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL, -- 'signup' or 'login'
  used INTEGER DEFAULT 0,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Update arrivals table to include school_code foreign key
-- (Already has school_code column, just need to ensure it references schools)

-- Create indexes
CREATE INDEX idx_schools_code ON schools(school_code);
CREATE INDEX idx_schools_email ON schools(admin_email);
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_verification_codes_code ON verification_codes(code);

-- Insert the existing hardcoded school
INSERT INTO schools (
  school_code, 
  school_name, 
  admin_email, 
  expected_buses, 
  busduty_pin, 
  office_pin,
  verified_at
) VALUES (
  'mpjh11243',
  'Mueller Park Junior High',
  'admin@mpjh.edu',
  15,
  '1234',
  '5678',
  unixepoch()
) ON CONFLICT(school_code) DO NOTHING;