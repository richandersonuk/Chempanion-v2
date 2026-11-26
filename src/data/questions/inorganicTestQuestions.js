export const CATION_OPTIONS = [
  'Mg²⁺',
  'Ca²⁺',
  'Sr²⁺',
  'Ba²⁺',
  'Na⁺',
  'K⁺',
  'NH₄⁺'
];

export const ANION_OPTIONS = [
  'Cl⁻',
  'Br⁻',
  'I⁻',
  'SO₄²⁻',
  'CO₃²⁻'
];

export const INORGANIC_SALTS = [
  {
    id: 'bacl2',
    code: 'A',
    name: 'Barium chloride',
    formula: 'BaCl₂',
    cation: 'Ba²⁺',
    anion: 'Cl⁻',
    tests: {
      flame: { observation: 'Apple-green flame', color: '#4ade80' },
      naoh: { observation: 'No precipitate (colourless solution); Ba(OH)₂ is soluble down Group 2', color: '#e0f2fe' },
      hcl: { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' },
      bacl2: { observation: 'No precipitate when BaCl₂(aq) added to itself', color: '#e0f2fe' },
      agno3: {
        observation: 'White precipitate of AgCl(s) forms immediately',
        color: '#f8fafc',
        nh3Result: 'Precipitate dissolves completely in dilute NH₃(aq) to give a colourless solution.'
      }
    },
    ionicEquations: [
      'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)'
    ],
    examinerNote: 'Apple-green flame + soluble hydroxide confirms Ba²⁺. White AgX precipitate soluble in dilute NH₃(aq) confirms Cl⁻.'
  },
  {
    id: 'mgbr2',
    code: 'B',
    name: 'Magnesium bromide',
    formula: 'MgBr₂',
    cation: 'Mg²⁺',
    anion: 'Br⁻',
    tests: {
      flame: { observation: 'No characteristic flame colour', color: '#93c5fd' },
      naoh: { observation: 'White precipitate of Mg(OH)₂(s), insoluble in excess NaOH(aq)', color: '#f8fafc' },
      hcl: { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' },
      bacl2: { observation: 'No precipitate (colourless solution); MgSO₄ is soluble', color: '#e0f2fe' },
      agno3: {
        observation: 'Cream precipitate of AgBr(s) forms',
        color: '#fef3c7',
        nh3Result: 'Insoluble in dilute NH₃(aq), but dissolves in concentrated NH₃(aq).'
      }
    },
    ionicEquations: [
      'Mg²⁺(aq) + 2OH⁻(aq) → Mg(OH)₂(s)',
      'Ag⁺(aq) + Br⁻(aq) → AgBr(s)'
    ],
    examinerNote: 'Group 2 hydroxide solubility increases down the group, so Mg(OH)₂ is insoluble (white ppt) with no flame colour. Cream precipitate soluble only in conc. NH₃ confirms Br⁻.'
  },
  {
    id: 'cai2',
    code: 'C',
    name: 'Calcium iodide',
    formula: 'CaI₂',
    cation: 'Ca²⁺',
    anion: 'I⁻',
    tests: {
      flame: { observation: 'Brick-red flame', color: '#ea580c' },
      naoh: { observation: 'Faint white precipitate of Ca(OH)₂(s) (sparingly soluble)', color: '#f1f5f9' },
      hcl: { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' },
      bacl2: { observation: 'No precipitate with BaCl₂(aq)', color: '#e0f2fe' },
      agno3: {
        observation: 'Pale yellow precipitate of AgI(s) forms',
        color: '#fde047',
        nh3Result: 'Precipitate is completely insoluble in both dilute and concentrated NH₃(aq).'
      }
    },
    ionicEquations: [
      'Ca²⁺(aq) + 2OH⁻(aq) → Ca(OH)₂(s)',
      'Ag⁺(aq) + I⁻(aq) → AgI(s)'
    ],
    examinerNote: 'Brick-red flame identifies Ca²⁺; pale yellow precipitate insoluble even in concentrated NH₃(aq) identifies I⁻.'
  },
  {
    id: 'srcl2',
    code: 'D',
    name: 'Strontium chloride',
    formula: 'SrCl₂',
    cation: 'Sr²⁺',
    anion: 'Cl⁻',
    tests: {
      flame: { observation: 'Crimson-red flame', color: '#dc2626' },
      naoh: { observation: 'Very slight white precipitate (sparingly soluble)', color: '#f1f5f9' },
      hcl: { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' },
      bacl2: { observation: 'No precipitate with BaCl₂(aq)', color: '#e0f2fe' },
      agno3: {
        observation: 'White precipitate of AgCl(s) forms',
        color: '#f8fafc',
        nh3Result: 'Precipitate dissolves readily in dilute NH₃(aq).'
      }
    },
    ionicEquations: [
      'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)'
    ],
    examinerNote: 'Crimson-red flame distinguishes Sr²⁺ from brick-red Ca²⁺. White AgCl precipitate dissolves in dilute NH₃(aq).'
  },
  {
    id: 'nh4cl',
    code: 'E',
    name: 'Ammonium chloride',
    formula: 'NH₄Cl',
    cation: 'NH₄⁺',
    anion: 'Cl⁻',
    tests: {
      flame: { observation: 'No characteristic metal flame colour (white smoke sublimes)', color: '#93c5fd' },
      naoh: { observation: 'No precipitate; on warming, pungent gas evolved that turns damp red litmus paper blue (NH₃)', color: '#e0f2fe' },
      hcl: { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' },
      bacl2: { observation: 'No precipitate with acidified BaCl₂(aq)', color: '#e0f2fe' },
      agno3: {
        observation: 'White precipitate of AgCl(s) forms',
        color: '#f8fafc',
        nh3Result: 'Precipitate dissolves in dilute NH₃(aq).'
      }
    },
    ionicEquations: [
      'NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)',
      'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)'
    ],
    examinerNote: 'Warming with NaOH(aq) releases alkaline NH₃(g) which turns damp red litmus blue—the definitive test for NH₄⁺.'
  },
  {
    id: 'mgso4',
    code: 'F',
    name: 'Magnesium sulfate',
    formula: 'MgSO₄',
    cation: 'Mg²⁺',
    anion: 'SO₄²⁻',
    tests: {
      flame: { observation: 'No characteristic flame colour', color: '#93c5fd' },
      naoh: { observation: 'White precipitate of Mg(OH)₂(s), insoluble in excess NaOH(aq)', color: '#f8fafc' },
      hcl: { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' },
      bacl2: { observation: 'Thick white precipitate of BaSO₄(s) forms, insoluble in dilute HCl', color: '#f8fafc' },
      agno3: {
        observation: 'No precipitate with acidified AgNO₃(aq)',
        color: '#e0f2fe'
      }
    },
    ionicEquations: [
      'Mg²⁺(aq) + 2OH⁻(aq) → Mg(OH)₂(s)',
      'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)'
    ],
    examinerNote: 'Group 2 sulfates decrease in solubility down the group, so BaSO₄ is an insoluble white precipitate when testing for SO₄²⁻ with acidified BaCl₂(aq).'
  },
  {
    id: 'na2co3',
    code: 'G',
    name: 'Sodium carbonate',
    formula: 'Na₂CO₃',
    cation: 'Na⁺',
    anion: 'CO₃²⁻',
    tests: {
      flame: { observation: 'Bright, persistent yellow-orange flame', color: '#facc15' },
      naoh: { observation: 'No precipitate and no gas evolved on warming', color: '#e0f2fe' },
      hcl: { observation: 'Vigorous effervescence; colourless gas evolved turns limewater milky/cloudy (CO₂)', color: '#f1f5f9' },
      bacl2: { observation: 'No precipitate after prior acidification with dilute HCl', color: '#e0f2fe' },
      agno3: {
        observation: 'No precipitate after prior acidification with dilute HNO₃',
        color: '#e0f2fe'
      }
    },
    ionicEquations: [
      'CO₃²⁻(aq) + 2H⁺(aq) → CO₂(g) + H₂O(l)'
    ],
    examinerNote: 'Prior acidification with dilute acid removes CO₃²⁻ as CO₂(g), preventing false white precipitates of BaCO₃(s) or Ag₂CO₃(s) in subsequent tests.'
  },
  {
    id: 'ki',
    code: 'H',
    name: 'Potassium iodide',
    formula: 'KI',
    cation: 'K⁺',
    anion: 'I⁻',
    tests: {
      flame: { observation: 'Lilac flame (viewed through cobalt blue glass)', color: '#c084fc' },
      naoh: { observation: 'No precipitate (colourless solution)', color: '#e0f2fe' },
      hcl: { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' },
      bacl2: { observation: 'No precipitate with acidified BaCl₂(aq)', color: '#e0f2fe' },
      agno3: {
        observation: 'Pale yellow precipitate of AgI(s) forms',
        color: '#fde047',
        nh3Result: 'Insoluble in both dilute and concentrated NH₃(aq).'
      }
    },
    ionicEquations: [
      'Ag⁺(aq) + I⁻(aq) → AgI(s)'
    ],
    examinerNote: 'Lilac flame identifies K⁺; yellow AgI(s) precipitate insoluble in concentrated NH₃(aq) identifies I⁻.'
  }
];

const CATION_META = {
  'Mg²⁺': {
    stem: 'Mg', namePrefix: 'Magnesium', charge: 2,
    flame: { observation: 'No characteristic flame colour', color: '#93c5fd' },
    naoh: { observation: 'Thick white precipitate of Mg(OH)₂(s), insoluble in excess NaOH(aq)', color: '#f8fafc', eq: 'Mg²⁺(aq) + 2OH⁻(aq) → Mg(OH)₂(s)' },
    note: 'No flame colour + insoluble white Mg(OH)₂(s) precipitate confirms Mg²⁺ (Group 2 hydroxides become more soluble down the group).'
  },
  'Ca²⁺': {
    stem: 'Ca', namePrefix: 'Calcium', charge: 2,
    flame: { observation: 'Brick-red flame', color: '#ea580c' },
    naoh: { observation: 'Faint white precipitate of Ca(OH)₂(s) (sparingly soluble)', color: '#f1f5f9', eq: 'Ca²⁺(aq) + 2OH⁻(aq) → Ca(OH)₂(s)' },
    note: 'Brick-red flame + faint white Ca(OH)₂(s) precipitate confirms Ca²⁺.'
  },
  'Sr²⁺': {
    stem: 'Sr', namePrefix: 'Strontium', charge: 2,
    flame: { observation: 'Crimson-red flame', color: '#dc2626' },
    naoh: { observation: 'Very slight white precipitate (Sr(OH)₂ is sparingly soluble)', color: '#f1f5f9', eq: null },
    note: 'Crimson-red flame distinguishes Sr²⁺ cleanly from brick-red Ca²⁺.'
  },
  'Ba²⁺': {
    stem: 'Ba', namePrefix: 'Barium', charge: 2,
    flame: { observation: 'Apple-green flame', color: '#4ade80' },
    naoh: { observation: 'No precipitate (colourless solution); Ba(OH)₂ is soluble down Group 2', color: '#e0f2fe', eq: null },
    note: 'Apple-green flame + soluble hydroxide (no ppt) confirms Ba²⁺.'
  },
  'Na⁺': {
    stem: 'Na', namePrefix: 'Sodium', charge: 1,
    flame: { observation: 'Bright, persistent yellow-orange flame', color: '#facc15' },
    naoh: { observation: 'No precipitate and no gas evolved on warming (colourless solution)', color: '#e0f2fe', eq: null },
    note: 'Bright persistent yellow-orange flame identifies Na⁺.'
  },
  'K⁺': {
    stem: 'K', namePrefix: 'Potassium', charge: 1,
    flame: { observation: 'Lilac flame (viewed through cobalt blue glass)', color: '#c084fc' },
    naoh: { observation: 'No precipitate and no gas evolved on warming (colourless solution)', color: '#e0f2fe', eq: null },
    note: 'Lilac flame identifies K⁺.'
  },
  'NH₄⁺': {
    stem: 'NH₄', namePrefix: 'Ammonium', charge: 1, isPoly: true,
    flame: { observation: 'No characteristic metal flame colour (white fume sublimes on heating)', color: '#93c5fd' },
    naoh: { observation: 'No precipitate; on warming, pungent gas evolved turning damp red litmus blue (NH₃)', color: '#e0f2fe', eq: 'NH₄⁺(aq) + OH⁻(aq) → NH₃(g) + H₂O(l)' },
    note: 'Warming with NaOH(aq) evolves alkaline NH₃(g) which turns damp red litmus blue — confirming NH₄⁺.'
  }
};

const ANION_META = {
  'Cl⁻': { stem: 'Cl', nameSuffix: 'chloride', charge: 1, eq: 'Ag⁺(aq) + Cl⁻(aq) → AgCl(s)', note: 'White AgCl(s) precipitate dissolves in dilute NH₃(aq) to confirm Cl⁻.' },
  'Br⁻': { stem: 'Br', nameSuffix: 'bromide', charge: 1, eq: 'Ag⁺(aq) + Br⁻(aq) → AgBr(s)', note: 'Cream AgBr(s) precipitate is insoluble in dilute NH₃(aq) but dissolves in concentrated NH₃(aq) to confirm Br⁻.' },
  'I⁻': { stem: 'I', nameSuffix: 'iodide', charge: 1, eq: 'Ag⁺(aq) + I⁻(aq) → AgI(s)', note: 'Pale yellow AgI(s) precipitate is insoluble in both dilute and concentrated NH₃(aq) to confirm I⁻.' },
  'SO₄²⁻': { stem: 'SO₄', nameSuffix: 'sulfate', charge: 2, isPoly: true, eq: 'Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)', note: 'White BaSO₄(s) precipitate insoluble in dilute HCl confirms SO₄²⁻.' },
  'CO₃²⁻': { stem: 'CO₃', nameSuffix: 'carbonate', charge: 2, isPoly: true, eq: 'CO₃²⁻(aq) + 2H⁺(aq) → CO₂(g) + H₂O(l)', note: 'Effervescence with dilute acid producing CO₂(g) (turns limewater milky) confirms CO₃²⁻; always acidify before adding Ba²⁺ or Ag⁺.' }
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const SUBSCRIPT_DIGITS = { '2': '₂', '3': '₃', '4': '₄' };
const toSub = (n) => (n <= 1 ? '' : String(n).split('').map((d) => SUBSCRIPT_DIGITS[d] || d).join(''));

function formatSaltFormula(catMeta, aniMeta) {
  const div = gcd(catMeta.charge, aniMeta.charge);
  const cSub = aniMeta.charge / div;
  const aSub = catMeta.charge / div;
  const catPart = catMeta.isPoly && cSub > 1 ? `(${catMeta.stem})` : catMeta.stem;
  const aniPart = aniMeta.isPoly && aSub > 1 ? `(${aniMeta.stem})` : aniMeta.stem;
  return `${catPart}${toSub(cSub)}${aniPart}${toSub(aSub)}`;
}

// 33 soluble/acid-soluble WJEC test combinations (excluding insoluble SrSO₄ and BaSO₄)
export const PROCEDURAL_SALT_COMBINATIONS = CATION_OPTIONS.flatMap((cation) =>
  ANION_OPTIONS.filter(
    (anion) => !(anion === 'SO₄²⁻' && (cation === 'Ba²⁺' || cation === 'Sr²⁺'))
  ).map((anion) => ({ cation, anion, id: `proc_${cation}_${anion}` }))
);

export function generateRandomInorganicSalt(excludeId = null) {
  const candidates = excludeId && PROCEDURAL_SALT_COMBINATIONS.length > 1
    ? PROCEDURAL_SALT_COMBINATIONS.filter((c) => c.id !== excludeId)
    : PROCEDURAL_SALT_COMBINATIONS;
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const catMeta = CATION_META[picked.cation];
  const aniMeta = ANION_META[picked.anion];
  const formula = formatSaltFormula(catMeta, aniMeta);
  const sampleNum = Math.floor(101 + Math.random() * 899);

  const isGroup2Carbonate =
    picked.anion === 'CO₃²⁻' && ['Mg²⁺', 'Ca²⁺', 'Sr²⁺', 'Ba²⁺'].includes(picked.cation);

  const hclTest =
    picked.anion === 'CO₃²⁻'
      ? {
          observation: isGroup2Carbonate
            ? 'Vigorous effervescence as solid dissolves; colourless CO₂(g) turns limewater milky/cloudy'
            : 'Vigorous effervescence; colourless gas evolved turns limewater milky/cloudy (CO₂)',
          color: '#f1f5f9'
        }
      : { observation: 'No effervescence with dilute HCl(aq)', color: '#e0f2fe' };

  const bacl2Test =
    picked.anion === 'SO₄²⁻'
      ? {
          observation:
            picked.cation === 'Ca²⁺'
              ? 'Thick white precipitate of BaSO₄(s) forms, insoluble in dilute HCl (from acidified sample solution)'
              : 'Thick white precipitate of BaSO₄(s) forms, insoluble in dilute HCl',
          color: '#f8fafc'
        }
      : {
          observation:
            picked.cation === 'Ba²⁺'
              ? 'No precipitate (adding BaCl₂(aq) to a Ba²⁺ salt causes no change)'
              : picked.anion === 'CO₃²⁻'
              ? 'No precipitate after prior acidification with dilute HCl'
              : 'No precipitate with acidified BaCl₂(aq)',
          color: '#e0f2fe'
        };

  let agno3Test = {
    observation:
      picked.anion === 'CO₃²⁻'
        ? 'No precipitate after prior acidification with dilute HNO₃(aq)'
        : 'No precipitate with acidified AgNO₃(aq)',
    color: '#e0f2fe'
  };
  if (picked.anion === 'Cl⁻') {
    agno3Test = {
      observation: 'White precipitate of AgCl(s) forms immediately',
      color: '#f8fafc',
      nh3Result: 'Precipitate dissolves completely in dilute NH₃(aq) to give a colourless solution.'
    };
  } else if (picked.anion === 'Br⁻') {
    agno3Test = {
      observation: 'Cream precipitate of AgBr(s) forms',
      color: '#fef3c7',
      nh3Result: 'Insoluble in dilute NH₃(aq), but dissolves in concentrated NH₃(aq).'
    };
  } else if (picked.anion === 'I⁻') {
    agno3Test = {
      observation: 'Pale yellow precipitate of AgI(s) forms',
      color: '#fde047',
      nh3Result: 'Insoluble in both dilute and concentrated NH₃(aq).'
    };
  }

  const equations = [];
  if (catMeta.naoh.eq) equations.push(catMeta.naoh.eq);
  equations.push(aniMeta.eq);

  return {
    id: picked.id,
    code: `#${sampleNum}`,
    name: `${catMeta.namePrefix} ${aniMeta.nameSuffix}`,
    formula,
    cation: picked.cation,
    anion: picked.anion,
    tests: {
      flame: catMeta.flame,
      naoh: { observation: catMeta.naoh.observation, color: catMeta.naoh.color },
      hcl: hclTest,
      bacl2: bacl2Test,
      agno3: agno3Test
    },
    ionicEquations: equations,
    examinerNote: `${catMeta.note} ${aniMeta.note}`
  };
}
