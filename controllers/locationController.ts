import { pool } from '../db.js';

const getLocations = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM locations');
    res.json(rows);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

const createLocation = async (req, res) => {
  const { name, address, coordinates, radius, country, branch } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO locations (name, address, coordinates, radius, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address, coordinates, radius, country, branch]
    );
    res.status(201).json(rows[0]);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, address, coordinates, radius, country, branch } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE locations SET name = $1, address = $2, coordinates = $3, radius = $4, country = $5, branch = $6 WHERE id = $7 RETURNING *',
      [name, address, coordinates, radius, country, branch, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.json(rows[0]);
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM locations WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

export {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
};
