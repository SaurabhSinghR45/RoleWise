const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Blacklist = require("../models/blacklist.model");

/**
 * Authentication Middleware
 * Validates JWT token from cookies or Authorization header,
 * checks database token blacklisting, and attaches authenticated user to `req.user`.
 */
const authUser = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No authentication token provided",
            });
        }

        // Check if token is blacklisted (logged out)
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token has been revoked. Please log in again.",
            });
        }

        // Verify token signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token payload",
            });
        }

        // Fetch user from database excluding password
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: `Unauthorized: ${error.message}`,
            });
        }
        console.error("[Auth Middleware Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication",
        });
    }
};

module.exports = { authUser };
