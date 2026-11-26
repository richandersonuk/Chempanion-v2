import React, { useState, useMemo } from 'react';
import { BORN_HABER_SYSTEMS } from '../../data/questions/bornHaberQuestions';

const TARGET_OPTIONS = [
  { id: 'dH_latt', label: 'Lattice Enthalpy (ΔH_latt)', promptSym: 'ΔH_latt' },
  { id: 'dH_f', label: 'Enthalpy of Formation (ΔH_f)', promptSym: 'ΔH_f' },
  { id: 'dH_at_metal', label: 'Metal Atomisation (ΔH_at M)', promptSym: 'ΔH_at(M)' },
  { id: 'dH_at_nonmetal', label: 'Non-Metal Atomisation (ΔH_at X)', promptSym: 'ΔH_at(X)' },
  { id: 'ie1_metal', label: 'First Ionisation Energy (IE₁)', promptSym: 'IE₁' },
  { id: 'ea1_nonmetal', label: 'First Electron Affinity (EA₁)', promptSym: 'EA₁' }
];

function createJitterProfile() {
  const randDelta = (n) => Math.floor(Math.random() * (n * 2 + 1)) - n;
  return {
    atM: randDelta(4),
    ie1: randDelta(5),
    latt: randDelta(5),
    hydC: randDelta(4)
  };
}

