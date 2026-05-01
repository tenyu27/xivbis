import { Group, Box, Text, ActionIcon, useComputedColorScheme, useMantineColorScheme, Anchor } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Group justify="space-between" align="center" mb="lg">
      <Box>
        <Text 
          variant="gradient" 
          gradient={{ from: 'blue', to: 'cyan', deg: 90 }} 
          fw={800} 
          fz="2rem"
          lh="1.1"
        >
          XIVBiS
        </Text>
        <Text size="sm" c="dimmed" lts="1px" mt="sm">
          Curated list of best-in-slot sets, sourced from{' '}
          <Anchor href="https://www.thebalanceffxiv.com/" target="_blank" rel="noopener noreferrer" inherit underline="hover">
            The Balance
          </Anchor>
        </Text>
      </Box>
      <ActionIcon 
        onClick={toggleColorScheme} 
        variant="default" 
        size="lg" 
        aria-label="Toggle color scheme"
        radius="md"
      >
        {computedColorScheme === 'dark' ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
      </ActionIcon>
    </Group>
  );
}
