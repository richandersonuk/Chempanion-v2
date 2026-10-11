import React, { useState, useEffect } from 'react';

/**
 * CHEMpanion - Nuclear Chemistry & Radioactivity Applet
 * Specification: WJEC A-Level Chemistry Unit 1.2 (Basic Ideas About Atoms & Radioactivity)
 */

// Helper: Format numbers in standard form without computer 'e' notation
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

// Component: Responsive Nuclide Notation Stack
const Nuclide = ({ mass, atomic, symbol }) => (
  <span className="inline-flex items-center gap-1 font-mono whitespace-nowrap bg-[var(--chem-bg-main)] px-2 py-1 rounded border border-[var(--chem-border)] shadow-xs">
    <span className="inline-flex flex-col text-right text-[0.65rem] sm:text-xs font-semibold leading-none select-none tracking-tighter">
      <span>{mass !== undefined ? mass : '?'}</span>
      <span>{atomic !== undefined ? atomic : '?'}</span>
    </span>
    <span className="font-bold text-sm sm:text-base text-[var(--chem-text)] tracking-normal">
      {symbol || '?'}
    </span>
  </span>
);

// WJEC Particle Definitions (Alpha, Beta-Minus, Positron, Electron Capture)
const PARTICLES = {
  alpha: { name: 'Alpha particle', symbol: 'He', mass: 4, atomic: 2, greek: 'α' },
  betaMinus: { name: 'Beta-minus particle', symbol: 'e', mass: 0, atomic: -1, greek: 'β⁻' },
  positron: { name: 'Positron', symbol: 'e', mass: 0, atomic: 1, greek: 'β⁺' },
  electronCapture: { name: 'Captured electron', symbol: 'e', mass: 0, atomic: -1, greek: 'e⁻' }
};

// WJEC-Specific Radioisotope & Nuclear Reaction Dataset
const DECAY_DATASETS = [
  { parent: { name: 'Uranium-238', symbol: 'U', mass: 238, atomic: 92 }, mode: 'alpha', daughter: { symbol: 'Th', mass: 234, atomic: 90 } },
  { parent: { name: 'Radium-226', symbol: 'Ra', mass: 226, atomic: 88 }, mode: 'alpha', daughter: { symbol: 'Rn', mass: 222, atomic: 86 } },
  { parent: { name: 'Polonium-210', symbol: 'Po', mass: 210, atomic: 84 }, mode: 'alpha', daughter: { symbol: 'Pb', mass: 206, atomic: 82 } },
  { parent: { name: 'Carbon-14', symbol: 'C', mass: 14, atomic: 6 }, mode: 'betaMinus', daughter: { symbol: 'N', mass: 14, atomic: 7 } },
  { parent: { name: 'Iodine-131', symbol: 'I', mass: 131, atomic: 53 }, mode: 'betaMinus', daughter: { symbol: 'Xe', mass: 131, atomic: 54 } },
  { parent: { name: 'Cobalt-60', symbol: 'Co', mass: 60, atomic: 27 }, mode: 'betaMinus', daughter: { symbol: 'Ni', mass: 60, atomic: 28 } },
  { parent: { name: 'Fluorine-18', symbol: 'F', mass: 18, atomic: 9 }, mode: 'positron', daughter: { symbol: 'O', mass: 18, atomic: 8 } },
  { parent: { name: 'Carbon-11', symbol: 'C', mass: 11, atomic: 6 }, mode: 'positron', daughter: { symbol: 'B', mass: 11, atomic: 5 } },
  { parent: { name: 'Krypton-81', symbol: 'Kr', mass: 81, atomic: 36 }, mode: 'electronCapture', daughter: { symbol: 'Br', mass: 81, atomic: 35 } },
  { parent: { name: 'Iron-55', symbol: 'Fe', mass: 55, atomic: 26 }, mode: 'electronCapture', daughter: { symbol: 'Mn', mass: 55, atomic: 25 } }
];

// WJEC Half-life Radioisotope Scenarios
const ISOTOPE_HALF_LIVES = [
  { name: 'Iodine-131', symbol: 'I', mass: 131, halfLifeDays: 8, use: 'medical treatment of thyroid cancer' },
  { name: 'Technetium-99m', symbol: 'Tc', mass: 99, halfLifeHours: 6, use: 'medical imaging tracer' },
  { name: 'Carbon-14', symbol: 'C', mass: 14, halfLifeYears: 5730, use: 'radiocarbon dating of biological remains' },
  { name: 'Radon-222', symbol: 'Rn', mass: 222, halfLifeDays: 3.8, use: 'evaluating geological radiation hazards' },
  { name: 'Cobalt-60', symbol: 'Co', mass: 60, halfLifeYears: 5.3, use: 'radiotherapy for cancer treatment' }
];

