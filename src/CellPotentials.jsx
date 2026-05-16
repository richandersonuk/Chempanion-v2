import React, { useState, useEffect } from 'react';

const CellPotentials = () => {
  const [mode, setMode] = useState('calc_emf');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const halfCells = [
    { id: 'zn', sys: 'Zn²⁺(aq) + 2e⁻ ⇌ Zn(s)', e0: -0.76, solid: true, electrons: 2, name: 'zinc' },
    { id: 'cu', sys: 'Cu²⁺(aq) + 2e⁻ ⇌ Cu(s)', e0: 0.34, solid: true, electrons: 2, name: 'copper' },
    { id: 'al', sys: 'Al³⁺(aq) + 3e⁻ ⇌ Al(s)', e0: -1.66, solid: true, electrons: 3, name: 'aluminium' },
    { id: 'ag', sys: 'Ag⁺(aq) + e⁻ ⇌ Ag(s)', e0: 0.80, solid: true, electrons: 1, name: 'silver' },
    { id: 'fe', sys: 'Fe³⁺(aq) + e⁻ ⇌ Fe²⁺(aq)', e0: 0.77, solid: false, electrons: 1, name: 'iron(II)/iron(III)' },
    { id: 'cl', sys: 'Cl₂(g) + 2e⁻ ⇌ 2Cl⁻(aq)', e0: 1.36, solid: false, electrons: 2, name: 'chlorine/chloride' },
    { id: 'mn', sys: 'MnO₄⁻(aq) + 8H⁺(aq) + 5e⁻ ⇌ Mn²⁺(aq) + 4H₂O(l)', e0: 1.51, solid: false, electrons: 5, name: 'manganate(VII)' }
  ];

  const generateProblem = (forcedMode = null) => {
    const selection = forcedMode || mode;
    setMode(selection);
    setStudentAnswer('');
    setSelectedCard(null);
    setFeedback({ message: '', status: '' });

    // Pick two distinctly different half cells safely
    let cellA = halfCells[Math.floor(Math.random() * halfCells.length)];
    let cellB = halfCells[Math.floor(Math.random() * halfCells.length)];
    while (cellA.id === cellB.id || cellA.e0 === cellB.e0) {
      cellB = halfCells[Math.floor(Math.random() * halfCells.length)];
    }

    // Establish Anode (lower E0) and Cathode (higher E0) parameters
    const anode = cellA.e0 < cellB.e0 ? cellA : cellB;
    const cathode = cellA.e0 > cellB.e0 ? cellA : cellB;
    const trueEMF = cathode.e0 - anode.e0;

    let newProb = {};

    if (selection === 'calc_emf') {
      newProb = {
        title: "Standard Cell Potential Calculation (E°cell)",
        text: <>An electrochemical cell is constructed under standard laboratory conditions using the following two half-cells:</>,
        halfCellData: [anode, cathode],
        question: "Calculate the overall standard cell potential (E°cell) in volts. Enforce proper sign conventions and precision limits.",
        label: "E°cell =",
        unit: "V",
        correct: (trueEMF >= 0 ? "+" : "") + trueEMF.toFixed(2),
        meta: { anode, cathode, trueEMF }
      };
    } else if (selection === 'cell_notation') {
      // Build authentic conventional cell representations
      const formatComponent = (cell, isAnode) => {
        if (cell.id === 'zn') return isAnode ? "Zn(s) | Zn²⁺(aq)" : "Zn²⁺(aq) | Zn(s)";
        if (cell.id === 'cu') return isAnode ? "Cu(s) | Cu²⁺(aq)" : "Cu²⁺(aq) | Cu(s)";
        if (cell.id === 'al') return isAnode ? "Al(s) | Al³⁺(aq)" : "Al³⁺(aq) | Al(s)";
        if (cell.id === 'ag') return isAnode ? "Ag(s) | Ag⁺(aq)" : "Ag⁺(aq) | Ag(s)";
        if (cell.id === 'fe') return isAnode ? "Pt(s) | Fe²⁺(aq), Fe³⁺(aq)" : "Fe³⁺(aq), Fe²⁺(aq) | Pt(s)";
        if (cell.id === 'cl') return isAnode ? "Pt(s) | 2Cl⁻(aq) | Cl₂(g)" : "Cl₂(g) | 2Cl⁻(aq) | Pt(s)";
        return isAnode ? "Pt(s) | Mn²⁺(aq), MnO₄⁻(aq)" : "MnO₄⁻(aq), Mn²⁺(aq) | Pt(s)";
      };

      const correctNotation = `${formatComponent(anode, true)} || ${formatComponent(cathode, false)}`;
      const flippedNotation = `${formatComponent(cathode, true)} || ${formatComponent(anode, false)}`; // Cathode on left error
      const missingPtNotation = correctNotation.replace(/Pt\(s\)\s\|/g, "").replace(/\|\sPt\(s\)/g, ""); // Omitted inert electrode error

      // Assemble card options deck array shuffling distractors
      const choices = [
        { text: correctNotation, isCorrect: true },
        { text: flippedNotation, isCorrect: false, trap: "flipped" },
        { text: missingPtNotation, isCorrect: false, trap: "missing_pt" }
      ].sort(() => Math.random() - 0.5);

      newProb = {
        title: "Conventional Cell Diagrams",
        text: <>Consider a standard cell comprising a <b>{anode.name}</b> half-cell joined across a salt bridge to a standard <b>{cathode.name}</b> half-cell.</>,
        question: "Select the correct, standard conventional representation notation layout string for this operational cell matrix.",
        choices,
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

      // 1. Sign enforcement validations
      if (!raw.startsWith('+') && !raw.startsWith('-')) {
        setFeedback({ 
          message: "WJEC Sign Penalty! Cell EMF representations must explicitly state the sign context (+ or −) to state thermodynamic direction. Leaving it blank scores zero.", 
          status: 'error' 
        });
        return;
      }

      // 2. Precision format validations
      const decimalCheck = raw.split('.')[1];
      if (!decimalCheck || decimalCheck.length !== 2) {
        setFeedback({ 
          message: "WJEC Precision Error: Standard potentials and cell EMF outputs must be stated to exactly 2 decimal places, including any trailing zeros (e.g., +1.10 V).", 
          status: 'error' 
        });
        return;
      }

      // 3. Mathematical value multipliers trap validations
      const userVal = parseFloat(raw);
      const targetVal = parseFloat(problem.correct);
      const { anode, cathode } = problem.meta;

      // Simulate wrong multiplier values
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

      if (Math.abs(userVal - targetVal) < 0.01) {
        setFeedback({ message: `Correct! E°cell = ${problem.correct} V. Complete electrochemical feasibility verified.`, status: 'success' });
      } else {
        setFeedback({ message: "Incorrect. The formula is E°cell = E°(cathode) − E°(anode). Identify the most positive value as the cathode.", status: 'error' });
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
    <div className="applet-container" style={{ textTransform: 'none' }}>
      
      {/* --- REPERTOIRE MENU TOGGLE CONTROL --- */}
      <div className="w-full max-w-md mx-auto mb-6 px-4" style={{ textTransform: 'none' }}>
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center justify-center" style={{ textTransform: 'none' }}>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
            className="w-full max-w-xs bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm text-center"
            style={{ textTransform: 'none' }}
          >
            <option value="calc_emf">Calculate Standard Cell EMF (E°cell)</option>
            <option value="cell_notation">Build Conventional Cell Notation</option>
            <option value="feasibility_shifts">Predict Non-Standard Condition Shifts</option>
          </select>
        </div>
      </div>

      <div className="applet-header" style={{ textTransform: 'none' }}>{problem.title}</div>
      <div className="question-text text-center px-4 leading-relaxed" style={{ textTransform: 'none' }}>{problem.text}</div>

      {/* --- DISCRETE REDUCTION DATA GRID CELLS --- */}
      {mode === 'calc_emf' && problem.halfCellData && (
        <div className="w-full max-w-md mx-auto my-4 space-y-2 select-none" style={{ textTransform: 'none' }}>
          {problem.halfCellData.map((cell, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-mono font-bold text-slate-700">
              <span style={{ textTransform: 'none' }}>{cell.sys}</span>
              <span className="text-[#326fa0] font-black bg-white px-2 py-0.5 border border-slate-200 rounded-md">
                E° = {cell.e0 >= 0 ? '+' : ''}{cell.e0.toFixed(2)} V
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.95rem', textTransform: 'none' }} className="px-3 text-slate-700">
        {problem.question}
      </div>

      {/* --- INTERACTIVE NON-NATIVE OPTION SELECTION CARDS --- */}
      {problem.isCards && problem.choices && (
        <div className="w-full max-w-md mx-auto flex flex-col gap-2.5 my-4" style={{ textTransform: 'none' }}>
          {problem.choices.map((choice, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setSelectedCard(i); setFeedback({ message: '', status: '' }); }}
              className={`w-full p-3 text-left text-xs font-bold border rounded-xl transition-all ${
                selectedCard === i 
                  ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] ring-1 ring-[#326fa0]' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              style={{ textTransform: 'none' }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selectedCard === i ? 'border-[#326fa0] bg-[#326fa0] text-white text-[9px]' : 'border-slate-300'}`}>
                  {selectedCard === i && "✓"}
                </span>
                <span className="font-mono tracking-wide" style={{ textTransform: 'none' }}>{choice.text}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* --- STANDARD VALUE ENTER MATRIX SLIP --- */}
      {!problem.isCards && (
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
              placeholder="+1.10"
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              style={{ maxWidth: '10rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', textTransform: 'none' }}
            />
            {problem.unit && <span className="text-sm font-black text-slate-500 select-none" style={{ textTransform: 'none' }}>{problem.unit}</span>}
          </div>
        </div>
      )}

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer} disabled={problem.isCards && selectedCard === null}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem(mode)}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default CellPotentials;
