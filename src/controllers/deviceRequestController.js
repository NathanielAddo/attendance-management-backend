import { pool } from '../db.js';

export const submitDeviceRequest = async (req, res) => {
  const { deviceInfo } = req.body;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO device_requests (user_id, device_info, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, JSON.stringify(deviceInfo), 'pending']
    );
    res.status(201).json({ message: 'Device approval request submitted successfully.', requestId: rows[0].id, status: rows[0].status, submittedAt: rows[0].created_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeviceRequestStatus = async (req, res) => {
  const userId = req.user.id;
  const { requestId } = req.query;
  try {
    let query = 'SELECT * FROM device_requests WHERE user_id = $1';
    const values = [userId];
    if (requestId) {
      query += ' AND id = $2';
      values.push(requestId);
    }
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }
    const requests = rows.map(row => ({
      requestId: row.id,
      deviceId: JSON.parse(row.device_info).deviceId,
      deviceName: JSON.parse(row.device_info).deviceName,
      status: row.status,
      submittedAt: row.created_at,
      approvedAt: row.approved_at,
      rejectedAt: row.rejected_at,
      reviewedBy: row.reviewed_by
    }));
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelDeviceRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'DELETE FROM device_requests WHERE id = $1 AND user_id = $2 AND status = $3 RETURNING *',
      [requestId, userId, 'pending']
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Request not found or cannot be canceled' });
    }
    res.json({ message: 'Device approval request canceled successfully.', requestId: rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

