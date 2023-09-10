import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from '../controllers/chatControllers.js';

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/renamegroup').put(protect, renameGroup);
router.route('/addtogroup').put(protect, addToGroup);
router.route('/removefromgroup').put(protect, removeFromGroup);

export default router;
