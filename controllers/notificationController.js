import { pool } from '../db.js';

export const getNotifications = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notifications');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req, res) => {
  const { template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO notifications (template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE notifications SET template_id = $1, medium = $2, alert_type = $3, status = $4, start_date = $5, delivery_time = $6, additional_text = $7, recurring_status = $8, user_type = $9 WHERE id = $10 RETURNING *',
      [template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendNotification = async (req, res) => {
  const { message, medium, userIds } = req.body;
  try {
    // This is a placeholder for actual notification sending logic
    // In a real-world scenario, you would integrate with SMS, email, or push notification services
    console.log(`Sending ${medium} notification to users:`, userIds);
    console.log('Message:', message);

    // Simulating notification sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

