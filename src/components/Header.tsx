import { Group, Box, Text, ActionIcon, useComputedColorScheme, useMantineColorScheme, Anchor, Button } from '@mantine/core';
import { IconSun, IconMoon, IconMessageCircle } from '@tabler/icons-react';

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Group justify="space-between" align="flex-start" mb="xl" pt="md">
      <Box>
        <Text 
          component="h1"
          variant="gradient" 
          gradient={{ from: 'cyan', to: 'indigo', deg: 135 }} 
          fw={700} 
          fz="3rem"
          lh="1"
          lts="-1px"
          m={0}
        >
          XIVBiS
        </Text>
        <Text size="md" c="dimmed" mt="xs" fw={500}>
          Curated list of best-in-slot gear sets, sourced from{' '}
          <Anchor href="https://www.thebalanceffxiv.com/" target="_blank" rel="noopener noreferrer" inherit fw={600} c="cyan" underline="hover">
            The Balance
          </Anchor>
        </Text>
      </Box>
      <Group gap="xs">
        <Button
          component="a"
          href="https://forms.gle/r6p5S3Z7tDadiLkFA"
          target="_blank"
          rel="noopener noreferrer"
          variant="light"
          color="cyan"
          size="sm"
          radius="md"
          leftSection={<IconMessageCircle size={16} stroke={1.5} />}
        >
          Feedback
        </Button>
        <ActionIcon
          id="theme-toggle"
          onClick={toggleColorScheme}
          variant="light"
          color={computedColorScheme === 'dark' ? 'yellow' : 'indigo'}
          size="lg"
          aria-label="Toggle color scheme"
          radius="md"
        >
          {computedColorScheme === 'dark' ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
