import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from '@/firebase';
import { generateProfessionalSummaryOpenRouter } from '@/ai/openrouter';

type Experience = {
  id: string;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  year: string;
};

type Project = {
  id: string;
  projectName: string;
  description: string;
  techStack: string;
};

type CvData = {
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
};

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
}

function normalizeCvData(data: unknown): CvData {
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
    professionalSummary:
      typeof obj.professionalSummary === 'string' ? (obj.professionalSummary as string) : undefined,
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
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function storageKeyForUid(uid: string | null | undefined) {
  return `cvData:v1:${uid ?? 'guest'}`;
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function SectionTitle({ children }: { children: string }) {
  return <Text className="mb-3 mt-5 text-lg font-semibold">{children}</Text>;
}

function FieldLabel({ children }: { children: string }) {
  return <Text className="mb-1 text-sm font-medium">{children}</Text>;
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      className={[
        'rounded border border-gray-300 px-3 py-2 text-base',
        props.multiline ? 'min-h-[96px] py-3' : '',
        props.className ?? '',
      ].join(' ')}
    />
  );
}

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="rounded bg-black px-4 py-3 active:opacity-80">
      <Text className="text-center font-semibold text-white">{title}</Text>
    </Pressable>
  );
}

function SecondaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded border border-gray-300 px-4 py-3 active:opacity-80">
      <Text className="text-center font-semibold text-black">{title}</Text>
    </Pressable>
  );
}

