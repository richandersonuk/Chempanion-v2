import React, { useState, useEffect } from 'react';

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
        style={{ fontSize: '1.3rem', letterSpacing: '0.05em', width: '100%', maxWidth: '14rem', textAlign: 'center' }}
      />
    </div>
  );
};

const EmpiricalFormula = () => {
  const [mode, setMode] = useState('empirical');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const database = [
    { text: '85.7% Carbon, 14.3% Hydrogen. [Mr = 56.0]', emp: 'CH2', mol: 'C4H8' },
    { text: '40.0% Carbon, 6.7% Hydrogen, 53.3% Oxygen. [Mr = 180.0]', emp: 'CH2O', mol: 'C6H12O6' },
    { text: '82.8% Carbon, 17.2% Hydrogen. [Mr = 58.0]', emp: 'C2H5', mol: 'C4H10' },
    { text: '24.2% Carbon, 4.0% Hydrogen, 71.8% Chlorine. [Mr = 99.0]', emp: 'CH2Cl', mol: 'C2H4Cl2' },
    { text: '43.4% Sodium, 11.3% Carbon, 45.3% Oxygen.', emp: 'Na2CO3', mol: 'Na2CO3' }
  ];

  const normalize = (str) => {
    const reverseMap = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
    return str.split('').map(char => reverseMap[char] || char).join('');
  };

  const generateProblem = (forcedMode = null) => {
    const modes = ['empirical', 'molecular'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    const picked = database[Math.floor(Math.random() * database.length)];
    // Fallback safely if compound has no different molecular alternative form configurations
    if (targetMode === 'molecular' && picked.emp === picked.mol) {
      generateProblem('molecular');
      return;
    }

    setProblem(picked);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('empirical');
  }, []);

  const checkAnswer = () => {
    const cleanInput = normalize(studentAnswer).trim();
    if (!cleanInput) return;

    const targetSolution = mode === 'empirical' ? problem.emp : problem.mol;

    if (cleanInput === targetSolution) {
      setFeedback({ message: 'Correct formula deduced!', status: 'success' });
    } else {
      setFeedback({ 
        message: `Incorrect. Remember to divide each percentage by its Relative Atomic Mass (Ar) to find mole ratios. Expected answer: ${targetSolution}`, 
        status: 'error' 
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
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
            <option value="empirical">Deduce Empirical Formula</option>
            <option value="molecular">Deduce Molecular Formula</option>
          </select>
          <button type="button" onClick={() => generateProblem('random')} className="px-4 py-2.5 text-xs font-black uppercase bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shrink-0">
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header">Empirical & Molecular Formulas</div>
      
      <div className="question-text text-center px-2 leading-relaxed">
        An analytical sample displays the following relative mass composition properties:<br />
        <div className="data-box font-mono my-3 p-3 text-sm font-black text-slate-800">{problem.text}</div>
        Determine the complete <b>{mode === 'empirical' ? 'Empirical' : 'Molecular'} formula</b> for this system compound.
      </div>

      <FormulaInput value={studentAnswer} onChange={setStudentAnswer} status={feedback.status} placeholder="e.g. CH₂O" onKeyDown={(e) => e.key === 'Enter' && checkAnswer()} />

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>{feedback.message}</div>}
    </div>
  );
};

export default EmpiricalFormula;
