import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const KcCalculations = () => {
  const [mode, setMode] = useState('ice_table');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Custom Power Index Picker States
  const [molIdx, setMolIdx] = useState(0);
  const [dmIdx, setDmIdx] = useState(0);
  const [sIdx, setSIdx] = useState(0);

  const reactions = [
    { 
      eq: 'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)', 
      id: 'pcl5',
      units: 'mol dm⁻³',
      targetPowers: { mol: 1, dm: -3, s: 0 },
      calcKc: (c) => (c.pcl3 * c.cl2) / c.pcl5 
    },
    { 
      eq: 'H₂(g) + I₂(g) ⇌ 2HI(g)', 
      id: 'h2_i2',
      units: 'no units',
      targetPowers: { mol: 0, dm: 0, s: 0 },
      calcKc: (c) => Math.pow(c.hi, 2) / (c.h2 * c.i2) 
    },
    { 
      eq: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g)',
      id: 'so3_sys',
      units: 'dm³ mol⁻¹',
      targetPowers: { mol: -1, dm: 3, s: 0 },
      calcKc: (c) => Math.pow(c.so3, 2) / (Math.pow(c.so2, 2) * c.o2)
    },
    { 
      eq: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)', 
      id: 'haber',
      units: 'dm⁶ mol⁻²',
      targetPowers: { mol: -2, dm: 6, s: 0 },
      calcKc: (c) => Math.pow(c.nh3, 2) / (c.n2 * Math.pow(c.h2, 3)) 
    }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['ice_table', 'direct_kc', 'find_missing', 'predict_units'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    const rxn = reactions[Math.floor(Math.random() * reactions.length)];
    let questionText = '';
    let targetLabel = '';
    let correctAnswer = 0;
    let unitExpectation = '';

    setMolIdx(0);
    setDmIdx(0);
    setSIdx(0);

    const volume = parseFloat((Math.random() * 8 + 2).toFixed(1));

    if (targetMode === 'direct_kc') {
      if (rxn.id === 'pcl5') {
        const pcl5 = parseFloat((Math.random() * 0.2 + 0.1).toFixed(3));
        const pcl3 = parseFloat((Math.random() * 0.4 + 0.3).toFixed(3));
        const cl2 = parseFloat((Math.random() * 0.4 + 0.3).toFixed(3));
        questionText = `At a given temperature, an equilibrium mixture for the dissociation of PCl₅ contains [PCl₅] = ${pcl5} mol dm⁻³, [PCl₃] = ${pcl3} mol dm⁻³, and [Cl₂] = ${cl2} mol dm⁻³. Calculate the value of Kc for the reaction: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ pcl5, pcl3, cl2 });
      } else if (rxn.id === 'h2_i2') {
        const h2 = parseFloat((Math.random() * 0.15 + 0.05).toFixed(3));
        const i2 = parseFloat((Math.random() * 0.15 + 0.05).toFixed(3));
        const hi = parseFloat((Math.random() * 0.8 + 0.4).toFixed(3));
        questionText = `Analysis of an equilibrium system held at 400 °C shows the concentrations are [H₂] = ${h2} mol dm⁻³, [I₂] = ${i2} mol dm⁻³, and [HI] = ${hi} mol dm⁻³. Calculate the value of Kc for the reaction: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ h2, i2, hi });
      } else if (rxn.id === 'so3_sys') {
        const so2 = parseFloat((Math.random() * 0.25 + 0.1).toFixed(3));
        const o2 = parseFloat((Math.random() * 0.15 + 0.05).toFixed(3));
        const so3 = parseFloat((Math.random() * 0.5 + 0.3).toFixed(3));
        questionText = `At a fixed temperature, the components of the contact process match the following parameter values: [SO₂] = ${so2} mol dm⁻³, [O₂] = ${o2} mol dm⁻³, and [SO₃] = ${so3} mol dm⁻³. Calculate the value of Kc for the reaction: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ so2, o2, so3 });
      } else {
        const n2 = parseFloat((Math.random() * 0.3 + 0.1).toFixed(3));
        const h2 = parseFloat((Math.random() * 0.4 + 0.2).toFixed(3));
        const nh3 = parseFloat((Math.random() * 0.15 + 0.05).toFixed(3));
        questionText = `The Haber synthesis equilibrium produces the following data parameters: [N₂] = ${n2} mol dm⁻³, [H₂] = ${h2} mol dm⁻³, and [NH₃] = ${nh3} mol dm⁻³. Calculate the value of Kc for the reaction: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ n2, h2, nh3 });
      }
      targetLabel = 'Kc =';
      unitExpectation = rxn.units;

    } else if (targetMode === 'ice_table') {
      if (rxn.id === 'pcl5') {
        const initPcl5 = parseFloat((Math.random() * 1.5 + 1.0).toFixed(2));
        const eqPcl3 = parseFloat((Math.random() * 0.5 + 0.3).toFixed(2)); 
        const eqPcl5Moles = initPcl5 - eqPcl3;
        
        questionText = `A closed vessel of volume ${volume} dm³ is initially filled with ${initPcl5} mol of PCl₅ gas. At equilibrium, analysis shows that ${eqPcl3} mol of PCl₃ has formed. Calculate the value of Kc. Reaction: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ pcl5: eqPcl5Moles / volume, pcl3: eqPcl3 / volume, cl2: eqPcl3 / volume });
      } else if (rxn.id === 'h2_i2') {
        const initH2 = parseFloat((Math.random() * 1.0 + 0.5).toFixed(2));
        const initI2 = parseFloat((Math.random() * 1.0 + 0.5).toFixed(2));
        const eqH2Moles = parseFloat((initH2 * 0.4).toFixed(2));
        const changeX = initH2 - eqH2Moles;
        const eqI2Moles = initI2 - changeX;
        const eqHiMoles = changeX * 2;

        questionText = `A chemistry student injects ${initH2} mol of H₂ and ${initI2} mol of I₂ into a container with a volume of ${volume} dm³. At equilibrium, ${eqH2Moles} mol of H₂ remains. Calculate the value of Kc. Reaction: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ h2: eqH2Moles / volume, i2: eqI2Moles / volume, hi: eqHiMoles / volume });
      } else if (rxn.id === 'so3_sys') {
        const initSo2 = 2.0; const initO2 = 1.0; const changeX = 0.3;
        const eqSo2 = initSo2 - (2 * changeX); const eqO2 = initO2 - changeX; const eqSo3 = 2 * changeX;
        questionText = `A mixture of 2.00 mol of SO₂ and 1.00 mol of O₂ is sealed in a ${volume} dm³ container. At equilibrium, ${(eqO2).toFixed(2)} mol of O₂ remains unreacted. Calculate Kc for the process: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ so2: eqSo2 / volume, o2: eqO2 / volume, so3: eqSo3 / volume });
      } else {
        const initN2 = 1.0; const initH2 = 3.0; const changeX = 0.2; 
        const eqN2 = initN2 - changeX; const eqH2 = initH2 - (3 * changeX); const eqNh3 = 2 * changeX;

        questionText = `An initial mixture containing 1.00 mol of N₂ and 3.00 mol of H₂ is locked inside a ${volume} dm³ reactor. At equilibrium, the system is found to contain ${(eqN2).toFixed(2)} mol of N₂. Calculate the value of Kc. Reaction: ${rxn.eq}.`;
        correctAnswer = rxn.calcKc({ n2: eqN2 / volume, h2: eqH2 / volume, nh3: eqNh3 / volume });
      }
      targetLabel = 'Kc =';
      unitExpectation = rxn.units;

    } else if (targetMode === 'find_missing') {
      const assignedKc = parseFloat((Math.random() * 40 + 5).toFixed(1));
      if (rxn.id === 'pcl5') {
        const pcl3 = 0.25; const cl2 = 0.20;
        questionText = `The equilibrium constant Kc for the dissociation of PCl₅ is ${assignedKc} ${rxn.units} at a specified temperature. If [PCl₃] = ${pcl3} mol dm⁻³ and [Cl₂] = ${cl2} mol dm⁻³ at equilibrium, calculate the equilibrium concentration of PCl₅. Reaction: ${rxn.eq}.`;
        correctAnswer = (pcl3 * cl2) / assignedKc;
        targetLabel = '[PCl₅] =';
      } else {
        const h2 = 0.15; const i2 = 0.12;
        questionText = `The equilibrium constant Kc for the reaction H₂(g) + I₂(g) ⇌ 2HI(g) is ${assignedKc}. If the equilibrium concentrations of the reactants are [H₂] = ${h2} mol dm⁻³ and [I₂] = ${i2} mol dm⁻³, determine the equilibrium concentration of HI.`;
        correctAnswer = Math.sqrt(assignedKc * h2 * i2);
        targetLabel = '[HI] =';
      }
      unitExpectation = 'mol dm⁻³';
    } else if (targetMode === 'predict_units') {
      questionText = `Deduce the correct equilibrium constant (Kc) units for the following reaction:\n\n${rxn.eq}`;
      newProb = { questionText, targetPowers: rxn.targetPowers, targetMode };
      setProblem(newProb);
      setFeedback({ type: '', message: '' });
      return;
    }

    setProblem({ questionText, targetLabel, correctAnswer, targetMode, unitExpectation });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem('ice_table');
  }, []);

  const renderSortedUnitsPreview = () => {
    const map = {
      '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','-':'⁻'
    };
    const toSub = (n) => n.toString().split('').map(c => map[c] || c).join('');

    const pieces = [
      { unit: 'mol', p: molIdx },
      { unit: 'dm', p: dmIdx },
      { unit: 's', p: sIdx }
    ];

    // Primary sort: Descending by index power value. Secondary sort: Alphabetical a-z tie-breaker if index matches.
    pieces.sort((a, b) => {
      if (b.p !== a.p) {
        return b.p - a.p;
      }
      return a.unit.localeCompare(b.unit);
    });

    const activePieces = pieces.filter(item => item.p !== 0);
    if (activePieces.length === 0) return <span className="font-mono text-slate-400 font-bold">no units</span>;

    return (
      <span className="font-mono text-base font-black text-[#326fa0] tracking-wide">
        {activePieces.map((item, idx) => (
          <span key={idx} className="mr-1">
            {item.unit}
            {item.p !== 1 && <sup className="text-xs font-black">{toSub(item.p)}</sup>}
          </span>
        ))}
      </span>
    );
  };

  const checkAnswer = () => {
    if (mode === 'predict_units') {
      const targets = problem.targetPowers;
      if (molIdx === targets.mol && dmIdx === targets.dm && sIdx === targets.s) {
        setFeedback({ type: 'success', message: 'Correct! Your power index configuration matches the expression requirements.' });
      } else {
        setFeedback({ type: 'error', message: `Incorrect. Set up your equilibrium expression [Products]/[Reactants], cancel down common brackets, and remember dm moves in blocks of 3.` });
      }
      return;
    }

    if (!coeff || isNaN(parseFloat(coeff))) return;
    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctAnswer) / problem.correctAnswer);

    if (error < 0.025) {
      setFeedback({ type: 'success', message: 'Correct! Your value is accurate and matches the equilibrium expression.' });
    } else {
      let recoveryHint = 'Incorrect. ';
      if (problem.targetMode === 'ice_table') {
        recoveryHint += 'Remember to construct an ICE table to find the equilibrium moles, and crucially, divide those moles by the total volume to get concentrations before solving Kc.';
      } else if (problem.targetMode === 'find_missing') {
        recoveryHint += 'Rearrange your expression carefully. Check if your calculation requires taking a square root.';
      } else {
        recoveryHint += 'Double check your terms. Products go on the numerator, reactants on the denominator, and coefficients become powers.';
      }
      setFeedback({ type: 'error', message: recoveryHint });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
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
            <option value="ice_table">Initial Moles + Volume → Kc (ICE Table)</option>
            <option value="direct_kc">Equilibrium Concentrations → Kc</option>
            <option value="find_missing">Kc + Rearrangement → Concentration</option>
            <option value="predict_units">Deduce Equilibrium Units Practice</option>
          </select>
          
          <button
            type="button"
            onClick={() => generateProblem('random')}
            className="px-4 py-2.5 text-xs font-black uppercase bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shrink-0"
          >
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header" style={{ textTransform: 'none' }}>Kc Equilibrium Constants</div>
      <div className="question-text text-center px-4 leading-relaxed whitespace-pre-line" style={{ textTransform: 'none' }}>
        {problem.questionText}
      </div>

      {/* --- RECONSTRUCTED INTERACTIVE UNIT CONTROLS --- */}
      {mode === 'predict_units' ? (
        <div className="w-full max-w-sm mx-auto my-6 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col items-center gap-4" style={{ textTransform: 'none' }}>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Select Power Indexes</span>
          
          <div className="grid grid-cols-3 gap-4 w-full">
            {/* Mol Control Cell */}
            <div className="flex flex-col items-center bg-white p-2 border border-slate-200/80 rounded-xl shadow-inner">
              <span className="text-xs font-black font-mono text-slate-500 mb-1">mol</span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setMolIdx(prev => prev - 1)} className="w-6 h-6 bg-slate-100 rounded-lg text-xs font-black hover:bg-slate-200 text-slate-600">⁻</button>
                <span className="font-mono font-black text-sm w-4 text-center text-slate-800">{molIdx}</span>
                <button type="button" onClick={() => setMolIdx(prev => prev + 1)} className="w-6 h-6 bg-slate-100 rounded-lg text-xs font-black hover:bg-slate-200 text-slate-600">⁺</button>
              </div>
            </div>

            {/* Dm Control Cell: Increments/Decrements by blocks of 3 */}
            <div className="flex flex-col items-center bg-white p-2 border border-slate-200/80 rounded-xl shadow-inner">
              <span className="text-xs font-black font-mono text-slate-500 mb-1">dm</span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setDmIdx(prev => prev - 3)} className="w-6 h-6 bg-slate-100 rounded-lg text-xs font-black hover:bg-slate-200 text-slate-600">⁻</button>
                <span className="font-mono font-black text-sm w-5 text-center text-slate-800">{dmIdx}</span>
                <button type="button" onClick={() => setDmIdx(prev => prev + 3)} className="w-6 h-6 bg-slate-100 rounded-lg text-xs font-black hover:bg-slate-200 text-slate-600">⁺</button>
              </div>
            </div>

            {/* S Control Cell */}
            <div className="flex flex-col items-center bg-white p-2 border border-slate-200/80 rounded-xl shadow-inner">
              <span className="text-xs font-black font-mono text-slate-500 mb-1">s</span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setSIdx(prev => prev - 1)} className="w-6 h-6 bg-slate-100 rounded-lg text-xs font-black hover:bg-slate-200 text-slate-600">⁻</button>
                <span className="font-mono font-black text-sm w-4 text-center text-slate-800">{sIdx}</span>
                <button type="button" onClick={() => setSIdx(prev => prev + 1)} className="w-6 h-6 bg-slate-100 rounded-lg text-xs font-black hover:bg-slate-200 text-slate-600">⁺</button>
              </div>
            </div>
          </div>

          <div className="w-full bg-white border border-slate-200/60 rounded-xl p-2.5 text-center mt-1 flex flex-col items-center gap-0.5">
            <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Current Sorted Selection</span>
            <div className="h-6 flex items-center justify-center">{renderSortedUnitsPreview()}</div>
          </div>
        </div>
      ) : (
        /* --- CONCENTRATION INPUT FIELDS WITH BELOW-ROW UNITS --- */
        <div className="w-full flex flex-col items-center justify-center my-6" style={{ textTransform: 'none' }}>
          <div className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
            <ScientificInput 
              value={coeff} 
              exponent={exp} 
              onValueChange={setCoeff} 
              onExponentChange={setExp}
              label={problem.targetLabel}
              status={feedback.type}
            />
          </div>
          
          {/* Below-row Unit Placement prevents unnecessary mobile scrolling overflows */}
          <div className="mt-3 text-center select-none whitespace-nowrap" style={{ textTransform: 'none' }}>
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mr-1">Units:</span>
            <span className="text-sm font-black text-slate-500 font-mono inline-block bg-white border border-slate-200/60 px-2.5 py-0.5 rounded-lg shadow-sm">{problem.unitExpectation}</span>
          </div>
        </div>
      )}

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default KcCalculations;
