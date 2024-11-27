import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, bulkCreateEvents } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.post('/bulk', bulkCreateEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;

