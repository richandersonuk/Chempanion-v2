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
        style={{ fontSize: '1.2rem', letterSpacing: '0.05em', width: '100%', maxWidth: '14rem' }}
      />
    </div>
  );
};

const FormulasFromIons = () => {
  const [mode, setMode] = useState('polyatomic');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const cations = {
    simple: [{ s: 'Na', c: 1, d: <>Na<sup>+</sup></> }, { s: 'Mg', c: 2, d: <>Mg<sup>2+</sup></> }, { s: 'Al', c: 3, d: <>Al<sup>3+</sup></> }, { s: 'Ca', c: 2, d: <>Ca<sup>2+</sup></> }],
    transition: [{ s: 'Fe', c: 3, d: <>Fe<sup>3+</sup></> }, { s: 'Fe', c: 2, d: <>Fe<sup>2+</sup></> }, { s: 'Cu', c: 2, d: <>Cu<sup>2+</sup></> }, { s: 'Zn', c: 2, d: <>Zn<sup>2+</sup></> }],
    poly: [{ s: 'NH4', c: 1, d: <>NH<sub>4</sub><sup>+</sup></>, p: true }]
  };

  const anions = {
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

    let catList = targetMode === 'simple' ? cations.simple : [...cations.simple, ...cations.transition, ...cations.poly];
    let aniList = targetMode === 'simple' ? anions.simple : [...anions.simple, ...anions.poly];

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

  useEffect(() => { generateProblem('simple'); }, []);

  const checkAnswer = () => {
    const cleanInput = normalize(studentAnswer).trim();
    if (cleanInput === problem.correct) {
      setFeedback({ message: 'Correct!', status: 'success' });
    } else if (cleanInput.toLowerCase() === problem.correct.toLowerCase()) {
      setFeedback({ message: 'Check your casing (e.g. Na, not na).', status: 'error' });
    } else {
      setFeedback({ message: 'Incorrect. Try again.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <select value={mode === 'random' ? '' : mode} onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }} className="chem-input" style={{ width: 'auto' }}>
          <option value="simple">Simple</option>
          <option value="transition">Transition</option>
          <option value="polyatomic">Polyatomic</option>
        </select>
        <button onClick={() => { setMode('random'); generateProblem('random'); }} className="btn btn-secondary">Random</button>
      </div>

      <div className="applet-header">Formulas from Ions</div>

      <div className="question-text text-center">
        Predict the formula for:
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          {/* OPTIMIZED ION BOXES */}
          <div className="data-box" style={{ fontSize: '1.25rem', padding: '0.5rem 0.75rem', margin: '0' }}>{problem.cat.d}</div>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>+</span>
          <div className="data-box" style={{ fontSize: '1.25rem', padding: '0.5rem 0.75rem', margin: '0' }}>{problem.ani.d}</div>
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
        <button className="btn btn-primary" onClick={checkAnswer}>Check</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>Next</button>
      </div>

      {feedback.message && <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>{feedback.message}</div>}
    </div>
  );
};

export default FormulasFromIons;
