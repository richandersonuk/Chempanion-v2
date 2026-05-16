import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const KpCalculations = () => {
  const [mode, setMode] = useState('mole_fractions');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const reactions = [
    {
      eq: 'N₂O₄(g) ⇌ 2NO₂(g)',
      id: 'n2o4',
      units: 'kPa',
      calcKp: (p) => Math.pow(p.no2, 2) / p.n2o4
    },
    {
      eq: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g)',
      id: 'so3',
      units: 'atm⁻¹',
      calcKp: (p) => Math.pow(p.so3, 2) / (Math.pow(p.so2, 2) * p.o2)
    }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['direct_kp', 'mole_fractions', 'dissociation_alpha'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    const rxn = reactions[Math.floor(Math.random() * reactions.length)];
    const useAtm = Math.random() > 0.5;
    const pTotal = useAtm ? parseFloat((Math.random() * 3 + 1.2).toFixed(2)) : Math.floor(Math.random() * 200 + 100);
    const pUnit = useAtm ? 'atm' : 'kPa';

    let questionText = '';
    let targetLabel = 'Kp =';
    let correctAnswer = 0;
    let unitExpectation = rxn.id === 'n2o4' ? pUnit : `${pUnit}⁻¹`;

    if (targetMode === 'direct_kp') {
      if (rxn.id === 'n2o4') {
        const pN2o4 = parseFloat((pTotal * 0.4).toFixed(2));
        const pNo2 = parseFloat((pTotal * 0.6).toFixed(2));
        questionText = `An equilibrium mixture of dinitrogen tetroxide and nitrogen dioxide gases yields the following partial pressures: p(N₂O₄) = ${pN2o4} ${pUnit} and p(NO₂) = ${pNo2} ${pUnit}. Calculate Kp for the system: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({ n2o4: pN2o4, no2: pNo2 });
      } else {
        const pSo2 = parseFloat((pTotal * 0.25).toFixed(2));
        const pO2 = parseFloat((pTotal * 0.15).toFixed(2));
        const pSo3 = parseFloat((pTotal * 0.6).toFixed(2));
        questionText = `Contact process components stabilize at a given temperature to give partial pressures of p(SO₂) = ${pSo2} ${pUnit}, p(O₂) = ${pO2} ${pUnit}, and p(SO₃) = ${pSo3} ${pUnit}. Calculate Kp for the system: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({ so2: pSo2, o2: pO2, so3: pSo3 });
      }

    } else if (targetMode === 'mole_fractions') {
      // High frequency examiner mistake: summing equilibrium moles incorrectly or swapping mole fractions
      if (rxn.id === 'n2o4') {
        const molesN2o4 = 0.45;
        const molesNo2 = 0.35;
        const totalMoles = molesN2o4 + molesNo2;
        questionText = `A gas cylinder held at a total pressure of ${pTotal} ${pUnit} contains an equilibrium mixture of ${molesN2o4} mol of N₂O₄ and ${molesNo2} mol of NO₂. Calculate the value of Kp for the process: ${rxn.eq}.`;
        
        const pN2o4 = (molesN2o4 / totalMoles) * pTotal;
        const pNo2 = (molesNo2 / totalMoles) * pTotal;
        correctAnswer = rxn.calcKp({ n2o4: pN2o4, no2: pNo2 });
      } else {
        const molesSo2 = 0.20;
        const molesO2 = 0.10;
        const molesSo3 = 0.70;
        const totalMoles = molesSo2 + molesO2 + molesSo3;
        questionText = `An equilibrium mixture for the system ${rxn.eq} contains ${molesSo2} mol of SO₂, ${molesO2} mol of O₂, and ${molesSo3} mol of SO₃. If the total pressure is ${pTotal} ${pUnit}, calculate Kp.`;
        
        const pSo2 = (molesSo2 / totalMoles) * pTotal;
        const pO2 = (molesO2 / totalMoles) * pTotal;
        const pSo3 = (molesSo3 / totalMoles) * pTotal;
        correctAnswer = rxn.calcKp({ so2: pSo2, o2: pO2, so3: pSo3 });
      }

    } else if (targetMode === 'dissociation_alpha') {
      // Advanced A-Level algebraic analysis: Dissociation constant alpha (%)
      const initN2o4 = 1.00;
      const alphaPercent = Math.floor(Math.random() * 30 + 20); // 20% - 50%
      const alpha = alphaPercent / 100;
      
      const eqN2o4 = initN2o4 - alpha;
      const eqNo2 = 2 * alpha;
      const totalMoles = eqN2o4 + eqNo2;

      questionText = `A sample of pure N₂O₄(g) is placed into a reactor and allowed to reach equilibrium at a total fixed pressure of ${pTotal} ${pUnit}. Analysis shows that ${alphaPercent}% of the N₂O₄ has dissociated. Deduce Kp for the process: N₂O₄(g) ⇌ 2NO₂(g).`;
      
      const pN2o4 = (eqN2o4 / totalMoles) * pTotal;
      const pNo2 = (eqNo2 / totalMoles) * pTotal;
      correctAnswer = Math.pow(pNo2, 2) / pN2o4;
      unitExpectation = pUnit;
    }

    setProblem({ questionText, targetLabel, correctAnswer, targetMode, unitExpectation });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem('mole_fractions');
  }, []);

  const checkAnswer = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;

    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctAnswer) / problem.correctAnswer);

    // 3% tolerance account handles rounding drifts caused by intermediate mole fraction divisions
    if (error < 0.03) {
      setFeedback({
        type: 'success',
        message: 'Correct! Your value perfectly matches the parsed partial pressure calculation parameters.'
      });
    } else {
      let recoveryHint = 'Incorrect. ';
      if (problem.targetMode === 'mole_fractions') {
        recoveryHint += 'Remember to calculate the total moles at equilibrium first. Then, find individual mole fractions (moles of gas / total moles) and multiply by the total pressure to find each component\'s partial pressure before solving Kp.';
      } else if (problem.targetMode === 'dissociation_alpha') {
        recoveryHint += 'If x mol dissociates, you lose x mol of N₂O₄ but gain 2x mol of NO₂. Recalculate your equilibrium mole sum row using this stoichiometry ratio.';
      } else {
        recoveryHint += 'Ensure you raise each partial pressure to the power of its stoichiometric coefficient from the balanced equation.';
      }
      setFeedback({ type: 'error', message: recoveryHint });
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
            <option value="direct_kp">Partial Pressures → Kp</option>
            <option value="mole_fractions">Equilibrium Moles + P(total) → Kp</option>
            <option value="dissociation_alpha">Percentage Dissociation (%) → Kp</option>
          </select>
          
          <button
            type="button"
            onClick={() => { generateProblem('random'); }}
            className="px-4 py-2.5 text-xs font-black uppercase bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shrink-0"
          >
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header">Kp Equilibrium Constants</div>

      <div className="question-text text-center px-2 leading-relaxed">
        {problem.questionText}
      </div>

      <div className="w-full flex items-center justify-center my-6 overflow-x-auto">
        <div className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
          <ScientificInput 
            value={coeff} 
            exponent={exp} 
            onValueChange={setCoeff} 
            onExponentChange={setExp}
            label={problem.targetLabel}
            status={feedback.type}
          />
          <span className="text-sm font-bold text-slate-500 ml-1 select-none">
            {problem.unitExpectation}
          </span>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default KpCalculations;