export default function CvDataScreen() {
  const [personal, setPersonal] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    github: '',
  });

  const [targetRole, setTargetRole] = useState('');

  const [professionalSummary, setProfessionalSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExp, setNewExp] = useState<Omit<Experience, 'id'>>({
    companyName: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingExp, setEditingExp] = useState<Omit<Experience, 'id'>>({
    companyName: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [education, setEducation] = useState<Education[]>([]);
  const [newEdu, setNewEdu] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    year: '',
  });
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editingEdu, setEditingEdu] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    year: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    projectName: '',
    description: '',
    techStack: '',
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Omit<Project, 'id'>>({
    projectName: '',
    description: '',
    techStack: '',
  });

  const canAddExp = useMemo(() => {
    return newExp.companyName.trim() && newExp.jobTitle.trim();
  }, [newExp.companyName, newExp.jobTitle]);

  const canAddEdu = useMemo(() => {
    return newEdu.institution.trim() && newEdu.degree.trim();
  }, [newEdu.institution, newEdu.degree]);

  const canAddProject = useMemo(() => {
    return newProject.projectName.trim();
  }, [newProject.projectName]);

  const [loadingLocal, setLoadingLocal] = useState(true);
  const [savingLocal, setSavingLocal] = useState(false);
  const [activeStorageKey, setActiveStorageKey] = useState(storageKeyForUid(auth.currentUser?.uid));
  const hasHydratedRef = useRef(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cvData: CvData = useMemo(
    () => ({
      personal,
      professionalSummary,
      targetRole,
      experiences,
      education,
      skills,
      projects,
    }),
    [education, experiences, personal, professionalSummary, projects, skills, targetRole]
  );

  const canGenerateSummary = useMemo(() => {
    const hasRequiredPersonal =
      personal.fullName.trim() &&
      personal.email.trim() &&
      personal.phone.trim() &&
      personal.location.trim();

    const hasRole = targetRole.trim();
    const hasSomeContent =
      experiences.length > 0 || education.length > 0 || skills.length > 0 || projects.length > 0;

    return Boolean(hasRequiredPersonal && hasRole && hasSomeContent);
  }, [education.length, experiences.length, personal, projects.length, skills.length, targetRole]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        const key = storageKeyForUid(user?.uid);
        setActiveStorageKey(key);
        setLoadingLocal(true);
        hasHydratedRef.current = false;

        const raw = await withTimeout(
          AsyncStorage.getItem(key),
          4000,
          'Timed out while reading local storage.'
        );

        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          const normalized = normalizeCvData(parsed);
          setPersonal(normalized.personal);
          setProfessionalSummary(normalized.professionalSummary ?? '');
          setTargetRole(normalized.targetRole);
          setExperiences(normalized.experiences);
          setEducation(normalized.education);
          setSkills(normalized.skills);
          setProjects(normalized.projects);
        }
      } catch (e) {
        Alert.alert('Could not load CV', e instanceof Error ? e.message : 'Unknown error.');
      } finally {
        setLoadingLocal(false);
        hasHydratedRef.current = true;
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Debounced auto-save to local storage after edits.
    if (!hasHydratedRef.current) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      const payload = { ...cvData, updatedAt: new Date().toISOString() };
      AsyncStorage.setItem(activeStorageKey, JSON.stringify(payload)).catch(() => {
        // Ignore background autosave errors.
      });
    }, 600);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [activeStorageKey, cvData]);

  async function saveCvToDevice() {
    if (savingLocal) return;

    setSavingLocal(true);
    try {
      const payload = { ...cvData, updatedAt: new Date().toISOString() };
      await withTimeout(
        AsyncStorage.setItem(activeStorageKey, JSON.stringify(payload)),
        4000,
        'Timed out while saving locally.'
      );
      Alert.alert('Saved', 'Your CV has been saved on this device.');
    } catch (e) {
      Alert.alert(
        'Save failed',
        e instanceof Error ? e.message : 'Unknown error while saving data locally.'
      );
    } finally {
      setSavingLocal(false);
    }
  }

  async function onGenerateSummaryWithAi() {
    if (!canGenerateSummary) {
      Alert.alert(
        'Missing required info',
        'Fill Full Name, Email, Phone, Location, Target Role, and add at least one Experience/Education/Skill/Project before generating.'
      );
      return;
    }
    if (generatingSummary) return;

    setGeneratingSummary(true);
    try {
      const summary = await withTimeout(
        generateProfessionalSummaryOpenRouter({
          personal,
          targetRole,
          experiences,
          education,
          skills,
          projects,
        }),
        20000,
        'AI request timed out. Please try again.'
      );

      setProfessionalSummary(summary);

      // Persist immediately so Resume tab can pick it up.
      const payload = {
        ...cvData,
        professionalSummary: summary,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(activeStorageKey, JSON.stringify(payload));
    } catch (e) {
      Alert.alert(
        'AI generation failed',
        e instanceof Error ? e.message : 'Unknown error while generating summary.'
      );
    } finally {
      setGeneratingSummary(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">CV Data</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10">
        <View className="mb-2">
          <PrimaryButton
            title={
              loadingLocal ? 'Loading…' : savingLocal ? 'Saving…' : 'Save CV'
            }
            onPress={saveCvToDevice}
          />
          {loadingLocal ? (
            <Text className="mt-2 text-sm text-gray-600">Loading your saved CV from this device…</Text>
          ) : (
            <Text className="mt-2 text-sm text-gray-600">
              Auto-saves locally while you edit. Account: {auth.currentUser?.email ?? 'Guest'}
            </Text>
          )}
        </View>

        <SectionTitle>1️⃣ Personal Info</SectionTitle>

        <FieldLabel>Full Name</FieldLabel>
        <Input
          value={personal.fullName}
          onChangeText={(t) => setPersonal((p) => ({ ...p, fullName: t }))}
        />

        <View className="h-3" />
        <FieldLabel>Email</FieldLabel>
        <Input
          value={personal.email}
          onChangeText={(t) => setPersonal((p) => ({ ...p, email: t }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View className="h-3" />
        <FieldLabel>Phone</FieldLabel>
        <Input
          value={personal.phone}
          onChangeText={(t) => setPersonal((p) => ({ ...p, phone: t }))}
          keyboardType="phone-pad"
        />

        <View className="h-3" />
        <FieldLabel>Location</FieldLabel>
        <Input
          value={personal.location}
          onChangeText={(t) => setPersonal((p) => ({ ...p, location: t }))}
        />

        <View className="h-3" />
        <FieldLabel>LinkedIn (optional)</FieldLabel>
        <Input
          value={personal.linkedIn}
          onChangeText={(t) => setPersonal((p) => ({ ...p, linkedIn: t }))}
          autoCapitalize="none"
        />

        <View className="h-3" />
        <FieldLabel>GitHub (optional)</FieldLabel>
        <Input
          value={personal.github}
          onChangeText={(t) => setPersonal((p) => ({ ...p, github: t }))}
          autoCapitalize="none"
        />

        <SectionTitle>2️⃣ Target Role</SectionTitle>
        <FieldLabel>Role</FieldLabel>
        <Input
          value={targetRole}
          onChangeText={setTargetRole}
          placeholder='e.g., "Software Engineer"'
        />

        <SectionTitle>✨ Professional Summary</SectionTitle>
        <Text className="mb-2 text-sm text-gray-600">
          Write your summary or generate it with AI.
        </Text>
        <Input
          value={professionalSummary}
          onChangeText={setProfessionalSummary}
          placeholder="Professional summary (ATS-friendly)…"
          multiline
          textAlignVertical="top"
        />

        <View className="mt-3">
          <Pressable
            onPress={() => {
              if (!canGenerateSummary || generatingSummary) return;
              void onGenerateSummaryWithAi();
            }}
            className={[
              'rounded px-4 py-3 active:opacity-80',
              !canGenerateSummary || generatingSummary ? 'bg-gray-300' : 'bg-black',
            ].join(' ')}>
            <Text
              className={[
                'text-center font-semibold',
                !canGenerateSummary || generatingSummary ? 'text-gray-700' : 'text-white',
              ].join(' ')}>
              {generatingSummary ? 'Generating…' : 'Generate with AI'}
            </Text>
          </Pressable>
          {!canGenerateSummary ? (
            <Text className="mt-2 text-xs text-gray-600">
              Required: Full Name, Email, Phone, Location, Target Role, and at least one section item.
            </Text>
          ) : null}
        </View>

        <SectionTitle>3️⃣ Work Experience</SectionTitle>

        {editingExpId ? (
          <>
            <Text className="mb-2 text-sm font-semibold">Editing experience</Text>
            <FieldLabel>Company Name</FieldLabel>
            <Input
              value={editingExp.companyName}
              onChangeText={(t) => setEditingExp((s) => ({ ...s, companyName: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Job Title</FieldLabel>
            <Input
              value={editingExp.jobTitle}
              onChangeText={(t) => setEditingExp((s) => ({ ...s, jobTitle: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Start Date</FieldLabel>
            <Input
              value={editingExp.startDate}
              onChangeText={(t) => setEditingExp((s) => ({ ...s, startDate: t }))}
              placeholder="YYYY-MM"
            />
            <View className="h-3" />
            <FieldLabel>End Date</FieldLabel>
            <Input
              value={editingExp.endDate}
              onChangeText={(t) => setEditingExp((s) => ({ ...s, endDate: t }))}
              placeholder="YYYY-MM or Present"
            />
            <View className="h-3" />
            <FieldLabel>Description</FieldLabel>
            <Input
              value={editingExp.description}
              onChangeText={(t) => setEditingExp((s) => ({ ...s, description: t }))}
              multiline
              textAlignVertical="top"
            />

            <View className="mt-3 flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton
                  title="Save"
                  onPress={() => {
                    setExperiences((list) =>
                      list.map((e) => (e.id === editingExpId ? { id: e.id, ...editingExp } : e))
                    );
                    setEditingExpId(null);
                  }}
                />
              </View>
              <View className="flex-1">
                <SecondaryButton
                  title="Cancel"
                  onPress={() => {
                    setEditingExpId(null);
                  }}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <Text className="mb-2 text-sm font-semibold">Add experience</Text>
            <FieldLabel>Company Name</FieldLabel>
            <Input
              value={newExp.companyName}
              onChangeText={(t) => setNewExp((s) => ({ ...s, companyName: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Job Title</FieldLabel>
            <Input
              value={newExp.jobTitle}
              onChangeText={(t) => setNewExp((s) => ({ ...s, jobTitle: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Start Date</FieldLabel>
            <Input
              value={newExp.startDate}
              onChangeText={(t) => setNewExp((s) => ({ ...s, startDate: t }))}
              placeholder="YYYY-MM"
            />
            <View className="h-3" />
            <FieldLabel>End Date</FieldLabel>
            <Input
              value={newExp.endDate}
              onChangeText={(t) => setNewExp((s) => ({ ...s, endDate: t }))}
              placeholder="YYYY-MM or Present"
            />
            <View className="h-3" />
            <FieldLabel>Description</FieldLabel>
            <Input
              value={newExp.description}
              onChangeText={(t) => setNewExp((s) => ({ ...s, description: t }))}
              multiline
              textAlignVertical="top"
            />

            <View className="mt-3">
              <PrimaryButton
                title="Add Experience"
                onPress={() => {
                  if (!canAddExp) {
                    Alert.alert('Missing info', 'Company Name and Job Title are required.');
                    return;
                  }
                  setExperiences((list) => [{ id: uid('exp'), ...newExp }, ...list]);
                  setNewExp({
                    companyName: '',
                    jobTitle: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                  });
                }}
              />
            </View>
          </>
        )}

        <View className="mt-4">
          {experiences.length === 0 ? (
            <Text className="text-gray-500">No experiences added yet.</Text>
          ) : (
            experiences.map((e) => (
              <View key={e.id} className="mb-3 rounded border border-gray-200 p-3">
                <Text className="font-semibold">
                  {e.jobTitle || 'Job Title'} • {e.companyName || 'Company'}
                </Text>
                <Text className="text-gray-600">
                  {[e.startDate, e.endDate].filter(Boolean).join(' - ')}
                </Text>
                {!!e.description && <Text className="mt-2">{e.description}</Text>}

                <View className="mt-3 flex-row gap-3">
                  <View className="flex-1">
                    <SecondaryButton
                      title="Edit"
                      onPress={() => {
                        setEditingExpId(e.id);
                        setEditingExp({
                          companyName: e.companyName,
                          jobTitle: e.jobTitle,
                          startDate: e.startDate,
                          endDate: e.endDate,
                          description: e.description,
                        });
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Pressable
                      onPress={() => {
                        Alert.alert('Delete experience?', 'This cannot be undone.', [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () =>
                              setExperiences((list) => list.filter((x) => x.id !== e.id)),
                          },
                        ]);
                      }}
                      className="rounded border border-red-300 px-4 py-3 active:opacity-80">
                      <Text className="text-center font-semibold text-red-600">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <SectionTitle>4️⃣ Education</SectionTitle>

        {editingEduId ? (
          <>
            <Text className="mb-2 text-sm font-semibold">Editing education</Text>
            <FieldLabel>Institution</FieldLabel>
            <Input
              value={editingEdu.institution}
              onChangeText={(t) => setEditingEdu((s) => ({ ...s, institution: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Degree</FieldLabel>
            <Input
              value={editingEdu.degree}
              onChangeText={(t) => setEditingEdu((s) => ({ ...s, degree: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Year</FieldLabel>
            <Input
              value={editingEdu.year}
              onChangeText={(t) => setEditingEdu((s) => ({ ...s, year: t }))}
              placeholder="e.g., 2024"
            />

            <View className="mt-3 flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton
                  title="Save"
                  onPress={() => {
                    setEducation((list) =>
                      list.map((ed) => (ed.id === editingEduId ? { id: ed.id, ...editingEdu } : ed))
                    );
                    setEditingEduId(null);
                  }}
                />
              </View>
              <View className="flex-1">
                <SecondaryButton title="Cancel" onPress={() => setEditingEduId(null)} />
              </View>
            </View>
          </>
        ) : (
          <>
            <Text className="mb-2 text-sm font-semibold">Add education</Text>
            <FieldLabel>Institution</FieldLabel>
            <Input
              value={newEdu.institution}
              onChangeText={(t) => setNewEdu((s) => ({ ...s, institution: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Degree</FieldLabel>
            <Input
              value={newEdu.degree}
              onChangeText={(t) => setNewEdu((s) => ({ ...s, degree: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Year</FieldLabel>
            <Input
              value={newEdu.year}
              onChangeText={(t) => setNewEdu((s) => ({ ...s, year: t }))}
              placeholder="e.g., 2024"
            />

            <View className="mt-3">
              <PrimaryButton
                title="Add Education"
                onPress={() => {
                  if (!canAddEdu) {
                    Alert.alert('Missing info', 'Institution and Degree are required.');
                    return;
                  }
                  setEducation((list) => [{ id: uid('edu'), ...newEdu }, ...list]);
                  setNewEdu({ institution: '', degree: '', year: '' });
                }}
              />
            </View>
          </>
        )}

        <View className="mt-4">
          {education.length === 0 ? (
            <Text className="text-gray-500">No education added yet.</Text>
          ) : (
            education.map((ed) => (
              <View key={ed.id} className="mb-3 rounded border border-gray-200 p-3">
                <Text className="font-semibold">
                  {ed.degree || 'Degree'} • {ed.institution || 'Institution'}
                </Text>
                {!!ed.year && <Text className="text-gray-600">{ed.year}</Text>}

                <View className="mt-3 flex-row gap-3">
                  <View className="flex-1">
                    <SecondaryButton
                      title="Edit"
                      onPress={() => {
                        setEditingEduId(ed.id);
                        setEditingEdu({
                          institution: ed.institution,
                          degree: ed.degree,
                          year: ed.year,
                        });
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Pressable
                      onPress={() => {
                        Alert.alert('Delete education?', 'This cannot be undone.', [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () =>
                              setEducation((list) => list.filter((x) => x.id !== ed.id)),
                          },
                        ]);
                      }}
                      className="rounded border border-red-300 px-4 py-3 active:opacity-80">
                      <Text className="text-center font-semibold text-red-600">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <SectionTitle>5️⃣ Skills</SectionTitle>
        <FieldLabel>Add skill</FieldLabel>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              value={skillInput}
              onChangeText={setSkillInput}
              placeholder="e.g., React Native"
            />
          </View>
          <View className="w-[120px]">
            <PrimaryButton
              title="Add Skill"
              onPress={() => {
                const trimmed = skillInput.trim();
                if (!trimmed) return;
                if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
                  Alert.alert('Duplicate', 'That skill is already added.');
                  return;
                }
                setSkills((list) => [trimmed, ...list]);
                setSkillInput('');
              }}
            />
          </View>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {skills.length === 0 ? (
            <Text className="text-gray-500">No skills added yet.</Text>
          ) : (
            skills.map((skill) => (
              <View
                key={skill}
                className="flex-row items-center rounded-full border border-gray-300 px-3 py-2">
                <Text className="mr-2">{skill}</Text>
                <Pressable
                  onPress={() => setSkills((list) => list.filter((s) => s !== skill))}
                  hitSlop={10}>
                  <Text className="font-semibold">×</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <SectionTitle>6️⃣ Projects (optional)</SectionTitle>

        {editingProjectId ? (
          <>
            <Text className="mb-2 text-sm font-semibold">Editing project</Text>
            <FieldLabel>Project Name</FieldLabel>
            <Input
              value={editingProject.projectName}
              onChangeText={(t) => setEditingProject((s) => ({ ...s, projectName: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Description</FieldLabel>
            <Input
              value={editingProject.description}
              onChangeText={(t) => setEditingProject((s) => ({ ...s, description: t }))}
              multiline
              textAlignVertical="top"
            />
            <View className="h-3" />
            <FieldLabel>Tech Stack (comma-separated)</FieldLabel>
            <Input
              value={editingProject.techStack}
              onChangeText={(t) => setEditingProject((s) => ({ ...s, techStack: t }))}
              placeholder="e.g., React Native, Firebase"
              autoCapitalize="none"
            />

            <View className="mt-3 flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton
                  title="Save"
                  onPress={() => {
                    setProjects((list) =>
                      list.map((p) =>
                        p.id === editingProjectId ? { id: p.id, ...editingProject } : p
                      )
                    );
                    setEditingProjectId(null);
                  }}
                />
              </View>
              <View className="flex-1">
                <SecondaryButton title="Cancel" onPress={() => setEditingProjectId(null)} />
              </View>
            </View>
          </>
        ) : (
          <>
            <Text className="mb-2 text-sm font-semibold">Add project</Text>
            <FieldLabel>Project Name</FieldLabel>
            <Input
              value={newProject.projectName}
              onChangeText={(t) => setNewProject((s) => ({ ...s, projectName: t }))}
            />
            <View className="h-3" />
            <FieldLabel>Description</FieldLabel>
            <Input
              value={newProject.description}
              onChangeText={(t) => setNewProject((s) => ({ ...s, description: t }))}
              multiline
              textAlignVertical="top"
            />
            <View className="h-3" />
            <FieldLabel>Tech Stack (comma-separated)</FieldLabel>
            <Input
              value={newProject.techStack}
              onChangeText={(t) => setNewProject((s) => ({ ...s, techStack: t }))}
              placeholder="e.g., React Native, Firebase"
              autoCapitalize="none"
            />

            <View className="mt-3">
              <PrimaryButton
                title="Add Project"
                onPress={() => {
                  if (!canAddProject) {
                    Alert.alert('Missing info', 'Project Name is required.');
                    return;
                  }
                  setProjects((list) => [{ id: uid('proj'), ...newProject }, ...list]);
                  setNewProject({ projectName: '', description: '', techStack: '' });
                }}
              />
            </View>
          </>
        )}

        <View className="mt-4">
          {projects.length === 0 ? (
            <Text className="text-gray-500">No projects added yet.</Text>
          ) : (
            projects.map((p) => (
              <View key={p.id} className="mb-3 rounded border border-gray-200 p-3">
                <Text className="font-semibold">{p.projectName || 'Project'}</Text>
                {!!p.techStack && <Text className="text-gray-600">{p.techStack}</Text>}
                {!!p.description && <Text className="mt-2">{p.description}</Text>}

                <View className="mt-3 flex-row gap-3">
                  <View className="flex-1">
                    <SecondaryButton
                      title="Edit"
                      onPress={() => {
                        setEditingProjectId(p.id);
                        setEditingProject({
                          projectName: p.projectName,
                          description: p.description,
                          techStack: p.techStack,
                        });
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Pressable
                      onPress={() => {
                        Alert.alert('Delete project?', 'This cannot be undone.', [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => setProjects((list) => list.filter((x) => x.id !== p.id)),
                          },
                        ]);
                      }}
                      className="rounded border border-red-300 px-4 py-3 active:opacity-80">
                      <Text className="text-center font-semibold text-red-600">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
