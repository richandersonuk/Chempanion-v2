import React, { useState, useEffect, useRef } from 'react';

const COLLAPSE_CLASSES = {
  sm: { mobile: 'sm:hidden', desktop: 'hidden sm:flex' },
  md: { mobile: 'md:hidden', desktop: 'hidden md:flex' },
  lg: { mobile: 'lg:hidden', desktop: 'hidden lg:flex' },
  always: { mobile: 'block', desktop: 'hidden' },
};

/**
 * Adaptive mode/tier/route picker: renders a compact CSS-styled dropdown on smaller
 * screens (with optional Random button beside it) and inline horizontal pills on larger screens.
 */
export const AdaptivePicker = ({
  label,
  options = [],
  value,
  onChange,
  onRandom,
  isRandomActive = false,
  randomLabel = 'Random 🎲',
  collapseBelow = 'sm',
  placeholder = 'Select option...',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const bp = COLLAPSE_CLASSES[collapseBelow] || COLLAPSE_CLASSES.sm;
  const activeOption = options.find((opt) => opt.value === value);

  return (
    <div className={`w-full mx-auto ${className}`} style={{ textTransform: 'none' }}>
      {label && (
        <span className="block text-[10px] font-black tracking-widest text-slate-400 mb-1.5 text-center">
          {label}
        </span>
      )}

      {/* Compact CSS-styled dropdown on mobile/tablet */}
      <div ref={pickerRef} className={`${bp.mobile} flex items-center gap-2 w-full relative`}>
        <div className="relative flex-1 min-w-0">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="w-full min-h-[40px] px-3 py-2 bg-white border border-slate-200 hover:border-[#326fa0] rounded-xl text-xs font-bold text-slate-800 shadow-2xs flex items-center justify-between gap-2 cursor-pointer text-left transition-colors"
          >
            <span className="truncate">
              {activeOption ? activeOption.label : placeholder}
            </span>
            <span
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-transform ${
                open ? 'rotate-180 bg-[#326fa0] text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              ▾
            </span>
          </button>

          {open && (
            <div
              role="listbox"
              aria-label={label || 'Select option'}
              className="absolute left-0 right-0 top-full mt-1.5 z-40 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5"
            >
              {options.map((opt) => {
                const selected = opt.value === value && !isRandomActive;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setOpen(false);
                      onChange?.(opt.value);
                    }}
                    className={`w-full min-h-[38px] px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                      selected
                        ? 'bg-blue-50 text-[#235478]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="break-words">{opt.label}</span>
                    {selected && <span className="text-[#326fa0] font-black shrink-0">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {onRandom && (
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onRandom();
            }}
            className={`min-h-[40px] px-3 py-2 text-xs font-black rounded-xl border transition-all shrink-0 cursor-pointer ${
              isRandomActive
                ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {randomLabel}
          </button>
        )}
      </div>

      {/* Horizontal pill strip on wider screens */}
      <div className={`${bp.desktop} flex-wrap items-center justify-center gap-1.5`}>
        {options.map((opt) => {
          const selected = !isRandomActive && opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange?.(opt.value)}
              className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer text-center ${
                selected
                  ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {opt.shortLabel ?? opt.label}
            </button>
          );
        })}

        {onRandom && (
          <button
            type="button"
            onClick={onRandom}
            className={`min-h-[36px] px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer shrink-0 ${
              isRandomActive
                ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {randomLabel}
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Cross-platform CSS-styled dropdown replacing native <select> elements inside forms/cards.
 */
export const StyledSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  mono = false,
  className = '',
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const activeOption = options.find((opt) => opt.value === value);

  return (
    <div ref={selectRef} className={`relative w-full ${className}`} style={{ textTransform: 'none' }}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={`w-full min-h-[40px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-between gap-2 text-left transition-colors ${
          disabled
            ? 'opacity-60 cursor-default bg-slate-50'
            : 'hover:border-[#326fa0] cursor-pointer shadow-2xs'
        } ${mono ? 'font-mono' : ''}`}
      >
        <span className={`truncate ${activeOption ? 'text-slate-800' : 'text-slate-400'}`}>
          {activeOption ? activeOption.label : placeholder}
        </span>
        <span
          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-transform ${
            open ? 'rotate-180 bg-[#326fa0] text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          ▾
        </span>
      </button>

      {open && !disabled && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5"
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setOpen(false);
                  onChange?.(opt.value);
                }}
                className={`w-full min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                  mono ? 'font-mono' : ''
                } ${selected ? 'bg-blue-50 text-[#235478]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span className="break-words">{opt.label}</span>
                {selected && <span className="text-[#326fa0] font-black shrink-0">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdaptivePicker;
