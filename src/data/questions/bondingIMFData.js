// Curated data and physics/classification helpers for Unit 1.4 / 1.5
// Bonding Continuum, Potential Energy Wells, Intermolecular Forces, and Solid Structures

export const BONDING_ELEMENTS = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    paulingChi: 2.20,
    covalentRadiusPm: 37,
    ionicRadiusPm: 140, // H⁻ (bare proton H⁺ has ~0 pm ionic radius)
    category: 'nonmetal',
    valenceElectrons: 1,
    commonCharge: 1,
  },
  Li: {
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    paulingChi: 0.98,
    covalentRadiusPm: 128,
    ionicRadiusPm: 76,
    category: 'metal',
    valenceElectrons: 1,
    commonCharge: 1,
  },
  Be: {
    symbol: 'Be',
    name: 'Beryllium',
    atomicNumber: 4,
    paulingChi: 1.57,
    covalentRadiusPm: 96,
    ionicRadiusPm: 45,
    category: 'metal',
    valenceElectrons: 2,
    commonCharge: 2,
  },
  B: {
    symbol: 'B',
    name: 'Boron',
    atomicNumber: 5,
    paulingChi: 2.04,
    covalentRadiusPm: 84,
    ionicRadiusPm: 27,
    category: 'nonmetal',
    valenceElectrons: 3,
    commonCharge: 3,
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    paulingChi: 2.55,
    covalentRadiusPm: 76,
    ionicRadiusPm: 16,
    category: 'nonmetal',
    valenceElectrons: 4,
    commonCharge: 4,
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    paulingChi: 3.04,
    covalentRadiusPm: 71,
    ionicRadiusPm: 146,
    category: 'nonmetal',
    valenceElectrons: 5,
    commonCharge: -3,
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    paulingChi: 3.44,
    covalentRadiusPm: 66,
    ionicRadiusPm: 140,
    category: 'nonmetal',
    valenceElectrons: 6,
    commonCharge: -2,
  },
  F: {
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    paulingChi: 3.98,
    covalentRadiusPm: 57,
    ionicRadiusPm: 133,
    category: 'nonmetal',
    valenceElectrons: 7,
    commonCharge: -1,
  },
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    paulingChi: 0.93,
    covalentRadiusPm: 166,
    ionicRadiusPm: 102,
    category: 'metal',
    valenceElectrons: 1,
    commonCharge: 1,
  },
  Mg: {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    paulingChi: 1.31,
    covalentRadiusPm: 141,
    ionicRadiusPm: 72,
    category: 'metal',
    valenceElectrons: 2,
    commonCharge: 2,
  },
  Al: {
    symbol: 'Al',
    name: 'Aluminium',
    atomicNumber: 13,
    paulingChi: 1.61,
    covalentRadiusPm: 121,
    ionicRadiusPm: 54,
    category: 'metal',
    valenceElectrons: 3,
    commonCharge: 3,
  },
  Si: {
    symbol: 'Si',
    name: 'Silicon',
    atomicNumber: 14,
    paulingChi: 1.90,
    covalentRadiusPm: 111,
    ionicRadiusPm: 40,
    category: 'nonmetal',
    valenceElectrons: 4,
    commonCharge: 4,
  },
  P: {
    symbol: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    paulingChi: 2.19,
    covalentRadiusPm: 107,
    ionicRadiusPm: 212,
    category: 'nonmetal',
    valenceElectrons: 5,
    commonCharge: -3,
  },
  S: {
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    paulingChi: 2.58,
    covalentRadiusPm: 105,
    ionicRadiusPm: 184,
    category: 'nonmetal',
    valenceElectrons: 6,
    commonCharge: -2,
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    paulingChi: 3.16,
    covalentRadiusPm: 99,
    ionicRadiusPm: 181,
    category: 'nonmetal',
    valenceElectrons: 7,
    commonCharge: -1,
  },
  K: {
    symbol: 'K',
    name: 'Potassium',
    atomicNumber: 19,
    paulingChi: 0.82,
    covalentRadiusPm: 203,
    ionicRadiusPm: 138,
    category: 'metal',
    valenceElectrons: 1,
    commonCharge: 1,
  },
  Ca: {
    symbol: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    paulingChi: 1.00,
    covalentRadiusPm: 176,
    ionicRadiusPm: 100,
    category: 'metal',
    valenceElectrons: 2,
    commonCharge: 2,
  },
  Br: {
    symbol: 'Br',
    name: 'Bromine',
    atomicNumber: 35,
    paulingChi: 2.96,
    covalentRadiusPm: 114,
    ionicRadiusPm: 196,
    category: 'nonmetal',
    valenceElectrons: 7,
    commonCharge: -1,
  },
  I: {
    symbol: 'I',
    name: 'Iodine',
    atomicNumber: 53,
    paulingChi: 2.66,
    covalentRadiusPm: 133,
    ionicRadiusPm: 220,
    category: 'nonmetal',
    valenceElectrons: 7,
    commonCharge: -1,
  },
  Ar: {
    symbol: 'Ar',
    name: 'Argon',
    atomicNumber: 18,
    paulingChi: null,
    covalentRadiusPm: 106,
    ionicRadiusPm: 188,
    category: 'noble_gas',
    valenceElectrons: 8,
    commonCharge: 0,
  },
};

export const BONDING_ELEMENT_LIST = Object.values(BONDING_ELEMENTS);

