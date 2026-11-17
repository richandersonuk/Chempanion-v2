export const SPECTRA_PROBLEMS = [
  {
    id: 'ethanoic_acid',
    name: 'Ethanoic acid',
    formula: 'CH₃COOH',
    structuralFormula: 'CH₃COOH',
    unit: 'Unit 2.8 & 4.8',
    mr: 60,
    msFragments: [
      { mz: 15, intensity: 45, label: 'CH₃⁺' },
      { mz: 43, intensity: 100, label: 'CH₃CO⁺ (Base Peak)' },
      { mz: 45, intensity: 85, label: 'COOH⁺' },
      { mz: 60, intensity: 60, label: 'M⁺• (CH₃COOH⁺•)' }
    ],
    irPeaks: [
      { wavenumber: 2950, transmittance: 18, width: 'broad', label: '2500–3200 cm⁻¹ (Very broad O–H acid + C–H)' },
      { wavenumber: 1715, transmittance: 10, width: 'sharp', label: '1715 cm⁻¹ (Strong, sharp C=O)' },
      { wavenumber: 1250, transmittance: 35, width: 'medium', label: '1250 cm⁻¹ (C–O)' }
    ],
    c13Peaks: [
      { ppm: 21, env: 'CH₃–C=O (alkane C)', group: 'C–R (5–40 ppm)' },
      { ppm: 178, env: '–COOH (carboxylic acid C=O)', group: 'C=O acid/ester (160–185 ppm)' }
    ],
    h1Peaks: [
      { ppm: 2.1, integration: 3, splitting: 'Singlet (s)', env: 'CH₃–C=O (no adjacent H)', nPlusOne: '0 adjacent H ➔ Singlet' },
      { ppm: 11.4, integration: 1, splitting: 'Singlet (broad, D₂O exchangeable)', env: '–COOH', nPlusOne: 'Labile OH proton ➔ Singlet' }
    ],
    options: ['Ethanoic acid', 'Methyl methanoate', 'Propan-1-ol', 'Propanal'],
    keyClues: {
      functionalGroup: 'Carboxylic acid (–COOH)',
      c13Count: 2,
      h1Environments: 2
    },
    explanation: 'The very broad IR absorption at 2500–3200 cm⁻¹ combined with the sharp C=O peak at 1715 cm⁻¹ confirms a carboxylic acid. The ¹H NMR singlet at δ 11.4 ppm (D₂O exchangeable) and ¹³C peak at 178 ppm uniquely identify ethanoic acid (Mᵣ = 60).'
  },
  {
    id: 'propanone',
    name: 'Propanone',
    formula: 'CH₃COCH₃',
    structuralFormula: 'CH₃COCH₃',
    unit: 'Unit 4.8',
    mr: 58,
    msFragments: [
      { mz: 15, intensity: 35, label: 'CH₃⁺' },
      { mz: 43, intensity: 100, label: 'CH₃CO⁺ (Base Peak)' },
      { mz: 58, intensity: 50, label: 'M⁺• (C₃H₆O⁺•)' }
    ],
    irPeaks: [
      { wavenumber: 2960, transmittance: 55, width: 'sharp', label: '2960 cm⁻¹ (C–H)' },
      { wavenumber: 1715, transmittance: 8, width: 'sharp', label: '1715 cm⁻¹ (Strong C=O)' }
    ],
    c13Peaks: [
      { ppm: 31, env: '2 × symmetrical CH₃ carbons', group: 'C–R (5–40 ppm)' },
      { ppm: 207, env: 'Ketone C=O carbon', group: 'C=O aldehyde/ketone (190–220 ppm)' }
    ],
    h1Peaks: [
      { ppm: 2.2, integration: 6, splitting: 'Singlet (s)', env: '2 × equivalent CH₃–C=O groups', nPlusOne: '0 adjacent H ➔ Singlet' }
    ],
    options: ['Propanone', 'Propanal', 'Prop-2-en-1-ol', 'Ethanoic acid'],
    keyClues: {
      functionalGroup: 'Ketone (C=O)',
      c13Count: 2,
      h1Environments: 1
    },
    explanation: 'Propanone is symmetrical: despite having 3 carbons and 6 protons, molecular symmetry yields only 2 peaks in the ¹³C NMR (including C=O at 207 ppm) and a single 6H singlet at δ 2.2 ppm in the ¹H NMR, with no aldehyde proton at δ 9.8 ppm.'
  },
  {
    id: 'propanal',
    name: 'Propanal',
    formula: 'CH₃CH₂CHO',
    structuralFormula: 'CH₃CH₂CHO',
    unit: 'Unit 4.8',
    mr: 58,
    msFragments: [
      { mz: 29, intensity: 100, label: 'CHO⁺ / C₂H₅⁺ (Base Peak)' },
      { mz: 57, intensity: 40, label: '[M–H]⁺' },
      { mz: 58, intensity: 65, label: 'M⁺• (C₃H₆O⁺•)' }
    ],
    irPeaks: [
      { wavenumber: 2950, transmittance: 50, width: 'sharp', label: '2800–3100 cm⁻¹ (C–H)' },
      { wavenumber: 1725, transmittance: 10, width: 'sharp', label: '1725 cm⁻¹ (Strong C=O)' }
    ],
    c13Peaks: [
      { ppm: 7, env: 'CH₃–', group: 'C–R (5–40 ppm)' },
      { ppm: 37, env: '–CH₂–C=O', group: 'C–R (5–40 ppm)' },
      { ppm: 203, env: '–CHO (aldehyde C=O)', group: 'C=O aldehyde/ketone (190–220 ppm)' }
    ],
    h1Peaks: [
      { ppm: 1.1, integration: 3, splitting: 'Triplet (t)', env: 'CH₃– (adjacent to CH₂)', nPlusOne: '2 adjacent H ➔ 2+1 = 3 (Triplet)' },
      { ppm: 2.5, integration: 2, splitting: 'Multiplet / Quartet', env: '–CH₂–C=O', nPlusOne: 'Coupled to CH₃ (and CHO)' },
      { ppm: 9.8, integration: 1, splitting: 'Singlet / Triplet', env: '–CHO (aldehyde proton)', nPlusOne: 'Characteristic aldehyde shift at 9.8 ppm' }
    ],
    options: ['Propanal', 'Propanone', 'Propanoic acid', 'Propan-1-ol'],
    keyClues: {
      functionalGroup: 'Aldehyde (–CHO)',
      c13Count: 3,
      h1Environments: 3
    },
    explanation: 'Unlike its structural isomer propanone, propanal has 3 distinct carbon environments in ¹³C NMR (including C=O at 203 ppm), a diagnostic aldehyde ¹H NMR signal at δ 9.8 ppm (1H), and an ethyl triplet-quartet splitting pattern.'
  },
  {
    id: 'ethyl_ethanoate',
    name: 'Ethyl ethanoate',
    formula: 'CH₃COOCH₂CH₃',
    structuralFormula: 'CH₃COOCH₂CH₃',
    unit: 'Unit 4.8',
    mr: 88,
    msFragments: [
      { mz: 29, intensity: 45, label: 'CH₂CH₃⁺' },
      { mz: 43, intensity: 100, label: 'CH₃CO⁺ (Base Peak)' },
      { mz: 61, intensity: 25, label: 'CH₃COOH₂⁺' },
      { mz: 88, intensity: 35, label: 'M⁺• (C₄H₈O₂⁺•)' }
    ],
    irPeaks: [
      { wavenumber: 2980, transmittance: 50, width: 'sharp', label: '2980 cm⁻¹ (C–H)' },
      { wavenumber: 1740, transmittance: 8, width: 'sharp', label: '1740 cm⁻¹ (Strong ester C=O)' },
      { wavenumber: 1240, transmittance: 15, width: 'sharp', label: '1240 cm⁻¹ (Strong C–O stretch)' }
    ],
    c13Peaks: [
      { ppm: 14, env: '–OCH₂CH₃ (methyl)', group: 'C–R (5–40 ppm)' },
      { ppm: 21, env: 'CH₃C=O', group: 'C–R (5–40 ppm)' },
      { ppm: 60, env: '–O–CH₂–', group: 'C–O (50–90 ppm)' },
      { ppm: 171, env: '–COO– (ester C=O)', group: 'C=O acid/ester (160–185 ppm)' }
    ],
    h1Peaks: [
      { ppm: 1.3, integration: 3, splitting: 'Triplet (t)', env: '–OCH₂CH₃', nPlusOne: '2 adjacent H on CH₂ ➔ Triplet' },
      { ppm: 2.0, integration: 3, splitting: 'Singlet (s)', env: 'CH₃–C=O', nPlusOne: '0 adjacent H ➔ Singlet' },
      { ppm: 4.1, integration: 2, splitting: 'Quartet (q)', env: '–O–CH₂–CH₃', nPlusOne: '3 adjacent H on CH₃ ➔ Quartet' }
    ],
    options: ['Ethyl ethanoate', 'Methyl propanoate', 'Butanoic acid', 'Butan-2-one'],
    keyClues: {
      functionalGroup: 'Ester (–COO–)',
      c13Count: 4,
      h1Environments: 3
    },
    explanation: 'IR shows C=O (1740 cm⁻¹) and C–O (1240 cm⁻¹) with NO O–H absorption, proving an ester (Mᵣ = 88). In ¹H NMR, the quartet (2H) is at δ 4.1 ppm (directly attached to oxygen: –O–CH₂CH₃) and the singlet (3H) is at δ 2.0 ppm (CH₃C=O), distinguishing ethyl ethanoate from methyl propanoate.'
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'CH₃CH₂OH',
    structuralFormula: 'CH₃CH₂OH',
    unit: 'Unit 2.8 & 4.8',
    mr: 46,
    msFragments: [
      { mz: 15, intensity: 25, label: 'CH₃⁺' },
      { mz: 31, intensity: 100, label: 'CH₂OH⁺ (Base Peak)' },
      { mz: 45, intensity: 55, label: '[M–H]⁺' },
      { mz: 46, intensity: 40, label: 'M⁺• (C₂H₆O⁺•)' }
    ],
    irPeaks: [
      { wavenumber: 3350, transmittance: 15, width: 'broad', label: '3200–3550 cm⁻¹ (Broad O–H alcohol)' },
      { wavenumber: 2950, transmittance: 35, width: 'sharp', label: '2800–3100 cm⁻¹ (C–H)' },
      { wavenumber: 1050, transmittance: 30, width: 'sharp', label: '1050 cm⁻¹ (C–O)' }
    ],
    c13Peaks: [
      { ppm: 18, env: 'CH₃–', group: 'C–R (5–40 ppm)' },
      { ppm: 58, env: '–CH₂–OH', group: 'C–O (50–90 ppm)' }
    ],
    h1Peaks: [
      { ppm: 1.2, integration: 3, splitting: 'Triplet (t)', env: 'CH₃–', nPlusOne: '2 adjacent H on CH₂ ➔ Triplet' },
      { ppm: 3.7, integration: 2, splitting: 'Quartet (q)', env: '–CH₂–O–', nPlusOne: '3 adjacent H on CH₃ ➔ Quartet' },
      { ppm: 4.5, integration: 1, splitting: 'Singlet (D₂O exchangeable)', env: '–OH', nPlusOne: 'Alcohol OH does not split (Singlet)' }
    ],
    options: ['Ethanol', 'Methoxymethane', 'Ethanal', 'Ethanoic acid'],
    keyClues: {
      functionalGroup: 'Alcohol (–OH)',
      c13Count: 2,
      h1Environments: 3
    },
    explanation: 'The smooth broad IR absorption at 3350 cm⁻¹ (with no C=O at 1700 cm⁻¹) indicates an alcohol. The base peak at m/z = 31 (CH₂OH⁺) and the 3:2:1 triplet-quartet-singlet pattern in ¹H NMR confirm ethanol.'
  },
  {
    id: '1_bromopropane',
    name: '1-Bromopropane',
    formula: 'CH₃CH₂CH₂Br',
    structuralFormula: 'CH₃CH₂CH₂Br',
    unit: 'Unit 2.8 & 4.8',
    mr: 122,
    msFragments: [
      { mz: 43, intensity: 100, label: 'C₃H₇⁺ (Base Peak)' },
      { mz: 79, intensity: 20, label: '⁷⁹Br⁺' },
      { mz: 81, intensity: 20, label: '⁸¹Br⁺' },
      { mz: 122, intensity: 35, label: 'M⁺• (⁷⁹Br isotope)' },
      { mz: 124, intensity: 35, label: '[M+2]⁺• (⁸¹Br 1:1 doublet)' }
    ],
    irPeaks: [
      { wavenumber: 2960, transmittance: 35, width: 'sharp', label: '2800–3100 cm⁻¹ (C–H)' },
      { wavenumber: 560, transmittance: 25, width: 'sharp', label: '500–600 cm⁻¹ (C–Br stretch)' }
    ],
    c13Peaks: [
      { ppm: 13, env: 'CH₃–', group: 'C–R (5–40 ppm)' },
      { ppm: 26, env: '–CH₂–', group: 'C–R (5–40 ppm)' },
      { ppm: 36, env: '–CH₂–Br', group: 'C–Br (10–70 ppm)' }
    ],
    h1Peaks: [
      { ppm: 1.0, integration: 3, splitting: 'Triplet (t)', env: 'CH₃– (adjacent to CH₂)', nPlusOne: '2 adjacent H ➔ Triplet' },
      { ppm: 1.9, integration: 2, splitting: 'Multiplet (m)', env: '–CH₂– (central)', nPlusOne: '5 adjacent H ➔ Multiplet (Sextet)' },
      { ppm: 3.4, integration: 2, splitting: 'Triplet (t)', env: '–CH₂–Br', nPlusOne: '2 adjacent H ➔ Triplet' }
    ],
    options: ['1-Bromopropane', '2-Bromopropane', '1-Chloropropane', 'Propan-1-ol'],
    keyClues: {
      functionalGroup: 'Haloalkane (C–Br)',
      c13Count: 3,
      h1Environments: 3
    },
    explanation: 'The 1:1 M⁺ / [M+2]⁺ molecular ion doublet at m/z 122 and 124 is diagnostic for bromine (⁷⁹Br / ⁸¹Br isotopes), supported by the C–Br IR band at 560 cm⁻¹. Having 3 peaks in ¹³C NMR proves the asymmetry of 1-bromopropane (whereas symmetrical 2-bromopropane has only 2 peaks).'
  }
];

export const FUNCTIONAL_GROUP_OPTIONS = [
  'Carboxylic acid (–COOH)',
  'Ketone (C=O)',
  'Aldehyde (–CHO)',
  'Ester (–COO–)',
  'Alcohol (–OH)',
  'Haloalkane (C–Br)'
];

