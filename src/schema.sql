-- Create Attendance Schedules Table
CREATE TABLE IF NOT EXISTS attendance_schedules (
  id SERIAL PRIMARY KEY, 
  attendance_schedule_name VARCHAR(255) NOT NULL,  
  schedule_category VARCHAR(50) CHECK (schedule_category IN ('Weekly/Monthly Roster')) NOT NULL,  
  schedule_span VARCHAR(50) NOT NULL,  
  clock_in_time TIME NOT NULL,  
  clock_out_time TIME NOT NULL,  
  late_time INTERVAL,  
  set_break BOOLEAN,  
  start_break_time TIME,  
  end_break_time TIME,  
  location_type VARCHAR(50) CHECK (location_type IN ('Known', 'Unknown')) NOT NULL,  
  known_locations VARCHAR(255)[],  
  recurring BOOLEAN NOT NULL,  
  recurring_days VARCHAR(50)[],  
  recurring_duration VARCHAR(50),  
  non_recurring_dates DATE[],  
  overtime_status BOOLEAN,  
  virtual_meeting VARCHAR(50),  
  monthly_clocking_occurrences INTEGER,  
  monthly_min_clocking_occurrences INTEGER,  
  countries VARCHAR(100)[],  
  branches VARCHAR(100)[],  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

-- Create Attendance Table with Coordinates
CREATE TABLE IF NOT EXISTS attendance_attendance (
  id SERIAL PRIMARY KEY,
  schedule_id INTEGER REFERENCES attendance_schedules(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clock_in_time TIME,
  clock_out_time TIME,
  status VARCHAR(20) CHECK (status IN ('On Time', 'Late', 'Early Departure', 'Absent', 'Time Off')),
  location VARCHAR(255) CHECK (location IN ('Known', 'Unknown')) NOT NULL,
  coordinates JSONB, 
  landmark VARCHAR(255),
  clocked_by VARCHAR(50),
  device_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Roster Table
CREATE TABLE IF NOT EXISTS attendance_roster (
  id SERIAL PRIMARY KEY,
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

-- Create Device Requests Table
CREATE TABLE IF NOT EXISTS attendance_device_requests (
  id SERIAL PRIMARY KEY,
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
  status VARCHAR(20)
);
