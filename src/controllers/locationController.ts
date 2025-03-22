import { Request, Response } from 'express';
import { dataSource } from '../db';

interface Location {
  id: number;
  name: string;
  address: string;
  coordinates: string;
  radius: number;
  country: string;
  branch: string;
}

// GET /locations
export const getLocations = async (req: Request, res: Response) => {
  try {
    const rows: Location[] = await dataSource.query('SELECT * FROM attendance_locations');
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// POST /locations
export const createLocation = async (req: Request, res: Response) => {
  const { name, address, coordinates, radius, country, branch } = req.body;
  try {
    const rows: Location[] = await dataSource.query(
      'INSERT INTO attendance_locations (name, address, coordinates, radius, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address, coordinates, radius, country, branch]
    );
    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// PUT /locations/:id
export const updateLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, coordinates, radius, country, branch } = req.body;
  try {
    const rows: Location[] = await dataSource.query(
      'UPDATE attendance_locations SET name = $1, address = $2, coordinates = $3, radius = $4, country = $5, branch = $6 WHERE id = $7 RETURNING *',
      [name, address, coordinates, radius, country, branch, id]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        data: rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// DELETE /locations/:id
export const deleteLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // For delete, if using PostgreSQL with RETURNING, you can do:
    const rows = await dataSource.query(
      'DELETE FROM attendance_locations WHERE id = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    } else {
      res.status(204).send();
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
