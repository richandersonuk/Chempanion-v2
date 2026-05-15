import React, { useState, useEffect } from 'react';

/**
 * HELPER COMPONENT: FormulaInput
 * Automatically converts numbers to subscripts as the student types.
 */
const FormulaInput = ({ value, onChange, status, placeholder, onKeyDown }) => {
  const subMap = {
    0: '₀',
    1: '₁',
    2: '₂',
    3: '₃',
    4: '₄',
    5: '₅',
    6: '₆',
    7: '₇',
    8: '₈',
    9: '₉',
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
          fontSize: '1.2rem',
          letterSpacing: '0.05em',
          width: '100%',
          maxWidth: '14rem',
        }}
      />
    </div>
  );
};

const FormulasFromName = () => {
  const [mode, setMode] = useState('roman');
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
      '₀': '0',
      '₁': '1',
      '₂': '2',
      '₃': '3',
      '₄': '4',
      '₅': '5',
      '₆': '6',
      '₇': '7',
      '₈': '8',
      '₉': '9',
    };
    return str
      .split('')
      .map((char) => reverseMap[char] || char)
      .join('');
  };

  const generateProblem = (forcedMode = null) => {
    const modes = ['simple', 'roman', 'complex'];
    const selection = forcedMode || mode;
    const targetMode =
      selection === 'random'
        ? modes[Math.floor(Math.random() * modes.length)]
        : selection;

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
    if (cleanInput === problem.formula) {
      setFeedback({ message: 'Correct!', status: 'success' });
    } else if (cleanInput.toLowerCase() === problem.formula.toLowerCase()) {
      setFeedback({ message: 'Check your casing!', status: 'error' });
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
      {/* SELECTION BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <select
          value={mode === 'random' ? '' : mode}
          onChange={(e) => {
            setMode(e.target.value);
            generateProblem(e.target.value);
          }}
          className="chem-input"
          style={{ width: 'auto' }}
        >
          <option value="simple">Simple Names</option>
          <option value="roman">Roman Numerals</option>
          <option value="complex">Polyatomic</option>
        </select>
        <button
          onClick={() => {
            setMode('random');
            generateProblem('random');
          }}
          className={`btn ${
            mode === 'random' ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          Random
        </button>
      </div>

      <div className="applet-header">Formulas from Names</div>

      <div className="question-text text-center">
        Predict the chemical formula for:
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            margin: '1rem 0',
            color: 'var(--chem-primary)',
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
          Check
        </button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>
          Next
        </button>
      </div>

      {feedback.message && (
        <div
          className={`feedback-box ${
            feedback.status === 'success'
              ? 'feedback-success'
              : 'feedback-error'
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default FormulasFromName;
