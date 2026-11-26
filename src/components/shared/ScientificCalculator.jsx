import React, { useState, useRef, useEffect, useCallback } from 'react';

const cleanFloat = (n) => {
  if (!Number.isFinite(n)) return n;
  if (Math.abs(n) < 1e-15 && n !== 0) return n;
  const rounded = Number(n.toPrecision(12));
  return Object.is(rounded, -0) ? 0 : rounded;
};

const formatSigFigs = (n, sig = 3) => {
  if (!Number.isFinite(n)) return '';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e-3 && abs < 1e5) {
    const rounded = Number(n.toPrecision(sig));
    const fixedStr = rounded.toPrecision(sig);
    return fixedStr.includes('e') ? String(rounded) : fixedStr;
  }
  return String(Number(n.toPrecision(sig)));
};

/**
 * Safe recursive-descent mathematical parser for chemistry calculations.
 * Supports +, -, *, /, ^, log (base 10), ln (natural), exp (e^x), sqrt/√,
 * scientific notation literals (e.g. 1.75e-5), Ans, ², ⁻¹, parentheses,
 * and implicit multiplication. Never uses eval() or Function().
 */
const evaluateCalcExpression = (rawExpr, ansValue = 0) => {
  let expr = (rawExpr || '')
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-');

  if (!expr) return { ok: false, error: 'Empty' };

  // Auto-close unmatched opening parentheses
  let openCount = 0;
  let closeCount = 0;
  for (const ch of expr) {
    if (ch === '(') openCount += 1;
    if (ch === ')') closeCount += 1;
  }
  if (closeCount > openCount) return { ok: false, error: 'Syntax Error' };
  if (openCount > closeCount) expr += ')'.repeat(openCount - closeCount);

  // Tokenise
  const rawTokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];

    // Number literal (including leading dot and optional e/E exponent)
    if (/[0-9.]/.test(ch)) {
      const rest = expr.slice(i);
      const match = rest.match(/^(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:[eE][+-]?[0-9]+)?/);
      if (!match) return { ok: false, error: 'Syntax Error' };
      const numVal = Number(match[0]);
      if (!Number.isFinite(numVal)) return { ok: false, error: 'Math Error' };
      rawTokens.push({ type: 'num', val: numVal });
      i += match[0].length;
      continue;
    }

    if (expr.startsWith('⁻¹', i)) {
      rawTokens.push({ type: 'post', op: 'inv' });
      i += 2;
      continue;
    }
    if (ch === '²') {
      rawTokens.push({ type: 'post', op: 'sq' });
      i += 1;
      continue;
    }
    if (ch === '√') {
      rawTokens.push({ type: 'fn', name: 'sqrt' });
      i += 1;
      continue;
    }
    if (expr.startsWith('sqrt', i)) {
      rawTokens.push({ type: 'fn', name: 'sqrt' });
      i += 4;
      continue;
    }
    if (expr.startsWith('log', i)) {
      rawTokens.push({ type: 'fn', name: 'log' });
      i += 3;
      continue;
    }
    if (expr.startsWith('ln', i)) {
      rawTokens.push({ type: 'fn', name: 'ln' });
      i += 2;
      continue;
    }
    if (expr.startsWith('exp', i)) {
      rawTokens.push({ type: 'fn', name: 'exp' });
      i += 3;
      continue;
    }
    if (expr.startsWith('Ans', i)) {
      rawTokens.push({ type: 'ans' });
      i += 3;
      continue;
    }
    if ('+-*/^()'.includes(ch)) {
      rawTokens.push({ type: 'op', op: ch });
      i += 1;
      continue;
    }
    return { ok: false, error: 'Syntax Error' };
  }

  // Insert implicit multiplication tokens where adjacent factors meet
  const tokens = [];
  const isLeftFactor = (t) =>
    t.type === 'num' || t.type === 'ans' || t.type === 'post' || (t.type === 'op' && t.op === ')');
  const isRightFactor = (t) =>
    t.type === 'num' || t.type === 'ans' || t.type === 'fn' || (t.type === 'op' && t.op === '(');

  for (let k = 0; k < rawTokens.length; k += 1) {
    const cur = rawTokens[k];
    if (tokens.length > 0 && isLeftFactor(tokens[tokens.length - 1]) && isRightFactor(cur)) {
      tokens.push({ type: 'op', op: '*' });
    }
    tokens.push(cur);
  }

  let pos = 0;
  const peek = () => tokens[pos] || null;
  const consume = () => {
    const tok = tokens[pos];
    pos += 1;
    return tok;
  };

  const parseAddSub = () => {
    let left = parseMulDiv();
    while (peek()?.type === 'op' && (peek().op === '+' || peek().op === '-')) {
      const op = consume().op;
      const right = parseMulDiv();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  };

  const parseMulDiv = () => {
    let left = parseUnary();
    while (peek()?.type === 'op' && (peek().op === '*' || peek().op === '/')) {
      const op = consume().op;
      const right = parseUnary();
      if (op === '/') {
        if (right === 0) throw new Error('Math Error');
        left = left / right;
      } else {
        left = left * right;
      }
    }
    return left;
  };

  const parseUnary = () => {
    if (peek()?.type === 'op' && (peek().op === '+' || peek().op === '-')) {
      const op = consume().op;
      const val = parseUnary();
      return op === '-' ? -val : val;
    }
    return parsePower();
  };

  const parsePower = () => {
    const base = parsePostfix();
    if (peek()?.type === 'op' && peek().op === '^') {
      consume();
      const exponent = parseUnary();
      const res = Math.pow(base, exponent);
      if (!Number.isFinite(res)) throw new Error('Math Error');
      return res;
    }
    return base;
  };

  const parsePostfix = () => {
    let val = parsePrimary();
    while (peek()?.type === 'post') {
      const p = consume();
      if (p.op === 'sq') {
        val = val * val;
      } else if (p.op === 'inv') {
        if (val === 0) throw new Error('Math Error');
        val = 1 / val;
      }
    }
    return val;
  };

  const parsePrimary = () => {
    const tok = peek();
    if (!tok) throw new Error('Syntax Error');

    if (tok.type === 'num') {
      consume();
      return tok.val;
    }
    if (tok.type === 'ans') {
      consume();
      return ansValue;
    }
    if (tok.type === 'op' && tok.op === '(') {
      consume();
      const val = parseAddSub();
      const closing = consume();
      if (!closing || closing.type !== 'op' || closing.op !== ')') {
        throw new Error('Syntax Error');
      }
      return val;
    }
    if (tok.type === 'fn') {
      const fnName = consume().name;
      let arg;
      if (peek()?.type === 'op' && peek().op === '(') {
        consume();
        arg = parseAddSub();
        const closing = consume();
        if (!closing || closing.type !== 'op' || closing.op !== ')') {
          throw new Error('Syntax Error');
        }
      } else {
        arg = parseUnary();
      }
      if (fnName === 'log') {
        if (arg <= 0) throw new Error('Math Error');
        return Math.log10(arg);
      }
      if (fnName === 'ln') {
        if (arg <= 0) throw new Error('Math Error');
        return Math.log(arg);
      }
      if (fnName === 'exp') {
        const res = Math.exp(arg);
        if (!Number.isFinite(res)) throw new Error('Math Error');
        return res;
      }
      if (fnName === 'sqrt') {
        if (arg < 0) throw new Error('Math Error');
        return Math.sqrt(arg);
      }
    }
    throw new Error('Syntax Error');
  };

  try {
    const value = parseAddSub();
    if (pos < tokens.length) return { ok: false, error: 'Syntax Error' };
    if (!Number.isFinite(value)) return { ok: false, error: 'Math Error' };
    return { ok: true, value: cleanFloat(value) };
  } catch (err) {
    return { ok: false, error: err?.message === 'Math Error' ? 'Math Error' : 'Syntax Error' };
  }
};

