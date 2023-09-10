import express from 'express';
import { loginUser, searchUser, signupUser } from '../controllers/userControllers.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/', protect, searchUser);

export default router;
