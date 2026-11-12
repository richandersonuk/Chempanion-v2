import React, { useState } from 'react';

const QUESTION_BANK = [
  // --- 1. Authentic WJEC Past Paper & Spec Reactions ---
  {
    id: 1,
    title: "Thermal Decomposition of Calcium Carbonate",
    equation: "CaCO₃(s) ➔ CaO(s) + CO₂(g)",
    dH: 178.0,
    dS: 161.0,
    tempC: 25,
    scenario: "Industrial quicklime calcination in a high-temperature kiln."
  },
  {
    id: 2,
    title: "The Haber Process",
    equation: "N₂(g) + 3H₂(g) ➔ 2NH₃(g)",
    dH: -92.2,
    dS: -198.0,
    tempC: 450,
    scenario: "Industrial ammonia synthesis converter operating over an iron catalyst."
  },
  {
    id: 3,
    title: "Vaporisation of Water at Atmospheric Pressure",
    equation: "H₂O(l) ➔ H₂O(g)",
    dH: 44.0,
    dS: 118.8,
    tempC: 80,
    scenario: "Phase change thermodynamics and boiling equilibrium at 100 kPa."
  },
  {
    id: 4,
    title: "Decomposition of Hydrogen Peroxide",
    equation: "2H₂O₂(aq) ➔ 2H₂O(l) + O₂(g)",
    dH: -196.0,
    dS: 126.0,
    tempC: 20,
    scenario: "Catalytic disproportionation of aqueous hydrogen peroxide."
  },
  {
    id: 5,
    title: "Blast Furnace Iron(III) Oxide Reduction by CO",
    equation: "Fe₂O₃(s) + 3CO(g) ➔ 2Fe(s) + 3CO₂(g)",
    dH: -24.8,
    dS: 15.0,
    tempC: 700,
    scenario: "Smelting iron ore in the upper reduction stack of a blast furnace."
  },
  {
    id: 6,
    title: "Thermal Decomposition of Magnesium Nitrate",
    equation: "2Mg(NO₃)₂(s) ➔ 2MgO(s) + 4NO₂(g) + O₂(g)",
    dH: 444.0,
    dS: 411.0,
    tempC: 500,
    scenario: "WJEC Group 2 nitrate thermal stability and gas release investigation."
  },
  {
    id: 7,
    title: "Oxidation of Nitrogen Monoxide (Nitric Acid Stage 2)",
    equation: "2NO(g) + O₂(g) ➔ 2NO₂(g)",
    dH: -115.0,
    dS: -146.5,
    tempC: 25,
    scenario: "Homogeneous gaseous oxidation during commercial nitric acid manufacture."
  },
  {
    id: 8,
    title: "Combustion of Magnesium Ribbon",
    equation: "2Mg(s) + O₂(g) ➔ 2MgO(s)",
    dH: -1204.0,
    dS: -217.0,
    tempC: 600,
    scenario: "Vigorous metal combustion accompanied by intense white ultraviolet luminescence."
  },
  {
    id: 9,
    title: "Industrial Steam Reforming of Natural Gas",
    equation: "CH₄(g) + H₂O(g) ➔ CO(g) + 3H₂(g)",
    dH: 206.0,
    dS: 215.0,
    tempC: 750,
    scenario: "Endothermic catalytic syngas generation in petrochemical refineries."
  },
  {
    id: 10,
    title: "Thermal Dissociation of Dinitrogen Tetroxide",
    equation: "N₂O₄(g) ➔ 2NO₂(g)",
    dH: 57.2,
    dS: 176.0,
    tempC: 25,
    scenario: "Gas-phase dynamic equilibrium tube observing colour change from pale to dark brown."
  },

  // --- 2. Advanced Physical & Inorganic WJEC Scenarios ---
  {
    id: 11,
    title: "The Water-Gas Producer Reaction",
    equation: "C(s) + H₂O(g) ➔ CO(g) + H₂(g)",
    dH: 131.3,
    dS: 133.6,
    tempC: 700,
    scenario: "High-temperature gasification of incandescent coke beds."
  },
  {
    id: 12,
    title: "Contact Process Sulfur Dioxide Oxidation",
    equation: "2SO₂(g) + O₂(g) ➔ 2SO₃(g)",
    dH: -197.0,
    dS: -188.0,
    tempC: 450,
    scenario: "Reversible sulfuric acid intermediate step over vanadium(V) oxide."
  },
  {
    id: 13,
    title: "Decomposition of Solid Ammonium Chloride",
    equation: "NH₄Cl(s) ➔ NH₃(g) + HCl(g)",
    dH: 176.0,
    dS: 284.0,
    tempC: 340,
    scenario: "Solid thermal sublimation and gas release inside sealed boiling apparatus."
  },
  {
    id: 14,
    title: "Dissolution of Ammonium Nitrate in Water",
    equation: "NH₄NO₃(s) ➔ NH₄⁺(aq) + NO₃⁻(aq)",
    dH: 25.7,
    dS: 108.7,
    tempC: 20,
    scenario: "Endothermic cold-pack chemical dissolution with positive entropy of solution."
  },
  {
    id: 15,
    title: "Thermal Decomposition of Copper(II) Carbonate",
    equation: "CuCO₃(s) ➔ CuO(s) + CO₂(g)",
    dH: 50.0,
    dS: 155.0,
    tempC: 150,
    scenario: "Gentle green-to-black thermal breakdown of transition metal carbonate."
  },
  {
    id: 16,
    title: "Thermite Reduction of Iron(III) Oxide",
    equation: "Fe₂O₃(s) + 2Al(s) ➔ Al₂O₃(s) + 2Fe(l)",
    dH: -851.5,
    dS: -38.5,
    tempC: 1500,
    scenario: "High-temperature exothermic aluminothermic rail welding reaction."
  },
  {
    id: 17,
    title: "Endothermic Synthesis of Ozone",
    equation: "3O₂(g) ➔ 2O₃(g)",
    dH: 285.4,
    dS: -137.6,
    tempC: 25,
    scenario: "Non-spontaneous atmospheric photochemical reaction driven by intense UV."
  },
  {
    id: 18,
    title: "Reduction of Zinc Oxide by Carbon (Retort Extraction)",
    equation: "ZnO(s) + C(s) ➔ Zn(g) + CO(g)",
    dH: 350.0,
    dS: 290.0,
    tempC: 1000,
    scenario: "Carbothermic smelting above the boiling point of zinc metal."
  },
  {
    id: 19,
    title: "Complete Combustion of Methane",
    equation: "CH₄(g) + 2O₂(g) ➔ CO₂(g) + 2H₂O(l)",
    dH: -890.3,
    dS: -242.8,
    tempC: 25,
    scenario: "Standard domestic fuel combustion calorimetry."
  },
  {
    id: 20,
    title: "Synthesis of Hydrogen Fluoride",
    equation: "H₂(g) + F₂(g) ➔ 2HF(g)",
    dH: -542.2,
    dS: 14.1,
    tempC: 25,
    scenario: "Spontaneous explosive halogen synthesis driven by enthalpy and positive entropy."
  }
];

