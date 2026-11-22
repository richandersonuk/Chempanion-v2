import React, { useState, useEffect, useMemo } from 'react';
import {
  SHAPE_OPTIONS,
  ANGLE_OPTIONS,
  VSEPR_MOLECULES,
} from '../../data/questions/vseprQuestions';
import { useProgress } from '../../hooks/useProgress';

const TABS = [
  { id: 'trainer', label: '🎯 VSEPR Trainer' },
  { id: 'explorer', label: '🧭 3D Geometry Explorer' },
];

const TIER_FILTERS = [
  { id: 'all', label: 'All (14)' },
  { id: 'core', label: 'Core Shapes (8)' },
  { id: 'ions', label: 'Coordinate Ions (3)' },
  { id: 'polarity', label: 'Polarity & Stretch (3)' },
];

const ATOM_CHI = {
  H: 2.20,
  Be: 1.57,
  B: 2.04,
  C: 2.55,
  N: 3.04,
  O: 3.44,
  F: 3.98,
  P: 2.19,
  S: 2.58,
  Cl: 3.16,
  Xe: 2.60,
};

function getShapeLayout(molecule) {
  const atoms = molecule.outerAtoms || [];
  switch (molecule.shapeId) {
    case 'linear':
      return {
        cx: 180,
        cy: 118,
        bonds: [
          { x: 76, y: 118, label: atoms[0] || 'X', style: 'plain' },
          { x: 284, y: 118, label: atoms[1] || 'X', style: 'plain' },
        ],
        lonePairs: [],
        centralDipoleOffset: { dx: 0, dy: 28 },
        angleArc: {
          d: 'M 140 118 A 40 40 0 0 1 220 118',
          tx: 180,
          ty: 68,
        },
      };

    case 'trigonal_planar':
      return {
        cx: 180,
        cy: 126,
        bonds: [
          { x: 180, y: 42, label: atoms[0] || 'X', style: 'plain' },
          { x: 254, y: 168, label: atoms[1] || 'X', style: 'plain' },
          { x: 106, y: 168, label: atoms[2] || 'X', style: 'plain' },
        ],
        lonePairs: [],
        centralDipoleOffset: { dx: -26, dy: -14 },
        angleArc: {
          d: 'M 180 90 A 36 36 0 0 1 211 144',
          tx: 222,
          ty: 102,
        },
      };

    case 'tetrahedral':
      return {
        cx: 180,
        cy: 118,
        bonds: [
          { x: 180, y: 38, label: atoms[0] || 'X', style: 'plain' },
          { x: 258, y: 152, label: atoms[1] || 'X', style: 'plain' },
          { x: 124, y: 174, label: atoms[2] || 'X', style: 'wedge' },
          { x: 106, y: 128, label: atoms[3] || 'X', style: 'dash' },
        ],
        lonePairs: [],
        centralDipoleOffset: { dx: -26, dy: -18 },
        angleArc: {
          d: 'M 180 82 A 36 36 0 0 1 212 134',
          tx: 222,
          ty: 96,
        },
      };

    case 'trigonal_pyramidal':
      return {
        cx: 180,
        cy: 114,
        bonds: [
          { x: 108, y: 148, label: atoms[0] || 'X', style: 'dash' },
          { x: 154, y: 182, label: atoms[1] || 'X', style: 'wedge' },
          { x: 256, y: 152, label: atoms[2] || 'X', style: 'plain' },
        ],
        lonePairs: [{ lx: 180, ly: 56 }],
        centralDipoleOffset: { dx: 27, dy: -14 },
        angleArc: {
          d: 'M 167 148 A 36 36 0 0 0 212 130',
          tx: 204,
          ty: 170,
        },
      };

    case 'bent':
      return {
        cx: 180,
        cy: 120,
        bonds: [
          { x: 112, y: 174, label: atoms[0] || 'X', style: 'plain' },
          { x: 248, y: 174, label: atoms[1] || 'X', style: 'plain' },
        ],
        lonePairs: [
          { lx: 136, ly: 66 },
          { lx: 224, ly: 66 },
        ],
        centralDipoleOffset: { dx: -30, dy: 2 },
        angleArc: {
          d: 'M 152 142 A 36 36 0 0 0 208 142',
          tx: 180,
          ty: 170,
        },
      };

    case 'trigonal_bipyramidal':
      return {
        cx: 180,
        cy: 116,
        bonds: [
          { x: 268, y: 116, label: atoms[0] || 'X', style: 'plain' },
          { x: 116, y: 142, label: atoms[1] || 'X', style: 'wedge' },
          { x: 132, y: 88, label: atoms[2] || 'X', style: 'dash' },
          { x: 180, y: 36, label: atoms[3] || 'X', style: 'plain' },
          { x: 180, y: 196, label: atoms[4] || 'X', style: 'plain' },
        ],
        lonePairs: [],
        centralDipoleOffset: { dx: 24, dy: 22 },
        angleArc: {
          d: 'M 180 78 A 38 38 0 0 1 218 116',
          tx: 230,
          ty: 82,
        },
      };

    case 'octahedral':
      return {
        cx: 180,
        cy: 116,
        bonds: [
          { x: 180, y: 34, label: atoms[0] || 'X', style: 'plain' },
          { x: 180, y: 198, label: atoms[1] || 'X', style: 'plain' },
          { x: 112, y: 140, label: atoms[2] || 'X', style: 'wedge' },
          { x: 248, y: 140, label: atoms[3] || 'X', style: 'wedge' },
          { x: 122, y: 92, label: atoms[4] || 'X', style: 'dash' },
          { x: 238, y: 92, label: atoms[5] || 'X', style: 'dash' },
        ],
        lonePairs: [],
        centralDipoleOffset: { dx: 0, dy: 34 },
        angleArc: {
          d: 'M 180 78 A 38 38 0 0 1 214 99',
          tx: 218,
          ty: 68,
        },
      };

    case 'square_planar':
    default:
      return {
        cx: 180,
        cy: 116,
        bonds: [
          { x: 110, y: 142, label: atoms[0] || 'X', style: 'wedge' },
          { x: 250, y: 142, label: atoms[1] || 'X', style: 'wedge' },
          { x: 120, y: 90, label: atoms[2] || 'X', style: 'dash' },
          { x: 240, y: 90, label: atoms[3] || 'X', style: 'dash' },
        ],
        lonePairs: [
          { lx: 180, ly: 52 },
          { lx: 180, ly: 180 },
        ],
        centralDipoleOffset: { dx: -30, dy: 4 },
        angleArc: {
          d: 'M 212 102 A 36 36 0 0 1 216 131',
          tx: 266,
          ty: 119,
        },
      };
  }
}