export default function NuclearChemistry() {
  const [questionType, setQuestionType] = useState('equation'); // 'equation', 'halfLife', 'properties'
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [showMarkScheme, setShowMarkScheme] = useState(false);

  const generateProblem = () => {
    setFeedback(null);
    setShowMarkScheme(false);
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
      const halfLivesCount = Math.floor(Math.random() * 4) + 2; // 2 to 5 half-lives
      const initialMassGrams = (Math.floor(Math.random() * 8) + 2) * 10; // e.g. 20g, 30g, ... 90g
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
      const propertyQuestions = [
        {
          q: 'Identify the type of radiation that has the highest ionising power and is stopped by a single sheet of paper.',
          answer: 'alpha',
          options: ['alpha', 'beta', 'gamma'],
          explanation: (
            <>
              Alpha particles (He<sup>2+</sup>) have a high charge (+2) and relatively large mass, making them strongly ionising but easily stopped by paper or skin.
            </>
          )
        },
        {
          q: 'In an electric field between a positive top plate and a negative bottom plate, state which radiation is deflected towards the positive plate.',
          answer: 'beta',
          options: ['alpha', 'beta', 'gamma'],
          explanation: (
            <>
              Beta-minus particles (e<sup>-</sup>) carry a negative charge (-1) and are attracted towards the positive plate.
            </>
          )
        },
        {
          q: 'State which shielding material is required to significantly reduce the intensity of high-energy gamma radiation.',
          answer: 'lead',
          options: ['paper', 'aluminium', 'lead'],
          explanation: 'Gamma radiation is high-energy electromagnetic radiation with very high penetrating power, requiring thick lead or dense concrete to absorb it.'
        }
      ];

      const selected = propertyQuestions[Math.floor(Math.random() * propertyQuestions.length)];
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      } else {
        const errors = [];
        if (!massCorrect) errors.push('mass number (A)');
        if (!atomicCorrect) errors.push('atomic number (Z)');
        if (!symbolCorrect) errors.push('chemical/particle symbol');

        setFeedback({
          status: 'error',
          message: `Incorrect. Check your ${errors.join(', ')}. ${explanation}`
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
          : <>Incorrect. {currentProblem.explanation}</>
      });
    }
  };

  // Input styling to remove standard number spinners across browsers
  const noSpinnerInputClass =
    "w-12 h-6 text-center text-xs font-mono font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 bg-[var(--chem-bg-main)] text-[var(--chem-text)] font-sans transition-colors duration-200">
      {/* Header */}
      <header className="mb-6 border-b border-[var(--chem-border)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--chem-primary)] flex items-center gap-2">
          <span>⚛️</span> Nuclear Chemistry & Radioactivity
        </h1>
        <p className="text-xs sm:text-sm text-[var(--chem-text-muted)] mt-1">
          WJEC A-Level Chemistry • Unit 1.2
        </p>
      </header>

      {/* Module Topic Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'equation', label: 'Nuclear Decay Equations' },
          { id: 'halfLife', label: 'Half-Life Calculations' },
          { id: 'properties', label: 'Radiation & Field Properties' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setQuestionType(tab.id)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
              questionType === tab.id
                ? 'bg-[var(--chem-card-bg)] border-[var(--chem-primary)] text-[var(--chem-primary)] shadow-xs'
                : 'bg-[var(--chem-bg-main)] border-[var(--chem-border)] text-[var(--chem-text-muted)] hover:border-[var(--chem-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Question Card Display */}
      {currentProblem && (
        <div className="bg-[var(--chem-card-bg)] rounded-xl border border-[var(--chem-border)] p-4 sm:p-6 shadow-sm mb-6">
          {/* WJEC Past Paper Style Header */}
          <div className="flex justify-between items-center border-b border-[var(--chem-border)] pb-3 mb-4 text-xs font-mono text-[var(--chem-text-muted)]">
            <span>WJEC Unit 1.2 • Radioactivity</span>
            <span className="font-semibold text-[var(--chem-accent)]">
              [{currentProblem.marks} mark{currentProblem.marks > 1 ? 's' : ''}]
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TOPIC 1: NUCLEAR DECAY EQUATIONS */}
            {currentProblem.type === 'equation' && (
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed">
                  {currentProblem.data.mode === 'electronCapture' ? (
                    <>
                      The unstable nucleus <strong>{currentProblem.data.parent.name}</strong> undergoes <strong>electron capture</strong>. Complete the missing values in the nuclear equation below:
                    </>
                  ) : (
                    <>
                      The radioisotope <strong>{currentProblem.data.parent.name}</strong> undergoes decay via <strong>{PARTICLES[currentProblem.data.mode].name}</strong> emission. Complete the missing values in the nuclear equation:
                    </>
                  )}
                </p>

                {/* Mobile-Resilient Equation Display */}
                <div className="w-full overflow-x-auto my-4 py-4 px-3 bg-[var(--chem-bg-main)] rounded-lg border border-[var(--chem-border)] flex justify-center items-center">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-max text-sm sm:text-base">
                    {/* Parent Nuclide */}
                    <Nuclide
                      mass={currentProblem.data.parent.mass}
                      atomic={currentProblem.data.parent.atomic}
                      symbol={currentProblem.data.parent.symbol}
                    />

                    {/* Electron Capture Reactant Section */}
                    {currentProblem.data.mode === 'electronCapture' && (
                      <>
                        <span className="font-bold text-[var(--chem-primary)]">+</span>
                        {currentProblem.missingType === 'particle' ? (
                          <span className="inline-flex items-center gap-1 bg-[var(--chem-card-bg)] p-1 rounded border border-[var(--chem-primary)] shadow-xs">
                            <span className="inline-flex flex-col text-right gap-0.5">
                              <input
                                type="number"
                                required
                                placeholder="A"
                                value={userInputs.mass || ''}
                                onChange={(e) => handleInputChange('mass', e.target.value)}
                                className={noSpinnerInputClass}
                              />
                              <input
                                type="number"
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
                              className="w-10 h-8 text-center text-sm font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
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

                    {/* Daughter Nuclide Section */}
                    {currentProblem.missingType === 'daughter' ? (
                      <span className="inline-flex items-center gap-1 bg-[var(--chem-card-bg)] p-1 rounded border border-[var(--chem-primary)] shadow-xs">
                        <span className="inline-flex flex-col text-right gap-0.5">
                          <input
                            type="number"
                            required
                            placeholder="A"
                            value={userInputs.mass || ''}
                            onChange={(e) => handleInputChange('mass', e.target.value)}
                            className={noSpinnerInputClass}
                          />
                          <input
                            type="number"
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
                          className="w-14 h-8 text-center text-sm font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                        />
                      </span>
                    ) : (
                      <Nuclide
                        mass={currentProblem.data.daughter.mass}
                        atomic={currentProblem.data.daughter.atomic}
                        symbol={currentProblem.data.daughter.symbol}
                      />
                    )}

                    {/* Emitted Particle Product Section (Non-Electron Capture) */}
                    {currentProblem.data.mode !== 'electronCapture' && (
                      <>
                        <span className="font-bold text-[var(--chem-primary)]">+</span>
                        {currentProblem.missingType === 'particle' ? (
                          <span className="inline-flex items-center gap-1 bg-[var(--chem-card-bg)] p-1 rounded border border-[var(--chem-primary)] shadow-xs">
                            <span className="inline-flex flex-col text-right gap-0.5">
                              <input
                                type="number"
                                required
                                placeholder="A"
                                value={userInputs.mass || ''}
                                onChange={(e) => handleInputChange('mass', e.target.value)}
                                className={noSpinnerInputClass}
                              />
                              <input
                                type="number"
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
                              className="w-16 h-8 text-center text-sm font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
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

            {/* TOPIC 2: HALF-LIFE CALCULATIONS */}
            {currentProblem.type === 'halfLife' && (
              <div className="space-y-4">
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

                <p className="text-xs text-[var(--chem-text-muted)] italic">
                  (Refer to the Data Booklet for any standard constants required.)
                </p>

                <div className="bg-[var(--chem-bg-main)] p-4 rounded-lg border border-[var(--chem-border)] space-y-3">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--chem-text)]">
                    {currentProblem.subType === 'calcRemaining'
                      ? `Mass remaining after ${currentProblem.totalTimeElapsed} ${currentProblem.timeUnit}:`
                      : `Total time elapsed:`}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="Enter value"
                      value={userInputs.answer || ''}
                      onChange={(e) => handleInputChange('answer', e.target.value)}
                      className="w-full max-w-xs h-10 px-3 text-sm font-mono bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="font-semibold text-sm">
                      {currentProblem.subType === 'calcRemaining' ? 'g' : currentProblem.timeUnit}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TOPIC 3: RADIATION & FIELD PROPERTIES */}
            {currentProblem.type === 'properties' && (
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  {currentProblem.q}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {currentProblem.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleInputChange('selectedOption', opt)}
                      className={`p-3 text-sm font-semibold rounded-lg border capitalize transition-all ${
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[var(--chem-primary)] hover:bg-[var(--chem-primary-hover)] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-xs"
              >
                Check Answer
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

          {/* Answer Diagnostic Feedback Box */}
          {feedback && (
            <div
              className={`mt-6 p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                feedback.status === 'success'
                  ? 'bg-[var(--chem-bg-main)] border-[var(--chem-success)] text-[var(--chem-text)]'
                  : feedback.status === 'warning'
                  ? 'bg-[var(--chem-bg-main)] border-[var(--chem-warning)] text-[var(--chem-text)]'
                  : 'bg-[var(--chem-bg-main)] border-[var(--chem-error)] text-[var(--chem-text)]'
              }`}
            >
              <div className="flex items-start gap-2">
                <span>{feedback.status === 'success' ? '✅' : feedback.status === 'warning' ? '⚠️' : '❌'}</span>
                <div>
                  <p className="font-semibold">{feedback.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* WJEC Mark Scheme & Examiner Guidance Emulation */}
          {showMarkScheme && (
            <div className="mt-6 p-4 bg-[var(--chem-bg-main)] border border-[var(--chem-border)] rounded-lg space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-[var(--chem-primary)] uppercase tracking-wider text-[0.7rem]">
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
      )}
    </div>
  );
}