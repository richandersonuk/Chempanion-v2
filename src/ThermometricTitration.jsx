import React, { useState, useEffect, useRef } from 'react';

const ThermometricTitration = () => {
  const [mode, setMode] = useState('read_graph');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  
  // Interactive Slider Crosshair State
  const [userVol, setUserVol] = useState(1.0); 
  const [isDragging, setIsDragging] = useState(false);
  
  const svgRef = useRef(null);
  const prevXRef = useRef(0);

  // Layout Viewport Metrics Constants
  const xStart = 40; 
  const xEnd = 280;
  const yTop = 20; 
  const yBottom = 130;
  const baseW = 310; 
  const baseH = 160;

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
        text: <>A student titrated 25.0 cm³ of hydrochloric acid against sodium hydroxide solution. Click or tap near the intersection vertex; the <b>main graph paper grid will scale up</b> automatically to keep the lines centered as you adjust your positioning.</>,
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
    setUserVol(1.0); 
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('read_graph');
  }, []);

  const getX = (vol) => xStart + (vol / 50) * (xEnd - xStart);

  const getDynamicZoom = (currentVol) => {
    if (!problem || !problem.graphData) return 1.0;
    const distance = Math.abs(currentVol - problem.graphData.endpointVol);
    if (distance < 6.0) {
      return 1.0 + (6.0 - distance) * 0.4;
    }
    return 1.0;
  };

  const getAbsoluteVol = (clientX) => {
    if (!svgRef.current || !problem.isGraph || !problem.graphData) return userVol;
    const rect = svgRef.current.getBoundingClientRect();
    const screenPct = (clientX - rect.left) / rect.width;

    const activeZoom = getDynamicZoom(userVol);
    const currentCursorX = getX(userVol);
    const viewW = baseW / activeZoom;
    
    let viewBoxX = currentCursorX - viewW / 2;
    if (viewBoxX < 0) viewBoxX = 0;
    if (viewBoxX + viewW > baseW) viewBoxX = baseW - viewW;

    const absoluteSvgX = viewBoxX + screenPct * viewW;
    
    let pctVolume = (absoluteSvgX - xStart) / (xEnd - xStart);
    if (pctVolume < 0) pctVolume = 0;
    if (pctVolume > 1) pctVolume = 1;
    
    let computedVol = Math.round(pctVolume * 50 * 10) / 10;
    if (computedVol < 1.0) computedVol = 1.0;
    if (computedVol > 49.0) computedVol = 49.0;
    return computedVol;
  };

  const handleRelativeMove = (currentClientX) => {
    if (!problem.isGraph || !problem.graphData) return;
    
    const deltaPixels = currentClientX - prevXRef.current;
    prevXRef.current = currentClientX;

    const motionDampener = 0.055; 

    setUserVol((prevVol) => {
      let nextVol = prevVol + (deltaPixels * motionDampener);
      nextVol = Math.round(nextVol * 10) / 10;
      
      if (nextVol < 1.0) nextVol = 1.0;
      if (nextVol > 49.0) nextVol = 49.0;
      return nextVol;
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setFeedback({ message: '', status: '' });
    
    const snappedVol = getAbsoluteVol(e.clientX);
    setUserVol(snappedVol);
    prevXRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleRelativeMove(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setFeedback({ message: '', status: '' });
    
    if (e.touches && e.touches[0]) {
      const touchX = e.touches[0].clientX;
      const snappedVol = getAbsoluteVol(touchX);
      setUserVol(snappedVol);
      prevXRef.current = touchX;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      handleRelativeMove(e.touches[0].clientX);
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
        setFeedback({ message: `Incorrect endpoint reading. Look closely at the graduation marks inside the tracking lens.`, status: 'error' });
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

  let graphContent = null;
  if (mode === 'read_graph' && problem.graphData) {
    const { tStart, tMax, tEnd, endpointVol } = problem.graphData;
    
    const getY = (temp) => {
      const minT = tStart - 2;
      const maxT = tMax + 2;
      return yBottom - ((temp - minT) / (maxT - minT)) * (yBottom - yTop);
    };

    let activeT = tStart;
    if (userVol <= endpointVol) {
      activeT = tStart + (userVol / endpointVol) * (tMax - tStart);
    } else {
      activeT = tMax - ((userVol - endpointVol) / (50 - endpointVol)) * (tMax - tEnd);
    }

    const cursorX = getX(userVol);
    const cursorY = getY(activeT);
    
    const distanceToTarget = Math.abs(userVol - endpointVol);
    const currentZoom = getDynamicZoom(userVol);
    
    // --- RECALIBRATED SMOOTH OPACITY GRADIENT ENGINE ---
    // Vertical line drops from 0.8 smoothly down to an ultra-low 0.15 at point zero
    const lineOpacity = distanceToTarget >= 6.0 ? 0.8 : 0.15 + (distanceToTarget / 6.0) * 0.65;
    // Yellow tracker node circle drops from 1.0 smoothly down to a faint 0.2
    const dotOpacity = distanceToTarget >= 6.0 ? 1.0 : 0.2 + (distanceToTarget / 6.0) * 0.8;

    const viewW = baseW / currentZoom;
    const viewH = baseH / currentZoom;
    
    let viewX = cursorX - viewW / 2;
    let viewY = cursorY - viewH / 2;
    
    if (viewX < 0) viewX = 0;
    if (viewX + viewW > baseW) viewX = baseW - viewW;
    if (viewY < 0) viewY = 0;
    if (viewY + viewH > baseH) viewY = baseH - viewH;

    const mainViewBoxString = `${viewX} ${viewY} ${viewW} ${viewH}`;

    const fineXLines = [];
    for (let x = 0; x <= 50; x += 1) fineXLines.push(x);

    const minTBound = Math.floor(tStart - 2);
    const maxTBound = Math.ceil(tMax + 2);
    const fineYLines = [];
    for (let y = minTBound; y <= maxTBound; y += 0.5) fineYLines.push(y);

    const zoomTicks = [];
    const minTickBound = Math.floor((userVol - 2.0) * 10) / 10;
    const maxTickBound = Math.ceil((userVol + 2.0) * 10) / 10;
    for (let t = minTickBound; t <= maxTickBound; t += 0.1) {
      zoomTicks.push(parseFloat(t.toFixed(1)));
    }

    graphContent = (
      <div className="w-full max-w-md mx-auto my-4 flex flex-col items-center gap-4">
        {/* Main Plot Framework Canvas */}
        <div 
          className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm select-none relative cursor-w-resize touch-none overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          <svg 
            ref={svgRef}
            viewBox={mainViewBoxString} 
            className="w-full h-auto overflow-visible transition-all duration-200 ease-out"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Faint Graph Paper Subdivisions */}
            {fineXLines.map(v => (
              <line 
                key={`fx-${v}`}
                x1={getX(v)} y1={yTop} x2={getX(v)} y2={yBottom} 
                stroke="#cbd5e1" 
                strokeWidth={v % 5 === 0 ? "0.6" : "0.3"} 
                opacity={currentZoom > 1.4 ? "0.5" : "0.15"} 
              />
            ))}
            {fineYLines.map(t => (
              <line 
                key={`fy-${t}`}
                x1={xStart} y1={getY(t)} x2={xEnd} y2={getY(t)} 
                stroke="#cbd5e1" 
                strokeWidth={t % 1 === 0 ? "0.6" : "0.3"} 
                opacity={currentZoom > 1.4 ? "0.5" : "0.15"} 
              />
            ))}

            {/* Major Outer Border Lines */}
            <line x1={xStart} y1={yTop} x2={xEnd} y2={yTop} stroke="#cbd5e1" opacity="0.5" />
            <line x1={xStart} y1={75} x2={xEnd} y2={75} stroke="#cbd5e1" opacity="0.3" />
            <line x1={xStart} y1={yBottom} x2={xEnd} y2={yBottom} stroke="#94a3b8" strokeWidth="1.2" />
            <line x1={xStart} y1={yTop} x2={xStart} y2={yBottom} stroke="#94a3b8" strokeWidth="1.2" />

            {/* Major X Axis Labels */}
            {[0, 10, 20, 30, 40, 50].map((v) => (
              <g key={v}>
                <line x1={getX(v)} y1={yBottom} x2={getX(v)} y2={yBottom + 3} stroke="#94a3b8" />
                <text x={getX(v)} y={yBottom + 11} textAnchor="middle" className="text-[8px] font-mono font-black fill-slate-400">{v}</text>
              </g>
            ))}
            <text x="160" y="154" textAnchor="middle" className="text-[9px] font-black fill-slate-400 uppercase tracking-wider">Volume of NaOH added (cm³)</text>

            {/* Major Y Axis Labels */}
            {[Math.floor(tStart), Math.ceil(tMax)].map((t) => (
              <g key={t}>
                <line x1={xStart - 3} y1={getY(t)} x2={xStart} y2={getY(t)} stroke="#94a3b8" />
                <text x={xStart - 6} y={getY(t) + 2.5} textAnchor="end" className="text-[8px] font-mono font-bold fill-slate-400">{t}°C</text>
              </g>
            ))}

            {/* Plotted Trend Lines */}
            <line x1={getX(0)} y1={getY(tStart)} x2={getX(endpointVol)} y2={getY(tMax)} stroke="#e11d48" strokeWidth="1" strokeDasharray="3 1.5" />
            <line x1={getX(endpointVol)} y1={getY(tMax)} x2={getX(50)} y2={getY(tEnd)} stroke="#326fa0" strokeWidth="1" strokeDasharray="3 1.5" />

            {/* 2D Crosshair Cursor Tracker with Proximity Fade Curves */}
            <line 
              x1={cursorX} y1={yTop} x2={cursorX} y2={yBottom} 
              stroke="#f59e0b" strokeWidth="1.5" 
              opacity={lineOpacity} 
              className="transition-opacity duration-150 ease-out"
            />
            <circle 
              cx={cursorX} 
              cy={cursorY} 
              r="3" 
              opacity={dotOpacity}
              className="fill-amber-500 stroke-white stroke-2 shadow-sm transition-opacity duration-150 ease-out" 
            />
          </svg>
        </div>

        {/* --- MAGNIFIED TRACKING LENS --- */}
        <div className="w-full bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col items-center select-none">
          <span className="text-[8px] font-black tracking-widest uppercase text-amber-400 mb-2.5">Magnified Tracking Lens (0.1 cm³ subdivisions)</span>
          
          <svg viewBox="0 0 300 45" className="w-full h-auto overflow-hidden">
            <rect x="0" y="0" width="300" height="35" fill="#1e293b" opacity="0.4" />
            
            {zoomTicks.map((v) => {
              if (v < 0 || v > 50) return null;
              
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

            <line x1="150" y1="0" x2="150" y2="35" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="150" cy="2" r="3" className="fill-amber-400" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      
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
        <div className="feedback-box feedback-error" style={{ textTransform: 'none', display: feedback.status === 'error' ? 'block' : 'none' }}>
          {feedback.message}
        </div>
      )}
      {feedback.status === 'success' && (
        <div className="feedback-box feedback-success" style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default ThermometricTitration;
