const puppeteer = require("puppeteer");

/**
 * Escapes HTML characters for safe rendering
 * @param {string} str 
 * @returns {string}
 */
const escapeHtml = (str = "") => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

/**
 * Builds a single-page ATS-Compliant HTML Document for Resume Export
 * (Adheres to standard Ivy League / FAANG Single-Column ATS Format)
 * @param {Object} resumeData - Tailored ATS resume data
 * @returns {string} - Full HTML string
 */
const build1PageAtsResumeHtml = (resumeData = {}) => {
    const {
        fullName = "Candidate Profile",
        targetTitle = "AI Full Stack Developer",
        contact = {},
        summary = "",
        technicalSkills = [],
        projects = [],
        education = [],
        achievements = [],
    } = resumeData;

    const contactItems = [];
    if (contact.email) contactItems.push(`<span>✉ ${escapeHtml(contact.email)}</span>`);
    if (contact.phone) contactItems.push(`<span>☎ ${escapeHtml(contact.phone)}</span>`);
    if (contact.location) contactItems.push(`<span>📍 ${escapeHtml(contact.location)}</span>`);
    if (contact.linkedin) {
        const link = contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`;
        contactItems.push(`<span>🔗 <a href="${escapeHtml(link)}">LinkedIn</a></span>`);
    }
    if (contact.github) {
        const link = contact.github.startsWith("http") ? contact.github : `https://${contact.github}`;
        contactItems.push(`<span>💻 <a href="${escapeHtml(link)}">GitHub</a></span>`);
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(fullName)} - ATS Resume</title>
    <style>
        @page {
            size: A4;
            margin: 10mm 14mm;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #111827;
            background: #ffffff;
            font-size: 9pt;
            line-height: 1.35;
        }

        a {
            color: #1d4ed8;
            text-decoration: none;
        }

        /* Header */
        .header {
            text-align: center;
            border-bottom: 1.5px solid #1e293b;
            padding-bottom: 6px;
            margin-bottom: 8px;
        }

        .name {
            font-size: 18pt;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #0f172a;
            text-transform: uppercase;
        }

        .target-title {
            font-size: 10pt;
            font-weight: 700;
            color: #2563eb;
            margin-top: 1px;
            letter-spacing: 0.25px;
        }

        .contact-bar {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            font-size: 8pt;
            color: #475569;
            margin-top: 4px;
        }

        /* Section */
        .section {
            margin-bottom: 7px;
        }

        .section-title {
            font-size: 9.5pt;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 2px;
            margin-bottom: 4px;
        }

        /* Summary */
        .summary-p {
            font-size: 8.5pt;
            color: #334155;
            text-align: justify;
            line-height: 1.35;
        }

        /* Skills */
        .skills-list {
            list-style: none;
            padding: 0;
        }

        .skill-item {
            font-size: 8.5pt;
            color: #334155;
            margin-bottom: 2.5px;
        }

        .skill-category {
            font-weight: 700;
            color: #0f172a;
        }

        /* Projects */
        .item-block {
            margin-bottom: 5px;
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2px;
        }

        .item-title {
            font-size: 9pt;
            font-weight: 700;
            color: #0f172a;
        }

        .item-tools {
            font-size: 8pt;
            font-weight: 600;
            color: #2563eb;
            font-style: italic;
        }

        .item-meta {
            font-size: 8pt;
            color: #64748b;
            font-weight: 500;
        }

        .bullet-list {
            list-style: none;
            padding-left: 0;
        }

        .bullet-list li {
            position: relative;
            padding-left: 12px;
            font-size: 8.3pt;
            color: #334155;
            margin-bottom: 2px;
            line-height: 1.3;
            text-align: justify;
        }

        .bullet-list li::before {
            content: "•";
            position: absolute;
            left: 2px;
            color: #0f172a;
            font-weight: bold;
        }

        /* Education */
        .edu-item {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 3px;
            font-size: 8.5pt;
        }

        .edu-main {
            font-weight: 700;
            color: #0f172a;
        }

        .edu-sub {
            color: #475569;
            font-size: 8pt;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <div class="name">${escapeHtml(fullName)}</div>
        <div class="target-title">${escapeHtml(targetTitle)}</div>
        <div class="contact-bar">
            ${contactItems.join(" • ")}
        </div>
    </div>

    <!-- Summary -->
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <p class="summary-p">${escapeHtml(summary)}</p>
    </div>

    <!-- Technical Skills -->
    <div class="section">
        <div class="section-title">Technical Skills</div>
        <ul class="skills-list">
            ${technicalSkills.map(s => `
                <li class="skill-item">
                    <span class="skill-category">${escapeHtml(s.category)}:</span> 
                    ${escapeHtml(s.skills.join(", "))}
                </li>
            `).join("")}
        </ul>
    </div>

    <!-- Projects -->
    <div class="section">
        <div class="section-title">Featured Engineering Projects</div>
        ${projects.map(p => `
            <div class="item-block">
                <div class="item-header">
                    <div>
                        <span class="item-title">${escapeHtml(p.title)}</span>
                        ${p.technologies?.length ? `<span class="item-tools"> | ${escapeHtml(p.technologies.join(", "))}</span>` : ""}
                    </div>
                    ${p.link ? `<div class="item-meta"><a href="${escapeHtml(p.link)}">Project Link ↗</a></div>` : ""}
                </div>
                <ul class="bullet-list">
                    ${(p.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
                </ul>
            </div>
        `).join("")}
    </div>

    <!-- Education -->
    <div class="section">
        <div class="section-title">Education</div>
        ${education.map(e => `
            <div class="edu-item">
                <div>
                    <span class="edu-main">${escapeHtml(e.institution)}</span> — 
                    <span class="edu-sub">${escapeHtml(e.degree)}</span>
                </div>
                <div class="item-meta">
                    ${e.duration ? `<span>${escapeHtml(e.duration)}</span>` : ""}
                    ${e.score ? ` • <strong>${escapeHtml(e.score)}</strong>` : ""}
                </div>
            </div>
        `).join("")}
    </div>

    <!-- Achievements -->
    ${achievements?.length ? `
    <div class="section">
        <div class="section-title">Key Achievements & Leadership</div>
        <ul class="bullet-list">
            ${achievements.map(a => `<li>${escapeHtml(a)}</li>`).join("")}
        </ul>
    </div>
    ` : ""}

</body>
</html>
    `;
};

/**
 * Generates an ATS-Optimized 1-Page PDF buffer using Puppeteer
 * @param {Object} resumeData - Tailored ATS resume data
 * @returns {Promise<Buffer>} - Raw PDF buffer
 */
const generateResumePDFBuffer = async (resumeData = {}) => {
    let browser = null;
    try {
        const html = build1PageAtsResumeHtml(resumeData);

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfUint8Array = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                right: "14mm",
                bottom: "10mm",
                left: "14mm",
            },
        });

        return Buffer.from(pdfUint8Array);
    } catch (error) {
        console.error("[Puppeteer PDF Service Error]:", error);
        throw new Error(`Failed to generate ATS Resume PDF: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = {
    build1PageAtsResumeHtml,
    generateResumePDFBuffer,
};
