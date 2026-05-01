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
      ? rgba(theme.colors[color][9], 0.1)
      : rgba(theme.colors[color][1], 0.5);

    const borderColor = computedColorScheme === 'dark'
      ? rgba(theme.colors[color][7], 0.2)
      : rgba(theme.colors[color][3], 0.3);

    return (
      <Accordion.Item 
        key={`${category}-${set.job}-${index}`} 
        value={set.job} 
        bg={itemBg}
        bd={`1px solid ${borderColor}`}
      >
        <Accordion.Control>
          <Group gap="lg">
            <Image 
              src={iconUrl} 
              w={32} 
              h={32} 
              fallbackSrc="https://raw.githubusercontent.com/xivapi/classjob-icons/master/companion/none.png" 
            />
            <Text fw={700} size="md">{set.jobName}</Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Group gap="sm" pt="xs">
            {set.sets.map((item, idx) => (
              <Button
                key={idx}
                id={`bis-link-${set.job.toLowerCase()}-${idx}`}
                component="a"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variant="gradient"
                gradient={computedColorScheme === 'dark' ? { from: 'dark.6', to: 'dark.4' } : { from: 'gray.1', to: 'white' }}
                c={computedColorScheme === 'dark' ? 'gray.1' : 'dark.8'}
                size="sm"
                bd={`1px solid ${computedColorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`}
                rightSection={<IconExternalLink size={16} opacity={0.6} />}
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
    <Accordion multiple>
      {items.length > 0 ? items : (
        <Paper p="xl" withBorder ta="center" radius="md">
          <Text c="dimmed">No sets available for this category.</Text>
        </Paper>
      )}
    </Accordion>
  );
}
