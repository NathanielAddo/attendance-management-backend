import { pool } from '../db.js';

export const getRoster = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM roster');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRoster = async (req, res) => {
  const { user_id, date, shift } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
      [user_id, date, shift]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoster = async (req, res) => {
  const { id } = req.params;
  const { user_id, date, shift } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE roster SET user_id = $1, date = $2, shift = $3 WHERE id = $4 RETURNING *',
      [user_id, date, shift, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Roster entry not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoster = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM roster WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Roster entry not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkCreateRoster = async (req, res) => {
  const rosterEntries = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createdEntries = [];
      for (const entry of rosterEntries) {
        const { rows } = await client.query(
          'INSERT INTO roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
          [entry.user_id, entry.date, entry.shift]
        );
        createdEntries.push(rows[0]);
      }
      await client.query('COMMIT');
      res.status(201).json(createdEntries);
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

export const getAssignedRosters = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT r.*, u.name as user_name FROM roster r JOIN users u ON r.user_id = u.id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportRoster = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT r.*, u.name as user_name FROM roster r JOIN users u ON r.user_id = u.id');
    // In a real-world scenario, you would format this data for export (e.g., CSV)
    res.json({ message: 'Roster exported successfully', data: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

