import { pool } from '../db.js';

export const getUsers = async (req, res) => {
  const { country, branch, category, group, subgroup, search } = req.query;
  try {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values = [];
    let valueIndex = 1;

    if (country) {
      query += ` AND country = $${valueIndex++}`;
      values.push(country);
    }
    if (branch) {
      query += ` AND branch = $${valueIndex++}`;
      values.push(branch);
    }
    if (category) {
      query += ` AND category = $${valueIndex++}`;
      values.push(category);
    }
    if (group) {
      query += ` AND group_name = $${valueIndex++}`;
      values.push(group);
    }
    if (subgroup) {
      query += ` AND subgroup = $${valueIndex++}`;
      values.push(subgroup);
    }
    if (search) {
      query += ` AND (name ILIKE $${valueIndex} OR id::text ILIKE $${valueIndex})`;
      values.push(`%${search}%`);
    }

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, role, country, branch, category, group_name, subgroup } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, role, country, branch, category, group_name, subgroup) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, email, role, country, branch, category, group_name, subgroup]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
      [name, email, role, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkCreateUsers = async (req, res) => {
  const users = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createdUsers = [];
      for (const user of users) {
        const { rows } = await client.query(
          'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
          [user.name, user.email, user.role]
        );
        createdUsers.push(rows[0]);
      }
      await client.query('COMMIT');
      res.status(201).json(createdUsers);
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

