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

// Convert Zod Schema to standard JSON Schema for Gemini
const jsonSchema = zodToJsonSchema(interviewReportZodSchema, {
    target: "openAi",
    $refStrategy: "none",
});

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
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jsonSchema,
                temperature: 0.2,
            },
        });

        const rawText = response.text;
        if (!rawText) {
            throw new Error("Empty response received from Gemini API");
        }

        const parsedJson = JSON.parse(rawText);
        // Validate with Zod
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
