import React, { useState, useEffect, useRef } from 'react';
import { simpleCations, simpleAnions, advancedPolyAnions } from '../../data/questions/formulaQuestions';

export function FormulasFromIons({ onComplete }) {
  const [cation, setCation] = useState(null);
  const [anion, setAnion] = useState(null);
  const [userFormula, setUserFormula] = useState('');
  const [feedback, setFeedback] = useState(null);
  const feedbackRef = useRef(null);
  const inputRef = useRef(null);

  const getLCM = (a, b) => {
    const min = Math.min(a, b);
    for (let i = min; i <= a * b; i++) {
      if (i % a === 0 && i % b === 0) return i;
    }
    return a * b;
  };

  const generatePair = () => {
    setUserFormula('');
    setFeedback(null);

    const randomCation = simpleCations[Math.floor(Math.random() * simpleCations.length)];
    const useAdvanced = Math.random() > 0.45;
    const pool = useAdvanced ? advancedPolyAnions : simpleAnions;
    const randomAnion = pool[Math.floor(Math.random() * pool.length)];

    setCation(randomCation);
    setAnion(randomAnion);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    generatePair();
  }, []);

  const renderLiveFormulaPreview = (inputString) => {
    if (!inputString.trim()) return <span className="text-slate-400 font-sans text-xs font-normal">Awaiting input...</span>;

    let displayString = inputString;
    const cleanLower = inputString.replace(/\s+/g, '').toLowerCase();

    if (displayString) {
      if (cation?.formula === "H+" && anion?.formula === "HSO4-" && cleanLower === "hhso4") {
        displayString = "H2SO4";
      } else if (cation?.formula === "H+" && anion?.formula === "HCO3-" && cleanLower === "hhco3") {
        displayString = "H2CO3";
      } else if (cation?.formula === "H+" && anion?.formula === "OH-" && cleanLower === "hoh") {
        displayString = "H2O";
      }
    }

    const tokenRegex = /([0-9]+)/g;
    const segments = displayString.split(tokenRegex);

    return segments.map((segment, index) => {
      const isNumeric = /^[0-9]+$/.test(segment);
      return isNumeric ? (
        <sub
          key={`sub-${index}`}
          className="text-[0.7em] font-black text-blue-600 inline-block translate-y-[0.25em]"
          style={{ verticalAlign: 'sub', lineHeight: '0' }}
        >
          {segment}
        </sub>
      ) : (
        <span key={`text-${index}`} className="font-bold text-slate-800">
          {segment}
        </span>
      );
    });
  };

  const getCorrectAnswers = () => {
    if (!cation || !anion) return [];

    const lcm = getLCM(cation.charge, anion.charge);
    const catCount = lcm / cation.charge;
    const anCount = lcm / anion.charge;

    if (cation.formula === "H+" && anion.formula === "HSO4-") {
      return ["h2so4", "h₂so₄"];
    }
    if (cation.formula === "H+" && anion.formula === "HCO3-") {
      return ["h2co3", "h₂co₃"];
    }
    if (cation.formula === "H+" && anion.formula === "OH-") {
      return ["h2o", "h₂o"];
    }

    const catStr = cation.formula.replace(/\d?\+/, '');
    const anStr = anion.formula.replace(/\d?-/, '');

    let partCat = catCount === 1 ? catStr : `${catStr}${catCount}`;
    let partAn = "";

    if (anCount === 1) {
      partAn = anion.polyatomic ? anion.base : anStr;
    } else {
      partAn = anion.polyatomic ? `(${anion.base})${anCount}` : `${anStr}${anCount}`;
    }

    const standardForm = `${partCat}${partAn}`;
    return [standardForm, standardForm.toLowerCase()];
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (feedback?.isCorrect) {
      generatePair();
      return;
    }
    if (!cation || !anion || !userFormula.trim()) return;

    const cleanedInput = userFormula.replace(/\s+/g, '');
    let evaluationTarget = cleanedInput.toLowerCase();

    if (cation.formula === "H+" && anion.formula === "HSO4-" && evaluationTarget === "hhso4") {
      evaluationTarget = "h2so4";
    }
    if (cation.formula === "H+" && anion.formula === "HCO3-" && evaluationTarget === "hhco3") {
      evaluationTarget = "h2co3";
    }
    if (cation.formula === "H+" && anion.formula === "OH-" && evaluationTarget === "hoh") {
      evaluationTarget = "h2o";
    }

    const correctAnswers = getCorrectAnswers();
    const isMatched = correctAnswers.includes(evaluationTarget);

    const lcm = getLCM(cation.charge, anion.charge);
    const expectedCat = lcm / cation.charge;
    const expectedAn = lcm / anion.charge;

    if (isMatched) {
      setFeedback({
        isCorrect: true,
        msg: `Excellent! The charges balance completely at a ${expectedCat}:${expectedAn} ratio, giving a net neutral compound.`
      });
      onComplete?.(`${cation.formula}_${anion.formula}`);
    } else {
      let bracketHint = "";
      if (anion.polyatomic && expectedAn > 1 && !cleanedInput.includes('(')) {
        bracketHint = " Remember to enclose polyatomic ion sub-units inside brackets when scaling their ratio above 1.";
      }
      setFeedback({
        isCorrect: false,
        msg: `Incorrect formula structural compilation. Deduce the lowest common multiple of ${cation.charge}+ and ${anion.charge}-.${bracketHint}`
      });
    }

    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  if (!cation || !anion) return <div className="text-center p-8 text-[var(--chem-text-muted)]">Loading workspace matrix...</div>;

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">Formulas from Ions</div>

      <div className="applet-workbench">
        <div className="applet-workbench-sticky space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl p-4 text-center shadow-inner">
              <span className="text-[10px] font-bold tracking-wider text-amber-600 block mb-1">Target Cation</span>
              <div className="text-2xl font-bold text-[var(--chem-text-main)] font-mono">{cation.html}</div>
              <div className="text-xs font-medium text-[var(--chem-text-muted)] mt-1 break-words">{cation.name} (Charge: +{cation.charge})</div>
            </div>
            <div className="bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl p-4 text-center shadow-inner">
              <span className="text-[10px] font-bold tracking-wider text-indigo-600 block mb-1">Target Anion</span>
              <div className="text-2xl font-bold text-[var(--chem-text-main)] font-mono">{anion.html}</div>
              <div className="text-xs font-medium text-[var(--chem-text-muted)] mt-1 break-words">{anion.name} (Charge: -{anion.charge})</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleVerify} className="bg-[var(--chem-bg-card)] border border-[var(--chem-border-subtle)] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[var(--chem-text-main)] block">
                Deduce the Combined Neutral Formula:
              </label>
              <p className="text-xs text-[var(--chem-text-muted)] leading-relaxed">
                Type standard continuous values. Use brackets for multiple polyatomic units. Press Enter to check, and press Enter again for the next ion pair.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={userFormula}
                  onChange={(e) => { setUserFormula(e.target.value); setFeedback(null); }}
                  placeholder="e.g. Al2(SO4)3"
                  className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--chem-primary)] text-slate-800 font-mono font-bold tracking-wide shadow-inner placeholder-slate-400"
                  spellCheck="false"
                  autoComplete="off"
                />

                <div className="min-w-[140px] px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 min-h-[2.75rem] h-auto select-none shrink-0 text-center shadow-sm">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 border-r border-slate-200 pr-1.5 leading-none">Render:</span>
                  <div className="text-sm font-mono tracking-wide leading-normal min-h-[1.5rem] flex items-center flex-wrap justify-center">
                    {renderLiveFormulaPreview(userFormula)}
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary">
                  Check Answer
                </button>
                <button type="button" onClick={generatePair} className="btn btn-secondary">
                  Next Problem &rarr;
                </button>
              </div>
            </div>
          </form>

          {feedback && (
            <div
              ref={feedbackRef}
              className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
                feedback.isCorrect ? 'feedback-success' : 'feedback-error'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg">{feedback.isCorrect ? '✅' : '❌'}</span>
                <div>
                  <h4 className="text-sm font-bold">{feedback.isCorrect ? 'Empirical Balance Reached' : 'Stoichiometry Mismatch'}</h4>
                  <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">{feedback.msg}</p>
                </div>
              </div>
              {feedback.isCorrect && (
                <button
                  type="button"
                  onClick={generatePair}
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
}

export default FormulasFromIons;
