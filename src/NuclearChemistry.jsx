import React, { useState, useEffect } from 'react';

const elements = [
  "", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
  "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
  "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
  "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
  "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm"
];

const NuclearChemistry = () => {
  const [mode, setMode] = useState('random');
  const [problem, setProblem] = useState(null);
  const [ansA, setAnsA] = useState('');
  const [ansZ, setAnsZ] = useState('');
  const [ansSym, setAnsSym] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['alpha', 'beta_minus', 'beta_plus', 'electron_capture', 'gamma'];
    const selectedMode = (forcedMode === 'random' || !forcedMode) ? modes[Math.floor(Math.random() * modes.length)] : forcedMode;
    
    setMode(forcedMode || 'random');
    setAnsA('');
    setAnsZ('');
    setAnsSym('');
    setFeedback({ message: '', status: '' });

    // Generate a valid parent nucleus
    let parentZ = Math.floor(Math.random() * 60) + 30; // Z between 30 and 90
    if (selectedMode === 'alpha') parentZ = Math.floor(Math.random() * 10) + 84; // Usually heavy elements > 83
    let parentA = Math.floor(parentZ * 2.5); // Rough stability approximation
    
    let p1 = { A: parentA, Z: parentZ, Sym: elements[parentZ] };
    let p2 = null; // Used for electron capture reactant
    let d1 = {}; // Daughter nucleus
    let d2 = {}; // Emitted particle

    let typeText = "";

    switch (selectedMode) {
      case 'alpha':
        d1 = { A: parentA - 4, Z: parentZ - 2, Sym: elements[parentZ - 2] };
        d2 = { A: 4, Z: 2, Sym: 'He' };
        typeText = "an alpha (α) particle";
        break;
      case 'beta_minus':
        d1 = { A: parentA, Z: parentZ + 1, Sym: elements[parentZ + 1] };
        d2 = { A: 0, Z: -1, Sym: 'e' };
        typeText = "a beta-minus (β⁻) particle";
        break;
      case 'beta_plus':
        d1 = { A: parentA, Z: parentZ - 1, Sym: elements[parentZ - 1] };
        d2 = { A: 0, Z: 1, Sym: 'e' };
        typeText = "a positron (β⁺)";
        break;
      case 'electron_capture':
        p2 = { A: 0, Z: -1, Sym: 'e' };
        d1 = { A: parentA, Z: parentZ - 1, Sym: elements[parentZ - 1] };
        typeText = "an inner orbital electron (electron capture)";
        break;
      case 'gamma':
        p1 = { A: parentA, Z: parentZ, Sym: elements[parentZ], isMeta: true };
        d1 = { A: parentA, Z: parentZ, Sym: elements[parentZ] };
        d2 = { A: 0, Z: 0, Sym: 'γ' };
        typeText = "a gamma (γ) photon";
        break;
      default:
        break;
    }

    // Determine what to blank out: 0 = daughter nucleus, 1 = emitted particle (if applicable)
    const blankTarget = (selectedMode !== 'electron_capture' && Math.random() > 0.5) ? 1 : 0;
    
    let correctObj = blankTarget === 0 ? d1 : d2;

    setProblem({
      p1, p2, d1, d2, blankTarget, selectedMode, correctObj, typeText
    });
  };

  useEffect(() => {
    generateProblem('random');
  }, []);

  const checkAnswer = () => {
    if (!ansA || !ansZ || !ansSym) {
      setFeedback({ message: 'Please fill in all fields (Mass number, Atomic number, and Symbol).', status: 'error' });
      return;
    }

    const userA = parseInt(ansA, 10);
    const userZ = parseInt(ansZ, 10);
    const userSym = ansSym.trim();

    const { A, Z, Sym } = problem.correctObj;

    if (userA === A && userZ === Z && (userSym === Sym || userSym.toLowerCase() === Sym.toLowerCase())) {
      setFeedback({ message: 'Correct! The nuclear equation is perfectly balanced.', status: 'success' });
    } else if (userA === A && userZ === Z) {
      setFeedback({ message: `Check your chemical symbol. The element with atomic number ${Z} is ${Sym}.`, status: 'error' });
    } else {
      setFeedback({ message: `Incorrect balancing. Remember: The sum of mass numbers (A) and atomic numbers (Z) must be equal on both sides of the equation.`, status: 'error' });
    }
  };

  const renderNuclide = (nuclide, isBlank) => {
    if (isBlank) {
      return (
        <div className="flex items-center mx-2">
          <div className="flex flex-col items-end justify-center mr-1 gap-1">
            <input 
              type="text" value={ansA} onChange={e => setAnsA(e.target.value)}
              className="w-10 p-1 text-center font-mono font-bold text-sm bg-white border border-[var(--chem-border)] rounded shadow-sm focus:border-[var(--chem-primary)] focus:outline-none"
              placeholder="A"
            />
            <input 
              type="text" value={ansZ} onChange={e => setAnsZ(e.target.value)}
              className="w-10 p-1 text-center font-mono font-bold text-sm bg-white border border-[var(--chem-border)] rounded shadow-sm focus:border-[var(--chem-primary)] focus:outline-none"
              placeholder="Z"
            />
          </div>
          <input 
            type="text" value={ansSym} onChange={e => setAnsSym(e.target.value)}
            className="w-12 h-12 p-1 text-center font-mono font-black text-lg bg-white border border-[var(--chem-border)] rounded shadow-sm focus:border-[var(--chem-primary)] focus:outline-none"
            placeholder="X"
          />
        </div>
      );
    }
    
    return (
      <div className="flex items-center mx-2 font-mono text-2xl font-black text-[var(--chem-text-main)] select-none">
        <div className="flex flex-col items-end text-sm leading-none mr-1">
          <span>{nuclide.A}</span>
          <span>{nuclide.Z}</span>
        </div>
        <span>{nuclide.Sym}{nuclide.isMeta && <sup>m</sup>}</span>
      </div>
    );
  };

  if (!problem) return null;

  return (
    <div className="applet-container bg-[var(--chem-bg-main)]">
      <div className="w-full max-w-md mx-auto mb-6 px-4">
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => { generateProblem(e.target.value); }}
            className="flex-1 min-w-0 bg-white border border-[var(--chem-border)] text-[var(--chem-text-main)] py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[var(--chem-primary)] focus:ring-1 focus:ring-[var(--chem-primary)] transition-all cursor-pointer shadow-sm text-center"
          >
            <option value="random">Random Decay Protocol</option>
            <option value="alpha">Alpha (α) Decay</option>
            <option value="beta_minus">Beta-Minus (β⁻) Decay</option>
            <option value="beta_plus">Positron (β⁺) Emission</option>
            <option value="electron_capture">Electron Capture</option>
            <option value="gamma">Gamma (γ) Emission</option>
          </select>
          <button type="button" onClick={() => generateProblem(mode)} className="px-4 py-2.5 text-xs font-black uppercase bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl transition-all shrink-0">
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header text-[var(--chem-text-main)]">Nuclear Decay Equations</div>

      <div className="question-text text-center px-4 leading-relaxed text-[var(--chem-text-main)]">
        A specific unstable isotope undergoes decay by emitting <b>{problem.typeText}</b>. Balance the nuclear equation below by identifying the missing mass number (A), atomic number (Z), and chemical symbol.
        <br/><br/>
        <span className="text-[10px] font-bold uppercase text-[var(--chem-text-muted)]">(Refer to the Data Booklet for chemical symbols if necessary.)</span>
      </div>

      <div className="w-full flex items-center justify-center my-8 overflow-x-auto">
        <div className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap px-6 py-4 bg-[var(--chem-bg-alt)] border border-[var(--chem-border)] rounded-2xl shadow-sm">
          
          {/* Reactants */}
          {renderNuclide(problem.p1, false)}
          {problem.p2 && (
            <>
              <span className="mx-3 font-bold text-xl text-[var(--chem-text-muted)]">+</span>
              {renderNuclide(problem.p2, false)}
            </>
          )}

          {/* Yields Arrow */}
          <span className="mx-4 font-bold text-2xl text-[var(--chem-primary)]">→</span>

          {/* Products */}
          {renderNuclide(problem.d1, problem.blankTarget === 0)}
          {problem.d2 && (
            <>
              <span className="mx-3 font-bold text-xl text-[var(--chem-text-muted)]">+</span>
              {renderNuclide(problem.d2, problem.blankTarget === 1)}
            </>
          )}

        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Check Balance</button>
        <button className="btn btn-secondary" onClick={() => generateProblem(mode)}>New Equation</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default NuclearChemistry;