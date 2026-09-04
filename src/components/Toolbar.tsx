import { useEffect, useRef, useState } from 'react';
import { Box, CloseButton, Container, Group, Paper, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { CategoryTabs } from './CategoryTabs';

interface ToolbarProps {
  categories: string[];
  category: string;
  onCategoryChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  /** Must match the page background so content scrolls out of sight behind it. */
  bg: string;
}

export function Toolbar({
  categories,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  bg,
}: ToolbarProps) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  // The sentinel sits one pixel above the bar; once it leaves the viewport the
  // bar has reached the top and is stuck.
  useEffect(() => {
    const target = sentinel.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => setPinned(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Box ref={sentinel} h={1} />
      <Paper variant="toolbar" bg={bg} py="sm" shadow={pinned ? 'sm' : undefined}>
        <Container size="lg" px={{ base: 'md', sm: 'xl' }}>
          <Group justify="space-between" align="center" gap="sm" wrap="wrap">
            <Box flex="1" miw={0} w={{ base: '100%', sm: 'auto' }}>
              <CategoryTabs categories={categories} value={category} onChange={onCategoryChange} />
            </Box>
            <TextInput
              value={query}
              onChange={(event) => onQueryChange(event.currentTarget.value)}
              placeholder="Search job or role"
              aria-label="Search job or role"
              radius="xl"
              size="sm"
              w={{ base: '100%', sm: 240 }}
              leftSection={<IconSearch size={16} stroke={1.8} />}
              rightSection={
                query ? (
                  <CloseButton
                    size="sm"
                    onClick={() => onQueryChange('')}
                    aria-label="Clear search"
                  />
                ) : null
              }
            />
          </Group>
        </Container>
      </Paper>
    </>
  );
}
