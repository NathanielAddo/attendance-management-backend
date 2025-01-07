import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => getLocations(req, res));
router.post('/', authenticate, (req, res) => createLocation(req, res));
router.put('/:id', authenticate, (req, res) => updateLocation(req, res));
router.delete('/:id', authenticate, (req, res) => deleteLocation(req, res));

export default router;
