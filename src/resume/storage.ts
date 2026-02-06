import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CvData } from './atsTemplate';

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
}

export function storageKeyForUid(uid: string | null | undefined) {
  return `cvData:v1:${uid ?? 'guest'}`;
}

export function normalizeCvData(data: unknown): CvData {
  const obj = (data && typeof data === 'object' ? (data as Record<string, unknown>) : {}) as Record<
    string,
    unknown
  >;

  const personalRaw =
    obj.personal && typeof obj.personal === 'object'
      ? (obj.personal as Record<string, unknown>)
      : {};

  const experiencesRaw = Array.isArray(obj.experiences) ? obj.experiences : [];
  const educationRaw = Array.isArray(obj.education) ? obj.education : [];
  const projectsRaw = Array.isArray(obj.projects) ? obj.projects : [];

  return {
    personal: {
      fullName: asString(personalRaw.fullName),
      email: asString(personalRaw.email),
      phone: asString(personalRaw.phone),
      location: asString(personalRaw.location),
      linkedIn: asString(personalRaw.linkedIn),
      github: asString(personalRaw.github),
    },
    targetRole: asString(obj.targetRole),
    experiences: experiencesRaw
      .map((x) => (x && typeof x === 'object' ? (x as Record<string, unknown>) : null))
      .filter(Boolean)
      .map((x) => ({
        id: asString(x!.id),
        companyName: asString(x!.companyName),
        jobTitle: asString(x!.jobTitle),
        startDate: asString(x!.startDate),
        endDate: asString(x!.endDate),
        description: asString(x!.description),
      }))
      .filter((e) => !!e.id),
    education: educationRaw
      .map((x) => (x && typeof x === 'object' ? (x as Record<string, unknown>) : null))
      .filter(Boolean)
      .map((x) => ({
        id: asString(x!.id),
        institution: asString(x!.institution),
        degree: asString(x!.degree),
        year: asString(x!.year),
      }))
      .filter((e) => !!e.id),
    skills: asStringArray(obj.skills),
    projects: projectsRaw
      .map((x) => (x && typeof x === 'object' ? (x as Record<string, unknown>) : null))
      .filter(Boolean)
      .map((x) => ({
        id: asString(x!.id),
        projectName: asString(x!.projectName),
        description: asString(x!.description),
        techStack: asString(x!.techStack),
      }))
      .filter((p) => !!p.id),
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : undefined,
  };
}

export async function loadLocalCvData(uid: string | null | undefined): Promise<CvData> {
  const key = storageKeyForUid(uid);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return normalizeCvData({});
  }

  try {
    return normalizeCvData(JSON.parse(raw) as unknown);
  } catch {
    // Corrupt data -> start clean.
    return normalizeCvData({});
  }
}
