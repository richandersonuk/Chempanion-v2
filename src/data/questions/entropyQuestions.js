export const ENTROPY_QUESTION_BANK = [
  // --- 1. Authentic WJEC Past Paper & Spec Reactions (isPastPaper: true) ---
  {
    id: 1,
    title: "Thermal Decomposition of Calcium Carbonate",
    equation: "CaCO₃(s) ➔ CaO(s) + CO₂(g)",
    dH: 178.0,
    dS: 161.0,
    tempC: 25,
    scenario: "Industrial quicklime calcination in a high-temperature kiln.",
    isPastPaper: true
  },
  {
    id: 2,
    title: "The Haber Process",
    equation: "N₂(g) + 3H₂(g) ➔ 2NH₃(g)",
    dH: -92.2,
    dS: -198.0,
    tempC: 450,
    scenario: "Industrial ammonia synthesis converter operating over an iron catalyst.",
    isPastPaper: true
  },
  {
    id: 3,
    title: "Vaporisation of Water at Atmospheric Pressure",
    equation: "H₂O(l) ➔ H₂O(g)",
    dH: 44.0,
    dS: 118.8,
    tempC: 80,
    scenario: "Phase change thermodynamics and boiling equilibrium at 100 kPa.",
    isPastPaper: true
  },
  {
    id: 4,
    title: "Decomposition of Hydrogen Peroxide",
    equation: "2H₂O₂(aq) ➔ 2H₂O(l) + O₂(g)",
    dH: -196.0,
    dS: 126.0,
    tempC: 20,
    scenario: "Catalytic disproportionation of aqueous hydrogen peroxide.",
    isPastPaper: true
  },
  {
    id: 5,
    title: "Blast Furnace Iron(III) Oxide Reduction by CO",
    equation: "Fe₂O₃(s) + 3CO(g) ➔ 2Fe(s) + 3CO₂(g)",
    dH: -24.8,
    dS: 15.0,
    tempC: 700,
    scenario: "Smelting iron ore in the upper reduction stack of a blast furnace.",
    isPastPaper: true
  },
  {
    id: 6,
    title: "Thermal Decomposition of Magnesium Nitrate",
    equation: "2Mg(NO₃)₂(s) ➔ 2MgO(s) + 4NO₂(g) + O₂(g)",
    dH: 444.0,
    dS: 411.0,
    tempC: 500,
    scenario: "WJEC Group 2 nitrate thermal stability and gas release investigation.",
    isPastPaper: true
  },
  {
    id: 7,
    title: "Oxidation of Nitrogen Monoxide (Nitric Acid Stage 2)",
    equation: "2NO(g) + O₂(g) ➔ 2NO₂(g)",
    dH: -115.0,
    dS: -146.5,
    tempC: 25,
    scenario: "Homogeneous gaseous oxidation during commercial nitric acid manufacture.",
    isPastPaper: true
  },
  {
    id: 8,
    title: "Combustion of Magnesium Ribbon",
    equation: "2Mg(s) + O₂(g) ➔ 2MgO(s)",
    dH: -1204.0,
    dS: -217.0,
    tempC: 600,
    scenario: "Vigorous metal combustion accompanied by intense white ultraviolet luminescence.",
    isPastPaper: true
  },
  {
    id: 9,
    title: "Industrial Steam Reforming of Natural Gas",
    equation: "CH₄(g) + H₂O(g) ➔ CO(g) + 3H₂(g)",
    dH: 206.0,
    dS: 215.0,
    tempC: 750,
    scenario: "Endothermic catalytic syngas generation in petrochemical refineries.",
    isPastPaper: true
  },
  {
    id: 10,
    title: "Thermal Dissociation of Dinitrogen Tetroxide",
    equation: "N₂O₄(g) ➔ 2NO₂(g)",
    dH: 57.2,
    dS: 176.0,
    tempC: 25,
    scenario: "Gas-phase dynamic equilibrium tube observing colour change from pale to dark brown.",
    isPastPaper: true
  },

  // --- 2. Advanced Physical & Inorganic Practice Scenarios ---
  {
    id: 11,
    title: "The Water-Gas Producer Reaction",
    equation: "C(s) + H₂O(g) ➔ CO(g) + H₂(g)",
    dH: 131.3,
    dS: 133.6,
    tempC: 700,
    scenario: "High-temperature gasification of incandescent coke beds.",
    isPastPaper: false
  },
  {
    id: 12,
    title: "Contact Process Sulfur Dioxide Oxidation",
    equation: "2SO₂(g) + O₂(g) ➔ 2SO₃(g)",
    dH: -197.0,
    dS: -188.0,
    tempC: 450,
    scenario: "Reversible sulfuric acid intermediate step over vanadium(V) oxide.",
    isPastPaper: false
  },
  {
    id: 13,
    title: "Decomposition of Solid Ammonium Chloride",
    equation: "NH₄Cl(s) ➔ NH₃(g) + HCl(g)",
    dH: 176.0,
    dS: 284.0,
    tempC: 340,
    scenario: "Solid thermal sublimation and gas release inside sealed boiling apparatus.",
    isPastPaper: false
  },
  {
    id: 14,
    title: "Dissolution of Ammonium Nitrate in Water",
    equation: "NH₄NO₃(s) ➔ NH₄⁺(aq) + NO₃⁻(aq)",
    dH: 25.7,
    dS: 108.7,
    tempC: 20,
    scenario: "Endothermic cold-pack chemical dissolution with positive entropy of solution.",
    isPastPaper: false
  },
  {
    id: 15,
    title: "Thermal Decomposition of Copper(II) Carbonate",
    equation: "CuCO₃(s) ➔ CuO(s) + CO₂(g)",
    dH: 50.0,
    dS: 155.0,
    tempC: 150,
    scenario: "Gentle green-to-black thermal breakdown of transition metal carbonate.",
    isPastPaper: false
  },
  {
    id: 16,
    title: "Thermite Reduction of Iron(III) Oxide",
    equation: "Fe₂O₃(s) + 2Al(s) ➔ Al₂O₃(s) + 2Fe(l)",
    dH: -851.5,
    dS: -38.5,
    tempC: 1500,
    scenario: "High-temperature exothermic aluminothermic rail welding reaction.",
    isPastPaper: false
  },
  {
    id: 17,
    title: "Endothermic Synthesis of Ozone",
    equation: "3O₂(g) ➔ 2O₃(g)",
    dH: 285.4,
    dS: -137.6,
    tempC: 25,
    scenario: "Non-spontaneous atmospheric photochemical reaction driven by intense UV.",
    isPastPaper: false
  },
  {
    id: 18,
    title: "Reduction of Zinc Oxide by Carbon (Retort Extraction)",
    equation: "ZnO(s) + C(s) ➔ Zn(g) + CO(g)",
    dH: 350.0,
    dS: 290.0,
    tempC: 1000,
    scenario: "Carbothermic smelting above the boiling point of zinc metal.",
    isPastPaper: false
  },
  {
    id: 19,
    title: "Complete Combustion of Methane",
    equation: "CH₄(g) + 2O₂(g) ➔ CO₂(g) + 2H₂O(l)",
    dH: -890.3,
    dS: -242.8,
    tempC: 25,
    scenario: "Standard domestic fuel combustion calorimetry.",
    isPastPaper: false
  },
  {
    id: 20,
    title: "Synthesis of Hydrogen Fluoride",
    equation: "H₂(g) + F₂(g) ➔ 2HF(g)",
    dH: -542.2,
    dS: 14.1,
    tempC: 25,
    scenario: "Spontaneous explosive halogen synthesis driven by enthalpy and positive entropy.",
    isPastPaper: false
  }
];
