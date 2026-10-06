import React, { useState, useEffect } from 'react';

const CellDiagram = ({ anode, cathode }) => (
  <svg viewBox="0 0 400 220" className="w-full h-auto max-w-md mx-auto my-6 stroke-[var(--chem-text-main)] fill-none stroke-2">
    {/* Beakers */}
    <path d="M 60 100 L 60 200 L 160 200 L 160 100" />
    <path d="M 240 100 L 240 200 L 340 200 L 340 100" />
    
    {/* Solution Levels */}
    <line x1="60" y1="120" x2="160" y2="120" className="stroke-[var(--chem-slate-300)] stroke-1 stroke-dasharray-4" />
    <line x1="240" y1="120" x2="340" y2="120" className="stroke-[var(--chem-slate-300)] stroke-1 stroke-dasharray-4" />

    {/* Salt Bridge */}
    <path d="M 130 140 L 130 60 L 270 60 L 270 140" className="stroke-[var(--chem-primary)] stroke-[12px] opacity-20" />
    <path d="M 130 140 L 130 60 L 270 60 L 270 140" className="stroke-[var(--chem-primary)] stroke-[2px]" />
    
    {/* Voltmeter */}
    <circle cx="200" cy="40" r="22" className="fill-[var(--chem-bg-main)] stroke-[var(--chem-border)]" />
    <text x="200" y="46" textAnchor="middle" className="fill-[var(--chem-text-main)] stroke-none font-bold text-sm">V</text>
    
    {/* Wires */}
    <path d="M 110 40 L 178 40" />
    <path d="M 222 40 L 290 40" />
    <path d="M 110 40 L 110 100" />
    <path d="M 290 40 L 290 100" />
    
    {/* Electrodes (Pt or solid metal) */}
    <rect x="100" y="100" width="20" height="80" className="fill-[var(--chem-slate-200)] stroke-[var(--chem-text-main)]" />
    <rect x="280" y="100" width="20" height="80" className="fill-[var(--chem-slate-200)] stroke-[var(--chem-text-main)]" />

    {/* Dynamic Labels */}
    <text x="110" y="215" textAnchor="middle" className="fill-[var(--chem-text-muted)] stroke-none font-mono text-[10px]">Anode</text>
    <text x="290" y="215" textAnchor="middle" className="fill-[var(--chem-text-muted)] stroke-none font-mono text-[10px]">Cathode</text>
  </svg>
);

