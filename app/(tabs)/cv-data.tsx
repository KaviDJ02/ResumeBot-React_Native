import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <View className="px-5 pb-4 pt-2">
        <Text className="text-2xl font-semibold">CV Data</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10">
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
