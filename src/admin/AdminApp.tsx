import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Alert,
  AppShell,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconCategory,
  IconDeviceFloppy,
  IconMoon,
  IconPlus,
  IconRefresh,
  IconSun,
} from '@tabler/icons-react';
import { loadSets, saveSets } from './api';
import { Draft, DraftJob, fromDraft, serialise, toDraft } from './model';
import { AddJobModal } from './components/AddJobModal';
import { CategoryManager } from './components/CategoryManager';
import { JobList } from './components/JobList';
import { SetEditor } from './components/SetEditor';

type Status = 'loading' | 'ready' | 'error';

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  return [...new Set(values.filter((v) => (seen.has(v) ? true : (seen.add(v), false))))];
}

export function AdminApp() {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

  const [draft, setDraft] = useState<Draft | null>(null);
  /** Serialised form of the last version on disk; drives the dirty indicator. */
  const [saved, setSaved] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [category, setCategory] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [addJobOpen, setAddJobOpen] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await loadSets();
      const next = toDraft(data);
      setDraft(next);
      setSaved(serialise(next));
      setCategory((current) =>
        current && next.categories.includes(current) ? current : (next.categories[0] ?? '')
      );
      setSelectedJob((current) =>
        current && next.jobs.some((j) => j.code === current) ? current : (next.jobs[0]?.code ?? null)
      );
      setStatus('ready');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = draft !== null && serialise(draft) !== saved;

  /** Blocking problems: saving any of these would break the live site. */
  const problems = useMemo(() => {
    if (!draft) return [];
    const found: string[] = [];
    const dupeCategories = duplicates(draft.categories);
    const dupeJobs = duplicates(draft.jobs.map((j) => j.code));

    if (draft.categories.some((c) => !c.trim())) found.push('A category has an empty name.');
    if (dupeCategories.length > 0) found.push(`Duplicate categories: ${dupeCategories.join(', ')}.`);
    if (dupeJobs.length > 0) found.push(`Duplicate job codes: ${dupeJobs.join(', ')}.`);
    for (const j of draft.jobs) {
      if (!j.code.trim()) found.push('A job has an empty code.');
      else if (!j.name.trim()) found.push(`${j.code} has no display name.`);
      else if (!j.role.trim()) found.push(`${j.code} has no role.`);
    }
    return found;
  }, [draft]);

  const save = useCallback(async () => {
    if (!draft || saving || problems.length > 0) return;
    setSaving(true);
    setError(null);
    try {
      await saveSets(fromDraft(draft));
      setSaved(serialise(draft));
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }, [draft, saving, problems]);

  // Empty ignore list so Cmd/Ctrl+S still works while a field has focus.
  useHotkeys([['mod+S', () => void save()]], []);

  // The write only happens on save, so a reload would silently drop edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const job = useMemo(
    () => draft?.jobs.find((j) => j.code === selectedJob) ?? null,
    [draft, selectedJob]
  );

  const updateJob = (next: DraftJob) => {
    if (!draft || !job) return;
    setDraft({ ...draft, jobs: draft.jobs.map((j) => (j.code === job.code ? next : j)) });
    if (next.code !== job.code) setSelectedJob(next.code);
  };

  const deleteJob = () => {
    if (!draft || !job) return;
    const remaining = draft.jobs.filter((j) => j.code !== job.code);
    setDraft({ ...draft, jobs: remaining });
    setSelectedJob(remaining[0]?.code ?? null);
  };

  const addJob = (created: DraftJob) => {
    if (!draft) return;
    setDraft({ ...draft, jobs: [...draft.jobs, created] });
    setSelectedJob(created.code);
    setQuery('');
  };

  return (
    <AppShell header={{ height: 104 }} navbar={{ width: 300, breakpoint: 'sm' }} padding="md">
      <AppShell.Header px="md">
        <Group h={56} justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Title order={4}>XIVBiS admin</Title>
            <Text size="xs" c="dimmed">
              public/data/sets.json
            </Text>
            {dirty ? (
              <Badge color="yellow" variant="light">
                Unsaved changes
              </Badge>
            ) : (
              savedAt && (
                <Text size="xs" c="dimmed">
                  Saved {savedAt}
                </Text>
              )
            )}
          </Group>

          <Group gap="xs" wrap="nowrap">
            <Tooltip label="Reload from disk, discarding edits">
              <ActionIcon variant="default" size="lg" onClick={() => void load()}>
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Toggle colour scheme">
              <ActionIcon
                variant="default"
                size="lg"
                onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
              >
                {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>
            <Button
              variant="default"
              leftSection={<IconCategory size={16} />}
              onClick={() => setCategoriesOpen(true)}
              disabled={!draft}
            >
              Categories
            </Button>
            <Button
              variant="default"
              leftSection={<IconPlus size={16} />}
              onClick={() => setAddJobOpen(true)}
              disabled={!draft}
            >
              Add job
            </Button>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={() => void save()}
              loading={saving}
              disabled={!dirty || problems.length > 0}
            >
              Save
            </Button>
          </Group>
        </Group>

        {draft && draft.categories.length > 0 && (
          <Tabs value={category} onChange={(value) => setCategory(value ?? '')} variant="default">
            <Tabs.List>
              {draft.categories.map((c) => (
                <Tabs.Tab key={c} value={c}>
                  {c}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        )}
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        {draft && (
          <JobList
            draft={draft}
            category={category}
            selected={selectedJob}
            onSelect={setSelectedJob}
            query={query}
            onQueryChange={setQuery}
          />
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Stack gap="md">
          {problems.length > 0 && (
            <Alert color="yellow" icon={<IconAlertTriangle size={18} />} title="Fix before saving">
              <Stack gap={2}>
                {problems.map((problem) => (
                  <Text key={problem} size="sm">
                    {problem}
                  </Text>
                ))}
              </Stack>
            </Alert>
          )}

          {error && (
            <Alert color="red" icon={<IconAlertTriangle size={18} />} title="Something went wrong">
              {error}
            </Alert>
          )}

          {status === 'loading' && (
            <Center mih="60vh">
              <Loader type="dots" size="lg" />
            </Center>
          )}

          {status === 'ready' && draft && (
            <ScrollArea.Autosize>
              {job ? (
                <SetEditor
                  draft={draft}
                  job={job}
                  category={category}
                  onJobChange={updateJob}
                  onDeleteJob={deleteJob}
                />
              ) : (
                <Center mih="50vh">
                  <Text c="dimmed">Pick a job on the left, or add one.</Text>
                </Center>
              )}
            </ScrollArea.Autosize>
          )}
        </Stack>
      </AppShell.Main>

      {draft && (
        <>
          <CategoryManager
            opened={categoriesOpen}
            onClose={() => setCategoriesOpen(false)}
            draft={draft}
            onChange={(next) => {
              // A rename replaces the active tab's value, so fall back to the
              // same slot rather than snapping back to the first category.
              if (!next.categories.includes(category)) {
                const slot = draft.categories.indexOf(category);
                setCategory(next.categories[slot] ?? next.categories[0] ?? '');
              }
              setDraft(next);
            }}
          />
          <AddJobModal
            opened={addJobOpen}
            onClose={() => setAddJobOpen(false)}
            draft={draft}
            onCreate={addJob}
          />
        </>
      )}
    </AppShell>
  );
}