const getDefaultCalcSize = () => {
  if (typeof window === 'undefined') return { width: 336, height: 500 };
  if (window.innerWidth < 640) {
    return {
      width: Math.min(window.innerWidth - 16, 350),
      height: Math.min(Math.round(window.innerHeight * 0.76), 490),
    };
  }
  return { width: 344, height: 516 };
};

const getDefaultCalcPosition = (winSize) => {
  if (typeof window === 'undefined') return { x: 20, y: 72 };
  const w = winSize.width;
  if (window.innerWidth < 640) {
    return {
      x: Math.max(8, Math.round((window.innerWidth - w) / 2)),
      y: 66,
    };
  }
  return {
    x: Math.max(16, window.innerWidth - w - 24),
    y: 78,
  };
};

const isUsableNumericInput = (el) => {
  if (!el || !document.body.contains(el) || el.disabled || el.readOnly) return false;
  if (el.closest('[data-floating-tool="true"]')) return false;
  if (el.closest('.pointer-events-none')) return false;
  if (el.getClientRects().length === 0) return false;
  return true;
};

const isNumericFieldCandidate = (el) => {
  if (!el || el.tagName !== 'INPUT') return false;
  const type = (el.getAttribute('type') || 'text').toLowerCase();
  if (['checkbox', 'radio', 'range', 'button', 'submit', 'reset', 'hidden'].includes(type)) {
    return false;
  }
  if (el.dataset.scientificInput === 'true') return true;
  if (type === 'number') return true;
  const inputMode = (el.getAttribute('inputmode') || '').toLowerCase();
  if (inputMode === 'decimal' || inputMode === 'numeric') return true;
  const placeholder = (el.getAttribute('placeholder') || '').trim().toLowerCase();
  if (placeholder.includes('search') || placeholder.includes('filter')) return false;
  if (/^[+-]?[0-9]/.test(placeholder)) return true;
  return false;
};

