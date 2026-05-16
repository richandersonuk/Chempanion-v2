import React, { useState, useEffect } from 'react';

const ThermometricTitration = () => {
  const [mode, setMode] = useState('read_graph');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const selection = forcedMode || mode;
    setMode(selection);

    let newProb = {};
    
    // Core parameters rounded to realistic laboratory steps
    const volAcid = 25.0; 
    const endpointVol = Math.floor(15 + Math.random() * 16); // Integers between 15 and 30 cm³
    const tStart = parseFloat((18.5 + Math.random() * 3).toFixed(1));
    const deltaT = parseFloat((5.2 + Math.random() * 3).toFixed(1));
    const tMax = parseFloat((tStart + deltaT).toFixed(1));
    const tEnd = parseFloat((tMax - (50 - endpointVol) * 0.08).toFixed(1));

    if (selection === 'read_graph') {
      newProb = {
        title: "Thermometric Titration: Endpoint Extrapolation",
        text: <>A student titrated <b>{volAcid.toFixed(1)} cm³</b> of hydrochloric acid against sodium hydroxide solution inside an insulated polystyrene cup. The temperature was recorded after adding incremental volumes of alkali, and two lines of best fit were drawn.</>,
        question: "Analyse the extrapolated lines of best fit on the graph below. Determine the exact volume of sodium hydroxide required to reach the neutralisation equivalence point.",
        label: "Neutralisation Volume =",
        unit: "cm³",
        correct: endpointVol.toString(),
        graphData: { tStart, tMax, tEnd, endpointVol },
        isGraph: true
      };
    } else if (selection === 'calc_enthalpy') {
      const concAcid = 1.00; // Simplified to standard 1.00 mol dm⁻³ to isolate calorimetry skills
      const molesH2O = (volAcid * concAcid) / 1000; // 0.025 moles
      
      // Q = m * c * dT
      const totalMass = volAcid + endpointVol;
      const energyJ = totalMass * 4.18 * deltaT;
      const enthalpyKJ = -(energyJ / 1000) / molesH2O;

      newProb = {
        title: "Enthalpy of Neutralisation Calculation",
        text: <>In a thermometric titration experiment, <b>{volAcid.toFixed(1)} cm³</b> of <b>1.00 mol dm⁻³</b> hydrochloric acid (HCl) was completely neutralised by an extrapolated endpoint volume of <b>{endpointVol}.0 cm³</b> of sodium hydroxide (NaOH). The maximum temperature rise recorded from the intersection of the best-fit lines was <b>ΔT = {deltaT.toFixed(1)} °C</b>. (Specific heat capacity of water, c = 4.18 J g⁻¹ K⁻¹; density of solutions = 1.00 g cm⁻³).</>,
        question: "Calculate the molar enthalpy of neutralisation (ΔH) for this reaction in kJ mol⁻¹. State your answer to 3 significant figures.",
        label: "ΔH =",
        unit: "kJ mol⁻¹",
        correct: enthalpyKJ.toPrecision(3),
        isGraph: false
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('read_graph');
  }, []);

  const checkAnswer = () => {
    const rawInput = studentAnswer.trim();
    if (!rawInput) return;

    if (mode === 'read_graph') {
      if (rawInput === problem.correct) {
        setFeedback({ message: "Correct! The intersection vertex corresponds precisely to the equivalence volume point.", status: 'success' });
      } else {
        setFeedback({ message: `Incorrect. Look directly at the apex where the temperature rise line meets the cooling line, then project down to the volume axis.`, status: 'error' });
      }
      return;
    }

    // --- ENTHALPY SPECIFICATION CHECKS ---
    const userVal = parseFloat(rawInput);
    const correctVal = parseFloat(problem.correct);

    if (isNaN(userVal)) return;

    if (userVal > 0) {
      setFeedback({ 
        message: "WJEC Sign Trap! Neutralisation is an exothermic process (heat is released to the surroundings, causing the temperature rise). Your final ΔH value MUST include an explicit negative (−) sign.", 
        status: 'error' 
      });
      return;
    }

    const percentageError = Math.abs((userVal - correctVal) / correctVal);
    if (percentageError < 0.015) {
      setFeedback({ message: `Correct! ΔH = ${problem.correct} kJ mol⁻¹. Excellent rounding and unit translation.`, status: 'success' });
    } else {
      setFeedback({ 
        message: "Incorrect calculation. Check if you remembered to combine both solution volumes (Acid + Alkali) to find the true mass 'm' in your Q = mcΔT step before converting to kJ per mole of water formed.", 
        status: 'error' 
      });
    }
  };

  if (!problem) return null;

  // SVG Graph Coordinate Calculators
  const getGraphCoordinates = () => {
    if (!problem.isGraph) return null;
    const { tStart, tMax, tEnd, endpointVol } = problem.graphData;
    
    // Map data points onto a 300x150 SVG frame viewport boundary grid box
    const xStart = 40;
    const xEnd = 280;
    const yTop = 20;
    const yBottom = 130;

    const getX = (vol) => xStart + (vol / 50) * (xEnd - xStart);
    const getY = (temp) => {
      const minT = tStart - 2;
      const maxT = tMax + 2;
      return yBottom - ((temp - minT) / (maxT - minT)) * (yBottom - yTop);
    };

    return { getX, getY, tStart, tMax, tEnd, endpointVol };
  };

  const gCoords = getGraphCoordinates();

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      
      {/* --- DASHBOARD CONTROL TOGGLE --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4" style={{ textTransform: 'none' }}>
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center justify-center" style={{ textTransform: 'none' }}>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="w-full max-w-xs bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm text-center"
            style={{ textTransform: 'none' }}
          >
            <option value="read_graph">Identify Endpoint from Extrapolated Graph</option>
            <option value="calc_enthalpy">Calculate Enthalpy of Neutralisation (ΔH)</option>
          </select>
        </div>
      </div>

      <div className="applet-header" style={{ textTransform: 'none' }}>{problem.title}</div>
      <div className="question-text text-center px-4 leading-relaxed" style={{ textTransform: 'none' }}>{problem.text}</div>

      {/* --- HIGH FIDELITY EXTRAPOLATION SCATTER GRAPH --- */}
      {mode === 'read_graph' && gCoords && (
        <div className="w-full max-w-md mx-auto my-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm select-none">
          <svg viewBox="0 0 310 160" className="w-full h-auto overflow-visible">
            {/* Grid Lines */}
            <line x1="40" y1="20" x2="280" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="75" x2="280" y2="75" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="130" x2="280" y2="130" stroke="#cbd5e1" strokeWidth="1.5" /> {/* X Axis Line */}
            <line x1="40" y1="20" x2="40" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />  {/* Y Axis Line */}

            {/* X Axis Labels */}
            {[0, 10, 20, 30, 40, 50].map((v) => (
              <g key={v}>
                <line x1={gCoords.getX(v)} y1="130" x2={gCoords.getX(v)} y2="134" stroke="#94a3b8" strokeWidth="1" />
                <text x={gCoords.getX(v)} y="146" textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-500">{v}</text>
              </g>
            ))}
            <text x="160" y="159" textAnchor="middle" className="text-[9px] font-black fill-slate-400 uppercase tracking-wider">Volume of NaOH added (cm³)</text>

            {/* Y Axis Labels */}
            {[Math.floor(gCoords.tStart), Math.ceil(gCoords.tMax)].map((t) => (
              <g key={t}>
                <line x1="36" y1={gCoords.getY(t)} x2="40" y2={gCoords.getY(t)} stroke="#94a3b8" strokeWidth="1" />
                <text x="30" y={gCoords.getY(t) + 3} textAnchor="end" className="text-[9px] font-mono font-bold fill-slate-500">{t}°C</text>
              </g>
            ))}

            {/* Extrapolated Trend Lines Meeting at Endpoint Vertex */}
            <line 
              x1={gCoords.getX(0)} y1={gCoords.getY(gCoords.tStart)} 
              x2={gCoords.getX(gCoords.endpointVol)} y2={gCoords.getY(gCoords.tMax)} 
              stroke="#326fa0" strokeWidth="2" strokeDasharray="2 2"
            />
            <line 
              x1={gCoords.getX(gCoords.endpointVol)} y1={gCoords.getY(gCoords.tMax)} 
              x2={gCoords.getX(50)} y2={gCoords.getY(gCoords.tEnd)} 
              stroke="#e11d48" strokeWidth="2" strokeDasharray="2 2"
            />

            {/* Intersecting Vertex Node Pinpoint marker */}
            <circle cx={gCoords.getX(gCoords.endpointVol)} cy={gCoords.getY(gCoords.tMax)} r="4" className="fill-amber-500 stroke-white stroke-2 shadow-sm animate-pulse" />
          </svg>
        </div>
      )}

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      {/* --- ENTRY LAYOUT SLIP ROW --- */}
      <div className="w-full flex items-center justify-center my-6 overflow-x-auto" style={{ textTransform: 'none' }}>
        <div 
          className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
          style={{ textTransform: 'none' }}
        >
          <label className="text-sm font-black text-slate-600 select-none" style={{ textTransform: 'none' }}>{problem.label}</label>
          <input 
            type="text" 
            className={`chem-input ${feedback.status}`}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder={mode === 'read_graph' ? "0" : "-57.0"}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            style={{ maxWidth: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', textTransform: 'none' }}
          />
          {problem.unit && <span className="text-sm font-black text-slate-500 select-none" style={{ textTransform: 'none' }}>{problem.unit}</span>}
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem(mode)}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default ThermometricTitration;
