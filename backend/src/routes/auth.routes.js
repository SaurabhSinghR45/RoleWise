const express = require("express");
const {
    register,
    login,
    logout,
    getMe,
} = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account and set HTTP-only JWT cookie
 * @access  Public
 * @body    { username: string, email: string, password: string }
 * @returns { success: boolean, message: string, user: { _id, username, email, createdAt } }
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with credentials and set HTTP-only JWT cookie
 * @access  Public
 * @body    { email: string, password: string }
 * @returns { success: boolean, message: string, user: { _id, username, email, createdAt } }
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user, blacklist active JWT token in DB, and clear cookie
 * @access  Private (Authenticated)
 * @returns { success: boolean, message: string }
 */
router.post("/logout", authUser, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private (Authenticated)
 * @returns { success: boolean, user: { _id, username, email, createdAt, updatedAt } }
 */
router.get("/me", authUser, getMe);

module.exports = router;
