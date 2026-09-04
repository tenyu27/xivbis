export const JOB_ICON_MAP: Record<string, string> = {
  PLD: 'paladin',
  WAR: 'warrior',
  DRK: 'darkknight',
  GNB: 'gunbreaker',
  WHM: 'whitemage',
  SCH: 'scholar',
  AST: 'astrologian',
  SGE: 'sage',
  MNK: 'monk',
  DRG: 'dragoon',
  NIN: 'ninja',
  SAM: 'samurai',
  RPR: 'reaper',
  VPR: 'vpr',
  BRD: 'bard',
  MCH: 'machinist',
  DNC: 'dancer',
  BLM: 'blackmage',
  SMN: 'summoner',
  RDM: 'redmage',
  PCT: 'pct',
};

export const ROLE_COLOR_MAP: Record<string, string> = {
  Tank: 'blue',
  Healer: 'teal',
  Melee: 'red',
  Ranged: 'orange',
  Caster: 'grape',
};

/** Display order for role sections; anything unknown is appended alphabetically. */
export const ROLE_ORDER = ['Tank', 'Healer', 'Melee', 'Ranged', 'Caster'];

const ICON_BASE = 'https://raw.githubusercontent.com/xivapi/classjob-icons/master/companion';

export const FALLBACK_JOB_ICON = `${ICON_BASE}/none.png`;

export function jobIconUrl(job: string) {
  return `${ICON_BASE}/${JOB_ICON_MAP[job] ?? 'none'}.png`;
}

export function roleColor(role: string) {
  return ROLE_COLOR_MAP[role] ?? 'gray';
}
