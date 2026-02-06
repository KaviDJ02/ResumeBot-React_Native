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

export function renderAtsHtml(cv: CvData) {
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
      const name = escapeHtml(p.projectName || '');
      const tech = escapeHtml(p.techStack || '');
      const desc = escapeHtml(p.description || '');
      return `
        <div class="item">
          <div class="row">
            <div class="left"><span class="strong">${name}</span>${tech ? ` — ${tech}` : ''}</div>
          </div>
          ${desc ? `<div class="body">${desc}</div>` : ''}
        </div>
      `;
    })
    .join('');

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
