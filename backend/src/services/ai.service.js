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
        .describe("Overall match score (0-100)."),
    techSkillsScore: z.number().min(0).max(40).optional(),
    experienceScore: z.number().min(0).max(30).optional(),
    architectureScore: z.number().min(0).max(20).optional(),
    methodologiesScore: z.number().min(0).max(10).optional(),
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
    keywordMatrix: z
        .object({
            matchRate: z.number().min(0).max(100).optional(),
            matchedKeywords: z
                .array(
                    z.object({
                        keyword: z.string(),
                        category: z.string(),
                        frequencyInResume: z.number().optional(),
                    })
                )
                .optional(),
            missingKeywords: z
                .array(
                    z.object({
                        keyword: z.string(),
                        category: z.string(),
                        importance: z
                            .enum(["critical", "preferred", "bonus"])
                            .optional(),
                        context: z.string().optional(),
                    })
                )
                .optional(),
            keywordOptimizationTips: z.array(z.string()).optional(),
        })
        .optional(),
});

// Standard OpenAPI Schema for Gemini structured output
const geminiResponseSchema = {
    type: "OBJECT",
    properties: {
        techSkillsScore: {
            type: "INTEGER",
            description: "Technical stack coverage score out of 40",
        },
        experienceScore: {
            type: "INTEGER",
            description: "Years and depth of relevant experience score out of 30",
        },
        architectureScore: {
            type: "INTEGER",
            description: "System design, cloud, and architecture alignment score out of 20",
        },
        methodologiesScore: {
            type: "INTEGER",
            description: "Tooling, testing, CI/CD, and agile best practices score out of 10",
        },
        matchScore: {
            type: "INTEGER",
            description: "Sum of techSkillsScore + experienceScore + architectureScore + methodologiesScore (0-100)",
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
        keywordMatrix: {
            type: "OBJECT",
            properties: {
                matchRate: {
                    type: "INTEGER",
                    description: "Percentage of JD keywords matched in resume (0-100)",
                },
                matchedKeywords: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            keyword: { type: "STRING" },
                            category: { type: "STRING" },
                            frequencyInResume: { type: "INTEGER" },
                        },
                        required: ["keyword", "category", "frequencyInResume"],
                    },
                },
                missingKeywords: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            keyword: { type: "STRING" },
                            category: { type: "STRING" },
                            importance: {
                                type: "STRING",
                                enum: ["critical", "preferred", "bonus"],
                            },
                            context: { type: "STRING" },
                        },
                        required: ["keyword", "category", "importance", "context"],
                    },
                },
                keywordOptimizationTips: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                },
            },
            required: [
                "matchRate",
                "matchedKeywords",
                "missingKeywords",
                "keywordOptimizationTips",
            ],
        },
    },
    required: [
        "techSkillsScore",
        "experienceScore",
        "architectureScore",
        "methodologiesScore",
        "matchScore",
        "summary",
        "skillGaps",
        "technicalQuestions",
        "behavioralQuestions",
        "preparationPlan",
        "keywordMatrix",
    ],
};

/**
 * Resolves all configured Gemini API keys from environment variables.
 * Supports:
 * - Comma-separated GEMINI_API_KEYS (e.g. key1,key2,key3)
 * - Comma-separated GEMINI_API_KEY
 * - Indexed GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3, ...
 */
const getConfiguredGeminiKeys = () => {
    const collected = [];
    if (process.env.GEMINI_API_KEYS) {
        collected.push(...process.env.GEMINI_API_KEYS.split(","));
    }
    if (process.env.GEMINI_API_KEY) {
        collected.push(...process.env.GEMINI_API_KEY.split(","));
    }
    for (let i = 1; i <= 10; i++) {
        const k = process.env[`GEMINI_API_KEY_${i}`];
        if (k) collected.push(k);
    }

    const uniqueKeys = Array.from(
        new Set(
            collected
                .map((k) => k.trim())
                .filter((k) => k && k !== "your_gemini_api_key_here")
        )
    );
    return uniqueKeys;
};

// Global key rotation index and rate-limit cooldown tracker
let currentKeyRotationIndex = 0;
const exhaustedKeyCooldowns = new Map(); // apiKey -> cooldown expiry timestamp

/**
 * Gets next active Gemini client using round-robin rotation while avoiding exhausted keys
 */
const getActiveGeminiClient = () => {
    const keys = getConfiguredGeminiKeys();
    if (keys.length === 0) {
        throw new Error("GEMINI_API_KEY is not configured in your environment variables.");
    }

    const now = Date.now();
    for (const [k, exp] of exhaustedKeyCooldowns.entries()) {
        if (now >= exp) exhaustedKeyCooldowns.delete(k);
    }

    for (let i = 0; i < keys.length; i++) {
        const idx = (currentKeyRotationIndex + i) % keys.length;
        const key = keys[idx];
        if (!exhaustedKeyCooldowns.has(key)) {
            currentKeyRotationIndex = (idx + 1) % keys.length;
            return {
                client: new GoogleGenAI({ apiKey: key }),
                key,
                keyIndex: idx + 1,
                totalKeys: keys.length,
            };
        }
    }

    // If all are temporarily marked exhausted, fallback to rotating key
    const fallbackKey = keys[currentKeyRotationIndex % keys.length];
    currentKeyRotationIndex = (currentKeyRotationIndex + 1) % keys.length;
    return {
        client: new GoogleGenAI({ apiKey: fallbackKey }),
        key: fallbackKey,
        keyIndex: currentKeyRotationIndex,
        totalKeys: keys.length,
    };
};

