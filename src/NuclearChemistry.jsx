import React, { useState, useEffect, useId } from 'react';

/**
 * CHEMpanion - Nuclear Chemistry Applet (WJEC Unit 1)
 * Features:
 * - Dynamic Mobile Resizing & Overflow Prevention for Nuclides
 * - Correct Gamma Radiation Handling (Metastable/Isomeric De-excitation)
 * - WJEC Exam Style Phrasing & Mark Schemes
 * - Precision & Sig Fig Answer Checking
 * - Dynamic Inline SVG Radiation Deflection / Decay Visualizer
 */

// Helper: Format numbers in standard form using JSX tags (No 'e' notation)
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
const Nuclide = ({ mass, atomic, symbol, metastable = false }) => (
  <span className="inline-flex items-center gap-1 font-mono whitespace-nowrap bg-[var(--chem-bg-main)] px-1.5 py-0.5 rounded border border-[var(--chem-border)] shadow-xs">
    <span className="inline-flex flex-col text-right text-[0.65rem] sm:text-xs font-semibold leading-none select-none tracking-tighter">
      <span>{mass !== undefined ? mass : '?'}</span>
      <span>{atomic !== undefined ? atomic : '?'}</span>
    </span>
    <span className="font-bold text-sm sm:text-base text-[var(--chem-text)] tracking-normal">
      {symbol || '?'}{metastable ? 'm' : ''}
    </span>
  </span>
);

// Particle Data for Equation Generation
const PARTICLES = {
  alpha: { name: 'Alpha particle', symbol: 'He', mass: 4, atomic: 2, greek: 'α' },
  betaMinus: { name: 'Beta-minus particle', symbol: 'e', mass: 0, atomic: -1, greek: 'β⁻' },
  positron: { name: 'Positron (Beta-plus)', symbol: 'e', mass: 0, atomic: 1, greek: 'β⁺' },
  neutron: { name: 'Neutron', symbol: 'n', mass: 1, atomic: 0, greek: 'n' },
  proton: { name: 'Proton', symbol: 'p', mass: 1, atomic: 1, greek: 'p' },
  gamma: { name: 'Gamma photon', symbol: 'γ', mass: 0, atomic: 0, greek: 'γ' }
};

// Sample Isotope Dataset for Realistic WJEC Exam Questions
const DECAY_DATASETS = [
  { parent: { name: 'Uranium-238', symbol: 'U', mass: 238, atomic: 92 }, mode: 'alpha', daughter: { symbol: 'Th', mass: 234, atomic: 90 } },
  { parent: { name: 'Radium-226', symbol: 'Ra', mass: 226, atomic: 88 }, mode: 'alpha', daughter: { symbol: 'Rn', mass: 222, atomic: 86 } },
  { parent: { name: 'Carbon-14', symbol: 'C', mass: 14, atomic: 6 }, mode: 'betaMinus', daughter: { symbol: 'N', mass: 14, atomic: 7 } },
  { parent: { name: 'Iodine-131', symbol: 'I', mass: 131, atomic: 53 }, mode: 'betaMinus', daughter: { symbol: 'Xe', mass: 131, atomic: 54 } },
  { parent: { name: 'Fluorine-18', symbol: 'F', mass: 18, atomic: 9 }, mode: 'positron', daughter: { symbol: 'O', mass: 18, atomic: 8 } },
  { parent: { name: 'Technetium-99m', symbol: 'Tc', mass: 99, atomic: 43, metastable: true }, mode: 'gamma', daughter: { symbol: 'Tc', mass: 99, atomic: 43, metastable: false } },
  { parent: { name: 'Cobalt-60m', symbol: 'Co', mass: 60, atomic: 27, metastable: true }, mode: 'gamma', daughter: { symbol: 'Co', mass: 60, atomic: 27, metastable: false } }
];