const CellPotentials = () => {
  const [mode, setMode] = useState('calc_emf');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const halfCells = [
    { id: 'zn', sys: <>Zn<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#x21CC; Zn(s)</>, e0: -0.76, solid: true, electrons: 2, name: 'zinc' },
    { id: 'cu', sys: <>Cu<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#x21CC; Cu(s)</>, e0: 0.34, solid: true, electrons: 2, name: 'copper' },
    { id: 'al', sys: <>Al<sup>3+</sup>(aq) + 3e<sup>&minus;</sup> &#x21CC; Al(s)</>, e0: -1.66, solid: true, electrons: 3, name: 'aluminium' },
    { id: 'ag', sys: <>Ag<sup>+</sup>(aq) + e<sup>&minus;</sup> &#x21CC; Ag(s)</>, e0: 0.80, solid: true, electrons: 1, name: 'silver' },
    { id: 'fe', sys: <>Fe<sup>3+</sup>(aq) + e<sup>&minus;</sup> &#x21CC; Fe<sup>2+</sup>(aq)</>, e0: 0.77, solid: false, electrons: 1, name: 'iron(II)/iron(III)' },
    { id: 'cl', sys: <>Cl<sub>2</sub>(g) + 2e<sup>&minus;</sup> &#x21CC; 2Cl<sup>&minus;</sup>(aq)</>, e0: 1.36, solid: false, electrons: 2, name: 'chlorine/chloride' },
    { id: 'mn', sys: <>MnO<sub>4</sub><sup>&minus;</sup>(aq) + 8H<sup>+</sup>(aq) + 5e<sup>&minus;</sup> &#x21CC; Mn<sup>2+</sup>(aq) + 4H<sub>2</sub>O(l)</>, e0: 1.51, solid: false, electrons: 5, name: 'manganate(VII)' }
  ];

  const generateProblem = (forcedMode = null) => {
    const selection = forcedMode || mode;
    setMode(selection);
    setStudentAnswer('');
    setSelectedCard(null);
    setFeedback({ message: '', status: '' });

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
        text: <>An electrochemical cell is constructed under standard laboratory conditions using the following two half-cells:</>,
        halfCellData: [anode, cathode],
        question: "Calculate the overall standard cell potential (E°cell) in volts.",
        label: "E°cell =",
        unit: "V",
        correct: (trueEMF >= 0 ? "+" : "") + trueEMF.toFixed(2),
        meta: { anode, cathode, trueEMF },
        requiresDiagram: true
      };
    } else if (selection === 'cell_notation') {
      const formatComponent = (cell, isAnode) => {
        if (cell.id === 'zn') return isAnode ? <>Zn(s) | Zn<sup>2+</sup>(aq)</> : <>Zn<sup>2+</sup>(aq) | Zn(s)</>;
        if (cell.id === 'cu') return isAnode ? <>Cu(s) | Cu<sup>2+</sup>(aq)</> : <>Cu<sup>2+</sup>(aq) | Cu(s)</>;
        if (cell.id === 'al') return isAnode ? <>Al(s) | Al<sup>3+</sup>(aq)</> : <>Al<sup>3+</sup>(aq) | Al(s)</>;
        if (cell.id === 'ag') return isAnode ? <>Ag(s) | Ag<sup>+</sup>(aq)</> : <>Ag<sup>+</sup>(aq) | Ag(s)</>;
        if (cell.id === 'fe') return isAnode ? <>Pt(s) | Fe<sup>2+</sup>(aq), Fe<sup>3+</sup>(aq)</> : <>Fe<sup>3+</sup>(aq), Fe<sup>2+</sup>(aq) | Pt(s)</>;
        if (cell.id === 'cl') return isAnode ? <>Pt(s) | 2Cl<sup>&minus;</sup>(aq) | Cl<sub>2</sub>(g)</> : <>Cl<sub>2</sub>(g) | 2Cl<sup>&minus;</sup>(aq) | Pt(s)</>;
        return isAnode ? <>Pt(s) | Mn<sup>2+</sup>(aq), MnO<sub>4</sub><sup>&minus;</sup>(aq)</> : <>MnO<sub>4</sub><sup>&minus;</sup>(aq), Mn<sup>2+</sup>(aq) | Pt(s)</>;
      };

      const correctComponent = <>{formatComponent(anode, true)} || {formatComponent(cathode, false)}</>;
      const flippedComponent = <>{formatComponent(cathode, true)} || {formatComponent(anode, false)}</>;
      
      const choices = [
        { text: correctComponent, isCorrect: true },
        { text: flippedComponent, isCorrect: false, trap: "flipped" },
      ];

      // Missing Pt trap generation (conditional check to ensure we only render it if a Pt phase actually exists)
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
        text: <>Consider a standard cell comprising a <b>{anode.name}</b> half-cell joined across a salt bridge to a standard <b>{cathode.name}</b> half-cell.</>,
        question: "Select the correct, standard conventional representation notation layout string for this operational cell matrix.",
        choices: choices.sort(() => Math.random() - 0.5),
        isCards: true
      };
    } else if (selection === 'feasibility_shifts') {
      const conditionOptions = [
        { desc: `increasing the concentration of the reactant ions in the cathode compartment`, effect: 'increase', hint: 'This shifts the cathode equilibrium to the right, making its electrode potential more positive.' },
        { desc: `increasing the concentration of the product ions generated in the anode compartment`, effect: 'decrease', hint: 'This shifts the anode equilibrium to the left, making its electrode potential more positive, which narrows the EMF gap.' },
        { desc: `using larger metal electrode sheets with double the surface area under standard concentration boundaries`, effect: 'unchanged', hint: 'Electrode surface area scales current capacity but leaves intensive potential voltages completely unchanged.' }
      ];
      const activeCondition = conditionOptions[Math.floor(Math.random() * conditionOptions.length)];

      newProb = {
        title: "Non-Standard Equilibrium Conditions",
        text: <>A functional cell is setup under standard guidelines. A lab technician modifies the parameters by <b>{activeCondition.desc}</b>.</>,
        question: "Predict how the measured operational cell potential (Ecell) responds compared to the standard E°cell baseline value.",
        choices: [
          { text: "Cell potential increases (+Ecell expands)", id: 'increase' },
          { text: "Cell potential decreases (EMF gap narrows)", id: 'decrease' },
          { text: "Cell potential remains completely unchanged", id: 'unchanged' }
        ],
        correctId: activeCondition.effect,
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

      // Only check traps if the answer is explicitly incorrect
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
      }

    } else if (mode === 'cell_notation') {
      if (selectedCard === null) return;
      const selected = problem.choices[selectedCard];
      if (selected.isCorrect) {
        setFeedback({ message: "Flawless! Anode oxidation transitions are mapped on the left, cathode reduction stages on the right, with salt bridge and phase rules correctly maintained.", status: 'success' });
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
      } else {
        setFeedback({ message: `Incorrect. Consider Le Chatelier's equilibrium effects: ${problem.hint}`, status: 'error' });
      }
    }
  };

  if (!problem) return null;

  return (
    <div className="bg-[var(--chem-bg-main)] p-4 md:p-8 rounded-2xl shadow-sm border border-[var(--chem-border)] max-w-2xl mx-auto">
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--chem-text-muted)] mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center justify-center">
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="w-full max-w-xs bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] text-[var(--chem-text-main)] py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[var(--chem-primary)] focus:ring-1 focus:ring-[var(--chem-primary)] transition-all cursor-pointer shadow-sm text-center"
          >
            <option value="calc_emf">Calculate Standard Cell EMF (E°cell)</option>
            <option value="cell_notation">Build Conventional Cell Notation</option>
            <option value="feasibility_shifts">Predict Non-Standard Condition Shifts</option>
          </select>
        </div>
      </div>

      <div className="text-xl font-bold text-center text-[var(--chem-text-main)] mb-3">{problem.title}</div>
      <div className="text-center px-4 text-[var(--chem-text-muted)] leading-relaxed">{problem.text}</div>

      {mode === 'calc_emf' && problem.requiresDiagram && (
        <CellDiagram anode={problem.meta.anode} cathode={problem.meta.cathode} />
      )}

      {mode === 'calc_emf' && problem.halfCellData && (
        <div className="w-full max-w-md mx-auto my-4 space-y-2 select-none">
          {problem.halfCellData.map((cell, idx) => (
            <div key={idx} className="bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] rounded-xl px-4 py-3 flex items-center justify-between text-xs font-mono font-bold text-[var(--chem-text-main)]">
              <span>{cell.sys}</span>
              <span className="text-[var(--chem-primary)] font-black bg-[var(--chem-bg-main)] px-2 py-1 border border-[var(--chem-border)] rounded-md">
                E° = {cell.e0 >= 0 ? '+' : ''}{cell.e0.toFixed(2)} V
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="font-bold my-6 text-center text-[0.95rem] px-3 text-[var(--chem-text-main)]">
        {problem.question}
      </div>

      {problem.isCards && problem.choices && (
        <div className="w-full max-w-md mx-auto flex flex-col gap-3 my-4">
          {problem.choices.map((choice, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setSelectedCard(i); setFeedback({ message: '', status: '' }); }}
              className={`w-full p-4 text-left text-sm font-bold border rounded-xl transition-all ${
                selectedCard === i 
                  ? 'bg-[var(--chem-bg-highlight)] border-[var(--chem-primary)] text-[var(--chem-primary)] ring-1 ring-[var(--chem-primary)]' 
                  : 'bg-[var(--chem-bg-main)] border-[var(--chem-border)] text-[var(--chem-text-main)] hover:bg-[var(--chem-bg-alt)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedCard === i ? 'border-[var(--chem-primary)] bg-[var(--chem-primary)] text-white text-[10px]' : 'border-[var(--chem-slate-300)]'}`}>
                  {selectedCard === i && "✓"}
                </span>
                <span className="font-mono tracking-wide">{choice.text}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!problem.isCards && (
        <div className="w-full flex items-center justify-center my-6 overflow-x-auto">
          <div className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-3 px-6 py-4 bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] rounded-2xl shadow-sm">
            <label className="text-sm font-black text-[var(--chem-text-main)] select-none">{problem.label}</label>
            <input 
              type="text" 
              className={`w-32 bg-white text-center text-lg font-extrabold py-2 px-3 rounded-lg border focus:outline-none transition-colors ${feedback.status === 'error' ? 'border-red-400 text-red-600 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[var(--chem-border)] text-[var(--chem-text-main)] focus:border-[var(--chem-primary)] focus:ring-1 focus:ring-[var(--chem-primary)]'}`}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="+1.10"
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
            {problem.unit && <span className="text-sm font-black text-[var(--chem-text-muted)] select-none">{problem.unit}</span>}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button 
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-[var(--chem-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50" 
          onClick={checkAnswer} 
          disabled={problem.isCards && selectedCard === null}
        >
          Check Answer
        </button>
        <button 
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-[var(--chem-bg-alt)] text-[var(--chem-text-main)] border border-[var(--chem-border)] hover:bg-[var(--chem-slate-200)] transition-colors" 
          onClick={() => generateProblem(mode)}
        >
          New Problem
        </button>
      </div>

      {feedback.message && (
        <div className={`mt-6 p-4 rounded-xl text-sm font-semibold border ${feedback.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default CellPotentials;
