import React from 'react';

export const PARTICLES = {
  alpha: { name: 'Alpha particle', symbol: 'He', mass: 4, atomic: 2, greek: 'α' },
  betaMinus: { name: 'Beta-minus particle', symbol: 'e', mass: 0, atomic: -1, greek: 'β⁻' },
  positron: { name: 'Positron', symbol: 'e', mass: 0, atomic: 1, greek: 'β⁺' },
  electronCapture: { name: 'Captured electron', symbol: 'e', mass: 0, atomic: -1, greek: 'e⁻' },
  neutron: { name: 'Neutron', symbol: 'n', mass: 1, atomic: 0, greek: 'n' }
};

export const DECAY_DATASETS = [
  // Alpha Decay
  { parent: { name: 'Uranium-238', symbol: 'U', mass: 238, atomic: 92 }, mode: 'alpha', daughter: { symbol: 'Th', mass: 234, atomic: 90 } },
  { parent: { name: 'Radium-226', symbol: 'Ra', mass: 226, atomic: 88 }, mode: 'alpha', daughter: { symbol: 'Rn', mass: 222, atomic: 86 } },
  { parent: { name: 'Polonium-210', symbol: 'Po', mass: 210, atomic: 84 }, mode: 'alpha', daughter: { symbol: 'Pb', mass: 206, atomic: 82 } },
  { parent: { name: 'Plutonium-239', symbol: 'Pu', mass: 239, atomic: 94 }, mode: 'alpha', daughter: { symbol: 'U', mass: 235, atomic: 92 } },
  { parent: { name: 'Americium-241', symbol: 'Am', mass: 241, atomic: 95 }, mode: 'alpha', daughter: { symbol: 'Np', mass: 237, atomic: 93 } },
  { parent: { name: 'Thorium-232', symbol: 'Th', mass: 232, atomic: 90 }, mode: 'alpha', daughter: { symbol: 'Ra', mass: 228, atomic: 88 } },

  // Beta-Minus Decay
  { parent: { name: 'Carbon-14', symbol: 'C', mass: 14, atomic: 6 }, mode: 'betaMinus', daughter: { symbol: 'N', mass: 14, atomic: 7 } },
  { parent: { name: 'Iodine-131', symbol: 'I', mass: 131, atomic: 53 }, mode: 'betaMinus', daughter: { symbol: 'Xe', mass: 131, atomic: 54 } },
  { parent: { name: 'Cobalt-60', symbol: 'Co', mass: 60, atomic: 27 }, mode: 'betaMinus', daughter: { symbol: 'Ni', mass: 60, atomic: 28 } },
  { parent: { name: 'Strontium-90', symbol: 'Sr', mass: 90, atomic: 38 }, mode: 'betaMinus', daughter: { symbol: 'Y', mass: 90, atomic: 39 } },
  { parent: { name: 'Tritium (Hydrogen-3)', symbol: 'H', mass: 3, atomic: 1 }, mode: 'betaMinus', daughter: { symbol: 'He', mass: 3, atomic: 2 } },
  { parent: { name: 'Caesium-137', symbol: 'Cs', mass: 137, atomic: 55 }, mode: 'betaMinus', daughter: { symbol: 'Ba', mass: 137, atomic: 56 } },
  { parent: { name: 'Phosphorus-32', symbol: 'P', mass: 32, atomic: 15 }, mode: 'betaMinus', daughter: { symbol: 'S', mass: 32, atomic: 16 } },

  // Positron Emission (Beta-Plus)
  { parent: { name: 'Fluorine-18', symbol: 'F', mass: 18, atomic: 9 }, mode: 'positron', daughter: { symbol: 'O', mass: 18, atomic: 8 } },
  { parent: { name: 'Carbon-11', symbol: 'C', mass: 11, atomic: 6 }, mode: 'positron', daughter: { symbol: 'B', mass: 11, atomic: 5 } },
  { parent: { name: 'Nitrogen-13', symbol: 'N', mass: 13, atomic: 7 }, mode: 'positron', daughter: { symbol: 'C', mass: 13, atomic: 6 } },
  { parent: { name: 'Oxygen-15', symbol: 'O', mass: 15, atomic: 8 }, mode: 'positron', daughter: { symbol: 'N', mass: 15, atomic: 7 } },
  { parent: { name: 'Sodium-22', symbol: 'Na', mass: 22, atomic: 11 }, mode: 'positron', daughter: { symbol: 'Ne', mass: 22, atomic: 10 } },

  // Electron Capture
  { parent: { name: 'Krypton-81', symbol: 'Kr', mass: 81, atomic: 36 }, mode: 'electronCapture', daughter: { symbol: 'Br', mass: 81, atomic: 35 } },
  { parent: { name: 'Iron-55', symbol: 'Fe', mass: 55, atomic: 26 }, mode: 'electronCapture', daughter: { symbol: 'Mn', mass: 55, atomic: 25 } },
  { parent: { name: 'Potassium-40', symbol: 'K', mass: 40, atomic: 19 }, mode: 'electronCapture', daughter: { symbol: 'Ar', mass: 40, atomic: 18 } },
  { parent: { name: 'Beryllium-7', symbol: 'Be', mass: 7, atomic: 4 }, mode: 'electronCapture', daughter: { symbol: 'Li', mass: 7, atomic: 3 } },
  { parent: { name: 'Iodine-125', symbol: 'I', mass: 125, atomic: 53 }, mode: 'electronCapture', daughter: { symbol: 'Te', mass: 125, atomic: 52 } },

  // Neutron Emission / Bombardment
  { parent: { name: 'Beryllium-13', symbol: 'Be', mass: 13, atomic: 4 }, mode: 'neutron', daughter: { symbol: 'Be', mass: 12, atomic: 4 } },
  { parent: { name: 'Helium-5', symbol: 'He', mass: 5, atomic: 2 }, mode: 'neutron', daughter: { symbol: 'He', mass: 4, atomic: 2 } }
];