/**
 * Executes a Gemini model operation with automatic multi-key rotation and failover.
 * If Key N hits a 429 quota or RESOURCE_EXHAUSTED error, it logs and immediately tries Key N+1.
 */
const executeWithGeminiFailover = async (operationName, taskFn) => {
    const keys = getConfiguredGeminiKeys();
    if (keys.length === 0) {
        throw new Error("No valid GEMINI_API_KEY configured in environment variables.");
    }

    let lastError = null;
    const attemptedKeys = new Set();

    for (let attempt = 0; attempt < keys.length; attempt++) {
        const { client, key, keyIndex, totalKeys } = getActiveGeminiClient();
        let targetKey = key;
        if (attemptedKeys.has(key)) {
            const unattempted = keys.find((k) => !attemptedKeys.has(k));
            if (!unattempted) break;
            targetKey = unattempted;
        }

        attemptedKeys.add(targetKey);
        const aiClient = new GoogleGenAI({ apiKey: targetKey });

        try {
            return await taskFn(aiClient);
        } catch (error) {
            lastError = error;
            const errMsg = String(error?.message || "");
            const isRateLimit =
                errMsg.includes("429") ||
                errMsg.includes("RESOURCE_EXHAUSTED") ||
                errMsg.includes("quota") ||
                error?.status === 429;

            if (isRateLimit && attemptedKeys.size < keys.length) {
                exhaustedKeyCooldowns.set(targetKey, Date.now() + 60 * 1000);
                const nextUnattempted = keys.find((k) => !attemptedKeys.has(k));
                console.warn(
                    `[Rolewise AI - ${operationName}] API Key #${keys.indexOf(targetKey) + 1} reached quota limit. Automatically switching to Key #${keys.indexOf(nextUnattempted) + 1} (${attemptedKeys.size}/${keys.length} keys used)...`
                );
                continue;
            }

            throw error;
        }
    }

    throw lastError || new Error("All configured Gemini API keys were exhausted.");
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
            keywordMatrix: {
                matchRate: 78,
                matchedKeywords: [
                    { keyword: "React 19", category: "Frameworks & AI", frequencyInResume: 3 },
                    { keyword: "Node.js / Express", category: "Frameworks & AI", frequencyInResume: 4 },
                    { keyword: "JavaScript / TypeScript", category: "Languages", frequencyInResume: 5 },
                    { keyword: "MongoDB / Mongoose", category: "Databases & Cloud", frequencyInResume: 3 },
                    { keyword: "REST API Architecture", category: "Architecture", frequencyInResume: 4 },
                    { keyword: "JWT Authentication", category: "Security & Tools", frequencyInResume: 2 },
                    { keyword: "Docker", category: "DevOps & Tools", frequencyInResume: 2 },
                    { keyword: "Git / GitHub", category: "DevOps & Tools", frequencyInResume: 4 },
                ],
                missingKeywords: [
                    {
                        keyword: "Redis Caching",
                        category: "Databases & Cloud",
                        importance: "critical",
                        context: "Required for distributed session caching and rate-limiting.",
                    },
                    {
                        keyword: "Kubernetes (K8s)",
                        category: "DevOps & Tools",
                        importance: "preferred",
                        context: "Mentioned in JD for container cluster deployment.",
                    },
                    {
                        keyword: "PostgreSQL / SQL",
                        category: "Databases & Cloud",
                        importance: "critical",
                        context: "Needed for ACID-compliant transactional persistence.",
                    },
                    {
                        keyword: "Jest / Vitest CI",
                        category: "Testing & QA",
                        importance: "bonus",
                        context: "Automated regression testing pipeline.",
                    },
                ],
                keywordOptimizationTips: [
                    "Integrate Redis caching into your project bullets (e.g. 'Engineered distributed caching layer using Redis, cutting API latency by 45%').",
                    "Highlight SQL database modeling alongside MongoDB to prove polyglot database competence.",
                    "Explicitly reference CI/CD testing workflows (GitHub Actions, Vitest) in your Tools section.",
                ],
            },
        };
        return interviewReportZodSchema.parse(mockReport);
    }

    const prompt = `
You are Rolewise AI, an elite technical recruiter and Principal Engineering Hiring Manager.
Your goal is to thoroughly analyze a candidate's background against a target Job Description (JD) and produce an exhaustive, highly practical, and deterministic Interview Preparation Report.

--- CANDIDATE INFORMATION ---
Resume Text:
${resumeText ? resumeText : "No resume uploaded. Base analysis primarily on self-description and standard industry benchmarks."}

Self Description / Additional Experience:
${selfDescription ? selfDescription : "Not provided."}

--- TARGET JOB DESCRIPTION ---
${jobDescription}

--- OBJECTIVE SCORING RUBRIC (DETERMINISTIC 0-100) ---
1. Core Technical Skills Match (Max 40 points):
   - Percentage of required JD languages/frameworks found in candidate background: 0 to 40 points.
2. Experience Level & Scope (Max 30 points):
   - Depth of projects, seniority alignment, autonomy shown: 0 to 30 points.
3. Architecture & Domain Competency (Max 20 points):
   - System design, scalability, cloud, microservices, or specific domain alignment: 0 to 20 points.
4. Professional Tooling & Best Practices (Max 10 points):
   - Testing, Git, CI/CD, Agile, code review practices: 0 to 10 points.

Total matchScore = Math.round(Score 1 + Score 2 + Score 3 + Score 4), strictly clamped between 0 and 100.

--- INSTRUCTIONS ---
1. Calculate the matchScore following the deterministic rubric above.
2. Identify 3 to 6 critical skill gaps with actionable recommendations.
3. Formulate 5 to 8 rigorous technical interview questions tailored precisely to the technologies in the JD, with interviewer intentions and model answers.
4. Formulate 3 to 5 realistic behavioral questions with STAR framework guidance.
5. Create a structured day-by-day 7-day preparation roadmap.
6. Perform ATS Keyword Matrix extraction:
   - Identify 8 to 15 matched keywords found in candidate's resume/profile categorized by Languages, Frameworks & AI, Databases & Cloud, DevOps & Tools, Architecture.
   - Identify 4 to 8 missing/gap keywords explicitly required or strongly preferred by the JD.
   - Calculate matchRate percentage = Math.round((matched / (matched + missing)) * 100).
   - Provide 3 to 4 non-spammy, high-impact resume placement tips on how to integrate the missing keywords naturally into experience bullets.

Return ONLY a valid JSON object matching the requested schema.
`;

    try {
        const response = await executeWithGeminiFailover("Interview Report", async (aiClient) => {
            return await aiClient.models.generateContent({
                model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: geminiResponseSchema,
                    temperature: 0.0,
                },
            });
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

// OpenAPI Schema for Tailored 1-Page ATS Resume Output
const atsResumeOpenApiSchema = {
    type: "OBJECT",
    properties: {
        fullName: { type: "STRING" },
        rollNo: { type: "STRING" },
        subHeader: { type: "STRING" },
        targetTitle: { type: "STRING" },
        contact: {
            type: "OBJECT",
            properties: {
                email: { type: "STRING" },
                secondaryEmail: { type: "STRING" },
                phone: { type: "STRING" },
                location: { type: "STRING" },
                linkedin: { type: "STRING" },
                github: { type: "STRING" },
                leetcode: { type: "STRING" },
                portfolio: { type: "STRING" },
            },
            required: ["email"],
        },
        summary: { type: "STRING" },
        technicalSkills: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    category: { type: "STRING" },
                    skills: { type: "ARRAY", items: { type: "STRING" } },
                },
                required: ["category", "skills"],
            },
        },
        experience: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    role: { type: "STRING" },
                    company: { type: "STRING" },
                    duration: { type: "STRING" },
                    location: { type: "STRING" },
                    bullets: { type: "ARRAY", items: { type: "STRING" } },
                    technologies: { type: "ARRAY", items: { type: "STRING" } },
                },
                required: ["role"],
            },
        },
        projects: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING" },
                    link: { type: "STRING" },
                    duration: { type: "STRING" },
                    bullets: { type: "ARRAY", items: { type: "STRING" } },
                    technologies: { type: "ARRAY", items: { type: "STRING" } },
                },
                required: ["title"],
            },
        },
        education: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    institution: { type: "STRING" },
                    degree: { type: "STRING" },
                    duration: { type: "STRING" },
                    score: { type: "STRING" },
                },
                required: ["institution"],
            },
        },
        achievements: {
            type: "ARRAY",
            items: { type: "STRING" },
        },
    },
    required: ["fullName", "technicalSkills", "projects", "education"],
};

