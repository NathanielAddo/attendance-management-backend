import express from 'express';
import * as eventController from '../controllers/eventController';

const router = express.Router();

router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.post('/bulk', eventController.createBulkEvents);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;

