import React, { useState } from 'react';
import { ENTROPY_QUESTION_BANK } from '../../data/questions/entropyQuestions';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';

const TAB_OPTIONS = [
  { value: 'trainer', label: 'Exam Question Trainer' },
  { value: 'explorer', label: 'Quadrant Explorer' },
];

export default function EntropyGibbs({ onComplete }) {
  const [activeTab, setActiveTab] = useState('trainer');

  const [qIndex, setQIndex] = useState(0);
  const [filterPastPaperOnly, setFilterPastPaperOnly] = useState(false);

  const activePool = filterPastPaperOnly
    ? ENTROPY_QUESTION_BANK.filter((q) => q.isPastPaper)
    : ENTROPY_QUESTION_BANK;

  const currentQ = activePool[qIndex % activePool.length] || activePool[0];
  const [activeTempC, setActiveTempC] = useState(() => ENTROPY_QUESTION_BANK[0].tempC);
  const [showHint, setShowHint] = useState(false);

  const [inputT_K, setInputT_K] = useState('');
  const [inputDS_kJ, setInputDS_kJ] = useState('');
  const [inputDG, setInputDG] = useState('');
  const [userFeasible, setUserFeasible] = useState(null);
  const [inputTMin, setInputTMin] = useState('');

  const [submittedStep1, setSubmittedStep1] = useState(false);
  const [submittedStep2, setSubmittedStep2] = useState(false);
  const [submittedStep3, setSubmittedStep3] = useState(false);

  const correctT_K = activeTempC + 273;
  const correctDS_kJ = currentQ.dS / 1000;
  const correctDG = currentQ.dH - (correctT_K * correctDS_kJ);
  const isActuallyFeasible = correctDG < 0;

  let boundaryType = 'never';
  let correctTBoundary = null;
  if (currentQ.dH < 0 && currentQ.dS > 0) {
    boundaryType = 'always';
  } else if (currentQ.dH > 0 && currentQ.dS < 0) {
    boundaryType = 'never';
  } else {
    correctTBoundary = Math.round(currentQ.dH / correctDS_kJ);
    boundaryType = currentQ.dH > 0 ? 'above' : 'below';
  }

  const pickTempForQuestion = (qObj) => {
    const offsets = [-120, -60, 0, 80, 180, 300];
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    return Math.max(-50, qObj.tempC + offset);
  };

  const handleNextQuestion = () => {
    let nextIdx = Math.floor(Math.random() * activePool.length);
    if (activePool.length > 1 && nextIdx === qIndex % activePool.length) {
      nextIdx = (nextIdx + 1) % activePool.length;
    }
    const nextQ = activePool[nextIdx] || activePool[0];
    setQIndex(nextIdx);
    setActiveTempC(pickTempForQuestion(nextQ));
    resetTrainerForm();
  };

  const resetTrainerForm = () => {
    setInputT_K('');
    setInputDS_kJ('');
    setInputDG('');
    setUserFeasible(null);
    setInputTMin('');
    setSubmittedStep1(false);
    setSubmittedStep2(false);
    setSubmittedStep3(false);
    setShowHint(false);
  };

  const isStep1Correct =
    Math.abs(parseFloat(inputT_K) - correctT_K) <= 0.5 &&
    Math.abs(parseFloat(inputDS_kJ) - correctDS_kJ) <= 0.0005;

  const isStep2Correct =
    Math.abs(parseFloat(inputDG) - correctDG) <= 1.5 &&
    userFeasible === isActuallyFeasible;

  const isStep3Correct = () => {
    if (boundaryType === 'always' || boundaryType === 'never') return true;
    return Math.abs(parseFloat(inputTMin) - correctTBoundary) <= 5;
  };

  const handleValidateStep2 = () => {
    setSubmittedStep2(true);
    if (
      Math.abs(parseFloat(inputDG) - correctDG) <= 1.5 &&
      userFeasible === isActuallyFeasible &&
      (boundaryType === 'always' || boundaryType === 'never')
    ) {
      onComplete?.(`eg_${currentQ.id}_${activeTempC}`);
    }
  };

  const handleValidateStep3 = () => {
    setSubmittedStep3(true);
    if (Math.abs(parseFloat(inputTMin) - correctTBoundary) <= 5) {
      onComplete?.(`eg_${currentQ.id}_${activeTempC}`);
    }
  };

  const [explorerH, setExplorerH] = useState(100);
  const [explorerS, setExplorerS] = useState(120);
  const [explorerT, setExplorerT] = useState(298);

  const explorerS_kJ = explorerS / 1000;
  const explorerG = explorerH - (explorerT * explorerS_kJ);
  const explorerFeasible = explorerG < 0;

  let explorerTransition = null;
  if (explorerS !== 0) {
    explorerTransition = Math.round(explorerH / explorerS_kJ);
  }

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">
        Entropy, Gibbs Free Energy &amp; Feasibility
      </div>

      <AdaptivePicker
        label="Choose Practice View"
        options={TAB_OPTIONS}
        value={activeTab}
        onChange={(val) => setActiveTab(val)}
        collapseBelow="sm"
      />

      {activeTab === 'trainer' && (
        <div className="applet-workbench">
          <div className="applet-workbench-sticky">
            <div className="p-3.5 sm:p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <p className="text-xs font-semibold text-blue-600 tracking-wider">
                    Reaction bank:
                  </p>

                  <div className="flex items-center bg-white border border-blue-200 rounded-lg p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        const nextPool = ENTROPY_QUESTION_BANK.filter((q) => q.isPastPaper);
                        setFilterPastPaperOnly(true);
                        setQIndex(0);
                        setActiveTempC(nextPool[0]?.tempC ?? 25);
                        resetTrainerForm();
                      }}
                      className={`min-h-[34px] px-2.5 py-1 rounded-md transition cursor-pointer ${
                        filterPastPaperOnly
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-600 hover:text-blue-800'
                      }`}
                    >
                      Authentic Only
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterPastPaperOnly(false);
                        setQIndex(0);
                        setActiveTempC(ENTROPY_QUESTION_BANK[0]?.tempC ?? 25);
                        resetTrainerForm();
                      }}
                      className={`min-h-[34px] px-2.5 py-1 rounded-md transition cursor-pointer ${
                        !filterPastPaperOnly
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-600 hover:text-blue-800'
                      }`}
                    >
                      Expanded
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHint((prev) => !prev)}
                    className="min-h-[34px] px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition cursor-pointer"
                  >
                    💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="min-h-[34px] px-3 py-1 bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 shadow-sm transition cursor-pointer"
                  >
                    🎲 Random Reaction
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed">
                  <strong className="font-black text-amber-900">Gibbs Method: </strong>
                  Convert T to Kelvin (°C + 273) and ΔS to kJ K⁻¹ mol⁻¹ (÷ 1000). Then compute ΔG = ΔH − TΔS; reactions are feasible when ΔG &lt; 0, and switch feasibility at ΔG = 0 where T = ΔH ÷ ΔS(kJ).
                </div>
              )}

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">{currentQ.title}</h2>
                {currentQ.isPastPaper && (
                  <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
                    Past Paper Question
                  </span>
                )}
              </div>

              <div className="py-2.5 px-3 bg-white border border-blue-200 rounded-xl font-mono text-blue-900 text-sm sm:text-base text-center break-words shadow-sm">
                {currentQ.equation}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentQ.scenario}</p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 sm:p-3 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 block font-mono leading-tight">ΔH</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-blue-900 break-words">
                    {currentQ.dH > 0 ? `+${currentQ.dH}` : currentQ.dH} kJ mol⁻¹
                  </span>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 block font-mono leading-tight">ΔS</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-blue-900 break-words">
                    {currentQ.dS > 0 ? `+${currentQ.dS}` : currentQ.dS} J K⁻¹ mol⁻¹
                  </span>
                </div>
                <div className="bg-white p-2 sm:p-3 rounded-xl border border-blue-100 shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 block font-mono leading-tight">Temp (T)</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-blue-900">
                    {activeTempC} °C
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
              submittedStep1 && isStep1Correct
                ? 'bg-emerald-50/40 border-emerald-300'
                : 'bg-slate-50/50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shrink-0">1</span>
                <h3 className="font-bold text-sm text-slate-800">
                  The Unit Interconversion Trap (kJ ↔ J, °C ↔ K)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1">
                    Convert T to Absolute Temperature (K):
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={inputT_K}
                    onChange={(e) => setInputT_K(e.target.value)}
                    placeholder="T in K"
                    className="w-full min-h-[40px] bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1">
                    Convert ΔS to kJ K⁻¹ mol⁻¹ (/ 1000):
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={inputDS_kJ}
                    onChange={(e) => setInputDS_kJ(e.target.value)}
                    placeholder="ΔS in kJ K⁻¹ mol⁻¹"
                    className="w-full min-h-[40px] bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {!submittedStep1 ? (
                <button
                  type="button"
                  onClick={() => setSubmittedStep1(true)}
                  className="mt-4 min-h-[38px] px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-300 transition cursor-pointer"
                >
                  Verify Unit Conversions →
                </button>
              ) : (
                <div className="mt-3 text-xs font-mono">
                  {isStep1Correct ? (
                    <p className="text-emerald-700 font-medium">✓ Units correctly aligned for Gibbs Free Energy calculation.</p>
                  ) : (
                    <p className="text-rose-600 font-medium">
                      ✗ Check conversions: K = °C + 273, and ΔS (kJ K⁻¹ mol⁻¹) = ΔS (J K⁻¹ mol⁻¹) ÷ 1000.
                    </p>
                  )}
                </div>
              )}
            </div>

            {submittedStep1 && isStep1Correct && (
              <div className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
                submittedStep2 && isStep2Correct
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shrink-0">2</span>
                  <h3 className="font-bold text-sm text-slate-800">
                    Gibbs Free Energy &amp; Spontaneity Determination (ΔG = ΔH − TΔS)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Calculate ΔG at {activeTempC} °C (kJ mol⁻¹):
                    </label>
                    <input
                      type="number"
                      step="any"
                      inputMode="decimal"
                      onWheel={(e) => e.currentTarget.blur()}
                      value={inputDG}
                      onChange={(e) => setInputDG(e.target.value)}
                      placeholder="e.g. -45.2 or +12.8"
                      className="w-full min-h-[40px] bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      Is reaction feasible at {activeTempC} °C?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setUserFeasible(true)}
                        className={`flex-1 min-w-[120px] min-h-[40px] px-2.5 py-2 font-mono text-xs font-bold rounded-lg border transition cursor-pointer ${
                          userFeasible === true
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                            : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        Feasible (ΔG &lt; 0)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserFeasible(false)}
                        className={`flex-1 min-w-[120px] min-h-[40px] px-2.5 py-2 font-mono text-xs font-bold rounded-lg border transition cursor-pointer ${
                          userFeasible === false
                            ? 'bg-rose-100 border-rose-400 text-rose-800'
                            : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        Not Feasible (ΔG &gt; 0)
                      </button>
                    </div>
                  </div>
                </div>

                {!submittedStep2 ? (
                  <button
                    type="button"
                    onClick={handleValidateStep2}
                    className="mt-4 min-h-[38px] px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-300 transition cursor-pointer"
                  >
                    Validate ΔG &amp; Feasibility →
                  </button>
                ) : (
                  <div className="mt-3 text-xs font-mono">
                    {isStep2Correct ? (
                      <p className="text-emerald-700 font-medium">
                        ✓ Correct. ΔG = {correctDG.toFixed(1)} kJ mol⁻¹ ({isActuallyFeasible ? 'Feasible: ΔG < 0' : 'Not feasible: ΔG > 0'}).
                      </p>
                    ) : (
                      <p className="text-rose-600 font-medium">
                        ✗ Recheck your signs and calculation: ΔG = ΔH − (T_K × ΔS_kJ), and a process is feasible only when ΔG &lt; 0.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {submittedStep2 && isStep2Correct && (
              <div className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
                submittedStep3 && isStep3Correct()
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : 'bg-slate-50/50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shrink-0">3</span>
                  <h3 className="font-bold text-sm text-slate-800">
                    WJEC Boundary Condition: Feasibility Transition Temperature
                  </h3>
                </div>

                {boundaryType === 'always' ? (
                  <p className="text-xs font-mono text-emerald-800 bg-emerald-100/60 p-3 rounded-lg border border-emerald-200">
                    ΔH is negative and ΔS is positive. -TΔS is always negative, so ΔG is negative at all temperatures. Reaction is always feasible.
                  </p>
                ) : boundaryType === 'never' ? (
                  <p className="text-xs font-mono text-rose-800 bg-rose-100/60 p-3 rounded-lg border border-rose-200">
                    ΔH is positive and ΔS is negative. -TΔS is always positive, so ΔG is positive at all temperatures. Reaction is never feasible.
                  </p>
                ) : (
                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1">
                      At what temperature does feasibility switch (ΔG = 0 ➔ T = ΔH ÷ ΔS)?
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="number"
                        inputMode="decimal"
                        onWheel={(e) => e.currentTarget.blur()}
                        value={inputTMin}
                        onChange={(e) => setInputTMin(e.target.value)}
                        placeholder="Temperature in K"
                        className="w-full sm:w-48 min-h-[40px] bg-white border border-slate-300 px-3 py-2 rounded-lg font-mono text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-xs font-mono text-slate-600">
                        Reaction is feasible {boundaryType === 'above' ? 'above' : 'below'} this temperature.
                      </span>
                    </div>

                    {!submittedStep3 ? (
                      <button
                        type="button"
                        onClick={handleValidateStep3}
                        className="mt-4 min-h-[38px] px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-mono text-xs font-bold rounded-lg border border-blue-300 transition cursor-pointer"
                      >
                        Check Boundary Temperature
                      </button>
                    ) : (
                      <div className="mt-3 text-xs font-mono">
                        {isStep3Correct() ? (
                          <p className="text-emerald-700 font-medium">
                            ✓ Exact boundary: T = {currentQ.dH} ÷ {correctDS_kJ.toFixed(4)} = {correctTBoundary} K ({correctTBoundary - 273} °C).
                          </p>
                        ) : (
                          <p className="text-rose-600 font-medium">
                            ✗ Recheck T = ΔH (kJ mol⁻¹) ÷ ΔS (kJ K⁻¹ mol⁻¹) — remember to use ΔS in kJ K⁻¹ mol⁻¹ so the answer is in Kelvin.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {submittedStep2 && isStep2Correct && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-mono">
                <strong className="text-blue-950">Examiner Reminder:</strong> A reaction with ΔG &lt; 0 is thermodynamically feasible, but may not occur at room temperature due to high activation energy (kinetic stability).
              </div>
            )}

            {submittedStep2 && isStep2Correct && (boundaryType === 'always' || boundaryType === 'never' || (submittedStep3 && isStep3Correct())) && (
              <div className="button-group pt-1">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="btn btn-primary"
                >
                  Next Reaction &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <div className="applet-workbench">
          {/* Left Column: Sliders & Live ΔG Banner */}
          <div className="applet-workbench-sticky space-y-4">
            <div className="p-3.5 sm:p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4">
              <div>
                <div className="flex flex-wrap justify-between gap-1 text-xs font-mono text-slate-600 mb-1">
                  <span>Standard Enthalpy Change (ΔH):</span>
                  <span className="font-bold text-blue-900">{explorerH > 0 ? `+${explorerH}` : explorerH} kJ mol⁻¹</span>
                </div>
                <input
                  type="range"
                  min="-500"
                  max="500"
                  step="10"
                  value={explorerH}
                  onChange={(e) => setExplorerH(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex flex-wrap justify-between gap-1 text-xs font-mono text-slate-600 mb-1">
                  <span>Standard Entropy Change (ΔS):</span>
                  <span className="font-bold text-blue-900">{explorerS > 0 ? `+${explorerS}` : explorerS} J K⁻¹ mol⁻¹ ({explorerS_kJ.toFixed(3)} kJ K⁻¹ mol⁻¹)</span>
                </div>
                <input
                  type="range"
                  min="-400"
                  max="400"
                  step="5"
                  value={explorerS}
                  onChange={(e) => setExplorerS(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex flex-wrap justify-between gap-1 text-xs font-mono text-slate-600 mb-1">
                  <span>Absolute Temperature (T):</span>
                  <span className="font-bold text-blue-900">{explorerT} K ({explorerT - 273} °C)</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="25"
                  value={explorerT}
                  onChange={(e) => setExplorerT(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-center font-mono ${
              explorerFeasible
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <span className="text-xs tracking-wider block">Calculated Free Energy</span>
              <span className="text-2xl font-black">
                ΔG = {explorerG.toFixed(1)} kJ mol⁻¹
              </span>
              <span className="block text-xs mt-1 font-semibold">
                {explorerFeasible ? '✓ Spontaneous / Feasible (ΔG < 0)' : '✗ Not Feasible (ΔG > 0)'}
              </span>
            </div>
          </div>

          {/* Right Column: 2x2 Feasibility Quadrant Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              explorerH < 0 && explorerS > 0
                ? 'bg-emerald-100/70 border-emerald-400 font-bold text-emerald-950'
                : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className="font-bold text-slate-800 mb-1">ΔH &lt; 0 and ΔS &gt; 0</div>
              <div>-TΔS is always negative. ΔG is negative at <strong>all</strong> temperatures (always feasible).</div>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              explorerH > 0 && explorerS < 0
                ? 'bg-rose-100/70 border-rose-400 font-bold text-rose-950'
                : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className="font-bold text-slate-800 mb-1">ΔH &gt; 0 and ΔS &lt; 0</div>
              <div>-TΔS is always positive. ΔG is positive at <strong>all</strong> temperatures (never feasible).</div>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              explorerH > 0 && explorerS > 0
                ? 'bg-blue-100/70 border-blue-400 font-bold text-blue-950'
                : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className="font-bold text-slate-800 mb-1">ΔH &gt; 0 and ΔS &gt; 0</div>
              <div>Feasible only at <strong>high</strong> temperatures where T &gt; ΔH ÷ ΔS {explorerH > 0 && explorerS > 0 && explorerTransition ? `(T > ${explorerTransition} K)` : ''}.</div>
            </div>

            <div className={`p-3.5 sm:p-4 rounded-2xl border ${
              explorerH < 0 && explorerS < 0
                ? 'bg-blue-100/70 border-blue-400 font-bold text-blue-950'
                : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className="font-bold text-slate-800 mb-1">ΔH &lt; 0 and ΔS &lt; 0</div>
              <div>Feasible only at <strong>low</strong> temperatures where T &lt; ΔH ÷ ΔS {explorerH < 0 && explorerS < 0 && explorerTransition ? `(T < ${explorerTransition} K)` : ''}.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