/**
 * Robust, high-fidelity parser that deterministically extracts ANY candidate's
 * authentic resume sections without hallucinating fake languages, degrees, or companies.
 */
const buildAuthenticTailoredResume = ({
    resumeText = "",
    jobDescription = "",
    selfDescription = "",
    user = {},
    report = null,
}) => {
    const raw = (resumeText || "").replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "").trim();
    const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

    // 1. Detect Standard Section Boundaries
    const sectionDefs = [
        { key: "summary", regex: /^(?:PROFESSIONAL SUMMARY|SUMMARY|EXECUTIVE SUMMARY|PROFILE|ABOUT ME|OBJECTIVE)$/i },
        { key: "education", regex: /^(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC DETAILS|ACADEMICS)$/i },
        { key: "experience", regex: /^(?:WORK EXPERIENCE|EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|INTERNSHIPS)$/i },
        { key: "projects", regex: /^(?:PERSONAL PROJECTS|PROJECTS|KEY PROJECTS|ACADEMIC PROJECTS|FEATURED PROJECTS)$/i },
        { key: "skills", regex: /^(?:TECHNICAL SKILLS AND INTERESTS|TECHNICAL SKILLS|SKILLS & ABILITIES|SKILLS|CORE COMPETENCIES)$/i },
        { key: "achievements", regex: /^(?:ACHIEVEMENTS|AWARDS|AWARDS & ACHIEVEMENTS|HONORS|PUBLICATIONS|CERTIFICATIONS)$/i },
    ];

    const detected = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/^[•\-\*#§Ðï\s]+/, "").trim();
        for (const def of sectionDefs) {
            if (def.regex.test(line)) {
                detected.push({ key: def.key, index: i, title: line });
                break;
            }
        }
    }
    detected.sort((a, b) => a.index - b.index);

    const headerLines = detected.length > 0 ? lines.slice(0, detected[0].index) : lines.slice(0, 6);
    const secMap = {};
    for (let i = 0; i < detected.length; i++) {
        const cur = detected[i];
        const nextIdx = i + 1 < detected.length ? detected[i + 1].index : lines.length;
        secMap[cur.key] = lines.slice(cur.index + 1, nextIdx).filter((l) => !l.startsWith("-- "));
    }

    // --- 1. HEADER & CONTACT ---
    let fullName = "";
    let phone = "";
    let email = "";
    let secondaryEmail = "";
    let rollNo = "";
    let subHeader = "";
    let linkedin = "";
    let github = "";
    let leetcode = "";
    let location = "";

    for (const hLine of headerLines) {
        // Emails
        const ems = hLine.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        if (ems) {
            if (!email) email = ems[0];
            else if (!secondaryEmail && ems[0] !== email) secondaryEmail = ems[0];
            if (ems[1] && !secondaryEmail && ems[1] !== email) secondaryEmail = ems[1];
        }

        // Phone
        const ph = hLine.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{4,5}/);
        if (ph && !phone) phone = ph[0].trim();

        // Roll No / Student ID
        const rm = hLine.match(/Roll\s*No\.?\s*:\s*([A-Za-z0-9]+)/i);
        if (rm && !rollNo) rollNo = rm[1].trim();

        // Degree / Subheader
        if (/Master of|Bachelor of|MCA|B\.?Tech|M\.?Tech|Computer Applications/i.test(hLine) && !subHeader) {
            const m = hLine.match(/(?:Master|Bachelor)[^#|ƒ§\n]+/i) || hLine.match(/MCA/i);
            if (m) subHeader = m[0].trim();
        }

        // Links
        const gh = hLine.match(/github\.com\/([^\s#|•§ï]+)/i);
        if (gh && !github) github = "https://" + gh[0];

        const li = hLine.match(/linkedin\.com\/in\/([^\s#|•§ï]+)/i);
        if (li && !linkedin) linkedin = "https://" + li[0];

        const lc = hLine.match(/leetcode\.com\/([^\s#|•§ï]+)/i);
        if (lc && !leetcode) leetcode = "https://" + lc[0];

        // Explicit location (e.g. City, Country or Location: ...)
        const locMatch = hLine.match(/(?:Location|Address|City):\s*([^\n\r|#]+)/i);
        if (locMatch && !location) location = locMatch[1].trim();

        // Full Name extraction (line 0 or before special symbols)
        if (!fullName) {
            const clean = hLine.split(/[ƒ#|•§ï\+]/)[0].replace(/[^a-zA-Z\s.-]/g, "").trim();
            const words = clean.split(/\s+/);
            if (words.length >= 1 && words.length <= 4 && clean.length >= 3 && clean.length <= 35) {
                fullName = clean;
            }
        }
    }

    if (!fullName) fullName = user.username || "Candidate Profile";

    // Recover links from body if not in header
    if (!github) {
        const ghBody = raw.match(/(?:https?:\/\/)?github\.com\/([a-zA-Z0-9-_]+)/i);
        if (ghBody && ghBody[1] && !["rate-limiter-gateway", "skillswap", "topics", "features"].includes(ghBody[1].toLowerCase())) {
            github = "https://github.com/" + ghBody[1];
        }
    }

    // --- 2. AUTHENTIC SUMMARY ---
    let summary = "";
    if (secMap.summary && secMap.summary.length > 0) {
        summary = secMap.summary.join(" ").replace(/^[•\-\*]\s*/, "").trim();
    }

    // --- 3. EDUCATION ---
    const education = [];
    if (secMap.education) {
        const eduLines = secMap.education;
        let currentEdu = null;

        for (let i = 0; i < eduLines.length; i++) {
            const rawLine = eduLines[i].trim();
            if (!rawLine) continue;
            const line = rawLine.replace(/[\u2013\u2014]/g, "-");

            const dateMatch = line.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?\d{4}\s*-\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:\d{4}|Present)/i);
            const scoreMatch = line.match(/(?:CGPA|Percentage|Score|GPA)\s*:\s*[\d.]+%?/i);
            const isInst = /(?:Institute|University|College|School|Academy|HNBGU|NIT|IIT|IIIT|BITS)/i.test(line);

            if (dateMatch || isInst) {
                if (currentEdu) education.push(currentEdu);
                const instPart = line.replace(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?\d{4}\s*-\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:\d{4}|Present)/i, "").trim().replace(/[-–,]+$/, "").trim();
                currentEdu = {
                    institution: instPart || line,
                    duration: dateMatch ? dateMatch[0].trim() : "",
                    degree: "",
                    score: scoreMatch ? scoreMatch[0].trim() : "",
                };
            } else if (currentEdu) {
                let degPart = line;
                if (scoreMatch) {
                    degPart = degPart.replace(scoreMatch[0], "").trim().replace(/[-–,]+$/, "").trim();
                    if (!currentEdu.score) currentEdu.score = scoreMatch[0].trim();
                }
                if (!currentEdu.degree) currentEdu.degree = degPart;
                else currentEdu.degree += " " + degPart;
            }
        }
        if (currentEdu) education.push(currentEdu);
    }

    // --- 4. WORK EXPERIENCE ---
    const experience = [];
    if (secMap.experience) {
        const expLines = secMap.experience;
        let currentExp = null;

        for (let i = 0; i < expLines.length; i++) {
            const rawLine = expLines[i].trim();
            if (!rawLine) continue;
            const line = rawLine.replace(/[\u2013\u2014]/g, "-");
            const cleanLine = line.replace(/^[•\-\*–]\s*/, "").trim();

            const dateMatch = line.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?\d{4}\s*-\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:\d{4}|Present)/i);
            const isBullet = /^[•\-\*–]/.test(line);
            const isTech = /^(?:Technologies Used|Tools|Tech Stack)\s*:/i.test(cleanLine);

            if (dateMatch && !isBullet) {
                if (currentExp) experience.push(currentExp);
                const roleName = line.replace(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?\d{4}\s*-\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:\d{4}|Present)/i, "").trim().replace(/[-–,]+$/, "").trim();
                currentExp = {
                    role: roleName || line,
                    company: "",
                    duration: dateMatch[0].trim(),
                    bullets: [],
                    technologies: [],
                };
            } else if (currentExp && !currentExp.company && !isBullet && !isTech) {
                currentExp.company = cleanLine;
            } else if (currentExp && isTech) {
                const rawTech = cleanLine.replace(/^(?:Technologies Used|Tools|Tech Stack)\s*:\s*/i, "").trim();
                currentExp.technologies = rawTech.split(/[,|•]/).map((s) => s.trim()).filter(Boolean);
            } else if (currentExp && isBullet) {
                currentExp.bullets.push(cleanLine);
            } else if (currentExp && currentExp.bullets.length > 0) {
                const last = currentExp.bullets.length - 1;
                if (currentExp.bullets[last].endsWith("-")) {
                    currentExp.bullets[last] = currentExp.bullets[last].slice(0, -1) + cleanLine;
                } else {
                    currentExp.bullets[last] += " " + cleanLine;
                }
            }
        }
        if (currentExp) experience.push(currentExp);
    }

    // --- 5. PERSONAL PROJECTS ---
    const projects = [];
    if (secMap.projects) {
        const projLines = secMap.projects;
        let currentProj = null;
        let prevWasTech = false;

        for (let i = 0; i < projLines.length; i++) {
            const rawLine = projLines[i].trim();
            if (!rawLine) continue;
            const line = rawLine.replace(/[\u2013\u2014]/g, "-");
            const cleanLine = line.replace(/^[•\-\*–]\s*/, "").trim();

            const isTech = /^(?:Technologies Used|Tools|Tech Stack)\s*:/i.test(cleanLine);
            const hasLink = /(?:github\.com|https?:\/\/)/i.test(line);
            const isBullet = /^[•\-\*–]/.test(line) && !isTech;

            const isProjectHeader = !isBullet && !isTech && (hasLink || !currentProj || prevWasTech);

            if (isProjectHeader) {
                if (currentProj) projects.push(currentProj);
                const linkMatch = line.match(/(?:https?:\/\/)?(?:github\.com\/[^\s•§ï|]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[^\s•§ï|]+)/i);
                const titlePart = line.split(/[§|•]/)[0].replace(/[-–]\s*$/, "").trim();
                currentProj = {
                    title: titlePart || line,
                    link: linkMatch ? (linkMatch[0].startsWith("http") ? linkMatch[0] : "https://" + linkMatch[0]) : "",
                    bullets: [],
                    technologies: [],
                };
                prevWasTech = false;
            } else if (currentProj && isTech) {
                const rawTech = cleanLine.replace(/^(?:Technologies Used|Tools|Tech Stack)\s*:/i, "").trim();
                currentProj.technologies = rawTech.split(/[,|•]/).map((s) => s.trim()).filter(Boolean);
                prevWasTech = true;
            } else if (currentProj && isBullet) {
                currentProj.bullets.push(cleanLine);
                prevWasTech = false;
            } else if (currentProj && currentProj.bullets.length > 0) {
                const last = currentProj.bullets.length - 1;
                if (currentProj.bullets[last].endsWith("-")) {
                    currentProj.bullets[last] = currentProj.bullets[last].slice(0, -1) + cleanLine;
                } else {
                    currentProj.bullets[last] += " " + cleanLine;
                }
                prevWasTech = false;
            }
        }
        if (currentProj) projects.push(currentProj);
    }

    // --- 6. TECHNICAL SKILLS ---
    const technicalSkills = [];
    if (secMap.skills) {
        const skillLines = secMap.skills;
        for (const line of skillLines) {
            const parts = line.split(":");
            if (parts.length >= 2) {
                const category = parts[0].replace(/^[•\-\*]\s*/, "").trim();
                const skillsStr = parts.slice(1).join(":").trim();
                if (category && skillsStr) {
                    technicalSkills.push({
                        category,
                        skills: skillsStr.split(/[,|•]/).map((s) => s.trim()).filter(Boolean),
                    });
                }
            }
        }
    }

    // --- 7. ACHIEVEMENTS ---
    const achievements = [];
    if (secMap.achievements) {
        for (const line of secMap.achievements) {
            const clean = line.replace(/^[•\-\*]\s*/, "").trim();
            if (clean && clean !== "-- 1 of 1 --" && clean.length > 8) {
                achievements.push(clean);
            }
        }
    }

    // Target Role Title derivation from JD
    let targetTitle = "";
    if (jobDescription) {
        const jdLines = jobDescription.split("\n").map((l) => l.trim()).filter(Boolean);
        for (const jLine of jdLines) {
            const m = jLine.match(/(?:Job Title|Role|Position|Opening):\s*([^\n\r,]+)/i);
            if (m && m[1]) {
                targetTitle = m[1].trim();
                break;
            }
        }
        if (!targetTitle && jdLines.length > 0 && jdLines[0].length < 60) {
            targetTitle = jdLines[0].replace(/^(?:Role|Job|Position|Hiring for)\s*:\s*/i, "").trim();
        }
    }

    return {
        fullName,
        phone,
        email,
        secondaryEmail,
        rollNo,
        subHeader: subHeader || targetTitle,
        targetTitle,
        contact: {
            phone,
            email,
            secondaryEmail,
            location,
            linkedin,
            github,
            leetcode,
        },
        summary,
        education,
        experience,
        projects,
        technicalSkills,
        achievements,
    };
};

const generateTailoredAtsResume = async ({
    resumeText = "",
    jobDescription = "",
    selfDescription = "",
    user = {},
    report = null,
}) => {
    // 1. First parse the authentic data from the candidate's actual resume
    const authenticData = buildAuthenticTailoredResume({
        resumeText,
        jobDescription,
        selfDescription,
        user,
        report,
    });

    // If the candidate provided an authentic resume with projects or experience,
    // use their authentic extracted data directly to ensure 100% fidelity without hallucinations.
    if (authenticData.projects.length > 0 || authenticData.experience.length > 0 || authenticData.education.length > 0) {
        return authenticData;
    }

    // 2. If no resume text was uploaded (e.g. only selfDescription), use Gemini with schema
    const keys = getConfiguredGeminiKeys();
    if (keys.length === 0) {
        return authenticData;
    }

    const prompt = `
You are an expert Resume Writer and ATS Optimization Specialist.
Your task is to structure the candidate's profile into an ATS-compliant resume strictly using their real experience and background.

--- CANDIDATE INFORMATION ---
Candidate Name: ${authenticData.fullName || user.username || "Candidate Profile"}
Email: ${authenticData.email || user.email || "candidate@example.com"}
${selfDescription ? "Background & Details: " + selfDescription : ""}

--- TARGET JOB DESCRIPTION ---
${jobDescription}

--- INSTRUCTIONS ---
1. Use ONLY the candidate's authentic information. NEVER hallucinate fake companies, degrees, or unmentioned programming languages.
2. Structure the data cleanly into the requested schema.
3. Return ONLY a valid JSON object matching the requested schema.
`;

    try {
        const response = await executeWithGeminiFailover("ATS Resume Generator", async (aiClient) => {
            return await aiClient.models.generateContent({
                model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: atsResumeOpenApiSchema,
                    temperature: 0.1,
                },
            });
        });

        const rawText = response.text;
        if (!rawText) {
            return authenticData;
        }

        const parsedJson = JSON.parse(rawText);
        return parsedJson;
    } catch (error) {
        console.warn(
            `[Gemini ATS Resume Generator]: Fallback to authentic parser (${error.message})`
        );
        return authenticData;
    }
};

// OpenAPI Schema for Real-Time Answer Evaluation
const answerEvaluationOpenApiSchema = {
    type: "OBJECT",
    properties: {
        score: {
            type: "INTEGER",
            description: "Score between 0 and 100 evaluating the response",
        },
        rating: {
            type: "STRING",
            enum: ["Needs Improvement", "Fair", "Good", "Exceptional"],
        },
        strengths: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Key points or concepts candidate articulated well",
        },
        missedConcepts: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Critical technical concepts, tradeoffs, or metrics candidate omitted",
        },
        feedback: {
            type: "STRING",
            description: "Constructive feedback from an Engineering Hiring Manager perspective",
        },
        improvedAnswerSnippet: {
            type: "STRING",
            description: "A polished, high-impact model phrasing of how to answer this effectively",
        },
    },
    required: [
        "score",
        "rating",
        "strengths",
        "missedConcepts",
        "feedback",
        "improvedAnswerSnippet",
    ],
};

/**
 * Evaluates candidate's typed or spoken answer in real time using Gemini 3.6 Flash
 * @param {Object} params
 * @param {string} params.question - The interview question
 * @param {string} [params.intention] - What interviewer is looking for
 * @param {string} [params.expectedAnswer] - The benchmark answer
 * @param {string} params.userAnswer - The candidate's response
 * @param {string} [params.questionType] - "technical" | "behavioral"
 * @returns {Promise<Object>} - Detailed answer evaluation
 */
const evaluateUserAnswer = async ({
    question,
    intention = "",
    expectedAnswer = "",
    userAnswer,
    questionType = "technical",
}) => {
    if (!userAnswer || userAnswer.trim().length < 5) {
        throw new Error("Please provide a substantive answer (at least 5 characters).");
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
        // Fallback mock evaluation
        return {
            score: 78,
            rating: "Good",
            strengths: [
                "Directly addressed the core question promptly.",
                "Demonstrated solid conceptual familiarity with the terminology.",
            ],
            missedConcepts: [
                "Could elaborate on production error handling and edge-case fallbacks.",
                "Mentioning specific latency, throughput, or architectural trade-offs would elevate the response.",
            ],
            feedback:
                "Solid foundation! To convert this into an Exceptional answer, quantify your experience with real-world scenarios and mention failure recovery strategies.",
            improvedAnswerSnippet: expectedAnswer || "Structure your answer with: 1) Core mechanism, 2) Trade-offs, 3) Production monitoring/handling.",
        };
    }

    const prompt = `
You are Rolewise AI, an elite Technical Interview Evaluator and Senior Engineering Hiring Manager.
Evaluate the candidate's response to the following interview question with rigorous, encouraging, and actionable feedback.

--- INTERVIEW QUESTION ---
${question}
${intention ? `Interviewer Intention: ${intention}` : ""}
${expectedAnswer ? `Benchmark Model Answer: ${expectedAnswer}` : ""}
Question Domain: ${questionType.toUpperCase()}

--- CANDIDATE'S SUBMITTED RESPONSE ---
${userAnswer}

--- EVALUATION CRITERIA ---
1. Score the answer objectively from 0 to 100 based on technical accuracy, clarity, conciseness, and depth.
2. If behavioral: Evaluate STAR framework alignment (Situation, Task, Action, Result) and authenticity.
3. If technical: Check for architecture depth, concurrency awareness, edge cases, and terminology.
4. Extract 2-3 specific Strengths (what they got right).
5. Extract 2-3 Missed Concepts (crucial keywords, trade-offs, or best practices they forgot).
6. Provide concise, constructive feedback as an expert interviewer.
7. Provide a concise, polished model answer snippet that shows them how to deliver it at a Principal Engineer / Senior level.

Return ONLY a valid JSON object matching the requested schema.
`;

    try {
        const response = await executeWithGeminiFailover("Answer Evaluator", async (aiClient) => {
            return await aiClient.models.generateContent({
                model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: answerEvaluationOpenApiSchema,
                    temperature: 0.1,
                },
            });
        });

        const rawText = response.text;
        if (!rawText) {
            throw new Error("Empty response received from Gemini Answer Evaluator");
        }

        const parsedJson = JSON.parse(rawText);
        return parsedJson;
    } catch (error) {
        console.error("[Gemini Answer Evaluation Error]:", error);
        throw new Error(`Answer evaluation failed: ${error.message}`);
    }
};

// OpenAPI Schema for Multi-Role Target Comparison
const multiRoleComparisonOpenApiSchema = {
    type: "OBJECT",
    properties: {
        recommendedBestRole: {
            type: "STRING",
            description:
                "The title of the single role where the candidate has the highest interview clearance probability",
        },
        bestFitReasoning: {
            type: "STRING",
            description:
                "2-3 sentences explaining why this candidate's specific stack, projects, and strengths give them the greatest competitive edge in this role",
        },
        roleComparisons: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    roleTitle: { type: "STRING" },
                    fitScore: {
                        type: "INTEGER",
                        description: "Match score between 0 and 100",
                    },
                    verdict: {
                        type: "STRING",
                        enum: [
                            "Strong Fit",
                            "Good Fit",
                            "Moderate Fit",
                            "Low Fit",
                        ],
                    },
                    topStrengths: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description:
                            "2-3 key assets from candidate's profile matching this specific role",
                    },
                    keyGaps: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description:
                            "1-2 critical skills or tools candidate is missing for this role",
                    },
                    applicationAdvice: {
                        type: "STRING",
                        description:
                            "Strategic resume tailoring advice if applying for this specific track",
                    },
                },
                required: [
                    "roleTitle",
                    "fitScore",
                    "verdict",
                    "topStrengths",
                    "keyGaps",
                    "applicationAdvice",
                ],
            },
        },
    },
    required: ["recommendedBestRole", "bestFitReasoning", "roleComparisons"],
};

