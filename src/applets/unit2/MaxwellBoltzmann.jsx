import React, { useState, useMemo } from 'react';

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TABS = [
  { id: 'trainer', label: '🎯 Exam Question Trainer' },
  { id: 'explorer', label: '📈 Interactive Curve Explorer' },
];

function computeCurvePoints({ tempK, concScale = 1, maxE = 100 }) {
  // Normalised 2D-like kinetic energy distribution: f(E) = scale * (E / (kT)^2) * exp(-E / kT)
  const kT = (tempK / 300) * 18;
  const pts = [];
  for (let e = 0; e <= maxE; e += 1.5) {
    const raw = concScale * (e / (kT * kT)) * Math.exp(-e / kT);
    pts.push({ e, y: raw });
  }
  return pts;
}

function MaxwellSvg({
  t1 = 300,
  t2 = null,
  conc1 = 1,
  conc2 = 1,
  ea = 56,
  eaCat = null,
  showEmp = true,
}) {
  const width = 460;
  const height = 250;
  const padL = 42;
  const padR = 20;
  const padT = 22;
  const padB = 38;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const maxE = 100;

  const c1Pts = computeCurvePoints({ tempK: t1, concScale: conc1, maxE });
  const c2Pts = t2 !== null ? computeCurvePoints({ tempK: t2, concScale: conc2, maxE }) : null;

  const peakY1 = Math.max(...c1Pts.map((p) => p.y), 0.025);
  const peakY2 = c2Pts ? Math.max(...c2Pts.map((p) => p.y), 0.025) : 0;
  const maxY = Math.max(peakY1, peakY2, 0.034) * 1.15;

  const toX = (e) => padL + (e / maxE) * plotW;
  const toY = (val) => padT + plotH - (val / maxY) * plotH;

  const linePath = (pts) =>
    pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.e).toFixed(1)} ${toY(p.y).toFixed(1)}`)
      .join(' ');

  const areaFrom = (pts, threshold) => {
    const filtered = pts.filter((p) => p.e >= threshold);
    if (filtered.length < 2) return '';
    const baseY = toY(0).toFixed(1);
    const startX = toX(threshold).toFixed(1);
    const firstPt = filtered[0];
    const segs = filtered.map((p) => `L ${toX(p.e).toFixed(1)} ${toY(p.y).toFixed(1)}`).join(' ');
    return `M ${startX} ${baseY} L ${startX} ${toY(firstPt.y).toFixed(1)} ${segs} L ${toX(maxE).toFixed(1)} ${baseY} Z`;
  };

  const emp1 = (t1 / 300) * 18;
  const emp1Val = conc1 * (emp1 / (emp1 * emp1)) * Math.exp(-1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none bg-white border border-slate-200 rounded-2xl">
      {/* Grid */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padL}
          y1={padT + plotH * f}
          x2={padL + plotW}
          y2={padT + plotH * f}
          stroke="#f1f5f9"
          strokeWidth="1"
        />
      ))}

      {/* Shaded high-energy molecules under primary or comparison curve */}
      <path d={areaFrom(c1Pts, ea)} fill="rgba(35, 84, 120, 0.18)" />
      {c2Pts && <path d={areaFrom(c2Pts, ea)} fill="rgba(225, 29, 72, 0.16)" />}
      {eaCat !== null && eaCat < ea && (
        <path
          d={areaFrom(c1Pts, eaCat)}
          fill="rgba(5, 150, 105, 0.16)"
        />
      )}

      {/* Curves */}
      <path d={linePath(c1Pts)} fill="none" stroke="#235478" strokeWidth="2.6" strokeLinecap="round" />
      {c2Pts && (
        <path d={linePath(c2Pts)} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" />
      )}

      {/* E_mp dashed drop */}
      {showEmp && (
        <g>
          <line x1={toX(emp1)} y1={toY(emp1Val)} x2={toX(emp1)} y2={toY(0)} stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x={toX(emp1)} y={padT + plotH + 14} textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-500">
            E_mp
          </text>
        </g>
      )}

      {/* Activation energy line */}
      <line x1={toX(ea)} y1={padT + 8} x2={toX(ea)} y2={toY(0)} stroke="#d97706" strokeWidth="2" />
      <text x={toX(ea)} y={padT + 6} textAnchor="middle" className="text-[9.5px] font-mono font-black fill-amber-700">
        Eₐ
      </text>

      {eaCat !== null && eaCat < ea && (
        <g>
          <line x1={toX(eaCat)} y1={padT + 8} x2={toX(eaCat)} y2={toY(0)} stroke="#059669" strokeWidth="2" strokeDasharray="4 2" />
          <text x={toX(eaCat)} y={padT + 6} textAnchor="middle" className="text-[9.5px] font-mono font-black fill-emerald-700">
            E_cat
          </text>
        </g>
      )}

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth="1.8" />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth="1.8" />

      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        transform={`rotate(-90, 14, ${padT + plotH / 2})`}
        className="text-[9px] font-sans font-black fill-slate-600"
      >
        Number of Molecules with Energy E
      </text>
      <text x={padL + plotW / 2} y={height - 6} textAnchor="middle" className="text-[9.5px] font-sans font-black fill-slate-600">
        Kinetic Energy (E)
      </text>

      {/* Legend */}
      <g transform={`translate(${padL + plotW - 145}, ${padT + 8})`}>
        <rect x="0" y="0" width="140" height={c2Pts ? 36 : 20} rx="6" fill="rgba(255,255,255,0.92)" stroke="#e2e8f0" />
        <line x1="8" y1="10" x2="24" y2="10" stroke="#235478" strokeWidth="2.5" />
        <text x="30" y="13" className="text-[9px] font-mono font-bold fill-slate-700">
          {conc1 > 1 ? `T₁=${t1} K (${conc1}×)` : `T₁ = ${t1} K`}
        </text>
        {c2Pts && (
          <>
            <line x1="8" y1="26" x2="24" y2="26" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 2" />
            <text x="30" y="29" className="text-[9px] font-mono font-bold fill-rose-700">
              {conc2 !== conc1 ? `T₂=${t2} K (${conc2}×)` : `T₂ = ${t2} K`}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

function buildRandomScenario(excludeType = null) {
  const types = [
    'temp_increase',
    'temp_decrease',
    'catalyst',
    'conc_double',
    'origin_rule',
    'asymptote_rule',
    'emp_vs_mean',
    'area_meaning',
  ];
  const pool = excludeType ? types.filter((t) => t !== excludeType) : types;
  const kind = pool[Math.floor(Math.random() * pool.length)];

  const baseT = Math.floor(285 + Math.random() * 25); // 285-309 K
  const highT = baseT + Math.floor(90 + Math.random() * 80);
  const lowT = baseT - Math.floor(60 + Math.random() * 35);
  const eaVal = Math.floor(54 + Math.random() * 10);

  switch (kind) {
    case 'temp_increase':
      return {
        kind,
        completionId: `mb_tup_${baseT}_${highT}`,
        title: `Raising Temperature: ${baseT} K → ${highT} K`,
        prompt: `A gas sample is heated from T₁ = ${baseT} K (solid blue) to T₂ = ${highT} K (dashed red) at constant total moles.`,
        hint: 'Total molecules (total area under curve) remain constant, so shifting the peak to higher energy forces the peak height downward and widens the tail past Eₐ.',
        chart: { t1: baseT, t2: highT, conc1: 1, conc2: 1, ea: eaVal, eaCat: null },
        part1Label: '1. How does the peak (E_mp) and total area change at T₂?',
        part1Options: [
          { id: 'right_lower', label: 'Peak shifts RIGHT (higher energy) and becomes LOWER; total area stays constant', correct: true },
          { id: 'right_higher', label: 'Peak shifts RIGHT and becomes HIGHER; total area increases', correct: false },
          { id: 'left_lower', label: 'Peak shifts LEFT and becomes LOWER; Eₐ shifts to a lower energy', correct: false },
        ],
        part2Label: '2. Why does the reaction rate increase sharply at the higher temperature?',
        part2Options: [
          { id: 'more_above_ea', label: 'Far more molecules have E ≥ Eₐ, so a much greater proportion of collisions are successful per second', correct: true },
          { id: 'ea_lowers', label: 'Heating lowers the activation energy Eₐ of the reaction pathway', correct: false },
          { id: 'faster_only', label: 'Rate increases solely because molecules move faster, not because of Eₐ', correct: false },
        ],
      };

    case 'temp_decrease':
      return {
        kind,
        completionId: `mb_tdown_${baseT}_${lowT}`,
        title: `Cooling a Reaction Mixture: ${baseT} K → ${lowT} K`,
        prompt: `The reaction temperature is lowered from T₁ = ${baseT} K (solid blue) to T₂ = ${lowT} K (dashed red) with the same number of molecules.`,
        hint: 'Cooling reduces average kinetic energy: E_mp moves left, so to keep the total area constant the curve becomes narrower and taller.',
        chart: { t1: baseT, t2: lowT, conc1: 1, conc2: 1, ea: eaVal, eaCat: null },
        part1Label: '1. Describe the new curve peak at the lower temperature T₂:',
        part1Options: [
          { id: 'left_higher', label: 'Peak shifts LEFT (lower energy) and becomes HIGHER; total area stays identical', correct: true },
          { id: 'left_lower', label: 'Peak shifts LEFT and becomes LOWER; total area shrinks', correct: false },
          { id: 'same_pos', label: 'Peak stays at the same energy E_mp because Eₐ has not changed', correct: false },
        ],
        part2Label: '2. What happens to the shaded area beyond Eₐ?',
        part2Options: [
          { id: 'fewer', label: 'The area where E ≥ Eₐ shrinks, so far fewer collisions exceed Eₐ per unit time', correct: true },
          { id: 'zero', label: 'No molecules have energy above Eₐ once cooled below 250 K', correct: false },
          { id: 'larger', label: 'More molecules gain energy ≥ Eₐ because the peak is taller', correct: false },
        ],
      };

    case 'catalyst':
      return {
        kind,
        completionId: `mb_cat_${baseT}_${eaVal}`,
        title: 'Effect of Adding a Homogeneous or Heterogeneous Catalyst',
        prompt: `A suitable catalyst is added to the mixture at constant temperature T₁ = ${baseT} K (creating threshold E_cat = ${eaVal - 16} units).`,
        hint: 'A catalyst changes the reaction mechanism (lower Eₐ), NOT the kinetic energy distribution of the reactant molecules.',
        chart: { t1: baseT, t2: null, conc1: 1, conc2: 1, ea: eaVal, eaCat: eaVal - 16 },
        part1Label: '1. How does adding a catalyst change the Maxwell–Boltzmann curve itself?',
        part1Options: [
          { id: 'curve_unchanged', label: 'The curve shape and E_mp do NOT move; only the activation energy threshold shifts left (E_cat < Eₐ)', correct: true },
          { id: 'curve_right', label: 'The entire curve shifts right because the catalyst gives molecules extra kinetic energy', correct: false },
          { id: 'peak_taller', label: 'The peak rises at the same energy to produce more collisions', correct: false },
        ],
        part2Label: '2. State the WJEC mark-scheme explanation for why the catalyst speeds up the reaction:',
        part2Options: [
          { id: 'alt_route', label: 'Provides an alternative pathway with lower activation energy E_cat, so a larger fraction of molecules have E ≥ E_cat', correct: true },
          { id: 'more_energy', label: 'Increases average molecular kinetic energy so molecules collide harder', correct: false },
          { id: 'more_moles', label: 'Increases total molecules under the curve without changing collision energy', correct: false },
        ],
      };

    case 'conc_double':
      return {
        kind,
        completionId: `mb_conc_${baseT}`,
        title: 'Doubling Gas Concentration / Pressure at Constant Temperature',
        prompt: `Twice as many gas molecules are compressed into the same flask at constant temperature T = ${baseT} K.`,
        hint: 'Since T is unchanged, the most probable energy E_mp does not change — only the vertical number of molecules at every energy doubles.',
        chart: { t1: baseT, t2: baseT, conc1: 1, conc2: 2, ea: eaVal, eaCat: null },
        part1Label: '1. How does the 2× concentration curve (dashed red) compare with the original?',
        part1Options: [
          { id: 'double_area', label: 'Twice as high at every energy (total area doubles), with peak E_mp at the SAME horizontal position', correct: true },
          { id: 'shifts_right', label: 'Peak shifts right because higher pressure raises the temperature naturally', correct: false },
          { id: 'same_height', label: 'Peak height stays identical because temperature T is constant', correct: false },
        ],
        part2Label: '2. How do Eₐ and collision frequency change?',
        part2Options: [
          { id: 'freq_doubles', label: 'Eₐ stays unchanged, while total collision frequency and molecules with E ≥ Eₐ both double', correct: true },
          { id: 'ea_halves', label: 'Activation energy Eₐ halves due to increased pressure', correct: false },
          { id: 'proportion_doubles', label: 'The fraction/percentage of molecules with E ≥ Eₐ doubles', correct: false },
        ],
      };

    case 'origin_rule':
      return {
        kind,
        completionId: `mb_origin_${baseT}`,
        title: 'Curve Boundary Feature: The Origin (0, 0)',
        prompt: `Inspect the left-hand boundary of the Maxwell–Boltzmann distribution at T = ${baseT} K.`,
        hint: 'Remember what the vertical and horizontal axes represent: (Number of molecules) vs (Kinetic energy E).',
        chart: { t1: baseT, t2: null, conc1: 1, conc2: 1, ea: eaVal, eaCat: null },
        part1Label: '1. Why must every valid Maxwell–Boltzmann curve start strictly at (0, 0)?',
        part1Options: [
          { id: 'zero_mol_zero_e', label: 'No molecules have zero kinetic energy (all gas particles are in continuous random motion)', correct: true },
          { id: 'ea_start', label: 'Because activation energy Eₐ cannot be zero', correct: false },
          { id: 'no_collisions', label: 'Because particles must exceed E_mp before colliding', correct: false },
        ],
        part2Label: '2. Which plotting error would cost an exam mark on a sketched distribution?',
        part2Options: [
          { id: 'y_intercept', label: 'Starting the curve above zero on the y-axis at E = 0', correct: true },
          { id: 'skew_right', label: 'Drawing an asymmetrical peak skewed towards the left', correct: false },
          { id: 'shading_tail', label: 'Shading the area to the right of Eₐ', correct: false },
        ],
      };

    case 'asymptote_rule':
      return {
        kind,
        completionId: `mb_asymptote_${baseT}`,
        title: 'Curve Boundary Feature: High-Energy Asymptotic Tail',
        prompt: `Inspect the right-hand tail of the Maxwell–Boltzmann curve at T = ${baseT} K as energy E becomes very large.`,
        hint: 'Does any finite upper energy limit exist for random molecular collisions in an ideal gas?',
        chart: { t1: baseT, t2: null, conc1: 1, conc2: 1, ea: eaVal, eaCat: null },
        part1Label: '1. Why does the high-energy tail approach, but never touch, the horizontal x-axis?',
        part1Options: [
          { id: 'no_max_e', label: 'There is no maximum kinetic energy limit — a very small fraction of molecules can always hold arbitrarily high energy', correct: true },
          { id: 'conc_zero', label: 'Because the gas concentration drops to zero at high energy', correct: false },
          { id: 'ea_barrier', label: 'Because Eₐ blocks molecules from gaining higher energy', correct: false },
        ],
        part2Label: '2. What is the WJEC consequence if a drawn curve hits or crosses the x-axis at high E?',
        part2Options: [
          { id: 'lose_mark', label: 'It loses the mark because it implies zero molecules can exceed a fixed maximum energy', correct: true },
          { id: 'accepted', label: 'It is accepted as long as E_mp is labelled accurately', correct: false },
          { id: 'only_cold', label: 'It is only expected at high temperatures above 500 K', correct: false },
        ],
      };

    case 'emp_vs_mean':
      return {
        kind,
        completionId: `mb_emp_${baseT}`,
        title: 'Most Probable Energy (E_mp) vs Mean Energy (Ē)',
        prompt: `Examine the asymmetrical shape of the Maxwell–Boltzmann curve at T = ${baseT} K.`,
        hint: 'Because of the long high-energy tail on the right, the arithmetic mean is pulled higher than the mode (peak).',
        chart: { t1: baseT, t2: null, conc1: 1, conc2: 1, ea: eaVal, eaCat: null },
        part1Label: '1. Where does the mean energy (Ē) lie relative to the most probable energy (E_mp)?',
        part1Options: [
          { id: 'mean_right', label: 'Ē lies slightly to the RIGHT of E_mp (Ē > E_mp) because the distribution has a long positive tail', correct: true },
          { id: 'mean_same', label: 'Ē is identical to E_mp at the exact peak maximum', correct: false },
          { id: 'mean_left', label: 'Ē lies to the LEFT of E_mp because most molecules move slowly', correct: false },
        ],
        part2Label: '2. What does E_mp represent physically?',
        part2Options: [
          { id: 'mode', label: 'The kinetic energy possessed by the largest single number of molecules (the mode)', correct: true },
          { id: 'minimum_ea', label: 'The minimum energy required for reaction', correct: false },
          { id: 'average_all', label: 'Total energy divided by total number of molecules', correct: false },
        ],
      };

    case 'area_meaning':
    default:
      return {
        kind: 'area_meaning',
        completionId: `mb_area_${baseT}`,
        title: 'Interpreting Areas Under the Distribution Curve',
        prompt: `Analyse what the total area and the shaded tail region past Eₐ represent at T = ${baseT} K.`,
        hint: 'Each vertical slice sums the number of molecules within that tiny kinetic energy band ΔE.',
        chart: { t1: baseT, t2: null, conc1: 1, conc2: 1, ea: eaVal, eaCat: null },
        part1Label: '1. What does the TOTAL area enclosed beneath the entire Maxwell–Boltzmann curve represent?',
        part1Options: [
          { id: 'total_mols', label: 'The total number of molecules (or moles of particles) in the sample', correct: true },
          { id: 'total_ea', label: 'The activation energy of the forward reaction', correct: false },
          { id: 'total_enthalpy', label: 'The total enthalpy change ΔH of the reaction', correct: false },
        ],
        part2Label: '2. What does the shaded area strictly to the right of Eₐ (E ≥ Eₐ) represent?',
        part2Options: [
          { id: 'reacting_mols', label: 'The number of molecules with sufficient kinetic energy (E ≥ Eₐ) to react upon collision', correct: true },
          { id: 'catalyst_mols', label: 'The number of catalyst particles present', correct: false },
          { id: 'product_mols', label: 'The total product yield after completion', correct: false },
        ],
      };
  }
}

export default function MaxwellBoltzmann({ onComplete }) {
  const [activeTab, setActiveTab] = useState('trainer');
  const [scenario, setScenario] = useState(() => buildRandomScenario());
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [part1Choice, setPart1Choice] = useState('');
  const [part2Choice, setPart2Choice] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Interactive Explorer Controls
  const [expTemp, setExpTemp] = useState(300);
  const [expEa, setExpEa] = useState(58);
  const [expCatalyst, setExpCatalyst] = useState(false);
  const [expDoubleConc, setExpDoubleConc] = useState(false);
  const [expShowBaseline, setExpShowBaseline] = useState(true);

  const shuffledPart1 = useMemo(
    () => shuffleArray(scenario.part1Options),
    [scenario, shuffleSeed]
  );

  const shuffledPart2 = useMemo(
    () => shuffleArray(scenario.part2Options),
    [scenario, shuffleSeed]
  );

  const handleNextScenario = () => {
    setScenario((prev) => buildRandomScenario(prev.kind));
    setShuffleSeed((s) => s + 1);
    setPart1Choice('');
    setPart2Choice('');
    setFeedback(null);
    setShowHint(false);
  };

  const handleCheck = (e) => {
    e.preventDefault();
    if (!part1Choice || !part2Choice) {
      setFeedback({
        isCorrect: false,
        msg: 'Please answer both Question 1 and Question 2 before checking.',
      });
      return;
    }

    const p1 = scenario.part1Options.find((o) => o.id === part1Choice);
    const p2 = scenario.part2Options.find((o) => o.id === part2Choice);

    if (p1?.correct && p2?.correct) {
      setFeedback({
        isCorrect: true,
        msg: 'Full Marks! Your curve interpretation and WJEC collision-theory reasoning are spot on.',
      });
      onComplete?.(scenario.completionId);
    } else {
      const notes = [];
      if (!p1?.correct) notes.push('Re-check Question 1: inspect peak position, peak height, and whether total area changes.');
      if (!p2?.correct) notes.push('Re-check Question 2: link collision success specifically to the proportion of molecules having E ≥ Eₐ.');
      setFeedback({
        isCorrect: false,
        msg: notes.join(' '),
      });
    }
  };

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">Maxwell–Boltzmann Distribution &amp; Collision Theory</div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 max-w-xl mx-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 min-w-[170px] px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-white text-[#326fa0] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'trainer' && (
        <div className="applet-workbench">
          {/* Left Sticky Workbench Column: Curve Visualization */}
          <div className="applet-workbench-sticky space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                  WJEC Unit 2.2 • {scenario.title}
                </span>
                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="px-3 py-1 rounded-xl text-xs font-bold border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  🎲 Random Question
                </button>
              </div>

              <MaxwellSvg {...scenario.chart} />

              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                {scenario.prompt}
              </p>
            </div>
          </div>

          {/* Right Workbench Column: Hint, Shuffled Exam MCQs & Feedback */}
          <form onSubmit={handleCheck} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-800">WJEC Exam Analysis</span>
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
              >
                💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
            </div>

            {showHint && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed">
                <strong className="font-black text-amber-900">Collision Theory Hint: </strong>
                {scenario.hint}
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-700">{scenario.part1Label}</div>
              {shuffledPart1.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    part1Choice === opt.id
                      ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name={`mb-p1-${scenario.completionId}`}
                    checked={part1Choice === opt.id}
                    onChange={() => {
                      setPart1Choice(opt.id);
                      if (feedback && !feedback.isCorrect) setFeedback(null);
                    }}
                    className="mt-0.5 accent-[#326fa0]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-black text-slate-700">{scenario.part2Label}</div>
              {shuffledPart2.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    part2Choice === opt.id
                      ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name={`mb-p2-${scenario.completionId}`}
                    checked={part2Choice === opt.id}
                    onChange={() => {
                      setPart2Choice(opt.id);
                      if (feedback && !feedback.isCorrect) setFeedback(null);
                    }}
                    className="mt-0.5 accent-[#326fa0]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="button-group pt-1">
              <button type="submit" className="btn btn-primary">
                Check Explanation
              </button>
              <button type="button" onClick={handleNextScenario} className="btn btn-secondary">
                Next Question &rarr;
              </button>
            </div>

            {feedback && (
              <div className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
                feedback.isCorrect ? 'feedback-success' : 'feedback-error'
              }`}>
                <span>{feedback.isCorrect ? '✅ ' : '❌ '}{feedback.msg}</span>
                {feedback.isCorrect && (
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                  >
                    Next Question &rarr;
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {activeTab === 'explorer' && (
        <div className="applet-workbench">
          <div className="applet-workbench-sticky bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <MaxwellSvg
              t1={expShowBaseline ? 300 : expTemp}
              t2={expShowBaseline ? expTemp : null}
              conc1={expShowBaseline ? 1 : expDoubleConc ? 2 : 1}
              conc2={expDoubleConc ? 2 : 1}
              ea={expEa}
              eaCat={expCatalyst ? Math.max(20, expEa - 16) : null}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">
              Explore Temperature, Catalyst &amp; Concentration Effects
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Temperature (T₂):</span>
                  <span className="font-mono text-[#326fa0]">{expTemp} K ({expTemp - 273} °C)</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="560"
                  step="10"
                  value={expTemp}
                  onChange={(e) => setExpTemp(Number(e.target.value))}
                  className="w-full accent-[#326fa0] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Activation Energy (Eₐ):</span>
                  <span className="font-mono text-amber-700">{expEa} energy units</span>
                </div>
                <input
                  type="range"
                  min="36"
                  max="84"
                  step="2"
                  value={expEa}
                  onChange={(e) => setExpEa(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expCatalyst}
                    onChange={(e) => setExpCatalyst(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span>Add Catalyst (E_cat)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={expDoubleConc}
                    onChange={(e) => setExpDoubleConc(e.target.checked)}
                    className="w-4 h-4 accent-[#326fa0]"
                  />
                  <span>Double Concentration (2×)</span>
                </label>
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expShowBaseline}
                  onChange={(e) => setExpShowBaseline(e.target.checked)}
                  className="w-4 h-4 accent-[#326fa0]"
                />
                <span>Overlay T₁ = 300 K Baseline Curve</span>
              </label>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-medium text-amber-950 space-y-1">
              <strong className="font-black text-amber-900">Key WJEC Observations:</strong>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Raising T flattens the curve and shifts E_mp right without changing total area.</li>
                <li>Adding a catalyst keeps the curve identical while shifting Eₐ left to E_cat.</li>
                <li>Doubling concentration doubles peak height and total area at the same E_mp.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
