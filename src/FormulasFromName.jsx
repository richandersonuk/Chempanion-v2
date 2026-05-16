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
    let formatted = '';
    for (let char of e.target.value) {
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

const FormulasFromName = () => {
  const [mode, setMode] = useState('simple');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // --- EXPANDED DATABASE ---
  const database = [
    // Simple Binary
    { name: 'Sodium chloride', formula: 'NaCl', type: 'simple' },
    { name: 'Magnesium oxide', formula: 'MgO', type: 'simple' },
    { name: 'Calcium chloride', formula: 'CaCl2', type: 'simple' },
    { name: 'Aluminium oxide', formula: 'Al2O3', type: 'simple' },
    { name: 'Lithium nitride', formula: 'Li3N', type: 'simple' },

    // Roman Numerals
    { name: 'Iron(III) oxide', formula: 'Fe2O3', type: 'roman' },
    { name: 'Copper(II) sulfate', formula: 'CuSO4', type: 'roman' },
    { name: 'Iron(II) chloride', formula: 'FeCl2', type: 'roman' },
    { name: 'Lead(II) nitrate', formula: 'Pb(NO3)2', type: 'roman' },
    { name: 'Manganese(IV) oxide', formula: 'MnO2', type: 'roman' },
    { name: 'Copper(I) oxide', formula: 'Cu2O', type: 'roman' },

    // Polyatomic / Complex
    { name: 'Ammonium nitrate', formula: 'NH4NO3', type: 'complex' },
    { name: 'Calcium hydroxide', formula: 'Ca(OH)2', type: 'complex' },
    { name: 'Aluminium sulfate', formula: 'Al2(SO4)3', type: 'complex' },
    { name: 'Sodium carbonate', formula: 'Na2CO3', type: 'complex' },
    { name: 'Magnesium phosphate', formula: 'Mg3(PO4)2', type: 'complex' },
    { name: 'Ammonium sulfate', formula: '(NH4)2SO4', type: 'complex' },
  ];

  const normalize = (str) => {
    const reverseMap = {
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
      '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
    };
    return str.split('').map((char) => reverseMap[char] || char).join('');
  };

  const generateProblem = (forcedMode = null) => {
    const modes = ['simple', 'roman', 'complex'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    const filtered = database.filter((item) => item.type === targetMode);
    const picked = filtered[Math.floor(Math.random() * filtered.length)];

    setProblem(picked);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('simple');
  }, []);

  const checkAnswer = () => {
    const cleanInput = normalize(studentAnswer).trim();
    if (!cleanInput) return;

    if (cleanInput === problem.formula) {
      setFeedback({ message: 'Correct!', status: 'success' });
    } else if (cleanInput.toLowerCase() === problem.formula.toLowerCase()) {
      setFeedback({ message: 'Check your chemical symbol casing (e.g., Na, not na).', status: 'error' });
    } else {
      setFeedback({
        message: `Incorrect. The formula is ${problem.formula}`,
        status: 'error',
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      
     {/* --- COMPACT DROPDOWN + RANDOM LAYOUT --- */}
<div className="w-full max-w-md mx-auto mb-6 px-4">
  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
    Choose Practice Mode
  </span>
  <div className="flex items-center gap-2">
    <select
      value={mode === 'random' ? '' : mode}
      onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
      className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm"
    >
      <option value="simple">Simple Binary System Names</option>
      <option value="roman">Transition Roman Numerals</option>
      <option value="complex">Polyatomic Ion Compounds</option>
    </select>
    
    <button
      type="button"
      onClick={() => { setMode('random'); generateProblem('random'); }}
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

      <div className="applet-header">Formulas from Names</div>

      <div className="question-text text-center">
        Predict the systematic chemical formula for:
        <div
          style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            margin: '1rem 0',
            color: '#1e293b',
          }}
        >
          {problem.name}
        </div>
      </div>

      <FormulaInput
        value={studentAnswer}
        onChange={setStudentAnswer}
        status={feedback.status}
        placeholder="e.g. MgCl₂"
        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
      />

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>
          Check Answer
        </button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>
          New Problem
        </button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default FormulasFromName;
