import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => getLocations(req, res));
router.post('/', verifyToken, (req, res) => createLocation(req, res));
router.put('/:id', verifyToken, (req, res) => updateLocation(req, res));
router.delete('/:id', verifyToken, (req, res) => deleteLocation(req, res));

export default router;
