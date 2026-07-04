import type { StatusUpdate } from '@/types';

export type BuildingStageKey =
  | 'site_handover'
  | 'excavation'
  | 'foundation'
  | 'plinth'
  | 'superstructure'
  | 'roof'
  | 'masonry'
  | 'electrical_plumbing'
  | 'plastering'
  | 'flooring'
  | 'painting'
  | 'fixtures'
  | 'external_works'
  | 'testing_inspection'
  | 'handover'
  | 'maintenance';

export interface BuildingStage {
  key: BuildingStageKey;
  en: string;
  hi: string;
  percent: number;
  color: string;
  message: string;
  messageHi: string;
}

export const BUILDING_STAGES: BuildingStage[] = [
  {
    key: 'site_handover',
    en: 'Site Handover',
    hi: 'साइट सौंपना',
    percent: 2,
    color: '#64748b',
    message: 'Site handed over to contractor; boundary pegs and layout marked',
    messageHi: 'ठेकेदार को साइट सौंपी; सीमा व लेआउट चिह्नित',
  },
  {
    key: 'excavation',
    en: 'Excavation',
    hi: 'खुदाई',
    percent: 6,
    color: '#92400e',
    message: 'Excavation and soil dressing completed',
    messageHi: 'खुदाई व मिट्टी समतलीकरण पूर्ण',
  },
  {
    key: 'foundation',
    en: 'Foundation',
    hi: 'नींव',
    percent: 12,
    color: '#78716c',
    message: 'Foundation footings cast and backfilled',
    messageHi: 'नींव के फुटings ढले व बैकफिल किया',
  },
  {
    key: 'plinth',
    en: 'Plinth',
    hi: 'प्लिंथ',
    percent: 18,
    color: '#57534e',
    message: 'Plinth beam casting completed with DPC',
    messageHi: 'DPC सहित प्लिंथ बीम ढलाई पूर्ण',
  },
  {
    key: 'superstructure',
    en: 'Superstructure',
    hi: 'सुपरस्ट्रक्चर',
    percent: 28,
    color: '#0369a1',
    message: 'RCC columns and beams erected up to terrace level',
    messageHi: 'RCC स्तंभ व बीम टेरेस स्तर तक खड़े',
  },
  {
    key: 'roof',
    en: 'Roof',
    hi: 'छत',
    percent: 36,
    color: '#b45309',
    message: 'Roof slab cast; waterproofing membrane applied',
    messageHi: 'छत स्लैब ढली; वॉटरप्रूफing मेमbrane लगाई',
  },
  {
    key: 'masonry',
    en: 'Masonry',
    hi: 'चिनाई',
    percent: 44,
    color: '#c2410c',
    message: 'Internal and external brick/block masonry completed',
    messageHi: 'आंतरिक व बाहरी चिनाई कार्य पूर्ण',
  },
  {
    key: 'electrical_plumbing',
    en: 'Electrical & Plumbing',
    hi: 'विद्युत व नलिका',
    percent: 52,
    color: '#ca8a04',
    message: 'Conduit piping and plumbing rough-in completed',
    messageHi: 'कंड्यूट पाइपिंग व प्लंबिंग रफ-इन पूर्ण',
  },
  {
    key: 'plastering',
    en: 'Plastering',
    hi: 'पलस्तर',
    percent: 58,
    color: '#a3a3a3',
    message: 'Internal cement plaster and external render applied',
    messageHi: 'आंतरिक सीमेंट पलस्तर व बाहरी रेंडर लगाया',
  },
  {
    key: 'flooring',
    en: 'Flooring',
    hi: 'फर्श',
    percent: 64,
    color: '#854d0e',
    message: 'Vitrified tile flooring laid on GF and FF',
    messageHi: 'भू-तल व पहली मंजिल पर vitrified टाइल फर्श',
  },
  {
    key: 'painting',
    en: 'Painting',
    hi: 'पेंटिंग',
    percent: 70,
    color: '#7c3aed',
    message: 'Interior emulsion and exterior weather-coat painting in progress',
    messageHi: 'आंतरिक emulsion व बाहरी weather-coat पेंटिंग प्रगति पर',
  },
  {
    key: 'fixtures',
    en: 'Fixtures',
    hi: 'फिक्स्चर',
    percent: 76,
    color: '#0891b2',
    message: 'Doors, windows, and sanitary fixtures being installed',
    messageHi: 'दरवाजे, खिड़कियां व सैनिटरी फिक्स्चर लगाए जा रहे',
  },
  {
    key: 'external_works',
    en: 'External Works',
    hi: 'बाहरी कार्य',
    percent: 82,
    color: '#15803d',
    message: 'Approach road, drainage, and landscaping underway',
    messageHi: 'पहुंच मार्ग, जल निकासी व लैंडस्केपिंग प्रगति पर',
  },
  {
    key: 'testing_inspection',
    en: 'Testing & Inspection',
    hi: 'परीक्षण व निरीक्षण',
    percent: 88,
    color: '#dc2626',
    message: 'Electrical load test and plumbing pressure test scheduled',
    messageHi: 'विद्युत लोड व प्लंबिंग दबाव परीक्षण निर्धारित',
  },
  {
    key: 'handover',
    en: 'Handover',
    hi: 'सौंप-अ',
    percent: 94,
    color: '#059669',
    message: 'Substantial completion certificate issued; snag list open',
    messageHi: 'उल्लेखनीय पूर्णता प्रमाणपत्र जारी; snag सूची खुली',
  },
  {
    key: 'maintenance',
    en: 'Maintenance',
    hi: 'रख-रखाव',
    percent: 98,
    color: '#4338ca',
    message: 'Defect liability period monitoring commenced',
    messageHi: 'दोष दायित्व अवधि निगरानी शुरू',
  },
];

