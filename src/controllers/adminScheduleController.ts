// import express, { Request, Response } from "express";
// import { dataSource } from "../db";

// const app = express();
// app.use(express.json());

// // Helper function to send JSON responses
// const sendJson = (res: Response, statusCode: number, data: any) => {
//     res.status(statusCode).json(data);
// };

// // Get all schedules
// app.get("/schedules", async (req: Request, res: Response) => {
//     try {
//         const result = await dataSource.query("SELECT * FROM attendance_schedules");

//         if (result.rows.length === 0) {
//             return sendJson(res, 404, {
//                 success: false,
//                 message: "No schedules found. Please add a schedule and try again.",
//                 data: [],
//             });
//         }

//         sendJson(res, 200, {
//             success: true,
//             message: "Schedules retrieved successfully.",
//             data: result.rows,
//         });
//     } catch (error: unknown) {
//         console.error("Error fetching schedules:", error);

//         if (error instanceof Error) {
//             if (error.message.includes("ECONNREFUSED")) {
//                 return sendJson(res, 500, {
//                     success: false,
//                     message: "Database connection error. Please try again later.",
//                 });
//             }
//             return sendJson(res, 500, {
//                 success: false,
//                 message: "An unexpected error occurred while retrieving schedules. Please try again later.",
//                 error: error.message,
//             });
//         }

//         sendJson(res, 500, {
//             success: false,
//             message: "An unknown error occurred.",
//         });
//     }
// });

// // Get schedule by ID
// app.get("/schedules/:id", async (req: Request, res: Response) => {
//     try {
//         const scheduleId = Number(req.params.id);

//         if (isNaN(scheduleId) || scheduleId <= 0) {
//             return sendJson(res, 400, {
//                 success: false,
//                 message: "Invalid schedule ID. Please provide a valid numeric ID.",
//             });
//         }

//         const result = await dataSource.query("SELECT * FROM attendance_schedules WHERE id = $1", [scheduleId]);

//         if (result.rows.length === 0) {
//             return sendJson(res, 404, {
//                 success: false,
//                 message: `No schedule found with ID ${scheduleId}. Please check the ID and try again.`,
//                 data: null,
//             });
//         }

//         sendJson(res, 200, {
//             success: true,
//             message: "Schedule retrieved successfully.",
//             data: result.rows[0],
//         });
//     } catch (error: unknown) {
//         console.error("Error fetching schedule:", error);

//         if (error instanceof Error) {
//             if (error.message.includes("ECONNREFUSED")) {
//                 return sendJson(res, 500, {
//                     success: false,
//                     message: "Database connection error. Please try again later.",
//                 });
//             }
//             return sendJson(res, 500, {
//                 success: false,
//                 message: "An unexpected error occurred while retrieving the schedule. Please try again later.",
//                 error: error.message,
//             });
//         }

//         sendJson(res, 500, {
//             success: false,
//             message: "An unknown error occurred.",
//         });
//     }
// });

// // Create a new schedule
// app.post("/schedules", async (req: Request, res: Response) => {
//     const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;

//     try {
//         const result = await dataSource.query(
//             "INSERT INTO attendance_schedules (name, branch, start_time, closing_time, locations, duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
//             [name, branch, start_time, closing_time, locations, duration]
//         );

//         const scheduleId = result.rows[0].id;

//         if (Array.isArray(assigned_users)) {
//             for (const userId of assigned_users) {
//                 if (typeof userId !== "number") {
//                     return sendJson(res, 400, { message: "Each user ID must be a number" });
//                 }

//                 await dataSource.query(
//                     "INSERT INTO attendance_schedule_participants (schedule_id, user_id) VALUES ($1, $2)",
//                     [scheduleId, userId]
//                 );
//             }
//         }

//         sendJson(res, 201, result.rows[0]);
//     } catch (error) {
//         console.error("Error creating schedule:", error);
//         sendJson(res, 500, { message: "Internal Server Error" });
//     }
// });

