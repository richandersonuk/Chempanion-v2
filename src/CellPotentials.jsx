import React, { useState, useEffect } from 'react';

const CellPotentials = () => {
  const [mode, setMode] = useState('calculate_emf');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const halfCells = [
    { eq: 'Mg²⁺(aq) + 2e⁻ ⇌ Mg(s)', e: -2.37 },
    { eq: 'Zn²⁺(aq) + 2e⁻ ⇌ Zn(s)', e: -0.76 },
    { eq: 'Fe²⁺(aq) + 2e⁻ ⇌ Fe(s)', e: -0.44 },
    { eq: 'Cu²⁺(aq) + 2e⁻ ⇌ Cu(s)', e: 0.34 },
    { eq: 'Ag⁺(aq) + e⁻ ⇌ Ag(s)', e: 0.80 },
    { eq: 'Cl₂(g) + 2e⁻ ⇌ 2Cl⁻(aq)', e: 1.36 }
  ];

  const formatE = (val) => val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);

  const generateProblem = (forcedMode = null) => {
    setMode('calculate_emf');

    let idx1 = Math.floor(Math.random() * halfCells.length);
    let idx2 = Math.floor(Math.random() * halfCells.length);
    while (idx1 === idx2) { 
      idx2 = Math.floor(Math.random() * halfCells.length); 
    }

    const cellA = halfCells[idx1];
    const cellB = halfCells[idx2];

    const reductionCell = cellA.e > cellB.e ? cellA : cellB;
    const oxidationCell = cellA.e > cellB.e ? cellB : cellA;
    const cellEmf = reductionCell.e - oxidationCell.e;

    setProblem({ 
      cellA,
      cellB,
      correctAnswer: cellEmf.toFixed(2),
      rawEmf: cellEmf
    });
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('calculate_emf');
  }, []);

  const checkAnswer = () => {
    const rawInput = studentAnswer.trim();
    if (!rawInput) return;

    const cleanInput = rawInput.replace('+', '');
    const userVal = parseFloat(cleanInput);
    const correctVal = parseFloat(problem.correctAnswer);

    // --- WJEC PRECISION STRING ENFORCEMENT ---
    const decimalPart = cleanInput.split('.')[1];
    if (!decimalPart || decimalPart.length !== 2) {
      setFeedback({ 
        message: "WJEC Precision Error: Standard cell potentials must ALWAYS be recorded to exactly two decimal places (e.g., +1.10 or +0.46), including any trailing zeros.", 
        status: 'error' 
      });
      return;
    }

    if (Math.abs(userVal - correctVal) < 0.01) {
      if (!rawInput.startsWith('+')) {
        setFeedback({ 
          message: `Correct numerical value! However, remember that WJEC examiners strongly look for an explicit positive (+) sign for overall cell EMF values to emphasize a spontaneous forward system reaction direction.`, 
          status: 'success' 
        });
      } else {
        setFeedback({ 
          message: `Correct! E°cell = +${correctVal.toFixed(2)} V. Excellent precision and sign convention handling.`, 
          status: 'success' 
        });
      }
    } else {
      setFeedback({
        message: 'Incorrect cell potential. Use the formula: E°cell = E°(reduction cathode) − E°(oxidation anode). The reduction site is always the half-cell with the more positive (less negative) standard electrode potential value.',
        status: 'error'
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      <div className="w-full max-w-md mx-auto mb-6 px-4" style={{ textTransform: 'none' }}>
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center justify-center" style={{ textTransform: 'none' }}>
          <div className="w-full max-w-xs text-center bg-slate-100 py-2.5 rounded-xl text-xs font-black text-slate-600 border border-slate-200 shadow-sm">
            Standard Cell Potentials (E°cell)
          </div>
        </div>
      </div>

      <div className="applet-header" style={{ textTransform: 'none' }}>Standard Cell Potentials</div>
      
      <div className="question-text text-center px-2 leading-relaxed" style={{ textTransform: 'none' }}>
        An electrochemical cell is assembled under standard laboratory conditions.
      </div>

      {/* --- RECONSTRUCTED ANTI-BREAK DATA MATRIX DISPLAY CARD --- */}
      <div className="w-full max-w-md mx-auto my-5 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-3.5" style={{ textTransform: 'none' }}>
        {/* Half Cell 1 Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-slate-100 pb-3">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider shrink-0">System 1:</span>
          <div className="flex items-center justify-between flex-1 gap-2 min-w-0">
            {/* The equation component is completely protected from splitting wraps */}
            <span className="font-mono font-black text-slate-800 text-xs whitespace-nowrap inline-block overflow-x-auto">
              {problem.cellA.eq}
            </span>
            <span className="font-mono font-bold text-xs text-slate-500 whitespace-nowrap bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
              E° = {formatE(problem.cellA.e)} V
            </span>
          </div>
        </div>

        {/* Half Cell 2 Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider shrink-0">System 2:</span>
          <div className="flex items-center justify-between flex-1 gap-2 min-w-0">
            <span className="font-mono font-black text-slate-800 text-xs whitespace-nowrap inline-block overflow-x-auto">
              {problem.cellB.eq}
            </span>
            <span className="font-mono font-bold text-xs text-slate-500 whitespace-nowrap bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
              E° = {formatE(problem.cellB.e)} V
            </span>
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        Calculate the overall standard electromotive force (E°cell) generated by this combination.
      </div>

      {/* --- ENTRY CONTAINER RENDER BLOCK --- */}
      <div className="w-full flex items-center justify-center my-6 overflow-x-auto" style={{ textTransform: 'none' }}>
        <div 
          className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
          style={{ textTransform: 'none' }}
        >
          <label className="text-sm font-black text-slate-600 select-none" style={{ textTransform: 'none' }}>E°cell =</label>
          <input 
            type="text" 
            className={`chem-input ${feedback.status}`}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="+0.00"
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            style={{ maxWidth: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', textTransform: 'none' }}
          />
          <span className="text-sm font-black text-slate-500 select-none" style={{ textTransform: 'none' }}>V</span>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default CellPotentials;
