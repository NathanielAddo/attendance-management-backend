import express from 'express';
import * as locationController from '../controllers/locationController';

const router = express.Router();

router.post('/', locationController.createLocation);
router.get('/', locationController.getLocations);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;

