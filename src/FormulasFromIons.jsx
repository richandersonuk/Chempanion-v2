import React, { useState, useEffect } from 'react';

/**
 * HELPER COMPONENT: FormulaInput
 * Automatically converts numbers to subscripts as the student types.
 */
const FormulaInput = ({ value, onChange, status, placeholder, onKeyDown }) => {
  const subMap = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    let formatted = '';
    for (let char of rawValue) {
      formatted += subMap[char] || char;
    }
    onChange(formatted);
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className={`chem-input ${status}`}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{ 
          fontSize: '1.3rem', 
          letterSpacing: '0.05em', 
          width: '100%', 
          maxWidth: '14rem',
          textAlign: 'center' 
        }}
      />
    </div>
  );
};

const FormulasFromIons = () => {
  const [mode, setMode] = useState('simple');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // --- MONOLITHIC SPECIFICATION COMPLIANT DATA POOLS ---
  const simpleCations = [
    { s: 'Na', c: 1, d: <>Na<sup>+</sup></> },
    { s: 'Li', c: 1, d: <>Li<sup>+</sup></> },
    { s: 'K', c: 1, d: <>K<sup>+</sup></> },
    { s: 'Mg', c: 2, d: <>Mg<sup>2+</sup></> },
    { s: 'Ca', c: 2, d: <>Ca<sup>2+</sup></> },
    { s: 'Ba', c: 2, d: <>Ba<sup>2+</sup></> },
    { s: 'Al', c: 3, d: <>Al<sup>3+</sup></> }
  ];

  const simpleAnions = [
    { s: 'Cl', c: 1, d: <>Cl<sup>-</sup></> },
    { s: 'Br', c: 1, d: <>Br<sup>-</sup></> },
    { s: 'I', c: 1, d: <>I<sup>-</sup></> },
    { s: 'O', c: 2, d: <>O<sup>2-</sup></> },
    { s: 'S', c: 2, d: <>S<sup>2-</sup></> },
    { s: 'N', c: 3, d: <>N<sup>3-</sup></> }
  ];

  const commonPolyCations = [
    { s: 'NH4', c: 1, d: <>NH<sub>4</sub><sup>+</sup></>, p: true }
  ];

  const commonPolyAnions = [
    { s: 'OH', c: 1, d: <>OH<sup>-</sup></>, p: true },
    { s: 'NO3', c: 1, d: <>NO<sub>3</sub><sup>-</sup></>, p: true },
    { s: 'SO4', c: 2, d: <>SO<sub>4</sub><sup>2-</sup></>, p: true },
    { s: 'CO3', c: 2, d: <>CO<sub>3</sub><sup>2-</sup></>, p: true }
  ];

  // Expanded Comprehensive A-Level Polyatomic Ions Array
  const advancedPolyAnions = [
    { s: 'MnO4', c: 1, d: <>MnO<sub>4</sub><sup>-</sup></>, p: true },
    { s: 'Cr2O7', c: 2, d: <>Cr<sub>2</sub><b>O</b><sub>7</sub><sup>2-</sup></>, p: true },
    { s: 'C2O4', c: 2, d: <>C<sub>2</sub><b>O</b><sub>4</sub><sup>2-</sup></>, p: true },
    { s: 'S2O3', c: 2, d: <>S<sub>2</sub><b>O</b><sub>3</sub><sup>2-</sup></>, p: true },
    { s: 'PO4', c: 3, d: <>PO<sub>4</sub><sup>3-</sup></>, p: true },
    { s: 'HCO3', c: 1, d: <>HCO<sub>3</sub><sup>-</sup></>, p: true },
    { s: 'NO2', c: 1, d: <>NO<sub>2</sub><sup>-</sup></>, p: true },
    { s: 'SO3', c: 2, d: <>SO<sub>3</sub><sup>2-</sup></>, p: true }
  ];

  const transitionCations = [
    { s: 'Fe', c: 2, d: <>Fe<sup>2+</sup></> },
    { s: 'Fe', c: 3, d: <>Fe<sup>3+</sup></> },
    { s: 'Cu', c: 2, d: <>Cu<sup>2+</sup></> },
    { s: 'Cu', c: 1, d: <>Cu<sup>+</sup></> },
    { s: 'Zn', c: 2, d: <>Zn<sup>2+</sup></> },
    { s: 'Ag', c: 1, d: <>Ag<sup>+</sup></> },
    { s: 'Cr', c: 3, d: <>Cr<sup>3+</sup></> },
    { s: 'Mn', c: 2, d: <>Mn<sup>2+</sup></> },
    { s: 'Co', c: 2, d: <>Co<sup>2+</sup></> },
    { s: 'Ni', c: 2, d: <>Ni<sup>2+</sup></> }
  ];

  const normalize = (str) => {
    const reverseMap = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
    return str.split('').map(char => reverseMap[char] || char).join('');
  };

  const generateProblem = (forcedMode = null) => {
    const modes = ['simple', 'common', 'polyatomic', 'transition'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    // Fixed: Sync dropdown state selection on random clicks
    setMode(targetMode);

    let catList = [];
    let aniList = [];

    if (targetMode === 'simple') {
      catList = simpleCations;
      aniList = simpleAnions;
    } else if (targetMode === 'common') {
      catList = [...simpleCations, ...commonPolyCations];
      aniList = [...simpleAnions, ...commonPolyAnions];
    } else if (targetMode === 'polyatomic') {
      catList = [...simpleCations, ...commonPolyCations, ...transitionCations];
      aniList = [...commonPolyAnions, ...advancedPolyAnions];
    } else {
      catList = transitionCations;
      aniList = [...simpleAnions, ...commonPolyAnions, ...advancedPolyAnions];
    }

    const cat = catList[Math.floor(Math.random() * catList.length)];
    const ani = aniList[Math.floor(Math.random() * aniList.length)];

    const gcd = (a, b) => !b ? a : gcd(b, a % b);
    const commonFactor = gcd(cat.c, ani.c);
    const catSub = ani.c / commonFactor;
    const aniSub = cat.c / commonFactor;

    let formula = "";
    formula += (catSub > 1 && cat.p) ? `(${cat.s})${catSub}` : (catSub > 1 ? `${cat.s}${catSub}` : cat.s);
    formula += (aniSub > 1 && ani.p) ? `(${ani.s})${aniSub}` : (aniSub > 1 ? `${ani.s}${aniSub}` : ani.s);

    setProblem({ cat, ani, correct: formula });
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { 
    generateProblem('simple'); 
  }, []);

  const checkAnswer = () => {
    const cleanInput = normalize(studentAnswer).trim();
    if (!cleanInput) return;

    if (cleanInput === problem.correct) {
      setFeedback({ message: 'Correct formula!', status: 'success' });
    } else if (cleanInput.toLowerCase() === problem.correct.toLowerCase()) {
      setFeedback({ message: 'Check your chemical symbol casing (e.g., Na, not na).', status: 'error' });
    } else {
      setFeedback({ message: 'Incorrect formula structural ratio. Ensure total positive charges cancel out total negative charges.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      
      {/* --- STANDARDIZED COMPACT DROPDOWN + RANDOM TOGGLE ROW --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center gap-2">
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm text-center"
          >
            <option value="simple">Simple Ions (Binary Groupings)</option>
            <option value="common">Common Ions (GCSE Core Spec)</option>
            <option value="polyatomic">Advanced Polyatomic (A-Level Core)</option>
            <option value="transition">Transition Metals (Exclusively)</option>
          </select>
          
          <button
            type="button"
            onClick={() => { generateProblem('random'); }}
            className={`px-4 py-2.5 text-xs font-black uppercase rounded-xl transition-all border shrink-0 ${
              mode === 'random'
                ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header">Formulas from Ions</div>

      <div className="question-text text-center">
        Deduce the neutral empirical chemical formula constructed from:
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <div className="data-box" style={{ fontSize: '1.35rem', padding: '0.5rem 1rem', margin: '0' }}>{problem.cat.d}</div>
          <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#94a3b8' }}>+</span>
          <div className="data-box" style={{ fontSize: '1.35rem', padding: '0.5rem 1rem', margin: '0' }}>{problem.ani.d}</div>
        </div>
      </div>

      <FormulaInput 
        value={studentAnswer} 
        onChange={setStudentAnswer} 
        status={feedback.status}
        placeholder="e.g. Al₂(SO₄)₃"
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
      />

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default FormulasFromIons;
