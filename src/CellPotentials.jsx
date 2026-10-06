import React, { useState, useEffect } from 'react';

// WJEC-style line-art SVG cell diagram
const CellDiagram = ({ anode, cathode }) => (
  <svg 
    viewBox="0 0 400 220" 
    className="w-full max-w-lg mx-auto my-6 stroke-[var(--chem-text-main)] fill-none" 
    style={{ strokeWidth: 1.5 }}
  >
    {/* Left Half-Cell (Anode) */}
    <path d="M 50 100 L 50 200 Q 50 210 60 210 L 140 210 Q 150 210 150 200 L 150 100" />
    <path d="M 50 130 L 150 130" className="stroke-[var(--chem-border)]" strokeDasharray="4 4" />
    
    {/* Right Half-Cell (Cathode) */}
    <path d="M 250 100 L 250 200 Q 250 210 260 210 L 340 210 Q 350 210 350 200 L 350 100" />
    <path d="M 250 130 L 350 130" className="stroke-[var(--chem-border)]" strokeDasharray="4 4" />

    {/* Salt Bridge */}
    <path d="M 130 160 L 130 60 Q 130 40 150 40 L 250 40 Q 270 40 270 60 L 270 160" />
    <path d="M 110 160 L 110 50 Q 110 20 150 20 L 250 20 Q 290 20 290 50 L 290 160" />

    {/* Electrodes */}
    <rect x="75" y="70" width="20" height="110" className="fill-[var(--chem-bg-alt)] stroke-[var(--chem-text-main)]" />
    <rect x="305" y="70" width="20" height="110" className="fill-[var(--chem-bg-alt)] stroke-[var(--chem-text-main)]" />

    {/* Wiring & Circuit */}
    <path d="M 85 70 L 85 30 L 180 30" />
    <path d="M 315 70 L 315 30 L 220 30" />

    {/* Voltmeter */}
    <circle cx="200" cy="30" r="20" className="fill-[var(--chem-bg-main)] stroke-[var(--chem-text-main)]" />
    <text x="200" y="35" textAnchor="middle" className="fill-[var(--chem-text-main)] stroke-none text-sm font-bold font-sans">V</text>

    {/* Dynamic Labels */}
    <text x="100" y="190" textAnchor="middle" className="fill-[var(--chem-text-main)] stroke-none text-xs font-sans font-bold">{anode.name} half-cell</text>
    <text x="300" y="190" textAnchor="middle" className="fill-[var(--chem-text-main)] stroke-none text-xs font-sans font-bold">{cathode.name} half-cell</text>
  </svg>
);

