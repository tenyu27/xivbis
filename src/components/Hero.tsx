import { Anchor, Stack, Text, Title } from '@mantine/core';

export function Hero() {
  return (
    <Stack gap={6} pt={{ base: 'xs', sm: 'md' }} pb="md">
      <Title order={1} fz={{ base: '1.75rem', sm: '2rem' }} lts="-0.5px">
        FFXIV best-in-slot gear sets
      </Title>
      <Text c="dimmed">
        Gear sets for all 21 combat jobs, sourced from{' '}
        <Anchor
          href="https://www.thebalanceffxiv.com/"
          target="_blank"
          rel="noopener noreferrer"
          inherit
          fw={600}
        >
          The Balance
        </Anchor>
      </Text>
    </Stack>
  );
}
