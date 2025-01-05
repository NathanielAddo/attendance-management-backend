import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getEvents, createEvent, updateEvent, deleteEvent, bulkCreateEvents } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => getEvents(req, res));
router.post('/', verifyToken, (req, res) => createEvent(req, res));
router.post('/bulk', verifyToken, (req, res) => bulkCreateEvents(req, res));
router.put('/:id', verifyToken, (req, res) => updateEvent(req, res));
router.delete('/:id', verifyToken, (req, res) => deleteEvent(req, res));

export default router;
