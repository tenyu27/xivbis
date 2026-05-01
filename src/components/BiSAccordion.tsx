import { 
  Accordion, 
  Group, 
  Image, 
  Text, 
  Button, 
  rgba, 
  useComputedColorScheme, 
  useMantineTheme,
  Paper
} from '@mantine/core';
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

interface BiSAccordionProps {
  sets: BiSSet[];
  category: string;
}

export function BiSAccordion({ sets, category }: BiSAccordionProps) {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const items = sets.map((set, index) => {
    const iconName = JOB_ICON_MAP[set.job] || 'none';
    const iconUrl = `https://raw.githubusercontent.com/xivapi/classjob-icons/master/companion/${iconName}.png`;
    const color = ROLE_COLOR_MAP[set.role] || 'gray';

    const itemBg = computedColorScheme === 'dark'
      ? rgba(theme.colors[color][9], 0.15)
      : rgba(theme.colors[color][1], 0.6);

    return (
      <Accordion.Item key={`${category}-${set.job}-${index}`} value={set.job} bg={itemBg}>
        <Accordion.Control>
          <Group gap="lg">
            <Image src={iconUrl} w={32} h={32} fallbackSrc="https://raw.githubusercontent.com/xivapi/classjob-icons/master/companion/none.png" />
            <Text fw={700} size="md">{set.jobName}</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Group gap="xs">
            {set.sets.map((item, idx) => (
              <Button
                key={idx}
                id={`bis-link-${set.job.toLowerCase()}-${idx}`}
                component="a"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                color="cyan"
                size="sm"
                radius="md"
                rightSection={<IconExternalLink size={14} />}
              >
                {item.name}
              </Button>
            ))}
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  return (
    <Accordion variant="default" radius="md" multiple>
      {items.length > 0 ? items : (
        <Paper p="xl" withBorder ta="center">
          <Text c="dimmed">No sets available for this category.</Text>
        </Paper>
      )}
    </Accordion>
  );
}
