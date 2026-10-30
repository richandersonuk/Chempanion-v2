import React from 'react';

export const howToGuides = {
  'formulas-ions': {
    title: "Formulas from Ions",
    appletUsage: <>Review the target cation and anion displayed in the workspace cards. Deduce the lowest common multiple of their charges, calculate the stoichiometric coefficients needed for a net-neutral compound, type the resulting formula, and click 'Check Balance'.</>,
    examApplication: <>Essential for WJEC Unit 1 questions requiring balanced ionic equations for precipitation or neutralisation. Mastering empirical formulas guarantees that your subsequent stoichiometry and mandatory state symbols remain valid for full marks.</>,
    pitfalls: <>Never leave ion charges in your final compound formula (e.g., writing Na<sup>+</sup>Cl<sup>-</sup> instead of NaCl is a severe notation error). Always enclose polyatomic units in brackets if their multiplier is greater than 1, such as Mg(NO<sub>3</sub>)<sub>2</sub>. When writing full equations, missing state symbols (s, l, g, aq) will immediately cost you the final mark.</>
  },

  'formulas-name': {
    title: "Formulas from Names",
    appletUsage: <>Read the randomized IUPAC systematic chemical name. Identify the exact oxidation states denoted by the Roman numerals, establish the charge profiles of the constituent elements or polyatomic groups, and type the neutral empirical formula.</>,
    examApplication: <>WJEC past papers frequently use systematic nomenclature like iron(III) sulfate or potassium manganate(VII). You must instantly translate these into correct formulas to calculate accurate relative formula masses (M<sub>r</sub>) or set up structured reacting mass calculations.</>,
    pitfalls: <>A high-frequency error is confusing the Roman numeral oxidation state with an absolute subscript ratio. For example, iron(III) oxide means Fe<sup>3+</sup> ions combining with O<sup>2-</sup> ions to form Fe<sub>2</sub>O<sub>3</sub>, not Fe<sub>3</sub>O<sub>2</sub>.</>
  },

  'formula-master': {
    title: "Ion Formulas from Compounds",
    appletUsage: <>Examine the generated compound formula. Perform a reverse structural operation by splitting the compound back into its free, constituent cations and anions. Input the exact numbers and charges of the isolated ions.</>,
    examApplication: <>This muscle memory directly maps to writing ionic half-equations for Unit 3.1 electrochemistry and constructing precise ionic equations for Unit 3.9 buffer systems, where you must successfully eliminate spectator ions to reveal the core reacting species.</>,
    pitfalls: <>When a subscript belongs to a polyatomic framework, never break it apart into atomic components. Dissolving a sulfate releases intact SO<sub>4</sub><sup>2-</sup> polyatomic units, never isolated sulfur or oxide ions.</>
  },

  'empirical-formula': {
    title: "Empirical & Molecular Formulas",
    appletUsage: <>Read the randomized percentage composition or mass dataset. Use the calculation workspace to convert raw values into relative molar ratios (dividing by A<sub>r</sub>), determine the simplest whole-number empirical matrix, and scale up using the molar mass.</>,
    examApplication: <>Mimics multi-mark structured calculations in WJEC Unit 1. Examiners explicitly look for a clear mathematical layout (Mass &rarr; Moles &rarr; Ratio). Setting out intermediate steps clearly secures "error carried forward" (ECF) marks even if your final ratio is slightly off.</>,
    pitfalls: <>Premature rounding of intermediate decimal values will warp your final integer ratio. Keep all raw values stored in your calculator memory until the final step. Always explicitly state the final formula at the end of your working.</>
  },

  'titration': {
    title: "Acid-Base Titrations",
    appletUsage: <>Examine the volumetric titration parameters. Calculate the moles of the standard solution, apply the stoichiometric ratio from the balanced neutralization equation, and evaluate the concentration of the unknown sample.</>,
    examApplication: <>Simulates standard WJEC structured titration calculations. You must determine reacting chemical quantities and frequently scale volumetric values between 25.0 cm<sup>3</sup> pipetted aliquots and 250 cm<sup>3</sup> volumetric flasks.</>,
    pitfalls: <>Failing to convert titration volumes from cm<sup>3</sup> to dm<sup>3</sup> (by dividing by 1000) when calculating concentration is a guaranteed dropped mark. Always double-check that your titre values are concordant (within 0.10 cm<sup>3</sup>) if selecting raw data from a table.</>
  },

  'idealgas': {
    title: "Ideal Gas Calculations",
    appletUsage: <>Identify the unknown variable in the ideal gas equation (pV = nRT). Perform strict unit conversions for the randomized temperature, pressure, and volume metrics, rearrange the algebraic expression, and solve.</>,
    examApplication: <>WJEC thoroughly tests your ability to process non-SI units before evaluating gas volumes or calculating the relative molecular mass (M<sub>r</sub>) of volatile liquids in Unit 1.</>,
    pitfalls: <>Unit mismatches are the primary reason for dropped grades here. You must systematically convert pressure from kPa to Pa (&times; 10<sup>3</sup>), volume from cm<sup>3</sup> or dm<sup>3</sup> to m<sup>3</sup> (&times; 10<sup>-6</sup> or &times; 10<sup>-3</sup>), and temperature from &deg;C to Kelvin (+273).</>
  },

  'mechanisms-unit2': {
    title: "AS Organic Mechanisms",
    appletUsage: <>Observe the interactive organic structure, identifying specific electron-dense regions (like C=C bonds) or partial dipoles (δ+ / δ-). Map the electron pair movement by drawing curly arrows from electron donors to exact electrophilic acceptors.</>,
    examApplication: <>Tests the precise structural drawing required for electrophilic additions to alkenes or nucleophilic substitutions on halogenoalkanes—staple multi-mark questions in WJEC Unit 2.5.</>,
    pitfalls: <>WJEC examiners heavily penalize "floating" or ambiguous arrows. Your curly arrow must start precisely from an explicit lone pair or the center of a covalent bond, and point directly to the exact atom forming the new bond. Missing dipoles (δ+ / δ-) will also cost marks.</>
  },

  'thermometric': {
    title: "Thermometric Titrations",
    appletUsage: <>Interact with the temperature vs. volume plot. Extrapolate the lines of best fit to pinpoint the equivalence point intersection, extract the maximum neutralisation volume and ΔT, and calculate the enthalpy change using Q = mcΔT.</>,
    examApplication: <>Matches practical exam styles in Unit 2 and Unit 5. You must process raw thermal data and present a structured mathematical layout to deduce specific heat absorption and molar enthalpy changes.</>,
    pitfalls: <>When calculating reacting mass (m) for Q = mcΔT, you must use the <em>total combined volume</em> of both the acid and the base solutions mixed together. Never use just the volume of the limiting reactant. Ensure the final enthalpy change (ΔH) includes a negative sign for exothermic neutralisations.</>
  },

  'redox': {
    title: "Redox Titrations",
    appletUsage: <>Read the concentration data for standard oxidising agents like potassium manganate(VII). Apply the half-equation stoichiometry ratios to determine the mass or concentration of transition metal elements like iron(II).</>,
    examApplication: <>Addresses advanced multi-step calculation pathways in Unit 3. It tests your ability to link mole values across varying oxidation states, utilizing back-titration data and strict structured steps to secure ECF marks.</>,
    pitfalls: <>Always extract the exact stoichiometry from the combined redox equation. The reacting ratio of MnO<sub>4</sub><sup>-</sup> to Fe<sup>2+</sup> is 1:5; failing to multiply your standard moles by 5 is the most common error cited in examiner reports.</>
  },

  'cell-potentials': {
    title: "Standard Cell Potentials",
    appletUsage: <>Review the standard reduction potentials (E<sup>θ</sup>) assigned to randomized half-cells. Identify the most positive E<sup>θ</sup> as the strongest oxidising agent (cathode), reverse the sign of the other half-cell (anode), and calculate the standard cell EMF.</>,
    examApplication: <>Directly prepares you for WJEC Unit 3 electrochemical calculations. You will need to determine cell voltages, predict the thermodynamic feasibility of reactions, and construct conventional cell diagrams.</>,
    pitfalls: <>Never multiply the E<sup>θ</sup> value of a half-cell when balancing the electron stoichiometry of an overall redox equation. E<sup>θ</sup> is an intensive property and remains completely constant regardless of the reacting mole ratios.</>
  },

  'enthalpy': {
    title: "Enthalpy of Combustion",
    appletUsage: <>Process experimental calorimetry variables. Calculate the heat transferred using Q = mcΔT, determine the moles of fuel combusted from mass changes, and divide Q by moles to find the standard enthalpy change of combustion (ΔH<sub>c</sub>).</>,
    examApplication: <>Applies directly to Unit 2 energetics. You must demonstrate clear mathematical steps processing raw laboratory data to construct Hess's Law cycles and deduce standard enthalpy changes.</>,
    pitfalls: <>Examiners strictly require precise terminology: use "enthalpy change", never "heat energy". Furthermore, exothermic combustion reactions must explicitly display a negative sign (-) in the final answer, and standard state symbols must be present in any requested Hess cycle equations.</>
  },

  'entropy-gibbs': {
    title: "Entropy & Gibbs Free Energy",
    appletUsage: <>Input the standard enthalpy change (ΔH) and entropy change (ΔS) values. Apply the free energy equation (ΔG = ΔH - TΔS) to evaluate reaction feasibility and calculate the minimum threshold temperature (T = ΔH / ΔS) for spontaneity.</>,
    examApplication: <>A core structured calculation in WJEC Unit 3. It tests your ability to track thermodynamic variables to predict the feasibility of industrial processes at specific temperatures.</>,
    pitfalls: <>The absolute most common pitfall is a unit mismatch. Enthalpy (ΔH) is given in kJ mol<sup>-1</sup>, while entropy (ΔS) is in J K<sup>-1</sup> mol<sup>-1</sup>. You must divide your ΔS value by 1000 before substituting it into the Gibbs equation.</>
  },

  'rates': {
    title: "Reaction Rates",
    appletUsage: <>Analyze initial rates data from randomized chemical trials. Compare concentration changes across experiments to deduce individual reaction orders, construct the overall rate equation, and evaluate the rate constant (k) alongside its units.</>,
    examApplication: <>Emulates data analysis questions in WJEC Unit 3. You are expected to state clear logical deductions for reaction orders and demonstrate the algebraic cancellation required to find k units.</>,
    pitfalls: <>Deducing the units of k requires rigorous algebraic cancellation. For example, a second-order overall reaction has k units of dm<sup>3</sup> mol<sup>-1</sup> s<sup>-1</sup>. Candidates frequently write this backwards as mol dm<sup>-3</sup> s<sup>-1</sup> and lose the final mark.</>
  },

  'kc-calc': {
    title: "Kc Equilibrium Constants",
    appletUsage: <>Read the initial reactant moles. Set up an algebraic ICE (Initial, Change, Equilibrium) table using stoichiometric ratios, solve for equilibrium moles, divide by total volume to find concentrations, and evaluate K<sub>c</sub>.</>,
    examApplication: <>Matches structured equilibrium calculations in WJEC Unit 3. Demonstrating a clear ICE table layout allows examiners to award ECF marks if an algebraic error occurs mid-calculation.</>,
    pitfalls: <>K<sub>c</sub> expressions require equilibrium concentrations, not raw mole numbers. Forgetting to divide your final equilibrium moles by the total container volume (V) before substituting into the K<sub>c</sub> expression is a classic unforced error.</>
  },

  'kp-calc': {
    title: "Kp Equilibrium Constants",
    appletUsage: <>Input initial gaseous reactant quantities and total system pressure. Calculate total equilibrium moles, determine individual gas mole fractions, multiply by total pressure to find partial pressures, and evaluate K<sub>p</sub>.</>,
    examApplication: <>Applies to gas-phase equilibrium systems in WJEC Unit 3. You must systematically model each stage (mole fractions &rarr; partial pressures &rarr; K<sub>p</sub> value) and deduce the final units.</>,
    pitfalls: <>Never use square brackets [ ] when writing a K<sub>p</sub> expression; square brackets denote aqueous concentrations. You must use strict partial pressure notation, such as p(CO<sub>2</sub>) or pCO<sub>2</sub>, to secure the notation mark.</>
  },

  'acids': {
    title: "pH & Weak Acids",
    appletUsage: <>Review the weak acid concentration and K<sub>a</sub> values. Apply the weak acid approximation [H<sup>+</sup>] = √(K<sub>a</sub> &times; [HA]) to calculate the hydrogen ion concentration, then take the negative logarithm to find the pH.</>,
    examApplication: <>Core to WJEC Unit 3 acid-base chemistry. You must efficiently switch between calculating pH for strong acids (full dissociation) and weak acids (partial dissociation).</>,
    pitfalls: <>When finding the pH of a strong base, your initial calculation yields [OH<sup>-</sup>]. You must use the ionic product of water, K<sub>w</sub>, to calculate [H<sup>+</sup>] first. Taking the negative log of the hydroxide concentration directly gives pOH, not pH.</>
  },

  'buffers': {
    title: "Buffer Solutions",
    appletUsage: <>Examine the initial mixture of a weak acid and its conjugate base. Calculate the adjusted moles following the addition of small amounts of H<sup>+</sup> or OH<sup>-</sup>, and compute the newly stabilized pH.</>,
    examApplication: <>Prepares you for the most complex calculation in WJEC Unit 3. Demonstrating your structured working for the adjusted mole values before recalculating the [H<sup>+</sup>] ensures maximum ECF marks.</>,
    pitfalls: <>When alkali (OH<sup>-</sup>) is added to a buffer, the moles of weak acid decrease, and the moles of the conjugate base increase by that exact same stoichiometric amount. You must apply this inverse adjustment to both components before using the K<sub>a</sub> expression.</>
  },

  'chiral-centers': {
    title: "Chiral Center Identification",
    appletUsage: <>Analyze the organic skeletal structure. Inspect each carbon node to identify asymmetric carbons bonded to four structurally unique groups, and precisely label these chiral centers with an asterisk (*).</>,
    examApplication: <>Addresses stereochemistry in WJEC Unit 4. You must rapidly locate chiral centers in large biochemical molecules and properly illustrate non-superimposable mirror images using 3D wedge/dash bonds.</>,
    pitfalls: <>Never label CH<sub>2</sub> or CH<sub>3</sub> nodes, or any carbon involved in a double bond (C=O, C=C). A true chiral center must be sp<sup>3</sup> hybridised and attached to four definitively distinct functional pathways.</>
  },

  'mechanisms-masterclass': {
    title: "Organic Mechanisms Masterclass",
    appletUsage: <>Examine advanced functional groups like carbonyls (C=O). Track nucleophilic addition or elimination mechanisms by drawing precise curly arrows representing the flow of electron pairs from attacking nucleophiles to electrophilic carbons.</>,
    examApplication: <>Essential for mastering organic synthesis pathways in WJEC Unit 4.4, particularly the multi-mark mechanism for the nucleophilic addition of cyanide (CN<sup>-</sup>) to aldehydes or ketones.</>,
    pitfalls: <>Always draw the partial charges (δ+ and δ-) on the polar carbonyl bond. Your curly arrow must originate exactly from the nucleophile's lone pair. For the intermediate ion, failing to explicitly draw the negative charge and lone pair on the oxygen atom will cost the structure mark.</>
  },

  'nuclear-decay': {
    title: "Nuclear Decay Equations",
    appletUsage: <>Identify the specific decay mode. Calculate the resulting transformations to the mass number (A) and atomic number (Z), and input the correct balanced notation for the daughter isotope and emitted particle.</>,
    examApplication: <>Mirrors WJEC Unit 1 questions requiring balanced radioactive decay equations (α, β⁻, β⁺, and electron capture) to prove the conservation of nucleons and proton charge.</>,
    pitfalls: <>Beta-minus (β⁻) and electron capture are the most frequently mishandled. In β⁻ decay, a neutron decays into a proton, so the atomic number (Z) <em>increases</em> by 1. In electron capture, a proton captures an electron to become a neutron, so Z <em>decreases</em> by 1.</>
  }
};