const CellPotentials = () => {
  const [mode, setMode] = useState('calc_emf');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // Strictly HTML formatted chemical species to prevent Unicode kerning issues
  const halfCells = [
    { id: 'zn', sys: <>Zn<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#rightleftharpoons; Zn(s)</>, e0: -0.76, solid: true, electrons: 2, name: 'Zinc' },
    { id: 'cu', sys: <>Cu<sup>2+</sup>(aq) + 2e<sup>&minus;</sup> &#rightleftharpoons; Cu(s)</>, e0: 0.34, solid: true, electrons: 2, name: 'Copper' },
    { id: 'al', sys: <>Al<sup>3+</sup>(aq) + 3e<sup>&minus;</sup> &#rightleftharpoons; Al(s)</>, e0: -1.66, solid: true, electrons: 3, name: 'Aluminium' },
    { id: 'ag', sys: <>Ag<sup>+</sup>(aq) + e<sup>&minus;</sup> &#rightleftharpoons; Ag(s)</>, e0: 0.80, solid: true, electrons: 1, name: 'Silver' },
    { id: 'fe', sys: <>Fe<sup>3+</sup>(aq) + e<sup>&minus;</sup> &#rightleftharpoons; Fe<sup>2+</sup>(aq)</>, e0: 0.77, solid: false, electrons: 1, name: 'Iron(III)' },
    { id: 'cl', sys: <>Cl<sub>2</sub>(g) + 2e<sup>&minus;</sup> &#rightleftharpoons; 2Cl<sup>&minus;</sup>(aq)</>, e0: 1.36, solid: false, electrons: 2, name: 'Chlorine' },
    { id: 'mn', sys: <>MnO<sub>4</sub><sup>&minus;</sup>(aq) + 8H<sup>+</sup>(aq) + 5e<sup>&minus;</sup> &#rightleftharpoons; Mn<sup>2+</sup>(aq) + 4H<sub>2</sub>O(l)</>, e0: 1.51, solid: false, electrons: 5, name: 'Manganate(VII)' }
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
        title: "Standard Cell Potential (E°cell)",
        text: <>An electrochemical cell is constructed under standard laboratory conditions using the half-cells below. (Refer to the Data Booklet for any standard constants required).</>,
        halfCellData: [anode, cathode],
        question: "Calculate the standard cell potential (E°cell) for this operational cell.",
        label: "E°cell =",
        unit: "V",
        correct: (trueEMF >= 0 ? "+" : "") + trueEMF.toFixed(2),
        meta: { anode, cathode, trueEMF },
        hasDiagram: true
      };
    } else if (selection === 'cell_notation') {
      const formatComponent = (cell, isAnode, omitPt = false) => {
        const ptLeft = (omitPt || cell.solid) ? <></> : <>Pt(s) | </>;
        const ptRight = (omitPt || cell.solid) ? <></> : <> | Pt(s)</>;
        
        if (cell.id === 'zn') return isAnode ? <>Zn(s) | Zn<sup>2+</sup>(aq)</> : <>Zn<sup>2+</sup>(aq) | Zn(s)</>;
        if (cell.id === 'cu') return isAnode ? <>Cu(s) | Cu<sup>2+</sup>(aq)</> : <>Cu<sup>2+</sup>(aq) | Cu(s)</>;
        if (cell.id === 'al') return isAnode ? <>Al(s) | Al<sup>3+</sup>(aq)</> : <>Al<sup>3+</sup>(aq) | Al(s)</>;
        if (cell.id === 'ag') return isAnode ? <>Ag(s) | Ag<sup>+</sup>(aq)</> : <>Ag<sup>+</sup>(aq) | Ag(s)</>;
        if (cell.id === 'fe') return isAnode ? <>{ptLeft}Fe<sup>2+</sup>(aq), Fe<sup>3+</sup>(aq)</> : <>Fe<sup>3+</sup>(aq), Fe<sup>2+</sup>(aq){ptRight}</>;
        if (cell.id === 'cl') return isAnode ? <>{ptLeft}2Cl<sup>&minus;</sup>(aq) | Cl<sub>2</sub>(g)</> : <>Cl<sub>2</sub>(g) | 2Cl<sup>&minus;</sup>(aq){ptRight}</>;
        return isAnode ? <>{ptLeft}Mn<sup>2+</sup>(aq), MnO<sub>4</sub><sup>&minus;</sup>(aq)</> : <>MnO<sub>4</sub><sup>&minus;</sup>(aq), Mn<sup>2+</sup>(aq){ptRight}</>;
      };

      const choices = [
        { text: <>{formatComponent(anode, true)} || {formatComponent(cathode, false)}</>, isCorrect: true },
        { text: <>{formatComponent(cathode, true)} || {formatComponent(anode, false)}</>, isCorrect: false, trap: "flipped" },
        { text: <>{formatComponent(anode, true, true)} || {formatComponent(cathode, false, true)}</>, isCorrect: false, trap: "missing_pt" }
      ].sort(() => Math.random() - 0.5);

      newProb = {
        title: "Conventional Cell Diagrams",
        text: <>Consider a standard cell comprising a <b>{anode.name}</b> half-cell joined across a salt bridge to a standard <b>{cathode.name}</b> half-cell.</>,
        question: "Select the correct conventional representation for this cell.",
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

  useEffect(() => { generateProblem('calc_emf'); }, []);

  const checkAnswer = () => {
    if (mode === 'calc_emf') {
      const raw = studentAnswer.trim();
      if (!raw) return;

      if (!raw.startsWith('+') && !raw.startsWith('-')) {
        setFeedback({ 
          message: "WJEC Sign Penalty: Standard cell EMF representations must explicitly state the sign (+ or −).", 
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
      const { anode, cathode } = problem.meta;

      // Ensure traps only fire if electrons were legitimately mismatched and trap values deviate from the true EMF
      if (anode.electrons !== cathode.electrons) {
        const wrongValAnodeMult = cathode.e0 - (anode.e0 * cathode.electrons);
        const wrongValCathodeMult = (cathode.e0 * anode.electrons) - anode.e0;
        const wrongValBothMult = (cathode.e0 * anode.electrons) - (anode.e0 * cathode.electrons);

        const checkTrap = (trapVal) => Math.abs(trapVal - targetVal) > 0.01 && Math.abs(userVal - trapVal) < 0.02;

        if (checkTrap(wrongValAnodeMult) || checkTrap(wrongValCathodeMult) || checkTrap(wrongValBothMult)) {
          setFeedback({
            message: "WJEC Trap Triggered: Standard electrode potentials (E°) are intensive properties. Never multiply the half-cell voltages when balancing electron stoichiometry!",
            status: 'error'
          });
          return;
        }
      }

      if (Math.abs(userVal - targetVal) < 0.01) {
        setFeedback({ message: `Correct! E°cell = ${problem.correct} V.`, status: 'success' });
      } else {
        setFeedback({ message: "Incorrect. Identify the most positive standard potential as the cathode: E°cell = E°(cathode) − E°(anode).", status: 'error' });
      }
    } else if (mode === 'cell_notation') {
      if (selectedCard === null) return;
      const selected = problem.choices[selectedCard];
      if (selected.isCorrect) {
        setFeedback({ message: "Correct. Anode oxidation is on the left, cathode reduction on the right, with phase rules maintained.", status: 'success' });
      } else {
        let helpText = "Incorrect notation. ";
        if (selected.trap === 'flipped') helpText += "The oxidation half-cell (more negative E°) must be drawn on the left.";
        if (selected.trap === 'missing_pt') helpText += "Gaseous or aqueous ionic species without a solid metal phase mandate an inert Pt(s) connection.";
        setFeedback({ message: helpText, status: 'error' });
      }
    } else if (mode === 'feasibility_shifts') {
      if (selectedCard === null) return;
      const selected = problem.choices[selectedCard];
      if (selected.id === problem.correctId) {
        setFeedback({ message: `Correct! ${problem.hint}`, status: 'success' });
      } else {
        setFeedback({ message: `Incorrect. Consider Le Chatelier's principle: ${problem.hint}`, status: 'error' });
      }
    }
  };

  if (!problem) return null;

  return (
    <div className="bg-[var(--chem-bg-main)] p-4 sm:p-6 rounded-2xl max-w-3xl mx-auto font-sans text-[var(--chem-text-main)] border border-[var(--chem-border)] shadow-sm">
      
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--chem-text-muted)] mb-1.5 text-center">
          Practice Mode
        </span>
        <select
          value={mode}
          onChange={(e) => generateProblem(e.target.value)}
          className="w-full bg-[var(--chem-bg-main)] border border-[var(--chem-border)] text-[var(--chem-text-main)] py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[var(--chem-primary)] focus:ring-1 focus:ring-[var(--chem-primary)] transition-all cursor-pointer shadow-sm text-center"
        >
          <option value="calc_emf">Calculate Standard Cell EMF</option>
          <option value="cell_notation">Conventional Cell Notation</option>
          <option value="feasibility_shifts">Non-Standard Conditions</option>
        </select>
      </div>

      <h2 className="text-xl font-bold text-center mb-2 text-[var(--chem-primary)]">{problem.title}</h2>
      <p className="text-center px-4 leading-relaxed text-sm mb-6">{problem.text}</p>

      {problem.hasDiagram && <CellDiagram anode={problem.meta.anode} cathode={problem.meta.cathode} />}

      {mode === 'calc_emf' && problem.halfCellData && (
        <div className="w-full max-w-md mx-auto my-6 space-y-2 select-none">
          {problem.halfCellData.map((cell, idx) => (
            <div key={idx} className="bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] rounded-xl px-4 py-3 flex items-center justify-between text-xs font-mono text-[var(--chem-text-main)]">
              <span>{cell.sys}</span>
              <span className="text-[var(--chem-primary)] font-black bg-[var(--chem-bg-main)] px-2 py-0.5 border border-[var(--chem-border)] rounded-md">
                E&deg; = {cell.e0 >= 0 ? '+' : ''}{cell.e0.toFixed(2)} V
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="font-bold mb-4 text-center text-[0.95rem] px-3">
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
                  ? 'bg-[var(--chem-bg-alt)] border-[var(--chem-primary)] text-[var(--chem-primary)] ring-1 ring-[var(--chem-primary)]' 
                  : 'bg-[var(--chem-bg-main)] border-[var(--chem-border)] text-[var(--chem-text-main)] hover:bg-[var(--chem-bg-alt)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedCard === i ? 'border-[var(--chem-primary)] bg-[var(--chem-primary)] text-[var(--chem-bg-main)] text-[10px]' : 'border-[var(--chem-border)]'}`}>
                  {selectedCard === i && "✓"}
                </span>
                <span className="font-mono tracking-wide">{choice.text}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!problem.isCards && (
        <div className="w-full flex items-center justify-center my-6">
          <div className="flex flex-row items-center justify-center gap-3 px-5 py-3 bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] rounded-2xl shadow-sm">
            <label className="text-sm font-black text-[var(--chem-text-muted)] select-none">{problem.label}</label>
            <input 
              type="text" 
              className="bg-[var(--chem-bg-main)] border border-[var(--chem-border)] rounded-lg outline-none focus:border-[var(--chem-primary)] transition-all w-28 text-center text-lg font-black text-[var(--chem-text-main)] py-1"
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="+1.10"
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
            {problem.unit && <span className="text-sm font-black text-[var(--chem-text-muted)] select-none">{problem.unit}</span>}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button 
          className="bg-[var(--chem-primary)] hover:opacity-90 text-[var(--chem-bg-main)] font-bold py-2.5 px-6 rounded-xl transition-all disabled:opacity-50"
          onClick={checkAnswer} 
          disabled={problem.isCards && selectedCard === null}
        >
          Check Answer
        </button>
        <button 
          className="bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] text-[var(--chem-text-main)] hover:bg-[var(--chem-border)] font-bold py-2.5 px-6 rounded-xl transition-all"
          onClick={() => generateProblem()}
        >
          New Problem
        </button>
      </div>

      {feedback.message && (
        <div className={`mt-6 p-4 rounded-xl text-sm font-bold border ${feedback.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default CellPotentials;
