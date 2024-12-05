import { Request, Response } from 'express';
import { pool } from '../db.js';

interface Event {
  name: string;
  start_time: string;
  end_time: string;
  date: string;
  country: string;
  branch: string;
}

const getEvents = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate, country, branch } = req.query as {
    startDate?: string;
    endDate?: string;
    country?: string;
    branch?: string;
  };
  try {
    let query = 'SELECT * FROM events WHERE 1=1';
    const values: (string | undefined)[] = [];
    let valueIndex = 1;

    if (startDate && endDate) {
      query += ` AND date BETWEEN $${valueIndex++} AND $${valueIndex++}`;
      values.push(startDate, endDate);
    }
    if (country) {
      query += ` AND country = $${valueIndex++}`;
      values.push(country);
    }
    if (branch) {
      query += ` AND branch = $${valueIndex++}`;
      values.push(branch);
    }

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const createEvent = async (req: Request, res: Response): Promise<void> => {
  const { name, start_time, end_time, date, country, branch } = req.body as Event;
  try {
    const { rows } = await pool.query(
      'INSERT INTO events (name, start_time, end_time, date, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, start_time, end_time, date, country, branch]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, start_time, end_time, date, country, branch } = req.body as Event;
  try {
    const { rows } = await pool.query(
      'UPDATE events SET name = $1, start_time = $2, end_time = $3, date = $4, country = $5, branch = $6 WHERE id = $7 RETURNING *',
      [name, start_time, end_time, date, country, branch, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM events WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const bulkCreateEvents = async (req: Request, res: Response): Promise<void> => {
  const events = req.body as Event[];
  if (!Array.isArray(events)) {
    res.status(400).json({ error: 'Invalid input, expected an array of events' });
    return;
  }
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createdEvents: Event[] = [];
      for (const event of events) {
        const { rows } = await client.query(
          'INSERT INTO events (name, start_time, end_time, date, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [event.name, event.start_time, event.end_time, event.date, event.country, event.branch]
        );
        createdEvents.push(rows[0]);
      }
      await client.query('COMMIT');
      res.status(201).json(createdEvents);
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

export {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  bulkCreateEvents
};