export default function FeasibilityTrainer() {
  const [qIndex, setQIndex] = useState(0);
  const currentQ = QUESTION_BANK[qIndex];

  // User input states
  const [inputT_K, setInputT_K] = useState('');
  const [inputDS_kJ, setInputDS_kJ] = useState('');
  const [inputDG, setInputDG] = useState('');
  const [userFeasible, setUserFeasible] = useState(null);
  const [inputTMin, setInputTMin] = useState('');

  // Validation/feedback flags
  const [submittedStep1, setSubmittedStep1] = useState(false);
  const [submittedStep2, setSubmittedStep2] = useState(false);
  const [submittedStep3, setSubmittedStep3] = useState(false);

  // Exact target values
  const correctT_K = currentQ.tempC + 273;
  const correctDS_kJ = currentQ.dS / 1000;
  const correctDG = currentQ.dH - (correctT_K * correctDS_kJ);
  const isActuallyFeasible = correctDG < 0;

  // Boundary condition calculation
  let boundaryType = 'never';
  let correctTBoundary = null;

  if (currentQ.dH < 0 && currentQ.dS > 0) {
    boundaryType = 'always';
  } else if (currentQ.dH > 0 && currentQ.dS < 0) {
    boundaryType = 'never';
  } else {
    correctTBoundary = Math.round(currentQ.dH / correctDS_kJ);
    boundaryType = currentQ.dH > 0 ? 'above' : 'below';
  }

  const handleNextQuestion = () => {
    let nextIdx = Math.floor(Math.random() * QUESTION_BANK.length);
    if (nextIdx === qIndex) nextIdx = (qIndex + 1) % QUESTION_BANK.length;
    setQIndex(nextIdx);
    resetForm();
  };

  const resetForm = () => {
    setInputT_K('');
    setInputDS_kJ('');
    setInputDG('');
    setUserFeasible(null);
    setInputTMin('');
    setSubmittedStep1(false);
    setSubmittedStep2(false);
    setSubmittedStep3(false);
  };

  const isStep1Correct =
    Math.abs(parseFloat(inputT_K) - correctT_K) <= 0.5 &&
    Math.abs(parseFloat(inputDS_kJ) - correctDS_kJ) <= 0.0005;

  const isStep2Correct =
    Math.abs(parseFloat(inputDG) - correctDG) <= 1.5 &&
    userFeasible === isActuallyFeasible;

  const isStep3Correct = () => {
    if (boundaryType === 'always' || boundaryType === 'never') return true;
    return Math.abs(parseFloat(inputTMin) - correctTBoundary) <= 5;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white border border-blue-100 rounded-2xl shadow-xl text-slate-800 font-sans">
      {/* App Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-blue-100 gap-3">
        <div>
       
          <h1 className="text-2xl font-black text-blue-900 mt-1">
            Feasibility & Unit Master
          </h1>
        </div>
        <button
          onClick={handleNextQuestion}
          className="self-start md:self-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-500/20"
        >
          New Reaction Scenario ↻
        </button>
      </div>

      {/* Scenario & Reaction Overview Box */}
      <div className="mt-5 p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Reaction Scenario</p>
        <h2 className="text-lg font-bold text-slate-900 mt-0.5">{currentQ.title}</h2>
        <div className="my-3 py-2 px-3 bg-white border border-blue-200 rounded-lg font-mono text-blue-900 text-base text-center overflow-x-auto shadow-sm">
          {currentQ.equation}
        </div>
        <p className="text-xs text-slate-600 mb-4">{currentQ.scenario}</p>

        {/* Given Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
            <span className="text-xs text-slate-500 block font-mono">Standard Enthalpy (ΔH)</span>
            <span className="text-base font-bold font-mono text-blue-900">
              {currentQ.dH > 0 ? `+${currentQ.dH}` : currentQ.dH} kJ mol⁻¹
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
            <span className="text-xs text-slate-500 block font-mono">Standard Entropy (ΔS)</span>
            <span className="text-base font-bold font-mono text-blue-900">
              {currentQ.dS > 0 ? `+${currentQ.dS}` : currentQ.dS} J K⁻¹ mol⁻¹
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
            <span className="text-xs text-slate-500 block font-mono">Temperature (T)</span>
            <span className="text-base font-bold font-mono text-blue-900">
              {currentQ.tempC} °C
            </span>
          </div>
        </div>
      </div>

      {/* Gated Steps Pipeline */}
      <div className="mt-6 space-y-5">
        {/* STEP 1: Unit Traps */}
        <div className={`p-5 rounded-xl border transition-all ${
          submittedStep1 && isStep1Correct 
            ? 'bg-emerald-50/40 border-emerald-300' 
            : 'bg-slate-50/50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">1</span>
            <h3 className="font-bold text-sm text-slate-800">
              The Unit Interconversion Trap (kJ ↔ J, °C ↔ K)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1">
                Convert T to Absolute Temperature (K):
              </label>
              <input
                type="number"
                value={inputT_K}
                onChange={(e) => setInputT_K(e.target.value)}
                placeholder="T in K"
                className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-600 mb-1">
                Convert ΔS to kJ K⁻¹ mol⁻¹ (/ 1000):
              </label>
              <input
                type="number"
                step="any"
                value={inputDS_kJ}
                onChange={(e) => setInputDS_kJ(e.target.value)}
                placeholder="ΔS in kJ K⁻¹ mol⁻¹"
                className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {!submittedStep1 ? (
            <button
              onClick={() => setSubmittedStep1(true)}
              className="mt-4 px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-300 transition"
            >
              Verify Unit Conversions →
            </button>
          ) : (
            <div className="mt-3 text-xs font-mono">
              {isStep1Correct ? (
                <p className="text-emerald-700 font-medium">✓ Units correctly aligned for Gibbs Free Energy calculation.</p>
              ) : (
                <p className="text-rose-600 font-medium">
                  ✗ Check your conversions: K = °C + 273, and ΔS (kJ K⁻¹ mol⁻¹) = ΔS (J K⁻¹ mol⁻¹) ÷ 1000.
                </p>
              )}
            </div>
          )}
        </div>

        {/* STEP 2: ΔG Calculation & Feasibility Gate */}
        {submittedStep1 && isStep1Correct && (
          <div className={`p-5 rounded-xl border transition-all ${
            submittedStep2 && isStep2Correct 
              ? 'bg-emerald-50/40 border-emerald-300' 
              : 'bg-slate-50/50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">2</span>
              <h3 className="font-bold text-sm text-slate-800">
                Gibbs Free Energy & Spontaneity Determination (ΔG = ΔH − TΔS)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1">
                  Calculate ΔG at {currentQ.tempC} °C (kJ mol⁻¹):
                </label>
                <input
                  type="number"
                  step="any"
                  value={inputDG}
                  onChange={(e) => setInputDG(e.target.value)}
                  placeholder="e.g. -45.2 or +12.8"
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1">
                  Is reaction feasible at {currentQ.tempC} °C?
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUserFeasible(true)}
                    className={`flex-1 py-2 font-mono text-xs font-bold rounded-lg border transition ${
                      userFeasible === true 
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
                        : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    Feasible (ΔG &lt; 0)
                  </button>
                  <button
                    onClick={() => setUserFeasible(false)}
                    className={`flex-1 py-2 font-mono text-xs font-bold rounded-lg border transition ${
                      userFeasible === false 
                        ? 'bg-rose-100 border-rose-400 text-rose-800' 
                        : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    Not Feasible (ΔG &gt; 0)
                  </button>
                </div>
              </div>
            </div>

            {!submittedStep2 ? (
              <button
                onClick={() => setSubmittedStep2(true)}
                className="mt-4 px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-300 transition"
              >
                Validate ΔG & Feasibility →
              </button>
            ) : (
              <div className="mt-3 text-xs font-mono">
                {isStep2Correct ? (
                  <p className="text-emerald-700 font-medium">
                    ✓ Correct. ΔG = {correctDG.toFixed(1)} kJ mol⁻¹ ({isActuallyFeasible ? 'Feasible: ΔG < 0' : 'Not feasible: ΔG > 0'}).
                  </p>
                ) : (
                  <p className="text-rose-600 font-medium">
                    ✗ Check: ΔG = ({currentQ.dH}) − [({correctT_K}) × ({correctDS_kJ.toFixed(4)})] = {correctDG.toFixed(1)} kJ mol⁻¹.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Spontaneity Boundary Temperature */}
        {submittedStep2 && isStep2Correct && (
          <div className={`p-5 rounded-xl border transition-all ${
            submittedStep3 && isStep3Correct()
              ? 'bg-emerald-50/40 border-emerald-300' 
              : 'bg-slate-50/50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">3</span>
              <h3 className="font-bold text-sm text-slate-800">
                WJEC Boundary Condition: Feasibility Transition Temperature
              </h3>
            </div>

            {boundaryType === 'always' ? (
              <p className="text-xs font-mono text-emerald-800 bg-emerald-100/60 p-3 rounded-lg border border-emerald-200">
                ΔH is negative and ΔS is positive. -TΔS is always negative, so ΔG is negative at all temperatures. Reaction is always feasible.
              </p>
            ) : boundaryType === 'never' ? (
              <p className="text-xs font-mono text-rose-800 bg-rose-100/60 p-3 rounded-lg border border-rose-200">
                ΔH is positive and ΔS is negative. -TΔS is always positive, so ΔG is positive at all temperatures. Reaction is never feasible.
              </p>
            ) : (
              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1">
                  At what temperature does feasibility switch (ΔG = 0 ➔ T = ΔH ÷ ΔS)?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={inputTMin}
                    onChange={(e) => setInputTMin(e.target.value)}
                    placeholder="Temperature in K"
                    className="w-48 bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs font-mono text-slate-600">
                    Reaction is feasible {boundaryType === 'above' ? 'ABOVE' : 'BELOW'} this temperature.
                  </span>
                </div>

                {!submittedStep3 ? (
                  <button
                    onClick={() => setSubmittedStep3(true)}
                    className="mt-4 px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-300 transition"
                  >
                    Check Boundary Temperature
                  </button>
                ) : (
                  <div className="mt-3 text-xs font-mono">
                    {isStep3Correct() ? (
  <p className="text-emerald-700 font-medium">
    ✓ Exact boundary: T = {currentQ.dH} ÷ {correctDS_kJ.toFixed(4)} = {correctTBoundary} K ({correctTBoundary - 273} °C).
  </p>
) : (
  <p className="text-rose-600 font-medium">
    ✗ Target: T = ΔH ÷ ΔS = {currentQ.dH} ÷ {correctDS_kJ.toFixed(4)} = {correctTBoundary} K.
  </p>
)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kinetic vs Thermodynamic Note */}
      {submittedStep2 && isStep2Correct && (
        <div className="mt-5 p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-mono">
          <strong className="text-blue-950">Examiner Reminder:</strong> A reaction with ΔG &lt; 0 is thermodynamically feasible, but may not occur at room temperature due to a high activation energy (kinetic stability).
        </div>
      )}
    </div>
  );
}

