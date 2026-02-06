export type Experience = {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  year: string;
};

export type Project = {
  id: string;
  projectName: string;
  description: string;
  techStack: string;
};

export type CvData = {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    github: string;
  };
  professionalSummary?: string;
  targetRole: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  updatedAt?: string; // ISO string
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildAtsContent(cv: CvData) {
  const name = escapeHtml(cv.personal.fullName || '');
  const summary = escapeHtml(cv.professionalSummary?.trim() || '');
  const targetRole = escapeHtml(cv.targetRole || '');

  const contactParts = [
    cv.personal.email,
    cv.personal.phone,
    cv.personal.location,
    cv.personal.linkedIn,
    cv.personal.github,
  ]
    .map((x) => x?.trim())
    .filter(Boolean) as string[];

  const contactLine = escapeHtml(contactParts.join(' • '));

  const skillsLine = escapeHtml((cv.skills ?? []).join(', '));

  const experienceHtml = (cv.experiences ?? [])
    .map((e) => {
      const title = escapeHtml(e.jobTitle || '');
      const company = escapeHtml(e.companyName || '');
      const dates = escapeHtml([e.startDate, e.endDate].filter(Boolean).join(' - '));
      const desc = escapeHtml(e.description || '');

      return `
        <div class="item">
          <div class="row">
            <div class="left"><span class="strong">${title}</span>${company ? `, ${company}` : ''}</div>
            <div class="right">${dates}</div>
          </div>
          ${desc ? `<div class="body">${desc}</div>` : ''}
        </div>
      `;
    })
    .join('');

  const educationHtml = (cv.education ?? [])
    .map((ed) => {
      const degree = escapeHtml(ed.degree || '');
      const inst = escapeHtml(ed.institution || '');
      const year = escapeHtml(ed.year || '');
      return `
        <div class="item">
          <div class="row">
            <div class="left"><span class="strong">${degree}</span>${inst ? `, ${inst}` : ''}</div>
            <div class="right">${year}</div>
          </div>
        </div>
      `;
    })
    .join('');

  const projectsHtml = (cv.projects ?? [])
    .map((p) => {
      const projectName = escapeHtml(p.projectName || '');
      const tech = escapeHtml(p.techStack || '');
      const desc = escapeHtml(p.description || '');
      return `
        <div class="item">
          <div class="row">
            <div class="left"><span class="strong">${projectName}</span>${tech ? ` — ${tech}` : ''}</div>
          </div>
          ${desc ? `<div class="body">${desc}</div>` : ''}
        </div>
      `;
    })
    .join('');

  return {
    name,
    summary,
    targetRole,
    contactLine,
    skillsLine,
    experienceHtml,
    educationHtml,
    projectsHtml,
  };
}

