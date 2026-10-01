import React, { useState, useEffect } from 'react';

// Helper function to format numbers in standard form without 'e' notation
const formatSci = (num, sigFigs = 3) => {
  if (num === 0) return '0';
  const str = num.toExponential(sigFigs - 1);
  const [base, exp] = str.split('e');
  return <>{base} &times; 10<sup>{parseInt(exp, 10)}</sup></>;
};

const RedoxTitration = () => {
  const [mode, setMode] = useState('purity_iron');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: null, status: '' });
  const [showSolution, setShowSolution] = useState(false);

  const generateProblem = (forcedMode = null) => {
    const modes = ['purity_iron', 'ethanedioate', 'molar_mass', 'hydrogen_peroxide', 'copper_thiosulfate'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;
    
    setMode(targetMode);
    
    let newProblem = { title: '', text: null, question: '', label: '', correctAnswer: '', unit: '', ratio: 1, solutionSteps: [] };

    // Common variables
    const titre = (20 + Math.random() * 10).toFixed(2);
    const concMnO4 = (0.0150 + Math.random() * 0.0100);
    const concThio = (0.0500 + Math.random() * 0.0500);

    if (targetMode === 'purity_iron') {
      const massSample = (1.0 + Math.random() * 0.5).toFixed(3);
      const molesMnO4 = (concMnO4 * titre) / 1000;
      const molesFe = molesMnO4 * 5;
      const massFe = molesFe * 55.85; // Using standard Ar for Fe
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
      const molesOx = molesMnO4 * 2.5; // Ratio 2 MnO4 : 5 C2O4
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
      const molesH2O2 = molesMnO4 * 2.5; // Ratio 2 MnO4 : 5 H2O2
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
      const molesCu = molesThio; // Ratio Cu2+ : S2O3 2- is 1:1 overall
      const massCu = molesCu * 63.55; 
      const percentageCu = (massCu / massAlloy) * 100;

      newProblem = {
        title: 'Iodometric Analysis of Copper Alloy',
        text: <>A <b>{massAlloy} g</b> sample of a brass alloy is reacted with concentrated nitric acid to form Cu<sup>2+</sup><sub>(aq)</sub>. The solution is neutralized and an excess of potassium iodide is added. The liberated iodine requires <b>{titre} cm<sup>3</sup></b> of <b>{concThio.toFixed(4)} mol dm<sup>-3</sup></b> sodium thiosulfate solution to reach the starch endpoint. <br/><br/><span className="text-[var(--chem-text-muted)] text-sm">(Refer to the Data Booklet for relative atomic masses.)</span></>,
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
    } else if (Math.abs(userNum - (correctNum / problem.ratio)) < correctNum * 0.03 || Math.abs(userNum - (correctNum * problem.ratio)) < correctNum * 0.03) {
      setFeedback({ message: `Incorrect calculation. Did you remember to account for the reacting stoichiometry ratio of the redox reaction?`, status: 'error' });
    } else {
      setFeedback({ message: 'Incorrect. Check your reacting mole ratios, volume factors, and step conversions.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[var(--chem-bg-main)] rounded-xl shadow-md border border-[var(--chem-border)]">
      <div className="w-full max-w-md mx-auto mb-8 px-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--chem-text-muted)] mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="flex-1 w-full min-w-0 bg-white border border-[var(--chem-border)] text-[var(--chem-text-main)] py-2.5 px-3 rounded-xl text-sm font-bold outline-none focus:border-[var(--chem-primary)] focus:ring-1 focus:ring-[var(--chem-primary)] transition-all cursor-pointer shadow-sm"
          >
            <option value="purity_iron">Percentage Purity of Iron</option>
            <option value="ethanedioate">Analysis of Ethanedioate Ions</option>
            <option value="hydrogen_peroxide">Concentration of H₂O₂</option>
            <option value="copper_thiosulfate">Iodometric Copper Analysis</option>
            <option value="molar_mass">Molar Mass Calculation (Mᵣ)</option>
          </select>
          <button
            type="button"
            onClick={() => { setMode('random'); generateProblem('random'); }}
            className={`w-full sm:w-auto px-4 py-2.5 text-xs font-black uppercase rounded-xl transition-all border shrink-0 ${
              mode === 'random'
                ? 'bg-[var(--chem-primary)] bg-opacity-10 border-[var(--chem-primary)] text-[var(--chem-primary)] shadow-sm'
                : 'bg-white border-[var(--chem-border)] text-[var(--chem-text-muted)] hover:bg-gray-50'
            }`}
          >
            Random 🎲
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-center text-[var(--chem-text-main)] mb-4">{problem.title}</h2>
      
      <div className="text-center text-[var(--chem-text-main)] mb-6 leading-relaxed">
        {problem.text}
      </div>

      <div className="font-bold mb-6 text-center text-[var(--chem-text-main)] text-lg">
        {problem.question}
      </div>

      <div className="flex justify-center items-center gap-3 mb-8">
        <label className="font-bold text-[var(--chem-text-main)]">{problem.label}</label>
        <input 
          type="number" 
          className={`w-32 text-center p-2 border rounded-lg focus:outline-none focus:ring-2 ${
            feedback.status === 'error' ? 'border-[var(--chem-error-bg)] focus:ring-[var(--chem-error-bg)]' : 
            feedback.status === 'success' ? 'border-[var(--chem-success-bg)] focus:ring-[var(--chem-success-bg)]' : 
            'border-[var(--chem-border)] focus:ring-[var(--chem-primary)]'
          }`}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="0.00"
        />
        <span className="font-bold text-[var(--chem-text-main)]">{problem.unit}</span>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button 
          className="px-6 py-2.5 bg-[var(--chem-primary)] text-white rounded-lg font-bold shadow hover:opacity-90 transition-opacity"
          onClick={checkAnswer}
        >
          Check Answer
        </button>
        <button 
          className="px-6 py-2.5 bg-gray-100 text-[var(--chem-text-main)] rounded-lg font-bold border border-[var(--chem-border)] hover:bg-gray-200 transition-colors"
          onClick={() => generateProblem()}
        >
          New Problem
        </button>
      </div>

      {feedback.message && (
        <div className={`p-4 rounded-lg mb-4 text-center ${
          feedback.status === 'success' ? 'bg-[var(--chem-success-bg)] text-[var(--chem-success-text)]' : 'bg-[var(--chem-error-bg)] text-[var(--chem-error-text)]'
        }`}>
          {feedback.message}
          {feedback.status === 'error' && !showSolution && (
            <div className="mt-3">
              <button 
                onClick={() => setShowSolution(true)}
                className="text-sm px-4 py-1.5 bg-transparent border border-current rounded hover:bg-black hover:bg-opacity-5 transition-colors"
              >
                Show Worked Solution
              </button>
            </div>
          )}
        </div>
      )}

      {showSolution && (
        <div className="bg-white border border-[var(--chem-border)] rounded-lg p-5 mt-4 shadow-inner">
          <h4 className="font-bold text-[var(--chem-text-main)] mb-3">Worked Solution:</h4>
          <div className="flex flex-col gap-2">
            {problem.solutionSteps.map((step, index) => (
              <div key={index} className="text-[var(--chem-text-main)] text-sm font-mono bg-gray-50 p-2 rounded border border-gray-100">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RedoxTitration;
