import { pool } from '../db.js';

export const getDeviceRequests = async (req, res) => {
  const { branch, status, search } = req.query;
  try {
    let query = 'SELECT dr.*, u.name, u.branch FROM device_requests dr JOIN users u ON dr.user_id = u.id WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    if (branch) {
      query += ` AND u.branch = $${valueIndex++}`;
      values.push(branch);
    }
    if (status) {
      query += ` AND dr.status = $${valueIndex++}`;
      values.push(status);
    }
    if (search) {
      query += ` AND (u.name ILIKE $${valueIndex} OR u.id::text ILIKE $${valueIndex})`;
      values.push(`%${search}%`);
    }

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDeviceRequest = async (req, res) => {
  const { user_id, device_info } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO device_requests (user_id, device_info, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, device_info, 'pending']
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDeviceRequest = async (req, res) => {
  const { id } = req.params;
  const { device_info, status } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE device_requests SET device_info = $1, status = $2 WHERE id = $3 RETURNING *',
      [device_info, status, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Device request not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDeviceRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM device_requests WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Device request not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkApproveDeviceRequests = async (req, res) => {
  const { ids } = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const id of ids) {
        await client.query(
          'UPDATE device_requests SET status = $1 WHERE id = $2',
          ['approved', id]
        );
      }
      await client.query('COMMIT');
      res.status(200).json({ message: 'Bulk approval successful' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkDeleteDeviceRequests = async (req, res) => {
  const { ids } = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const id of ids) {
        await client.query('DELETE FROM device_requests WHERE id = $1', [id]);
      }
      await client.query('COMMIT');
      res.status(200).json({ message: 'Bulk deletion successful' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

