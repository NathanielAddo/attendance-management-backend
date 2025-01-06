import { Request, Response } from 'express';

interface CustomRequest extends Request {
  user: {
    id: string;
  };
}
import { pool } from '../db.js';

const submitDeviceRequest = async (req: CustomRequest, res: Response): Promise<void> => {
  const { deviceInfo } = req.body;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance_device_requests (user_id, device_info, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, JSON.stringify(deviceInfo), 'pending']
    );
    res.status(201).json({
      message: 'Device approval request submitted successfully.',
      requestId: rows[0].id,
      status: rows[0].status,
      submittedAt: rows[0].created_at
    });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const getDeviceRequestStatus = async (req: CustomRequest, res: Response): Promise<void> => {
  const userId = req.user.id;
  const { requestId } = req.query;
  try {
    let query = 'SELECT * FROM attendance_device_requests WHERE user_id = $1';
    const values: (string | number)[] = [userId];
    if (requestId) {
      query += ' AND id = $2';
      values.push(Number(requestId));
    }
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }
    const requests = rows.map(row => {
      const deviceInfo = JSON.parse(row.device_info);
      return {
        requestId: row.id,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        status: row.status,
        submittedAt: row.created_at,
        approvedAt: row.approved_at,
        rejectedAt: row.rejected_at,
        reviewedBy: row.reviewed_by
      };
    });
    res.json(requests);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const cancelDeviceRequest = async (req: CustomRequest, res: Response): Promise<void> => {
  const { requestId } = req.params;
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'DELETE FROM attendance_device_requests WHERE id = $1 AND user_id = $2 AND status = $3 RETURNING *',
      [requestId, userId, 'pending']
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Request not found or cannot be canceled' });
      return;
    }
    res.json({ message: 'Device approval request canceled successfully.', requestId: rows[0].id });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  submitDeviceRequest,
  getDeviceRequestStatus,
  cancelDeviceRequest
};
