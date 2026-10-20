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
 * Clean URL link for display
 */
const cleanLinkText = (link = "") => {
    return link.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
};

/**
 * NIT Warangal Official Crest Vector SVG
 */
const NITW_CREST_SVG = `
<svg width="65" height="75" viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">
    <ellipse cx="50" cy="55" rx="46" ry="48" stroke="#000" stroke-width="2.5" fill="#fff"/>
    <ellipse cx="50" cy="55" rx="39" ry="41" stroke="#000" stroke-width="1.5" fill="none"/>
    <path d="M 22 28 A 42 42 0 0 1 78 28" fill="none" stroke="#000" stroke-width="1" stroke-dasharray="1 1"/>
    <text font-family="'Times New Roman', serif" font-size="7.5" font-weight="bold" fill="#000" letter-spacing="0.5">
        <textPath href="#nitwTextPath" startOffset="50%" text-anchor="middle">
            NATIONAL INSTITUTE OF TECHNOLOGY
        </textPath>
    </text>
    <path id="nitwTextPath" d="M 18 55 A 33 34 0 0 1 82 55" fill="none"/>
    <circle cx="50" cy="55" r="24" stroke="#000" stroke-width="1.8" fill="#fff"/>
    <!-- Cogwheel / Gear teeth -->
    <path d="M 50 33 L 52 37 L 48 37 Z M 50 77 L 52 73 L 48 73 Z M 28 55 L 32 57 L 32 53 Z M 72 55 L 68 57 L 68 53 Z M 35 40 L 38 43 L 36 45 Z M 65 70 L 62 67 L 64 65 Z M 35 70 L 38 67 L 36 65 Z M 65 40 L 62 43 L 64 45 Z" fill="#000"/>
    <!-- Rising Sun and Rays -->
    <path d="M 40 55 A 10 10 0 0 1 60 55 Z" fill="#000"/>
    <line x1="50" y1="41" x2="50" y2="44" stroke="#000" stroke-width="1.5"/>
    <line x1="43" y1="44" x2="45" y2="46" stroke="#000" stroke-width="1.5"/>
    <line x1="57" y1="44" x2="55" y2="46" stroke="#000" stroke-width="1.5"/>
    <!-- Open Book / Technical Symbol -->
    <path d="M 40 63 Q 50 60 50 65 Q 50 60 60 63 L 59 66 Q 50 63 50 67 Q 50 63 41 66 Z" fill="#000"/>
    <text x="50" y="87" font-family="'Times New Roman', serif" font-size="7" font-weight="bold" text-anchor="middle" fill="#000" letter-spacing="1">
        WARANGAL
    </text>
    <text x="50" y="96" font-family="'Times New Roman', serif" font-size="6" font-weight="bold" text-anchor="middle" fill="#000">
        प्रज्ञानं ब्रह्म
    </text>
</svg>
`;