function MoleculeGeometrySVG({ molecule, showLonePairs, showAngle, showDipoles }) {
  const layout = useMemo(() => getShapeLayout(molecule), [molecule]);
  const { cx, cy, bonds, lonePairs, angleArc, centralDipoleOffset } = layout;

  const centralChi = ATOM_CHI[molecule.centralAtom] ?? 2.5;
  const avgOuterChi =
    bonds.reduce((sum, b) => sum + (ATOM_CHI[b.label] ?? 2.5), 0) / Math.max(1, bonds.length);
  const centralDeltaNeg = centralChi > avgOuterChi;

  const renderBond = (b, idx) => {
    const dx = b.x - cx;
    const dy = b.y - cy;
    const len = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;

    const sx = cx + ux * 18;
    const sy = cy + uy * 18;
    const ex = b.x - ux * 16;
    const ey = b.y - uy * 16;

    if (molecule.bondOrder === 2) {
      return (
        <g key={`bond-${idx}`}>
          <line x1={sx + px * 3} y1={sy + py * 3} x2={ex + px * 3} y2={ey + py * 3} stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
          <line x1={sx - px * 3} y1={sy - py * 3} x2={ex - px * 3} y2={ey - py * 3} stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    }

    if (b.style === 'wedge') {
      const p1x = sx + px * 1.4;
      const p1y = sy + py * 1.4;
      const p2x = sx - px * 1.4;
      const p2y = sy - py * 1.4;
      const p3x = ex - px * 6.5;
      const p3y = ey - py * 6.5;
      const p4x = ex + px * 6.5;
      const p4y = ey + py * 6.5;
      return (
        <polygon
          key={`bond-${idx}`}
          points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}`}
          fill="#334155"
        />
      );
    }

    if (b.style === 'dash') {
      const steps = 5;
      return (
        <g key={`bond-${idx}`}>
          {Array.from({ length: steps }).map((_, k) => {
            const t = (k + 1) / (steps + 1);
            const mx = sx + (ex - sx) * t;
            const my = sy + (ey - sy) * t;
            const w = 1.8 + t * 4.2;
            return (
              <line
                key={k}
                x1={mx - px * w}
                y1={my - py * w}
                x2={mx + px * w}
                y2={my + py * w}
                stroke="#475569"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      );
    }

    return (
      <line
        key={`bond-${idx}`}
        x1={sx}
        y1={sy}
        x2={ex}
        y2={ey}
        stroke="#334155"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
      <svg viewBox="0 0 360 230" className="w-full h-auto block select-none">
        {/* Optional Ion Brackets */}
        {molecule.isIon && (
          <g>
            <path d="M 68 28 L 54 28 L 54 202 L 68 202" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <path d="M 292 28 L 306 28 L 306 202 L 292 202" fill="none" stroke="#64748b" strokeWidth="2.5" />
            <text x="314" y="40" fontSize="15" fontWeight="900" fill="#326fa0">
              {molecule.charge}
            </text>
          </g>
        )}

        {/* Bonds */}
        {bonds.map((b, idx) => renderBond(b, idx))}

        {/* Lone Pairs */}
        {showLonePairs &&
          lonePairs.map((lp, idx) => {
            const dx = lp.lx - cx;
            const dy = lp.ly - cy;
            const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            const len = Math.max(1, Math.hypot(dx, dy));
            const ux = dx / len;
            const uy = dy / len;
            const px = -uy;
            const py = ux;
            const midX = cx + dx * 0.65;
            const midY = cy + dy * 0.65;
            const dotBaseX = cx + dx * 0.86;
            const dotBaseY = cy + dy * 0.86;
            return (
              <g key={`lp-${idx}`}>
                <ellipse
                  cx={midX}
                  cy={midY}
                  rx="24"
                  ry="14"
                  transform={`rotate(${angleDeg} ${midX} ${midY})`}
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <circle cx={dotBaseX + px * 4} cy={dotBaseY + py * 4} r="2.8" fill="#92400e" />
                <circle cx={dotBaseX - px * 4} cy={dotBaseY - py * 4} r="2.8" fill="#92400e" />
              </g>
            );
          })}

        {/* Angle Arc */}
        {showAngle && angleArc && (
          <g>
            <path d={angleArc.d} fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 2" />
            <text x={angleArc.tx} y={angleArc.ty} textAnchor="middle" fontSize="11" fontWeight="900" fill="#0369a1">
              {molecule.angle}
            </text>
          </g>
        )}

        {/* Central Atom */}
        <circle cx={cx} cy={cy} r="20" fill="#326fa0" stroke="#1e3a5f" strokeWidth="2" />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="900" fill="#ffffff">
          {molecule.centralAtom}
        </text>

        {/* Outer Atoms & Optional Polarity Tags */}
        {bonds.map((b, idx) => {
          const outerChi = ATOM_CHI[b.label] ?? 2.5;
          const diff = outerChi - centralChi;
          const dx = b.x - cx;
          const dy = b.y - cy;
          const len = Math.max(1, Math.hypot(dx, dy));
          const ux = dx / len;
          const uy = dy / len;

          return (
            <g key={`atom-${idx}`}>
              <circle cx={b.x} cy={b.y} r="16" fill="#ffffff" stroke="#334155" strokeWidth="2" />
              <text x={b.x} y={b.y + 4.5} textAnchor="middle" fontSize="12" fontWeight="900" fill="#0f172a">
                {b.label}
              </text>
              {showDipoles && !molecule.isIon && Math.abs(diff) >= 0.4 && (
                <text
                  x={b.x + ux * 23}
                  y={b.y + uy * 23 + 3}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                  fill={diff > 0 ? '#0284c7' : '#dc2626'}
                >
                  {diff > 0 ? 'δ⁻' : 'δ⁺'}
                </text>
              )}
            </g>
          );
        })}

        {/* Central dipole sign for neutral polar-bond molecules */}
        {showDipoles && !molecule.isIon && molecule.polarBondsPresent && (
          <text
            x={cx + (centralDipoleOffset?.dx || 0)}
            y={cy + (centralDipoleOffset?.dy || 0)}
            textAnchor="middle"
            fontSize="11"
            fontWeight="900"
            fill={centralDeltaNeg ? '#0284c7' : '#dc2626'}
          >
            {centralDeltaNeg ? 'δ⁻' : 'δ⁺'}
          </text>
        )}
      </svg>
    </div>
  );
}

export function VSEPRShapes({ onComplete }) {
  const { progress } = useProgress();

  const [activeTab, setActiveTab] = useState('trainer');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('becl2');

  // Stepper & Trainer Form State
  const [bpInput, setBpInput] = useState(0);
  const [lpInput, setLpInput] = useState(0);
  const [shapeInput, setShapeInput] = useState('');
  const [angleInput, setAngleInput] = useState('');
  const [polarityInput, setPolarityInput] = useState(null);
  const [ionOptInput, setIonOptInput] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Explorer toggles
  const [expMoleculeId, setExpMoleculeId] = useState('nh3');
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [showAngle, setShowAngle] = useState(true);
  const [showDipoles, setShowDipoles] = useState(true);

  const [completedIds, setCompletedIds] = useState(() => {
    const saved = progress['vsepr-shapes']?.solvedIds;
    return Array.isArray(saved) ? saved : [];
  });

  useEffect(() => {
    const saved = progress['vsepr-shapes']?.solvedIds;
    if (Array.isArray(saved)) {
      setCompletedIds((prev) => Array.from(new Set([...prev, ...saved])));
    }
  }, [progress]);

  const filteredMolecules = useMemo(() => {
    if (tierFilter === 'all') return VSEPR_MOLECULES;
    return VSEPR_MOLECULES.filter((m) => m.tier === tierFilter);
  }, [tierFilter]);

  const currentMolecule = useMemo(
    () =>
      filteredMolecules.find((m) => m.id === selectedId) ||
      filteredMolecules[0] ||
      VSEPR_MOLECULES[0],
    [filteredMolecules, selectedId]
  );

  const explorerMolecule = useMemo(
    () => VSEPR_MOLECULES.find((m) => m.id === expMoleculeId) || VSEPR_MOLECULES[0],
    [expMoleculeId]
  );

  const resetFormForSpecies = (nextId) => {
    setSelectedId(nextId);
    setBpInput(0);
    setLpInput(0);
    setShapeInput('');
    setAngleInput('');
    setPolarityInput(null);
    setIonOptInput(null);
    setShowHint(false);
    setFeedback(null);
  };

  const handleSelectTier = (tierId) => {
    setTierFilter(tierId);
    const list = tierId === 'all' ? VSEPR_MOLECULES : VSEPR_MOLECULES.filter((m) => m.tier === tierId);
    if (list.length > 0 && !list.some((m) => m.id === selectedId)) {
      resetFormForSpecies(list[0].id);
    }
  };

  const clearErrorBanner = () => {
    if (feedback && !feedback.isCorrect) {
      setFeedback(null);
    }
  };

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    const step3Missing = currentMolecule.isIon ? !ionOptInput : !polarityInput;
    if (bpInput === 0 || !shapeInput || !angleInput || step3Missing) {
      setFeedback({
        isCorrect: false,
        message: 'Please complete Step 1 (BP & LP), Step 2 (Shape & Bond Angle), and Step 3 before checking.',
      });
      return;
    }

    const bpOk = bpInput === currentMolecule.bp;
    const lpOk = lpInput === currentMolecule.lp;
    const shapeOk = shapeInput === currentMolecule.shapeId;
    const angleOk = angleInput === currentMolecule.angle;
    const step3Ok = currentMolecule.isIon
      ? ionOptInput === currentMolecule.ionQuestion.correctId
      : (polarityInput === 'polar') === currentMolecule.isPolar;

    if (bpOk && lpOk && shapeOk && angleOk && step3Ok) {
      setFeedback({
        isCorrect: true,
        message: `Spot on! ${currentMolecule.formula} has ${currentMolecule.bp} bonding region${
          currentMolecule.bp === 1 ? '' : 's'
        } and ${currentMolecule.lp} lone pair${
          currentMolecule.lp === 1 ? '' : 's'
        }, giving a ${SHAPE_OPTIONS.find((s) => s.id === currentMolecule.shapeId)?.label} geometry (${currentMolecule.angle}).`,
      });
      setCompletedIds((prev) =>
        prev.includes(currentMolecule.id) ? prev : [...prev, currentMolecule.id]
      );
      onComplete?.(currentMolecule.id);
      return;
    }

    const issues = [];
    if (!bpOk || !lpOk) {
      issues.push('Step 1: Re-count bonding regions and lone pairs from the central atom’s Group number (adjusting for any ionic charge).');
    }
    if (!shapeOk) {
      issues.push('Step 2: The shape name should match the positions of the bonded outer atoms.');
    }
    if (!angleOk) {
      issues.push('Step 2: Check the bond angle — remember lone pairs repel more strongly than bonding pairs (~2.5° compression each).');
    }
    if (!step3Ok) {
      issues.push(
        currentMolecule.isIon
          ? 'Step 3: Review how coordinate bonding or ionic charge affects lone pairs and bond equivalence.'
          : 'Step 3: Re-evaluate whole-molecule symmetry — do individual bond dipoles cancel out in 3D space?'
      );
    }

    setFeedback({
      isCorrect: false,
      message: issues.join(' '),
    });
  };

  const goNextSpecies = () => {
    const idx = filteredMolecules.findIndex((m) => m.id === currentMolecule.id);
    const next = filteredMolecules[(idx + 1) % filteredMolecules.length];
    if (next) resetFormForSpecies(next.id);
  };

  return (
    <div className="applet-container space-y-6" style={{ textTransform: 'none' }}>
      {/* Header */}
      <div className="applet-header !mb-0 flex-col sm:flex-row !justify-between">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-[#326fa0] border border-blue-200">
              WJEC Unit 1.4(b), (h)–(i)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            VSEPR Shapes, Bond Angles &amp; Polarity Trainer
          </h2>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
          Species Mastered:{' '}
          <span className="font-black text-emerald-700">
            {completedIds.length} / {VSEPR_MOLECULES.length}
          </span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[180px] px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
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

      {/* ==================== TAB 1: VSEPR TRAINER ==================== */}
      {activeTab === 'trainer' && (
        <div className="space-y-5">
          {/* Tier Filters & Species Chips */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {TIER_FILTERS.map((tf) => {
                const isSelected = tierFilter === tf.id;
                return (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => handleSelectTier(tf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#326fa0] text-white border-[#326fa0]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                    }`}
                  >
                    {tf.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {filteredMolecules.map((mol) => {
                const isCurrent = mol.id === currentMolecule.id;
                const isDone = completedIds.includes(mol.id);
                return (
                  <button
                    key={mol.id}
                    type="button"
                    onClick={() => resetFormForSpecies(mol.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-[#326fa0]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{mol.formula}</span>
                    {isDone && <span aria-label="Mastered">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Problem Form */}
          <form
            onSubmit={handleCheckAnswer}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm"
          >
            {/* Prompt Header + Hidden Hint */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
                  {currentMolecule.unitRef} • Central Atom: {currentMolecule.centralAtom} ({currentMolecule.centralGroup})
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  {currentMolecule.formula}{' '}
                  <span className="text-sm font-bold text-slate-500">({currentMolecule.name})</span>
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

            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-medium text-amber-950">
                <strong className="font-black text-amber-900">Hint: </strong>
                {currentMolecule.hint}
              </div>
            )}

            {/* Step 1: Bonding Regions & Lone Pairs Steppers */}
            <div className="space-y-2.5">
              <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                Step 1 — Deduce Electron Regions on Central Atom ({currentMolecule.centralAtom})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bonding Pairs Stepper */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-slate-800">Bonding Regions (BP)</div>
                    <div className="text-[11px] font-semibold text-slate-500">Multiple bonds count as 1 region</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBpInput((v) => Math.max(0, v - 1));
                        clearErrorBanner();
                      }}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-mono text-base font-black text-[#326fa0]">
                      {bpInput}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setBpInput((v) => Math.min(6, v + 1));
                        clearErrorBanner();
                      }}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Lone Pairs Stepper */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-slate-800">Lone Pairs (LP)</div>
                    <div className="text-[11px] font-semibold text-slate-500">Unshared pairs on central atom</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLpInput((v) => Math.max(0, v - 1));
                        clearErrorBanner();
                      }}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-mono text-base font-black text-amber-700">
                      {lpInput}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLpInput((v) => Math.min(3, v + 1));
                        clearErrorBanner();
                      }}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Shape Name & Bond Angle */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                Step 2 — Predict 3D Molecular Shape &amp; Bond Angle
              </div>
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500">Molecular Shape:</div>
                <div className="flex flex-wrap gap-1.5">
                  {SHAPE_OPTIONS.map((opt) => {
                    const isSelected = shapeInput === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setShapeInput(opt.id);
                          clearErrorBanner();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500">Bond Angle:</div>
                <div className="flex flex-wrap gap-1.5">
                  {ANGLE_OPTIONS.map((ang) => {
                    const isSelected = angleInput === ang;
                    return (
                      <button
                        key={ang}
                        type="button"
                        onClick={() => {
                          setAngleInput(ang);
                          clearErrorBanner();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                        }`}
                      >
                        {ang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Polarity OR Coordinate/Ion Reasoning */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                {currentMolecule.isIon
                  ? `Step 3 — ${currentMolecule.ionQuestion.prompt}`
                  : 'Step 3 — Overall Molecular Polarity'}
              </div>

              {!currentMolecule.isIon ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'polar', label: 'Polar molecule (net dipole — asymmetrical)' },
                    { id: 'nonpolar', label: 'Non-polar molecule (bond dipoles cancel by symmetry)' },
                  ].map((opt) => {
                    const checked = polarityInput === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          checked
                            ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`polarity-${currentMolecule.id}`}
                          checked={checked}
                          onChange={() => {
                            setPolarityInput(opt.id);
                            clearErrorBanner();
                          }}
                          className="mt-0.5 accent-[#326fa0]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {currentMolecule.ionQuestion.options.map((opt) => {
                    const checked = ionOptInput === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          checked
                            ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`ion-q-${currentMolecule.id}`}
                          checked={checked}
                          onChange={() => {
                            setIonOptInput(opt.id);
                            clearErrorBanner();
                          }}
                          className="mt-0.5 accent-[#326fa0]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit & Next Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#326fa0] hover:bg-[#255580] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Check Answer
              </button>

              <button
                type="button"
                onClick={goNextSpecies}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
              >
                Next Species &rarr;
              </button>
            </div>

            {/* Feedback & Unlocked 3D Solution */}
            {feedback && (
              <div
                className={`p-4 rounded-2xl border space-y-4 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="font-black text-sm">{feedback.message}</div>

                {feedback.isCorrect && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-5">
                      <MoleculeGeometrySVG
                        molecule={currentMolecule}
                        showLonePairs={true}
                        showAngle={true}
                        showDipoles={!currentMolecule.isIon}
                      />
                    </div>

                    <div className="lg:col-span-7 space-y-3">
                      <div className="bg-white/85 border border-emerald-200 rounded-xl p-3 space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
                          Valence Electron Count Breakdown
                        </div>
                        <ul className="list-disc list-inside text-xs font-semibold text-slate-700 space-y-1">
                          {currentMolecule.electronCountSteps.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/85 border border-emerald-200 rounded-xl p-3 space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                          Official WJEC Mark-Scheme Points
                        </div>
                        <ul className="list-disc list-inside text-xs font-bold text-slate-800 space-y-1">
                          {currentMolecule.markScheme.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-xs font-semibold text-amber-950 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <strong className="font-black text-rose-700">WJEC Examiner Pitfall: </strong>
                        {currentMolecule.examinerPitfall}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {/* ==================== TAB 2: 3D GEOMETRY EXPLORER ==================== */}
      {activeTab === 'explorer' && (
        <div className="space-y-5">
          {/* Species Catalogue Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Select Any WJEC Molecule or Ion to Inspect in 3D
            </div>
            <div className="flex flex-wrap gap-1.5">
              {VSEPR_MOLECULES.map((mol) => {
                const isSelected = mol.id === explorerMolecule.id;
                return (
                  <button
                    key={mol.id}
                    type="button"
                    onClick={() => setExpMoleculeId(mol.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                    }`}
                  >
                    {mol.formula}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: 3D Wedge-Dash Diagram & Layer Toggles */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#326fa0]">
                    {explorerMolecule.unitRef}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {explorerMolecule.formula} — {SHAPE_OPTIONS.find((s) => s.id === explorerMolecule.shapeId)?.label}
                  </h3>
                </div>
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-blue-50 text-[#326fa0] border border-blue-200">
                  {explorerMolecule.angle}
                </span>
              </div>

              <MoleculeGeometrySVG
                molecule={explorerMolecule}
                showLonePairs={showLonePairs}
                showAngle={showAngle}
                showDipoles={showDipoles}
              />

              {/* Interactive Overlay Toggles */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: 'Show Lone Pairs', val: showLonePairs, setVal: setShowLonePairs },
                  { label: 'Show Bond Angle', val: showAngle, setVal: setShowAngle },
                  { label: 'Show δ⁺/δ⁻ Polarity', val: showDipoles, setVal: setShowDipoles },
                ].map((tg) => (
                  <label
                    key={tg.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={tg.val}
                      onChange={(e) => tg.setVal(e.target.checked)}
                      className="accent-[#326fa0]"
                    />
                    <span>{tg.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Right: Electron Pair Metrics, Repulsion Hierarchy & Notes */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-white border border-slate-200 rounded-2xl p-3">
                  <div className="text-[10px] font-black uppercase text-slate-400">Bonding (BP)</div>
                  <div className="text-xl font-black text-[#326fa0] font-mono">{explorerMolecule.bp}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3">
                  <div className="text-[10px] font-black uppercase text-slate-400">Lone Pairs (LP)</div>
                  <div className="text-xl font-black text-amber-700 font-mono">{explorerMolecule.lp}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3">
                  <div className="text-[10px] font-black uppercase text-slate-400">Total Regions</div>
                  <div className="text-xl font-black text-slate-800 font-mono">
                    {explorerMolecule.bp + explorerMolecule.lp}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Polarity &amp; Structure Summary
                  </span>
                  {!explorerMolecule.isIon ? (
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        explorerMolecule.isPolar
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {explorerMolecule.isPolar ? 'Polar Molecule (Net Dipole)' : 'Non-Polar (Symmetrical)'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-800 border-indigo-200">
                      Charged Ion ({explorerMolecule.charge})
                    </span>
                  )}
                </div>

                <ul className="list-disc list-inside text-xs sm:text-sm font-medium text-slate-700 space-y-1">
                  {explorerMolecule.electronCountSteps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                  VSEPR Repulsion Rule (WJEC 1.4(h))
                </div>
                <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
                  Repulsion strength order: <strong>LP–LP &gt; LP–BP &gt; BP–BP</strong>. For tetrahedral electron sets (4 regions), each lone pair reduces the remaining bonding angle by roughly 2.5° (109.5° → 107° → 104.5°).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VSEPRShapes;
