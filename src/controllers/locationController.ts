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
  wifiId?: string;             // Optional field for WiFi verification
  bluetoothDeviceId?: string;  // Optional field for Bluetooth device pairing
}

// Dummy helper functions for notifications
const sendEmailNotification = async (subject: string, body: string) => {
  // Implement actual email sending logic here
  console.log("Sending email:", subject, body);
};

const sendSmsNotification = async (message: string) => {
  // Implement actual SMS sending logic here
  console.log("Sending SMS:", message);
};

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

// POST /locations - Create a single location
export const createLocation = async (req: Request, res: Response) => {
  const { name, address, coordinates, radius, country, branch, wifiId, bluetoothDeviceId, adminName } = req.body;
  try {
    const rows: Location[] = await dataSource.query(
      `INSERT INTO attendance_locations 
        (name, address, coordinates, radius, country, branch, wifi_id, bluetooth_device_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, address, coordinates, radius, country, branch, wifiId, bluetoothDeviceId]
    );

    // Send notifications on creation
    const admin = adminName || "Unknown Admin";
    const timestamp = new Date().toISOString();
    const emailSubject = "Location Update Alert";
    const emailBody = `A new location named ${rows[0].name} has just been created by ${admin} for attendance schedules on ${timestamp}. If this was not authorized, please review immediately.`;
    await sendEmailNotification(emailSubject, emailBody);
    await sendSmsNotification(`New location created: ${rows[0].name} by ${admin} on ${timestamp}`);

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

// PUT /locations/:id - Update an existing location
export const updateLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, coordinates, radius, country, branch, wifiId, bluetoothDeviceId, adminName } = req.body;
  try {
    const rows: Location[] = await dataSource.query(
      `UPDATE attendance_locations 
       SET name = $1, address = $2, coordinates = $3, radius = $4, country = $5, branch = $6, wifi_id = $7, bluetooth_device_id = $8 
       WHERE id = $9 RETURNING *`,
      [name, address, coordinates, radius, country, branch, wifiId, bluetoothDeviceId, id]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    } else {
      // Send notifications on update
      const admin = adminName || "Unknown Admin";
      const timestamp = new Date().toISOString();
      const emailSubject = "Security Alert";
      const emailBody = `The location ${rows[0].name} has been updated by ${admin} on ${timestamp}. If this was not authorized, please review immediately.`;
      await sendEmailNotification(emailSubject, emailBody);
      await sendSmsNotification(`Location updated: ${rows[0].name} by ${admin} on ${timestamp}`);

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

// DELETE /locations/:id - Delete a location
export const deleteLocation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Use RETURNING * to check if a location was deleted
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

// POST /locations/bulk - Bulk creation of locations
export const createBulkLocations = async (req: Request, res: Response) => {
  // Expecting an array of location objects under req.body.locations
  const locations: Partial<Location>[] = req.body.locations;
  try {
    const insertedLocations: Location[] = [];
    for (const loc of locations) {
      const { name, address, coordinates, radius, country, branch, wifiId, bluetoothDeviceId } = loc;
      const rows: Location[] = await dataSource.query(
        `INSERT INTO attendance_locations 
          (name, address, coordinates, radius, country, branch, wifi_id, bluetooth_device_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [name, address, coordinates, radius, country, branch, wifiId, bluetoothDeviceId]
      );
      insertedLocations.push(rows[0]);
    }
    res.status(201).json({
      success: true,
      message: 'Bulk locations created successfully',
      data: insertedLocations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET /locations/generate-coordinates - Dummy endpoint to simulate coordinate generation
export const generateCoordinates = async (req: Request, res: Response) => {
  // Dummy implementation: ideally, integrate with an AI service for real coordinate generation
  const generatedCoordinates = {
    latitude: 5.603716,
    longitude: -0.187988,
    accuracy: "High" // Accuracy levels could be "High", "Average", "Low", "Very Low"
  };
  res.status(200).json({
    success: true,
    data: generatedCoordinates,
  });
};
