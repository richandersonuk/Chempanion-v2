import React, { useState, useEffect } from 'react';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';

const CellDiagram = ({ anode, cathode }) => (
  <svg viewBox="0 0 400 220" className="w-full h-auto max-w-md mx-auto my-2 stroke-[var(--chem-text-main)] fill-none stroke-2">
    <path d="M 60 100 L 60 200 L 160 200 L 160 100" />
    <path d="M 240 100 L 240 200 L 340 200 L 340 100" />

    <line x1="60" y1="120" x2="160" y2="120" className="stroke-[var(--chem-slate-300)] stroke-1 stroke-dasharray-4" />
    <line x1="240" y1="120" x2="340" y2="120" className="stroke-[var(--chem-slate-300)] stroke-1 stroke-dasharray-4" />

    <path d="M 130 140 L 130 60 L 270 60 L 270 140" className="stroke-[var(--chem-primary)] stroke-[12px] opacity-20" />
    <path d="M 130 140 L 130 60 L 270 60 L 270 140" className="stroke-[var(--chem-primary)] stroke-[2px]" />

    <circle cx="200" cy="40" r="22" className="fill-[var(--chem-bg-main)] stroke-[var(--chem-border)]" />
    <text x="200" y="46" textAnchor="middle" className="fill-[var(--chem-text-main)] stroke-none font-bold text-sm">V</text>

    <path d="M 110 40 L 178 40" />
    <path d="M 222 40 L 290 40" />
    <path d="M 110 40 L 110 100" />
    <path d="M 290 40 L 290 100" />

    <rect x="100" y="100" width="20" height="80" className="fill-[var(--chem-slate-200)] stroke-[var(--chem-text-main)]" />
    <rect x="280" y="100" width="20" height="80" className="fill-[var(--chem-slate-200)] stroke-[var(--chem-text-main)]" />

    <text x="110" y="215" textAnchor="middle" className="fill-[var(--chem-text-muted)] stroke-none font-mono text-[10px]">Anode ({anode?.name})</text>
    <text x="290" y="215" textAnchor="middle" className="fill-[var(--chem-text-muted)] stroke-none font-mono text-[10px]">Cathode ({cathode?.name})</text>
  </svg>
);

const MODE_OPTIONS = [
  { value: 'calc_emf', label: 'Calculate Standard Cell EMF (E°cell)', shortLabel: 'Standard EMF (E°cell)' },
  { value: 'cell_notation', label: 'Build Conventional Cell Notation', shortLabel: 'Cell Notation' },
  { value: 'feasibility_shifts', label: 'Predict Non-Standard Condition Shifts', shortLabel: 'Non-Standard Shifts' },
];

