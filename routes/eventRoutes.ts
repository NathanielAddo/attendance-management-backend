import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, bulkCreateEvents } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', (req, res) => getEvents(req, res));
router.post('/', (req, res) => createEvent(req, res));
router.post('/bulk', (req, res) => bulkCreateEvents(req, res));
router.put('/:id', (req, res) => updateEvent(req, res));
router.delete('/:id', (req, res) => deleteEvent(req, res));

export default router;
