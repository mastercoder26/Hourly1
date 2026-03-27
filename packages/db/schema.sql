-- Hourly Phase 2 reference DDL (PostgreSQL)

CREATE TYPE user_role AS ENUM ('STUDENT', 'ORGANIZER');
CREATE TYPE org_member_role AS ENUM ('COORDINATOR', 'EVENT_MANAGER', 'VIEWER');
CREATE TYPE application_status AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'WAITLISTED');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'DISPUTED');
CREATE TYPE certificate_type AS ENUM ('SHIFT', 'MILESTONE');
CREATE TYPE notification_type AS ENUM (
  'APPLICATION_UPDATE',
  'SHIFT_REMINDER',
  'HOURS_VERIFIED',
  'NEW_RECOMMENDATION',
  'BADGE_UNLOCKED',
  'MESSAGE_RECEIVED'
);
CREATE TYPE notification_channel AS ENUM ('IN_APP', 'PUSH', 'EMAIL');
CREATE TYPE notification_status AS ENUM ('QUEUED', 'SENT', 'FAILED', 'READ');

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL,
  date_of_birth TIMESTAMPTZ,
  is_minor BOOLEAN NOT NULL DEFAULT FALSE,
  parent_email TEXT,
  profile_image_url TEXT,
  push_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE school_lookup (
  id TEXT PRIMARY KEY,
  nces_id TEXT UNIQUE,
  name TEXT NOT NULL,
  district_name TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE student_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  school_id TEXT REFERENCES school_lookup(id) ON DELETE SET NULL,
  school_name TEXT,
  grade INTEGER,
  zip_code TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  availability_days TEXT[] NOT NULL DEFAULT '{}',
  shift_length_preference INTEGER,
  bio TEXT,
  total_verified_hours NUMERIC(8,2) NOT NULL DEFAULT 0,
  public_slug TEXT UNIQUE,
  is_public_portfolio BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE org_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  org_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  ein TEXT UNIQUE,
  mission TEXT,
  logo_url TEXT,
  website_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  cause_tags TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_requested_at TIMESTAMPTZ,
  verification_approved_at TIMESTAMPTZ,
  verification_rejected_at TIMESTAMPTZ,
  verification_reject_reason TEXT,
  trust_badge BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE org_members (
  id TEXT PRIMARY KEY,
  org_profile_id TEXT NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_role org_member_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_profile_id, user_id)
);

CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  org_profile_id TEXT NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cause_tags TEXT[] NOT NULL DEFAULT '{}',
  date TIMESTAMPTZ NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_hours NUMERIC(5,2) NOT NULL,
  lat NUMERIC(9,6) NOT NULL,
  lng NUMERIC(9,6) NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  total_spots INTEGER NOT NULL,
  filled_spots INTEGER NOT NULL DEFAULT 0,
  age_minimum INTEGER,
  credit_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  what_to_bring TEXT[] NOT NULL DEFAULT '{}',
  recurring BOOLEAN NOT NULL DEFAULT FALSE,
  recurring_rule TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'PENDING',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at TIMESTAMPTZ,
  decision_note TEXT,
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, opportunity_id)
);

CREATE TABLE attendance_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  application_id TEXT UNIQUE REFERENCES applications(id) ON DELETE SET NULL,
  checkin_time TIMESTAMPTZ,
  checkout_time TIMESTAMPTZ,
  hours_logged NUMERIC(6,2) NOT NULL DEFAULT 0,
  verification_status verification_status NOT NULL DEFAULT 'PENDING',
  verified_by_org_id TEXT,
  verification_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews_student_to_org (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_profile_id TEXT NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE,
  opportunity_id TEXT REFERENCES opportunities(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews_org_to_student (
  id TEXT PRIMARY KEY,
  org_profile_id TEXT NOT NULL REFERENCES org_profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id TEXT REFERENCES opportunities(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  threshold INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE badge_unlocks (
  id TEXT PRIMARY KEY,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(badge_id, user_id)
);

CREATE TABLE certificates (
  id TEXT PRIMARY KEY,
  student_profile_id TEXT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  attendance_record_id TEXT REFERENCES attendance_records(id) ON DELETE SET NULL,
  badge_id TEXT REFERENCES badges(id) ON DELETE SET NULL,
  certificate_type certificate_type NOT NULL,
  title TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pdf_url TEXT,
  verification_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  channel notification_channel NOT NULL DEFAULT 'IN_APP',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  deep_link TEXT,
  status notification_status NOT NULL DEFAULT 'QUEUED',
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "_RecommendedOpportunities" (
  "A" TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  "B" TEXT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  PRIMARY KEY ("A", "B")
);

CREATE INDEX idx_school_lookup_zip_code ON school_lookup(zip_code);
CREATE INDEX idx_school_lookup_state_city ON school_lookup(state, city);

CREATE INDEX idx_student_profiles_interests_gin ON student_profiles USING GIN (interests);
CREATE INDEX idx_student_profiles_availability_days_gin ON student_profiles USING GIN (availability_days);
CREATE INDEX idx_org_profiles_cause_tags_gin ON org_profiles USING GIN (cause_tags);
CREATE INDEX idx_opportunities_cause_tags_gin ON opportunities USING GIN (cause_tags);
CREATE INDEX idx_opportunities_date ON opportunities(date);
CREATE INDEX idx_applications_opportunity_status ON applications(opportunity_id, status);
CREATE INDEX idx_attendance_student_status ON attendance_records(student_id, verification_status);
CREATE INDEX idx_attendance_opportunity ON attendance_records(opportunity_id);
CREATE INDEX idx_reviews_student_to_org_org_created ON reviews_student_to_org(org_profile_id, created_at);
CREATE INDEX idx_reviews_org_to_student_student_created ON reviews_org_to_student(student_id, created_at);
CREATE INDEX idx_badge_unlocks_user_unlocked ON badge_unlocks(user_id, unlocked_at);
CREATE INDEX idx_certificates_student_issued ON certificates(student_profile_id, issued_at);
CREATE INDEX idx_messages_app_sent ON messages(application_id, sent_at);
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
