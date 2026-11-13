import React, { useState, useEffect } from 'react';

const FormulaMaster = ({ onComplete }) => {
  const [activeMode, setActiveMode] = useState('ions-from-formula-gcse');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [feedback, setFeedback] = useState({ message: null, status: '' });

  const [catText, setCatText] = useState('');
  const [catChargeVal, setCatChargeVal] = useState(1);

  const [aniText, setAniText] = useState('');
  const [aniChargeVal, setAniChargeVal] = useState(1);

  const ionicUniverse = {
    gcse: {
      cations: [
        { formula: "Na", charge: 1, name: "Sodium" },
        { formula: "K", charge: 1, name: "Potassium" },
        { formula: "Li", charge: 1, name: "Lithium" },
        { formula: "Mg", charge: 2, name: "Magnesium" },
        { formula: "Ca", charge: 2, name: "Calcium" },
        { formula: "Al", charge: 3, name: "Aluminium" },
        { formula: "Cu", charge: 2, name: "Copper(II)" },
        { formula: "Fe", charge: 2, name: "Iron(II)" },
        { formula: "Fe", charge: 3, name: "Iron(III)" },
        { formula: "Zn", charge: 2, name: "Zinc" },
        { formula: "H", charge: 1, name: "Hydrogen" }
      ],
      anions: [
        { formula: "Cl", charge: 1, name: "chloride" },
        { formula: "Br", charge: 1, name: "bromide" },
        { formula: "I", charge: 1, name: "iodide" },
        { formula: "O", charge: 2, name: "oxide" },
        { formula: "S", charge: 2, name: "sulfide" },
        { formula: "OH", charge: 1, name: "hydroxide", isPoly: true },
        { formula: "NO3", charge: 1, name: "nitrate", isPoly: true },
        { formula: "SO4", charge: 2, name: "sulfate", isPoly: true },
        { formula: "CO3", charge: 2, name: "carbonate", isPoly: true }
      ]
    },
    advanced: {
      cations: [
        { formula: "NH4", charge: 1, name: "Ammonium", isPoly: true },
        { formula: "Ag", charge: 1, name: "Silver" },
        { formula: "Pb", charge: 2, name: "Lead(II)" },
        { formula: "Cr", charge: 3, name: "Chromium(III)" },
        { formula: "Mn", charge: 2, name: "Manganese(II)" },
        { formula: "Ba", charge: 2, name: "Barium" },
        { formula: "Sr", charge: 2, name: "Strontium" }
      ],
      anions: [
        { formula: "PO4", charge: 3, name: "phosphate", isPoly: true },
        { formula: "HCO3", charge: 1, name: "hydrogencarbonate", isPoly: true },
        { formula: "HSO4", charge: 1, name: "hydrogensulfate", isPoly: true },
        { formula: "CrO4", charge: 2, name: "chromate", isPoly: true },
        { formula: "Cr2O7", charge: 2, name: "dichromate", isPoly: true },
        { formula: "MnO4", charge: 1, name: "manganate(VII)", isPoly: true },
        { formula: "CH3COO", charge: 1, name: "ethanoate", isPoly: true }
      ]
    },
    specialMolecules: [
      { formula: "H2O", name: "Water", catFormula: "H", catCharge: 1, aniFormula: "OH", aniCharge: 1, altCatFormula: "H", altCatCharge: 1, isCovalent: true },
      { formula: "NH3", name: "Ammonia", catFormula: "NH4", catCharge: 1, aniFormula: "OH", aniCharge: 1, isCovalent: true },
      { formula: "CH4", name: "Methane", isCovalent: true, neutralOnly: true },
      { formula: "CO2", name: "Carbon dioxide", isCovalent: true, neutralOnly: true }
    ]
  };

  const getGreatestCommonDivisor = (a, b) => (!b ? a : getGreatestCommonDivisor(b, a % b));

  const buildBalancedFormula = (cat, ani) => {
    if (cat.formula === 'H' && ani.formula === 'OH') {
      return 'H2O';
    }

    if (ani.formula === 'CH3COO') {
      const cChg = cat.charge;
      const aChg = ani.charge;
      const scale = getGreatestCommonDivisor(cChg, aChg);
      const aniSubscript = cChg / scale;
      const catSubscript = aChg / scale;

      const aniPart = aniSubscript > 1 ? `(${ani.formula})` : ani.formula;
      const aniSub = aniSubscript === 1 ? '' : aniSubscript;
      const catPart = (cat.isPoly && catSubscript > 1) ? `(${cat.formula})` : cat.formula;
      const catSub = catSubscript === 1 ? '' : catSubscript;

      return `${aniPart}${aniSub}${catPart}${catSub}`;
    }

    const cChg = cat.charge;
    const aChg = ani.charge;

    const scale = getGreatestCommonDivisor(cChg, aChg);
    const catSubscript = aChg / scale;
    const aniSubscript = cChg / scale;

    const catPart = (cat.isPoly && catSubscript > 1) ? `(${cat.formula})` : cat.formula;
    const catSub = catSubscript === 1 ? '' : catSubscript;

    const aniPart = (ani.isPoly && aniSubscript > 1) ? `(${ani.formula})` : ani.formula;
    const aniSub = aniSubscript === 1 ? '' : aniSubscript;

    return `${catPart}${catSub}${aniPart}${aniSub}`;
  };

  const generateProblemInstance = (modeKey = activeMode) => {
    const isAdvanced = modeKey.includes('advanced');
    const isFromFormula = modeKey.includes('formula');

    const includeSpecial = Math.random() < 0.15;

    if (includeSpecial) {
      const mol = ionicUniverse.specialMolecules[Math.floor(Math.random() * ionicUniverse.specialMolecules.length)];

      setCurrentProblem({
        qDisplay: isFromFormula ? mol.formula : mol.name,
        targetCat: mol.catFormula || 'None',
        targetCatVal: mol.catCharge || 0,
        targetAni: mol.aniFormula || 'None',
        targetAniVal: mol.aniCharge || 0,
        rawFormula: mol.formula,
        rawName: mol.name,
        isCovalent: true,
        neutralOnly: mol.neutralOnly || false
      });
    } else {
      const catPool = isAdvanced
        ? [...ionicUniverse.gcse.cations, ...ionicUniverse.advanced.cations]
        : ionicUniverse.gcse.cations;

      const aniPool = isAdvanced
        ? [...ionicUniverse.gcse.anions, ...ionicUniverse.advanced.anions]
        : ionicUniverse.gcse.anions;

      const selectedCation = catPool[Math.floor(Math.random() * catPool.length)];
      const selectedAnion = aniPool[Math.floor(Math.random() * aniPool.length)];

      const calculatedFormula = buildBalancedFormula(selectedCation, selectedAnion);
      const calculatedName = `${selectedCation.name} ${selectedAnion.name}`;

      setCurrentProblem({
        qDisplay: isFromFormula ? calculatedFormula : calculatedName,
        targetCat: selectedCation.formula,
        targetCatVal: selectedCation.charge,
        targetAni: selectedAnion.formula,
        targetAniVal: selectedAnion.charge,
        rawFormula: calculatedFormula,
        rawName: calculatedName,
        isCovalent: false
      });
    }

    setCatText('');
    setCatChargeVal(1);
    setAniText('');
    setAniChargeVal(1);
    setFeedback({ message: null, status: '' });
  };

  const triggerRandomModeSwap = () => {
    const optionKeys = [
      'ions-from-formula-gcse',
      'ions-from-formula-advanced',
      'ions-from-name-gcse',
      'ions-from-name-advanced'
    ];
    const pickedMode = optionKeys[Math.floor(Math.random() * optionKeys.length)];
    setActiveMode(pickedMode);
    generateProblemInstance(pickedMode);
  };

  useEffect(() => {
    generateProblemInstance(activeMode);
  }, [activeMode]);

  const formatChemicalTextHtml = (rawText) => {
    if (!rawText) return '';
    const componentParts = rawText.split(/([0-9]+)/);
    return componentParts.map((part, index) => {
      const isNumeric = /^[0-9]+$/.test(part);
      return isNumeric ? <sub key={index} className="bottom-[-0.2em] text-[0.75em] leading-none font-black">{part}</sub> : part;
    });
  };

  const getChargeString = (val, sign) => {
    if (val === 0) return '';
    return val === 1 ? sign : `${val}${sign}`;
  };

  const executeAnswerAudit = () => {
    if (!currentProblem) return;
    setFeedback({ message: null, status: '' });

    if (currentProblem.isCovalent && currentProblem.neutralOnly) {
      setFeedback({
        status: 'success',
        message: (
          <div className="space-y-1">
            <span className="block font-black text-xs text-[#326fa0]">ℹ️ Simple Covalent Molecule</span>
            <p className="text-slate-600 font-medium text-[11px]">
              <strong>{currentProblem.rawName} ({currentProblem.rawFormula})</strong> is a simple covalent molecule composed of neutral atoms sharing electrons, not discrete ions.
            </p>
          </div>
        )
      });
      onComplete?.(currentProblem.rawFormula);
      return;
    }

    const cleanCatUser = catText.replace(/[\s()]+/g, '');
    const cleanAniUser = aniText.replace(/[\s()]+/g, '');

    const catFormulaPassed = cleanCatUser === currentProblem.targetCat;
    const aniFormulaPassed = cleanAniUser === currentProblem.targetAni;

    const catChargePassed = catChargeVal === currentProblem.targetCatVal;
    const aniChargePassed = aniChargeVal === currentProblem.targetAniVal;

    if (catFormulaPassed && aniFormulaPassed && catChargePassed && aniChargePassed) {
      setFeedback({
        status: 'success',
        message: (
          <div className="space-y-1">
            <span className="block font-black text-xs text-emerald-800">✓ Correct</span>
            <p className="text-slate-600 font-medium text-[11px]">
              {currentProblem.rawName} contains <strong className="font-mono">{currentProblem.targetCat}<sup>{getChargeString(currentProblem.targetCatVal, '+')}</sup></strong> and <strong className="font-mono">{currentProblem.targetAni}<sup>{getChargeString(currentProblem.targetAniVal, '-')}</sup></strong> ions.
            </p>
          </div>
        )
      });
      onComplete?.(currentProblem.rawFormula);
    } else {
      setFeedback({
        status: 'error',
        message: (
          <div className="space-y-1.5 text-left">
            <span className="block font-black text-xs text-rose-800">✕ Incorrect</span>
            {!catFormulaPassed || !aniFormulaPassed ? (
              <p className="text-rose-700 font-bold text-[10px] bg-rose-100/50 p-1.5 rounded-lg border border-rose-200/40">
                Ensure correct chemical capitalisation (e.g. Na, Cl, SO4, OH).
              </p>
            ) : null}
            <p className="text-slate-500 font-medium text-[11px]">
              Expected ions: <strong className="font-mono text-slate-700">{currentProblem.targetCat}<sup>{getChargeString(currentProblem.targetCatVal, '+')}</sup></strong> and <strong className="font-mono text-slate-700">{currentProblem.targetAni}<sup>{getChargeString(currentProblem.targetAniVal, '-')}</sup></strong>
            </p>
          </div>
        )
      });
    }
  };

  if (!currentProblem) return null;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      <div className="applet-header">Ion formulas from compounds</div>

      <div className="question-text text-center px-4 leading-relaxed">
        Give the formulas of the ions making up the following compound.
      </div>

      <div className="w-full max-w-md mx-auto my-4 bg-slate-100 border border-slate-200 rounded-2xl p-4 flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Practice Mode</label>
          <select
            value={activeMode}
            onChange={(e) => setActiveMode(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none shadow-sm focus:border-[#326fa0]"
          >
            <option value="ions-from-formula-gcse">Ions from Formulas (GCSE)</option>
            <option value="ions-from-formula-advanced">Ions from Formulas (Advanced)</option>
            <option value="ions-from-name-gcse">Ions from Names (GCSE)</option>
            <option value="ions-from-name-advanced">Ions from Names (Advanced)</option>
          </select>
        </div>
        <button
          type="button"
          onClick={triggerRandomModeSwap}
          className="px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors h-[34px] uppercase tracking-wider shrink-0"
        >
          🎲 Random
        </button>
      </div>

      <div className="w-full max-w-md mx-auto my-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-center">
        <div className="text-xl font-black text-slate-800 tracking-tight font-mono p-4 bg-slate-50 border border-slate-100 rounded-2xl inline-block min-w-[220px]">
          {activeMode.includes('formula') ? formatChemicalTextHtml(currentProblem.qDisplay) : currentProblem.qDisplay}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2 text-center">Cation Formula</span>
              <div className="flex gap-2 items-center w-full justify-center">
                <input
                  type="text" value={catText} onChange={(e) => setCatText(e.target.value)}
                  placeholder="e.g., Na"
                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-center text-xs outline-none focus:border-[#326fa0]"
                />
                <div className="flex flex-col items-center bg-white px-1.5 py-1 rounded-xl border border-slate-200 select-none">
                  <button type="button" onClick={() => setCatChargeVal(p => Math.min(p + 1, 4))} className="text-[10px] text-slate-300 hover:text-slate-600 px-1">▲</button>
                  <span className="text-[10px] font-black text-blue-600 font-mono my-0.5">{getChargeString(catChargeVal, '+')}</span>
                  <button type="button" onClick={() => setCatChargeVal(p => Math.max(p - 1, 1))} className="text-[10px] text-slate-300 hover:text-slate-600 px-1">▼</button>
                </div>
              </div>
            </div>
            <div className="mt-3 bg-white/70 border border-slate-100 text-center py-1.5 px-2 rounded-xl font-mono text-sm font-black text-slate-700 relative min-h-[32px] flex items-center justify-center">
              <span>{formatChemicalTextHtml(catText)}</span>
              {catText && <sup className="text-[0.75em] text-blue-600 font-black relative top-[-0.6em] left-[0.1em]">{getChargeString(catChargeVal, '+')}</sup>}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2 text-center">Anion Formula</span>
              <div className="flex gap-2 items-center w-full justify-center">
                <input
                  type="text" value={aniText} onChange={(e) => setAniText(e.target.value)}
                  placeholder="e.g., SO4"
                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-center text-xs outline-none focus:border-rose-500"
                />
                <div className="flex flex-col items-center bg-white px-1.5 py-1 rounded-xl border border-slate-200 select-none">
                  <button type="button" onClick={() => setAniChargeVal(p => Math.min(p + 1, 4))} className="text-[10px] text-slate-300 hover:text-slate-600 px-1">▲</button>
                  <span className="text-[10px] font-black text-rose-600 font-mono my-0.5">{getChargeString(aniChargeVal, '-')}</span>
                  <button type="button" onClick={() => setAniChargeVal(p => Math.max(p - 1, 1))} className="text-[10px] text-slate-300 hover:text-slate-600 px-1">▼</button>
                </div>
              </div>
            </div>
            <div className="mt-3 bg-white/70 border border-slate-100 text-center py-1.5 px-2 rounded-xl font-mono text-sm font-black text-slate-700 relative min-h-[32px] flex items-center justify-center">
              <span>{formatChemicalTextHtml(aniText)}</span>
              {aniText && <sup className="text-[0.75em] text-rose-600 font-black relative top-[-0.6em] left-[0.1em]">{getChargeString(aniChargeVal, '-')}</sup>}
            </div>
          </div>
        </div>
      </div>

      <div className="button-group mt-6">
        <button type="button" className="btn btn-primary" onClick={executeAnswerAudit}>Check Answer</button>
        <button type="button" className="btn btn-secondary" onClick={() => generateProblemInstance(activeMode)}>Next Problem</button>
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
