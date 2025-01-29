import { Router } from 'express';
import * as adminScheduleController from '../controllers/adminScheduleController';  // Assuming the controller is exported like this

const router = Router();

// Get all schedules
router.get("/", adminScheduleController.getAllSchedules);

// Get a specific schedule by ID
router.get("/:id", adminScheduleController.getScheduleById);

// Create a new schedule
router.post("/", adminScheduleController.createSchedule);

// Update a schedule by ID
router.put("/:id", adminScheduleController.updateSchedule);

// Delete a schedule by ID
router.delete("/:id", adminScheduleController.deleteSchedule);

export default router;
