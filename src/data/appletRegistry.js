import React from 'react';

// Unit 1 Dynamic Lazy Imports
const FormulasFromIons = React.lazy(() => import('../applets/unit1/FormulasFromIons').then(m => m.FormulasFromIons ? { default: m.FormulasFromIons } : m));
const FormulasFromName = React.lazy(() => import('../applets/unit1/FormulasFromName').then(m => m.FormulasFromName ? { default: m.FormulasFromName } : m));
const FormulaMaster = React.lazy(() => import('../applets/unit1/FormulaMaster').then(m => m.FormulaMaster ? { default: m.FormulaMaster } : m));
const NuclearChemistry = React.lazy(() => import('../applets/unit1/NuclearChemistry').then(m => m.default ? { default: m.default } : m));
const EmpiricalFormula = React.lazy(() => import('../applets/unit1/EmpiricalFormula').then(m => m.EmpiricalFormula ? { default: m.EmpiricalFormula } : m));
const IdealGas = React.lazy(() => import('../applets/unit1/IdealGas').then(m => m.IdealGas ? { default: m.IdealGas } : m));
const VSEPRShapes = React.lazy(() => import('../applets/unit1/VSEPRShapes').then(m => m.VSEPRShapes ? { default: m.VSEPRShapes } : m));
const BondingIMFLab = React.lazy(() => import('../applets/unit1/BondingIMFLab').then(m => m.BondingIMFLab ? { default: m.BondingIMFLab } : m));
const InorganicTests = React.lazy(() => import('../applets/unit1/InorganicTests').then(m => m.InorganicTests ? { default: m.InorganicTests } : m));
const AcidBaseTitration = React.lazy(() => import('../applets/unit1/AcidBaseTitration').then(m => m.AcidBaseTitration ? { default: m.AcidBaseTitration } : m));

// Unit 2 Dynamic Lazy Imports
const ThermometricTitration = React.lazy(() => import('../applets/unit2/ThermometricTitration').then(m => m.ThermometricTitration ? { default: m.ThermometricTitration } : m));
const EnthalpyCombustion = React.lazy(() => import('../applets/unit2/EnthalpyCombustion').then(m => m.EnthalpyCombustion ? { default: m.EnthalpyCombustion } : m));
const HessLawCycles = React.lazy(() => import('../applets/unit2/HessLawCycles').then(m => m.default ? { default: m.default } : m));
const MaxwellBoltzmann = React.lazy(() => import('../applets/unit2/MaxwellBoltzmann').then(m => m.default ? { default: m.default } : m));
const IupacIsomerism = React.lazy(() => import('../applets/unit2/IupacIsomerism').then(m => m.default ? { default: m.default } : m));
const MechanismUnit2 = React.lazy(() => import('../applets/unit2/MechanismUnit2').then(m => m.MechanismUnit2 ? { default: m.MechanismUnit2 } : m));

// Unit 3 Dynamic Lazy Imports
const HalfEquationBalancing = React.lazy(() => import('../applets/unit3/HalfEquationBalancing').then(m => m.default ? { default: m.default } : m));
const RedoxTitration = React.lazy(() => import('../applets/unit3/RedoxTitration').then(m => m.RedoxTitration ? { default: m.RedoxTitration } : m));
const CellPotentials = React.lazy(() => import('../applets/unit3/CellPotentials').then(m => m.CellPotentials ? { default: m.CellPotentials } : m));
const ReactionRates = React.lazy(() => import('../applets/unit3/ReactionRates').then(m => m.ReactionRates ? { default: m.ReactionRates } : m));
const BornHaberCycle = React.lazy(() => import('../applets/unit3/BornHaberCycle').then(m => m.BornHaberCycle ? { default: m.BornHaberCycle } : m));
const EntropyGibbs = React.lazy(() => import('../applets/unit3/EntropyGibbs').then(m => m.EntropyGibbs ? { default: m.EntropyGibbs } : m));
const KcCalculations = React.lazy(() => import('../applets/unit3/KcCalculations').then(m => m.KcCalculations ? { default: m.KcCalculations } : m));
const KpCalculations = React.lazy(() => import('../applets/unit3/KpCalculations').then(m => m.KpCalculations ? { default: m.KpCalculations } : m));
const AcidsAndBases = React.lazy(() => import('../applets/unit3/AcidsAndBases').then(m => m.AcidsAndBases ? { default: m.AcidsAndBases } : m));
const BufferSolutions = React.lazy(() => import('../applets/unit3/BufferSolutions').then(m => m.BufferSolutions ? { default: m.BufferSolutions } : m));

