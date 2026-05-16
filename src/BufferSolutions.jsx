import React, { useState, useEffect } from 'react';

const BufferSolutions = () => {
  const [mode, setMode] = useState('acidic_buffer');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['acidic_buffer', 'salt_addition'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    let newProb = {};
    const kaVal = 1.74e-5; // Ethanoic acid

    if (targetMode === 'acidic_buffer') {
      const concAcid = (0.1 + Math.random() * 0.2).toFixed(2);
      const concSalt = (0.05 + Math.random() * 0.1).toFixed(2);
      
      // pH = pKa + log([Salt]/[Acid])
      const pKa = -Math.log10(kaVal);
      const ph = pKa + Math.log10(parseFloat(concSalt) / parseFloat(concAcid));

      newProb = {
        title: 'Acidic Buffer pH',
        text: (
          <>
            A buffer solution contains ethanoic acid at a concentration of{' '}
            <b>{concAcid} mol dm<sup>-3</sup></b>{' '}
            and sodium ethanoate at{' '}
            <b>{concSalt} mol dm<sup>-3</sup></b>.
          </>
        ),
        question: 'Calculate the pH of this buffer solution.',
        correct: ph.toFixed(2),
        isScientific: false,
      };
    } else {
      const massSalt = (1.5 + Math.random() * 1.0).toFixed(2); // g of CH3COONa
      const vol = 500; // cm3
      const concAcid = 0.2;
      const molesSalt = parseFloat(massSalt) / 82.03;
      const concSalt = (molesSalt * 1000) / vol;
      const pKa = -Math.log10(kaVal);
      const ph = pKa + Math.log10(concSalt / concAcid);

      newProb = {
        title: 'Buffer Preparation',
        text: (
          <>
            A student adds <b>{massSalt} g</b> of sodium ethanoate (M<sub>r</sub> = 82.0) to{' '}
            <b>500 cm<sup>3</sup></b>{' '}
            of{' '}
            <b>0.20 mol dm<sup>-3</sup></b>{' '}
            ethanoic acid.
          </>
        ),
        question: 'Calculate the pH of the resulting solution.',
        correct: ph.toFixed(2),
        isScientific: false,
      };
    }

    setProblem(newProb);
    setCoeff('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('acidic_buffer');
  }, []);

  const checkAnswer = () => {
    const userVal = parseFloat(coeff);
    if (!coeff || isNaN(userVal)) return;

    if (userVal.toFixed(2) === parseFloat(problem.correct).toFixed(2)) {
      setFeedback({
        message: 'Correct! pH = ' + problem.correct,
        status: 'success',
      });
    } else {
      setFeedback({
        message: 'Incorrect. Check your pKa calculation and [Salt]/[Acid] ratio.',
        status: 'error',
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      
      {/* --- REFACTORED COMPONENT MODE SELECTION GRID --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="chem-choice-label">Choose Practice Mode</span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'acidic_buffer', label: 'Standard Buffer' },
            { id: 'salt_addition', label: 'Mass Addition' },
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
      <div className="question-text text-center">{problem.text}</div>
      
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        {problem.question}
      </div>

      {/* INPUT INTERFACE */}
      <div className="input-group">
        <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>pH = </label>
        <input
          type="number"
          className={`chem-input ${feedback.status}`}
          value={coeff}
          onChange={(e) => setCoeff(e.target.value)}
          placeholder="0.00"
          style={{ maxWidth: '12rem', textAlign: 'center' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>
          Check Answer
        </button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>
          New Problem
        </button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default BufferSolutions;
