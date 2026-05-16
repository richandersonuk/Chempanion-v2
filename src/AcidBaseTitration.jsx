import React, { useState, useEffect } from 'react';

const AcidBaseTitration = () => {
  const [mode, setMode] = useState('standard');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // Interactive Table State Elements
  const [tableTitres, setTableTitres] = useState({ t1: '', t2: '', t3: '' });
  const [concordantSelections, setConcordantSelections] = useState({ rough: false, t1: false, t2: false, t3: false });
  const [studentMean, setStudentMean] = useState('');
  const [tableVerified, setTableVerified] = useState(false);
  const [tableFeedback, setTableFeedback] = useState({ message: '', status: '' });

  // Helper utility to round generated parameters strictly to standard laboratory 0.05 intervals
  const roundTo05 = (val) => Math.round(val * 20) / 20;

  const generateProblem = (forcedMode = null) => {
    const modes = ['standard', 'back_titration', 'double_titration', 'table_practice', 'read_burette'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    let newProb = {};
    
    // Clear interactive states
    setTableTitres({ t1: '', t2: '', t3: '' });
    setConcordantSelections({ rough: false, t1: false, t2: false, t3: false });
    setStudentMean('');
    setTableVerified(false);
    setTableFeedback({ message: '', status: '' });

    if (targetMode === 'standard') {
      const volBase = 25.0;
      const titre = roundTo05(15.10 + Math.random() * 12);
      const poolChoice = Math.random();

      if (poolChoice < 0.33) {
        const concAcid = parseFloat((0.05 + Math.random() * 0.1).toFixed(3));
        const concBase = (concAcid * titre) / volBase;

        newProb = {
          title: "Standard Titration (1:1 Ratio)",
          text: <>A <b>25.0 cm³</b> sample of sodium hydroxide solution (NaOH) was titrated against <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid (HCl). The mean titre recorded was <b>{titre.toFixed(2)} cm³</b>.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³.",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      } else if (poolChoice < 0.66) {
        const concAcid = parseFloat((0.025 + Math.random() * 0.05).toFixed(3));
        const concBase = (2 * concAcid * titre) / volBase;

        newProb = {
          title: "Standard Titration (2:1 Ratio Trap)",
          text: <>A <b>25.0 cm³</b> sample of sodium hydroxide solution (NaOH) required a mean titre of <b>{titre.toFixed(2)} cm³</b> of <b>{concAcid.toFixed(3)} mol dm⁻³</b> sulfuric acid (H<sub>2</sub>SO<sub>4</sub>) for complete neutralisation.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³. Watch your chemical equation stoichiometry closely!",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      } else {
        const concNaOH = parseFloat((0.04 + Math.random() * 0.04).toFixed(3)); 
        const molesAscorbic25 = (concNaOH * titre) / 1000;
        const massAscorbicInTablet = molesAscorbic25 * 176.12; 

        newProb = {
          title: "Ascorbic Acid (Vitamin C) Assay",
          text: <>A student dissolved a commercial Vitamin C supplement tablet in distilled water to make exactly <b>25.0 cm³</b> of solution. This entire sample was titrated against <b>{concNaOH.toFixed(3)} mol dm⁻³</b> standard sodium hydroxide solution (NaOH), requiring a titre of <b>{titre.toFixed(2)} cm³</b> for complete neutralisation. Ascorbic acid (C<sub>6</sub>H<sub>8</sub>O<sub>6</sub>) reacts with NaOH in a 1:1 molar ratio.</>,
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
      const titreNaOH = roundTo05(15.10 + Math.random() * 12);

      const totalMolesAcid = (volAcidAdded * concAcid) / 1000;
      const molesNaOHUsed = (titreNaOH * concNaOH) / 1000;
      
      const excessMolesAcidInFlask = molesNaOHUsed * (250.0 / 25.0);
      const reactedMolesAcid = totalMolesAcid - excessMolesAcidInFlask;
      
      const molesCaCO3 = reactedMolesAcid / 2;
      const massPureCaCO3 = molesCaCO3 * 100.1;
      const purity = (massPureCaCO3 / massMarble) * 100;

      newProb = {
        title: "Back Titration: % Purity Analysis",
        text: <>An impure <b>{massMarble.toFixed(3)} g</b> sample of calcium carbonate (CaCO<sub>3</sub>) was treated with <b>{volAcidAdded}.0 cm³</b> of <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid (an excess). The mixture was transferred cleanly to a volumetric flask and made up to exactly <b>250.0 cm³</b> with distilled water. A <b>25.0 cm³</b> portion of this solution required <b>{titreNaOH.toFixed(2)} cm³</b> of <b>{concNaOH.toFixed(3)} mol dm⁻³</b> sodium hydroxide for neutralisation.</>,
        question: "Calculate the percentage purity of calcium carbonate in the original sample.",
        label: "% Purity =",
        unit: "%",
        correct: purity.toFixed(1)
      };

    } else if (targetMode === 'double_titration') {
      const volMixture = 25.0;
      const concAcid = 0.100;
      
      const methylTitre = roundTo05(6.00 + Math.random() * 4); 
      const phenTitre = roundTo05(methylTitre + 8.00 + Math.random() * 6); 

      const molesNa2CO3 = (methylTitre * concAcid) / 1000;
      const concNa2CO3 = molesNa2CO3 / (volMixture / 1000);

      const volAcidForNaOH = phenTitre - methylTitre;
      const molesNaOH = (volAcidForNaOH * concAcid) / 1000;
      const concNaOH = molesNaOH / (volMixture / 1000);

      const askForCarbonate = Math.random() > 0.5;

      newProb = {
        title: "Double Indicator Titration (Mixture Analysis)",
        text: <>A <b>25.0 cm³</b> solution containing a mixture of sodium hydroxide (NaOH) and sodium carbonate (Na<sub>2</sub>CO<sub>3</sub>) was titrated against <b>{concAcid.toFixed(3)} mol dm⁻³</b> hydrochloric acid. In the first stage using phenolphthalein indicator, the mixture turned completely colourless after the addition of <b>{phenTitre.toFixed(2)} cm³</b> of acid. Methyl orange indicator was then added to the flask, requiring a <b>further {methylTitre.toFixed(2)} cm³</b> of acid to reach its distinct endpoint.</>,
        question: askForCarbonate 
          ? "Calculate the concentration of sodium carbonate (Na₂CO₃) in the mixture solution in mol dm⁻³." 
          : "Calculate the concentration of sodium hydroxide (NaOH) in the mixture solution in mol dm⁻³.",
        label: askForCarbonate ? "[Na2CO3] =" : "[NaOH] =",
        unit: "mol dm⁻³",
        correct: askForCarbonate ? concNa2CO3.toFixed(3) : concNaOH.toFixed(3)
      };

    } else if (targetMode === 'table_practice') {
      const baseTarget = roundTo05(21.10 + Math.random() * 3); 
      
      const r_init = 0.00; 
      const r_final = baseTarget + roundTo05(0.65 + Math.random() * 0.4);

      const t1_init = 0.50;
      const t1_net = baseTarget - 0.05;
      const t1_final = t1_init + t1_net;

      let t2_init = roundTo05(t1_final + 0.40);
      let t2_net = 0;
      let t2_final = 0;
      
      let t3_init = 0;
      let t3_net = 0;
      let t3_final = 0;

      const achievingConcordanceOnRun2 = Math.random() > 0.5;
      let hasT3 = false;
      let correctConcordant = {};
      let expectedMean = 0;
      let gaps = []; // Track which columns are empty inputs

      if (achievingConcordanceOnRun2) {
        t2_net = baseTarget + 0.05;
        t2_final = t2_init + t2_net;
        hasT3 = false;
        correctConcordant = { rough: false, t1: true, t2: true, t3: false };
        expectedMean = (t1_net + t2_net) / 2;
        gaps = ['t1', 't2']; // Titre 1 and Titre 2 are empty gaps, rough is pre-filled
      } else {
        t2_net = baseTarget + 0.25; 
        t2_final = t2_init + t2_net;
        
        t3_init = roundTo05(t2_final + 0.50);
        t3_net = baseTarget + 0.05; 
        t3_final = t3_init + t3_net;
        
        hasT3 = true;
        correctConcordant = { rough: false, t1: true, t2: false, t3: true };
        expectedMean = (t1_net + t3_net) / 2;
        gaps = ['t1', 't3']; // Titre 1 and Titre 3 are empty gaps, rough and t2 are pre-filled
      }

      const tableData = {
        rough: { init: r_init.toFixed(2), final: r_final.toFixed(2), correctNet: r_final - r_init },
        t1: { init: t1_init.toFixed(2), final: t1_final.toFixed(2), correctNet: t1_net },
        t2: { init: t2_init.toFixed(2), final: t2_final.toFixed(2), correctNet: t2_net },
        t3: hasT3 ? { init: t3_init.toFixed(2), final: t3_final.toFixed(2), correctNet: t3_net } : null,
        hasT3,
        gaps
      };

      const concNaOH = 0.100;
      const volFlaskAcid = 25.0;
      const molesNaOH = (concNaOH * expectedMean) / 1000;
      const concAcid = molesNaOH / (volFlaskAcid / 1000);

      newProb = {
        title: "Burette Data Table & Concordance Practice",
        text: <>A student records the following initial and final burette parameters when titrating <b>25.0 cm³</b> samples of hydrochloric acid (HCl) against a standard solution of <b>0.100 mol dm⁻³</b> sodium hydroxide (NaOH). Complete the <b>missing blanks</b> in the results table below, select which trials are concordant, and establish the mean titre.</>,
        question: "Once your results table parameters have been verified, calculate the molar concentration of the hydrochloric acid solution in mol dm⁻³.",
        label: "[HCl] =",
        unit: "mol dm⁻³",
        correct: concAcid.toFixed(3),
        tableData,
        correctConcordant,
        expectedMean
      };

    } else if (targetMode === 'read_burette') {
      const targetReading = roundTo05(12.05 + Math.random() * 25); 
      const startInt = Math.floor(targetReading);
      
      newProb = {
        title: "Burette Scale Meniscus Interpretation",
        text: <>Observe the close-up vector diagram of the aqueous liquid level inside an analytical burette column. Remember to look straight at the <b>absolute bottom point of the curved meniscus</b> and count the scale values downwards.</>,
        question: "Record the volume shown on the burette scale to the nearest 0.05 cm³.",
        label: "Volume =",
        unit: "cm³",
        correct: targetReading.toFixed(2),
        startInt,
        targetReading
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { 
    generateProblem('standard'); 
  }, []);

  const handleVerifyTable = () => {
    const data = problem.tableData;
    
    if (concordantSelections.rough) {
      setTableFeedback({ 
        message: "❌ Trap Triggered! You checked the 'Rough' trial as concordant. In WJEC grading matrices, the rough titre is an intentional overshoot and must NEVER be flagged as concordant or included in your mean average calculation.", 
        status: "error" 
      });
      return;
    }

    // Validate only the active gaps the user filled
    const t1_user = parseFloat(tableTitres.t1);
    const t2_user = data.gaps.includes('t2') ? parseFloat(tableTitres.t2) : data.t2.correctNet;
    const t3_user = data.hasT3 && data.gaps.includes('t3') ? parseFloat(tableTitres.t3) : (data.hasT3 ? data.t3.correctNet : 0);
    const mean_user = parseFloat(studentMean);

    if (data.gaps.includes('t1') && Math.abs(t1_user - data.t1.correctNet) > 0.01) {
      setTableFeedback({ message: "Incorrect value in Titre 1 gap. Double check your calculation (Final − Initial).", status: "error" });
      return;
    }
    if (data.gaps.includes('t2') && Math.abs(t2_user - data.t2.correctNet) > 0.01) {
      setTableFeedback({ message: "Incorrect value in Titre 2 gap. Double check your calculation (Final − Initial).", status: "error" });
      return;
    }
    if (data.hasT3 && data.gaps.includes('t3') && Math.abs(t3_user - data.t3.correctNet) > 0.01) {
      setTableFeedback({ message: "Incorrect value in Titre 3 gap. Double check your calculation (Final − Initial).", status: "error" });
      return;
    }

    const checks = concordantSelections;
    const targets = problem.correctConcordant;
    if (checks.t1 !== targets.t1 || checks.t2 !== targets.t2 || checks.t3 !== targets.t3) {
      setTableFeedback({ message: "Concordance tracking error. Concordant titres must sit within 0.10 cm³ of each other.", status: "error" });
      return;
    }

    if (Math.abs(mean_user - problem.expectedMean) > 0.01) {
      setTableFeedback({ message: "Incorrect mean value. Calculate the average using only your selected concordant trials.", status: "error" });
      return;
    }

    setTableFeedback({ message: "Results table verified successfully! Final chemical concentration entry field is unlocked.", status: "success" });
    setTableVerified(true);
  };

  const checkAnswer = () => {
    const userVal = parseFloat(studentAnswer);
    const correctVal = parseFloat(problem.correct);
    
    if (isNaN(userVal)) return;

    if (mode === 'read_burette') {
      const rawInputString = studentAnswer.trim();
      const decimalPart = rawInputString.split('.')[1];
      
      if (!decimalPart || decimalPart.length !== 2 || (!decimalPart.endsWith('0') && !decimalPart.endsWith('5'))) {
        setFeedback({ message: "WJEC Precision Trap! Burette scale readings must ALWAYS be recorded to exactly two decimal places, ending in either .00 or .05 (e.g., 12.30 or 24.85).", status: 'error' });
        return;
      }

      if (Math.abs(userVal - correctVal) < 0.01) {
        setFeedback({ message: `Correct! Excellent scale interpretation down to the bottom of the meniscus curve.`, status: 'success' });
      } else {
        setFeedback({ message: `Incorrect scale mapping. Remember that burette values increase downwards! Expected reading: ${problem.correct} cm³.`, status: 'error' });
      }
      return;
    }

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

  const valDiff = problem.targetReading - problem.startInt;
  const meniscusY = 30 + valDiff * 130;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      
      {/* --- DROPDOWN NAVIGATION BAR --- */}
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
            <option value="read_burette">Burette Reading Scale Practice</option>
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

      {/* --- STANDALONE INTERACTIVE MENISCUS TOOL CANVAS --- */}
      {mode === 'read_burette' && (
        <div className="w-full flex flex-col items-center my-6 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 max-w-xs mx-auto shadow-inner relative">
          <svg viewBox="0 0 120 200" className="w-28 h-auto select-none overflow-visible">
            <line x1="40" y1="10" x2="40" y2="190" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="80" y1="10" x2="80" y2="190" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            
            {Array.from({ length: 11 }).map((_, i) => {
              const yPos = 30 + i * 13;
              const isMajor = i === 0 || i === 10;
              const isMedium = i === 5;
              
              return (
                <g key={i}>
                  <line 
                    x1={40} 
                    y1={yPos} 
                    x2={isMajor ? 62 : isMedium ? 54 : 47} 
                    y2={yPos} 
                    stroke="#1e293b" 
                    strokeWidth={isMajor ? "1.5" : "1"} 
                  />
                  {isMajor && (
                    <text x="71" y={yPos + 4} textAnchor="middle" className="text-[12px] font-mono font-black fill-slate-800">
                      {(problem.startInt + (i === 10 ? 1 : 0)).toFixed(0)}
                    </text>
                  )}
                  {!isMajor && !isMedium && (
                    <line x1="40" y1={yPos} x2="44" y2={yPos} stroke="#475569" strokeWidth="0.7" />
                  )}
                </g>
              );
            })}

            <rect x="41.5" y={meniscusY} width="37" height={190 - meniscusY} fill="#e0f2fe" opacity="0.6" />
            <path 
              d={`M 41,${meniscusY - 4.5} Q 60,${meniscusY + 0.5} 79,${meniscusY - 4.5}`} 
              fill="none" 
              stroke="#0284c7" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Scale reads downwards (cm³)</span>
        </div>
      )}

      {/* --- EXAM-STYLE SCROLLABLE RESULTS MATRIX WITH SELECTIVE GAPS --- */}
      {mode === 'table_practice' && (
        <div className="w-full max-w-2xl mx-auto my-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" style={{ textTransform: 'none' }}>
          <div className="w-full overflow-x-auto pb-1">
            <table className="w-full min-w-[520px] text-center text-xs font-bold border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="p-3 text-left">Burette Readings</th>
                  <th className="p-3 bg-slate-100/60 text-slate-400">Rough</th>
                  <th className="p-3">Titre 1</th>
                  <th className="p-3">Titre 2</th>
                  {problem.tableData.hasT3 && <th className="p-3 text-blue-800 bg-blue-50/30">Titre 3</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 text-left bg-slate-50/50">Final Volume (cm³)</td>
                  <td className="p-3 font-mono bg-slate-50/30 text-slate-400">{problem.tableData.rough.final}</td>
                  <td className="p-3 font-mono">{problem.tableData.t1.final}</td>
                  <td className="p-3 font-mono">{problem.tableData.t2.final}</td>
                  {problem.tableData.hasT3 && <td className="p-3 font-mono bg-blue-50/10 text-blue-900">{problem.tableData.t3.final}</td>}
                </tr>
                <tr>
                  <td className="p-3 text-left bg-slate-50/50">Initial Volume (cm³)</td>
                  <td className="p-3 font-mono bg-slate-50/30 text-slate-400">{problem.tableData.rough.init}</td>
                  <td className="p-3 font-mono">{problem.tableData.t1.init}</td>
                  <td className="p-3 font-mono">{problem.tableData.t2.init}</td>
                  {problem.tableData.hasT3 && <td className="p-3 font-mono bg-blue-50/10 text-blue-900">{problem.tableData.t3.init}</td>}
                </tr>
                <tr className="bg-blue-50/10">
                  <td className="p-3 text-left font-black text-slate-800 bg-slate-50/50">Net Titre (cm³)</td>
                  {/* Rough is always pre-filled in this exam style variant layout */}
                  <td className="p-3 font-mono bg-slate-50/30 text-slate-400">{problem.tableData.rough.correctNet.toFixed(2)}</td>
                  
                  {/* Titre 1 is always a blank gap input */}
                  <td className="p-2">
                    <input type="number" step="any" value={tableTitres.t1} onChange={(e) => setTableTitres({...tableTitres, t1: e.target.value})} className="w-16 p-1 text-center border border-slate-300 rounded font-mono text-sm bg-white shadow-sm focus:border-[#326fa0]" placeholder="0.00" disabled={tableVerified} />
                  </td>

                  {/* Titre 2 is a gap input only if it's part of the target concordant pair */}
                  <td className="p-2">
                    {problem.tableData.gaps.includes('t2') ? (
                      <input type="number" step="any" value={tableTitres.t2} onChange={(e) => setTableTitres({...tableTitres, t2: e.target.value})} className="w-16 p-1 text-center border border-slate-300 rounded font-mono text-sm bg-white shadow-sm focus:border-[#326fa0]" placeholder="0.00" disabled={tableVerified} />
                    ) : (
                      <span className="font-mono text-slate-500">{problem.tableData.t2.correctNet.toFixed(2)}</span>
                    )}
                  </td>

                  {/* Titre 3 renders as a gap input only if generated as an active column variant */}
                  {problem.tableData.hasT3 && (
                    <td className="p-2 bg-blue-50/20">
                      {problem.tableData.gaps.includes('t3') ? (
                        <input type="number" step="any" value={tableTitres.t3} onChange={(e) => setTableTitres({...tableTitres, t3: e.target.value})} className="w-16 p-1 text-center border border-slate-300 rounded font-mono text-sm bg-white shadow-sm focus:border-[#326fa0]" placeholder="0.00" disabled={tableVerified} />
                      ) : (
                        <span className="font-mono text-blue-900">{problem.tableData.t3.correctNet.toFixed(2)}</span>
                      )}
                    </td>
                  )}
                </tr>
                <tr>
                  <td className="p-3 text-left bg-slate-50/50">Concordant? (Tick)</td>
                  <td className="p-3 bg-slate-50/30">
                    <input type="checkbox" checked={concordantSelections.rough} onChange={(e) => setConcordantSelections({...concordantSelections, rough: e.target.checked})} className="w-4 h-4 accent-amber-600" disabled={tableVerified} />
                  </td>
                  <td className="p-3">
                    <input type="checkbox" checked={concordantSelections.t1} onChange={(e) => setConcordantSelections({...concordantSelections, t1: e.target.checked})} className="w-4 h-4 accent-[#326fa0]" disabled={tableVerified} />
                  </td>
                  <td className="p-3">
                    <input type="checkbox" checked={concordantSelections.t2} onChange={(e) => setConcordantSelections({...concordantSelections, t2: e.target.checked})} className="w-4 h-4 accent-[#326fa0]" disabled={tableVerified} />
                  </td>
                  {problem.tableData.hasT3 && (
                    <td className="p-3 bg-blue-50/10">
                      <input type="checkbox" checked={concordantSelections.t3} onChange={(e) => setConcordantSelections({...concordantSelections, t3: e.target.checked})} className="w-4 h-4 accent-[#326fa0]" disabled={tableVerified} />
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
          
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
            <div className={`text-center p-3 text-xs font-bold border-t leading-normal ${tableFeedback.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{tableFeedback.message}</div>
          )}
        </div>
      )}

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-2 text-slate-700">
        {problem.question}
      </div>

      {/* --- ANSWER ENTRY BLOCK --- */}
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
