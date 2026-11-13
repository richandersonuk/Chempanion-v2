import React, { useState, useEffect } from 'react';
import { HALF_EQUATIONS_DATA } from '../../data/questions/halfEquationQuestions';

export default function HalfEquationBalancing({ onComplete }) {
  const [practiceMode, setPracticeMode] = useState('guided');
  const [currentProblem, setCurrentProblem] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false, false]);

  const [guidedInputs, setGuidedInputs] = useState({
    elementSymbol: '',
    reactCoeff: '1',
    prodCoeff: '1',
    osBefore: '',
    osAfter: '',
    electronQty: '',
    electronSide: 'LHS',
    hPlusQty: '',
    hPlusSide: 'LHS',
    waterQty: '',
    waterSide: 'RHS'
  });

  const [examInputs, setExamInputs] = useState({
    reactCoeff: '1',
    prodCoeff: '1',
    hPlusQty: '',
    hPlusSide: 'LHS',
    electronQty: '',
    electronSide: 'LHS',
    waterQty: '',
    waterSide: 'RHS'
  });

  const [feedback, setFeedback] = useState(null);
  const [showMarkScheme, setShowMarkScheme] = useState(false);

  const noSpinnerInputClass =
    "w-12 h-8 text-center text-xs font-mono font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-[var(--chem-primary)] focus:outline-none";

  const generateProblem = () => {
    setFeedback(null);
    setShowMarkScheme(false);
    setActiveStep(0);
    setCompletedSteps([false, false, false, false, false, false]);

    const randomIndex = Math.floor(Math.random() * HALF_EQUATIONS_DATA.length);
    const prob = HALF_EQUATIONS_DATA[randomIndex];
    setCurrentProblem(prob);

    setGuidedInputs({
      elementSymbol: '',
      reactCoeff: '1',
      prodCoeff: '1',
      osBefore: '',
      osAfter: '',
      electronQty: '',
      electronSide: prob.electronSide,
      hPlusQty: '',
      hPlusSide: prob.hPlusSide === 'NONE' ? 'NONE' : 'LHS',
      waterQty: '',
      waterSide: prob.waterSide === 'NONE' ? 'NONE' : 'RHS'
    });

    setExamInputs({
      reactCoeff: '1',
      prodCoeff: '1',
      hPlusQty: '',
      hPlusSide: 'LHS',
      electronQty: '',
      electronSide: 'LHS',
      waterQty: '',
      waterSide: 'RHS'
    });
  };

  useEffect(() => {
    generateProblem();
  }, [practiceMode]);

  const handleGuidedInputChange = (field, val) => {
    setGuidedInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleExamInputChange = (field, val) => {
    setExamInputs((prev) => ({ ...prev, [field]: val }));
  };

  const checkOSMatch = (inputVal, targetVal) => {
    if (!inputVal) return false;
    const cleanInput = inputVal.trim().replace(/\s+/g, '').toLowerCase();
    const cleanTarget = targetVal.trim().replace(/\s+/g, '').toLowerCase();

    if (cleanInput === cleanTarget) return true;

    const targetDigits = cleanTarget.replace(/[^0-9.]/g, '');
    const inputDigits = cleanInput.replace(/[^0-9.]/g, '');
    return inputDigits.length > 0 && inputDigits === targetDigits;
  };

  const validateGuidedStep = (e) => {
    e.preventDefault();
    if (!currentProblem) return;

    const p = currentProblem;
    let isCorrect = false;
    let hint = '';

    if (activeStep === 0) {
      const symUser = guidedInputs.elementSymbol.trim().toLowerCase();
      isCorrect = symUser === p.elementSymbol.toLowerCase();
      hint = isCorrect
        ? `Correct! The key element undergoing redox transition is ${p.elementName} (${p.elementSymbol}).`
        : `Incorrect. Look at the transition metal or non-oxygen element in ${p.reactantName}.`;
    } else if (activeStep === 1) {
      const rCoeff = parseInt(guidedInputs.reactCoeff || '1', 10);
      const pCoeff = parseInt(guidedInputs.prodCoeff || '1', 10);
      isCorrect = rCoeff === p.reactantCoeff && pCoeff === p.productCoeff;
      hint = isCorrect
        ? `Correct! Balanced atoms of ${p.elementSymbol} (${p.reactantCoeff} reactant → ${p.productCoeff} product).`
        : `Check the stoichiometry of ${p.elementSymbol} atoms on both sides of the equation.`;
    } else if (activeStep === 2) {
      const osBeforeCorrect = checkOSMatch(guidedInputs.osBefore, p.osBefore);
      const osAfterCorrect = checkOSMatch(guidedInputs.osAfter, p.osAfter);
      isCorrect = osBeforeCorrect && osAfterCorrect;

      hint = isCorrect
        ? `Correct! Oxidation state changes from ${p.osBefore} to ${p.osAfter}.`
        : `Incorrect. Calculate the oxidation number per atom of ${p.elementSymbol} (e.g. ${p.osBefore} → ${p.osAfter}).`;
    } else if (activeStep === 3) {
      const eQty = parseInt(guidedInputs.electronQty || '0', 10);
      const eSide = guidedInputs.electronSide;
      isCorrect = eQty === p.electronCount && eSide === p.electronSide;
      hint = isCorrect
        ? `Correct! Added ${p.electronCount} e⁻ to the ${p.electronSide}.`
        : `Calculate total change in oxidation state. Add electrons (e⁻) to the side with higher positive charge.`;
    } else if (activeStep === 4) {
      const hQty = parseInt(guidedInputs.hPlusQty || '0', 10);
      const hSide = guidedInputs.hPlusSide;
      if (p.hPlusCount === 0) {
        isCorrect = hQty === 0 || hSide === 'NONE';
      } else {
        isCorrect = hQty === p.hPlusCount && hSide === p.hPlusSide;
      }
      hint = isCorrect
        ? p.hPlusCount === 0
          ? 'Correct! No H⁺ ions required for this reaction.'
          : `Correct! Added ${p.hPlusCount} H⁺ to the ${p.hPlusSide} to balance overall ionic charge.`
        : `Calculate total net ionic charge on both sides. Add H⁺ ions in acidic media to balance total charge.`;
    } else if (activeStep === 5) {
      const wQty = parseInt(guidedInputs.waterQty || '0', 10);
      const wSide = guidedInputs.waterSide;
      if (p.waterCount === 0) {
        isCorrect = wQty === 0 || wSide === 'NONE';
      } else {
        isCorrect = wQty === p.waterCount && wSide === p.waterSide;
      }
      hint = isCorrect
        ? p.waterCount === 0
          ? 'Correct! Mass of H and O atoms is already balanced.'
          : `Correct! Added ${p.waterCount} H₂O to the ${p.waterSide} to complete mass balance.`
        : `Count remaining oxygen or hydrogen atoms. Each H₂O molecule supplies 1 oxygen and 2 hydrogen atoms.`;
    }

    if (isCorrect) {
      const updatedSteps = [...completedSteps];
      updatedSteps[activeStep] = true;
      setCompletedSteps(updatedSteps);

      setFeedback({ status: 'success', message: hint });

      if (activeStep < 5) {
        setTimeout(() => {
          setActiveStep((prev) => prev + 1);
          setFeedback(null);
        }, 1200);
      } else {
        onComplete?.(p.id);
      }
    } else {
      setFeedback({ status: 'error', message: hint });
    }
  };

  const handleExamSubmit = (e) => {
    e.preventDefault();
    if (!currentProblem) return;

    const p = currentProblem;

    const rCoeff = parseInt(examInputs.reactCoeff || '1', 10);
    const pCoeff = parseInt(examInputs.prodCoeff || '1', 10);

    const hQty = parseInt(examInputs.hPlusQty || '0', 10);
    const hSide = examInputs.hPlusSide;
    const expectedH = p.hPlusCount;
    const expectedHSide = p.hPlusSide;

    const eQty = parseInt(examInputs.electronQty || '0', 10);
    const eSide = examInputs.electronSide;

    const wQty = parseInt(examInputs.waterQty || '0', 10);
    const wSide = examInputs.waterSide;
    const expectedW = p.waterCount;
    const expectedWSide = p.waterSide;

    const mainBalanced = rCoeff === p.reactantCoeff && pCoeff === p.productCoeff;
    const hBalanced = expectedH === 0 ? hQty === 0 : hQty === expectedH && hSide === expectedHSide;
    const wBalanced = expectedW === 0 ? wQty === 0 : wQty === expectedW && wSide === expectedWSide;
    const eBalanced = eQty === p.electronCount && eSide === p.electronSide;

    const allCorrect = mainBalanced && hBalanced && wBalanced && eBalanced;

    if (allCorrect) {
      setFeedback({
        status: 'success',
        message: 'Correct! Both atom mass balance and overall net charge balance are completely satisfied.'
      });
      onComplete?.(p.id);
    } else {
      const errors = [];
      if (!mainBalanced) errors.push(`stoichiometry of ${p.elementSymbol} species`);
      if (!eBalanced) errors.push('electron quantity or placement');
      if (!hBalanced) errors.push('H⁺ ion balance');
      if (!wBalanced) errors.push('H₂O water balance');

      setFeedback({
        status: 'error',
        message: `Incorrect. Recheck your ${errors.join(', ')}. Remember to balance in order: key element, O (via H₂O), H (via H⁺), then charge (via e⁻).`
      });
    }
  };

  const stepsList = [
    { num: 1, label: 'Identify Element' },
    { num: 2, label: 'Balance Key Atoms' },
    { num: 3, label: 'Oxidation States' },
    { num: 4, label: 'Add Electrons (e⁻)' },
    { num: 5, label: 'Add H⁺ (Charge)' },
    { num: 6, label: 'Add H₂O (H & O)' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 bg-[var(--chem-bg-main)] text-[var(--chem-text)] font-sans transition-colors duration-200">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--chem-border)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--chem-primary)] flex items-center gap-2">
            <span>⚡</span> Redox Half-Equations
          </h1>
          <p className="text-xs sm:text-sm text-[var(--chem-text-muted)] mt-1">
            WJEC A-Level Chemistry • Unit 3.1 & Unit 3.4
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-[var(--chem-card-bg)] p-1 rounded-lg border border-[var(--chem-border)]">
          <button
            type="button"
            onClick={() => setPracticeMode('guided')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              practiceMode === 'guided'
                ? 'bg-[var(--chem-primary)] text-white shadow-sm'
                : 'text-[var(--chem-text-muted)] hover:text-[var(--chem-text)]'
            }`}
          >
            Step-by-Step Builder
          </button>
          <button
            type="button"
            onClick={() => setPracticeMode('exam')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              practiceMode === 'exam'
                ? 'bg-[var(--chem-primary)] text-white shadow-sm'
                : 'text-[var(--chem-text-muted)] hover:text-[var(--chem-text)]'
            }`}
          >
            Exam Practice
          </button>
        </div>
      </header>

      {currentProblem && (
        <div className="bg-[var(--chem-card-bg)] rounded-xl border border-[var(--chem-border)] p-4 sm:p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center border-b border-[var(--chem-border)] pb-3 mb-4 text-xs font-mono text-[var(--chem-text-muted)]">
            <span>WJEC Unit 3.1 • Redox Half-Equations</span>
            <span className="font-semibold text-[var(--chem-accent)]">
              [{practiceMode === 'guided' ? `Step ${activeStep + 1} of 6` : '2 marks'}]
            </span>
          </div>

          <div className="mb-6 space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-[var(--chem-primary)]">
              {currentProblem.name}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--chem-text-muted)] italic">
              {currentProblem.context}
            </p>
            <p className="text-xs text-[var(--chem-text-muted)] pt-1">
              (Refer to the Data Booklet for standard electrode potentials or oxidation rules if required.)
            </p>
          </div>

          <div className="w-full overflow-x-auto my-4 py-4 px-3 bg-[var(--chem-bg-main)] rounded-lg border border-[var(--chem-border)] flex flex-col items-center justify-center gap-2">
            <span className="text-[0.65rem] uppercase font-mono font-bold tracking-wider text-[var(--chem-text-muted)]">
              Constructed Half-Equation
            </span>
            <div className="flex items-center gap-2 min-w-max text-sm sm:text-base font-bold">
              <span className="inline-flex items-center gap-1">
                {(practiceMode === 'exam' || completedSteps[1]) && (practiceMode === 'guided' ? guidedInputs.reactCoeff : examInputs.reactCoeff) !== '1' && (
                  <span>{practiceMode === 'guided' ? guidedInputs.reactCoeff : examInputs.reactCoeff}</span>
                )}
                <span>{currentProblem.reactantName}</span>

                {((practiceMode === 'guided' && completedSteps[4] && guidedInputs.hPlusSide === 'LHS' && parseInt(guidedInputs.hPlusQty || '0', 10) > 0) ||
                  (practiceMode === 'exam' && parseInt(examInputs.hPlusQty || '0', 10) > 0 && examInputs.hPlusSide === 'LHS')) && (
                  <span className="text-[var(--chem-primary)]">
                    + {(practiceMode === 'guided' ? guidedInputs.hPlusQty : examInputs.hPlusQty)}H<sup>+</sup>
                  </span>
                )}

                {((practiceMode === 'guided' && completedSteps[3] && guidedInputs.electronSide === 'LHS' && parseInt(guidedInputs.electronQty || '0', 10) > 0) ||
                  (practiceMode === 'exam' && parseInt(examInputs.electronQty || '0', 10) > 0 && examInputs.electronSide === 'LHS')) && (
                  <span className="text-[var(--chem-accent)]">
                    + {(practiceMode === 'guided' ? guidedInputs.electronQty : examInputs.electronQty)}e<sup>-</sup>
                  </span>
                )}

                {((practiceMode === 'guided' && completedSteps[5] && guidedInputs.waterSide === 'LHS' && parseInt(guidedInputs.waterQty || '0', 10) > 0) ||
                  (practiceMode === 'exam' && parseInt(examInputs.waterQty || '0', 10) > 0 && examInputs.waterSide === 'LHS')) && (
                  <span className="text-[var(--chem-primary)]">
                    + {(practiceMode === 'guided' ? guidedInputs.waterQty : examInputs.waterQty)}H<sub>2</sub>O
                  </span>
                )}
              </span>

              <span className="font-bold text-[var(--chem-primary)] text-lg mx-1">&rarr;</span>

              <span className="inline-flex items-center gap-1">
                {(practiceMode === 'guided' ? completedSteps[1] : true) && (
                  <>
                    {(practiceMode === 'guided' ? guidedInputs.prodCoeff : examInputs.prodCoeff) !== '1' && (
                      <span>{practiceMode === 'guided' ? guidedInputs.prodCoeff : examInputs.prodCoeff}</span>
                    )}
                    <span>{currentProblem.productName}</span>
                  </>
                )}

                {((practiceMode === 'guided' && completedSteps[5] && guidedInputs.waterSide === 'RHS' && parseInt(guidedInputs.waterQty || '0', 10) > 0) ||
                  (practiceMode === 'exam' && parseInt(examInputs.waterQty || '0', 10) > 0 && examInputs.waterSide === 'RHS')) && (
                  <span className="text-[var(--chem-primary)]">
                    + {(practiceMode === 'guided' ? guidedInputs.waterQty : examInputs.waterQty)}H<sub>2</sub>O
                  </span>
                )}

                {((practiceMode === 'guided' && completedSteps[4] && guidedInputs.hPlusSide === 'RHS' && parseInt(guidedInputs.hPlusQty || '0', 10) > 0) ||
                  (practiceMode === 'exam' && parseInt(examInputs.hPlusQty || '0', 10) > 0 && examInputs.hPlusSide === 'RHS')) && (
                  <span className="text-[var(--chem-primary)]">
                    + {(practiceMode === 'guided' ? guidedInputs.hPlusQty : examInputs.hPlusQty)}H<sup>+</sup>
                  </span>
                )}

                {((practiceMode === 'guided' && completedSteps[3] && guidedInputs.electronSide === 'RHS' && parseInt(guidedInputs.electronQty || '0', 10) > 0) ||
                  (practiceMode === 'exam' && parseInt(examInputs.electronQty || '0', 10) > 0 && examInputs.electronSide === 'RHS')) && (
                  <span className="text-[var(--chem-accent)]">
                    + {(practiceMode === 'guided' ? guidedInputs.electronQty : examInputs.electronQty)}e<sup>-</sup>
                  </span>
                )}
              </span>
            </div>
          </div>

          {practiceMode === 'guided' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
                {stepsList.map((st, idx) => (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`p-2 rounded-lg border text-[0.7rem] font-semibold flex flex-col items-center justify-center transition-all text-center gap-0.5 ${
                      activeStep === idx
                        ? 'bg-[var(--chem-primary)] text-white border-[var(--chem-primary)]'
                        : completedSteps[idx]
                        ? 'bg-[var(--chem-bg-main)] border-[var(--chem-success)] text-[var(--chem-text)]'
                        : 'bg-[var(--chem-bg-main)] border-[var(--chem-border)] text-[var(--chem-text-muted)]'
                    }`}
                  >
                    <span className="font-mono text-[0.65rem]">Step {st.num}</span>
                    <span className="truncate w-full">{st.label} {completedSteps[idx] ? '✓' : ''}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={validateGuidedStep} className="space-y-5 bg-[var(--chem-bg-main)] p-4 rounded-xl border border-[var(--chem-border)]">
                {activeStep === 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--chem-primary)]">
                      Step 1: Identify the element changing oxidation state
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Examine <strong>{currentProblem.reactantName}</strong> &rarr; <strong>{currentProblem.productName}</strong>. Input the chemical symbol of the element undergoing redox transition:
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm pt-1">
                      <span className="font-semibold">Element Symbol:</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mn, Cr, V"
                        value={guidedInputs.elementSymbol}
                        onChange={(e) => handleGuidedInputChange('elementSymbol', e.target.value)}
                        className="w-28 h-8 text-center text-xs sm:text-sm font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)] focus:border-[var(--chem-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--chem-primary)]">
                      Step 2: Balance atoms of {currentProblem.elementSymbol}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Input the stoichiometric coefficients required to balance atoms of <strong>{currentProblem.elementSymbol}</strong>:
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold pt-1">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                        value={guidedInputs.reactCoeff}
                        onChange={(e) => handleGuidedInputChange('reactCoeff', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>{currentProblem.reactantName} &rarr;</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                        value={guidedInputs.prodCoeff}
                        onChange={(e) => handleGuidedInputChange('prodCoeff', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>{currentProblem.productName}</span>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--chem-primary)]">
                      Step 3: Determine oxidation states before and after
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Determine the oxidation state of {currentProblem.elementSymbol} in the reactant and product species:
                    </p>
                    <p className="text-[0.7rem] text-[var(--chem-text-muted)] italic">
                      (Format: e.g. +7 and +2, or 2@+6 for species with multiple atoms like dichromate)
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">Initial OS:</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +7 or 2@+6"
                          value={guidedInputs.osBefore}
                          onChange={(e) => handleGuidedInputChange('osBefore', e.target.value)}
                          className="w-28 h-8 text-center text-xs font-mono font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">Final OS:</span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. +2 or 2@+3"
                          value={guidedInputs.osAfter}
                          onChange={(e) => handleGuidedInputChange('osAfter', e.target.value)}
                          className="w-28 h-8 text-center text-xs font-mono font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--chem-primary)]">
                      Step 4: Add electrons (e⁻) to balance oxidation numbers
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Add electrons (e⁻) to balance the change in oxidation number across the transformation:
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm pt-1">
                      <span>Add</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        value={guidedInputs.electronQty}
                        onChange={(e) => handleGuidedInputChange('electronQty', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>electron(s) (e⁻) to the</span>
                      <select
                        value={guidedInputs.electronSide}
                        onChange={(e) => handleGuidedInputChange('electronSide', e.target.value)}
                        className="h-8 px-2 text-xs font-semibold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                      >
                        <option value="LHS">LHS (Reactants)</option>
                        <option value="RHS">RHS (Products)</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--chem-primary)]">
                      Step 5: Add H⁺ to balance overall ionic charge
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Add <strong>H⁺ ions</strong> in acidic media to equalize total net charge on both sides:
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm pt-1">
                      <span>Add</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        value={guidedInputs.hPlusQty}
                        onChange={(e) => handleGuidedInputChange('hPlusQty', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>H⁺ ion(s) to the</span>
                      <select
                        value={guidedInputs.hPlusSide}
                        onChange={(e) => handleGuidedInputChange('hPlusSide', e.target.value)}
                        className="h-8 px-2 text-xs font-semibold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                      >
                        <option value="LHS">LHS (Reactants)</option>
                        <option value="RHS">RHS (Products)</option>
                        <option value="NONE">None Required</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className="space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--chem-primary)]">
                      Step 6: Add H₂O to balance hydrogen and oxygen atoms
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Add <strong>H₂O molecules</strong> to complete mass balance for H and O atoms:
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm pt-1">
                      <span>Add</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        value={guidedInputs.waterQty}
                        onChange={(e) => handleGuidedInputChange('waterQty', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>H₂O molecule(s) to the</span>
                      <select
                        value={guidedInputs.waterSide}
                        onChange={(e) => handleGuidedInputChange('waterSide', e.target.value)}
                        className="h-8 px-2 text-xs font-semibold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                      >
                        <option value="RHS">RHS (Products)</option>
                        <option value="LHS">LHS (Reactants)</option>
                        <option value="NONE">None Required</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-[var(--chem-border)]">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[var(--chem-primary)] hover:bg-[var(--chem-primary-hover)] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
                  >
                    Verify Step {activeStep + 1}
                  </button>

                  <div className="flex items-center gap-2">
                    {activeStep < 5 && completedSteps[activeStep] && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStep((prev) => prev + 1);
                          setFeedback(null);
                        }}
                        className="px-4 py-2 bg-[var(--chem-card-bg)] border border-[var(--chem-border)] text-xs font-semibold rounded-lg text-[var(--chem-text)]"
                      >
                        Next Step &rarr;
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={generateProblem}
                      className="px-3.5 py-2 bg-[var(--chem-card-bg)] border border-[var(--chem-border)] text-xs font-semibold rounded-lg text-[var(--chem-text)]"
                    >
                      New Half-Equation
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {practiceMode === 'exam' && (
            <form onSubmit={handleExamSubmit} className="space-y-6">
              <p className="text-sm sm:text-base leading-relaxed">
                Construct the full, balanced ionic half-equation for the transformation of <strong>{currentProblem.reactantName}</strong> to <strong>{currentProblem.productName}</strong> in acidic media:
              </p>

              <div className="bg-[var(--chem-bg-main)] p-4 rounded-xl border border-[var(--chem-border)] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-3 bg-[var(--chem-card-bg)] rounded-lg border border-[var(--chem-border)] space-y-3">
                    <span className="font-bold text-[var(--chem-primary)] uppercase tracking-wider text-[0.7rem] block">
                      Left-Hand Side (Reactants)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        value={examInputs.reactCoeff}
                        onChange={(e) => handleExamInputChange('reactCoeff', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>{currentProblem.reactantName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        value={examInputs.hPlusQty}
                        onChange={(e) => handleExamInputChange('hPlusQty', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>H⁺ ions (if LHS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        value={examInputs.electronQty}
                        onChange={(e) => handleExamInputChange('electronQty', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>electrons e⁻ (if LHS)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--chem-card-bg)] rounded-lg border border-[var(--chem-border)] space-y-3">
                    <span className="font-bold text-[var(--chem-primary)] uppercase tracking-wider text-[0.7rem] block">
                      Right-Hand Side (Products)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        value={examInputs.prodCoeff}
                        onChange={(e) => handleExamInputChange('prodCoeff', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>{currentProblem.productName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        value={examInputs.waterQty}
                        onChange={(e) => handleExamInputChange('waterQty', e.target.value)}
                        className={noSpinnerInputClass}
                      />
                      <span>H₂O molecules (if RHS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        value={examInputs.electronSide === 'RHS' ? examInputs.electronQty : ''}
                        onChange={(e) => {
                          handleExamInputChange('electronQty', e.target.value);
                          handleExamInputChange('electronSide', 'RHS');
                        }}
                        className={noSpinnerInputClass}
                      />
                      <span>electrons e⁻ (if RHS)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--chem-primary)] hover:bg-[var(--chem-primary-hover)] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
                >
                  Check Half-Equation
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMarkScheme(!showMarkScheme)}
                    className="px-3.5 py-2.5 bg-[var(--chem-bg-main)] border border-[var(--chem-border)] hover:border-[var(--chem-primary)] text-[var(--chem-text)] text-xs sm:text-sm font-medium rounded-lg transition-colors"
                  >
                    {showMarkScheme ? 'Hide Mark Scheme' : 'View Mark Scheme'}
                  </button>
                  <button
                    type="button"
                    onClick={generateProblem}
                    className="px-3.5 py-2.5 bg-[var(--chem-bg-main)] border border-[var(--chem-border)] hover:border-[var(--chem-primary)] text-[var(--chem-text)] text-xs sm:text-sm font-medium rounded-lg transition-colors"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </form>
          )}

          {feedback && (
            <div
              className={`mt-6 p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                feedback.status === 'success'
                  ? 'bg-[var(--chem-bg-main)] border-[var(--chem-success)] text-[var(--chem-text)]'
                  : 'bg-[var(--chem-bg-main)] border-[var(--chem-error)] text-[var(--chem-text)]'
              }`}
            >
              <div className="flex items-start gap-2">
                <span>{feedback.status === 'success' ? '✅' : '❌'}</span>
                <div>
                  <p className="font-semibold">{feedback.message}</p>
                </div>
              </div>
            </div>
          )}

          {showMarkScheme && (
            <div className="mt-6 p-4 bg-[var(--chem-bg-main)] border border-[var(--chem-border)] rounded-lg space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-[var(--chem-primary)] uppercase tracking-wider text-[0.7rem]">
                WJEC Examiner Mark Scheme & Guidance
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-[var(--chem-text)]">
                <li>
                  <strong>[1 mark]</strong> Correct key element stoichiometry and electron count ({currentProblem.electronCount}e⁻ on {currentProblem.electronSide}).
                </li>
                <li>
                  <strong>[1 mark]</strong> Correct balancing of acidic media species ({currentProblem.hPlusCount > 0 ? `${currentProblem.hPlusCount}H⁺` : 'no H⁺'} & {currentProblem.waterCount > 0 ? `${currentProblem.waterCount}H₂O` : 'no H₂O'}).
                </li>
              </ul>
              <div className="pt-2 border-t border-[var(--chem-border)] text-xs text-[var(--chem-text-muted)] font-mono">
                Full Balanced Half-Equation: <span className="font-bold text-[var(--chem-primary)]">{currentProblem.fullEqJSX}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