// // Update schedule
// app.put("/schedules/:id", async (req: Request, res: Response) => {
//     const scheduleId = Number(req.params.id);
//     const { name, branch, start_time, closing_time, assigned_users, locations, duration } = req.body;

//     if (isNaN(scheduleId) || scheduleId <= 0) {
//         return sendJson(res, 400, {
//             success: false,
//             message: "Invalid schedule ID. Please provide a valid numeric ID.",
//         });
//     }

//     if (!name && !branch && !start_time && !closing_time && !assigned_users && !locations && duration === undefined) {
//         return sendJson(res, 400, {
//             success: false,
//             message: "No fields provided for update. Please send at least one field to update.",
//         });
//     }

//     try {
//         const result = await dataSource.query(
//             "UPDATE attendance_schedules SET name = $1, branch = $2, start_time = $3, closing_time = $4, locations = $5, duration = $6 WHERE id = $7 RETURNING *",
//             [name, branch, start_time, closing_time, locations, duration, scheduleId]
//         );

//         if (result.rows.length === 0) {
//             return sendJson(res, 404, {
//                 success: false,
//                 message: `No schedule found with ID ${scheduleId}. Please check the ID and try again.`,
//                 data: null,
//             });
//         }

//         sendJson(res, 200, {
//             success: true,
//             message: "Schedule updated successfully.",
//             data: result.rows[0],
//         });
//     } catch (error: unknown) {
//         console.error("Error updating schedule:", error);

//         if (error instanceof Error) {
//             if (error.message.includes("ECONNREFUSED")) {
//                 return sendJson(res, 500, {
//                     success: false,
//                     message: "Database connection error. Please try again later.",
//                 });
//             }
//             if (error.message.includes("violates unique constraint")) {
//                 return sendJson(res, 400, {
//                     success: false,
//                     message: "A schedule with the same name already exists. Please choose a different name.",
//                 });
//             }
//             if (error.message.includes("foreign key constraint")) {
//                 return sendJson(res, 400, {
//                     success: false,
//                     message: "Invalid branch or location ID. Please check your input and try again.",
//                 });
//             }

//             return sendJson(res, 500, {
//                 success: false,
//                 message: "An unexpected error occurred while updating the schedule. Please try again later.",
//                 error: error.message,
//             });
//         }

//         sendJson(res, 500, {
//             success: false,
//             message: "An unknown error occurred.",
//         });
//     }
// });

// // Delete schedule
// app.delete("/schedules/:id", async (req: Request, res: Response) => {
//     const scheduleId = Number(req.params.id);

//     if (isNaN(scheduleId) || scheduleId <= 0) {
//         return sendJson(res, 400, {
//             success: false,
//             message: "Invalid schedule ID. Please provide a valid numeric ID.",
//         });
//     }

//     try {
//         const result = await dataSource.query("DELETE FROM attendance_schedules WHERE id = $1 RETURNING *", [scheduleId]);

//         if (result.rows.length === 0) {
//             return sendJson(res, 404, {
//                 success: false,
//                 message: `No schedule found with ID ${scheduleId}. Please check the ID and try again.`,
//                 data: null,
//             });
//         }

//         sendJson(res, 200, {
//             success: true,
//             message: "Schedule deleted successfully.",
//             deletedItem: result.rows[0],
//         });
//     } catch (error: unknown) {
//         console.error("Error deleting schedule:", error);

//         if (error instanceof Error) {
//             if (error.message.includes("ECONNREFUSED")) {
//                 return sendJson(res, 500, {
//                     success: false,
//                     message: "Database connection error. Please try again later.",
//                 });
//             }
//             if (error.message.includes("foreign key constraint")) {
//                 return sendJson(res, 400, {
//                     success: false,
//                     message: "This schedule is referenced in another table and cannot be deleted. Please remove related records first.",
//                 });
//             }

//             return sendJson(res, 500, {
//                 success: false,
//                 message: "An unexpected error occurred while deleting the schedule. Please try again later.",
//                 error: error.message,
//             });
//         }

//         sendJson(res, 500, {
//             success: false,
//             message: "An unknown error occurred.",
//         });
//     }
// });

// export default app;