export default function BornHaberCycle({ onComplete }) {
  const [mode, setMode] = useState('born_haber'); // 'born_haber' | 'enthalpy_solution'
  const [sysIdx, setSysIdx] = useState(0);
  const [targetType, setTargetType] = useState('dH_latt');
  const [jitter, setJitter] = useState(() => createJitterProfile());

  // Step 1 Stoichiometry & Sign Gate
  const [gateAtomMult, setGateAtomMult] = useState('1');
  const [gateEAMult, setGateEAMult] = useState('1');
  const [gateLattSign, setGateLattSign] = useState('negative');
  const [gateVerified, setGateVerified] = useState(false);
  const [gateFeedback, setGateFeedback] = useState(null);

  // Step 2 Calculation
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const system = useMemo(() => {
    const base = BORN_HABER_SYSTEMS[sysIdx];
    const dH_at_metal = base.dH_at_metal + jitter.atM;
    const ie1_metal = base.ie1_metal + jitter.ie1;
    const dH_latt = base.dH_latt + jitter.latt;
    const dH_hyd_cation = base.dH_hyd_cation + jitter.hydC;
    const sumGaseous =
      dH_at_metal +
      ie1_metal +
      base.ie2_metal +
      base.anionCount * base.dH_at_nonmetal +
      base.anionCount * (base.ea1_nonmetal + base.ea2_nonmetal);
    const dH_f = sumGaseous + dH_latt;
    const dH_sol = -dH_latt + dH_hyd_cation + base.anionCount * base.dH_hyd_anion;
    return {
      ...base,
      dH_at_metal,
      ie1_metal,
      dH_latt,
      dH_hyd_cation,
      dH_f,
      dH_sol
    };
  }, [sysIdx, jitter]);

  const resetProblem = (nextIdx = sysIdx, nextMode = mode, nextTarget = targetType, withNewJitter = true) => {
    setSysIdx(nextIdx);
    setMode(nextMode);
    setTargetType(nextTarget);
    if (withNewJitter) setJitter(createJitterProfile());
    setGateAtomMult('1');
    setGateEAMult('1');
    setGateLattSign('negative');
    setGateVerified(false);
    setGateFeedback(null);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  const handleRandomUnknown = () => {
    const nextIdx = Math.floor(Math.random() * BORN_HABER_SYSTEMS.length);
    const nextTarget =
      mode === 'born_haber'
        ? TARGET_OPTIONS[Math.floor(Math.random() * TARGET_OPTIONS.length)].id
        : targetType;
    resetProblem(nextIdx, mode, nextTarget, true);
  };

  const getExpectedBornHaberValue = (tType = targetType) => {
    switch (tType) {
      case 'dH_f': return system.dH_f;
      case 'dH_at_metal': return system.dH_at_metal;
      case 'dH_at_nonmetal': return system.dH_at_nonmetal;
      case 'ie1_metal': return system.ie1_metal;
      case 'ea1_nonmetal': return system.ea1_nonmetal;
      case 'dH_latt':
      default:
        return system.dH_latt;
    }
  };

  const handleVerifyGate = () => {
    const expectedMult = String(system.anionCount);
    const multOk = gateAtomMult === expectedMult && gateEAMult === expectedMult;
    const signOk = gateLattSign === 'negative';

    if (multOk && signOk) {
      setGateVerified(true);
      setGateFeedback({
        isCorrect: true,
        msg: `✅ Stoichiometry & Sign Gate Verified! ${
          system.anionCount === 2
            ? `Because 1 mol of ${system.formula} contains 2 mol of halide ions, both ΔH_at(${system.nonMetalSymbol}) and EA₁(${system.nonMetalSymbol}) are multiplied by 2.`
            : `1:1 stoichiometry confirmed.`
        } Step 2 calculation is unlocked.`
      });
    } else {
      const errs = [];
      if (!multOk) {
        errs.push(
          `Check the formula ${system.formula}: there ${system.anionCount === 2 ? 'are 2 moles' : 'is 1 mole'} of ${system.nonMetalSymbol} atoms/ions per mole of lattice.`
        );
      }
      if (!signOk) {
        errs.push(
          'WJEC Convention: Lattice enthalpy of formation (gaseous ions → solid lattice) is always EXOTHERMIC (negative).'
        );
      }
      setGateFeedback({
        isCorrect: false,
        msg: `⚠️ ${errs.join(' ')}`
      });
    }
  };

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (feedback?.isCorrect) {
      resetProblem((sysIdx + 1) % BORN_HABER_SYSTEMS.length, mode, targetType, true);
      return;
    }
    const val = parseFloat(userAnswer);
    if (isNaN(val)) return;

    if (mode === 'born_haber') {
      const expected = getExpectedBornHaberValue(targetType);
      const diff = Math.abs(val - expected);
      const targetMeta = TARGET_OPTIONS.find((t) => t.id === targetType) || TARGET_OPTIONS[0];

      if (diff <= 2) {
        setFeedback({
          isCorrect: true,
          msg: `Correct! ${targetMeta.promptSym} = ${expected} kJ mol⁻¹. ${system.examinerTrap}`
        });
        onComplete?.(`bh_${system.id}_${targetType}`);
      } else if (Math.abs(val + expected) <= 2) {
        setFeedback({
          isCorrect: false,
          msg: `WJEC Sign Reversal Trap! Your magnitude is right, but the sign is reversed. Check whether the target arrow goes up (endothermic, +) or down (exothermic, −).`
        });
      } else if (
        system.anionCount === 2 &&
        (targetType === 'dH_at_nonmetal' || targetType === 'ea1_nonmetal') &&
        Math.abs(val - expected * 2) <= 4
      ) {
        setFeedback({
          isCorrect: false,
          msg: `WJEC Multiplier Trap! The cycle includes 2 × ${targetMeta.promptSym} for ${system.formula} — divide by 2 to give the molar value per 1 mol of ${system.nonMetalSymbol}.`
        });
      } else {
        // Check if student forgot x2 for Group 2 halide when solving dH_latt or dH_f
        const unscaledSum =
          system.dH_at_metal +
          system.ie1_metal +
          system.ie2_metal +
          system.dH_at_nonmetal +
          system.ea1_nonmetal +
          system.ea2_nonmetal;
        const unscaledLatt = system.dH_f - unscaledSum;
        if (system.anionCount === 2 && (targetType === 'dH_latt' || targetType === 'dH_f') && Math.abs(val - unscaledLatt) <= 5) {
          setFeedback({
            isCorrect: false,
            msg: `WJEC Multiplier Trap! Check your stoichiometry: 1 mol of ${system.formula} requires ×2 for both ΔH_at(${system.nonMetalSymbol}) and EA₁(${system.nonMetalSymbol}).`
          });
        } else {
          setFeedback({
            isCorrect: false,
            msg: `Incorrect. Apply Hess's Law carefully: sum all upward atomisation/ionisation steps + electron affinities + lattice enthalpy = ΔH_f, keeping any ×2 stoichiometry multipliers.`
          });
        }
      }
    } else {
      // mode === 'enthalpy_solution'
      const expected = system.dH_sol;
      if (Math.abs(val - expected) <= 2) {
        setFeedback({
          isCorrect: true,
          msg: `Correct! ΔH_sol(${system.formula}) = −(${system.dH_latt}) + (${system.dH_hyd_cation}) + ${system.anionCount}×(${system.dH_hyd_anion}) = ${expected > 0 ? `+${expected}` : expected} kJ mol⁻¹.`
        });
        onComplete?.(`sol_${system.id}`);
      } else {
        setFeedback({
          isCorrect: false,
          msg: `Incorrect. Check the sign of lattice dissociation (−ΔH_latt becomes positive) and remember to multiply ΔH_hyd(anion) by the anion stoichiometry in ${system.formula}.`
        });
      }
    }
  };

  const currentTargetMeta = TARGET_OPTIONS.find((t) => t.id === targetType) || TARGET_OPTIONS[0];

  return (
    <div className="applet-container space-y-6" style={{ textTransform: 'none' }}>
      {/* Header & Mode Switcher */}
      <div className="applet-header !mb-0">
        Born-Haber &amp; Solution Enthalpy Cycle Builder
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => resetProblem(sysIdx, 'born_haber', targetType)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              mode === 'born_haber'
                ? 'bg-[#326fa0] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Born-Haber Cycle
          </button>
          <button
            type="button"
            onClick={() => resetProblem(sysIdx, 'enthalpy_solution', targetType)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              mode === 'enthalpy_solution'
                ? 'bg-[#326fa0] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Enthalpy of Solution (ΔH_sol)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowHint((prev) => !prev)}
          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
        >
          💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      </div>

      {showHint && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed">
          {mode === 'born_haber' ? (
            <>
              <strong className="font-black text-amber-900">Cycle Method: </strong>
              Follow the alternative Hess&apos;s Law path from elements to lattice: ΔH_f = ΔH_at(metal) + IE₁(+IE₂ if Group 2) + n·ΔH_at(non-metal) + n·EA₁(+EA₂ if O²⁻) + ΔH_latt. Check the stoichiometry multiplier <em>n</em> matches {system.formula}.
            </>
          ) : (
            <>
              <strong className="font-black text-amber-900">Solution Cycle Method: </strong>
              ΔH_sol = (−ΔH_latt of formation) + ΔH_hyd(cation) + n·ΔH_hyd(anion). Reverse the exothermic lattice formation sign first (making lattice dissociation positive), then add the hydration enthalpies scaled by ion stoichiometry.
            </>
          )}
        </div>
      )}

      {/* Crystal System Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-500 tracking-wider mr-1">Ionic Lattice:</span>
          {BORN_HABER_SYSTEMS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => resetProblem(idx, mode, targetType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                sysIdx === idx
                  ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s.formula}
            </button>
          ))}
        </div>

        {mode === 'born_haber' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-400">Solve for:</span>
              <select
                value={targetType}
                onChange={(e) => resetProblem(sysIdx, mode, e.target.value, false)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700"
              >
                {TARGET_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleRandomUnknown}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
            >
              🎲 Random Unknown
            </button>
          </div>
        )}
      </div>

      {mode === 'born_haber' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Interactive Energy Level Diagram SVG */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="text-[10px] font-black tracking-widest text-slate-400">
                Born-Haber Energy Cycle: {system.name}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#326fa0]">kJ mol⁻¹</span>
            </div>

            <svg viewBox="0 0 360 260" className="w-full h-auto select-none">
              {/* Peak Gaseous Atoms + Electrons Level */}
              <line x1="120" y1="30" x2="250" y2="30" stroke="#1e293b" strokeWidth="2.5" />
              <text x="185" y="22" textAnchor="middle" className="text-[9px] font-mono font-black fill-slate-800">
                {system.cationLabel} + {system.anionCount}{system.nonMetalSymbol}(g) + e⁻
              </text>

              {/* Gaseous Ions Level (after EA) */}
              <line x1="210" y1="78" x2="340" y2="78" stroke="#0284c7" strokeWidth="2.5" />
              <text x="275" y="70" textAnchor="middle" className="text-[9px] font-mono font-black fill-sky-700">
                {system.cationLabel} + {system.anionLabel}
              </text>

              {/* Elements in Standard States Level (0 reference) */}
              <line x1="15" y1="165" x2="155" y2="165" stroke="#334155" strokeWidth="2.5" />
              <text x="85" y="157" textAnchor="middle" className="text-[9px] font-mono font-black fill-slate-800">
                {system.elementsEquation}
              </text>

              {/* Ionic Solid Lattice Level (Bottom) */}
              <line x1="90" y1="235" x2="290" y2="235" stroke="#059669" strokeWidth="3" />
              <text x="190" y="250" textAnchor="middle" className="text-[10px] font-mono font-black fill-emerald-800">
                {system.formula}(s) [Ionic Crystal Lattice]
              </text>

              {/* Upward Arrow: Atomisation + Ionisation */}
              <line x1="135" y1="165" x2="135" y2="34" stroke="#f59e0b" strokeWidth="2" />
              <polygon points="135,30 131,38 139,38" fill="#f59e0b" />
              <text x="128" y="100" textAnchor="end" className="text-[8.5px] font-mono font-bold fill-amber-700">
                Σ(ΔH_at + IE)
              </text>

              {/* Arrow from Atoms to Gaseous Ions (EA) */}
              <line x1="230" y1="30" x2="230" y2="74" stroke="#6366f1" strokeWidth="2" />
              <polygon points="230,78 226,70 234,70" fill="#6366f1" />
              <text x="236" y="56" textAnchor="start" className="text-[8.5px] font-mono font-bold fill-indigo-700">
                {system.anionCount > 1 ? `${system.anionCount}×EA` : 'EA'}
              </text>

              {/* Downward Arrow: ΔH_f */}
              <line x1="105" y1="165" x2="105" y2="231" stroke="#e11d48" strokeWidth="2" />
              <polygon points="105,235 101,227 109,227" fill="#e11d48" />
              <text x="98" y="203" textAnchor="end" className="text-[9px] font-mono font-black fill-rose-700">
                ΔH_f = {targetType === 'dH_f' ? '?' : system.dH_f}
              </text>

              {/* Downward Arrow: ΔH_latt (Gaseous Ions -> Solid Lattice) */}
              <line x1="265" y1="78" x2="265" y2="231" stroke="#059669" strokeWidth="2.5" />
              <polygon points="265,235 261,227 269,227" fill="#059669" />
              <text x="272" y="160" textAnchor="start" className="text-[9px] font-mono font-black fill-emerald-700">
                ΔH_latt = {targetType === 'dH_latt' ? '?' : system.dH_latt}
              </text>
            </svg>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
              <div className="font-black text-slate-700 text-[10px] tracking-wider mb-1">
                Provided Thermodynamic Data (kJ mol⁻¹)
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
                <div>ΔH_f({system.formula}) = <strong className={targetType === 'dH_f' ? 'text-rose-600' : ''}>{targetType === 'dH_f' ? '?' : system.dH_f}</strong></div>
                <div>ΔH_latt({system.formula}) = <strong className={targetType === 'dH_latt' ? 'text-rose-600' : ''}>{targetType === 'dH_latt' ? '?' : system.dH_latt}</strong></div>
                <div>ΔH_at({system.metalSymbol}) = <strong className={targetType === 'dH_at_metal' ? 'text-rose-600' : ''}>{targetType === 'dH_at_metal' ? '?' : `+${system.dH_at_metal}`}</strong></div>
                <div>ΔH_at({system.nonMetalSymbol}) = <strong className={targetType === 'dH_at_nonmetal' ? 'text-rose-600' : ''}>{targetType === 'dH_at_nonmetal' ? '?' : `+${system.dH_at_nonmetal}`}</strong></div>
                <div>IE₁({system.metalSymbol}) = <strong className={targetType === 'ie1_metal' ? 'text-rose-600' : ''}>{targetType === 'ie1_metal' ? '?' : `+${system.ie1_metal}`}</strong></div>
                {system.ie2_metal > 0 && (
                  <div>IE₂({system.metalSymbol}) = <strong>+{system.ie2_metal}</strong></div>
                )}
                <div>EA₁({system.nonMetalSymbol}) = <strong className={targetType === 'ea1_nonmetal' ? 'text-rose-600' : ''}>{targetType === 'ea1_nonmetal' ? '?' : system.ea1_nonmetal}</strong></div>
                {system.ea2_nonmetal !== 0 && (
                  <div>EA₂({system.nonMetalSymbol}) = <strong>+{system.ea2_nonmetal}</strong></div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Step 1 Stoichiometry Gate & Step 2 Calculation */}
          <div className="lg:col-span-6 space-y-4">
            {/* Step 1 Gate */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-400">
                  Step 1: WJEC Stoichiometry &amp; Sign Gate
                </span>
                <h3 className="text-xs font-black text-slate-800 mt-1">
                  Check Multipliers for {system.formula} Before Calculating
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Multiplier for ΔH_at({system.nonMetalSymbol}):
                  </label>
                  <select
                    value={gateAtomMult}
                    disabled={gateVerified}
                    onChange={(e) => setGateAtomMult(e.target.value)}
                    className="w-full font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5"
                  >
                    <option value="1">× 1</option>
                    <option value="2">× 2</option>
                  </select>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Multiplier for EA({system.nonMetalSymbol}):
                  </label>
                  <select
                    value={gateEAMult}
                    disabled={gateVerified}
                    onChange={(e) => setGateEAMult(e.target.value)}
                    className="w-full font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5"
                  >
                    <option value="1">× 1</option>
                    <option value="2">× 2</option>
                  </select>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Sign of ΔH_latt (formation):
                  </label>
                  <select
                    value={gateLattSign}
                    disabled={gateVerified}
                    onChange={(e) => setGateLattSign(e.target.value)}
                    className="w-full font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5"
                  >
                    <option value="negative">Negative (−)</option>
                    <option value="positive">Positive (+)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyGate}
                disabled={gateVerified}
                className="w-full py-2 bg-[#326fa0] hover:bg-[#255580] disabled:bg-emerald-600 text-white text-xs font-black tracking-wider rounded-xl transition-colors"
              >
                {gateVerified ? 'Step 1 Verified ✓' : 'Verify Stoichiometry & Sign Rules'}
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

            {/* Step 2 Final Calculation */}
            <form
              onSubmit={handleCheckAnswer}
              className={`bg-white border border-slate-200 rounded-2xl p-4 space-y-4 transition-opacity ${
                !gateVerified ? 'opacity-50 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                  Step 2: Apply Hess&apos;s Law
                </span>
                <h3 className="text-sm font-black text-slate-800 mt-0.5">
                  Calculate {currentTargetMeta.label} for {system.formula}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-slate-700">
                  {currentTargetMeta.promptSym} =
                </span>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  onWheel={(e) => e.currentTarget.blur()}
                  value={userAnswer}
                  onChange={(e) => { setUserAnswer(e.target.value); setFeedback(null); }}
                  placeholder="e.g. -2526"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:border-[#326fa0]"
                />
                <span className="font-mono font-bold text-xs text-slate-500">kJ mol⁻¹</span>
              </div>

              <div className="button-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Check Calculation
                </button>
                <button
                  type="button"
                  onClick={() => resetProblem((sysIdx + 1) % BORN_HABER_SYSTEMS.length, mode, targetType)}
                  className="btn btn-secondary"
                >
                  Next Crystal &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* MODE 2: ENTHALPY OF SOLUTION */
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
              Enthalpy of Solution & Hydration Cycle
            </span>
            <h3 className="text-base font-black text-slate-800 mt-0.5">
              Calculate ΔH_sol for {system.name} ({system.formula})
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Use the lattice enthalpy of formation and the enthalpies of hydration of the gaseous ions. Remember to multiply the anion hydration enthalpy by {system.anionCount} for {system.formula}!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <span className="block text-[10px] text-slate-500">ΔH_latt({system.formula})</span>
              <strong className="text-sm text-slate-800">{system.dH_latt} kJ mol⁻¹</strong>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <span className="block text-[10px] text-slate-500">ΔH_hyd({system.cationLabel})</span>
              <strong className="text-sm text-slate-800">{system.dH_hyd_cation} kJ mol⁻¹</strong>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
              <span className="block text-[10px] text-slate-500">ΔH_hyd(1 mol of {system.nonMetalSymbol}⁻)</span>
              <strong className="text-sm text-slate-800">{system.dH_hyd_anion} kJ mol⁻¹</strong>
            </div>
          </div>

          <form onSubmit={handleCheckAnswer} className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <label className="font-mono font-black text-sm text-slate-700">
                ΔH_sol({system.formula}) =
              </label>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                onWheel={(e) => e.currentTarget.blur()}
                value={userAnswer}
                onChange={(e) => { setUserAnswer(e.target.value); setFeedback(null); }}
                placeholder="e.g. -155 or +4"
                className="w-40 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:border-[#326fa0]"
              />
              <span className="font-mono font-bold text-xs text-slate-500">kJ mol⁻¹</span>
            </div>
            <div className="button-group">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Verify ΔH_sol
              </button>
              <button
                type="button"
                onClick={() => resetProblem((sysIdx + 1) % BORN_HABER_SYSTEMS.length, mode, targetType)}
                className="btn btn-secondary"
              >
                Next Crystal &rarr;
              </button>
            </div>
          </form>
        </div>
      )}

      {feedback && (
        <div className={`feedback-box flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
          feedback.isCorrect ? 'feedback-success' : 'feedback-error'
        }`}>
          <span>
            {feedback.isCorrect ? '✅ ' : '❌ '}
            {feedback.msg}
          </span>
          {feedback.isCorrect && (
            <button
              type="button"
              onClick={() => resetProblem((sysIdx + 1) % BORN_HABER_SYSTEMS.length, mode, targetType)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Next Crystal &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
