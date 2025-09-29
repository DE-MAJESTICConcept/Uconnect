import express from "express";
// import { authMiddleware } from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { register, login, getProfile, updateProfile, requestPasswordReset,
   resetPassword, getAllUsers, getUserById, deleteUser } from '../controllers/auth.controller.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
const router = express.Router();

// Auth
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Admin only
router.get('/admin/users', protect, authorizeRoles("admin"), getAllUsers);
router.get('/admin/users/:id', protect, authorizeRoles("admin"), getUserById);
router.delete('/admin/users/:id', protect, authorizeRoles("admin"), deleteUser);


export default router;
