import React, { useState, useMemo } from 'react';
import { SPECTRA_PROBLEMS, FUNCTIONAL_GROUP_OPTIONS } from '../../data/questions/spectraQuestions';

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const SpectraInterpreter = ({ onComplete }) => {
  const [problemIdx, setProblemIdx] = useState(0);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [activeTab, setActiveTab] = useState('ir'); // 'ms' | 'ir' | 'c13' | 'h1'
  const [selectedPeakIdx, setSelectedPeakIdx] = useState(null);

  const [selectedFunctionalGroup, setSelectedFunctionalGroup] = useState('');
  const [enteredC13Count, setEnteredC13Count] = useState('');
  const [selectedCompound, setSelectedCompound] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const problem = SPECTRA_PROBLEMS[problemIdx];

  const shuffledCompoundOptions = useMemo(
    () => shuffleArray(problem.options),
    [problem, shuffleSeed]
  );

  const loadProblem = (idx) => {
    setProblemIdx(idx);
    setShuffleSeed((s) => s + 1);
    setSelectedPeakIdx(null);
    setSelectedFunctionalGroup('');
    setEnteredC13Count('');
    setSelectedCompound('');
    setFeedback(null);
    setSolved(false);
    setShowHint(false);
  };

  const handleRandomProblem = () => {
    const others = SPECTRA_PROBLEMS.map((_, i) => i).filter((i) => i !== problemIdx);
    const nextIdx = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : 0;
    loadProblem(nextIdx);
  };

  const handleNext = () => {
    loadProblem((problemIdx + 1) % SPECTRA_PROBLEMS.length);
  };

  const handleVerify = () => {
    if (!selectedFunctionalGroup || !enteredC13Count || !selectedCompound) {
      setFeedback({
        type: 'error',
        text: 'Please complete all three deduction steps (Functional Group, ¹³C Environment Count, and Compound Identity).'
      });
      return;
    }

    const fgCorrect = selectedFunctionalGroup === problem.keyClues.functionalGroup;
    const c13Correct = parseInt(enteredC13Count, 10) === problem.keyClues.c13Count;
    const compoundCorrect = selectedCompound === problem.name;

    if (fgCorrect && c13Correct && compoundCorrect) {
      setSolved(true);
      setFeedback({
        type: 'success',
        text: `Full Marks! Unknown identified as ${problem.name} (${problem.formula}). ${problem.explanation}`
      });
      onComplete?.(problem.id);
    } else {
      const issues = [];
      if (!fgCorrect) issues.push('Review the IR spectrum absorption wavenumbers (Data Booklet) to identify the principal functional group.');
      if (!c13Correct) issues.push(`Count the number of distinct signals in the ¹³C NMR spectrum (remember molecular symmetry can reduce peak count!).`);
      if (!compoundCorrect) issues.push('Check the M⁺• molecular ion peak in the Mass Spectrum and the ¹H NMR splitting pattern (n+1 rule).');
      setFeedback({
        type: 'error',
        text: `Incomplete Deduction: ${issues.join(' ')}`
      });
    }
  };

  // Build SVG path for IR transmittance spectrum (4000 to 500 cm-1)
  const renderIrSpectrumSvg = () => {
    const width = 560;
    const height = 200;
    const padL = 42;
    const padR = 20;
    const padT = 18;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const wnToX = (wn) => padL + ((4000 - wn) / 3500) * plotW;
    const transToY = (t) => padT + ((100 - t) / 100) * plotH;

    // Sample points along 4000 -> 500 cm-1 to create a realistic transmittance baseline with dips
    const samples = [];
    for (let wn = 4000; wn >= 500; wn -= 15) {
      let trans = 95;
      problem.irPeaks.forEach((pk) => {
        const sigma = pk.width === 'broad' ? 190 : pk.width === 'medium' ? 55 : 28;
        const depth = 95 - pk.transmittance;
        const gauss = depth * Math.exp(-Math.pow(wn - pk.wavenumber, 2) / (2 * sigma * sigma));
        trans = Math.min(trans, 95 - gauss);
      });
      samples.push(`${wnToX(wn).toFixed(1)},${transToY(trans).toFixed(1)}`);
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {/* Grid lines */}
        {[4000, 3500, 3000, 2500, 2000, 1500, 1000, 500].map((wn) => {
          const x = wnToX(wn);
          return (
            <g key={wn}>
              <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={x} y={height - 10} textAnchor="middle" className="text-[9px] font-mono fill-slate-500 font-bold">
                {wn}
              </text>
            </g>
          );
        })}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth="1.5" />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth="1.5" />

        <text x={14} y={padT + plotH / 2} textAnchor="middle" transform={`rotate(-90, 14, ${padT + plotH / 2})`} className="text-[9px] font-black fill-slate-500">
          % Transmittance
        </text>
        <text x={padL + plotW / 2} y={height - 1} textAnchor="middle" className="text-[8px] font-black fill-slate-400 tracking-wider">
          Wavenumber (cm⁻¹)
        </text>

        {/* IR Transmittance Curve */}
        <polyline
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.2"
          points={samples.join(' ')}
        />

        {/* Interactive Peak Markers */}
        {problem.irPeaks.map((pk, idx) => {
          const cx = wnToX(pk.wavenumber);
          const cy = transToY(pk.transmittance);
          const isSelected = selectedPeakIdx === idx;
          return (
            <g
              key={idx}
              onClick={() => setSelectedPeakIdx(idx)}
              className="cursor-pointer"
            >
              <circle cx={cx} cy={cy} r={20} fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 6 : 4.5}
                className={isSelected ? 'fill-amber-500 stroke-white stroke-2' : 'fill-rose-600 stroke-white stroke-2'}
              />
              <text
                x={cx}
                y={Math.min(padT + plotH - 6, cy + 14)}
                textAnchor="middle"
                className="text-[8px] font-mono font-black fill-slate-700"
              >
                {pk.wavenumber}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Build SVG for Mass Spectrum
  const renderMassSpectrumSvg = () => {
    const width = 560;
    const height = 200;
    const padL = 42;
    const padR = 24;
    const padT = 22;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const maxMz = Math.max(100, problem.mr + 15);

    const mzToX = (mz) => padL + (mz / maxMz) * plotW;
    const intToY = (intensity) => padT + plotH - (intensity / 100) * plotH;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = intToY(pct);
          return (
            <g key={pct}>
              <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke="#f1f5f9" />
              <text x={padL - 6} y={y + 3} textAnchor="end" className="text-[8px] font-mono fill-slate-400 font-bold">
                {pct}
              </text>
            </g>
          );
        })}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth="1.5" />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth="1.5" />

        <text x={padL + plotW / 2} y={height - 4} textAnchor="middle" className="text-[9px] font-black fill-slate-500 tracking-wider">
          m/z (Mass-to-Charge Ratio)
        </text>

        {problem.msFragments.map((frag, idx) => {
          const x = mzToX(frag.mz);
          const y = intToY(frag.intensity);
          const isSelected = selectedPeakIdx === idx;
          return (
            <g key={idx} onClick={() => setSelectedPeakIdx(idx)} className="cursor-pointer">
              <line x1={x} y1={padT + plotH} x2={x} y2={y} stroke={isSelected ? '#d97706' : '#1e293b'} strokeWidth={isSelected ? '4' : '3'} />
              <circle cx={x} cy={y} r={18} fill="transparent" />
              <text x={x} y={y - 6} textAnchor="middle" className={`text-[9px] font-mono font-black ${isSelected ? 'fill-amber-600' : 'fill-blue-700'}`}>
                {frag.mz}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Build SVG for 13C NMR Spectrum (220 -> 0 ppm)
  const renderC13SpectrumSvg = () => {
    const width = 560;
    const height = 190;
    const padL = 30;
    const padR = 30;
    const padT = 24;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const ppmToX = (ppm) => padL + ((220 - ppm) / 220) * plotW;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {[220, 200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0].map((ppm) => {
          const x = ppmToX(ppm);
          return (
            <g key={ppm}>
              <line x1={x} y1={padT} x2={x} y2={padT + plotH} stroke="#f1f5f9" />
              <text x={x} y={height - 12} textAnchor="middle" className="text-[8px] font-mono fill-slate-500 font-bold">
                {ppm}
              </text>
            </g>
          );
        })}
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth="1.5" />
        <text x={padL + plotW / 2} y={height - 1} textAnchor="middle" className="text-[9px] font-black fill-slate-500 tracking-wider">
          Chemical Shift δ (ppm)
        </text>

        {/* TMS Reference at 0 ppm */}
        <line x1={ppmToX(0)} y1={padT + plotH} x2={ppmToX(0)} y2={padT + plotH - 35} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
        <text x={ppmToX(0)} y={padT + plotH - 40} textAnchor="middle" className="text-[8px] font-mono fill-slate-400 font-bold">TMS</text>

        {problem.c13Peaks.map((pk, idx) => {
          const x = ppmToX(pk.ppm);
          const isSelected = selectedPeakIdx === idx;
          return (
            <g key={idx} onClick={() => setSelectedPeakIdx(idx)} className="cursor-pointer">
              <line x1={x} y1={padT + plotH} x2={x} y2={padT + 20} stroke={isSelected ? '#d97706' : '#7c3aed'} strokeWidth={isSelected ? '4' : '3'} />
              <circle cx={x} cy={padT + 20} r={18} fill="transparent" />
              <text x={x} y={padT + 12} textAnchor="middle" className="text-[9px] font-mono font-black fill-purple-700">
                {pk.ppm} ppm
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="applet-container space-y-6" style={{ textTransform: 'none' }}>
      {/* Header */}
      <div className="applet-header !mb-0">
        Unknown Organic Compound #{problemIdx + 1}
      </div>

      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {SPECTRA_PROBLEMS.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => loadProblem(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              idx === problemIdx
                ? 'bg-[#326fa0] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sample {idx + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={handleRandomProblem}
          className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
        >
          🎲 Random Unknown
        </button>
      </div>

      {/* Responsive 2-Column Workbench on HD Desktop */}
      <div className="applet-workbench">
        {/* Left Column: Spectrum Selector Tabs & Viewer */}
        <div className="applet-workbench-sticky space-y-3">
          {/* Spectrum Technique Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'ir', label: '1. Infrared (IR)', badge: 'Wavenumber (cm⁻¹)' },
              { id: 'ms', label: '2. Mass Spec (MS)', badge: 'm/z Spectrum' },
              { id: 'c13', label: '3. ¹³C NMR', badge: 'Proton-decoupled' },
              { id: 'h1', label: '4. ¹H NMR', badge: 'δ ppm & Splitting' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setActiveTab(t.id); setSelectedPeakIdx(null); }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-black">{t.label}</div>
                <div className={`text-[10px] font-bold mt-0.5 ${activeTab === t.id ? 'text-amber-300' : 'text-slate-400'}`}>
                  {t.badge}
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Spectrum Viewer Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            {activeTab === 'ir' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black tracking-wider text-slate-600">
                    Infrared Absorption Spectrum (Tap curve peaks or pills)
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Use Data Booklet for Wavenumber Ranges</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-2">
                  {renderIrSpectrumSvg()}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.irPeaks.map((pk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPeakIdx(idx)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedPeakIdx === idx
                          ? 'bg-amber-50 border-amber-400 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      🔍 {pk.wavenumber} cm⁻¹ ({pk.width} band, {pk.transmittance}% transmittance)
                      {solved ? ` — ${pk.label}` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ms' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black tracking-wider text-slate-600">
                    Electron Impact Mass Spectrum (Tap bars or pills)
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Use Data Booklet Periodic Table for Relative Atomic Masses
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-2">
                  {renderMassSpectrumSvg()}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.msFragments.map((frag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPeakIdx(idx)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedPeakIdx === idx
                          ? 'bg-amber-50 border-amber-400 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      m/z = {frag.mz} ({frag.intensity}% rel. abundance)
                      {solved ? ` — ${frag.label}` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'c13' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black tracking-wider text-slate-600">
                    Proton-Decoupled ¹³C NMR Spectrum (Tap peaks or pills)
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Use Data Booklet for ¹³C NMR Shifts
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-2">
                  {renderC13SpectrumSvg()}
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {problem.c13Peaks.map((pk, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPeakIdx(idx)}
                      className={`text-left min-h-[40px] border rounded-xl p-2.5 text-xs transition-all cursor-pointer ${
                        selectedPeakIdx === idx
                          ? 'bg-amber-50 border-amber-400 text-amber-950'
                          : 'bg-white border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-slate-500 mr-1.5">Signal {idx + 1}:</span>
                      <span className="font-mono font-black text-purple-700">δ {pk.ppm} ppm</span>
                      {solved && (
                        <>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="font-bold text-slate-700">{pk.group}</span>
                          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Assignment: {pk.env}</div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'h1' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black tracking-wider text-slate-600">
                    High-Resolution ¹H NMR Summary Table (Relative to TMS)
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Use Data Booklet for ¹H NMR Shifts
                  </span>
                </div>
                <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-black text-[10px]">
                        <th className="p-3">Chemical Shift δ (ppm)</th>
                        <th className="p-3">Integration</th>
                        <th className="p-3">Splitting Pattern</th>
                        {solved && <th className="p-3">WJEC n + 1 Assignment</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {problem.h1Peaks.map((pk, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-black text-blue-700">{pk.ppm.toFixed(1)} ppm</td>
                          <td className="p-3 font-mono font-bold">{pk.integration}H</td>
                          <td className="p-3 font-bold text-slate-800">{pk.splitting}</td>
                          {solved && (
                            <td className="p-3 text-slate-600">
                              {pk.nPlusOne}
                              <span className="block text-emerald-700 font-bold mt-0.5">({pk.env})</span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Hint & Structured 3-Step WJEC Deduction Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-black tracking-wider text-slate-700">
              Structured Spectral Deduction
            </div>
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
              <strong className="font-black text-amber-900">Combined Spectra Strategy: </strong>
              Start with IR to spot broad O–H / sharp C=O bands against the Data Booklet. Use the highest major m/z peak (excluding tiny ¹³C M+1 peaks) for Mᵣ, count unique signals in ¹³C NMR (ignoring TMS at 0 ppm), and use ¹H integration ratios + the n + 1 splitting rule to distinguish structural isomers.
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {/* Step 1 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[10px] font-black tracking-wider text-slate-400 mb-1.5">
                Step 1: Principal Functional Group
              </label>
              <select
                value={selectedFunctionalGroup}
                onChange={(e) => setSelectedFunctionalGroup(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="">Select functional group...</option>
                {FUNCTIONAL_GROUP_OPTIONS.map((fg) => (
                  <option key={fg} value={fg}>{fg}</option>
                ))}
              </select>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[10px] font-black tracking-wider text-slate-400 mb-1.5">
                Step 2: Number of ¹³C Environments (excluding TMS)
              </label>
              <input
                type="number"
                inputMode="decimal"
                onWheel={(e) => e.currentTarget.blur()}
                value={enteredC13Count}
                onChange={(e) => setEnteredC13Count(e.target.value)}
                placeholder="e.g. 2, 3, or 4"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              />
            </div>

            {/* Step 3 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="block text-[10px] font-black tracking-wider text-slate-400 mb-1.5">
                Step 3: Deduce Unknown Identity
              </label>
              <select
                value={selectedCompound}
                onChange={(e) => setSelectedCompound(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="">Select compound...</option>
                {shuffledCompoundOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="button-group pt-1">
            <button
              type="button"
              onClick={handleVerify}
              className="btn btn-primary"
            >
              Verify Spectral Deduction
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-secondary"
            >
              Next Unknown &rarr;
            </button>
          </div>

          {feedback && (
            <div
              className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
                feedback.type === 'success' ? 'feedback-success' : 'feedback-error'
              }`}
            >
              <span>{feedback.text}</span>
              {feedback.type === 'success' && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Next Unknown &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpectraInterpreter;
