const express = require("express");
const {
    generateReport,
    getReportById,
    getAllUserReports,
    deleteReport,
    exportResumePDF,
} = require("../controllers/interview.controller");
const { authUser } = require("../middlewares/auth.middleware");
const { uploadResume } = require("../middlewares/file.middleware");

const router = express.Router();

// Protect all interview routes
router.use(authUser);

/**
 * @route   POST /api/interview/generate
 * @desc    Generate a structured AI interview prep report from JD and Resume PDF
 * @access  Private
 */
router.post("/generate", uploadResume, generateReport);

/**
 * @route   GET /api/interview/reports
 * @desc    Get all reports for the authenticated user
 * @access  Private
 */
router.get("/reports", getAllUserReports);

/**
 * @route   GET /api/interview/report/:id
 * @desc    Get single detailed interview report by ID
 * @access  Private
 */
router.get("/report/:id", getReportById);

/**
 * @route   GET /api/interview/report/:id/pdf
 * @desc    Export ATS-Optimized Resume PDF using Puppeteer
 * @access  Private
 */
router.get("/report/:id/pdf", exportResumePDF);

/**
 * @route   DELETE /api/interview/report/:id
 * @desc    Delete single interview report by ID
 * @access  Private
 */
router.delete("/report/:id", deleteReport);

module.exports = router;
