import React, { useState, useEffect } from 'react';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';

const MODE_OPTIONS = [
  { value: 'standard', label: 'Standard Titration (Mixed Valencies & Weak Acids)', shortLabel: 'Standard' },
  { value: 'back_titration', label: 'Back Titration (Aliquot Volumetric)', shortLabel: 'Back Titration' },
  { value: 'double_titration', label: 'Double Titration (WJEC Mixture Assay)', shortLabel: 'Double Indicator' },
  { value: 'table_practice', label: 'Burette Results Table & Concordance', shortLabel: 'Results Table' },
  { value: 'read_burette', label: 'Burette Reading Scale Practice', shortLabel: 'Read Burette' },
];

const AcidBaseTitration = ({ onComplete }) => {
  const [mode, setMode] = useState('standard');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const [tableTitres, setTableTitres] = useState({ t1: '', t2: '', t3: '' });
  const [concordantSelections, setConcordantSelections] = useState({ rough: false, t1: false, t2: false, t3: false });
  const [studentMean, setStudentMean] = useState('');
  const [tableVerified, setTableVerified] = useState(false);
  const [tableFeedback, setTableFeedback] = useState({ message: '', status: '' });
  const [showHint, setShowHint] = useState(false);

  const roundTo05 = (val) => Math.round(val * 20) / 20;

  const generateProblem = (forcedMode = null) => {
    const modes = ['standard', 'back_titration', 'double_titration', 'table_practice', 'read_burette'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    let newProb = {};

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
          title: "Standard Titration",
          text: <>A 25.0 cm³ sample of sodium hydroxide solution (NaOH) was titrated against {concAcid.toFixed(3)} mol dm⁻³ hydrochloric acid (HCl). The mean titre recorded was {titre.toFixed(2)} cm³.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³.",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      } else if (poolChoice < 0.66) {
        const concAcid = parseFloat((0.025 + Math.random() * 0.05).toFixed(3));
        const concBase = (2 * concAcid * titre) / volBase;

        newProb = {
          title: "Standard Titration",
          text: <>A 25.0 cm³ sample of sodium hydroxide solution (NaOH) required a mean titre of {titre.toFixed(2)} cm³ of {concAcid.toFixed(3)} mol dm⁻³ sulfuric acid (H₂SO₄) for complete neutralisation.</>,
          question: "Calculate the concentration of the sodium hydroxide solution in mol dm⁻³.",
          label: "[NaOH] =",
          unit: "mol dm⁻³",
          correct: concBase.toFixed(3)
        };
      } else {
        const concNaOH = parseFloat((0.05 + Math.random() * 0.05).toFixed(3));
        const concAcid = (concNaOH * titre) / volBase;

        newProb = {
          title: "Weak Acid Volumetric Assay",
          text: <>A student titrated a 25.0 cm³ sample of ethanoic acid solution, CH₃COOH (Ka = 1.74 × 10⁻⁵ mol dm⁻³), against a standard solution of sodium hydroxide, NaOH. Complete neutralisation required a mean titre of {titre.toFixed(2)} cm³ of {concNaOH.toFixed(3)} mol dm⁻³ sodium hydroxide.</>,
          question: "Calculate the molar concentration of the ethanoic acid solution in mol dm⁻³.",
          label: "[CH₃COOH] =",
          unit: "mol dm⁻³",
          correct: concAcid.toFixed(3)
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
        text: <>An impure {massMarble.toFixed(3)} g sample of calcium carbonate (CaCO₃) was treated with {volAcidAdded}.0 cm³ of {concAcid.toFixed(3)} mol dm⁻³ hydrochloric acid (an excess). The mixture was transferred cleanly to a volumetric flask and made up to exactly 250.0 cm³ with distilled water. A 25.0 cm³ portion of this solution required {titreNaOH.toFixed(2)} cm³ of {concNaOH.toFixed(3)} mol dm⁻³ sodium hydroxide for neutralisation.</>,
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
        text: <>A 25.0 cm³ solution containing a mixture of sodium hydroxide (NaOH) and sodium carbonate (Na₂CO₃) was titrated against {concAcid.toFixed(3)} mol dm⁻³ hydrochloric acid. In the first stage using phenolphthalein indicator, the mixture turned completely colourless after the addition of {phenTitre.toFixed(2)} cm³ of acid. Methyl orange indicator was then added to the flask, requiring a further {methylTitre.toFixed(2)} cm³ of acid to reach its distinct endpoint.</>,
        question: askForCarbonate
          ? "Calculate the concentration of sodium carbonate (Na₂CO₃) in the mixture solution in mol dm⁻³."
          : "Calculate the concentration of sodium hydroxide (NaOH) in the mixture solution in mol dm⁻³.",
        label: askForCarbonate ? "[Na₂CO₃] =" : "[NaOH] =",
        unit: "mol dm⁻³",
        correct: askForCarbonate ? concNa2CO3.toFixed(3) : concNaOH.toFixed(3)
      };

    } else if (targetMode === 'table_practice') {
      const baseTarget = roundTo05(16.10 + Math.random() * 6);

      const r_init = roundTo05(Math.random() * 2);
      const r_final = r_init + baseTarget + roundTo05(0.65 + Math.random() * 0.4);

      const t1_init = roundTo05(Math.random() * 4);
      const t1_net = baseTarget - 0.05;
      const t1_final = t1_init + t1_net;

      const t2_init = roundTo05(Math.random() * 4);
      let t2_net = 0;
      let t2_final = 0;

      const t3_init = roundTo05(Math.random() * 4);
      let t3_net = 0;
      let t3_final = 0;

      const achievingConcordanceOnRun2 = Math.random() > 0.5;
      let hasT3 = false;
      let correctConcordant = {};
      let expectedMean = 0;
      let gaps = [];

      if (achievingConcordanceOnRun2) {
        t2_net = baseTarget + 0.05;
        t2_final = t2_init + t2_net;
        hasT3 = false;
        correctConcordant = { rough: false, t1: true, t2: true, t3: false };
        expectedMean = (t1_net + t2_net) / 2;
        gaps = ['t1', 't2'];
      } else {
        t2_net = baseTarget + 0.25;
        t2_final = t2_init + t2_net;
        t3_net = baseTarget + 0.05;
        t3_final = t3_init + t3_net;
        hasT3 = true;
        correctConcordant = { rough: false, t1: true, t2: false, t3: true };
        expectedMean = (t1_net + t3_net) / 2;
        gaps = ['t1', 't3'];
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
        text: <>A student records the following initial and final burette parameters when titrating 25.0 cm³ samples of hydrochloric acid (HCl) against a standard solution of 0.100 mol dm⁻³ sodium hydroxide (NaOH). Complete the missing blanks in the results table below, select which trials are concordant, and establish the mean titre.</>,
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
        title: "Burette Scale Interpretation",
        text: <>A student recorded the initial volume of a solution inside an analytical burette prior to commencing a titration. The diagram below shows a close-up view of the liquid column level section.</>,
        question: "Record the volume shown on the burette scale to the appropriate degree of precision.",
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
    setShowHint(false);
  };

  useEffect(() => {
    generateProblem('standard');
  }, []);

  const handleVerifyTable = () => {
    const data = problem.tableData;
    if (concordantSelections.rough) {
      setTableFeedback({
        message: "❌ Incorrect selection. The rough titre must not be flagged as concordant or included in your mean average calculation.",
        status: "error"
      });
      return;
    }

    const t1_user = parseFloat(tableTitres.t1);
    const t2_user = data.gaps.includes('t2') ? parseFloat(tableTitres.t2) : data.t2.correctNet;
    const t3_user = data.hasT3 && data.gaps.includes('t3') ? parseFloat(tableTitres.t3) : (data.hasT3 ? data.t3.correctNet : 0);
    const mean_user = parseFloat(studentMean);

    if (data.gaps.includes('t1') && Math.abs(t1_user - data.t1.correctNet) > 0.01) {
      setTableFeedback({ message: "Incorrect value in Titre 1 gap. Check your calculation (Final − Initial).", status: "error" });
      return;
    }
    if (data.gaps.includes('t2') && Math.abs(t2_user - data.t2.correctNet) > 0.01) {
      setTableFeedback({ message: "Incorrect value in Titre 2 gap. Check your calculation (Final − Initial).", status: "error" });
      return;
    }
    if (data.hasT3 && data.gaps.includes('t3') && Math.abs(t3_user - data.t3.correctNet) > 0.01) {
      setTableFeedback({ message: "Incorrect value in Titre 3 gap. Check your calculation (Final − Initial).", status: "error" });
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

    setTableFeedback({ message: "Results table verified successfully! Final concentration entry field is unlocked.", status: "success" });
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
        setFeedback({ message: "Precision Error: Burette readings must be recorded to exactly two decimal places, ending in either .00 or .05.", status: 'error' });
        return;
      }

      if (Math.abs(userVal - correctVal) < 0.01) {
        setFeedback({ message: `Correct! Burette reading successfully recorded.`, status: 'success' });
        onComplete?.(`burette_${problem.correct}`);
      } else {
        setFeedback({ message: `Incorrect reading. Check your scale alignment.`, status: 'error' });
      }
      return;
    }

    const error = Math.abs((userVal - correctVal) / correctVal);
    if (error < 0.025) {
      setFeedback({ message: `Correct! The determined value is ${problem.correct} ${problem.unit}.`, status: 'success' });
      onComplete?.(`${mode}_${problem.correct}`);
    } else {
      let hint = `Incorrect. `;
      if (mode === 'back_titration') {
        hint += `Ensure you scaled the moles of excess acid up to account for the total volume of the volumetric flask before evaluating the reacted difference.`;
      } else if (mode === 'double_titration') {
        hint += `Review your indicator endpoint volumes. V₂ determines the carbonate transformation step, while V₁ accounts for both the total hydroxide and partial carbonate conversion.`;
      } else if (mode === 'table_practice') {
        hint += `Use your verified mean titre to find reacting chemical amounts across the target volumes.`;
      } else {
        hint += `Check your reacting stoichiometry ratios and relative mass parameters carefully.`;
      }
      setFeedback({ message: hint, status: 'error' });
    }
  };

  if (!problem) return null;

  const valDiff = problem.targetReading - problem.startInt;
  const meniscusY = 30 + valDiff * 130;

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0" style={{ textTransform: 'none' }}>{problem.title}</div>

      <AdaptivePicker
        label="Choose Practice Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={(val) => { setMode(val); generateProblem(val); }}
        onRandom={() => generateProblem('random')}
        isRandomActive={mode === 'random'}
        collapseBelow="md"
      />

      <div className="applet-workbench">
        {/* Left Column: Titration Scenario + Burette SVG or Results Table + Need a Hint? */}
        <div className="applet-workbench-sticky space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed" style={{ textTransform: 'none' }}>
              {problem.text}
            </div>

            {mode === 'read_burette' && (
              <div className="w-full flex flex-col items-center bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 max-w-xs mx-auto shadow-inner">
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
                          x1="40"
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
                          <line x1="40" y1={yPos} x2={44} y2={yPos} stroke="#475569" strokeWidth="0.7" />
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
              </div>
            )}

            {mode === 'table_practice' && (
              <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" style={{ textTransform: 'none' }}>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-center text-xs font-bold border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] tracking-wider">
                        <th className="p-1.5 sm:p-2.5 text-left">Burette (cm³)</th>
                        <th className="p-1.5 sm:p-2.5 bg-slate-100/60 text-slate-400">Rough</th>
                        <th className="p-1.5 sm:p-2.5">T1</th>
                        <th className="p-1.5 sm:p-2.5">T2</th>
                        {problem.tableData.hasT3 && <th className="p-1.5 sm:p-2.5 text-blue-800 bg-blue-50/30">T3</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-1.5 sm:p-2.5 text-left bg-slate-50/50">Final</td>
                        <td className="p-1.5 sm:p-2.5 font-mono bg-slate-50/30 text-slate-400">{problem.tableData.rough.final}</td>
                        <td className="p-1.5 sm:p-2.5 font-mono">{problem.tableData.t1.final}</td>
                        <td className="p-1.5 sm:p-2.5 font-mono">{problem.tableData.t2.final}</td>
                        {problem.tableData.hasT3 && <td className="p-1.5 sm:p-2.5 font-mono bg-blue-50/10 text-blue-900">{problem.tableData.t3.final}</td>}
                      </tr>
                      <tr>
                        <td className="p-1.5 sm:p-2.5 text-left bg-slate-50/50">Initial</td>
                        <td className="p-1.5 sm:p-2.5 font-mono bg-slate-50/30 text-slate-400">{problem.tableData.rough.init}</td>
                        <td className="p-1.5 sm:p-2.5 font-mono">{problem.tableData.t1.init}</td>
                        <td className="p-1.5 sm:p-2.5 font-mono">{problem.tableData.t2.init}</td>
                        {problem.tableData.hasT3 && <td className="p-1.5 sm:p-2.5 font-mono bg-blue-50/10 text-blue-900">{problem.tableData.t3.init}</td>}
                      </tr>
                      <tr className="bg-blue-50/10">
                        <td className="p-1.5 sm:p-2.5 text-left font-black text-slate-800 bg-slate-50/50">Net Titre</td>
                        <td className="p-1.5 sm:p-2.5 font-mono bg-slate-50/30 text-slate-400">{problem.tableData.rough.correctNet.toFixed(2)}</td>
                        <td className="p-1.5 sm:p-2.5">
                          <input type="number" step="any" inputMode="decimal" onWheel={(e) => e.currentTarget.blur()} value={tableTitres.t1} onChange={(e) => setTableTitres({...tableTitres, t1: e.target.value})} className="w-14 sm:w-16 p-1.5 text-center border border-slate-300 rounded font-mono text-xs sm:text-sm bg-white shadow-sm focus:border-[#326fa0]" placeholder="0.00" disabled={tableVerified} />
                        </td>
                        <td className="p-1.5 sm:p-2.5">
                          {problem.tableData.gaps.includes('t2') ? (
                            <input type="number" step="any" inputMode="decimal" onWheel={(e) => e.currentTarget.blur()} value={tableTitres.t2} onChange={(e) => setTableTitres({...tableTitres, t2: e.target.value})} className="w-14 sm:w-16 p-1.5 text-center border border-slate-300 rounded font-mono text-xs sm:text-sm bg-white shadow-sm focus:border-[#326fa0]" placeholder="0.00" disabled={tableVerified} />
                          ) : (
                            <span className="font-mono text-slate-500">{problem.tableData.t2.correctNet.toFixed(2)}</span>
                          )}
                        </td>
                        {problem.tableData.hasT3 && (
                          <td className="p-1.5 sm:p-2.5 bg-blue-50/20">
                            {problem.tableData.gaps.includes('t3') ? (
                              <input type="number" step="any" inputMode="decimal" onWheel={(e) => e.currentTarget.blur()} value={tableTitres.t3} onChange={(e) => setTableTitres({...tableTitres, t3: e.target.value})} className="w-14 sm:w-16 p-1.5 text-center border border-slate-300 rounded font-mono text-xs sm:text-sm bg-white shadow-sm focus:border-[#326fa0]" placeholder="0.00" disabled={tableVerified} />
                            ) : (
                              <span className="font-mono text-blue-900">{problem.tableData.t3.correctNet.toFixed(2)}</span>
                            )}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex flex-col items-start pt-1">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="min-h-[36px] px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
              >
                💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
              {showHint && (
                <div className="mt-2.5 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
                  <strong className="font-black text-amber-900">Titration Method: </strong>
                  {mode === 'read_burette'
                    ? 'Read burette graduations downwards from the top integer mark to the bottom of the curved meniscus, recording strictly to 2 d.p. ending in .00 or .05 cm³.'
                    : mode === 'table_practice'
                    ? 'Compute Net Titre = Final − Initial. Exclude the rough titre and average only concordant trials within 0.10 cm³, then calculate n = c × V(cm³) ÷ 1000.'
                    : mode === 'back_titration'
                    ? 'Find total excess HCl added initially, find leftover HCl in the 25.0 cm³ sample from NaOH, scale ×10 up to 250.0 cm³, subtract to get reacted HCl, and use the 1:2 CaCO₃:HCl ratio.'
                    : mode === 'double_titration'
                    ? 'The second titre V₂ (methyl orange stage) neutralises remaining NaHCO₃ → H₂O + CO₂, directly giving moles of Na₂CO₃. Subtract V₂ from V₁ (phenolphthalein stage) to isolate acid used by NaOH.'
                    : 'Use n = c × V(cm³) ÷ 1000 for the standard solution, apply the balanced mole ratio (note 2:1 for NaOH : H₂SO₄), then solve c = n ÷ V(dm³).'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Concordance/Mean Titre + Concentration Input + Buttons + Feedback */}
        <div className="space-y-4">
          {mode === 'table_practice' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                  Step 1: Concordance &amp; Mean Titre
                </span>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Select which trials are concordant (within 0.10 cm³), then enter the mean titre.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="flex items-center justify-center gap-2 min-h-[40px] px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer">
                  <input type="checkbox" aria-label="Mark rough titre concordant" checked={concordantSelections.rough} onChange={(e) => setConcordantSelections({...concordantSelections, rough: e.target.checked})} className="w-4 h-4 accent-amber-600 cursor-pointer" disabled={tableVerified} />
                  <span>Rough</span>
                </label>
                <label className="flex items-center justify-center gap-2 min-h-[40px] px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" aria-label="Mark Titre 1 concordant" checked={concordantSelections.t1} onChange={(e) => setConcordantSelections({...concordantSelections, t1: e.target.checked})} className="w-4 h-4 accent-[#326fa0] cursor-pointer" disabled={tableVerified} />
                  <span>Titre 1</span>
                </label>
                <label className="flex items-center justify-center gap-2 min-h-[40px] px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" aria-label="Mark Titre 2 concordant" checked={concordantSelections.t2} onChange={(e) => setConcordantSelections({...concordantSelections, t2: e.target.checked})} className="w-4 h-4 accent-[#326fa0] cursor-pointer" disabled={tableVerified} />
                  <span>Titre 2</span>
                </label>
                {problem.tableData.hasT3 && (
                  <label className="flex items-center justify-center gap-2 min-h-[40px] px-2.5 py-2 rounded-xl border border-blue-200 bg-blue-50/40 text-xs font-bold text-blue-900 cursor-pointer">
                    <input type="checkbox" aria-label="Mark Titre 3 concordant" checked={concordantSelections.t3} onChange={(e) => setConcordantSelections({...concordantSelections, t3: e.target.checked})} className="w-4 h-4 accent-[#326fa0] cursor-pointer" disabled={tableVerified} />
                    <span>Titre 3</span>
                  </label>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-slate-700">Calculated Mean Titre (cm³):</span>
                  <input type="number" step="any" inputMode="decimal" onWheel={(e) => e.currentTarget.blur()} value={studentMean} onChange={(e) => setStudentMean(e.target.value)} className="w-20 p-1.5 text-center border border-slate-300 rounded-lg font-mono font-bold text-sm bg-white" placeholder="0.00" disabled={tableVerified} />
                </div>
                <button type="button" onClick={handleVerifyTable} disabled={tableVerified} className="min-h-[38px] px-4 py-2 bg-[#326fa0] text-white font-black text-xs rounded-xl tracking-wider shadow-sm hover:bg-[#255580] disabled:bg-emerald-600 transition-colors cursor-pointer">
                  {tableVerified ? "Table Verified ✓" : "Verify Table Data"}
                </button>
              </div>

              {tableFeedback.message && (
                <div className={`text-left p-3 rounded-xl text-xs font-bold border leading-normal ${tableFeedback.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                  {tableFeedback.message}
                </div>
              )}
            </div>
          )}

          <div className={`bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-opacity ${mode === 'table_practice' && !tableVerified ? 'opacity-60' : 'opacity-100'}`}>
            <div className="font-bold text-sm text-slate-700 leading-relaxed" style={{ textTransform: 'none' }}>
              {problem.question}
            </div>

            <div className="w-full flex items-center justify-center">
              <div
                className="w-full flex flex-row items-center justify-center flex-wrap gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm"
                style={{ textTransform: 'none' }}
              >
                <label className="text-sm font-black text-slate-600 select-none" style={{ textTransform: 'none' }}>{problem.label}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className={`chem-input ${feedback.status}`}
                  value={studentAnswer}
                  onChange={(e) => { setStudentAnswer(e.target.value); if (feedback.message) setFeedback({ message: '', status: '' }); }}
                  placeholder="0.00"
                  disabled={mode === 'table_practice' && !tableVerified}
                  onKeyDown={(e) => e.key === 'Enter' && (feedback.status === 'success' ? generateProblem() : checkAnswer())}
                  style={{ maxWidth: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', textTransform: 'none' }}
                />
                <span className="text-sm font-black text-slate-500 select-none" style={{ textTransform: 'none' }}>{problem.unit}</span>
              </div>
            </div>

            <div className="button-group">
              <button type="button" className="btn btn-primary" onClick={checkAnswer} disabled={mode === 'table_practice' && !tableVerified}>Check Answer</button>
              <button type="button" className="btn btn-secondary" onClick={() => generateProblem()}>Next Problem &rarr;</button>
            </div>
          </div>

          {feedback.message && (
            <div className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
              <span className="text-xs sm:text-sm font-semibold">{feedback.message}</span>
              {feedback.status === 'success' && (
                <button
                  type="button"
                  onClick={() => generateProblem()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Next Problem &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcidBaseTitration;
