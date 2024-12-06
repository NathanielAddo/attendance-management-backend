import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, bulkCreateUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => getUsers(req, res));
router.post('/', (req, res) => createUser(req, res));
router.post('/bulk', (req, res) => bulkCreateUsers(req, res));
router.put('/:id', (req, res) => updateUser(req, res));
router.delete('/:id', (req, res) => deleteUser(req, res));

export default router;