export function renderAtsHtml(cv: CvData) {
  const { name, summary, targetRole, contactLine, skillsLine, experienceHtml, educationHtml, projectsHtml } =
    buildAtsContent(cv);

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Resume</title>
      <style>
        @page { margin: 28px; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: #111;
          line-height: 1.35;
          font-size: 12.5px;
        }
        .name { font-size: 22px; font-weight: 700; margin: 0; }
        .contact { margin: 6px 0 0 0; color: #333; }
        .role { margin: 10px 0 0 0; font-weight: 600; }
        .section { margin-top: 14px; }
        .section-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          border-bottom: 1px solid #ddd;
          padding-bottom: 4px;
          margin: 0 0 8px 0;
        }
        .row { display: flex; justify-content: space-between; gap: 10px; }
        .left { flex: 1; }
        .right { white-space: nowrap; color: #333; }
        .strong { font-weight: 700; }
        .item { margin-bottom: 8px; }
        .body { margin-top: 4px; color: #222; white-space: pre-wrap; }
        .skills { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <h1 class="name">${name}</h1>
      ${contactLine ? `<p class="contact">${contactLine}</p>` : ''}
      ${targetRole ? `<p class="role">${targetRole}</p>` : ''}

      ${summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <div class="body">${summary}</div>
        </div>
      ` : ''}

      ${skillsLine ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills">${skillsLine}</div>
        </div>
      ` : ''}

      ${experienceHtml ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${experienceHtml}
        </div>
      ` : ''}

      ${projectsHtml ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          ${projectsHtml}
        </div>
      ` : ''}

      ${educationHtml ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${educationHtml}
        </div>
      ` : ''}
    </body>
  </html>
  `;
}

export function renderAtsCompactHtml(cv: CvData) {
  const { name, summary, targetRole, contactLine, skillsLine, experienceHtml, educationHtml, projectsHtml } =
    buildAtsContent(cv);

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Resume</title>
      <style>
        @page { margin: 22px; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: #111;
          line-height: 1.28;
          font-size: 11.8px;
        }
        .header { border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 10px; }
        .name { font-size: 20px; font-weight: 800; margin: 0; }
        .contact { margin: 6px 0 0 0; color: #333; }
        .role { margin: 8px 0 0 0; font-weight: 600; color: #111; }
        .section { margin-top: 10px; }
        .section-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin: 0 0 6px 0;
        }
        .divider { border-top: 1px solid #e5e7eb; margin: 4px 0 8px 0; }
        .row { display: flex; justify-content: space-between; gap: 10px; }
        .left { flex: 1; }
        .right { white-space: nowrap; color: #333; }
        .strong { font-weight: 700; }
        .item { margin-bottom: 6px; }
        .body { margin-top: 3px; color: #222; white-space: pre-wrap; }
        .skills { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="name">${name}</h1>
        ${contactLine ? `<p class="contact">${contactLine}</p>` : ''}
        ${targetRole ? `<p class="role">${targetRole}</p>` : ''}
      </div>

      ${summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="divider"></div>
          <div class="body">${summary}</div>
        </div>
      ` : ''}

      ${skillsLine ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="divider"></div>
          <div class="skills">${skillsLine}</div>
        </div>
      ` : ''}

      ${experienceHtml ? `
        <div class="section">
          <div class="section-title">Experience</div>
          <div class="divider"></div>
          ${experienceHtml}
        </div>
      ` : ''}

      ${projectsHtml ? `
        <div class="section">
          <div class="section-title">Projects</div>
          <div class="divider"></div>
          ${projectsHtml}
        </div>
      ` : ''}

      ${educationHtml ? `
        <div class="section">
          <div class="section-title">Education</div>
          <div class="divider"></div>
          ${educationHtml}
        </div>
      ` : ''}
    </body>
  </html>
  `;
}

export function renderModernColoredHtml(cv: CvData) {
  const { name, summary, targetRole, contactLine, skillsLine, experienceHtml, educationHtml, projectsHtml } =
    buildAtsContent(cv);

  const accent = '#2563eb'; // blue-600
  const accentSoft = '#dbeafe'; // blue-100

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Resume</title>
      <style>
        @page { margin: 24px; }
        :root {
          --accent: ${accent};
          --accentSoft: ${accentSoft};
          --text: #0f172a;
          --muted: #475569;
          --border: #e2e8f0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: var(--text);
          line-height: 1.32;
          font-size: 12.2px;
        }
        .topbar {
          border: 1px solid var(--border);
          border-left: 6px solid var(--accent);
          border-radius: 10px;
          padding: 12px 14px;
          background: linear-gradient(90deg, var(--accentSoft), #ffffff 55%);
        }
        .name {
          font-size: 22px;
          font-weight: 800;
          margin: 0;
          letter-spacing: 0.2px;
        }
        .role {
          margin: 6px 0 0 0;
          font-weight: 700;
          color: var(--accent);
        }
        .contact {
          margin: 6px 0 0 0;
          color: var(--muted);
        }
        .section { margin-top: 14px; }
        .section-title {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          color: var(--accent);
          border-bottom: 2px solid var(--accent);
          padding-bottom: 3px;
          margin: 0 0 8px 0;
        }
        .row { display: flex; justify-content: space-between; gap: 10px; }
        .left { flex: 1; }
        .right { white-space: nowrap; color: var(--muted); }
        .strong { font-weight: 700; }
        .item { margin-bottom: 8px; }
        .body { margin-top: 4px; color: #111827; white-space: pre-wrap; }
        .skills { white-space: pre-wrap; }
        .skill-chip {
          display: inline-block;
          padding: 4px 8px;
          margin: 0 6px 6px 0;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: #ffffff;
          color: #0f172a;
          font-size: 11.5px;
        }
      </style>
    </head>
    <body>
      <div class="topbar">
        <h1 class="name">${name}</h1>
        ${targetRole ? `<p class="role">${targetRole}</p>` : ''}
        ${contactLine ? `<p class="contact">${contactLine}</p>` : ''}
      </div>

      ${summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <div class="body">${summary}</div>
        </div>
      ` : ''}

      ${(cv.skills ?? []).length ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills">
            ${(cv.skills ?? [])
              .map((s) => s.trim())
              .filter(Boolean)
              .map((s) => `<span class="skill-chip">${escapeHtml(s)}</span>`)
              .join('')}
          </div>
        </div>
      ` : ''}

      ${experienceHtml ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          ${experienceHtml}
        </div>
      ` : ''}

      ${projectsHtml ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          ${projectsHtml}
        </div>
      ` : ''}

      ${educationHtml ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          ${educationHtml}
        </div>
      ` : ''}
    </body>
  </html>
  `;
}

export function renderExecutiveSerifHtml(cv: CvData) {
  const { name, summary, targetRole, contactLine, skillsLine, experienceHtml, educationHtml, projectsHtml } =
    buildAtsContent(cv);

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Resume</title>
      <style>
        @page { margin: 26px; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: #111;
          line-height: 1.33;
          font-size: 12.2px;
        }
        .header {
          padding-bottom: 10px;
          border-bottom: 2px solid #111;
          margin-bottom: 12px;
        }
        .name {
          font-family: Georgia, "Times New Roman", Times, serif;
          font-size: 26px;
          font-weight: 700;
          margin: 0;
          letter-spacing: 0.2px;
        }
        .subtitle {
          margin: 6px 0 0 0;
          color: #222;
          font-weight: 600;
        }
        .contact {
          margin: 6px 0 0 0;
          color: #444;
        }
        .section { margin-top: 14px; }
        .section-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 0;
        }
        .rule {
          border-top: 1px solid #d1d5db;
          margin: 6px 0 10px 0;
        }
        .row { display: flex; justify-content: space-between; gap: 10px; }
        .left { flex: 1; }
        .right { white-space: nowrap; color: #333; }
        .strong { font-weight: 700; }
        .item { margin-bottom: 8px; }
        .body { margin-top: 4px; color: #222; white-space: pre-wrap; }
        .skills { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="name">${name}</h1>
        ${targetRole ? `<p class="subtitle">${targetRole}</p>` : ''}
        ${contactLine ? `<p class="contact">${contactLine}</p>` : ''}
      </div>

      ${summary ? `
        <div class="section">
          <h2 class="section-title">Professional Summary</h2>
          <div class="rule"></div>
          <div class="body">${summary}</div>
        </div>
      ` : ''}

      ${skillsLine ? `
        <div class="section">
          <h2 class="section-title">Skills</h2>
          <div class="rule"></div>
          <div class="skills">${skillsLine}</div>
        </div>
      ` : ''}

      ${experienceHtml ? `
        <div class="section">
          <h2 class="section-title">Experience</h2>
          <div class="rule"></div>
          ${experienceHtml}
        </div>
      ` : ''}

      ${projectsHtml ? `
        <div class="section">
          <h2 class="section-title">Projects</h2>
          <div class="rule"></div>
          ${projectsHtml}
        </div>
      ` : ''}

      ${educationHtml ? `
        <div class="section">
          <h2 class="section-title">Education</h2>
          <div class="rule"></div>
          ${educationHtml}
        </div>
      ` : ''}
    </body>
  </html>
  `;
}
