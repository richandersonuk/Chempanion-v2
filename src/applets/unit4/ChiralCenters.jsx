import React, { useState, useEffect } from 'react';
import { CHIRAL_MOLECULES_POOL } from '../../data/questions/chiralQuestions';

const ChiralCenters = ({ onComplete }) => {
  const [problem, setProblem] = useState(null);
  const [selectedCarbons, setSelectedCarbons] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = () => {
    let nextProb = CHIRAL_MOLECULES_POOL[Math.floor(Math.random() * CHIRAL_MOLECULES_POOL.length)];
    while (problem && nextProb.id === problem.id) {
      nextProb = CHIRAL_MOLECULES_POOL[Math.floor(Math.random() * CHIRAL_MOLECULES_POOL.length)];
    }
    setProblem(nextProb);
    setSelectedCarbons([]);
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleNodeClick = (atomId) => {
    setFeedback({ message: '', status: '' });
    setSelectedCarbons((prev) =>
      prev.includes(atomId) ? prev.filter((id) => id !== atomId) : [...prev, atomId].sort((a, b) => a - b)
    );
  };

  const checkAnswer = () => {
    const isCorrectMatch =
      selectedCarbons.length === problem.correct.length &&
      selectedCarbons.every((val, index) => val === problem.correct[index]);

    if (isCorrectMatch) {
      setFeedback({ message: `Correct! ${problem.explanation}`, status: 'success' });
      onComplete?.(problem.id);
    } else {
      setFeedback({ 
        message: "Incorrect configuration. Review each carbon atom. Double bonds, aromatic rings, or duplicate alkyl chains break asymmetry.", 
        status: 'error' 
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      <div className="applet-header" style={{ textTransform: 'none' }}>
        Chiral Center Identification
      </div>
      
      <div className="question-text text-center px-4 leading-relaxed" style={{ textTransform: 'none' }}>
        Identify any and all chiral carbon atoms in the molecule below.
      </div>

      {/* --- INTERACTIVE STRUCTURAL MODEL CANVAS --- */}
      <div className="w-full max-w-md mx-auto my-6 flex flex-col items-center select-none bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative">
        <span className="text-[9px] font-black tracking-widest uppercase text-slate-400 mb-4 block">
          Interactive Model: {problem.name}
        </span>
        
        <svg 
          viewBox={`0 0 ${problem.svgWidth} ${problem.svgHeight}`} 
          className="w-full max-w-[300px] h-auto overflow-visible"
        >
          {/* Render Delocalised Aromatic Benzene Rings if Active */}
          {problem.isBenzene && problem.ringCenter && (
            <circle 
              cx={problem.ringCenter.cx} 
              cy={problem.ringCenter.cy} 
              r={problem.ringCenter.r} 
              fill="none" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeDasharray="4 3" 
            />
          )}

          {/* Render Backbone Bonds */}
          {problem.lines.map((line, idx) => (
            <line 
              key={idx} 
              x1={line.x1} 
              y1={line.y1} 
              x2={line.x2} 
              y2={line.y2} 
              stroke="#475569" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
          ))}

          {/* Render Heteroatom Text Labels with Central Midpoint Alignment */}
          {problem.labels.map((lbl, idx) => (
            <text 
              key={idx} 
              x={lbl.x} 
              y={lbl.y} 
              textAnchor="middle" 
              dominantBaseline="central" 
              className={lbl.className}
            >
              {lbl.text}
            </text>
          ))}

          {/* Render Interactive Carbon Nodes */}
          {problem.atoms.map((atom) => {
            const isSelected = selectedCarbons.includes(atom.id);
            return (
              <g 
                key={atom.id} 
                onClick={() => handleNodeClick(atom.id)}
                className="cursor-pointer group"
              >
                {/* Static interactive hitbox bounds */}
                <circle cx={atom.cx} cy={atom.cy} r="15" fill="transparent" />
                
                {/* Visual Node Core */}
                <circle 
                  cx={atom.cx} 
                  cy={atom.cy} 
                  r={isSelected ? 9 : 8} 
                  className={
                    isSelected 
                      ? 'fill-amber-500 stroke-amber-600 stroke-2' 
                      : 'fill-slate-100 stroke-slate-400 stroke-2 group-hover:fill-slate-200'
                  } 
                />
                
                {/* Text centered completely inside the coordinates */}
                <text 
                  x={atom.cx} 
                  y={atom.cy} 
                  textAnchor="middle" 
                  dominantBaseline="central"
                  className={`text-[8px] font-mono font-black select-none pointer-events-none ${
                    isSelected ? 'fill-white' : 'fill-slate-700'
                  }`}
                >
                  {atom.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* --- IUPAC CONVENTION EXAM NOTE --- */}
        <div className="mt-4 pt-2 border-t border-slate-100 w-full text-center">
          <span className="inline-block text-[8px] font-black tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
            IUPAC Nomenclature Note
          </span>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">
            Carbons are strictly numbered according to priority rules (lowest locants assigned to principal functional groups).
          </p>
        </div>
      </div>

      {/* --- REAL-TIME SELECTION FEEDBACK BAR --- */}
      <div className="text-center text-xs font-bold text-slate-400 min-h-[1.5rem] mb-6">
        {selectedCarbons.length > 0 ? (
          <span>
            Highlighted Asymmetric Nodes:{" "}
            <span className="font-mono text-amber-600 bg-amber-50 px-2.5 py-0.5 border border-amber-200 rounded-md font-black">
              {selectedCarbons.map(id => `C${id}`).join(', ')}
            </span>
          </span>
        ) : (
          <span className="italic">No carbons selected (Predicting symmetrical or achiral structure)</span>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Verify Configuration</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>Next Molecule</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default ChiralCenters;
