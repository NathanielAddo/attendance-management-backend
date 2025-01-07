import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
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

router.get('/', authenticate, (req, res) => getRoster(req, res));
router.post('/', authenticate, (req, res) => createRoster(req, res));
router.put('/:id', authenticate, (req, res) => updateRoster(req, res));
router.delete('/:id', authenticate, (req, res) => deleteRoster(req, res));
router.post('/bulk', authenticate, (req, res) => bulkCreateRoster(req, res));
router.get('/assigned', authenticate, (req, res) => getAssignedRosters(req, res));
router.get('/export', authenticate, (req, res) => exportRoster(req, res));

export default router;
