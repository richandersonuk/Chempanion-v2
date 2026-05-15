import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const BufferSolutions = () => {
  const [mode, setMode] = useState('acidic_buffer');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['acidic_buffer', 'salt_addition'];
    const selection = forcedMode || mode;
    const targetMode =
      selection === 'random'
        ? modes[Math.floor(Math.random() * modes.length)]
        : selection;

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
            <b>
              {concAcid} mol dm<sup>-3</sup>
            </b>{' '}
            and sodium ethanoate at{' '}
            <b>
              {concSalt} mol dm<sup>-3</sup>
            </b>
            .
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
            A student adds <b>{massSalt} g</b> of sodium ethanoate (M
            <sub>r</sub> = 82.0) to{' '}
            <b>
              500 cm<sup>3</sup>
            </b>{' '}
            of{' '}
            <b>
              0.20 mol dm<sup>-3</sup>
            </b>{' '}
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
    setExp('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('acidic_buffer');
  }, []);

  const checkAnswer = () => {
    const userVal = parseFloat(coeff);
    if (userVal.toFixed(2) === parseFloat(problem.correct).toFixed(2)) {
      setFeedback({
        message: 'Correct! pH = ' + problem.correct,
        status: 'success',
      });
    } else {
      setFeedback({
        message:
          'Incorrect. Check your pKa calculation and [Salt]/[Acid] ratio.',
        status: 'error',
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <select
          value={mode === 'random' ? '' : mode}
          onChange={(e) => {
            setMode(e.target.value);
            generateProblem(e.target.value);
          }}
          className="chem-input"
          style={{ width: 'auto' }}
        >
          <option value="acidic_buffer">Standard Buffer</option>
          <option value="salt_addition">Mass Addition</option>
        </select>
        <button
          onClick={() => {
            setMode('random');
            generateProblem('random');
          }}
          className="btn btn-secondary"
        >
          Random
        </button>
      </div>

      <div className="applet-header">{problem.title}</div>
      <div className="question-text">{problem.text}</div>
      <p className="font-bold mb-6 text-center">{problem.question}</p>

      <div className="input-group">
        <label>pH = </label>
        <input
          type="number"
          className={`chem-input ${feedback.status}`}
          value={coeff}
          onChange={(e) => setCoeff(e.target.value)}
          placeholder="0.00"
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
        <div
          className={`feedback-box ${
            feedback.status === 'success'
              ? 'feedback-success'
              : 'feedback-error'
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default BufferSolutions;
