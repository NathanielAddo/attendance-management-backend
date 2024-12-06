import express from 'express';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController.js';

const router = express.Router();

router.get('/', (req, res) => getLocations(req, res));
router.post('/', (req, res) => createLocation(req, res));
router.put('/:id', (req, res) => updateLocation(req, res));
router.delete('/:id', (req, res) => deleteLocation(req, res));

export default router;
