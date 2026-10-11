import React, { useState, useEffect, useRef } from 'react';

// Isolated global constants to ensure clean text-entry performance cycles
const simpleCations = [
  { formula: "H+", charge: 1, html: <>H<sup>+</sup></>, name: "Hydrogen ion" },
  { formula: "Li+", charge: 1, html: <>Li<sup>+</sup></>, name: "Lithium ion" },
  { formula: "Na+", charge: 1, html: <>Na<sup>+</sup></>, name: "Sodium ion" },
  { formula: "K+", charge: 1, html: <>K<sup>+</sup></>, name: "Potassium ion" },
  { formula: "Ag+", charge: 1, html: <>Ag<sup>+</sup></>, name: "Silver ion" },
  { formula: "Mg2+", charge: 2, html: <>Mg<sup>2+</sup></>, name: "Magnesium ion" },
  { formula: "Ca2+", charge: 2, html: <>Ca<sup>2+</sup></>, name: "Calcium ion" },
  { formula: "Ba2+", charge: 2, html: <>Ba<sup>2+</sup></>, name: "Barium ion" },
  { formula: "Cu2+", charge: 2, html: <>Cu<sup>2+</sup></>, name: "Copper(II) ion" },
  { formula: "Fe2+", charge: 2, html: <>Fe<sup>2+</sup></>, name: "Iron(II) ion" },
  { formula: "Zn2+", charge: 2, html: <>Zn<sup>2+</sup></>, name: "Zinc ion" },
  { formula: "Pb2+", charge: 2, html: <>Pb<sup>2+</sup></>, name: "Lead(II) ion" },
  { formula: "Al3+", charge: 3, html: <>Al<sup>3+</sup></>, name: "Aluminium ion" },
  { formula: "Fe3+", charge: 3, html: <>Fe<sup>3+</sup></>, name: "Iron(III) ion" },
  { formula: "NH4+", charge: 1, html: <>NH<sub>4</sub><sup>+</sup></>, name: "Ammonium ion", polyatomic: true }
];

const simpleAnions = [
  { formula: "F-", charge: 1, html: <>F<sup>-</sup></>, name: "Fluoride" },
  { formula: "Cl-", charge: 1, html: <>Cl<sup>-</sup></>, name: "Chloride" },
  { formula: "Br-", charge: 1, html: <>Br<sup>-</sup></>, name: "Bromide" },
  { formula: "I-", charge: 1, html: <>I<sup>-</sup></>, name: "Iodide" },
  { formula: "H-", charge: 1, html: <>H<sup>-</sup></>, name: "Hydride" },
  { formula: "O2-", charge: 2, html: <>O<sup>2-</sup></>, name: "Oxide" },
  { formula: "S2-", charge: 2, html: <>S<sup>2-</sup></>, name: "Sulfide" },
  { formula: "N3-", charge: 3, html: <>N<sup>3-</sup></>, name: "Nitride" }
];

const advancedPolyAnions = [
  { formula: "OH-", charge: 1, html: <>OH<sup>-</sup></>, name: "Hydroxide", polyatomic: true, base: "OH" },
  { formula: "NO3-", charge: 1, html: <>NO<sub>3</sub><sup>-</sup></>, name: "Nitrate", polyatomic: true, base: "NO3" },
  { formula: "HCO3-", charge: 1, html: <>HCO<sub>3</sub><sup>-</sup></>, name: "Hydrogen carbonate", polyatomic: true, base: "HCO3" },
  { formula: "HSO4-", charge: 1, html: <>HSO<sub>4</sub><sup>-</sup></>, name: "Hydrogen sulfate", polyatomic: true, base: "HSO4" },
  { formula: "MnO4-", charge: 1, html: <>MnO<sub>4</sub><sup>-</sup></>, name: "Manganate(VII)", polyatomic: true, base: "MnO4" },
  { formula: "CO32-", charge: 2, html: <>CO<sub>3</sub><sup>2-</sup></>, name: "Carbonate", polyatomic: true, base: "CO3" },
  { formula: "SO42-", charge: 2, html: <>SO<sub>4</sub><sup>2-</sup></>, name: "Sulfate", polyatomic: true, base: "SO4" },
  { formula: "CrO42-", charge: 2, html: <>CrO<sub>4</sub><sup>2-</sup></>, name: "Chromate(VI)", polyatomic: true, base: "CrO4" },
  { formula: "Cr2O72-", charge: 2, html: <>Cr<sub>2</sub>O<sub>7</sub><sup>2-</sup></>, name: "Dichromate(VI)", polyatomic: true, base: "Cr2O7" },
  { formula: "PO43-", charge: 3, html: <>PO<sub>4</sub><sup>3-</sup></>, name: "Phosphate", polyatomic: true, base: "PO4" }
];

