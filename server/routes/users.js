import express from 'express';
import auth from '../middleware/auth.js';
import { getProfile, updateProfile, updatePreferences, updatePassword } from '../controllers/userController.js';

const router = express.Router();

// Get current user profile
router.get('/profile', auth, getProfile);
// Update user profile
router.put('/profile', auth, updateProfile);
// Update user preferences
router.put('/preferences', auth, updatePreferences);
// Update user password
router.put('/password', auth, updatePassword);

export default router; 