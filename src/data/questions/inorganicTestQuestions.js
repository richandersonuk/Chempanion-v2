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
