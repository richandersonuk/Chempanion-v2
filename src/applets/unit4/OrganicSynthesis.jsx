import React, { useState, useEffect, useMemo } from 'react';
import {
  SYNTHESIS_ROUTES,
  PATHWAY_MAPS,
  PRACTICAL_TECHNIQUES,
} from '../../data/questions/organicSynthesisData';
import { useProgress } from '../../hooks/useProgress';

const TABS = [
  { id: 'builder', label: '🧪 Multi-Step Synthesis Builder' },
  { id: 'map', label: '🗺️ Interactive Reagent & Pathway Map' },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All (10)' },
  { id: 'aliphatic', label: 'Aliphatic & Chain Extension (7)' },
  { id: 'aromatic', label: 'Aromatic & Azo (3)' },
];

export function OrganicSynthesis({ onComplete }) {
  const { progress } = useProgress();

  const [activeTab, setActiveTab] = useState('builder');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRouteId, setSelectedRouteId] = useState('chain-ext-amine');

  // Synthesis Builder Form State
  const [step1Choice, setStep1Choice] = useState('');
  const [interChoice, setInterChoice] = useState('');
  const [step2Choice, setStep2Choice] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Pathway Map State
  const [mapDomain, setMapDomain] = useState('aliphatic');
  const [mapQuery, setMapQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState('halo-nitrile');

  const [completedIds, setCompletedIds] = useState(() => {
    const saved = progress['organic-synthesis']?.solvedIds;
    return Array.isArray(saved) ? saved : [];
  });

  useEffect(() => {
    const saved = progress['organic-synthesis']?.solvedIds;
    if (Array.isArray(saved)) {
      setCompletedIds((prev) => Array.from(new Set([...prev, ...saved])));
    }
  }, [progress]);

  const filteredRoutes = useMemo(() => {
    if (categoryFilter === 'all') return SYNTHESIS_ROUTES;
    return SYNTHESIS_ROUTES.filter((r) => r.category === categoryFilter);
  }, [categoryFilter]);

  const currentRoute = useMemo(
    () =>
      filteredRoutes.find((r) => r.id === selectedRouteId) ||
      filteredRoutes[0] ||
      SYNTHESIS_ROUTES[0],
    [filteredRoutes, selectedRouteId]
  );

  const selectedInterObj = useMemo(
    () => currentRoute.intermediate.options.find((o) => o.id === interChoice) || null,
    [currentRoute, interChoice]
  );

  const selectedStep1Obj = useMemo(
    () => currentRoute.step1.options.find((o) => o.id === step1Choice) || null,
    [currentRoute, step1Choice]
  );

  const selectedStep2Obj = useMemo(
    () => currentRoute.step2.options.find((o) => o.id === step2Choice) || null,
    [currentRoute, step2Choice]
  );

  const resetRouteForm = (nextId) => {
    setSelectedRouteId(nextId);
    setStep1Choice('');
    setInterChoice('');
    setStep2Choice('');
    setShowHint(false);
    setFeedback(null);
  };

  const handleSelectCategory = (catId) => {
    setCategoryFilter(catId);
    const list =
      catId === 'all'
        ? SYNTHESIS_ROUTES
        : SYNTHESIS_ROUTES.filter((r) => r.category === catId);
    if (list.length > 0 && !list.some((r) => r.id === selectedRouteId)) {
      resetRouteForm(list[0].id);
    }
  };

  const clearErrorBanner = () => {
    if (feedback && !feedback.isCorrect) {
      setFeedback(null);
    }
  };

  const handleCheckRoute = (e) => {
    e.preventDefault();
    if (!step1Choice || !interChoice || !step2Choice) {
      setFeedback({
        isCorrect: false,
        message: 'Please select Step 1 reagents, the intermediate compound, and Step 2 reagents before checking.',
      });
      return;
    }

    const s1Ok = step1Choice === currentRoute.step1.correctId;
    const intOk = interChoice === currentRoute.intermediate.correctId;
    const s2Ok = step2Choice === currentRoute.step2.correctId;

    if (s1Ok && intOk && s2Ok) {
      setFeedback({
        isCorrect: true,
        message: `Full marks! Your 2-step synthesis from ${currentRoute.start.name} to ${currentRoute.target.name} is completely accurate.`,
      });
      setCompletedIds((prev) =>
        prev.includes(currentRoute.id) ? prev : [...prev, currentRoute.id]
      );
      onComplete?.(currentRoute.id);
      return;
    }

    const issues = [];
    if (!s1Ok) issues.push('Step 1 reagent/conditions need revision.');
    if (!intOk) issues.push('The intermediate structure does not match the outcome of Step 1.');
    if (!s2Ok) issues.push('Step 2 reagent/conditions will not convert the intermediate to the target.');

    const trapNotes = [
      !s1Ok && selectedStep1Obj?.trapFeedback,
      !intOk && selectedInterObj?.trapFeedback,
      !s2Ok && selectedStep2Obj?.trapFeedback,
    ].filter(Boolean);

    setFeedback({
      isCorrect: false,
      message: issues.join(' '),
      trapNotes,
    });
  };

  const goNextRoute = () => {
    const idx = filteredRoutes.findIndex((r) => r.id === currentRoute.id);
    const next = filteredRoutes[(idx + 1) % filteredRoutes.length];
    if (next) resetRouteForm(next.id);
  };

  const displayedMapItems = useMemo(() => {
    const baseList = PATHWAY_MAPS[mapDomain] || [];
    const q = mapQuery.trim().toLowerCase();
    if (!q) return baseList;
    return baseList.filter(
      (item) =>
        item.from.toLowerCase().includes(q) ||
        item.to.toLowerCase().includes(q) ||
        item.reagent.toLowerCase().includes(q) ||
        item.reactionType.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
    );
  }, [mapDomain, mapQuery]);

  return (
    <div className="applet-container space-y-6" style={{ textTransform: 'none' }}>
      {/* Header */}
      <div className="applet-header !mb-0 flex-col sm:flex-row !justify-between">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black tracking-wide px-2.5 py-0.5 rounded-full bg-blue-50 text-[#326fa0] border border-blue-200">
              WJEC Unit 4.7
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Organic Synthesis Pathways &amp; Reagents Map
          </h2>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
          Routes Mastered:{' '}
          <span className="font-black text-emerald-700">
            {completedIds.length} / {SYNTHESIS_ROUTES.length}
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[200px] px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
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

      {/* ==================== TAB 1: MULTI-STEP SYNTHESIS BUILDER ==================== */}
      {activeTab === 'builder' && (
        <div className="space-y-5">
          {/* Category Filters & Route Chips */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_FILTERS.map((cat) => {
                const isSelected = categoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#326fa0] text-white border-[#326fa0]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {filteredRoutes.map((rt) => {
                const isCurrent = rt.id === currentRoute.id;
                const isDone = completedIds.includes(rt.id);
                const routeNumber = SYNTHESIS_ROUTES.findIndex((r) => r.id === rt.id) + 1;
                return (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => resetRouteForm(rt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-[#326fa0]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>
                      #{routeNumber} {rt.start.formula} → {rt.target.formula}
                    </span>
                    {isDone && <span aria-label="Mastered">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Synthesis Form */}
          <form
            onSubmit={handleCheckRoute}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm"
          >
            {/* Header + Collapsible Hint Toggle */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-black tracking-wide text-[#326fa0]">
                  {currentRoute.unitRef} • Multi-Step Synthesis
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {currentRoute.title}
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

            {/* Prompt & Optional Hidden Hint */}
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {currentRoute.prompt}
            </p>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-medium text-amber-950">
                <strong className="font-black text-amber-900">Hint: </strong>
                {currentRoute.hint}
              </div>
            )}

            {/* Live Visual 2-Step Pathway Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 items-center text-center">
                {/* Starting Material */}
                <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                  <div className="text-[10px] font-black text-slate-400">Starting Material</div>
                  <div className="font-mono text-sm font-black text-slate-900 mt-0.5">
                    {currentRoute.start.formula}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {currentRoute.start.name}
                  </div>
                </div>

                {/* Step 1 Arrow Pill */}
                <div className="px-2 py-2 rounded-xl border border-dashed border-slate-300 bg-white/70 text-[11px] font-bold text-[#326fa0]">
                  <div className="text-[10px] font-black text-slate-400 mb-0.5">Step 1 →</div>
                  <div className="line-clamp-2">
                    {selectedStep1Obj ? selectedStep1Obj.label : 'Choose reagents...'}
                  </div>
                </div>

                {/* Intermediate */}
                <div
                  className={`rounded-xl p-2.5 border ${
                    selectedInterObj
                      ? 'bg-blue-50/70 border-[#326fa0]'
                      : 'bg-white border-dashed border-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-black text-slate-400">Intermediate</div>
                  <div className="font-mono text-sm font-black text-[#326fa0] mt-0.5">
                    {selectedInterObj ? selectedInterObj.formula : '?'}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 line-clamp-1">
                    {selectedInterObj ? selectedInterObj.label.split(' (')[0] : 'Select intermediate'}
                  </div>
                </div>

                {/* Step 2 Arrow Pill */}
                <div className="px-2 py-2 rounded-xl border border-dashed border-slate-300 bg-white/70 text-[11px] font-bold text-[#326fa0]">
                  <div className="text-[10px] font-black text-slate-400 mb-0.5">Step 2 →</div>
                  <div className="line-clamp-2">
                    {selectedStep2Obj ? selectedStep2Obj.label : 'Choose reagents...'}
                  </div>
                </div>

                {/* Target Molecule */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5">
                  <div className="text-[10px] font-black text-emerald-700">Target Product</div>
                  <div className="font-mono text-sm font-black text-slate-900 mt-0.5">
                    {currentRoute.target.formula}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    {currentRoute.target.name}
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Selection Sections */}
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="space-y-2">
                <div className="text-xs font-black tracking-wide text-slate-700">
                  1. Step 1 Reagents &amp; Conditions ({currentRoute.start.formula} → Intermediate)
                </div>
                <div className="space-y-2">
                  {currentRoute.step1.options.map((opt) => {
                    const checked = step1Choice === opt.id;
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
                          name={`step1-${currentRoute.id}`}
                          checked={checked}
                          onChange={() => {
                            setStep1Choice(opt.id);
                            clearErrorBanner();
                          }}
                          className="mt-0.5 accent-[#326fa0]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Intermediate */}
              <div className="space-y-2">
                <div className="text-xs font-black tracking-wide text-slate-700">
                  2. Identify Intermediate Compound
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {currentRoute.intermediate.options.map((opt) => {
                    const checked = interChoice === opt.id;
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
                          name={`inter-${currentRoute.id}`}
                          checked={checked}
                          onChange={() => {
                            setInterChoice(opt.id);
                            clearErrorBanner();
                          }}
                          className="mt-0.5 accent-[#326fa0]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="text-xs font-black tracking-wide text-slate-700">
                  3. Step 2 Reagents &amp; Conditions (Intermediate → {currentRoute.target.formula})
                </div>
                <div className="space-y-2">
                  {currentRoute.step2.options.map((opt) => {
                    const checked = step2Choice === opt.id;
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
                          name={`step2-${currentRoute.id}`}
                          checked={checked}
                          onChange={() => {
                            setStep2Choice(opt.id);
                            clearErrorBanner();
                          }}
                          className="mt-0.5 accent-[#326fa0]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit & Next Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#326fa0] hover:bg-[#255580] text-white text-xs font-black tracking-wide shadow-sm transition-colors cursor-pointer"
              >
                Check Synthesis Route
              </button>

              <button
                type="button"
                onClick={goNextRoute}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
              >
                Next Route &rarr;
              </button>
            </div>

            {/* Feedback & Mark Scheme Box */}
            {feedback && (
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="font-black text-sm">{feedback.message}</div>

                {!feedback.isCorrect && feedback.trapNotes?.length > 0 && (
                  <ul className="space-y-1 text-xs font-semibold text-rose-900 list-disc list-inside">
                    {feedback.trapNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                )}

                {feedback.isCorrect && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800">
                        Step 1 Type: {currentRoute.step1.reactionType}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800">
                        Step 2 Type: {currentRoute.step2.reactionType}
                      </span>
                    </div>

                    <div className="bg-white/85 border border-emerald-200 rounded-xl p-3 space-y-1">
                      <div className="text-[11px] font-black tracking-wide text-emerald-700">
                        Official WJEC Mark-Scheme Summary
                      </div>
                      <ul className="list-disc list-inside text-xs font-bold text-slate-800 space-y-1">
                        {currentRoute.markScheme.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs font-semibold text-amber-950 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <strong className="font-black text-rose-700">WJEC Examiner Pitfall: </strong>
                      {currentRoute.examinerPitfall}
                    </div>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {/* ==================== TAB 2: INTERACTIVE REAGENT & PATHWAY MAP ==================== */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          {/* Domain Switcher & Filter Input */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'aliphatic', label: 'Aliphatic Pathways (17)' },
                { id: 'aromatic', label: 'Aromatic Pathways (7)' },
              ].map((d) => {
                const isSelected = mapDomain === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setMapDomain(d.id);
                      const first = PATHWAY_MAPS[d.id]?.[0]?.id || '';
                      setExpandedCardId(first);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#326fa0] text-white border-[#326fa0] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#326fa0]'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={mapQuery}
              onChange={(e) => setMapQuery(e.target.value)}
              placeholder="Filter by group, reagent, or type (e.g. KCN, nitrile, phenol)..."
              className="w-full sm:w-80 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#326fa0]"
            />
          </div>

          {/* Clickable Conversion Cards */}
          {displayedMapItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs font-bold text-slate-500">
              No reaction pathways match &ldquo;{mapQuery}&rdquo;. Try clearing your filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {displayedMapItems.map((item) => {
                const isOpen = expandedCardId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExpandedCardId(isOpen ? '' : item.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isOpen
                        ? 'bg-blue-50/50 border-[#326fa0] ring-2 ring-[#326fa0]/15'
                        : 'bg-white border-slate-200 hover:border-[#326fa0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-black text-slate-900">
                        {item.from} <span className="text-[#326fa0]">→</span> {item.to}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        {isOpen ? 'Less' : 'Details'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#326fa0]">
                      Reagent: <span className="font-mono text-slate-800">{item.reagent}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">
                      Conditions: {item.conditions} • Type: {item.reactionType}
                    </div>

                    {isOpen && (
                      <div className="mt-1 pt-2.5 border-t border-slate-200 space-y-1.5">
                        <div className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                          {item.example}
                        </div>
                        <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                          <strong>Examiner tip:</strong> {item.tip}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Unit 4.7(b) Practical Purification Reference */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div>
              <span className="text-[11px] font-black tracking-wide text-[#326fa0]">
                WJEC Unit 4.7(b) Practical Techniques
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Organic Preparation, Separation &amp; Purification Checklist
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRACTICAL_TECHNIQUES.map((tech) => (
                <div key={tech.id} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">{tech.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#326fa0] border border-blue-200 shrink-0">
                      {tech.badge}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] sm:text-xs font-medium text-slate-700 space-y-1">
                    {tech.points.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganicSynthesis;
