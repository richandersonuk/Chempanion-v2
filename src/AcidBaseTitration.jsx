import React, { useState, useEffect } from 'react';

const AcidBaseTitration = () => {
  const [mode, setMode] = useState('standard');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['standard', 'back_titration'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    let newProb = {};

    if (targetMode === 'standard') {
      const volBase = 25.0;
      const concAcid = (0.05 + Math.random() * 0.1).toFixed(3);
      const titre = (15 + Math.random() * 15).toFixed(2);
      
      // moles acid = conc * vol / 1000
      // 1:1 ratio for NaOH/HCl
      const concBase = (parseFloat(concAcid) * parseFloat(titre)) / volBase;

      newProb = {
        title: "Standard Titration",
        text: <>A <b>25.0 cm<sup>3</sup></b> sample of sodium hydroxide solution was titrated against <b>{concAcid} mol dm<sup>-3</sup></b> hydrochloric acid. The mean titre was <b>{titre} cm<sup>3</sup></b>.</>,
        question: "Calculate the concentration of the sodium hydroxide solution.",
        label: "[NaOH] =",
        unit: "mol dm⁻³",
        correct: concBase.toFixed(3)
      };
    } else {
      // Back Titration: CaCO3 + 2HCl -> CaCl2 + H2O + CO2
      // Then excess HCl + NaOH -> NaCl + H2O
      const massMarble = (0.2 + Math.random() * 0.1).toFixed(3); // g of CaCO3
      const volHClAdded = 50.0;
      const concHCl = 0.100;
      const titreNaOH = (20 + Math.random() * 10).toFixed(2);
      const concNaOH = 0.100;

      const molesHClTotal = (volHClAdded * concHCl) / 1000;
      const molesNaOHUsed = (parseFloat(titreNaOH) * concNaOH) / 1000;
      const molesHClExcess = molesNaOHUsed; // 1:1 ratio
      const molesHClReacted = molesHClTotal - molesHClExcess;
      const molesCaCO3 = molesHClReacted / 2; // 1:2 ratio
      const massPure = molesCaCO3 * 100.1;
      const purity = (massPure / parseFloat(massMarble)) * 100;

      newProb = {
        title: "Back Titration: % Purity",
        text: <>A student added <b>{volHClAdded}.0 cm<sup>3</sup></b> of <b>{concHCl.toFixed(3)} mol dm<sup>-3</sup></b> HCl to a <b>{massMarble} g</b> sample of impure calcium carbonate. The resulting solution was made up to 100 cm<sup>3</sup> and a 25.0 cm<sup>3</sup> portion required <b>{titreNaOH} cm<sup>3</sup></b> of <b>{concNaOH.toFixed(3)} mol dm<sup>-3</sup></b> NaOH for neutralisation. (Simplified for single-stage calculation).</>,
        question: "Calculate the percentage purity of the calcium carbonate.",
        label: "% Purity =",
        unit: "%",
        correct: purity.toFixed(1)
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { 
    generateProblem('standard'); 
  }, []);

  const checkAnswer = () => {
    const userVal = parseFloat(studentAnswer);
    const correctVal = parseFloat(problem.correct);
    const error = Math.abs((userVal - correctVal) / correctVal);

    if (error < 0.02) {
      setFeedback({ message: `Correct! The value is ${problem.correct} ${problem.unit}.`, status: 'success' });
    } else {
      setFeedback({ message: `Incorrect. Check your stoichiometry and volume conversions.`, status: 'error' });
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
      <option value="standard">Standard Titration (1:1 Ratio)</option>
      <option value="back_titration">Back Titration Calculations</option>
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

      {/* INPUT INTERFACE */}
      <div className="input-group">
        <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{problem.label}</label>
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

export default AcidBaseTitration;
