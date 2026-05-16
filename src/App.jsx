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

  // Registry of all applets
  const applets = [
    { id: 'formulas-ions', label: 'Formulas from Ions', short: 'Ion Formulas', unit: 'Unit 1.1', icon: '⚛️' },
    { id: 'formulas-name', label: 'Formulas from Names', short: 'Name Formulas', unit: 'Unit 1.1', icon: '🏷️' },
    { id: 'titration', label: 'Acid-Base Titrations', short: 'Titrations', unit: 'Unit 1.1', icon: '🧪' },
    { id: 'idealgas', label: 'Ideal Gas Calculations', short: 'Ideal Gas', unit: 'Unit 1.2', icon: '🎈' },
    { id: 'redox', label: 'Redox Titration', short: 'Redox', unit: 'Unit 3.1', icon: '⚡' },
    { id: 'enthalpy', label: 'Enthalpy of Combustion', short: 'Enthalpy', unit: 'Unit 3.4', icon: '🔥' },
    { id: 'acids', label: 'pH & Weak Acids', short: 'pH Acids', unit: 'Unit 3.9', icon: '🍋' },
    { id: 'buffers', label: 'Buffer Solutions', short: 'Buffers', unit: 'Unit 3.9', icon: '🛡️' },
    { id: 'rates', label: 'Reaction Rates', short: 'Rates', unit: 'Unit 3.5', icon: '⏱️' }

  ];

  const handleNav = (id) => {
    setCurrentApplet(id);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- STICKY HEADER NAVIGATION --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <button onClick={() => handleNav('dashboard')} className="hover:opacity-80 transition-opacity shrink min-w-0 text-left">
            <HeaderBrand />
          </button>

          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {applets.map((app) => (
              <button
                key={app.id}
                onClick={() => handleNav(app.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                  currentApplet === app.id ? 'bg-blue-50 text-[#326fa0]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {app.short}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsDataBookletOpen(true)}
              className="bg-[#326fa0] hover:bg-[#255580] text-white font-bold px-4 md:px-5 py-2 rounded-full shadow-md transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <span>📚</span>
              <span className="hidden sm:inline">Data Booklet</span>
            </button>
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-inner animate-in slide-in-from-top">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">WJEC Tools</div>
            {applets.map(app => (
              <button
                key={app.id}
                onClick={() => handleNav(app.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${
                  currentApplet === app.id ? 'bg-blue-50 text-[#326fa0]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="mr-3">{app.icon}</span>
                {app.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {currentApplet === 'dashboard' && (
          <div className="py-4 md:py-4 animate-fade-in text-center flex flex-col items-center">
            <div className="w-[60%] max-w-[450px] mb-10">
              <Logo className="w-full h-auto object-contain" />
            </div>

            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12 px-4">
              Interactive applets aligned with the WJEC A-Level Chemistry specification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
              {applets.map(app => (
                <button 
                  key={app.id}
                  onClick={() => handleNav(app.id)}
                  className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-[#326fa0] hover:shadow-lg transition-all group flex items-center gap-5"
                >
                  <div className="w-14 h-14 shrink-0 bg-slate-50 text-[#326fa0] rounded-xl flex items-center justify-center text-3xl group-hover:bg-[#326fa0] group-hover:text-white transition-colors">
                    {app.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-xl text-slate-800 leading-tight mb-0.5 group-hover:text-[#326fa0] transition-colors">
                      {app.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {app.unit}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Applet Renderer */}
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
