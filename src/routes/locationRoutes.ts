import express from 'express';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../controllers/locationController';

const router = express.Router();

router.get('/', getLocations);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export default router;
