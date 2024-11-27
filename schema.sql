CREATE TABLE users (
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
  phone VARCHAR(20)
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  clock_in TIME,
  clock_out TIME,
  status VARCHAR(20) CHECK (status IN ('On Time', 'Late', 'Early Departure', 'Absent', 'Time Off')),
  location VARCHAR(20) CHECK (location IN ('Known', 'Unknown')),
  coordinates VARCHAR(100),
  landmark VARCHAR(255),
  clocked_by VARCHAR(50)
);

CREATE TABLE roster (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  shift VARCHAR(50) NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  date DATE NOT NULL,
  country VARCHAR(100),
  branch VARCHAR(100)
);

CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  branch VARCHAR(100),
  start_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  assigned_users INTEGER,
  locations VARCHAR(255),
  duration VARCHAR(100)
);

CREATE TABLE notification_templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[]
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES notification_templates(id),
  medium VARCHAR(20) CHECK (medium IN ('SMS', 'Voice', 'Email', 'In-app')),
  alert_type VARCHAR(20) CHECK (alert_type IN ('Recurring', 'Non-recurring')),
  status VARCHAR(20) DEFAULT 'Active',
  start_date DATE,
  delivery_time TIME,
  additional_text TEXT,
  recurring_status VARCHAR(20),
  user_type VARCHAR(50)
);

CREATE TABLE biometric_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  voice_data BYTEA,
  image_data BYTEA
);

CREATE TABLE device_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  device_info VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'denied')),
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  coordinates VARCHAR(100),
  radius FLOAT,
  country VARCHAR(100),
  branch VARCHAR(100)
);

CREATE TABLE notification_templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  total_assigned_users INTEGER DEFAULT 0,
  last_notification_sent TIMESTAMP
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  template_id INTEGER REFERENCES notification_templates(id),
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

CREATE TABLE notification_logs (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER REFERENCES notifications(id),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_to INTEGER,
  status VARCHAR(20)
);