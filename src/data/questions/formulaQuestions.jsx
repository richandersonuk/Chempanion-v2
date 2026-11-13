import React from 'react';

export const simpleCations = [
  { formula: "H+", charge: 1, html: <>H<sup>+</sup></>, name: "Hydrogen ion" },
  { formula: "Li+", charge: 1, html: <>Li<sup>+</sup></>, name: "Lithium ion" },
  { formula: "Na+", charge: 1, html: <>Na<sup>+</sup></>, name: "Sodium ion" },
  { formula: "K+", charge: 1, html: <>K<sup>+</sup></>, name: "Potassium ion" },
  { formula: "Ag+", charge: 1, html: <>Ag<sup>+</sup></>, name: "Silver ion" },
  { formula: "Mg2+", charge: 2, html: <>Mg<sup>2+</sup></>, name: "Magnesium ion" },
  { formula: "Ca2+", charge: 2, html: <>Ca<sup>2+</sup></>, name: "Calcium ion" },
  { formula: "Ba2+", charge: 2, html: <>Ba<sup>2+</sup></>, name: "Barium ion" },
  { formula: "Cu2+", charge: 2, html: <>Cu<sup>2+</sup></>, name: "Copper(II) ion" },
  { formula: "Fe2+", charge: 2, html: <>Fe<sup>2+</sup></>, name: "Iron(II) ion" },
  { formula: "Zn2+", charge: 2, html: <>Zn<sup>2+</sup></>, name: "Zinc ion" },
  { formula: "Pb2+", charge: 2, html: <>Pb<sup>2+</sup></>, name: "Lead(II) ion" },
  { formula: "Al3+", charge: 3, html: <>Al<sup>3+</sup></>, name: "Aluminium ion" },
  { formula: "Fe3+", charge: 3, html: <>Fe<sup>3+</sup></>, name: "Iron(III) ion" },
  { formula: "NH4+", charge: 1, html: <>NH<sub>4</sub><sup>+</sup></>, name: "Ammonium ion", polyatomic: true }
];

export const simpleAnions = [
  { formula: "F-", charge: 1, html: <>F<sup>-</sup></>, name: "Fluoride" },
  { formula: "Cl-", charge: 1, html: <>Cl<sup>-</sup></>, name: "Chloride" },
  { formula: "Br-", charge: 1, html: <>Br<sup>-</sup></>, name: "Bromide" },
  { formula: "I-", charge: 1, html: <>I<sup>-</sup></>, name: "Iodide" },
  { formula: "H-", charge: 1, html: <>H<sup>-</sup></>, name: "Hydride" },
  { formula: "O2-", charge: 2, html: <>O<sup>2-</sup></>, name: "Oxide" },
  { formula: "S2-", charge: 2, html: <>S<sup>2-</sup></>, name: "Sulfide" },
  { formula: "N3-", charge: 3, html: <>N<sup>3-</sup></>, name: "Nitride" }
];

export const advancedPolyAnions = [
  { formula: "OH-", charge: 1, html: <>OH<sup>-</sup></>, name: "Hydroxide", polyatomic: true, base: "OH" },
  { formula: "NO3-", charge: 1, html: <>NO<sub>3</sub><sup>-</sup></>, name: "Nitrate", polyatomic: true, base: "NO3" },
  { formula: "HCO3-", charge: 1, html: <>HCO<sub>3</sub><sup>-</sup></>, name: "Hydrogen carbonate", polyatomic: true, base: "HCO3" },
  { formula: "HSO4-", charge: 1, html: <>HSO<sub>4</sub><sup>-</sup></>, name: "Hydrogen sulfate", polyatomic: true, base: "HSO4" },
  { formula: "MnO4-", charge: 1, html: <>MnO<sub>4</sub><sup>-</sup></>, name: "Manganate(VII)", polyatomic: true, base: "MnO4" },
  { formula: "CO32-", charge: 2, html: <>CO<sub>3</sub><sup>2-</sup></>, name: "Carbonate", polyatomic: true, base: "CO3" },
  { formula: "SO42-", charge: 2, html: <>SO<sub>4</sub><sup>2-</sup></>, name: "Sulfate", polyatomic: true, base: "SO4" },
  { formula: "CrO42-", charge: 2, html: <>CrO<sub>4</sub><sup>2-</sup></>, name: "Chromate(VI)", polyatomic: true, base: "CrO4" },
  { formula: "Cr2O72-", charge: 2, html: <>Cr<sub>2</sub>O<sub>7</sub><sup>2-</sup></>, name: "Dichromate(VI)", polyatomic: true, base: "Cr2O7" },
  { formula: "PO43-", charge: 3, html: <>PO<sub>4</sub><sup>3-</sup></>, name: "Phosphate", polyatomic: true, base: "PO4" }
];

export const NOMENCLATURE_DATABASE = [
  // Simple Binary Systems (Core Group 1, 2, and 7 foundational grids)
  { name: 'Sodium chloride', formula: 'NaCl', type: 'simple' },
  { name: 'Magnesium oxide', formula: 'MgO', type: 'simple' },
  { name: 'Calcium chloride', formula: 'CaCl2', type: 'simple' },
  { name: 'Aluminium oxide', formula: 'Al2O3', type: 'simple' },
  { name: 'Lithium nitride', formula: 'Li3N', type: 'simple' },
  { name: 'Barium chloride', formula: 'BaCl2', type: 'simple' },

  // Roman Numerals / Variable Oxidation States (Major Examiner Report Trap)
  { name: 'Iron(III) oxide', formula: 'Fe2O3', type: 'roman' },
  { name: 'Iron(II) chloride', formula: 'FeCl2', type: 'roman' },
  { name: 'Copper(I) oxide', formula: 'Cu2O', type: 'roman' },
  { name: 'Copper(II) nitrate', formula: 'Cu(NO3)2', type: 'roman' },
  { name: 'Manganese(IV) oxide', formula: 'MnO2', type: 'roman' },
  { name: 'Iron(III) sulfate', formula: 'Fe2(SO4)3', type: 'roman' },
  { name: 'Lead(II) nitrate', formula: 'Pb(NO3)2', type: 'roman' },

  // Advanced Core Polyatomic & Analytical Reagents (Titration Frameworks)
  { name: 'Ammonium sulfate', formula: '(NH4)2SO4', type: 'complex' },
  { name: 'Potassium dichromate(VI)', formula: 'K2Cr2O7', type: 'complex' },
  { name: 'Potassium manganate(VII)', formula: 'KMnO4', type: 'complex' },
  { name: 'Sodium thiosulfate', formula: 'Na2S2O3', type: 'complex' },
  { name: 'Sodium ethanedioate', formula: 'Na2C2O4', type: 'complex' },
  { name: 'Calcium phosphate', formula: 'Ca3(PO4)2', type: 'complex' },
  { name: 'Calcium hydroxide', formula: 'Ca(OH)2', type: 'complex' },
  { name: 'Ammonium nitrate', formula: 'NH4NO3', type: 'complex' }
];
