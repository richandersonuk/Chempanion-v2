import './App.css';
import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { Logo, HeaderBrand } from './components/shared/Branding';
import DataBooklet from './components/shared/DataBooklet';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { howToGuides } from './data/howToGuides';
import { SORTED_APPLETS, MAIN_UNITS, WJEC_UNIT_TITLES } from './data/appletRegistry';
import { useProgress } from './hooks/useProgress';

// Resolve initial applet ID from URL (?applet=<id> or #<id>)
const getAppletFromLocation = () => {
  if (typeof window === 'undefined') return 'dashboard';
  const params = new URLSearchParams(window.location.search);
  const queryApplet = params.get('applet');
  if (queryApplet && SORTED_APPLETS.some(a => a.id === queryApplet && !a.isExternal)) {
    return queryApplet;
  }
  const hashApplet = window.location.hash.replace(/^#/, '');
  if (hashApplet && SORTED_APPLETS.some(a => a.id === hashApplet && !a.isExternal)) {
    return hashApplet;
  }
  return 'dashboard';
};

// --- WJEC HOW-TO & EXAM METHOD GUIDE MODAL ---
const GUIDE_TABS = [
  { id: 'applet', label: '🕹️ Applet Guide' },
  { id: 'exam', label: '📐 Exam Method' },
  { id: 'example', label: '📝 Worked Example' },
  { id: 'pitfalls', label: '⚠️ Examiner Pitfalls' },
];

const HowToGuideModal = ({ isOpen, onClose, appletId, onOpenDataBooklet }) => {
  const [activeTab, setActiveTab] = useState('applet');

  useEffect(() => {
    setActiveTab('applet');
  }, [isOpen, appletId]);

  if (!isOpen) return null;
  const currentGuide = howToGuides[appletId];
  if (!currentGuide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-[95vw] max-w-3xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 sm:p-5 flex items-start justify-between gap-3 text-white shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl shrink-0 mt-0.5">💡</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                  {currentGuide.unit}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-90">
                  Applet &amp; WJEC Exam Guide
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg leading-tight truncate">
                {currentGuide.title}
              </h3>
              <p className="text-xs text-amber-50 font-medium mt-1 leading-snug">
                {currentGuide.summary}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="w-8 h-8 shrink-0 flex items-center justify-center bg-black/15 hover:bg-black/25 rounded-full font-black text-base transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Tab Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-5 pt-2.5 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {GUIDE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-extrabold whitespace-nowrap border border-b-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 border-slate-200 shadow-xs -mb-px'
                    : 'bg-transparent text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-left text-xs sm:text-sm text-slate-700 leading-relaxed flex-1">
          {activeTab === 'applet' && (
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-600">
                Using the Interactive Applet
              </div>
              <ol className="space-y-2.5">
                {currentGuide.appletSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5"
                  >
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="text-slate-700 font-medium [&_code]:bg-amber-100/80 [&_code]:text-amber-950 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11px]">
                      {step}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'exam' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                  Key Equations &amp; Core Rules
                </div>
                <div className="space-y-1.5">
                  {currentGuide.examMethod.formulas.map((formula, idx) => (
                    <div
                      key={idx}
                      className="font-mono text-xs sm:text-[13px] font-bold text-blue-950 bg-white/85 border border-blue-100 rounded-xl px-3 py-2"
                    >
                      {formula}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Step-by-Step WJEC Exam Strategy
                </div>
                <ol className="space-y-2">
                  {currentGuide.examMethod.steps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5"
                    >
                      <span className="w-6 h-6 rounded-lg bg-[#326fa0] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'example' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                <div className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-1.5">
                  Representative Exam Question
                </div>
                <p className="font-bold text-indigo-950 text-xs sm:text-sm leading-relaxed">
                  {currentGuide.workedExample.question}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Method &amp; Full ECF Working
                </div>
                <ol className="space-y-2">
                  {currentGuide.workedExample.steps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5"
                    >
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-black text-[11px] shrink-0 mt-0.5">
                        Step {idx + 1}
                      </span>
                      <span className="font-medium text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                  Final Mark-Scheme Answer
                </span>
                <span className="font-mono font-black text-sm text-emerald-950 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                  {currentGuide.workedExample.answer}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'pitfalls' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-widest text-rose-600">
                  Common Examiner Pitfalls
                </div>
                <ul className="space-y-2">
                  {currentGuide.examinerTips.pitfalls.map((pitfall, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 text-rose-950 font-semibold"
                    >
                      <span className="text-rose-600 shrink-0 mt-0.5">✕</span>
                      <span>{pitfall}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
                  Quick Mark-Scheme Checklist
                </div>
                <ul className="space-y-1.5">
                  {currentGuide.examinerTips.checklist.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-emerald-950 font-semibold text-xs sm:text-sm"
                    >
                      <span className="text-emerald-600 font-black shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {onOpenDataBooklet ? (
            <button
              type="button"
              onClick={onOpenDataBooklet}
              className="px-4 py-2 bg-white hover:bg-blue-50 text-[#326fa0] border border-slate-200 hover:border-blue-300 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              📚 Open Data Booklet
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Got It ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentApplet, setCurrentApplet] = useState(getAppletFromLocation);
  const [isDataBookletOpen, setIsDataBookletOpen] = useState(false);
  const [isHowToGuideOpen, setIsHowToGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { progress, recordSuccess } = useProgress();

  const [categoryStates, setCategoryStates] = useState(() => {
    const saved = localStorage.getItem('wjec_companion_collapsed_units');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return { 'Unit 1': true, 'Unit 2': true, 'Unit 3': true, 'Unit 4': true };
  });

  useEffect(() => {
    localStorage.setItem('wjec_companion_collapsed_units', JSON.stringify(categoryStates));
  }, [categoryStates]);

  // Listen to browser back/forward navigation and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const nextApplet = getAppletFromLocation();
      startTransition(() => {
        setCurrentApplet(nextApplet);
      });
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const toggleCategory = (unitName) => {
    setCategoryStates(prev => ({ ...prev, [unitName]: !prev[unitName] }));
  };

  const handleNav = (id) => {
    const url = new URL(window.location.href);
    url.hash = '';
    if (id === 'dashboard') {
      url.searchParams.delete('applet');
    } else {
      url.searchParams.set('applet', id);
    }
    window.history.pushState({ applet: id }, '', url.toString());

    startTransition(() => {
      setCurrentApplet(id);
      setMobileMenuOpen(false);
    });
    window.scrollTo(0, 0);
  };

  const activeAppletObj = SORTED_APPLETS.find(a => a.id === currentApplet);
  const ActiveComponent = activeAppletObj ? activeAppletObj.component : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button onClick={() => handleNav('dashboard')} className="hover:opacity-80 transition-opacity text-left cursor-pointer">
            <HeaderBrand />
          </button>

          <nav className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${currentApplet === 'dashboard' ? 'bg-blue-50 text-[#326fa0]' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Home Dashboard
            </button>
            <div className="relative group">
              <button className="px-3 py-2 text-xs font-bold rounded-xl text-slate-500 hover:bg-slate-100 flex items-center gap-1 cursor-pointer">
                Quick Jump Menu ▾
              </button>
              <div className="absolute right-0 top-full w-64 bg-white border border-slate-200 rounded-xl shadow-xl max-h-96 overflow-y-auto p-2 opacity-0 pointer-events-none scale-95 origin-top-right group-hover:opacity-100 group-hover:scale-100 group-hover:!pointer-events-auto transition-all duration-100 ease-out z-50 space-y-1 before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:block">
                {MAIN_UNITS.map(unitRow => {
                  const unitApplets = SORTED_APPLETS.filter(a => a.unit.startsWith(unitRow));
                  if (unitApplets.length === 0) return null;
                  const isCatOpen = categoryStates[unitRow];
                  return (
                    <div key={unitRow} className="border border-slate-100/80 rounded-lg bg-slate-50/50 overflow-hidden">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleCategory(unitRow); }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 bg-slate-100/50 hover:bg-slate-100 text-[10px] font-black text-slate-500 tracking-wide transition-colors cursor-pointer"
                      >
                        <span>{unitRow.toUpperCase()}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{isCatOpen ? 'HIDE' : 'SHOW'}</span>
                      </button>
                      {isCatOpen && (
                        <div className="p-0.5 bg-white space-y-0.5">
                          {unitApplets.map(app => (
                            app.isExternal ? (
                              <a
                                key={app.id}
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-left px-2.5 py-1.5 text-xs font-bold bg-slate-700 border border-slate-600 text-white hover:bg-slate-800 flex items-center justify-between rounded-md transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span>{app.icon}</span>
                                  <span>{app.short}</span>
                                </div>
                                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                              </a>
                            ) : (
                              <button
                                key={app.id}
                                onClick={() => handleNav(app.id)}
                                className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between gap-2 rounded-md cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <span>{app.icon}</span>
                                  <span className="truncate">{app.short}</span>
                                </div>
                                {(progress[app.id]?.count || 0) > 0 && (
                                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                                    ✓ {progress[app.id].count}
                                  </span>
                                )}
                              </button>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {currentApplet !== 'dashboard' && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="md:hidden border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold h-9 px-2.5 rounded-full shadow-sm transition-all flex items-center gap-1 text-xs cursor-pointer"
                  aria-label="Back to Home Dashboard"
                >
                  <span>&larr;</span>
                  <span>Menu</span>
                </button>
                <button 
                  onClick={() => setIsHowToGuideOpen(true)}
                  className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-bold h-9 px-2.5 sm:px-3 md:px-4 rounded-full shadow-sm transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <span>💡</span>
                  <span className="hidden sm:inline">How-To Guide</span>
                </button>
              </>
            )}

            <button 
              onClick={() => setIsDataBookletOpen(true)}
              className="bg-[#326fa0] hover:bg-[#255580] text-white font-bold h-9 px-3 sm:px-4 md:px-5 py-2 rounded-full shadow-md transition-all flex items-center gap-1.5 sm:gap-2 text-xs cursor-pointer"
            >
              <span>📚</span>
              <span className="hidden sm:inline">Data Booklet</span>
            </button>
            <button className="md:hidden p-2 text-slate-600 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Navigation Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu view */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 max-h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2 shadow-inner">
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl font-black text-xs text-[#326fa0] uppercase tracking-wider bg-blue-50 mb-3 block"
            >
              🏠 Go to Home Dashboard
            </button>
            {MAIN_UNITS.map(unitRow => {
              const unitApplets = SORTED_APPLETS.filter(a => a.unit.startsWith(unitRow));
              if (unitApplets.length === 0) return null;
              const isCatOpen = categoryStates[unitRow];
              return (
                <div key={unitRow} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => toggleCategory(unitRow)}
                    className="w-full flex items-center justify-between p-3 bg-slate-100 text-xs font-black text-slate-600"
                  >
                    <span>{unitRow} Assignments</span>
                    <span className="text-[10px] text-slate-400 font-bold">{isCatOpen ? 'Collapse ▴' : 'Expand ▾'}</span>
                  </button>
                  {isCatOpen && (
                    <div className="p-1 bg-white divide-y divide-slate-50">
                      {unitApplets.map(app => (
                        app.isExternal ? (
                          <a
                            key={app.id}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-3 rounded-xl font-bold transition-colors bg-slate-700 border border-slate-600 text-white hover:bg-slate-800 my-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="mr-3 text-lg">{app.icon}</span>
                                <span className="text-xs text-white">{app.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] bg-slate-600 text-slate-300 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">{app.unit}</span>
                                <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                              </div>
                            </div>
                          </a>
                        ) : (
                          <button
                            key={app.id}
                            onClick={() => handleNav(app.id)}
                            className={`block w-full text-left px-4 py-3 rounded-lg font-bold transition-colors ${currentApplet === app.id ? 'bg-blue-50 text-[#326fa0]' : 'text-slate-700 hover:bg-slate-50'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="mr-3 text-lg">{app.icon}</span>
                                <span className="text-xs">{app.label}</span>
                              </div>
                              <span className="text-[9px] bg-slate-100 text-slate-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">{app.unit}</span>
                            </div>
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex-grow w-full">
        {isPending && (
          <div className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 animate-[pulse_1s_infinite] z-50" />
        )}

        {currentApplet === 'dashboard' && (
          <div className="py-2 animate-fade-in flex flex-col items-center">
            {/* Hero updates block */}
            <div className="w-full max-w-7xl mx-auto mb-8 sm:mb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch bg-white p-5 sm:p-6 md:p-8 border border-slate-200 rounded-3xl shadow-sm">
              <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center text-center pb-2 md:pb-0 md:border-r md:border-slate-100 md:pr-4">
                <div className="w-40 sm:w-44 md:w-56 transition-all duration-200">
                  <Logo className="w-full h-auto object-contain" />
                </div>
                <p className="md:hidden text-slate-500 font-semibold text-xs mt-2">
                  WJEC A-Level Chemistry Interactive Practice &amp; Data Suite
                </p>
              </div>
              <div className="hidden md:flex col-span-7 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">✨</span>
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-700">Platform Updates & Status</h3>
                  </div>
                  <p className="text-slate-600 font-bold text-sm leading-relaxed mb-3">
                    New Update: Added Qualitative Inorganic Analysis (Unit 1.6), Half-Equation Balancing (Unit 3.1), Born-Haber Cycles (Unit 3.6), and Combined Spectral Interpreter (Unit 4.8), plus Unit-Conversion Gates and Mastery Tracking! Also explore P-Block Chemistry at{' '}
                    <a href="https://pblock.chempanion.uk" target="_blank" rel="noopener noreferrer" className="text-[#326fa0] underline hover:text-[#255580]">
                      pblock.chempanion.uk
                    </a>.
                  </p>
                </div>
              </div>
            </div>

            {/* Matrix layout */}
            <div className="w-full max-w-7xl mx-auto text-left space-y-10">
              {MAIN_UNITS.map(unitRow => {
                const unitApplets = SORTED_APPLETS.filter(a => a.unit.startsWith(unitRow));
                if (unitApplets.length === 0) return null;
                const isUnitOpen = categoryStates[unitRow];

                return (
                  <div key={unitRow} className="animate-fade-in">
                    <div className="border-b-2 border-slate-200 pb-2 mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center text-center bg-slate-800 text-white text-xs font-black h-7 px-3 rounded-md tracking-wider shadow-sm uppercase shrink-0 min-w-[4.8rem]">
                          {unitRow}
                        </span>
                        <h2 className="text-xs sm:text-sm font-black text-slate-500 tracking-wide uppercase leading-tight">
                          {WJEC_UNIT_TITLES[unitRow]}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCategory(unitRow)}
                        className={`text-[10px] font-black px-3 py-1 rounded-xl border transition-all shrink-0 cursor-pointer ${
                          isUnitOpen ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100' : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        }`}
                      >
                        {isUnitOpen ? 'Hide Unit' : 'Expand Unit'}
                      </button>
                    </div>

                    {isUnitOpen ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {unitApplets.map(app => {
                          if (app.isExternal) {
                            return (
                              <a 
                                key={app.id}
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-5 bg-slate-700 border border-slate-600 rounded-2xl text-left hover:bg-slate-800 hover:border-slate-500 hover:shadow-lg transition-all group flex flex-col justify-between h-44 w-full"
                              >
                                <div className="w-full">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="w-10 h-10 bg-slate-600 text-white rounded-xl flex items-center justify-center text-2xl group-hover:bg-slate-500 transition-colors">
                                      {app.icon}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] bg-slate-600 text-slate-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">{app.unit}</span>
                                      <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="font-black text-base text-white leading-snug mb-1 transition-colors line-clamp-1">
                                    {app.label}
                                  </div>
                                  <p className="text-slate-300 font-medium text-xs line-clamp-2 leading-normal">
                                    {app.desc}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-slate-600/60 flex items-center justify-between text-[10px] font-bold text-slate-300">
                                  <span>External Lab</span>
                                  <span>Launch &rarr;</span>
                                </div>
                              </a>
                            );
                          }

                          const solvedCount = progress[app.id]?.count || 0;
                          const targetCount = app.targetMastery || 10;

                          return (
                            <button 
                              key={app.id}
                              onClick={() => handleNav(app.id)}
                              className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-[#326fa0] hover:shadow-md transition-all group flex flex-col justify-between h-44 w-full cursor-pointer"
                            >
                              <div className="w-full">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="w-10 h-10 bg-slate-50 text-[#326fa0] rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#326fa0] group-hover:text-white transition-colors">
                                    {app.icon}
                                  </div>
                                  <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded group-hover:bg-blue-50 group-hover:text-[#326fa0] transition-all uppercase tracking-wider">{app.unit}</span>
                                </div>
                                <div className="font-black text-base text-slate-800 leading-snug mb-1 group-hover:text-[#326fa0] transition-colors line-clamp-1">
                                  {app.label}
                                </div>
                                <p className="text-slate-400 font-medium text-xs line-clamp-2 leading-normal">
                                  {app.desc}
                                </p>
                              </div>
                              <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  solvedCount >= targetCount
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : solvedCount > 0
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-50 text-slate-400 border-slate-200'
                                }`}>
                                  {solvedCount >= targetCount
                                    ? `★ Mastered (${solvedCount})`
                                    : `${solvedCount}/${targetCount} Mastered`}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#326fa0] transition-colors">
                                  Practice &rarr;
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="w-full text-center py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-400 font-bold text-xs italic shadow-inner select-none">
                        Category collapsed.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active view */}
        <div className="animate-fade-in">
          {currentApplet !== 'dashboard' && (
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 max-w-5xl mx-auto">
              <button onClick={() => handleNav('dashboard')} className="text-xs sm:text-sm font-bold text-[#326fa0] hover:underline flex items-center gap-1 cursor-pointer">
                &larr; Back to Dashboard Menu
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">
                {activeAppletObj?.unit} &bull; {activeAppletObj?.label || currentApplet}
              </span>
            </div>
          )}

          {ActiveComponent && (
            <ErrorBoundary
              resetKey={currentApplet}
              onReturnHome={() => handleNav('dashboard')}
            >
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-3xl">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-[#326fa0] rounded-full animate-spin mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling Reagent Metrics...</p>
                </div>
              }>
                <ActiveComponent onComplete={(scenarioId) => recordSuccess(currentApplet, scenarioId)} />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </main>

      {/* Slide-in elements */}
      <DataBooklet
        isOpen={isDataBookletOpen}
        onClose={() => setIsDataBookletOpen(false)}
        activeAppletId={currentApplet}
      />
      <HowToGuideModal
        isOpen={isHowToGuideOpen}
        onClose={() => setIsHowToGuideOpen(false)}
        appletId={currentApplet}
        onOpenDataBooklet={() => {
          setIsHowToGuideOpen(false);
          setIsDataBookletOpen(true);
        }}
      />
    </div>
  );
}
