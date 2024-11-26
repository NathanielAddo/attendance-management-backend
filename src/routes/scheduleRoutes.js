const express = require('express');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.getSchedules);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);
router.post('/archive/:id', scheduleController.archiveSchedule);
router.get('/archived', scheduleController.getArchivedSchedules);
router.post('/:id/agenda', scheduleController.addAgenda);

module.exports = router;
