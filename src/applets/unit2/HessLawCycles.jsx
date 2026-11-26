import React, { useState, useEffect } from 'react';

const HESS_REACTIONS = [
  {
    id: 'ethene_hyd',
    type: 'formation',
    title: 'Hydration of Ethene',
    equation: 'C₂H₄(g) + H₂O(g) → C₂H₅OH(l)',
    bottomBox: '2C(s) + 3H₂(g) + ½O₂(g)',
    reactants: [
      { label: 'C₂H₄(g)', coeff: 1, baseVal: 52 },
      { label: 'H₂O(g)', coeff: 1, baseVal: -242 },
    ],
    products: [
      { label: 'C₂H₅OH(l)', coeff: 1, baseVal: -278 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'iron_co',
    type: 'formation',
    title: 'Blast Furnace Reduction of Iron(III) Oxide',
    equation: 'Fe₂O₃(s) + 3CO(g) → 2Fe(s) + 3CO₂(g)',
    bottomBox: '2Fe(s) + 3C(s) + 3O₂(g)',
    reactants: [
      { label: 'Fe₂O₃(s)', coeff: 1, baseVal: -824 },
      { label: 'CO(g)', coeff: 3, baseVal: -111 },
    ],
    products: [
      { label: 'Fe(s)', coeff: 2, baseVal: 0, isElement: true },
      { label: 'CO₂(g)', coeff: 3, baseVal: -394 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'nh3_cuo',
    type: 'formation',
    title: 'Reduction of Copper(II) Oxide by Ammonia',
    equation: '2NH₃(g) + 3CuO(s) → N₂(g) + 3Cu(s) + 3H₂O(l)',
    bottomBox: 'N₂(g) + 3H₂(g) + 3Cu(s) + ³⁄₂O₂(g)',
    reactants: [
      { label: 'NH₃(g)', coeff: 2, baseVal: -46 },
      { label: 'CuO(s)', coeff: 3, baseVal: -157 },
    ],
    products: [
      { label: 'N₂(g)', coeff: 1, baseVal: 0, isElement: true },
      { label: 'Cu(s)', coeff: 3, baseVal: 0, isElement: true },
      { label: 'H₂O(l)', coeff: 3, baseVal: -286 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'steam_reform',
    type: 'formation',
    title: 'Steam Reforming of Methane',
    equation: 'CH₄(g) + H₂O(g) → CO(g) + 3H₂(g)',
    bottomBox: 'C(s) + 3H₂(g) + ½O₂(g)',
    reactants: [
      { label: 'CH₄(g)', coeff: 1, baseVal: -75 },
      { label: 'H₂O(g)', coeff: 1, baseVal: -242 },
    ],
    products: [
      { label: 'CO(g)', coeff: 1, baseVal: -111 },
      { label: 'H₂(g)', coeff: 3, baseVal: 0, isElement: true },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'contact_so3',
    type: 'formation',
    title: 'Contact Process Oxidation of Sulfur Dioxide',
    equation: '2SO₂(g) + O₂(g) → 2SO₃(g)',
    bottomBox: '2S(s) + 3O₂(g)',
    reactants: [
      { label: 'SO₂(g)', coeff: 2, baseVal: -297 },
      { label: 'O₂(g)', coeff: 1, baseVal: 0, isElement: true },
    ],
    products: [
      { label: 'SO₃(g)', coeff: 2, baseVal: -396 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'nahco3_decomp',
    type: 'formation',
    title: 'Thermal Decomposition of Sodium Hydrogencarbonate',
    equation: '2NaHCO₃(s) → Na₂CO₃(s) + CO₂(g) + H₂O(l)',
    bottomBox: '2Na(s) + 2C(s) + H₂(g) + 3O₂(g)',
    reactants: [
      { label: 'NaHCO₃(s)', coeff: 2, baseVal: -951 },
    ],
    products: [
      { label: 'Na₂CO₃(s)', coeff: 1, baseVal: -1131 },
      { label: 'CO₂(g)', coeff: 1, baseVal: -394 },
      { label: 'H₂O(l)', coeff: 1, baseVal: -286 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'ethane_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Ethane (via Combustion)',
    equation: '2C(s) + 3H₂(g) → C₂H₆(g)',
    bottomBox: '2CO₂(g) + 3H₂O(l)',
    reactants: [
      { label: 'C(s)', coeff: 2, baseVal: -394 },
      { label: 'H₂(g)', coeff: 3, baseVal: -286 },
    ],
    products: [
      { label: 'C₂H₆(g)', coeff: 1, baseVal: -1560 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'propane_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Propane (via Combustion)',
    equation: '3C(s) + 4H₂(g) → C₃H₈(g)',
    bottomBox: '3CO₂(g) + 4H₂O(l)',
    reactants: [
      { label: 'C(s)', coeff: 3, baseVal: -394 },
      { label: 'H₂(g)', coeff: 4, baseVal: -286 },
    ],
    products: [
      { label: 'C₃H₈(g)', coeff: 1, baseVal: -2220 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'ethanol_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Ethanol (via Combustion)',
    equation: '2C(s) + 3H₂(g) + ½O₂(g) → C₂H₅OH(l)',
    bottomBox: '2CO₂(g) + 3H₂O(l)',
    reactants: [
      { label: 'C(s)', coeff: 2, baseVal: -394 },
      { label: 'H₂(g)', coeff: 3, baseVal: -286 },
      { label: 'O₂(g)', coeff: 0.5, baseVal: 0, isElement: true },
    ],
    products: [
      { label: 'C₂H₅OH(l)', coeff: 1, baseVal: -1367 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'ethene_hyd_c',
    type: 'combustion',
    title: 'Hydrogenation of Ethene (via Combustion)',
    equation: 'C₂H₄(g) + H₂(g) → C₂H₆(g)',
    bottomBox: '2CO₂(g) + 3H₂O(l)',
    reactants: [
      { label: 'C₂H₄(g)', coeff: 1, baseVal: -1411 },
      { label: 'H₂(g)', coeff: 1, baseVal: -286 },
    ],
    products: [
      { label: 'C₂H₆(g)', coeff: 1, baseVal: -1560 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'methanoic_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Methanoic Acid',
    equation: 'C(s) + H₂(g) + O₂(g) → HCOOH(l)',
    bottomBox: 'CO₂(g) + H₂O(l)',
    reactants: [
      { label: 'C(s)', coeff: 1, baseVal: -394 },
      { label: 'H₂(g)', coeff: 1, baseVal: -286 },
      { label: 'O₂(g)', coeff: 1, baseVal: 0, isElement: true },
    ],
    products: [
      { label: 'HCOOH(l)', coeff: 1, baseVal: -255 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'benzene_hyd_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Methane (via Combustion)',
    equation: 'C(s) + 2H₂(g) → CH₄(g)',
    bottomBox: 'CO₂(g) + 2H₂O(l)',
    reactants: [
      { label: 'C(s)', coeff: 1, baseVal: -394 },
      { label: 'H₂(g)', coeff: 2, baseVal: -286 },
    ],
    products: [
      { label: 'CH₄(g)', coeff: 1, baseVal: -890 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
];

export default function HessLawCycles({ onComplete }) {
  const [mode, setMode] = useState('formation_cycle');
  const [problem, setProblem] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Step 1 Route Gate
  const [gateEnabled, setGateEnabled] = useState(true);
  const [gateFormula, setGateFormula] = useState('');
  const [gateLeftSum, setGateLeftSum] = useState('');
  const [gateRightSum, setGateRightSum] = useState('');
  const [gateVerified, setGateVerified] = useState(false);
  const [gateFeedback, setGateFeedback] = useState(null);

  // Step 2 Answer
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const generateProblem = (forcedMode = null) => {
    const modes = ['formation_cycle', 'combustion_cycle', 'unknown_species'];
    const selection = forcedMode || mode;
    const subMode =
      selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    if (selection !== 'random') {
      setMode(selection);
    }

    const eligible =
      subMode === 'formation_cycle'
        ? HESS_REACTIONS.filter((r) => r.type === 'formation')
        : subMode === 'combustion_cycle'
        ? HESS_REACTIONS.filter((r) => r.type === 'combustion')
        : HESS_REACTIONS;

    const nonRepeat =
      problem && eligible.length > 1 ? eligible.filter((r) => r.id !== problem.id) : eligible;
    const picked = nonRepeat[Math.floor(Math.random() * nonRepeat.length)];

    const applyJitter = (val, isElement) => {
      if (isElement || val === 0) return 0;
      return val + (Math.floor(Math.random() * 7) - 3);
    };

    const reactants = picked.reactants.map((sp) => ({
      ...sp,
      val: applyJitter(sp.baseVal, sp.isElement),
    }));
    const products = picked.products.map((sp) => ({
      ...sp,
      val: applyJitter(sp.baseVal, sp.isElement),
    }));

    const reactantSum = reactants.reduce((acc, s) => acc + s.coeff * s.val, 0);
    const productSum = products.reduce((acc, s) => acc + s.coeff * s.val, 0);

    // ΔH_r calculation depends on cycle arrow direction
    const deltaH_r =
      picked.type === 'formation' ? productSum - reactantSum : reactantSum - productSum;

    let unknownMeta = null;
    let knownLeftSum = reactantSum;
    let knownRightSum = productSum;
    let correctAnswer = deltaH_r;

    if (subMode === 'unknown_species') {
      const sideList = picked.unknownTarget.side === 'product' ? products : reactants;
      const targetSp = sideList[picked.unknownTarget.index];
      correctAnswer = targetSp.val;
      if (picked.unknownTarget.side === 'product') {
        knownRightSum = productSum - targetSp.coeff * targetSp.val;
      } else {
        knownLeftSum = reactantSum - targetSp.coeff * targetSp.val;
      }
      unknownMeta = {
        side: picked.unknownTarget.side,
        index: picked.unknownTarget.index,
        label: targetSp.label,
        coeff: targetSp.coeff,
      };
    }

    setProblem({
      ...picked,
      subMode,
      reactants,
      products,
      reactantSum,
      productSum,
      knownLeftSum,
      knownRightSum,
      deltaH_r,
      unknownMeta,
      correctAnswer,
    });
    setGateFormula('');
    setGateLeftSum('');
    setGateRightSum('');
    setGateVerified(false);
    setGateFeedback(null);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  useEffect(() => {
    generateProblem('formation_cycle');
  }, []);

  const handleVerifyGate = () => {
    if (!problem) return;
    const expectedFormula = problem.type === 'formation' ? 'prod_minus_react' : 'react_minus_prod';
    const uLeft = parseFloat(gateLeftSum);
    const uRight = parseFloat(gateRightSum);
    const targetLeft = problem.subMode === 'unknown_species' ? problem.knownLeftSum : problem.reactantSum;
    const targetRight = problem.subMode === 'unknown_species' ? problem.knownRightSum : problem.productSum;

    const errs = [];
    if (gateFormula !== expectedFormula) {
      errs.push(
        problem.type === 'formation'
          ? 'In a Formation cycle, arrows point UP from elements → ΔH_r = ΣΔH_f°(products) − ΣΔH_f°(reactants).'
          : 'In a Combustion cycle, arrows point DOWN to combustion oxides → ΔH_r = ΣΔH_c°(reactants) − ΣΔH_c°(products).'
      );
    }
    if (isNaN(uLeft) || Math.abs(uLeft - targetLeft) > 1.5) {
      errs.push('Re-check the Reactant route sum (multiply each ΔH° by its balancing coefficient; elements in standard states have ΔH_f° = 0).');
    }
    if (isNaN(uRight) || Math.abs(uRight - targetRight) > 1.5) {
      errs.push('Re-check the Product route sum (multiply each ΔH° by its balancing coefficient; check for any ΔH° = 0 elements).');
    }

    if (errs.length === 0) {
      setGateVerified(true);
      setGateFeedback({
        isCorrect: true,
        msg: '✅ Hess Route & Stoichiometry Verified! Step 2 calculation is unlocked.',
      });
    } else {
      setGateFeedback({
        isCorrect: false,
        msg: `⚠️ ${errs.join(' ')}`,
      });
    }
  };

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!problem) return;
    if (feedback?.isCorrect) {
      generateProblem(mode);
      return;
    }

    const val = parseFloat(userAnswer);
    if (isNaN(val)) return;

    const expected = problem.correctAnswer;
    const reversedSignGuess =
      problem.subMode !== 'unknown_species'
        ? -expected
        : problem.type === 'formation'
        ? problem.reactantSum - problem.productSum
        : problem.productSum - problem.reactantSum;

    if (Math.abs(val - expected) <= 1.5) {
      const symbol =
        problem.subMode === 'unknown_species'
          ? `ΔH_${problem.type === 'formation' ? 'f' : 'c'}°(${problem.unknownMeta.label})`
          : 'ΔH_r°';
      setFeedback({
        isCorrect: true,
        msg: `Correct! ${symbol} = ${expected > 0 ? `+${expected}` : expected} kJ mol⁻¹.`,
      });
      onComplete?.(`hess_${problem.id}_${problem.subMode}`);
    } else if (problem.subMode !== 'unknown_species' && Math.abs(val - reversedSignGuess) <= 1.5) {
      setFeedback({
        isCorrect: false,
        msg:
          problem.type === 'formation'
            ? 'WJEC Route Reversal Trap! For ΔH_f° cycles, arrows point UP from elements: subtract reactants from products, ΔH_r = ΣΔH_f°(products) − ΣΔH_f°(reactants).'
            : 'WJEC Route Reversal Trap! For ΔH_c° cycles, arrows point DOWN to oxides: subtract products from reactants, ΔH_r = ΣΔH_c°(reactants) − ΣΔH_c°(products).',
      });
    } else if (
      problem.subMode === 'unknown_species' &&
      problem.unknownMeta.coeff > 1 &&
      Math.abs(val - expected * problem.unknownMeta.coeff) <= 3
    ) {
      setFeedback({
        isCorrect: false,
        msg: `WJEC Stoichiometry Trap! The equation contains ${problem.unknownMeta.coeff} mol of ${problem.unknownMeta.label} — divide by ${problem.unknownMeta.coeff} to report the molar value per 1 mole.`,
      });
    } else {
      setFeedback({
        isCorrect: false,
        msg: 'Incorrect calculation. Follow the Hess cycle clockwise and anticlockwise paths between Reactants and Products, multiplying each data value by its equation coefficient.',
      });
    }
  };

  if (!problem) return null;

  const isFormation = problem.type === 'formation';
  const sym = isFormation ? 'ΔH_f°' : 'ΔH_c°';
  const isStep2Locked = gateEnabled && !gateVerified;

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="w-full max-w-md mx-auto px-4">
        <span className="block text-[10px] font-black tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Hess Cycle Mode
        </span>
        <div className="flex items-center gap-2">
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => {
              setMode(e.target.value);
              generateProblem(e.target.value);
            }}
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] shadow-sm cursor-pointer"
          >
            <option value="formation_cycle">Enthalpies of Formation (ΔH_f° Cycle)</option>
            <option value="combustion_cycle">Enthalpies of Combustion (ΔH_c° Cycle)</option>
            <option value="unknown_species">Unknown Species ΔH° from ΔH_r</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setMode('random');
              generateProblem('random');
            }}
            className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all shrink-0 cursor-pointer ${
              mode === 'random'
                ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header !mb-0">{problem.title}</div>

      <div className="applet-workbench">
        {/* Left Sticky Workbench Column: Hess Triangle SVG + Thermodynamic Data Table */}
        <div className="applet-workbench-sticky space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                WJEC Unit 2.1 • {isFormation ? 'Formation Cycle (Arrows UP)' : 'Combustion Cycle (Arrows DOWN)'}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">kJ mol⁻¹</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center font-mono font-black text-xs sm:text-sm text-slate-800">
              {problem.equation}
            </div>

            {/* Hess Triangle SVG */}
            <svg viewBox="0 0 360 195" className="w-full h-auto select-none bg-slate-50/50 rounded-xl border border-slate-100">
              <defs>
                <marker id="hess-arrow-blue" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#235478" />
                </marker>
                <marker id="hess-arrow-amber" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#d97706" />
                </marker>
              </defs>

              {/* Top boxes: Reactants & Products */}
              <rect x="14" y="16" width="134" height="36" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="81" y="38" textAnchor="middle" className="text-[10px] font-mono font-black fill-slate-800">
                Reactants
              </text>

              <rect x="212" y="16" width="134" height="36" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="279" y="38" textAnchor="middle" className="text-[10px] font-mono font-black fill-slate-800">
                Products
              </text>

              {/* Top horizontal arrow ΔH_r */}
              <line x1="152" y1="34" x2="205" y2="34" stroke="#235478" strokeWidth="2.4" markerEnd="url(#hess-arrow-blue)" />
              <text x="178" y="23" textAnchor="middle" className="text-[10px] font-mono font-black fill-[#235478]">
                {problem.subMode === 'unknown_species'
                  ? `ΔH_r = ${problem.deltaH_r > 0 ? '+' : ''}${problem.deltaH_r}`
                  : 'ΔH_r = ?'}
              </text>

              {/* Bottom Intermediate Box */}
              <rect x="64" y="142" width="232" height="36" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
              <text x="180" y="157" textAnchor="middle" className="text-[8.5px] font-sans font-bold fill-slate-500">
                {isFormation ? 'Elements in Standard States' : 'Combustion Oxides (CO₂ + H₂O)'}
              </text>
              <text x="180" y="170" textAnchor="middle" className="text-[9.5px] font-mono font-black fill-[#235478]">
                {problem.bottomBox}
              </text>

              {/* Left diagonal arrow */}
              {isFormation ? (
                <line x1="128" y1="140" x2="88" y2="57" stroke="#d97706" strokeWidth="2.2" markerEnd="url(#hess-arrow-amber)" />
              ) : (
                <line x1="85" y1="54" x2="125" y2="137" stroke="#d97706" strokeWidth="2.2" markerEnd="url(#hess-arrow-amber)" />
              )}
              <text x="82" y="102" textAnchor="end" className="text-[9.5px] font-mono font-black fill-amber-700">
                Σ{sym}(React)
              </text>

              {/* Right diagonal arrow */}
              {isFormation ? (
                <line x1="232" y1="140" x2="272" y2="57" stroke="#d97706" strokeWidth="2.2" markerEnd="url(#hess-arrow-amber)" />
              ) : (
                <line x1="275" y1="54" x2="235" y2="137" stroke="#d97706" strokeWidth="2.2" markerEnd="url(#hess-arrow-amber)" />
              )}
              <text x="278" y="102" textAnchor="start" className="text-[9.5px] font-mono font-black fill-amber-700">
                Σ{sym}(Prod)
              </text>
            </svg>

            {/* Thermodynamic Data Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 tracking-wider">
                <span>Standard Enthalpy Data ({sym})</span>
                <span>{isFormation ? 'Elements in std. states = 0' : 'kJ mol⁻¹'}</span>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                {[...problem.reactants.map((r, i) => ({ ...r, side: 'reactant', idx: i })), ...problem.products.map((p, i) => ({ ...p, side: 'product', idx: i }))]
                  .filter((sp) => !sp.isElement)
                  .map((sp) => {
                    const isMasked =
                      problem.unknownMeta &&
                      problem.unknownMeta.side === sp.side &&
                      problem.unknownMeta.index === sp.idx;
                    return (
                      <div key={`${sp.side}-${sp.label}`} className="flex items-center justify-between px-3 py-2 font-mono">
                        <span className="font-bold text-slate-800">{sym}({sp.label})</span>
                        <span className={`font-black ${isMasked ? 'text-rose-600' : 'text-[#326fa0]'}`}>
                          {isMasked ? '?' : `${sp.val > 0 ? '+' : ''}${sp.val} kJ mol⁻¹`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Workbench Column: Hint + Step 1 Route Gate + Step 2 Answer */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black text-slate-700">
              {problem.subMode === 'unknown_species'
                ? `Calculate ${sym}(${problem.unknownMeta.label}) in kJ mol⁻¹.`
                : 'Calculate the overall enthalpy change (ΔH_r°) in kJ mol⁻¹.'}
            </span>
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
            >
              💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>
          </div>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
              <strong className="font-black text-amber-900">Hess’s Law Cycle Rule: </strong>
              {isFormation
                ? 'Formation arrows point UP from elements to compounds, so ΔH_r° = ΣΔH_f°(products) − ΣΔH_f°(reactants). Unlisted elements in their standard states (e.g. Fe(s), O₂(g), H₂(g), N₂(g)) always have ΔH_f° = 0.'
                : 'Combustion arrows point DOWN from reactants and products to CO₂/H₂O, so ΔH_r° = ΣΔH_c°(reactants) − ΣΔH_c°(products). Always multiply each molar enthalpy by its stoichiometric coefficient.'}
            </div>
          )}

          {/* Step 1 Route & Sign Gate */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-400">
                  Step 1: Cycle Direction &amp; Stoichiometry Gate
                </span>
                <h4 className="text-xs font-black text-slate-800 mt-0.5">
                  Confirm Hess Formula &amp; Route Totals
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setGateEnabled(!gateEnabled)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shrink-0 cursor-pointer"
              >
                {gateEnabled ? 'Skip Gate' : 'Enable Gate'}
              </button>
            </div>

            {gateEnabled && (
              <div className="space-y-3">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Select valid Hess equation for this cycle:
                  </label>
                  <select
                    value={gateFormula}
                    disabled={gateVerified}
                    onChange={(e) => setGateFormula(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="">-- Choose Hess Route Equation --</option>
                    <option value="prod_minus_react">ΔH_r° = Σ(Products) − Σ(Reactants)</option>
                    <option value="react_minus_prod">ΔH_r° = Σ(Reactants) − Σ(Products)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {problem.subMode === 'unknown_species' && problem.unknownMeta.side === 'reactant'
                        ? `Known Reactant Sum (excl. ${problem.unknownMeta.label}):`
                        : 'Σ(Reactant Route) in kJ mol⁻¹:'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={gateVerified}
                      value={gateLeftSum}
                      onChange={(e) => setGateLeftSum(e.target.value)}
                      placeholder="e.g. -190"
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      {problem.subMode === 'unknown_species' && problem.unknownMeta.side === 'product'
                        ? `Known Product Sum (excl. ${problem.unknownMeta.label}):`
                        : 'Σ(Product Route) in kJ mol⁻¹:'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={gateVerified}
                      value={gateRightSum}
                      onChange={(e) => setGateRightSum(e.target.value)}
                      placeholder="e.g. -278"
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyGate}
                  disabled={gateVerified}
                  className="w-full py-2 bg-[#326fa0] hover:bg-[#255580] disabled:bg-emerald-600 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                >
                  {gateVerified ? 'Step 1 Verified ✓' : 'Verify Hess Route & Sums'}
                </button>

                {gateFeedback && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold ${
                    gateFeedback.isCorrect
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {gateFeedback.msg}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2 Calculation */}
          <form
            onSubmit={handleCheckAnswer}
            className={`bg-white border border-slate-200 rounded-2xl p-4 space-y-4 transition-opacity ${
              isStep2Locked ? 'opacity-50 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                Step 2: Final Enthalpy Value
              </span>
              <h4 className="text-sm font-black text-slate-800 mt-0.5">
                {problem.subMode === 'unknown_species'
                  ? `Solve for 1 mole of ${problem.unknownMeta.label}`
                  : 'Solve for ΔH_r°'}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm text-slate-700">
                {problem.subMode === 'unknown_species' ? `${sym} =` : 'ΔH_r° ='}
              </span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                onWheel={(e) => e.currentTarget.blur()}
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setFeedback(null);
                }}
                placeholder="e.g. -88"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:border-[#326fa0]"
              />
              <span className="font-mono font-bold text-xs text-slate-500">kJ mol⁻¹</span>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={isStep2Locked}>
                Check Answer
              </button>
              <button
                type="button"
                onClick={() => generateProblem(mode)}
                className="btn btn-secondary"
              >
                Next Cycle &rarr;
              </button>
            </div>
          </form>

          {feedback && (
            <div className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
              feedback.isCorrect ? 'feedback-success' : 'feedback-error'
            }`}>
              <span>{feedback.isCorrect ? '✅ ' : '❌ '}{feedback.msg}</span>
              {feedback.isCorrect && (
                <button
                  type="button"
                  onClick={() => generateProblem(mode)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Next Cycle &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
