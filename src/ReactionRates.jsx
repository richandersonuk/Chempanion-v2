import React, { useState, useEffect } from 'react';

const ReactionRates = () => {
  const [mode, setMode] = useState('calculate_k');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [studentUnit, setStudentUnit] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['calculate_k', 'determine_order', 'arrhenius'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    let newProb = {};

    if (targetMode === 'calculate_k') {
      // Rate = k[A][B]^2 style calculation
      const concA = (0.10 + Math.random() * 0.15).toFixed(2);
      const concB = (0.20 + Math.random() * 0.20).toFixed(2);
      const kVal = (0.5 + Math.random() * 2.5).toFixed(2);
      
      // Rate = k * [A] * [B]^2
      const rate = parseFloat(kVal) * parseFloat(concA) * Math.pow(parseFloat(concB), 2);
      
      newProb = {
        title: "Calculating the Rate Constant (k)",
        text: <>A reaction follows the rate equation: <b>Rate = k[A][B]<sup>2</sup></b>.<br/>At a specific temperature, an experiment yields the following data:<br/>
        [A] = <b>{concA} mol dm<sup>-3</sup></b><br/>
        [B] = <b>{concB} mol dm<sup>-3</sup></b><br/>
        Initial Rate = <b>{rate.currentTarget ? rate.toFixed(5) : rate.toFixed(5)} mol dm<sup>-3</sup> s<sup>-1</sup></b></>,
        question: "Calculate the value of the rate constant (k) and determine its units.",
        label: "k =",
        correctAnswer: kVal,
        correctUnit: "mol-2 dm6 s-1",
        hasUnits: true
      };
    } else if (targetMode === 'determine_order') {
      // Initial rates deduction table
      const order = Math.floor(Math.random() * 3); // 0, 1, or 2
      const baseRate = 1.2e-3;
      const rate2 = order === 0 ? baseRate : (order === 1 ? baseRate * 2 : baseRate * 4);

      newProb = {
        title: "Deducing Reaction Order",
        text: <>The table below shows initial rate data obtained for a reactant, <b>X</b>, at a constant temperature:<br/><br/>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', border: '1px solid var(--chem-border)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--chem-bg-box)' }}>
              <th style={{ padding: '0.5rem', border: '1px solid var(--chem-border)' }}>Expt</th>
              <th style={{ padding: '0.5rem', border: '1px solid var(--chem-border)' }}>Initial [X] / mol dm<sup>-3</sup></th>
              <th style={{ padding: '0.5rem', border: '1px solid var(--chem-border)' }}>Initial Rate / mol dm<sup>-3</sup> s<sup>-1</sup></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>1</td>
              <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>0.10</td>
              <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>{baseRate.toFixed(4)}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>2</td>
              <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>0.20</td>
              <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>{rate2.toFixed(4)}</td>
            </tr>
          </tbody>
        </table>
        </>,
        question: "Deduce the order of reaction with respect to reactant X.",
        label: "Order =",
        correctAnswer: order.toString(),
        hasUnits: false
      };
    } else {
      // Arrhenius Equation: Ea calculation
      // ln(k2/k1) = -Ea/R * (1/T2 - 1/T1) -> simplified to a clean direct prompt scenario
      const tempCelsius = Math.floor(20 + Math.random() * 30); // 20-50 C
      const tempK = tempCelsius + 273.15;
      const ea_kj = Math.floor(50 + Math.random() * 40); // 50-90 kJ/mol
      const A = 1.0e11;
      const R = 8.314;
      const k = A * Math.exp(-(ea_kj * 1000) / (R * tempK));

      newProb = {
        title: "The Arrhenius Equation",
        text: <>A reaction has a frequency factor (A) of <b>1.00 &times; 10<sup>11</sup> s<sup>-1</sup></b>. At a temperature of <b>{tempCelsius} &deg;C</b>, the rate constant (k) is determined to be <b>{k.toExponential(3)} s<sup>-1</sup></b>.</>,
        question: "Calculate the activation energy (Eₐ) for this reaction in kJ mol⁻¹.",
        label: "Eₐ =",
        correctAnswer: ea_kj.toString(),
        unit: "kJ mol⁻¹",
        hasUnits: false
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setStudentUnit('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { generateProblem('calculate_k'); }, []);

  const checkAnswer = () => {
    const userAns = parseFloat(studentAnswer);
    const correctAns = parseFloat(problem.correctAnswer);
    const error = Math.abs((userAns - correctAns) / correctAns);

    if (problem.hasUnits) {
      if (error < 0.02 && studentUnit === problem.correctUnit) {
        setFeedback({ message: "Correct! Both the rate constant value and units are perfectly accurate.", status: 'success' });
      } else if (error < 0.02 && studentUnit !== problem.correctUnit) {
        setFeedback({ message: "Value correct! However, your units are incorrect. Carefully write out the rate equation units and cancel them down.", status: 'error' });
      } else {
        setFeedback({ message: "Incorrect. Check your rearrangement: k = Rate / ([A][B]²).", status: 'error' });
      }
    } else {
      if (error < 0.02 || (problem.title.includes("Order") && studentAnswer.trim() === problem.correctAnswer)) {
        setFeedback({ message: `Correct! The value is ${problem.correctAnswer} ${problem.unit || ''}.`, status: 'success' });
      } else {
        setFeedback({ message: problem.title.includes("Order") ? "Incorrect. Compare how doubling the concentration changes the initial rate." : "Incorrect. Remember to convert temperature to Kelvin and use R = 8.314 J K⁻¹ mol⁻¹.", status: 'error' });
      }
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      {/* SELECTION NAVBAR */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <select 
          value={mode === 'random' ? '' : mode} 
          onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }} 
          className="chem-input" 
          style={{ width: 'auto' }}
        >
          <option value="calculate_k">Rate Constant (k)</option>
          <option value="determine_order">Deduce Order</option>
          <option value="arrhenius">Arrhenius (Eₐ)</option>
        </select>
        <button 
          onClick={() => { setMode('random'); generateProblem('random'); }} 
          className={`btn ${mode === 'random' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Random
        </button>
      </div>

      <div className="applet-header">{problem.title}</div>
      <div className="question-text">{problem.text}</div>
      <p className="font-bold mb-6 text-center">{problem.question}</p>

      {/* DYNAMIC RESPONSIVE INPUT GROUP */}
      <div className="input-group">
        <label>{problem.label}</label>
        <input 
          type="number" 
          className={`chem-input ${feedback.status}`}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="0.00"
        />

        {/* Conditionally Render Unit Selector to isolate Unit Discriminators */}
        {problem.hasUnits ? (
          <select 
            value={studentUnit} 
            onChange={(e) => setStudentUnit(e.target.value)}
            className={`chem-input ${feedback.status}`}
            style={{ width: 'auto' }}
          >
            <option value="">-- Select Units --</option>
            <option value="s-1">s⁻¹</option>
            <option value="mol-1 dm3 s-1">mol⁻¹ dm³ s⁻¹</option>
            <option value="mol-2 dm6 s-1">mol⁻² dm⁶ s⁻¹</option>
          </select>
        ) : (
          <span>{problem.unit}</span>
        )}
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

export default ReactionRates;
