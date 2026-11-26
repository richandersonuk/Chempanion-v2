import React, { useState, useEffect } from 'react';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';
import {
  PARTICLES,
  DECAY_DATASETS,
  ISOTOPE_HALF_LIVES,
  PROPERTY_QUESTIONS
} from '../../data/questions/nuclearQuestions';

const MODE_OPTIONS = [
  { value: 'equation', label: 'Nuclear Decay Equations' },
  { value: 'halfLife', label: 'Half-Life Calculations' },
  { value: 'properties', label: 'Radiation & Field Properties' }
];

const renderStandardForm = (num, sigFigs = 3) => {
  if (num === 0) return '0';
  if (Math.abs(num) >= 0.01 && Math.abs(num) < 10000) {
    return Number(num.toPrecision(sigFigs)).toString();
  }
  const str = num.toExponential(sigFigs - 1);
  const [base, exp] = str.split('e');
  const expNum = parseInt(exp, 10);
  return (
    <>
      {base} &times; 10<sup>{expNum}</sup>
    </>
  );
};

const Nuclide = ({ mass, atomic, symbol }) => (
  <span className="inline-flex items-center gap-1 font-mono whitespace-nowrap bg-[var(--chem-bg-main)] px-2 py-1 rounded border border-[var(--chem-border)] shadow-sm">
    <span className="inline-flex flex-col text-right text-[0.65rem] sm:text-xs font-semibold leading-none select-none tracking-tighter">
      <span>{mass !== undefined ? mass : '?'}</span>
      <span>{atomic !== undefined ? atomic : '?'}</span>
    </span>
    <span className="font-bold text-sm sm:text-base text-[var(--chem-text)] tracking-normal">
      {symbol || '?'}
    </span>
  </span>
);

