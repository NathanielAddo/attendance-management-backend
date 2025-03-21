// // src/routes/rosterRoutes.ts
// import express from 'express';
// import { authenticate } from '../middlewares/auth.middleware';
// import { 
//   getRoster, 
//   createRoster, 
//   updateRoster, 
//   deleteRoster, 
//   bulkCreateRoster,
//   getAssignedRosters,
//   exportRoster
// } from '../controllers/rosterController';

// const router = express.Router();

// router.get('/', authenticate, getRoster);
// router.post('/', authenticate, createRoster);
// router.put('/:id', authenticate, updateRoster);
// router.delete('/:id', authenticate, deleteRoster);
// router.post('/bulk', authenticate, bulkCreateRoster);
// router.get('/assigned', authenticate, getAssignedRosters);
// router.get('/export', authenticate, exportRoster);

// export default router;
