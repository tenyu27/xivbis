import { useState, useEffect } from 'react';
import { 
  AppShell, 
  Container, 
  Select, 
  Box, 
  Loader, 
  Center, 
  Stack, 
  useComputedColorScheme 
} from '@mantine/core';
import { Header } from './components/Header';
import { BiSAccordion } from './components/BiSAccordion';
import { Footer } from './components/Footer';
import { SetsData } from './types';

function App() {
  const [data, setData] = useState<SetsData | null>(null);
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    fetch('./data/sets.json')
      .then(res => res.json())
      .then((json: SetsData) => {
        setData(json);
        const categories = Object.keys(json);
        if (categories.length > 0) {
          setCategory(categories[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading sets:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <Center h="100vh" bg={computedColorScheme === 'dark' ? 'dark.8' : 'off-white.0'}>
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  const currentSets = data[category] || [];

  return (
    <AppShell padding="md">
      <AppShell.Main bg={computedColorScheme === 'dark' ? 'dark.8' : 'off-white.1'}>
        <Container size="sm" py="xl">
          <Stack gap="xl">
            <Header />

            <Box>
              <Select
                id="category-select"
                placeholder="Pick a patch or fight"
                data={Object.keys(data)}
                value={category}
                onChange={(val) => setCategory(val || Object.keys(data)[0])}
                allowDeselect={false}
                size="md"
                maxDropdownHeight={400}
                w={{ base: '100%', sm: 300 }}
              />
            </Box>

            <BiSAccordion sets={currentSets} category={category} />
          </Stack>
        </Container>
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}

export default App;
