import { useMemo } from 'react';
import { Badge, Group, Image, NavLink, ScrollArea, Stack, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { FALLBACK_JOB_ICON, ROLE_ORDER, jobIconUrl, roleColor } from '../../constants';
import { Draft, DraftJob } from '../model';

interface Props {
  draft: Draft;
  category: string;
  selected: string | null;
  onSelect: (code: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

/** Sidebar: every job grouped by role, with its set count for the active category. */
export function JobList({ draft, category, selected, onSelect, query, onQueryChange }: Props) {
  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = draft.jobs.filter(
      (job) =>
        !q ||
        job.code.toLowerCase().includes(q) ||
        job.name.toLowerCase().includes(q) ||
        job.role.toLowerCase().includes(q)
    );

    const roles = [...new Set(matches.map((j) => j.role))].sort((a, b) => {
      const ai = ROLE_ORDER.indexOf(a);
      const bi = ROLE_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return roles.map((role) => ({ role, jobs: matches.filter((j) => j.role === role) }));
  }, [draft.jobs, query]);

  return (
    <Stack gap="xs" h="100%">
      <TextInput
        placeholder="Filter jobs"
        leftSection={<IconSearch size={16} />}
        value={query}
        onChange={(e) => onQueryChange(e.currentTarget.value)}
      />

      <ScrollArea flex={1} type="auto" offsetScrollbars>
        <Stack gap="md" pr="xs">
          {grouped.map(({ role, jobs }) => (
            <Stack key={role} gap={2}>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="xs">
                {role}
              </Text>
              {jobs.map((job) => (
                <JobRow
                  key={job.code}
                  job={job}
                  category={category}
                  active={job.code === selected}
                  onSelect={onSelect}
                />
              ))}
            </Stack>
          ))}

          {grouped.length === 0 && (
            <Text size="sm" c="dimmed" px="xs">
              No job matches &ldquo;{query}&rdquo;.
            </Text>
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

function JobRow({
  job,
  category,
  active,
  onSelect,
}: {
  job: DraftJob;
  category: string;
  active: boolean;
  onSelect: (code: string) => void;
}) {
  const count = job.sets[category]?.length ?? 0;

  return (
    <NavLink
      active={active}
      onClick={() => onSelect(job.code)}
      variant="light"
      leftSection={
        <Image src={jobIconUrl(job.code)} fallbackSrc={FALLBACK_JOB_ICON} w={22} h={22} alt="" />
      }
      label={
        <Group gap="xs" wrap="nowrap" justify="space-between">
          <Text size="sm" fw={600} truncate>
            {job.name}
          </Text>
          <Badge
            size="sm"
            variant={count > 0 ? 'light' : 'outline'}
            color={count > 0 ? roleColor(job.role) : 'gray'}
          >
            {count}
          </Badge>
        </Group>
      }
    />
  );
}
