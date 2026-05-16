import React, { useState } from 'react';
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

function App() {
  const [currentApplet, setCurrentApplet] = useState('dashboard');
  const [isDataBookletOpen, setIsDataBookletOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Registry of all applets with custom descriptions for the structured grid layout
  const applets = [
    { id: 'formulas-ions', label: 'Formulas from Ions', short: 'Ion Formulas', unit: 'Unit 1.1', icon: '⚛️', desc: 'Balance charge ratios and construct ionic formulas.' },
    { id: 'formulas-name', label: 'Formulas from Names', short: 'Name Formulas', unit: 'Unit 1.1', icon: '🏷️', desc: 'Convert systematic chemical names directly to formulas.' },
    { id: 'titration', label: 'Acid-Base Titrations', short: 'Titrations', unit: 'Unit 1.1', icon: '🧪', desc: 'Solve classic standard neutralizing calculation sequences.' },
    { id: 'idealgas', label: 'Ideal Gas Calculations', short: 'Ideal Gas', unit: 'Unit 1.2', icon: '🎈', desc: 'Master pV = nRT variables with seamless conversions.' },
    { id: 'redox', label: 'Redox Titration', short: 'Redox', unit: 'Unit 3.1', icon: '⚡', desc: 'Analyze ratio pathways for complex transition elements.' },
    { id: 'enthalpy', label: 'Enthalpy of Combustion', short: 'Enthalpy', unit: 'Unit 3.4', icon: '🔥', desc: 'Determine accurate energy variables and sign conventions.' },
    { id: 'rates', label: 'Reaction Rates', short: 'Rates', unit: 'Unit 3.5', icon: '⏱️', desc: 'Deduce rate equations, orders, and Arrhenius constraints.' },
    { id: 'acids', label: 'pH & Weak Acids', short: 'pH Acids', unit: 'Unit 3.9', icon: '🍋', desc: 'Determine Ka, pKa, and hydrogen ion parameters.' },
    { id: 'buffers', label: 'Buffer Solutions', short: 'Buffers', unit: 'Unit 3.9', icon: '🛡️', desc: 'Evaluate specific system responses to salt mass changes.' }
  ];

  // Map array containing explicit WJEC syllabus structures to order the interface rows
  const units = ['Unit 1.1', 'Unit 1.2', 'Unit 3.1', 'Unit 3.4', 'Unit 3.5', 'Unit 3.9'];

  const handleNav = (id) => {
    setCurrentApplet(id);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* --- STICKY HEADER NAVIGATION --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          <button onClick={() => handleNav('dashboard')} className="hover:opacity-80 transition-opacity shrink min-w-0 text-left">
            <HeaderBrand />
          </button>

          {/* Desktop Navigation Dropdown (Replaces horizontal row to avoid text collision) */}
          <nav className="hidden md:flex items-center gap-2 shrink-0">
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
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl hidden group-hover:block max-h-96 overflow-y-auto py-1.5 z-50">
                {applets.map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleNav(app.id)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <span>{app.icon}</span>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-black uppercase tracking-wider">{app.unit}</span>
                      {app.short}
                    </div>
                  </button>
                ))}
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

        {/* --- SCROLLABLE MOBILE DROPDOWN MENU --- */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 max-h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2 shadow-inner animate-in slide-in-from-top">
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full text-left px-4 py-3 rounded-xl font-black text-xs text-[#326fa0] uppercase tracking-wider bg-blue-50 mb-2 block"
            >
              🏠 Go to Home Dashboard
            </button>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1">Select WJEC Tool</div>
            {applets.map(app => (
              <button
                key={app.id}
                onClick={() => handleNav(app.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${currentApplet === app.id ? 'bg-blue-50 text-[#326fa0]' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{app.icon}</span>
                    <span className="text-sm">{app.label}</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 text-slate-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">{app.unit}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex-grow w-full">
        
        {/* --- SYLLABUS-GROUPED DASHBOARD VIEW --- */}
        {currentApplet === 'dashboard' && (
          <div className="py-4 animate-fade-in text-center flex flex-col items-center">
            <div className="w-[60%] max-w-[450px] mb-6">
              <Logo className="w-full h-auto object-contain" />
            </div>

            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-10 px-4 leading-relaxed">
              Interactive calculations and randomized problem engines aligned directly with the WJEC A-Level Chemistry specification.
            </p>

            {/* Loop through specific syllabus units sequentially */}
            <div className="w-full max-w-5xl mx-auto text-left space-y-10">
              {units.map(unitRow => {
                const filteredApplets = applets.filter(a => a.unit === unitRow);
                if (filteredApplets.length === 0) return null;

                return (
                  <div key={unitRow} className="animate-fade-in">
                    <div className="border-b-2 border-slate-200 pb-2 mb-5 flex items-center gap-3">
                      <span className="bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider shadow-sm uppercase">{unitRow}</span>
                      <h2 className="text-sm font-extrabold text-slate-500 tracking-wide uppercase">Practice Modules</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredApplets.map(app => (
                        <button 
                          key={app.id}
                          onClick={() => handleNav(app.id)}
                          className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-[#326fa0] hover:shadow-md transition-all group flex flex-col justify-between h-40"
                        >
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-10 h-10 bg-slate-50 text-[#326fa0] rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#326fa0] group-hover:text-white transition-colors">
                                {app.icon}
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 group-hover:text-[#326fa0] transition-all">Launch →</span>
                            </div>
                            <div className="font-black text-base text-slate-800 leading-snug mb-1 group-hover:text-[#326fa0] transition-colors line-clamp-1">
                              {app.label}
                            </div>
                            <p className="text-slate-400 font-medium text-xs line-clamp-2 leading-normal">
                              {app.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- ACTIVE APPLET CONTAINER RENDERER --- */}
        <div className="animate-fade-in">
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
          {currentApplet === 'titration' && <AcidBaseTitration />}
          {currentApplet === 'idealgas' && <IdealGas />}
          {currentApplet === 'redox' && <RedoxTitration />}
          {currentApplet === 'enthalpy' && <EnthalpyCombustion />}
          {currentApplet === 'acids' && <AcidsAndBases />}
          {currentApplet === 'buffers' && <BufferSolutions />}
          {currentApplet === 'rates' && <ReactionRates />}
        </div>
      </main>

      <DataBooklet isOpen={isDataBookletOpen} onClose={() => setIsDataBookletOpen(false)} />
    </div>
  );
}

export default App;
