import React, { useState, useRef } from 'react';

const MechanismUnit2 = () => {
  const [problemIndex, setProblemIndex] = useState(0);
  const [stage, setStage] = useState('dipoles'); // 'dipoles', 'arrow', 'success'
  const [states, setStates] = useState({});
  
  const [arrowPoints, setArrowPoints] = useState({ start: null, mid: null, end: null });
  const [activeHandle, setActiveHandle] = useState(null); 
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  
  const svgRef = useRef(null);

  const mechanismPool = [
    {
      title: "1. Electrophilic Addition: Ethene + HBr (Unit 2.5)",
      taskText: "Tap the permanent dipole on the hydrogen halide, then draw the arrow from the electron-rich C=C bond to the electrophile.",
      correctStates: { 'node_H': 'plus', 'node_Br': 'minus' },
      startId: 'bond_alkene_center',
      endId: 'node_H',
      clickableElements: [
        { id: 'node_C1', type: 'atom', cx: 80, cy: 95, r: 22, display: '' },
        { id: 'node_C2', type: 'atom', cx: 140, cy: 55, r: 22, display: '' },
        { id: 'bond_alkene_center', type: 'bond', midX: 110, midY: 75, r: 24 },
        { id: 'node_H', type: 'atom', cx: 160, cy: 135, r: 22, display: 'H', style: 'fill-slate-700 font-sans text-sm font-black' },
        { id: 'node_Br', type: 'atom', cx: 220, cy: 135, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-sm font-black' }
      ],
      staticBonds: [
        { x1: 78, y1: 92, x2: 138, y2: 52 }, { x1: 82, y1: 98, x2: 142, y2: 58 },
        { x1: 50, y1: 115, x2: 80, y2: 95 }, { x1: 80, y1: 95, x2: 60, y2: 65 },
        { x1: 140, y1: 55, x2: 170, y2: 35 }, { x1: 140, y1: 55, x2: 160, y2: 85 },
        { x1: 174, y1: 135, x2: 206, y2: 135 }
      ],
      extraDecorators: () => null,
      explanation: "Correct! The high electron density of the alkene π-bond acts as a nucleophile, attacking the electron-deficient δ⁺ hydrogen atom."
    },
    {
      title: "2. Electrophilic Addition: Propene + HBr (Markovnikov Regioselectivity)",
      taskText: "Identify the H-Br dipoles. Note: The asymmetric alkene attacks to yield the more stable secondary carbocation intermediate.",
      correctStates: { 'node_H': 'plus', 'node_Br': 'minus' },
      startId: 'bond_alkene_center',
      endId: 'node_H',
      clickableElements: [
        { id: 'node_C1', type: 'atom', cx: 80, cy: 95, r: 22, display: '' },
        { id: 'node_C2', type: 'atom', cx: 140, cy: 55, r: 22, display: '' },
        { id: 'bond_alkene_center', type: 'bond', midX: 110, midY: 75, r: 24 },
        { id: 'node_H', type: 'atom', cx: 160, cy: 135, r: 22, display: 'H', style: 'fill-slate-700 font-sans text-sm font-black' },
        { id: 'node_Br', type: 'atom', cx: 220, cy: 135, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-sm font-black' }
      ],
      staticBonds: [
        { x1: 78, y1: 92, x2: 138, y2: 52 }, { x1: 82, y1: 98, x2: 142, y2: 58 },
        { x1: 50, y1: 115, x2: 80, y2: 95 }, { x1: 80, y1: 95, x2: 60, y2: 65 },
        { x1: 140, y1: 55, x2: 170, y2: 35 }, { x1: 170, y1: 35, x2: 210, y2: 35 }, // Added extra methyl branch for asymmetry
        { x1: 174, y1: 135, x2: 206, y2: 135 }
      ],
      extraDecorators: () => null,
      explanation: "Llongyfarchiadau! The incoming proton bonds to C1, leaving a positive charge on C2. This forms a secondary carbocation, which is more stable than a primary one due to the electron-donating inductive effect of the alkyl groups."
    },
    {
      title: "3. Nucleophilic Substitution (Sn2): Bromoethane + OH⁻ (Unit 2.5)",
      taskText: "Identify the polar C-Br bond dipoles, then map the nucleophilic attack originating from the hydroxide lone pair.",
      correctStates: { 'node_C_alpha': 'plus', 'node_Br': 'minus' },
      startId: 'node_OH_lone',
      endId: 'node_C_alpha',
      clickableElements: [
        { id: 'node_C_beta', type: 'atom', cx: 100, cy: 95, r: 20, display: '' },
        { id: 'node_C_alpha', type: 'atom', cx: 155, cy: 55, r: 24, display: '' },
        { id: 'node_Br', type: 'atom', cx: 215, cy: 55, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-sm font-black' },
        { id: 'node_OH_O', type: 'atom', cx: 155, cy: 135, r: 20, display: 'O', style: 'fill-rose-600 font-sans text-sm font-black' },
        { id: 'node_OH_H', type: 'atom', cx: 115, cy: 135, r: 16, display: 'H', style: 'fill-slate-600 font-sans text-xs font-semibold' },
        { id: 'node_OH_lone', type: 'lone_pair', cx: 155, cy: 116, r: 20, display: '••', style: 'fill-amber-500 font-mono text-sm font-black' }
      ],
      staticBonds: [
        { x1: 100, y1: 95, x2: 155, y2: 55 }, { x1: 155, y1: 55, x2: 201, y2: 55 },
        { x1: 141, y1: 135, x2: 125, y2: 135 }
      ],
      extraDecorators: () => <text x="168" y="146" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-sans font-black fill-slate-800 select-none">⁻</text>,
      explanation: "Perfect! Primary haloalkanes favor this concerted single-step substitution pathway because there is minimal steric hindrance blocking the nucleophile's approach."
    }
  ];

  const current = mechanismPool[problemIndex];

  const getSVGCoords = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX || (e.touches && e.touches[0]?.clientX);
    pt.y = e.clientY || (e.touches && e.touches[0]?.clientY);
    return pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };

  const findClosestSnapTarget = (x, y) => {
    let closestNode = null;
    let minDistance = 44; 

    current.clickableElements.forEach(el => {
      const targetX = el.cx || el.midX;
      const targetY = el.cy || el.midY;
      const dist = Math.hypot(x - targetX, y - targetY);
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = { x: targetX, y: targetY, id: el.id };
      }
    });
    return closestNode;
  };

  const handleCanvasPointerDown = (e) => {
    if (e.cancelable) e.preventDefault();
    const { x, y } = getSVGCoords(e);

    if (stage === 'dipoles') {
      const targetedNode = findClosestSnapTarget(x, y);
      if (targetedNode) {
        setStates(prev => {
          const currentVal = prev[targetedNode.id];
          let nextVal = null;
          if (!currentVal) nextVal = 'plus';
          else if (currentVal === 'plus') nextVal = 'minus';
          return { ...prev, [targetedNode.id]: nextVal };
        });
        setFeedback({ message: '', status: '' });
      }
      return;
    }

    if (stage === 'arrow') {
      if (arrowPoints.start) {
        if (Math.hypot(x - arrowPoints.start.x, y - arrowPoints.start.y) < 24) { setActiveHandle('start'); return; }
        if (Math.hypot(x - arrowPoints.mid.x, y - arrowPoints.mid.y) < 24) { setActiveHandle('mid'); return; }
        if (Math.hypot(x - arrowPoints.end.x, y - arrowPoints.end.y) < 24) { setActiveHandle('end'); return; }
      }

      const snapStart = findClosestSnapTarget(x, y);
      if (snapStart && snapStart.id === current.startId) {
        setIsDrawingArrow(true);
        setArrowPoints({
          start: { x: snapStart.x, y: snapStart.y },
          mid: { x: (snapStart.x + x) / 2, y: (snapStart.y + y) / 2 - 25 },
          end: { x: x, y: y }
        });
        setActiveHandle('end');
      }
    }
  };

  const handleCanvasPointerMove = (e) => {
    if (!activeHandle || !arrowPoints.start) return;
    if (e.cancelable) e.preventDefault(); 
    
    const { x, y } = getSVGCoords(e);
    setArrowPoints(prev => {
      const updated = { ...prev, [activeHandle]: { x, y } };
      if (activeHandle === 'end' && isDrawingArrow) {
        updated.mid = { x: (prev.start.x + x) / 2, y: (prev.start.y + y) / 2 - 40 };
      }
      return updated;
    });
  };

  const handleCanvasPointerUp = (e) => {
    if (e.cancelable) e.preventDefault();

    if (isDrawingArrow && activeHandle === 'end') {
      setIsDrawingArrow(false);
      setActiveHandle(null);
      
      const { x, y } = getSVGCoords(e);
      const snapEnd = findClosestSnapTarget(x, y);
      
      if (snapEnd && snapEnd.id === current.endId) {
        setArrowPoints(prev => ({ ...prev, end: { x: snapEnd.x, y: snapEnd.y } }));
      } else {
        setArrowPoints({ start: null, mid: null, end: null }); 
      }
      return;
    }

    if (activeHandle) {
      const { x, y } = getSVGCoords(e);
      if (activeHandle === 'start' || activeHandle === 'end') {
        const snapNode = findClosestSnapTarget(x, y);
        if (snapNode && (activeHandle === 'start' ? snapNode.id === current.startId : snapNode.id === current.endId)) {
          setArrowPoints(prev => ({ ...prev, [activeHandle]: { x: snapNode.x, y: snapNode.y } }));
        }
      }
      setActiveHandle(null);
    }
  };

  const verifyDipolesStage = () => {
    const expectedKeys = Object.keys(current.correctStates);
    const passed = expectedKeys.every(key => states[key] === current.correctStates[key]);

    if (passed) {
      setStage('arrow');
      setFeedback({ message: "Dipoles match. Arrow sketch pad unlocked! Click and drag out from the electron source to map your attack vector path.", status: "success" });
    } else {
      setFeedback({ message: "WJEC Precision Check: Dipoles missing or incorrect. Identify the permanent electronegativity differences.", status: "error" });
    }
  };

  const verifyMechanismArrowStage = () => {
    if (!arrowPoints.start || !arrowPoints.end) {
      setFeedback({ message: "No reaction mechanism arrow has been drawn on screen yet.", status: "error" });
      return;
    }

    const chord = Math.hypot(arrowPoints.end.x - arrowPoints.start.x, arrowPoints.end.y - arrowPoints.start.y);
    const crossProduct = Math.abs((arrowPoints.end.y - arrowPoints.start.y) * arrowPoints.mid.x - (arrowPoints.end.x - arrowPoints.start.x) * arrowPoints.mid.y + arrowPoints.end.x * arrowPoints.start.y - arrowPoints.end.y * arrowPoints.start.x);
    
    if (crossProduct / chord < 14) {
      setFeedback({ message: "WJEC Precision Deficit: Your mechanism arrow vector is too straight! Arrows must be explicitly curved ('curly') to indicate electron pair movement.", status: "error" });
    } else {
      setStage('success');
      setFeedback({ message: current.explanation, status: "success" });
    }
  };

  const changeAssignment = (nextIndex) => {
    setProblemIndex(nextIndex);
    setStage('dipoles');
    setStates({});
    setArrowPoints({ start: null, mid: null, end: null });
    setFeedback({ message: '', status: '' });
  };

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      <div className="applet-header" style={{ textTransform: 'none' }}>AS-Level Mechanism Training</div>
      
      <div className="question-text text-center px-4 leading-relaxed" style={{ textTransform: 'none' }}>
        {stage === 'dipoles' ? current.taskText : "Draw your curved vector arrow from the specified starting electron domain to the core sink hub."}
      </div>

      <div className="w-full flex justify-center gap-1.5 my-3 flex-wrap">
        {mechanismPool.map((_, idx) => (
          <button
            key={idx} type="button" onClick={() => changeAssignment(idx)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border transition-all ${problemIndex === idx ? 'bg-[#326fa0] border-[#326fa0] text-white shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
          >
            Mechanism {idx + 1}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md mx-auto my-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center text-xs font-bold text-slate-600">
        {current.title}
      </div>

      <div className="w-full max-w-md mx-auto my-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm relative flex flex-col items-center select-none overflow-hidden h-[260px] touch-none">
        <div onPointerDown={handleCanvasPointerDown} onPointerMove={handleCanvasPointerMove} onPointerUp={handleCanvasPointerUp} className="w-full h-full relative overflow-visible touch-none">
          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 280 180" className="overflow-visible select-none pointer-events-auto">
            {current.staticBonds.map((bond, idx) => (
              <line key={idx} x1={bond.x1} y1={bond.y1} x2={bond.x2} y2={bond.y2} stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            ))}
            {current.clickableElements.filter(el => el.display).map(el => (
              <text key={el.id} x={el.cx} y={el.cy} textAnchor="middle" dominantBaseline="central" className={`${el.style} select-none pointer-events-none`}>
                {el.display}
              </text>
            ))}
            {current.extraDecorators()}
            {current.clickableElements.map(el => {
              const state = states[el.id];
              return (
                <g key={el.id}>
                  <circle cx={el.cx || el.midX} cy={el.cy || el.midY} r={el.r} fill="transparent" />
                  {state && (
                    <g transform={`translate(${el.type === 'bond' ? 0 : 14}, -14)`}>
                      <circle cx={el.cx || el.midX} cy={el.cy || el.midY} r="8.5" fill="white" stroke={state === 'plus' ? '#3b82f6' : '#f43f5e'} strokeWidth="2" />
                      <text x={el.cx || el.midX} y={el.cy || el.midY} textAnchor="middle" dominantBaseline="central" className={`text-[9px] font-sans font-black ${state === 'plus' ? 'fill-blue-600' : 'fill-rose-600'}`}>
                        {state === 'plus' ? 'δ⁺' : 'δ⁻'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {arrowPoints.start && arrowPoints.mid && arrowPoints.end && (
              <g>
                <path d={`M ${arrowPoints.start.x} ${arrowPoints.start.y} Q ${arrowPoints.mid.x} ${arrowPoints.mid.y} ${arrowPoints.end.x} ${arrowPoints.end.y}`} fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" markerEnd="url(#u2-arrowhead)" />
                <circle cx={arrowPoints.start.x} cy={arrowPoints.start.y} r="7" fill="#b45309" />
                <circle cx={arrowPoints.mid.x} cy={arrowPoints.mid.y} r="7" fill="#f59e0b" />
                <circle cx={arrowPoints.end.x} cy={arrowPoints.end.y} r="7" fill="#b45309" />
              </g>
            )}
            <defs>
              <marker id="u2-arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#d97706" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      <div className="button-group mt-4">
        {stage === 'dipoles' && <button type="button" className="btn btn-primary" onClick={verifyDipolesStage}>Verify assigned Dipoles</button>}
        {stage === 'arrow' && <button type="button" className="btn btn-primary" onClick={verifyMechanismArrowStage}>Submit Mechanism Step</button>}
        <button type="button" className="btn btn-secondary" onClick={() => changeAssignment(problemIndex)}>Clear Canvas Grid</button>
      </div>

      {feedback.message && (
        <div className={`mt-4 p-4 rounded-2xl text-xs font-bold border transition-all ${feedback.status === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default MechanismUnit2;
