import './App.css';
import React, { useState, useEffect } from 'react';
import { Logo, HeaderBrand } from './Branding';
import DataBooklet from './DataBooklet';

// Import Applets
import EnthalpyCombustion from './EnthalpyCombustion';
import RedoxTitration from './RedoxTitration';
import AcidsAndBases from './AcidsAndBases';
import BufferSolutions from './BufferSolutions';
import AcidBaseTitration from './AcidBaseTitration';
import IdealGas from './IdealGas';
import FormulasFromIons from './FormulasFromIons';
import ReactionRates from './ReactionRates';
import FormulasFromName from './FormulasFromName'; 
import KcCalculations from './KcCalculations';
import KpCalculations from './KpCalculations';
import EntropyGibbs from './EntropyGibbs';
import CellPotentials from './CellPotentials';
import EmpiricalFormula from './EmpiricalFormula';

function App() {
  const [currentApplet, setCurrentApplet] = useState('dashboard');
  const [isDataBookletOpen, setIsDataBookletOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- PERSISTENT SELECTION HOOK LOGIC ---
  const [categoryStates, setCategoryStates] = useState(() => {
    const saved = localStorage.getItem('wjec_companion_collapsed_units');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed parsing persistent menu metrics", e);
      }
    }
    // Default Fallback: All modules initialize wide open
    return { 'Unit 1': true, 'Unit 2': true, 'Unit 3': true, 'Unit 4': true };
  });

  useEffect(() => {
    localStorage.setItem('wjec_companion_collapsed_units', JSON.stringify(categoryStates));
  }, [categoryStates]);

  const toggleCategory = (unitName) => {
    setCategoryStates(prev => ({
      ...prev,
      [unitName]: !prev[unitName]
    }));
  };

  const applets = [
    { id: 'formulas-ions', label: 'Formulas from Ions', short: 'Ion Formulas', unit: 'Unit 1.1', icon: '⚛️', desc: 'Balance charge ratios and construct ionic formulas.' },
    { id: 'formulas-name', label: 'Formulas from Names', short: 'Name Formulas', unit: 'Unit 1.1', icon: '🏷️', desc: 'Convert systematic chemical names directly to formulas.' },
    { id: 'empirical-formula', label: 'Empirical & Molecular Formulas', short: 'Empirical', unit: 'Unit 1.1', icon: '🧮', desc: 'Convert mass composition properties into empirical and molecular formulas.' },
    { id: 'titration', label: 'Acid-Base Titrations', short: 'Titrations', unit: 'Unit 1.1', icon: '🧪', desc: 'Solve classic standard neutralizing calculation sequences.' },
    { id: 'idealgas', label: 'Ideal Gas Calculations', short: 'Ideal Gas', unit: 'Unit 1.2', icon: '🎈', desc: 'Master pV = nRT variables with seamless conversions.' },
    { id: 'redox', label: 'Redox Titration', short: 'Redox', unit: 'Unit 3.1', icon: '⚡', desc: 'Analyze ratio pathways for complex transition elements.' },
    { id: 'enthalpy', label: 'Enthalpy of Combustion', short: 'Enthalpy', unit: 'Unit 3.4', icon: '🔥', desc: 'Determine accurate energy variables and sign conventions.' },
    { id: 'entropy-gibbs', label: 'Entropy & Gibbs Free Energy', short: 'Gibbs Free Energy', unit: 'Unit 3.4', icon: '❄️', desc: 'Balance ΔH and ΔS to determine Gibbs feasibility and temperature thresholds.' },
    { id: 'rates', label: 'Reaction Rates', short: 'Rates', unit: 'Unit 3.5', icon: '⏱️', desc: 'Deduce rate equations, orders, and Arrhenius constraints.' },
    { id: 'kc-calc', label: 'Kc Equilibrium Constants', short: 'Kc Equilibrium', unit: 'Unit 3.8', icon: '⚗️', desc: 'Construct ICE tables and determine concentration equilibrium constants.' },
    { id: 'kp-calc', label: 'Kp Equilibrium Constants', short: 'Kp Equilibrium', unit: 'Unit 3.8', icon: '💨', desc: 'Calculate gas mole fractions, partial pressures, and Kp constants.' },
    { id: 'acids', label: 'pH & Weak Acids', short: 'pH Acids', unit: 'Unit 3.9', icon: '🍋', desc: 'Determine Ka, pKa, and hydrogen ion parameters.' },
    { id: 'buffers', label: 'Buffer Solutions', short: 'Buffers', unit: 'Unit 3.9', icon: '🛡️', desc: 'Evaluate specific system responses to salt mass changes.' },
    { id: 'cell-potentials', label: 'Standard Cell Potentials', short: 'Cell Potentials', unit: 'Unit 4.1', icon: '🔋', desc: 'Determine overall standard cell EMF from half-equation standard potentials.' }
  ];

  const mainUnits = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4'];

  const handleNav = (id) => {
    setCurrentApplet(id);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (currentApplet === 'dashboard') return;

    const observer = new MutationObserver(() => {
      const feedbackEl = document.querySelector('.feedback-box');
      if (feedbackEl) {
        feedbackEl.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest'
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [currentApplet]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col" style={{ textTransform: 'none' }}>
      
      {/* --- STICKY HEADER NAVIGATION --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" style={{ textTransform: 'none' }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button onClick={() => handleNav('dashboard')} className="hover:opacity-80 transition-opacity shrink min-w-0 text-left">
            <HeaderBrand />
          </button>

          {/* Desktop Collapsible Navigation Menu */}
          <nav className="hidden md:flex items-center gap-2 shrink-0" style={{ textTransform: 'none' }}>
            <button 
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${currentApplet === 'dashboard' ? 'bg-blue-50 text-[#326fa0]' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Home Dashboard
            </button>
            
            <div className="relative group">
              <button className="px-3 py-2 text-xs font-bold rounded-xl text-slate-500 hover:bg-slate-100 flex items-center gap-1">
                Quick Jump Menu ▾
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl hidden group-hover:block max-h-96 overflow-y-auto p-2 z-50 space-y-1">
                {mainUnits.map(unitRow => {
                  const unitApplets = applets.filter(a => a.unit.startsWith(unitRow));
                  if (unitApplets.length === 0) return null;
                  const isCatOpen = categoryStates[unitRow];

                  return (
                    <div key={unitRow} className="border border-slate-100/80 rounded-lg bg-slate-50/50 overflow-hidden">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleCategory(unitRow); }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 bg-slate-100/50 hover:bg-slate-100 text-[10px] font-black text-slate-500 tracking-wide transition-colors"
                        style={{ textTransform: 'none' }}
                      >
                        <span>{unitRow.toUpperCase()}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{isCatOpen ? 'HIDE' : 'SHOW'}</span>
                      </button>
                      
                      {isCatOpen && (
                        <div className="p-0.5 bg-white space-y-0.5">
                          {unitApplets.map(app => (
                            <button
                              key={app.id}
                              onClick={() => handleNav(app.id)}
                              className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 rounded-md"
                              style={{ textTransform: 'none' }}
                            >
                              <span>{app.icon}</span>
                              <span style={{ textTransform: 'none' }}>{app.short}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsDataBookletOpen(true)}
              className="bg-[#326fa0] hover:bg-[#255580] text-white font-bold px-4 md:px-5 py-2 rounded-full shadow-md transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <span>📚</span>
              <span className="hidden sm:inline">Data Booklet</span>
            </button>
            <button className="md:hidden p-2 text-slate-600 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* SCROLLABLE MOBILE DROPDOWN ACCORDION MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 max-h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2 shadow-inner">
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl font-black text-xs text-[#326fa0] uppercase tracking-wider bg-blue-50 mb-3 block"
            >
              🏠 Go to Home Dashboard
            </button>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1">Specification Categories</div>
            
            {mainUnits.map(unitRow => {
              const unitApplets = applets.filter(a => a.unit.startsWith(unitRow));
              if (unitApplets.length === 0) return null;
              const isCatOpen = categoryStates[unitRow];

              return (
                <div key={unitRow} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => toggleCategory(unitRow)}
                    className="w-full flex items-center justify-between p-3 bg-slate-100 text-xs font-black text-slate-600"
                    style={{ textTransform: 'none' }}
                  >
                    <span>{unitRow} Assignments</span>
                    <span className="text-[10px] text-slate-400 font-bold">{isCatOpen ? 'Collapse ▴' : 'Expand ▾'}</span>
                  </button>

                  {isCatOpen && (
                    <div className="p-1 bg-white divide-y divide-slate-50">
                      {unitApplets.map(app => (
                        <button
                          key={app.id}
                          onClick={() => handleNav(app.id)}
                          className={`block w-full text-left px-4 py-3 rounded-lg font-bold transition-colors ${currentApplet === app.id ? 'bg-blue-50 text-[#326fa0]' : 'text-slate-700 hover:bg-slate-50'}`}
                          style={{ textTransform: 'none' }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="mr-3 text-lg">{app.icon}</span>
                              <span className="text-xs" style={{ textTransform: 'none' }}>{app.label}</span>
                            </div>
                            <span className="text-[9px] bg-slate-100 text-slate-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">{app.unit}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex-grow w-full" style={{ textTransform: 'none' }}>
        
        {/* --- SYLLABUS-GROUPED DASHBOARD VIEW --- */}
        {currentApplet === 'dashboard' && (
          <div className="py-2 animate-fade-in flex flex-col items-center" style={{ textTransform: 'none' }}>
            
            {/* HERO HERO BRAND PANEL CARD */}
            <div className="w-full max-w-5xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch bg-white p-6 md:p-8 border border-slate-200 rounded-3xl shadow-sm" style={{ textTransform: 'none' }}>
              <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center text-center border-b border-slate-100 pb-4 md:pb-0 md:border-b-0 md:border-r md:border-slate-100 md:pr-4">
                <div className="w-44 md:w-56 transition-all duration-200">
                  <Logo className="w-full h-auto object-contain" />
                </div>
                <p className="text-slate-500 text-xs leading-relaxed px-2 mt-2 font-medium md:hidden" style={{ textTransform: 'none' }}>
                  Interactive calculations and randomized problem engines aligned directly with the WJEC A-Level Chemistry specification.
                </p>
              </div>

              <div className="hidden md:flex col-span-7 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex-col justify-between" style={{ textTransform: 'none' }}>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">✨</span>
                    <h3 className="font-black text-xs uppercase tracking-wider text-slate-700">Platform About & Updates</h3>
                  </div>
                  <p className="text-slate-600 font-bold text-sm leading-relaxed mb-3" style={{ textTransform: 'none' }}>
                    Interactive calculations and randomized problem engines aligned directly with the WJEC A-Level Chemistry specification.
                  </p>
                  <p className="text-slate-400 font-medium text-xs leading-relaxed mb-4" style={{ textTransform: 'none' }}>
                    CHEMpanion generates unlimited custom calculation problem variants to help students master challenging A-Level numerical chemistry methods.
                  </p>
                </div>
                <div className="border-t border-slate-200/80 pt-3">
                  <span className="text-[9px] font-extrabold bg-blue-50 text-[#326fa0] px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">Newest Addition</span>
                  <div className="flex items-start gap-2.5 text-xs text-slate-500">
                    <span className="mt-0.5 text-sm">🧪</span>
                    <div style={{ textTransform: 'none' }}>
                      <strong className="text-slate-700 font-bold block" style={{ textTransform: 'none' }}>Burette Calibration & Enforced precision Modules Active</strong>
                      Burette readings, partial table inputs, and dynamic logarithmic precision parameters are fully operational.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CORE PERSISTENT SPEC ACCORDION LIST MATRIX */}
            <div className="w-full max-w-5xl mx-auto text-left space-y-10" style={{ textTransform: 'none' }}>
              {mainUnits.map(unitRow => {
                const filteredApplets = applets.filter(a => a.unit.startsWith(unitRow));
                if (filteredApplets.length === 0) return null;
                const isUnitOpen = categoryStates[unitRow];

                return (
                  <div key={unitRow} className="animate-fade-in" style={{ textTransform: 'none' }}>
                    
                    <div className="border-b-2 border-slate-200 pb-2 mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-800 text-white text-xs font-black px-3 py-1 rounded-md tracking-wider shadow-sm uppercase">{unitRow}</span>
                        <h2 className="text-sm font-extrabold text-slate-500 tracking-wide uppercase">Core Specification Modules</h2>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => toggleCategory(unitRow)}
                        className={`text-[10px] font-black px-3 py-1 rounded-xl border transition-all ${
                          isUnitOpen 
                            ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100' 
                            : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-sm'
                        }`}
                      >
                        {isUnitOpen ? 'Collapse Category' : 'Expand Category'}
                      </button>
                    </div>

                    {isUnitOpen ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredApplets.map(app => (
                          <button 
                            key={app.id}
                            onClick={() => handleNav(app.id)}
                            className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-[#326fa0] hover:shadow-md transition-all group flex flex-col justify-between h-40"
                            style={{ textTransform: 'none' }}
                          >
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 bg-slate-50 text-[#326fa0] rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#326fa0] group-hover:text-white transition-colors">
                                  {app.icon}
                                </div>
                                <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded group-hover:bg-blue-50 group-hover:text-[#326fa0] transition-all uppercase tracking-wider">{app.unit}</span>
                              </div>
                              <div className="font-black text-base text-slate-800 leading-snug mb-1 group-hover:text-[#326fa0] transition-colors line-clamp-1" style={{ textTransform: 'none' }}>
                                {app.label}
                              </div>
                              <p className="text-slate-400 font-medium text-xs line-clamp-2 leading-normal" style={{ textTransform: 'none' }}>
                                {app.desc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full text-center py-4 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-400 font-bold text-xs italic shadow-inner select-none">
                        Category hidden to reduce footprint. Click expand to reveal specific practice modules.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- ACTIVE APPLET RENDERER --- */}
        <div className="animate-fade-in" style={{ textTransform: 'none' }}>
          {currentApplet !== 'dashboard' && (
            <div className="mb-6 flex items-center gap-2">
              <button onClick={() => handleNav('dashboard')} className="text-sm font-bold text-[#326fa0] hover:underline flex items-center gap-1">
                &larr; Back to Apps
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {applets.find(a => a.id === currentApplet)?.label || currentApplet}
              </span>
            </div>
          )}

          {currentApplet === 'formulas-ions' && <FormulasFromIons />}
          {currentApplet === 'formulas-name' && <FormulasFromName />}
          {currentApplet === 'empirical-formula' && <EmpiricalFormula />}
          {currentApplet === 'titration' && <AcidBaseTitration />}
          {currentApplet === 'idealgas' && <IdealGas />}
          {currentApplet === 'redox' && <RedoxTitration />}
          {currentApplet === 'enthalpy' && <EnthalpyCombustion />}
          {currentApplet === 'entropy-gibbs' && <EntropyGibbs />}
          {currentApplet === 'rates' && <ReactionRates />}
          {currentApplet === 'kc-calc' && <KcCalculations />}
          {currentApplet === 'kp-calc' && <KpCalculations />}
          {currentApplet === 'acids' && <AcidsAndBases />}
          {currentApplet === 'buffers' && <BufferSolutions />}
          {currentApplet === 'cell-potentials' && <CellPotentials />}
        </div>
      </main>

      <DataBooklet isOpen={isDataBookletOpen} onClose={() => setIsDataBookletOpen(false)} />
    </div>
  );
}

export default App;
