import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const EntropyGibbs = () => {
  const [mode, setMode] = useState('calculate_dg');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const systems = [
    { eq: 'CaCO₃(s) → CaO(s) + CO₂(g)', dh: 178.0, ds: 160.4 },
    { eq: 'N₂(g) + 3H₂(g) → 2NH₃(g)', dh: -92.2, ds: -198.3 },
    { eq: '2H₂O(l) → 2H₂(g) + O₂(g)', dh: 571.6, ds: 326.3 },
    { eq: 'C(s) + H₂O(g) → CO(g) + H₂(g)', dh: 131.3, ds: 133.7 }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['calculate_dg', 'calculate_threshold'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    const sys = systems[Math.floor(Math.random() * systems.length)];
    const tempCelsius = Math.floor(Math.random() * 800 + 25); // 25°C to 825°C
    const tempKelvin = tempCelsius + 273;

    let questionText = '';
    let targetLabel = '';
    let correctAnswer = 0;
    let unitExpectation = '';

    if (targetMode === 'calculate_dg') {
      questionText = `For the reaction ${sys.eq}, thermodynamic parameters are established as ΔH = ${sys.dh} kJ mol⁻¹ and ΔS = ${sys.ds} J K⁻¹ mol⁻¹. Calculate the value of Gibbs Free Energy change (ΔG) at a temperature of ${tempCelsius} °C.`;
      targetLabel = 'ΔG =';
      // ΔG = ΔH - (T * ΔS / 1000)
      correctAnswer = sys.dh - (tempKelvin * (sys.ds / 1000));
      unitExpectation = 'kJ mol⁻¹';
    } else {
      questionText = `A specific chemical process exhibits ΔH = ${sys.dh} kJ mol⁻¹ and ΔS = ${sys.ds} J K⁻¹ mol⁻¹ for the system: ${sys.eq}. Calculate the minimum threshold temperature in Kelvin (K) at which this reaction transitions to become thermodynamically feasible.`;
      targetLabel = 'T =';
      // T = ΔH * 1000 / ΔS
      correctAnswer = (sys.dh * 1000) / sys.ds;
      unitExpectation = 'K';
    }

    setProblem({ questionText, targetLabel, correctAnswer, targetMode, unitExpectation });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem('calculate_dg');
  }, []);

  const checkAnswer = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;

    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctAnswer) / problem.correctAnswer);

    if (error < 0.025) {
      setFeedback({
        type: 'success',
        message: 'Correct! Your value perfectly satisfies the foundational Gibbs feasibility criteria.'
      });
    } else {
      let hint = 'Incorrect. ';
      if (problem.targetMode === 'calculate_dg') {
        hint += 'Remember to divide your Entropy value (ΔS) by 1000 before combining it with Enthalpy (ΔH), and ensure temperature is parsed in Kelvin (T = °C + 273).';
      } else {
        hint += 'Spontaneity initiates when ΔG = 0, which scales the expression coordinates to T = ΔH / ΔS. Don\'t forget to convert kJ to J or vice versa!';
      }
      setFeedback({ type: 'error', message: hint });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center gap-2">
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm text-center"
          >
            <option value="calculate_dg">Calculate Free Energy (ΔG)</option>
            <option value="calculate_threshold">Feasibility Temperature (T)</option>
          </select>
          <button type="button" onClick={() => generateProblem('random')} className="px-4 py-2.5 text-xs font-black uppercase bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shrink-0">
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header">Entropy & Gibbs Free Energy</div>
      <div className="question-text text-center px-2 leading-relaxed">{problem.questionText}</div>

      <div className="w-full flex items-center justify-center my-6 overflow-x-auto">
        <div className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
          <ScientificInput value={coeff} exponent={exp} onValueChange={setCoeff} onExponentChange={setExp} label={problem.targetLabel} status={feedback.type} />
          <span className="text-sm font-bold text-slate-500 ml-1 select-none">{problem.unitExpectation}</span>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>{feedback.message}</div>}
    </div>
  );
};

export default EntropyGibbs;
