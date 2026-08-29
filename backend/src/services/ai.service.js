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

    const ai = getGeminiClient();

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

--- SCORING RUBRIC (DETERMINISTIC 100-POINT SYSTEM) ---
To ensure completely consistent, reproducible, and objective match scores across repeated analyses of the same input:
1. Core Technical Skills Match (Max 40 points):
   - Identify all mandatory tech stack items in the JD (e.g. languages, frameworks, databases).
   - Score = (Count of Candidate Matching Skills / Total Mandatory Skills in JD) * 40.
2. Experience Level & Seniority (Max 30 points):
   - Compare candidate's years of experience and seniority against the JD requirements.
   - If meeting/exceeding required level: 30 points. If partially meeting: proportional points (e.g. 15-25 points). If no experience provided: 5 points.
3. Architecture & Domain Alignment (Max 20 points):
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
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: geminiResponseSchema,
                temperature: 0.0,
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

// OpenAPI Schema for Tailored 1-Page ATS Resume Output
const atsResumeOpenApiSchema = {
    type: "OBJECT",
    properties: {
        fullName: { type: "STRING" },
        targetTitle: { type: "STRING" },
        contact: {
            type: "OBJECT",
            properties: {
                email: { type: "STRING" },
                phone: { type: "STRING" },
                location: { type: "STRING" },
                linkedin: { type: "STRING" },
                github: { type: "STRING" },
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
        projects: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING" },
                    subtitle: { type: "STRING" },
                    technologies: { type: "ARRAY", items: { type: "STRING" } },
                    bullets: { type: "ARRAY", items: { type: "STRING" } },
                    link: { type: "STRING" },
                },
                required: ["title", "technologies", "bullets"],
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
                required: ["institution", "degree"],
            },
        },
        achievements: {
            type: "ARRAY",
            items: { type: "STRING" },
        },
    },
    required: [
        "fullName",
        "targetTitle",
        "contact",
        "summary",
        "technicalSkills",
        "projects",
        "education",
        "achievements",
    ],
};

/**
 * Generates a tailored, ATS-compliant 1-page resume JSON structure matching the target JD
 * @param {Object} params
 * @param {string} params.resumeText - Raw candidate resume text
 * @param {string} params.jobDescription - Target Job Description
 * @param {string} [params.selfDescription] - Candidate extra details
 * @param {Object} [params.user] - User object (fallback name/email)
 * @returns {Promise<Object>} - Tailored ATS resume data
 */
