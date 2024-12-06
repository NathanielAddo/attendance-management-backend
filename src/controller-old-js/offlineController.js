import { pool } from '../db.js';

export const syncOfflineData = async (req, res) => {
  const { logs } = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const syncedLogs = [];
      const errors = [];

      for (const log of logs) {
        try {
          const { rows } = await client.query(
            'INSERT INTO attendance (user_id, schedule_id, clock_in_time, clock_out_time, location, device_info) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [log.userId, log.scheduleId, log.timestamp, log.action === 'clock-out' ? log.timestamp : null, JSON.stringify(log.location), JSON.stringify(log.deviceInfo)]
          );
          syncedLogs.push({ logId: log.logId, status: 'Synced' });
        } catch (error) {
          errors.push({ logId: log.logId, error: error.message });
        }
      }

      await client.query('COMMIT');
      res.json({ success: true, message: 'Offline logs synced successfully.', syncedLogs, errors });
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

export const getSyncStatus = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT MAX(synced_at) as last_synced_at FROM sync_logs');
    const pendingLogs = await pool.query('SELECT COUNT(*) as count FROM attendance WHERE synced = false');
    res.json({
      success: true,
      data: {
        lastSyncedAt: rows[0].last_synced_at,
        pendingLogs: pendingLogs.rows[0].count,
        lastError: null // Implement logic to fetch last error if needed
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

