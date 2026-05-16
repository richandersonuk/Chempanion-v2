import React, { useState, useEffect } from 'react';

const RedoxTitration = () => {
  const [mode, setMode] = useState('purity_iron');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['purity_iron', 'ethanedioate', 'molar_mass'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;
    
    let newProblem = { title: '', text: null, question: '', label: '', correctAnswer: '', unit: '', ratio: 1 };

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
        question: "Calculate the percentage of iron in the wire wire sample.",
        label: "% Fe =",
        correctAnswer: percentage.toFixed(1),
        unit: "%",
        ratio: 5
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
        ratio: 2.5
      };
    } else {
      const massSalt = (2.5 + Math.random() * 1.0).toFixed(3);
      const molesMnO4 = (concMnO4 * titre) / 1000;
      const molesSalt = molesMnO4 * 5;
      const molarMass = massSalt / molesSalt;

      newProblem = {
        title: 'Molar Mass Calculation',
        text: <>A <b>{massSalt} g</b> sample of a hydrated iron(II) salt is dissolved in 250 cm<sup>3</sup> of water. A 25.0 cm<sup>3</sup> portion is titrated against <b>{concMnO4.toFixed(4)} mol dm<sup>-3</sup></b> KMnO<sub>4</sub>, requiring <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the molar mass (Mᵣ) of the hydrated salt compound.",
        label: "Mᵣ =",
        correctAnswer: molarMass.toFixed(1),
        unit: "g mol⁻¹",
        ratio: 5
      };
    }

    setProblem(newProblem);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { 
    generateProblem('purity_iron'); 
  }, []);

  const checkAnswer = () => {
    if (!studentAnswer || isNaN(parseFloat(studentAnswer))) return;

    const userNum = parseFloat(studentAnswer);
    const correctNum = parseFloat(problem.correctAnswer);
    const error = Math.abs((userNum - correctNum) / correctNum);

    if (error < 0.02) { // Aligned to standard 0.02 platform error threshold tolerance
      setFeedback({ message: `Correct! The value is ${problem.correctAnswer} ${problem.unit}.`, status: 'success' });
    } else if (Math.abs(userNum - (correctNum / problem.ratio)) < correctNum * 0.03) {
      setFeedback({ message: `Incorrect calculation. Did you remember to account for the reacting stoichiometry ratio of the redox reaction?`, status: 'error' });
    } else {
      setFeedback({ message: 'Incorrect. Check your reacting mole ratios, volume factors, and step conversions.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      
      {/* --- REFACTORED COMPONENT MODE SELECTION GRID --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="chem-choice-label">Choose Practice Mode</span>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'purity_iron', label: '% Purity' },
            { id: 'ethanedioate', label: 'Ethanedioate' },
            { id: 'molar_mass', label: 'Molar Mass' },
            { id: 'random', label: 'Random' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { setMode(m.id); generateProblem(m.id); }}
              className={`chem-choice-btn ${mode === m.id ? 'active' : ''} text-center text-xs py-2 px-1`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="applet-header">{problem.title}</div>
      
      <div className="question-text text-center">
        {problem.text}
      </div>

      {/* --- STANDARDIZED ACTION QUESTION BLOCK --- */}
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        {problem.question}
      </div>

      {/* INPUT INTERFACE */}
      <div className="input-group">
        <label style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{problem.label}</label>
        <input 
          type="number" 
          className={`chem-input ${feedback.status}`}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="0.00"
          style={{ maxWidth: '12rem', textAlign: 'center' }}
        />
        <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{problem.unit}</span>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default RedoxTitration;
