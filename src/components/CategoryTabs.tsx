import { ScrollArea, Tabs } from '@mantine/core';

interface CategoryTabsProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryTabs({ categories, value, onChange }: CategoryTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={(val) => onChange(val || categories[0])}
      variant="pills"
      radius="xl"
      color="aether"
      w="100%"
    >
      <ScrollArea type="never" w="100%">
        <Tabs.List aria-label="Patch or fight">
          {categories.map((category) => (
            <Tabs.Tab key={category} value={category} px="lg" fw={600}>
              {category}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </ScrollArea>
    </Tabs>
  );
}
