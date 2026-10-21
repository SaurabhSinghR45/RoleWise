const multer = require("multer");
const pdf = require("pdf-parse");
let mammoth;
try {
    mammoth = require("mammoth");
} catch (e) {
    mammoth = null;
}

// Multer in-memory storage configuration
const storage = multer.memoryStorage();

// Allowed file extensions and mimetypes for documents (PDF, DOC, DOCX, TXT)
const fileFilter = (req, file, cb) => {
    const originalName = (file.originalname || "").toLowerCase();
    const isPdf = file.mimetype === "application/pdf" || originalName.endsWith(".pdf");
    const isDocx =
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        originalName.endsWith(".docx");
    const isDoc = file.mimetype === "application/msword" || originalName.endsWith(".doc");
    const isTxt = file.mimetype === "text/plain" || originalName.endsWith(".txt");

    if (isPdf || isDocx || isDoc || isTxt) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file format. Only PDF (.pdf), Word (.doc, .docx), and Text (.txt) files are allowed."
            ),
            false
        );
    }
};

// Multer upload middleware supporting both 'resume' and 'jdFile' fields (Max 10MB each)
const multerUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
    },
}).fields([
    { name: "resume", maxCount: 1 },
    { name: "jdFile", maxCount: 1 },
]);

/**
 * Express middleware wrapper to populate req.file and req.jdFile for convenience
 */
const uploadInterviewFiles = (req, res, next) => {
    multerUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload error",
            });
        }
        if (req.files) {
            if (req.files.resume && req.files.resume[0]) {
                req.file = req.files.resume[0]; // backward-compatible alias
            }
            if (req.files.jdFile && req.files.jdFile[0]) {
                req.jdFile = req.files.jdFile[0];
            }
        }
        next();
    });
};

/**
 * Extracts plain text from an in-memory PDF buffer
 * Compatible with both pdf-parse v1 and v2
 * @param {Buffer} pdfBuffer - The raw PDF buffer
 * @returns {Promise<string>} - Extracted text from PDF
 */
const extractTextFromPDF = async (pdfBuffer) => {
    try {
        if (!pdfBuffer) {
            throw new Error("Invalid PDF buffer provided");
        }

        // Support pdf-parse v2.x (PDFParse class)
        if (pdf && pdf.PDFParse) {
            const uint8 = new Uint8Array(pdfBuffer);
            const parser = new pdf.PDFParse(uint8);
            await parser.load();
            const result = await parser.getText();
            return (result?.text || "").trim();
        }

        // Support pdf-parse v1.x (direct callable function)
        if (typeof pdf === "function") {
            const data = await pdf(pdfBuffer);
            return (data?.text || "").trim();
        }

        if (pdf && typeof pdf.default === "function") {
            const data = await pdf.default(pdfBuffer);
            return (data?.text || "").trim();
        }

        throw new Error("Unable to initialize PDF parser engine");
    } catch (error) {
        console.error("[PDF Parse Error]:", error.message);
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
};

/**
 * Extracts plain text from any supported file (PDF, DOCX, DOC, TXT)
 * @param {Object} file - Multer file object with buffer and originalname
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromFile = async (file) => {
    if (!file || !file.buffer) return "";
    const originalName = (file.originalname || "").toLowerCase();

    // 1. PDF file
    if (file.mimetype === "application/pdf" || originalName.endsWith(".pdf")) {
        return await extractTextFromPDF(file.buffer);
    }

    // 2. DOCX file
    if (
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        originalName.endsWith(".docx")
    ) {
        if (mammoth) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            return (result?.value || "").trim();
        }
    }

    // 3. TXT file or generic fallback
    if (file.mimetype === "text/plain" || originalName.endsWith(".txt")) {
        return file.buffer.toString("utf-8").trim();
    }

    // Fallback attempt: try reading as UTF-8 string, or if binary PDF-like, parse
    try {
        const text = file.buffer.toString("utf-8").trim();
        if (text && !text.includes("\u0000")) {
            return text;
        }
    } catch (e) {
        // ignore fallback error
    }

    // Try PDF parser as last resort
    try {
        return await extractTextFromPDF(file.buffer);
    } catch (e) {
        throw new Error(`Unsupported or unreadable file format: ${file.originalname}`);
    }
};

module.exports = {
    uploadResume: uploadInterviewFiles, // backwards compatible alias
    uploadInterviewFiles,
    extractTextFromPDF,
    extractTextFromFile,
};

