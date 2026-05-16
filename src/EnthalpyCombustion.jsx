import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const EnthalpyCombustion = () => {
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const fuels = [
    { name: 'methanol', formula: 'CH₃OH', mr: 32.04 },
    { name: 'ethanol', formula: 'C₂H₅OH', mr: 46.07 },
    { name: 'propan-1-ol', formula: 'C₃H₇OH', mr: 60.10 },
    { name: 'butan-1-ol', formula: 'C₄H₉OH', mr: 74.12 }
  ];

  const generateProblem = () => {
    const fuel = fuels[Math.floor(Math.random() * fuels.length)];
    const massWater = Math.floor(Math.random() * 100 + 100); // 100-200g
    const tempRise = (Math.random() * 15 + 10).toFixed(1); // 10-25 C
    const massBurned = (Math.random() * 0.5 + 0.5).toFixed(2); // 0.5-1.0g
    
    // Q = mcΔT
    const q_joules = massWater * 4.18 * parseFloat(tempRise);
    // n = m / Mr
    const moles = parseFloat(massBurned) / fuel.mr;
    // ΔH = -Q / (n * 1000) for kJ/mol
    const deltaH = -(q_joules / (moles * 1000));

    setProblem({ fuel, massWater, tempRise, massBurned, correctH: deltaH });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
  };

  useEffect(() => { 
    generateProblem(); 
  }, []);

  const checkAnswer = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;
    
    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctH) / problem.correctH);

    if (error < 0.02) {
      setFeedback({ 
        type: 'success', 
        message: `Correct! ΔH = ${problem.correctH.toFixed(1)} kJ mol⁻¹. Don't forget the negative sign for exothermic processes!` 
      });
    } else if (Math.abs(userVal + problem.correctH) < Math.abs(problem.correctH * 0.02)) {
      setFeedback({ 
        type: 'error', 
        message: 'Close! Check your sign. Combustion is an exothermic process.' 
      });
    } else {
      setFeedback({ 
        type: 'error', 
        message: 'Incorrect. Calculate energy change (mcΔT), then divide by moles burned and convert J to kJ.' 
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      <div className="applet-header">Enthalpy of Combustion</div>

      <div className="question-text text-center">
        <p>
          In a calorimetry experiment, <b>{problem.massBurned} g</b> of <b>{problem.fuel.name}</b> ({problem.fuel.formula}) 
          was burned in air. The energy released was used to heat <b>{problem.massWater} g</b> of water. 
          The temperature of the water rose by <b>{problem.tempRise} °C</b>.
        </p>
        <p className="text-xs italic mt-3" style={{ color: 'var(--chem-text-muted)' }}>
          (Specific heat capacity of water, c = 4.18 J g⁻¹ °C⁻¹)
        </p>
      </div>

      {/* --- STANDARDIZED ACTION QUESTION BLOCK --- */}
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Calculate the enthalpy of combustion for {problem.fuel.name} in kJ mol⁻¹.
      </div>

      <ScientificInput 
        value={coeff} 
        exponent={exp} 
        onValueChange={setCoeff} 
        onExponentChange={setExp}
        label="ΔH ="
        status={feedback.type}
      />

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={generateProblem}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default EnthalpyCombustion;
