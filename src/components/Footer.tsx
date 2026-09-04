import { useEffect, useState } from 'react';
import { Anchor, Box, Container, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconCoffee } from '@tabler/icons-react';

export function Footer() {
  const [lastUpdated, setLastUpdated] = useState('...');

  useEffect(() => {
    // Last commit date for sets.json, so visitors can judge freshness.
    fetch('https://api.github.com/repos/tenyu27/xivbis/commits?path=public/data/sets.json&per_page=1')
      .then((res) => res.json())
      .then((data) => {
        const committed = data?.[0]?.commit?.committer?.date;
        setLastUpdated(
          committed
            ? new Date(committed).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Recently'
        );
      })
      .catch(() => setLastUpdated('Recently'));
  }, []);

  return (
    <Box component="footer" mt="xl">
      <Divider />
      <Container size="lg" px={{ base: 'md', sm: 'xl' }} py="xl">
        <Stack gap="md">
          <Group justify="space-between" gap="md" wrap="wrap">
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Made by tenyu
              </Text>
              <Tooltip label="Support on Ko-fi" withArrow>
                <Anchor
                  href="https://ko-fi.com/tenyu"
                  target="_blank"
                  rel="noopener noreferrer"
                  c="dimmed"
                  aria-label="Support tenyu on Ko-fi"
                  display="flex"
                >
                  <IconCoffee size={18} stroke={1.7} />
                </Anchor>
              </Tooltip>
            </Group>

            <Text size="sm" c="dimmed">
              Sets last updated: {lastUpdated}
            </Text>
          </Group>

          <Text size="xs" c="dimmed">
            FINAL FANTASY XIV &copy; SQUARE ENIX CO., LTD. XIVBiS is a fan project and is not
            affiliated with Square Enix.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
