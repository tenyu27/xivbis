import { useEffect, useState } from 'react';
import { Autocomplete, Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { JOB_ICON_MAP, ROLE_ORDER } from '../../constants';
import { Draft, DraftJob, rolesIn } from '../model';

interface Props {
  opened: boolean;
  onClose: () => void;
  draft: Draft;
  onCreate: (job: DraftJob) => void;
}

export function AddJobModal({ opened, onClose, draft, onCreate }: Props) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (opened) {
      setCode('');
      setName('');
      setRole('');
    }
  }, [opened]);

  const trimmedCode = code.trim().toUpperCase();
  const taken = draft.jobs.some((j) => j.code === trimmedCode);
  const valid = trimmedCode.length > 0 && name.trim().length > 0 && role.trim().length > 0 && !taken;

  const submit = () => {
    if (!valid) return;
    onCreate({ code: trimmedCode, name: name.trim(), role: role.trim(), sets: {} });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add job" centered>
      <Stack gap="sm">
        <Autocomplete
          label="Job code"
          description="Known codes get their icon automatically"
          placeholder="PLD"
          data={Object.keys(JOB_ICON_MAP)}
          value={code}
          onChange={(value) => setCode(value.toUpperCase())}
          error={taken ? 'That code is already in use' : undefined}
          data-autofocus
        />
        <TextInput
          label="Display name"
          placeholder="Paladin"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <Autocomplete
          label="Role"
          placeholder="Tank"
          data={rolesIn(draft, ROLE_ORDER)}
          value={role}
          onChange={setRole}
        />
        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!valid}>
            Add job
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