const STAGE_ALIASES: Record<string, BuildingStageKey> = {
  site_handover: 'site_handover',
  excavation: 'excavation',
  foundation: 'foundation',
  plinth: 'plinth',
  superstructure: 'superstructure',
  roof: 'roof',
  chhat: 'roof',
  masonry: 'masonry',
  electrical_plumbing: 'electrical_plumbing',
  'electrical_&_plumbing': 'electrical_plumbing',
  plastering: 'plastering',
  flooring: 'flooring',
  painting: 'painting',
  fixtures: 'fixtures',
  external_works: 'external_works',
  testing_inspection: 'testing_inspection',
  'testing_&_inspection': 'testing_inspection',
  handover: 'handover',
  maintenance: 'maintenance',
  base: 'superstructure',
  first_floor: 'superstructure',
};

export function normalizeMilestone(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s*&\s*/g, '_')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

export function stageFromMilestone(label?: string): BuildingStage | undefined {
  if (!label) return undefined;
  const norm = normalizeMilestone(label);
  const key = STAGE_ALIASES[norm] ?? (BUILDING_STAGES.find((s) => s.key === norm)?.key);
  if (!key) {
    return BUILDING_STAGES.find(
      (s) => s.en.toLowerCase() === label.toLowerCase() || normalizeMilestone(s.en) === norm,
    );
  }
  return BUILDING_STAGES.find((s) => s.key === key);
}

export function stageIndex(key: BuildingStageKey): number {
  return BUILDING_STAGES.findIndex((s) => s.key === key);
}

const SCENE_LABELS: Record<BuildingStageKey, string> = {
  site_handover: 'SITE HANDOVER',
  excavation: 'EXCAVATION',
  foundation: 'FOUNDATION',
  plinth: 'PLINTH',
  superstructure: 'SUPERSTRUCTURE',
  roof: 'ROOF',
  masonry: 'MASONRY',
  electrical_plumbing: 'ELECTRICAL & PLUMBING',
  plastering: 'PLASTERING',
  flooring: 'FLOORING',
  painting: 'PAINTING',
  fixtures: 'FIXTURES',
  external_works: 'EXTERNAL WORKS',
  testing_inspection: 'TESTING & INSPECTION',
  handover: 'HANDOVER',
  maintenance: 'MAINTENANCE',
};

