import React, { useState, useEffect } from 'react';
import FormulaInput from '../../components/shared/FormulaInput';
import { NOMENCLATURE_DATABASE } from '../../data/questions/formulaQuestions';

const FormulasFromName = ({ onComplete }) => {
  const [mode, setMode] = useState('simple');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

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

    setMode(targetMode);

    const filtered = NOMENCLATURE_DATABASE.filter((item) => item.type === targetMode);
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
      setFeedback({ message: 'Correct systematic formula configuration!', status: 'success' });
      onComplete?.(problem.formula);
    } else if (cleanInput.toLowerCase() === problem.formula.toLowerCase()) {
      setFeedback({ message: 'Casing mismatch detected. Elements must use standard uppercase starts (e.g. NaCl, not nacl).', status: 'error' });
    } else {
      setFeedback({
        message: `Incorrect. The balanced systematic formula is ${problem.formula}`,
        status: 'error',
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
            <option value="simple">Simple Binary Valencies</option>
            <option value="roman">Transition Metal Oxidation States</option>
            <option value="complex">Advanced Polyatomic Salts</option>
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

      <div className="applet-header">Formulas from Names</div>

      <div className="question-text text-center">
        Deduce the balanced chemical formula for:
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

export default FormulasFromName;
