const crypto = require("crypto");
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

        // Compute normalized input hash for consistency and idempotency
        const normalizedInput = `${jobDescription.trim().toLowerCase()}:::${(resumeText || "").trim().toLowerCase()}:::${(selfDescription || "").trim().toLowerCase()}`;
        const inputHash = crypto.createHash("sha256").update(normalizedInput).digest("hex");

        // Check if identical input was already processed for this user
        const existingReport = await InterviewReport.findOne({
            user: req.user._id,
            inputHash,
        });

        if (existingReport) {
            return res.status(200).json({
                success: true,
                message: "Interview preparation report retrieved from cache",
                report: existingReport,
            });
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
            inputHash,
            matchScore: aiReport.matchScore,
            techSkillsScore: aiReport.techSkillsScore || Math.round((aiReport.matchScore * 40) / 100),
            experienceScore: aiReport.experienceScore || Math.round((aiReport.matchScore * 30) / 100),
            architectureScore: aiReport.architectureScore || Math.round((aiReport.matchScore * 20) / 100),
            methodologiesScore: aiReport.methodologiesScore || Math.round((aiReport.matchScore * 10) / 100),
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

/**
 * Export ATS-Optimized Resume PDF for a report
 * @route GET /api/interview/report/:id/pdf
 */
const exportResumePDF = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await InterviewReport.findOne({
            _id: id,
            user: req.user._id,
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found or unauthorized",
            });
        }

        // Generate structured, tailored 1-page ATS Resume matching the target JD
        const { generateTailoredAtsResume } = require("../services/ai.service");
        const { generateResumePDFBuffer } = require("../services/pdf.service");

        const tailoredResumeData = await generateTailoredAtsResume({
            resumeText: report.resumeText,
            jobDescription: report.jobDescription,
            selfDescription: report.selfDescription,
            user: req.user,
        });

        const pdfBuffer = await generateResumePDFBuffer(tailoredResumeData);

        const filename = `Rolewise_ATS_Resume_${id}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", pdfBuffer.length);

        return res.end(pdfBuffer);
    } catch (error) {
        console.error("[Export Resume PDF Error]:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate ATS Resume PDF",
        });
    }
};

/**
 * Evaluate Candidate's Typed or Spoken Interview Answer
 * @route POST /api/interview/evaluate-answer
 */
const evaluateAnswer = async (req, res) => {
    try {
        const { question, intention, expectedAnswer, userAnswer, questionType } = req.body;

        if (!question || !userAnswer || userAnswer.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid question and an answer (at least 5 characters).",
            });
        }

        const { evaluateUserAnswer } = require("../services/ai.service");
        const evaluation = await evaluateUserAnswer({
            question: question.trim(),
            intention: intention ? intention.trim() : "",
            expectedAnswer: expectedAnswer ? expectedAnswer.trim() : "",
            userAnswer: userAnswer.trim(),
            questionType: questionType || "technical",
        });

        return res.status(200).json({
            success: true,
            message: "Answer evaluated successfully",
            evaluation,
        });
    } catch (error) {
        console.error("[Evaluate Answer Controller Error]:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to evaluate answer",
        });
    }
};

/**
 * Update Completed Roadmap Tasks Progress
 * @route PATCH /api/interview/report/:id/roadmap-progress
 */
const updateRoadmapProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { completedTasks } = req.body;

        if (!Array.isArray(completedTasks)) {
            return res.status(400).json({
                success: false,
                message: "completedTasks must be an array of task keys",
            });
        }

        const report = await InterviewReport.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { $set: { completedRoadmapTasks: completedTasks } },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found or unauthorized",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Roadmap progress updated successfully",
            completedRoadmapTasks: report.completedRoadmapTasks,
        });
    } catch (error) {
        console.error("[Update Roadmap Progress Error]:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update roadmap progress",
        });
    }
};

/**
 * Compare Candidate Profile Across Multiple Target Engineering Roles
 * @route POST /api/interview/compare-roles
 */
const compareRoles = async (req, res) => {
    try {
        const { reportId, resumeText, selfDescription, targetRoles } = req.body;

        let candidateResume = resumeText || "";
        let candidateSelfDesc = selfDescription || "";

        // If reportId provided, fetch resumeText from existing report
        if (reportId && !candidateResume) {
            const report = await InterviewReport.findOne({
                _id: reportId,
                user: req.user._id,
            });
            if (report) {
                candidateResume = report.resumeText || "";
                candidateSelfDesc = report.selfDescription || "";
            }
        }

        const { compareMultiRoleFit } = require("../services/ai.service");
        const comparison = await compareMultiRoleFit({
            resumeText: candidateResume,
            selfDescription: candidateSelfDesc,
            targetRoles: Array.isArray(targetRoles) ? targetRoles : [],
        });

        return res.status(200).json({
            success: true,
            message: "Multi-role comparison generated successfully",
            comparison,
        });
    } catch (error) {
        console.error("[Compare Roles Controller Error]:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to compare roles",
        });
    }
};

module.exports = {
    generateReport,
    getReportById,
    getAllUserReports,
    deleteReport,
    exportResumePDF,
    evaluateAnswer,
    updateRoadmapProgress,
    compareRoles,
};
