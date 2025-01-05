import express from 'express';
import { verifyToken } from '../utils/verifyToken';
import { getUsers, createUser, updateUser, deleteUser, bulkCreateUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => getUsers(req, res));
router.post('/', verifyToken, (req, res) => createUser(req, res));
router.post('/bulk', verifyToken, (req, res) => bulkCreateUsers(req, res));
router.put('/:id', verifyToken, (req, res) => updateUser(req, res));
router.delete('/:id', verifyToken, (req, res) => deleteUser(req, res));

export default router;
