import React, { useState, useEffect } from 'react';
import ScientificInput from '../../components/shared/ScientificInput';

const KpCalculations = ({ onComplete }) => {
  const [mode, setMode] = useState('mole_fractions');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const reactions = [
    {
      eq: 'N₂O₄(g) ⇌ 2NO₂(g)',
      id: 'n2o4',
      unitFn: (u) => u,
      calcKp: (p) => Math.pow(p.no2, 2) / p.n2o4
    },
    {
      eq: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g)',
      id: 'so3',
      unitFn: (u) => `${u}⁻¹`,
      calcKp: (p) => Math.pow(p.so3, 2) / (Math.pow(p.so2, 2) * p.o2)
    },
    {
      eq: 'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)',
      id: 'pcl5',
      unitFn: (u) => u,
      calcKp: (p) => (p.pcl3 * p.cl2) / p.pcl5
    },
    {
      eq: 'CO(g) + 2H₂(g) ⇌ CH₃OH(g)',
      id: 'methanol',
      unitFn: (u) => `${u}⁻²`,
      calcKp: (p) => p.ch3oh / (p.co * Math.pow(p.h2, 2))
    },
    {
      eq: '2HI(g) ⇌ H₂(g) + I₂(g)',
      id: 'hi',
      unitFn: () => 'no units',
      calcKp: (p) => (p.h2 * p.i2) / Math.pow(p.hi, 2)
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
    const targetLabel = 'Kp =';
    let correctAnswer = 0;
    let unitExpectation = rxn.unitFn(pUnit);
    let alphaHint = 'Construct an ICE table for initial moles and reacted moles to find total equilibrium moles before calculating mole fractions.';

    const randMoles = (min = 0.15, span = 0.75) => parseFloat((min + Math.random() * span).toFixed(2));

    if (targetMode === 'direct_kp') {
      if (rxn.id === 'n2o4') {
        const pN2o4 = parseFloat((pTotal * (0.25 + Math.random() * 0.35)).toFixed(2));
        const pNo2 = parseFloat((pTotal - pN2o4).toFixed(2));
        questionText = `An equilibrium mixture of dinitrogen tetroxide and nitrogen dioxide gases yields partial pressures: p(N₂O₄) = ${pN2o4} ${pUnit} and p(NO₂) = ${pNo2} ${pUnit}. Calculate Kp for: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({ n2o4: pN2o4, no2: pNo2 });
      } else if (rxn.id === 'so3') {
        const pSo2 = parseFloat((pTotal * 0.22).toFixed(2));
        const pO2 = parseFloat((pTotal * 0.18).toFixed(2));
        const pSo3 = parseFloat((pTotal * 0.60).toFixed(2));
        questionText = `Contact process gases reach equilibrium with partial pressures p(SO₂) = ${pSo2} ${pUnit}, p(O₂) = ${pO2} ${pUnit}, and p(SO₃) = ${pSo3} ${pUnit}. Calculate Kp for: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({ so2: pSo2, o2: pO2, so3: pSo3 });
      } else if (rxn.id === 'pcl5') {
        const pPcl5 = parseFloat((pTotal * 0.34).toFixed(2));
        const pPcl3 = parseFloat((pTotal * 0.33).toFixed(2));
        const pCl2 = parseFloat((pTotal - pPcl5 - pPcl3).toFixed(2));
        questionText = `At equilibrium, partial pressures in a phosphorus chloride flask are p(PCl₅) = ${pPcl5} ${pUnit}, p(PCl₃) = ${pPcl3} ${pUnit}, and p(Cl₂) = ${pCl2} ${pUnit}. Calculate Kp for: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({ pcl5: pPcl5, pcl3: pPcl3, cl2: pCl2 });
      } else if (rxn.id === 'methanol') {
        const pCo = parseFloat((pTotal * 0.25).toFixed(2));
        const pH2 = parseFloat((pTotal * 0.40).toFixed(2));
        const pCh3oh = parseFloat((pTotal * 0.35).toFixed(2));
        questionText = `Methanol synthesis gases reach equilibrium at p(CO) = ${pCo} ${pUnit}, p(H₂) = ${pH2} ${pUnit}, and p(CH₃OH) = ${pCh3oh} ${pUnit}. Calculate Kp for: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({ co: pCo, h2: pH2, ch3oh: pCh3oh });
      } else {
        const pHi = parseFloat((pTotal * 0.64).toFixed(2));
        const pH2 = parseFloat((pTotal * 0.18).toFixed(2));
        const pI2 = parseFloat((pTotal * 0.18).toFixed(2));
        questionText = `Hydrogen iodide decomposes to an equilibrium mixture with partial pressures p(HI) = ${pHi} ${pUnit}, p(H₂) = ${pH2} ${pUnit}, and p(I₂) = ${pI2} ${pUnit}. Calculate Kp for: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({ hi: pHi, h2: pH2, i2: pI2 });
      }

    } else if (targetMode === 'mole_fractions') {
      if (rxn.id === 'n2o4') {
        const molesN2o4 = randMoles(0.25, 0.55);
        const molesNo2 = randMoles(0.20, 0.60);
        const totalMoles = molesN2o4 + molesNo2;
        questionText = `A gas cylinder held at a total pressure of ${pTotal} ${pUnit} contains an equilibrium mixture of ${molesN2o4} mol of N₂O₄ and ${molesNo2} mol of NO₂. Calculate Kp for: ${rxn.eq}.`;
        correctAnswer = rxn.calcKp({
          n2o4: (molesN2o4 / totalMoles) * pTotal,
          no2: (molesNo2 / totalMoles) * pTotal
        });
      } else if (rxn.id === 'so3') {
        const molesSo2 = randMoles(0.15, 0.35);
        const molesO2 = randMoles(0.10, 0.25);
        const molesSo3 = randMoles(0.45, 0.55);
        const totalMoles = molesSo2 + molesO2 + molesSo3;
        questionText = `An equilibrium mixture for ${rxn.eq} contains ${molesSo2} mol of SO₂, ${molesO2} mol of O₂, and ${molesSo3} mol of SO₃ at a total pressure of ${pTotal} ${pUnit}. Calculate Kp.`;
        correctAnswer = rxn.calcKp({
          so2: (molesSo2 / totalMoles) * pTotal,
          o2: (molesO2 / totalMoles) * pTotal,
          so3: (molesSo3 / totalMoles) * pTotal
        });
      } else if (rxn.id === 'pcl5') {
        const molesPcl5 = randMoles(0.20, 0.50);
        const molesPcl3 = randMoles(0.20, 0.45);
        const molesCl2 = randMoles(0.20, 0.45);
        const totalMoles = molesPcl5 + molesPcl3 + molesCl2;
        questionText = `At a total pressure of ${pTotal} ${pUnit}, an equilibrium vessel for ${rxn.eq} contains ${molesPcl5} mol of PCl₅, ${molesPcl3} mol of PCl₃, and ${molesCl2} mol of Cl₂. Calculate Kp.`;
        correctAnswer = rxn.calcKp({
          pcl5: (molesPcl5 / totalMoles) * pTotal,
          pcl3: (molesPcl3 / totalMoles) * pTotal,
          cl2: (molesCl2 / totalMoles) * pTotal
        });
      } else if (rxn.id === 'methanol') {
        const molesCo = randMoles(0.20, 0.40);
        const molesH2 = randMoles(0.35, 0.65);
        const molesCh3oh = randMoles(0.15, 0.40);
        const totalMoles = molesCo + molesH2 + molesCh3oh;
        questionText = `An equilibrium mixture for ${rxn.eq} contains ${molesCo} mol of CO, ${molesH2} mol of H₂, and ${molesCh3oh} mol of CH₃OH at a total pressure of ${pTotal} ${pUnit}. Calculate Kp.`;
        correctAnswer = rxn.calcKp({
          co: (molesCo / totalMoles) * pTotal,
          h2: (molesH2 / totalMoles) * pTotal,
          ch3oh: (molesCh3oh / totalMoles) * pTotal
        });
      } else {
        const molesHi = randMoles(0.60, 0.80);
        const molesH2 = randMoles(0.15, 0.30);
        const molesI2 = randMoles(0.15, 0.30);
        const totalMoles = molesHi + molesH2 + molesI2;
        questionText = `An equilibrium gas mixture for ${rxn.eq} contains ${molesHi} mol of HI, ${molesH2} mol of H₂, and ${molesI2} mol of I₂ at a total pressure of ${pTotal} ${pUnit}. Calculate Kp.`;
        correctAnswer = rxn.calcKp({
          hi: (molesHi / totalMoles) * pTotal,
          h2: (molesH2 / totalMoles) * pTotal,
          i2: (molesI2 / totalMoles) * pTotal
        });
      }

    } else if (targetMode === 'dissociation_alpha') {
      const dissocRxns = [
        {
          id: 'n2o4',
          eq: 'N₂O₄(g) ⇌ 2NO₂(g)',
          name: 'N₂O₄(g)',
          unitFn: (u) => u,
          hint: 'For N₂O₄ ⇌ 2NO₂, losing x mol of N₂O₄ produces 2x mol of NO₂.'
        },
        {
          id: 'pcl5',
          eq: 'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)',
          name: 'PCl₅(g)',
          unitFn: (u) => u,
          hint: 'For PCl₅ ⇌ PCl₃ + Cl₂, losing x mol of PCl₅ yields x mol of PCl₃ and x mol of Cl₂.'
        },
        {
          id: 'hi',
          eq: '2HI(g) ⇌ H₂(g) + I₂(g)',
          name: 'HI(g)',
          unitFn: () => 'no units',
          hint: 'For 2HI ⇌ H₂ + I₂, losing 2x mol of HI yields x mol of H₂ and x mol of I₂ (total moles remain constant).'
        }
      ];
      const chosen = dissocRxns[Math.floor(Math.random() * dissocRxns.length)];
      const initOptions = [0.50, 1.00, 1.50, 2.00];
      const initMoles = initOptions[Math.floor(Math.random() * initOptions.length)];
      const alphaPercent = Math.floor(Math.random() * 40 + 15);
      const reacted = initMoles * (alphaPercent / 100);

      if (chosen.id === 'n2o4') {
        const eqN2o4 = initMoles - reacted;
        const eqNo2 = 2 * reacted;
        const total = eqN2o4 + eqNo2;
        const pN2o4 = (eqN2o4 / total) * pTotal;
        const pNo2 = (eqNo2 / total) * pTotal;
        correctAnswer = Math.pow(pNo2, 2) / pN2o4;
      } else if (chosen.id === 'pcl5') {
        const eqPcl5 = initMoles - reacted;
        const eqPcl3 = reacted;
        const eqCl2 = reacted;
        const total = eqPcl5 + eqPcl3 + eqCl2;
        const pPcl5 = (eqPcl5 / total) * pTotal;
        const pPcl3 = (eqPcl3 / total) * pTotal;
        const pCl2 = (eqCl2 / total) * pTotal;
        correctAnswer = (pPcl3 * pCl2) / pPcl5;
      } else {
        const eqHi = initMoles - reacted;
        const eqH2 = reacted / 2;
        const eqI2 = reacted / 2;
        const total = eqHi + eqH2 + eqI2;
        const pHi = (eqHi / total) * pTotal;
        const pH2 = (eqH2 / total) * pTotal;
        const pI2 = (eqI2 / total) * pTotal;
        correctAnswer = (pH2 * pI2) / Math.pow(pHi, 2);
      }

      questionText = `${initMoles.toFixed(2)} mol of pure ${chosen.name} is placed into a reactor and allowed to reach equilibrium at a total fixed pressure of ${pTotal} ${pUnit}. Analysis shows that ${alphaPercent}% of the ${chosen.name} has dissociated. Deduce Kp for: ${chosen.eq}.`;
      unitExpectation = chosen.unitFn(pUnit);
      alphaHint = chosen.hint;
    }

    setProblem({
      questionText,
      targetLabel,
      correctAnswer,
      targetMode,
      unitExpectation,
      alphaHint,
      instanceId: `${targetMode}_${rxn.id}_${pTotal}_${correctAnswer.toPrecision(4)}`
    });
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

    if (error < 0.03) {
      setFeedback({
        type: 'success',
        message: 'Correct! Your value perfectly matches the parsed partial pressure calculation parameters.'
      });
      onComplete?.(problem.instanceId || `${mode}_${problem.unitExpectation}`);
    } else {
      let recoveryHint = 'Incorrect. ';
      if (problem.targetMode === 'mole_fractions') {
        recoveryHint += 'Remember to calculate the total moles at equilibrium first. Then, find individual mole fractions (moles of gas / total moles) and multiply by the total pressure to find each component\'s partial pressure before solving Kp.';
      } else if (problem.targetMode === 'dissociation_alpha') {
        recoveryHint += problem.alphaHint || 'Construct an ICE table to find equilibrium moles and total moles before computing partial pressures.';
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
