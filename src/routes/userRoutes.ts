import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { getUsers, createUser, updateUser, deleteUser, bulkCreateUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', authenticate, (req, res) => getUsers(req, res));
router.post('/', authenticate, (req, res) => createUser(req, res));
router.post('/bulk', authenticate, (req, res) => bulkCreateUsers(req, res));
router.put('/:id', authenticate, (req, res) => updateUser(req, res));
router.delete('/:id', authenticate, (req, res) => deleteUser(req, res));

export default router;