export const CONTINUUM_PRESETS = [
  {
    id: 'h2',
    name: 'Hydrogen (H₂)',
    formula: 'H–H',
    elemA: 'H',
    elemB: 'H',
    mode: 'covalent',
    equilibriumPm: 74,
    bondEnthalpyKj: 436,
    unitRef: 'Unit 1.4(b)',
    summary: 'Pure non-polar covalent bond (Δχ = 0.00). Electron density is shared equally between two identical H nuclei.',
  },
  {
    id: 'cl2',
    name: 'Chlorine (Cl₂)',
    formula: 'Cl–Cl',
    elemA: 'Cl',
    elemB: 'Cl',
    mode: 'covalent',
    equilibriumPm: 199,
    bondEnthalpyKj: 242,
    unitRef: 'Unit 1.4(b)',
    summary: 'Non-polar covalent bond with larger atomic radii than H₂, producing a longer equilibrium distance (199 pm) and weaker bond.',
  },
  {
    id: 'ch',
    name: 'C–H Bond (Alkanes)',
    formula: 'C–H',
    elemA: 'C',
    elemB: 'H',
    mode: 'covalent',
    equilibriumPm: 109,
    bondEnthalpyKj: 413,
    unitRef: 'Unit 1.4(d)',
    summary: 'Small electronegativity difference (Δχ = 0.35 < 0.5) means the C–H bond is effectively non-polar in WJEC AS chemistry.',
  },
  {
    id: 'hcl',
    name: 'Hydrogen Chloride (HCl)',
    formula: 'H–Cl',
    elemA: 'H',
    elemB: 'Cl',
    mode: 'polar',
    equilibriumPm: 127,
    bondEnthalpyKj: 431,
    unitRef: 'Unit 1.4(d)',
    summary: 'Cl (χ = 3.16) attracts the shared electron pair more strongly than H (χ = 2.20), giving H(δ⁺)–Cl(δ⁻).',
  },
  {
    id: 'hf',
    name: 'Hydrogen Fluoride (HF)',
    formula: 'H–F',
    elemA: 'H',
    elemB: 'F',
    mode: 'polar',
    equilibriumPm: 92,
    bondEnthalpyKj: 565,
    unitRef: 'Unit 1.4(d)',
    summary: 'Large polarity (Δχ = 1.78 between two non-metals) creates a strongly polar covalent bond without forming free ions.',
  },
  {
    id: 'alcl3',
    name: 'Aluminium Chloride (Al–Cl)',
    formula: 'AlCl₃ (vapour/solid)',
    elemA: 'Al',
    elemB: 'Cl',
    mode: 'intermediate',
    equilibriumPm: 206,
    bondEnthalpyKj: 420,
    unitRef: 'Unit 1.4(c)',
    summary: 'Classic WJEC intermediate character example: small, highly charged Al³⁺ strongly polarises the large Cl⁻ electron cloud, giving marked covalent character.',
  },
  {
    id: 'nacl',
    name: 'Sodium Chloride (NaCl)',
    formula: 'Na⁺ Cl⁻',
    elemA: 'Na',
    elemB: 'Cl',
    mode: 'ionic',
    equilibriumPm: 282,
    bondEnthalpyKj: 786,
    unitRef: 'Unit 1.4(a) / 1.5(a)',
    summary: 'Large Δχ (2.23) between a Group 1 metal and a halogen produces Na⁺ and Cl⁻ ions held by strong electrostatic attraction in a 6:6 lattice.',
  },
  {
    id: 'mgo',
    name: 'Magnesium Oxide (MgO)',
    formula: 'Mg²⁺ O²⁻',
    elemA: 'Mg',
    elemB: 'O',
    mode: 'ionic',
    equilibriumPm: 212,
    bondEnthalpyKj: 3791,
    unitRef: 'Unit 1.4(a) / 1.5(e)',
    summary: 'Doubly charged Mg²⁺ and O²⁻ ions with shorter interionic separation produce ~4× stronger electrostatic attraction and a 2852 °C melting point.',
  },
  {
    id: 'na_metal',
    name: 'Sodium Metal (Na)',
    formula: 'Na⁺ + e⁻ sea',
    elemA: 'Na',
    elemB: 'Na',
    mode: 'metallic',
    equilibriumPm: 370,
    bondEnthalpyKj: 108,
    unitRef: 'Unit 1.5(d)',
    summary: 'Lattice of Na⁺ cations in a sea of 1 delocalised electron per atom. Moderately low melting point (98 °C) due to +1 charge density.',
  },
  {
    id: 'mg_metal',
    name: 'Magnesium Metal (Mg)',
    formula: 'Mg²⁺ + 2e⁻ sea',
    elemA: 'Mg',
    elemB: 'Mg',
    mode: 'metallic',
    equilibriumPm: 320,
    bondEnthalpyKj: 147,
    unitRef: 'Unit 1.5(d)–(e)',
    summary: 'Smaller Mg²⁺ cations contribute 2 delocalised electrons per atom, doubling charge density and raising the melting point to 650 °C.',
  },
];

/**
 * Pauling percentage ionic character approximation:
 * % ionic = (1 - exp(-0.25 * (Δχ)^2)) * 100
 */
export function calcIonicCharacter(deltaChi) {
  if (!Number.isFinite(deltaChi) || deltaChi <= 0) return 0;
  return (1 - Math.exp(-0.25 * deltaChi * deltaChi)) * 100;
}

/**
 * Classifies a bond along the WJEC Unit 1.4 / 1.5 bonding continuum.
 * Handles noble gases, metallic lattices, metal+nonmetal intermediate polarisation (1.4(c)),
 * ionic, polar covalent, and non-polar covalent bonds cleanly.
 */
