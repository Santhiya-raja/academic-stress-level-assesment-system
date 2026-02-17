-- ============================================
-- Academic Stress Level Assessment System
-- PostgreSQL Schema
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 50),
  category VARCHAR(20) NOT NULL CHECK (category IN ('Low', 'Moderate', 'High')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Responses table (individual question answers)
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer INTEGER NOT NULL CHECK (answer >= 1 AND answer <= 5)
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- User-department mapping
CREATE TABLE IF NOT EXISTS user_departments (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, department_id)
);

-- Stressors table (user-specific stress-causing items)
CREATE TABLE IF NOT EXISTS stressors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table (high-risk stress alerts)
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stress_score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table (help resources)
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  action_type VARCHAR(10) DEFAULT 'text' CHECK (action_type IN ('link', 'text'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_responses_assessment_id ON responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_stressors_user_id ON stressors(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_departments_user_id ON user_departments(user_id);

-- Seed default departments
INSERT INTO departments (name) VALUES
  ('Engineering'),
  ('Business'),
  ('Arts'),
  ('Science')
ON CONFLICT (name) DO NOTHING;

-- Seed default help resources
INSERT INTO resources (title, description, category, action_type) VALUES
  ('Pomodoro Technique', 'Work in focused 25-minute intervals with 5-minute breaks. After four intervals, take a longer 15–30 minute break. This helps reduce mental fatigue and maintain productivity.', 'Time Management', 'text'),
  ('Eisenhower Matrix', 'Prioritize tasks by urgency and importance. Divide them into four quadrants: do first, schedule, delegate, and eliminate. Focus your energy on what truly matters.', 'Time Management', 'text'),
  ('Weekly Planning', 'Spend 30 minutes each Sunday planning your week. List all assignments, exams, and commitments. Allocate time blocks for each — preparation prevents last-minute stress.', 'Time Management', 'text'),
  ('Guided Breathing Exercise', 'Practice 4-7-8 breathing: inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 cycles. This activates your parasympathetic nervous system and calms anxiety.', 'Meditation', 'text'),
  ('Body Scan Meditation', 'Lie down comfortably, close your eyes. Slowly focus attention on each part of your body from toes to head. Notice tension and consciously release it. Takes 10–15 minutes.', 'Meditation', 'text'),
  ('Mindfulness Journaling', 'Spend 5 minutes writing about your current feelings without judgment. Acknowledge stressors and note three things you are grateful for. Builds emotional resilience over time.', 'Meditation', 'text'),
  ('Campus Counseling Center', 'Most universities offer free counseling sessions. Reach out to your campus mental health center — trained professionals can help you develop coping strategies for academic stress.', 'Counseling', 'text'),
  ('Peer Support Groups', 'Join or form a peer support group with classmates. Sharing experiences and study strategies reduces feelings of isolation and creates a mutual accountability system.', 'Counseling', 'text'),
  ('Online Therapy Platforms', 'Platforms like BetterHelp and 7Cups offer affordable online therapy. If campus resources are limited, these services connect you with licensed therapists from anywhere.', 'Counseling', 'link')
ON CONFLICT DO NOTHING;