export default function NuclearChemistry({ onComplete }) {
  const [questionType, setQuestionType] = useState('equation');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const generateProblem = () => {
    setFeedback(null);
    setShowMarkScheme(false);
    setShowHint(false);
    setUserInputs({});

    if (questionType === 'equation') {
      const target = DECAY_DATASETS[Math.floor(Math.random() * DECAY_DATASETS.length)];
      const missingType = Math.random() > 0.5 ? 'daughter' : 'particle';

      setCurrentProblem({
        type: 'equation',
        data: target,
        missingType,
        marks: 2
      });
    } else if (questionType === 'halfLife') {
      const iso = ISOTOPE_HALF_LIVES[Math.floor(Math.random() * ISOTOPE_HALF_LIVES.length)];
      const halfLivesCount = Math.floor(Math.random() * 5) + 2;
      const initialMassGrams = (Math.floor(Math.random() * 12) + 2) * 10;
      const remainingMassGrams = initialMassGrams / Math.pow(2, halfLivesCount);

      const timeUnit = iso.halfLifeDays ? 'days' : iso.halfLifeHours ? 'hours' : 'years';
      const unitValue = iso.halfLifeDays || iso.halfLifeHours || iso.halfLifeYears;
      const totalTimeElapsed = unitValue * halfLivesCount;

      const subType = Math.random() > 0.5 ? 'calcRemaining' : 'calcTime';

      setCurrentProblem({
        type: 'halfLife',
        subType,
        isotope: iso,
        halfLivesCount,
        initialMassGrams,
        remainingMassGrams,
        unitValue,
        timeUnit,
        totalTimeElapsed,
        marks: 3
      });
    } else if (questionType === 'properties') {
      const selected = PROPERTY_QUESTIONS[Math.floor(Math.random() * PROPERTY_QUESTIONS.length)];
      setCurrentProblem({
        type: 'properties',
        ...selected,
        marks: 1
      });
    }
  };

  useEffect(() => {
    generateProblem();
  }, [questionType]);

  const handleInputChange = (key, value) => {
    setUserInputs((prev) => ({ ...prev, [key]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback?.status === 'success') {
      generateProblem();
      return;
    }
    if (!currentProblem) return;

    if (currentProblem.type === 'equation') {
      const p = currentProblem.data;
      const inputMass = parseInt(userInputs.mass, 10);
      const inputAtomic = parseInt(userInputs.atomic, 10);
      const inputSymbol = userInputs.symbol?.trim();

      let massCorrect = false;
      let atomicCorrect = false;
      let symbolCorrect = false;
      let explanation = '';

      if (currentProblem.missingType === 'daughter') {
        massCorrect = inputMass === p.daughter.mass;
        atomicCorrect = inputAtomic === p.daughter.atomic;
        symbolCorrect = inputSymbol?.toLowerCase() === p.daughter.symbol.toLowerCase();

        explanation = `Correct daughter nuclide is ${p.daughter.mass} over ${p.daughter.atomic} ${p.daughter.symbol}.`;
      } else {
        const expectedParticle = PARTICLES[p.mode];
        massCorrect = inputMass === expectedParticle.mass;
        atomicCorrect = inputAtomic === expectedParticle.atomic;

        const lowerSym = inputSymbol?.toLowerCase();
        symbolCorrect =
          lowerSym === expectedParticle.symbol.toLowerCase() ||
          lowerSym === expectedParticle.greek.toLowerCase() ||
          lowerSym === expectedParticle.name.toLowerCase() ||
          (p.mode === 'betaMinus' && lowerSym === 'e-') ||
          (p.mode === 'electronCapture' && lowerSym === 'e-');

        explanation = `Correct particle is ${expectedParticle.mass} over ${expectedParticle.atomic} ${expectedParticle.symbol} (${expectedParticle.name}).`;
      }

      const allCorrect = massCorrect && atomicCorrect && symbolCorrect;

      if (allCorrect) {
        setFeedback({
          status: 'success',
          message: 'Correct! Both mass number (A) and atomic number / symbol (Z) are balanced.'
        });
        onComplete?.(`eq_${p.parent.name}`);
      } else {
        const errors = [];
        if (!massCorrect) errors.push('mass number (A)');
        if (!atomicCorrect) errors.push('atomic number (Z)');
        if (!symbolCorrect) errors.push('chemical/particle symbol');

        setFeedback({
          status: 'error',
          message: `Incorrect. Check your ${errors.join(', ')}. Remember: total mass numbers (A) and total atomic numbers (Z) on LHS must equal RHS, and Z uniquely determines the element symbol.`
        });
      }
    } else if (currentProblem.type === 'halfLife') {
      const userVal = parseFloat(userInputs.answer);
      if (isNaN(userVal)) {
        setFeedback({ status: 'error', message: 'Please enter a valid numerical value.' });
        return;
      }

      const expected =
        currentProblem.subType === 'calcRemaining'
          ? currentProblem.remainingMassGrams
          : currentProblem.totalTimeElapsed;

      const relDiff = Math.abs((userVal - expected) / expected);

      if (relDiff < 0.01) {
        setFeedback({
          status: 'success',
          message: `Correct! (${currentProblem.halfLivesCount} half-lives elapsed).`
        });
        onComplete?.(`hl_${currentProblem.isotope.name}`);
      } else if (relDiff < 0.05) {
        setFeedback({
          status: 'warning',
          message: 'Very close! Check your rounding or ensure you halved the mass the correct number of times.'
        });
      } else {
        setFeedback({
          status: 'error',
          message: `Incorrect. Remember: each half-life (${currentProblem.unitValue} ${currentProblem.timeUnit}) reduces the radioisotope mass by half (÷ 2).`
        });
      }
    } else if (currentProblem.type === 'properties') {
      const userVal = userInputs.selectedOption?.toLowerCase();
      const isCorrect = userVal === currentProblem.answer;

      setFeedback({
        status: isCorrect ? 'success' : 'error',
        message: isCorrect
          ? <>Correct! {currentProblem.explanation}</>
          : 'Incorrect. Review the mass, electric charge (+2, −1, or 0), and ionising/penetrating properties of alpha, beta, and gamma emissions.'
      });
      if (isCorrect) {
        onComplete?.(`prop_${currentProblem.answer}`);
      }
    }
  };

  const noSpinnerInputClass =
    "w-14 h-9 text-center text-sm font-mono font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded-lg text-[var(--chem-text)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">
        Nuclear Chemistry &amp; Radioactivity
      </div>

      <AdaptivePicker
        label="Choose Topic"
        options={MODE_OPTIONS}
        value={questionType}
        onChange={(val) => setQuestionType(val)}
        collapseBelow="sm"
      />

      {currentProblem && (
        <div className="applet-workbench">
          {/* Left Column: Question / Scenario + Summary + Need a Hint? */}
          <div className="applet-workbench-sticky space-y-4">
            <div className="bg-[var(--chem-card-bg)] rounded-2xl border border-[var(--chem-border)] p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[var(--chem-border)] pb-2.5">
                <span className="text-[10px] font-black tracking-widest text-slate-400">
                  {currentProblem.type === 'equation'
                    ? 'Nuclear Decay Scenario'
                    : currentProblem.type === 'halfLife'
                    ? 'Half-Life Scenario'
                    : 'Radiation & Field Properties'}
                </span>
                <span className="text-xs font-mono font-semibold text-[var(--chem-accent)]">
                  [{currentProblem.marks} mark{currentProblem.marks > 1 ? 's' : ''}]
                </span>
              </div>

              {currentProblem.type === 'equation' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base leading-relaxed">
                    {currentProblem.data.mode === 'electronCapture' ? (
                      <>
                        The unstable nucleus <strong>{currentProblem.data.parent.name}</strong> undergoes <strong>electron capture</strong>. Complete the missing values in the nuclear equation:
                      </>
                    ) : (
                      <>
                        The radioisotope <strong>{currentProblem.data.parent.name}</strong> undergoes decay via <strong>{PARTICLES[currentProblem.data.mode].name}</strong> emission. Complete the missing values in the nuclear equation:
                      </>
                    )}
                  </p>
                  <div className="p-3 rounded-xl bg-[var(--chem-bg-main)] border border-[var(--chem-border)] flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[var(--chem-text-muted)]">
                    <span>Parent Nuclide:</span>
                    <Nuclide
                      mass={currentProblem.data.parent.mass}
                      atomic={currentProblem.data.parent.atomic}
                      symbol={currentProblem.data.parent.symbol}
                    />
                  </div>
                </div>
              )}

              {currentProblem.type === 'halfLife' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base leading-relaxed">
                    The radioisotope <strong>{currentProblem.isotope.name}</strong> (used in {currentProblem.isotope.use}) has a half-life of <strong>{currentProblem.unitValue} {currentProblem.timeUnit}</strong>.
                  </p>
                  {currentProblem.subType === 'calcRemaining' ? (
                    <p className="text-sm sm:text-base leading-relaxed">
                      A sample initially contains <strong>{currentProblem.initialMassGrams} g</strong> of {currentProblem.isotope.name}. Calculate the mass of the radioisotope remaining after <strong>{currentProblem.totalTimeElapsed} {currentProblem.timeUnit}</strong>.
                    </p>
                  ) : (
                    <p className="text-sm sm:text-base leading-relaxed">
                      A sample containing <strong>{currentProblem.initialMassGrams} g</strong> of {currentProblem.isotope.name} decays until only <strong>{currentProblem.remainingMassGrams} g</strong> remains. Calculate the total time elapsed in <strong>{currentProblem.timeUnit}</strong>.
                    </p>
                  )}
                  <div className="p-3 rounded-xl bg-[var(--chem-bg-main)] border border-[var(--chem-border)] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--chem-text-muted)] block">Half-life (t₁/₂)</span>
                      <strong className="font-mono">{currentProblem.unitValue} {currentProblem.timeUnit}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--chem-text-muted)] block">Initial mass</span>
                      <strong className="font-mono">{currentProblem.initialMassGrams} g</strong>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--chem-text-muted)] italic">
                    (Refer to the Data Booklet for any standard constants required.)
                  </p>
                </div>
              )}

              {currentProblem.type === 'properties' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base leading-relaxed font-medium">
                    {currentProblem.q}
                  </p>
                  <div className="p-3 rounded-xl bg-[var(--chem-bg-main)] border border-[var(--chem-border)] text-xs text-[var(--chem-text-muted)] font-medium">
                    Consider relative mass, electric charge (+2, −1, or 0), deflection in electric/magnetic fields, and ionising or penetrating power.
                  </div>
                </div>
              )}

              <div className="flex flex-col items-start pt-1">
                <button
                  type="button"
                  onClick={() => setShowHint((prev) => !prev)}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
                >
                  💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>
                {showHint && (
                  <div className="mt-2.5 w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed">
                    {questionType === 'equation' ? (
                      <>
                        <strong className="font-black text-amber-900">Balancing Rules: </strong>
                        Balance top mass numbers (A) and bottom atomic charges (Z) across the arrow. Use the Data Booklet periodic table to look up the element symbol matching Z (α = ⁴₂He; β⁻ = ⁰₋₁e; β⁺ = ⁰₊₁e; n = ¹₀n).
                      </>
                    ) : questionType === 'halfLife' ? (
                      <>
                        <strong className="font-black text-amber-900">Half-Life Formula: </strong>
                        Find the number of half-lives n = total time ÷ t₁/₂, then divide initial mass by 2ⁿ (or find how many times mass halves to get n, and multiply n × t₁/₂).
                      </>
                    ) : (
                      <>
                        <strong className="font-black text-amber-900">Particle Properties: </strong>
                        Compare mass and charge: α (+2, heavy, paper-stopped), β⁻ (−1, light electron, few mm Al), and γ (0 charge, EM wave, thick lead). Opposites attract in electric fields.
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inputs / Options + Buttons + Feedback + Mark Scheme */}
          <div className="space-y-4">
            <div className="bg-[var(--chem-card-bg)] rounded-2xl border border-[var(--chem-border)] p-4 sm:p-5 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                {currentProblem.type === 'equation' && (
                  <div className="space-y-2">
                    <span className="text-xs font-black text-[var(--chem-text-muted)] block">
                      Complete the Missing Nuclide or Particle
                    </span>
                    <div className="w-full overflow-x-auto py-4 px-3 bg-[var(--chem-bg-main)] rounded-xl border border-[var(--chem-border)] flex justify-center items-center">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-max text-sm sm:text-base">
                        <Nuclide
                          mass={currentProblem.data.parent.mass}
                          atomic={currentProblem.data.parent.atomic}
                          symbol={currentProblem.data.parent.symbol}
                        />

                        {currentProblem.data.mode === 'electronCapture' && (
                          <>
                            <span className="font-bold text-[var(--chem-primary)]">+</span>
                            {currentProblem.missingType === 'particle' ? (
                              <span className="inline-flex items-center gap-1.5 bg-[var(--chem-card-bg)] p-1.5 rounded-lg border border-[var(--chem-primary)] shadow-sm">
                                <span className="inline-flex flex-col text-right gap-1">
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    required
                                    placeholder="A"
                                    value={userInputs.mass || ''}
                                    onChange={(e) => handleInputChange('mass', e.target.value)}
                                    className={noSpinnerInputClass}
                                  />
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    required
                                    placeholder="Z"
                                    value={userInputs.atomic || ''}
                                    onChange={(e) => handleInputChange('atomic', e.target.value)}
                                    className={noSpinnerInputClass}
                                  />
                                </span>
                                <input
                                  type="text"
                                  required
                                  placeholder="e"
                                  value={userInputs.symbol || ''}
                                  onChange={(e) => handleInputChange('symbol', e.target.value)}
                                  className="w-12 h-9 text-center text-sm font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded-lg text-[var(--chem-text)]"
                                />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-mono bg-[var(--chem-bg-main)] px-2 py-1 rounded border border-[var(--chem-border)]">
                                <span className="inline-flex flex-col text-right text-[0.65rem] font-semibold leading-none select-none">
                                  <span>0</span>
                                  <span>-1</span>
                                </span>
                                <span className="font-bold text-sm sm:text-base text-[var(--chem-text)]">e</span>
                              </span>
                            )}
                          </>
                        )}

                        <span className="font-bold text-[var(--chem-primary)] text-lg">→</span>

                        {currentProblem.missingType === 'daughter' ? (
                          <span className="inline-flex items-center gap-1.5 bg-[var(--chem-card-bg)] p-1.5 rounded-lg border border-[var(--chem-primary)] shadow-sm">
                            <span className="inline-flex flex-col text-right gap-1">
                              <input
                                type="number"
                                inputMode="decimal"
                                onWheel={(e) => e.currentTarget.blur()}
                                required
                                placeholder="A"
                                value={userInputs.mass || ''}
                                onChange={(e) => handleInputChange('mass', e.target.value)}
                                className={noSpinnerInputClass}
                              />
                              <input
                                type="number"
                                inputMode="decimal"
                                onWheel={(e) => e.currentTarget.blur()}
                                required
                                placeholder="Z"
                                value={userInputs.atomic || ''}
                                onChange={(e) => handleInputChange('atomic', e.target.value)}
                                className={noSpinnerInputClass}
                              />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="X"
                              value={userInputs.symbol || ''}
                              onChange={(e) => handleInputChange('symbol', e.target.value)}
                              className="w-14 h-9 text-center text-sm font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded-lg text-[var(--chem-text)]"
                            />
                          </span>
                        ) : (
                          <Nuclide
                            mass={currentProblem.data.daughter.mass}
                            atomic={currentProblem.data.daughter.atomic}
                            symbol={currentProblem.data.daughter.symbol}
                          />
                        )}

                        {currentProblem.data.mode !== 'electronCapture' && (
                          <>
                            <span className="font-bold text-[var(--chem-primary)]">+</span>
                            {currentProblem.missingType === 'particle' ? (
                              <span className="inline-flex items-center gap-1.5 bg-[var(--chem-card-bg)] p-1.5 rounded-lg border border-[var(--chem-primary)] shadow-sm">
                                <span className="inline-flex flex-col text-right gap-1">
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    required
                                    placeholder="A"
                                    value={userInputs.mass || ''}
                                    onChange={(e) => handleInputChange('mass', e.target.value)}
                                    className={noSpinnerInputClass}
                                  />
                                  <input
                                    type="number"
                                    inputMode="decimal"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    required
                                    placeholder="Z"
                                    value={userInputs.atomic || ''}
                                    onChange={(e) => handleInputChange('atomic', e.target.value)}
                                    className={noSpinnerInputClass}
                                  />
                                </span>
                                <input
                                  type="text"
                                  required
                                  placeholder="X"
                                  value={userInputs.symbol || ''}
                                  onChange={(e) => handleInputChange('symbol', e.target.value)}
                                  className="w-16 h-9 text-center text-sm font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded-lg text-[var(--chem-text)]"
                                />
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-mono bg-[var(--chem-bg-main)] px-2 py-1 rounded border border-[var(--chem-border)]">
                                <span className="inline-flex flex-col text-right text-[0.65rem] font-semibold leading-none select-none">
                                  <span>{PARTICLES[currentProblem.data.mode].mass}</span>
                                  <span>{PARTICLES[currentProblem.data.mode].atomic}</span>
                                </span>
                                <span className="font-bold text-sm sm:text-base">
                                  {PARTICLES[currentProblem.data.mode].symbol}
                                </span>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentProblem.type === 'halfLife' && (
                  <div className="bg-[var(--chem-bg-main)] p-4 rounded-xl border border-[var(--chem-border)] space-y-3">
                    <label className="block text-xs sm:text-sm font-bold text-[var(--chem-text)]">
                      {currentProblem.subType === 'calcRemaining'
                        ? `Mass remaining after ${currentProblem.totalTimeElapsed} ${currentProblem.timeUnit}:`
                        : `Total time elapsed:`}
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                        placeholder="Enter value"
                        value={userInputs.answer || ''}
                        onChange={(e) => handleInputChange('answer', e.target.value)}
                        className="flex-1 min-w-[8rem] max-w-xs h-10 px-3 text-sm font-mono bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded-lg text-[var(--chem-text)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-semibold text-sm">
                        {currentProblem.subType === 'calcRemaining' ? 'g' : currentProblem.timeUnit}
                      </span>
                    </div>
                  </div>
                )}

                {currentProblem.type === 'properties' && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-black text-[var(--chem-text-muted)] block">
                      Select the Correct Answer
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {currentProblem.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleInputChange('selectedOption', opt)}
                          className={`min-h-[44px] p-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                            userInputs.selectedOption === opt
                              ? 'bg-[var(--chem-primary)] text-white border-[var(--chem-primary)]'
                              : 'bg-[var(--chem-bg-main)] text-[var(--chem-text)] border-[var(--chem-border)] hover:border-[var(--chem-primary)]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="button-group pt-1">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Check Answer
                  </button>
                  <button
                    type="button"
                    onClick={generateProblem}
                    className="btn btn-secondary"
                  >
                    Next Question &rarr;
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMarkScheme(!showMarkScheme)}
                  className="w-full min-h-[38px] px-3 py-2 text-xs font-bold rounded-xl border border-[var(--chem-border)] bg-[var(--chem-bg-main)] text-[var(--chem-text-muted)] hover:border-[var(--chem-primary)] transition-colors cursor-pointer"
                >
                  {showMarkScheme ? 'Hide Mark Scheme' : 'View Mark Scheme'}
                </button>
              </form>
            </div>

            {feedback && (
              <div
                className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left text-xs sm:text-sm leading-relaxed ${
                  feedback.status === 'success'
                    ? 'feedback-success'
                    : feedback.status === 'warning'
                    ? 'bg-amber-50 border border-amber-200 text-amber-900'
                    : 'feedback-error'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span>{feedback.status === 'success' ? '✅' : feedback.status === 'warning' ? '⚠️' : '❌'}</span>
                  <p className="font-semibold">{feedback.message}</p>
                </div>
                {feedback.status === 'success' && (
                  <button
                    type="button"
                    onClick={generateProblem}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                  >
                    Next Question &rarr;
                  </button>
                )}
              </div>
            )}

            {showMarkScheme && (
              <div className="p-4 bg-[var(--chem-card-bg)] border border-[var(--chem-border)] rounded-2xl space-y-2 text-xs sm:text-sm shadow-sm">
                <h4 className="font-bold text-[var(--chem-primary)] tracking-wider text-[0.7rem]">
                  WJEC Examiner Mark Scheme Guidance
                </h4>
                {currentProblem.type === 'equation' && (
                  <ul className="list-disc pl-5 space-y-1 text-[var(--chem-text)]">
                    <li>
                      <strong>[1 mark]</strong> Conservation of mass number (nucleon balance): {currentProblem.missingType === 'daughter' ? `A = ${currentProblem.data.daughter.mass}` : `A = ${PARTICLES[currentProblem.data.mode].mass}`}.
                    </li>
                    <li>
                      <strong>[1 mark]</strong> Conservation of atomic charge (Z = {currentProblem.missingType === 'daughter' ? currentProblem.data.daughter.atomic : PARTICLES[currentProblem.data.mode].atomic}) and correct chemical/particle symbol ({currentProblem.missingType === 'daughter' ? currentProblem.data.daughter.symbol : PARTICLES[currentProblem.data.mode].symbol}).
                    </li>
                  </ul>
                )}
                {currentProblem.type === 'halfLife' && (
                  <ul className="list-disc pl-5 space-y-1 text-[var(--chem-text)]">
                    <li><strong>[1 mark]</strong> Calculating number of half-lives elapsed: {currentProblem.totalTimeElapsed} ÷ {currentProblem.unitValue} = {currentProblem.halfLivesCount} half-lives.</li>
                    <li><strong>[1 mark]</strong> Applying successive halving step: {currentProblem.initialMassGrams} g ÷ 2<sup>{currentProblem.halfLivesCount}</sup>.</li>
                    <li><strong>[1 mark]</strong> Final value = {renderStandardForm(currentProblem.remainingMassGrams, 3)} g.</li>
                  </ul>
                )}
                {currentProblem.type === 'properties' && (
                  <ul className="list-disc pl-5 space-y-1 text-[var(--chem-text)]">
                    <li><strong>[1 mark]</strong> Correct identification: {currentProblem.answer}.</li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