export function classifyBond(elA, elB, overrideMode = null) {
  if (!elA || !elB) {
    return {
      type: 'covalent',
      label: 'Non-Polar Covalent',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
      deltaChi: 0,
      percentIonic: 0,
    };
  }

  if (elA.category === 'noble_gas' || elB.category === 'noble_gas') {
    return {
      type: 'london',
      label: 'No Covalent/Ionic Bond (London Dispersion)',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      deltaChi: 0,
      percentIonic: 0,
    };
  }

  const chiA = elA.paulingChi ?? 0;
  const chiB = elB.paulingChi ?? 0;
  const deltaChi = Math.abs(chiB - chiA);
  const percentIonic = Number(calcIonicCharacter(deltaChi).toFixed(1));

  const isMetalA = elA.category === 'metal';
  const isMetalB = elB.category === 'metal';

  let type = overrideMode;

  if (!type) {
    if (isMetalA && isMetalB) {
      type = 'metallic';
    } else if (isMetalA !== isMetalB) {
      if (deltaChi >= 1.7) {
        type = 'ionic';
      } else if (deltaChi >= 1.0) {
        type = 'intermediate';
      } else {
        type = 'polar';
      }
    } else if (deltaChi >= 0.5) {
      type = 'polar';
    } else {
      type = 'covalent';
    }
  }

  const meta = {
    covalent: {
      label: 'Non-Polar Covalent',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    polar: {
      label: 'Polar Covalent',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    intermediate: {
      label: 'Intermediate (Ionic with Covalent Character)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    ionic: {
      label: 'Giant Ionic Bonding',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    metallic: {
      label: 'Metallic Bonding (Electron Sea)',
      badgeClass: 'bg-violet-50 text-violet-800 border-violet-200',
    },
  };

  const chosen = meta[type] || meta.covalent;
  return {
    type,
    label: chosen.label,
    badgeClass: chosen.badgeClass,
    deltaChi: Number(deltaChi.toFixed(2)),
    percentIonic,
  };
}

/**
 * Evaluates a shifted Morse potential well V(r) in kJ mol⁻¹:
 * V(r) = De * ((1 - exp(-0.022 * (r - r0)))^2 - 1)
 * At r = r0, V(r0) = -De; as r -> infinity, V(r) -> 0.
 * Clamped smoothly for clean SVG curve rendering.
 */
export function evaluateMorse(r, r0, De) {
  const safeR0 = Math.max(40, r0 || 120);
  const safeDe = Math.max(10, De || 200);
  const expTerm = Math.exp(-0.022 * (r - safeR0));
  const rawEnergy = safeDe * (Math.pow(1 - expTerm, 2) - 1);
  const upperClamp = safeDe * 0.45;
  const lowerClamp = -safeDe * 1.05;
  return Number(Math.max(lowerClamp, Math.min(upperClamp, rawEnergy)).toFixed(1));
}

export const IMF_DATASETS = [
  {
    id: 'halogens',
    title: 'Group 7 Halogens (F₂ → I₂)',
    unitRef: 'Unit 1.4(f) / 1.6',
    subtitle: 'All Group 7 diatomic molecules are non-polar, so only London dispersion forces operate between molecules.',
    defaultTempC: 25,
    tempRange: [-230, 220],
    quickTemps: [
      { label: '−200 °C', tempC: -200 },
      { label: '25 °C (RTP)', tempC: 25 },
      { label: '150 °C', tempC: 150 },
    ],
    items: [
      {
        formula: 'F₂',
        name: 'Fluorine',
        electrons: 18,
        mpC: -220,
        bpC: -188,
        forces: ['London Forces'],
        highlight: false,
        note: 'Smallest electron cloud (18 e⁻) → weakest instantaneous/induced dipoles → pale yellow gas at room temperature.',
      },
      {
        formula: 'Cl₂',
        name: 'Chlorine',
        electrons: 34,
        mpC: -101,
        bpC: -34,
        forces: ['London Forces'],
        highlight: false,
        note: '34 e⁻ per molecule gives stronger London forces than F₂, though still a green gas at 25 °C.',
      },
      {
        formula: 'Br₂',
        name: 'Bromine',
        electrons: 70,
        mpC: -7,
        bpC: 59,
        forces: ['London Forces'],
        highlight: false,
        note: '70 e⁻ creates a much more polarisable electron cloud → enough attraction to be a volatile red-brown liquid at 25 °C.',
      },
      {
        formula: 'I₂',
        name: 'Iodine',
        electrons: 106,
        mpC: 114,
        bpC: 184,
        forces: ['London Forces'],
        highlight: true,
        note: '106 e⁻ gives the largest, most polarisable electron cloud → strongest London forces → grey-black molecular solid at 25 °C.',
      },
    ],
    wjecTakeaway:
      'Descending Group 7 increases total electron count per molecule (18 → 34 → 70 → 106), increasing polarisability and London dispersion strength so more thermal energy is needed to overcome intermolecular forces.',
  },
  {
    id: 'group6_hydrides',
    title: 'Group 6 Hydrides (H₂O → H₂Te)',
    unitRef: 'Unit 1.4(f)–(g)',
    subtitle: 'Compares anomalous hydrogen bonding in H₂O against the Group 6 hydride boiling-point trend.',
    defaultTempC: 25,
    tempRange: [-100, 130],
    quickTemps: [
      { label: '−70 °C', tempC: -70 },
      { label: '−10 °C', tempC: -10 },
      { label: '25 °C (RTP)', tempC: 25 },
      { label: '110 °C', tempC: 110 },
    ],
    items: [
      {
        formula: 'H₂O',
        name: 'Water',
        electrons: 10,
        mpC: 0,
        bpC: 100,
        forces: ['Hydrogen Bonding', 'Permanent Dipole–Dipole', 'London Forces'],
        highlight: true,
        note: 'Despite having only 10 e⁻, H₂O forms an extensive 3D network of hydrogen bonds (up to 4 per molecule), giving an anomalously high boiling point of 100 °C.',
      },
      {
        formula: 'H₂S',
        name: 'Hydrogen sulfide',
        electrons: 18,
        mpC: -85,
        bpC: -60,
        forces: ['Permanent Dipole–Dipole', 'London Forces'],
        highlight: false,
        note: 'S is not electronegative enough for hydrogen bonding; H₂S has only weak permanent dipole–dipole and London forces, so it boils at −60 °C.',
      },
      {
        formula: 'H₂Se',
        name: 'Hydrogen selenide',
        electrons: 36,
        mpC: -66,
        bpC: -41,
        forces: ['Permanent Dipole–Dipole', 'London Forces'],
        highlight: false,
        note: 'Even though H–Se is less polar than H–S, doubling the electron count to 36 e⁻ increases London forces, raising the boiling point to −41 °C.',
      },
      {
        formula: 'H₂Te',
        name: 'Hydrogen telluride',
        electrons: 54,
        mpC: -49,
        bpC: -2,
        forces: ['Permanent Dipole–Dipole', 'London Forces'],
        highlight: false,
        note: '54 e⁻ gives much stronger London dispersion forces between molecules, raising the boiling point further to −2 °C despite tiny bond polarity.',
      },
    ],
    wjecTakeaway:
      'H₂O boils much higher than expected (100 °C vs ~−80 °C) because of hydrogen bonding. From H₂S → H₂Se → H₂Te, boiling point rises because total electron count increases, strengthening London forces (permanent dipoles alone cannot explain the rise).',
  },
  {
    id: 'hydrogen_halides',
    title: 'Hydrogen Halides & Water (HF, HCl–HI, H₂O)',
    unitRef: 'Unit 1.4(f)–(g)',
    subtitle: 'Shows why H₂O outboils HF despite F being more electronegative than O, and why HCl → HI increases despite falling bond polarity.',
    defaultTempC: 25,
    tempRange: [-130, 120],
    quickTemps: [
      { label: '−80 °C', tempC: -80 },
      { label: '0 °C', tempC: 0 },
      { label: '25 °C (RTP)', tempC: 25 },
      { label: '105 °C', tempC: 105 },
    ],
    items: [
      {
        formula: 'HF',
        name: 'Hydrogen fluoride',
        electrons: 10,
        mpC: -84,
        bpC: 20,
        forces: ['Hydrogen Bonding', 'Permanent Dipole–Dipole', 'London Forces'],
        highlight: true,
        note: 'Individual H–F···H–F hydrogen bonds are stronger than O–H···O, but each HF molecule forms fewer H-bonds on average (often 1D chains), so its bp is only 20 °C.',
      },
      {
        formula: 'HCl',
        name: 'Hydrogen chloride',
        electrons: 18,
        mpC: -114,
        bpC: -85,
        forces: ['Permanent Dipole–Dipole', 'London Forces'],
        highlight: false,
        note: 'No hydrogen bonding (Cl is too large with lower charge density on lone pairs). Has both permanent dipole–dipole and London forces (18 e⁻).',
      },
      {
        formula: 'HBr',
        name: 'Hydrogen bromide',
        electrons: 36,
        mpC: -87,
        bpC: -67,
        forces: ['Permanent Dipole–Dipole', 'London Forces'],
        highlight: false,
        note: 'Less polar than HCl, yet higher bp (−67 °C) because 36 e⁻ produce significantly stronger London dispersion forces.',
      },
      {
        formula: 'HI',
        name: 'Hydrogen iodide',
        electrons: 54,
        mpC: -51,
        bpC: -35,
        forces: ['Permanent Dipole–Dipole', 'London Forces'],
        highlight: false,
        note: 'Least polar of HCl–HI, yet highest bp (−35 °C) because 54 e⁻ maximise London dispersion attraction.',
      },
      {
        formula: 'H₂O',
        name: 'Water (Reference)',
        electrons: 10,
        mpC: 0,
        bpC: 100,
        forces: ['Hydrogen Bonding', 'Permanent Dipole–Dipole', 'London Forces'],
        highlight: true,
        note: '2 lone pairs and 2 δ⁺ H atoms per molecule enable up to 4 hydrogen bonds per H₂O in a 3D network → bp 100 °C (80 °C higher than HF!).',
      },
    ],
    wjecTakeaway:
      'Two exam favourites: (1) H₂O outboils HF because each H₂O averages twice as many hydrogen bonds (up to 4 vs 2 in HF); (2) HCl → HBr → HI rises in bp because increasing electron count strengthens London forces faster than permanent dipole–dipole forces weaken.',
  },
  {
    id: 'giant_lattices',
    title: 'Giant Lattices & Metals (Na, Mg, NaCl, MgO)',
    unitRef: 'Unit 1.4(a) & 1.5(d)–(e)',
    subtitle: 'Compares charge density effects across giant metallic and giant ionic lattices.',
    defaultTempC: 25,
    tempRange: [0, 3800],
    quickTemps: [
      { label: '25 °C (RTP)', tempC: 25 },
      { label: '500 °C', tempC: 500 },
      { label: '900 °C', tempC: 900 },
      { label: '3000 °C', tempC: 3000 },
    ],
    items: [
      {
        formula: 'Na',
        name: 'Sodium (Metallic)',
        electrons: 11,
        mpC: 98,
        bpC: 883,
        forces: ['Metallic Lattice (+1 / 1 e⁻)'],
        highlight: false,
        note: 'Giant lattice of Na⁺ cations in a sea of 1 delocalised electron per atom → weakest metallic attraction of Period 3 (mp 98 °C).',
      },
      {
        formula: 'Mg',
        name: 'Magnesium (Metallic)',
        electrons: 12,
        mpC: 650,
        bpC: 1091,
        forces: ['Metallic Lattice (+2 / 2 e⁻)'],
        highlight: false,
        note: 'Smaller Mg²⁺ ions with +2 charge and twice as many delocalised electrons (2 per atom) attract the electron sea much more strongly (mp 650 °C).',
      },
      {
        formula: 'NaCl',
        name: 'Sodium chloride (Ionic)',
        electrons: 28,
        mpC: 801,
        bpC: 1465,
        forces: ['Giant Ionic Lattice (±1 ions)'],
        highlight: false,
        note: '6:6 giant ionic lattice of Na⁺ and Cl⁻ ions. Requires 801 °C to overcome strong non-directional electrostatic attractions.',
      },
      {
        formula: 'MgO',
        name: 'Magnesium oxide (Ionic)',
        electrons: 20,
        mpC: 2852,
        bpC: 3600,
        forces: ['Giant Ionic Lattice (±2 ions)'],
        highlight: true,
        note: 'Mg²⁺ and O²⁻ carry double the charge and have smaller ionic radii than Na⁺/Cl⁻, creating ~4× stronger lattice attraction (mp 2852 °C).',
      },
    ],
    wjecTakeaway:
      'High melting points in metals and ionic solids require overcoming strong electrostatic attractions throughout a giant lattice — not weak intermolecular forces. Attraction increases strongly with ionic/cation charge and smaller ionic radius.',
  },
];

export const BONDING_CHALLENGES = [
  {
    id: 'continuum-alcl3',
    unitRef: 'Unit 1.4(c)',
    title: '1. Intermediate Character: Why AlCl₃ Isn’t Purely Ionic',
    prompt:
      'Aluminium chloride (AlCl₃) consists of a metal and a non-metal (Δχ = 1.55), yet it sublimes at just 180 °C and exists as Al₂Cl₆ dimers in the vapour phase. Classify the Al–Cl bonding and select TWO WJEC reasons explaining its covalent character.',
    dataPills: [
      { label: 'χ(Al)', value: '1.61' },
      { label: 'χ(Cl)', value: '3.16' },
      { label: 'Δχ', value: '1.55' },
      { label: 'Sublimation', value: '180 °C' },
    ],
    hint: 'Compare Δχ against the ~1.7 ionic threshold and think about Fajans’ polarisation idea: how does a tiny, +3 cation affect a large Cl⁻ electron cloud?',
    part1: {
      question: 'Best description of the Al–Cl bonding on the bonding continuum:',
      options: [
        { id: 'pure_ionic', label: 'Pure giant ionic lattice' },
        { id: 'intermediate', label: 'Intermediate bonding (ionic with substantial covalent character)' },
        { id: 'metallic', label: 'Metallic bonding with delocalised electrons' },
      ],
      correctId: 'intermediate',
    },
    part2: {
      question: 'Select TWO accurate WJEC explanations for this covalent character:',
      requiredCount: 2,
      options: [
        {
          id: 'al3_charge_density',
          label: 'Al³⁺ has a very high charge density (small ionic radius and +3 charge), so it strongly attracts and polarises the Cl⁻ electron cloud.',
        },
        {
          id: 'intermediate_dchi',
          label: 'Δχ = 1.55 lies below the strongly ionic threshold (~1.7), placing Al–Cl in the intermediate region of the bonding continuum.',
        },
        {
          id: 'london_only',
          label: 'AlCl₃ forms a giant covalent network like diamond with strong C–Cl bonds.',
          trapFeedback: 'AlCl₃ vapour forms discrete Al₂Cl₆ covalent molecules, not a giant covalent network.',
        },
        {
          id: 'proton_transfer',
          label: 'Cl⁻ ions are small and unpolarisable, so they transfer protons back to aluminium.',
          trapFeedback: 'Cl⁻ is a relatively large, polarisable anion — and proton transfer is unrelated to ionic/covalent polarisation.',
        },
      ],
      correctIds: ['al3_charge_density', 'intermediate_dchi'],
    },
    markScheme: [
      'Al³⁺ has a small radius and high +3 charge (high charge density / polarising power).',
      'It distorts (polarises) the electron cloud of the larger Cl⁻ ion towards itself, giving intermediate / significant covalent character.',
    ],
    examinerPitfall:
      'Avoid saying “metal + non-metal is always purely ionic”. WJEC Unit 1.4(c) specifically tests intermediate bonding where a high-charge-density cation polarises an anion (e.g. AlCl₃, BeCl₂).',
  },
  {
    id: 'bond-polarity-direction',
    unitRef: 'Unit 1.4(d) / (f)',
    title: '2. Bond Polarity vs Whole-Molecule Symmetry',
    prompt:
      'Both C–F and N–H are strongly polar covalent bonds, yet CF₄ has zero overall dipole moment whereas NH₃ and CHCl₃ are polar molecules. Identify why CF₄ is non-polar overall and select TWO correct principles.',
    dataPills: [
      { label: 'χ(C)', value: '2.55' },
      { label: 'χ(F)', value: '3.98' },
      { label: 'χ(Cl)', value: '3.16' },
      { label: 'Δχ(C–F)', value: '1.43' },
    ],
    hint: 'A molecule can contain polar bonds and still be non-polar if its 3D geometry causes the bond dipoles to cancel out completely.',
    part1: {
      question: 'Which statement correctly describes CF₄?',
      options: [
        { id: 'polar_bonds_nonpolar_mol', label: 'It contains polar C–F bonds, but the molecule is non-polar overall.' },
        { id: 'nonpolar_bonds', label: 'C–F bonds are non-polar because Δχ is less than 1.7.' },
        { id: 'polar_mol', label: 'CF₄ is strongly polar because fluorine has χ = 3.98.' },
      ],
      correctId: 'polar_bonds_nonpolar_mol',
    },
    part2: {
      question: 'Select TWO correct explanations linking electronegativity and symmetry:',
      requiredCount: 2,
      options: [
        {
          id: 'symmetrical_cancel',
          label: 'CF₄ is symmetrical (tetrahedral), so the four equal C(δ⁺)–F(δ⁻) bond dipoles cancel each other out.',
        },
        {
          id: 'asymmetric_chcl3',
          label: 'In CHCl₃ (or pyramidal NH₃), the bond dipoles do not cancel because the molecule is unsymmetrical, leaving a net molecular dipole.',
        },
        {
          id: 'delta_minus_on_c',
          label: 'Carbon carries the δ⁻ charge in C–F because carbon is in Group 4.',
          trapFeedback: 'Fluorine (χ = 3.98) is much more electronegative than carbon (χ = 2.55), so fluorine is δ⁻ and carbon is δ⁺.',
        },
        {
          id: 'hbonds_in_cf4',
          label: 'CF₄ forms intermolecular hydrogen bonds that cancel out polarity.',
          trapFeedback: 'CF₄ has no H bonded to N, O, or F, so it cannot form hydrogen bonds.',
        },
      ],
      correctIds: ['symmetrical_cancel', 'asymmetric_chcl3'],
    },
    markScheme: [
      'F is more electronegative than C, so each C–F bond is polar (C δ⁺, F δ⁻).',
      'CF₄ is symmetrical (tetrahedral), so individual bond dipoles cancel out; unsymmetrical molecules such as CHCl₃ or NH₃ retain a net dipole.',
    ],
    examinerPitfall:
      'Candidates frequently write “CF₄ has no polar bonds”. Always state BOTH ideas clearly: individual bonds ARE polar (Δχ ≠ 0), AND symmetry causes dipoles to cancel.',
  },
  {
    id: 'halogens-state',
    unitRef: 'Unit 1.4(f) / 1.6',
    title: '3. Group 7 Halogens: Explaining the Physical State Trend',
    prompt:
      'At 25 °C, chlorine (Cl₂) is a gas, bromine (Br₂) is a liquid, and iodine (I₂) is a solid. Choose the type of intermolecular force responsible and the TWO mark-scheme points that explain the trend.',
    dataPills: [
      { label: 'Cl₂ (34 e⁻)', value: 'bp −34 °C' },
      { label: 'Br₂ (70 e⁻)', value: 'bp 59 °C' },
      { label: 'I₂ (106 e⁻)', value: 'bp 184 °C' },
    ],
    hint: 'Are X₂ molecules polar or non-polar? Look closely at total electrons per molecule in the IMF Explorer (Halogens dataset).',
    part1: {
      question: 'Which intermolecular force explains the increasing boiling points from Cl₂ to I₂?',
      options: [
        { id: 'covalent_strength', label: 'Increasing covalent X–X bond strength down the group' },
        { id: 'london', label: 'Increasing London dispersion (instantaneous dipole–induced dipole) forces' },
        { id: 'perm_dipole', label: 'Increasing permanent dipole–permanent dipole attractions' },
      ],
      correctId: 'london',
    },
    part2: {
      question: 'Select TWO essential WJEC mark-scheme statements:',
      requiredCount: 2,
      options: [
        {
          id: 'more_electrons_polarisable',
          label: 'Number of electrons per molecule increases (Cl₂ 34 → Br₂ 70 → I₂ 106), making the electron cloud larger and more easily polarised.',
        },
        {
          id: 'more_energy_to_overcome',
          label: 'Stronger London forces between molecules require more heat energy to overcome when melting or boiling.',
        },
        {
          id: 'stronger_x_x_bond',
          label: 'The covalent Cl–Cl bond is weaker than I–I, so more energy is needed to break I–I covalent bonds on boiling.',
          trapFeedback: 'Boiling simple molecular iodine breaks intermolecular forces between I₂ molecules — NOT the covalent I–I bonds! (In fact I–I is weaker than Cl–Cl.)',
        },
        {
          id: 'perm_dipoles_x2',
          label: 'Halogen molecules have permanent δ⁺/δ⁻ dipoles that grow down Group 7.',
          trapFeedback: 'All homonuclear X₂ molecules have Δχ = 0, so they have NO permanent dipole.',
        },
      ],
      correctIds: ['more_electrons_polarisable', 'more_energy_to_overcome'],
    },
    markScheme: [
      'From Cl₂ to I₂, molecules have more electrons / larger electron clouds that distort (polarise) more easily.',
      'This produces stronger London forces between molecules, requiring more energy to overcome.',
    ],
    examinerPitfall:
      'Never say covalent bonds break when I₂ melts or boils, and never call “van der Waals” alone if the WJEC mark scheme asks specifically about instantaneous dipole–induced dipole (London) forces.',
  },
  {
    id: 'group6-hydrides',
    unitRef: 'Unit 1.4(f)–(g)',
    title: '4. Group 6 Hydrides: Water’s Boiling Point Anomaly',
    prompt:
      'Hydrogen sulfide (H₂S) boils at −60 °C whereas water (H₂O) boils at +100 °C, even though H₂S has more electrons. Identify why H₂O is anomalous AND why boiling point rises again from H₂S to H₂Te.',
    dataPills: [
      { label: 'H₂O (10 e⁻)', value: '100 °C' },
      { label: 'H₂S (18 e⁻)', value: '−60 °C' },
      { label: 'H₂Se (36 e⁻)', value: '−41 °C' },
      { label: 'H₂Te (54 e⁻)', value: '−2 °C' },
    ],
    hint: 'Check the Group 6 Hydrides dataset: H₂S, H₂Se, and H₂Te are all missing hydrogen bonding, yet their boiling points rise as electron count jumps 18 → 36 → 54.',
    part1: {
      question: 'Why does H₂O boil 160 °C higher than H₂S?',
      options: [
        { id: 'hbonds_water', label: 'H₂O forms intermolecular hydrogen bonds, which are much stronger than the IMFs in H₂S.' },
        { id: 'oh_covalent', label: 'The O–H covalent bond is stronger than the S–H covalent bond.' },
        { id: 'h2o_dipole_only', label: 'H₂O has only permanent dipole–dipole forces while H₂S is non-polar.' },
      ],
      correctId: 'hbonds_water',
    },
    part2: {
      question: 'Select TWO accurate statements covering H₂O AND the H₂S → H₂Te trend:',
      requiredCount: 2,
      options: [
        {
          id: 'n_o_f_criterion',
          label: 'Only H bonded directly to small, highly electronegative N, O, or F (with an adjacent lone pair) forms hydrogen bonds; S is not electronegative enough.',
        },
        {
          id: 'london_h2s_h2te',
          label: 'From H₂S → H₂Se → H₂Te, boiling point increases because the number of electrons increases, producing stronger London dispersion forces.',
        },
        {
          id: 'dipole_increase_h2te',
          label: 'From H₂S to H₂Te, permanent dipole–dipole attractions increase because tellurium is more electronegative than sulfur.',
          trapFeedback: 'Electronegativity actually DECREASES down Group 6 (S > Se > Te), so permanent dipole strength falls while London forces dominate.',
        },
        {
          id: 'oh_breaks',
          label: 'Boiling water breaks strong O–H covalent bonds inside H₂O molecules.',
          trapFeedback: 'Boiling water overcomes intermolecular hydrogen bonds BETWEEN molecules, leaving covalent O–H bonds intact.',
        },
      ],
      correctIds: ['n_o_f_criterion', 'london_h2s_h2te'],
    },
    markScheme: [
      'H₂O has hydrogen bonding between molecules (absent in H₂S), requiring much more energy to separate.',
      'From H₂S to H₂Te, total electron count rises so London dispersion forces strengthen.',
    ],
    examinerPitfall:
      'Watch out for “H₂S has permanent dipoles only” — H₂S has BOTH permanent dipole–dipole AND London forces, and it is increasing London forces that drive the rise from H₂S to H₂Te.',
  },
  {
    id: 'hf-vs-h2o',
    unitRef: 'Unit 1.4(g)',
    title: '5. Classic Discrimination: Why H₂O Boils Higher than HF',
    prompt:
      'Fluorine (χ = 3.98) is more electronegative than oxygen (χ = 3.44), so an individual H–F···H–F hydrogen bond (~39 kJ mol⁻¹) is stronger than an individual H–O···H hydrogen bond (~25 kJ mol⁻¹). Yet H₂O boils at 100 °C while HF boils at only 20 °C.',
    dataPills: [
      { label: 'χ(F) = 3.98', value: 'bp(HF) = 20 °C' },
      { label: 'χ(O) = 3.44', value: 'bp(H₂O) = 100 °C' },
    ],
    hint: 'Count how many δ⁺ H atoms AND how many lone pairs each H₂O molecule possesses compared with each HF molecule.',
    part1: {
      question: 'Primary reason H₂O has a much higher boiling point than HF:',
      options: [
        { id: 'more_hbonds_per_mol', label: 'Each H₂O molecule can form more hydrogen bonds (up to 4) in a 3D network than HF (at most 2 on average).' },
        { id: 'o_more_electro', label: 'Oxygen is more electronegative than fluorine, so O–H bonds are more polar.' },
        { id: 'hf_no_hbonds', label: 'HF cannot form hydrogen bonds because it is linear.' },
      ],
      correctId: 'more_hbonds_per_mol',
    },
    part2: {
      question: 'Select TWO supporting structural facts on a WJEC mark scheme:',
      requiredCount: 2,
      options: [
        {
          id: 'two_h_two_lp',
          label: 'Each H₂O molecule has two δ⁺ H atoms and two lone pairs on oxygen, allowing up to 4 H-bonds per molecule (tetrahedral network).',
        },
        {
          id: 'hf_limited_by_h',
          label: 'Each HF has only one δ⁺ H atom (despite 3 lone pairs on F), limiting average H-bonding to ~2 per molecule (chains).',
        },
        {
          id: 'h2o_more_electrons',
          label: 'H₂O has far more total electrons than HF, creating much stronger London forces.',
          trapFeedback: 'Both H₂O and HF are isoelectronic — each has exactly 10 electrons!',
        },
        {
          id: 'hf_ionic',
          label: 'Pure liquid HF is ionic (H⁺F⁻) so it evaporates easily.',
          trapFeedback: 'Anhydrous HF is a molecular covalent liquid held by hydrogen bonds, not an ionic solid.',
        },
      ],
      correctIds: ['two_h_two_lp', 'hf_limited_by_h'],
    },
    markScheme: [
      'H₂O has two δ⁺ hydrogen atoms and two lone pairs on O → forms up to 4 hydrogen bonds per molecule in an extensive 3D network.',
      'HF has only one δ⁺ hydrogen atom → forms fewer hydrogen bonds per molecule on average, so less total energy is needed to vaporise HF than H₂O.',
    ],
    examinerPitfall:
      'State clearly that individual HF H-bonds ARE stronger, so the difference comes from the NUMBER of hydrogen bonds formed per molecule (4 in H₂O vs fewer in HF).',
  },
  {
    id: 'hx-london-dominance',
    unitRef: 'Unit 1.4(f)',
    title: '6. Hydrogen Halides: London Forces Outweigh Dipole Drop',
    prompt:
      'Between HCl, HBr, and HI, bond polarity DECREASES from HCl to HI (Δχ drops from 0.96 to 0.46), yet boiling points INCREASE (−85 °C → −67 °C → −35 °C). Explain this trend.',
    dataPills: [
      { label: 'HCl (18 e⁻)', value: '−85 °C' },
      { label: 'HBr (36 e⁻)', value: '−67 °C' },
      { label: 'HI (54 e⁻)', value: '−35 °C' },
    ],
    hint: 'Compare the two competing intermolecular forces in HCl, HBr, and HI: permanent dipole–dipole vs London dispersion forces.',
    part1: {
      question: 'Which factor dominates the boiling-point rise from HCl to HI?',
      options: [
        { id: 'london_dominates', label: 'Increasing London dispersion forces outweigh the decreasing permanent dipole–dipole attractions.' },
        { id: 'dipole_dominates', label: 'Permanent dipole–dipole attractions get stronger from HCl to HI.' },
        { id: 'hbonds_hx', label: 'HI forms stronger hydrogen bonds because iodine is larger.' },
      ],
      correctId: 'london_dominates',
    },
    part2: {
      question: 'Select TWO true statements that complete the explanation:',
      requiredCount: 2,
      options: [
        {
          id: 'dipole_decreases',
          label: 'Because halogen electronegativity falls down Group 7, permanent dipole–dipole attractions actually weaken from HCl → HBr → HI.',
        },
        {
          id: 'electrons_increase_london',
          label: 'Total electron count increases sharply (18 → 36 → 54 e⁻), increasing London dispersion forces enough to raise the boiling point.',
        },
        {
          id: 'hcl_stronger_covalent',
          label: 'H–Cl covalent bonds are stronger than H–I covalent bonds, making HCl harder to boil.',
          trapFeedback: 'Covalent H–X bond strength does NOT control the boiling point of a molecular substance — only intermolecular forces do.',
        },
        {
          id: 'hi_is_ionic',
          label: 'HI forms an ionic lattice at −35 °C.',
          trapFeedback: 'HI is a simple molecular covalent compound with a low boiling point of −35 °C.',
        },
      ],
      correctIds: ['dipole_decreases', 'electrons_increase_london'],
    },
    markScheme: [
      'Electronegativity decreases from Cl → Br → I, so permanent dipole–dipole forces decrease.',
      'However, number of electrons increases (18 → 54), strengthening London dispersion forces more than enough to compensate.',
    ],
    examinerPitfall:
      'Always acknowledge BOTH competing effects in an exam answer: permanent dipoles weaken, BUT increasing London forces dominate.',
  },
  {
    id: 'ice-density',
    unitRef: 'Unit 1.4(g) / 1.5(c)',
    title: '7. Solid Structure of Ice: Why Ice Floats on Water',
    prompt:
      'At 0 °C, solid ice has a lower density (~0.92 g cm⁻³) than liquid water (~1.00 g cm⁻³), meaning ice floats. Select the structural cause and TWO accurate WJEC explanations.',
    dataPills: [
      { label: 'Ice (0 °C)', value: '0.92 g cm⁻³' },
      { label: 'Water (0 °C)', value: '1.00 g cm⁻³' },
    ],
    hint: 'Think about how directional hydrogen bonds hold water molecules in rigid 3D space when water freezes compared with molecules tumbling close together in liquid water.',
    part1: {
      question: 'Why is ice less dense than liquid water?',
      options: [
        { id: 'open_hbond_lattice', label: 'Rigid hydrogen bonds hold H₂O molecules further apart in an open tetrahedral lattice with empty spaces.' },
        { id: 'trapped_air', label: 'Water decomposes into H₂ and O₂ bubbles when freezing.' },
        { id: 'weaker_bonds_ice', label: 'Ice has fewer hydrogen bonds than steam.' },
      ],
      correctId: 'open_hbond_lattice',
    },
    part2: {
      question: 'Select TWO accurate Unit 1.4 / 1.5 mark-scheme points:',
      requiredCount: 2,
      options: [
        {
          id: 'directional_tetrahedral',
          label: 'Each H₂O in ice is hydrogen-bonded in an open 3D tetrahedral arrangement, keeping molecules further apart on average than in liquid water.',
        },
        {
          id: 'melt_collapse',
          label: 'When ice melts, some hydrogen bonds break and molecules pack closer together, increasing density.',
        },
        {
          id: 'hbonds_stronger_than_cov',
          label: 'Hydrogen bonds become stronger than O–H covalent bonds below 0 °C.',
          trapFeedback: 'Hydrogen bonds are ~25 kJ mol⁻¹, whereas covalent O–H bonds are ~463 kJ mol⁻¹ (over 15× stronger).',
        },
        {
          id: 'molecules_shrink',
          label: 'Individual H₂O molecules expand their covalent bond lengths from 96 pm to 200 pm on freezing.',
          trapFeedback: 'The O–H covalent bond length barely changes; it is the intermolecular distance between separate H₂O molecules that creates open space.',
        },
      ],
      correctIds: ['directional_tetrahedral', 'melt_collapse'],
    },
    markScheme: [
      'In ice, directional hydrogen bonds hold H₂O molecules further apart in a rigid, open tetrahedral lattice.',
      'On melting, the open lattice partially collapses so molecules move closer together → liquid water is denser.',
    ],
    examinerPitfall:
      'Include the key phrase “open lattice / molecules further apart” — simply writing “ice has hydrogen bonds” does not earn the density mark because liquid water also has hydrogen bonds.',
  },
  {
    id: 'mgo-vs-nacl',
    unitRef: 'Unit 1.4(a) / 1.5(e)',
    title: '8. Giant Ionic Lattices: Why MgO Melts 2050 °C Higher Than NaCl',
    prompt:
      'Both NaCl and MgO form giant ionic 6:6 crystal lattices, yet NaCl melts at 801 °C while MgO melts at 2852 °C. Identify the bonding difference and TWO exact WJEC explanations.',
    dataPills: [
      { label: 'NaCl (Na⁺/Cl⁻)', value: 'mp 801 °C' },
      { label: 'MgO (Mg²⁺/O²⁻)', value: 'mp 2852 °C' },
    ],
    hint: 'Load MgO and NaCl in the Bonding Continuum tab to compare both ion charges (q₁, q₂) and equilibrium interionic spacing (r₀).',
    part1: {
      question: 'Which statement explains the much higher melting point of MgO?',
      options: [
        { id: 'stronger_ionic', label: 'Stronger electrostatic attraction between oppositely charged Mg²⁺ and O²⁻ ions throughout the lattice.' },
        { id: 'covalent_mgo', label: 'MgO is a giant covalent macromolecule like diamond.' },
        { id: 'imf_mgo', label: 'MgO has stronger hydrogen bonding between MgO molecules.' },
      ],
      correctId: 'stronger_ionic',
    },
    part2: {
      question: 'Select TWO mark-scheme comparisons between MgO and NaCl:',
      requiredCount: 2,
      options: [
        {
          id: 'double_charge',
          label: 'Mg²⁺ and O²⁻ carry +2/−2 charges (vs +1/−1 in Na⁺/Cl⁻), dramatically increasing electrostatic attraction.',
        },
        {
          id: 'smaller_radii',
          label: 'Mg²⁺ and O²⁻ also have smaller ionic radii (shorter distance between ion centres, 212 pm vs 282 pm), further strengthening attraction.',
        },
        {
          id: 'more_electrons_london',
          label: 'MgO has more electrons than NaCl, giving stronger London dispersion forces.',
          trapFeedback: 'Na⁺+Cl⁻ (28 e⁻) actually has MORE electrons than Mg²⁺+O²⁻ (20 e⁻), and melting giant ionic lattices depends on ionic attraction, not London forces.',
        },
        {
          id: 'molecules_mgo',
          label: 'Stronger intermolecular forces hold discrete MgO molecules together.',
          trapFeedback: 'MgO has NO molecules — it is a giant 3D ionic lattice.',
        },
      ],
      correctIds: ['double_charge', 'smaller_radii'],
    },
    markScheme: [
      'Mg²⁺ and O²⁻ ions have higher charges (+2/−2 vs +1/−1) and smaller ionic radii than Na⁺ and Cl⁻.',
      'Therefore electrostatic attraction between oppositely charged ions is much stronger, requiring more thermal energy to overcome.',
    ],
    examinerPitfall:
      'Never refer to “ionic molecules” or “intermolecular forces” when explaining NaCl or MgO melting points — WJEC examiners immediately penalise “molecules” in giant lattices.',
  },
  {
    id: 'mg-vs-na-metallic',
    unitRef: 'Unit 1.5(d)–(e)',
    title: '9. Metallic Bonding: Why Magnesium Melts Much Higher Than Sodium',
    prompt:
      'Sodium melts at 98 °C whereas magnesium melts at 650 °C and conducts electricity better per unit volume. Select the correct metallic model and TWO mark-scheme points.',
    dataPills: [
      { label: 'Na⁺ (1 e⁻/atom)', value: 'mp 98 °C' },
      { label: 'Mg²⁺ (2 e⁻/atom)', value: 'mp 650 °C' },
    ],
    hint: 'Load Sodium Metal (Na) and Magnesium Metal (Mg) in Tab 1 to inspect cation charge and delocalised electron count.',
    part1: {
      question: 'What holds metal atoms together in solid magnesium?',
      options: [
        { id: 'cation_sea', label: 'Electrostatic attraction between positive metal cations (Mg²⁺) and a sea of delocalised valence electrons.' },
        { id: 'ionic_mg', label: 'Electrostatic attraction between Mg²⁺ cations and Mg²⁻ anions.' },
        { id: 'covalent_mg', label: 'Directional shared-pair covalent bonds between pairs of Mg atoms.' },
      ],
      correctId: 'cation_sea',
    },
    part2: {
      question: 'Select TWO accurate WJEC reasons why Mg has a higher melting point than Na:',
      requiredCount: 2,
      options: [
        {
          id: 'two_deloc_charge',
          label: 'Mg²⁺ ions have double the positive charge (+2 vs +1) AND smaller ionic radius than Na⁺, giving higher cation charge density.',
        },
        {
          id: 'twice_deloc_electrons',
          label: 'Each Mg atom contributes 2 delocalised outer electrons (vs 1 per Na atom), increasing electrostatic attraction between cations and electron sea.',
        },
        {
          id: 'london_metals',
          label: 'Magnesium has 12 electrons vs 11 in sodium, giving stronger London forces between Mg atoms.',
          trapFeedback: 'Metallic melting point is governed by metallic cation–electron-sea electrostatic attraction, not weak London forces.',
        },
        {
          id: 'layers_cannot_slide',
          label: 'Metal layers in magnesium are bonded covalently so they cannot slide.',
          trapFeedback: 'Pure magnesium is still malleable/ductile (layers of cations slide while maintaining non-directional attraction to the electron sea).',
        },
      ],
      correctIds: ['two_deloc_charge', 'twice_deloc_electrons'],
    },
    markScheme: [
      'Mg²⁺ has a higher charge (+2 vs +1) and smaller ionic radius than Na⁺.',
      'Mg donates twice as many delocalised electrons per atom (2 vs 1), so attraction to the delocalised electron sea is much stronger.',
    ],
    examinerPitfall:
      'Always state BOTH factors in Mg vs Na metallic bonding questions: (1) higher cation charge / smaller radius, AND (2) more delocalised electrons per atom.',
  },
  {
    id: 'hydration-solubility',
    unitRef: 'Unit 1.4(f)–(g)',
    title: '10. Solubility & Orientation: Why NaCl Dissolves in Water but Hexane Doesn’t',
    prompt:
      'Sodium chloride dissolves readily in polar water, whereas non-polar alkanes (like hexane) are insoluble in water. Identify the ion–water interaction and TWO accurate solubility principles.',
    dataPills: [
      { label: 'Water', value: 'Polar + H-bonding' },
      { label: 'Na⁺(aq) / Cl⁻(aq)', value: 'Hydrated ions' },
    ],
    hint: 'Think about which end of a polar H–O(δ⁻)–H(δ⁺) molecule points towards Na⁺ vs Cl⁻, and why water molecules prefer H-bonding with each other over hexane.',
    part1: {
      question: 'How do polar water molecules stabilise dissolved Na⁺ and Cl⁻ ions?',
      options: [
        { id: 'ion_dipole', label: 'Ion–dipole attractions: O(δ⁻) aligns towards Na⁺, while H(δ⁺) aligns towards Cl⁻.' },
        { id: 'reversed_dipole', label: 'H(δ⁺) aligns towards Na⁺, and O(δ⁻) aligns towards Cl⁻.' },
        { id: 'covalent_na_o', label: 'Na⁺ forms strong covalent bonds with H₂O liberating H₂ gas.' },
      ],
      correctId: 'ion_dipole',
    },
    part2: {
      question: 'Select TWO accurate WJEC solubility principles:',
      requiredCount: 2,
      options: [
        {
          id: 'hydration_overcomes_lattice',
          label: 'Energy released forming ion–dipole attractions (hydration of Na⁺ and Cl⁻) compensates for the energy needed to break the NaCl ionic lattice.',
        },
        {
          id: 'hexane_cannot_hbond',
          label: 'Alkanes only form weak London forces with water, which cannot compensate for breaking water’s strong hydrogen bonds.',
        },
        {
          id: 'water_repels_alkanes',
          label: 'Water molecules chemically repel non-polar alkanes with electrostatic like-charge forces.',
          trapFeedback: 'Water and hexane are still weakly attracted by London forces — immiscibility happens because water–water H-bonds are far more favourable energetically.',
        },
        {
          id: 'ethanol_insoluble',
          label: 'Ethanol (CH₃CH₂OH) is also insoluble in water because it contains an ethyl chain.',
          trapFeedback: 'Short-chain alcohols like ethanol ARE miscible with water because their –OH group forms hydrogen bonds with water.',
        },
      ],
      correctIds: ['hydration_overcomes_lattice', 'hexane_cannot_hbond'],
    },
    markScheme: [
      'Polar water molecules surround ions via ion–dipole attractions (O δ⁻ towards Na⁺; H δ⁺ towards Cl⁻), releasing hydration energy to overcome the ionic lattice.',
      'Non-polar alkanes cannot form hydrogen bonds with water, so breaking strong H₂O···H₂O hydrogen bonds is energetically unfavourable.',
    ],
    examinerPitfall:
      'Never write that “water repels non-polar oil/alkanes”. Explain energetically: breaking strong H₂O···H₂O hydrogen bonds is not compensated by weak London forces between water and alkane.',
  },
];
