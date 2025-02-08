import { Request, Response } from "express";
import { pool } from "../db"; // Assuming you have a PostgreSQL connection pool setup

// Get all schedules
export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    // Fetch schedules from the database
    const result = await pool.query("SELECT * FROM attendance_schedules");

    // Check if there are no schedules
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No schedules found. Please add a schedule and try again.",
        data: [],
      });
    }

    // Return schedules
    res.json({
      success: true,
      message: "Schedules retrieved successfully.",
      data: result.rows,
    });
  } catch (error: unknown) {
    console.error("Error fetching schedules:", error);

    // Handle different error scenarios
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return res.status(500).json({
          success: false,
          message: "Database connection error. Please try again later.",
        });
      }
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while retrieving schedules. Please try again later.",
        error: error.message,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
};


export const getScheduleById = async (req: Request, res: Response) => {
  try {
    // Extract and validate ID
    const { id } = req.params;
    const scheduleId = Number(id);

    if (isNaN(scheduleId) || scheduleId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule ID. Please provide a valid numeric ID.",
      });
    }

    // Query the database for the schedule
    const result = await pool.query("SELECT * FROM attendance_schedules WHERE id = $1", [scheduleId]);

    // Handle schedule not found case
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No schedule found with ID ${scheduleId}. Please check the ID and try again.`,
        data: null,
      });
    }

    // Return success response
    res.json({
      success: true,
      message: "Schedule retrieved successfully.",
      data: result.rows[0],
    });

  } catch (error: unknown) {
    console.error("Error fetching schedule:", error);

    // Handle different error scenarios
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return res.status(500).json({
          success: false,
          message: "Database connection error. Please try again later.",
        });
      }
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while retrieving the schedule. Please try again later.",
        error: error.message,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
};

<<<<<<< HEAD

=======
// Create a new schedule
// Create a new schedule
// Create a new schedule
>>>>>>> 991add4149b96cadb9cda21bec2d18b0dc5ab25f
export const createSchedule = async (req: Request, res: Response) => {
  try {
    // Extract fields from request body
    const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;

<<<<<<< HEAD
    // Validate required fields
    if (!name || !branch || !start_time || !closing_time || !duration) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields. Please provide name, branch, start_time, closing_time, and duration.",
      });
    }

    // Ensure duration is a valid number
    if (typeof duration !== "number" || duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration. Duration must be a positive number.",
      });
    }

    // Ensure assigned_users and locations are arrays and convert them to JSON strings if needed
    const assignedUsersString = Array.isArray(assigned_users) ? JSON.stringify(assigned_users) : "[]";
    const locationsString = Array.isArray(locations) ? JSON.stringify(locations) : "[]";

    // Insert the schedule into the database
    const result = await pool.query(
      "INSERT INTO attendance_schedules (name, branch, start_time, closing_time, assigned_users, locations, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, branch, start_time, closing_time, assignedUsersString, locationsString, duration]
    );

    // Return success response
    res.status(201).json({
      success: true,
      message: "Schedule created successfully.",
      data: result.rows[0],
    });

  } catch (error: unknown) {
=======
    // First, insert the schedule into attendance_schedules
    const result = await pool.query(
      "INSERT INTO attendance_schedules (name, branch, start_time, closing_time, locations, duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [name, branch, start_time, closing_time, locations, duration]
    );

    const scheduleId = result.rows[0].id;

    // Now insert each assigned user into the attendance_schedule_participants table
    if (Array.isArray(assigned_users)) {
      for (const userId of assigned_users) {
        // Ensure userId is a number
        if (typeof userId !== "number") {
          return res.status(400).json({ message: "Each user ID must be a number" });
        }

        // Insert each user into the attendance_schedule_participants table
        await pool.query(
          "INSERT INTO attendance_schedule_participants (schedule_id, user_id) VALUES ($1, $2)",
          [scheduleId, userId]
        );
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
>>>>>>> 991add4149b96cadb9cda21bec2d18b0dc5ab25f
    console.error("Error creating schedule:", error);

    // Handle database errors
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return res.status(500).json({
          success: false,
          message: "Database connection error. Please try again later.",
        });
      }
      if (error.message.includes("violates unique constraint")) {
        return res.status(400).json({
          success: false,
          message: "A schedule with the same name already exists. Please choose a different name.",
        });
      }
      if (error.message.includes("foreign key constraint")) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch or location ID. Please check your input and try again.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while creating the schedule. Please try again later.",
        error: error.message,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
};


<<<<<<< HEAD
=======

// Update schedule
>>>>>>> 991add4149b96cadb9cda21bec2d18b0dc5ab25f
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    // Extract and validate ID
    const { id } = req.params;
    const scheduleId = Number(id);

    if (isNaN(scheduleId) || scheduleId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule ID. Please provide a valid numeric ID.",
      });
    }

    // Extract fields from request body
    const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;

    // Ensure at least one field is provided for update
    if (!name && !branch && !start_time && !closing_time && !assigned_users && !locations && duration === undefined) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update. Please send at least one field to update.",
      });
    }

    // Ensure duration is a valid number if provided
    if (duration !== undefined && (typeof duration !== "number" || duration <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration. Duration must be a positive number.",
      });
    }

    // Convert assigned_users and locations to JSON strings if they are arrays
    const assignedUsersString = Array.isArray(assigned_users) ? JSON.stringify(assigned_users) : "[]";
    const locationsString = Array.isArray(locations) ? JSON.stringify(locations) : "[]";

    // Update the schedule in the database
    const result = await pool.query(
      "UPDATE attendance_schedules SET name = $1, branch = $2, start_time = $3, closing_time = $4, assigned_users = $5, locations = $6, duration = $7 WHERE id = $8 RETURNING *",
      [name, branch, start_time, closing_time, assignedUsersString, locationsString, duration, scheduleId]
    );

    // Handle schedule not found case
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No schedule found with ID ${scheduleId}. Please check the ID and try again.`,
        data: null,
      });
    }

    // Return success response
    res.json({
      success: true,
      message: "Schedule updated successfully.",
      data: result.rows[0],
    });

  } catch (error: unknown) {
    console.error("Error updating schedule:", error);

    // Handle database errors
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return res.status(500).json({
          success: false,
          message: "Database connection error. Please try again later.",
        });
      }
      if (error.message.includes("violates unique constraint")) {
        return res.status(400).json({
          success: false,
          message: "A schedule with the same name already exists. Please choose a different name.",
        });
      }
      if (error.message.includes("foreign key constraint")) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch or location ID. Please check your input and try again.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while updating the schedule. Please try again later.",
        error: error.message,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
};

// Delete schedule
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    // Extract and validate ID
    const { id } = req.params;
    const scheduleId = Number(id);

    if (isNaN(scheduleId) || scheduleId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule ID. Please provide a valid numeric ID.",
      });
    }

    // Attempt to delete the schedule
    const result = await pool.query("DELETE FROM attendance_schedules WHERE id = $1 RETURNING *", [scheduleId]);

    // Handle case where schedule doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No schedule found with ID ${scheduleId}. Please check the ID and try again.`,
        data: null,
      });
    }

    // Return success response
    res.json({
      success: true,
      message: "Schedule deleted successfully.",
      deletedItem: result.rows[0],
    });

  } catch (error: unknown) {
    console.error("Error deleting schedule:", error);

    // Handle database errors
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return res.status(500).json({
          success: false,
          message: "Database connection error. Please try again later.",
        });
      }
      if (error.message.includes("foreign key constraint")) {
        return res.status(400).json({
          success: false,
          message: "This schedule is referenced in another table and cannot be deleted. Please remove related records first.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while deleting the schedule. Please try again later.",
        error: error.message,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "An unknown error occurred.",
    });
  }
};

