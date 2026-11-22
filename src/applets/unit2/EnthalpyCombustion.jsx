import React, { useState, useEffect } from 'react';
import ScientificInput from '../../components/shared/ScientificInput';

const BOND_ENTHALPY_TABLE = [
  { bond: 'C–H', value: 412, note: '' },
  { bond: 'C–C', value: 348, note: '' },
  { bond: 'C=C', value: 612, note: '' },
  { bond: 'C–O', value: 360, note: '' },
  { bond: 'C=O', value: 743, note: '(805 in CO₂)' },
  { bond: 'O–H', value: 463, note: '' },
  { bond: 'O=O', value: 496, note: '' },
  { bond: 'H–H', value: 436, note: '' },
  { bond: 'N≡N', value: 944, note: '' },
  { bond: 'N–H', value: 388, note: '' },
  { bond: 'Cl–Cl', value: 242, note: '' },
  { bond: 'H–Cl', value: 431, note: '' }
];

const BOND_ENTHALPY_PROBLEMS = [
  {
    id: 'ch4_comb',
    name: 'Complete Combustion of Methane',
    equation: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)',
    prompt: 'Calculate the enthalpy change of combustion of methane using the Average Bond Enthalpies table below.',
    brokenList: '4 × (C–H) + 2 × (O=O)',
    formedList: '2 × (C=O in CO₂) + 4 × (O–H)',
    brokenTotal: 4 * 412 + 2 * 496, // 2640
    formedTotal: 2 * 805 + 4 * 463, // 3462
    usesCo2: true,
    co2TrapDeltaH: (4 * 412 + 2 * 496) - (2 * 743 + 4 * 463) // -698
  },
  {
    id: 'c2h4_comb',
    name: 'Complete Combustion of Ethene',
    equation: 'C₂H₄(g) + 3O₂(g) → 2CO₂(g) + 2H₂O(g)',
    prompt: 'Calculate the enthalpy change for the complete combustion of gaseous ethene using the Average Bond Enthalpies table below.',
    brokenList: '1 × (C=C) + 4 × (C–H) + 3 × (O=O)',
    formedList: '4 × (C=O in CO₂) + 4 × (O–H)',
    brokenTotal: 612 + 4 * 412 + 3 * 496, // 3748
    formedTotal: 4 * 805 + 4 * 463, // 5072
    usesCo2: true,
    co2TrapDeltaH: (612 + 4 * 412 + 3 * 496) - (4 * 743 + 4 * 463) // -1076
  },
  {
    id: 'c2h5oh_comb',
    name: 'Combustion of Gaseous Ethanol',
    equation: 'C₂H₅OH(g) + 3O₂(g) → 2CO₂(g) + 3H₂O(g)',
    prompt: 'Calculate the molar enthalpy of combustion of gaseous ethanol using the Average Bond Enthalpies table below.',
    brokenList: '1 × (C–C) + 5 × (C–H) + 1 × (C–O) + 1 × (O–H) + 3 × (O=O)',
    formedList: '4 × (C=O in CO₂) + 6 × (O–H)',
    brokenTotal: 348 + 5 * 412 + 360 + 463 + 3 * 496, // 4719
    formedTotal: 4 * 805 + 6 * 463, // 5998
    usesCo2: true,
    co2TrapDeltaH: (348 + 5 * 412 + 360 + 463 + 3 * 496) - (4 * 743 + 6 * 463) // -1031
  },
  {
    id: 'c2h4_hyd',
    name: 'Hydrogenation of Ethene',
    equation: 'C₂H₄(g) + H₂(g) → C₂H₆(g)',
    prompt: 'Calculate the enthalpy change for the hydrogenation of ethene to ethane using the Average Bond Enthalpies table below.',
    brokenList: '1 × (C=C) + 4 × (C–H) + 1 × (H–H)',
    formedList: '1 × (C–C) + 6 × (C–H)',
    brokenTotal: 612 + 4 * 412 + 436, // 2696
    formedTotal: 348 + 6 * 412, // 2820
    usesCo2: false
  },
  {
    id: 'nh3_synth',
    name: 'Haber Synthesis of Ammonia',
    equation: 'N₂(g) + 3H₂(g) → 2NH₃(g)',
    prompt: 'Calculate ΔH for the formation of two moles of ammonia gas using the Average Bond Enthalpies table below.',
    brokenList: '1 × (N≡N) + 3 × (H–H)',
    formedList: '6 × (N–H)',
    brokenTotal: 944 + 3 * 436, // 2252
    formedTotal: 6 * 388, // 2328
    usesCo2: false
  },
  {
    id: 'hcl_synth',
    name: 'Synthesis of Hydrogen Chloride',
    equation: 'H₂(g) + Cl₂(g) → 2HCl(g)',
    prompt: 'Calculate the enthalpy change for the reaction between hydrogen and chlorine gases using the Average Bond Enthalpies table below.',
    brokenList: '1 × (H–H) + 1 × (Cl–Cl)',
    formedList: '2 × (H–Cl)',
    brokenTotal: 436 + 242, // 678
    formedTotal: 2 * 431, // 862
    usesCo2: false
  },
  {
    id: 'h2o_synth',
    name: 'Formation of Steam',
    equation: '2H₂(g) + O₂(g) → 2H₂O(g)',
    prompt: 'Calculate ΔH for the combustion of two moles of hydrogen gas using the Average Bond Enthalpies table below.',
    brokenList: '2 × (H–H) + 1 × (O=O)',
    formedList: '4 × (O–H)',
    brokenTotal: 2 * 436 + 496, // 1368
    formedTotal: 4 * 463, // 1852
    usesCo2: false
  },
  {
    id: 'ch3oh_comb',
    name: 'Complete Combustion of Gaseous Methanol',
    equation: '2CH₃OH(g) + 3O₂(g) → 2CO₂(g) + 4H₂O(g)',
    prompt: 'Calculate ΔH for the equation shown above using the Average Bond Enthalpies table below.',
    brokenList: '6 × (C–H) + 2 × (C–O) + 2 × (O–H) + 3 × (O=O)',
    formedList: '4 × (C=O in CO₂) + 8 × (O–H)',
    brokenTotal: 6 * 412 + 2 * 360 + 2 * 463 + 3 * 496, // 5606
    formedTotal: 4 * 805 + 8 * 463, // 6924
    usesCo2: true,
    co2TrapDeltaH: (6 * 412 + 2 * 360 + 2 * 463 + 3 * 496) - (4 * 743 + 8 * 463) // -1070
  }
];

