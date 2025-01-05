import express from 'express';
import { verifyToken } from '../utils/verifyToken';
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

router.get('/', verifyToken, (req, res) => getRoster(req, res));
router.post('/', verifyToken, (req, res) => createRoster(req, res));
router.put('/:id', verifyToken, (req, res) => updateRoster(req, res));
router.delete('/:id', verifyToken, (req, res) => deleteRoster(req, res));
router.post('/bulk', verifyToken, (req, res) => bulkCreateRoster(req, res));
router.get('/assigned', verifyToken, (req, res) => getAssignedRosters(req, res));
router.get('/export', verifyToken, (req, res) => exportRoster(req, res));

export default router;