const inferFieldLabel = (el) => {
  if (!el) return '';
  const aria = el.getAttribute('aria-label');
  if (aria) return aria;
  if (el.id) {
    const linked = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (linked?.textContent?.trim()) return linked.textContent.trim();
  }
  const parentLabel = el.closest('label');
  if (parentLabel?.textContent?.trim()) return parentLabel.textContent.trim();
  const prev = el.previousElementSibling;
  if (prev?.textContent?.trim()) return prev.textContent.trim().replace(/[:=]\s*$/, '');
  const cardLabel = el.parentElement?.querySelector('label, span');
  if (cardLabel && cardLabel !== el && cardLabel.textContent?.trim()) {
    return cardLabel.textContent.trim().replace(/[:=]\s*$/, '');
  }
  const ph = el.getAttribute('placeholder');
  return ph ? `Field (${ph})` : 'Answer field';
};

const WJEC_CONSTANTS = [
  { label: 'R', insert: '8.31', title: 'Gas constant (8.31 J K⁻¹ mol⁻¹)' },
  { label: 'c', insert: '4.18', title: 'Specific heat capacity of water (4.18 J g⁻¹ K⁻¹)' },
  { label: <>N<sub>A</sub></>, insert: '6.02e23', title: 'Avogadro constant (6.02 × 10²³ mol⁻¹)' },
  { label: 'h', insert: '6.63e-34', title: 'Planck constant (6.63 × 10⁻³⁴ J s)' },
  { label: 'c₀', insert: '3.00e8', title: 'Speed of light (3.00 × 10⁸ m s⁻¹)' },
  { label: <>K<sub>w</sub></>, insert: '1.00e-14', title: 'Ionic product of water at 298 K (1.00 × 10⁻¹⁴)' },
];

