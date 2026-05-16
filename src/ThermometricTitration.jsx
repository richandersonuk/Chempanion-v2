import React, { useState, useEffect, useRef } from 'react';

const ThermometricTitration = () => {
  const [mode, setMode] = useState('read_graph');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  
  // Interactive Slider Crosshair & Pinch States
  const [userVol, setUserVol] = useState(20.0);
  const [isDragging, setIsDragging] = useState(false);
  const [pinchScale, setPinchScale] = useState(1.0);
  
  const svgRef = useRef(null);
  const touchStartDistRef = useRef(0);
  const baseScaleRef = useRef(1.0);

  const generateProblem = (forcedMode = null) => {
    const selection = forcedMode || mode;
    setMode(selection);

    let newProb = {};
    
    const volAcid = 25.0; 
    const endpointVol = parseFloat((16 + Math.random() * 12).toFixed(1)); 
    const tStart = parseFloat((18.5 + Math.random() * 3).toFixed(1));
    const deltaT = parseFloat((5.2 + Math.random() * 3).toFixed(1));
    const tMax = parseFloat((tStart + deltaT).toFixed(1));
    const tEnd = parseFloat((tMax - (50 - endpointVol) * 0.08).toFixed(1));

    if (selection === 'read_graph') {
      newProb = {
        title: "Thermometric Titration: Graphical Interpretation",
        text: <>A student titrated 25.0 cm³ of hydrochloric acid against sodium hydroxide. Drag the <b>vertical cursor line</b> to align with the intersection vertex. Use the high-precision tracking zoom window underneath to determine the exact neutralisation endpoint volume.</>,
        question: "State the precise volume of sodium hydroxide required to reach the maximum temperature equivalence point to the nearest 0.1 cm³.",
        label: "Endpoint Volume =",
        unit: "cm³",
        correct: endpointVol.toFixed(1),
        graphData: { tStart, tMax, tEnd, endpointVol },
        isGraph: true
      };
    } else if (selection === 'calc_enthalpy') {
      const concAcid = 1.00; 
      const molesH2O = (volAcid * concAcid) / 1000; 
      
      const totalMass = volAcid + endpointVol;
      const energyJ = totalMass * 4.18 * deltaT;
      const enthalpyKJ = -(energyJ / 1000) / molesH2O;

      newProb = {
        title: "Enthalpy of Neutralisation Calculation",
        text: <>In a thermometric titration experiment, 25.0 cm³ of 1.00 mol dm⁻³ hydrochloric acid (HCl) was neutralised by an extrapolated endpoint volume of <b>{endpointVol.toFixed(1)} cm³</b> of sodium hydroxide (NaOH). The maximum temperature rise recorded was <b>ΔT = {deltaT.toFixed(1)} °C</b>. (c = 4.18 J g⁻¹ K⁻¹; density = 1.00 g cm⁻³).</>,
        question: "Calculate the molar enthalpy of neutralisation (ΔH) in kJ mol⁻¹. State your final answer to 3 significant figures.",
        label: "ΔH =",
        unit: "kJ mol⁻¹",
        correct: enthalpyKJ.toPrecision(3),
        isGraph: false
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setUserVol(20.0);
    setPinchScale(1.0);
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('read_graph');
  }, []);

  // Multi-touch geometry calculation utility
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMove = (clientX) => {
    if (!svgRef.current || !problem.isGraph) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xRelative = clientX - rect.left;
    
    const xStart = 40;
    const xEnd = 280;
    
    let pct = (xRelative - xStart) / (xEnd - xStart);
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    
    let computedVol = parseFloat((pct * 50).toFixed(1));
    // Enforce line boundary protection to start just away from zero
    if (computedVol < 1.0) computedVol = 1.0;
    
    setUserVol(computedVol);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setIsDragging(false); // Stop pointer tracking while active pinch gesture rules apply
      touchStartDistRef.current = getTouchDistance(e.touches);
      baseScaleRef.current = pinchScale;
      return;
    }
    setIsDragging(true);
    if (e.touches ? e.touches[0] : null) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dist = getTouchDistance(e.touches);
      const factor = dist / touchStartDistRef.current;
      let newScale = baseScaleRef.current * factor;
      if (newScale < 1.0) newScale = 1.0;
      if (newScale > 3.0) newScale = 3.0; // Restrict scale caps
      setPinchScale(newScale);
      return;
    }
    if (!isDragging) return;
    if (e.touches ? e.touches[0] : null) {
      handleMove(e.touches[0].clientX);
    }
  };

  const checkAnswer = () => {
    const rawInput = studentAnswer.trim();
    if (!rawInput) return;

    if (mode === 'read_graph') {
      const userNum = parseFloat(rawInput);
      const targetNum = parseFloat(problem.correct);
      
      if (Math.abs(userNum - targetNum) < 0.15) {
        setFeedback({ message: `Correct! The target intersection sits precisely at ${problem.correct} cm³.`, status: 'success' });
      } else {
        setFeedback({ message: `Incorrect endpoint reading. Locate the alignment vertex inside the graduation axis.`, status: 'error' });
      }
      return;
    }

    const userVal = parseFloat(rawInput);
    const correctVal = parseFloat(problem.correct);

    if (isNaN(userVal)) return;

    if (userVal > 0) {
      setFeedback({ 
        message: "WJEC Sign Trap! Neutralisation is exothermic. Your final ΔH value must include an explicit negative (−) sign.", 
        status: 'error' 
      });
      return;
    }

    const rawClean = rawInput.replace('-', '');
    const sFigs = rawClean.replace('.', '').replace(/^0+/, '');
    if (sFigs.length !== 3 && !rawClean.endsWith('.0')) {
      setFeedback({
        message: "Precision Error: The question explicitly demands your answer to exactly 3 significant figures.",
        status: 'error'
      });
      return;
    }

    const percentageError = Math.abs((userVal - correctVal) / correctVal);
    if (percentageError < 0.015) {
      setFeedback({ message: `Correct! ΔH = ${problem.correct} kJ mol⁻¹.`, status: 'success' });
    } else {
      setFeedback({ 
        message: "Incorrect calculation. Ensure you used combined volumes for total reacting solution mass 'm' inside Q = mcΔT.", 
        status: 'error' 
      });
    }
  };

  if (!problem) return null;

  // Render Coordinate Geometry Map Blocks protected inside dynamic environment blocks
  let graphContent = null;
  if (mode === 'read_graph' && problem.graphData) {
    const xStartCoord = 40; const xEndCoord = 280;
    const yTopCoord = 20; const yBottomCoord = 130;

    const getX = (vol) => xStartCoord + (vol / 50) * (xEndCoord - xStartCoord);
    const getY = (temp) => {
      const minT = problem.graphData.tStart - 2;
      const maxT = problem.graphData.tMax + 2;
      return yBottomCoord - ((temp - minT) / (maxT - minT)) * (yBottomCoord - yTopCoord);
    };

    const cursorX = getX(userVol);

    // Dynamic focal tracking calculations centered around the sliding user variable
    const dynamicHalfRange = 3.5 / pinchScale;
    const zoomMinVol = Math.max(0, userVol - dynamicHalfRange);
    const zoomMaxVol = Math.min(50, userVol + dynamicHalfRange);

    const getZoomTicks = () => {
      let ticks = [];
      let start = Math.floor(zoomMinVol * 10) / 10;
      let end = Math.ceil(zoomMaxVol * 10) / 10;
      for (let v = start; v <= end; v += 0.1) {
        ticks.push(parseFloat(v.toFixed(1)));
      }
      return ticks;
    };

    graphContent = (
      <div className="w-full max-w-md mx-auto my-4 flex flex-col items-center gap-4">
        {/* Main Base Plot Frame */}
        <div 
          className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm select-none relative cursor-crosshair touch-none"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          <svg 
            ref={svgRef}
            viewBox="0 0 310 160" 
            className="w-full h-auto overflow-visible"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <line x1={xStartCoord} y1={yTopCoord} x2={xEndCoord} y2={yTopCoord} stroke="#f1f5f9" />
            <line x1={xStartCoord} y1={75} x2={xEndCoord} y2={75} stroke="#f1f5f9" />
            <line x1={xStartCoord} y1={yBottomCoord} x2={xEndCoord} y2={yBottomCoord} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={xStartCoord} y1={yTopCoord} x2={xStartCoord} y2={yBottomCoord} stroke="#cbd5e1" strokeWidth="1.5" />

            {[0, 10, 20, 30, 40, 50].map((v) => (
              <g key={v}>
                <line x1={getX(v)} y1={yBottomCoord} x2={getX(v)} y2={yBottomCoord + 4} stroke="#94a3b8" />
                <text x={getX(v)} y={yBottomCoord + 13} textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-400">{v}</text>
              </g>
            ))}
            <text x="160" y="157" textAnchor="middle" className="text-[9px] font-black fill-slate-400 uppercase tracking-wider">Volume of NaOH added (cm³)</text>

            {[Math.floor(problem.graphData.tStart), Math.ceil(problem.graphData.tMax)].map((t) => (
              <g key={t}>
                <line x1={xStartCoord - 4} y1={getY(t)} x2={xStartCoord} y2={getY(t)} stroke="#94a3b8" />
                <text x={xStartCoord - 7} y={getY(t) + 3} textAnchor="end" className="text-[9px] font-mono font-bold fill-slate-400">{t}°C</text>
              </g>
            ))}

            <line x1={getX(0)} y1={getY(problem.graphData.tStart)} x2={getX(problem.graphData.endpointVol)} y2={getY(problem.graphData.tMax)} stroke="#326fa0" strokeWidth="2" strokeDasharray="3 2" />
            <line x1={getX(problem.graphData.endpointVol)} y1={getY(problem.graphData.tMax)} x2={getX(50)} y2={getY(problem.graphData.tEnd)} stroke="#e11d48" strokeWidth="2" strokeDasharray="3 2" />

            {/* User Draggable Marker Indicator */}
            <line x1={cursorX} y1={yTopCoord - 5} x2={cursorX} y2={yBottomCoord + 5} stroke="#f59e0b" strokeWidth="2" />
            <polygon points={`${cursorX},${yTopCoord - 5} ${cursorX - 4},${yTopCoord - 12} ${cursorX + 4},${yTopCoord - 12}`} className="fill-amber-500" />
          </svg>
        </div>

        {/* Real-time Tracking Close-up Axis Strip */}
        <div className="w-full bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col items-center">
          <span className="text-[8px] font-black tracking-widest uppercase text-amber-400 mb-2.5">Live Tracking Zoom Grid (Pinch map to magnify)</span>
          
          <div className="w-full overflow-x-auto py-1 select-none">
            <div className="min-w-[480px] h-12 relative border-b border-slate-700">
              {getZoomTicks().map((v) => {
                const pct = (v - zoomMinVol) / (zoomMaxVol - zoomMinVol);
                if (pct < 0 || pct > 1) return null;
                const leftPos = `${pct * 100}%`;
                const isInt = v % 1 === 0;

                return (
                  <div key={v} className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center" style={{ left: leftPos }}>
                    <div className={`w-[1px] bg-slate-700 ${isInt ? 'h-4 bg-slate-400' : 'h-2'}`} />
                    {isInt && <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">{v}.0</span>}
                  </div>
                );
              })}

              {/* Real user tracking pointer alignment dot */}
              <div 
                className="absolute top-0 w-0.5 h-6 bg-amber-500 z-20 shadow-glow"
                style={{ left: `${((userVol - zoomMinVol) / (zoomMaxVol - zoomMinVol)) * 100}%` }}
              >
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full absolute -bottom-0.5 left-1/2 transform -translate-x-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      
      {/* --- DASHBOARD MODE SELECT --- */}
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

      {graphContent}

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      {/* --- ENTRY CONTAINER --- */}
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
            placeholder={mode === 'read_graph' ? "0.0" : "-57.0"}
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
