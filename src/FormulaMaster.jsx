import React, { useState, useEffect } from 'react';

const FormulaMaster = () => {
  const [mode, setMode] = useState('name-to-formula'); // 'name-to-formula', 'formula-to-name', 'ions-to-formula', 'formula-to-ions'
  const [difficulty, setDifficulty] = useState('simple'); // 'simple' or 'advanced'
  const [currentProblem, setCurrentProblem] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // --- COMPOSER INDEX INPUT STATES ---
  const [userTextAnswer, setUserTextAnswer] = useState(''); // Used for 'formula-to-name' and 'formula-to-ions' text submissions
  const [cationIndex, setCationIndex] = useState('1'); // Multiplier subscript for metal / group 1
  const [anionIndex, setAnionIndex] = useState('1');  // Multiplier subscript for non-metal / polyatomic

  // --- CORE ASSIGNMENT DATABASE MATRIX ---
  const problemBank = {
    'name-to-formula': {
      simple: [
        { q: "Sodium chloride", cat: "Na", ani: "Cl", catSub: 1, aniSub: 1, raw: "NaCl", exp: "Sodium is Na⁺ (Group 1), Chloride is Cl⁻ (Group 7). The 1:1 ratio balances charges perfectly." },
        { q: "Magnesium oxide", cat: "Mg", ani: "O", catSub: 1, aniSub: 1, raw: "MgO", exp: "Magnesium is Mg²⁺, Oxide is O²⁻. The 2:2 ratio simplifies to an empirical 1:1 chemical formula layout." },
        { q: "Calcium chloride", cat: "Ca", ani: "Cl", catSub: 1, aniSub: 2, raw: "CaCl2", exp: "Calcium is Ca²⁺, Chloride is Cl⁻. Two chloride ions are required to fully neutralise one calcium ion center." },
        { q: "Aluminium oxide", cat: "Al", ani: "O", catSub: 2, aniSub: 3, raw: "Al2O3", exp: "Aluminium is Al³⁺, Oxide is O²⁻. Cross-multiplying coordinates gives a balanced neutral net configuration: 2(3+) + 3(2-) = 0." }
      ],
      advanced: [
        { q: "Iron(III) sulfate", cat: "Fe", ani: "(SO4)", catSub: 2, aniSub: 3, raw: "Fe2(SO4)3", exp: "Iron(III) indicates Fe³⁺. Sulfate is SO₄²⁻. Brackets are strictly required around polyatomic groups when multiple units are active." },
        { q: "Copper(II) nitrate", cat: "Cu", ani: "(NO3)", catSub: 1, aniSub: 2, raw: "Cu(NO3)2", exp: "Copper(II) matches Cu²⁺. Nitrate is NO₃⁻. Two nitrate environments balance the single transition metal cation." },
        { q: "Ammonium phosphate", cat: "(NH4)", ani: "PO4", catSub: 3, aniSub: 1, raw: "(NH4)3PO4", exp: "Ammonium is NH₄⁺, Phosphate is PO₄³⁻. Three polyatomic ammonium clusters pack cleanly around one phosphate ion." },
        { q: "Chromium(III) hydroxide", cat: "Cr", ani: "(OH)", catSub: 1, aniSub: 3, raw: "Cr(OH)3", exp: "Chromium(III) is Cr³⁺, Hydroxide is OH⁻. Parentheses are mandatory around OH to prevent errors in written text definitions." }
      ]
    },
    'formula-to-name': {
      simple: [
        { q: "HCl", a: "Hydrogen chloride", exp: "Binary acid compound formed between hydrogen and a group 7 halogen atom." },
        { q: "Na2CO3", a: "Sodium carbonate", exp: "Classic group 1 metallic salt containing the polyatomic carbonate counter-ion." }
      ],
      advanced: [
        { q: "CuSO4", a: "Copper(II) sulfate", exp: "WJEC Precision Alert: You must explicitly provide the Roman numeral oxidation state (II) for variable transition structures." },
        { q: "Fe(NO3)2", a: "Iron(II) nitrate", exp: "The multiplier subscript on the nitrate cluster identifies the central metallic atom oxidation index as Iron(II), Fe²⁺." }
      ]
    },
    'ions-to-formula': {
      simple: [
        { q: "Mg²⁺ + Br⁻", cat: "Mg", ani: "Br", catSub: 1, aniSub: 2, raw: "MgBr2", exp: "Two single-negative bromide ions balance out a single double-positive magnesium core." }
      ],
      advanced: [
        { q: "Al³⁺ + SO₄²⁻", cat: "Al", ani: "(SO4)", catSub: 2, aniSub: 3, raw: "Al2(SO4)3", exp: "Lowest common multiple of 2 and 3 is 6. Requires 2 aluminium ions and 3 wrapped sulfate polyatomic structures." }
      ]
    },
    'formula-to-ions': {
      simple: [
        { q: "NaCl", a: "Na+ + Cl-", exp: "Dissociates symmetrically into its core constituent monoatomic ion matrices." },
        { q: "CaCl2", a: "Ca2+ + 2Cl-", exp: "Balancing Note: Remember to format multipliers as coefficients before the ion expression (2Cl⁻), not inside subscripts!" }
      ],
      advanced: [
        { q: "Al2(SO4)3", a: "2Al3+ + 3SO42-", exp: "Polyatomic links open completely, yielding two isolated aluminium species and three fully free sulfate environments." }
      ]
    }
  };

  const generateProblem = (selectedMode = mode, selectedDiff = difficulty) => {
    const pool = problemBank[selectedMode]?.[selectedDiff] || [];
    if (pool.length === 0) return;

    let nextProblem = pool[Math.floor(Math.random() * pool.length)];
    while (currentProblem && nextProblem.q === currentProblem.q && pool.length > 1) {
      nextProblem = pool[Math.floor(Math.random() * pool.length)];
    }

    setCurrentProblem(nextProblem);
    setUserTextAnswer('');
    setCationIndex('1');
    setAnionIndex('1');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem(mode, difficulty);
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    generateProblem(newMode, difficulty);
  };

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    generateProblem(mode, newDiff);
  };

  // --- AUTOMATIC FORMATTING RENDER PREVIEW HACK ---
  const renderFormulaPreview = () => {
    if (!currentProblem || !currentProblem.cat) return '';
    
    // Omit subscript entirely if value equals 1 to ensure standard chemical formula typesetting formatting rules
    const catSubDisplay = cationIndex === '1' ? '' : cationIndex;
    const aniSubDisplay = anionIndex === '1' ? '' : anionIndex;

    return `${currentProblem.cat}${catSubDisplay}${currentProblem.ani}${aniSubDisplay}`;
  };

  const checkAnswer = () => {
    setFeedback({ message: '', status: '' });

    // ROUTE A: Interactive Indexed Composer Checks ('name-to-formula' and 'ions-to-formula')
    if (mode === 'name-to-formula' || mode === 'ions-to-formula') {
      const parsedCatUser = parseInt(cationIndex, 10);
      const parsedAniUser = parseInt(anionIndex, 10);

      if (parsedCatUser === currentProblem.catSub && parsedAniUser === currentProblem.aniSub) {
        setFeedback({
          message: `Correct! The balanced product formula is ${currentProblem.raw}. ${currentProblem.exp}`,
          status: 'success'
        });
      } else {
        setFeedback({
          message: `Incorrect ratio parameters. The target balanced assignment requires the structural layout: ${currentProblem.raw}.`,
          status: 'error'
        });
      }
      return;
    }

    // ROUTE B: Standard Text String Match Checks ('formula-to-name' and 'formula-to-ions')
    if (!userTextAnswer.trim()) {
      setFeedback({ message: "Please provide a valid entry string inside the text input area.", status: "error" });
      return;
    }

    const cleanUser = userTextAnswer.replace(/\s+/g, '').toLowerCase();
    const cleanTarget = currentProblem.a.replace(/\s+/g, '').toLowerCase();

    if (cleanUser === cleanTarget) {
      setFeedback({ message: `Correct! ${currentProblem.exp}`, status: 'success' });
    } else {
      setFeedback({ message: `Incorrect match setup. Expected format was: ${currentProblem.a}.`, status: 'error' });
    }
  };

  const hasIndexInterface = mode === 'name-to-formula' || mode === 'ions-to-formula';

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      <div className="applet-header">Formula Master Studio</div>

      <div className="question-text text-center px-4 leading-relaxed">
        Master chemical nomenclature and balancing laws across simple GCSE and advanced synoptic A-Level tiers.
      </div>

      {/* --- RE-STABILIZED CONTROL MATRIX TRAY --- */}
      <div className="w-full max-w-md mx-auto my-4 bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Select Practice Mode Option</label>
          <select 
            value={mode}
            onChange={(e) => handleModeChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none shadow-sm focus:border-[#326fa0]"
          >
            <option value="name-to-formula">Formulas from Systematic Names</option>
            <option value="formula-to-name">Systematic Names from Formulas</option>
            <option value="ions-to-formula">Combine Ions to Formulas</option>
            <option value="formula-to-ions">Deconstruct Formulas to Ions</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Curriculum Difficulty Tier</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button" onClick={() => handleDifficultyChange('simple')}
              className={`py-1.5 text-xs font-black rounded-xl border uppercase tracking-wider transition-all ${difficulty === 'simple' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Simple (GCSE Core)
            </button>
            <button
              type="button" onClick={() => handleDifficultyChange('advanced')}
              className={`py-1.5 text-xs font-black rounded-xl border uppercase tracking-wider transition-all ${difficulty === 'advanced' ? 'bg-[#326fa0] border-[#326fa0] text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Advanced (A-Level + TMs)
            </button>
          </div>
        </div>
      </div>

      {/* --- DISPLAY AREA VIEWPORT CARD --- */}
      <div className="w-full max-w-md mx-auto my-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center">
        <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Assignment Subject</span>
        <div className="text-xl font-black text-slate-800 tracking-tight font-mono p-4 bg-slate-50 border border-slate-100 rounded-2xl inline-block min-w-[220px]">
          {currentProblem.q}
        </div>

        {/* INTERACTIVE COMPOSER SUBSCRIPT INTERFACE BLOCK */}
        {hasIndexInterface ? (
          <div className="mt-6 border-t border-slate-100 pt-5 text-left">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 text-center">Interactive Ratio Index Subscript Matrix</label>
            
            <div className="flex justify-center items-end gap-3 font-mono text-2xl font-black text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner max-w-xs mx-auto">
              {/* Cation Component Segment */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold tracking-tight font-sans text-slate-400 mb-1">Cation</span>
                <div className="flex items-baseline gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <span>{currentProblem.cat}</span>
                  <input 
                    type="number" min="1" max="9"
                    value={cationIndex}
                    onChange={(e) => setCationIndex(e.target.value)}
                    className="w-8 text-center text-base font-black text-[#326fa0] border-b-2 border-[#326fa0] outline-none"
                  />
                </div>
              </div>

              <span className="pb-1 text-slate-300">|</span>

              {/* Anion Component Segment */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold tracking-tight font-sans text-slate-400 mb-1">Anion</span>
                <div className="flex items-baseline gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <span>{currentProblem.ani}</span>
                  <input 
                    type="number" min="1" max="9"
                    value={anionIndex}
                    onChange={(e) => setAnionIndex(e.target.value)}
                    className="w-8 text-center text-base font-black text-rose-600 border-b-2 border-rose-600 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* LIVE AUTOMATIC FORMULA TYPESETTING BOX */}
            <div className="mt-4 text-center">
              <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Live Subscript Processing Preview</span>
              <div className="text-base font-black text-slate-700 tracking-wide bg-slate-100/50 px-4 py-2 rounded-xl inline-block font-mono border border-slate-200/40">
                {renderFormulaPreview()}
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD ALIGNMENT STRING TEXT INPUT (For naming tasks) */
          <div className="mt-6 text-left border-t border-slate-100 pt-5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Provide Nomenclature Entry Answer String</label>
            <input
              type="text"
              value={userTextAnswer}
              onChange={(e) => setUserTextAnswer(e.target.value)}
              placeholder={mode === 'formula-to-name' ? "e.g., Iron(III) sulfate" : "e.g., 2Al3+ + 3SO42-"}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-sm transition-all focus:bg-white focus:border-slate-400 font-sans shadow-inner"
            />
            <span className="block text-[9px] font-medium text-slate-400 mt-2 leading-normal">
              Rule: Superscripts / multipliers inside dissociation modes are typed directly using flat strings (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">2Al3+</code>). Letters are case-insensitive.
            </span>
          </div>
        )}
      </div>

      {/* --- SYSTEM CONTROLS ROW --- */}
      <div className="button-group mt-6">
        <button type="button" className="btn btn-primary" onClick={checkAnswer}>Verify Configuration Answer</button>
        <button type="button" className="btn btn-secondary" onClick={() => generateProblem(mode, difficulty)}>Generate Next Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default FormulaMaster;
