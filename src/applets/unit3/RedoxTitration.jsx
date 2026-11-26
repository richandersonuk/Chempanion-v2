import React, { useState, useEffect } from 'react';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';

const formatSci = (num, sigFigs = 3) => {
  if (num === 0) return '0';
  const str = num.toExponential(sigFigs - 1);
  const [base, exp] = str.split('e');
  return <>{base} &times; 10<sup>{parseInt(exp, 10)}</sup></>;
};

const MODE_OPTIONS = [
  { value: 'purity_iron', label: 'Percentage Purity of Iron', shortLabel: '% Purity (Fe)' },
  { value: 'ethanedioate', label: 'Analysis of Ethanedioate Ions', shortLabel: 'Ethanedioate' },
  { value: 'hydrogen_peroxide', label: 'Concentration of H₂O₂', shortLabel: '[H₂O₂]' },
  { value: 'copper_thiosulfate', label: 'Iodometric Copper Analysis', shortLabel: 'Cu / Thiosulfate' },
  { value: 'molar_mass', label: 'Molar Mass Calculation (Mᵣ)', shortLabel: 'Molar Mass (Mᵣ)' },
];

const RedoxTitration = ({ onComplete }) => {
  const [mode, setMode] = useState('purity_iron');
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: null, status: '' });
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const generateProblem = (forcedMode = null) => {
    const modes = ['purity_iron', 'ethanedioate', 'molar_mass', 'hydrogen_peroxide', 'copper_thiosulfate'];
    const selection = forcedMode || (isRandomMode ? 'random' : mode);
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    let newProblem = { title: '', text: null, question: '', label: '', correctAnswer: '', unit: '', ratio: 1, solutionSteps: [] };

    const titre = (20 + Math.random() * 10).toFixed(2);
    const concMnO4 = (0.0150 + Math.random() * 0.0100);
    const concThio = (0.0500 + Math.random() * 0.0500);

    if (targetMode === 'purity_iron') {
      const massSample = (1.0 + Math.random() * 0.5).toFixed(3);
      const molesMnO4 = (concMnO4 * titre) / 1000;
      const molesFe = molesMnO4 * 5;
      const massFe = molesFe * 55.85;
      const percentage = (massFe / massSample) * 100;

      newProblem = {
        title: 'Percentage Purity of Iron',
        text: <>A student dissolves a <b>{massSample} g</b> sample of impure iron wire in dilute sulfuric acid. The resulting solution is titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>. The mean titre is <b>{titre} cm<sup>3</sup></b>. <br/><br/><span className="text-[var(--chem-text-muted)] text-sm">(Refer to the Data Booklet for any standard constants or relative atomic masses required.)</span></>,
        question: "Calculate the percentage purity of the iron wire sample.",
        label: "% Fe =",
        correctAnswer: percentage.toFixed(1),
        unit: "%",
        ratio: 5,
        solutionSteps: [
          <>1. Moles of MnO<sub>4</sub><sup>-</sup> = {concMnO4.toFixed(4)} &times; ({titre} / 1000) = {formatSci(molesMnO4, 3)} mol</>,
          <>2. Moles of Fe<sup>2+</sup> = {formatSci(molesMnO4, 3)} &times; 5 = {formatSci(molesFe, 3)} mol</>,
          <>3. Mass of Fe = {formatSci(molesFe, 3)} &times; 55.85 = {massFe.toFixed(3)} g</>,
          <>4. % Purity = ({massFe.toFixed(3)} / {massSample}) &times; 100 = {percentage.toFixed(1)}%</>
        ]
      };
    } else if (targetMode === 'ethanedioate') {
      const volOxalate = 25.0;
      const molesMnO4 = (concMnO4 * titre) / 1000;
      const molesOx = molesMnO4 * 2.5;
      const concOx = (molesOx * 1000) / volOxalate;

      newProblem = {
        title: 'Analysis of Ethanedioate Ions',
        text: <>A <b>25.0 cm<sup>3</sup></b> sample of sodium ethanedioate solution is acidified and heated, then titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>. The mean titre is <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the concentration of the sodium ethanedioate solution.",
        label: "[C₂O₄²⁻] =",
        correctAnswer: concOx.toFixed(3),
        unit: "mol dm⁻³",
        ratio: 2.5,
        solutionSteps: [
          <>1. Moles of MnO<sub>4</sub><sup>-</sup> = {concMnO4.toFixed(4)} &times; ({titre} / 1000) = {formatSci(molesMnO4, 3)} mol</>,
          <>2. Moles of C<sub>2</sub>O<sub>4</sub><sup>2-</sup> = {formatSci(molesMnO4, 3)} &times; 2.5 = {formatSci(molesOx, 3)} mol</>,
          <>3. Concentration = ({formatSci(molesOx, 3)} &times; 1000) / {volOxalate.toFixed(1)} = {concOx.toFixed(3)} mol dm<sup>-3</sup></>
        ]
      };
    } else if (targetMode === 'hydrogen_peroxide') {
      const volH2O2 = 25.0;
      const molesMnO4 = (concMnO4 * titre) / 1000;
      const molesH2O2 = molesMnO4 * 2.5;
      const concH2O2 = (molesH2O2 * 1000) / volH2O2;

      newProblem = {
        title: 'Concentration of Hydrogen Peroxide',
        text: <>A <b>25.0 cm<sup>3</sup></b> sample of commercial hydrogen peroxide (H<sub>2</sub>O<sub>2</sub>) is diluted to 250 cm<sup>3</sup>. A 25.0 cm<sup>3</sup> aliquot of this diluted solution is acidified and titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>. The mean titre is <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the original concentration of the undiluted hydrogen peroxide solution.",
        label: "[H₂O₂] =",
        correctAnswer: (concH2O2 * 10).toFixed(3),
        unit: "mol dm⁻³",
        ratio: 2.5,
        solutionSteps: [
          <>1. Moles of MnO<sub>4</sub><sup>-</sup> = {concMnO4.toFixed(4)} &times; ({titre} / 1000) = {formatSci(molesMnO4, 3)} mol</>,
          <>2. Moles of H<sub>2</sub>O<sub>2</sub> in aliquot = {formatSci(molesMnO4, 3)} &times; 2.5 = {formatSci(molesH2O2, 3)} mol</>,
          <>3. Concentration of diluted H<sub>2</sub>O<sub>2</sub> = ({formatSci(molesH2O2, 3)} &times; 1000) / 25.0 = {concH2O2.toFixed(3)} mol dm<sup>-3</sup></>,
          <>4. Original concentration = {concH2O2.toFixed(3)} &times; 10 (dilution factor) = {(concH2O2 * 10).toFixed(3)} mol dm<sup>-3</sup></>
        ]
      };
    } else if (targetMode === 'copper_thiosulfate') {
      const massAlloy = (2.0 + Math.random()).toFixed(2);
      const molesThio = (concThio * titre) / 1000;
      const molesCu = molesThio;
      const massCu = molesCu * 63.55;
      const percentageCu = (massCu / massAlloy) * 100;

      newProblem = {
        title: 'Iodometric Analysis of Copper Alloy',
        text: <>A <b>{massAlloy} g</b> sample of a brass alloy is reacted with concentrated nitric acid to form Cu<sup>2+</sup><sub>(aq)</sub>. The solution is neutralised and an excess of potassium iodide is added. The liberated iodine requires <b>{titre} cm<sup>3</sup></b> of <b>{concThio.toFixed(4)} mol dm<sup>-3</sup></b> sodium thiosulfate solution to reach the starch endpoint. <br/><br/><span className="text-[var(--chem-text-muted)] text-sm">(Refer to the Data Booklet for relative atomic masses.)</span></>,
        question: "Calculate the percentage by mass of copper in the brass alloy.",
        label: "% Cu =",
        correctAnswer: percentageCu.toFixed(1),
        unit: "%",
        ratio: 1,
        solutionSteps: [
          <>1. Moles of S<sub>2</sub>O<sub>3</sub><sup>2-</sup> = {concThio.toFixed(4)} &times; ({titre} / 1000) = {formatSci(molesThio, 3)} mol</>,
          <>2. Moles of Cu<sup>2+</sup> = Moles of S<sub>2</sub>O<sub>3</sub><sup>2-</sup> = {formatSci(molesCu, 3)} mol (Overall 1:1 ratio)</>,
          <>3. Mass of Cu = {formatSci(molesCu, 3)} &times; 63.55 = {massCu.toFixed(3)} g</>,
          <>4. % Mass = ({massCu.toFixed(3)} / {massAlloy}) &times; 100 = {percentageCu.toFixed(1)}%</>
        ]
      };
    } else {
      const massSalt = (2.5 + Math.random() * 1.0).toFixed(3);
      const molesMnO4 = (concMnO4 * titre) / 1000;
      const molesSaltInAliquot = molesMnO4 * 5;
      const molesSaltTotal = molesSaltInAliquot * 10;
      const molarMass = massSalt / molesSaltTotal;

      newProblem = {
        title: 'Molar Mass of a Hydrated Salt',
        text: <>A <b>{massSalt} g</b> sample of a hydrated iron(II) salt is dissolved in 250 cm<sup>3</sup> of water. A 25.0 cm<sup>3</sup> portion is titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>, requiring <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the molar mass (Mᵣ) of the hydrated salt compound.",
        label: "Mᵣ =",
        correctAnswer: molarMass.toFixed(1),
        unit: "g mol⁻¹",
        ratio: 5,
        solutionSteps: [
          <>1. Moles of MnO<sub>4</sub><sup>-</sup> = {concMnO4.toFixed(4)} &times; ({titre} / 1000) = {formatSci(molesMnO4, 3)} mol</>,
          <>2. Moles of Fe<sup>2+</sup> in 25.0 cm<sup>3</sup> = {formatSci(molesMnO4, 3)} &times; 5 = {formatSci(molesSaltInAliquot, 3)} mol</>,
          <>3. Moles of Fe<sup>2+</sup> in 250 cm<sup>3</sup> = {formatSci(molesSaltInAliquot, 3)} &times; 10 = {formatSci(molesSaltTotal, 3)} mol</>,
          <>4. Molar Mass (Mᵣ) = {massSalt} / {formatSci(molesSaltTotal, 3)} = {molarMass.toFixed(1)} g mol<sup>-1</sup></>
        ]
      };
    }

    setProblem(newProblem);
    setStudentAnswer('');
    setFeedback({ message: null, status: '' });
    setShowSolution(false);
    setShowHint(false);
  };

  useEffect(() => {
    generateProblem('purity_iron');
  }, []);

  const checkAnswer = () => {
    if (!studentAnswer || isNaN(parseFloat(studentAnswer))) return;

    const userNum = parseFloat(studentAnswer);
    const correctNum = parseFloat(problem.correctAnswer);
    const error = Math.abs((userNum - correctNum) / correctNum);

    if (error < 0.02) {
      if (studentAnswer !== problem.correctAnswer && Number(studentAnswer) === Number(problem.correctAnswer)) {
        setFeedback({
          message: <>Correct calculation, but check your precision. In WJEC exams, match the significant figures or decimal places appropriate to the data provided. Expected format: <b>{problem.correctAnswer}</b>.</>,
          status: 'success'
        });
      } else {
        setFeedback({ message: `Correct! The value is ${problem.correctAnswer} ${problem.unit}.`, status: 'success' });
      }
      setShowSolution(false);
      onComplete?.(`${mode}_${problem.correctAnswer}`);
    } else if (Math.abs(userNum - (correctNum / problem.ratio)) < correctNum * 0.03 || Math.abs(userNum - (correctNum * problem.ratio)) < correctNum * 0.03) {
      setFeedback({ message: `Incorrect calculation. Did you remember to account for the reacting stoichiometry ratio of the redox reaction?`, status: 'error' });
    } else {
      setFeedback({ message: 'Incorrect. Check your reacting mole ratios, volume factors, and step conversions.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">{problem.title}</div>

      <AdaptivePicker
        label="Choose Practice Mode"
        options={MODE_OPTIONS}
        value={mode}
        isRandomActive={isRandomMode}
        onChange={(val) => {
          setIsRandomMode(false);
          generateProblem(val);
        }}
        onRandom={() => {
          setIsRandomMode(true);
          generateProblem('random');
        }}
        collapseBelow="sm"
      />

      <div className="applet-workbench">
        {/* Left Column: Titration Scenario Card & Hint */}
        <div className="applet-workbench-sticky space-y-3.5">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="question-text !mb-0 text-center md:text-left leading-relaxed text-sm sm:text-base">
              {problem.text}
            </div>

            <div className="flex flex-col items-center md:items-start">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="min-h-[34px] px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
              >
                💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
              {showHint && (
                <div className="mt-2.5 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
                  <strong className="font-black text-amber-900">Redox Titration Ratios: </strong>
                  Use n = c × V(cm³) ÷ 1000 for the burette reagent, apply the half-equation mole ratio (1 MnO₄⁻ : 5 Fe²⁺; 2 MnO₄⁻ : 5 C₂O₄²⁻; 2 MnO₄⁻ : 5 H₂O₂; overall 1 Cu²⁺ : 1 S₂O₃²⁻), and scale up (e.g. ×10) if a 25.0 cm³ portion came from a 250 cm³ volumetric flask.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question, Input, Buttons, Feedback & Worked Solution */}
        <div className="space-y-4">
          <div className="font-bold text-center md:text-left text-[0.95rem] px-1 text-slate-700">
            {problem.question}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="input-group !mb-0">
              <label className="font-bold text-[var(--chem-text-main)]">{problem.label}</label>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                onWheel={(e) => e.currentTarget.blur()}
                className={`chem-input min-h-[40px] bg-white ${feedback.status}`}
                value={studentAnswer}
                onChange={(e) => { setStudentAnswer(e.target.value); if (feedback.message) setFeedback({ message: null, status: '' }); }}
                onKeyDown={(e) => e.key === 'Enter' && (feedback.status === 'success' ? generateProblem() : checkAnswer())}
                placeholder="0.00"
              />
              <span className="font-bold text-[var(--chem-text-main)]">{problem.unit}</span>
            </div>
          </div>

          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={checkAnswer}
            >
              Check Answer
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => generateProblem()}
            >
              Next Problem &rarr;
            </button>
          </div>

          {feedback.message && (
            <div className={`feedback-box flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
              feedback.status === 'success' ? 'feedback-success' : 'feedback-error'
            }`}>
              <div className="min-w-0">
                {feedback.message}
                {feedback.status === 'error' && !showSolution && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setShowSolution(true)}
                      className="min-h-[34px] text-xs px-3.5 py-1.5 bg-white border border-current rounded-lg font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Show Worked Solution
                    </button>
                  </div>
                )}
              </div>
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

          {showSolution && (
            <div className="bg-white border border-[var(--chem-border)] rounded-2xl p-4 sm:p-5 shadow-inner">
              <h4 className="font-bold text-[var(--chem-text-main)] mb-3">Worked Solution:</h4>
              <div className="flex flex-col gap-2">
                {problem.solutionSteps.map((step, index) => (
                  <div key={index} className="text-[var(--chem-text-main)] text-xs sm:text-sm font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-100 break-words">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedoxTitration;