export default function NuclearChemistry() {
  const [mode, setMode] = useState('exam'); // 'skill' or 'exam'
  const [questionType, setQuestionType] = useState('equation'); // 'equation', 'massDefect', 'halfLife'
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [showMarkScheme, setShowMarkScheme] = useState(false);

  // Generate dynamic, randomized problem
  const generateProblem = () => {
    setFeedback(null);
    setShowMarkScheme(false);
    setUserInputs({});

    if (questionType === 'equation') {
      const target = DECAY_DATASETS[Math.floor(Math.random() * DECAY_DATASETS.length)];
      const missingTarget = ['daughterMass', 'daughterAtomic', 'daughterSymbol', 'particle'][Math.floor(Math.random() * 4)];
      
      setCurrentProblem({
        type: 'equation',
        data: target,
        missing: missingTarget,
        marks: 2
      });
    } else if (questionType === 'massDefect') {
      // Binding Energy & Mass Defect (WJEC Unit 1.1)
      const numProtons = Math.floor(Math.random() * 6) + 2; // Helium to Nitrogen
      const numNeutrons = numProtons + (Math.random() > 0.5 ? 1 : 0);
      const massNumber = numProtons + numNeutrons;
      
      // Masses in u
      const protonMassU = 1.00728;
      const neutronMassU = 1.00866;
      const bindingEnergyPerNucleonMeV = 6.5 + Math.random() * 1.5; // realistic MeV
      const totalBindingEnergyMeV = bindingEnergyPerNucleonMeV * massNumber;
      const totalBindingEnergyJoules = totalBindingEnergyMeV * 1.60218e-13;
      const massDefectKg = totalBindingEnergyJoules / Math.pow(2.99792e8, 2);
      const massDefectU = massDefectKg / 1.66054e-27;
      const actualMassU = (numProtons * protonMassU) + (numNeutrons * neutronMassU) - massDefectU;

      const elementSymbols = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O'];
      
      setCurrentProblem({
        type: 'massDefect',
        protons: numProtons,
        neutrons: numNeutrons,
        massNumber,
        symbol: elementSymbols[numProtons] || 'X',
        actualMassU: actualMassU.toFixed(5),
        expectedDefectKg: massDefectKg,
        expectedEnergyJ: totalBindingEnergyJoules,
        expectedEnergyMeV: totalBindingEnergyMeV,
        marks: 3
      });
    } else if (questionType === 'halfLife') {
      // Radioactive Half-Life & Decay Constant
      const halfLifeDays = Math.floor(Math.random() * 20) + 2;
      const initialMass = (Math.floor(Math.random() * 8) + 2) * 10; // e.g. 20g - 90g
      const timeElapsedDays = halfLifeDays * (1.5 + Math.random() * 2);
      const lambda = Math.LN2 / halfLifeDays;
      const remainingMass = initialMass * Math.exp(-lambda * timeElapsedDays);

      setCurrentProblem({
        type: 'halfLife',
        isotope: `Nuclide-${Math.floor(Math.random() * 50) + 100}`,
        halfLifeDays: halfLifeDays.toFixed(1),
        initialMass,
        timeElapsedDays: timeElapsedDays.toFixed(1),
        expectedLambda: lambda,
        expectedRemainingMass: remainingMass,
        marks: 3
      });
    }
  };

  useEffect(() => {
    generateProblem();
  }, [questionType]);

  const handleInputChange = (key, value) => {
    setUserInputs(prev => ({ ...prev, [key]: value }));
  };

  // Validation Logic with Precision / Sig Fig Diagnostic Feedback
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProblem) return;

    if (currentProblem.type === 'equation') {
      const p = currentProblem.data;
      let isCorrect = false;
      let explanation = '';

      if (currentProblem.missing === 'daughterMass') {
        isCorrect = parseInt(userInputs.value, 10) === p.daughter.mass;
        explanation = `The total nucleon mass must balance. ${p.parent.mass} = ${p.daughter.mass} + ${PARTICLES[p.mode].mass}`;
      } else if (currentProblem.missing === 'daughterAtomic') {
        isCorrect = parseInt(userInputs.value, 10) === p.daughter.atomic;
        explanation = `The total nuclear charge (atomic number) must balance. ${p.parent.atomic} = ${p.daughter.atomic} + (${PARTICLES[p.mode].atomic})`;
      } else if (currentProblem.missing === 'daughterSymbol') {
        isCorrect = userInputs.value?.trim().toLowerCase() === p.daughter.symbol.toLowerCase();
        explanation = `Element symbol for atomic number ${p.daughter.atomic} is ${p.daughter.symbol}.`;
      } else if (currentProblem.missing === 'particle') {
        const val = userInputs.value?.trim().toLowerCase();
        isCorrect = val === p.mode.toLowerCase() || val === PARTICLES[p.mode].symbol.toLowerCase() || val === PARTICLES[p.mode].greek.toLowerCase();
        explanation = `The emitted radiation is ${PARTICLES[p.mode].name} (${PARTICLES[p.mode].greek}).`;
      }

      setFeedback({
        status: isCorrect ? 'success' : 'error',
        message: isCorrect
          ? 'Correct! Conservation of nucleon number and atomic number satisfied.'
          : `Incorrect. ${explanation}`
      });
    } else if (currentProblem.type === 'massDefect') {
      const userVal = parseFloat(userInputs.energyJ);
      if (isNaN(userVal)) {
        setFeedback({ status: 'error', message: 'Please enter a valid numerical energy value.' });
        return;
      }

      const expected = currentProblem.expectedEnergyJ;
      const relDiff = Math.abs((userVal - expected) / expected);

      if (relDiff < 0.02) {
        setFeedback({
          status: 'success',
          message: 'Correct! Excellent calculation of mass defect and nuclear binding energy.'
        });
      } else if (relDiff < 0.15) {
        setFeedback({
          status: 'warning',
          message: 'Close! Your chemistry logic is correct, but check your significant figures or check that you converted mass defect from atomic mass units (u) into kg before applying E = Δmc².'
        });
      } else {
        setFeedback({
          status: 'error',
          message: 'Incorrect calculation. Step 1: Calculate mass of components. Step 2: Subtract actual isotopic mass to find Δm. Step 3: Convert Δm to kg and apply E = Δmc².'
        });
      }
    } else if (currentProblem.type === 'halfLife') {
      const userVal = parseFloat(userInputs.remainingMass);
      if (isNaN(userVal)) {
        setFeedback({ status: 'error', message: 'Please enter a valid numerical mass value.' });
        return;
      }

      const expected = currentProblem.expectedRemainingMass;
      const relDiff = Math.abs((userVal - expected) / expected);

      if (relDiff < 0.03) {
        setFeedback({
          status: 'success',
          message: 'Correct! Accurately evaluated decay constant λ and remaining radioactive mass N = N₀e^(-λt).'
        });
      } else if (relDiff < 0.12) {
        setFeedback({
          status: 'warning',
          message: 'Near miss! Double check your intermediate rounding or significant figures used for the decay constant λ.'
        });
      } else {
        setFeedback({
          status: 'error',
          message: 'Incorrect. Remember to calculate λ = ln(2) / t₁/₂ first, then calculate N = N₀e^(-λt).'
        });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 bg-[var(--chem-bg-main)] text-[var(--chem-text)] font-sans transition-colors duration-200">
      
      {/* Header & Pedagogy Selector */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--chem-border)] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--chem-primary)] flex items-center gap-2">
            <span>⚛️</span> Nuclear Chemistry & Radioactivity
          </h1>
          <p className="text-xs sm:text-sm text-[var(--chem-text-muted)] mt-1">
            WJEC A-Level Chemistry • Unit 1.1 / 1.2
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-[var(--chem-card-bg)] p-1 rounded-lg border border-[var(--chem-border)]">
          <button
            type="button"
            onClick={() => setMode('exam')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'exam'
                ? 'bg-[var(--chem-primary)] text-white shadow-xs'
                : 'text-[var(--chem-text-muted)] hover:text-[var(--chem-text)]'
            }`}
          >
            Exam Practice
          </button>
          <button
            type="button"
            onClick={() => setMode('skill')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === 'skill'
                ? 'bg-[var(--chem-primary)] text-white shadow-xs'
                : 'text-[var(--chem-text-muted)] hover:text-[var(--chem-text)]'
            }`}
          >
            Skill Builder
          </button>
        </div>
      </header>

      {/* Question Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'equation', label: 'Decay Equations' },
          { id: 'massDefect', label: 'Mass Defect & Binding Energy' },
          { id: 'halfLife', label: 'Half-Life & Kinetics' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setQuestionType(tab.id)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
              questionType === tab.id
                ? 'bg-[var(--chem-card-bg)] border-[var(--chem-primary)] text-[var(--chem-primary)] shadow-xs'
                : 'bg-[var(--chem-bg-main)] border-[var(--chem-border)] text-[var(--chem-text-muted)] hover:border-[var(--chem-primary-hover)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Problem Display Card */}
      {currentProblem && (
        <div className="bg-[var(--chem-card-bg)] rounded-xl border border-[var(--chem-border)] p-4 sm:p-6 shadow-sm mb-6">
          
          {/* WJEC Exam Header Line */}
          <div className="flex justify-between items-center border-b border-[var(--chem-border)] pb-3 mb-4 text-xs font-mono text-[var(--chem-text-muted)]">
            <span>Q{Math.floor(Math.random() * 5) + 1} [WJEC Unit 1]</span>
            <span className="font-semibold text-[var(--chem-accent)]">[{currentProblem.marks} marks]</span>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TYPE 1: NUCLEAR DECAY EQUATIONS */}
            {currentProblem.type === 'equation' && (
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed">
                  {currentProblem.data.mode === 'gamma' ? (
                    <>
                      Metastable <strong>{currentProblem.data.parent.name}</strong> undergoes de-excitation with the emission of a high-energy gamma ray. Complete the missing component of the nuclear equation below:
                    </>
                  ) : (
                    <>
                      The radioisotope <strong>{currentProblem.data.parent.name}</strong> decays via <strong>{PARTICLES[currentProblem.data.mode].name}</strong> emission. Complete the nuclear decay equation:
                    </>
                  )}
                </p>

                {/* Mobile-Resilient Horizontally Scrollable Equation Box */}
                <div className="w-full overflow-x-auto my-4 py-3 px-2 sm:px-4 bg-[var(--chem-bg-main)] rounded-lg border border-[var(--chem-border)] flex justify-center items-center">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-max text-sm sm:text-base">
                    
                    {/* Parent Nuclide */}
                    <Nuclide
                      mass={currentProblem.data.parent.mass}
                      atomic={currentProblem.data.parent.atomic}
                      symbol={currentProblem.data.parent.symbol}
                      metastable={currentProblem.data.parent.metastable}
                    />

                    <span className="font-bold text-[var(--chem-primary)] text-lg">→</span>

                    {/* Daughter Nuclide */}
                    <span className="inline-flex items-center gap-1">
                      {currentProblem.missing === 'daughterMass' || currentProblem.missing === 'daughterAtomic' || currentProblem.missing === 'daughterSymbol' ? (
                        <span className="inline-flex items-center gap-1 bg-[var(--chem-card-bg)] p-1 rounded border border-[var(--chem-primary)]">
                          <span className="inline-flex flex-col text-right gap-0.5">
                            {currentProblem.missing === 'daughterMass' ? (
                              <input
                                type="number"
                                required
                                placeholder="A"
                                value={userInputs.value || ''}
                                onChange={(e) => handleInputChange('value', e.target.value)}
                                className="w-12 h-6 text-center text-xs font-mono font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                              />
                            ) : (
                              <span className="text-xs font-mono font-semibold px-1">{currentProblem.data.daughter.mass}</span>
                            )}

                            {currentProblem.missing === 'daughterAtomic' ? (
                              <input
                                type="number"
                                required
                                placeholder="Z"
                                value={userInputs.value || ''}
                                onChange={(e) => handleInputChange('value', e.target.value)}
                                className="w-12 h-6 text-center text-xs font-mono font-bold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                              />
                            ) : (
                              <span className="text-xs font-mono font-semibold px-1">{currentProblem.data.daughter.atomic}</span>
                            )}
                          </span>

                          {currentProblem.missing === 'daughterSymbol' ? (
                            <input
                              type="text"
                              required
                              placeholder="X"
                              value={userInputs.value || ''}
                              onChange={(e) => handleInputChange('value', e.target.value)}
                              className="w-10 h-8 text-center text-sm font-bold uppercase bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                            />
                          ) : (
                            <span className="font-bold text-base px-1">{currentProblem.data.daughter.symbol}{currentProblem.data.daughter.metastable ? 'm' : ''}</span>
                          )}
                        </span>
                      ) : (
                        <Nuclide
                          mass={currentProblem.data.daughter.mass}
                          atomic={currentProblem.data.daughter.atomic}
                          symbol={currentProblem.data.daughter.symbol}
                          metastable={currentProblem.data.daughter.metastable}
                        />
                      )}
                    </span>

                    <span className="font-bold text-[var(--chem-primary)]">+</span>

                    {/* Emitted Particle / Gamma Photon */}
                    {currentProblem.missing === 'particle' ? (
                      <input
                        type="text"
                        required
                        placeholder="Particle/γ"
                        value={userInputs.value || ''}
                        onChange={(e) => handleInputChange('value', e.target.value)}
                        className="w-28 h-9 text-center text-xs sm:text-sm font-semibold bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                      />
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono bg-[var(--chem-bg-main)] px-2 py-1 rounded border border-[var(--chem-border)]">
                        <span className="inline-flex flex-col text-right text-[0.65rem] font-semibold leading-none select-none">
                          <span>{PARTICLES[currentProblem.data.mode].mass}</span>
                          <span>{PARTICLES[currentProblem.data.mode].atomic}</span>
                        </span>
                        <span className="font-bold text-sm sm:text-base">{PARTICLES[currentProblem.data.mode].symbol}</span>
                      </span>
                    )}

                  </div>
                </div>

                {currentProblem.data.mode === 'gamma' && (
                  <p className="text-xs text-[var(--chem-text-muted)] italic bg-[var(--chem-bg-main)] p-2 rounded border border-[var(--chem-border)]">
                    Note: Gamma decay represents an isomeric transition (loss of nuclear excitation energy). The mass number (A) and atomic number (Z) remain unchanged.
                  </p>
                )}
              </div>
            )}

            {/* TYPE 2: MASS DEFECT & BINDING ENERGY */}
            {currentProblem.type === 'massDefect' && (
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed">
                  A nucleus of <strong>{currentProblem.symbol}-{currentProblem.massNumber}</strong> contains {currentProblem.protons} protons and {currentProblem.neutrons} neutrons. Its experimental isotopic mass is <strong>{currentProblem.actualMassU} u</strong>.
                </p>

                <p className="text-xs text-[var(--chem-text-muted)] italic">
                  (Refer to the Data Booklet for standard constants required, including proton mass, neutron mass, atomic mass unit conversion, and the speed of light c.)
                </p>

                <div className="bg-[var(--chem-bg-main)] p-4 rounded-lg border border-[var(--chem-border)] space-y-3">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--chem-text)]">
                    Calculate the total nuclear binding energy of this nucleus in Joules (J):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4.52e-12 or 4.52 x 10^-12"
                      value={userInputs.energyJ || ''}
                      onChange={(e) => handleInputChange('energyJ', e.target.value)}
                      className="w-full max-w-xs h-10 px-3 text-sm font-mono bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                    />
                    <span className="font-semibold text-sm">J</span>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 3: HALF-LIFE & KINETICS */}
            {currentProblem.type === 'halfLife' && (
              <div className="space-y-4">
                <p className="text-sm sm:text-base leading-relaxed">
                  A sample of <strong>{currentProblem.isotope}</strong> has a half-life of <strong>{currentProblem.halfLifeDays} days</strong>.
                  If the initial mass of the sample is <strong>{currentProblem.initialMass} g</strong>, calculate the mass remaining after <strong>{currentProblem.timeElapsedDays} days</strong>.
                </p>

                <p className="text-xs text-[var(--chem-text-muted)] italic">
                  (Refer to the Data Booklet for first-order decay constant formulae if required.)
                </p>

                <div className="bg-[var(--chem-bg-main)] p-4 rounded-lg border border-[var(--chem-border)] space-y-3">
                  <label className="block text-xs sm:text-sm font-medium text-[var(--chem-text)]">
                    Mass remaining after {currentProblem.timeElapsedDays} days:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="Remaining mass"
                      value={userInputs.remainingMass || ''}
                      onChange={(e) => handleInputChange('remainingMass', e.target.value)}
                      className="w-full max-w-xs h-10 px-3 text-sm font-mono bg-[var(--chem-input-bg)] border border-[var(--chem-input-border)] rounded text-[var(--chem-text)]"
                    />
                    <span className="font-semibold text-sm">g</span>
                  </div>
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

          {/* Feedback Section */}
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

          {/* WJEC Mark Scheme Emulation Dropdown */}
          {showMarkScheme && (
            <div className="mt-6 p-4 bg-[var(--chem-bg-main)] border border-[var(--chem-border)] rounded-lg space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-[var(--chem-primary)] uppercase tracking-wider text-[0.7rem]">
                WJEC Examiner Mark Scheme & Guidance
              </h4>
              {currentProblem.type === 'equation' && (
                <ul className="list-disc pl-5 space-y-1 text-[var(--chem-text)]">
                  <li><strong>[1 mark]</strong> Conservation of mass number (nucleon balance).</li>
                  <li><strong>[1 mark]</strong> Conservation of atomic number (proton/charge balance) and correct symbol.</li>
                </ul>
              )}
              {currentProblem.type === 'massDefect' && (
                <ul className="list-disc pl-5 space-y-1 text-[var(--chem-text)]">
                  <li><strong>[1 mark]</strong> Mass of constituent nucleons = ({currentProblem.protons} &times; 1.00728) + ({currentProblem.neutrons} &times; 1.00866) u.</li>
                  <li><strong>[1 mark]</strong> Δm = Calculated mass - {currentProblem.actualMassU} u, then convert to kg (&times; 1.66054 &times; 10<sup>-27</sup> kg).</li>
                  <li><strong>[1 mark]</strong> E = Δmc² = {renderStandardForm(currentProblem.expectedEnergyJ, 3)} J.</li>
                </ul>
              )}
              {currentProblem.type === 'halfLife' && (
                <ul className="list-disc pl-5 space-y-1 text-[var(--chem-text)]">
                  <li><strong>[1 mark]</strong> Calculate decay constant λ = ln(2) / {currentProblem.halfLifeDays} = {renderStandardForm(currentProblem.expectedLambda, 3)} day<sup>-1</sup>.</li>
                  <li><strong>[1 mark]</strong> Apply radioactive decay law: N = N<sub>0</sub>e<sup>-λt</sup>.</li>
                  <li><strong>[1 mark]</strong> Final remaining mass = {renderStandardForm(currentProblem.expectedRemainingMass, 3)} g.</li>
                </ul>
              )}
            </div>
          )}

        </div>
      )}

      {/* Dynamic Inline SVG Visualization Component: Radiation Deflection Diagram */}
      <div className="bg-[var(--chem-card-bg)] rounded-xl border border-[var(--chem-border)] p-4 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[var(--chem-primary)] mb-3 flex items-center gap-2">
          <span>📉</span> Radiation Behavior in Electric Fields (WJEC Line-Art Style)
        </h3>
        
        <div className="w-full max-w-lg mx-auto">
          <svg
            viewBox="0 0 400 200"
            className="w-full h-auto rounded border border-[var(--chem-border)] bg-[var(--chem-bg-main)]"
            aria-label="Electric field deflection diagram for alpha, beta, and gamma radiation"
          >
            {/* Top Positive Plate */}
            <rect x="120" y="20" width="200" height="12" fill="var(--chem-border)" rx="2" />
            <text x="220" y="29" textAnchor="middle" fill="var(--chem-text)" fontSize="10" fontWeight="bold">+</text>

            {/* Bottom Negative Plate */}
            <rect x="120" y="168" width="200" height="12" fill="var(--chem-border)" rx="2" />
            <text x="220" y="177" textAnchor="middle" fill="var(--chem-text)" fontSize="10" fontWeight="bold">-</text>

            {/* Radioactive Source Container */}
            <rect x="20" y="85" width="40" height="30" fill="var(--chem-card-bg)" stroke="var(--chem-text)" strokeWidth="2" />
            <circle cx="40" cy="100" r="4" fill="var(--chem-accent)" />
            <text x="40" y="130" textAnchor="middle" fill="var(--chem-text-muted)" fontSize="9">Source</text>

            {/* Collimator Beam Output */}
            <line x1="60" y1="100" x2="110" y2="100" stroke="var(--chem-text)" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Beta Path (Strong Deflection to Positive Plate) */}
            <path d="M 110 100 Q 180 100 230 32" fill="none" stroke="var(--chem-primary)" strokeWidth="2" />
            <text x="240" y="35" fill="var(--chem-primary)" fontSize="10" fontWeight="bold">β⁻ (Deflects to +)</text>

            {/* Gamma Path (Undeflected Photon Line) */}
            <line x1="110" y1="100" x2="350" y2="100" stroke="var(--chem-text)" strokeWidth="2" strokeDasharray="5,2" />
            <text x="355" y="103" fill="var(--chem-text)" fontSize="10" fontWeight="bold">γ (Undeflected)</text>

            {/* Alpha Path (Gentle Deflection to Negative Plate due to larger mass) */}
            <path d="M 110 100 Q 190 100 250 162" fill="none" stroke="var(--chem-error)" strokeWidth="2" />
            <text x="260" y="165" fill="var(--chem-error)" fontSize="10" fontWeight="bold">α (Deflects to -)</text>
          </svg>
        </div>
        <p className="text-xs text-center text-[var(--chem-text-muted)] mt-2">
          Deflection angle is inversely proportional to particle mass and proportional to charge. Gamma photons carry no electric charge.
        </p>
      </div>

    </div>
  );
}