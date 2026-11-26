import React, { useState, useEffect } from 'react';
import FormulaInput from '../../components/shared/FormulaInput';
import { NOMENCLATURE_DATABASE } from '../../data/questions/formulaQuestions';

const FormulasFromName = ({ onComplete }) => {
  const [mode, setMode] = useState('simple');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  const [showHint, setShowHint] = useState(false);

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
    const nonRepeating = problem && filtered.length > 1
      ? filtered.filter((item) => item.formula !== problem.formula)
      : filtered;
    const picked = nonRepeating[Math.floor(Math.random() * nonRepeating.length)];

    setProblem(picked);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
    setShowHint(false);
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
        message: 'Incorrect formula. Check the Group charges or Roman numeral oxidation state, and use brackets around polyatomic ions when more than one is needed.',
        status: 'error',
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      <div className="w-full max-w-2xl mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black tracking-widest text-slate-400 mb-1.5 text-center">
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
            className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all border shrink-0 ${
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

      <div className="flex flex-col items-center mb-4">
        <button
          type="button"
          onClick={() => setShowHint((prev) => !prev)}
          className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
        >
          💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
        {showHint && (
          <div className="mt-2 w-full max-w-2xl p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
            <strong className="font-black text-amber-900">Formula Method: </strong>
            Balance total positive and negative ion charges to zero. A Roman numeral (e.g. Iron(III)) gives the metal cation charge directly (3+). Common polyatomic ions: OH⁻, NO₃⁻, CO₃²⁻, SO₄²⁻, NH₄⁺ — enclose polyatomic ions in brackets whenever subscript &ge; 2 (e.g. Ca(NO₃)₂).
          </div>
        )}
      </div>

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
        onChange={(val) => { setStudentAnswer(val); if (feedback.message) setFeedback({ message: '', status: '' }); }}
        status={feedback.status}
        placeholder="e.g. MgCl₂"
        onKeyDown={(e) => e.key === 'Enter' && (feedback.status === 'success' ? generateProblem() : checkAnswer())}
      />

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>Next Problem &rarr;</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          <span>{feedback.message}</span>
          {feedback.status === 'success' && (
            <button
              type="button"
              onClick={() => generateProblem()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Next Problem &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FormulasFromName;