// Unit 4 Dynamic Lazy Imports
const ChiralCenters = React.lazy(() => import('../applets/unit4/ChiralCenters').then(m => m.ChiralCenters ? { default: m.ChiralCenters } : m));
const MechanismMasterclass = React.lazy(() => import('../applets/unit4/MechanismMasterclass').then(m => m.MechanismMasterclass ? { default: m.MechanismMasterclass } : m));
const OrganicSynthesis = React.lazy(() => import('../applets/unit4/OrganicSynthesis').then(m => m.OrganicSynthesis ? { default: m.OrganicSynthesis } : m));
const SpectraInterpreter = React.lazy(() => import('../applets/unit4/SpectraInterpreter').then(m => m.SpectraInterpreter ? { default: m.SpectraInterpreter } : m));

export const WJEC_UNIT_TITLES = {
  'Unit 1': 'The Language of Chemistry, Structure of Matter and Simple Reactions',
  'Unit 2': 'Energy, Rate and Chemistry of Carbon Compounds',
  'Unit 3': 'Physical and Inorganic Chemistry',
  'Unit 4': 'Organic Chemistry and Analysis'
};

export const MAIN_UNITS = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4'];

export const APPLETS = [
  // Unit 1
  { id: 'formulas-ions', label: 'Formulas from Ions', short: 'Ion Formulas', unit: 'Unit 1.1', icon: '⚛️', desc: 'Balance charge ratios and construct ionic formulas.', component: FormulasFromIons, targetMastery: 10 },
  { id: 'formulas-name', label: 'Formulas from Names', short: 'Name Formulas', unit: 'Unit 1.1', icon: '🏷️', desc: 'Convert systematic chemical names directly to formulas.', component: FormulasFromName, targetMastery: 10 },
  { id: 'formula-master', label: 'Ion formulas from compounds', short: 'Ions from compounds', unit: 'Unit 1.1', icon: '🧩', desc: 'Master advanced reverse operations: deduce names and split free ionic structures.', component: FormulaMaster, targetMastery: 10 },
  { id: 'nuclear-decay', label: 'Nuclear Decay Equations', short: 'Nuclear Decay', unit: 'Unit 1.2', icon: '☢️', desc: 'Balance alpha, beta, gamma, and electron capture equations.', component: NuclearChemistry, targetMastery: 10 },
  { id: 'spectralab', label: 'Spectra Lab', short: 'Spectra Lab', unit: 'Unit 1.2', icon: '🌈', desc: 'Standalone interactive spectroscopy web application.', isExternal: true, url: 'https://spectralab.chempanion.uk' },
  { id: 'econfigs-game', label: 'Electron Configuration Game', short: 'Electron Configs', unit: 'Unit 1.2', icon: '⚡', desc: 'Interactive game practising s-, p-, and d-orbital electron configurations.', isExternal: true, url: 'https://games.alchemix.uk/econfigs' },
  { id: 'empirical-formula', label: 'Empirical & Molecular Formulas', short: 'Empirical', unit: 'Unit 1.3', icon: '🧮', desc: 'Convert mass composition properties into empirical and molecular formulas.', component: EmpiricalFormula, targetMastery: 10 },
  { id: 'idealgas', label: 'Ideal Gas Calculations', short: 'Ideal Gas', unit: 'Unit 1.3', icon: '🎈', desc: 'Master pV = nRT variables with SI unit-conversion verification.', component: IdealGas, targetMastery: 10 },
  { id: 'vsepr-shapes', label: 'VSEPR Shapes & Polarity', short: 'VSEPR Shapes', unit: 'Unit 1.4', icon: '📐', desc: 'Count bonding and lone pairs to deduce 3D shapes, bond angles, coordinate ions, and molecular polarity.', component: VSEPRShapes, targetMastery: 10 },
  { id: 'bonding-imf-lab', label: 'Bonding Continuum & IMFs', short: 'Bonding & IMFs', unit: 'Unit 1.4 / 1.5', icon: '🔗', desc: 'Explore the ionic–covalent continuum, potential energy wells, boiling-point trends, and WJEC IMF exam challenges.', component: BondingIMFLab, targetMastery: 8 },
  { id: 'inorganic-tests', label: 'Qualitative Inorganic Analysis', short: 'Inorganic Tests', unit: 'Unit 1.6', icon: '🔬', desc: 'Deduce unknown salts using sequential flame, Group 2, carbonate, sulfate, and halide tests.', component: InorganicTests, targetMastery: 8 },
  { id: 'periodictable-lab', label: 'Periodic Table Lab', short: 'Periodic Table', unit: 'Unit 1.6', icon: '🧪', desc: 'Standalone interactive Unit 1.6 periodic trends, flame tests, and practicals lab.', isExternal: true, url: 'https://periodictable.chempanion.uk' },
  { id: 'titration', label: 'Acid-Base Titrations', short: 'Titrations', unit: 'Unit 1.7', icon: '🧪', desc: 'Solve classic standard neutralising calculation sequences.', component: AcidBaseTitration, targetMastery: 10 },

  // Unit 2
  { id: 'thermometric', label: 'Thermometric Titrations', short: 'Thermometric', unit: 'Unit 2.1', icon: '📈', desc: 'Extrapolate graph endpoint parameters and calculate accurate enthalpy changes.', component: ThermometricTitration, targetMastery: 5 },
  { id: 'enthalpy', label: 'Enthalpy of Combustion', short: 'Enthalpy', unit: 'Unit 2.1', icon: '🔥', desc: 'Determine calorimetry energy variables, mean bond enthalpies, and unknown bond energies.', component: EnthalpyCombustion, targetMastery: 8 },
  { id: 'hess-cycles', label: 'Hess’s Law Enthalpy Cycles', short: 'Hess Cycles', unit: 'Unit 2.1', icon: '🔄', desc: 'Construct formation and combustion enthalpy cycles with route gates and stoichiometry checks.', component: HessLawCycles, targetMastery: 8 },
  { id: 'maxwell-boltzmann', label: 'Maxwell–Boltzmann & Collision Theory', short: 'Maxwell–Boltzmann', unit: 'Unit 2.2', icon: '📊', desc: 'Explore molecular energy distributions, temperature shifts, catalysts, and WJEC collision explanations.', component: MaxwellBoltzmann, targetMastery: 8 },
  { id: 'iupac-isomerism', label: 'IUPAC Naming & E/Z Isomerism', short: 'IUPAC & E/Z', unit: 'Unit 2.4', icon: '🧪', desc: 'Apply IUPAC nomenclature rules, classify structural isomers, and assign CIP E/Z priorities.', component: IupacIsomerism, targetMastery: 10 },
  { id: 'mechanisms-unit2', label: 'AS Organic Mechanisms', short: 'AS Mechanisms', unit: 'Unit 2.5 / 2.6', icon: '🏹', desc: 'Master fundamental alkene addition and substitution dipoles and arrows.', component: MechanismUnit2, targetMastery: 5 },

  // Unit 3
  { id: 'cell-potentials', label: 'Standard Cell Potentials', short: 'Cell Potentials', unit: 'Unit 3.1', icon: '🔋', desc: 'Determine overall standard cell EMF from half-equation standard potentials.', component: CellPotentials, targetMastery: 10 },
  { id: 'cell-potentials-lab', label: 'Electrode Potentials', short: 'Electrochem', unit: 'Unit 3.1', icon: '⚡', desc: 'Standalone interactive electrochemistry laboratory.', isExternal: true, url: 'https://electrodepotentials.chempanion.uk' },
  { id: 'half-equations', label: 'Half-Equation & Redox Balancing', short: 'Half-Equations', unit: 'Unit 3.2', icon: '⚖️', desc: 'Deduce oxidation states, balance acidic/alkaline half-equations, and combine redox systems.', component: HalfEquationBalancing, targetMastery: 10 },
  { id: 'redox', label: 'Redox Titration', short: 'Redox', unit: 'Unit 3.2', icon: '🧪', desc: 'Analyse ratio pathways for complex transition elements.', component: RedoxTitration, targetMastery: 8 },
  { id: 'pblock', label: 'P-Block Chemistry Lab', short: 'P-Block Lab', unit: 'Unit 3.3', icon: '🧪', desc: 'Standalone interactive p-block chemistry laboratory.', isExternal: true, url: 'https://pblock.chempanion.uk' },
  { id: 'transition-metals-lab', label: 'Transition Metals', short: 'Transition Metals', unit: 'Unit 3.4', icon: '💎', desc: 'Standalone interactive transition metals laboratory.', isExternal: true, url: 'https://transitionmetals.chempanion.uk' },
  { id: 'rates', label: 'Reaction Rates', short: 'Rates', unit: 'Unit 3.5', icon: '⏱️', desc: 'Deduce rate equations, orders, and Arrhenius activation energy constraints.', component: ReactionRates, targetMastery: 10 },
  { id: 'born-haber', label: 'Born-Haber & Solution Cycles', short: 'Born-Haber', unit: 'Unit 3.6', icon: '⚡', desc: 'Construct Born-Haber and enthalpy of solution cycles with stoichiometry and sign gates.', component: BornHaberCycle, targetMastery: 6 },
  { id: 'entropy-gibbs', label: 'Entropy & Gibbs Free Energy', short: 'Gibbs Free Energy', unit: 'Unit 3.7', icon: '❄️', desc: 'Balance ΔH and ΔS to determine Gibbs feasibility and temperature thresholds.', component: EntropyGibbs, targetMastery: 20 },
  { id: 'kc-calc', label: 'Kc Equilibrium Constants', short: 'Kc Equilibrium', unit: 'Unit 3.8', icon: '⚗️', desc: 'Construct ICE tables and determine concentration equilibrium constants.', component: KcCalculations, targetMastery: 8 },
  { id: 'kp-calc', label: 'Kp Equilibrium Constants', short: 'Kp Equilibrium', unit: 'Unit 3.8', icon: '💨', desc: 'Calculate gas mole fractions, partial pressures, and Kp constants.', component: KpCalculations, targetMastery: 8 },
  { id: 'acids', label: 'pH & Weak Acids', short: 'pH Acids', unit: 'Unit 3.9', icon: '🍋', desc: 'Determine Ka, pKa, and hydrogen ion parameters.', component: AcidsAndBases, targetMastery: 10 },
  { id: 'buffers', label: 'Buffer Solutions', short: 'Buffers', unit: 'Unit 3.9', icon: '🛡️', desc: 'Evaluate specific system responses to salt mass and alkali additions.', component: BufferSolutions, targetMastery: 8 },

  // Unit 4
  { id: 'chiral-centers', label: 'Chiral Centre Identification', short: 'Chiral Carbons', unit: 'Unit 4.1', icon: '🧬', desc: 'Audit asymmetric carbon nodes and identify stereoisomers in skeletal structures.', component: ChiralCenters, targetMastery: 16 },
  { id: 'mechanisms-masterclass', label: 'Organic Mechanisms', short: 'Mechanisms', unit: 'Unit 4.2 – 4.4', icon: '🏹', desc: 'Master carbonyl and aromatic reactions by tracking induced dipoles and curly arrows.', component: MechanismMasterclass, targetMastery: 5 },
  { id: 'organic-synthesis', label: 'Organic Synthesis Pathways', short: 'Synthesis Routes', unit: 'Unit 4.7', icon: '🗺️', desc: 'Design multi-step aliphatic and aromatic synthesis routes with exact WJEC reagents, conditions, and intermediates.', component: OrganicSynthesis, targetMastery: 8 },
  { id: 'spectra-interpreter', label: 'Combined Spectral Interpreter', short: 'NMR, IR & MS', unit: 'Unit 4.8', icon: '📊', desc: 'Identify unknown organic structures using Mass Spectrometry, IR, ¹³C NMR, and ¹H NMR splitting.', component: SpectraInterpreter, targetMastery: 6 }
];

export const SORTED_APPLETS = [...APPLETS].sort((a, b) =>
  a.unit.localeCompare(b.unit, undefined, { numeric: true })
);
