import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const EnthalpyCombustion = () => {
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Simulation animation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [displayTemp, setDisplayTemp] = useState(21.0);
  const [simCompleted, setSimCompleted] = useState(false);

  const fuels = [
    { name: 'methanol', formula: 'CH₃OH', mr: 32.04 },
    { name: 'ethanol', formula: 'C₂H₅OH', mr: 46.07 },
    { name: 'propan-1-ol', formula: 'C₃H₇OH', mr: 60.10 },
    { name: 'butan-1-ol', formula: 'C₄H₉OH', mr: 74.12 }
  ];

  const generateProblem = () => {
    const fuel = fuels[Math.floor(Math.random() * fuels.length)];
    
    // 50g-250g intervals with 100g weighted at 50% probability
    const randRoll = Math.random();
    const massWater = randRoll < 0.50 
      ? 100 
      : [50, 150, 200, 250][Math.floor(Math.random() * 4)];

    const tempRise = (Math.random() * 15 + 10).toFixed(1); // 10-25 C
    const massBurned = (Math.random() * 0.5 + 0.5).toFixed(2); // 0.5-1.0g
    
    // Q = mcΔT (c = 4.18 J g⁻¹ °C⁻¹)
    const q_joules = massWater * 4.18 * parseFloat(tempRise);
    // n = m / Mr
    const moles = parseFloat(massBurned) / fuel.mr;
    // ΔH = -Q / (n * 1000) for kJ/mol
    const deltaH = -(q_joules / (moles * 1000));

    setProblem({ fuel, massWater, tempRise, massBurned, correctH: deltaH });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
    
    // Reset simulation parameters
    setIsSimulating(false);
    setSimCompleted(false);
    setDisplayTemp(21.0);
  };

  useEffect(() => { 
    generateProblem(); 
  }, []);

  const handleRunSimulation = () => {
    if (isSimulating || simCompleted) return;
    setIsSimulating(true);

    const baseTemp = 21.0;
    const targetTemp = baseTemp + parseFloat(problem.tempRise);
    const duration = 2000; // 2 seconds total simulation sweep
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

  const checkAnswer = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;
    
    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctH) / problem.correctH);

    if (error < 0.02) {
      setFeedback({ 
        type: 'success', 
        message: `Correct! ΔH = ${problem.correctH.toFixed(1)} kJ mol⁻¹. Great job managing the negative sign conventions for exothermic combustion pathways!` 
      });
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

  return (
    <div className="applet-container">
      <div className="applet-header">Enthalpy of Combustion</div>

      {/* --- LABORATORY QUESTION INTRO --- */}
      <div className="question-text text-center mb-4">
        <p>
          A student configures a copper calorimetry system to establish the empirical enthalpy changes of straight-chain alcohols.<br />
          The apparatus is initialized with a beaker containing <b>{problem.massWater} g</b> of water directly above a spirit burner filled with <b>{problem.fuel.name}</b> ({problem.fuel.formula}).
        </p>
      </div>

      {/* --- SIMULATION CANVAS BOX (Sits directly underneath intro text) --- */}
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

          {/* Beaker / Calorimeter Framework */}
          <rect x="60" y="30" width="80" height="70" rx="4" fill="none" stroke="#94a3b8" strokeWidth="3" />
          
          {/* Water Area base fill */}
          <rect 
            x="62" 
            y="45" 
            width="76" 
            height="53" 
            fill={simCompleted ? '#fed7aa' : '#e0f2fe'} 
            className="transition-colors duration-1000"
          />
          
          {/* Active water ripples */}
          {isSimulating && (
            <path d="M62,45 Q70,42 80,45 T100,45 T120,45 T138,45" fill="none" stroke="#bae6fd" strokeWidth="2" className="animate-pulse" />
          )}

          <text x="100" y="75" textAnchor="middle" className="text-[9px] font-mono fill-slate-400 font-bold">
            {problem.massWater}g H₂O
          </text>

          {/* Thermometer Stem */}
          <rect x="115" y="15" width="8" height="70" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="2" />
          <circle cx="119" cy="85" r="7" fill="#ffffff" stroke="#475569" strokeWidth="2" />
          
          {/* Fluid gauge adjustments */}
          <rect x="117.5" y={85 - thermPercent * 0.7} width="3" height={thermPercent * 0.7} fill="#ef4444" />
          <circle cx="119" cy="85" r="5" fill="#ef4444" />

          {/* Spirit Burner body structure */}
          <path d="M70,145 L130,145 L120,120 L80,120 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          <line x1="100" y1="120" x2="100" y2="112" stroke="#334155" strokeWidth="3" />

          {/* Absolute anchored chemical flame */}
          {isSimulating && (
            <path 
              d="M94,112 C92,102 100,88 100,88 C100,88 108,102 106,112 C106,115 103,117 100,117 C97,117 94,115 94,112 Z" 
              className="chem-active-flame"
              style={{ transformOrigin: '100px 112px' }}
            />
          )}

          {/* Temperature HUD Readout Overlay */}
          <g transform="translate(140, 25)">
            <rect x="0" y="0" width="55" height="20" rx="5" fill="#1e293b" />
            <text x="27.5" y="13" textAnchor="middle" fill="#22c55e" className="text-[10px] font-mono font-black tracking-tight">
              {displayTemp.toFixed(1)}°C
            </text>
          </g>
        </svg>

        {/* Lab Execution Controller Switcher */}
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

      {/* --- DATA METRIC NOTEBOOK DISPLAY PANEL (Sits below simulation card) --- */}
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

      {/* --- CONDITIONALLY RENDERED INTERACTIVE CALCULATION HOOKS --- */}
      {simCompleted ? (
        <div className="animate-fade-in w-full flex flex-col items-center">
          <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            Calculate the structural enthalpy of combustion for {problem.fuel.name} in kJ mol⁻¹.
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
            <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
            <button className="btn btn-secondary" onClick={generateProblem}>New Problem</button>
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
