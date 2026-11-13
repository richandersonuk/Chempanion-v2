import React, { useState, useEffect } from 'react';
import ScientificInput from '../../components/shared/ScientificInput';

const EnthalpyCombustion = ({ onComplete }) => {
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [isSimulating, setIsSimulating] = useState(false);
  const [displayTemp, setDisplayTemp] = useState(21.0);
  const [simCompleted, setSimCompleted] = useState(false);

  // WJEC Unit & Stoichiometry Gate (Step 1: Verify Q in kJ and n in mol)
  const [gateEnabled, setGateEnabled] = useState(true);
  const [gateVerified, setGateVerified] = useState(false);
  const [gateInputs, setGateInputs] = useState({ qKJ: '', nMol: '' });
  const [gateFeedback, setGateFeedback] = useState({ type: '', message: '' });

  const fuels = [
    { name: 'methanol', formula: 'CH₃OH', mr: 32.04 },
    { name: 'ethanol', formula: 'C₂H₅OH', mr: 46.07 },
    { name: 'propan-1-ol', formula: 'C₃H₇OH', mr: 60.10 },
    { name: 'butan-1-ol', formula: 'C₄H₉OH', mr: 74.12 }
  ];

  const generateProblem = () => {
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

    setProblem({ fuel, massWater, tempRise, massBurned, q_kJ, moles, correctH: deltaH });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });

    setIsSimulating(false);
    setSimCompleted(false);
    setDisplayTemp(21.0);
    setGateVerified(false);
    setGateInputs({ qKJ: '', nMol: '' });
    setGateFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleRunSimulation = () => {
    if (isSimulating || simCompleted) return;
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

    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctH) / problem.correctH);

    if (error < 0.02) {
      setFeedback({
        type: 'success',
        message: `Correct! ΔH = ${problem.correctH.toFixed(1)} kJ mol⁻¹. Great job managing the negative sign conventions for exothermic combustion pathways!`
      });
      onComplete?.(problem.fuel.name);
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
      <div className="applet-header">Enthalpy of Combustion</div>

      <div className="question-text text-center mb-4">
        <p>
          A student configures a copper calorimetry system to establish the empirical enthalpy changes of straight-chain alcohols.<br />
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
          {simCompleted ? 'Data Harvested ✓' : isSimulating ? 'Combusting Alcohol...' : 'Run Simulation 🧪'}
        </button>
      </div>

      <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-3 bg-slate-100 border border-slate-200 p-3 rounded-2xl mb-6">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm text-center">
          <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Mass of Fuel Burned</span>
          {simCompleted ? (
            <span className="text-base font-black text-slate-800">{problem.massBurned} g</span>
          ) : (
            <span className="text-xs font-bold text-amber-600 animate-pulse bg-amber-50 px-2 py-0.5 rounded border border-amber-200/40 inline-block">Awaiting Lab Run</span>
          )}
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm text-center">
          <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Temperature Rise (ΔT)</span>
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
          <div className="w-full max-w-lg mx-auto mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs" style={{ textTransform: 'none' }}>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  WJEC Unit Trap Gate
                </span>
                <h4 className="text-xs font-black text-slate-800 mt-1">
                  Step 1: Verify Heat Transferred Q (in kJ) & Moles of Fuel Burned (n)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setGateEnabled(!gateEnabled)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shrink-0"
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
                    className="px-4 py-1.5 bg-[#326fa0] text-white text-xs font-black rounded-xl hover:bg-[#255580] disabled:bg-emerald-600 transition-colors shrink-0"
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
              onValueChange={setCoeff}
              onExponentChange={setExp}
              label="ΔH ="
              status={feedback.type}
            />

            <div className="button-group">
              <button className="btn btn-primary" onClick={checkAnswer} disabled={isStep2Locked}>Check Answer</button>
              <button className="btn btn-secondary" onClick={generateProblem}>New Problem</button>
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
            onClick={generateProblem}
            className="w-full max-w-[12rem] bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-2 rounded-xl text-xs transition-colors"
          >
            Skip to Next Setup
          </button>
        </div>
      )}

      {feedback.message && (
        <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default EnthalpyCombustion;