const ScientificCalculator = ({ isOpen, onClose, zIndexClass = 'z-50', onFocusWindow }) => {
  const [size, setSize] = useState(getDefaultCalcSize);
  const [position, setPosition] = useState(() => getDefaultCalcPosition(getDefaultCalcSize()));
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(0);
  const [ans, setAns] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [sciDisplay, setSciDisplay] = useState(false);
  const [precisionMode, setPrecisionMode] = useState('3sf');
  const [history, setHistory] = useState([]);
  const [insertStatus, setInsertStatus] = useState(null);
  const [targetLabel, setTargetLabel] = useState('');

  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 344, height: 516 });
  const lastTargetInputRef = useRef(null);
  const calcContainerRef = useRef(null);

  // Track focused numeric/scientific inputs across the active applet
  useEffect(() => {
    const handleFocusIn = (e) => {
      const target = e.target;
      if (!target || !target.closest('main')) return;
      if (isNumericFieldCandidate(target) && isUsableNumericInput(target)) {
        lastTargetInputRef.current = target;
        setTargetLabel(inferFieldLabel(target));
      }
    };
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

  // Clamp window inside viewport on browser resize
  useEffect(() => {
    const handleWindowResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setSize((prev) => ({
        width: Math.max(288, Math.min(vw - 16, prev.width)),
        height: Math.max(410, Math.min(vh - 24, prev.height)),
      }));
      setPosition((prev) => ({
        x: Math.max(8, Math.min(vw - 260, prev.x)),
        y: Math.max(8, Math.min(vh - 100, prev.y)),
      }));
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Reset initial desktop dock position nicely first time opened if offscreen
  useEffect(() => {
    if (!isOpen) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPosition((prev) => ({
      x: Math.max(8, Math.min(vw - size.width - 8, prev.x)),
      y: Math.max(8, Math.min(vh - (isMinimized ? 64 : size.height) - 8, prev.y)),
    }));
  }, [isOpen]);

  // Pointer dragging (mouse & touch)
  useEffect(() => {
    if (!isDragging) return undefined;
    const handleMove = (e) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const activeW = isMinimized ? Math.min(320, vw - 16) : size.width;
      const activeH = isMinimized ? 60 : size.height;
      setPosition({
        x: Math.max(8, Math.min(vw - activeW - 8, e.clientX - dragOffsetRef.current.x)),
        y: Math.max(8, Math.min(vh - Math.min(activeH, 160), e.clientY - dragOffsetRef.current.y)),
      });
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [isDragging, size, isMinimized]);

  // Pointer resizing (bottom-right grip)
  useEffect(() => {
    if (!isResizing) return undefined;
    const handleMove = (e) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dx = e.clientX - resizeStartRef.current.x;
      const dy = e.clientY - resizeStartRef.current.y;
      const maxW = Math.min(540, vw - position.x - 8);
      const maxH = Math.min(720, vh - position.y - 8);
      setSize({
        width: Math.max(288, Math.min(maxW, resizeStartRef.current.width + dx)),
        height: Math.max(410, Math.min(maxH, resizeStartRef.current.height + dy)),
      });
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [isResizing, position]);

  const handleHeaderPointerDown = (e) => {
    if (e.target.closest('button')) return;
    onFocusWindow?.();
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleResizePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onFocusWindow?.();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  const appendToken = useCallback(
    (token, kind = 'raw') => {
      setErrorMsg('');
      const startsOperator = ['+', '-', '×', '÷', '^', '²', '⁻¹', 'e'].includes(token);
      if (justEvaluated) {
        if (startsOperator) {
          setExpression(`Ans${token}`);
        } else if (kind === 'const' || /[0-9.(]|log|ln|exp|√|Ans/.test(token)) {
          setExpression(token);
        } else {
          setExpression((prev) => `${prev}${token}`);
        }
        setJustEvaluated(false);
      } else {
        if (token === 'e') {
          setExpression((prev) => (!prev || !/[0-9)]$/.test(prev) ? `${prev}1e` : `${prev}e`));
        } else {
          setExpression((prev) => `${prev}${token}`);
        }
      }
    },
    [justEvaluated]
  );

  const handleDelete = useCallback(() => {
    setErrorMsg('');
    if (justEvaluated) {
      setExpression('');
      setJustEvaluated(false);
      return;
    }
    setExpression((prev) => {
      if (prev.endsWith('⁻¹')) return prev.slice(0, -2);
      if (prev.endsWith('log(') || prev.endsWith('exp(')) return prev.slice(0, -4);
      if (prev.endsWith('ln(')) return prev.slice(0, -3);
      if (prev.endsWith('Ans')) return prev.slice(0, -3);
      if (prev.endsWith('√(')) return prev.slice(0, -2);
      return prev.slice(0, -1);
    });
  }, [justEvaluated]);

  const handleClear = useCallback(() => {
    setExpression('');
    setResult(0);
    setErrorMsg('');
    setJustEvaluated(false);
  }, []);

  const handleEvaluate = useCallback(() => {
    if (!expression.trim()) return { ok: true, value: result };
    const evalRes = evaluateCalcExpression(expression, ans);
    if (!evalRes.ok) {
      setErrorMsg(evalRes.error);
      setJustEvaluated(false);
      return evalRes;
    }
    const cleanVal = evalRes.value;
    setResult(cleanVal);
    setAns(cleanVal);
    setErrorMsg('');
    setJustEvaluated(true);
    setHistory((prev) => {
      const next = [{ expr: expression, value: cleanVal }, ...prev];
      return next.slice(0, 3);
    });
    return evalRes;
  }, [expression, ans, result]);

  // Physical keyboard support ONLY when the calculator card itself holds focus
  useEffect(() => {
    if (!isOpen || isMinimized) return undefined;
    const handleKeyDown = (e) => {
      if (!calcContainerRef.current?.contains(document.activeElement)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (/^[0-9.]$/.test(k) || ['+', '(', ')', '^'].includes(k)) {
        e.preventDefault();
        appendToken(k);
      } else if (k === '-') {
        e.preventDefault();
        appendToken('−');
      } else if (k === '*') {
        e.preventDefault();
        appendToken('×');
      } else if (k === '/') {
        e.preventDefault();
        appendToken('÷');
      } else if (k === 'e' || k === 'E') {
        e.preventDefault();
        appendToken('e');
      } else if (k === 'Enter' || k === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (k === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (k === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, appendToken, handleEvaluate, handleDelete, onClose]);

  const resolveTargetInput = () => {
    if (isUsableNumericInput(lastTargetInputRef.current) && isNumericFieldCandidate(lastTargetInputRef.current)) {
      return lastTargetInputRef.current;
    }
    const mainEl = document.querySelector('main');
    if (!mainEl) return null;
    const candidates = Array.from(mainEl.querySelectorAll('input')).filter(
      (el) => isNumericFieldCandidate(el) && isUsableNumericInput(el)
    );
    if (candidates.length === 0) return null;
    const firstEmpty = candidates.find((el) => el.value === '');
    return firstEmpty || candidates[candidates.length - 1];
  };

  const showTempStatus = (msg, ok = true) => {
    setInsertStatus({ msg, ok });
    setTimeout(() => {
      setInsertStatus((cur) => (cur?.msg === msg ? null : cur));
    }, 1700);
  };

  const handleInsertToAnswer = () => {
    let rawNum = result;
    if (expression.trim() && !justEvaluated) {
      const evaluated = handleEvaluate();
      if (!evaluated.ok) {
        showTempStatus(evaluated.error || 'Fix expression first', false);
        return;
      }
      rawNum = evaluated.value;
    }
    if (errorMsg || typeof rawNum !== 'number' || !Number.isFinite(rawNum)) {
      showTempStatus('No valid value to insert', false);
      return;
    }

    const targetEl = resolveTargetInput();
    if (!targetEl) {
      showTempStatus('Open a calculation applet input first', false);
      return;
    }

    let numericToInsert = cleanFloat(rawNum);
    let formattedPlain = String(cleanFloat(Number(rawNum.toPrecision(10))));

    if (precisionMode === '3sf') {
      numericToInsert = rawNum === 0 ? 0 : Number(rawNum.toPrecision(3));
      formattedPlain = formatSigFigs(rawNum, 3);
    } else if (precisionMode === '2dp') {
      numericToInsert = Number(rawNum.toFixed(2));
      if (Object.is(numericToInsert, -0)) numericToInsert = 0;
      formattedPlain = numericToInsert.toFixed(2);
    }

    if (targetEl.dataset.scientificInput === 'true') {
      targetEl.dispatchEvent(
        new CustomEvent('chempanion:insert-number', {
          bubbles: true,
          detail: {
            numericValue: numericToInsert,
            formattedPlain,
            sigFigs: precisionMode === '3sf' ? 3 : null,
          },
        })
      );
    } else {
      let finalStr = formattedPlain;
      const inputType = (targetEl.getAttribute('type') || 'text').toLowerCase();
      if (
        inputType === 'text' &&
        targetEl.getAttribute('placeholder')?.trim().startsWith('+') &&
        numericToInsert > 0 &&
        !finalStr.startsWith('+')
      ) {
        finalStr = `+${finalStr}`;
      }
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(targetEl, finalStr);
      } else {
        targetEl.value = finalStr;
      }
      targetEl.dispatchEvent(new Event('input', { bubbles: true }));
    }

    lastTargetInputRef.current = targetEl;
    const label = inferFieldLabel(targetEl);
    setTargetLabel(label);
    targetEl.focus({ preventScroll: true });
    targetEl.classList.add('ring-2', 'ring-emerald-500');
    setTimeout(() => targetEl.classList.remove('ring-2', 'ring-emerald-500'), 900);
    showTempStatus(`✓ Inserted into ${label}`, true);
  };

  if (!isOpen) return null;

  const livePreview =
    expression.trim() && !justEvaluated ? evaluateCalcExpression(expression, ans) : null;
  const shownValue = errorMsg
    ? null
    : justEvaluated || !expression.trim()
    ? result
    : livePreview?.ok
    ? livePreview.value
    : null;

  const renderNumberDisplay = (val) => {
    if (errorMsg) return <span className="text-rose-400">{errorMsg}</span>;
    if (val === null || !Number.isFinite(val)) return <span className="text-slate-400">...</span>;
    const abs = Math.abs(val);
    if (val !== 0 && (sciDisplay || abs >= 1e6 || abs < 1e-3)) {
      const parts = val.toExponential(precisionMode === '3sf' ? 2 : 5).split('e');
      const mant = precisionMode === '3sf' ? parts[0] : String(Number(parts[0]));
      const exp = parseInt(parts[1], 10);
      return (
        <span>
          {mant} &times; 10<sup>{exp}</sup>
        </span>
      );
    }
    if (precisionMode === '3sf') return <span>{formatSigFigs(val, 3)}</span>;
    if (precisionMode === '2dp') return <span>{Number(val.toFixed(2)).toFixed(2)}</span>;
    return <span>{String(cleanFloat(Number(val.toPrecision(10))))}</span>;
  };

  const keypadButtons = [
    { id: 'log', label: 'log', onClick: () => appendToken('log('), tone: 'fn' },
    { id: 'pow10', label: <>10<sup>x</sup></>, onClick: () => appendToken('10^('), tone: 'fn' },
    { id: 'ln', label: 'ln', onClick: () => appendToken('ln('), tone: 'fn' },
    { id: 'expx', label: <>e<sup>x</sup></>, onClick: () => appendToken('exp('), tone: 'fn' },
    { id: 'sqrt', label: '√', onClick: () => appendToken('√('), tone: 'fn' },

    { id: 'sq', label: <>x<sup>2</sup></>, onClick: () => appendToken('²'), tone: 'fn' },
    { id: 'pow', label: <>x<sup>y</sup></>, onClick: () => appendToken('^'), tone: 'fn' },
    { id: 'inv', label: <>x<sup>−1</sup></>, onClick: () => appendToken('⁻¹'), tone: 'fn' },
    { id: 'lpar', label: '(', onClick: () => appendToken('('), tone: 'fn' },
    { id: 'rpar', label: ')', onClick: () => appendToken(')'), tone: 'fn' },

    { id: '7', label: '7', onClick: () => appendToken('7'), tone: 'num' },
    { id: '8', label: '8', onClick: () => appendToken('8'), tone: 'num' },
    { id: '9', label: '9', onClick: () => appendToken('9'), tone: 'num' },
    { id: 'del', label: 'DEL', onClick: handleDelete, tone: 'warn' },
    { id: 'ac', label: 'AC', onClick: handleClear, tone: 'danger' },

    { id: '4', label: '4', onClick: () => appendToken('4'), tone: 'num' },
    { id: '5', label: '5', onClick: () => appendToken('5'), tone: 'num' },
    { id: '6', label: '6', onClick: () => appendToken('6'), tone: 'num' },
    { id: 'mul', label: '×', onClick: () => appendToken('×'), tone: 'op' },
    { id: 'div', label: '÷', onClick: () => appendToken('÷'), tone: 'op' },

    { id: '1', label: '1', onClick: () => appendToken('1'), tone: 'num' },
    { id: '2', label: '2', onClick: () => appendToken('2'), tone: 'num' },
    { id: '3', label: '3', onClick: () => appendToken('3'), tone: 'num' },
    { id: 'add', label: '+', onClick: () => appendToken('+'), tone: 'op' },
    { id: 'sub', label: '−', onClick: () => appendToken('−'), tone: 'op' },

    { id: '0', label: '0', onClick: () => appendToken('0'), tone: 'num' },
    { id: 'dot', label: '.', onClick: () => appendToken('.'), tone: 'num' },
    { id: 'sci', label: <>×10<sup>x</sup></>, onClick: () => appendToken('e'), tone: 'fn' },
    { id: 'ans', label: 'Ans', onClick: () => appendToken('Ans'), tone: 'fn' },
    { id: 'eq', label: '=', onClick: handleEvaluate, tone: 'eq' },
  ];

  const toneClass = (tone) => {
    switch (tone) {
      case 'num':
        return 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-black text-sm';
      case 'op':
        return 'bg-blue-50 border-blue-200 text-[#235478] hover:bg-blue-100 font-black text-base';
      case 'fn':
        return 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 font-bold text-xs';
      case 'warn':
        return 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 font-black text-xs';
      case 'danger':
        return 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 font-black text-xs';
      case 'eq':
        return 'bg-[#326fa0] border-[#255580] text-white hover:bg-[#255580] font-black text-base';
      default:
        return 'bg-white border-slate-200 text-slate-800';
    }
  };

  return (
    <div
      data-floating-tool="true"
      className={`fixed ${zIndexClass} pointer-events-none`}
      style={{ left: `${position.x}px`, top: `${position.y}px`, textTransform: 'none' }}
    >
      <div
        ref={calcContainerRef}
        tabIndex={-1}
        onPointerDown={() => onFocusWindow?.()}
        className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden relative outline-none select-none"
        style={
          isMinimized
            ? { width: `${Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 16 : 320)}px` }
            : { width: `${size.width}px`, height: `${size.height}px` }
        }
      >
        {/* Draggable Header */}
        <div
          onPointerDown={handleHeaderPointerDown}
          className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 border-b border-slate-200 cursor-move touch-none shrink-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base leading-none">🧮</span>
            <span className="font-black text-xs sm:text-sm text-slate-800 truncate">
              Scientific Calculator
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setIsMinimized((v) => !v)}
              aria-label={isMinimized ? 'Expand calculator' : 'Minimise calculator'}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 font-black text-xs cursor-pointer"
            >
              {isMinimized ? '▢' : '—'}
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={onClose}
              aria-label="Close calculator"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 font-black text-base cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>

        {isMinimized ? (
          <div className="px-3 py-2.5 flex items-center justify-between gap-2 bg-white">
            <div className="font-mono font-black text-sm text-slate-800 truncate">
              {renderNumberDisplay(shownValue ?? result)}
            </div>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleInsertToAnswer}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shrink-0 cursor-pointer transition-colors"
            >
              Insert &crarr;
            </button>
          </div>
        ) : (
          <div
            className="flex-1 flex flex-col p-2.5 gap-2 min-h-0 bg-slate-50/40"
            onClick={() => {
              if (!calcContainerRef.current?.contains(document.activeElement)) {
                calcContainerRef.current?.focus({ preventScroll: true });
              }
            }}
          >
            {/* Dark LCD Screen */}
            <div className="bg-slate-900 text-white rounded-xl px-3 py-2.5 shadow-inner shrink-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-slate-300 truncate min-h-[1rem]">
                  {expression || '0'}
                </span>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSciDisplay((v) => !v);
                  }}
                  title="Toggle Standard / Scientific display"
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black border shrink-0 cursor-pointer transition-colors ${
                    sciDisplay
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {sciDisplay ? 'Sci' : 'S⇔D'}
                </button>
              </div>
              <div className="font-mono font-black text-xl sm:text-2xl text-right truncate leading-tight">
                {renderNumberDisplay(shownValue)}
              </div>
              {history.length > 0 && (
                <div className="pt-1 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[9px] font-bold text-slate-400 shrink-0">Prev:</span>
                  {history.map((item, idx) => (
                    <button
                      key={`${item.expr}-${idx}`}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        appendToken(String(item.value), 'const');
                      }}
                      title={`${item.expr} = ${item.value}`}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-sky-300 shrink-0 cursor-pointer"
                    >
                      {formatSigFigs(item.value, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WJEC Constants Strip */}
            <div className="grid grid-cols-6 gap-1 shrink-0">
              {WJEC_CONSTANTS.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  title={c.title}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => appendToken(c.insert, 'const')}
                  className="py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-mono font-black text-[11px] transition-colors cursor-pointer"
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Scientific Keypad */}
            <div className="flex-1 grid grid-cols-5 auto-rows-fr gap-1.5 min-h-0">
              {keypadButtons.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={btn.onClick}
                  className={`rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${toneClass(btn.tone)}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Insert Footer (Rounding Mode + Direct Answer Insertion) */}
            <div className="pt-1 border-t border-slate-200 space-y-1.5 shrink-0 pr-3">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'exact', label: 'Exact' },
                    { id: '3sf', label: '3 s.f.' },
                    { id: '2dp', label: '2 d.p.' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPrecisionMode(pm.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-colors cursor-pointer ${
                        precisionMode === pm.id
                          ? 'bg-blue-50 border-[#326fa0] text-[#235478]'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleInsertToAnswer}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <span>Insert into Answer</span>
                  <span>&crarr;</span>
                </button>
              </div>

              {(insertStatus || targetLabel) && (
                <div
                  className={`text-[10px] font-bold px-1 truncate ${
                    insertStatus
                      ? insertStatus.ok
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                      : 'text-slate-500'
                  }`}
                >
                  {insertStatus ? insertStatus.msg : `Target: ${targetLabel}`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom-Right Pointer Resize Grip */}
        {!isMinimized && (
          <div
            onPointerDown={handleResizePointerDown}
            title="Drag to resize calculator"
            aria-label="Resize calculator"
            className="absolute bottom-0 right-0 w-6 h-6 flex items-end justify-end p-1 cursor-nwse-resize touch-none text-slate-400 hover:text-[#326fa0]"
          >
            <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="3" y1="11" x2="11" y2="3" />
              <line x1="7" y1="11" x2="11" y2="7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScientificCalculator;
