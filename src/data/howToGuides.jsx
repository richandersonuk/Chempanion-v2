import React from 'react';

export const howToGuides = {
  // =========================================================================
  // UNIT 1: QUANTITATIVE REAGENT BASICS
  // =========================================================================
  'formulas-ions': {
    title: 'Formulas from Ions (Unit 1.1)',
    generalSteps: [
      'Locate element groups on your WJEC Periodic Table to predict standard valency boundaries.',
      'Construct a balance sheet equating total positive charges to total negative charges.'
    ],
    subModes: {
      'simple': [
        'Identify Group numbers: Group 1 forms 1+ ions, Group 2 forms 2+ ions, Group 6 forms 2- ions, and Group 7 forms 1- ions.',
        'Cross-multiply the charges to determine the relative subscripts required for electrical neutrality.',
        'Simplify the integer subscripts to their lowest empirical terms (e.g., Ti2+ and O2- simplify to TiO).'
      ]
    },
    examTips: [
      'Marks are strictly withheld if ionic symbols remain visible in the finished formula string (e.g., writing Na+Cl- instead of NaCl will score 0 marks).',
      'The suffixes are absolute indicators: "-ide" means a monoatomic element anion, while "-ate" or "-ite" signals an oxygen-rich polyatomic group.'
    ],
    pitfalls: 'WJEC Examiner Alert: Do NOT leave ionic charges visible in your final completed formula string. Writing Mg2+Cl2- instead of MgCl2 will score zero marks.'
  },

  'formulas-name': {
    title: 'Formulas from Names (Unit 1.1)',
    generalSteps: [
      'Isolate the full systemic name parts into distinct metric ion groupings.',
      'Check if transition oxidation barriers apply via embedded parenthetical labels.'
    ],
    subModes: {
      'simple': [
        'Extract the core metal atom symbol from the first word and determine its charge via its periodic group entry.',
        'Evaluate the matching terminal non-metal suffix string to deduce monoatomic vs polyatomic behavior.'
      ]
    },
    examTips: [
      'Roman numerals in parentheses always dictate the positive oxidation charge state of variable transition metals, never the subscript count.',
      'Parentheses are mandatory when a polyatomic oxyanion multiplier exceeds 1 (e.g., Cu(NO3)2).'
    ],
    pitfalls: 'WJEC Examiner Alert: Always look out for complex compound groupings. Ensure brackets are wrapped completely around polyatomic ions if more than one is needed (e.g., Cu(NO3)2).'
  },

  'formula-master': {
    title: 'Ions from compounds (Unit 1.1)',
    generalSteps: [
      'Analyze the given prompt target to split it cleanly into its positive Cation and negative Anion components.',
      'Remember that charges must reflect actual chemical species, not arbitrary mathematical states.'
    ],
    subModes: {
      'ions-from-formula-gcse': [
        'Identify the metal symbol on the left and the non-metal on the right.',
        'Reverse-map charges based on periodic table group locations (e.g., NaCl splits into Na(+) and Cl(-)).'
      ],
      'ions-from-formula-advanced': [
        'Look out for complex polyatomic blocks encapsulated in brackets or combined as oxyanions.',
        'Use the subscripts outside brackets to deduce transition metal charges (e.g., Fe2(SO4)3 implies Fe(3+) and SO4(2-)).'
      ],
      'ions-from-name-gcse': [
        'Convert the systematic names straight into their corresponding chemical element representations.',
        'Assign standard fixed valence charges (+1 for Group 1, +2 for Group 2, -2 for Group 6, -1 for Group 7).'
      ],
      'ions-from-name-advanced': [
        'Extract variable oxidation numbers directly from the listed Roman numerals to find transition charges.',
        'Recall memorised polyatomic identities (Ammonium = NH4(+), Sulfate = SO4(2-), Nitrate = NO3(-), Carbonate = CO3(2-), Hydroxide = OH(-), Phosphate = PO4(3-)).'
      ]
    },
    examTips: [
      'WJEC Case Penalty: Element symbols must be formatted with strict capitalization patterns. Writing "na" instead of "Na" or "so4" instead of "SO4" will cause answers to be rejected instantly.',
      'When deconstructing formulas into individual free ions, the subscripts transform completely into large balancing stoichiometric coefficients positioned before the ion symbol (e.g., Cl2 becomes 2Cl(-)).'
    ],
    pitfalls: 'WJEC Examiner Alert: This module enforces strict structural symbol validation rules. You must apply precise chemical element case capitalization.'
  },

  'empirical-formula': {
    title: 'Empirical & Molecular Formulas (Unit 1.1)',
    generalSteps: [
      'Tabulate every active component element mass or composition percentage value.',
      'Establish raw operational chemical amounts via relative atomic mass metrics.'
    ],
    subModes: {
      'simple': [
        'Divide each given percentage or mass value by its relative atomic mass (Ar) to find the raw moles.',
        'Divide all resulting values by the smallest molar figure calculated to yield the empirical whole-number ratio.',
        'Isolate Molecular Formulas: Divide the actual given total relative molecular mass (Mr) by your empirical unit mass to determine your scaling integer scalar multiplier.'
      ]
    },
    examTips: [
      'Intermediate decimal fractions around 0.33, 0.50, or 0.66 signal the presence of strict fraction multipliers. Multiply the entire row by 3 or 2 to scale them cleanly into whole numbers rather than rounding prematurely.',
      'For Water of Crystallisation problems, always track the dry anhydrous salt residue moles independently from the mass difference of the water vaporized.'
    ],
    pitfalls: 'WJEC Examiner Alert: Avoid rounding intermediate mole figures too early in your working space. Rounding values like 1.33 to 1.3 instead of recognizing a 4:3 fraction multiplier causes calculation trailing errors.'
  },

  'titration': {
    title: 'Acid-Base Titrations & Burette Practice (Unit 1.1)',
    generalSteps: [
      'Audit volume parameters using strict glassware verification rules.',
      'Link reacting concentrations securely via balanced multi-step stoichiometric calculations.'
    ],
    subModes: {
      'simple': [
        'Burette Readings: Read the liquid curve from the absolute bottom of the meniscus at eye level.',
        'Identify and select concordant trials that fall within a tight 0.10 cm3 window of each other.',
        'Calculate your definitive mean titre using exclusively those concordant runs.'
      ]
    },
    examTips: [
      'Burette measurements must always be recorded to exactly two decimal places, with the terminal digit ending strictly on a 0 or a 5 (e.g., 24.30 cm3). Single decimal place listings trigger immediate precision point deductions.',
      'Never include the rough pilot trial inside your active mean calculations. It serves strictly as an operational baseline.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: 1) Inclusion of the Rough Titre in the mean calculation is an automatic zero. 2) Writing a burette reading as a single decimal place instantly triggers a precision penalty.'
  },

  'idealgas': {
    title: 'Ideal Gas Calculations (Unit 1.2)',
    generalSteps: [
      'State the universal equation layout: pV = nRT.',
      'Isolate your target unknown variable parameter cleanly before evaluating values.'
    ],
    subModes: {
      'simple': [
        'Convert pressure variables into strict Pascals (Pa).',
        'Convert volume dimensions directly into cubic meters (m3).',
        'Convert temperatures into absolute Kelvin (K) scaling matrices.'
      ]
    },
    examTips: [
      'Volume conversions are major tracking tripwires: to map dm3 to m3, multiply by 0.001; to map cm3 to m3, multiply by 0.000001.',
      'The gas constant R (8.314 J K-1 mol-1) requires temperature values to be shifted using +273.15 from standard Celsius scales.'
    ],
    pitfalls: 'WJEC Examiner Alert: Unit conversions trip up thousands of students. Remember: dm3 to m3 requires dividing by 103, cm3 to m3 requires dividing by 106, and oC to K requires adding 273.15.'
  },

  // =========================================================================
  // UNIT 2: PHYSICAL CORE & ORGANIC PATHWAYS
  // =========================================================================
  'thermometric': {
    title: 'Thermometric Titrations (Unit 2.1)',
    generalSteps: [
      'Locate vertex boundaries using graphical crosshair extrapolations.',
      'Calculate thermodynamic energy parameters using accurate specific heat parameters.'
    ],
    subModes: {
      'simple': [
        'Slide coordinates along cooling and heating curves to establish their exact point of intersection.',
        'Compute overall heat generation via Q = mcΔT, where mass (m) is the combined fluid volume.',
        'Divide total energy (kJ) by the limiting factor moles to yield definitive ΔH parameters.'
      ]
    },
    examTips: [
      'The mass variable (m) in Q = mcΔT must represent the total combined volume of both reactants inside the calorimeter cup at the true neutralized endpoint.',
      'Because a physical temperature rise indicates an exothermic pathway, your calculated structural ΔH value must display an explicit negative (-) sign to score full marks.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: This is a double-trap module! First, candidates routinely fail to combine the solution volumes for the mass parameter. Second, because the reaction causes a temperature rise, the process is exothermic—your final computed ΔH value must contain an explicit negative (-) sign.'
  },

  'mechanisms-unit2': {
    title: 'AS Organic Mechanisms (Unit 2.5)',
    generalSteps: [
      'Assign permanent reagent dipoles based on local atomic electronegativity parameters.',
      'Map structural electron pairs from high-density sources straight to electrophilic centers.'
    ],
    subModes: {
      'simple': [
        'Identify dipole boundaries across simple linear haloalkane structures.',
        'Model generic nucleophilic substitutions by launching arrows from basic nucleophiles directly onto polar carbon nodes.'
      ]
    },
    examTips: [
      'In electrophilic additions involving alkenes, the initial arrow must start directly from the high electron density region of the C=C double bond (the pi-cloud) and point straight to the electrophilic H atom carrying the partial positive charge.',
      'When an asymmetric alkene (e.g., Propene) undergoes addition, map your route to generate the more stable secondary or tertiary carbocation intermediate over the primary alternative (Markovnikov Rule).'
    ],
    pitfalls: 'WJEC Examiner Alert: Never draw the arrow originating from individual carbon atoms during the alkene step—the electrons reside inside the shared pi-cloud.'
  },

  // =========================================================================
  // UNIT 3: INORGANIC SYSTEMS & KINETICS
  // =========================================================================
  'redox': {
    title: 'Redox Titration Systems (Unit 3.1)',
    generalSteps: [
      'Analyze half-cell parameters to build comprehensive balanced chemical summaries.',
      'Track stoichiometric changes using oxidation state shifts.'
    ],
    subModes: {
      'simple': [
        'Multiply individual half-equations until overall electron counts match identically.',
        'Combine equations together, canceling out all active electron instances completely.',
        'Deduce the clear structural reacting molar ratio tracking parameters from the resulting stoichiometry.'
      ]
    },
    examTips: [
      'Never assume a standard 1:1 reacting ratio for redox systems. Manganate(VII) and dichromate(VI) titrations consistently exhibit unique non-unity stoichiometric profiles.',
      'Ensure acid conditions (H+ species and corresponding water molecules) are properly balanced across both sides of your final net equation.'
    ],
    pitfalls: 'WJEC Examiner Alert: Never assume a standard 1:1 reacting layout context. Transition metal redox systems feature unique fluctuating oxidation state shifts.'
  },

  'enthalpy': {
    title: 'Enthalpy of Combustion (Unit 3.4)',
    generalSteps: [
      'Evaluate energy shifts within the calorimeter shell via standard boundary equations.',
      'Normalize energy metrics against absolute consumed fuel values.'
    ],
    subModes: {
      'simple': [
        'Calculate overall heat changes via Q = mcΔT, using the mass parameters of the water container.',
        'Deduce absolute consumed fuel moles via mass / Mr.',
        'Convert raw heat metrics to kJ and divide by the fuel moles to capture molar parameters.'
      ]
    },
    examTips: [
      'When calculating Q = mcΔT, the mass parameter (m) refers strictly to the mass of the liquid water being heated in the copper can, never the mass of the burner or the fuel consumed.',
      'Combustion reactions are fundamentally exothermic—always confirm your final numerical ΔH metric features an explicit negative (-) sign.'
    ],
    pitfalls: 'WJEC Examiner Alert: Do not forget the sign convention. Combustion reactions are exothermic, meaning your final recorded ΔH entry MUST display an explicit negative (−) sign.'
  },

  'entropy-gibbs': {
    title: 'Entropy & Gibbs Free Energy (Unit 3.4)',
    generalSteps: [
      'Deduce systemic disorder limits across comprehensive chemical equations.',
      'Check structural feasibility values across variable thermal conditions.'
    ],
    subModes: {
      'simple': [
        'Compute systemic changes via ΔS = S°(products) - S°(reactants).',
        'Substitute values into the Gibbs free energy expression: ΔG = ΔH - TΔS.',
        'Identify transition thresholds where reactions become spontaneous (ΔG <= 0).'
      ]
    },
    examTips: [
      'Unit mismatch is a common pitfall: Enthalpy (ΔH) is given in kJ mol-1, but Entropy (ΔS) is reported in J K-1 mol-1. You must divide your ΔS value by 1000 before substituting it into the Gibbs equation.',
      'To calculate the minimum temperature threshold for feasibility, set ΔG = 0 and rearrange to solve for temperature: T = ΔH / ΔS.'
    ],
    pitfalls: 'WJEC Examiner Alert: Unit incompatibility is a persistent issue. Enthalpy is given in kJ mol-1, but Entropy is recorded in J K-1 mol-1. You MUST divide your ΔS value by 1000 before substituting it into the Gibbs formula.'
  },

  'rates': {
    title: 'Reaction Rates & Arrhenius Constraints (Unit 3.5)',
    generalSteps: [
      'Analyze experimental data metrics to build accurate operational rate equations.',
      'Track rate constant dependency shifts relative to absolute thermal values.'
    ],
    subModes: {
      'simple': [
        'Deduce component reaction orders by tracking initial rate velocity changes across distinct trials.',
        'Isolate individual rate constant variables (k) by substituting concentration data.',
        'Map logarithmic Arrhenius systems via: ln(k) = -Ea/R(1/T) + ln(A) equations.'
      ]
    },
    examTips: [
      'When deducing the overall units for a rate constant k, substitute concentration units (mol dm-3) directly into your rearranged rate equation and systematically cancel them out.',
      'The gradient of an Arrhenius graph (ln(k) vs 1/T) equals -Ea/R. Multiply your calculated gradient by -R (-8.314) to isolate Ea directly in J mol-1, then divide by 1000 to express it in the standard unit of kJ mol-1.'
    ],
    pitfalls: 'WJEC Examiner Alert: Working out units for the rate constant requires full mathematical algebraic substitution and canceling.'
  },

  'kc-calc': {
    title: 'Kc Equilibrium Constants (Unit 3.8)',
    generalSteps: [
      'Track multi-component dynamic concentration states inside equilibrium mixtures.',
      'Build comprehensive molar concentration fractions from balanced stoichiometry.'
    ],
    subModes: {
      'simple': [
        'Map concentration profiles using structured Initial, Change, Equilibrium (ICE) tables.',
        'Convert equilibrium mole quantities into true concentration values by dividing by the absolute system volume (dm3).',
        'Calculate the final constant using: Kc = [Products]^x / [Reactants]^y.'
      ]
    },
    examTips: [
      'Always remember to divide your equilibrium moles by the total container volume (dm3) to convert them into concentration values before plugging them into the Kc expression. Skipping this step is only valid if the total number of gas moles is identical on both sides of the balanced equation.',
      'Square brackets [ ] must be used in your written Kc expressions; they explicitly denote concentration in mol dm-3.'
    ],
    pitfalls: 'WJEC Examiner Alert: Forgetting to divide equilibrium moles by the system volume is a frequent error.'
  },

  'kp-calc': {
    title: 'Kp Equilibrium Constants (Unit 3.8)',
    generalSteps: [
      'Track individual gas partial pressures in closed system setups.',
      'Relate component mole metrics directly to overall pressure properties.'
    ],
    subModes: {
      'simple': [
        'Calculate the total gas moles present at equilibrium across all active species.',
        'Determine individual component mole fractions: x(A) = moles of A / total gas moles.',
        'Compute partial pressures using: p(A) = x(A) * P_total.',
        'Substitute these values into your Kp expression using standard parenthetical notation.'
      ]
    },
    examTips: [
      'Never use square brackets [ ] when writing a Kp expression. Square brackets represent concentration (mol dm-3). Instead, use standard curved parentheses enclosing the lower-case partial pressure symbol p (e.g., (pNH3)^2).',
      'Total pressure parameters must use matching units (kPa, Pa, or atm) throughout the entire fraction layout.'
    ],
    pitfalls: 'WJEC Examiner Alert: Never use square brackets inside a Kp expression. Square brackets explicitly denote concentration in mol dm-3.'
  },

  'acids': {
    title: 'pH & Weak Acid Equilibriums (Unit 3.9)',
    generalSteps: [
      'Analyze hydrogen ion concentrations across variable dissociation networks.',
      'Process logarithmic structural parameters onto uniform linear scales.'
    ],
    subModes: {
      'simple': [
        'For Strong Acids: Set [H+] = Acid Concentration, then calculate pH = -log10[H+].',
        'For Weak Acids: Apply approximations to solve via [H+] = √(Ka * c).'
      ]
    },
    examTips: [
      'WJEC Precision Mandate: All calculated pH and pKa values must be reported to exactly two decimal places in your final answers, even if it results in trailing zeros (e.g., write 4.00, never just 4).',
      'When working backward from a given pH to find the hydrogen ion concentration, use the inverse log relationship: [H+] = 10^-pH.'
    ],
    pitfalls: 'WJEC Examiner Alert: Enforce logarithmic notation formatting conventions. All calculated pH and pKa parameters MUST be written to exactly two decimal places.'
  },

  'buffers': {
    title: 'Buffer Solutions (Unit 3.9)',
    generalSteps: [
      'Identify paired weak conjugate species inside resilient chemical matrices.',
      'Track composition adjustments when stress factors challenge the equilibrium.'
    ],
    subModes: {
      'simple': [
        'Identify the exact mole reservoirs for both the weak acid component and its conjugate salt base.',
        'Calculate stoichiometric updates if a portion of strong acid (H+) or base (OH-) is introduced.',
        'Substitute the updated values into the weak acid expression: [H+] = Ka * ([Acid] / [Base]).'
      ]
    },
    examTips: [
      'When strong acid or alkali is added to a buffer system, perform all neutralisation calculations in moles first. Update your acid and salt moles before calculating final concentrations or volume ratios.',
      'Adding small amounts of acid increases the component [Acid] concentration and decreases the conjugate [Base] salt concentration by that exact molar increment.'
    ],
    pitfalls: 'WJEC Examiner Alert: Always work in absolute chemical amounts (moles) when assessing neutralizing shifts before running final volume concentrations.'
  },

  // =========================================================================
  // UNIT 4: ORGANIC SYNTHESIS & ANALYSIS
  // =========================================================================
  'cell-potentials': {
    title: 'Cell Potentials & Diagrams (Unit 4.1)',
    generalSteps: [
      'Determine boundary voltage variances across paired half-cell networks.',
      'Map structural layout designs according to standard international IUPAC rules.'
    ],
    subModes: {
      'simple': [
        'Identify the cathode (more positive reduction value) and anode (more negative reduction value).',
        'Compute standard voltages via: E°cell = E°cathode - E°anode.',
        'Map phase structures from left-to-right following standard chemical notation layout rules.'
      ]
    },
    examTips: [
      'Never multiply an individual half-cell electrode potential value (E°) by stoichiometric coefficients when balancing electrons-E° is an intensive property and remains constant.',
      'A double vertical line represents the salt bridge. The oxidized species must always be written on the inner side of this bridge line for both half-cells.',
      'Always include the physical sign (+ or -) along with the unit symbol (V) in your final recorded cell potential answers.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: 1) The Multiplier Trap: Never multiply a half-cell E° value by stoichiometric coefficients. 2) Formatting: All cell potentials must explicitly state their sign.'
  },

  'mechanisms-masterclass': {
    title: 'Nucleophilic Addition Mechanisms (Unit 4.4)',
    generalSteps: [
      'Map structural dipoles over planar unsaturated groups.',
      'Model nucleophilic pathways by tracing matching pairs of electrons.'
    ],
    subModes: {
      'simple': [
        'Identify the induced dipole across the central carbonyl double bond.',
        'Trace the initial nucleophilic attack path from the lone pair straight onto the partially positive carbon node.'
      ]
    },
    examTips: [
      'The curly arrow must originate directly from an explicit electron pair (either a visible lone pair •• or a negative charge bond line) on the nucleophile. Arrows starting from empty space or element symbols score zero.',
      'Ensure the arrowhead points directly onto the target atom center. For the second step of the mechanism, show the arrow originating from the intermediate oxygen lone pair and targeting the incoming electrophilic proton (H+).'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: 1) Drawing curly arrows coming from abstract empty space results in an immediate loss of markings. 2) Never label the entire starting molecule as planar.'
  },

  'chiral-centers': {
    title: 'Chiral Center Identification (Unit 4.1)',
    generalSteps: [
      'Audit structural branching vectors inside carbon skeletons.',
      'Locate points of total asymmetric layout configuration.'
    ],
    subModes: {
      'simple': [
        'Scan for carbon nodes containing exactly four single covalent bonds.',
        'Disregard any planar sp2 centers (like alkenes or carbonyls) immediately.',
        'Trace outwards along every attached branch to confirm path asymmetry.'
      ]
    },
    examTips: [
      'Always account for implicit hydrogen atoms in skeletal structural drawings. If an internal node has three visible bonds, it holds exactly one implicit hydrogen atom.',
      'Trace outward along every attached group atom-by-atom. If any two pathways match workloads identically all the way to the end of the chain, the center is symmetrical and achiral.'
    ],
    pitfalls: 'WJEC Examiner Pitfalls: 1) The Hydrocarbon Blindspot: Candidates frequently miss chirality in purely hydrocarbon molecules. 2) The Symmetry Trap: Central nodes are commonly guessed incorrectly.'
  }
};