const CellPotentials = ({ onComplete }) => {
  const [mode, setMode] = useState('calc_emf');
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  const [showHint, setShowHint] = useState(false);

  const halfCells = [
    { id: 'al', sys: <>Al<sup>3+</sup>(aq) + 3e<sup>&minus;</sup> &#x21CC; Al(s)</>, e0: -1.66, solid: true, electrons: 3, name: 'aluminium' },
    { id: 'zn', sys: <>Zn<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#x21CC; Zn(s)</>, e0: -0.76, solid: true, electrons: 2, name: 'zinc' },
    { id: 'ni', sys: <>Ni<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#x21CC; Ni(s)</>, e0: -0.25, solid: true, electrons: 2, name: 'nickel' },
    { id: 'sn', sys: <>Sn<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#x21CC; Sn(s)</>, e0: -0.14, solid: true, electrons: 2, name: 'tin' },
    { id: 'cu', sys: <>Cu<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#x21CC; Cu(s)</>, e0: 0.34, solid: true, electrons: 2, name: 'copper' },
    { id: 'fe', sys: <>Fe<sup>3+</sup>(aq) + e<sup>&minus;</sup> &#x21CC; Fe<sup>2+</sup>(aq)</>, e0: 0.77, solid: false, electrons: 1, name: 'iron(II)/iron(III)' },
    { id: 'ag', sys: <>Ag<sup>+</sup>(aq) + e<sup>&minus;</sup> &#x21CC; Ag(s)</>, e0: 0.80, solid: true, electrons: 1, name: 'silver' },
    { id: 'br', sys: <>Br<sub>2</sub>(l) + 2e<sup>&minus;</sup> &#x21CC; 2Br<sup>&minus;</sup>(aq)</>, e0: 1.09, solid: false, electrons: 2, name: 'bromine/bromide' },
    { id: 'cl', sys: <>Cl<sub>2</sub>(g) + 2e<sup>&minus;</sup> &#x21CC; 2Cl<sup>&minus;</sup>(aq)</>, e0: 1.36, solid: false, electrons: 2, name: 'chlorine/chloride' },
    { id: 'mn', sys: <>MnO<sub>4</sub><sup>&minus;</sup>(aq) + 8H<sup>+</sup>(aq) + 5e<sup>&minus;</sup> &#x21CC; Mn<sup>2+</sup>(aq) + 4H<sub>2</sub>O(l)</>, e0: 1.51, solid: false, electrons: 5, name: 'manganate(VII)' }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['calc_emf', 'cell_notation', 'feasibility_shifts'];
    const rawSelection = forcedMode || (isRandomMode ? 'random' : mode);
    const selection = rawSelection === 'random'
      ? modes[Math.floor(Math.random() * modes.length)]
      : rawSelection;

    setMode(selection);
    setStudentAnswer('');
    setSelectedCard(null);
    setFeedback({ message: '', status: '' });
    setShowHint(false);

    let cellA = halfCells[Math.floor(Math.random() * halfCells.length)];
    let cellB = halfCells[Math.floor(Math.random() * halfCells.length)];
    while (cellA.id === cellB.id || cellA.e0 === cellB.e0) {
      cellB = halfCells[Math.floor(Math.random() * halfCells.length)];
    }

    const anode = cellA.e0 < cellB.e0 ? cellA : cellB;
    const cathode = cellA.e0 > cellB.e0 ? cellA : cellB;
    const trueEMF = cathode.e0 - anode.e0;

    let newProb = {};

    if (selection === 'calc_emf') {
      newProb = {
        title: "Standard Cell Potential Calculation (E°cell)",
        text: <>An electrochemical cell is constructed under standard laboratory conditions using the <b>{cellA.name}</b> and <b>{cellB.name}</b> half-cells (see the Standard Electrode Potentials table):</>,
        halfCellData: [cellA, cellB],
        question: "Calculate the overall standard cell potential (E°cell) in volts.",
        label: "E°cell =",
        unit: "V",
        correct: (trueEMF >= 0 ? "+" : "") + trueEMF.toFixed(2),
        meta: { anode, cathode, trueEMF },
        requiresDiagram: true
      };
    } else if (selection === 'cell_notation') {
      const formatComponent = (cell, isAnode) => {
        if (cell.id === 'al') return isAnode ? <>Al(s) | Al<sup>3+</sup>(aq)</> : <>Al<sup>3+</sup>(aq) | Al(s)</>;
        if (cell.id === 'zn') return isAnode ? <>Zn(s) | Zn<sup>2+</sup>(aq)</> : <>Zn<sup>2+</sup>(aq) | Zn(s)</>;
        if (cell.id === 'ni') return isAnode ? <>Ni(s) | Ni<sup>2+</sup>(aq)</> : <>Ni<sup>2+</sup>(aq) | Ni(s)</>;
        if (cell.id === 'sn') return isAnode ? <>Sn(s) | Sn<sup>2+</sup>(aq)</> : <>Sn<sup>2+</sup>(aq) | Sn(s)</>;
        if (cell.id === 'cu') return isAnode ? <>Cu(s) | Cu<sup>2+</sup>(aq)</> : <>Cu<sup>2+</sup>(aq) | Cu(s)</>;
        if (cell.id === 'ag') return isAnode ? <>Ag(s) | Ag<sup>+</sup>(aq)</> : <>Ag<sup>+</sup>(aq) | Ag(s)</>;
        if (cell.id === 'fe') return isAnode ? <>Pt(s) | Fe<sup>2+</sup>(aq), Fe<sup>3+</sup>(aq)</> : <>Fe<sup>3+</sup>(aq), Fe<sup>2+</sup>(aq) | Pt(s)</>;
        if (cell.id === 'br') return isAnode ? <>Pt(s) | 2Br<sup>&minus;</sup>(aq) | Br<sub>2</sub>(l)</> : <>Br<sub>2</sub>(l) | 2Br<sup>&minus;</sup>(aq) | Pt(s)</>;
        if (cell.id === 'cl') return isAnode ? <>Pt(s) | 2Cl<sup>&minus;</sup>(aq) | Cl<sub>2</sub>(g)</> : <>Cl<sub>2</sub>(g) | 2Cl<sup>&minus;</sup>(aq) | Pt(s)</>;
        return isAnode ? <>Pt(s) | Mn<sup>2+</sup>(aq), MnO<sub>4</sub><sup>&minus;</sup>(aq)</> : <>MnO<sub>4</sub><sup>&minus;</sup>(aq), Mn<sup>2+</sup>(aq) | Pt(s)</>;
      };

      const correctComponent = <>{formatComponent(anode, true)} || {formatComponent(cathode, false)}</>;
      const flippedComponent = <>{formatComponent(cathode, true)} || {formatComponent(anode, false)}</>;

      const choices = [
        { text: correctComponent, isCorrect: true },
        { text: flippedComponent, isCorrect: false, trap: "flipped" },
      ];

      if (!anode.solid || !cathode.solid) {
        choices.push({
          text: <>{formatComponent(anode, true)} || {formatComponent(cathode, false)} <sub>(Missing Inert Electrode)</sub></>,
          isCorrect: false,
          trap: "missing_pt"
        });
      } else {
        choices.push({
          text: <>{formatComponent(anode, false)} || {formatComponent(cathode, true)}</>,
          isCorrect: false,
          trap: "flipped"
        });
      }

      newProb = {
        title: "Conventional Cell Diagrams",
        text: <>Consider a standard cell comprising a <b>{cellA.name}</b> half-cell joined across a salt bridge to a standard <b>{cellB.name}</b> half-cell (refer to the Standard Electrode Potentials table).</>,
        question: "Select the correct, standard conventional representation notation layout string for this operational cell matrix.",
        choices: choices.sort(() => Math.random() - 0.5),
        meta: { anode, cathode },
        isCards: true
      };
    } else if (selection === 'feasibility_shifts') {
      const conditionOptions = [
        {
          key: 'cathode_reactant',
          desc: `increasing the concentration of the oxidised (left-hand) species in the ${cathode.name} cathode half-cell`,
          effect: 'increase',
          hint: `Increasing reactant concentration in the ${cathode.name} reduction equilibrium shifts it to the right, making E(cathode) more positive and widening E°cell.`
        },
        {
          key: 'cathode_dilute',
          desc: `diluting the aqueous reactant ions in the ${cathode.name} cathode compartment with distilled water`,
          effect: 'decrease',
          hint: `Decreasing reactant ion concentration in the ${cathode.name} cathode shifts its reduction equilibrium left, lowering E(cathode) and narrowing E°cell.`
        },
        {
          key: 'anode_product',
          desc: `increasing the concentration of the oxidised (left-hand) species in the ${anode.name} anode half-cell`,
          effect: 'decrease',
          hint: `Increasing left-hand ion concentration in the ${anode.name} anode equilibrium shifts it right, making E(anode) less negative and shrinking E(cathode) − E(anode).`
        },
        {
          key: 'electrode_area',
          desc: `doubling the physical surface area of the solid electrode strips in a cell built with ${anode.name} and ${cathode.name}`,
          effect: 'unchanged',
          hint: 'Electrode surface area affects reaction rate / maximum current, NOT the thermodynamic equilibrium position or intensive electrode potential.'
        }
      ];
      const activeCondition = conditionOptions[Math.floor(Math.random() * conditionOptions.length)];

      newProb = {
        title: "Non-Standard Equilibrium Conditions",
        text: <>A functional cell combining <b>{anode.name}</b> (anode) and <b>{cathode.name}</b> (cathode) is set up under standard conditions. A technician modifies the system by <b>{activeCondition.desc}</b>.</>,
        question: "Predict how the measured cell potential (Ecell) responds compared to the standard E°cell baseline.",
        choices: [
          { text: "Cell potential increases (Ecell becomes more positive)", id: 'increase' },
          { text: "Cell potential decreases (EMF gap narrows)", id: 'decrease' },
          { text: "Cell potential remains completely unchanged", id: 'unchanged' }
        ],
        correctId: activeCondition.effect,
        condKey: activeCondition.key,
        meta: { anode, cathode },
        hint: activeCondition.hint,
        isCards: true
      };
    }

    setProblem(newProb);
  };

  useEffect(() => {
    generateProblem('calc_emf');
  }, []);

  const checkAnswer = () => {
    if (mode === 'calc_emf') {
      const raw = studentAnswer.trim();
      if (!raw) return;

      if (!raw.startsWith('+') && !raw.startsWith('-')) {
        setFeedback({
          message: "WJEC Sign Penalty! Cell EMF representations must explicitly state the sign context (+ or \u2212) to state thermodynamic direction. Leaving it blank scores zero.",
          status: 'error'
        });
        return;
      }

      const decimalCheck = raw.split('.')[1];
      if (!decimalCheck || decimalCheck.length !== 2) {
        setFeedback({
          message: "WJEC Precision Error: Standard potentials and cell EMF outputs must be stated to exactly 2 decimal places, including any trailing zeros (e.g., +1.10 V).",
          status: 'error'
        });
        return;
      }

      const userVal = parseFloat(raw);
      const targetVal = parseFloat(problem.correct);
      const isCorrect = Math.abs(userVal - targetVal) < 0.01;
      const { anode, cathode } = problem.meta;

      if (!isCorrect) {
        const wrongValAnodeMult = cathode.e0 - (anode.e0 * cathode.electrons);
        const wrongValCathodeMult = (cathode.e0 * anode.electrons) - anode.e0;
        const wrongValBothMult = (cathode.e0 * anode.electrons) - (anode.e0 * cathode.electrons);

        if (Math.abs(userVal - wrongValAnodeMult) < 0.02 || Math.abs(userVal - wrongValCathodeMult) < 0.02 || Math.abs(userVal - wrongValBothMult) < 0.02) {
          setFeedback({
            message: "WJEC Multiplier Trap Triggered! Standard electrode potentials (E°) are intensive properties. They depend entirely on concentration and temperature, NOT the reaction stoichiometry. Never multiply the half-cell voltages when balancing electron counts!",
            status: 'error'
          });
          return;
        }

        setFeedback({ message: "Incorrect. The formula is E°cell = E°(cathode) \u2212 E°(anode). Identify the most positive value as the cathode.", status: 'error' });
      } else {
        setFeedback({ message: `Correct! E°cell = ${problem.correct} V. Complete electrochemical feasibility verified.`, status: 'success' });
        onComplete?.(`emf_${anode.id}_${cathode.id}`);
      }

    } else if (mode === 'cell_notation') {
      if (selectedCard === null) return;
      const selected = problem.choices[selectedCard];
      if (selected.isCorrect) {
        setFeedback({ message: "Flawless! Anode oxidation transitions are mapped on the left, cathode reduction stages on the right, with salt bridge and phase rules correctly maintained.", status: 'success' });
        onComplete?.(`notation_${problem.meta.anode.id}_${problem.meta.cathode.id}`);
      } else {
        let helpText = "Incorrect notation alignment. ";
        if (selected.trap === 'flipped') {
          helpText += "Remember, the oxidation half-cell (the more negative anode system) must be drawn on the left, with the reduction cathode on the right.";
        } else if (selected.trap === 'missing_pt') {
          helpText += "Look out for gaseous or aqueous ionic species without a solid conductive metal. These chemical systems mandate the inclusion of an inert Pt(s) phase boundary connection link.";
        }
        setFeedback({ message: helpText, status: 'error' });
      }
    } else if (mode === 'feasibility_shifts') {
      if (selectedCard === null) return;
      const selected = problem.choices[selectedCard];
      if (selected.id === problem.correctId) {
        setFeedback({ message: `Correct! ${problem.hint}`, status: 'success' });
        onComplete?.(`shift_${problem.meta.anode.id}_${problem.meta.cathode.id}_${problem.condKey}`);
      } else {
        setFeedback({ message: "Incorrect. Apply Le Chatelier's principle to the half-cell reduction equilibrium and check how E(cathode) − E(anode) responds.", status: 'error' });
      }
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">{problem.title}</div>

      <AdaptivePicker
        label="Choose Practice Mode"
        options={MODE_OPTIONS}
        value={mode}
        isRandomActive={isRandomMode}
        onChange={(val) => {
          setIsRandomMode(false);
          generateProblem(val);
        }}
        onRandom={() => {
          setIsRandomMode(true);
          generateProblem('random');
        }}
        collapseBelow="sm"
      />

      {/* Scenario Prompt & Collapsible Hint above workbench so mobile users read the question first */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xs">
        <div className="question-text !mb-0 text-center md:text-left leading-relaxed text-sm sm:text-base">
          {problem.text}
        </div>
        <div className="flex flex-col items-center md:items-start">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="min-h-[34px] px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
          >
            💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
          </button>
          {showHint && (
            <div className="mt-2 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
              <strong className="font-black text-amber-900">Electrochemistry Method: </strong>
              {mode === 'calc_emf'
                ? 'Identify the more positive (or less negative) E° as the cathode (reduction) and compute E°cell = E°(cathode) − E°(anode) to 2 d.p. with an explicit + or − sign. Never multiply E° values by reaction stoichiometry!'
                : mode === 'cell_notation'
                ? 'Place the oxidation half-cell (more negative E°) on the left and the reduction half-cell on the right separated by a salt bridge (||). Include Pt(s) whenever a half-cell has no solid metal electrode.'
                : 'Half-cell equations are written as reductions (oxidised + ne⁻ ⇌ reduced). Shifting a half-cell right raises its electrode potential E; shifting left lowers E.'}
            </div>
          )}
        </div>
      </div>

      <div className="applet-workbench">
        {/* Left Column: Diagram & Provided Standard Electrode Potentials */}
        <div className="applet-workbench-sticky space-y-3.5">
          {mode === 'calc_emf' && problem.requiresDiagram && (
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <CellDiagram anode={problem.meta.anode} cathode={problem.meta.cathode} />
            </div>
          )}

          {/* Dedicated Exam-Style Standard Electrode Potentials Table (not in WJEC Data Booklet) */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-[10px] font-black tracking-widest text-slate-500">
                Standard Electrode Potentials (298 K, 1.0 mol dm⁻³, 1 atm)
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Provided in Question
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5 sm:px-3 text-[11px] font-bold text-slate-500 rounded-tl-xl">Half-Reaction</th>
                    <th className="py-2 px-2.5 sm:px-3 text-[11px] font-bold text-slate-500 text-right rounded-tr-xl whitespace-nowrap">E° / V</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {halfCells.map((cell) => (
                    <tr key={cell.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-2.5 sm:px-3 text-[11px] sm:text-xs font-mono font-bold text-slate-800 break-words leading-snug">
                        {cell.sys}
                      </td>
                      <td className="py-2 px-2.5 sm:px-3 text-[11px] sm:text-xs font-mono text-right text-[#326fa0] font-black whitespace-nowrap">
                        {cell.e0 > 0 ? `+${cell.e0.toFixed(2)}` : cell.e0.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Question, Input / Choices, Actions & Feedback */}
        <div className="space-y-4">
          <div className="font-bold text-center md:text-left text-[0.95rem] px-1 text-[var(--chem-text-main)]">
            {problem.question}
          </div>

          {problem.isCards && problem.choices && (
            <div className="w-full flex flex-col gap-3">
              {problem.choices.map((choice, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setSelectedCard(i); setFeedback({ message: '', status: '' }); }}
                  className={`w-full min-h-[44px] p-3.5 sm:p-4 text-left text-sm font-bold border rounded-xl transition-all cursor-pointer ${
                    selectedCard === i
                      ? 'bg-[var(--chem-bg-highlight)] border-[var(--chem-primary)] text-[var(--chem-primary)] ring-1 ring-[var(--chem-primary)]'
                      : 'bg-[var(--chem-bg-main)] border-[var(--chem-border)] text-[var(--chem-text-main)] hover:bg-[var(--chem-bg-alt)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedCard === i ? 'border-[var(--chem-primary)] bg-[var(--chem-primary)] text-white text-[10px]' : 'border-[var(--chem-slate-300)]'}`}>
                      {selectedCard === i && "✓"}
                    </span>
                    <span className="font-mono tracking-wide text-xs sm:text-sm break-words min-w-0">{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!problem.isCards && (
            <div className="w-full flex items-center justify-center md:justify-start my-2">
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] rounded-2xl shadow-sm w-full sm:w-auto">
                <label className="text-sm font-black text-[var(--chem-text-main)] select-none">{problem.label}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  className={`w-32 sm:w-36 min-h-[40px] bg-white text-center text-lg font-extrabold py-2 px-3 rounded-lg border focus:outline-none transition-colors ${feedback.status === 'error' ? 'border-red-400 text-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[var(--chem-border)] text-[var(--chem-text-main)] focus:border-[var(--chem-primary)] focus:ring-1 focus:ring-[var(--chem-primary)]'}`}
                  value={studentAnswer}
                  onChange={(e) => { setStudentAnswer(e.target.value); if (feedback.message) setFeedback({ message: '', status: '' }); }}
                  placeholder="+1.10"
                  onKeyDown={(e) => e.key === 'Enter' && (feedback.status === 'success' ? generateProblem() : checkAnswer())}
                />
                {problem.unit && <span className="text-sm font-black text-[var(--chem-text-muted)] select-none">{problem.unit}</span>}
              </div>
            </div>
          )}

          <div className="button-group">
            <button
              className="btn btn-primary disabled:opacity-50"
              onClick={checkAnswer}
              disabled={problem.isCards && selectedCard === null}
            >
              Check Answer
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => generateProblem()}
            >
              Next Problem &rarr;
            </button>
          </div>

          {feedback.message && (
            <div className={`feedback-box flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
              <span>{feedback.message}</span>
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

export default CellPotentials;
