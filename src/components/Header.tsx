import {
  ActionIcon,
  Anchor,
  Button,
  Group,
  Image,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMessageCircle, IconMoon, IconSun } from '@tabler/icons-react';

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  const isDark = computedColorScheme === 'dark';

  const toggleColorScheme = () => setColorScheme(isDark ? 'light' : 'dark');

  return (
    <Group h={60} justify="space-between" wrap="nowrap">
      <Anchor href="./" underline="never" c="inherit">
        <Group gap="xs" wrap="nowrap">
          <Image src="./favicon.svg" alt="" w={26} h={26} />
          <Text fw={800} fz="lg" lts="-0.5px">
            XIVBiS
          </Text>
        </Group>
      </Anchor>

      <Group gap="xs" wrap="nowrap">
        <Button
          component="a"
          href="https://forms.gle/r6p5S3Z7tDadiLkFA"
          target="_blank"
          rel="noopener noreferrer"
          variant="default"
          size="sm"
          h={36}
          radius="xl"
          leftSection={<IconMessageCircle size={16} stroke={1.7} />}
          visibleFrom="xs"
        >
          Feedback
        </Button>
        <ActionIcon
          component="a"
          href="https://forms.gle/r6p5S3Z7tDadiLkFA"
          target="_blank"
          rel="noopener noreferrer"
          variant="default"
          size={36}
          radius="xl"
          aria-label="Send feedback"
          hiddenFrom="xs"
        >
          <IconMessageCircle size={18} stroke={1.7} />
        </ActionIcon>

        <Tooltip label={isDark ? 'Light mode' : 'Dark mode'} withArrow>
          <ActionIcon
            id="theme-toggle"
            onClick={toggleColorScheme}
            variant="default"
            size={36}
            radius="xl"
            aria-label="Toggle color scheme"
          >
            {isDark ? <IconSun size={18} stroke={1.7} /> : <IconMoon size={18} stroke={1.7} />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
