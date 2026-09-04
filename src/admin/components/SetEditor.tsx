import { useState } from 'react';
import {
  ActionIcon,
  Autocomplete,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Menu,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowDown,
  IconArrowUp,
  IconCopy,
  IconExternalLink,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { FALLBACK_JOB_ICON, jobIconUrl, roleColor } from '../../constants';
import { BiSSetItem } from '../../types';
import { Draft, DraftJob, move, rolesIn } from '../model';

interface Props {
  draft: Draft;
  job: DraftJob;
  category: string;
  onJobChange: (job: DraftJob) => void;
  onDeleteJob: () => void;
}

export function SetEditor({ draft, job, category, onJobChange, onDeleteJob }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const items = job.sets[category] ?? [];

  const setItems = (next: BiSSetItem[]) => onJobChange({ ...job, sets: { ...job.sets, [category]: next } });

  const patch = (index: number, field: keyof BiSSetItem, value: string) =>
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));

  const copyFrom = (source: string) =>
    setItems([...items, ...(job.sets[source] ?? []).map((i) => ({ ...i }))]);

  const otherCategories = draft.categories.filter(
    (c) => c !== category && (job.sets[c]?.length ?? 0) > 0
  );
  const duplicateCode = draft.jobs.filter((j) => j.code === job.code).length > 1;

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Image src={jobIconUrl(job.code)} fallbackSrc={FALLBACK_JOB_ICON} w={40} h={40} alt="" />
            <Stack gap={2}>
              <Title order={3}>{job.name || job.code}</Title>
              <Badge size="sm" variant="light" color={roleColor(job.role)}>
                {job.role || 'No role'}
              </Badge>
            </Stack>
          </Group>

          {confirmDelete ? (
            <Group gap="xs">
              <Button size="compact-sm" variant="default" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button size="compact-sm" color="red" onClick={onDeleteJob}>
                Delete {job.code}
              </Button>
            </Group>
          ) : (
            <Tooltip label="Remove this job">
              <ActionIcon variant="subtle" color="red" onClick={() => setConfirmDelete(true)}>
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>

        <Divider my="md" />

        <Group grow align="flex-start">
          <TextInput
            label="Job code"
            description="Drives the icon and the card ordering"
            value={job.code}
            onChange={(e) => onJobChange({ ...job, code: e.currentTarget.value.toUpperCase() })}
            error={duplicateCode ? 'Another job already uses this code' : undefined}
          />
          <TextInput
            label="Display name"
            description="Shown on the job card"
            value={job.name}
            onChange={(e) => onJobChange({ ...job, name: e.currentTarget.value })}
          />
          <Autocomplete
            label="Role"
            description="Groups the job on the site"
            data={rolesIn(draft)}
            value={job.role}
            onChange={(value) => onJobChange({ ...job, role: value })}
          />
        </Group>
      </Paper>

      <Group justify="space-between">
        <Text fw={700}>
          {category} &middot; {items.length} set{items.length === 1 ? '' : 's'}
        </Text>
        <Group gap="xs">
          {otherCategories.length > 0 && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <Button variant="default" size="compact-sm" leftSection={<IconCopy size={16} />}>
                  Copy from
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {otherCategories.map((c) => (
                  <Menu.Item key={c} onClick={() => copyFrom(c)}>
                    {c} ({job.sets[c]?.length ?? 0})
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          )}
          <Button
            size="compact-sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => setItems([...items, { name: '', link: '' }])}
          >
            Add set
          </Button>
        </Group>
      </Group>

      <Stack gap="xs">
        {items.length > 0 && (
          <Group gap="xs" wrap="nowrap" px="sm">
            <Box w={26} />
            <Text size="xs" fw={600} c="dimmed" w={260}>
              Label
            </Text>
            <Text size="xs" fw={600} c="dimmed" flex={1}>
              Link
            </Text>
            <Box w={72} />
          </Group>
        )}

        {items.map((item, index) => (
          <Card key={index} withBorder radius="md" padding="sm">
            <Group gap="xs" align="center" wrap="nowrap">
              <Stack gap={2}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => setItems(move(items, index, index - 1))}
                  aria-label="Move up"
                >
                  <IconArrowUp size={14} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  disabled={index === items.length - 1}
                  onClick={() => setItems(move(items, index, index + 1))}
                  aria-label="Move down"
                >
                  <IconArrowDown size={14} />
                </ActionIcon>
              </Stack>

              <TextInput
                w={260}
                placeholder="2.50"
                value={item.name}
                onChange={(e) => patch(index, 'name', e.currentTarget.value)}
              />
              <TextInput
                flex={1}
                placeholder="https://xivgear.app/..."
                value={item.link}
                onChange={(e) => patch(index, 'link', e.currentTarget.value)}
                error={
                  item.link.trim() && !/^https?:\/\//i.test(item.link.trim())
                    ? 'Should start with http(s)://'
                    : undefined
                }
              />

              <Group gap={4} w={72} justify="flex-end" wrap="nowrap">
                <Tooltip label="Open link">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    component="a"
                    href={item.link || undefined}
                    target="_blank"
                    rel="noreferrer"
                    data-disabled={item.link ? undefined : true}
                  >
                    <IconExternalLink size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Remove set">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Card>
        ))}

        {items.length === 0 && (
          <Paper withBorder radius="md" p="lg">
            <Stack gap={4} align="center">
              <Text size="sm" c="dimmed">
                {job.name} has no sets for {category}.
              </Text>
              <Text size="xs" c="dimmed">
                Jobs with no sets in a category are hidden from that tab on the site.
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}
