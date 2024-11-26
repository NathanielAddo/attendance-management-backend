const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router();

router.post('/', locationController.createLocation);
router.get('/', locationController.getLocations);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

module.exports = router;
