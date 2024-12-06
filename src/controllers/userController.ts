import { Request, Response } from 'express';
import { pool } from '../db';

const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { country, branch, category, group, subgroup, search } = req.query;
  try {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values: (string | undefined)[] = [];
    let valueIndex = 1;

    if (country) {
      query += ` AND country = $${valueIndex++}`;
      values.push(country as string);
    }
    if (branch) {
      query += ` AND branch = $${valueIndex++}`;
      values.push(branch as string);
    }
    if (category) {
      query += ` AND category = $${valueIndex++}`;
      values.push(category as string);
    }
    if (group) {
      query += ` AND group_name = $${valueIndex++}`;
      values.push(group as string);
    }
    if (subgroup) {
      query += ` AND subgroup = $${valueIndex++}`;
      values.push(subgroup as string);
    }
    if (search) {
      query += ` AND (name ILIKE $${valueIndex} OR id::text ILIKE $${valueIndex++})`;
      values.push(`%${search}%`);
    }

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, role, country, branch, category, group_name, subgroup } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, role, country, branch, category, group_name, subgroup) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, email, role, country, branch, category, group_name, subgroup]
    );
    res.status(201).json(rows[0]);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
      [name, email, role, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

const bulkCreateUsers = async (req: Request, res: Response): Promise<void> => {
  const users: { name: string; email: string; role: string }[] = req.body;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const createdUsers: { name: string; email: string; role: string }[] = [];
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
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  bulkCreateUsers
};
