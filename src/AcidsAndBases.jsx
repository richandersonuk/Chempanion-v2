import React, { useState, useEffect } from 'react';

const AcidsAndBases = () => {
  const [mode, setMode] = useState('strong_acid');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['strong_acid', 'weak_acid', 'pka_ka'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    let newProb = {};
    const strongAcids = ['HCl', 'HNO₃'];
    const weakAcids = [
      { name: 'ethanoic acid', formula: 'CH₃COOH', ka: 1.74e-5 },
      { name: 'methanoic acid', formula: 'HCOOH', ka: 1.78e-4 },
      { name: 'propanoic acid', formula: 'C₂H₅COOH', ka: 1.35e-5 }
    ];

    if (targetMode === 'strong_acid') {
      const acid = strongAcids[Math.floor(Math.random() * strongAcids.length)];
      const conc = parseFloat((0.01 + Math.random() * 0.15).toFixed(3));
      // pH = -log10[H+]
      const pH = -Math.log10(conc);

      newProb = {
        title: "pH of a Strong Monoprotic Acid",
        text: <>Calculate the pH of a <b>{conc.toFixed(3)} mol dm⁻³</b> sample of {acid}.</>,
        question: "State your answer to the standard required decimal precision.",
        label: "pH =",
        unit: "",
        correct: pH.toFixed(2) // Hard-coded target string to 2 dp
      };

    } else if (targetMode === 'weak_acid') {
      const acid = weakAcids[Math.floor(Math.random() * weakAcids.length)];
      const conc = parseFloat((0.05 + Math.random() * 0.20).toFixed(2));
      // [H+] = sqrt(Ka * c)
      const hPlus = Math.sqrt(acid.ka * conc);
      const pH = -Math.log10(hPlus);

      newProb = {
        title: "pH of a Weak Acid",
        text: <>A solution of {acid.name} ({acid.formula}) has a concentration of <b>{conc.toFixed(2)} mol dm⁻³</b>.</>,
        question: "Utilise your Data Booklet to retrieve the appropriate Ka value, then calculate the pH of the solution.",
        label: "pH =",
        unit: "",
        correct: pH.toFixed(2)
      };

    } else if (targetMode === 'pka_ka') {
      const acid = weakAcids[Math.floor(Math.random() * weakAcids.length)];
      const pKa = -Math.log10(acid.ka);

      const askForKa = Math.random() > 0.5;

      newProb = {
        title: "Equilibrium Constant Conversions",
        text: askForCarbonate 
          ? <>An organic weak acid has a recorded pKₐ value of <b>{pKa.toFixed(2)}</b>.</>
          : <>The dissociation constant (Kₐ) for {acid.name} is <b>{acid.ka.toExponential(2)} mol dm⁻³</b>.</>,
        question: askForCarbonate 
          ? "Calculate the value of Ka for this acid." 
          : "Calculate the value of pKa for this acid.",
        label: askForCarbonate ? "Kₐ =" : "pKₐ =",
        unit: askForCarbonate ? "mol dm⁻³" : "",
        correct: askForCarbonate ? acid.ka.toExponential(2) : pKa.toFixed(2)
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { 
    generateProblem('strong_acid'); 
  }, []);

  const checkAnswer = () => {
    const rawInput = studentAnswer.trim();
    if (!rawInput) return;

    const userVal = parseFloat(rawInput);
    const correctVal = parseFloat(problem.correct);

    // --- WJEC STRINGS LEVEL PRECISION ENFORCEMENT ---
    if (problem.label.includes('pH') || problem.label.includes('pKₐ')) {
      const decimalPart = rawInput.split('.')[1];
      if (!decimalPart || decimalPart.length !== 2) {
        setFeedback({ 
          message: "WJEC Accuracy Trap! Calculated pH and pKa values must ALWAYS be stated to exactly two decimal places (e.g. 2.40 or 3.65), even if it ends in a trailing zero.", 
          status: 'error' 
        });
        return;
      }
    }

    // Standard scientific matching for Ka scientific formats
    if (problem.label.includes('Kₐ')) {
      const error = Math.abs((userVal - correctVal) / correctVal);
      if (error < 0.03) {
        setFeedback({ message: `Correct! Ka = ${problem.correct} mol dm⁻³.`, status: 'success' });
      } else {
        setFeedback({ message: `Incorrect. To convert pKa back to Ka, use the inverse function: Ka = 10^(-pKa).`, status: 'error' });
      }
      return;
    }

    // Checking pH precision answers
    if (Math.abs(userVal - correctVal) < 0.015) {
      setFeedback({ message: `Correct! Value matches specification baseline requirements.`, status: 'success' });
    } else {
      let hint = "Incorrect. ";
      if (mode === 'strong_acid') {
        hint += "Strong acids fully dissociate. Use pH = -log10[H+], where [H+] is equal to the concentration of the acid.";
      } else {
        hint += "For a weak acid, use the simplified equilibrium expression [H+] = √(Ka × c) before taking the negative logarithm.";
      }
      setFeedback({ message: hint, status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      
      {/* --- PRACTICE MODE DROPDOWN --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4" style={{ textTransform: 'none' }}>
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center gap-2" style={{ textTransform: 'none' }}>
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm text-center"
            style={{ textTransform: 'none' }}
          >
            <option value="strong_acid">Calculate pH: Strong Acids</option>
            <option value="weak_acid">Calculate pH: Weak Acids</option>
            <option value="pka_ka">Convert between Ka and pKa</option>
          </select>
          
          <button
            type="button"
            onClick={() => { generateProblem('random'); }}
            className={`px-4 py-2.5 text-xs font-black uppercase rounded-xl transition-all border shrink-0 ${
              mode === 'random' ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header" style={{ textTransform: 'none' }}>{problem.title}</div>
      <div className="question-text text-center px-2 leading-relaxed" style={{ textTransform: 'none' }}>{problem.text}</div>

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      {/* --- CASE PROTECTED INTERACTIVE LAYOUT INPUT CELL --- */}
      <div className="w-full flex items-center justify-center my-6 overflow-x-auto" style={{ textTransform: 'none' }}>
        <div 
          className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
          style={{ textTransform: 'none' }}
        >
          <label className="text-sm font-black text-slate-600 select-none" style={{ textTransform: 'none' }}>{problem.label}</label>
          <input 
            type="text" 
            className={`chem-input ${feedback.status}`}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder={problem.label.includes('Kₐ') ? "1.23e-5" : "0.00"}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            style={{ maxWidth: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', textTransform: 'none' }}
          />
          {problem.unit && <span className="text-sm font-black text-slate-500 select-none" style={{ textTransform: 'none' }}>{problem.unit}</span>}
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default AcidsAndBases;
