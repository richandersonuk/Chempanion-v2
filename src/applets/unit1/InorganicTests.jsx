import React, { useState } from 'react';
import { AdaptivePicker, StyledSelect } from '../../components/shared/AdaptivePicker';
import {
  INORGANIC_SALTS,
  CATION_OPTIONS,
  ANION_OPTIONS,
  generateRandomInorganicSalt
} from '../../data/questions/inorganicTestQuestions';

const TEST_STATIONS = [
  { id: 'flame', label: '🔥 Flame Test (Nichrome Wire)', short: 'Flame Test' },
  { id: 'naoh', label: '🧪 Add NaOH(aq) & Warm (Litmus)', short: 'NaOH(aq) Test' },
  { id: 'hcl', label: '🫧 Add Dilute HCl(aq) + Limewater', short: 'Carbonate Test' },
  { id: 'bacl2', label: '⚪ Add HCl(aq) + BaCl₂(aq)', short: 'Sulfate Test' },
  { id: 'agno3', label: '💧 Add HNO₃(aq) + AgNO₃(aq) + NH₃', short: 'Halide Test' }
];

export default function InorganicTests({ onComplete }) {
  const [saltIdx, setSaltIdx] = useState(0);
  const [activeSalt, setActiveSalt] = useState(() => generateRandomInorganicSalt());
  const [isProcedural, setIsProcedural] = useState(true);
  const [revealedTests, setRevealedTests] = useState({});
  const [activeStation, setActiveStation] = useState('flame');
  const [selectedCation, setSelectedCation] = useState('');
  const [selectedAnion, setSelectedAnion] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const currentSalt = activeSalt;

  const resetTestBench = () => {
    setRevealedTests({});
    setActiveStation('flame');
    setSelectedCation('');
    setSelectedAnion('');
    setFeedback(null);
    setShowHint(false);
  };

  const loadSalt = (idx) => {
    setSaltIdx(idx);
    setIsProcedural(false);
    setActiveSalt(INORGANIC_SALTS[idx]);
    resetTestBench();
  };

  const loadRandomSalt = () => {
    const nextSalt = generateRandomInorganicSalt(activeSalt?.id);
    setIsProcedural(true);
    setActiveSalt(nextSalt);
    resetTestBench();
  };

  const runTest = (stationId) => {
    setActiveStation(stationId);
    setRevealedTests((prev) => ({ ...prev, [stationId]: true }));
  };

  const revealAllTests = () => {
    const all = {};
    TEST_STATIONS.forEach((t) => { all[t.id] = true; });
    setRevealedTests(all);
  };

  const handleCheckDeduction = (e) => {
    e.preventDefault();
    if (!selectedCation || !selectedAnion) {
      setFeedback({
        isCorrect: false,
        message: 'Please select both a Cation and an Anion before submitting your deduction.'
      });
      return;
    }

    const catOk = selectedCation === currentSalt.cation;
    const aniOk = selectedAnion === currentSalt.anion;

    if (catOk && aniOk) {
      setFeedback({
        isCorrect: true,
        message: `Correct! Unknown Sample ${currentSalt.code} is ${currentSalt.name} (${currentSalt.formula}).`,
        ionicEquations: currentSalt.ionicEquations,
        examinerNote: currentSalt.examinerNote
      });
      onComplete?.(currentSalt.id);
    } else {
      const hints = [];
      if (!catOk) hints.push('Re-check the Flame Test and NaOH(aq) precipitate/gas observations to identify the cation.');
      if (!aniOk) hints.push('Re-check the HCl, BaCl₂, and AgNO₃ + NH₃ observations to identify the anion.');
      setFeedback({
        isCorrect: false,
        message: `Incorrect deduction. ${hints.join(' ')}`
      });
    }
  };

  const activeObs = currentSalt.tests[activeStation];
  const isRevealed = Boolean(revealedTests[activeStation]);

  const unknownOptions = [
    {
      value: 'procedural',
      label: `Procedural Unknown ${isProcedural ? currentSalt.code : '(33-Salt Pool)'}`,
    },
    ...INORGANIC_SALTS.map((salt, idx) => ({
      value: String(idx),
      label: `Preset Unknown ${salt.code} (${idx + 1}/${INORGANIC_SALTS.length})`,
    })),
  ];

  const cationOptions = CATION_OPTIONS.map((c) => ({ value: c, label: c }));
  const anionOptions = ANION_OPTIONS.map((a) => ({ value: a, label: a }));

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      {/* Header & Unknown Salt Selector */}
      <div className="applet-header !mb-0">
        Sequential Unknown Salt Deduction Lab
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-3xl mx-auto">
        <div className="flex-1 min-w-0">
          <AdaptivePicker
            options={unknownOptions}
            value={isProcedural ? 'procedural' : String(saltIdx)}
            onChange={(val) => {
              if (val === 'procedural') loadRandomSalt();
              else loadSalt(Number(val));
            }}
            onRandom={loadRandomSalt}
            isRandomActive={isProcedural}
            randomLabel="🎲 Random Unknown"
            collapseBelow="always"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowHint((prev) => !prev)}
          className="min-h-[40px] px-3.5 py-2 text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      </div>

      {showHint && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed space-y-1">
          <p><strong className="font-black text-amber-900">WJEC Deduction Sequence:</strong></p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li><strong>Cations:</strong> Na⁺ yellow-orange, K⁺ lilac, Ca²⁺ brick-red, Sr²⁺ crimson-red, Ba²⁺ apple-green flame; Mg²⁺ gives white Mg(OH)₂(s) ppt with no flame colour; NH₄⁺ evolves alkaline NH₃(g) on warming with NaOH(aq).</li>
            <li><strong>Anions:</strong> Dilute HCl(aq) gives CO₂ effervescence for CO₃²⁻; acidified BaCl₂(aq) gives white BaSO₄(s) for SO₄²⁻; acidified AgNO₃(aq) gives Cl⁻ (white, sol. dil. NH₃), Br⁻ (cream, sol. conc. NH₃), I⁻ (yellow, insol.).</li>
          </ul>
        </div>
      )}

      {/* Virtual Test-Tube Bench Workbench */}
      <div className="applet-workbench">
        {/* Left Column: Reagent Stations + Observation Chamber */}
        <div className="applet-workbench-sticky space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-black tracking-widest text-slate-400">
                1. Perform Wet &amp; Flame Tests
              </span>
              <button
                type="button"
                onClick={revealAllTests}
                className="text-[10px] font-bold text-[#326fa0] hover:underline cursor-pointer"
              >
                Run All 5 Tests
              </button>
            </div>

            {TEST_STATIONS.map((station) => {
              const done = Boolean(revealedTests[station.id]);
              const isCurrent = activeStation === station.id;
              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => runTest(station.id)}
                  className={`w-full min-h-[40px] text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                      : done
                      ? 'bg-white text-slate-800 border-emerald-300 hover:border-[#326fa0]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="break-words">{station.label}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : done
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {done ? 'Tested ✓' : 'Run'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-400">
                  Active Observation Chamber • Sample {currentSalt.code}
                </span>
                <h3 className="text-sm font-black text-slate-800">
                  {TEST_STATIONS.find((s) => s.id === activeStation)?.label}
                </h3>
              </div>

              {!isRevealed && (
                <button
                  type="button"
                  onClick={() => runTest(activeStation)}
                  className="min-h-[36px] px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Perform This Test ▶
                </button>
              )}
            </div>

            {/* SVG Visual Simulation */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="w-24 h-32 flex items-center justify-center shrink-0">
                {activeStation === 'flame' ? (
                  <svg viewBox="0 0 100 130" className="w-20 h-28">
                    {/* Bunsen Burner Tube */}
                    <rect x="42" y="85" width="16" height="40" rx="2" fill="#475569" />
                    <rect x="30" y="120" width="40" height="8" rx="3" fill="#334155" />
                    {/* Flame */}
                    {isRevealed ? (
                      <>
                        <path
                          d="M50 12 C72 42, 78 68, 50 85 C22 68, 28 42, 50 12 Z"
                          fill={activeObs.color}
                          opacity="0.88"
                        />
                        <path
                          d="M50 38 C60 55, 62 72, 50 85 C38 72, 40 55, 50 38 Z"
                          fill="#e0f2fe"
                          opacity="0.75"
                        />
                      </>
                    ) : (
                      <path
                        d="M50 35 C60 55, 62 72, 50 85 C38 72, 40 55, 50 35 Z"
                        fill="#93c5fd"
                        opacity="0.5"
                      />
                    )}
                  </svg>
                ) : (
                  <svg viewBox="0 0 100 130" className="w-20 h-28">
                    {/* Test Tube Glass */}
                    <path
                      d="M32 15 L32 95 A18 18 0 0 0 68 95 L68 15"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="3"
                    />
                    <ellipse cx="50" cy="15" rx="18" ry="4" fill="none" stroke="#64748b" strokeWidth="2.5" />
                    {/* Liquid / Precipitate Fill */}
                    <path
                      d="M34 55 L34 95 A16 16 0 0 0 66 95 L66 55 Z"
                      fill={isRevealed ? activeObs.color : '#e0f2fe'}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    {/* Precipitate sediment granules at bottom if ppt */}
                    {isRevealed && activeObs.observation.toLowerCase().includes('precipitate') && (
                      <path
                        d="M35 88 L35 95 A15 15 0 0 0 65 95 L65 88 Z"
                        fill={activeObs.color}
                        filter="brightness(0.92)"
                      />
                    )}
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2 text-left">
                {isRevealed ? (
                  <>
                    <span className="inline-block text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Recorded Laboratory Observation
                    </span>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed break-words">
                      {activeObs.observation}
                    </p>
                    {activeObs.nh3Result && (
                      <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-slate-700 break-words">
                        <strong className="text-[#326fa0]">+ Aqueous Ammonia (NH₃) Follow-up:</strong> {activeObs.nh3Result}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Click a reagent test above to perform the procedure and record the observation for Unknown {currentSalt.code}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Completed Notebook + Step 2 Deduction Form + Feedback */}
        <div className="space-y-4">
          {/* Summary Table of Completed Tests */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5">
            <span className="text-[10px] font-black tracking-widest text-slate-400 block">
              Completed Test Notebook ({Object.keys(revealedTests).length}/5)
            </span>
            <div className="space-y-2 text-xs">
              {TEST_STATIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => runTest(s.id)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-slate-200/80 bg-slate-50/70 flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-3 cursor-pointer hover:border-[#326fa0] transition-colors"
                >
                  <span className="font-black text-slate-600 shrink-0">{s.short}:</span>
                  <span className="text-slate-800 font-medium break-words sm:text-right">
                    {revealedTests[s.id] ? currentSalt.tests[s.id].observation : 'Not tested yet'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Cation & Anion Deduction Form */}
          <form onSubmit={handleCheckDeduction} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                2. Final Salt Identification
              </span>
              <h3 className="text-sm font-black text-slate-800 mt-0.5">
                Deduce the Cation and Anion present in Unknown Sample {currentSalt.code}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Identify Cation:
                </label>
                <StyledSelect
                  options={cationOptions}
                  value={selectedCation}
                  onChange={(val) => setSelectedCation(val)}
                  placeholder="-- Select Cation --"
                  ariaLabel="Identify Cation"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Identify Anion:
                </label>
                <StyledSelect
                  options={anionOptions}
                  value={selectedAnion}
                  onChange={(val) => setSelectedAnion(val)}
                  placeholder="-- Select Anion --"
                  ariaLabel="Identify Anion"
                />
              </div>
            </div>

            <div className="button-group pt-1">
              <button type="submit" className="btn btn-primary">
                Verify Salt Identity
              </button>
              <button
                type="button"
                onClick={loadRandomSalt}
                className="btn btn-secondary"
              >
                Random Unknown &rarr;
              </button>
            </div>
          </form>

          {/* Diagnostic Feedback & Ionic Equations */}
          {feedback && (
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                feedback.isCorrect
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg">{feedback.isCorrect ? '✅' : '❌'}</span>
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-sm font-black">{feedback.message}</h4>
                    {feedback.isCorrect && (
                      <button
                        type="button"
                        onClick={loadRandomSalt}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                      >
                        Next Unknown &rarr;
                      </button>
                    )}
                  </div>
                  {feedback.ionicEquations && (
                    <div className="bg-white/90 border border-emerald-200 rounded-xl p-3 space-y-1">
                      <span className="text-[10px] font-black tracking-widest text-emerald-700 block">
                        Essential WJEC Ionic Equations (Include State Symbols!)
                      </span>
                      {feedback.ionicEquations.map((eq, i) => (
                        <div key={i} className="font-mono text-xs font-bold text-slate-800 break-words">
                          {eq}
                        </div>
                      ))}
                    </div>
                  )}
                  {feedback.examinerNote && (
                    <p className="text-xs font-medium text-emerald-900 leading-relaxed">
                      <strong>WJEC Examiner Tip:</strong> {feedback.examinerNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
