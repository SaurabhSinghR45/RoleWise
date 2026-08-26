const InterviewReport = require("../models/interview.report.model");
const { generateInterviewReport } = require("../services/ai.service");
const { extractTextFromPDF } = require("../middlewares/file.middleware");

/**
 * Generate a new interview preparation report
 * @route POST /api/interview/generate
 */
const generateReport = async (req, res) => {
    try {
        const { jobDescription, selfDescription } = req.body;

        if (!jobDescription || jobDescription.trim().length < 20) {
            return res.status(400).json({
                success: false,
                message: "Please provide a detailed Job Description (at least 20 characters)",
            });
        }

        let resumeText = "";
        if (req.file) {
            try {
                resumeText = await extractTextFromPDF(req.file.buffer);
            } catch (fileErr) {
                return res.status(400).json({
                    success: false,
                    message: fileErr.message || "Failed to parse uploaded PDF resume",
                });
            }
        }

        // Call Gemini AI Structured Generation Service
        const aiReport = await generateInterviewReport({
            jobDescription: jobDescription.trim(),
            resumeText,
            selfDescription: selfDescription ? selfDescription.trim() : "",
        });

        // Save report to database
        const savedReport = await InterviewReport.create({
            user: req.user._id,
            jobDescription: jobDescription.trim(),
            resumeText,
            selfDescription: selfDescription ? selfDescription.trim() : "",
            matchScore: aiReport.matchScore,
            summary: aiReport.summary,
            skillGaps: aiReport.skillGaps,
            technicalQuestions: aiReport.technicalQuestions,
            behavioralQuestions: aiReport.behavioralQuestions,
            preparationPlan: aiReport.preparationPlan,
        });

        return res.status(201).json({
            success: true,
            message: "Interview preparation report generated successfully",
            report: savedReport,
        });
    } catch (error) {
        console.error("[Generate Report Controller Error]:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate interview report",
        });
    }
};

/**
 * Get report by ID
 * @route GET /api/interview/report/:id
 */
const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await InterviewReport.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found",
            });
        }

        return res.status(200).json({
            success: true,
            report,
        });
    } catch (error) {
        console.error("[Get Report By ID Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch interview report",
        });
    }
};

/**
 * Get all interview reports for current user
 * @route GET /api/interview/reports
 */
const getAllUserReports = async (req, res) => {
    try {
        const reports = await InterviewReport.find({ user: req.user._id })
            .select("jobDescription matchScore summary createdAt updatedAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reports,
        });
    } catch (error) {
        console.error("[Get All Reports Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reports list",
        });
    }
};

/**
 * Delete report by ID
 * @route DELETE /api/interview/report/:id
 */
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await InterviewReport.findOneAndDelete({
            _id: id,
            user: req.user._id,
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Report not found or not authorized to delete",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Interview report deleted successfully",
        });
    } catch (error) {
        console.error("[Delete Report Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete report",
        });
    }
};

module.exports = {
    generateReport,
    getReportById,
    getAllUserReports,
    deleteReport,
};
