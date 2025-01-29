import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getEvents, createEvent, updateEvent, deleteEvent, bulkCreateEvents } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => getEvents(req, res));
router.post('/:userId', authenticate, (req, res) => createEvent(req, res));
router.post('/bulk', authenticate, (req, res) => bulkCreateEvents(req, res));
router.put('/:id', authenticate, (req, res) => updateEvent(req, res));
router.delete('/:id', authenticate, (req, res) => deleteEvent(req, res));

export default router;
