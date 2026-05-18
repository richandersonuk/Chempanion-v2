// src/data/howToGuides.jsx
import React from 'react';

export const howToGuides = {
  'formulas-ions': {
    title: 'Formulas from Ions (Unit 1.1)',
    steps: [
      'Identify the charges of the constituent ions using the Periodic Table groups or memorised polyatomic ions (e.g., SO₄²⁻, NH₄⁺).',
      'Cross-multiply the numerical value of the charges to find the subscript ratio needed to make the compound electrically neutral.',
      'Simplify the ratio to its lowest whole number terms if applicable (e.g., Ti²⁺ and O²⁻ becomes TiO, not Ti₂O₂).'
    ],
    pitfalls: 'WJEC Examiner Alert: Do NOT leave ionic charges visible in your final completed formula string. Writing Mg²⁺Cl₂⁻ instead of MgCl₂ will score zero marks.'
  },
  'formulas-name': {
    title: 'Formulas from Names (Unit 1.1)',
    steps: [
      'Extract the transition metal oxidation state directly from the Roman numeral in brackets (e.g., Iron(III) gives Fe³⁺).',
      'Examine the suffix: "-ide" indicates a single element monoatomic ion, while "-ate" or "-ite" denotes a polyatomic oxyanion.',
      'Balance the net charge vector safely to zero using small whole-number multipliers.'
    ],
    pitfalls: 'WJEC Examiner Alert: Always look out for complex compound groupings. Ensure brackets are wrapped completely around polyatomic ions if more than one is needed (e.g., Cu(NO₃)₂).'
  },
  'empirical-formula': {
    title: 'Empirical & Molecular Formulas (Unit 1.1)',
    steps: [
      'Divide each element mass or percentage by its Relative Atomic Mass (Ar) to determine raw molar amounts.',
      'Divide all calculated mole values by the absolute smallest value in the set to isolate the empirical integer ratio.',
      'For Molecular Formula: Find the formula mass of your empirical unit. Divide the true given Mr by this unit mass to establish your integer multiplier, then distribute it across the elements.',
      'For Water of Crystallisation (x): Subtract the remaining anhydrous residue mass from the initial hydrated crystal mass to find the mass of water lost. Find moles of the dry salt and moles of water independently, then calculate: x = Moles of H₂O / Moles of Salt.'
    ],
    pitfalls: 'WJEC Examiner Alert: Avoid rounding intermediate mole figures too early in your working space. Rounding values like 1.33 to 1.3 instead of recognizing a 4:3 fraction multiplier causes calculation trailing errors.'
  },
  'titration': {
    title: 'Acid-Base Titrations & Burette Practice (Unit 1.1)',
    steps: [
      'Burette Precision: When reading a meniscus vector diagram, evaluate the absolute lowest point of the curve. Record the value to exactly two decimal places, with the final digit always ending on a 0 or a 5.',
      'Data Table Concordance: Complete net titre gaps via (Final Volume − Initial Volume). Identify concordant trials that fall within a strict 0.10 cm³ boundary of each other. Calculate your mean titre using ONLY these concordant runs.',
      'Stoichiometric Processing: Use your verified mean titre with standard concentration formulas to find reacting moles. Note: If evaluating organic weak acids, use the question-provided Ka values; standard values like Kw must be sourced directly from your Data Booklet.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: 1) Inclusion of the Rough Titre in the mean calculation is an automatic zero. 2) Writing a burette reading as a single decimal place (e.g., 21.3 cm³ instead of 21.30 cm³) instantly triggers a precision penalty. 3) All volumetric glassware runs under a strict 50.00 cm³ physical capacity limit.'
  },
  'idealgas': {
    title: 'Ideal Gas Calculations (Unit 1.2)',
    steps: [
      'Write out the master equation framework: pV = nRT.',
      'Convert all data into strict SI base configurations: Pressure (p) must be in Pascals (Pa), Volume (V) must be in cubic metres (m³), and Temperature (T) must be in Kelvin (K).',
      'Rearrange the equation cleanly to isolate your target unknown parameter variable before processing calculations on your keypad.'
    ],
    pitfalls: 'WJEC Examiner Alert: Unit conversions trip up thousands of students. Remember: dm³ to m³ requires dividing by 10³ (×10⁻³), cm³ to m³ requires dividing by 10⁶ (×10⁻⁶), and °C to K requires adding 273.15.'
  },
  'thermometric': {
    title: 'Thermometric Titrations (Unit 2.1)',
    steps: [
      'Endpoint Extrapolation: Slide the main crosshair along the plot lines. As you approach the vertex, the graph paper grid automatically scales up to reveal 0.1 cm³ subdivisions. Identify the exact intersection where heating meets cooling.',
      'The Combined Mass Rule: To find heat energy via Q = mcΔT, your mass parameter (m) MUST represent the total combined volume of the mixture at the endpoint (Volume of Acid + Extrapolated Endpoint Volume of Alkali).',
      'Molar Enthalpy Scale: Source standard specific heat capacity (4.18 J g⁻¹ K⁻¹) and density constants directly from your Data Booklet. Evaluate Q in Joules, convert to kJ, and divide by the reacting moles of water to establish ΔH.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: This is a double-trap module! First, candidates routinely fail to combine the solution volumes for the mass parameter. Second, because the reaction causes a temperature rise, the process is exothermic—your final computed ΔH value must contain an explicit negative (−) sign and be rounded to exactly 3 significant figures.'
  },
  'redox': {
    title: 'Redox Titration Systems (Unit 3.1)',
    steps: [
      'Construct the full chemical process by combining individual reduction and oxidation half-equations.',
      'Ensure electron balancing is clean by multiplying half-equations so that all transferred electrons cancel out entirely.',
      'Identify your reacting mole ratio from the balanced full equation (e.g., 1 mole of MnO₄⁻ reacts with 5 moles of Fe²⁺).'
    ],
    pitfalls: 'WJEC Examiner Alert: Never assume a standard 1:1 reacting layout context. Transition metal redox systems feature unique fluctuating oxidation state shifts.'
  },
  'enthalpy': {
    title: 'Enthalpy of Combustion (Unit 3.4)',
    steps: [
      'Determine heat energy absorbed by the water using Q = mcΔT (where m is the mass of water, NOT the fuel).',
      'Calculate the moles of fuel chemical burnt (mass / Mr).',
      'Calculate the molar enthalpy parameter: ΔH = −Q / (moles × 1000) to express the final value in kJ mol⁻¹.'
    ],
    pitfalls: 'WJEC Examiner Alert: Do not forget the sign convention. Combustion reactions are exothermic, meaning your final recorded ΔH entry MUST display an explicit negative (−) sign.'
  },
  'entropy-gibbs': {
    title: 'Entropy & Gibbs Free Energy (Unit 3.4)',
    steps: [
      'Calculate standard changes: ΔS = ΣS°(products) − ΣS°(reactants).',
      'Use Gibbs equation layout profiles: ΔG = ΔH − TΔS.',
      'A process becomes thermodynamically feasible at the exact threshold where ΔG ≤ 0.'
    ],
    pitfalls: 'WJEC Examiner Alert: Unit incompatibility is a persistent issue. Enthalpy (ΔH) is given in kJ mol⁻¹, but Entropy (ΔS) is recorded in J K⁻¹ mol⁻¹. You MUST divide your ΔS value by 1000 before substituting it into the Gibbs formula.'
  },
  'rates': {
    title: 'Reaction Rates & Arrhenius Constraints (Unit 3.5)',
    steps: [
      'Deduce reaction orders by comparing concentration changes against initial rate fluctuations across test trials.',
      'Construct the master expression: Rate = k[A]ˣ[B]ʸ.',
      'To establish Arrhenius parameters, convert data into logarithmic trends using: ln(k) = −Ea/R(1/T) + ln(A).'
    ],
    pitfalls: 'WJEC Examiner Alert: Working out units for the rate constant (k) requires full mathematical algebraic substitution and canceling. Always simplify your powers fully.'
  },
  'kc-calc': {
    title: 'Kc Equilibrium Constants (Unit 3.8)',
    steps: [
      'Construct an ICE data matrix: Initial Moles, Change in Moles, Equilibrium Moles.',
      'Convert equilibrium moles back to concentrations by dividing every component value by the container volume (dm³).',
      'Assemble the constant fraction: Kc = [Products] / [Reactants], applying stoic coefficients as exponent powers.'
    ],
    pitfalls: 'WJEC Examiner Alert: Forgetting to divide equilibrium moles by the system volume is a frequent error. This step is only mathematically skippable if there are equal moles of gas on both sides of the equilibrium line.'
  },
  'kp-calc': {
    title: 'Kp Equilibrium Constants (Unit 3.8)',
    steps: [
      'Calculate total gas moles present in the system container.',
      'Find individual mole fractions: x(A) = Moles of A / Total Moles.',
      'Determine partial pressures: p(A) = x(A) × Total Pressure.',
      'Substitute values into the Kp expression using rounded parenthetical notation (p(Products)), not square concentration brackets.'
    ],
    pitfalls: 'WJEC Examiner Alert: Never use square brackets [] inside a Kp expression. Square brackets explicitly denote concentration in mol dm⁻³. Using them here violates sign notation rules and will result in lost marks.'
  },
  'acids': {
    title: 'pH & Weak Acid Equilibriums (Unit 3.9)',
    steps: [
      'Strong Acids: Fully dissociate, meaning [H⁺] = Acid Concentration. Use: pH = −log₁₀[H⁺].',
      'Weak Acids: Partially dissociate. Use the simplified approximation: [H⁺] = √(Ka × c) before calculating the negative logarithm.',
      'Conversions: Convert pKa back to Ka using Ka = 10^(−pKa).'
    ],
    pitfalls: 'WJEC Examiner Alert: Enforce logarithmic notation formatting conventions. All calculated pH and pKa parameters MUST be written to exactly two decimal places, even if it ends in a trailing zero (e.g., write 4.00, not 4).'
  },
  'buffers': {
    title: 'Buffer Solutions (Unit 3.9)',
    steps: [
      'Identify the weak acid molecule component and its conjugate base salt component.',
      'If a small portion of strong alkali or acid is added, calculate the updated adjusted mole statistics before applying equilibrium checks.',
      'Substitute values into the rearranged weak acid equilibrium expression: [H⁺] = Ka × ([Acid] / [Base]).'
    ],
    pitfalls: 'WJEC Examiner Alert: Always work in absolute chemical amounts (moles) when assessing neutralizing shifts before running final volume concentrations.'
  },
  'cell-potentials': {
    title: 'Cell Potentials & Diagrams (Unit 4.1)',
    steps: [
      'Standard EMF Calculation: Identify the cathode (the more positive reduction potential) and anode (the more negative reduction potential). Evaluate overall cell voltage via: E°cell = E°(cathode) − E°(anode).',
      'Conventional Cell Notation: Map the anode/oxidation transition on the extreme left and the cathode/reduction transition on the extreme right, separated by a double vertical line (||) representing the salt bridge. Use phase boundary bars (|) between different states.',
      'Inert Electrodes & Shifts: If a half-cell consists entirely of aqueous ions or gases, you must include an inert Pt(s) electrode on that boundary outer edge. Use Le Chatelier principles to predict non-standard potential shifts.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: 1) The Multiplier Trap: Never multiply a half-cell E° value by stoichiometric coefficients when balancing electron transfers—E° is an intensive property. 2) Formatting: All cell potentials must explicitly state their sign (+ or −) and be formatted to exactly 2 decimal places (e.g., +1.10 V).'
  },
  'chiral-centers': {
    title: 'Chiral Center Identification (Unit 4.1)',
    steps: [
      'Four Single Bonds Rule: Focus only on tetrahedral carbon atoms that possess four single covalent bonds. Instantly disregard any planar sp² hybridised carbons, such as carbonyl groups (C=O), alkenes (C=C), or delocalised aromatic benzene ring structures.',
      'Account for Implicit Hydrogens: In skeletal structural layouts, remember that unwritten valencies on carbon nodes represent hidden hydrogen atoms (-H). If a junction node displays three visible structural bonds, it holds exactly one implicit hydrogen.',
      'Audit Branches Sequentially: Trace outwards along every attached group atom-by-atom. If any two pathways match identically all the way to the absolute end of their respective chains (such as two identical ethyl groups), the carbon is symmetrical and achiral.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: 1) The Hydrocarbon Blindspot: Candidates frequently miss chirality in purely hydrocarbon molecules (like 3-methylhexane) because they look for heteroatoms (like O, N, or Cl) instead of auditing differing branch lengths. 2) The Symmetry Trap: Central nodes (like pentan-3-ol) are commonly guessed incorrectly because students assume any branch hub is asymmetric without realizing that identical flanking chains disqualify the spot.'
  }

};
