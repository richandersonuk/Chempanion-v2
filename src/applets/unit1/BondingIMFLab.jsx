import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BONDING_ELEMENTS,
  BONDING_ELEMENT_LIST,
  CONTINUUM_PRESETS,
  IMF_DATASETS,
  BONDING_CHALLENGES,
  classifyBond,
  evaluateMorse,
} from '../../data/questions/bondingIMFData';
import { useProgress } from '../../hooks/useProgress';

const TABS = [
  { id: 'continuum', label: '⚛️ Bonding Continuum & Energy Well' },
  { id: 'imf', label: '🌡️ IMF & Boiling Point Explorer' },
  { id: 'challenges', label: '🎯 WJEC Exam Challenges' },
];

const SUPERSCRIPT_DIGITS = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

function toSup(num) {
  return String(num)
    .split('')
    .map((ch) => SUPERSCRIPT_DIGITS[ch] || ch)
    .join('');
}

function formatIonSymbol(symbol, charge) {
  if (!charge) return symbol;
  const mag = Math.abs(charge);
  const sign = charge > 0 ? '⁺' : '⁻';
  return `${symbol}${mag === 1 ? '' : toSup(mag)}${sign}`;
}

function formatCategoryLabel(category) {
  if (category === 'metal') return 'Metal';
  if (category === 'noble_gas') return 'Noble gas';
  return 'Non-metal';
}

