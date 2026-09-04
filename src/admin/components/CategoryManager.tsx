import { useState } from 'react';
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowDown,
  IconArrowUp,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Draft, categoryUsage, deleteCategory, move, renameCategory } from '../model';

interface Props {
  opened: boolean;
  onClose: () => void;
  draft: Draft;
  onChange: (draft: Draft) => void;
}

/**
 * Categories are the tab row on the live site. Renaming one here rewrites the
 * key inside every job so no set is orphaned.
 */
export function CategoryManager({ opened, onClose, draft, onChange }: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const trimmed = newCategory.trim();
  const duplicate = trimmed.length > 0 && draft.categories.includes(trimmed);

  const add = () => {
    if (!trimmed || duplicate) return;
    onChange({ ...draft, categories: [...draft.categories, trimmed] });
    setNewCategory('');
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Categories" size="lg" centered>
      <Stack gap="sm">
        <Alert variant="light" color="aether" icon={<IconInfoCircle size={18} />}>
          The first category is what the site opens on. Renaming one keeps every job&apos;s sets
          attached to it.
        </Alert>

        <Stack gap="xs">
          {draft.categories.map((category, index) => {
            const used = categoryUsage(draft, category);
            const confirming = pendingDelete === category;

            return (
              <Paper key={index} withBorder p="xs" radius="md">
                <Group gap="xs" wrap="nowrap">
                  <TextInput
                    flex={1}
                    value={category}
                    onChange={(e) => onChange(renameCategory(draft, category, e.currentTarget.value))}
                    error={
                      draft.categories.filter((c) => c === category).length > 1
                        ? 'Duplicate name'
                        : undefined
                    }
                  />
                  <Text size="xs" c="dimmed" w={72} ta="right">
                    {used} job{used === 1 ? '' : 's'}
                  </Text>
                  <Tooltip label="Move up">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      disabled={index === 0}
                      onClick={() => onChange({ ...draft, categories: move(draft.categories, index, index - 1) })}
                    >
                      <IconArrowUp size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Move down">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      disabled={index === draft.categories.length - 1}
                      onClick={() => onChange({ ...draft, categories: move(draft.categories, index, index + 1) })}
                    >
                      <IconArrowDown size={16} />
                    </ActionIcon>
                  </Tooltip>
                  {confirming ? (
                    <Button
                      size="compact-sm"
                      color="red"
                      onClick={() => {
                        onChange(deleteCategory(draft, category));
                        setPendingDelete(null);
                      }}
                      onBlur={() => setPendingDelete(null)}
                    >
                      Delete {used > 0 ? `(${used})` : ''}
                    </Button>
                  ) : (
                    <Tooltip label="Delete category">
                      <ActionIcon variant="subtle" color="red" onClick={() => setPendingDelete(category)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Paper>
            );
          })}
        </Stack>

        <Group gap="xs" align="flex-start">
          <TextInput
            flex={1}
            placeholder="New category, e.g. 7.5 (current)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') add();
            }}
            error={duplicate ? 'Already exists' : undefined}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={add} disabled={!trimmed || duplicate}>
            Add
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
