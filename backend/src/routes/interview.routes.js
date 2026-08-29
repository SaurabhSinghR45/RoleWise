const express = require("express");
const {
    generateReport,
    getReportById,
    getAllUserReports,
    deleteReport,
    exportResumePDF,
    evaluateAnswer,
    updateRoadmapProgress,
    compareRoles,
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
 * @route   POST /api/interview/evaluate-answer
 * @desc    Evaluate candidate answer to an interview question
 * @access  Private
 */
router.post("/evaluate-answer", evaluateAnswer);

/**
 * @route   PATCH /api/interview/report/:id/roadmap-progress
 * @desc    Save completed roadmap task keys for persistent tracking
 * @access  Private
 */
router.patch("/report/:id/roadmap-progress", updateRoadmapProgress);

/**
 * @route   POST /api/interview/compare-roles
 * @desc    Compare candidate background across multiple target roles
 * @access  Private
 */
router.post("/compare-roles", compareRoles);

/**
 * @route   DELETE /api/interview/report/:id
 * @desc    Delete single interview report by ID
 * @access  Private
 */
router.delete("/report/:id", deleteReport);

module.exports = router;