/** Distinct inline SVG site photos per building construction stage. */
export function buildingStagePhoto(stage: BuildingStageKey, siteLabel: string): string {
  const title = SCENE_LABELS[stage];
  const scenes: Record<BuildingStageKey, string> = {
    site_handover: `
      <rect width='320' height='208' fill='#94a3b8'/>
      <rect x='24' y='40' width='272' height='168' fill='#86efac' stroke='#fff' stroke-width='3' stroke-dasharray='8 4'/>
      <circle cx='48' cy='64' r='8' fill='#ef4444'/><circle cx='272' cy='64' r='8' fill='#ef4444'/>
      <circle cx='48' cy='184' r='8' fill='#ef4444'/><circle cx='272' cy='184' r='8' fill='#ef4444'/>
      <rect x='120' y='88' width='80' height='48' fill='#fef9c3' stroke='#ca8a04' stroke-width='2' rx='4'/>
      <text x='160' y='118' fill='#854d0e' font-family='sans-serif' font-size='11' font-weight='700' text-anchor='middle'>SITE PLAN</text>`,
    excavation: `
      <rect width='320' height='208' fill='#87a96b'/>
      <rect y='130' width='320' height='78' fill='#6b5344'/>
      <rect x='70' y='98' width='180' height='64' fill='#4a3728'/>
      <rect x='250' y='108' width='40' height='20' fill='#f59e0b' rx='2'/>
      <rect x='254' y='90' width='8' height='24' fill='#374151'/>`,
    foundation: `
      <rect width='320' height='208' fill='#a8c686'/>
      <rect y='140' width='320' height='68' fill='#78716c'/>
      <rect x='50' y='118' width='48' height='28' fill='#9ca3af' stroke='#57534e' stroke-width='2'/>
      <rect x='136' y='118' width='48' height='28' fill='#9ca3af' stroke='#57534e' stroke-width='2'/>
      <rect x='222' y='118' width='48' height='28' fill='#9ca3af' stroke='#57534e' stroke-width='2'/>`,
    plinth: `
      <rect width='320' height='208' fill='#9cb87a'/>
      <rect y='148' width='320' height='60' fill='#78716c'/>
      <rect x='48' y='108' width='224' height='40' fill='#a8a29e' stroke='#57534e' stroke-width='3'/>
      <rect x='48' y='104' width='224' height='6' fill='#ef4444'/>`,
    superstructure: `
      <rect width='320' height='208' fill='#8fb56a'/>
      <rect y='168' width='320' height='40' fill='#78716c'/>
      <rect x='60' y='48' width='200' height='120' fill='#e7e5e4' stroke='#57534e' stroke-width='2'/>
      <rect x='76' y='64' width='20' height='104' fill='#a8a29e'/>
      <rect x='150' y='64' width='20' height='104' fill='#a8a29e'/>
      <rect x='224' y='64' width='20' height='104' fill='#a8a29e'/>
      <rect x='60' y='40' width='200' height='10' fill='#57534e'/>`,
    roof: `
      <rect width='320' height='208' fill='#7fad62'/>
      <rect y='172' width='320' height='36' fill='#78716c'/>
      <rect x='48' y='56' width='224' height='116' fill='#f5f5f4' stroke='#57534e' stroke-width='2'/>
      <rect x='40' y='48' width='240' height='12' fill='#57534e'/>
      <rect x='36' y='44' width='248' height='6' fill='#1e40af' opacity='0.7'/>`,
    masonry: `
      <rect width='320' height='208' fill='#9cb87a'/>
      <rect x='56' y='40' width='208' height='168' fill='#fecaca' stroke='#b91c1c' stroke-width='2'/>
      <line x1='56' y1='68' x2='264' y2='68' stroke='#991b1b' stroke-width='1' opacity='0.5'/>
      <line x1='56' y1='96' x2='264' y2='96' stroke='#991b1b' stroke-width='1' opacity='0.5'/>
      <line x1='56' y1='124' x2='264' y2='124' stroke='#991b1b' stroke-width='1' opacity='0.5'/>
      <rect x='120' y='120' width='40' height='60' fill='#fef3c7' stroke='#92400e' stroke-width='2'/>`,
    electrical_plumbing: `
      <rect width='320' height='208' fill='#e2e8f0'/>
      <rect x='40' y='32' width='240' height='176' fill='#f8fafc' stroke='#64748b' stroke-width='2'/>
      <path d='M60 60 H260' stroke='#eab308' stroke-width='4' fill='none'/>
      <path d='M60 90 H200' stroke='#3b82f6' stroke-width='4' fill='none'/>
      <circle cx='80' cy='60' r='6' fill='#eab308'/><circle cx='120' cy='90' r='6' fill='#3b82f6'/>
      <rect x='180' y='140' width='40' height='50' fill='#e2e8f0' stroke='#64748b' stroke-width='2' rx='2'/>`,
    plastering: `
      <rect width='320' height='208' fill='#cbd5e1'/>
      <rect x='48' y='36' width='224' height='172' fill='#f1f5f9' stroke='#94a3b8' stroke-width='2'/>
      <rect x='48' y='36' width='224' height='80' fill='#e2e8f0' opacity='0.9'/>
      <rect x='200' y='48' width='24' height='48' fill='#94a3b8' opacity='0.6' transform='rotate(15 212 72)'/>`,
    flooring: `
      <rect width='320' height='208' fill='#f5f5f4'/>
      <rect x='32' y='48' width='256' height='160' fill='#fef3c7' stroke='#d97706' stroke-width='2'/>
      <line x1='32' y1='88' x2='288' y2='88' stroke='#d97706' stroke-width='1' opacity='0.4'/>
      <line x1='32' y1='128' x2='288' y2='128' stroke='#d97706' stroke-width='1' opacity='0.4'/>
      <line x1='112' y1='48' x2='112' y2='208' stroke='#d97706' stroke-width='1' opacity='0.4'/>
      <line x1='192' y1='48' x2='192' y2='208' stroke='#d97706' stroke-width='1' opacity='0.4'/>`,
    painting: `
      <rect width='320' height='208' fill='#ede9fe'/>
      <rect x='48' y='40' width='224' height='168' fill='#ddd6fe' stroke='#7c3aed' stroke-width='2'/>
      <rect x='220' y='60' width='36' height='8' fill='#7c3aed' rx='2'/>
      <rect x='220' y='80' width='28' height='60' fill='#a78bfa' rx='2'/>
      <rect x='60' y='100' width='140' height='80' fill='#c4b5fd' opacity='0.5'/>`,
    fixtures: `
      <rect width='320' height='208' fill='#ecfeff'/>
      <rect x='56' y='32' width='208' height='176' fill='#f0fdfa' stroke='#0891b2' stroke-width='2'/>
      <rect x='80' y='56' width='48' height='120' fill='#a5f3fc' stroke='#0891b2' stroke-width='2'/>
      <rect x='192' y='80' width='56' height='40' fill='#fff' stroke='#64748b' stroke-width='2' rx='2'/>
      <circle cx='220' cy='160' r='14' fill='#fff' stroke='#64748b' stroke-width='2'/>`,
    external_works: `
      <rect width='320' height='208' fill='#86efac'/>
      <rect y='160' width='320' height='48' fill='#78716c'/>
      <rect y='148' width='320' height='14' fill='#57534e'/>
      <circle cx='80' cy='120' r='28' fill='#22c55e'/><circle cx='240' cy='100' r='36' fill='#16a34a'/>
      <rect x='130' y='170' width='60' height='8' fill='#fbbf24'/>`,
    testing_inspection: `
      <rect width='320' height='208' fill='#fef2f2'/>
      <rect x='48' y='48' width='224' height='152' fill='#fff' stroke='#dc2626' stroke-width='2' stroke-dasharray='6 3'/>
      <text x='160' y='100' fill='#dc2626' font-family='sans-serif' font-size='22' font-weight='700' text-anchor='middle'>QC</text>
      <path d='M100 140 L130 168 L200 88' stroke='#16a34a' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/>`,
    handover: `
      <rect width='320' height='208' fill='#ecfdf5'/>
      <rect x='72' y='48' width='176' height='120' fill='#fff' stroke='#059669' stroke-width='3' rx='4'/>
      <text x='160' y='100' fill='#059669' font-family='sans-serif' font-size='14' font-weight='700' text-anchor='middle'>COMPLETION</text>
      <text x='160' y='120' fill='#059669' font-family='sans-serif' font-size='14' font-weight='700' text-anchor='middle'>CERTIFICATE</text>
      <rect x='120' y='130' width='80' height='24' fill='#059669' rx='2'/>`,
    maintenance: `
      <rect width='320' height='208' fill='#eef2ff'/>
      <rect x='56' y='40' width='208' height='168' fill='#e0e7ff' stroke='#4338ca' stroke-width='2'/>
      <circle cx='160' cy='110' r='40' fill='#4338ca' opacity='0.15'/>
      <text x='160' y='108' fill='#4338ca' font-family='sans-serif' font-size='28' font-weight='700' text-anchor='middle'>DL</text>
      <text x='160' y='132' fill='#4338ca' font-family='sans-serif' font-size='10' font-weight='600' text-anchor='middle'>DEFECT LIABILITY</text>`,
  };

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='240' viewBox='0 0 320 240'>` +
    scenes[stage] +
    `<text x='160' y='22' fill='#1e293b' font-family='sans-serif' font-size='11' font-weight='700' text-anchor='middle'>${title}</text>` +
    `<rect x='0' y='208' width='320' height='32' fill='rgba(0,0,0,0.65)'/>` +
    `<text x='8' y='229' fill='#ffffff' font-family='sans-serif' font-size='10'>${siteLabel}</text>` +
    `</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/** Generate seeded status updates for a building project up to a given stage (inclusive). */
export function buildingStageSeedUpdates(
  projectId: string,
  siteShort: string,
  lat: number,
  lng: number,
  upToIndex: number,
  daysAgoFn: (n: number) => string,
  officer = { id: 'user-ee-raipur', name: 'Amit Sharma' },
): Omit<StatusUpdate, 'id'>[] {
  const stages = BUILDING_STAGES.slice(0, upToIndex + 1);
  const span = 100;
  const step = Math.floor(span / Math.max(stages.length, 1));

  return stages.map((stage, i) => ({
    projectId,
    message: stage.message,
    messageHi: stage.messageHi,
    completionPercent: stage.percent,
    milestoneLabel: stage.en,
    createdAt: daysAgoFn(span - i * step),
    createdBy: officer.id,
    createdByName: officer.name,
    photoDataUrl: buildingStagePhoto(stage.key, `${siteShort} · ${stage.en} · ON-SITE`),
    lat,
    lng,
    accuracyM: 8 + (i % 5),
    distanceM: 15 + i * 2,
    onSite: true,
  }));
}

export function latestBuildingStageIndex(updates: { milestoneLabel?: string }[]): number {
  return updates.reduce((max, u) => {
    const stage = stageFromMilestone(u.milestoneLabel);
    return stage ? Math.max(max, stageIndex(stage.key)) : max;
  }, -1);
}
