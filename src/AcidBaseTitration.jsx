import React, { useState, useEffect } from 'react';

const AcidBaseTitration = () => {
  const [mode, setMode] = useState('standard');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['standard', 'back_titration', 'double_titration'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    // Force active tracking dropdown synchronization
    setMode(targetMode);

    let newProb = {};

    if (targetMode === 'standard') {
      const volBase = 25.0;
      const titre = parseFloat((15 + Math.random() * 12).toFixed(2));
      const isDiprotic = Math.random() > 0.5;

      if (!isDiprotic) {
        // 1:1 Stoichiometry (HCl + NaOH)
        const concAcid = parseFloat((0.05 + Math.random() * 0.1).toFixed(3));
        const concBase = (concAcid * titre) / volBase;

        newProb = {
          title: "Standard Titration (1:1 Ratio)",
          text: <>A <b>25.0 cm³</b> sample of sodium hydroxide solution ($\text{NaOH}$) was titrated against <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid ($\text{HCl}$). The mean titre recorded was <b>{titre} cm³</b>.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³.",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      } else {
        // 2:1 Stoichiometry Trap (H₂SO₄ + 2NaOH)
        const concAcid = parseFloat((0.025 + Math.random() * 0.05).toFixed(3));
        // Moles base = 2 * moles acid
        const concBase = (2 * concAcid * titre) / volBase;

        newProb = {
          title: "Standard Titration (2:1 Ratio Trap)",
          text: <>A <b>25.0 cm³</b> sample of sodium hydroxide solution ($\text{NaOH}$) required a mean titre of <b>{titre} cm³</b> of <b>{concAcid.toFixed(3)} mol dm⁻³</b> sulfuric acid ($\text{H₂SO₄}$) for complete neutralisation.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³. Watch your chemical equation stoichiometry closely!",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      }

    } else if (targetMode === 'back_titration') {
      // Rigorous A-Level Back Titration with Volumetric Flask Aliquot scaling steps
      const massMarble = parseFloat((1.60 + Math.random() * 0.5).toFixed(3)); // 1.60g - 2.10g
      const volAcidAdded = 50.0;
      const concAcid = 1.000;
      const concNaOH = 0.100;
      const titreNaOH = parseFloat((15.00 + Math.random() * 12).toFixed(2)); // 15.00 - 27.00 cm³

      const totalMolesAcid = (volAcidAdded * concAcid) / 1000; // 0.050 mol
      const molesNaOHUsed = (titreNaOH * concNaOH) / 1000;
      
      // Aliquot Step: 25.0 cm³ titrated out of 250.0 cm³ volumetric flask (Scale factor x10)
      const excessMolesAcidInFlask = molesNaOHUsed * (250.0 / 25.0);
      const reactedMolesAcid = totalMolesAcid - excessMolesAcidInFlask;
      
      // CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂ (1:2 ratio)
      const molesCaCO3 = reactedMolesAcid / 2;
      const massPureCaCO3 = molesCaCO3 * 100.1;
      const purity = (massPureCaCO3 / massMarble) * 100;

      newProb = {
        title: "Back Titration: % Purity Analysis",
        text: <>An impure <b>{massMarble.toFixed(3)} g</b> sample of calcium carbonate ($\text{CaCO₃}$) was treated with <b>{volAcidAdded}.0 cm³</b> of <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid (an excess). The mixture was transferred cleanly to a volumetric flask and made up to exactly <b>250.0 cm³</b> with distilled water. A <b>25.0 cm³</b> portion of this solution required <b>{titreNaOH} cm³</b> of <b>{concNaOH.toFixed(3)} mol dm⁻³</b> sodium hydroxide for neutralisation.</>,
        question: "Calculate the percentage purity of calcium carbonate in the original sample.",
        label: "% Purity =",
        unit: "%",
        correct: purity.toFixed(1)
      };

    } else if (targetMode === 'double_titration') {
      // Double indicator endpoint titration analysis (NaOH + Na₂CO₃ mixtures)
      const volMixture = 25.0;
      const concAcid = 0.100;
      const phenTitre = parseFloat((20.00 + Math.random() * 5).toFixed(2)); // Total volume to phenolphthalein end
      const methylTitre = parseFloat((5.00 + Math.random() * 3).toFixed(2)); // Additional volume to methyl orange end

      // Step 2 (Methyl Orange): Only NaHCO₃ reacts with HCl (1:1) -> gives moles Na₂CO₃
      const molesNa2CO3 = (methylTitre * concAcid) / 1000;
      const concNa2CO3 = molesNa2CO3 / (volMixture / 1000);

      // Step 1 (Phenolphthalein): All NaOH reacts, and Na₂CO₃ converts to NaHCO₃ (consuming equal volume)
      const volAcidForNaOH = phenTitre - methylTitre;
      const molesNaOH = (volAcidForNaOH * concAcid) / 1000;
      const concNaOH = molesNaOH / (volMixture / 1000);

      const askForCarbonate = Math.random() > 0.5;

      newProb = {
        title: "Double Indicator Titration",
        text: <>A <b>25.0 cm³</b> sample containing a mixture of sodium hydroxide ($\text{NaOH}$) and sodium carbonate ($\text{Na₂CO₃}$) was titrated against <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid. Using phenolphthalein indicator, the solution turned colorless after the addition of <b>{phenTitre} cm³</b> of acid. A further <b>{methylTitre} cm³</b> of acid was then required to turn methyl orange indicator orange at the final endpoint.</>,
        question: askForCarbonate 
          ? "Calculate the concentration of sodium carbonate (Na₂CO₃) in the mixture solution." 
          : "Calculate the concentration of sodium hydroxide (NaOH) in the mixture solution.",
        label: askForCarbonate ? "[Na₂CO₃] =" : "[NaOH] =",
        unit: "mol dm⁻³",
        correct: askForCarbonate ? concNa2CO3.toFixed(3) : concNaOH.toFixed(3)
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
    
    if (isNaN(userVal)) return;
    
    const error = Math.abs((userVal - correctVal) / correctVal);

    if (error < 0.025) {
      setFeedback({ message: `Correct! The determined parameter is ${problem.correct} ${problem.unit}.`, status: 'success' });
    } else {
      let hint = `Incorrect. `;
      if (mode === 'back_titration') {
        hint += `Remember to scale the moles of excess acid up by a factor of 10 to account for the volumetric flask fraction before subtracting from total added acid!`;
      } else if (mode === 'double_titration') {
        hint += `The second titration volume only neutralises hydrogen carbonate ions derived from the carbonate. The first volume neutralises all hydroxide ions plus the first stage of carbonate conversion.`;
      } else {
        hint += `Check if you accounts for structural compound stoichiometric coefficients (like diprotic H₂SO₄ liberating two protons per mole).`;
      }
      setFeedback({ message: hint, status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      
      {/* --- DROPDOWN + RANDOM NAVIGATION ROW --- */}
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
            <option value="standard">Standard Titration (Mixed Valencies)</option>
            <option value="back_titration">Back Titration (Aliquot Volumetric)</option>
            <option value="double_titration">Double Titration (Mixture Assays)</option>
          </select>
          
          <button
            type="button"
            onClick={() => { generateProblem('random'); }}
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
      <div className="question-text text-center px-2 leading-relaxed">{problem.text}</div>

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      {/* --- NON-WRAPPING MOBILE ROW CELL CONTAINER --- */}
      <div className="w-full flex items-center justify-center my-6 overflow-x-auto">
        <div className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
          <label className="text-sm font-black text-slate-600 select-none">{problem.label}</label>
          <input 
            type="number" 
            step="any"
            className={`chem-input ${feedback.status}`}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="0.00"
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            style={{ maxWidth: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800' }}
          />
          <span className="text-sm font-black text-slate-500 select-none">{problem.unit}</span>
        </div>
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
