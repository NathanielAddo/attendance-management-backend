import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/bulk-register', userController.bulkRegisterUsers);
router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;