/**
 * Compares candidate background across multiple target roles simultaneously using Gemini 3.6 Flash
 * @param {Object} params
 * @param {string} params.resumeText - Candidate resume plaintext
 * @param {string} [params.selfDescription] - Extra candidate details
 * @param {Array<string>} [params.targetRoles] - List of role titles to compare
 * @returns {Promise<Object>} - Multi-role comparative analysis
 */
const compareMultiRoleFit = async ({
    resumeText = "",
    selfDescription = "",
    targetRoles = [],
}) => {
    const rolesList =
        targetRoles && targetRoles.length > 0
            ? targetRoles
            : [
                  "AI Full Stack Developer (Python + React)",
                  "Backend Engineer (Python / FastAPI / Microservices)",
                  "Frontend Engineer (React / TypeScript)",
                  "GenAI / Machine Learning Systems Engineer",
              ];

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
        // Fallback mock comparison
        return {
            recommendedBestRole:
                "Backend Engineer (Python / FastAPI / Microservices)",
            bestFitReasoning:
                "Your proven experience architecting asynchronous APIs with FastAPI, multi-agent concurrency, and Docker containerization provides an immediate match for high-throughput backend services.",
            roleComparisons: [
                {
                    roleTitle:
                        "Backend Engineer (Python / FastAPI / Microservices)",
                    fitScore: 88,
                    verdict: "Strong Fit",
                    topStrengths: [
                        "Deep familiarity with Python asyncio, FastAPI REST routing, and concurrency control.",
                        "Containerized backend deployments with Docker and clean relational/NoSQL data access.",
                    ],
                    keyGaps: [
                        "Could benefit from highlighting Redis caching and Kafka/RabbitMQ message queues.",
                    ],
                    applicationAdvice:
                        "Emphasize sub-second API response times and asynchronous task workers on your resume.",
                },
                {
                    roleTitle: "AI Full Stack Developer (Python + React)",
                    fitScore: 82,
                    verdict: "Strong Fit",
                    topStrengths: [
                        "Complete end-to-end delivery from React 19 UI to Python AI backend services.",
                        "Integration of LLMs and structured multi-agent pipelines.",
                    ],
                    keyGaps: [
                        "TypeScript interfaces and comprehensive frontend testing (Vitest/Jest).",
                    ],
                    applicationAdvice:
                        "Showcase live full-stack demo URLs and highlight your 4-layer frontend architecture.",
                },
                {
                    roleTitle: "GenAI / Machine Learning Systems Engineer",
                    fitScore: 74,
                    verdict: "Good Fit",
                    topStrengths: [
                        "Practical implementation of Sentence Transformers and Hugging Face embedding pipelines.",
                        "Autonomous multi-agent orchestration experience in CodeReviewPro.",
                    ],
                    keyGaps: [
                        "Production vector database deployments (Qdrant, Pinecone) and model fine-tuning frameworks (PyTorch).",
                    ],
                    applicationAdvice:
                        "Highlight embedding retrieval latencies and LLM prompt engineering techniques in project bullets.",
                },
                {
                    roleTitle: "Frontend Engineer (React / TypeScript)",
                    fitScore: 68,
                    verdict: "Moderate Fit",
                    topStrengths: [
                        "Modern React 19 development with responsive glassmorphic UI tokens and custom hooks.",
                    ],
                    keyGaps: [
                        "Strict TypeScript typing, Next.js SSR, and automated component testing suites.",
                    ],
                    applicationAdvice:
                        "Convert a portfolio module to TypeScript and feature dynamic CSS animations prominently.",
                },
            ],
        };
    }

    const prompt = `
You are Rolewise AI, an elite Executive Career Strategist and VP of Engineering.
Compare the candidate's background against the following target job roles simultaneously:
${rolesList.map((r, i) => `${i + 1}. ${r}`).join("\n")}

--- CANDIDATE INFORMATION ---
Resume Text:
${resumeText ? resumeText : "Candidate has strong foundational full-stack and Python background."}

Self Description / Extra Details:
${selfDescription ? selfDescription : "None provided."}

--- INSTRUCTIONS ---
1. Score the candidate's fit for EACH role from 0 to 100 based on their actual projects, languages, and technical depth.
2. Determine which single role is their #1 RECOMMENDED BEST ROLE (highest conversion rate) and explain why in 2-3 sentences.
3. For each role:
   - Assign a verdict: "Strong Fit" (80-100), "Good Fit" (70-79), "Moderate Fit" (50-69), or "Low Fit" (<50).
   - List 2 top strengths the candidate has for that specific role.
   - List 1-2 critical skill gaps they would need to address.
   - Give 1 tactical application advice tip for tailoring their resume to that role.

Return ONLY a valid JSON object matching the requested schema.
`;

    try {
        const response = await executeWithGeminiFailover("Multi-Role Comparison", async (aiClient) => {
            return await aiClient.models.generateContent({
                model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: multiRoleComparisonOpenApiSchema,
                    temperature: 0.1,
                },
            });
        });

        const rawText = response.text;
        if (!rawText) {
            throw new Error("Empty response received from Gemini Role Comparison");
        }

        const parsedJson = JSON.parse(rawText);
        return parsedJson;
    } catch (error) {
        console.error("[Gemini Multi-Role Comparison Error]:", error);
        throw new Error(`Failed to compare roles: ${error.message}`);
    }
};

module.exports = {
    interviewReportZodSchema,
    generateInterviewReport,
    generateTailoredAtsResume,
    evaluateUserAnswer,
    compareMultiRoleFit,
};
