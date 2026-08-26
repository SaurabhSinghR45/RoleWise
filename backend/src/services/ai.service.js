const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { GoogleGenAI } = require("@google/genai");

/**
 * Zod Schema for Structured Interview Preparation Report
 */
const interviewReportZodSchema = z.object({
    matchScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Overall match score (0-100) between the candidate's profile/resume and the target job description."
        ),
    summary: z
        .string()
        .describe(
            "High-level executive evaluation of candidate fit, highlighting top strengths and core areas to improve."
        ),
    skillGaps: z
        .array(
            z.object({
                skill: z.string().describe("Name of the missing, weak, or required skill/technology."),
                severity: z
                    .enum(["low", "medium", "high"])
                    .describe("Impact on interview outcome: low, medium, or high."),
                recommendation: z
                    .string()
                    .describe("Specific, actionable advice or resource to bridge this gap."),
            })
        )
        .describe("List of critical skill gaps compared to job requirements."),
    technicalQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("Deep-dive technical question specific to the role and tech stack."),
                intention: z
                    .string()
                    .describe("What the interviewer is evaluating (e.g. concurrency, architecture, optimization)."),
                expectedAnswer: z
                    .string()
                    .describe("Comprehensive model answer with key terminology, trade-offs, and examples."),
                difficulty: z
                    .enum(["easy", "medium", "hard"])
                    .describe("Question difficulty level."),
            })
        )
        .describe("Targeted technical interview questions."),
    behavioralQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("Behavioral or situational interview question relevant to the role level."),
                intention: z
                    .string()
                    .describe("Interviewer intention and behavioral trait being evaluated."),
                expectedAnswer: z
                    .string()
                    .describe("Structured guide on how to answer using the STAR (Situation, Task, Action, Result) method."),
            })
        )
        .describe("Targeted behavioral/situational questions."),
    preparationPlan: z
        .array(
            z.object({
                day: z.number().describe("Day number (e.g. 1 to 7)."),
                focus: z.string().describe("Core domain or topic focus for the day."),
                tasks: z
                    .array(z.string())
                    .describe("Specific, highly actionable study/practice checklist items for this day."),
            })
        )
        .describe("Structured 7-day preparation roadmap leading up to the interview."),
});

// Standard OpenAPI Schema for Gemini structured output
const geminiResponseSchema = {
    type: "OBJECT",
    properties: {
        matchScore: {
            type: "INTEGER",
            description: "Overall match score between 0 and 100",
        },
        summary: {
            type: "STRING",
            description: "Executive summary of candidate fit and growth areas",
        },
        skillGaps: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING" },
                    severity: {
                        type: "STRING",
                        enum: ["low", "medium", "high"],
                    },
                    recommendation: { type: "STRING" },
                },
                required: ["skill", "severity", "recommendation"],
            },
        },
        technicalQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    expectedAnswer: { type: "STRING" },
                    difficulty: {
                        type: "STRING",
                        enum: ["easy", "medium", "hard"],
                    },
                },
                required: [
                    "question",
                    "intention",
                    "expectedAnswer",
                    "difficulty",
                ],
            },
        },
        behavioralQuestions: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING" },
                    intention: { type: "STRING" },
                    expectedAnswer: { type: "STRING" },
                },
                required: ["question", "intention", "expectedAnswer"],
            },
        },
        preparationPlan: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER" },
                    focus: { type: "STRING" },
                    tasks: { type: "ARRAY", items: { type: "STRING" } },
                },
                required: ["day", "focus", "tasks"],
            },
        },
    },
    required: [
        "matchScore",
        "summary",
        "skillGaps",
        "technicalQuestions",
        "behavioralQuestions",
        "preparationPlan",
    ],
};

/**
 * Initializes Gemini client instance
 */
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is not configured in your environment variables."
        );
    }
    return new GoogleGenAI({ apiKey });
};

