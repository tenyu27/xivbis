import { useState, useEffect } from 'react';
import { Box, Container, Text, Group } from '@mantine/core';

export function Footer() {
  const [lastUpdated, setLastUpdated] = useState<string>('Loading...');

  useEffect(() => {
    // Fetch last commit date for the sets.json file
    fetch('https://api.github.com/repos/tenyu27/xivbis/commits?path=public/data/sets.json&per_page=1')
      .then(res => res.json())
      .then(data => {
        if (data && data[0] && data[0].commit && data[0].commit.committer) {
          const date = new Date(data[0].commit.committer.date);
          setLastUpdated(date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }));
        } else {
          setLastUpdated('Recently');
        }
      })
      .catch(() => setLastUpdated('Recently'));
  }, []);

  return (
    <Box component="footer" pb="xl" pt="lg">
      <Container size="sm">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Made by tenyu
          </Text>
          <Text size="sm" c="dimmed">
            Last updated: {lastUpdated}
          </Text>
        </Group>
      </Container>
    </Box>
  );
}