export function FormulasFromIons() {
  const [cation, setCation] = useState(null);
  const [anion, setAnion] = useState(null);
  const [userFormula, setUserFormula] = useState('');
  const [feedback, setFeedback] = useState(null);
  const feedbackRef = useRef(null);

  const getLCM = (a, b) => {
    const min = Math.min(a, b);
    for (let i = min; i <= a * b; i++) {
      if (i % a === 0 && i % b === 0) return i;
    }
    return a * b;
  };

  const generatePair = () => {
    setUserFormula('');
    setFeedback(null);

    const randomCation = simpleCations[Math.floor(Math.random() * simpleCations.length)];
    const useAdvanced = Math.random() > 0.45;
    const pool = useAdvanced ? advancedPolyAnions : simpleAnions;
    const randomAnion = pool[Math.floor(Math.random() * pool.length)];

    setCation(randomCation);
    setAnion(randomAnion);
  };

  useEffect(() => {
    generatePair();
  }, []);

  // --- RENDERS DYNAMIC SUBSCRIPTS LOWERED COMFORTABLY BELOW BASELINE LINE HEIGHTS ---
  const renderLiveFormulaPreview = (inputString) => {
    if (!inputString.trim()) return <span className="text-slate-400 font-sans text-xs font-normal">Awaiting input...</span>;
    
    // Catch alternate typed variations and display their standard formatting equivalents
    let displayString = inputString;
    const cleanLower = inputString.replace(/\s+/g, '').toLowerCase();
    
    if (displayString) {
      if (cation?.formula === "H+" && anion?.formula === "HSO4-" && cleanLower === "hhso4") {
        displayString = "H2SO4";
      } else if (cation?.formula === "H+" && anion?.formula === "HCO3-" && cleanLower === "hhco3") {
        displayString = "H2CO3";
      } else if (cation?.formula === "H+" && anion?.formula === "OH-" && cleanLower === "hoh") {
        displayString = "H2O";
      }
    }

    const tokenRegex = /([0-9]+)/g;
    const segments = displayString.split(tokenRegex);

    return segments.map((segment, index) => {
      const isNumeric = /^[0-9]+$/.test(segment);
      return isNumeric ? (
        <sub 
          key={`sub-${index}`} 
          className="text-[0.7em] font-black text-blue-600 inline-block translate-y-[0.25em]"
          style={{ verticalAlign: 'sub', lineHeight: '0' }}
        >
          {segment}
        </sub>
      ) : (
        <span key={`text-${index}`} className="font-bold text-slate-800">
          {segment}
        </span>
      );
    });
  };

  // --- REFACTORED WJEC MARK ENGINE SPECIFICATION FORMULA VALIDATION ---
  const getCorrectAnswers = () => {
    if (!cation || !anion) return [];
    
    const lcm = getLCM(cation.charge, anion.charge);
    const catCount = lcm / cation.charge;
    const anCount = lcm / anion.charge;

    // Direct structural overrides for Hydrogen acids and water formations
    if (cation.formula === "H+" && anion.formula === "HSO4-") {
      return ["h2so4", "h₂so₄"];
    }
    if (cation.formula === "H+" && anion.formula === "HCO3-") {
      return ["h2co3", "h₂co₃"];
    }
    if (cation.formula === "H+" && anion.formula === "OH-") {
      return ["h2o", "h₂o"];
    }

    const catStr = cation.formula.replace(/\d?\+/, '');
    const anStr = anion.formula.replace(/\d?-/, '');

    let partCat = catCount === 1 ? catStr : `${catStr}${catCount}`;
    let partAn = "";

    if (anCount === 1) {
      partAn = anion.polyatomic ? anion.base : anStr;
    } else {
      partAn = anion.polyatomic ? `(${anion.base})${anCount}` : `${anStr}${anCount}`;
    }

    const standardForm = `${partCat}${partAn}`;
    return [standardForm, standardForm.toLowerCase()];
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!cation || !anion || !userFormula.trim()) return;

    const cleanedInput = userFormula.replace(/\s+/g, '');
    let evaluationTarget = cleanedInput.toLowerCase();
    
    // Support alternate raw combinations natively before executing string assertions
    if (cation.formula === "H+" && anion.formula === "HSO4-" && evaluationTarget === "hhso4") {
      evaluationTarget = "h2so4";
    }
    if (cation.formula === "H+" && anion.formula === "HCO3-" && evaluationTarget === "hhco3") {
      evaluationTarget = "h2co3";
    }
    if (cation.formula === "H+" && anion.formula === "OH-" && evaluationTarget === "hoh") {
      evaluationTarget = "h2o";
    }

    const correctAnswers = getCorrectAnswers();
    const isMatched = correctAnswers.includes(evaluationTarget);

    const lcm = getLCM(cation.charge, anion.charge);
    const expectedCat = lcm / cation.charge;
    const expectedAn = lcm / anion.charge;

    if (isMatched) {
      setFeedback({
        isCorrect: true,
        msg: `Excellent! The charges balance completely at a ${expectedCat}:${expectedAn} ratio, giving a net neutral compound.`
      });
    } else {
      let bracketHint = "";
      if (anion.polyatomic && expectedAn > 1 && !cleanedInput.includes('(')) {
        bracketHint = " Remember to enclose polyatomic ion sub-units inside brackets when scaling their ratio above 1.";
      }
      setFeedback({
        isCorrect: false,
        msg: `Incorrect formula structural compilation. Deduce the lowest common multiple of ${cation.charge}+ and ${anion.charge}-.${bracketHint}`
      });
    }

    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  if (!cation || !anion) return <div className="text-center p-8 text-[var(--chem-text-muted)]">Loading workspace matrix...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-[var(--chem-border-subtle)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--chem-text-main)]">Formulas from Ions Builder</h2>
          <p className="text-xs text-[var(--chem-text-muted)] font-medium mt-0.5">Core Skill Scaffold: Constructing Net Neutral Empirical Ionic Compounds</p>
        </div>
        <button
          onClick={generatePair}
          className="px-3 py-1.5 text-xs font-bold bg-[var(--chem-bg-muted)] hover:bg-[var(--chem-border-subtle)] border border-[var(--chem-border-subtle)] rounded-lg transition-colors text-[var(--chem-text-main)] shrink-0 self-start sm:self-center"
        >
          🎲 Shuffle Ions
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl p-4 text-center shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">Target Cation</span>
          <div className="text-2xl font-bold text-[var(--chem-text-main)] font-mono">{cation.html}</div>
          <div className="text-xs font-medium text-[var(--chem-text-muted)] mt-1">{cation.name} (Charge: +{cation.charge})</div>
        </div>
        <div className="bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl p-4 text-center shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">Target Anion</span>
          <div className="text-2xl font-bold text-[var(--chem-text-main)] font-mono">{anion.html}</div>
          <div className="text-xs font-medium text-[var(--chem-text-muted)] mt-1">{anion.name} (Charge: -{anion.charge})</div>
        </div>
      </div>

      <form onSubmit={handleVerify} className="bg-[var(--chem-bg-card)] border border-[var(--chem-border-subtle)] rounded-xl p-5 space-y-4 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[var(--chem-text-main)] block">
            Deduce the Combined Neutral Formula:
          </label>
          <p className="text-xs text-[var(--chem-text-muted)] leading-relaxed">
            Type standard continuous values. Use brackets for multiple polyatomic units. The layout widget below renders active subscripts cleanly alongside your typing context.
          </p>
        </div>

        <div className="space-y-3">
          {/* --- ULTRA-STABLE UNIFIED ROW LIFE SUFFIX BADGE ROW LAYOUT --- */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            
            {/* Real standard visible input box. Text color is normal slate-800 so it can NEVER go invisible */}
            <input
              type="text"
              value={userFormula}
              onChange={(e) => setUserFormula(e.target.value)}
              placeholder="e.g. Al2(SO4)3"
              className="flex-1 px-4 py-2.5 text-sm bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--chem-primary)] text-slate-800 font-mono font-bold tracking-wide shadow-inner placeholder-slate-400"
              spellCheck="false"
              autoComplete="off"
            />

            {/* High-visibility active visual render container placed cleanly inside the action layout row */}
            <div className="min-w-[140px] px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-1.5 h-10 select-none shrink-0 text-center shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-200 pr-1.5 leading-none">Render:</span>
              <div className="text-sm font-mono tracking-wide leading-none h-5 flex items-center overflow-hidden">
                {renderLiveFormulaPreview(userFormula)}
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 h-10 text-sm font-bold bg-[var(--chem-primary)] text-white hover:bg-[var(--chem-primary-hover)] rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--chem-primary)] shrink-0"
            >
              Check Balance
            </button>
          </div>
        </div>
      </form>

      {feedback && (
        <div
          ref={feedbackRef}
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-[fadeIn_0.2s_ease-out] ${
            feedback.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-800'
          }`}
        >
          <span className="text-lg mt-0.5">{feedback.isCorrect ? '✅' : '❌'}</span>
          <div>
            <h4 className="text-sm font-bold">{feedback.isCorrect ? 'Empirical Balance Reached' : 'Stoichiometry Mismatch'}</h4>
            <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">{feedback.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}