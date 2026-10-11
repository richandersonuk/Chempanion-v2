import React from 'react';

export const howToGuides = {
  'formulas-ions': {
    title: "Formulas from Ions",
    appletUsage: <>Review the target cation and anion displayed in the workspace cards. Deduce the lowest common multiple of their charges, calculate the matching stoichiometric coefficients needed to achieve a net-neutral compound, type the resulting formula inside the input field, and click 'Check Balance'.</>,
    examApplication: <>In WJEC Unit 1.1 questions, you are frequently required to construct balanced ionic equations for precipitation or neutralisation reactions. This applet trains you to write the correct empirical formula for compounds without given formulas, ensuring that your subsequent state symbols and stoichiometry balancing steps remain valid.</>,
    pitfalls: <>Never include the ion charges in your final compound formula (e.g., writing Na<sup>+</sup>Cl<sup>-</sup> instead of NaCl is a severe notation error). Always ensure polyatomic units are enclosed in brackets if their stoichiometric multiplier is greater than 1, such as Mg(NO<sub>3</sub>)<sub>2</sub>.</>
  },

  'formulas-name': {
    title: "Formulas from Names",
    appletUsage: <>Read the randomized IUPAC systematic chemical name presented in the problem field. Identify the oxidation states denoted by the Roman numerals, establish the charge profiles of the constituent elements or polyatomic groups, determine the neutral empirical ratio, and type the chemical formula to submit.</>,
    examApplication: <>WJEC past papers frequently use systematic naming conventions like iron(III) sulfate or manganate(VII). You are expected to instantly translate these naming conventions into correct formula units to calculate relative formula masses (M<sub>r</sub>) or balance comprehensive redox cycles.</>,
    pitfalls: <>A common error is confusing the Roman numeral oxidation state of a transition element with its absolute subscript ratio in the compound. For example, iron(III) oxide means Fe<sup>3+</sup> ions combining with O<sup>2-</sup> ions to form Fe<sub>2</sub>O<sub>3</sub>, not Fe<sub>3</sub>O<sub>2</sub>.</>
  },

  'formula-master': {
    title: "Ion Formulas from Compounds",
    appletUsage: <>Examine the generated compound formula. Perform the reverse structural operation by splitting the compound back into its free, constituent cations and anions. Input the exact numbers and charges of the individual isolated ion units to verify your dissociation analysis.</>,
    examApplication: <>This skill maps directly onto writing ionic half-equations for Unit 3.1 electrochemistry and constructing precise ionic equations for Unit 3.9 buffer systems, where you must isolate spectator ions from the primary reacting species.</>,
    pitfalls: <>When a subscript belongs to a polyatomic framework, do not break it apart into atomic components. For instance, dissolving a sulfate entity releases complete SO<sub>4</sub><sup>2-</sup> polyatomic units, never isolated sulfur or oxide species.</>
  },

  'empirical-formula': {
    title: "Empirical & Molecular Formulas",
    appletUsage: <>Read the randomized mass or percentage composition dataset. Use the calculation workspace to convert the raw values into relative molar ratios by dividing by atomic mass, determine the simplest whole-number empirical matrix, and scale it up against the given molar mass if required.</>,
    examApplication: <>This directly mimics the multi-mark structured calculation questions found in WJEC Unit 1.1. Marks are strictly awarded chronologically for calculating moles, finding the empirical ratio, and stating the final molecular formula.</>,
    pitfalls: <>Rounding intermediate decimal values too early in your calculation will cause rounding errors, resulting in incorrect integer ratios. Keep all values in your calculator memory until you reach the absolute final ratio step.</>
  },

  'titration': {
    title: "Acid-Base Titrations",
    appletUsage: <>Examine the randomized volumetric titration parameters (e.g., mean concordant titre and concentration fields). Calculate the moles of your standard solution, look up the stoichiometric balancing ratio of the neutralization equation, and evaluate the concentration of the unknown sample.</>,
    examApplication: <>This simulates standard WJEC structured titration problems. You must determine reacting chemical quantities and scale your intermediate volumetric values between 25.0 cm<sup>3</sup> aliquots and complete 250 cm<sup>3</sup> volumetric flasks.</>,
    pitfalls: <>Failing to convert titration volumes from cm<sup>3</sup> to dm<sup>3</sup> (by dividing by 1000) when calculating molarity will completely skew your numerical scale and lose accuracy marks.</>
  },

  'idealgas': {
    title: "Ideal Gas Calculations",
    appletUsage: <>Identify which variable in the ideal gas equation (pV = nRT) is marked as unknown. Perform unit conversions for the randomized temperature, pressure, or volume metrics provided, rearrange the expression, and calculate the final target value.</>,
    examApplication: <>WJEC past papers thoroughly test your ability to convert non-SI units before evaluating gas volumes or calculating the relative molecular mass (M<sub>r</sub>) of volatile liquids.</>,
    pitfalls: <>Unit mismatches are the most frequent pitfall. You must convert pressure from kPa to Pa (&times; 10<sup>3</sup>), volume from cm<sup>3</sup> or dm<sup>3</sup> to m<sup>3</sup> (&times; 10<sup>-6</sup> or &times; 10<sup>-3</sup> respectively), and temperature to Kelvin (+273.15).</>
  },

  'mechanisms-unit2': {
    title: "AS Organic Mechanisms",
    appletUsage: <>Observe the interactive organic structure, identifying specific electron-dense double bonds or partial dipoles (δ+ / δ-). Map out the direction of electron pair movement by setting up functional curly arrows from electron donors to acceptors.</>,
    examApplication: <>Tests your precision when drawing mechanics for electrophilic additions to alkenes or nucleophilic substitutions on halogenoalkanes, which are staple multi-mark question types in WJEC Unit 2.5.</>,
    pitfalls: <>WJEC examiners frequently penalize arrows that originate or terminate in ambiguous spatial positions. Your curly arrow must start precisely from an explicit lone pair or a covalent bond line, and point directly to the specific atom forming the new bond.</>
  },

  'thermometric': {
    title: "Thermometric Titrations",
    appletUsage: <>Interact with the temperature vs. acid volume data plot. Adjust the linear extrapolation lines to pinpoint the exact intersection corresponding to the equivalence point, extract the maximum neutralisation volume, and calculate the resulting enthalpy change (ΔH).</>,
    examApplication: <>This matches practical exam styles seen in Unit 2.1 and Unit 5 papers. You must interpret raw empirical thermal points, identify neutralization volumes, and calculate specific heat absorption using Q = mcΔT.</>,
    pitfalls: <>When calculating the reacting mass (m) for Q = mcΔT, you must combine the volumes of both the acid and the base solutions together, rather than using only the volume of the single limiting reactant added.</>
  },

  'redox': {
    title: "Redox Titrations",
    appletUsage: <>Read the randomized concentration data for standard oxidising agents, such as potassium manganate(VII), KMnO<sub>4</sub>. Apply the half-equation stoichiometry ratios to determine the mass or concentration of transition metal elements like iron(II) in a sample.</>,
    examApplication: <>This skill addresses advanced multi-step calculation pathways in Unit 3.1. It tests your ability to links mole values across oxidation states, often using back-titration data or scaling factors.</>,
    pitfalls: <>Always check the full balanced redox equation for stoichiometry scaling factors. For example, the reacting ratio of MnO<sub>4</sub><sup>-</sup> to Fe<sup>2+</sup> is 1:5, which must be explicitly applied when calculating total mole values.</>
  },

  'cell-potentials': {
    title: "Standard Cell Potentials",
    appletUsage: <>Review the standard reduction potentials (E<sup>θ</sup>) assigned to the randomized half-cells. Identify the strongest oxidising agent to determine the cathode, change the sign of the oxidation half-cell, and sum them to find the overall cell EMF.</>,
    examApplication: <>Directly prepares you for WJEC Unit 3.1 electrochemical calculations. You will be asked to determine cell voltages, write overall conventional cell diagrams, and predict reaction feasibility.</>,
    pitfalls: <>Never multiply the E<sup>θ</sup> value of a half-cell when balancing the electron stoichiometry of an equation. The standard cell potential is an intensive property and remains constant regardless of the reacting mole ratios.</>
  },

  'enthalpy': {
    title: "Enthalpy of Combustion",
    appletUsage: <>Utilize the experimental calorimetry database variables. Calculate the heat transferred to the water using Q = mcΔT, determine the number of moles of fuel combusted from mass changes, and divide Q by moles to find ΔH<sub>c</sub>.</>,
    examApplication: <>Applies to Unit 2.1 and Unit 3.4 energetic questions. You are expected to process raw laboratory data to deduce standard combustion enthalpies and construct Hess's Law cycles.</>,
    pitfalls: <>WJEC examiners strictly require the correct sign convention for thermodynamics questions. Exothermic combustion reactions must always be explicitly written with a negative sign (-) in your final answer.</>
  },

  'entropy-gibbs': {
    title: "Entropy & Gibbs Free Energy",
    appletUsage: <>Input the standard enthalpy change (ΔH) and absolute entropy change (ΔS) values. Apply the free energy equation (ΔG = ΔH - TΔS) to evaluate system feasibility and calculate the minimum threshold temperature required for spontaneous reactions.</>,
    examApplication: <>A core multi-mark calculation component in WJEC Unit 3.4. It tests your ability to link enthalpy and entropy variables to predict the chemical feasibility of industrial processes at specific temperatures.</>,
    pitfalls: <>The most common pitfall is a unit mismatch between enthalpy and entropy terms. Enthalpy (ΔH) is typically given in kJ mol<sup>-1</sup>, whereas entropy (ΔS) is given in J K<sup>-1</sup> mol<sup>-1</sup>. You must divide your ΔS value by 1000 before substituting it into the Gibbs equation.</>
  },

  'rates': {
    title: "Reaction Rates",
    appletUsage: <>Analyze initial rates data from a series of randomized chemical trials. Compare concentration changes across experiments to deduce individual reaction orders, construct the overall rate equation, and calculate the rate constant (k) with its units.</>,
    examApplication: <>Directly emulates data analysis questions in WJEC Unit 3.5. You are expected to logically explain your deduction of reaction orders and calculate the units for the rate constant based on the overall order.</>,
    pitfalls: <>Deducing k units requires care. Cancel out concentration terms thoroughly. For example, a second-order reaction has k units of dm<sup>3</sup> mol<sup>-1</sup> s<sup>-1</sup>, which is frequently miswritten by candidates as mol dm<sup>-3</sup> s<sup>-1</sup>.</>
  },

  'kc-calc': {
    title: "Kc Equilibrium Constants",
    appletUsage: <>Read the initial concentration quantities of reactants. Set up an algebraic ICE (Initial, Change, Equilibrium) table based on the reaction's stoichiometry, solve for the equilibrium concentrations, and evaluate the equilibrium constant (K<sub>c</sub>).</>,
    examApplication: <>Matches the structured equilibrium calculation workflows required in WJEC Unit 3.8. It tests your ability to track partial dissociation and use equilibrium mixtures to compute K<sub>c</sub> values.</>,
    pitfalls: <>K<sub>c</sub> expressions use equilibrium concentrations, not initial quantities or raw mole numbers. Always divide your equilibrium mole values by the total volume of the container (V) to convert them to concentrations before evaluating K<sub>c</sub>.</>
  },

  'kp-calc': {
    title: "Kp Equilibrium Constants",
    appletUsage: <>Input the initial mole quantities of gaseous reactants along with the total system pressure. Calculate total moles at equilibrium, determine individual gas mole fractions, multiply by total pressure to find partial pressures, and evaluate K<sub>p</sub>.</>,
    examApplication: <>Applies to gas-phase equilibrium systems in WJEC Unit 3.8. You must systematically demonstrate each calculation stage: calculating mole fractions, determining partial pressures, and writing the final K<sub>p</sub> expression with its units.</>,
    pitfalls: <>Do not use square brackets [ ] when writing a K<sub>p</sub> expression; square brackets denote concentration terms (K<sub>c</sub>). You must use partial pressure notation, such as p(CO<sub>2</sub>) or pCO<sub>2</sub>, to avoid losing notation marks.</>
  },

  'acids': {
    title: "pH & Weak Acids",
    appletUsage: <>Review the weak acid concentration and K<sub>a</sub> or pK<sub>a</sub> values. Apply the weak acid approximation [H<sup>+</sup>] = √(K<sub>a</sub> &times; [HA]) to calculate the hydrogen ion concentration, and then convert this value into a pH reading.</>,
    examApplication: <>A core component of WJEC Unit 3.9 acid-base chemistry. You are expected to calculate the pH of strong acids, weak acids, and strong bases, as well as handle inverse logarithmic conversions.</>,
    pitfalls: <>When calculating the pH of a strong base, remember that your initial calculation yields [OH<sup>-</sup>]. You must use K<sub>w</sub> ([H<sup>+</sup>] = K<sub>w</sub> / [OH<sup>-</sup>]) to find the hydrogen ion concentration before calculating pH, rather than taking the negative log of the hydroxide concentration directly.</>
  },

  'buffers': {
    title: "Buffer Solutions",
    appletUsage: <>Examine the composition profile of an acidic buffer mixture consisting of a weak acid and its conjugate salt. Calculate the adjusted molar concentrations following the addition of small amounts of H<sup>+</sup> or OH<sup>-</sup> ions, and compute the final stabilized pH.</>,
    examApplication: <>Prepares you for multi-step buffer calculations in WJEC Unit 3.9. These questions evaluate your understanding of how buffer solutions resist changes in pH when small quantities of acid or alkali are added.</>,
    pitfalls: <>When an acid or alkali is added to a buffer, remember that one component of the buffer increases in moles while the other decreases by that same amount. Ensure you correctly apply this change to both the acid and salt mole values before re-calculating the pH.</>
  },

  'chiral-centers': {
    title: "Chiral Center Identification",
    appletUsage: <>Analyze the randomized organic skeletal structure displayed in the workspace canvas. Inspect each carbon node to identify asymmetric carbons bonded to four structurally unique atom groups, and label these chiral centers with an asterisk (*).</>,
    examApplication: <>Directly addresses optical isomerism and stereochemistry principles in WJEC Unit 4.1 organic chemistry. You are required to locate chiral centers in complex molecules and draw the non-superimposable mirror images of optical isomers.</>,
    pitfalls: <>Never label CH<sub>2</sub> or CH<sub>3</sub> carbon nodes, or any double-bonded carbon atoms (C=O, C=C), as chiral centers. A chiral carbon must be sp<sup>3</sup> hybridised and bonded to four entirely distinct functional groups or carbon chains.</>
  },

'mechanisms-masterclass': {
  title: "Organic Mechanisms Masterclass",
  appletUsage: <>Examine advanced functional groups like carbonyls (C=O). Track the steps of nucleophilic addition or elimination mechanisms by drawing precise curly arrows that represent the movement of electron pairs from attacking nucleophiles to electrophilic centers.</>,
  examApplication: <>Prepares you for organic synthesis and mechanism questions in WJEC Unit 4.4, focusing on reactions such as the nucleophilic addition of HCN to aldehydes or ketones.</>,
  pitfalls: <>Always draw the partial charges (δ+ and δ-) on the polar carbonyl bond to show the electrophilic center clearly. Additionally, remember to include the negative charge and lone pair on intermediate ion structures to secure full mechanism marks.</>
},
'nuclear-decay': {
  title: "Nuclear Decay Equations",
  appletUsage: (
    <>
      Identify the decay mode selected in the problem text. Calculate the resulting changes to the mass number (A) and atomic number (Z), and input the correct values alongside the target elemental or particle symbol. Use the Data Booklet if you need to look up an element symbol by its atomic number.
    </>
  ),
  examApplication: (
    <>
      This mirrors WJEC Unit 1.2 questions where you must accurately balance radioactive decay equations (α, β⁻, β⁺, and electron capture), predict daughter isotopes or emitted particles, and demonstrate the conservation of mass number and proton charge across nuclear transformations.
    </>
  ),
  pitfalls: (
    <>
      A high-frequency error on WJEC mark schemes is mishandling beta-minus (β⁻) and electron capture equations. Remember that in β⁻ decay, a neutron decays into a proton, so the atomic number (Z) <em>increases</em> by 1. In electron capture, an inner-shell electron is captured by a proton to form a neutron, so the atomic number (Z) <em>decreases</em> by 1.
    </>
  )
}
}