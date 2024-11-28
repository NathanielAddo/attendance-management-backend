import express from 'express';
import { 
  getRoster, 
  createRoster, 
  updateRoster, 
  deleteRoster, 
  bulkCreateRoster,
  getAssignedRosters,
  exportRoster
} from '../controllers/rosterController.js';

const router = express.Router();

router.get('/', getRoster);
router.post('/', createRoster);
router.put('/:id', updateRoster);
router.delete('/:id', deleteRoster);
router.post('/bulk', bulkCreateRoster);
router.get('/assigned', getAssignedRosters);
router.get('/export', exportRoster);

export default router;

