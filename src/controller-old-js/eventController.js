import { pool } from '../db.js';

export const getEvents = async (req, res) => {
  const { startDate, endDate, country, branch } = req.query;
  try {
    let query = 'SELECT * FROM events WHERE 1=1';
    const values = [];
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
    res.status(500).json({ error: error.message });
  }
};

export const createEvent = async (req, res) => {
  const { name, start_time, end_time, date, country, branch } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO events (name, start_time, end_time, date, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, start_time, end_time, date, country, branch]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, start_time, end_time, date, country, branch } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE events SET name = $1, start_time = $2, end_time = $3, date = $4, country = $5, branch = $6 WHERE id = $7 RETURNING *',
      [name, start_time, end_time, date, country, branch, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM events WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkCreateEvents = async (req, res) => {
  const events = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createdEvents = [];
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
    res.status(500).json({ error: error.message });
  }
};

