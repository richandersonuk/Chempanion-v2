import React, { useState } from 'react';
import {
  INORGANIC_SALTS,
  CATION_OPTIONS,
  ANION_OPTIONS
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
  const [revealedTests, setRevealedTests] = useState({});
  const [activeStation, setActiveStation] = useState('flame');
  const [selectedCation, setSelectedCation] = useState('');
  const [selectedAnion, setSelectedAnion] = useState('');
  const [feedback, setFeedback] = useState(null);

  const currentSalt = INORGANIC_SALTS[saltIdx];

  const loadSalt = (idx) => {
    setSaltIdx(idx);
    setRevealedTests({});
    setActiveStation('flame');
    setSelectedCation('');
    setSelectedAnion('');
    setFeedback(null);
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" style={{ textTransform: 'none' }}>
      {/* Header & Unknown Salt Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-100 text-[#326fa0] rounded-md">
              WJEC Unit 1.6 & 3.3
            </span>
            <span className="text-xs font-bold text-slate-400">Qualitative Inorganic Analysis</span>
          </div>
          <h2 className="text-xl font-black text-slate-800 mt-1">
            Sequential Unknown Salt Deduction Lab
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={saltIdx}
            onChange={(e) => loadSalt(Number(e.target.value))}
            className="bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] shadow-xs cursor-pointer"
          >
            {INORGANIC_SALTS.map((salt, idx) => (
              <option key={salt.id} value={idx}>
                Unknown {salt.code} ({idx + 1}/{INORGANIC_SALTS.length})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => loadSalt((saltIdx + 1) % INORGANIC_SALTS.length)}
            className="px-3 py-2 text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
          >
            Next Sample →
          </button>
        </div>
      </div>

      {/* Virtual Test-Tube Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Reagent Bench Controls */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              1. Perform Wet & Flame Tests
            </span>
            <button
              type="button"
              onClick={revealAllTests}
              className="text-[10px] font-bold text-[#326fa0] hover:underline"
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
                className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-xs'
                    : done
                    ? 'bg-white text-slate-800 border-emerald-300 hover:border-[#326fa0]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{station.label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
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

        {/* Right Column: Visual Apparatus & Lab Observation Log */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
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
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl shadow-xs transition-colors"
              >
                Perform This Test ▶
              </button>
            )}
          </div>

          {/* SVG Visual Simulation */}
          <div className="my-4 flex flex-col sm:flex-row items-center gap-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="w-28 h-36 flex items-center justify-center shrink-0">
              {activeStation === 'flame' ? (
                <svg viewBox="0 0 100 130" className="w-24 h-32">
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
                <svg viewBox="0 0 100 130" className="w-24 h-32">
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

            <div className="flex-1 space-y-2 text-left">
              {isRevealed ? (
                <>
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Recorded Laboratory Observation
                  </span>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">
                    {activeObs.observation}
                  </p>
                  {activeObs.nh3Result && (
                    <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-slate-700">
                      <strong className="text-[#326fa0]">+ Aqueous Ammonia (NH₃) Follow-up:</strong> {activeObs.nh3Result}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Click a reagent test on the left bench to perform the procedure and record the observation for Unknown {currentSalt.code}.
                </p>
              )}
            </div>
          </div>

          {/* Summary Table of Completed Tests */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Completed Test Notebook ({Object.keys(revealedTests).length}/5)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              {TEST_STATIONS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => runTest(s.id)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2 cursor-pointer hover:border-slate-300"
                >
                  <span className="font-bold text-slate-600">{s.short}:</span>
                  <span className="text-slate-800 font-medium truncate">
                    {revealedTests[s.id] ? currentSalt.tests[s.id].observation : 'Not tested yet'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Cation & Anion Deduction Form */}
      <form onSubmit={handleCheckDeduction} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
              2. Final Salt Identification
            </span>
            <h3 className="text-sm font-black text-slate-800">
              Deduce the Cation and Anion present in Unknown Sample {currentSalt.code}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Identify Cation:
            </label>
            <select
              value={selectedCation}
              onChange={(e) => setSelectedCation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#326fa0]"
            >
              <option value="">-- Select Cation --</option>
              {CATION_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Identify Anion:
            </label>
            <select
              value={selectedAnion}
              onChange={(e) => setSelectedAnion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#326fa0]"
            >
              <option value="">-- Select Anion --</option>
              {ANION_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#326fa0] hover:bg-[#255580] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors"
          >
            Verify Salt Identity
          </button>
          <button
            type="button"
            onClick={() => loadSalt((saltIdx + 1) % INORGANIC_SALTS.length)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Try Another Unknown
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
            <div className="space-y-2 flex-1">
              <h4 className="text-sm font-black">{feedback.message}</h4>
              {feedback.ionicEquations && (
                <div className="bg-white/90 border border-emerald-200 rounded-xl p-3 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block">
                    Essential WJEC Ionic Equations (Include State Symbols!)
                  </span>
                  {feedback.ionicEquations.map((eq, i) => (
                    <div key={i} className="font-mono text-xs font-bold text-slate-800">
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
  );
}
