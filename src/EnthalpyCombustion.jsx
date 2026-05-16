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
    const massWater = Math.floor(Math.random() * 100 + 100); // 100-200g
    const tempRise = (Math.random() * 15 + 10).toFixed(1); // 10-25 C
    const massBurned = (Math.random() * 0.5 + 0.5).toFixed(2); // 0.5-1.0g
    
    // Q = mcΔT
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

  // Simulation run handler logic loop step increments
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
        message: 'Incorrect. Remember to calculate energy transferred to water (mcΔT), convert Joules to kJ, then divide by total moles of alcohol fuel consumed.' 
      });
    }
  };

  if (!problem) return null;

  // Percentage height for dynamic thermometer fluid filling calculation lines
  const thermPercent = Math.min(85, 25 + ((displayTemp - 21.0) / 30) * 60);

  return (
    <div className="applet-container">
      <div className="applet-header">Enthalpy of Combustion</div>

      <div className="question-text text-center">
        <p>
          In a calorimetry experiment, <b>{problem.massBurned} g</b> of <b>{problem.fuel.name}</b> ({problem.fuel.formula}) 
          was burned in air. The energy released was used to heat <b>{problem.massWater} g</b> of water inside a copper container.
        </p>
      </div>

      {/* --- PREMIUM LAB EXPERIMENT SIMULATION VECTOR GRAPHICS BOX --- */}
      <div className="w-full max-w-sm mx-auto bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-6 flex flex-col items-center shadow-inner relative overflow-hidden">
        
        <svg viewBox="0 0 200 180" className="w-48 h-auto select-none">
          {/* Beaker / Calorimeter Metal Wall Framework */}
          <rect x="60" y="30" width="80" height="70" rx="4" fill="none" stroke="#94a3b8" strokeWidth="3" />
          
          {/* Water Area Fluid Base with dynamic wave color changes when heated */}
          <rect 
            x="62" 
            y="45" 
            width="76" 
            height="53" 
            fill={simCompleted ? '#fed7aa' : '#e0f2fe'} 
            className="transition-colors duration-1000"
          />
          
          {/* Water Ripples during combustion animation active states */}
          {isSimulating && (
            <path d="M62,45 Q70,42 80,45 T100,45 T120,45 T138,45" fill="none" stroke="#bae6fd" strokeWidth="2" className="animate-pulse" />
          )}

          {/* Liquid content labels overlay marker text string */}
          <text x="100" y="75" textAnchor="middle" className="text-[9px] font-mono fill-slate-400 font-bold">
            {problem.massWater}g H₂O
          </text>

          {/* Thermometer Glass Structure Tube */}
          <rect x="115" y="15" width="8" height="70" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="2" />
          <circle cx="119" cy="85" r="7" fill="#ffffff" stroke="#475569" strokeWidth="2" />
          
          {/* Dynamic Interactive Thermometer Red Fluid column line elements */}
          <rect x="117.5" y={85 - thermPercent * 0.7} width="3" height={thermPercent * 0.7} fill="#ef4444" />
          <circle cx="119" cy="85" r="5" fill="#ef4444" />

          {/* Spirit Burner Container Body Panel Shape */}
          <path d="M70,145 L130,145 L120,120 L80,120 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          {/* Burner Wick Center Line */}
          <line x1="100" y1="120" x2="100" y2="112" stroke="#334155" strokeWidth="3" />

          {/* ANIMATED FLAME: Triggers visibility and dancing pulses only during simulator running intervals */}
          {isSimulating && (
            <path 
              d="M92,112 C92,95 100,85 100,85 C100,85 108,95 108,112 C108,118 104,122 100,122 C96,122 92,118 92,112 Z" 
              fill="#f97316" 
              className="animate-bounce"
              style={{ transformOrigin: '100px 120px', animationDuration: '0.6s' }}
            />
          )}

          {/* Temperature Numeric Overlay Display Badge */}
          <g transform="translate(140, 25)">
            <rect x="0" y="0" width="55" height="20" rx="5" fill="#1e293b" />
            <text x="27.5" y="13" textAnchor="middle" fill="#22c55e" className="text-[10px] font-mono font-black tracking-tight">
              {displayTemp.toFixed(1)}°C
            </text>
          </g>
        </svg>

        {/* Trigger Interactive Controller Button */}
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
          {simCompleted ? 'Experiment Finished ✓' : isSimulating ? 'Heating Solution...' : 'Run Simulation 🧪'}
        </button>
      </div>

      {/* --- STANDARDIZED ACTION QUESTION BLOCK --- */}
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        The temperature of the water rose by <b>{problem.tempRise} °C</b>.<br />
        Calculate the enthalpy of combustion for {problem.fuel.name} in kJ mol⁻¹.
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

      {feedback.message && (
        <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default EnthalpyCombustion;