/**
 * Generates structured interview preparation report using Gemini 2.5 Flash
 * (with fallback mock generator if GEMINI_API_KEY is not configured yet)
 * @param {Object} params
 * @param {string} params.jobDescription - Target Job Description text
 * @param {string} [params.resumeText] - Extracted candidate resume plaintext
 * @param {string} [params.selfDescription] - Candidate self-introduction / extra experience
 * @returns {Promise<Object>} - Validated JSON report compliant with interviewReportZodSchema
 */
const generateInterviewReport = async ({
    jobDescription,
    resumeText = "",
    selfDescription = "",
}) => {
    if (!jobDescription || jobDescription.trim().length < 20) {
        throw new Error("A valid and detailed Job Description is required.");
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If GEMINI_API_KEY is not set, provide a rich structured report for development testing
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
        console.warn("[Rolewise AI] GEMINI_API_KEY is not set in .env. Generating mock report for testing.");
        const mockReport = {
            matchScore: 84,
            summary:
                "The candidate shows a strong foundation matching core full-stack engineering requirements. Strongest in React and Node.js REST API architecture, with growth opportunities in high-scale distributed caching and microservice orchestration.",
            skillGaps: [
                {
                    skill: "Distributed Caching (Redis)",
                    severity: "medium",
                    recommendation:
                        "Deep dive into Redis cache invalidation strategies (Cache-Aside, Write-Through) and rate limiting with token buckets.",
                },
                {
                    skill: "Container Orchestration & CI/CD",
                    severity: "medium",
                    recommendation:
                        "Practice deploying Dockerized microservices with GitHub Actions pipelines and Kubernetes manifests.",
                },
                {
                    skill: "Database Indexing & Query Profiling",
                    severity: "low",
                    recommendation:
                        "Study MongoDB compound index prefixes and explain() query execution plans for query latency optimization.",
                },
            ],
            technicalQuestions: [
                {
                    question:
                        "How do you design a scalable JWT authentication system with secure logout and token blacklisting in MongoDB?",
                    intention:
                        "Evaluates architectural understanding of stateless authentication versus stateful revocation tradeoffs.",
                    expectedAnswer:
                        "Store JWT in HTTP-only, SameSite cookies to protect against XSS. For secure logout, save revoked token signatures in a dedicated Blacklist collection with a TTL index equal to token expiry (e.g. 24h/7d). During authentication middleware, perform a fast indexed lookup against the blacklist before verifying the signature.",
                    difficulty: "medium",
                },
                {
                    question:
                        "How do you prevent race conditions when two concurrent requests attempt to decrement the same inventory stock count in MongoDB?",
                    intention:
                        "Tests knowledge of concurrency control, atomic operators, and NoSQL transaction boundaries.",
                    expectedAnswer:
                        "Use atomic update operators like $inc with a conditional query filter: db.products.updateOne({ _id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }). Alternatively, implement optimistic concurrency control with document versioning (__v) or multi-document ACID transactions if multiple collections must stay in sync.",
                    difficulty: "hard",
                },
                {
                    question:
                        "In a React 19 application, what are the architectural benefits of a 4-Layer design (Services -> Context -> Hooks -> UI)?",
                    intention:
                        "Assesses frontend modularity, separation of concerns, testability, and state orchestration hygiene.",
                    expectedAnswer:
                        "Layer 4 (API Services) decouples raw Axios/Fetch HTTP calls. Layer 3 (Context) holds single-source-of-truth global state. Layer 2 (Custom Hooks) encapsulates business logic and eliminates UI coupling. Layer 1 (UI) focuses purely on declarative presentation, resulting in 100% testable and reusable code.",
                    difficulty: "medium",
                },
            ],
            behavioralQuestions: [
                {
                    question:
                        "Describe a situation where you had to push back on unrealistic product timelines or requirements.",
                    intention:
                        "Evaluates communication, stakeholder management, engineering trade-off estimation, and diplomacy.",
                    expectedAnswer:
                        "Structure using STAR: Situation (high-priority feature with an impossible 3-day deadline), Task (deliver core value without cutting critical security corners), Action (presented a phased scope roadmap with MVP milestones and risk trade-offs), Result (launched Phase 1 on time with zero production defects).",
                },
                {
                    question:
                        "Tell me about a high-severity production outage you resolved under pressure.",
                    intention:
                        "Assesses incident triage, root cause analysis, emotional composure, and blameless post-mortem hygiene.",
                    expectedAnswer:
                        "State the outage metrics, your methodical troubleshooting process (checking APM logs, database connection pool saturation), rollback/hotfix execution, and subsequent regression test suite added to prevent recurrence.",
                },
            ],
            preparationPlan: [
                {
                    day: 1,
                    focus: "Full-Stack System Architecture & API Security",
                    tasks: [
                        "Review JWT lifecycle, HTTP-only cookie security, and CORS preflight mechanisms",
                        "Design a high-level architecture diagram for the target role's core service",
                    ],
                },
                {
                    day: 2,
                    focus: "Database Schema Design & Query Optimization",
                    tasks: [
                        "Practice MongoDB aggregation pipelines and compound index profiling",
                        "Review optimistic locking vs pessimistic locking patterns",
                    ],
                },
                {
                    day: 3,
                    focus: "Frontend State Management & React 19 Patterns",
                    tasks: [
                        "Review custom hooks, memoization (useCallback/useMemo), and context performance",
                        "Practice writing clean declarative UI components with form validation",
                    ],
                },
                {
                    day: 4,
                    focus: "Distributed Systems, Caching & Message Queues",
                    tasks: [
                        "Implement Redis cache-aside patterns and rate limiting",
                        "Study asynchronous background workers and job queues",
                    ],
                },
                {
                    day: 5,
                    focus: "Live Coding & Mock Technical Interview",
                    tasks: [
                        "Solve 2 medium-level algorithmic questions under time constraints",
                        "Practice explaining technical trade-offs out loud",
                    ],
                },
                {
                    day: 6,
                    focus: "Behavioral Preparation & STAR Story Bank",
                    tasks: [
                        "Draft 4 detailed STAR stories (Leadership, Failure, Conflict, Complex Technical Delivery)",
                        "Refine 2-minute elevator pitch tailored to this company",
                    ],
                },
                {
                    day: 7,
                    focus: "Final Review & ATS Resume Polish",
                    tasks: [
                        "Export and review targeted ATS-optimized resume",
                        "Prepare insightful questions for the engineering hiring manager",
                    ],
                },
            ],
        };
        return interviewReportZodSchema.parse(mockReport);
    }

    const ai = getGeminiClient();

    const prompt = `
You are Rolewise AI, an elite technical recruiter and Principal Engineering Hiring Manager.
Your goal is to thoroughly analyze a candidate's background against a target Job Description (JD) and produce an exhaustive, highly practical Interview Preparation Report.

--- CANDIDATE INFORMATION ---
Resume Text:
${resumeText ? resumeText : "No resume uploaded. Base analysis primarily on self-description and standard industry benchmarks."}

Self Description / Additional Experience:
${selfDescription ? selfDescription : "Not provided."}

--- TARGET JOB DESCRIPTION ---
${jobDescription}

--- INSTRUCTIONS ---
1. Calculate an authentic match score (0 to 100) reflecting real-world hiring criteria.
2. Identify 3 to 6 critical skill gaps with actionable recommendations.
3. Formulate 5 to 8 rigorous technical interview questions tailored precisely to the technologies in the JD, with interviewer intentions and model answers.
4. Formulate 3 to 5 realistic behavioral questions with STAR framework guidance.
5. Create a day-by-day 7-day preparation roadmap.

Return ONLY a valid JSON object matching the requested schema.
`;

    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: geminiResponseSchema,
                temperature: 0.2,
            },
        });

        const rawText = response.text;
        if (!rawText) {
            throw new Error("Empty response received from Gemini API");
        }

        const parsedJson = JSON.parse(rawText);
        const validatedReport = interviewReportZodSchema.parse(parsedJson);
        return validatedReport;
    } catch (error) {
        console.error("[Gemini AI Service Error]:", error);
        throw new Error(`AI Report Generation Failed: ${error.message}`);
    }
};

module.exports = {
    interviewReportZodSchema,
    generateInterviewReport,
};
