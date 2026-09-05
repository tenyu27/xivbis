import { useEffect, useMemo, useState } from 'react';
import { Box, Center, Container, Loader, Stack, Text, useComputedColorScheme } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Toolbar } from './components/Toolbar';
import { JobGrid } from './components/JobGrid';
import { Footer } from './components/Footer';
import { BiSSet, JobData, SetsData } from './types';

const jobPageSlug = window.location.pathname.match(/\/([a-z-]+)-bis\/?$/)?.[1];

function App() {
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  const pageBg = computedColorScheme === 'dark' ? 'dark.8' : 'gray.0';
  const [data, setData] = useState<SetsData | null>(null);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    fetch('./data/sets.json')
      .then((res) => res.json())
      .then((json: SetsData) => {
        setData(json);
        if (json.categories.length > 0) setCategory(json.categories[0]);
        if (jobPageSlug) {
          const matchedJob = Object.entries(json).find(([, value]) => {
            if (Array.isArray(value)) return false;
            return value.name.toLowerCase().replace(/ /g, '-') === jobPageSlug;
          });
          if (matchedJob) setQuery(matchedJob[0]);
        }
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Error loading sets:', err);
        setStatus('error');
      });
  }, []);

  const jobs = useMemo<BiSSet[]>(() => {
    if (!data) return [];
    return Object.entries(data)
      .filter(([key, value]) => key !== 'categories' && !Array.isArray(value))
      .map(([jobCode, jobData]) => {
        const job = jobData as JobData;
        return {
          job: jobCode,
          jobName: job.name,
          role: job.Role,
          sets: job.Sets[category] || [],
        };
      })
      .filter((set) => set.sets.length > 0);
  }, [data, category]);

  const visibleJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (set) =>
        set.jobName.toLowerCase().includes(q) ||
        set.job.toLowerCase().includes(q) ||
        set.role.toLowerCase().includes(q)
    );
  }, [jobs, query]);

  return (
    <Box mih="100vh" bg={pageBg}>
      <Container size="lg" px={{ base: 'md', sm: 'xl' }}>
        <Header />

        {status === 'loading' && (
          <Center mih="60vh">
            <Loader size="lg" type="dots" />
          </Center>
        )}

        {status === 'error' && (
          <Center mih="60vh">
            <Stack gap="xs" align="center">
              <IconAlertTriangle size={32} stroke={1.5} />
              <Text fw={600}>Could not load the gear sets</Text>
              <Text size="sm" c="dimmed">
                Refresh the page to try again.
              </Text>
            </Stack>
          </Center>
        )}

        {status === 'ready' && data && <Hero />}
      </Container>

      {status === 'ready' && data && (
        <>
          <Toolbar
            categories={data.categories}
            category={category}
            onCategoryChange={setCategory}
            query={query}
            onQueryChange={setQuery}
            bg={pageBg}
          />
          <Container size="lg" px={{ base: 'md', sm: 'xl' }} pt="md" pb={64}>
            <JobGrid sets={visibleJobs} />
          </Container>
        </>
      )}

      <Footer />
    </Box>
  );
}

export default App;
