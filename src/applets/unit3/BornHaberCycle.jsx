import React, { useState } from 'react';
import { BORN_HABER_SYSTEMS } from '../../data/questions/bornHaberQuestions';

export default function BornHaberCycle({ onComplete }) {
  const [mode, setMode] = useState('born_haber'); // 'born_haber' | 'enthalpy_solution'
  const [sysIdx, setSysIdx] = useState(0);
  const [targetType, setTargetType] = useState('dH_latt'); // 'dH_latt' | 'dH_f'

  // Step 1 Stoichiometry & Sign Gate
  const [gateAtomMult, setGateAtomMult] = useState('1');
  const [gateEAMult, setGateEAMult] = useState('1');
  const [gateLattSign, setGateLattSign] = useState('negative');
  const [gateVerified, setGateVerified] = useState(false);
  const [gateFeedback, setGateFeedback] = useState(null);

  // Step 2 Calculation
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const system = BORN_HABER_SYSTEMS[sysIdx];

  const resetProblem = (nextIdx = sysIdx, nextMode = mode, nextTarget = targetType) => {
    setSysIdx(nextIdx);
    setMode(nextMode);
    setTargetType(nextTarget);
    setGateAtomMult('1');
    setGateEAMult('1');
    setGateLattSign('negative');
    setGateVerified(false);
    setGateFeedback(null);
    setUserAnswer('');
    setFeedback(null);
  };

  // Calculate total gaseous ion enthalpy relative to elements in standard states
  const sumToGaseousIons =
    system.dH_at_metal +
    system.ie1_metal +
    system.ie2_metal +
    system.anionCount * system.dH_at_nonmetal +
    system.anionCount * (system.ea1_nonmetal + system.ea2_nonmetal);

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
    const val = parseFloat(userAnswer);
    if (isNaN(val)) return;

    if (mode === 'born_haber') {
      const expected = targetType === 'dH_latt' ? system.dH_latt : system.dH_f;
      const diff = Math.abs(val - expected);

      if (diff <= 2) {
        setFeedback({
          isCorrect: true,
          msg: `Correct! ${targetType === 'dH_latt' ? 'ΔH_latt' : 'ΔH_f'} = ${expected} kJ mol⁻¹. ${system.examinerTrap}`
        });
        onComplete?.(`bh_${system.id}_${targetType}`);
      } else if (Math.abs(val + expected) <= 2) {
        setFeedback({
          isCorrect: false,
          msg: `WJEC Sign Reversal Trap! Your magnitude (${Math.abs(expected)} kJ mol⁻¹) is right, but the sign is reversed. Check whether the arrow goes UP (endothermic, +) or DOWN (exothermic, −).`
        });
      } else {
        // Check if student forgot x2 for Group 2 halide
        const unscaledSum =
          system.dH_at_metal +
          system.ie1_metal +
          system.ie2_metal +
          system.dH_at_nonmetal +
          system.ea1_nonmetal +
          system.ea2_nonmetal;
        const unscaledLatt = system.dH_f - unscaledSum;
        if (system.anionCount === 2 && Math.abs(val - unscaledLatt) <= 5) {
          setFeedback({
            isCorrect: false,
            msg: `WJEC Multiplier Trap! You forgot to multiply ΔH_at(${system.nonMetalSymbol}) (+${system.dH_at_nonmetal}) and EA₁(${system.nonMetalSymbol}) (${system.ea1_nonmetal}) by 2 for ${system.formula}!`
          });
        } else {
          setFeedback({
            isCorrect: false,
            msg: `Incorrect. Using Hess's Law: ΔH_f (${system.dH_f}) = [Sum of atomisation + ionisation + electron affinities (${sumToGaseousIons})] + ΔH_latt (${system.dH_latt}).`
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
          msg: `Incorrect. Remember: ΔH_sol = −ΔH_latt(formation) + ΔH_hyd(cation) + ${system.anionCount} × ΔH_hyd(anion) = +${Math.abs(system.dH_latt)} + (${system.dH_hyd_cation}) + ${system.anionCount}×(${system.dH_hyd_anion}) = ${expected} kJ mol⁻¹.`
        });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" style={{ textTransform: 'none' }}>
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-100 text-[#326fa0] rounded-md">
              WJEC Unit 3.6
            </span>
            <span className="text-xs font-bold text-slate-400">Energetics & Ionic Lattices</span>
          </div>
          <h2 className="text-xl font-black text-slate-800 mt-1">
            Born-Haber & Solution Enthalpy Cycle Builder
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => resetProblem(sysIdx, 'born_haber', targetType)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              mode === 'born_haber'
                ? 'bg-[#326fa0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Born-Haber Cycle
          </button>
          <button
            type="button"
            onClick={() => resetProblem(sysIdx, 'enthalpy_solution', targetType)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              mode === 'enthalpy_solution'
                ? 'bg-[#326fa0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Enthalpy of Solution (ΔH_sol)
          </button>
        </div>
      </div>

      {/* Crystal System Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider mr-1">Ionic Lattice:</span>
          {BORN_HABER_SYSTEMS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => resetProblem(idx, mode, targetType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                sysIdx === idx
                  ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s.formula}
            </button>
          ))}
        </div>

        {mode === 'born_haber' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400">Solve for:</span>
            <select
              value={targetType}
              onChange={(e) => resetProblem(sysIdx, mode, e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700"
            >
              <option value="dH_latt">Lattice Enthalpy (ΔH_latt)</option>
              <option value="dH_f">Enthalpy of Formation (ΔH_f)</option>
            </select>
          </div>
        )}
      </div>

      {mode === 'born_haber' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Interactive Energy Level Diagram SVG */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
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
              <div className="font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                Provided Thermodynamic Data (kJ mol⁻¹)
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
                {targetType !== 'dH_f' && (
                  <div>ΔH_f({system.formula}) = <strong>{system.dH_f}</strong></div>
                )}
                {targetType !== 'dH_latt' && (
                  <div>ΔH_latt({system.formula}) = <strong>{system.dH_latt}</strong></div>
                )}
                <div>ΔH_at({system.metalSymbol}) = <strong>+{system.dH_at_metal}</strong></div>
                <div>ΔH_at({system.nonMetalSymbol}) = <strong>+{system.dH_at_nonmetal}</strong></div>
                <div>IE₁({system.metalSymbol}) = <strong>+{system.ie1_metal}</strong></div>
                {system.ie2_metal > 0 && (
                  <div>IE₂({system.metalSymbol}) = <strong>+{system.ie2_metal}</strong></div>
                )}
                <div>EA₁({system.nonMetalSymbol}) = <strong>{system.ea1_nonmetal}</strong></div>
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
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  Step 1: WJEC Stoichiometry & Sign Gate
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
                className="w-full py-2 bg-[#326fa0] hover:bg-[#255580] disabled:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
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
                <span className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
                  Step 2: Apply Hess&apos;s Law
                </span>
                <h3 className="text-sm font-black text-slate-800 mt-0.5">
                  Calculate {targetType === 'dH_latt' ? `the Lattice Enthalpy (ΔH_latt) of ${system.formula}` : `the Enthalpy of Formation (ΔH_f) of ${system.formula}`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-slate-700">
                  {targetType === 'dH_latt' ? 'ΔH_latt =' : 'ΔH_f ='}
                </span>
                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  onWheel={(e) => e.currentTarget.blur()}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="e.g. -2526"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:border-[#326fa0]"
                />
                <span className="font-mono font-bold text-xs text-slate-500">kJ mol⁻¹</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#326fa0] hover:bg-[#255580] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
                >
                  Check Calculation
                </button>
                <button
                  type="button"
                  onClick={() => resetProblem((sysIdx + 1) % BORN_HABER_SYSTEMS.length, mode, targetType)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Next Crystal →
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* MODE 2: ENTHALPY OF SOLUTION */
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
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

          <form onSubmit={handleCheckAnswer} className="flex flex-wrap items-center gap-3 pt-2">
            <label className="font-mono font-black text-sm text-slate-700">
              ΔH_sol({system.formula}) =
            </label>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              onWheel={(e) => e.currentTarget.blur()}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="e.g. -155 or +4"
              className="w-40 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:border-[#326fa0]"
            />
            <span className="font-mono font-bold text-xs text-slate-500">kJ mol⁻¹</span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#326fa0] hover:bg-[#255580] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
            >
              Verify ΔH_sol
            </button>
          </form>
        </div>
      )}

      {feedback && (
        <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed ${
          feedback.isCorrect
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          {feedback.isCorrect ? '✅ ' : '❌ '}
          {feedback.msg}
        </div>
      )}
    </div>
  );
}
