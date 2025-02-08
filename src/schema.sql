-- Create Users Table
CREATE TABLE IF NOT EXISTS attendance_users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(20),
  role VARCHAR(50) CHECK (role IN ('Employee', 'Manager', 'Admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Schedules Table
CREATE TABLE IF NOT EXISTS attendance_schedules (
  id SERIAL PRIMARY KEY,
  schedule_name VARCHAR(255),
  start_time TIME,
  end_time TIME,
  shift_type VARCHAR(50) CHECK (shift_type IN ('Morning', 'Afternoon', 'Night')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Attendance Table with Coordinates
CREATE TABLE IF NOT EXISTS attendance_attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES attendance_users(id) ON DELETE CASCADE,
  schedule_id INTEGER REFERENCES attendance_schedules(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in_time TIME,
  clock_out_time TIME,
  status VARCHAR(20) CHECK (status IN ('On Time', 'Late', 'Early Departure', 'Absent', 'Time Off')),
  location VARCHAR(255) CHECK (location IN ('Known', 'Unknown')) NOT NULL,
  coordinates JSONB, -- New column for latitude and longitude (JSONB format)
  landmark VARCHAR(255),
  clocked_by VARCHAR(50),
  device_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Roster Table
CREATE TABLE IF NOT EXISTS attendance_roster (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES attendance_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift VARCHAR(50) NOT NULL
);

-- Create Events Table
CREATE TABLE IF NOT EXISTS attendance_events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE NOT NULL,
  country VARCHAR(100),
  branch VARCHAR(100)
);

-- Create Notification Templates Table
CREATE TABLE IF NOT EXISTS attendance_notification_templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[]
);

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS attendance_notifications (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES attendance_notification_templates(id) ON DELETE CASCADE,
  medium VARCHAR(20) CHECK (medium IN ('SMS', 'Voice', 'Email', 'In-app')),
  alert_type VARCHAR(20) CHECK (alert_type IN ('Recurring', 'Non-recurring')),
  status VARCHAR(20) DEFAULT 'Active',
  start_date DATE,
  delivery_time TIME,
  additional_text TEXT,
  recurring_status VARCHAR(20),
  user_type VARCHAR(50)
);

-- Create Biometric Data Table
CREATE TABLE IF NOT EXISTS attendance_biometric_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES attendance_users(id) ON DELETE CASCADE,
  voice_data BYTEA,
  image_data BYTEA
);

-- Create Device Requests Table
CREATE TABLE IF NOT EXISTS attendance_device_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES attendance_users(id) ON DELETE CASCADE,
  device_info VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'denied')),
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Locations Table
CREATE TABLE IF NOT EXISTS attendance_locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  coordinates VARCHAR(100),
  radius FLOAT,
  country VARCHAR(100),
  branch VARCHAR(100)
);

-- Create Notification Templates v2 (Updated Schema)
CREATE TABLE IF NOT EXISTS attendance_notification_templates_v2 (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  total_assigned_users INTEGER DEFAULT 0,
  last_notification_sent TIMESTAMP
);

-- Create Notifications v2 (Updated Schema)
CREATE TABLE IF NOT EXISTS attendance_notifications_v2 (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES attendance_notification_templates_v2(id) ON DELETE CASCADE,
  country VARCHAR(100),
  branch VARCHAR(100),
  category VARCHAR(100),
  group_name VARCHAR(100),
  subgroup VARCHAR(100),
  message_medium VARCHAR(20) CHECK (message_medium IN ('SMS', 'Voice Call', 'Email')),
  alert_user_type VARCHAR(50),
  alert_type VARCHAR(20) CHECK (alert_type IN ('Recurring', 'Non-Recurring')),
  recurring_status VARCHAR(20),
  starting_date DATE,
  delivery_time TIME,
  non_recurring_date DATE,
  additional_info TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Notification Logs Table
CREATE TABLE IF NOT EXISTS attendance_notification_logs (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER REFERENCES attendance_notifications_v2(id) ON DELETE CASCADE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_to INTEGER REFERENCES attendance_users(id) ON DELETE CASCADE,
  status VARCHAR(20)
);