function getPhaseAtTemp(item, tempC) {
  if (tempC < item.mpC) {
    return {
      state: 'Solid',
      icon: '🧊',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    };
  }
  if (tempC < item.bpC) {
    return {
      state: 'Liquid',
      icon: '💧',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  }
  return {
    state: 'Gas',
    icon: '💨',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  };
}

export function BondingIMFLab({ onComplete }) {
  const { progress } = useProgress();

  const [activeTab, setActiveTab] = useState('continuum');

  // --- TAB 1: BONDING CONTINUUM & POTENTIAL ENERGY WELL STATE ---
  const [selectedPresetId, setSelectedPresetId] = useState('hcl');
  const [symA, setSymA] = useState('H');
  const [symB, setSymB] = useState('Cl');
  const [chiAOverride, setChiAOverride] = useState(null);
  const [chiBOverride, setChiBOverride] = useState(null);
  const [distancePm, setDistancePm] = useState(127);
  const [isDraggingCurve, setIsDraggingCurve] = useState(false);
  const graphSvgRef = useRef(null);

  // --- TAB 2: IMF & BOILING POINT EXPLORER STATE ---
  const [activeDatasetId, setActiveDatasetId] = useState('halogens');
  const [tempC, setTempC] = useState(25);
  const [selectedItemFormula, setSelectedItemFormula] = useState('I₂');

  // --- TAB 3: WJEC EXAM CHALLENGES STATE ---
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedPart1, setSelectedPart1] = useState(null);
  const [selectedPart2, setSelectedPart2] = useState([]);
  const [challengeFeedback, setChallengeFeedback] = useState(null);
  const [completedIds, setCompletedIds] = useState(() => {
    const saved = progress['bonding-imf-lab']?.solvedIds;
    return Array.isArray(saved) ? saved : [];
  });

  useEffect(() => {
    const saved = progress['bonding-imf-lab']?.solvedIds;
    if (Array.isArray(saved)) {
      setCompletedIds((prev) => Array.from(new Set([...prev, ...saved])));
    }
  }, [progress]);

  // --- DERIVED DATA FOR TAB 1 ---
  const activePreset = useMemo(
    () => CONTINUUM_PRESETS.find((p) => p.id === selectedPresetId) || null,
    [selectedPresetId]
  );

  const baseElA = BONDING_ELEMENTS[symA] || BONDING_ELEMENTS.H;
  const baseElB = BONDING_ELEMENTS[symB] || BONDING_ELEMENTS.Cl;

  const effectiveElA = useMemo(
    () => (chiAOverride != null ? { ...baseElA, paulingChi: chiAOverride } : baseElA),
    [baseElA, chiAOverride]
  );

  const effectiveElB = useMemo(
    () => (chiBOverride != null ? { ...baseElB, paulingChi: chiBOverride } : baseElB),
    [baseElB, chiBOverride]
  );

  const isExactPreset =
    Boolean(activePreset) &&
    activePreset.elemA === symA &&
    activePreset.elemB === symB &&
    chiAOverride === null &&
    chiBOverride === null;

  const bondInfo = useMemo(
    () => classifyBond(effectiveElA, effectiveElB, isExactPreset ? activePreset.mode : null),
    [effectiveElA, effectiveElB, isExactPreset, activePreset]
  );

  const { equilibriumPm, bondEnthalpyKj } = useMemo(() => {
    if (isExactPreset) {
      return {
        equilibriumPm: activePreset.equilibriumPm,
        bondEnthalpyKj: activePreset.bondEnthalpyKj,
      };
    }

    if (bondInfo.type === 'london') {
      return { equilibriumPm: 340, bondEnthalpyKj: 12 };
    }

    if (bondInfo.type === 'metallic') {
      const r0 = Math.min(400, Math.max(200, Math.round((baseElA.covalentRadiusPm + baseElB.covalentRadiusPm) * 1.2)));
      const avgValence = (baseElA.valenceElectrons + baseElB.valenceElectrons) / 2;
      return { equilibriumPm: r0, bondEnthalpyKj: avgValence >= 2 ? 147 : 108 };
    }

    if (bondInfo.type === 'ionic') {
      const rA = baseElA.ionicRadiusPm || baseElA.covalentRadiusPm;
      const rB = baseElB.ionicRadiusPm || baseElB.covalentRadiusPm;
      const r0 = Math.min(390, Math.max(150, rA + rB));
      const q1 = Math.max(1, Math.abs(baseElA.commonCharge || 1));
      const q2 = Math.max(1, Math.abs(baseElB.commonCharge || 1));
      const enthalpy = Math.round(780 * q1 * q2 * (282 / Math.max(170, r0)));
      return { equilibriumPm: r0, bondEnthalpyKj: enthalpy };
    }

    const covR0 = Math.min(320, Math.max(74, baseElA.covalentRadiusPm + baseElB.covalentRadiusPm));
    const rScale = Math.max(0.7, covR0 / 100);
    const covDe = Math.round(420 / Math.pow(rScale, 0.7) + 85 * Math.pow(bondInfo.deltaChi, 1.3));
    return { equilibriumPm: covR0, bondEnthalpyKj: covDe };
  }, [isExactPreset, activePreset, bondInfo.type, bondInfo.deltaChi, baseElA, baseElB]);

  const currentEnergyKj = useMemo(
    () => evaluateMorse(distancePm, equilibriumPm, bondEnthalpyKj),
    [distancePm, equilibriumPm, bondEnthalpyKj]
  );

  const curveGeometry = useMemo(() => {
    const svgW = 480;
    const svgH = 220;
    const pad = { top: 20, right: 20, bottom: 34, left: 54 };
    const plotW = svgW - pad.left - pad.right;
    const plotH = svgH - pad.top - pad.bottom;
    const rMin = 50;
    const rMax = 450;
    const eMax = bondEnthalpyKj * 0.45;
    const eMin = -bondEnthalpyKj * 1.24;

    const toX = (r) => pad.left + ((r - rMin) / (rMax - rMin)) * plotW;
    const toY = (e) => {
      const clamped = Math.max(eMin, Math.min(eMax, e));
      return pad.top + ((eMax - clamped) / (eMax - eMin)) * plotH;
    };

    const pts = [];
    const steps = 96;
    for (let i = 0; i <= steps; i += 1) {
      const r = rMin + (i / steps) * (rMax - rMin);
      const v = evaluateMorse(r, equilibriumPm, bondEnthalpyKj);
      pts.push(`${i === 0 ? 'M' : 'L'} ${toX(r).toFixed(1)} ${toY(v).toFixed(1)}`);
    }

    return {
      svgW,
      svgH,
      pad,
      plotW,
      plotH,
      rMin,
      rMax,
      toX,
      toY,
      pathD: pts.join(' '),
      eqX: toX(equilibriumPm),
      eqY: toY(-bondEnthalpyKj),
      zeroY: toY(0),
      currX: toX(distancePm),
      currY: toY(currentEnergyKj),
    };
  }, [equilibriumPm, bondEnthalpyKj, distancePm, currentEnergyKj]);

  const distanceRegion = useMemo(() => {
    const diff = distancePm - equilibriumPm;
    if (Math.abs(diff) <= 6) {
      return {
        label: 'Equilibrium well (r ≈ r₀, F_net ≈ 0)',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (diff < 0) {
      return {
        label: 'Repulsion dominates (r < r₀)',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
      };
    }
    return {
      label: 'Attraction zone (r > r₀)',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    };
  }, [distancePm, equilibriumPm]);

  const handleLoadPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setSymA(preset.elemA);
    setSymB(preset.elemB);
    setChiAOverride(null);
    setChiBOverride(null);
    setDistancePm(preset.equilibriumPm);
  };

  const handleSelectElemA = (newSym) => {
    setSymA(newSym);
    setChiAOverride(null);
    setSelectedPresetId('');
  };

  const handleSelectElemB = (newSym) => {
    setSymB(newSym);
    setChiBOverride(null);
    setSelectedPresetId('');
  };

  const updateDistanceFromPointer = (clientX) => {
    const svg = graphSvgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clickX = ((clientX - rect.left) / rect.width) * curveGeometry.svgW;
    const ratio = (clickX - curveGeometry.pad.left) / curveGeometry.plotW;
    const newR = Math.round(
      curveGeometry.rMin + Math.max(0, Math.min(1, ratio)) * (curveGeometry.rMax - curveGeometry.rMin)
    );
    setDistancePm(Math.max(50, Math.min(450, newR)));
  };

  // --- DERIVED DATA FOR TAB 2 ---
  const activeDataset = useMemo(
    () => IMF_DATASETS.find((d) => d.id === activeDatasetId) || IMF_DATASETS[0],
    [activeDatasetId]
  );

  const selectedDatasetItem = useMemo(
    () =>
      activeDataset.items.find((it) => it.formula === selectedItemFormula) ||
      activeDataset.items.find((it) => it.highlight) ||
      activeDataset.items[0],
    [activeDataset, selectedItemFormula]
  );

  const handleSelectDataset = (dataset) => {
    setActiveDatasetId(dataset.id);
    setTempC(dataset.defaultTempC);
    const defaultItem = dataset.items.find((it) => it.highlight) || dataset.items[0];
    setSelectedItemFormula(defaultItem.formula);
  };

  const imfChartGeometry = useMemo(() => {
    const svgW = 560;
    const svgH = 225;
    const pad = { top: 24, right: 20, bottom: 44, left: 58 };
    const plotW = svgW - pad.left - pad.right;
    const plotH = svgH - pad.top - pad.bottom;

    const allVals = activeDataset.items.flatMap((it) => [it.mpC, it.bpC]);
    const minVal = Math.min(...allVals, activeDataset.tempRange[0]);
    const maxVal = Math.max(...allVals, activeDataset.tempRange[1]);
    const span = Math.max(40, maxVal - minVal);
    const yMin = minVal >= 0 ? 0 : Math.floor((minVal - span * 0.06) / 10) * 10;
    const yMax = Math.ceil((maxVal + span * 0.1) / 10) * 10;

    const toY = (degC) => pad.top + ((yMax - degC) / (yMax - yMin)) * plotH;

    return {
      svgW,
      svgH,
      pad,
      plotW,
      plotH,
      yMin,
      yMax,
      toY,
      bottomY: pad.top + plotH,
      zeroY: yMin < -20 && yMax > 20 ? toY(0) : null,
      tempLineY: Math.max(pad.top, Math.min(pad.top + plotH, toY(tempC))),
    };
  }, [activeDataset, tempC]);

  // --- DERIVED DATA FOR TAB 3 ---
  const currentChallenge = BONDING_CHALLENGES[challengeIdx] || BONDING_CHALLENGES[0];

  const handleSelectChallenge = (idx) => {
    setChallengeIdx(idx);
    setShowHint(false);
    setSelectedPart1(null);
    setSelectedPart2([]);
    setChallengeFeedback(null);
  };

  const togglePart2Option = (optId) => {
    setSelectedPart2((prev) =>
      prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
    );
    if (challengeFeedback && !challengeFeedback.isCorrect) {
      setChallengeFeedback(null);
    }
  };

  const handleCheckChallenge = (e) => {
    e.preventDefault();
    if (!selectedPart1) {
      setChallengeFeedback({
        isCorrect: false,
        message: 'Please choose an answer in Part 1 before checking.',
      });
      return;
    }

    const reqCount = currentChallenge.part2.requiredCount;
    if (selectedPart2.length !== reqCount) {
      setChallengeFeedback({
        isCorrect: false,
        message: `Please select exactly ${reqCount} mark-scheme statements in Part 2 (currently ${selectedPart2.length} selected).`,
      });
      return;
    }

    const part1Ok = selectedPart1 === currentChallenge.part1.correctId;
    const part2Ok =
      selectedPart2.length === currentChallenge.part2.correctIds.length &&
      currentChallenge.part2.correctIds.every((id) => selectedPart2.includes(id));

    if (part1Ok && part2Ok) {
      setChallengeFeedback({
        isCorrect: true,
        message: 'Full marks! Both your classification and mark-scheme explanations are spot on.',
      });
      setCompletedIds((prev) =>
        prev.includes(currentChallenge.id) ? prev : [...prev, currentChallenge.id]
      );
      onComplete?.(currentChallenge.id);
      return;
    }

    const issues = [];
    if (!part1Ok) {
      issues.push('Re-check Part 1: consider the dominant bonding or intermolecular force involved.');
    }
    if (!part2Ok) {
      issues.push('Part 2 needs adjustment: one or both chosen statements do not match the WJEC mark scheme.');
    }

    const trapNotes = currentChallenge.part2.options
      .filter((opt) => selectedPart2.includes(opt.id) && opt.trapFeedback)
      .map((opt) => opt.trapFeedback);

    setChallengeFeedback({
      isCorrect: false,
      message: issues.join(' '),
      trapNotes,
    });
  };

  // --- SVG VISUALISATION PARAMETERS FOR TAB 1 ---
  const atomViz = useMemo(() => {
    const cx = 280;
    const cy = 104;
    const distPx = Math.max(36, Math.min(310, distancePm * 0.68));
    const posAX = cx - distPx / 2;
    const posBX = cx + distPx / 2;

    const chiA = effectiveElA.paulingChi ?? 0;
    const chiB = effectiveElB.paulingChi ?? 0;
    const signedDiff = chiB - chiA;
    const shiftNorm = Math.max(-1, Math.min(1, signedDiff / 2.2));
    const cloudCenterX = cx + shiftNorm * Math.min(46, distPx * 0.28 + 14);

    // Ion charges when ionic
    const aIsMoreElectro = chiA > chiB;
    const ionChargeA = aIsMoreElectro
      ? -Math.max(1, Math.abs(effectiveElA.commonCharge || 1))
      : Math.max(1, Math.abs(effectiveElA.commonCharge || 1));
    const ionChargeB = aIsMoreElectro
      ? Math.max(1, Math.abs(effectiveElB.commonCharge || 1))
      : -Math.max(1, Math.abs(effectiveElB.commonCharge || 1));

    const rScaleA = Math.max(22, Math.min(46, (effectiveElA.covalentRadiusPm || 70) * 0.3));
    const rScaleB = Math.max(22, Math.min(46, (effectiveElB.covalentRadiusPm || 70) * 0.3));

    const colGap = Math.max(58, Math.min(96, distancePm * 0.24));

    return {
      cx,
      cy,
      distPx,
      posAX,
      posBX,
      signedDiff,
      cloudCenterX,
      ionChargeA,
      ionChargeB,
      rScaleA,
      rScaleB,
      colGap,
    };
  }, [distancePm, effectiveElA, effectiveElB]);

  const continuumMarkerPct =
    bondInfo.type === 'metallic' || bondInfo.type === 'london'
      ? null
      : Math.min(100, (bondInfo.deltaChi / 3.4) * 100);

  return (
    <div className="applet-container space-y-6" style={{ textTransform: 'none' }}>
      {/* Header */}
      <div className="applet-header !mb-0 flex-col sm:flex-row !justify-between">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-[#326fa0] border border-blue-200">
              WJEC Unit 1.4 / 1.5
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Bonding Continuum &amp; Intermolecular Forces Lab
          </h2>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
          Challenges Solved:{' '}
          <span className="font-black text-emerald-700">
            {completedIds.length} / {BONDING_CHALLENGES.length}
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[180px] px-3.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#326fa0] shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 1: BONDING CONTINUUM & ENERGY WELL ==================== */}
      {activeTab === 'continuum' && (
        <div className="space-y-5">
          {/* Preset Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Curated WJEC Bonding Presets
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Click any system to load literature r₀ &amp; enthalpy
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CONTINUUM_PRESETS.map((preset) => {
                const isCurrent = isExactPreset && selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continuum Metrics & Spectrum Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${bondInfo.badgeClass}`}>
                  {bondInfo.label}
                </span>
                {isExactPreset && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {activePreset.unitRef}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-mono font-bold text-slate-700">
                <span>Δχ = {bondInfo.deltaChi.toFixed(2)}</span>
                <span>Ionic = {bondInfo.percentIonic}%</span>
                <span>r₀ = {equilibriumPm} pm</span>
                <span>
                  {bondInfo.type === 'ionic' ? 'U_L' : 'E'} = {bondEnthalpyKj} kJ mol⁻¹
                </span>
              </div>
            </div>

            {continuumMarkerPct !== null && (
              <div className="space-y-1">
                <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-500">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow"
                    style={{ left: `${continuumMarkerPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>0.0 Non-polar Covalent</span>
                  <span>0.5 Polar Covalent</span>
                  <span>~1.0–1.6 Intermediate</span>
                  <span>1.7+ Strongly Ionic (metal + non-metal)</span>
                </div>
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">
              {isExactPreset
                ? activePreset.summary
                : bondInfo.type === 'london'
                ? 'Noble gas atoms have full outer valence shells and form no covalent or ionic bonds — only weak London dispersion attractions exist.'
                : bondInfo.type === 'metallic'
                ? `Metallic bonding between ${baseElA.name} and ${baseElB.name}: positive cations immersed in a mobile sea of delocalised valence electrons.`
                : `${baseElA.name} (χ = ${(effectiveElA.paulingChi ?? 0).toFixed(2)}) paired with ${baseElB.name} (χ = ${(effectiveElB.paulingChi ?? 0).toFixed(2)}) gives Δχ = ${bondInfo.deltaChi.toFixed(2)} (~${bondInfo.percentIonic}% ionic character), classified as ${bondInfo.label.toLowerCase()}.`}
            </p>
          </div>

          {/* Visuals Side-by-Side: Electron Cloud SVG + Potential Energy Curve */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Electron Density & Bonding Visualiser */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Electron Cloud &amp; Bonding Model
                </h3>
                <span className="text-[11px] font-mono font-bold text-[#326fa0]">
                  r = {distancePm} pm
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden">
                <svg viewBox="0 0 560 210" className="w-full h-auto block select-none">
                  <defs>
                    <radialGradient id="cloudGradA" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.03" />
                    </radialGradient>
                    <radialGradient id="cloudGradBond" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#326fa0" stopOpacity="0.62" />
                      <stop offset="65%" stopColor="#6366f1" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#326fa0" stopOpacity="0.02" />
                    </radialGradient>
                    <radialGradient id="cationGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#fed7aa" />
                      <stop offset="100%" stopColor="#f97316" />
                    </radialGradient>
                    <radialGradient id="anionGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#bbf7d0" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </radialGradient>
                  </defs>

                  {/* METALLIC LATTICE MODE */}
                  {bondInfo.type === 'metallic' && (
                    <g>
                      <rect
                        x="70"
                        y="26"
                        width="420"
                        height="152"
                        rx="24"
                        fill="#ede9fe"
                        stroke="#c4b5fd"
                        strokeWidth="1.5"
                      />
                      <text
                        x="280"
                        y="44"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill="#5b21b6"
                      >
                        Mobile Sea of Delocalised Valence Electrons (e⁻)
                      </text>
                      {[0, 1].map((row) =>
                        [-1, 0, 1].map((col) => {
                          const cx = 280 + col * atomViz.colGap;
                          const cy = 84 + row * 52;
                          const useB = (row + col) % 2 !== 0 && symA !== symB;
                          const el = useB ? baseElB : baseElA;
                          const charge = Math.max(1, el.valenceElectrons || 1);
                          return (
                            <g key={`${row}-${col}`}>
                              <circle cx={cx} cy={cy} r="20" fill="#8b5cf6" stroke="#4c1d95" strokeWidth="1.5" />
                              <text
                                x={cx}
                                y={cy + 4}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="800"
                                fill="#ffffff"
                              >
                                {formatIonSymbol(el.symbol, charge)}
                              </text>
                              {/* Delocalised e- dots */}
                              <circle cx={cx + 26} cy={cy - 14} r="6.5" fill="#0284c7" />
                              <text x={cx + 26} y={cy - 11} textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff">
                                e⁻
                              </text>
                              {charge >= 2 && (
                                <>
                                  <circle cx={cx - 26} cy={cy + 14} r="6.5" fill="#0284c7" />
                                  <text x={cx - 26} y={cy + 17} textAnchor="middle" fontSize="8" fontWeight="800" fill="#fff">
                                    e⁻
                                  </text>
                                </>
                              )}
                            </g>
                          );
                        })
                      )}
                      <text x="280" y="196" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                        {symA === symB
                          ? `${formatIonSymbol(baseElA.symbol, baseElA.valenceElectrons)} cations + ${baseElA.valenceElectrons} delocalised e⁻ per atom`
                          : `${baseElA.symbol} / ${baseElB.symbol} metallic alloy lattice`}
                      </text>
                    </g>
                  )}

                  {/* IONIC LATTICE PAIR MODE */}
                  {bondInfo.type === 'ionic' && (
                    <g>
                      {/* Electrostatic Attraction Dashes */}
                      <line
                        x1={atomViz.posAX}
                        y1={atomViz.cy}
                        x2={atomViz.posBX}
                        y2={atomViz.cy}
                        stroke="#16a34a"
                        strokeWidth="2.5"
                        strokeDasharray="6 5"
                      />

                      {/* Left Ion */}
                      <circle
                        cx={atomViz.posAX}
                        cy={atomViz.cy}
                        r={atomViz.ionChargeA > 0 ? 28 : 42}
                        fill={atomViz.ionChargeA > 0 ? 'url(#cationGrad)' : 'url(#anionGrad)'}
                        stroke={atomViz.ionChargeA > 0 ? '#c2410c' : '#15803d'}
                        strokeWidth="2"
                      />
                      <text
                        x={atomViz.posAX}
                        y={atomViz.cy + 5}
                        textAnchor="middle"
                        fontSize="15"
                        fontWeight="900"
                        fill="#0f172a"
                      >
                        {formatIonSymbol(effectiveElA.symbol, atomViz.ionChargeA)}
                      </text>

                      {/* Right Ion */}
                      <circle
                        cx={atomViz.posBX}
                        cy={atomViz.cy}
                        r={atomViz.ionChargeB > 0 ? 28 : 42}
                        fill={atomViz.ionChargeB > 0 ? 'url(#cationGrad)' : 'url(#anionGrad)'}
                        stroke={atomViz.ionChargeB > 0 ? '#c2410c' : '#15803d'}
                        strokeWidth="2"
                      />
                      <text
                        x={atomViz.posBX}
                        y={atomViz.cy + 5}
                        textAnchor="middle"
                        fontSize="15"
                        fontWeight="900"
                        fill="#0f172a"
                      >
                        {formatIonSymbol(effectiveElB.symbol, atomViz.ionChargeB)}
                      </text>

                      <text x="280" y="40" textAnchor="middle" fontSize="11" fontWeight="800" fill="#15803d">
                        Electron Transfer → Non-Directional Electrostatic Attraction
                      </text>
                      <text x="280" y="60" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0f172a">
                        {formatIonSymbol(effectiveElA.symbol, atomViz.ionChargeA)} ···{' '}
                        {formatIonSymbol(effectiveElB.symbol, atomViz.ionChargeB)}
                      </text>
                    </g>
                  )}

                  {/* NOBLE GAS LONDON ONLY MODE */}
                  {bondInfo.type === 'london' && (
                    <g>
                      <circle cx={atomViz.posAX} cy={atomViz.cy} r="36" fill="url(#cloudGradA)" stroke="#94a3b8" strokeDasharray="4 4" />
                      <circle cx={atomViz.posBX} cy={atomViz.cy} r="36" fill="url(#cloudGradA)" stroke="#94a3b8" strokeDasharray="4 4" />
                      <line x1={atomViz.posAX + 38} y1={atomViz.cy} x2={atomViz.posBX - 38} y2={atomViz.cy} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 4" />
                      <circle cx={atomViz.posAX} cy={atomViz.cy} r="13" fill="#475569" />
                      <text x={atomViz.posAX} y={atomViz.cy + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">
                        {effectiveElA.symbol}
                      </text>
                      <circle cx={atomViz.posBX} cy={atomViz.cy} r="13" fill="#475569" />
                      <text x={atomViz.posBX} y={atomViz.cy + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">
                        {effectiveElB.symbol}
                      </text>
                      <text x="280" y="42" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
                        No Covalent/Ionic Bond — Weak Instantaneous/Induced Dipoles Only
                      </text>
                    </g>
                  )}

                  {/* COVALENT / POLAR / INTERMEDIATE MODE */}
                  {(bondInfo.type === 'covalent' ||
                    bondInfo.type === 'polar' ||
                    bondInfo.type === 'intermediate') && (
                    <g>
                      {/* Outer atomic electron clouds */}
                      <circle
                        cx={atomViz.posAX}
                        cy={atomViz.cy}
                        r={atomViz.rScaleA + 18}
                        fill="url(#cloudGradA)"
                      />
                      <circle
                        cx={atomViz.posBX}
                        cy={atomViz.cy}
                        r={atomViz.rScaleB + 18}
                        fill="url(#cloudGradA)"
                      />

                      {/* Shifted shared electron density cloud */}
                      <ellipse
                        cx={atomViz.cloudCenterX}
                        cy={atomViz.cy}
                        rx={Math.max(42, atomViz.distPx * 0.44 + 28)}
                        ry={42}
                        fill="url(#cloudGradBond)"
                        stroke={bondInfo.type === 'intermediate' ? '#d97706' : '#326fa0'}
                        strokeWidth={bondInfo.type === 'intermediate' ? '1.8' : '1.2'}
                        strokeDasharray={bondInfo.type === 'intermediate' ? '5 3' : undefined}
                      />

                      {/* Nuclei */}
                      <circle cx={atomViz.posAX} cy={atomViz.cy} r="16" fill="#0f172a" />
                      <text x={atomViz.posAX} y={atomViz.cy + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">
                        {effectiveElA.symbol}
                      </text>

                      <circle cx={atomViz.posBX} cy={atomViz.cy} r="16" fill="#326fa0" />
                      <text x={atomViz.posBX} y={atomViz.cy + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">
                        {effectiveElB.symbol}
                      </text>

                      {/* Partial charges & dipole arrow when polar */}
                      {Math.abs(atomViz.signedDiff) >= 0.5 && (
                        <>
                          <text
                            x={atomViz.posAX}
                            y="48"
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="900"
                            fill={atomViz.signedDiff > 0 ? '#dc2626' : '#0284c7'}
                          >
                            {atomViz.signedDiff > 0 ? 'δ⁺' : 'δ⁻'}
                          </text>
                          <text
                            x={atomViz.posBX}
                            y="48"
                            textAnchor="middle"
                            fontSize="13"
                            fontWeight="900"
                            fill={atomViz.signedDiff > 0 ? '#0284c7' : '#dc2626'}
                          >
                            {atomViz.signedDiff > 0 ? 'δ⁻' : 'δ⁺'}
                          </text>
                          <line
                            x1={atomViz.posAX + 20}
                            y1="44"
                            x2={atomViz.posBX - 20}
                            y2="44"
                            stroke="#475569"
                            strokeWidth="1.8"
                          />
                          <polygon
                            points={
                              atomViz.signedDiff > 0
                                ? `${atomViz.posBX - 16},44 ${atomViz.posBX - 24},39 ${atomViz.posBX - 24},49`
                                : `${atomViz.posAX + 16},44 ${atomViz.posAX + 24},39 ${atomViz.posAX + 24},49`
                            }
                            fill="#475569"
                          />
                        </>
                      )}

                      {bondInfo.type === 'intermediate' && (
                        <text x="280" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill="#b45309">
                          High-Charge Cation Polarises Large Anion Electron Cloud (WJEC 1.4(c))
                        </text>
                      )}
                    </g>
                  )}

                  {/* Internuclear Distance Bracket (non-metallic modes) */}
                  {bondInfo.type !== 'metallic' && (
                    <g>
                      <line
                        x1={atomViz.posAX}
                        y1="172"
                        x2={atomViz.posBX}
                        y2="172"
                        stroke="#64748b"
                        strokeWidth="1.5"
                      />
                      <line x1={atomViz.posAX} y1="166" x2={atomViz.posAX} y2="178" stroke="#64748b" strokeWidth="1.5" />
                      <line x1={atomViz.posBX} y1="166" x2={atomViz.posBX} y2="178" stroke="#64748b" strokeWidth="1.5" />
                      <text x="280" y="192" textAnchor="middle" fontSize="11" fontWeight="800" fill="#334155">
                        r = {distancePm} pm  (Equilibrium r₀ = {equilibriumPm} pm)
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Distance Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Internuclear Separation r (50–450 pm)</span>
                  <button
                    type="button"
                    onClick={() => setDistancePm(equilibriumPm)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-black transition-colors cursor-pointer"
                  >
                    Snap to r₀ ({equilibriumPm} pm)
                  </button>
                </div>
                <input
                  type="range"
                  min={50}
                  max={450}
                  step={1}
                  value={distancePm}
                  onChange={(e) => setDistancePm(Number(e.target.value))}
                  className="w-full accent-[#326fa0] cursor-pointer"
                />
              </div>
            </div>

            {/* Potential Energy Well Graph */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Potential Energy Curve (V vs r)
                </h3>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${distanceRegion.badgeClass}`}>
                  {distanceRegion.label}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden">
                <svg
                  ref={graphSvgRef}
                  viewBox={`0 0 ${curveGeometry.svgW} ${curveGeometry.svgH}`}
                  onPointerDown={(e) => {
                    setIsDraggingCurve(true);
                    updateDistanceFromPointer(e.clientX);
                  }}
                  onPointerMove={(e) => {
                    if (isDraggingCurve) updateDistanceFromPointer(e.clientX);
                  }}
                  onPointerUp={() => setIsDraggingCurve(false)}
                  onPointerLeave={() => setIsDraggingCurve(false)}
                  className="w-full h-auto block cursor-crosshair select-none"
                >
                  {/* Shaded repulsion & attraction regions */}
                  <rect
                    x={curveGeometry.pad.left}
                    y={curveGeometry.pad.top}
                    width={Math.max(0, curveGeometry.eqX - curveGeometry.pad.left)}
                    height={curveGeometry.plotH}
                    fill="rgba(225, 29, 72, 0.06)"
                  />
                  <rect
                    x={curveGeometry.eqX}
                    y={curveGeometry.pad.top}
                    width={Math.max(
                      0,
                      curveGeometry.svgW - curveGeometry.pad.right - curveGeometry.eqX
                    )}
                    height={curveGeometry.plotH}
                    fill="rgba(16, 185, 129, 0.05)"
                  />

                  {/* Zero energy reference line */}
                  <line
                    x1={curveGeometry.pad.left}
                    y1={curveGeometry.zeroY}
                    x2={curveGeometry.svgW - curveGeometry.pad.right}
                    y2={curveGeometry.zeroY}
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={curveGeometry.pad.left - 6}
                    y={curveGeometry.zeroY + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="700"
                    fill="#64748b"
                  >
                    0
                  </text>

                  {/* Axes */}
                  <line
                    x1={curveGeometry.pad.left}
                    y1={curveGeometry.pad.top}
                    x2={curveGeometry.pad.left}
                    y2={curveGeometry.svgH - curveGeometry.pad.bottom}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={curveGeometry.pad.left}
                    y1={curveGeometry.svgH - curveGeometry.pad.bottom}
                    x2={curveGeometry.svgW - curveGeometry.pad.right}
                    y2={curveGeometry.svgH - curveGeometry.pad.bottom}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />

                  {/* Labels */}
                  <text
                    x={curveGeometry.pad.left + 8}
                    y={curveGeometry.pad.top + 14}
                    fontSize="10"
                    fontWeight="800"
                    fill="#be123c"
                  >
                    Repulsion
                  </text>
                  <text
                    x={curveGeometry.svgW - curveGeometry.pad.right - 6}
                    y={curveGeometry.zeroY - 6}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="700"
                    fill="#475569"
                  >
                    Separated Atoms (V → 0)
                  </text>
                  <text
                    x={curveGeometry.svgW / 2}
                    y={curveGeometry.svgH - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#475569"
                  >
                    Internuclear Distance r (pm) — Click or drag curve
                  </text>

                  {/* Morse Curve */}
                  <path
                    d={curveGeometry.pathD}
                    fill="none"
                    stroke="#326fa0"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />

                  {/* Equilibrium Marker */}
                  <line
                    x1={curveGeometry.eqX}
                    y1={curveGeometry.zeroY}
                    x2={curveGeometry.eqX}
                    y2={curveGeometry.eqY}
                    stroke="#16a34a"
                    strokeDasharray="3 3"
                    strokeWidth="1.4"
                  />
                  <circle cx={curveGeometry.eqX} cy={curveGeometry.eqY} r="4.5" fill="#16a34a" stroke="#fff" strokeWidth="1.5" />
                  <text
                    x={curveGeometry.eqX}
                    y={Math.min(curveGeometry.svgH - curveGeometry.pad.bottom - 5, curveGeometry.eqY + 16)}
                    textAnchor={
                      curveGeometry.eqX < curveGeometry.pad.left + 35
                        ? 'start'
                        : curveGeometry.eqX > curveGeometry.svgW - curveGeometry.pad.right - 35
                        ? 'end'
                        : 'middle'
                    }
                    fontSize="10"
                    fontWeight="800"
                    fill="#15803d"
                  >
                    r₀ (−{bondEnthalpyKj})
                  </text>

                  {/* Current Distance Marker */}
                  <circle cx={curveGeometry.currX} cy={curveGeometry.currY} r="8" fill="rgba(217, 119, 6, 0.25)" />
                  <circle cx={curveGeometry.currX} cy={curveGeometry.currY} r="4.8" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
                <span>
                  Current V(r): <strong className="font-mono text-slate-900">{currentEnergyKj} kJ mol⁻¹</strong>
                </span>
                <span className="text-[11px] text-slate-500">
                  Well depth = −{bondEnthalpyKj} kJ mol⁻¹ at r₀
                </span>
              </div>
            </div>
          </div>

          {/* Element Selectors & Manual Pauling Chi Override Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: 'Atom A',
                sym: symA,
                baseEl: baseElA,
                effectiveEl: effectiveElA,
                override: chiAOverride,
                onSelect: handleSelectElemA,
                onChiChange: (val) => {
                  setChiAOverride(val);
                  setSelectedPresetId('');
                },
                onReset: () => setChiAOverride(null),
              },
              {
                label: 'Atom B',
                sym: symB,
                baseEl: baseElB,
                effectiveEl: effectiveElB,
                override: chiBOverride,
                onSelect: handleSelectElemB,
                onChiChange: (val) => {
                  setChiBOverride(val);
                  setSelectedPresetId('');
                },
                onReset: () => setChiBOverride(null),
              },
            ].map((card) => (
              <div key={card.label} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    {card.label}: {card.baseEl.name} ({card.baseEl.symbol})
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {formatCategoryLabel(card.baseEl.category)}
                    </span>
                    {card.override !== null && (
                      <button
                        type="button"
                        onClick={card.onReset}
                        className="text-[11px] font-black text-[#326fa0] hover:underline cursor-pointer"
                      >
                        Reset χ
                      </button>
                    )}
                  </div>
                </div>

                <select
                  value={card.sym}
                  onChange={(e) => card.onSelect(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#326fa0]"
                >
                  {BONDING_ELEMENT_LIST.map((el) => (
                    <option key={el.symbol} value={el.symbol}>
                      {el.symbol} — {el.name} (Z={el.atomicNumber},{' '}
                      {el.paulingChi == null ? 'No χ' : `χ=${el.paulingChi.toFixed(2)}`})
                    </option>
                  ))}
                </select>

                {card.baseEl.category === 'noble_gas' ? (
                  <div className="text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl p-2.5">
                    Group 0 noble gas: full valence shell — no Pauling electronegativity scale applied.
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Pauling Electronegativity (χ)</span>
                      <span className="font-mono font-black text-[#326fa0]">
                        {(card.effectiveEl.paulingChi ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.7}
                      max={4.0}
                      step={0.05}
                      value={card.effectiveEl.paulingChi ?? 2.0}
                      onChange={(e) => card.onChiChange(Number(e.target.value))}
                      className="w-full accent-[#326fa0] cursor-pointer"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: IMF & BOILING POINT EXPLORER ==================== */}
      {activeTab === 'imf' && (
        <div className="space-y-5">
          {/* Dataset Pills */}
          <div className="flex flex-wrap gap-2">
            {IMF_DATASETS.map((ds) => {
              const isCurrent = ds.id === activeDataset.id;
              return (
                <button
                  key={ds.id}
                  type="button"
                  onClick={() => handleSelectDataset(ds)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                  }`}
                >
                  {ds.title}
                </button>
              );
            })}
          </div>

          {/* Live Temperature Slider Control */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
                  {activeDataset.unitRef} • Interactive Temperature Control
                </span>
                <p className="text-xs font-bold text-slate-600 mt-0.5">{activeDataset.subtitle}</p>
              </div>
              <div className="bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 font-mono text-sm font-black text-slate-900">
                {tempC} °C <span className="text-slate-400">|</span> {tempC + 273} K
              </div>
            </div>

            <input
              type="range"
              min={activeDataset.tempRange[0]}
              max={activeDataset.tempRange[1]}
              step={1}
              value={tempC}
              onChange={(e) => setTempC(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black text-slate-500 mr-1">Jump to:</span>
              {activeDataset.quickTemps.map((qt) => (
                <button
                  key={qt.label}
                  type="button"
                  onClick={() => setTempC(qt.tempC)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    tempC === qt.tempC
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-rose-400'
                  }`}
                >
                  {qt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clickable SVG Boiling/Melting Point Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Melting Point &amp; Boiling Point Profile (°C)
              </h3>
              <span className="text-[11px] font-bold text-slate-500">
                Click any column to inspect forces &amp; electron count
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden">
              <svg
                viewBox={`0 0 ${imfChartGeometry.svgW} ${imfChartGeometry.svgH}`}
                className="w-full h-auto block select-none"
              >
                {/* 0 °C baseline if inside range */}
                {imfChartGeometry.zeroY !== null && (
                  <>
                    <line
                      x1={imfChartGeometry.pad.left}
                      y1={imfChartGeometry.zeroY}
                      x2={imfChartGeometry.svgW - imfChartGeometry.pad.right}
                      y2={imfChartGeometry.zeroY}
                      stroke="#94a3b8"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                    <text
                      x={imfChartGeometry.pad.left - 6}
                      y={imfChartGeometry.zeroY + 4}
                      textAnchor="end"
                      fontSize="10"
                      fontWeight="700"
                      fill="#64748b"
                    >
                      0°C
                    </text>
                  </>
                )}

                {/* Axes & Bounds Labels */}
                <text
                  x={imfChartGeometry.pad.left - 6}
                  y={imfChartGeometry.pad.top + 8}
                  textAnchor="end"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#64748b"
                >
                  {imfChartGeometry.yMax}°C
                </text>
                <text
                  x={imfChartGeometry.pad.left - 6}
                  y={imfChartGeometry.bottomY}
                  textAnchor="end"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#64748b"
                >
                  {imfChartGeometry.yMin}°C
                </text>
                <line
                  x1={imfChartGeometry.pad.left}
                  y1={imfChartGeometry.pad.top}
                  x2={imfChartGeometry.pad.left}
                  y2={imfChartGeometry.bottomY}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
                <line
                  x1={imfChartGeometry.pad.left}
                  y1={imfChartGeometry.bottomY}
                  x2={imfChartGeometry.svgW - imfChartGeometry.pad.right}
                  y2={imfChartGeometry.bottomY}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />

                {/* Bars per item */}
                {activeDataset.items.map((item, idx) => {
                  const slotW = imfChartGeometry.plotW / activeDataset.items.length;
                  const slotX = imfChartGeometry.pad.left + idx * slotW;
                  const barW = Math.min(54, slotW * 0.56);
                  const barX = slotX + (slotW - barW) / 2;
                  const mpY = imfChartGeometry.toY(item.mpC);
                  const bpY = imfChartGeometry.toY(item.bpC);
                  const isSelected = selectedDatasetItem.formula === item.formula;

                  return (
                    <g
                      key={item.formula}
                      onClick={() => setSelectedItemFormula(item.formula)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={slotX}
                        y={imfChartGeometry.pad.top}
                        width={slotW}
                        height={imfChartGeometry.plotH + 38}
                        fill="transparent"
                      />
                      {/* Solid span from bottom up to melting point */}
                      <rect
                        x={barX}
                        y={mpY}
                        width={barW}
                        height={Math.max(2, imfChartGeometry.bottomY - mpY)}
                        rx="3"
                        fill={item.highlight ? '#f59e0b' : '#94a3b8'}
                        opacity="0.35"
                      />
                      {/* Liquid span from bp down to mp */}
                      <rect
                        x={barX}
                        y={bpY}
                        width={barW}
                        height={Math.max(4, mpY - bpY)}
                        rx="4"
                        fill={item.highlight ? '#d97706' : '#326fa0'}
                        stroke={isSelected ? '#0f172a' : 'none'}
                        strokeWidth={isSelected ? '2.2' : '0'}
                      />
                      {/* Boiling point top label */}
                      <text
                        x={barX + barW / 2}
                        y={Math.max(imfChartGeometry.pad.top - 4, bpY - 6)}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="900"
                        fill={item.highlight ? '#b45309' : '#1e293b'}
                      >
                        bp {item.bpC}°C
                      </text>
                      {/* Melting point tick */}
                      <line
                        x1={barX - 4}
                        y1={mpY}
                        x2={barX + barW + 4}
                        y2={mpY}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                      {/* Formula Label */}
                      <text
                        x={barX + barW / 2}
                        y={imfChartGeometry.bottomY + 18}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="900"
                        fill={isSelected ? '#326fa0' : '#0f172a'}
                      >
                        {item.formula}
                      </text>
                      <text
                        x={barX + barW / 2}
                        y={imfChartGeometry.bottomY + 32}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill="#64748b"
                      >
                        ({item.electrons} e⁻)
                      </text>
                    </g>
                  );
                })}

                {/* Live Current Temperature Dashed Line */}
                <line
                  x1={imfChartGeometry.pad.left}
                  y1={imfChartGeometry.tempLineY}
                  x2={imfChartGeometry.svgW - imfChartGeometry.pad.right}
                  y2={imfChartGeometry.tempLineY}
                  stroke="#e11d48"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <text
                  x={imfChartGeometry.svgW - imfChartGeometry.pad.right - 4}
                  y={Math.max(imfChartGeometry.pad.top + 10, imfChartGeometry.tempLineY - 5)}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="900"
                  fill="#be123c"
                >
                  T = {tempC}°C
                </text>
              </svg>
            </div>
          </div>

          {/* Substance Cards showing live phase at tempC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeDataset.items.map((item) => {
              const phase = getPhaseAtTemp(item, tempC);
              const isSelected = selectedDatasetItem.formula === item.formula;
              return (
                <button
                  key={item.formula}
                  type="button"
                  onClick={() => setSelectedItemFormula(item.formula)}
                  className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#326fa0] ring-2 ring-[#326fa0]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-black text-slate-900">{item.formula}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${phase.badgeClass}`}>
                      {phase.icon} {phase.state}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    {item.name} • {item.electrons} e⁻
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-700">
                    mp {item.mpC} °C | bp {item.bpC} °C
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.forces.map((f) => (
                      <span
                        key={f}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          f.includes('Hydrogen')
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : f.includes('Ionic') || f.includes('Metallic')
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Substance Detail + Dataset Takeaway */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
                Selected Substance Explanation — {selectedDatasetItem.formula}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                {selectedDatasetItem.note}
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                Core WJEC Exam Takeaway
              </div>
              <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
                {activeDataset.wjecTakeaway}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: GRADED WJEC EXAM CHALLENGES ==================== */}
      {activeTab === 'challenges' && (
        <div className="space-y-5">
          {/* Challenge Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {BONDING_CHALLENGES.map((ch, idx) => {
              const isCurrent = idx === challengeIdx;
              const isDone = completedIds.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChallenge(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-[#326fa0]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>#{idx + 1}</span>
                  {isDone && <span aria-label="Completed">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Challenge Card */}
          <form
            onSubmit={handleCheckChallenge}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm"
          >
            {/* Title + Spec Ref + Hint Button */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
                  {currentChallenge.unitRef}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {currentChallenge.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer shrink-0"
              >
                💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
            </div>

            {/* Prompt & Data Pills */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {currentChallenge.prompt}
              </p>

              {currentChallenge.dataPills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentChallenge.dataPills.map((pill) => (
                    <span
                      key={pill.label}
                      className="text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg"
                    >
                      {pill.label}: <span className="text-[#326fa0]">{pill.value}</span>
                    </span>
                  ))}
                </div>
              )}

              {showHint && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-medium text-amber-950">
                  <strong className="font-black text-amber-900">Hint: </strong>
                  {currentChallenge.hint}
                </div>
              )}
            </div>

            {/* Part 1: Single-Select Classification */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                Part 1 — {currentChallenge.part1.question}
              </div>
              <div className="space-y-2">
                {currentChallenge.part1.options.map((opt) => {
                  const checked = selectedPart1 === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        checked
                          ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                          : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`part1-${currentChallenge.id}`}
                        checked={checked}
                        onChange={() => {
                          setSelectedPart1(opt.id);
                          if (challengeFeedback && !challengeFeedback.isCorrect) {
                            setChallengeFeedback(null);
                          }
                        }}
                        className="mt-0.5 accent-[#326fa0]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Part 2: Multi-Select Mark-Scheme Reasoning */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                  Part 2 — {currentChallenge.part2.question}
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Selected: {selectedPart2.length} / {currentChallenge.part2.requiredCount}
                </span>
              </div>
              <div className="space-y-2">
                {currentChallenge.part2.options.map((opt) => {
                  const checked = selectedPart2.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        checked
                          ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                          : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePart2Option(opt.id)}
                        className="mt-0.5 accent-[#326fa0]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Action & Navigation Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#326fa0] hover:bg-[#255580] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Check Answer
              </button>

              <button
                type="button"
                onClick={() => handleSelectChallenge((challengeIdx + 1) % BONDING_CHALLENGES.length)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
              >
                Next Challenge &rarr;
              </button>
            </div>

            {/* Feedback Banner & Official Mark Scheme (unlocked ONLY on correct answer) */}
            {challengeFeedback && (
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  challengeFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="font-black text-sm">{challengeFeedback.message}</div>

                {!challengeFeedback.isCorrect && challengeFeedback.trapNotes?.length > 0 && (
                  <ul className="space-y-1 text-xs font-semibold text-rose-900 list-disc list-inside">
                    {challengeFeedback.trapNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                )}

                {challengeFeedback.isCorrect && (
                  <>
                    <div className="bg-white/80 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                        Official WJEC Mark-Scheme Points
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs font-bold text-slate-800">
                        {currentChallenge.markScheme.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs font-semibold text-amber-950 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <strong className="font-black text-rose-700">WJEC Examiner Pitfall: </strong>
                      {currentChallenge.examinerPitfall}
                    </div>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default BondingIMFLab;
