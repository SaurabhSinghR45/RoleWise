const multer = require("multer");
const pdf = require("pdf-parse");

// Multer in-memory storage configuration
const storage = multer.memoryStorage();

// File filter accepting only PDF files
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "application/pdf" ||
        file.originalname.toLowerCase().endsWith(".pdf")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file format. Only PDF files are allowed."), false);
    }
};

// Multer upload middleware (Max 10MB)
const uploadResume = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
}).single("resume");

/**
 * Extracts plain text from an in-memory PDF buffer
 * @param {Buffer} pdfBuffer - The raw PDF buffer
 * @returns {Promise<string>} - Extracted text from PDF
 */
const extractTextFromPDF = async (pdfBuffer) => {
    try {
        if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
            throw new Error("Invalid PDF buffer provided");
        }
        const data = await pdf(pdfBuffer);
        return data.text ? data.text.trim() : "";
    } catch (error) {
        console.error("[PDF Parse Error]:", error.message);
        throw new Error(`Failed to parse PDF resume: ${error.message}`);
    }
};

module.exports = {
    uploadResume,
    extractTextFromPDF,
};
