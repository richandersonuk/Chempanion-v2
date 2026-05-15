import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const IdealGas = () => {
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const generate = () => {
    const p = Math.floor(Math.random() * 50000 + 100000); // Pa
    const t = Math.floor(Math.random() * 50 + 20); // C
    const n = (Math.random() * 0.5 + 0.1).toFixed(3); // mol
    const r = 8.31;
    const v = (n * r * (t + 273)) / p;

    setProblem({ p, t, n, v });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
  };

  useEffect(() => { generate(); }, []);

  const check = () => {
    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.v) / problem.v);

    if (error < 0.01) {
      setFeedback({ type: 'success', message: 'Correct! Volume calculated accurately.' });
    } else {
      setFeedback({ type: 'error', message: 'Incorrect. Check your unit conversions (T must be in K).' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      <div className="applet-header">Ideal Gas Equation</div>
      <div className="question-text">
        Calculate the volume (m<sup>3</sup>) occupied by <b>{problem.n} mol</b> of a gas at a pressure of <b>{problem.p.toLocaleString()} Pa</b> and a temperature of <b>{problem.t}&deg;C</b>.
      </div>

      <ScientificInput 
        value={coeff} 
        exponent={exp} 
        onValueChange={setCoeff} 
        onExponentChange={setExp}
        label="V ="
        status={feedback.type}
      />

      <div className="button-group">
        <button className="btn btn-primary" onClick={check}>Check Answer</button>
        <button className="btn btn-secondary" onClick={generate}>Randomize</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default IdealGas;
