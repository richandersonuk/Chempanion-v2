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

  const constCations = {
    simple: [{ s: 'Na', c: 1, d: <>Na<sup>+</sup></> }, { s: 'Mg', c: 2, d: <>Mg<sup>2+</sup></> }, { s: 'Al', c: 3, d: <>Al<sup>3+</sup></> }, { s: 'Ca', c: 2, d: <>Ca<sup>2+</sup></> }],
    transition: [{ s: 'Fe', c: 3, d: <>Fe<sup>3+</sup></> }, { s: 'Fe', c: 2, d: <>Fe<sup>2+</sup></> }, { s: 'Cu', c: 2, d: <>Cu<sup>2+</sup></> }, { s: 'Zn', c: 2, d: <>Zn<sup>2+</sup></> }],
    poly: [{ s: 'NH4', c: 1, d: <>NH<sub>4</sub><sup>+</sup></>, p: true }]
  };

  const constAnions = {
    simple: [{ s: 'Cl', c: 1, d: <>Cl<sup>-</sup></> }, { s: 'O', c: 2, d: <>O<sup>2-</sup></> }, { s: 'Br', c: 1, d: <>Br<sup>-</sup></> }, { s: 'S', c: 2, d: <>S<sup>2-</sup></> }],
    poly: [
      { s: 'SO4', c: 2, d: <>SO<sub>4</sub><sup>2-</sup></>, p: true },
      { s: 'NO3', c: 1, d: <>NO<sub>3</sub><sup>-</sup></>, p: true },
      { s: 'CO3', c: 2, d: <>CO<sub>3</sub><sup>2-</sup></>, p: true },
      { s: 'OH', c: 1, d: <>OH<sup>-</sup></>, p: true }
    ]
  };

  const normalize = (str) => {
    const reverseMap = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
    return str.split('').map(char => reverseMap[char] || char).join('');
  };

  const generateProblem = (forcedMode = null) => {
    const modes = ['simple', 'transition', 'polyatomic'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    let catList = targetMode === 'simple' ? constCations.simple : [...constCations.simple, ...constCations.transition, ...constCations.poly];
    let aniList = targetMode === 'simple' ? constAnions.simple : [...constAnions.simple, ...constAnions.poly];

    const cat = catList[Math.floor(Math.random() * catList.length)];
    const ani = aniList[Math.floor(Math.random() * aniList.length)];

    const gcd = (a, b) => !b ? a : gcd(b, a % b);
    const common = gcd(cat.c, ani.c);
    const catSub = ani.c / common;
    const aniSub = cat.c / common;

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
      setFeedback({ message: 'Correct!', status: 'success' });
    } else if (cleanInput.toLowerCase() === problem.correct.toLowerCase()) {
      setFeedback({ message: 'Check your chemical symbol casing (e.g., Na, not na).', status: 'error' });
    } else {
      setFeedback({ message: 'Incorrect formula balance. Check charge values.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      
      {/* --- REFACTORED COMPONENT MODE SELECTION GRID --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="chem-choice-label">Choose Practice Mode</span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'simple', label: 'Simple' },
            { id: 'transition', label: 'Transition' },
            { id: 'polyatomic', label: 'Polyatomic' },
            { id: 'random', label: 'Random' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { setMode(m.id); generateProblem(m.id); }}
              className={`chem-choice-btn ${mode === m.id ? 'active' : ''} text-center text-xs py-2 px-1`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="applet-header">Formulas from Ions</div>

      <div className="question-text text-center">
        Predict the neutral formula constructed from:
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          {/* ION DISPLAY VISUAL PANELS */}
          <div className="data-box" style={{ fontSize: '1.35rem', padding: '0.5rem 1rem', margin: '0' }}>{problem.cat.d}</div>
          <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#64748b' }}>+</span>
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