export const ISOTOPE_HALF_LIVES = [
  { name: 'Iodine-131', symbol: 'I', mass: 131, halfLifeDays: 8, use: 'medical treatment of thyroid cancer' },
  { name: 'Technetium-99m', symbol: 'Tc', mass: 99, halfLifeHours: 6, use: 'medical imaging tracer' },
  { name: 'Carbon-14', symbol: 'C', mass: 14, halfLifeYears: 5730, use: 'radiocarbon dating of biological remains' },
  { name: 'Radon-222', symbol: 'Rn', mass: 222, halfLifeDays: 3.8, use: 'evaluating geological radiation hazards' },
  { name: 'Cobalt-60', symbol: 'Co', mass: 60, halfLifeYears: 5.3, use: 'radiotherapy for cancer treatment' },
  { name: 'Fluorine-18', symbol: 'F', mass: 18, halfLifeHours: 1.8, use: 'radiotracer in PET scans' },
  { name: 'Strontium-90', symbol: 'Sr', mass: 90, halfLifeYears: 28.8, use: 'industrial thickness gauges and nuclear waste monitoring' },
  { name: 'Phosphorus-32', symbol: 'P', mass: 32, halfLifeDays: 14.3, use: 'molecular biology research and bone cancer therapy' },
  { name: 'Sodium-24', symbol: 'Na', mass: 24, halfLifeHours: 15, use: 'locating leaks in industrial pipeline systems' },
  { name: 'Americium-241', symbol: 'Am', mass: 241, halfLifeYears: 432, use: 'ionisation chamber smoke detectors' }
];

export const PROPERTY_QUESTIONS = [
  {
    q: 'Identify the type of radiation that has the highest ionising power and is stopped by a single sheet of paper.',
    answer: 'alpha',
    options: ['alpha', 'beta', 'gamma'],
    explanation: (
      <>
        Alpha particles (He<sup>2+</sup>) have a high charge (+2) and relatively large mass, making them strongly ionising but easily stopped by paper or skin.
      </>
    )
  },
  {
    q: 'In an electric field between a positive top plate and a negative bottom plate, state which radiation is deflected towards the positive plate.',
    answer: 'beta',
    options: ['alpha', 'beta', 'gamma'],
    explanation: (
      <>
        Beta-minus particles (e<sup>-</sup>) carry a negative charge (-1) and are attracted towards the positive plate.
      </>
    )
  },
  {
    q: 'State which shielding material is required to significantly reduce the intensity of high-energy gamma radiation.',
    answer: 'lead',
    options: ['paper', 'aluminium', 'lead'],
    explanation: 'Gamma radiation is high-energy electromagnetic radiation with very high penetrating power, requiring thick lead or dense concrete to absorb it.'
  },
  {
    q: 'Identify the particle emitted during nuclear decay that leaves both the atomic number (Z) and mass number (A) of the parent nucleus unchanged.',
    answer: 'gamma',
    options: ['alpha', 'beta', 'gamma'],
    explanation: 'Gamma emission represents a transition of an excited nucleus to a lower energy state without releasing nucleons or altering charge.'
  },
  {
    q: 'Which of the following radioactive emissions is undeflected when passing through a uniform magnetic or electric field?',
    answer: 'gamma',
    options: ['alpha', 'beta', 'gamma'],
    explanation: 'Gamma rays carry zero electric charge and are uncharged electromagnetic photons, making them immune to electrostatic or magnetic force deflections.'
  },
  {
    q: 'State which type of particle emission increases the atomic number (Z) of the daughter nucleus by +1.',
    answer: 'beta',
    options: ['alpha', 'beta', 'positron'],
    explanation: 'In beta-minus emission, a neutron converts into a proton and an electron. The atomic number increases by 1 while the mass number remains constant.'
  },
  {
    q: 'Identify the process in which an inner-shell atomic electron is captured by the nucleus, converting a proton into a neutron.',
    answer: 'electron capture',
    options: ['alpha decay', 'beta decay', 'electron capture'],
    explanation: 'Electron capture occurs when a proton-rich nucleus absorbs an orbital inner-shell electron, reducing atomic number Z by 1 with no change in mass number A.'
  },
  {
    q: 'Comparing equal energy beams, state which radiation poses the greatest internal ionising risk if ingested or inhaled into living tissue.',
    answer: 'alpha',
    options: ['alpha', 'beta', 'gamma'],
    explanation: 'Internally, alpha particles deposit their large kinetic energy over extremely short distances due to high mass and charge, causing severe localized cell/DNA ionisation.'
  },
  {
    q: 'State which radiation exhibits moderate penetrating power and can be stopped by a 5 mm thick sheet of aluminium.',
    answer: 'beta',
    options: ['alpha', 'beta', 'gamma'],
    explanation: 'Beta particles consist of high-speed electrons with moderate penetration, requiring several millimetres of metals like aluminium to stop.'
  },
  {
    q: 'State the change in mass number (A) of a radioisotope following alpha emission.',
    answer: 'decreases by 4',
    options: ['decreases by 4', 'decreases by 2', 'remains constant'],
    explanation: 'An alpha particle is a helium nucleus containing 2 protons and 2 neutrons; emitting it removes 4 total nucleons from the mass number A.'
  }
];
