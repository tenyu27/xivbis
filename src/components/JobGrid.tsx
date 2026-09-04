import { Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconMoodEmpty } from '@tabler/icons-react';
import { BiSSet } from '../types';
import { ROLE_ORDER, roleColor } from '../constants';
import { JobCard } from './JobCard';

interface JobGridProps {
  sets: BiSSet[];
}

function groupByRole(sets: BiSSet[]) {
  const groups = new Map<string, BiSSet[]>();
  for (const set of sets) {
    const bucket = groups.get(set.role);
    if (bucket) bucket.push(set);
    else groups.set(set.role, [set]);
  }

  return [...groups.entries()].sort(([a], [b]) => {
    const ai = ROLE_ORDER.indexOf(a);
    const bi = ROLE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function JobGrid({ sets }: JobGridProps) {
  const groups = groupByRole(sets);

  if (groups.length === 0) {
    return (
      <Paper withBorder radius="lg" p="xl" ta="center">
        <Stack gap="xs" align="center">
          <IconMoodEmpty size={32} stroke={1.5} opacity={0.5} />
          <Text fw={600}>Nothing matches this filter</Text>
          <Text size="sm" c="dimmed">
            Pick another tier or clear the search.
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap="xl">
      {groups.map(([role, roleSets]) => (
        <Stack key={role} gap="sm" component="section">
          <Group gap="xs" align="center">
            <Title order={2} fz="sm" tt="uppercase" lts="1px" c={roleColor(role)} m={0}>
              {role}
            </Title>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {roleSets.map((set) => (
              <JobCard key={set.job} set={set} />
            ))}
          </SimpleGrid>
        </Stack>
      ))}
    </Stack>
  );
}
