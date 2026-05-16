import React, { useState, useEffect } from 'react';

const AcidBaseTitration = () => {
  const [mode, setMode] = useState('standard');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // Interactive Table State Elements (For Mode: table_practice)
  const [tableTitres, setTableTitres] = useState({ rough: '', t1: '', t2: '', t3: '' });
  const [concordantSelections, setConcordantSelections] = useState({ t1: false, t2: false, t3: false });
  const [studentMean, setStudentMean] = useState('');
  const [tableVerified, setTableVerified] = useState(false);
  const [tableFeedback, setTableFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['standard', 'back_titration', 'double_titration', 'table_practice'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    let newProb = {};
    // Reset table states on regeneration
    setTableTitres({ rough: '', t1: '', t2: '', t3: '' });
    setConcordantSelections({ t1: false, t2: false, t3: false });
    setStudentMean('');
    setTableVerified(false);
    setTableFeedback({ message: '', status: '' });

    if (targetMode === 'standard') {
      const volBase = 25.0;
      const titre = parseFloat((15 + Math.random() * 12).toFixed(2));
      const poolChoice = Math.random();

      if (poolChoice < 0.33) {
        // Monoprotic standard (HCl + NaOH)
        const concAcid = parseFloat((0.05 + Math.random() * 0.1).toFixed(3));
        const concBase = (concAcid * titre) / volBase;

        newProb = {
          title: "Standard Titration (1:1 Ratio)",
          text: <>A <b>25.0 cm³</b> sample of sodium hydroxide solution (NaOH) was titrated against <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid (HCl). The mean titre recorded was <b>{titre} cm³</b>.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³.",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      } else if (poolChoice < 0.66) {
        // Diprotic Stoichiometry Trap (H2SO4 + 2NaOH)
        const concAcid = parseFloat((0.025 + Math.random() * 0.05).toFixed(3));
        const concBase = (2 * concAcid * titre) / volBase;

        newProb = {
          title: "Standard Titration (2:1 Ratio Trap)",
          text: <>A <b>25.0 cm³</b> sample of sodium hydroxide solution (NaOH) required a mean titre of <b>{titre} cm³</b> of <b>{concAcid.toFixed(3)} mol dm⁻³</b> sulfuric acid (H<sub>2</sub>SO<sub>4</sub>) for complete neutralisation.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³. Watch your chemical equation stoichiometry closely!",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      } else {
        // WJEC Core Context: Ascorbic Acid (Vitamin C) Assay Analysis
        const concNaOH = parseFloat((0.04 + Math.random() * 0.04).toFixed(3)); // ~0.05 mol dm-3
        // moles NaOH = conc * titre / 1000
        // moles Ascorbic acid in 25cm3 = moles NaOH
        const molesAscorbic25 = (concNaOH * titre) / 1000;
        const massAscorbicInTablet = molesAscorbic25 * 176.12; // Weak monoprotic C6H8O6

        newProb = {
          title: "Ascorbic Acid (Vitamin C) Assay",
          text: <>A student dissolved a commercial Vitamin C supplement tablet in distilled water to make exactly <b>25.0 cm³</b> of solution. This entire sample was titrated against <b>{concNaOH.toFixed(3)} mol dm⁻³</b> standard sodium hydroxide solution (NaOH), requiring a titre of <b>{titre} cm³</b> for complete neutralisation. Ascorbic acid (C<sub>6</sub>H<sub>8</sub>O<sub>6</sub>) reacts with NaOH in a 1:1 molar ratio.</>,
          question: "Calculate the mass of ascorbic acid present in the supplement tablet in grams (g). (Mr of Ascorbic Acid = 176.12)",
          label: "Mass =",
          unit: "g",
          correct: massAscorbicInTablet.toFixed(3)
        };
      }

    } else if (targetMode === 'back_titration') {
      const massMarble = parseFloat((1.60 + Math.random() * 0.5).toFixed(3));
      const volAcidAdded = 50.0;
      const concAcid = 1.000;
      const concNaOH = 0.100;
      const titreNaOH = parseFloat((15.00 + Math.random() * 12).toFixed(2));

      const totalMolesAcid = (volAcidAdded * concAcid) / 1000;
      const molesNaOHUsed = (titreNaOH * concNaOH) / 1000;
      
      const excessMolesAcidInFlask = molesNaOHUsed * (250.0 / 25.0);
      const reactedMolesAcid = totalMolesAcid - excessMolesAcidInFlask;
      
      const molesCaCO3 = reactedMolesAcid / 2;
      const massPureCaCO3 = molesCaCO3 * 100.1;
      const purity = (massPureCaCO3 / massMarble) * 100;

      newProb = {
        title: "Back Titration: % Purity Analysis",
        text: <>An impure <b>{massMarble.toFixed(3)} g</b> sample of calcium carbonate (CaCO<sub>3</sub>) was treated with <b>{volAcidAdded}.0 cm³</b> of <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid (an excess). The mixture was transferred cleanly to a volumetric flask and made up to exactly <b>250.0 cm³</b> with distilled water. A <b>25.0 cm³</b> portion of this solution required <b>{titreNaOH} cm³</b> of <b>{concNaOH.toFixed(3)} mol dm⁻³</b> sodium hydroxide for neutralisation.</>,
        question: "Calculate the percentage purity of calcium carbonate in the original sample.",
        label: "% Purity =",
        unit: "%",
        correct: purity.toFixed(1)
      };

    } else if (targetMode === 'double_titration') {
      const volMixture = 25.0;
      const concAcid = 0.100;
      
      const methylTitre = parseFloat((6.00 + Math.random() * 4).toFixed(2)); 
      const phenTitre = parseFloat((methylTitre + 8.00 + Math.random() * 6).toFixed(2)); 

      const molesNa2CO3 = (methylTitre * concAcid) / 1000;
      const concNa2CO3 = molesNa2CO3 / (volMixture / 1000);

      const volAcidForNaOH = phenTitre - methylTitre;
      const molesNaOH = (volAcidForNaOH * concAcid) / 1000;
      const concNaOH = molesNaOH / (volMixture / 1000);

      const askForCarbonate = Math.random() > 0.5;

      newProb = {
        title: "Double Indicator Titration (Mixture Analysis)",
        text: <>A <b>25.0 cm³</b> solution containing a mixture of sodium hydroxide (NaOH) and sodium carbonate (Na<sub>2</sub>CO<sub>3</sub>) was titrated against <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid. In the first stage using phenolphthalein indicator, the mixture turned completely colourless after the addition of <b>{phenTitre} cm³</b> of acid. Methyl orange indicator was then added to the flask, requiring a <b>further {methylTitre} cm³</b> of acid to reach its distinct endpoint.</>,
        question: askForCarbonate 
          ? "Calculate the concentration of sodium carbonate (Na₂CO₃) in the mixture solution in mol dm⁻³." 
          : "Calculate the concentration of sodium hydroxide (NaOH) in the mixture solution in mol dm⁻³.",
        label: askForCarbonate ? "[Na2CO3] =" : "[NaOH] =",
        unit: "mol dm⁻³",
        correct: askForCarbonate ? concNa2CO3.toFixed(3) : concNaOH.toFixed(3)
      };

    } else if (targetMode === 'table_practice') {
      // PREMIUM INTERACTIVE UNIT 1 RESULTS TABLE AND CONCORDANCE GENERATOR
      const targetTitre = parseFloat((21.30 + Math.random() * 2).toFixed(2)); // true target mean
      
      // Generate initial/final combinations ending explicitly in .00 or .05 for realistic meniscus readings
      const r_init = 0.00; const r_final = targetTitre + 0.85;
      const t1_init = 0.50; const t1_final = t1_init + targetTitre - 0.05; // t1 = target - 0.05
      const t2_init = 1.10; const t2_final = t2_init + targetTitre + 0.05; // t2 = target + 0.05
      const t3_init = 0.00; const t3_final = t3_init + targetTitre + 0.65; // t3 = outlier (+0.65)

      const tableData = {
        rough: { init: r_init.toFixed(2), final: r_final.toFixed(2), correctNet: r_final - r_init },
        t1: { init: t1_init.toFixed(2), final: t1_final.toFixed(2), correctNet: t1_final - t1_init },
        t2: { init: t2_init.toFixed(2), final: t2_final.toFixed(2), correctNet: t2_final - t2_init },
        t3: { init: t3_init.toFixed(2), final: t3_final.toFixed(2), correctNet: t3_final - t3_init }
      };

      const concNaOH = 0.100;
      const volFlaskAcid = 25.0;
      // Mean of concordant trials (t1 and t2) = targetTitre exactly
      const molesNaOH = (concNaOH * targetTitre) / 1000;
      const concAcid = molesNaOH / (volFlaskAcid / 1000); // 1:1 HCl + NaOH

      newProb = {
        title: "Burette Data Table & Concordance Practice",
        text: <>A student records the following initial and final burette parameters when titrating <b>25.0 cm³</b> samples of hydrochloric acid (HCl) against a standard solution of <b>0.100 mol dm⁻³</b> sodium hydroxide (NaOH). Complete the missing spaces in the results table below, select which trials are concordant, and establish the mean titre.</>,
        question: "Once your results table parameters have been verified, calculate the molar concentration of the hydrochloric acid solution in mol dm⁻³.",
        label: "[HCl] =",
        unit: "mol dm⁻³",
        correct: concAcid.toFixed(3),
        tableData
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { 
    generateProblem('standard'); 
  }, []);

  // Handler to verify intermediate data tables before final calculations unlock
  const handleVerifyTable = () => {
    const data = problem.tableData;
    const r_user = parseFloat(tableTitres.rough);
    const t1_user = parseFloat(tableTitres.t1);
    const t2_user = parseFloat(tableTitres.t2);
    const t3_user = parseFloat(tableTitres.t3);
    const mean_user = parseFloat(studentMean);

    // 1. Check subtractions
    if (
      Math.abs(r_user - data.rough.correctNet) > 0.01 ||
      Math.abs(t1_user - data.t1.correctNet) > 0.01 ||
      Math.abs(t2_user - data.t2.correctNet) > 0.01 ||
      Math.abs(t3_user - data.t3.correctNet) > 0.01
    ) {
      setTableFeedback({ message: "Incorrect net titre entries. Double check your subtractions (Final − Initial).", status: "error" });
      return;
    }

    // 2. Validate concordant check marks (Titre 1 and Titre 2 are within 0.10 cm³)
    if (!concordantSelections.t1 || !concordantSelections.t2 || concordantSelections.t3) {
      setTableFeedback({ message: "Concordance check failure. Concordant titres must sit within 0.10 cm³ of each other.", status: "error" });
      return;
    }

    // 3. Check calculated mean titre
    const expectedMean = (data.t1.correctNet + data.t2.correctNet) / 2;
    if (Math.abs(mean_user - expectedMean) > 0.01) {
      setTableFeedback({ message: "Incorrect mean titre. Calculate the average using only your selected concordant trials.", status: "error" });
      return;
    }

    setTableFeedback({ message: "Results table data verified successfully! Final calculation block unlocked.", status: "success" });
    setTableVerified(true);
  };

  const checkAnswer = () => {
    const userVal = parseFloat(studentAnswer);
    const correctVal = parseFloat(problem.correct);
    
    if (isNaN(userVal)) return;
    const error = Math.abs((userVal - correctVal) / correctVal);

    if (error < 0.025) {
      setFeedback({ message: `Correct! The determined value is ${problem.correct} ${problem.unit}.`, status: 'success' });
    } else {
      let hint = `Incorrect. `;
      if (mode === 'back_titration') {
        hint += `Remember to scale the moles of excess acid up by a factor of 10 to account for the volumetric flask fraction before subtracting from total added acid!`;
      } else if (mode === 'double_titration') {
        hint += `The further volume (V₂) neutralises NaHCO₃ and is proportional to the carbonate. The first volume (V₁) accounts for all the NaOH plus the first stage of the carbonate transformation.`;
      } else if (mode === 'table_practice') {
        hint += `Use your verified mean titre with the NaOH parameters to find moles, then determine [HCl] using the 1:1 reacting ratio across the 25.0 cm³ flask volume.`;
      } else {
        hint += `Check if you accounted for the compound stoichiometric coefficients or molar masses correctly.`;
      }
      setFeedback({ message: hint, status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      
      {/* --- DROPDOWN + RANDOM NAVIGATION ROW --- */}
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
            <option value="standard">Standard Titration (Mixed Valencies & Vitamin C)</option>
            <option value="back_titration">Back Titration (Aliquot Volumetric)</option>
            <option value="double_titration">Double Titration (WJEC Mixture Assay)</option>
            <option value="table_practice">Burette Results Table & Concordance Practice</option>
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

      {/* --- CONDITIONAL RENDERING FOR INTERACTIVE RESULTS MATRIX --- */}
      {mode === 'table_practice' && (
        <div className="w-full max-w-2xl mx-auto my-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" style={{ textTransform: 'none' }}>
          <table className="w-full text-center text-xs font-bold border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="p-3 text-left">Burette Readings</th>
                <th className="p-3">Rough</th>
                <th className="p-3">Titre 1</th>
                <th className="p-3">Titre 2</th>
                <th className="p-3">Titre 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-3 text-left bg-slate-50/50">Final Volume (cm³)</td>
                <td className="p-3 font-mono">{problem.tableData.rough.final}</td>
                <td className="p-3 font-mono">{problem.tableData.t1.final}</td>
                <td className="p-3 font-mono">{problem.tableData.t2.final}</td>
                <td className="p-3 font-mono">{problem.tableData.t3.final}</td>
              </tr>
              <tr>
                <td className="p-3 text-left bg-slate-50/50">Initial Volume (cm³)</td>
                <td className="p-3 font-mono">{problem.tableData.rough.init}</td>
                <td className="p-3 font-mono">{problem.tableData.t1.init}</td>
                <td className="p-3 font-mono">{problem.tableData.t2.init}</td>
                <td className="p-3 font-mono">{problem.tableData.t3.init}</td>
              </tr>
              <tr className="bg-blue-50/20">
                <td className="p-3 text-left font-black text-slate-800 bg-slate-50/50">Net Titre (cm³)</td>
                <td className="p-2">
                  <input type="number" step="any" value={tableTitres.rough} onChange={(e) => setTableTitres({...tableTitres, rough: e.target.value})} className="w-16 p-1 text-center border border-slate-300 rounded font-mono text-sm" placeholder="0.00" disabled={tableVerified} />
                </td>
                <td className="p-2">
                  <input type="number" step="any" value={tableTitres.t1} onChange={(e) => setTableTitres({...tableTitres, t1: e.target.value})} className="w-16 p-1 text-center border border-slate-300 rounded font-mono text-sm" placeholder="0.00" disabled={tableVerified} />
                </td>
                <td className="p-2">
                  <input type="number" step="any" value={tableTitres.t2} onChange={(e) => setTableTitres({...tableTitres, t2: e.target.value})} className="w-16 p-1 text-center border border-slate-300 rounded font-mono text-sm" placeholder="0.00" disabled={tableVerified} />
                </td>
                <td className="p-2">
                  <input type="number" step="any" value={tableTitres.t3} onChange={(e) => setTableTitres({...tableTitres, t3: e.target.value})} className="w-16 p-1 text-center border border-slate-300 rounded font-mono text-sm" placeholder="0.00" disabled={tableVerified} />
                </td>
              </tr>
              <tr>
                <td className="p-3 text-left bg-slate-50/50">Concordant? (Tick)</td>
                <td className="p-3 text-slate-300 text-[10px] italic">N/A</td>
                <td className="p-3">
                  <input type="checkbox" checked={concordantSelections.t1} onChange={(e) => setConcordantSelections({...concordantSelections, t1: e.target.checked})} className="w-4 h-4 accent-[#326fa0]" disabled={tableVerified} />
                </td>
                <td className="p-3">
                  <input type="checkbox" checked={concordantSelections.t2} onChange={(e) => setConcordantSelections({...concordantSelections, t2: e.target.checked})} className="w-4 h-4 accent-[#326fa0]" disabled={tableVerified} />
                </td>
                <td className="p-3">
                  <input type="checkbox" checked={concordantSelections.t3} onChange={(e) => setConcordantSelections({...concordantSelections, t3: e.target.checked})} className="w-4 h-4 accent-[#326fa0]" disabled={tableVerified} />
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-black text-slate-700">Calculated Mean Titre (cm³):</span>
              <input type="number" step="any" value={studentMean} onChange={(e) => setStudentMean(e.target.value)} className="w-20 p-1.5 text-center border border-slate-300 rounded-lg font-mono font-bold text-sm bg-white" placeholder="0.00" disabled={tableVerified} />
            </div>
            <button type="button" onClick={handleVerifyTable} disabled={tableVerified} className="px-5 py-2 bg-[#326fa0] text-white font-black text-xs uppercase rounded-xl tracking-wider shadow-sm hover:bg-[#255580] disabled:bg-emerald-600 transition-colors">
              {tableVerified ? "Table Verified ✓" : "Verify Table Data"}
            </button>
          </div>
          {tableFeedback.message && (
            <div className={`text-center p-2 text-xs font-bold border-t ${tableFeedback.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{tableFeedback.message}</div>
          )}
        </div>
      )}

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      {/* --- PROTECTED INTERACTIVE ANSWER ENTRY CONTEXT --- */}
      <div className="w-full flex items-center justify-center my-6 overflow-x-auto" style={{ textTransform: 'none' }}>
        <div 
          className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-2 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
          style={{ textTransform: 'none' }}
        >
          <label className="text-sm font-black text-slate-600 select-none" style={{ textTransform: 'none' }}>{problem.label}</label>
          <input 
            type="number" 
            step="any"
            className={`chem-input ${feedback.status}`}
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            placeholder="0.00"
            disabled={mode === 'table_practice' && !tableVerified}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            style={{ maxWidth: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', textTransform: 'none' }}
          />
          <span className="text-sm font-black text-slate-500 select-none" style={{ textTransform: 'none' }}>{problem.unit}</span>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer} disabled={mode === 'table_practice' && !tableVerified}>Check Answer</button>
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

export default AcidBaseTitration;
