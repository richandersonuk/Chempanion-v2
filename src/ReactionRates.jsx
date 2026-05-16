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
      const concA = (0.10 + Math.random() * 0.15).toFixed(2);
      const concB = (0.20 + Math.random() * 0.20).toFixed(2);
      const kVal = (0.5 + Math.random() * 2.5).toFixed(2);
      const rate = parseFloat(kVal) * parseFloat(concA) * Math.pow(parseFloat(concB), 2);
      
      newProb = {
        title: "Calculating the Rate Constant (k)",
        text: (
          <>
            A reaction follows the rate equation: <b>Rate = k[A][B]<sup>2</sup></b>.<br />
            At a specific temperature, an experiment yields the following data:<br />
            [A] = <b>{concA} mol dm<sup>-3</sup></b><br />
            [B] = <b>{concB} mol dm<sup>-3</sup></b><br />
            Initial Rate = <b>{rate.toFixed(5)} mol dm<sup>-3</sup> s<sup>-1</sup></b>
          </>
        ),
        question: "Calculate the value of the rate constant (k) and select its correct units.",
        label: "k =",
        correctAnswer: kVal,
        correctUnit: "mol-2 dm6 s-1",
        hasUnits: true
      };
    } else if (targetMode === 'determine_order') {
      const order = Math.floor(Math.random() * 3);
      const baseRate = 0.0012;
      const rate2 = order === 0 ? baseRate : (order === 1 ? baseRate * 2 : baseRate * 4);

      newProb = {
        title: "Deducing Reaction Order",
        text: (
          <>
            The table below shows initial rate data obtained for a reactant, <b>X</b>, at a constant temperature:<br /><br />
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
          </>
        ),
        question: "Deduce the order of reaction with respect to reactant X.",
        label: "Order =",
        correctAnswer: order.toString(),
        hasUnits: false
      };
    } else {
      const tempCelsius = Math.floor(20 + Math.random() * 30);
      const tempK = tempCelsius + 273.15;
      const ea_kj = Math.floor(50 + Math.random() * 40);
      const A = 1.0e11;
      const R = 8.314;
      const k = A * Math.exp(-(ea_kj * 1000) / (R * tempK));

      newProb = {
        title: "The Arrhenius Equation",
        text: (
          <>
            A reaction has a frequency factor (A) of <b>1.00 × 10<sup>11</sup> s<sup>-1</sup></b>.<br />
            At a temperature of <b>{tempCelsius}°C</b>, the rate constant (k) is determined to be <b>{k.toExponential(3)} s<sup>-1</sup></b>.
          </>
        ),
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

  useEffect(() => {
    generateProblem('calculate_k');
  }, []);

  const checkAnswer = () => {
    if (!problem) return;
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
      if (problem.title.includes("Order")) {
        if (studentAnswer.trim() === problem.correctAnswer) {
          setFeedback({ message: `Correct! The reaction is order ${problem.correctAnswer}.`, status: 'success' });
        } else {
          setFeedback({ message: "Incorrect. Compare how doubling the concentration changes the initial rate.", status: 'error' });
        }
      } else {
        if (error < 0.02) {
          setFeedback({ message: `Correct! The value is ${problem.correctAnswer} ${problem.unit}.`, status: 'success' });
        } else {
          setFeedback({ message: "Incorrect. Remember to convert temperature to Kelvin and use R = 8.314 J K⁻¹ mol⁻¹.", status: 'error' });
        }
      }
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
      <option value="calculate_k">Rate Constant (k)</option>
      <option value="determine_order">Deduce Reaction Order</option>
      <option value="arrhenius">Arrhenius Equation (Ea)</option>
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


      <div className="applet-header">{problem.title}</div>
      <div className="question-text text-center">{problem.text}</div>
      
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        {problem.question}
      </div>

      {/* INPUT INTERFACE WRAPPER BLOCK */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto mb-4">
        <div className="flex items-center justify-center w-full">
          <span style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{problem.label}</span>
          <input 
            type="number" 
            className={`chem-input ${feedback.status}`}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="0.00"
            style={{ maxWidth: '12rem', textAlign: 'center' }}
          />
          {!problem.hasUnits && <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{problem.unit}</span>}
        </div>

        {/* --- UNIFIED HOUSESTYLE COMPLIANT UNIT GRID SECTOR --- */}
        {problem.hasUnits && (
          <div className="chem-choice-section mt-2">
            <span className="chem-choice-label">Select Units</span>
            <div className="chem-choice-group">
              {[
                { id: 's-1', display: <>s<sup>-1</sup></> },
                { id: 'mol-1 dm3 s-1', display: <>mol<sup>-1</sup> dm<sup>3</sup> s<sup>-1</sup></> },
                { id: 'mol-2 dm6 s-1', display: <>mol<sup>-2</sup> dm<sup>6</sup> s<sup>-1</sup></> }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStudentUnit(opt.id)}
                  className={`chem-choice-btn ${studentUnit === opt.id ? 'active' : ''}`}
                >
                  {opt.display}
                </button>
              ))}
            </div>
          </div>
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
