const express = require('express');
const rosterController = require('../controllers/rosterController');

const router = express.Router();

router.post('/', rosterController.createRoster);
router.get('/', rosterController.getRosters);
router.put('/:id', rosterController.updateRoster);
router.delete('/:id', rosterController.deleteRoster);
router.post('/bulk-assign', rosterController.bulkAssignRoster);
router.post('/upload', rosterController.uploadBulkRoster);
router.get('/assigned', rosterController.getAssignedRosters);
router.get('/export', rosterController.exportRoster);

module.exports = router;
