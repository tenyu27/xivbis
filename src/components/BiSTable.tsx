import { Table, Group, Image, Text, Button, Card, rgba, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { BiSSet } from '../types';

const JOB_ICON_MAP: Record<string, string> = {
  PLD: 'paladin',
  WAR: 'warrior',
  DRK: 'darkknight',
  GNB: 'gunbreaker',
  WHM: 'whitemage',
  SCH: 'scholar',
  AST: 'astrologian',
  SGE: 'sage',
  MNK: 'monk',
  DRG: 'dragoon',
  NIN: 'ninja',
  SAM: 'samurai',
  RPR: 'reaper',
  VPR: 'vpr',
  BRD: 'bard',
  MCH: 'machinist',
  DNC: 'dancer',
  BLM: 'blackmage',
  SMN: 'summoner',
  RDM: 'redmage',
  PCT: 'pct',
};

const ROLE_COLOR_MAP = {
  Tank: 'blue',
  Healer: 'green',
  DPS: 'red',
};

interface BiSTableProps {
  sets: BiSSet[];
  category: string;
}

export function BiSTable({ sets, category }: BiSTableProps) {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const rows = sets.map((set, index) => {
    const iconName = JOB_ICON_MAP[set.job] || 'none';
    const iconUrl = `https://raw.githubusercontent.com/xivapi/classjob-icons/master/companion/${iconName}.png`;
    const color = ROLE_COLOR_MAP[set.role] || 'gray';

    const rowBg = computedColorScheme === 'dark'
      ? rgba(theme.colors[color][9], 0.25)
      : rgba(theme.colors[color][1], 1);

    return (
      <Table.Tr key={`${category}-${set.job}-${index}`} bg={rowBg}>
        <Table.Td w={90}>
          <Group gap="sm">
            <Image src={iconUrl} w={32} h={32} fallbackSrc="https://raw.githubusercontent.com/xivapi/classjob-icons/master/companion/none.png" />
          </Group>
        </Table.Td>
        <Table.Td>
          <Text fw={700} size="sm">{set.job}</Text>
        </Table.Td>
        <Table.Td>
          <Group justify="flex-end">
            <Button
              component="a"
              href={set.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="filled"
              color={color}
              size="compact-sm"
              rightSection={<IconExternalLink size={14} />}
            >
              View BiS
            </Button>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card withBorder radius="md" p={0}>
      <Table verticalSpacing="md" horizontalSpacing="lg" withRowBorders>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text ta="center" py="xl" c="dimmed">No sets available for this category.</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
