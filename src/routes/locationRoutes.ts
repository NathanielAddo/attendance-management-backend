import express from 'express';
import { 
  getLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation, 
  createBulkLocations,
  generateCoordinates 
} from '../controllers/locationController';

const router = express.Router();

router.get('/', getLocations);
router.get('/generate-coordinates', generateCoordinates);
router.post('/', createLocation);
router.post('/bulk', createBulkLocations);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export default router;
