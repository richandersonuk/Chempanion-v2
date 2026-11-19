import React, { useState, useRef, useMemo } from 'react';

/**
 * Compute a smooth perpendicular quadratic Bézier midpoint so drawn curly
 * arrows always have an authentic curved profile by default.
 */
const computeDefaultMid = (start, end, flip = -1) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.hypot(dx, dy) || 1;
  const offset = Math.min(48, Math.max(24, len * 0.34)) * flip;
  return {
    x: (start.x + end.x) / 2 + (-dy / len) * offset,
    y: (start.y + end.y) / 2 + (dx / len) * offset,
  };
};

/**
 * Reflect a Bézier control point across the chord line between start and end.
 */
const flipMidAcrossChord = (start, mid, end) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1) return mid;
  const t = ((mid.x - start.x) * dx + (mid.y - start.y) * dy) / lenSq;
  const projX = start.x + t * dx;
  const projY = start.y + t * dy;
  return {
    x: 2 * projX - mid.x,
    y: 2 * projY - mid.y,
  };
};

/**
 * Trim the visual start and end of a curly arrow slightly so the path and
 * arrowhead sit neatly beside atom symbols instead of covering text.
 */
const getTrimmedArrowEndpoints = (arrow, elementsMap) => {
  const fromEl = elementsMap[arrow.fromId];
  const toEl = elementsMap[arrow.toId];

  const startTrim = fromEl?.display && fromEl.kind === 'atom' ? 10 : fromEl?.kind === 'lone_pair' ? 7 : 3;
  const endTrim = toEl?.display && toEl.kind === 'atom' ? 12 : toEl?.kind === 'ring' ? 4 : 6;

  const sDx = arrow.mid.x - arrow.start.x;
  const sDy = arrow.mid.y - arrow.start.y;
  const sLen = Math.hypot(sDx, sDy) || 1;

  const eDx = arrow.end.x - arrow.mid.x;
  const eDy = arrow.end.y - arrow.mid.y;
  const eLen = Math.hypot(eDx, eDy) || 1;

  return {
    visStart: {
      x: arrow.start.x + (sDx / sLen) * startTrim,
      y: arrow.start.y + (sDy / sLen) * startTrim,
    },
    visEnd: {
      x: arrow.end.x - (eDx / eLen) * endTrim,
      y: arrow.end.y - (eDy / eLen) * endTrim,
    },
  };
};

/**
 * Render a single, double, or triple covalent bond line cleanly.
 */
