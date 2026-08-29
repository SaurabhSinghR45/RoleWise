const mongoose = require("mongoose");

const skillGapSchema = new mongoose.Schema(
    {
        skill: { type: String, required: true },
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        recommendation: { type: String, required: true },
    },
    { _id: false }
);

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        intention: { type: String, required: true },
        expectedAnswer: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
        },
    },
    { _id: false }
);

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        intention: { type: String, required: true },
        expectedAnswer: { type: String, required: true },
    },
    { _id: false }
);

const prepPlanDaySchema = new mongoose.Schema(
    {
        day: { type: Number, required: true },
        focus: { type: String, required: true },
        tasks: [{ type: String }],
    },
    { _id: false }
);

const keywordMatchSchema = new mongoose.Schema(
    {
        keyword: { type: String, required: true },
        category: { type: String, default: "General" },
        frequencyInResume: { type: Number, default: 1 },
    },
    { _id: false }
);

const missingKeywordSchema = new mongoose.Schema(
    {
        keyword: { type: String, required: true },
        category: { type: String, default: "General" },
        importance: {
            type: String,
            enum: ["critical", "preferred", "bonus"],
            default: "critical",
        },
        context: { type: String, default: "" },
    },
    { _id: false }
);

const keywordMatrixSchema = new mongoose.Schema(
    {
        matchRate: { type: Number, default: 0 },
        matchedKeywords: [keywordMatchSchema],
        missingKeywords: [missingKeywordSchema],
        keywordOptimizationTips: [{ type: String }],
    },
    { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        jobDescription: {
            type: String,
            required: [true, "Job Description is required"],
        },
        resumeText: {
            type: String,
            default: "",
        },
        selfDescription: {
            type: String,
            default: "",
        },
        inputHash: {
            type: String,
            index: true,
            default: "",
        },
        matchScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        techSkillsScore: {
            type: Number,
            default: 0,
        },
        experienceScore: {
            type: Number,
            default: 0,
        },
        architectureScore: {
            type: Number,
            default: 0,
        },
        methodologiesScore: {
            type: Number,
            default: 0,
        },
        summary: {
            type: String,
            required: true,
        },
        skillGaps: [skillGapSchema],
        technicalQuestions: [technicalQuestionSchema],
        behavioralQuestions: [behavioralQuestionSchema],
        preparationPlan: [prepPlanDaySchema],
        keywordMatrix: {
            type: keywordMatrixSchema,
            default: () => ({
                matchRate: 0,
                matchedKeywords: [],
                missingKeywords: [],
                keywordOptimizationTips: [],
            }),
        },
    },
    {
        timestamps: true,
    }
);

const InterviewReport = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);

module.exports = InterviewReport;
