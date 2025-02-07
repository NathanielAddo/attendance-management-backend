import { Request, Response } from "express";
import { pool } from "../db"; // Assuming you have a PostgreSQL connection pool setup

// Get all schedules
export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM attendance_schedules");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get schedule by ID
export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM attendance_schedules WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new schedule
// Create a new schedule
// Create a new schedule
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;

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
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Update schedule
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;
    const result = await pool.query(
      "UPDATE attendance_schedules SET name = $1, branch = $2, start_time = $3, closing_time = $4, assigned_users = $5, locations = $6, duration = $7 WHERE id = $8 RETURNING *",
      [name, branch, start_time, closing_time, assigned_users, locations, duration, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete schedule
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM attendance_schedules WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
