export const howToGuides = {
  'formulas-ions': {
    title: 'Formulas from Ions',
    unit: 'Unit 1.1',
    summary: 'Construct neutral ionic lattice formulas by balancing positive cation and negative anion charges to zero.',
    appletSteps: [
      <><strong>Generate Ion Pair:</strong> Click <em>Shuffle Ions</em> to load a fresh cation and anion card (including monoatomic and polyatomic ions).</>,
      <><strong>Count Neutralising Ratio:</strong> Balance the charges so total positive charge cancels total negative charge.</>,
      <><strong>Type Formula:</strong> Enter your answer in the formula input — typed digits automatically convert to chemical subscripts (use parentheses like <code>Ca(NO3)2</code> when a polyatomic ion repeats).</>,
      <><strong>Verify:</strong> Press <em>Check Balance</em> to validate stoichiometry and bracket placement.</>,
    ],
    examMethod: {
      formulas: [
        '(number of cations × cation charge) + (number of anions × anion charge) = 0',
      ],
      steps: [
        'Write down the formula and charge of each ion separately (e.g. Fe³⁺ and SO₄²⁻).',
        'Find the lowest common multiple (LCM) of the charge magnitudes so total positive charge equals total negative charge.',
        'Multiply each ion until its charge reaches the LCM; reduce subscripts to their simplest whole-number ratio if both are divisible.',
        'Enclose any polyatomic ion (NO₃⁻, SO₄²⁻, OH⁻, CO₃²⁻, NH₄⁺) in brackets ONLY when more than one unit is required.',
      ],
    },
    workedExample: {
      question: 'Deduce the chemical formula of iron(III) sulfate from its constituent ions, Fe³⁺ and SO₄²⁻.',
      steps: [
        'Identify charges: Fe³⁺ (+3) and SO₄²⁻ (−2).',
        'Find LCM of 3 and 2, which is 6 (+6 and −6 needed).',
        'Use 2 × Fe³⁺ (+6) and 3 × SO₄²⁻ (−6).',
        'Put SO₄ inside brackets before placing the subscript 3 outside.',
      ],
      answer: 'Fe₂(SO₄)₃',
    },
    examinerTips: {
      pitfalls: [
        'Omitting brackets on repeated polyatomic ions (e.g. writing CaOH₂ instead of Ca(OH)₂, or Fe₂SO₄₃ instead of Fe₂(SO₄)₃).',
        'Forgetting to simplify ratios after crossing charges (e.g. Mg²⁺ + O²⁻ → Mg₂O₂ instead of MgO).',
        'Leaving ionic charges (+ or −) inside the final solid formula.',
      ],
      checklist: [
        'Total (+) charge exactly equals total (−) charge',
        'Brackets used around polyatomic ions with subscript ≥ 2 (and omitted when subscript = 1)',
        'Subscript ratio simplified to lowest whole numbers with no leftover charges',
      ],
    },
  },

  'formulas-name': {
    title: 'Formulas from Names',
    unit: 'Unit 1.1',
    summary: 'Translate systematic IUPAC inorganic names — including Stock oxidation-state Roman numerals and oxyanion suffixes — into balanced formulas.',
    appletSteps: [
      <><strong>Pick Challenge Mode:</strong> Switch between <em>Simple</em>, <em>Roman Numerals</em>, and <em>Complex Polyatomic</em> tiers, or press <em>Random 🎲</em> for mixed practice.</>,
      <><strong>Decode Name Parts:</strong> Identify the metal/ammonium cation charge (checking Roman numerals where given) and match the anion ending (<code>-ide</code> vs <code>-ate</code>).</>,
      <><strong>Enter &amp; Check:</strong> Type the formula into the auto-subscripting input box and submit to verify charge neutrality and bracket syntax.</>,
    ],
    examMethod: {
      formulas: [
        'Stock Roman numeral (I)–(VII) = positive oxidation state / charge of the named metal ion',
        '-ide = single-element anion (except hydroxide OH⁻, cyanide CN⁻)  |  -ate = oxygen-containing anion',
      ],
      steps: [
        'Translate fixed-charge cations from Periodic Group number (Group 1 = +1, Group 2 = +2, Al³⁺ = +3, Zn²⁺ = +2, Ag⁺ = +1, NH₄⁺ = +1).',
        'Read Roman numerals directly as the metal charge (e.g. copper(II) = Cu²⁺, iron(III) = Fe³⁺).',
        'Identify common polyatomic anions: NO₃⁻ (nitrate), SO₄²⁻ (sulfate), CO₃²⁻ (carbonate), OH⁻ (hydroxide), Cr₂O₇²⁻ (dichromate(VI)), MnO₄⁻ (manganate(VII)).',
        'Balance total charge to zero using brackets whenever a polyatomic ion appears more than once.',
      ],
    },
    workedExample: {
      question: 'Write the chemical formula for ammonium sulfate and copper(II) hydroxide.',
      steps: [
        'Ammonium sulfate combines NH₄⁺ (+1) with SO₄²⁻ (−2): two NH₄⁺ ions are needed to balance one SO₄²⁻.',
        'Copper(II) hydroxide combines Cu²⁺ (+2) with OH⁻ (−1): two OH⁻ ions are needed to balance one Cu²⁺.',
      ],
      answer: '(NH₄)₂SO₄ and Cu(OH)₂',
    },
    examinerTips: {
      pitfalls: [
        'Confusing -ide and -ate endings (e.g. nitride N³⁻ vs nitrate NO₃⁻, or sulfide S²⁻ vs sulfate SO₄²⁻).',
        'Assuming Roman numerals count atoms in the formula rather than ion charge (iron(III) oxide is Fe₂O₃, not Fe₃O).',
        'Writing NH₄₂SO₄ without parentheses around the NH₄ unit.',
      ],
      checklist: [
        '-ide vs -ate anion formula verified correctly',
        'Roman numeral applied as cation charge, not subscript count',
        'Brackets included whenever a polyatomic ion is multiplied',
      ],
    },
  },

  'formula-master': {
    title: 'Formula Master: Reverse Ion Extraction',
    unit: 'Unit 1.1',
    summary: 'Deconstruct ionic formulas or compound names back into discrete cation and anion identities with exact charges.',
    appletSteps: [
      <><strong>Choose Difficulty Tier:</strong> Select between <em>Ions from Formula</em> and <em>Ions from Name</em> across GCSE and Advanced modes.</>,
      <><strong>Enter Ion Formulas:</strong> Type the base formula of the cation and anion (without writing the charge sign inside the text field).</>,
      <><strong>Set Charge Magnitudes:</strong> Use the <em>▲ / ▼</em> steppers to dial in each ion’s exact charge magnitude (1 to 4) and verify your ion breakdown.</>,
    ],
    examMethod: {
      formulas: [
        'm × (charge of cation) + n × (charge of anion) = 0  for formula M_mX_n',
      ],
      steps: [
        'Separate the compound cleanly into its cation unit and anion unit (keep polyatomic groups such as SO₄, NO₃, CO₃, or Cr₂O₇ intact).',
        'Determine the known fixed charge first (e.g. Group 1 = +1, Group 2 = +2, halides = −1, O²⁻/SO₄²⁻/CO₃²⁻ = −2).',
        'Divide the opposing total charge evenly across the stoichiometry subscript of the transition metal or unknown ion.',
      ],
    },
    workedExample: {
      question: 'Identify the exact constituent ions (formula and charge) present in Fe₂(SO₄)₃ and Cr(NO₃)₃.',
      steps: [
        'In Fe₂(SO₄)₃, each sulfate unit carries a −2 charge. Three sulfate ions contribute 3 × (−2) = −6 total charge.',
        'Two Fe ions share +6 equally (+6 ÷ 2 = +3 each), giving Fe³⁺ and SO₄²⁻.',
        'In Cr(NO₃)₃, three NO₃⁻ ions give −3 total, so one Cr ion must be Cr³⁺.',
      ],
      answer: 'Fe³⁺ & SO₄²⁻ ;  Cr³⁺ & NO₃⁻',
    },
    examinerTips: {
      pitfalls: [
        'Confusing subscript stoichiometry with ionic charge (thinking the 2 in MgCl₂ means Cl²⁻ instead of two Cl⁻ ions).',
        'Splitting polyatomic anions down to bare atoms (writing S and O instead of SO₄²⁻).',
        'Forgetting that Group 1/2/3 charges stay fixed regardless of counter-ion count.',
      ],
      checklist: [
        'Polyatomic ion kept intact with its standard charge',
        'Transition-metal charge deduced from total anion charge ÷ metal count',
        'Cation positive (+) and anion negative (−) charges balance the original formula',
      ],
    },
  },

  'nuclear-decay': {
    title: 'Nuclear Chemistry & Half-Life',
    unit: 'Unit 1.2',
    summary: 'Balance α, β⁻, β⁺, γ, and electron-capture nuclear equations, model exponential half-life decay, and predict radiation deflection in fields.',
    appletSteps: [
      <><strong>Select Practice Tab:</strong> Navigate across <em>Nuclear Decay Equations</em>, <em>Half-Life Calculations</em>, and <em>Radiation &amp; Field Properties</em>.</>,
      <><strong>Balance Nucleons &amp; Protons:</strong> In decay problems, type the missing Mass Number (A), Atomic Number (Z), and Periodic Table element symbol.</>,
      <><strong>Half-Life &amp; Fields:</strong> Count whole half-lives elapsed for decay-fraction problems, and compare mass/charge ratios for electric-field deflection questions.</>,
    ],
    examMethod: {
      formulas: [
        '∑A (reactants) = ∑A (products)     |     ∑Z (reactants) = ∑Z (products)',
        'α = ⁴₂He     β⁻ = ⁰₋₁e     β⁺ = ⁰₊₁e     γ = ⁰₀γ     n = ¹₀n',
        'Remaining fraction = (1/2)ⁿ   where   n = total time ÷ half-life (t₁/₂)',
      ],
      steps: [
        'Write down the reactant nuclide with superscript A and subscript Z, plus the emitted particle.',
        'Find the daughter nucleus Z first using proton-charge conservation (watch the double minus in β⁻: Z − (−1) = Z + 1).',
        'Look up the new chemical symbol strictly from Z on the Data Booklet Periodic Table (never from A).',
        'For half-life questions, divide total elapsed time by t₁/₂ to get n, then halve N₀ repeatedly n times (or apply N₀ × 0.5ⁿ).',
      ],
    },
    workedExample: {
      question: 'A 40.0 g sample of ¹⁴₆C (t₁/₂ = 5730 years) undergoes β⁻ decay for 17,190 years. Write the balanced decay equation and calculate the mass of ¹⁴₆C remaining.',
      steps: [
        'β⁻ decay emits ⁰₋₁e: A stays 14 (14 − 0 = 14); Z increases from 6 to 7 (6 − (−1) = 7), which is Nitrogen (N).',
        'Number of half-lives n = 17,190 ÷ 5,730 = 3.',
        'Remaining mass = 40.0 × (1/2)³ = 40.0 ÷ 8 = 5.00 g.',
      ],
      answer: '¹⁴₆C → ¹⁴₇N + ⁰₋₁e  ;  5.00 g remaining',
    },
    examinerTips: {
      pitfalls: [
        'Decreasing Z during β⁻ decay instead of increasing Z by +1 (forgetting Z_parent = Z_daughter + (−1)).',
        'Looking up the daughter element by Mass Number A instead of Atomic Number Z.',
        'Confusing deflection strengths: β⁻ deflects strongly toward the positive plate (tiny mass), α deflects gently toward the negative plate (heavy +2), and γ passes straight through.',
      ],
      checklist: [
        'Top numbers (A) sum identically on both sides of the arrow',
        'Bottom numbers (Z) sum identically on both sides (including −1 for β⁻)',
        'Element symbol matched to the new Z value in the Periodic Table',
      ],
    },
  },

  'empirical-formula': {
    title: 'Empirical, Molecular & Hydrated Formulas',
    unit: 'Unit 1.3',
    summary: 'Deduce simplest whole-number empirical ratios from mass/% data, scale to molecular formulas via Mᵣ, and find water of crystallisation.',
    appletSteps: [
      <><strong>Choose Question Type:</strong> Switch between <em>% Composition</em>, <em>Mass Data</em>, <em>Molecular Formula (with Mᵣ)</em>, and <em>Hydrated Salt (·xH₂O)</em>, or click <em>Random 🎲</em>.</>,
      <><strong>Solve Ratio Table:</strong> Divide each mass or percentage by atomic mass Aᵣ (from the Data Booklet) and normalise against the smallest value.</>,
      <><strong>Enter Answer:</strong> Type the final formula into the auto-subscripting input box (use a dot like <code>MgSO4.7H2O</code> for hydrated salts).</>,
    ],
    examMethod: {
      formulas: [
        'n = mass (or % mass) ÷ Aᵣ',
        'Molecular scaling factor  k = Mᵣ(molecular) ÷ Mᵣ(empirical)',
        'Hydrated salt ratio  x = n(H₂O lost) ÷ n(anhydrous salt)   [Mᵣ(H₂O) = 18.0]',
      ],
      steps: [
        'Set out columns for each element (or anhydrous salt and H₂O for hydrated crystals).',
        'Divide mass or % by relative atomic mass Aᵣ (never molecular Mᵣ such as O₂ = 32).',
        'Divide every mole row by the smallest mole value in the table.',
        'If any ratio ends near .5, .33/.67, or .25/.75, multiply ALL values by 2, 3, or 4 rather than rounding prematurely.',
        'For molecular formulas, divide the given Mᵣ by the empirical unit mass and multiply every empirical subscript by that integer.',
      ],
    },
    workedExample: {
      question: 'Heating 4.92 g of hydrated MgSO₄·xH₂O to constant mass leaves 2.40 g of anhydrous MgSO₄ (Mᵣ = 120.4). Determine x and write the hydrated formula.',
      steps: [
        'Mass of H₂O driven off = 4.92 − 2.40 = 2.52 g.',
        'n(MgSO₄) = 2.40 ÷ 120.4 = 0.01993 mol  |  n(H₂O) = 2.52 ÷ 18.0 = 0.1400 mol.',
        'Divide by smallest (0.01993): MgSO₄ = 1.00  ;  H₂O = 0.1400 ÷ 0.01993 = 7.02 ≈ 7.',
      ],
      answer: 'MgSO₄·7H₂O  (x = 7)',
    },
    examinerTips: {
      pitfalls: [
        'Dividing by diatomic Mᵣ (O₂ = 32, Cl₂ = 71) instead of atomic Aᵣ (O = 16.0, Cl = 35.5).',
        'Rounding 1 : 1.5 down to 1 : 1 or up to 1 : 2 instead of doubling to 2 : 3.',
        'Dividing total hydrated crystal mass instead of mass lost (Δm) by 18.0 when finding water of crystallisation.',
      ],
      checklist: [
        'Atomic masses Aᵣ taken cleanly from the WJEC Data Booklet',
        'Decimal ratios scaled consistently (×2 for .5, ×3 for .33) across all species',
        'Hydrated salt uses mass of water LOST (hydrated − anhydrous)',
      ],
    },
  },

  idealgas: {
    title: 'Ideal Gas Equation (pV = nRT)',
    unit: 'Unit 1.3',
    summary: 'Master strict SI unit conversions before solving for pressure, volume, moles, temperature, or gas Mᵣ with standard-form input.',
    appletSteps: [
      <><strong>Pick Target Variable:</strong> Choose between calculating <em>Pressure (p)</em>, <em>Volume (V)</em>, <em>Moles (n)</em>, or <em>Temperature (T)</em>, or click <em>Random 🎲</em>.</>,
      <><strong>Clear WJEC Unit Trap Gate:</strong> Convert raw laboratory quantities into base SI units (Pa, m³, K, mol) and pass Step 1 first.</>,
      <><strong>Enter Standard Form:</strong> Use the <em>ScientificInput</em> box (click <em>×10ˣ</em> when needed) to submit your final answer to 3 significant figures.</>,
    ],
    examMethod: {
      formulas: [
        'pV = nRT      (R = 8.31 J mol⁻¹ K⁻¹)',
        'Mᵣ = (mRT) ÷ (pV)',
        '1 kPa = 10³ Pa     |     1 dm³ = 10⁻³ m³     |     1 cm³ = 10⁻⁶ m³     |     T(K) = T(°C) + 273',
      ],
      steps: [
        'List every given quantity and convert to mandatory SI base units BEFORE touching the equation: p in Pa, V in m³, T in K.',
        'Rearrange pV = nRT symbolically for the single unknown variable before substituting values.',
        'If the question asks for final units like kPa, cm³, °C, or g, convert back from your SI answer at the very end.',
      ],
    },
    workedExample: {
      question: '1.10 g of CO₂ (Mᵣ = 44.0) occupies 600 cm³ at 27 °C. Calculate the pressure in kPa.',
      steps: [
        'Convert to SI: n = 1.10 ÷ 44.0 = 0.0250 mol ; V = 600 × 10⁻⁶ = 6.00 × 10⁻⁴ m³ ; T = 27 + 273 = 300 K.',
        'Rearrange and compute p in Pa: p = nRT ÷ V = (0.0250 × 8.31 × 300) ÷ (6.00 × 10⁻⁴) = 1.04 × 10⁵ Pa.',
        'Convert Pa to kPa: 103,875 ÷ 1,000 = 104 kPa (3 sig figs).',
      ],
      answer: '104 kPa  (1.04 × 10⁵ Pa)',
    },
    examinerTips: {
      pitfalls: [
        'Converting cm³ to m³ by ×10⁻³ instead of ×10⁻⁶ (off by a factor of 1000!).',
        'Leaving temperature in °C or subtracting 273 instead of adding 273.',
        'Giving final pressure in Pa when the question explicitly asks for kPa (or vice versa).',
      ],
      checklist: [
        'Pressure entered in Pa (kPa × 10³)',
        'Volume entered in m³ (cm³ × 10⁻⁶, dm³ × 10⁻³)',
        'Temperature entered in K (°C + 273) and final answer checked for requested unit & 3 sig figs',
      ],
    },
  },

  'inorganic-tests': {
    title: 'Qualitative Inorganic Analysis',
    unit: 'Unit 1.6 / 3.3',
    summary: 'Use the virtual test-tube rack to run sequential cation, anion, and flame tests and write balanced ionic precipitation equations.',
    appletSteps: [
      <><strong>Load Unknown Sample:</strong> Select a mystery salt from the dropdown or click <em>Random 🎲</em>.</>,
      <><strong>Run Virtual Reagents:</strong> Click reagent buttons (<em>Flame Test</em>, <em>NaOH(aq)</em>, <em>SO₄²⁻</em>, <em>H⁺</em>, <em>Ba²⁺</em>, <em>Ag⁺ + HNO₃</em>, <em>dilute NH₃</em>, <em>conc NH₃</em>) to inspect test-tube observations.</>,
      <><strong>Deduce Salt &amp; Equation:</strong> Select the matching cation and anion from the identification menus, then verify the ionic precipitation equation.</>,
    ],
    examMethod: {
      formulas: [
        'Carbonate check first: CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g)  (effervescence)',
        'Sulfate: Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)  (white ppt, insoluble in H⁺)',
        'Halides: Ag⁺(aq) + X⁻(aq) → AgX(s)   [Cl⁻ white/dil NH₃ sol ; Br⁻ cream/conc NH₃ sol ; I⁻ yellow/insol]',
      ],
      steps: [
        'Identify cation: check flame colours (Li⁺ crimson, Na⁺ yellow, K⁺ lilac, Ca²⁺ brick-red, Sr²⁺ red, Ba²⁺ apple-green) and Group 2 trends (OH⁻ ppt decreases down Group 2; SO₄²⁻ ppt increases down Group 2).',
        'Warm with NaOH(aq) and test gas with damp red litmus (turns blue = NH₃ gas → NH₄⁺ ion present).',
        'Acidify with dilute HNO₃ before Ag⁺ or Ba²⁺ so false-positive carbonate precipitates dissolve first.',
        'Include state symbols (aq) and (s) in all ionic equations.',
      ],
    },
    workedExample: {
      question: 'An unknown white solid gives an apple-green flame. Acidified AgNO₃ forms a cream precipitate that stays insoluble in dilute NH₃(aq) but dissolves in concentrated NH₃(aq). Identify the salt and write the ionic equation for the halide test.',
      steps: [
        'Apple-green flame uniquely identifies Ba²⁺.',
        'Cream AgX precipitate soluble only in concentrated NH₃(aq) identifies Br⁻ (AgBr).',
        'Ionic equation (excluding spectator NO₃⁻ and Ba²⁺): Ag⁺(aq) + Br⁻(aq) → AgBr(s).',
      ],
      answer: 'Barium bromide (BaBr₂)  ;  Ag⁺(aq) + Br⁻(aq) → AgBr(s)',
    },
    examinerTips: {
      pitfalls: [
        'Acidifying with HCl before AgNO₃ (adds Cl⁻ ions and creates a fake white AgCl precipitate!) or H₂SO₄ before BaCl₂ (adds SO₄²⁻!).',
        'Omitting state symbols (aq) and (s) in ionic precipitation equations.',
        'Writing "clear" when you mean "colourless" solution (a precipitate mixture can be clear only if transparent, never say clear when colourless is required).',
      ],
      checklist: [
        'Acidified strictly with dilute HNO₃ before halide/sulfate testing',
        'Dilute NH₃ vs concentrated NH₃ solubility explicitly used to distinguish AgCl / AgBr / AgI',
        'Ionic equation includes exact ion charges and (aq)/(s) state symbols',
      ],
    },
  },

  titration: {
    title: 'Acid-Base & Volumetric Titration',
    unit: 'Unit 1.7',
    summary: 'Read meniscus levels, filter concordant titres, track volumetric dilution factors, and tackle direct, back, and double titrations.',
    appletSteps: [
      <><strong>Pick Practice Mode:</strong> Switch between <em>Standard</em>, <em>Back Titration</em>, <em>Double Titration</em>, <em>Concordant Table Practice</em>, and <em>Burette Reading</em>.</>,
      <><strong>Meniscus &amp; Table Gates:</strong> In <em>Burette Reading</em>, read the bottom of the curved meniscus from top-to-bottom to 0.05 cm³. In <em>Table Practice</em>, calculate titres and average only concordant trials (≤ 0.10 cm³ apart) to unlock the concentration step.</>,
      <><strong>Compute &amp; Verify:</strong> Work through stoichiometry and dilution scaling, then enter your answer via <em>ScientificInput</em>.</>,
    ],
    examMethod: {
      formulas: [
        'n = c × V(dm³) = c × V(cm³) ÷ 1000',
        'Aliquot dilution scale = V_flask ÷ V_pipette  (typically 250 cm³ ÷ 25.0 cm³ = ×10)',
        'Back titration: n(reactant reacted with sample) = n(initial excess) − n(leftover titrated)',
      ],
      steps: [
        'Calculate each titre (Final − Initial to 2 d.p. ending in .00 or .05) and average ONLY concordant titres within 0.10 cm³ (exclude rough trial!).',
        'Find moles of the known standard reagent using n = c × V(cm³) ÷ 1000.',
        'Apply the balanced equation mole ratio to find moles in the 25.0 cm³ pipette aliquot.',
        'Scale up to the volumetric flask (e.g. ×10 for 250 cm³) BEFORE subtracting excess moles in back titrations or converting to mass / % purity.',
      ],
    },
    workedExample: {
      question: '1.25 g of impure CaCO₃ (Mᵣ = 100.1) is dissolved in 50.0 cm³ of 1.00 mol dm⁻³ HCl and made up to 250 cm³. A 25.0 cm³ sample needs 28.00 cm³ of 0.100 mol dm⁻³ NaOH. Calculate % CaCO₃ purity.',
      steps: [
        'n(HCl added initially) = 1.00 × (50.0 ÷ 1000) = 0.0500 mol.',
        'n(NaOH in 25.0 cm³) = 0.100 × (28.00 ÷ 1000) = 0.00280 mol → leftover HCl in 25.0 cm³ = 0.00280 mol.',
        'Scale to 250 cm³ flask (×10): leftover HCl = 0.0280 mol.',
        'n(HCl reacted with CaCO₃) = 0.0500 − 0.0280 = 0.0220 mol.',
        'Since CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂, n(CaCO₃) = 0.0220 ÷ 2 = 0.0110 mol → mass = 1.101 g → % = (1.101 ÷ 1.25) × 100 = 88.1%.',
      ],
      answer: '88.1% CaCO₃',
    },
    examinerTips: {
      pitfalls: [
        'Including the rough titration or non-concordant values (> 0.10 cm³ apart) inside the mean titre.',
        'Forgetting the ×10 dilution factor from a 25.0 cm³ pipette back up to a 250 cm³ volumetric flask.',
        'Forgetting to divide HCl reacted by 2 for 1:2 Group 2 carbonate stoichiometry.',
      ],
      checklist: [
        'Burette read downwards from the bottom of the meniscus to 2 d.p. (.00 or .05)',
        'Only concordant titres (difference ≤ 0.10 cm³) averaged',
        'Flask dilution ratio (250/25 = ×10) applied before mass or back-subtraction',
      ],
    },
  },

  thermometric: {
    title: 'Thermometric Titration & Cooling Curves',
    unit: 'Unit 2.1',
    summary: 'Use the magnified lens on heating/cooling graphs to extrapolate ΔT_max and equivalence volume, then calculate ΔH_neut.',
    appletSteps: [
      <><strong>Choose Mode:</strong> Toggle between <em>Read Graph &amp; Extrapolate</em> and <em>Calculate Enthalpy</em>.</>,
      <><strong>Use Magnified Lens:</strong> Hover across the SVG temperature curve to inspect 0.1 cm³ grid ticks and pinpoint where the rising and cooling lines intersect.</>,
      <><strong>Read &amp; Solve:</strong> Enter the extrapolated equivalence volume V_eq and ΔT_max (corrected for heat loss), or calculate ΔH using total solution mass.</>,
    ],
    examMethod: {
      formulas: [
        'q (J) = m_total × c × ΔT_extrapolated     (c = 4.18 J g⁻¹ K⁻¹, ρ_solution = 1.00 g cm⁻³)',
        'm_total = V_acid(cm³) + V_base(cm³)',
        'ΔH = −q(kJ) ÷ n(limiting reactant)',
      ],
      steps: [
        'Draw two straight lines of best fit through the ascending reaction region and the descending excess/cooling region.',
        'Read the intersection coordinates to obtain V_eq (x-axis) and the heat-loss corrected ΔT_max (y-axis).',
        'Sum BOTH reactant volumes (V_acid + V_base at equivalence) to get total heated mass m_total in grams.',
        'Compute q in kJ (÷ 1000) and divide by moles of H₂O formed (limiting reagent) with a negative sign for exothermic neutralisation.',
      ],
    },
    workedExample: {
      question: 'When 2.00 mol dm⁻³ NaOH is added steadily to 25.0 cm³ HCl, the two best-fit lines intersect at V(NaOH) = 25.0 cm³ and ΔT_max = +13.6 °C. Calculate ΔH_neut.',
      steps: [
        'Total solution volume = 25.0 + 25.0 = 50.0 cm³ → m_total = 50.0 g.',
        'q = 50.0 × 4.18 × 13.6 = 2,842.4 J = 2.8424 kJ.',
        'n(H₂O formed) = n(NaOH at equivalence) = 2.00 × (25.0 ÷ 1000) = 0.0500 mol.',
        'ΔH_neut = −2.8424 ÷ 0.0500 = −56.8 kJ mol⁻¹.',
      ],
      answer: '−56.8 kJ mol⁻¹',
    },
    examinerTips: {
      pitfalls: [
        'Using only the original pipette volume (25.0 g) instead of the combined solution mass (V₁ + V₂ = 50.0 g) in q = mcΔT.',
        'Reading the highest single plotted thermometer point instead of the extrapolated intersection height ΔT_max.',
        'Dividing by the excess reactant moles or omitting the negative sign on exothermic ΔH.',
      ],
      checklist: [
        'ΔT read at the intersection of two extrapolated straight best-fit lines',
        'Total mass m = V_acid + V_base used in q = mcΔT',
        'Exothermic sign (−) and units kJ mol⁻¹ verified',
      ],
    },
  },

  enthalpy: {
    title: 'Calorimetry & Hess’s Law',
    unit: 'Unit 2.1',
    summary: 'Simulate spirit-burner calorimetry experiments, pass the kJ/mol Unit Trap Gate, and apply Hess cycles and bond enthalpies accurately.',
    appletSteps: [
      <><strong>Run Burner Simulation:</strong> Click <em>Run Simulation 🧪</em> to heat the copper calorimeter and harvest experimental readings (<em>Mass of Fuel Burned</em> and <em>ΔT</em>).</>,
      <><strong>Unlock Unit Trap Gate:</strong> Convert thermal energy <em>Q</em> into <strong>kJ</strong> (not Joules) and calculate fuel moles <em>n</em> to unlock Step 2.</>,
      <><strong>Enter ΔH_c:</strong> Submit final enthalpy of combustion in kJ mol⁻¹ (including its negative sign!) via <em>ScientificInput</em>.</>,
    ],
    examMethod: {
      formulas: [
        'q (J) = m_water × 4.18 × ΔT       |       ΔH_c = −q(kJ) ÷ n(fuel burned)',
        'Bond enthalpies: ΔH = ∑E(bonds broken) − ∑E(bonds formed)',
        'Hess (ΔH°_f): ΔH_rxn = ∑ΔH°_f(products) − ∑ΔH°_f(reactants)',
        'Hess (ΔH°_c): ΔH_rxn = ∑ΔH°_c(reactants) − ∑ΔH°_c(products)',
      ],
      steps: [
        'In calorimetry, ALWAYS insert mass of WATER heated into q = mcΔT, and use mass of FUEL burned strictly for n = m ÷ Mᵣ.',
        'Divide q in Joules by 1000 to convert to kJ, then compute ΔH = −q(kJ) ÷ n.',
        'In Hess’s Law cycles, double-check arrow direction: formation arrows point UP to compounds (products − reactants); combustion arrows point DOWN to CO₂/H₂O (reactants − products).',
        'Draw displayed formulas when counting bonds broken/formed so no C—H or C=O bond is miscounted.',
      ],
    },
    workedExample: {
      question: 'Burning 0.600 g of propan-1-ol (Mᵣ = 60.0) heats 150.0 g of water from 19.5 °C to 51.0 °C. Calculate the experimental enthalpy of combustion, ΔH_c.',
      steps: [
        'ΔT = 51.0 − 19.5 = 31.5 °C.',
        'Heat absorbed by water: q = 150.0 × 4.18 × 31.5 = 19,750.5 J = 19.7505 kJ.',
        'Moles of propan-1-ol burned: n = 0.600 ÷ 60.0 = 0.0100 mol.',
        'ΔH_c = −19.7505 ÷ 0.0100 = −1,975 kJ mol⁻¹ (−1.98 × 10³ kJ mol⁻¹).',
      ],
      answer: '−1975 kJ mol⁻¹',
    },
    examinerTips: {
      pitfalls: [
        'Putting the small mass of fuel burned (0.600 g) into q = mcΔT instead of the mass of water (150.0 g).',
        'Reversing the Hess Combustion cycle formula to (products − reactants) instead of (reactants − products).',
        'Forgetting the negative sign on exothermic combustion reactions or forgetting to divide J by 1000.',
      ],
      checklist: [
        'm_water used in q = mcΔT ; m_fuel used in n = m ÷ Mᵣ',
        'J converted cleanly to kJ (÷ 1000) before dividing by n',
        'Exothermic combustion ΔH carries an explicit minus (−) sign',
      ],
    },
  },

  'mechanisms-unit2': {
    title: 'AS Organic Mechanisms',
    unit: 'Unit 2.5',
    summary: 'Assign partial dipoles (δ⁺/δ⁻) and draw precise curly electron-pair arrows for electrophilic additions and nucleophilic substitutions.',
    appletSteps: [
      <><strong>Pick AS Reaction:</strong> Select from the 5 AS mechanisms (<em>Ethene + HBr</em>, <em>Propene + HBr</em>, <em>Bromoethane + OH⁻</em>, <em>Ethene + Br₂</em>, <em>Bromoethane + NH₃</em>).</>,
      <><strong>Stage 1 — Assign Dipoles:</strong> Tap highlighted bond nodes on the canvas to cycle <code>δ⁺</code> and <code>δ⁻</code> charges, then press <em>Verify assigned Dipoles</em>.</>,
      <><strong>Stage 2 — Draw Curly Arrows:</strong> Drag from the exact electron source (π-bond or lone pair) to the electron sink, adjust the curve with the start/mid/end handles, and click <em>Submit Mechanism Step</em>.</>,
    ],
    examMethod: {
      formulas: [
        'Curly arrow tail = pair of electrons (lone pair : or covalent bond)  →  Head = atom/bond sink',
        'Carbocation stability: Tertiary (3°) > Secondary (2°) > Primary (1°)',
      ],
      steps: [
        'Identify electronegativity dipoles on polar reagents (C^δ+—Br^δ−, H^δ+—Br^δ−) or temporary induced dipoles when Br₂ approaches a C=C π-bond.',
        'Start EVERY curly arrow strictly from a lone pair or bond line (never from a bare δ⁺/atom letter) and point to the δ⁺ atom or electrophile.',
        'Include heterolytic bond-cleavage arrows (e.g. H—Br bond → Br, or C—Br bond → Br) forming :Br⁻.',
        'For unsymmetrical alkenes (propene + HBr), route the hydrogen onto the less-substituted carbon to form the more stable secondary carbocation (positive inductive +I effect).',
      ],
    },
    workedExample: {
      question: 'Outline the two-step electrophilic addition mechanism of propene (CH₃CH=CH₂) with HBr to give the major product.',
      steps: [
        'Step 1: Arrow from C=C double bond to H^δ+ of H—Br, plus second arrow from H—Br bond onto Br^δ−. Forms secondary carbocation CH₃C⁺HCH₃ (not primary CH₃CH₂CH₂⁺) and :Br⁻.',
        'Step 2: Arrow from lone pair on :Br⁻ strictly to the positively charged C⁺ carbon, forming 2-bromopropane.',
      ],
      answer: '2-bromopropane (via secondary carbocation intermediate)',
    },
    examinerTips: {
      pitfalls: [
        'Drawing a curly arrow starting on δ⁺ or pointing backwards from the electrophile towards electrons.',
        'Forgetting the second arrow showing H—Br or C—Br bond fission onto the leaving bromine atom.',
        'Drawing a primary carbocation instead of the more stable secondary/tertiary carbocation for unsymmetrical alkenes.',
      ],
      checklist: [
        'Dipoles δ⁺ and δ⁻ labelled accurately on polarised/induced bonds',
        'Curly arrows originate strictly on lone pairs or π/σ bond lines',
        'Major carbocation intermediate reflects +I alkyl stabilisation (3° > 2° > 1°)',
      ],
    },
  },

  'half-equations': {
    title: 'Balancing Redox Half-Equations',
    unit: 'Unit 3.1',
    summary: 'Follow the 5-stage acidic-medium checklist (oxidation states, main atoms, H₂O, H⁺, e⁻) to build flawless half-equations.',
    appletSteps: [
      <><strong>Load Half-Reaction:</strong> Work step-by-step through the <strong>5 verification stages</strong> using the LHS/RHS selectors and coefficient inputs.</>,
      <><strong>Clear Each Checkpoint:</strong> Validate (1) Oxidation states, (2) Main-atom count, (3) Oxygen balance with <code>H₂O</code>, (4) Hydrogen balance with <code>H⁺</code>, and (5) Charge balance with <code>e⁻</code>.</>,
      <><strong>Inspect Final Equation:</strong> Check atom and net-charge equality across both sides before moving to a new half-equation.</>,
    ],
    examMethod: {
      formulas: [
        'OIL RIG: Oxidation Is Loss of electrons (e⁻ on RHS)  |  Reduction Is Gain (e⁻ on LHS)',
        'Acidic balancing sequence: 1. Main atoms  →  2. O via H₂O  →  3. H via H⁺  →  4. Charge via e⁻',
      ],
      steps: [
        'Assign oxidation states to confirm which species is oxidised/reduced (remember peroxides O = −1, hydrides H = −1).',
        'Balance all elements OTHER than O and H first (critical for Cr₂O₇²⁻ → 2Cr³⁺ and C₂O₄²⁻ → 2CO₂).',
        'Add H₂O molecules to whichever side lacks Oxygen atoms.',
        'Add H⁺ ions to whichever side now lacks Hydrogen atoms.',
        'Add electrons (e⁻, charge −1 each) to the MORE POSITIVE side until total LHS charge equals total RHS charge.',
      ],
    },
    workedExample: {
      question: 'Construct the balanced acidic half-equation for dichromate(VI) ions reducing to chromium(III) ions: Cr₂O₇²⁻ → Cr³⁺.',
      steps: [
        'Main atoms (Cr): Cr₂O₇²⁻ → 2Cr³⁺.',
        'Balance O (7 on LHS): Cr₂O₇²⁻ → 2Cr³⁺ + 7H₂O.',
        'Balance H (14 on RHS): Cr₂O₇²⁻ + 14H⁺ → 2Cr³⁺ + 7H₂O.',
        'Check net charge: LHS = (−2) + (+14) = +12  |  RHS = 2(+3) = +6. Add 6e⁻ to LHS.',
      ],
      answer: 'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O',
    },
    examinerTips: {
      pitfalls: [
        'Forgetting to double Cr³⁺ → 2Cr³⁺ before adding electrons (producing 3e⁻ instead of 6e⁻!).',
        'Adding O²⁻ or O₂ instead of H₂O when balancing Oxygen in aqueous acid.',
        'Adding electrons to make charge zero instead of making LHS total charge equal RHS total charge.',
      ],
      checklist: [
        'Non-H/non-O atoms (Cr, C, I, S) balanced first',
        'H₂O balances O ; H⁺ balances H',
        'Total ionic charge on LHS exactly equals total ionic charge on RHS',
      ],
    },
  },

  redox: {
    title: 'Volumetric Redox Titrations',
    unit: 'Unit 3.1',
    summary: 'Combine redox half-equations to find exact stoichiometric ratios and calculate purity, water of crystallisation, or molar mass.',
    appletSteps: [
      <><strong>Choose Redox System:</strong> Practise across 5 WJEC contexts (<em>Iron Purity</em>, <em>Ethanedioate</em>, <em>Hydrogen Peroxide</em>, <em>Copper/Thiosulfate</em>, <em>Molar Mass</em>) or press <em>Random 🎲</em>.</>,
      <><strong>Derive Stoichiometry:</strong> Balance electron transfer between oxidant and reductant, compute moles in the titre, and scale for volumetric flask aliquots.</>,
      <><strong>Audit Working:</strong> Submit via <em>ScientificInput</em> and open the expandable <em>Show Worked Solution</em> panel to inspect every step.</>,
    ],
    examMethod: {
      formulas: [
        'MnO₄⁻ : Fe²⁺ = 1 : 5     |     MnO₄⁻ : C₂O₄²⁻ = 2 : 5     |     MnO₄⁻ : H₂O₂ = 2 : 5',
        'Cr₂O₇²⁻ : Fe²⁺ = 1 : 6    |     Cu²⁺ : I₂ : S₂O₃²⁻ = 2 : 1 : 2   ⇒   Cu²⁺ : S₂O₃²⁻ = 1 : 1',
      ],
      steps: [
        'Calculate moles of the standard titrant (e.g. KMnO₄ or Na₂S₂O₃) using n = c × V(cm³) ÷ 1000.',
        'Multiply by the exact mole ratio obtained by equalising e⁻ in the two half-equations.',
        'If a 25.0 cm³ aliquot was taken from a 250 cm³ flask, multiply aliquot moles by 10 before computing mass, Mᵣ, or % purity.',
        'For iodine-thiosulfate back/indirect titrations: 2S₂O₃²⁻ reacts with 1I₂, and 2Cu²⁺ liberates 1I₂, giving a 1:1 overall Cu²⁺ : S₂O₃²⁻ ratio.',
      ],
    },
    workedExample: {
      question: '25.0 cm³ of Fe²⁺ solution (from 2.80 g iron ore dissolved to 250 cm³) reacts with 20.00 cm³ of 0.0200 mol dm⁻³ KMnO₄ in acid. Calculate % purity of Fe (Aᵣ = 55.8).',
      steps: [
        'n(MnO₄⁻) = 0.0200 × (20.00 ÷ 1000) = 4.00 × 10⁻⁴ mol.',
        'Since MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺ (1:5 ratio), n(Fe²⁺ in 25 cm³) = 5 × 4.00 × 10⁻⁴ = 2.00 × 10⁻³ mol.',
        'Scale to 250 cm³ flask (×10): n(Fe²⁺ total) = 0.0200 mol.',
        'Mass of Fe = 0.0200 × 55.8 = 1.116 g → % Fe = (1.116 ÷ 2.80) × 100 = 39.9%.',
      ],
      answer: '39.9% Fe',
    },
    examinerTips: {
      pitfalls: [
        'Using a 1:1 ratio instead of 1:5 (MnO₄⁻:Fe²⁺) or 2:5 (MnO₄⁻:C₂O₄²⁻).',
        'Halving or doubling Cu²⁺:S₂O₃²⁻ wrongly instead of remembering 2Cu²⁺ → I₂ → 2S₂O₃²⁻ means 1:1.',
        'Omitting the 250 cm³ / 25.0 cm³ (×10) flask scaling factor before calculating sample mass.',
      ],
      checklist: [
        'Balanced overall redox equation used to confirm exact mole ratio',
        'Flask vs pipette scaling factor (e.g. ×10) applied once cleanly',
        'Final mass, % purity, or Mᵣ rounded to 3 significant figures',
      ],
    },
  },

  'cell-potentials': {
    title: 'Electrode Potentials & Cell Feasibility',
    unit: 'Unit 3.1',
    summary: 'Calculate E°_cell with sign and precision, build IUPAC cell notation (ROOR), and evaluate thermodynamic feasibility and concentration shifts.',
    appletSteps: [
      <><strong>Choose Mode:</strong> Toggle between <em>Calculate E°_cell</em>, <em>IUPAC Cell Notation</em>, and <em>Feasibility &amp; Le Chatelier Shifts</em>.</>,
      <><strong>Inspect Half-Cells:</strong> Read the two reduction E° cards and trace electron flow along the interactive electrochemical cell diagram.</>,
      <><strong>Format Strictly:</strong> In <em>Calculate E°_cell</em>, always include an explicit <code>+</code> or <code>−</code> sign and exactly <strong>2 decimal places</strong> (e.g. <code>+1.10</code>).</>,
    ],
    examMethod: {
      formulas: [
        'E°_cell = E°(more positive / reduction RHE) − E°(more negative / oxidation LHE)',
        'Standard notation (ROOR):  Reduced | Oxidised || Oxidised | Reduced   (with Pt(s) if no solid metal electrode)',
      ],
      steps: [
        'Compare standard reduction potentials (check the Data Booklet Electrode Potentials table): the more positive half-cell goes forward (reduction); the less positive/more negative reverses (oxidation).',
        'Calculate E°_cell = E°(reduction) − E°(oxidation); NEVER multiply E° values by stoichiometric coefficients.',
        'Write IUPAC cell notation left-to-right: oxidation half-cell on LHS (negative electrode), salt bridge ||, reduction half-cell on RHS (positive electrode); use commas `,` between same-phase aqueous ions and `|` for phase boundaries.',
        'Predict concentration shifts: increasing reactant ion concentration drives that half-cell forward, shifting its E value more positive.',
      ],
    },
    workedExample: {
      question: 'Given Fe³⁺(aq)/Fe²⁺(aq) E° = +0.77 V and Cr³⁺(aq)/Cr(s) E° = −0.74 V, determine E°_cell, write the cell notation, and give the overall spontaneous equation.',
      steps: [
        'Reduction (more positive): Fe³⁺ + e⁻ → Fe²⁺ (+0.77 V). Oxidation (more negative): Cr → Cr³⁺ + 3e⁻ (−0.74 V).',
        'E°_cell = +0.77 − (−0.74) = +1.51 V.',
        'LHS has Cr(s) | Cr³⁺(aq) ; RHS has only aqueous ions, so add an inert Pt(s) electrode and comma separator.',
      ],
      answer: 'E°_cell = +1.51 V  ;  Cr(s) | Cr³⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Pt(s)  ;  Cr + 3Fe³⁺ → Cr³⁺ + 3Fe²⁺',
    },
    examinerTips: {
      pitfalls: [
        'Multiplying E° by 3 when multiplying a half-equation by 3 (E° is intensive and NEVER multiplied!).',
        'Writing `1.1` instead of `+1.10` (missing the `+` sign or 2 decimal places).',
        'Forgetting inert `Pt(s)` electrodes on ion/ion or gas/ion half-cells (such as Fe³⁺/Fe²⁺ or Cl₂/Cl⁻), or confusing E°_cell > 0 (thermodynamically feasible) with fast reaction rate (high E_a can still block a reaction!).',
      ],
      checklist: [
        'E° values never multiplied by balancing coefficients',
        'Cell EMF written with explicit +/− sign and 2 decimal places',
        'Pt(s) and phase bars `|` / `,` placed accurately in cell diagrams',
      ],
    },
  },

  rates: {
    title: 'Reaction Rates, Orders & Arrhenius',
    unit: 'Unit 3.5',
    summary: 'Deduce rate equations from initial-rate tables, derive k units dynamically, and pass the Arrhenius Kelvin Unit Gate to find E_a.',
    appletSteps: [
      <><strong>Choose Kinetics Mode:</strong> Switch between <em>Rate Constant k &amp; Units</em>, <em>Determine Reaction Order</em>, and <em>Arrhenius Equation</em>.</>,
      <><strong>Select k Units:</strong> In <em>Calculate k</em>, input the numerical rate constant in <em>ScientificInput</em> AND click the matching unit pill (e.g. <code>mol⁻¹ dm³ s⁻¹</code>).</>,
      <><strong>Arrhenius Unit Gate:</strong> In <em>Arrhenius</em> mode, convert Celsius to <strong>K</strong> and verify <code>ln(k/A)</code> at Step 1 before solving for activation energy E_a in kJ mol⁻¹.</>,
    ],
    examMethod: {
      formulas: [
        'rate = k [A]^m [B]^n       |       units of k = (mol dm⁻³ s⁻¹) ÷ (mol dm⁻³)^(m+n)',
        'k = A e^(−E_a / RT)       ⇔       ln k = ln A − (E_a / R)(1 / T)',
        'Two-temperature form:  E_a = −R × T × ln(k / A)   (R = 8.31 J mol⁻¹ K⁻¹, ÷ 1000 for kJ mol⁻¹)',
      ],
      steps: [
        'Compare two experimental rows where only one concentration varies: if [X] × f multiplies initial rate by f^n, the order in X is n (n = 0 if rate unchanged; n = 1 if linear; n = 2 if squared).',
        'If no pair isolates B cleanly, scale the known effect of A first, then attribute the remaining rate factor to B.',
        'Plug any experimental row into rate = k[A]^m[B]^n to solve k, and cancel powers of (mol dm⁻³) algebraically for units.',
        'In Arrhenius problems, multiply gradient of (ln k vs 1/T) by −R (8.31), then ALWAYS divide by 1000 to report E_a in kJ mol⁻¹.',
      ],
    },
    workedExample: {
      question: 'For A + 2B → C, rate = k[A]²[B]⁰. Exp 1 has [A] = 0.20 mol dm⁻³, [B] = 0.40 mol dm⁻³, initial rate = 3.2 × 10⁻³ mol dm⁻³ s⁻¹. Calculate k with units.',
      steps: [
        'Omit zero-order [B]⁰ from rate expression: rate = k[A]².',
        'k = rate ÷ [A]² = (3.2 × 10⁻³) ÷ (0.20)² = (3.2 × 10⁻³) ÷ 0.040 = 0.080 (8.0 × 10⁻²).',
        'Units = (mol dm⁻³ s⁻¹) ÷ (mol dm⁻³)² = mol⁻¹ dm³ s⁻¹.',
      ],
      answer: 'k = 8.0 × 10⁻² mol⁻¹ dm³ s⁻¹',
    },
    examinerTips: {
      pitfalls: [
        'Leaving E_a in J mol⁻¹ instead of dividing by 1000 to report kJ mol⁻¹ (since R = 8.31 J mol⁻¹ K⁻¹).',
        'Forgetting to convert Arrhenius temperature from °C into Kelvin (+273).',
        'Comparing two experiment rows where BOTH [A] and [B] change without adjusting for A’s factor first.',
      ],
      checklist: [
        'Overall reaction order used to cancel (mol dm⁻³) powers for k units',
        'Arrhenius temperature converted to Kelvin and E_a divided by 1000 for kJ mol⁻¹',
        'Scientific notation formatted cleanly using ×10ˣ when k is very small or large',
      ],
    },
  },

  'born-haber': {
    title: 'Born-Haber Cycles & Solution Enthalpy',
    unit: 'Unit 3.6',
    summary: 'Master Born-Haber stoichiometry multipliers (×2 for Group 2 halides), lattice sign conventions, and hydration-solution cycles.',
    appletSteps: [
      <><strong>Pick Cycle Mode:</strong> Toggle between <em>Born-Haber Cycle</em> (solving for ΔH_latt or ΔH_f) and <em>Enthalpy of Solution</em> (ΔH_sol / ΔH_hyd).</>,
      <><strong>Pass Step 1 Stoichiometry &amp; Sign Gate:</strong> Choose the correct <code>×1</code> / <code>×2</code> multipliers for atomisation and electron affinity, and confirm lattice sign convention (<em>Negative</em> for formation, <em>Positive</em> for dissociation).</>,
      <><strong>Solve Step 2:</strong> Apply Hess’s Law around the cycle and enter your final enthalpy in kJ mol⁻¹.</>,
    ],
    examMethod: {
      formulas: [
        'Born-Haber (lattice formation): ΔH°_f = ΔH_at(M) + ∑IE(M) + n·ΔH_at(X) + n·∑EA(X) + ΔH_latt(form)',
        'Dissolution Hess cycle: ΔH°_sol = ΔH_latt(dissociation) + ∑ΔH_hyd = −ΔH_latt(formation) + ∑ΔH_hyd',
      ],
      steps: [
        'Check the metal and non-metal formula subscripts FIRST: CaCl₂ requires 2 × ΔH_at(Cl) and 2 × EA₁(Cl); Na₂O requires 2 × ΔH_at(Na) and 2 × IE₁(Na).',
        'Double-check definition wording: standard **atomisation** (½Cl₂(g) → Cl(g)) is NOT doubled unless forming 2 Cl(g), whereas **bond dissociation** Cl₂(g) → 2Cl(g) already makes 2 moles of atoms!',
        'Verify signs: IE₁, IE₂, ΔH_at, and EA₂(O⁻ → O²⁻) are ENDOTHERMIC (+); EA₁ and lattice formation are EXOTHERMIC (−); lattice dissociation is ENDOTHERMIC (+).',
        'Sum all cycle steps along the alternative route equal to ΔH°_f, then rearrange carefully for the missing term.',
      ],
    },
    workedExample: {
      question: 'Calculate ΔH_latt(formation) of MgCl₂(s) given: ΔH°_f = −641, ΔH_at(Mg) = +148, IE₁+IE₂(Mg) = +2189, ΔH_at(Cl) = +122, EA₁(Cl) = −349 kJ mol⁻¹.',
      steps: [
        'Multiply chlorine terms by 2 (two Cl⁻ per MgCl₂): 2 × ΔH_at(Cl) = +244 ; 2 × EA₁(Cl) = −698.',
        'Write Hess sum: −641 = (+148) + (+2189) + (+244) + (−698) + ΔH_latt.',
        'ΔH_latt = −641 − (1,883) = −2,524 kJ mol⁻¹.',
      ],
      answer: 'ΔH_latt(formation) = −2,524 kJ mol⁻¹',
    },
    examinerTips: {
      pitfalls: [
        'Forgetting to multiply ΔH_at and EA₁ by 2 for divalent halides (MgCl₂, CaBr₂) or metal terms by 2 for M₂O.',
        'Reversing the sign of lattice enthalpy (confusing lattice formation − with lattice dissociation +) or treating EA₂(O⁻ → O²⁻) as exothermic instead of endothermic (+).',
        'Mixing up ΔH_at(Cl) (per mole of atoms) with bond enthalpy E(Cl—Cl) (per mole of Cl₂ molecules).',
      ],
      checklist: [
        'Formula stoichiometry multipliers (×2) applied to BOTH atomisation and EA/IE',
        'Lattice formation (−) vs lattice dissociation (+) convention checked before ΔH_sol = ΔH_latt(diss) + ∑ΔH_hyd',
        'All signs verified (+ endothermic vs − exothermic)',
      ],
    },
  },

  'entropy-gibbs': {
    title: 'Entropy & Gibbs Free Energy',
    unit: 'Unit 3.7',
    summary: 'Compute ΔS°_sys and ΔG° = ΔH° − TΔS° using the Unit Gate (J → kJ, °C → K), calculate feasibility temperatures, and explore ΔH/ΔS quadrants.',
    appletSteps: [
      <><strong>Choose Trainer or Explorer:</strong> Practise exam calculations in <em>Exam Question Trainer</em> (filter <em>Authentic Only</em> or <em>Expanded</em>), or visualise ΔH/ΔS/T relationships in the <em>Quadrant Explorer</em>.</>,
      <><strong>Clear Step 1 Unit Gate:</strong> Convert <code>ΔS°</code> from <strong>J K⁻¹ mol⁻¹</strong> into <strong>kJ K⁻¹ mol⁻¹</strong> (÷ 1000) and temperature into <strong>Kelvin</strong> (+ 273) first.</>,
      <><strong>Solve ΔG &amp; Feasibility:</strong> Calculate ΔG° in kJ mol⁻¹ and classify whether the reaction is thermodynamically feasible (<code>ΔG ≤ 0</code>) or calculate the crossover temperature.</>,
    ],
    examMethod: {
      formulas: [
        'ΔS°_system = ∑S°(products) − ∑S°(reactants)     (units: J K⁻¹ mol⁻¹)',
        'ΔG° = ΔH° − T × (ΔS° ÷ 1000)     (gives ΔG° in kJ mol⁻¹)',
        'Feasible when ΔG° ≤ 0     |     Minimum / crossover temperature: T_K = ΔH°(J) ÷ ΔS°(J K⁻¹) = ΔH°(kJ) ÷ ΔS°(kJ K⁻¹)',
      ],
      steps: [
        'Compute ΔS°_system as Products minus Reactants (remember to multiply each S° by its stoichiometric coefficient!).',
        'Divide ΔS° by 1000 immediately to align units with ΔH° (kJ mol⁻¹), and convert T into Kelvin (+ 273).',
        'Substitute into ΔG° = ΔH° − TΔS°. State explicitly: "Reaction is feasible because ΔG° ≤ 0" (or not feasible because ΔG° > 0).',
        'To find crossover temperature, set ΔG° = 0 so T = ΔH° ÷ ΔS° (convert back with − 273 if °C is requested).',
      ],
    },
    workedExample: {
      question: 'For CaCO₃(s) → CaO(s) + CO₂(g), ΔH° = +178 kJ mol⁻¹ and ΔS° = +160.4 J K⁻¹ mol⁻¹. Calculate ΔG° at 298 K and find the minimum decomposition temperature in °C.',
      steps: [
        'Convert ΔS° to kJ: +160.4 ÷ 1000 = +0.1604 kJ K⁻¹ mol⁻¹.',
        'At 298 K: ΔG° = +178 − (298 × 0.1604) = +178 − 47.8 = +130.2 kJ mol⁻¹ (not feasible at 298 K since ΔG° > 0).',
        'Minimum T (where ΔG° = 0): T = 178 ÷ 0.1604 = 1,110 K → 1,110 − 273 = 837 °C.',
      ],
      answer: 'ΔG°(298 K) = +130 kJ mol⁻¹ (not feasible)  ;  T_min = 837 °C (1,110 K)',
    },
    examinerTips: {
      pitfalls: [
        'Forgetting to divide ΔS° by 1000 before multiplying by T (creating a 1000× unit mismatch between J and kJ!).',
        'Computing ΔS° backwards as (reactants − products) instead of (products − reactants).',
        'Leaving crossover temperature T in Kelvin when the mark scheme asks for °C (or forgetting +273 in ΔG° = ΔH° − TΔS°).',
      ],
      checklist: [
        'ΔS° multiplied by stoichiometry and computed as ∑Products − ∑Reactants',
        'ΔS° divided by 1000 (kJ K⁻¹ mol⁻¹) and T in Kelvin (+ 273)',
        'Feasibility linked explicitly to ΔG ≤ 0 (or crossover T = ΔH ÷ ΔS)',
      ],
    },
  },

  'kc-calc': {
    title: 'Kc Equilibrium Calculations',
    unit: 'Unit 3.8',
    summary: 'Build ICE tables, divide equilibrium moles by container volume V, solve Kc/missing concentrations, and determine composite units.',
    appletSteps: [
      <><strong>Pick Kc Task:</strong> Switch across <em>ICE Table</em>, <em>Direct Kc</em>, <em>Find Missing Species</em>, and <em>Predict Units</em>, or click <em>Random 🎲</em>.</>,
      <><strong>Predict Units Stepper:</strong> In <em>Predict Units</em> mode, use the <code>mol</code>, <code>dm</code>, and <code>s</code> power steppers to match the sorted equilibrium unit preview.</>,
      <><strong>Enter Answer:</strong> Always convert moles to concentrations (÷ volume V in dm³) before inputting Kc into <em>ScientificInput</em>.</>,
    ],
    examMethod: {
      formulas: [
        'For aA + bB ⇌ cC + dD:   Kc = ([C]^c [D]^d) ÷ ([A]^a [B]^b)',
        '[X]_eq = n_eq(X) ÷ V_container(dm³)',
      ],
      steps: [
        'Construct an ICE table (Initial moles, Change using balanced mole ratios, Equilibrium moles).',
        'Check whether the problem gives equilibrium MOLES or CONCENTRATIONS; if moles are given, divide EVERY equilibrium species by total vessel volume V (in dm³).',
        'Omit pure solids (s) or pure liquid solvents from heterogeneous Kc expressions.',
        'Substitute [ ]_eq into Kc and simplify (mol dm⁻³)^(Δn) carefully (mol dm⁻³ denominator gives negative mol exponent and positive dm exponent, e.g. mol⁻¹ dm³).',
      ],
    },
    workedExample: {
      question: '0.80 mol SO₂ and 0.60 mol O₂ are heated in a 2.00 dm³ vessel: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g). At equilibrium, 0.50 mol SO₃ has formed. Calculate Kc with units.',
      steps: [
        'ICE moles: Δ(SO₃) = +0.50 → Δ(SO₂) = −0.50 (leaves 0.30 mol) ; Δ(O₂) = −0.25 (leaves 0.35 mol).',
        'Divide all by V = 2.00 dm³: [SO₃] = 0.250 ; [SO₂] = 0.150 ; [O₂] = 0.175 mol dm⁻³.',
        'Kc = (0.250)² ÷ [(0.150)² × (0.175)] = 0.0625 ÷ 0.0039375 = 15.9.',
        'Units: (mol dm⁻³)² ÷ (mol dm⁻³)³ = (mol dm⁻³)⁻¹ = mol⁻¹ dm³.',
      ],
      answer: 'Kc = 15.9 mol⁻¹ dm³',
    },
    examinerTips: {
      pitfalls: [
        'Plugging equilibrium MOLES straight into Kc without dividing by vessel volume V (fails whenever reactant and product mole counts differ!).',
        'Forgetting stoichiometric exponents inside Kc (e.g. missing ² on [SO₃]² or [SO₂]²).',
        'Inverting unit signs when cancelling denominator powers (writing mol dm⁻³ instead of mol⁻¹ dm³).',
      ],
      checklist: [
        'ICE change row follows the balanced stoichiometry ratios',
        'Every equilibrium mole quantity divided by total volume V (dm³)',
        'Power indices and derived Kc units (mol^x dm^y) double-checked',
      ],
    },
  },

  'kp-calc': {
    title: 'Gas Equilibria & Kp Calculations',
    unit: 'Unit 3.8',
    summary: 'Track total gas moles, compute mole fractions (x_i) and partial pressures (p_i), and evaluate Kp including degree-of-dissociation α problems.',
    appletSteps: [
      <><strong>Choose Kp Mode:</strong> Toggle between <em>Direct Kp</em>, <em>Mole Fractions</em>, and <em>Dissociation (α)</em>, or press <em>Random 🎲</em>.</>,
      <><strong>Compute Partial Pressures:</strong> Sum ONLY gaseous equilibrium moles for n_total, compute x_i = n_i ÷ n_total, then multiply by total pressure P.</>,
      <><strong>Verify Kp:</strong> Enter Kp via <em>ScientificInput</em> (using <em>×10ˣ</em> for extreme constants).</>,
    ],
    examMethod: {
      formulas: [
        'Mole fraction: x_i = n_i(gas) ÷ n_total(gas)      (check ∑x_i = 1)',
        'Partial pressure: p_i = x_i × P_total',
        'Kp = (p_C)^c (p_D)^d ÷ (p_A)^a (p_B)^b     (curved parentheses p(...), NEVER [ ]!)',
      ],
      steps: [
        'Set up an ICE mole table; if given degree of dissociation α, fraction reacted = α × n_initial.',
        'Calculate n_total by summing equilibrium moles of GASES ONLY (exclude any solids or liquids).',
        'Find each gas’s partial pressure p_i = (n_i ÷ n_total) × P_total (verify ∑p_i = P_total).',
        'Substitute partial pressures into the Kp expression using rounded parentheses and derive pressure units (e.g. kPa⁻¹, atm, Pa²).',
      ],
    },
    workedExample: {
      question: '1.00 mol N₂O₄(g) is 25.0% dissociated at equilibrium at 200 kPa: N₂O₄(g) ⇌ 2NO₂(g). Calculate Kp with units.',
      steps: [
        'Dissociated N₂O₄ = 0.250 mol → eq moles: N₂O₄ = 0.750 mol ; NO₂ = 2 × 0.250 = 0.500 mol.',
        'Total gas moles n_total = 0.750 + 0.500 = 1.250 mol.',
        'Partial pressures: p(N₂O₄) = (0.750 ÷ 1.250) × 200 = 120 kPa ; p(NO₂) = (0.500 ÷ 1.250) × 200 = 80.0 kPa.',
        'Kp = p(NO₂)² ÷ p(N₂O₄) = 80.0² ÷ 120 = 53.3 kPa.',
      ],
      answer: 'Kp = 53.3 kPa',
    },
    examinerTips: {
      pitfalls: [
        'Writing square concentration brackets `[NO₂]` inside a Kp expression (automatic mark loss — must use `p(NO₂)` or `pNO₂`).',
        'Dividing by initial moles instead of total equilibrium gas moles n_total when finding mole fractions.',
        'Including solid moles inside n_total or p_i in heterogeneous gas equilibria (e.g. CaCO₃ decomposition).',
      ],
      checklist: [
        'Only gaseous species included in n_total and Kp',
        'Sum of calculated partial pressures equals P_total',
        'Curved brackets p(X) used in written expressions and pressure units included',
      ],
    },
  },

  acids: {
    title: 'Acids, Bases, Kw & Weak-Acid pH',
    unit: 'Unit 3.9',
    summary: 'Calculate pH for strong acids/bases, weak acids via Ka, pure water at varied temperatures via Kw, and convert smoothly between Ka and pKa.',
    appletSteps: [
      <><strong>Generate Variant:</strong> Click <em>🎲 New Variant</em> or select modes covering <em>Strong Acid/Base</em>, <em>Weak Acid (Ka)</em>, <em>Buffer</em>, <em>Kw vs Temperature</em>, and <em>Ka ↔ pKa Conversions</em>.</>,
      <><strong>Match Formula to Species:</strong> Identify whether the solute dissociates fully (strong) or partially (weak Ka) before finding [H⁺].</>,
      <><strong>Input Precision:</strong> Report pH to 2 decimal places, and enter small Ka / [H⁺] values cleanly with <em>ScientificInput</em> (<em>×10ˣ</em>).</>,
    ],
    examMethod: {
      formulas: [
        'pH = −log₁₀[H⁺]     ⇔     [H⁺] = 10^(−pH)',
        'Strong acid: [H⁺] = [HA]  (×2 for H₂SO₄)     |     Strong base: [H⁺] = Kw ÷ [OH⁻]',
        'Weak acid (HA): Ka = [H⁺]² ÷ [HA]   ⇒   [H⁺] = √(Ka × [HA])     |     pKa = −log₁₀Ka',
        'Pure water at any T: Kw = [H⁺]²   ⇒   [H⁺] = √Kw   (always neutral!)',
      ],
      steps: [
        'Classify the species first: strong acid (HCl, HNO₃, H₂SO₄), strong base (NaOH, KOH, Ba(OH)₂), weak acid (Ka or pKa given), or pure water (Kw given).',
        'If pKa is given, convert immediately via Ka = 10^(−pKa).',
        'For strong bases, compute [OH⁻] first (×2 for Ba(OH)₂), then divide Kw (1.00 × 10⁻¹⁴ at 298 K) by [OH⁻] to find [H⁺].',
        'Take −log₁₀[H⁺] and report pH strictly to 2 decimal places.',
      ],
    },
    workedExample: {
      question: 'Calculate the pH of (a) 0.0500 mol dm⁻³ Ba(OH)₂ at 298 K (Kw = 1.00 × 10⁻¹⁴), and (b) 0.120 mol dm⁻³ propanoic acid (pKa = 4.87).',
      steps: [
        '(a) Ba(OH)₂ releases 2 OH⁻: [OH⁻] = 2 × 0.0500 = 0.100 mol dm⁻³ → [H⁺] = (1.00 × 10⁻¹⁴) ÷ 0.100 = 1.00 × 10⁻¹³ → pH = 13.00.',
        '(b) Ka = 10^(−4.87) = 1.349 × 10⁻⁵ mol dm⁻³.',
        '[H⁺] = √(1.349 × 10⁻⁵ × 0.120) = 1.272 × 10⁻³ mol dm⁻³ → pH = −log₁₀(1.272 × 10⁻³) = 2.90.',
      ],
      answer: '(a) pH = 13.00   |   (b) pH = 2.90',
    },
    examinerTips: {
      pitfalls: [
        'Forgetting to double [OH⁻] for Ba(OH)₂ or double [H⁺] for H₂SO₄.',
        'Using [H⁺] = √(Ka[HA]) on a strong acid or buffer solution, or claiming heated pure water with pH 6.3 is "acidic" (it stays neutral because [H⁺] = [OH⁻]!).',
        'Rounding pH values to 1 decimal place instead of the WJEC-expected 2 decimal places.',
      ],
      checklist: [
        'Diprotic/dibasic stoichiometry (×2) checked on H₂SO₄ or Ba(OH)₂',
        'pKa converted accurately via 10^(−pKa)',
        'Final pH reported to 2 decimal places',
      ],
    },
  },

  buffers: {
    title: 'Acidic Buffer Calculations',
    unit: 'Unit 3.9',
    summary: 'Compute buffer pH from acid/conjugate-salt mixtures, solid salt additions, and small strong-acid or strong-alkali perturbations.',
    appletSteps: [
      <><strong>Choose Buffer Scenario:</strong> Switch between <em>Acid + Salt Mixture</em>, <em>Solid Salt Mass</em>, and <em>+NaOH / +HCl Perturbation</em>, or click <em>Random 🎲</em>.</>,
      <><strong>Track Exact Moles:</strong> Work directly with moles of weak acid <em>n(HA)</em> and conjugate base <em>n(A⁻)</em> so mixing dilution cancels cleanly.</>,
      <><strong>Verify pH:</strong> Enter final pH to 2 decimal places and check the feedback ratio if needed.</>,
    ],
    examMethod: {
      formulas: [
        '[H⁺] = Ka × (n_acid ÷ n_salt)   =   Ka × ([HA] ÷ [A⁻])',
        'Add x mol OH⁻:  n(HA)_new = n(HA) − x   ;   n(A⁻)_new = n(A⁻) + x',
        'Add x mol H⁺:   n(HA)_new = n(HA) + x   ;   n(A⁻)_new = n(A⁻) − x',
      ],
      steps: [
        'Calculate initial moles of weak acid HA and conjugate salt A⁻ (if solid salt mass is given, n = mass ÷ Mᵣ; if formed by partial neutralisation of excess HA by NaOH, remember n(A⁻) = n(NaOH added) and n(HA)_left = n(HA)_init − n(NaOH)).',
        'NEVER take the square root √(Ka × [HA]) for a buffer — [H⁺] ≠ [A⁻]!',
        'When small NaOH or HCl is added, adjust n(HA) and n(A⁻) oppositely by x moles BEFORE substituting into [H⁺] = Ka × (n_HA ÷ n_A⁻).',
        'Note the half-equivalence shortcut: whenever n(HA) = n(A⁻), [H⁺] = Ka and pH = pKa.',
      ],
    },
    workedExample: {
      question: 'A buffer contains 0.0400 mol CH₃COOH (Ka = 1.75 × 10⁻⁵) and 0.0300 mol CH₃COONa in 500 cm³. Calculate its pH after adding 0.0050 mol NaOH.',
      steps: [
        'OH⁻ neutralises CH₃COOH to form CH₃COO⁻: n(HA)_new = 0.0400 − 0.0050 = 0.0350 mol ; n(A⁻)_new = 0.0300 + 0.0050 = 0.0350 mol.',
        'Substitute directly in moles (500 cm³ cancels): [H⁺] = 1.75 × 10⁻⁵ × (0.0350 ÷ 0.0350) = 1.75 × 10⁻⁵ mol dm⁻³.',
        'pH = −log₁₀(1.75 × 10⁻⁵) = 4.76 (half-equivalence: pH = pKa!).',
      ],
      answer: 'pH = 4.76',
    },
    examinerTips: {
      pitfalls: [
        'Using the weak-acid square-root formula [H⁺] = √(Ka[HA]) instead of [H⁺] = Ka × ([HA]/[A⁻]).',
        'Forgetting to recalculate diluted concentrations when mixing two aqueous solutions (solving directly in moles n_HA / n_A⁻ avoids this completely!).',
        'Increasing n(HA) when adding NaOH instead of subtracting x from HA and adding x to A⁻.',
      ],
      checklist: [
        'Both n(HA) and n(A⁻) adjusted oppositely after +OH⁻ or +H⁺ addition',
        'Same total volume verified (or worked cleanly via mole ratio n_HA ÷ n_A⁻)',
        'Final pH reported to 2 decimal places',
      ],
    },
  },

  'chiral-centers': {
    title: 'Optical Isomerism & Chiral Centres',
    unit: 'Unit 4.1',
    summary: 'Inspect displayed/skeletal structures to identify sp³ asymmetric carbons bonded to four distinct chemical groups.',
    appletSteps: [
      <><strong>Inspect Numbered Nodes:</strong> Examine every carbon node (<code>C1</code>, <code>C2</code>, ...) on the interactive structure diagram, paying attention to implicit hydrogens.</>,
      <><strong>Toggle Chiral Centres:</strong> Click each carbon suspected of chirality to highlight it (or leave all unselected if the molecule is achiral/symmetrical).</>,
      <><strong>Check Configuration:</strong> Press <em>Verify Configuration</em> to confirm, then <em>Next Molecule</em> for a fresh challenge.</>,
    ],
    examMethod: {
      formulas: [
        'Chiral carbon conditions: (1) sp³ hybridised (4 single bonds) AND (2) 4 non-identical substituent groups',
      ],
      steps: [
        'Immediately rule out every carbon in C=O, C=C, C≡N, aromatic rings (benzene), or CH₃ / CH₂ groups (two or three identical H atoms!).',
        'Check remaining CH or quaternary carbons by listing ALL four complete attached branches (trace all the way to the ends, not just the first bonded atom!).',
        'For cyclic rings, walk BOTH clockwise and anticlockwise around the ring from the candidate carbon; if the two ring paths differ in substituent sequence or length, those two branches count as different groups.',
      ],
    },
    workedExample: {
      question: 'Identify the chiral carbon(s) in 2-hydroxybutanoic acid, CH₃—CH₂—CH(OH)—COOH, and explain why C1 and C3 are achiral.',
      steps: [
        'C1 (—COOH) has a C=O double bond (only 3 bonded atoms → achiral).',
        'C2 (—CH(OH)—) has four single bonds to four distinct groups: —H, —OH, —COOH, and —CH₂CH₃ → CHIRAL (*).',
        'C3 (—CH₂—) has two identical —H atoms (achiral) ; C4 (—CH₃) has three identical —H atoms (achiral).',
      ],
      answer: 'Only C2 is a chiral centre',
    },
    examinerTips: {
      pitfalls: [
        'Labelling a carbonyl carbon (C=O) or alkene carbon (C=C) as chiral just because its 3 attached substituents are different.',
        'Stopping after the first bond along a chain and assuming —CH₂CH₃ and —CH₂CH₂OH are identical because both start with CH₂.',
        'Missing chirality in substituted rings where clockwise and anticlockwise paths encounter a substituent at different distances.',
      ],
      checklist: [
        'Confirmed sp³ geometry (4 single bonds — no C=O, C=C, or benzene carbons selected)',
        'All 4 full branches traced to confirm zero duplicates',
        'Cyclic clockwise vs anticlockwise ring paths compared cleanly',
      ],
    },
  },

  'mechanisms-masterclass': {
    title: 'A2 Organic Mechanisms',
    unit: 'Unit 4.4',
    summary: 'Master nucleophilic addition (HCN + carbonyls), electrophilic aromatic substitution (benzene nitration/bromination), and SN1 mechanisms.',
    appletSteps: [
      <><strong>Pick A2 Reaction:</strong> Choose from the 5 A2 mechanisms (<em>HCN + Ethanal</em>, <em>Benzene Nitration</em>, <em>SN1 Tertiary Haloalkane Fission</em>, <em>HCN + Propanone</em>, <em>Benzene Bromination</em>).</>,
      <><strong>Stage 1 — Assign Dipoles:</strong> Tap highlighted sites to place <code>δ⁺</code>, <code>δ⁻</code>, or formal charges and click <em>Verify assigned Dipoles</em>.</>,
      <><strong>Stage 2 — Draw Curly Arrows:</strong> Drag from the exact electron source (:CN⁻ carbon, π-ring, or breaking bond) to the electron sink, tune the curve handles, and click <em>Submit Mechanism Step</em>.</>,
    ],
    examMethod: {
      formulas: [
        'Carbonyl + HCN: :CN⁻ attacks C^δ+ (nucleophilic addition) → planar C=O gives racemic mixture if aldehyde/unsymmetrical ketone',
        'Benzene + E⁺ (NO₂⁺ / Br⁺): π-ring → E⁺  ⇒  horseshoe Wheland intermediate  ⇒  C—H bond returns to ring',
      ],
      steps: [
        'For carbonyl + HCN, draw the first arrow strictly from the lone pair on the CARBON of :CN⁻ (not N!) to C^δ+, simultaneous with the π-bond C=O arrow moving onto O^δ−; then protonate :O⁻ with H—CN or H⁺.',
        'For benzene nitration/halogenation, know the inorganic catalyst equations: HNO₃ + 2H₂SO₄ → NO₂⁺ + 2HSO₄⁻ + H₃O⁺, and Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻.',
        'Draw the aromatic intermediate horseshoe broken specifically opposite/around the tetrahedral C(H)(E) carbon (spanning the 5 remaining ring carbons) with `+` inside, then draw the arrow from the C—H σ-bond BACK into the ring.',
      ],
    },
    workedExample: {
      question: 'Outline the mechanism for nitration of benzene using NO₂⁺ generated from concentrated HNO₃ and H₂SO₄.',
      steps: [
        'Electrophile generation: HNO₃ + 2H₂SO₄ → NO₂⁺ + 2HSO₄⁻ + H₃O⁺.',
        'Step 1: Arrow from benzene delocalised π-ring outward to N⁺ of NO₂⁺.',
        'Step 2: Wheland intermediate drawn with C—H and C—NO₂ single bonds on one carbon and an open U-shaped π-arc enclosing `+` spanning the other 5 ring carbons.',
        'Step 3: Arrow from the C—H bond straight back into the ring to restore aromaticity + H⁺ (reforms H₂SO₄ catalyst with HSO₄⁻).',
      ],
      answer: 'Nitrobenzene + H⁺ (electrophilic substitution)',
    },
    examinerTips: {
      pitfalls: [
        'Starting the cyanide nucleophilic arrow on the Nitrogen atom instead of the CARBON lone pair on :CN⁻.',
        'Drawing the aromatic Wheland horseshoe gap facing the wrong side (the gap MUST point toward the tetrahedral carbon holding both H and the new group!).',
        'Letting the C—H arrow leave the ring outward instead of returning electrons INTO the ring to regenerate the delocalised system.',
      ],
      checklist: [
        ':CN⁻ arrow originates on C lone pair and ends on C^δ+ (with C=O π → O)',
        'Aromatic horseshoe covers the 5 sp² carbons and opens toward the tetrahedral carbon',
        'C—H σ-bond electrons return inside the ring to restore aromaticity',
      ],
    },
  },

  'spectra-interpreter': {
    title: 'Combined Spectroscopy Interpreter (IR, MS & NMR)',
    unit: 'Unit 4.8',
    summary: 'Cross-reference Infrared, Mass Spec, ¹³C NMR, and ¹H NMR splitting spectra with the WJEC Data Booklet to deduce unknown structures.',
    appletSteps: [
      <><strong>Pick Unknown Sample:</strong> Select any spectrum dataset and inspect all <strong>4 technique tabs</strong> (<em>1. IR</em>, <em>2. MS</em>, <em>3. ¹³C NMR</em>, <em>4. ¹H NMR</em>).</>,
      <><strong>Click Interactive Peaks:</strong> Select bars/signals on each spectrum plot to log exact wavenumbers (cm⁻¹), m/z fragments, chemical shifts (δ ppm), integration, and splitting patterns.</>,
      <><strong>Submit 3-Step Deduction:</strong> Pick the deduced <em>Functional Group</em>, <em>Molecular Formula</em>, and exact <em>Compound Identity</em> and verify.</>,
    ],
    examMethod: {
      formulas: [
        '¹H NMR splitting rule: n non-equivalent adjacent protons split a signal into (n + 1) peaks',
        'MS M⁺ = Mᵣ  |  M−15 = loss of CH₃•  |  M−17 = loss of OH•  |  M−29 = loss of C₂H₅• or CHO•',
      ],
      steps: [
        'Start with Mass Spec & IR (check the Data Booklet tables!): establish molecular mass Mᵣ from M⁺ (and Cl 3:1 / Br 1:1 M+2 patterns) and pinpoint O—H (broad 2500–3300 acid vs 3230–3550 alcohol) or sharp C=O (1680–1750 cm⁻¹).',
        'Count ¹³C NMR signals to determine the number of non-equivalent carbon environments (distinguishes symmetrical ketones/esters/isomers immediately).',
        'Analyse ¹H NMR left-to-right: count proton environments (number of peaks), H ratios (relative area/integration), chemical shift environment (e.g. CH attached to O resonates at 3.1–4.3 ppm, vs CH next to C=O at 2.0–2.5 ppm), and n + 1 multiplicity.',
        'Check ester orientation carefully: R—COO—CH₂CH₃ puts the quartet at ~4.1 ppm, whereas CH₃CH₂—COO—R puts the quartet at ~2.3 ppm.',
      ],
    },
    workedExample: {
      question: 'Compound X has M⁺ = 88, sharp IR band at 1740 cm⁻¹ (no broad O—H), 4 signals in ¹³C NMR, and ¹H NMR showing triplet (3H, 1.1 ppm), quartet (2H, 2.3 ppm), and singlet (3H, 3.7 ppm). Identify X.',
      steps: [
        'Mᵣ = 88 with C=O (1740 cm⁻¹) and no O—H points to a C₄H₈O₂ ester (methyl propanoate or ethyl ethanoate or propyl methanoate).',
        'Triplet (3H) + quartet (2H) = an ethyl group (CH₃CH₂—). Because the quartet sits at 2.3 ppm (next to C=O, NOT 4.1 ppm next to —O—), the ethyl group is on the acyl side!',
        'Singlet (3H) at 3.7 ppm sits directly on the ester oxygen (—O—CH₃).',
      ],
      answer: 'Methyl propanoate  (CH₃CH₂COOCH₃)',
    },
    examinerTips: {
      pitfalls: [
        'Swapping ester isomers (ethyl ethanoate vs methyl propanoate) by ignoring chemical shift δ differences between —O—CH₂— (~4.1 ppm) and —CO—CH₂— (~2.3 ppm).',
        'Using n peaks instead of (n + 1) peaks when interpreting splitting (an ethyl CH₃CH₂— gives a triplet + quartet, NEVER a doublet + triplet).',
        'Splitting across an —OH oxygen proton (alcohol/acid O—H normally appears as an unsplit broad singlet).',
      ],
      checklist: [
        'Data Booklet IR wavenumber and NMR chemical-shift ranges consulted directly',
        'n + 1 neighbouring-proton rule applied strictly to each ¹H NMR multiplet',
        'Proposed structure verified against M⁺ mass, ¹³C peak count, and ALL ¹H integrals/shifts',
      ],
    },
  },
};