const generateTailoredAtsResume = async ({
    resumeText = "",
    jobDescription = "",
    selfDescription = "",
    user = {},
}) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
        // Fallback mock tailored resume data
        return {
            fullName: user.username || "Saurabh Singh",
            targetTitle: "AI Full Stack Developer",
            contact: {
                email: user.email || "samratsaurabh2003@gmail.com",
                phone: "+91-8545027066",
                location: "Warangal, India",
                linkedin: "https://linkedin.com/in/saurabh-singh",
                github: "https://github.com/SaurabhSinghR45",
            },
            summary: "Results-driven Full Stack AI Developer and MCA student at NIT Warangal with proven expertise in Python, FastAPI, React 19, and asynchronous system architecture (asyncio). Experienced in architecting autonomous multi-agent pipelines, semantic embedding search systems, and high-performance containerized REST APIs with AppSec compliance.",
            technicalSkills: [
                { category: "Languages", skills: ["Python", "JavaScript", "C++", "Java", "SQL", "HTML5", "CSS3"] },
                { category: "Frameworks & AI", skills: ["FastAPI", "React 19", "LLM Multi-Agent Systems", "Sentence Transformers", "Hugging Face", "Tailwind CSS", "Pydantic", "SQLAlchemy"] },
                { category: "Databases & Storage", skills: ["SQLite", "PostgreSQL (Familiar)", "Vector Embeddings", "Relational Modeling"] },
                { category: "Tools & DevOps", skills: ["Docker", "Git", "GitHub", "Postman", "Asyncio", "Monaco Editor", "REST APIs"] },
            ],
            projects: [
                {
                    title: "CodeReviewPro – Autonomous Multi-Agent Code Intelligence Platform",
                    technologies: ["Python", "FastAPI", "React 19", "Docker", "Multi-Agent AI", "Tailwind CSS"],
                    link: "https://github.com/SaurabhSinghR45",
                    bullets: [
                        "Architected an enterprise-grade automated code audit platform executing 4 parallel specialist agents (Style, Bug, AppSec, Performance) via asynchronous orchestration to deliver comprehensive PR reviews.",
                        "Engineered universal GitHub repository inspection with interactive syntax-highlighted Git diff fixes, OWASP/CWE security scanning, and containerized deployment with sub-second response times.",
                        "Constructed a responsive developer UI in React 19 and Tailwind CSS integrating Monaco Editor for live side-by-side code diff visualization.",
                    ],
                },
                {
                    title: "VibeSync – AI-Powered Music Recommendation Engine",
                    technologies: ["Python", "Sentence Transformers", "Hugging Face", "Spotify API", "Tailwind CSS"],
                    link: "https://github.com/SaurabhSinghR45",
                    bullets: [
                        "Developed a hybrid AI recommendation engine suggesting tracks using semantic similarity embeddings generated via Sentence Transformers on lyrics and natural language queries.",
                        "Integrated Hugging Face emotion detection models and Spotify Web API to dynamically serve personalized track playlists with sub-300ms retrieval latency.",
                    ],
                },
            ],
            education: [
                {
                    institution: "National Institute of Technology, Warangal",
                    degree: "Master of Computer Applications (MCA)",
                    duration: "2024 – 2027",
                    score: "CGPA: 7.30",
                },
                {
                    institution: "Lucknow Christian Degree College, Lucknow",
                    degree: "Bachelor of Science (B.Sc)",
                    duration: "2020 – 2023",
                    score: "73.42%",
                },
            ],
            achievements: [
                "Solved 550+ Data Structures and Algorithms problems across LeetCode and GeeksforGeeks (GFG).",
                "Architected and deployed CodeReviewPro, an autonomous multi-agent developer platform with parallel async AI pipelines and automated AppSec auditing.",
            ],
        };
    }

    const ai = getGeminiClient();

    const prompt = `
You are an expert Executive Resume Writer and ATS Optimization Specialist.
Your task is to take the candidate's authentic resume data and tailor it strictly for the target Job Description to maximize ATS (Applicant Tracking System) keyword match, clarity, and recruiter appeal.

--- CANDIDATE'S AUTHENTIC RESUME & PROFILE ---
${resumeText ? resumeText : "Candidate Name: " + (user.username || "Candidate Profile") + "\nEmail: " + (user.email || "candidate@example.com")}
${selfDescription ? "\nAdditional Candidate Info: " + selfDescription : ""}

--- TARGET JOB DESCRIPTION ---
${jobDescription}

--- INSTRUCTIONS ---
1. Extract the candidate's real name, education history, and projects accurately from their uploaded resume. NEVER hallucinate fake companies or fake degrees.
2. Refine the Professional Summary to be a compelling 3-4 sentence pitch tailored specifically to the target role with strong technical keywords from the JD.
3. Optimize the Project bullets using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" with strong action verbs (Architected, Spearheaded, Engineered, Integrated, Containerized).
4. Organize Technical Skills into clean, ATS-scannable categories (Languages, Frameworks & AI, Databases & Storage, Developer Tools & DevOps).
5. Ensure all data fits into a clean, 1-page format without fluff.

Return ONLY a valid JSON object matching the requested schema.
`;

    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: atsResumeOpenApiSchema,
                temperature: 0.1,
            },
        });

        const rawText = response.text;
        if (!rawText) {
            throw new Error("Empty response received from Gemini ATS Resume generator");
        }

        const parsedJson = JSON.parse(rawText);
        return parsedJson;
    } catch (error) {
        console.error("[Gemini ATS Resume Generator Error]:", error);
        throw new Error(`Failed to generate tailored ATS Resume: ${error.message}`);
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

    const ai = getGeminiClient();

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
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: answerEvaluationOpenApiSchema,
                temperature: 0.1,
            },
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

    const ai = getGeminiClient();

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
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: multiRoleComparisonOpenApiSchema,
                temperature: 0.1,
            },
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
