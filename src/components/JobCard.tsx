import { Button, Card, Group, Image, Stack, Text } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { BiSSet } from '../types';
import { FALLBACK_JOB_ICON, jobIconUrl } from '../constants';

interface JobCardProps {
  set: BiSSet;
}

export function JobCard({ set }: JobCardProps) {
  return (
    <Card
      component="article"
      withBorder
      radius="lg"
      p="md"
      bg="var(--mantine-color-body)"
      shadow="xs"
    >
      <Stack gap="sm">
        <Group gap="sm" wrap="nowrap" align="center">
          <Image
            src={jobIconUrl(set.job)}
            fallbackSrc={FALLBACK_JOB_ICON}
            alt=""
            w={38}
            h={38}
            loading="lazy"
          />
          <Stack gap={2}>
            <Text component="h3" fw={700} fz="md" lh={1.2} m={0}>
              {set.jobName}
            </Text>
            <Text fz="xs" c="dimmed" fw={500} tt="uppercase" lts="0.5px">
              {set.job}
            </Text>
          </Stack>
        </Group>

        <Stack gap={6}>
          {set.sets.map((item, idx) => (
            <Button
              key={item.link}
              id={`bis-link-${set.job.toLowerCase()}-${idx}`}
              component="a"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="default"
              size="sm"
              radius="md"
              justify="space-between"
              fullWidth
              h="auto"
              py={8}
              rightSection={<IconArrowUpRight size={16} stroke={1.8} />}
            >
              {item.name}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
