import express from 'express';
import * as rosterController from '../controllers/rosterController';

const router = express.Router();

router.post('/', rosterController.createRoster);
router.get('/', rosterController.getRosters);
router.put('/:id', rosterController.updateRoster);
router.delete('/:id', rosterController.deleteRoster);
router.post('/bulk-assign', rosterController.bulkAssignRoster);
router.post('/upload', rosterController.uploadBulkRoster);
router.get('/assigned', rosterController.getAssignedRosters);
router.get('/export', rosterController.exportRoster);

export default router;

