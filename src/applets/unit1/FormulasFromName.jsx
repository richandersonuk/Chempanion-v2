import React, { useState, useEffect } from 'react';
import FormulaInput from '../../components/shared/FormulaInput';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';
import { NOMENCLATURE_DATABASE } from '../../data/questions/formulaQuestions';

const MODE_OPTIONS = [
  { value: 'simple', label: 'Simple Binary Valencies' },
  { value: 'roman', label: 'Transition Metal Oxidation States' },
  { value: 'complex', label: 'Advanced Polyatomic Salts' },
];

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
      setFeedback({ message: 'Casing mismatch detected. Elements must use standard capital letter starts (e.g. NaCl, not nacl).', status: 'error' });
    } else {
      setFeedback({
        message: 'Incorrect formula. Check the Group charges or Roman numeral oxidation state, and use brackets around polyatomic ions when more than one is needed.',
        status: 'error',
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">Formulas from Names</div>

      <AdaptivePicker
        label="Choose Practice Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={(val) => { setMode(val); generateProblem(val); }}
        onRandom={() => generateProblem('random')}
        isRandomActive={mode === 'random'}
        collapseBelow="sm"
      />

      <div className="applet-workbench">
        <div className="applet-workbench-sticky space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center space-y-4">
            <div className="text-sm font-semibold text-slate-600">
              Deduce the balanced chemical formula for:
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 break-words px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
              {problem.name}
            </div>

            <div className="flex flex-col items-center pt-1">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="min-h-[36px] px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
              >
                💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
              {showHint && (
                <div className="mt-2.5 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
                  <strong className="font-black text-amber-900">Formula Method: </strong>
                  Balance total positive and negative ion charges to zero. A Roman numeral (e.g. Iron(III)) gives the metal cation charge directly (3+). Common polyatomic ions: OH⁻, NO₃⁻, CO₃²⁻, SO₄²⁻, NH₄⁺ — enclose polyatomic ions in brackets whenever subscript &ge; 2 (e.g. Ca(NO₃)₂).
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <label className="text-xs font-black text-slate-500 block text-center">
              Enter Balanced Chemical Formula
            </label>

            <FormulaInput
              value={studentAnswer}
              onChange={(val) => { setStudentAnswer(val); if (feedback.message) setFeedback({ message: '', status: '' }); }}
              status={feedback.status}
              placeholder="e.g. MgCl₂"
              onKeyDown={(e) => e.key === 'Enter' && (feedback.status === 'success' ? generateProblem() : checkAnswer())}
            />

            <div className="button-group">
              <button type="button" className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
              <button type="button" className="btn btn-secondary" onClick={() => generateProblem()}>Next Problem &rarr;</button>
            </div>
          </div>

          {feedback.message && (
            <div className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
              <span className="text-xs sm:text-sm font-semibold">{feedback.message}</span>
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
      </div>
    </div>
  );
};

export default FormulasFromName;