// ============================================================================
// TEMPLATE 1: NIT WARANGAL COLLEGE PLACEMENT TEMPLATE (Authentic to user PDF)
// ============================================================================
const buildNitwCollegeResumeHtml = (resumeData = {}) => {
    const {
        fullName = "Your Name",
        rollNo = "xxxxxxx",
        subHeader = "Your Program",
        targetTitle = "Your Course",
        contact = {},
        education = [],
        experience = [],
        projects = [],
        technicalSkills = [],
        achievements = [],
    } = resumeData;

    // Categorized skills mapping
    let languagesStr = "";
    let developerToolsStr = "";
    let frameworksStr = "";
    let cloudDbStr = "";
    let softSkillsStr = "";
    let courseworkStr = "";

    if (Array.isArray(technicalSkills)) {
        technicalSkills.forEach(cat => {
            const name = (cat.category || "").toLowerCase();
            const skills = Array.isArray(cat.skills) ? cat.skills.join(", ") : String(cat.skills || "");
            if (name.includes("lang")) languagesStr = skills;
            else if (name.includes("tool") || name.includes("developer")) developerToolsStr = skills;
            else if (name.includes("frame") || name.includes("lib")) frameworksStr = skills;
            else if (name.includes("cloud") || name.includes("database") || name.includes("data")) cloudDbStr = skills;
            else if (name.includes("soft")) softSkillsStr = skills;
            else if (name.includes("course") || name.includes("core")) courseworkStr = skills;
            else if (!languagesStr) languagesStr = skills;
            else if (!frameworksStr) frameworksStr = skills;
            else developerToolsStr += (developerToolsStr ? ", " : "") + skills;
        });
    }

    if (!languagesStr) languagesStr = "C/C++, Python, Java, JavaScript, SQL";
    if (!developerToolsStr) developerToolsStr = "Git, GitHub, VS Code, Postman, Docker";
    if (!frameworksStr) frameworksStr = "React.js, Node.js, Express.js, Tailwind CSS";
    if (!cloudDbStr) cloudDbStr = "MongoDB, PostgreSQL, AWS, Redis";
    if (!courseworkStr) courseworkStr = "Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks";
    if (!softSkillsStr) softSkillsStr = "Problem Solving, Analytical Thinking, Leadership, Collaboration";

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(fullName)} - NIT Warangal Resume</title>
    <style>
        @page {
            size: A4;
            margin: 8mm 12mm 8mm 12mm;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Times New Roman', Times, Georgia, serif;
            color: #000000;
            background: #ffffff;
            font-size: 9.5pt;
            line-height: 1.25;
            -webkit-font-smoothing: antialiased;
        }
        /* Top Header Grid */
        .nitw-header {
            display: flex;
            align-items: flex-start;
            justifyContent: space-between;
            margin-bottom: 7px;
            padding-bottom: 4px;
        }
        .nitw-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .nitw-candidate-meta {
            display: flex;
            flex-direction: column;
            gap: 1.5px;
        }
        .nitw-name {
            font-size: 13pt;
            font-weight: bold;
            letter-spacing: 0.2px;
        }
        .nitw-detail {
            font-size: 9pt;
            color: #111;
        }
        .nitw-institute {
            font-size: 9pt;
            font-weight: 500;
            margin-top: 2px;
        }
        .nitw-right {
            text-align: right;
            font-size: 8.8pt;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .nitw-right a {
            color: #000000;
            text-decoration: none;
        }
        .nitw-icon-row {
            display: flex;
            align-items: center;
            justifyContent: flex-end;
            gap: 5px;
        }

        /* Section Styling */
        .section-header {
            font-size: 9.8pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #000000;
            padding-bottom: 1.5px;
            margin-top: 7px;
            margin-bottom: 4px;
        }
        .entry-block {
            margin-bottom: 5.5px;
        }
        .entry-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-size: 9.2pt;
        }
        .entry-title {
            font-weight: bold;
        }
        .entry-title::before {
            content: "• ";
            font-size: 10pt;
        }
        .entry-role {
            font-style: italic;
            font-size: 8.8pt;
            padding-left: 10px;
        }
        .entry-right {
            font-size: 8.8pt;
            white-space: nowrap;
        }
        .bullet-list {
            list-style: none;
            padding-left: 14px;
            margin-top: 1.5px;
        }
        .bullet-list li {
            position: relative;
            padding-left: 10px;
            font-size: 8.7pt;
            line-height: 1.25;
            margin-bottom: 1px;
            text-align: justify;
        }
        .bullet-list li::before {
            content: "–";
            position: absolute;
            left: 0;
            font-size: 9pt;
        }

        /* Skills Table Layout */
        .skills-grid {
            display: table;
            width: 100%;
            font-size: 8.7pt;
            margin-top: 2px;
        }
        .skills-row {
            display: table-row;
        }
        .skills-label {
            display: table-cell;
            font-weight: bold;
            width: 130px;
            padding: 1px 0;
            white-space: nowrap;
        }
        .skills-val {
            display: table-cell;
            padding: 1px 0;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="nitw-header">
        <div class="nitw-left">
            ${NITW_CREST_SVG}
            <div class="nitw-candidate-meta">
                <div class="nitw-name">${escapeHtml(fullName)}</div>
                <div class="nitw-detail">Roll No.: ${escapeHtml(rollNo || "xxxxxxx")}</div>
                <div class="nitw-detail">${escapeHtml(subHeader || "B.Tech")}</div>
                <div class="nitw-detail">${escapeHtml(targetTitle || "Computer Science and Engineering")}</div>
                <div class="nitw-institute">National Institute Of Technology, Warangal</div>
            </div>
        </div>

        <div class="nitw-right">
            ${contact.phone ? `<div class="nitw-icon-row"><span>☎</span> <span>${escapeHtml(contact.phone)}</span></div>` : ""}
            ${contact.email ? `<div class="nitw-icon-row"><span>✉</span> <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></div>` : ""}
            ${contact.secondaryEmail ? `<div class="nitw-icon-row"><span>✉</span> <a href="mailto:${escapeHtml(contact.secondaryEmail)}">${escapeHtml(contact.secondaryEmail)}</a></div>` : ""}
            ${contact.github ? `<div class="nitw-icon-row"><span>⌨</span> <a href="https://${cleanLinkText(contact.github)}">GitHub Profile</a></div>` : ""}
            ${contact.linkedin ? `<div class="nitw-icon-row"><span>in</span> <a href="https://${cleanLinkText(contact.linkedin)}">LinkedIn Profile</a></div>` : ""}
            ${contact.leetcode ? `<div class="nitw-icon-row"><span>LC</span> <a href="https://${cleanLinkText(contact.leetcode)}">LeetCode Profile</a></div>` : ""}
        </div>
    </div>

    <!-- Education -->
    <div class="section-header">Education</div>
    ${(education && education.length ? education : [
        { institution: "National Institute of Technology, Warangal", degree: "B.Tech in Computer Science and Engineering", duration: "2021 – 2025", score: "CGPA: 8.85 / 10" },
        { institution: "Kendriya Vidyalaya / Higher Secondary", degree: "CBSE Class XII (PCM)", duration: "2019 – 2021", score: "Percentage: 94.6%" }
    ]).map(edu => `
        <div class="entry-block">
            <div class="entry-row">
                <span class="entry-title">${escapeHtml(edu.institution)}</span>
                <span class="entry-right">${escapeHtml(edu.duration || "")}</span>
            </div>
            <div class="entry-row" style="padding-left: 10px;">
                <span style="font-size: 8.8pt;">${escapeHtml(edu.degree || "")}</span>
                <span class="entry-right"><strong>${escapeHtml(edu.score || "")}</strong></span>
            </div>
        </div>
    `).join("")}

    <!-- Experience -->
    ${experience?.length ? `
    <div class="section-header">Experience</div>
    ${experience.map(exp => `
        <div class="entry-block">
            <div class="entry-row">
                <span class="entry-title">${escapeHtml(exp.company || exp.role)}</span>
                <span class="entry-right">${escapeHtml(exp.duration || "")}</span>
            </div>
            <div class="entry-row" style="padding-left: 10px;">
                <span class="entry-role">${escapeHtml(exp.role || "")}</span>
                <span class="entry-right" style="font-size: 8.5pt;">${escapeHtml(exp.location || "")}</span>
            </div>
            <ul class="bullet-list">
                ${(exp.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    <!-- Personal Projects -->
    ${projects?.length ? `
    <div class="section-header">Personal Projects</div>
    ${projects.map(proj => `
        <div class="entry-block">
            <div class="entry-row">
                <span class="entry-title">${escapeHtml(proj.title)}</span>
                <span class="entry-right">${escapeHtml(proj.duration || "")}</span>
            </div>
            <ul class="bullet-list">
                ${proj.technologies?.length ? `<li><strong>Tools & technologies used:</strong> ${escapeHtml(Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies)}</li>` : ""}
                ${(proj.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    <!-- Technical Skills and Interests -->
    <div class="section-header">Technical Skills and Interests</div>
    <div class="skills-grid">
        <div class="skills-row">
            <div class="skills-label">Languages:</div>
            <div class="skills-val">${escapeHtml(languagesStr)}</div>
        </div>
        <div class="skills-row">
            <div class="skills-label">Developer Tools:</div>
            <div class="skills-val">${escapeHtml(developerToolsStr)}</div>
        </div>
        <div class="skills-row">
            <div class="skills-label">Frameworks:</div>
            <div class="skills-val">${escapeHtml(frameworksStr)}</div>
        </div>
        <div class="skills-row">
            <div class="skills-label">Cloud/Databases:</div>
            <div class="skills-val">${escapeHtml(cloudDbStr)}</div>
        </div>
        <div class="skills-row">
            <div class="skills-label">Coursework:</div>
            <div class="skills-val">${escapeHtml(courseworkStr)}</div>
        </div>
        <div class="skills-row">
            <div class="skills-label">Soft Skills:</div>
            <div class="skills-val">${escapeHtml(softSkillsStr)}</div>
        </div>
    </div>

    <!-- Positions of Responsibility -->
    <div class="section-header">Positions of Responsibility</div>
    <div class="entry-block">
        <div class="entry-row">
            <span class="entry-title">Technical Lead / Executive Member, Computer Science Association</span>
            <span class="entry-right">2023 – 2024</span>
        </div>
        <ul class="bullet-list">
            <li>Organized national-level hackathons and technical symposiums with 1,200+ collegiate participants.</li>
            <li>Conducted hands-on workshops on full-stack architecture, Git collaboration, and algorithmic design.</li>
        </ul>
    </div>

    <!-- Achievements -->
    ${achievements?.length ? `
    <div class="section-header">Achievements</div>
    <ul class="bullet-list" style="padding-left: 6px;">
        ${achievements.map(ach => `<li>${escapeHtml(typeof ach === 'string' ? ach : ach.title || '')}</li>`).join("")}
    </ul>
    ` : `
    <div class="section-header">Achievements</div>
    <ul class="bullet-list" style="padding-left: 6px;">
        <li>Solved 600+ problems on LeetCode & Codeforces, achieving top 5% global contest rating.</li>
        <li>Winner / Finalist at National Level Hackathon for AI-driven career and workflow acceleration.</li>
    </ul>
    `}

</body>
</html>`;
};

// ============================================================================
// TEMPLATE 2: PURE ATS (Adam Jones Style - Minimalist High Parsing Single Column)
// ============================================================================
const buildPureAtsResumeHtml = (resumeData = {}) => {
    const {
        fullName = "Candidate Profile",
        targetTitle = "Software Engineer",
        contact = {},
        summary = "",
        education = [],
        experience = [],
        projects = [],
        technicalSkills = [],
    } = resumeData;

    const contactParts = [];
    if (contact.location) contactParts.push(escapeHtml(contact.location));
    if (contact.email) contactParts.push(`<a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a>`);
    if (contact.phone) contactParts.push(escapeHtml(contact.phone));
    if (contact.linkedin) contactParts.push(`<a href="https://${cleanLinkText(contact.linkedin)}">LinkedIn</a>`);
    if (contact.github) contactParts.push(`<a href="https://${cleanLinkText(contact.github)}">GitHub</a>`);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(fullName)} - Pure ATS Resume</title>
    <style>
        @page { size: A4; margin: 9mm 13mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #111; font-size: 9.3pt; line-height: 1.32; }
        .name { font-size: 17pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; }
        .target { font-size: 10pt; font-weight: 600; color: #334155; margin-top: 1px; }
        .contact { font-size: 8.5pt; color: #475569; margin-top: 3px; padding-bottom: 6px; border-bottom: 1.5px solid #0f172a; }
        .contact a { color: #0f172a; text-decoration: none; }
        .sec-title { font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-top: 8px; margin-bottom: 4px; }
        .job-header { display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; font-size: 9.3pt; }
        .job-sub { display: flex; justify-content: space-between; font-size: 8.7pt; color: #334155; font-style: italic; margin-bottom: 2px; }
        .bullets { list-style-type: square; padding-left: 15px; margin-bottom: 5px; }
        .bullets li { font-size: 8.7pt; line-height: 1.28; margin-bottom: 1.5px; text-align: justify; }
        .summary-text { font-size: 8.8pt; line-height: 1.32; text-align: justify; margin-bottom: 5px; color: #1e293b; }
    </style>
</head>
<body>
    <div class="name">${escapeHtml(fullName)}</div>
    ${targetTitle ? `<div class="target">${escapeHtml(targetTitle)}</div>` : ""}
    <div class="contact">${contactParts.join(" | ")}</div>

    ${summary ? `
    <div class="sec-title">Professional Summary</div>
    <div class="summary-text">${escapeHtml(summary)}</div>
    ` : ""}

    ${experience?.length ? `
    <div class="sec-title">Professional Experience</div>
    ${experience.map(exp => `
        <div style="margin-bottom: 5px;">
            <div class="job-header">
                <span>${escapeHtml(exp.role)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(exp.duration)}</span>
            </div>
            <div class="job-sub">
                <span>${escapeHtml(exp.company)}</span>
                <span>${escapeHtml(exp.location || "")}</span>
            </div>
            <ul class="bullets">
                ${(exp.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    ${projects?.length ? `
    <div class="sec-title">Key Projects & Engineering Work</div>
    ${projects.map(p => `
        <div style="margin-bottom: 5px;">
            <div class="job-header">
                <span>${escapeHtml(p.title)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(p.duration || "")}</span>
            </div>
            <ul class="bullets">
                ${(p.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    <div class="sec-title">Education</div>
    ${education.map(edu => `
        <div style="margin-bottom: 4px;">
            <div class="job-header">
                <span>${escapeHtml(edu.institution)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(edu.duration)}</span>
            </div>
            <div class="job-sub">
                <span>${escapeHtml(edu.degree)}</span>
                <span><strong>${escapeHtml(edu.score || "")}</strong></span>
            </div>
        </div>
    `).join("")}

    <div class="sec-title">Skills & Technical Competencies</div>
    <div style="font-size: 8.8pt; line-height: 1.35;">
        ${technicalSkills.map(cat => `
            <div><strong>${escapeHtml(cat.category)}:</strong> ${escapeHtml(Array.isArray(cat.skills) ? cat.skills.join(", ") : cat.skills)}</div>
        `).join("")}
    </div>
</body>
</html>`;
};

// ============================================================================
// TEMPLATE 3: PRIME ATS (Herman Walton Style - Modern Blue Accents & 4-Col Grid)
// ============================================================================
const buildPrimeAtsResumeHtml = (resumeData = {}) => {
    const {
        fullName = "Candidate Profile",
        targetTitle = "Senior Software Engineer",
        contact = {},
        summary = "",
        education = [],
        experience = [],
        projects = [],
        technicalSkills = [],
    } = resumeData;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(fullName)} - Prime ATS Resume</title>
    <style>
        @page { size: A4; margin: 8mm 12mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; font-size: 9pt; line-height: 1.3; }
        .name { font-size: 19pt; font-weight: 800; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.5px; }
        .title { font-size: 10.5pt; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-top: 1px; }
        .contact { font-size: 8.2pt; color: #475569; margin-top: 3px; padding-bottom: 5px; border-bottom: 2px solid #1d4ed8; }
        .contact a { color: #1d4ed8; text-decoration: none; }
        .sec-title { font-size: 9.5pt; font-weight: 800; color: #1d4ed8; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-top: 8px; margin-bottom: 4px; }
        .job-title { font-weight: 700; font-size: 9.2pt; color: #0f172a; }
        .job-row { display: flex; justify-content: space-between; align-items: baseline; }
        .bullets { list-style-type: disc; padding-left: 15px; margin-top: 2px; margin-bottom: 5px; }
        .bullets li { font-size: 8.6pt; line-height: 1.26; margin-bottom: 1.5px; text-align: justify; }
        /* 4-column skill layout */
        .skills-table { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 8.2pt; margin-top: 3px; }
        .skill-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 6px; border-radius: 4px; }
        .skill-box strong { display: block; color: #1d4ed8; font-size: 8.2pt; margin-bottom: 2px; }
    </style>
</head>
<body>
    <div class="name">${escapeHtml(fullName)}</div>
    <div class="title">${escapeHtml(targetTitle)}</div>
    <div class="contact">
        ${[contact.location, contact.phone, contact.email, contact.linkedin ? `linkedin.com/in/${cleanLinkText(contact.linkedin)}` : "", contact.github ? `github.com/${cleanLinkText(contact.github)}` : ""].filter(Boolean).join("  •  ")}
    </div>

    ${summary ? `
    <div class="sec-title">Summary</div>
    <p style="font-size: 8.7pt; line-height: 1.3; text-align: justify; margin-bottom: 5px;">${escapeHtml(summary)}</p>
    ` : ""}

    ${experience?.length ? `
    <div class="sec-title">Professional Experience</div>
    ${experience.map(exp => `
        <div style="margin-bottom: 5px;">
            <div class="job-row">
                <span class="job-title">${escapeHtml(exp.role)}, ${escapeHtml(exp.company)}</span>
                <span style="font-size: 8.5pt; font-weight: 600;">${escapeHtml(exp.duration)}</span>
            </div>
            <ul class="bullets">
                ${(exp.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    ${projects?.length ? `
    <div class="sec-title">Key Projects & System Design</div>
    ${projects.map(p => `
        <div style="margin-bottom: 5px;">
            <div class="job-row">
                <span class="job-title">${escapeHtml(p.title)}</span>
                <span style="font-size: 8.5pt;">${escapeHtml(p.duration || "")}</span>
            </div>
            <ul class="bullets">
                ${(p.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    <div class="sec-title">Education</div>
    ${education.map(edu => `
        <div class="job-row" style="margin-bottom: 3px;">
            <div>
                <div class="job-title">${escapeHtml(edu.degree)}</div>
                <div style="font-size: 8.5pt; color: #475569;">${escapeHtml(edu.institution)}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 8.5pt; font-weight: 600;">${escapeHtml(edu.duration)}</div>
                <div style="font-size: 8.5pt; font-weight: 700; color: #1d4ed8;">${escapeHtml(edu.score || "")}</div>
            </div>
        </div>
    `).join("")}

    <div class="sec-title">Technical Skills</div>
    <div class="skills-table">
        ${technicalSkills.slice(0, 4).map(cat => `
            <div class="skill-box">
                <strong>${escapeHtml(cat.category)}</strong>
                <span>${escapeHtml(Array.isArray(cat.skills) ? cat.skills.join(", ") : cat.skills)}</span>
            </div>
        `).join("")}
    </div>
</body>
</html>`;
};

// ============================================================================
// TEMPLATE 4: TRADITIONAL EXECUTIVE (Tiffany Giroux Style - Serif & Diamond Bullets)
// ============================================================================
const buildTraditionalResumeHtml = (resumeData = {}) => {
    const {
        fullName = "Candidate Profile",
        targetTitle = "Executive & Logistics",
        contact = {},
        summary = "",
        education = [],
        experience = [],
        projects = [],
        technicalSkills = [],
    } = resumeData;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(fullName)} - Traditional Resume</title>
    <style>
        @page { size: A4; margin: 9mm 13mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', Times, serif; color: #000; font-size: 9.2pt; line-height: 1.3; }
        .header-center { text-align: center; margin-bottom: 6px; }
        .name { font-size: 18pt; font-weight: normal; letter-spacing: 1px; }
        .title { font-size: 9.5pt; font-style: italic; color: #333; margin-top: 1px; }
        .contact-box { display: flex; justify-content: space-between; font-size: 8.7pt; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 3px 0; margin-top: 5px; }
        .contact-box a { color: #000; text-decoration: none; }
        .banner-header { background: #e2e8f0; text-align: center; font-weight: bold; font-size: 9pt; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 0; margin-top: 8px; margin-bottom: 5px; border-top: 1px solid #000; border-bottom: 1px solid #000; }
        .exp-row { display: flex; justify-content: space-between; align-items: baseline; font-weight: bold; font-size: 9.3pt; }
        .exp-row::before { content: "❖ "; font-size: 8pt; margin-right: 4px; }
        .bullets { list-style: none; padding-left: 15px; margin-top: 2px; margin-bottom: 5px; }
        .bullets li { position: relative; padding-left: 10px; font-size: 8.7pt; line-height: 1.28; margin-bottom: 1.5px; }
        .bullets li::before { content: "•"; position: absolute; left: 0; }
    </style>
</head>
<body>
    <div class="header-center">
        <div class="name">${escapeHtml(fullName)}</div>
        <div class="title">${escapeHtml(targetTitle)}</div>
        <div style="font-size: 8.5pt; color: #444; margin-top: 2px;">${escapeHtml(contact.location || "")}</div>
    </div>

    <div class="contact-box">
        <span>${escapeHtml(contact.phone || "")}</span>
        <span><a href="mailto:${escapeHtml(contact.email || "")}">${escapeHtml(contact.email || "")}</a></span>
    </div>

    ${summary ? `
    <div class="banner-header">Profile</div>
    <p style="font-size: 8.8pt; font-style: italic; text-align: justify; line-height: 1.33; padding: 0 4px; margin-bottom: 5px;">${escapeHtml(summary)}</p>
    ` : ""}

    ${experience?.length ? `
    <div class="banner-header">Experience</div>
    ${experience.map(exp => `
        <div style="margin-bottom: 5px;">
            <div class="exp-row">
                <span>${escapeHtml(exp.role)} – ${escapeHtml(exp.company)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(exp.duration)}</span>
            </div>
            <ul class="bullets">
                ${(exp.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    ${projects?.length ? `
    <div class="banner-header">Projects & Engagements</div>
    ${projects.map(p => `
        <div style="margin-bottom: 5px;">
            <div class="exp-row">
                <span>${escapeHtml(p.title)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(p.duration || "")}</span>
            </div>
            <ul class="bullets">
                ${(p.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    <div class="banner-header">Education</div>
    ${education.map(edu => `
        <div class="exp-row" style="margin-bottom: 3px;">
            <span>${escapeHtml(edu.degree)}, ${escapeHtml(edu.institution)}</span>
            <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(edu.duration)}</span>
        </div>
    `).join("")}
</body>
</html>`;
};

// ============================================================================
// TEMPLATE 5: CLASSIC PROFESSIONAL (Logan Mitchell Style)
// ============================================================================
const buildClassicResumeHtml = (resumeData = {}) => {
    const {
        fullName = "Logan Mitchell",
        targetTitle = "Software Engineer",
        contact = {},
        summary = "",
        education = [],
        experience = [],
        projects = [],
        technicalSkills = [],
    } = resumeData;

    const contactParts = [
        contact.location,
        contact.phone,
        contact.email,
        contact.linkedin ? `linkedin.com/in/${cleanLinkText(contact.linkedin)}` : "",
        contact.github ? `github.com/${cleanLinkText(contact.github)}` : "",
    ].filter(Boolean);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(fullName)} - Classic Resume</title>
    <style>
        @page { size: A4; margin: 8mm 12mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Times New Roman', Georgia, serif; color: #111; font-size: 9.2pt; line-height: 1.28; }
        .center-hdr { text-align: center; margin-bottom: 6px; }
        .name-title { font-size: 13pt; font-weight: bold; letter-spacing: 0.3px; }
        .contact-sub { font-size: 8.5pt; color: #333; margin-top: 2px; }
        .contact-sub a { color: #111; text-decoration: none; }
        .meta-table { width: 100%; border: 1px solid #d1d5db; margin: 6px 0 8px 0; border-collapse: collapse; font-size: 8.2pt; }
        .meta-table td { padding: 3px 8px; border: 1px solid #e5e7eb; }
        .sec-header { font-size: 9.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 1.5px; margin-top: 7px; margin-bottom: 4px; }
        .role-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 9.2pt; font-weight: bold; }
        .company-row { display: flex; justify-content: space-between; font-size: 8.8pt; color: #333; font-style: italic; margin-bottom: 2px; }
        .bullets { list-style-type: disc; padding-left: 15px; margin-top: 1.5px; margin-bottom: 4px; }
        .bullets li { font-size: 8.6pt; line-height: 1.25; margin-bottom: 1.5px; text-align: justify; }
        .skills-grid { width: 100%; font-size: 8.6pt; margin-top: 2px; }
        .skill-row { display: flex; margin-bottom: 2px; }
        .skill-lbl { font-weight: bold; text-transform: uppercase; width: 140px; flex-shrink: 0; font-size: 8.2pt; }
        .skill-vals { flex: 1; }
    </style>
</head>
<body>
    <div class="center-hdr">
        <div class="name-title">${escapeHtml(fullName)}, ${escapeHtml(targetTitle || "Software Engineer")}</div>
        <div class="contact-sub">${contactParts.map(p => escapeHtml(p)).join(", ")}</div>
    </div>

    ${summary ? `
    <div class="sec-header">Profile</div>
    <p style="font-size: 8.8pt; text-align: justify; line-height: 1.3; margin-bottom: 5px;">${escapeHtml(summary)}</p>
    ` : ""}

    ${experience?.length ? `
    <div class="sec-header">Experience</div>
    ${experience.map(exp => `
        <div style="margin-bottom: 5px;">
            <div class="role-row">
                <span>${escapeHtml(exp.role)} &mdash; ${escapeHtml(exp.company)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(exp.location || "")}</span>
            </div>
            <div class="company-row">
                <span>${escapeHtml(exp.duration)}</span>
            </div>
            <ul class="bullets">
                ${(exp.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    ${projects?.length ? `
    <div class="sec-header">Projects</div>
    ${projects.map(p => `
        <div style="margin-bottom: 5px;">
            <div class="role-row">
                <span>${escapeHtml(p.title)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(p.duration || "")}</span>
            </div>
            <ul class="bullets">
                ${(p.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
            </ul>
        </div>
    `).join("")}
    ` : ""}

    <div class="sec-header">Education</div>
    ${education.map(edu => `
        <div style="margin-bottom: 3px;">
            <div class="role-row">
                <span>${escapeHtml(edu.degree)}</span>
                <span style="font-weight: normal; font-size: 8.5pt;">${escapeHtml(edu.duration)}</span>
            </div>
            <div class="company-row">
                <span>${escapeHtml(edu.institution)}</span>
                <span style="font-weight: bold; font-style: normal; color: #1d4ed8;">${escapeHtml(edu.score || "")}</span>
            </div>
        </div>
    `).join("")}

    <div class="sec-header">Skills</div>
    <div class="skills-grid">
        ${technicalSkills.map(cat => `
            <div class="skill-row">
                <span class="skill-lbl">${escapeHtml(cat.category)}:</span>
                <span class="skill-vals">${escapeHtml(Array.isArray(cat.skills) ? cat.skills.join(", ") : cat.skills)}</span>
            </div>
        `).join("")}
    </div>
</body>
</html>`;
};

/**
 * Universal ATS Builder Router
 */
const buildResumeHtmlByTemplate = (resumeData = {}, template = "nitw") => {
    const t = (template || "").toLowerCase();
    switch (t) {
        case "nitw":
        case "college":
        case "campus":
            return buildNitwCollegeResumeHtml(resumeData);
        case "prime_ats":
        case "prime":
            return buildPrimeAtsResumeHtml(resumeData);
        case "traditional":
            return buildTraditionalResumeHtml(resumeData);
        case "classic":
            return buildClassicResumeHtml(resumeData);
        case "pure_ats":
        case "pure":
        default:
            return buildPureAtsResumeHtml(resumeData);
    }
};

/**
 * Original Jake's ATS Resume HTML builder (kept for backward compatibility)
 */
const build1PageAtsResumeHtml = (resumeData = {}) => {
    return buildNitwCollegeResumeHtml(resumeData);
};

/**
 * Generates an ATS-Optimized PDF Buffer via Puppeteer using requested template
 * @param {Object} resumeData - Structured authentic resume data
 * @param {string} template - Chosen template identifier (nitw, pure_ats, prime_ats, classic, traditional)
 * @returns {Promise<Buffer>} - Raw PDF binary buffer
 */
const generateResumePDFBuffer = async (resumeData, template = "nitw") => {
    let browser = null;
    try {
        const html = buildResumeHtmlByTemplate(resumeData, template);

        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-background-networking",
                "--disable-extensions",
                "--disable-sync",
                "--disable-translate",
                "--no-first-run",
                "--mute-audio",
            ],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "domcontentloaded" });

        const pdfUint8Array = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "8mm",
                right: "12mm",
                bottom: "8mm",
                left: "12mm",
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
    buildNitwCollegeResumeHtml,
    buildPureAtsResumeHtml,
    buildPrimeAtsResumeHtml,
    buildTraditionalResumeHtml,
    buildClassicResumeHtml,
    build1PageAtsResumeHtml,
    buildResumeHtmlByTemplate,
    generateResumePDFBuffer,
};
