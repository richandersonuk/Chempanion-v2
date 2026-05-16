import React, { useState, useEffect, useRef } from 'react';

const ThermometricTitration = () => {
  const [mode, setMode] = useState('read_graph');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  
  // Interactive Crosshair & Pinch Scale States
  const [userVol, setUserVol] = useState(20.0);
  const [isDragging, setIsDragging] = useState(false);
  const [mainZoom, setMainZoom] = useState(1.0);
  
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
        text: <>A student titrated 25.0 cm³ of hydrochloric acid against sodium hydroxide solution. Pinch-zoom the <b>main graph</b> to magnify the plot, and drag the vertical cursor line to locate the intersection vertex.</>,
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
    setMainZoom(1.0);
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('read_graph');
  }, []);

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Maps screen click coordinates accurately when the main graph is zoomed/shifted
  const handleMove = (clientX) => {
    if (!svgRef.current || !problem.isGraph || !problem.graphData) return;
    const rect = svgRef.current.getBoundingClientRect();
    const screenPct = (clientX - rect.left) / rect.width;

    const xStartCoord = 40; const xEndCoord = 280;
    const getX = (vol) => xStartCoord + (vol / 50) * (xEndCoord - xStartCoord);
    const currentCursorX = getX(userVol);

    const baseW = 310;
    const w = baseW / mainZoom;
    let viewBoxX = currentCursorX - w / 2;
    if (viewBoxX < 0) viewBoxX = 0;
    if (viewBoxX + w > baseW) viewBoxX = baseW - w;

    const absoluteSvgX = viewBoxX + screenPct * w;
    
    let pctVolume = (absoluteSvgX - xStartCoord) / (xEndCoord - xStartCoord);
    if (pctVolume < 0) pctVolume = 0;
    if (pctVolume > 1) pctVolume = 1;
    
    // Strict 0.1 snapping grid calculation profile
    let computedVol = Math.round(pctVolume * 50 * 10) / 10;
    
    // Boundary lock to prevent line jumping onto the y-axis
    if (computedVol < 1.0) computedVol = 1.0;
    if (computedVol > 49.0) computedVol = 49.0;
    
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
      setIsDragging(false); 
      touchStartDistRef.current = getTouchDistance(e.touches);
      baseScaleRef.current = mainZoom;
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
      if (newScale > 3.5) newScale = 3.5; 
      setMainZoom(newScale);
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
        setFeedback({ message: `Incorrect endpoint reading. Look closely at the graduation marks inside the zoom lens.`, status: 'error' });
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

  // Fully isolated layout wrapper context to completely eliminate calculation screen crashes
  let graphContent = null;
  if (mode === 'read_graph' && problem.graphData) {
    const xStartC = 40; const xEndC = 280;
    const yTopC = 20; const yBottomC = 130;

    const getX = (vol) => xStartC + (vol / 50) * (xEndC - xStartC);
    const getY = (temp) => {
      const minT = problem.graphData.tStart - 2;
      const maxT = problem.graphData.tMax + 2;
      return yBottomC - ((temp - minT) / (maxT - minT)) * (yBottomC - yTopC);
    };

    const cursorX = getX(userVol);

    // Dynamic dynamic viewBox dimensions configuration
    const baseW = 310; const baseH = 160;
    const viewW = baseW / mainZoom;
    const viewH = baseH / mainZoom;
    
    let viewX = cursorX - viewW / 2;
    let viewY = 80 - viewH / 2;
    
    if (viewX < 0) viewX = 0;
    if (viewX + viewW > baseW) viewX = baseW - viewW;
    if (viewY < 0) viewY = 0;
    if (viewY + viewH > baseH) viewY = baseH - viewH;

    const mainViewBoxString = `${viewX} ${viewY} ${viewW} ${viewH}`;

    // Generator logic for the non-scrolling tracking zoom indicator lens panel
    const zoomTicks = [];
    const minTickBound = Math.floor((userVol - 2.0) * 10) / 10;
    const maxTickBound = Math.ceil((userVol + 2.0) * 10) / 10;
    for (let t = minTickBound; t <= maxTickBound; t += 0.1) {
      zoomTicks.push(parseFloat(t.toFixed(1)));
    }

    graphContent = (
      <div className="w-full max-w-md mx-auto my-4 flex flex-col items-center gap-4">
        {/* Main interactive canvas plot */}
        <div 
          className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm select-none relative cursor-crosshair touch-none overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          <svg 
            ref={svgRef}
            viewBox={mainViewBoxString} 
            className="w-full h-auto overflow-visible transition-all duration-75"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <line x1={xStartC} y1={yTopC} x2={xEndC} y2={yTopC} stroke="#f1f5f9" />
            <line x1={xStartC} y1={75} x2={xEndC} y2={75} stroke="#f1f5f9" />
            <line x1={xStartC} y1={yBottomC} x2={xEndC} y2={yBottomC} stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1={xStartC} y1={yTopC} x2={xStartC} y2={yBottomC} stroke="#cbd5e1" strokeWidth="1.5" />

            {[0, 10, 20, 30, 40, 50].map((v) => (
              <g key={v}>
                <line x1={getX(v)} y1={yBottomC} x2={getX(v)} y2={yBottomC + 4} stroke="#94a3b8" />
                <text x={getX(v)} y={yBottomC + 13} textAnchor="middle" className="text-[9px] font-mono font-black fill-slate-400">{v}</text>
              </g>
            ))}
            <text x="160" y="157" textAnchor="middle" className="text-[9px] font-black fill-slate-400 uppercase tracking-wider">Volume of NaOH added (cm³)</text>

            {[Math.floor(problem.graphData.tStart), Math.ceil(problem.graphData.tMax)].map((t) => (
              <g key={t}>
                <line x1={xStartC - 4} y1={getY(t)} x2={xStartC} y2={getY(t)} stroke="#94a3b8" />
                <text x={xStartC - 7} y={getY(t) + 3} textAnchor="end" className="text-[9px] font-mono font-bold fill-slate-400">{t}°C</text>
              </g>
            ))}

            <line x1={getX(0)} y1={getY(problem.graphData.tStart)} x2={getX(problem.graphData.endpointVol)} y2={getY(problem.graphData.tMax)} stroke="#326fa0" strokeWidth="2" strokeDasharray="3 2" />
            <line x1={getX(problem.graphData.endpointVol)} y1={getY(problem.graphData.tMax)} x2={getX(50)} y2={getY(problem.graphData.tEnd)} stroke="#e11d48" strokeWidth="2" strokeDasharray="3 2" />

            <line x1={cursorX} y1={yTopC - 5} x2={cursorX} y2={yBottomC + 5} stroke="#f59e0b" strokeWidth="2" />
            <polygon points={`${cursorX},${yTopC - 5} ${cursorX - 4},${yTopCoord - 12} ${cursorX + 4},${yTopCoord - 12}`} className="fill-amber-500" />
          </svg>
        </div>

        {/* --- DYNAMIC TRACKING LENS: NO SCROLL, PERMANENT VERTICAL ALIGNMENT --- */}
        <div className="w-full bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col items-center select-none">
          <span className="text-[8px] font-black tracking-widest uppercase text-amber-400 mb-3">Magnified Tracking Lens (0.1 cm³ subdivisions)</span>
          
          <svg viewBox="0 0 300 45" className="w-full h-auto overflow-hidden">
            {/* Ambient background hash guide overlay */}
            <rect x="0" y="0" width="300" height="35" fill="#1e293b" opacity="0.4" />
            
            {/* Dynamically shifts the tick grid layout under the fixed cursor anchor */}
            {zoomTicks.map((v) => {
              if (v < 0 || v > 50) return null;
              
              // Centers alignment calculation directly at x=150 baseline
              const xPos = 150 + (v - userVol) * 80; 
              if (xPos < -10 || xPos > 310) return null;

              const isInteger = v % 1 === 0;
              const isHalf = v % 0.5 === 0;

              return (
                <g key={v} transform={`translate(${xPos}, 0)`}>
                  <line 
                    x1="0" y1="0" x2="0" 
                    y2={isInteger ? "18" : isHalf ? "12" : "7"} 
                    stroke={isInteger ? "#94a3b8" : isHalf ? "#64748b" : "#475569"} 
                    strokeWidth={isInteger ? "1.5" : "1"} 
                  />
                  {isInteger && (
                    <text x="0" y="29" textAnchor="middle" className="text-[9px] font-mono font-black fill-slate-400">
                      {v.toFixed(0)}.0
                    </text>
                  )}
                </g>
              );
            })}

            {/* Permanent Dead-Center Tracking Pointer Anchor Line */}
            <line x1="150" y1="0" x2="150" y2="35" stroke="#f59e0b" strokeWidth="2" strokeDasharray="none" />
            <circle cx="150" cy="2" r="3" className="fill-amber-400" />
          </svg>
        </div>
      </div>
    );
  }

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

      {graphContent}

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      {/* --- VALUE ENTRY SLIP CONTAINER --- */}
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