const EnthalpyCombustion = ({ onComplete }) => {
  const [mode, setMode] = useState('calorimetry');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [isSimulating, setIsSimulating] = useState(false);
  const [displayTemp, setDisplayTemp] = useState(21.0);
  const [simCompleted, setSimCompleted] = useState(false);

  // WJEC Unit & Stoichiometry Gate
  const [gateEnabled, setGateEnabled] = useState(true);
  const [gateVerified, setGateVerified] = useState(false);
  const [gateInputs, setGateInputs] = useState({ qKJ: '', nMol: '', broken: '', formed: '' });
  const [gateFeedback, setGateFeedback] = useState({ type: '', message: '' });

  const fuels = [
    { name: 'methanol', formula: 'CH₃OH', mr: 32.0 },
    { name: 'ethanol', formula: 'C₂H₅OH', mr: 46.0 },
    { name: 'propan-1-ol', formula: 'C₃H₇OH', mr: 60.0 },
    { name: 'propan-2-ol', formula: 'CH₃CH(OH)CH₃', mr: 60.0 },
    { name: 'butan-1-ol', formula: 'C₄H₉OH', mr: 74.0 },
    { name: 'butan-2-ol', formula: 'CH₃CH(OH)C₂H₅', mr: 74.0 },
    { name: 'pentan-1-ol', formula: 'C₅H₁₁OH', mr: 88.0 },
    { name: 'hexan-1-ol', formula: 'C₆H₁₃OH', mr: 102.0 },
    { name: 'cyclohexane', formula: 'C₆H₁₂', mr: 84.0 },
    { name: 'hexane', formula: 'C₆H₁₄', mr: 86.0 }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['calorimetry', 'bond_enthalpy'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    if (targetMode === 'calorimetry') {
      const fuel = fuels[Math.floor(Math.random() * fuels.length)];

      const randRoll = Math.random();
      const massWater = randRoll < 0.50
        ? 100
        : [50, 150, 200, 250][Math.floor(Math.random() * 4)];

      const tempRise = (Math.random() * 15 + 10).toFixed(1);
      const massBurned = (Math.random() * 0.5 + 0.5).toFixed(2);

      const q_joules = massWater * 4.18 * parseFloat(tempRise);
      const q_kJ = q_joules / 1000;
      const moles = parseFloat(massBurned) / fuel.mr;
      const deltaH = -(q_kJ / moles);

      setProblem({
        problemType: 'calorimetry',
        title: 'Enthalpy of Combustion (Calorimetry)',
        fuel,
        massWater,
        tempRise,
        massBurned,
        q_kJ,
        moles,
        correctH: deltaH
      });
    } else {
      const available = problem?.problemType === 'bond_enthalpy'
        ? BOND_ENTHALPY_PROBLEMS.filter((p) => p.id !== problem.id)
        : BOND_ENTHALPY_PROBLEMS;
      const selected = available[Math.floor(Math.random() * available.length)];
      const deltaH = selected.brokenTotal - selected.formedTotal;

      setProblem({
        problemType: 'bond_enthalpy',
        title: 'Enthalpy Change via Mean Bond Enthalpies',
        ...selected,
        correctH: deltaH
      });
    }

    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });

    setIsSimulating(false);
    setSimCompleted(false);
    setDisplayTemp(21.0);
    setGateVerified(false);
    setGateInputs({ qKJ: '', nMol: '', broken: '', formed: '' });
    setGateFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem('calorimetry');
  }, []);

  const handleRunSimulation = () => {
    if (isSimulating || simCompleted || problem?.problemType !== 'calorimetry') return;
    setIsSimulating(true);

    const baseTemp = 21.0;
    const targetTemp = baseTemp + parseFloat(problem.tempRise);
    const duration = 2000;
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    const stepIncrement = (targetTemp - baseTemp) / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setDisplayTemp(targetTemp);
        setIsSimulating(false);
        setSimCompleted(true);
      } else {
        setDisplayTemp(prev => prev + stepIncrement);
      }
    }, intervalTime);
  };

  const verifyGate = () => {
    if (!problem) return;

    if (problem.problemType === 'bond_enthalpy') {
      const uBroken = parseFloat(gateInputs.broken);
      const uFormed = parseFloat(gateInputs.formed);
      const errors = [];

      if (isNaN(uBroken) || Math.abs(uBroken - problem.brokenTotal) > 2) {
        errors.push(`ΣE(bonds broken): draw all reactant displayed structures (${problem.brokenList})`);
      }
      if (isNaN(uFormed) || Math.abs(uFormed - problem.formedTotal) > 2) {
        const co2Hint = problem.usesCo2 ? ' Note: C=O in CO₂ is 805 kJ mol⁻¹ (not 743).' : '';
        errors.push(`ΣE(bonds formed): count all product bonds (${problem.formedList}).${co2Hint}`);
      }

      if (errors.length === 0) {
        setGateVerified(true);
        setGateFeedback({
          type: 'success',
          message: `✅ Step 1 Verified! ΣE(broken) = ${problem.brokenTotal} kJ mol⁻¹ and ΣE(formed) = ${problem.formedTotal} kJ mol⁻¹. Now solve ΔH = ΣE(broken) − ΣE(formed).`
        });
      } else {
        setGateFeedback({
          type: 'error',
          message: errors.join(' • ')
        });
      }
      return;
    }

    const uQ = parseFloat(gateInputs.qKJ);
    const uN = parseFloat(gateInputs.nMol);
    const errors = [];

    if (isNaN(uQ) || Math.abs(uQ - problem.q_kJ) / problem.q_kJ > 0.02) {
      if (!isNaN(uQ) && Math.abs(uQ - problem.q_kJ * 1000) / (problem.q_kJ * 1000) < 0.03) {
        errors.push(`Unit Trap! You entered Q in Joules (${Math.round(uQ)} J). Divide by 1000 to convert to kJ (${problem.q_kJ.toFixed(3)} kJ)`);
      } else {
        errors.push(`Heat energy Q = mcΔT ÷ 1000 (use m_water = ${problem.massWater} g, c = 4.18, ΔT = ${problem.tempRise} °C → ${problem.q_kJ.toFixed(3)} kJ)`);
      }
    }

    if (isNaN(uN) || Math.abs(uN - problem.moles) / problem.moles > 0.02) {
      errors.push(`Moles of ${problem.fuel.name} burned n = m_fuel / M_r = ${problem.massBurned} / ${problem.fuel.mr} = ${problem.moles.toFixed(4)} mol`);
    }

    if (errors.length === 0) {
      setGateVerified(true);
      setGateFeedback({
        type: 'success',
        message: '✅ Step 1 Verified! Q (in kJ) and n (in mol) are accurate. Remember the negative sign for Step 2 (ΔH = −Q / n).'
      });
    } else {
      setGateFeedback({
        type: 'error',
        message: errors.join(' • ')
      });
    }
  };

  const checkAnswer = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;

    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp, 10));

    if (problem.problemType === 'bond_enthalpy') {
      if (Math.abs(userVal - problem.correctH) <= 2) {
        setFeedback({
          type: 'success',
          message: `Correct! ΔH = ${problem.brokenTotal} − ${problem.formedTotal} = ${problem.correctH} kJ mol⁻¹.`
        });
        onComplete?.(`bond_${problem.id}`);
      } else if (Math.abs(userVal + problem.correctH) <= 2) {
        setFeedback({
          type: 'error',
          message: 'WJEC Sign Reversal Trap! You computed ΣE(formed) − ΣE(broken). Remember: ΔH = ΣE(bonds broken) − ΣE(bonds formed).'
        });
      } else if (problem.usesCo2 && Math.abs(userVal - problem.co2TrapDeltaH) <= 2) {
        setFeedback({
          type: 'error',
          message: 'WJEC CO₂ Trap! Check the Average Bond Enthalpies table: C=O in CO₂ is 805 kJ mol⁻¹, not the standard 743 kJ mol⁻¹.'
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Incorrect. Draw displayed formulas for every reactant and product, multiply by the balanced equation coefficients, and compute ΣE(bonds broken) − ΣE(bonds formed).'
        });
      }
      return;
    }

    const error = Math.abs((userVal - problem.correctH) / problem.correctH);

    if (error < 0.02) {
      setFeedback({
        type: 'success',
        message: `Correct! ΔH = ${problem.correctH.toFixed(1)} kJ mol⁻¹. Great job managing the negative sign conventions for exothermic combustion pathways!`
      });
      onComplete?.(`${problem.fuel.name}_${problem.massWater}_${problem.tempRise}`);
    } else if (Math.abs(userVal + problem.correctH) < Math.abs(problem.correctH * 0.02)) {
      setFeedback({
        type: 'error',
        message: 'Close! Check your sign convention. Chemical combustion releases heat energy to surroundings, making it an exothermic process.'
      });
    } else {
      setFeedback({
        type: 'error',
        message: 'Incorrect. Calculate the energy transferred to the water (mcΔT), convert Joules to kJ, then divide by the total moles of alcohol fuel consumed.'
      });
    }
  };

  if (!problem) return null;

  const thermPercent = Math.min(85, 25 + ((displayTemp - 21.0) / 30) * 60);
  const isStep2Locked = gateEnabled && !gateVerified;

  return (
    <div className="applet-container">
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center gap-2">
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm text-center"
          >
            <option value="calorimetry">Experimental Calorimetry (q = mcΔT)</option>
            <option value="bond_enthalpy">Mean Bond Enthalpies (ΔH)</option>
          </select>

          <button
            type="button"
            onClick={() => { setMode('random'); generateProblem('random'); }}
            className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all border shrink-0 cursor-pointer ${
              mode === 'random'
                ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header">{problem.title}</div>

      {problem.problemType === 'calorimetry' ? (
        <>
          <div className="question-text text-center mb-4">
            <p>
              A student configures a copper calorimetry system to establish the empirical enthalpy changes of liquid organic fuels.<br />
              The apparatus is initialized with a beaker containing <b>{problem.massWater} g</b> of water directly above a spirit burner filled with <b>{problem.fuel.name}</b> ({problem.fuel.formula}, M<sub>r</sub> = {problem.fuel.mr}).
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-6 flex flex-col items-center shadow-inner relative overflow-hidden">
            <svg viewBox="0 0 200 180" className="w-48 h-auto select-none">
              <style>{`
                @keyframes chemicalFlameFlicker {
                  0%, 100% { transform: scale(1) skewX(-1deg); fill: #f97316; }
                  50% { transform: scaleY(1.25) scaleX(0.9) skewX(1deg); fill: #ea580c; }
                }
                .chem-active-flame {
                  animation: chemicalFlameFlicker 0.15s infinite alternate ease-in-out;
                }
              `}</style>

              <rect x="60" y="30" width="80" height="70" rx="4" fill="none" stroke="#94a3b8" strokeWidth="3" />

              <rect
                x="62"
                y="45"
                width="76"
                height="53"
                fill={simCompleted ? '#fed7aa' : '#e0f2fe'}
                className="transition-colors duration-1000"
              />

              {isSimulating && (
                <path d="M62,45 Q70,42 80,45 T100,45 T120,45 T138,45" fill="none" stroke="#bae6fd" strokeWidth="2" className="animate-pulse" />
              )}

              <text x="100" y="75" textAnchor="middle" className="text-[9px] font-mono fill-slate-400 font-bold">
                {problem.massWater}g H₂O
              </text>

              <rect x="115" y="15" width="8" height="70" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="2" />
              <circle cx="119" cy="85" r="7" fill="#ffffff" stroke="#475569" strokeWidth="2" />

              <rect x="117.5" y={85 - thermPercent * 0.7} width="3" height={thermPercent * 0.7} fill="#ef4444" />
              <circle cx="119" cy="85" r="5" fill="#ef4444" />

              <path d="M70,145 L130,145 L120,120 L80,120 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
              <line x1="100" y1="120" x2="100" y2="112" stroke="#334155" strokeWidth="3" />

              {isSimulating && (
                <path
                  d="M94,112 C92,102 100,88 100,88 C100,88 108,102 106,112 C106,115 103,117 100,117 C97,117 94,115 94,112 Z"
                  className="chem-active-flame"
                  style={{ transformOrigin: '100px 112px' }}
                />
              )}

              <g transform="translate(140, 25)">
                <rect x="0" y="0" width="55" height="20" rx="5" fill="#1e293b" />
                <text x="27.5" y="13" textAnchor="middle" fill="#22c55e" className="text-[10px] font-mono font-black tracking-tight">
                  {displayTemp.toFixed(1)}°C
                </text>
              </g>
            </svg>

            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating || simCompleted}
              className={`mt-2 px-5 py-1.5 rounded-full text-xs font-black tracking-wide shadow transition-all ${
                simCompleted
                  ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-300'
                  : isSimulating
                  ? 'bg-amber-100 text-amber-700 animate-pulse cursor-wait border border-amber-300'
                  : 'bg-[#326fa0] text-white hover:bg-[#255580]'
              }`}
            >
              {simCompleted ? 'Data Harvested ✓' : isSimulating ? 'Combusting Fuel...' : 'Run Simulation 🧪'}
            </button>
          </div>

          <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-3 bg-slate-100 border border-slate-200 p-3 rounded-2xl mb-6">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm text-center">
              <span className="block text-[9px] font-black tracking-wider text-slate-400 mb-0.5">Mass of Fuel Burned</span>
              {simCompleted ? (
                <span className="text-base font-black text-slate-800">{problem.massBurned} g</span>
              ) : (
                <span className="text-xs font-bold text-amber-600 animate-pulse bg-amber-50 px-2 py-0.5 rounded border border-amber-200/40 inline-block">Awaiting Lab Run</span>
              )}
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm text-center">
              <span className="block text-[9px] font-black tracking-wider text-slate-400 mb-0.5">Temperature Rise (ΔT)</span>
              {simCompleted ? (
                <span className="text-base font-black text-slate-800">+{problem.tempRise} °C</span>
              ) : (
                <span className="text-xs font-bold text-amber-600 animate-pulse bg-amber-50 px-2 py-0.5 rounded border border-amber-200/40 inline-block">Awaiting Lab Run</span>
              )}
            </div>
          </div>

          {simCompleted ? (
            <div className="animate-fade-in w-full flex flex-col items-center">
              {/* WJEC Step 1 Unit & Stoichiometry Gate */}
              <div className="w-full max-w-lg mx-auto mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm" style={{ textTransform: 'none' }}>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-slate-400">
                      WJEC Unit Trap Gate
                    </span>
                    <h4 className="text-xs font-black text-slate-800 mt-1">
                      Step 1: Verify Heat Transferred Q (in kJ) &amp; Moles of Fuel Burned (n)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGateEnabled(!gateEnabled)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shrink-0 cursor-pointer"
                  >
                    {gateEnabled ? 'Skip Gate' : 'Enable Gate'}
                  </button>
                </div>

                {gateEnabled && (
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Heat energy Q = mcΔT in <strong>kJ</strong>:
                        </label>
                        <input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          onWheel={(e) => e.currentTarget.blur()}
                          disabled={gateVerified}
                          value={gateInputs.qKJ}
                          onChange={(e) => setGateInputs({ ...gateInputs, qKJ: e.target.value })}
                          placeholder="kJ (divide J by 1000)"
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                        />
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          Moles burned n = m<sub>fuel</sub> / M<sub>r</sub> (mol):
                        </label>
                        <input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          onWheel={(e) => e.currentTarget.blur()}
                          disabled={gateVerified}
                          value={gateInputs.nMol}
                          onChange={(e) => setGateInputs({ ...gateInputs, nMol: e.target.value })}
                          placeholder="mol"
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-medium">
                        Use m<sub>water</sub> = {problem.massWater} g in Q = mcΔT, and m<sub>fuel</sub> = {problem.massBurned} g in n = m/M<sub>r</sub>.
                      </span>
                      <button
                        type="button"
                        onClick={verifyGate}
                        disabled={gateVerified}
                        className="px-4 py-1.5 bg-[#326fa0] text-white text-xs font-black rounded-xl hover:bg-[#255580] disabled:bg-emerald-600 transition-colors shrink-0 cursor-pointer"
                      >
                        {gateVerified ? 'Verified ✓' : 'Verify Step 1'}
                      </button>
                    </div>

                    {gateFeedback.message && (
                      <div className={`p-2.5 rounded-xl text-xs font-bold ${
                        gateFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {gateFeedback.message}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={`w-full flex flex-col items-center transition-opacity ${isStep2Locked ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                  Step 2: Calculate the molar enthalpy of combustion for {problem.fuel.name} in kJ mol⁻¹.
                </div>

                <ScientificInput
                  value={coeff}
                  exponent={exp}
                  onValueChange={(v) => { setCoeff(v); if (feedback.message) setFeedback({ type: '', message: '' }); }}
                  onExponentChange={(v) => { setExp(v); if (feedback.message) setFeedback({ type: '', message: '' }); }}
                  label="ΔH ="
                  status={feedback.type}
                />

                <div className="button-group">
                  <button className="btn btn-primary" onClick={checkAnswer} disabled={isStep2Locked}>Check Answer</button>
                  <button className="btn btn-secondary" onClick={() => generateProblem()}>Next Problem &rarr;</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-sm text-center p-4 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl shadow-sm mb-4">
                🔒 Laboratory measurements locked. Ignite the burner using the control switch above to acquire the data metrics.
              </div>
              <button
                type="button"
                onClick={() => generateProblem()}
                className="w-full max-w-[12rem] bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Skip to Next Setup
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="question-text text-center space-y-3">
            <p className="font-bold text-slate-700">{problem.name}</p>
            <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono font-black text-sm sm:text-base text-slate-800">
              {problem.equation}
            </div>
            <p className="text-sm text-slate-600">{problem.prompt}</p>
          </div>

          {/* Dedicated Exam-Style Average Bond Enthalpies Table (not in WJEC Data Booklet) */}
          <div className="w-full max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] font-black tracking-widest text-slate-500">
                Average Bond Enthalpies
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Provided in Question
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                {[BOND_ENTHALPY_TABLE.slice(0, 6), BOND_ENTHALPY_TABLE.slice(6)].map((col, colIdx) => (
                  <table key={colIdx} className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 text-[11px] font-bold text-slate-500">Bond</th>
                        <th className="py-2 px-3 text-[11px] font-bold text-slate-500 text-right">kJ mol⁻¹</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {col.map((row) => (
                        <tr key={row.bond} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 text-xs font-mono font-bold text-slate-800">{row.bond}</td>
                          <td className="py-2 px-3 text-xs font-mono text-right text-[#326fa0] font-black whitespace-nowrap">
                            {row.value} {row.note && <span className="font-semibold text-slate-500">{row.note}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            </div>
          </div>

          {/* Step 1 Bond Accounting Gate */}
          <div className="w-full max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm" style={{ textTransform: 'none' }}>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-400">
                  Step 1: Bond Enthalpy Accounting Gate
                </span>
                <h4 className="text-xs font-black text-slate-800 mt-1">
                  Sum Total Energies of Bonds Broken &amp; Bonds Formed
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setGateEnabled(!gateEnabled)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shrink-0 cursor-pointer"
              >
                {gateEnabled ? 'Skip Gate' : 'Enable Gate'}
              </button>
            </div>

            {gateEnabled && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      ΣE(bonds broken) in kJ mol⁻¹:
                    </label>
                    <input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={gateVerified}
                      value={gateInputs.broken}
                      onChange={(e) => setGateInputs({ ...gateInputs, broken: e.target.value })}
                      placeholder="e.g. 2640"
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      ΣE(bonds formed) in kJ mol⁻¹:
                    </label>
                    <input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={gateVerified}
                      value={gateInputs.formed}
                      onChange={(e) => setGateInputs({ ...gateInputs, formed: e.target.value })}
                      placeholder="e.g. 3462"
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 font-medium">
                    ΔH = ΣE(bonds broken) − ΣE(bonds formed)
                  </span>
                  <button
                    type="button"
                    onClick={verifyGate}
                    disabled={gateVerified}
                    className="px-4 py-1.5 bg-[#326fa0] text-white text-xs font-black rounded-xl hover:bg-[#255580] disabled:bg-emerald-600 transition-colors shrink-0 cursor-pointer"
                  >
                    {gateVerified ? 'Verified ✓' : 'Verify Step 1'}
                  </button>
                </div>

                {gateFeedback.message && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold ${
                    gateFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {gateFeedback.message}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`w-full flex flex-col items-center transition-opacity ${isStep2Locked ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
              Step 2: Calculate the overall enthalpy change (ΔH) in kJ mol⁻¹.
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <ScientificInput
                value={coeff}
                exponent={exp}
                onValueChange={(v) => { setCoeff(v); if (feedback.message) setFeedback({ type: '', message: '' }); }}
                onExponentChange={(v) => { setExp(v); if (feedback.message) setFeedback({ type: '', message: '' }); }}
                label="ΔH ="
                placeholder="-822"
                status={feedback.type}
              />
              <span className="text-sm font-black text-slate-500 select-none">kJ mol⁻¹</span>
            </div>

            <div className="button-group w-full">
              <button className="btn btn-primary" onClick={checkAnswer} disabled={isStep2Locked}>Check Answer</button>
              <button className="btn btn-secondary" onClick={() => generateProblem()}>Next Problem &rarr;</button>
            </div>
          </div>
        </div>
      )}

      {feedback.message && (
        <div className={`feedback-box flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          <span>{feedback.message}</span>
          {feedback.type === 'success' && (
            <button
              type="button"
              onClick={() => generateProblem()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Next Problem &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EnthalpyCombustion;
