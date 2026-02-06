import OpenAI from 'openai';

export type ProfessionalSummaryInput = {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    github?: string;
  };
  targetRole: string;
  experiences: Array<{
    companyName: string;
    jobTitle: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{ institution: string; degree: string; year?: string }>;
  skills: string[];
  projects: Array<{ projectName: string; description?: string; techStack?: string }>;
};

function getClient() {
  const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_OPENROUTER_API_KEY');
  }

  const siteUrl = process.env.EXPO_PUBLIC_OPENROUTER_SITE_URL || 'http://localhost';
  const siteName = process.env.EXPO_PUBLIC_OPENROUTER_SITE_NAME || 'ResumeBot';

  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': siteUrl,
      'X-Title': siteName,
    },
    // OpenAI SDK blocks browser-like runtimes by default.
    dangerouslyAllowBrowser: true,
  });
}

function clean(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^[-*•\d\.\s]+/g, '')
    .trim();
}

export async function generateProfessionalSummaryOpenRouter(input: ProfessionalSummaryInput) {
  const client = getClient();
  const model = process.env.EXPO_PUBLIC_OPENROUTER_MODEL || 'google/gemma-3n-e2b-it:free';

  // Keep the payload small and focused.
  const compact = {
    personal: {
      fullName: input.personal.fullName,
      location: input.personal.location,
    },
    targetRole: input.targetRole,
    skills: input.skills.slice(0, 12),
    experiences: input.experiences.slice(0, 4).map((e) => ({
      companyName: e.companyName,
      jobTitle: e.jobTitle,
      startDate: e.startDate,
      endDate: e.endDate,
      description: (e.description || '').slice(0, 400),
    })),
    projects: input.projects.slice(0, 3).map((p) => ({
      projectName: p.projectName,
      techStack: p.techStack,
      description: (p.description || '').slice(0, 300),
    })),
    education: input.education.slice(0, 2),
  };

  const userPrompt =
    'Write an ATS-friendly Professional Summary for this CV data.\n' +
    '- Output ONLY plain text (no markdown, no bullets), only the summary. no other things.\n' +
    '- 60–90 words.\n' +
    '- Use strong action verbs; do NOT invent facts.\n' +
    '- Mention target role and 5–8 relevant skills if available.\n\n' +
    `CV JSON: ${JSON.stringify(compact)}`;

  // Call 1: generate.
  const apiResponse = await client.chat.completions.create(
  {
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are a professional resume writer. You never fabricate facts. You produce concise, ATS-friendly text.',
      },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.4,
    max_tokens: 240,
  },
  {
    headers: {
      'X-Data-Policy': 'allow', // 🔥 THIS disables zero retention
    },
  }
);


  const text = clean(apiResponse.choices?.[0]?.message?.content || '');
  if (!text) throw new Error('AI returned empty summary');
  return text;
}
