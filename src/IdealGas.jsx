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

  useEffect(() => { 
    generate(); 
  }, []);

  const check = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;

    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.v) / problem.v);

    if (error < 0.02) { // Normalized to 0.02 to stay uniform with platform tolerance rules
      setFeedback({ type: 'success', message: 'Correct! Volume calculated accurately.' });
    } else {
      setFeedback({ type: 'error', message: 'Incorrect. Check your unit conversions (T must be converted to Kelvin).' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      <div className="applet-header">Ideal Gas Equation</div>

      <div className="question-text text-center">
        <p>
          A gas sample is maintained inside a closed chemical system under fixed constraints.<br />
          The system contains <b>{problem.n} mol</b> of a gas at a pressure of <b>{problem.p.toLocaleString()} Pa</b> and a temperature of <b>{problem.t}°C</b>.
        </p>
      </div>

      {/* --- STANDARDIZED ACTION QUESTION BLOCK --- */}
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Calculate the volume (m³) occupied by the gas.
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
        <button className="btn btn-secondary" onClick={generate}>New Problem</button>
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
