import React, { useState, useEffect } from 'react';
import FormulaInput from '../../components/shared/FormulaInput';

const EmpiricalFormula = ({ onComplete }) => {
  const [mode, setMode] = useState('empirical_pct');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const normalizeSubscripts = (str) => {
    const reverseMap = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
    return str.split('').map(char => reverseMap[char] || char).join('');
  };

  const generateProblem = (forcedMode = null) => {
    const modes = ['empirical_pct', 'empirical_mass', 'molecular_mr', 'hydrated_salt'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    let newProb = {};
    const k = parseFloat((0.015 + Math.random() * 0.035).toFixed(4));
    const pickNonRepeating = (pool) => {
      const filtered = problem ? pool.filter(item => (item.ans || item.mol || item.waterRatio?.toString()) !== problem.correct) : pool;
      const source = filtered.length > 0 ? filtered : pool;
      return source[Math.floor(Math.random() * source.length)];
    };

    if (targetMode === 'empirical_pct') {
      const pool = [
        { name: 'hydrocarbon gas', text: '85.71% Carbon and 14.29% Hydrogen', ans: 'CH2' },
        { name: 'toxic oxide of nitrogen', text: '30.43% Nitrogen and 69.57% Oxygen', ans: 'NO2' },
        { name: 'phosphorus oxide derivative', text: '43.66% Phosphorus and 56.34% Oxygen', ans: 'P2O5' },
        { name: 'liquid hydrocarbon', text: '92.31% Carbon and 7.69% Hydrogen', ans: 'CH' },
        { name: 'chloroalkane solvent', text: '24.24% Carbon, 4.04% Hydrogen, and 71.72% Chlorine', ans: 'CH2Cl' },
        { name: 'organic carboxylic acid derivative', text: '40.00% Carbon, 6.67% Hydrogen, and 53.33% Oxygen', ans: 'CH2O' },
        { name: 'anhydrous carbonate salt', text: '43.40% Sodium, 11.32% Carbon, and 45.28% Oxygen', ans: 'Na2CO3' },
        { name: 'transition metal sulfate', text: '36.73% Iron, 21.13% Sulfur, and 42.13% Oxygen', ans: 'FeSO4' },
        { name: 'crystalline copper salt', text: '39.79% Copper, 20.11% Sulfur, and 40.10% Oxygen', ans: 'CuSO4' },
        { name: 'nitrogenous fertiliser crystal', text: '35.00% Nitrogen, 5.00% Hydrogen, and 60.00% Oxygen', ans: 'N2H4O3' },
        { name: 'volatile carbonyl solvent', text: '62.07% Carbon, 10.34% Hydrogen, and 27.59% Oxygen', ans: 'C3H6O' },
        { name: 'orange dichromate oxidising agent', text: '26.58% Potassium, 35.35% Chromium, and 38.07% Oxygen', ans: 'K2Cr2O7' }
      ];
      const selected = pickNonRepeating(pool);

      newProb = {
        title: "Empirical Formula via Percentage Composition",
        text: <>Chemical analysis of an unknown {selected.name} confirms it contains <b>{selected.text}</b> by mass.</>,
        question: "Deduce the simplest empirical formula for this compound.",
        placeholder: "P₂O₅",
        label: "Empirical Formula =",
        correct: selected.ans,
        isFormula: true,
        instanceId: `emp_pct_${selected.ans}`
      };

    } else if (targetMode === 'empirical_mass') {
      const pool = [
        { name: 'Magnesium oxide product', txt: 'magnesium ribbon was burned completely in oxygen', m1: 24.3, m2: 16.0, label1: 'magnesium', label2: 'oxygen consumed', ans: 'MgO' },
        { name: 'Iron chloride crystal matrix', txt: 'pure iron powder was reacted completely with chlorine gas', m1: 55.8, m2: 106.5, label1: 'iron', label2: 'chlorine consumed', ans: 'FeCl3' },
        { name: 'Copper oxide precipitate', txt: 'copper dust was heated aggressively under a continuous stream of pure oxygen', m1: 63.5, m2: 16.0, label1: 'copper', label2: 'oxygen consumed', ans: 'CuO' },
        { name: 'Sulfur oxide gas sample', txt: 'sulfur powder was combusted completely inside an oxygen chamber', m1: 32.1, m2: 32.0, label1: 'sulfur', label2: 'oxygen consumed', ans: 'SO2' },
        { name: 'Aluminium oxide crucible', txt: 'powdered aluminium was oxidised completely in excess oxygen', m1: 54.0, m2: 48.0, label1: 'aluminium', label2: 'oxygen consumed', ans: 'Al2O3' },
        { name: 'Zinc chloride solid', txt: 'zinc granules were reacted directly with dry chlorine gas', m1: 65.4, m2: 71.0, label1: 'zinc', label2: 'chlorine consumed', ans: 'ZnCl2' },
        { name: 'Calcium chloride sample', txt: 'calcium metal was heated in a stream of dry chlorine', m1: 40.1, m2: 71.0, label1: 'calcium', label2: 'chlorine consumed', ans: 'CaCl2' },
        { name: 'Iron(III) oxide sample', txt: 'finely divided iron rusted completely in pure dry oxygen', m1: 111.6, m2: 48.0, label1: 'iron', label2: 'oxygen consumed', ans: 'Fe2O3' },
        { name: 'Lead(IV) oxide residue', txt: 'lead metal was completely oxidised in an oxygen furnace', m1: 207.2, m2: 32.0, label1: 'lead', label2: 'oxygen consumed', ans: 'PbO2' },
        { name: 'Titanium(IV) chloride product', txt: 'titanium sponge was chlorinated completely at elevated temperature', m1: 47.9, m2: 142.0, label1: 'titanium', label2: 'chlorine consumed', ans: 'TiCl4' }
      ];
      const selected = pickNonRepeating(pool);
      const mass1 = (selected.m1 * k).toFixed(3);
      const mass2 = (selected.m2 * k).toFixed(3);

      newProb = {
        title: "Empirical Formula via Reacting Masses",
        text: <>During a laboratory investigation, {selected.txt}. Quantities recorded were <b>{mass1} g of {selected.label1}</b> and <b>{mass2} g of {selected.label2}</b>.</>,
        question: "Deduce the empirical formula for the resulting product compound.",
        placeholder: "e.g. P₂O₅",
        label: "Empirical Formula =",
        correct: selected.ans,
        isFormula: true,
        instanceId: `emp_mass_${selected.ans}_${mass1}`
      };

    } else if (targetMode === 'molecular_mr') {
      const pool = [
        { emp: 'CH₂O', mol: 'C6H12O6', mr: 180 },
        { emp: 'CH₂', mol: 'C4H8', mr: 56 },
        { emp: 'C₂H₅', mol: 'C4H10', mr: 58 },
        { emp: 'CH', mol: 'C6H6', mr: 78 },
        { emp: 'CH₂Cl', mol: 'C2H4Cl2', mr: 99 },
        { emp: 'C₂H₄O', mol: 'C4H8O2', mr: 88 },
        { emp: 'NO₂', mol: 'N2O4', mr: 92 },
        { emp: 'P₂O₅', mol: 'P4O10', mr: 284 },
        { emp: 'CH₃', mol: 'C2H6', mr: 30 },
        { emp: 'HO', mol: 'H2O2', mr: 34 }
      ];
      const selected = pickNonRepeating(pool);

      newProb = {
        title: "Molecular Formula via Relative Molar Mass",
        text: <>An organic/inorganic compound has an empirical formula of <b>{selected.emp}</b>. Separate mass spectrometry analysis establishes that its overall relative molecular mass (M<sub>r</sub>) is exactly <b>{selected.mr}</b>.</>,
        question: "Deduce the true molecular formula for this structure.",
        placeholder: "e.g. C₆H₁₂O₆",
        label: "Molecular Formula =",
        correct: selected.mol,
        isFormula: true,
        instanceId: `mol_mr_${selected.mol}`
      };

    } else if (targetMode === 'hydrated_salt') {
      const pool = [
        { salt: 'copper(II) sulfate', formula: 'CuSO₄', anhydrousMr: 159.6, waterRatio: 5 },
        { salt: 'magnesium sulfate', formula: 'MgSO₄', anhydrousMr: 120.4, waterRatio: 7 },
        { salt: 'barium chloride', formula: 'BaCl₂', anhydrousMr: 208.3, waterRatio: 2 },
        { salt: 'calcium chloride', formula: 'CaCl₂', anhydrousMr: 111.1, waterRatio: 2 },
        { salt: 'sodium carbonate', formula: 'Na₂CO₃', anhydrousMr: 106.0, waterRatio: 10 },
        { salt: 'iron(II) sulfate', formula: 'FeSO₄', anhydrousMr: 151.9, waterRatio: 7 },
        { salt: 'zinc sulfate', formula: 'ZnSO₄', anhydrousMr: 161.5, waterRatio: 7 },
        { salt: 'cobalt(II) chloride', formula: 'CoCl₂', anhydrousMr: 129.9, waterRatio: 6 },
        { salt: 'calcium sulfate', formula: 'CaSO₄', anhydrousMr: 136.2, waterRatio: 2 }
      ];
      const selected = pool[Math.floor(Math.random() * pool.length)];

      const massAnhydrous = (selected.anhydrousMr * k).toFixed(3);
      const massWater = (selected.waterRatio * 18.0 * k).toFixed(3);
      const massTotal = (parseFloat(massAnhydrous) + parseFloat(massWater)).toFixed(3);

      const displayOption = Math.random() > 0.5;

      newProb = {
        title: "Water of Crystallisation Analysis",
        text: displayOption
          ? <>A student heats a <b>{massTotal} g</b> sample of hydrated {selected.salt} ({selected.formula}·<i>x</i>H<sub>2</sub>O) strongly inside a crucible until it reaches a constant mass. The remaining anhydrous salt residue weighs exactly <b>{massAnhydrous} g</b>.</>
          : <>A laboratory analysis of a hydrated crystals sample of {selected.salt} records that it contains <b>{massAnhydrous} g of anhydrous {selected.formula}</b> bound to <b>{massWater} g of water of crystallisation</b>.</>,
        question: `Determine the integer value of x in the formula: ${selected.formula}·xH₂O.`,
        placeholder: "5",
        label: "x =",
        correct: selected.waterRatio.toString(),
        isFormula: false,
        instanceId: `hyd_${selected.formula}_${selected.waterRatio}_${massAnhydrous}`
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('empirical_pct');
  }, []);

  const checkAnswer = () => {
    const rawInput = studentAnswer.trim();
    if (!rawInput) return;

    const cleanInput = problem.isFormula ? normalizeSubscripts(rawInput) : rawInput;
    const cleanTarget = problem.correct;

    if (cleanInput.toLowerCase() === cleanTarget.toLowerCase()) {
      setFeedback({ message: `Correct answer verified.`, status: 'success' });
      onComplete?.(problem.instanceId || `${mode}_${problem.correct}`);
    } else {
      let hint = `Incorrect. `;
      if (mode === 'hydrated_salt') {
        hint += `Calculate the moles of anhydrous salt and the moles of water lost separately (mass / Mr). Then divide moles of water by moles of salt to find the integer ratio.`;
      } else if (mode === 'molecular_mr') {
        hint += `Calculate the formula mass of the empirical unit first, then find the scaling factor multiplier (M_r / empirical unit mass) to multiply across all elements.`;
      } else {
        hint += `Convert all percentage or mass statistics to chemical amount in moles by dividing each by its Relative Atomic Mass (A_r), then scale to the simplest integer ratio.`;
      }
      setFeedback({ message: hint, status: 'error' });
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
            <option value="empirical_pct">Empirical Formula: Percentages</option>
            <option value="empirical_mass">Empirical Formula: Reacting Masses</option>
            <option value="molecular_mr">Molecular Formula via Mr</option>
            <option value="hydrated_salt">Water of Crystallisation (x)</option>
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
      <div className="question-text text-center px-4 leading-relaxed" style={{ textTransform: 'none' }}>
        {problem.text}
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      <div className="w-full flex items-center justify-center my-6 overflow-x-auto" style={{ textTransform: 'none' }}>
        <div
          className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
          style={{ textTransform: 'none' }}
        >
          <label className="text-sm font-black text-slate-600 select-none" style={{ textTransform: 'none' }}>{problem.label}</label>

          {problem.isFormula ? (
            <FormulaInput
              value={studentAnswer}
              onChange={setStudentAnswer}
              status={feedback.status}
              placeholder={problem.placeholder}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              wrapped={false}
              style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.05em', width: '100%', maxWidth: '12rem', textAlign: 'center', textTransform: 'none' }}
            />
          ) : (
            <input
              type="text"
              inputMode="decimal"
              className={`chem-input ${feedback.status}`}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder={problem.placeholder}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              style={{ maxWidth: '6rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', textTransform: 'none' }}
            />
          )}

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

export default EmpiricalFormula;
