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
