-- Create the schedules table first (as it's referenced by attendance table)
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  branch VARCHAR(100),
  start_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  assigned_users INTEGER,
  locations VARCHAR(255),
  duration VARCHAR(100)
);


-- Create the schedule_participants table
CREATE TABLE IF NOT EXISTS schedule_participants (
  id SERIAL PRIMARY KEY,
  schedule_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  country VARCHAR(100),
  branch VARCHAR(100),
  category VARCHAR(100),
  group_name VARCHAR(100),
  subgroup VARCHAR(100),
  image_url VARCHAR(255),
  voice_status VARCHAR(20) DEFAULT 'Empty',
  image_status VARCHAR(20) DEFAULT 'Empty',
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  phone VARCHAR(20),
  last_login TIMESTAMP,  -- Optional: for tracking last login
  status VARCHAR(20) DEFAULT 'Active' -- Optional: to track user status (active/inactive)
);

-- Create the attendance table (now it can reference schedules)
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- Ensure attendance is deleted when user is deleted
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in_time TIME,  -- Changed here to clock_in_time instead of clock_in
  clock_out_time TIME,
  status VARCHAR(20) CHECK (status IN ('On Time', 'Late', 'Early Departure', 'Absent', 'Time Off')),
  location VARCHAR(255) CHECK (location IN ('Known', 'Unknown', 'known', 'unknown')) NOT NULL,
  coordinates VARCHAR(100),
  landmark VARCHAR(255),
  clocked_by VARCHAR(50),
  device_info VARCHAR(255),  -- Adding device_info column
  schedule_id INTEGER,  -- Adding schedule_id column
  CONSTRAINT fk_schedule_id FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL  -- Foreign key to schedules table with cascade option
);

-- Create the roster table
CREATE TABLE IF NOT EXISTS roster (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- Ensure roster is deleted when user is deleted
  date DATE NOT NULL,
  shift VARCHAR(50) NOT NULL
);

-- Create the events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE NOT NULL,
  country VARCHAR(100),
  branch VARCHAR(100)
);

-- Create the notification_templates table
CREATE TABLE IF NOT EXISTS notification_templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[]
);

-- Create the notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES notification_templates(id) ON DELETE CASCADE,  -- Ensure notifications are deleted when template is deleted
  medium VARCHAR(20) CHECK (medium IN ('SMS', 'Voice', 'Email', 'In-app')),
  alert_type VARCHAR(20) CHECK (alert_type IN ('Recurring', 'Non-recurring')),
  status VARCHAR(20) DEFAULT 'Active',
  start_date DATE,
  delivery_time TIME,
  additional_text TEXT,
  recurring_status VARCHAR(20),
  user_type VARCHAR(50)
);

-- Create the biometric_data table
CREATE TABLE IF NOT EXISTS biometric_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- Ensure biometric data is deleted when user is deleted
  voice_data BYTEA,
  image_data BYTEA
);

-- Create the device_requests table
CREATE TABLE IF NOT EXISTS device_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- Ensure device requests are deleted when user is deleted
  device_info VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'denied')),
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  coordinates VARCHAR(100),
  radius FLOAT,
  country VARCHAR(100),
  branch VARCHAR(100)
);

-- Create a second notification_templates table (for updating schema)
CREATE TABLE IF NOT EXISTS notification_templates_v2 (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  total_assigned_users INTEGER DEFAULT 0,
  last_notification_sent TIMESTAMP
);

-- Create a second notifications table (for updating schema)
CREATE TABLE IF NOT EXISTS notifications_v2 (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES notification_templates_v2(id) ON DELETE CASCADE,  -- Ensure notifications are deleted when template is deleted
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

-- Create the notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER REFERENCES notifications_v2(id) ON DELETE CASCADE,  -- Ensure logs are deleted when notifications are deleted
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_to INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20)
);
