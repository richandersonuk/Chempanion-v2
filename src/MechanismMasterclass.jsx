import React, { useState, useRef } from 'react';

const MechanismMasterclass = () => {
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
      title: "1. Nucleophilic Addition: HCN and Ethanal (Unit 4.4)",
      taskText: "Identify the polarized carbonyl group dipoles, then map the nucleophilic cyanide attack route.",
      correctStates: { 'node_C1': 'plus', 'node_O': 'minus' },
      startId: 'nuc_lone_pair',
      endId: 'node_C1',
      clickableElements: [
        { id: 'node_O', type: 'atom', cx: 160, cy: 30, r: 22, display: 'O', style: 'fill-rose-600 font-sans text-base font-black' },
        { id: 'node_C1', type: 'atom', cx: 160, cy: 85, r: 24, display: '' }, 
        { id: 'node_C_alpha', type: 'atom', cx: 215, cy: 53, r: 20, display: '' },
        { id: 'node_H_alpha', type: 'atom', cx: 215, cy: 117, r: 20, display: '' },
        { id: 'bond_CO_left', type: 'bond', midX: 153, midY: 55, r: 20 },
        { id: 'node_Nuc_C', type: 'atom', cx: 85, cy: 135, r: 22, display: 'C', style: 'fill-slate-800 font-mono text-sm font-black' },
        { id: 'node_Nuc_N', type: 'atom', cx: 30, cy: 135, r: 22, display: 'N', style: 'fill-slate-800 font-mono text-sm font-black' },
        { id: 'nuc_lone_pair', type: 'lone_pair', cx: 85, cy: 152, r: 24, display: '••', style: 'fill-amber-500 font-mono text-base font-black' }
      ],
      staticBonds: [
        { x1: 156.5, y1: 85, x2: 156.5, y2: 44 }, { x1: 163.5, y1: 85, x2: 163.5, y2: 44 },
        { x1: 160, y1: 85, x2: 215, y2: 53 }, { x1: 160, y1: 85, x2: 215, y2: 117 },
        { x1: 72, y1: 135, x2: 43, y2: 135 }, { x1: 72, y1: 131, x2: 43, y2: 131 }, { x1: 72, y1: 139, x2: 43, y2: 139 }
      ],
      extraDecorators: () => <text x="96" y="122" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-sans font-black fill-slate-800 select-none">⁻</text>,
      explanation: "Superb. Cyanide acts as a nucleophile, donating its carbon lone pair directly to the electrophilic carbonyl carbon node."
    },
    {
      title: "2. Electrophilic Aromatic Substitution: Benzene Nitration (Unit 4.3)",
      taskText: "Determine the charge centers on the attacking nitronium electrophile (NO₂⁺), then draw an arrow showing benzene ring delocalization overlap.",
      correctStates: { 'node_N_nitro': 'plus' },
      startId: 'bond_ring_cloud',
      endId: 'node_N_nitro',
      clickableElements: [
        { id: 'bond_ring_cloud', type: 'bond', midX: 110, midY: 85, r: 26 },
        { id: 'node_N_nitro', type: 'atom', cx: 195, cy: 85, r: 22, display: 'N', style: 'fill-blue-600 font-sans text-sm font-black' },
        { id: 'node_O1_nitro', type: 'atom', cx: 235, cy: 55, r: 18, display: 'O', style: 'fill-rose-600 font-sans text-xs font-bold' },
        { id: 'node_O2_nitro', type: 'atom', cx: 235, cy: 115, r: 18, display: 'O', style: 'fill-rose-600 font-sans text-xs font-bold' }
      ],
      staticBonds: [
        // Benzene skeletal paths
        { x1: 110, y1: 45, x2: 145, y2: 65 }, { x1: 145, y1: 65, x2: 145, y2: 105 }, { x1: 145, y1: 105, x2: 110, y2: 125 },
        { x1: 110, y1: 125, x2: 75, y2: 105 }, { x1: 75, y1: 105, x2: 75, y2: 65 }, { x1: 75, y1: 65, x2: 110, y2: 45 },
        { x1: 195, y1: 85, x2: 223, y2: 64 }, { x1: 195, y1: 85, x2: 223, y2: 106 } // Nitro attachments
      ],
      extraDecorators: () => (
        <g>
          <circle cx="110" cy="85" r="20" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 3" />
          <text x="206" y="74" textAnchor="middle" dominantBaseline="central" className="text-[9px] font-sans font-black fill-blue-600 select-none">⁺</text>
        </g>
      ),
      explanation: "Llongyfarchiadau! The electron-dense delocalized π-ring system of benzene attacks the powerful nitronium electrophile ($\text{NO}_2^+$), breaking aromaticity to yield a high-energy arenium ion intermediate."
    },
    {
      title: "3. Nucleophilic Substitution (Sn1): Tertiary Haloalkane Fission (Unit 4.3)",
      taskText: "Synoptic Step: Secondary/Tertiary branches break down via distinct steps. Identify the dipole vector, then map the initial heterolytic C-Br cleavage path.",
      correctStates: { 'node_C_tert': 'plus', 'node_Br_leaving': 'minus' },
      startId: 'bond_leaving_group',
      endId: 'node_Br_leaving',
      clickableElements: [
        { id: 'node_C_tert', type: 'atom', cx: 130, cy: 85, r: 24, display: '' },
        { id: 'node_Br_leaving', type: 'atom', cx: 195, cy: 85, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-sm font-black' },
        { id: 'bond_leaving_group', type: 'bond', midX: 162, midY: 85, r: 20 }
      ],
      staticBonds: [
        { x1: 130, y1: 85, x2: 195, y2: 85 },
        { x1: 130, y1: 85, x2: 95, y2: 50 },
        { x1: 130, y1: 85, x2: 95, y2: 120 },
        { x1: 130, y1: 85, x2: 130, y2: 35 }
      ],
      extraDecorators: () => null,
      explanation: "Perfect! Tertiary systems utilize a multi-step $\text{S}_\text{N}1$ mechanism. The slow, rate-determining step involves simple heterolytic fission of the carbon-halogen bond to produce a highly stable tertiary carbocation intermediate."
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
      setFeedback({ message: "Synoptic dipoles accepted. Vector interface fully functional for drawing mechanism steps.", status: "success" });
    } else {
      setFeedback({ message: "WJEC Evaluation Penalty: Dipoles missing or positioned incorrectly for this Year 13 configuration matrix.", status: "error" });
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
      setFeedback({ message: "WJEC Precision Deficit: Your mechanism arrow vector is too straight! Remember that all organic mechanisms require curved profiles.", status: "error" });
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
      <div className="applet-header" style={{ textTransform: 'none' }}>Synoptic A2 Mechanism Masterclass</div>
      
      <div className="question-text text-center px-4 leading-relaxed" style={{ textTransform: 'none' }}>
        {stage === 'dipoles' ? current.taskText : "Draw your curved reaction arrow exactly from the electron domain boundary to the required sink node."}
      </div>

      <div className="w-full flex justify-center gap-1.5 my-3 flex-wrap">
        {mechanismPool.map((_, idx) => (
          <button
            key={idx} type="button" onClick={() => changeAssignment(idx)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border transition-all ${problemIndex === idx ? 'bg-[#326fa0] border-[#326fa0] text-white shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
          >
            A2 Path {idx + 1}
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
                <path d={`M ${arrowPoints.start.x} ${arrowPoints.start.y} Q ${arrowPoints.mid.x} ${arrowPoints.mid.y} ${arrowPoints.end.x} ${arrowPoints.end.y}`} fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" markerEnd="url(#master-arrowhead)" />
                <circle cx={arrowPoints.start.x} cy={arrowPoints.start.y} r="7" fill="#b45309" />
                <circle cx={arrowPoints.mid.x} cy={arrowPoints.mid.y} r="7" fill="#f59e0b" />
                <circle cx={arrowPoints.end.x} cy={arrowPoints.end.y} r="7" fill="#b45309" />
              </g>
            )}
            <defs>
              <marker id="master-arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
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

export default MechanismMasterclass;
