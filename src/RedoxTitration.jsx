import React, { useState, useEffect } from 'react';

const RedoxTitration = () => {
  const [mode, setMode] = useState('purity_iron');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  const [showSolution, setShowSolution] = useState(false);

  const generateProblem = (forcedMode = null) => {
    const modes = ['purity_iron', 'ethanedioate', 'molar_mass'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;
    
    setMode(targetMode);
    
    let newProblem = { title: '', text: null, question: '', label: '', correctAnswer: '', unit: '', ratio: 1, solutionSteps: [] };

    // Common variables
    const titre = (20 + Math.random() * 10).toFixed(2);
    const concMnO4 = 0.0200;

    if (targetMode === 'purity_iron') {
      const massSample = (1.0 + Math.random() * 0.5).toFixed(3);
      const molesMnO4 = (concMnO4 * titre) / 1000;
      const molesFe = molesMnO4 * 5;
      const massFe = molesFe * 55.85;
      const percentage = (massFe / massSample) * 100;

      newProblem = {
        title: 'Percentage Purity of Iron',
        text: <>A student dissolves a <b>{massSample} g</b> sample of impure iron wire in acid. The resulting solution is titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>. The mean titre is <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the percentage of iron in the wire sample.",
        label: "% Fe =",
        correctAnswer: percentage.toFixed(1),
        unit: "%",
        ratio: 5,
        solutionSteps: [
          `1. Moles of MnO₄⁻ = ${concMnO4} × (${titre} / 1000) = ${molesMnO4.toExponential(3)} mol`,
          `2. Moles of Fe²⁺ = ${molesMnO4.toExponential(3)} × 5 = ${molesFe.toExponential(3)} mol`,
          `3. Mass of Fe = ${molesFe.toExponential(3)} × 55.85 = ${massFe.toFixed(3)} g`,
          `4. % Purity = (${massFe.toFixed(3)} g / ${massSample} g) × 100 = ${percentage.toFixed(1)}%`
        ]
      };
    } else if (targetMode === 'ethanedioate') {
      const volOxalate = 25.0;
      const molesMnO4 = (concMnO4 * titre) / 1000;
      // Ratio 2 MnO4 : 5 C2O4
      const molesOx = molesMnO4 * 2.5;
      const concOx = (molesOx * 1000) / volOxalate;

      newProblem = {
        title: 'Analysis of Ethanedioate Ions',
        text: <>A <b>25.0 cm<sup>3</sup></b> sample of sodium ethanedioate solution is titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>. The mean titre is <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the concentration of the sodium ethanedioate solution.",
        label: "[C₂O₄²⁻] =",
        correctAnswer: concOx.toFixed(3),
        unit: "mol dm⁻³",
        ratio: 2.5,
        solutionSteps: [
          `1. Moles of MnO₄⁻ = ${concMnO4} × (${titre} / 1000) = ${molesMnO4.toExponential(3)} mol`,
          `2. Moles of C₂O₄²⁻ = ${molesMnO4.toExponential(3)} × 2.5 = ${molesOx.toExponential(3)} mol (Ratio is 2:5)`,
          `3. Concentration = (${molesOx.toExponential(3)} × 1000) / ${volOxalate.toFixed(1)} = ${concOx.toFixed(3)} mol dm⁻³`
        ]
      };
    } else {
      const massSalt = (2.5 + Math.random() * 1.0).toFixed(3);
      const molesMnO4 = (concMnO4 * titre) / 1000;
      
      // Moles of salt in the 25.0 cm3 titrated portion
      const molesSaltInAliquot = molesMnO4 * 5; 
      
      // Scale up to the full 250 cm3 flask (multiply by 10)
      const molesSaltTotal = molesSaltInAliquot * 10; 
      
      const molarMass = massSalt / molesSaltTotal;

      newProblem = {
        title: 'Molar Mass Calculation',
        text: <>A <b>{massSalt} g</b> sample of a hydrated iron(II) salt is dissolved in 250 cm<sup>3</sup> of water. A 25.0 cm<sup>3</sup> portion is titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>, requiring <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the molar mass (Mᵣ) of the hydrated salt compound.",
        label: "Mᵣ =",
        correctAnswer: molarMass.toFixed(1),
        unit: "g mol⁻¹",
        ratio: 5,
        solutionSteps: [
          `1. Moles of MnO₄⁻ = ${concMnO4} × (${titre} / 1000) = ${molesMnO4.toExponential(3)} mol`,
          `2. Moles of Fe²⁺ in 25.0 cm³ aliquot = ${molesMnO4.toExponential(3)} × 5 = ${molesSaltInAliquot.toExponential(3)} mol`,
          `3. Moles of Fe²⁺ in full 250 cm³ flask = ${molesSaltInAliquot.toExponential(3)} × 10 = ${molesSaltTotal.toExponential(3)} mol`,
          `4. Molar Mass (Mᵣ) = ${massSalt} g / ${molesSaltTotal.toExponential(3)} mol = ${molarMass.toFixed(1)} g mol⁻¹`
        ]
      };
    }

    setProblem(newProblem);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
    setShowSolution(false); // Reset solution visibility
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
      setFeedback({ message: `Correct! The value is ${problem.correctAnswer} ${problem.unit}.`, status: 'success' });
      setShowSolution(false);
    } else if (Math.abs(userNum - (correctNum / problem.ratio)) < correctNum * 0.03) {
      setFeedback({ message: `Incorrect calculation. Did you remember to account for the reacting stoichiometry ratio of the redox reaction?`, status: 'error' });
    } else {
      setFeedback({ message: 'Incorrect. Check your reacting mole ratios, volume factors, and step conversions.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      {/* --- COMPACT DROPDOWN + RANDOM LAYOUT --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center gap-2">
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm"
          >
            <option value="purity_iron">Percentage Purity of Iron</option>
            <option value="ethanedioate">Analysis of Ethanedioate Ions</option>
            <option value="molar_mass">Molar Mass Calculation (Mr)</option>
          </select>
          
          <button
            type="button"
            onClick={() => { setMode('random'); generateProblem('random'); }}
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

      <div className="applet-header" style={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>{problem.title}</div>
      <div className="question-text text-center" style={{ marginBottom: '1.5rem' }}>
        {problem.text}
      </div>

      {/* --- STANDARDIZED ACTION QUESTION BLOCK --- */}
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        {problem.question}
      </div>

      {/* INPUT INTERFACE */}
      <div className="input-group" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{problem.label}</label>
        <input 
          type="number" 
          className={`chem-input ${feedback.status}`}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="0.00"
          style={{ maxWidth: '8rem', textAlign: 'center', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{problem.unit}</span>
      </div>

      <div className="button-group" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button 
            className="btn btn-primary" 
            onClick={checkAnswer}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#326fa0', color: 'white', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
            Check Answer
        </button>
        <button 
            className="btn btn-secondary" 
            onClick={() => generateProblem()}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', fontWeight: 'bold', border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
            New Problem
        </button>
      </div>

      {feedback.message && (
        <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', backgroundColor: feedback.status === 'success' ? '#dcfce7' : '#fee2e2', color: feedback.status === 'success' ? '#166534' : '#991b1b' }}>
          {feedback.message}
          
          {/* Solution Toggle Button for Errors */}
          {feedback.status === 'error' && !showSolution && (
            <div style={{ marginTop: '0.75rem' }}>
                <button 
                    onClick={() => setShowSolution(true)}
                    style={{ fontSize: '0.875rem', padding: '0.35rem 0.75rem', backgroundColor: 'transparent', border: '1px solid #991b1b', color: '#991b1b', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Show Worked Solution
                </button>
            </div>
          )}
        </div>
      )}

      {/* Worked Solution Display */}
      {showSolution && (
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', marginTop: '1rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '1rem' }}>Worked Solution:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {problem.solutionSteps.map((step, index) => (
                    <div key={index} style={{ color: '#475569', fontSize: '0.9rem', fontFamily: 'monospace', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
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
