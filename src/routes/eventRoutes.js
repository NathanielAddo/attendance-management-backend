const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.post('/bulk', eventController.createBulkEvents);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
