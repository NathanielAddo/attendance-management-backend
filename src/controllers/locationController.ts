import { Request, Response } from 'express';
import { pool } from '../db';

// // Define the interface for a location
// interface Location {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
// }

interface Location {
  id: number;
  name: string;
  address: string;
  coordinates: string; // Assuming coordinates are stored as a string (e.g., JSON or a lat/long string)
  radius: number;
  country: string;
  branch: string;
}

const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows }: { rows: Location[] } = await pool.query('SELECT * FROM attendance_locations');

    res.json({
      success: true,
      data: rows,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};


const createLocation = async (req: Request, res: Response): Promise<void> => {
  const { name, address, coordinates, radius, country, branch } = req.body as {
    name: string;
    address: string;
    coordinates: string;
    radius: number;
    country: string;
    branch: string;
  };

  try {
    const { rows }: { rows: Location[] } = await pool.query(
      'INSERT INTO attendance_locations (name, address, coordinates, radius, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, address, coordinates, radius, country, branch]
    );

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: rows[0],
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};


const updateLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const { name, address, coordinates, radius, country, branch } = req.body as {
    name: string;
    address: string;
    coordinates: string;
    radius: number;
    country: string;
    branch: string;
  };

  try {
    const { rows }: { rows: Location[] } = await pool.query(
      `
      UPDATE attendance_locations 
      SET name = $1, address = $2, coordinates = $3, radius = $4, country = $5, branch = $6 
      WHERE id = $7 
      RETURNING *
      `,
      [name, address, coordinates, radius, country, branch, id]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Location not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: rows[0],
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};


// Function to delete a location
const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };

  try {
    const result = await pool.query('DELETE FROM attendance_locations WHERE id = $1', [id]);
    const rowCount: number = result.rowCount ?? 0; // Safely handle null

    if (rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Location not found',
      });
      return;
    }

    res.status(204).send();
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};

export {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation
};
