import { BiSSetItem, JobData, SetsData } from '../types';

/**
 * Editing shape for the admin page. `sets.json` is keyed by job code, which is
 * awkward to reorder or rename in place, so the editor works on an array of
 * jobs and serialises back to the on-disk shape on save.
 */
export interface DraftJob {
  code: string;
  name: string;
  role: string;
  sets: Record<string, BiSSetItem[]>;
}

export interface Draft {
  categories: string[];
  jobs: DraftJob[];
}

export function toDraft(data: SetsData): Draft {
  const categories = [...data.categories];
  const jobs: DraftJob[] = [];

  for (const [code, value] of Object.entries(data)) {
    if (code === 'categories' || Array.isArray(value)) continue;
    const job = value as JobData;
    jobs.push({
      code,
      name: job.name,
      role: job.Role,
      sets: Object.fromEntries(
        Object.entries(job.Sets ?? {}).map(([cat, items]) => [cat, items.map((i) => ({ ...i }))])
      ),
    });
  }

  return { categories, jobs };
}

/**
 * Serialises back to `sets.json`. Set groups are emitted in category order (with
 * any stragglers appended) and empty groups are dropped, so saving twice from
 * the same state always produces a byte-identical file.
 */
export function fromDraft(draft: Draft): SetsData {
  const out: Record<string, unknown> = { categories: [...draft.categories] };

  for (const job of draft.jobs) {
    const extras = Object.keys(job.sets).filter((c) => !draft.categories.includes(c));
    const sets: Record<string, BiSSetItem[]> = {};

    for (const cat of [...draft.categories, ...extras]) {
      const items = (job.sets[cat] ?? []).filter((i) => i.name.trim() || i.link.trim());
      if (items.length > 0) {
        sets[cat] = items.map((i) => ({ name: i.name.trim(), link: i.link.trim() }));
      }
    }

    out[job.code] = { name: job.name.trim(), Role: job.role.trim(), Sets: sets };
  }

  return out as unknown as SetsData;
}

export function serialise(draft: Draft): string {
  return `${JSON.stringify(fromDraft(draft), null, 2)}\n`;
}

export function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Roles already in use, so the role picker offers them without hardcoding. */
export function rolesIn(draft: Draft, extra: string[] = []): string[] {
  return [...new Set([...extra, ...draft.jobs.map((j) => j.role)])].filter(Boolean);
}

export function renameCategory(draft: Draft, from: string, to: string): Draft {
  return {
    categories: draft.categories.map((c) => (c === from ? to : c)),
    jobs: draft.jobs.map((job) => {
      if (!(from in job.sets)) return job;
      const sets: Record<string, BiSSetItem[]> = {};
      for (const [cat, items] of Object.entries(job.sets)) sets[cat === from ? to : cat] = items;
      return { ...job, sets };
    }),
  };
}

export function deleteCategory(draft: Draft, category: string): Draft {
  return {
    categories: draft.categories.filter((c) => c !== category),
    jobs: draft.jobs.map((job) => {
      const { [category]: _dropped, ...rest } = job.sets;
      return { ...job, sets: rest };
    }),
  };
}

/** How many jobs would lose data if `category` were removed. */
export function categoryUsage(draft: Draft, category: string): number {
  return draft.jobs.filter((job) => (job.sets[category]?.length ?? 0) > 0).length;
}
