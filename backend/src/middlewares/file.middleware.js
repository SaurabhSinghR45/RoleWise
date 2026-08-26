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
        throw new Error(`Failed to parse PDF resume: ${error.message}`);
    }
};

module.exports = {
    uploadResume,
    extractTextFromPDF,
};