const StaticBond = ({ bond }) => {
  const order = bond.order || 1;
  const dx = bond.x2 - bond.x1;
  const dy = bond.y2 - bond.y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const stroke = bond.dashed ? '#64748b' : '#334155';
  const dash = bond.dashed ? '4 3' : undefined;

  if (order === 1) {
    return (
      <line
        x1={bond.x1}
        y1={bond.y1}
        x2={bond.x2}
        y2={bond.y2}
        stroke={stroke}
        strokeWidth={bond.strokeWidth || 2.8}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    );
  }

  const offsets = order === 2 ? [-2.6, 2.6] : [-3.8, 0, 3.8];
  return (
    <g>
      {offsets.map((off, idx) => (
        <line
          key={idx}
          x1={bond.x1 + nx * off}
          y1={bond.y1 + ny * off}
          x2={bond.x2 + nx * off}
          y2={bond.y2 + ny * off}
          stroke={stroke}
          strokeWidth={order === 3 ? 2.1 : 2.5}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

/**
 * Shared multi-stage organic mechanism trainer supporting:
 * - Dipole & charge assignment (click-to-cycle + paint bar)
 * - Dual-mode curly arrow drawing (drag-and-drop OR tap-to-connect)
 * - Multi-arrow steps, curve flipping, arrow chips & misconception diagnostics
 * - Exam conceptual checkpoints & WJEC mark-scheme summaries
 */
const MechanismTrainer = ({
  headerTitle,
  selectorPrefix = 'Mechanism',
  problems = [],
  onComplete,
}) => {
  const [problemIndex, setProblemIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepPassed, setStepPassed] = useState(false);
  const [mechanismDone, setMechanismDone] = useState(false);
  const [solvedIds, setSolvedIds] = useState(() => new Set());

  // Dipole stage state
  const [dipoleStates, setDipoleStates] = useState({});
  const [paintBrush, setPaintBrush] = useState('cycle'); // 'cycle' | 'plus' | 'minus' | 'erase'

  // Arrow stage state
  const [arrows, setArrows] = useState([]);
  const [selectedArrowId, setSelectedArrowId] = useState(null);
  const [pendingTail, setPendingTail] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Choice stage state
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Feedback & hint state
  const [feedback, setFeedback] = useState({ message: '', status: '' });
  const [showHint, setShowHint] = useState(false);

  const svgRef = useRef(null);

  const currentProblem = problems[problemIndex];
  const currentStep = currentProblem?.steps?.[stepIndex];

  const elementsMap = useMemo(() => {
    const map = {};
    if (currentStep?.elements) {
      currentStep.elements.forEach((el) => {
        map[el.id] = el;
      });
    }
    return map;
  }, [currentStep]);

  const resetStepState = () => {
    setStepPassed(false);
    setDipoleStates({});
    setPaintBrush('cycle');
    setArrows([]);
    setSelectedArrowId(null);
    setPendingTail(null);
    setDragState(null);
    setHoveredNodeId(null);
    setSelectedChoice(null);
    setFeedback({ message: '', status: '' });
    setShowHint(false);
  };

  const selectProblem = (nextIndex) => {
    setProblemIndex(nextIndex);
    setStepIndex(0);
    setMechanismDone(false);
    resetStepState();
  };

  const advanceStep = () => {
    if (!currentProblem) return;
    if (stepIndex + 1 < currentProblem.steps.length) {
      setStepIndex((prev) => prev + 1);
      resetStepState();
    } else {
      setMechanismDone(true);
      setSolvedIds((prev) => {
        const next = new Set(prev);
        next.add(currentProblem.completionId);
        return next;
      });
      onComplete?.(currentProblem.completionId);
    }
  };

  const getSVGCoords = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return pt.matrixTransform(ctm.inverse());
  };

  const findHotspotAt = (x, y, filterFn = null) => {
    if (!currentStep?.elements) return null;
    let best = null;
    let bestScore = Infinity;

    currentStep.elements.forEach((el) => {
      if (filterFn && !filterFn(el)) return;
      const hitRadius = (el.r || 20) + 6;
      const dist = Math.hypot(x - el.cx, y - el.cy);
      if (dist <= hitRadius) {
        const normalized = dist / hitRadius;
        if (normalized < bestScore) {
          bestScore = normalized;
          best = el;
        }
      }
    });

    return best;
  };

  const resolveTailNode = (node) => {
    if (node?.aliasTo && elementsMap[node.aliasTo]) {
      return elementsMap[node.aliasTo];
    }
    return node;
  };

  const resolveAliasId = (id) => {
    const el = elementsMap[id];
    return el?.aliasTo && elementsMap[el.aliasTo] ? el.aliasTo : id;
  };

  // --- DIPOLES HANDLERS ---
  const handleDipoleTap = (el) => {
    if (stepPassed || !el.dipoleCandidate) return;
    setFeedback({ message: '', status: '' });
    const allowMinus = currentStep.chargeStyle !== 'formal_plus_only';

    setDipoleStates((prev) => {
      const curr = prev[el.id] || null;
      let next = null;
      if (paintBrush === 'erase') {
        next = null;
      } else if (paintBrush === 'plus') {
        next = curr === 'plus' ? null : 'plus';
      } else if (paintBrush === 'minus' && allowMinus) {
        next = curr === 'minus' ? null : 'minus';
      } else {
        if (!curr) next = 'plus';
        else if (curr === 'plus' && allowMinus) next = 'minus';
        else next = null;
      }
      return { ...prev, [el.id]: next };
    });
  };

  const verifyDipoles = () => {
    const expected = currentStep.correctDipoles || {};
    const expectedKeys = Object.keys(expected);
    const assignedKeys = Object.keys(dipoleStates).filter((k) => Boolean(dipoleStates[k]));

    if (assignedKeys.length === 0) {
      setFeedback({
        message: 'Tap the dashed atom rings on the diagram to assign the required partial dipoles or charges.',
        status: 'error',
      });
      return;
    }

    const allExpectedCorrect = expectedKeys.every((k) => dipoleStates[k] === expected[k]);
    const noExtraAssigned = assignedKeys.every((k) => expected[k] === dipoleStates[k]);

    if (allExpectedCorrect && noExtraAssigned) {
      setStepPassed(true);
      setFeedback({
        message: currentStep.successFeedback || 'Dipoles verified! Ready for the next step.',
        status: 'success',
      });
      return;
    }

    if (currentStep.customDiagnostic) {
      const customMsg = currentStep.customDiagnostic(dipoleStates);
      if (customMsg) {
        setFeedback({ message: customMsg, status: 'error' });
        return;
      }
    }

    const extraKeys = assignedKeys.filter((k) => !expected[k]);
    const swapped =
      expectedKeys.length >= 2 &&
      expectedKeys.every((k) => dipoleStates[k] && dipoleStates[k] !== expected[k]);

    if (swapped) {
      setFeedback({
        message: 'WJEC Precision Check: Your δ⁺ and δ⁻ charges are swapped! Check which atom has higher electronegativity (or where electrons are repelled).',
        status: 'error',
      });
    } else if (extraKeys.length > 0) {
      setFeedback({
        message: 'Check for non-polar bonds: remove any dipole badges from atoms that do not carry a significant δ⁺ / δ⁻ or formal charge.',
        status: 'error',
      });
    } else {
      setFeedback({
        message: 'Partial match — make sure every required polarised site has the correct charge assigned.',
        status: 'error',
      });
    }
  };

  // --- CURLY ARROWS HANDLERS ---
  const createArrowBetween = (fromNode, toNode) => {
    const maxAllowed = Math.max(2, (currentStep.requiredArrows || []).length);
    const matchedReq = (currentStep.requiredArrows || []).find(
      (r) => r.from === fromNode.id && r.to === toNode.id
    );
    const flip = matchedReq?.defaultFlip ?? currentStep.defaultFlip ?? -1;

    const newArrow = {
      id: `${fromNode.id}->${toNode.id}-${Date.now()}`,
      fromId: fromNode.id,
      toId: toNode.id,
      start: { x: fromNode.cx, y: fromNode.cy },
      mid: computeDefaultMid({ x: fromNode.cx, y: fromNode.cy }, { x: toNode.cx, y: toNode.cy }, flip),
      end: { x: toNode.cx, y: toNode.cy },
      status: 'neutral',
    };

    setArrows((prev) => {
      // Avoid exact duplicate source->target
      const deduped = prev.filter((a) => !(a.fromId === newArrow.fromId && a.toId === newArrow.toId));
      if (deduped.length >= maxAllowed) {
        // Replace first error arrow if one exists, otherwise replace oldest
        const errIdx = deduped.findIndex((a) => a.status === 'error');
        if (errIdx !== -1) {
          const copy = [...deduped];
          copy[errIdx] = newArrow;
          return copy;
        }
        return [...deduped.slice(1), newArrow];
      }
      return [...deduped, newArrow];
    });

    setSelectedArrowId(newArrow.id);
    setFeedback({ message: '', status: '' });
  };

  const handleCanvasPointerDown = (e) => {
    if (!currentStep || stepPassed) return;
    if (e.cancelable) e.preventDefault();
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable in synthetic test events
    }

    const { x, y } = getSVGCoords(e);

    if (currentStep.type === 'dipoles') {
      const hit = findHotspotAt(x, y, (el) => el.dipoleCandidate);
      if (hit) handleDipoleTap(hit);
      return;
    }

    if (currentStep.type === 'arrows') {
      // 1. Check midpoint control handles on existing arrows first
      for (let i = arrows.length - 1; i >= 0; i--) {
        const a = arrows[i];
        if (Math.hypot(x - a.mid.x, y - a.mid.y) <= 16) {
          setSelectedArrowId(a.id);
          setPendingTail(null);
          setDragState({ mode: 'handle', arrowId: a.id });
          return;
        }
      }

      // 2. Check hotspot targets
      const rawHit = findHotspotAt(x, y, (el) => !el.disabled);
      if (!rawHit) {
        setPendingTail(null);
        return;
      }

      if (pendingTail) {
        // If user taps the same tail node again, cancel selection
        const resolvedTapId = resolveAliasId(rawHit.id);
        if (rawHit.id === pendingTail.id || resolvedTapId === pendingTail.id) {
          setPendingTail(null);
          return;
        }
        // Complete tap-to-connect arrow!
        createArrowBetween(pendingTail, rawHit);
        setPendingTail(null);
        return;
      }

      const tailNode = resolveTailNode(rawHit);
      const flip = currentStep.defaultFlip ?? -1;
      setDragState({
        mode: 'new',
        fromNode: tailNode,
        start: { x: tailNode.cx, y: tailNode.cy },
        mid: computeDefaultMid({ x: tailNode.cx, y: tailNode.cy }, { x, y }, flip),
        end: { x, y },
        pointerStart: { x, y },
        snappedEndNode: null,
      });
    }
  };

  const handleCanvasPointerMove = (e) => {
    if (!currentStep) return;
    const { x, y } = getSVGCoords(e);

    const hoverFilter =
      currentStep.type === 'dipoles'
        ? (el) => el.dipoleCandidate
        : (el) => !el.disabled;
    const hovered = findHotspotAt(x, y, hoverFilter);
    setHoveredNodeId(hovered ? hovered.id : null);

    if (!dragState || stepPassed) return;
    if (e.cancelable) e.preventDefault();

    if (dragState.mode === 'handle') {
      setArrows((prev) =>
        prev.map((a) => (a.id === dragState.arrowId ? { ...a, mid: { x, y }, status: 'neutral' } : a))
      );
      return;
    }

    if (dragState.mode === 'new') {
      const snapEnd =
        hovered && hovered.id !== dragState.fromNode.id && resolveAliasId(hovered.id) !== dragState.fromNode.id
          ? hovered
          : null;
      const targetPt = snapEnd ? { x: snapEnd.cx, y: snapEnd.cy } : { x, y };
      const matchedReq = (currentStep.requiredArrows || []).find(
        (r) => r.from === dragState.fromNode.id && snapEnd && r.to === snapEnd.id
      );
      const flip = matchedReq?.defaultFlip ?? currentStep.defaultFlip ?? -1;

      setDragState((prev) => ({
        ...prev,
        end: targetPt,
        mid: computeDefaultMid(prev.start, targetPt, flip),
        snappedEndNode: snapEnd,
      }));
    }
  };

  const handleCanvasPointerUp = (e) => {
    if (!dragState) return;
    if (e.cancelable) e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }

    const { x, y } = getSVGCoords(e);

    if (dragState.mode === 'handle') {
      setDragState(null);
      return;
    }

    if (dragState.mode === 'new') {
      const moved = Math.hypot(x - dragState.pointerStart.x, y - dragState.pointerStart.y);
      const endNode = findHotspotAt(x, y, (el) => !el.disabled);

      if (
        moved < 9 ||
        (endNode && (endNode.id === dragState.fromNode.id || resolveAliasId(endNode.id) === dragState.fromNode.id) && moved < 16)
      ) {
        // Tap-to-connect activation
        setPendingTail(dragState.fromNode);
        setDragState(null);
        setFeedback({ message: '', status: '' });
        return;
      }

      if (endNode && endNode.id !== dragState.fromNode.id) {
        createArrowBetween(dragState.fromNode, endNode);
      } else {
        setFeedback({
          message: 'Drag onto a target atom, bond, or ring hotspot (or tap source then tap target).',
          status: 'error',
        });
      }
      setDragState(null);
    }
  };

  const flipArrowCurve = (arrowId) => {
    if (stepPassed) return;
    setArrows((prev) =>
      prev.map((a) =>
        a.id === arrowId ? { ...a, mid: flipMidAcrossChord(a.start, a.mid, a.end), status: 'neutral' } : a
      )
    );
  };

  const removeArrow = (arrowId) => {
    if (stepPassed) return;
    setArrows((prev) => prev.filter((a) => a.id !== arrowId));
    if (selectedArrowId === arrowId) setSelectedArrowId(null);
    setFeedback({ message: '', status: '' });
  };

  const verifyArrows = () => {
    const required = currentStep.requiredArrows || [];
    if (arrows.length === 0) {
      setFeedback({
        message: 'Draw your curly arrow(s) on the canvas first — drag from source to target, or tap source then tap target.',
        status: 'error',
      });
      return;
    }

    // 1. Check curvature of all drawn arrows
    const straightArrow = arrows.find((a) => {
      const chord = Math.hypot(a.end.x - a.start.x, a.end.y - a.start.y) || 1;
      const cross = Math.abs(
        (a.end.y - a.start.y) * a.mid.x -
          (a.end.x - a.start.x) * a.mid.y +
          a.end.x * a.start.y -
          a.end.y * a.start.x
      );
      return cross / chord < 10;
    });

    if (straightArrow) {
      setArrows((prev) => prev.map((a) => (a.id === straightArrow.id ? { ...a, status: 'error' } : a)));
      setFeedback({
        message: 'WJEC Precision Check: Curly arrows must be clearly curved to represent electron-pair movement. Drag the midpoint handle to curve it.',
        status: 'error',
      });
      return;
    }

    // 2. Evaluate each arrow against required list and trap diagnostics together
    let reversedFound = false;
    let firstTrapMsg = null;
    const trapChecks = currentStep.trapChecks || [];
    const matchedIndices = new Set();

    const evaluatedArrows = arrows.map((a) => {
      const triggeredTrap = trapChecks.find((trap) => trap.match(a));
      if (triggeredTrap) {
        if (!firstTrapMsg) firstTrapMsg = triggeredTrap.message;
        return { ...a, status: 'error' };
      }

      const normFrom = resolveAliasId(a.fromId);
      const normTo = resolveAliasId(a.toId);

      const reqIdx = required.findIndex(
        (req, idx) => !matchedIndices.has(idx) && req.from === normFrom && (req.to === a.toId || req.to === normTo)
      );
      if (reqIdx !== -1) {
        matchedIndices.add(reqIdx);
        return { ...a, status: 'correct' };
      }

      const isReversed = required.some(
        (req) => (req.from === a.toId || req.from === normTo) && (req.to === a.fromId || req.to === normFrom)
      );
      if (isReversed) reversedFound = true;

      return { ...a, status: 'error' };
    });

    setArrows(evaluatedArrows);

    if (firstTrapMsg) {
      setFeedback({ message: firstTrapMsg, status: 'error' });
      return;
    }

    if (matchedIndices.size === required.length && evaluatedArrows.length === required.length) {
      setStepPassed(true);
      setFeedback({
        message: currentStep.successFeedback || 'Excellent! Electron-pair movement is completely accurate.',
        status: 'success',
      });
      return;
    }

    if (reversedFound) {
      setFeedback({
        message: 'WJEC Examiner Trap: One of your curly arrows points backwards! Arrows must always start at the electron pair (lone pair or bond) and point toward the electron-deficient sink.',
        status: 'error',
      });
      return;
    }

    if (matchedIndices.size > 0 && matchedIndices.size < required.length) {
      setFeedback({
        message: 'First curly arrow correct (✓)! Another curly arrow is still needed to complete this step (use "💡 Need a Hint?" if stuck).',
        status: 'error',
      });
      return;
    }

    setFeedback({
      message: currentStep.errorFeedback || 'Check where your electron pair starts and ends. Remember: tails start strictly on a lone pair (••) or bond line, never on a δ⁺ atom.',
      status: 'error',
    });
  };

  // --- CHOICE HANDLER ---
  const verifyChoice = () => {
    if (!selectedChoice) {
      setFeedback({ message: 'Select an option above before checking your answer.', status: 'error' });
      return;
    }
    const chosen = (currentStep.options || []).find((o) => o.id === selectedChoice);
    if (!chosen) return;

    if (chosen.isCorrect) {
      setStepPassed(true);
      setFeedback({ message: chosen.feedback, status: 'success' });
    } else {
      setFeedback({ message: chosen.feedback, status: 'error' });
    }
  };

  if (!currentProblem || !currentStep) return null;

  const isArrowsStep = currentStep.type === 'arrows';
  const isDipolesStep = currentStep.type === 'dipoles';
  const isChoiceStep = currentStep.type === 'choice';

  const hoveredEl = hoveredNodeId ? elementsMap[hoveredNodeId] : null;
  const activeTailForHint = pendingTail || (dragState?.mode === 'new' ? dragState.fromNode : null);

  // Merge fixed dipoles from prior step with interactive dipoleStates
  const displayedDipoles = isDipolesStep
    ? dipoleStates
    : currentStep.fixedDipoles || {};

  const arrowStrokeColor = (status) => {
    if (status === 'correct') return '#059669';
    if (status === 'error') return '#dc2626';
    return '#d97706';
  };

  const arrowMarkerUrl = (status) => {
    if (status === 'correct') return 'url(#mech-arrowhead-green)';
    if (status === 'error') return 'url(#mech-arrowhead-red)';
    return 'url(#mech-arrowhead-amber)';
  };

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      <div className="applet-header" style={{ textTransform: 'none' }}>
        {headerTitle}
      </div>

      {/* Mechanism Selector */}
      <div className="w-full flex justify-center gap-1.5 mb-4 flex-wrap">
        {problems.map((prob, idx) => {
          const isCurrent = idx === problemIndex;
          const isSolved = solvedIds.has(prob.completionId);
          return (
            <button
              key={prob.completionId}
              type="button"
              onClick={() => selectProblem(idx)}
              className={`px-3 py-1.5 text-[11px] font-black rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-[#235478] border-[#235478] text-white shadow-sm'
                  : isSolved
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{prob.shortLabel || `${selectorPrefix} ${idx + 1}`}</span>
              {isSolved && <span aria-label="Completed">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Title & Reagents Banner */}
      <div className="w-full max-w-2xl mx-auto mb-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-left">
          <div className="text-xs sm:text-sm font-black text-slate-800">{currentProblem.title}</div>
          {currentProblem.subtitle && (
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{currentProblem.subtitle}</div>
          )}
        </div>
        {currentProblem.reagents && (
          <span className="inline-block self-start sm:self-center text-[10px] font-bold bg-blue-50 text-[#235478] border border-blue-200 px-2.5 py-1 rounded-lg shrink-0">
            {currentProblem.reagents}
          </span>
        )}
      </div>

      {/* Stage Stepper */}
      <div className="w-full max-w-2xl mx-auto mb-4 flex items-center justify-center gap-1.5 flex-wrap">
        {currentProblem.steps.map((step, idx) => {
          const isCompleted = mechanismDone || idx < stepIndex || (idx === stepIndex && stepPassed);
          const isActive = !mechanismDone && idx === stepIndex && !stepPassed;
          return (
            <div
              key={step.id}
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all flex items-center gap-1 ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isActive
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              <span>{isCompleted ? '✓' : idx + 1}</span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Prompt & Hint Bar */}
      <div className="w-full max-w-2xl mx-auto mb-3 text-center px-2">
        <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
          {mechanismDone ? 'Mechanism Complete — WJEC Mark-Scheme Breakdown' : currentStep.prompt}
        </p>

        {!mechanismDone && currentStep.hint && (
          <div className="mt-2 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              {showHint ? 'Hide Hint ▲' : '💡 Need a Hint?'}
            </button>
            {showHint && (
              <div className="mt-2 max-w-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-medium rounded-xl px-3.5 py-2 leading-snug">
                {currentStep.hint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* COMPLETION SUMMARY VIEW */}
      {mechanismDone ? (
        <div className="w-full max-w-2xl mx-auto my-4 bg-emerald-50/60 border border-emerald-200 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
              ★ Full Mark-Scheme Summary
            </span>
            <span className="text-[11px] font-bold bg-white text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {currentProblem.steps.length} / {currentProblem.steps.length} Stages Passed
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed text-left">
            {currentProblem.summary}
          </p>

          {currentProblem.markScheme && (
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 space-y-2 text-left">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                WJEC Examiner Mark Points
              </div>
              <ul className="space-y-1.5">
                {currentProblem.markScheme.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <span className="text-emerald-600 font-black shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="button-group pt-1">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => selectProblem((problemIndex + 1) % problems.length)}
            >
              Next Mechanism &rarr;
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => selectProblem(problemIndex)}
            >
              Practise Again ↺
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* DIPOLE PAINT BAR (Dipoles step only) */}
          {isDipolesStep && (
            <div className="w-full max-w-xl mx-auto mb-3 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1">
                Tool:
              </span>
              {[
                { id: 'cycle', label: 'Tap to Cycle' },
                { id: 'plus', label: currentStep.chargeStyle === 'formal_plus_only' ? 'Paint +' : 'Paint δ⁺' },
                ...(currentStep.chargeStyle === 'formal_plus_only' ? [] : [{ id: 'minus', label: 'Paint δ⁻' }]),
                { id: 'erase', label: 'Eraser' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setPaintBrush(tool.id)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    paintBrush === tool.id
                      ? 'bg-[#235478] border-[#235478] text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          )}

          {/* ARROW INTERACTION STATUS BAR (Arrows step only) */}
          {isArrowsStep && (
            <div className="w-full max-w-xl mx-auto mb-2.5 flex items-center justify-between gap-2 flex-wrap px-2">
              <div className="text-[11px] font-bold text-slate-600">
                {activeTailForHint ? (
                  <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-block">
                    Tail locked: <strong>{activeTailForHint.label}</strong> — tap target or release drag
                  </span>
                ) : hoveredEl ? (
                  <span className="text-[#235478] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg inline-block">
                    Target: <strong>{hoveredEl.label}</strong>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Drag from source &rarr; target, or tap source then tap target
                  </span>
                )}
              </div>

              <span className="text-[11px] font-black bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                Arrows drawn: {arrows.length}
              </span>
            </div>
          )}

          {/* INTERACTIVE SVG MECHANISM CANVAS */}
          {currentStep.elements && (
            <div className="w-full max-w-xl mx-auto my-2 bg-white border border-slate-200 rounded-3xl p-3 sm:p-4 shadow-sm relative flex flex-col items-center select-none overflow-hidden h-[250px] sm:h-[290px] touch-none">
              <div
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onPointerLeave={() => setHoveredNodeId(null)}
                className="w-full h-full relative overflow-visible touch-none cursor-crosshair"
              >
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  viewBox={currentStep.viewBox || '0 0 340 200'}
                  className="overflow-visible select-none pointer-events-auto"
                >
                  <defs>
                    <marker id="mech-arrowhead-amber" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#d97706" />
                    </marker>
                    <marker id="mech-arrowhead-green" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#059669" />
                    </marker>
                    <marker id="mech-arrowhead-red" markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#dc2626" />
                    </marker>
                  </defs>

                  {/* Static bonds */}
                  {(currentStep.staticBonds || []).map((bond, idx) => (
                    <StaticBond key={idx} bond={bond} />
                  ))}

                  {/* Custom static SVG decorators (aromatic rings, Wheland horseshoes, group labels, charges) */}
                  {currentStep.staticDecorators ? currentStep.staticDecorators() : null}

                  {/* Interactive hotspot rings */}
                  {currentStep.elements.map((el) => {
                    const isDipoleCandidate = isDipolesStep && el.dipoleCandidate;
                    const isArrowHotspot = isArrowsStep && !el.disabled;
                    const isHovered = hoveredNodeId === el.id;
                    const isPendingTail = pendingTail?.id === el.id;
                    const isSnapEnd = dragState?.mode === 'new' && dragState.snappedEndNode?.id === el.id;
                    const dipoleVal = displayedDipoles[el.id];

                    return (
                      <g key={el.id}>
                        {/* Invisible generous hit circle */}
                        <circle cx={el.cx} cy={el.cy} r={el.r || 20} fill="transparent" />

                        {/* Visual hotspot affordance */}
                        {(isDipoleCandidate || isArrowHotspot) && (
                          <circle
                            cx={el.cx}
                            cy={el.cy}
                            r={el.kind === 'bond' || el.kind === 'ring' ? 12 : el.kind === 'lone_pair' ? 11 : 14}
                            fill={
                              isPendingTail || isSnapEnd
                                ? 'rgba(245, 158, 11, 0.22)'
                                : isHovered
                                ? 'rgba(35, 84, 120, 0.12)'
                                : el.kind === 'lone_pair'
                                ? 'rgba(254, 243, 199, 0.5)'
                                : 'transparent'
                            }
                            stroke={
                              isPendingTail || isSnapEnd
                                ? '#d97706'
                                : isHovered
                                ? '#235478'
                                : isDipoleCandidate
                                ? '#94a3b8'
                                : el.kind === 'bond' || el.kind === 'ring'
                                ? 'rgba(100, 116, 139, 0.45)'
                                : 'rgba(148, 163, 184, 0.35)'
                            }
                            strokeWidth={isPendingTail || isSnapEnd || isHovered ? 2 : 1.4}
                            strokeDasharray={isPendingTail || isSnapEnd ? undefined : '3 3'}
                            className="pointer-events-none transition-all"
                          />
                        )}

                        {/* Element symbol or lone pair display */}
                        {el.display && (
                          <text
                            x={el.cx}
                            y={el.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`${el.style || 'fill-slate-800 font-sans text-sm font-black'} select-none pointer-events-none`}
                          >
                            {el.display}
                          </text>
                        )}

                        {/* Dipole / Charge Badge */}
                        {dipoleVal && (
                          <g
                            transform={`translate(${el.badgeOffset?.dx ?? 14}, ${el.badgeOffset?.dy ?? -14})`}
                            className="pointer-events-none"
                          >
                            <circle
                              cx={el.cx}
                              cy={el.cy}
                              r="9.5"
                              fill="white"
                              stroke={dipoleVal === 'plus' ? '#2563eb' : '#e11d48'}
                              strokeWidth="2"
                            />
                            <text
                              x={el.cx}
                              y={el.cy}
                              textAnchor="middle"
                              dominantBaseline="central"
                              className={`text-[9.5px] font-sans font-black ${
                                dipoleVal === 'plus' ? 'fill-blue-600' : 'fill-rose-600'
                              }`}
                            >
                              {currentStep.chargeStyle === 'formal_plus_only'
                                ? '+'
                                : dipoleVal === 'plus'
                                ? 'δ⁺'
                                : 'δ⁻'}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Placed Curly Arrows */}
                  {isArrowsStep &&
                    arrows.map((arrow) => {
                      const { visStart, visEnd } = getTrimmedArrowEndpoints(arrow, elementsMap);
                      const color = arrowStrokeColor(arrow.status);
                      const isSelected = selectedArrowId === arrow.id;
                      return (
                        <g key={arrow.id}>
                          <path
                            d={`M ${visStart.x} ${visStart.y} Q ${arrow.mid.x} ${arrow.mid.y} ${visEnd.x} ${visEnd.y}`}
                            fill="none"
                            stroke={color}
                            strokeWidth={isSelected ? 3.8 : 3.2}
                            strokeLinecap="round"
                            markerEnd={arrowMarkerUrl(arrow.status)}
                          />
                          {!stepPassed && (
                            <g className="cursor-grab">
                              <circle
                                cx={arrow.mid.x}
                                cy={arrow.mid.y}
                                r={isSelected ? 6.5 : 5.5}
                                fill="#ffffff"
                                stroke={color}
                                strokeWidth="2.2"
                              />
                              <circle cx={arrow.mid.x} cy={arrow.mid.y} r="2.2" fill={color} />
                            </g>
                          )}
                        </g>
                      );
                    })}

                  {/* Live Drag Preview Arrow */}
                  {isArrowsStep && dragState?.mode === 'new' && Math.hypot(dragState.end.x - dragState.start.x, dragState.end.y - dragState.start.y) > 8 && (
                    <path
                      d={`M ${dragState.start.x} ${dragState.start.y} Q ${dragState.mid.x} ${dragState.mid.y} ${dragState.end.x} ${dragState.end.y}`}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="3.2"
                      strokeDasharray="5 3"
                      strokeLinecap="round"
                      markerEnd="url(#mech-arrowhead-amber)"
                      className="pointer-events-none"
                    />
                  )}
                </svg>
              </div>
            </div>
          )}

          {/* PLACED ARROW CHIPS (for quick curve flipping / deletion without re-drawing) */}
          {isArrowsStep && arrows.length > 0 && (
            <div className="w-full max-w-xl mx-auto my-2 flex items-center justify-center gap-2 flex-wrap">
              {arrows.map((a, idx) => {
                const fromLabel = elementsMap[a.fromId]?.label || a.fromId;
                const toLabel = elementsMap[a.toId]?.label || a.toId;
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold ${
                      a.status === 'correct'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : a.status === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <span>
                      {idx + 1}. {fromLabel} &rarr; {toLabel}
                    </span>
                    {!stepPassed && (
                      <>
                        <button
                          type="button"
                          onClick={() => flipArrowCurve(a.id)}
                          title="Flip curve direction"
                          className="px-1.5 py-0.5 rounded bg-white/80 hover:bg-white border border-current/20 text-[10px] cursor-pointer"
                        >
                          ↺ Flip
                        </button>
                        <button
                          type="button"
                          onClick={() => removeArrow(a.id)}
                          title="Remove arrow"
                          className="px-1.5 py-0.5 rounded bg-white/80 hover:bg-white border border-current/20 text-[10px] cursor-pointer"
                        >
                          &times;
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CHOICE OPTIONS (Choice step only) */}
          {isChoiceStep && (
            <div className="w-full max-w-xl mx-auto my-3 space-y-2">
              {(currentStep.options || []).map((opt) => {
                const isSelected = selectedChoice === opt.id;
                const showCorrectStyle = stepPassed && opt.isCorrect;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={stepPassed}
                    onClick={() => {
                      setSelectedChoice(opt.id);
                      setFeedback({ message: '', status: '' });
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                      showCorrectStyle
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                        : isSelected
                        ? 'bg-blue-50 border-[#235478] text-[#235478] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">{opt.label}</div>
                    {opt.detail && (
                      <div className="text-[11px] font-medium opacity-80 mt-0.5">{opt.detail}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="button-group mt-4">
            {!stepPassed && isDipolesStep && (
              <button type="button" className="btn btn-primary" onClick={verifyDipoles}>
                Verify Dipoles
              </button>
            )}
            {!stepPassed && isArrowsStep && (
              <button type="button" className="btn btn-primary" onClick={verifyArrows}>
                Check Mechanism Step
              </button>
            )}
            {!stepPassed && isChoiceStep && (
              <button type="button" className="btn btn-primary" onClick={verifyChoice}>
                Check Answer
              </button>
            )}
            {stepPassed && (
              <button type="button" className="btn btn-primary" onClick={advanceStep}>
                {stepIndex + 1 < currentProblem.steps.length
                  ? `Continue to Step ${stepIndex + 2} →`
                  : 'Complete Mechanism ✓'}
              </button>
            )}

            {!stepPassed && (isDipolesStep || isArrowsStep) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDipoleStates({});
                  setArrows([]);
                  setPendingTail(null);
                  setFeedback({ message: '', status: '' });
                }}
              >
                Clear Step
              </button>
            )}
          </div>

          {/* FEEDBACK BOX */}
          {feedback.message && (
            <div
              className={`feedback-box flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
                feedback.status === 'success' ? 'feedback-success' : 'feedback-error'
              }`}
            >
              <span className="text-xs sm:text-sm leading-relaxed">{feedback.message}</span>
              {stepPassed && (
                <button
                  type="button"
                  onClick={advanceStep}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  {stepIndex + 1 < currentProblem.steps.length
                    ? `Step ${stepIndex + 2} →`
                    : 'Finish ✓'}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MechanismTrainer;
