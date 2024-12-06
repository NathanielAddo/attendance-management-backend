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

router.get('/', (req, res) => getRoster(req, res));
router.post('/', (req, res) => createRoster(req, res));
router.put('/:id', (req, res) => updateRoster(req, res));
router.delete('/:id', (req, res) => deleteRoster(req, res));
router.post('/bulk', (req, res) => bulkCreateRoster(req, res));
router.get('/assigned', (req, res) => getAssignedRosters(req, res));
router.get('/export', (req, res) => exportRoster(req, res));

export default router;
