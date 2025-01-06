import { Request, Response } from 'express';
import { pool } from '../db';

const getRoster = async (_: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query('SELECT * FROM attendance_roster');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const createRoster = async (req: Request, res: Response): Promise<void> => {
  const { user_id, date, shift } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance_roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
      [user_id, date, shift]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const updateRoster = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { user_id, date, shift } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE attendance_roster SET user_id = $1, date = $2, shift = $3 WHERE id = $4 RETURNING *',
      [user_id, date, shift, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Roster entry not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const deleteRoster = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM attendance_roster WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ message: 'Roster entry not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const bulkCreateRoster = async (req: Request, res: Response): Promise<void> => {
  const rosterEntries: { user_id: number; date: string; shift: string }[] = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createdEntries: any[] = [];
      for (const entry of rosterEntries) {
        const { rows } = await client.query(
          'INSERT INTO attendance_roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
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
    res.status(500).json({ error: (error as Error).message });
  }
};

const getAssignedRosters = async (_: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query('SELECT r.*, u.name as user_name FROM attendance_roster r JOIN attendance_attendance_users u ON r.user_id = u.id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const exportRoster = async (_: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query('SELECT r.*, u.name as user_name FROM attendance_roster r JOIN attendance_attendance_users u ON r.user_id = u.id');
    // In a real-world scenario, you would format this data for export (e.g., CSV)
    res.json({ message: 'Roster exported successfully', data: rows });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export {
  getRoster,
  createRoster,
  updateRoster,
  deleteRoster,
  bulkCreateRoster,
  getAssignedRosters,
  exportRoster
};
