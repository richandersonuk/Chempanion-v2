import React, { useState, useEffect, useRef } from 'react';

// Helper component to force correct chemical casing everywhere
const KaLabel = () => <span><i>K</i><sub>a</sub></span>;

const AcidsAndBases = () => {
  const [mode, setMode] = useState('strong_acid');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [exponent, setExponent] = useState('');
  const [showExpModal, setShowExpModal] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // Touch Scroller Logic
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const expInputRef = useRef(null);

  // Auto-focus and auto-select logic
  useEffect(() => {
    if (showExpModal && expInputRef.current) {
      const timer = setTimeout(() => {
        expInputRef.current.focus();
        expInputRef.current.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showExpModal]);

  const generateProblem = (forcedMode = null) => {
    const modes = ['strong_acid', 'strong_base', 'weak_acid', 'ka_find'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;
    
    let newProblem = {
      title: '',
      text: null,
      question: '',
      label: '',
      correctAnswer: '',
      type: '',
      data: []
    };

    if (targetMode === 'strong_acid') {
      const conc = (0.01 + Math.random() * 0.18).toFixed(2);
      newProblem = {
        ...newProblem,
        title: 'Strong Acid Calculation',
        text: <>A student prepares a solution of hydrochloric acid, HCl, with a concentration of <b>{conc} mol dm⁻³</b>.</>,
        question: "Calculate the pH of this solution at 298 K.",
        label: "pH",
        correctAnswer: (-Math.log10(parseFloat(conc))).toFixed(2),
        type: 'ph'
      };
    } else if (targetMode === 'strong_base') {
      const conc = (0.02 + Math.random() * 0.12).toFixed(2);
      newProblem = {
        ...newProblem,
        title: 'Strong Base Calculation',
        text: <>Calculate the pH of a <b>{conc} mol dm⁻³</b> solution of sodium hydroxide, NaOH, at 298 K.</>,
        data: [<><i>K</i><sub>w</sub> = 1.00 × 10⁻¹⁴ mol² dm⁻⁶ at 298 K</>],
        question: "Calculate the pH of the solution:",
        label: "pH",
        correctAnswer: (14 + Math.log10(parseFloat(conc))).toFixed(2),
        type: 'ph'
      };
    } else if (targetMode === 'weak_acid') {
      const conc = (0.10 + Math.random() * 0.20).toFixed(2);
      const kaVal = 1.35e-5;
      newProblem = {
        ...newProblem,
        title: <>Weak Acid Calculation (<KaLabel />)</>,
        text: <>The acid dissociation constant, <KaLabel />, for propanoic acid is <b>1.35 × 10⁻⁵ mol dm⁻³</b> at 298 K. The concentration of the acid is <b>{conc} mol dm⁻³</b>.</>,
        question: <>Calculate the pH of this solution.</>,
        label: "pH",
        correctAnswer: (-Math.log10(Math.sqrt(kaVal * parseFloat(conc)))).toFixed(2),
        type: 'ph'
      };
    } else {
      const conc = (0.05 + Math.random() * 0.15).toFixed(2);
      const targetPh = (2.60 + Math.random() * 1.20).toFixed(2);
      const hPlus = Math.pow(10, -parseFloat(targetPh));
      const kaVal = (hPlus * hPlus) / parseFloat(conc);
      newProblem = {
        ...newProblem,
        title: <>Determining <KaLabel /> from pH</>,
        text: <>A <b>{conc} mol dm⁻³</b> solution of a weak monoprotic acid was found to have a pH of <b>{targetPh}</b> at 298 K.</>,
        question: <>Calculate the acid dissociation constant, <KaLabel />, for this acid.</>,
        label: <KaLabel />,
        correctAnswer: kaVal.toExponential(2),
        type: 'ka'
      };
    }

    setProblem(newProblem);
    setStudentAnswer('');
    setExponent('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => { 
    generateProblem('strong_acid'); 
  }, []);

  const adjustExponent = (amount) => {
    setExponent(prev => {
      const current = prev === '' ? -6 : parseInt(prev);
      return (current + amount).toString();
    });
  };

  const handlePointerDown = (e) => { setIsDragging(true); setStartY(e.clientY); };
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = startY - e.clientY;
    if (Math.abs(diff) > 25) {
      adjustExponent(diff > 0 ? 1 : -1);
      setStartY(e.clientY);
    }
  };

  const checkAnswer = () => {
    if (!studentAnswer || !problem) return;
    const finalVal = (problem.type === 'ka' && exponent) 
      ? parseFloat(studentAnswer) * Math.pow(10, parseFloat(exponent)) 
      : parseFloat(studentAnswer);
    const correctVal = parseFloat(problem.correctAnswer);

    if (problem.type === 'ph') {
      if (studentAnswer === problem.correctAnswer) {
        setFeedback({ message: 'Correct. (2 d.p.)', status: 'success' });
      } else if (parseFloat(studentAnswer).toFixed(2) === problem.correctAnswer) {
        setFeedback({ message: 'Value correct, but WJEC requires 2 decimal places.', status: 'error' });
      } else {
        setFeedback({ message: 'Incorrect calculation.', status: 'error' });
      }
    } else {
      const relError = Math.abs((finalVal - correctVal) / correctVal);
      if (relError < 0.05) setFeedback({ message: 'Correct!', status: 'success' });
      else setFeedback({ message: 'Incorrect. Use the Ka expression correctly.', status: 'error' });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
      
      {/* --- COMPACT DROPDOWN + RANDOM LAYOUT --- */}
<div className="w-full max-w-md mx-auto mb-6 px-4">
  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 text-center">
    Choose Practice Mode
  </span>
  <div className="flex items-center gap-2">
    <select
      value={mode === 'random' ? '' : mode}
      onChange={(e) => { setMode(e.target.value); generateProblem(e.target.value); }}
      className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm"
    >
      <option value="strong_acid">Strong Acid Calculations</option>
      <option value="strong_base">Strong Base Calculations</option>
      <option value="weak_acid">Weak Acid pH Calculations</option>
      <option value="ka_find">Determining Ka from System pH</option>
    </select>
    
    <button
      type="button"
      onClick={() => { setMode('random'); generateProblem('random'); }}
      className={`px-4 py-2.5 text-xs font-black uppercase rounded-xl transition-all border shrink-0 ${
        mode === 'random'
          ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-sm'
          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
      }`}
    >
      Random 🎲
    </button>
  </div>
</div>


      <div className="exam-paper-flow animate-fade-in relative">
        <div className="border-b-2 border-slate-900 mb-6 pb-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tighter normal-case leading-none">
            {problem.title}
          </h2>
        </div>

        <div className="text-slate-800 leading-relaxed text-lg mb-6 text-center md:text-left">{problem.text}</div>

        {problem.data && problem.data.length > 0 && (
          <div className="data-box mb-6">
            <p className="text-xs font-black text-[#326fa0] uppercase mb-2 tracking-widest text-left">Data</p>
            {problem.data.map((d, i) => <div key={i} className="font-mono font-bold text-slate-700 text-left">{d}</div>)}
          </div>
        )}

        <div className="pt-6 border-t border-slate-200">
          <p className="text-base font-bold text-slate-900 mb-4 text-center md:text-left">{problem.question}</p>
          
          <div className="flex flex-col items-center gap-6">
            {/* INPUT ELEMENT WRAPPER BLOCK */}
            <div className="flex items-center bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-[#326fa0] transition-colors shadow-sm">
              <span className="font-black text-[#326fa0] text-lg mr-2 leading-none flex items-center">{problem.label} =</span>
              <div className="flex items-baseline gap-0 leading-none">
                <input 
                  type="number" 
                  value={studentAnswer} 
                  onChange={(e) => setStudentAnswer(e.target.value)} 
                  className="w-20 text-lg font-mono outline-none bg-transparent m-0 p-0 text-center" 
                  placeholder="0.00" 
                />
                {problem.type === 'ka' && exponent && (
                  <span className="text-lg font-mono m-0 p-0 leading-none select-none ml-1">×10<sup className="text-xs">{exponent}</sup></span>
                )}
              </div>

              {problem.type === 'ka' && (
                <button 
                  type="button"
                  onClick={() => { if(exponent === '') setExponent('-6'); setShowExpModal(true); }} 
                  className="ml-3 bg-slate-100 text-[#326fa0] text-[10px] font-black px-2 py-1 rounded border border-slate-300 transition-colors hover:bg-slate-200"
                >
                  ×10<sup>x</sup>
                </button>
              )}
            </div>

            {/* STANDARDIZED ACTION BUTTON ARRANGEMENT */}
            <div className="button-group w-full">
              <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
              <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
            </div>
          </div>
        </div>

        {/* MODAL: Staggered Index Input */}
        {showExpModal && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl animate-fade-in">
            <div className="bg-white border-2 border-slate-900 p-8 rounded-3xl shadow-2xl max-w-xs w-full text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#326fa0] mb-6">Swipe or tap to adjust Index</p>
              <div className="flex justify-center items-start mb-10 h-24">
                <div className="text-4xl font-black text-slate-300 self-end leading-none translate-x-4 select-none">10</div>
                <div 
                  className="flex flex-col items-center cursor-ns-resize select-none translate-x-4" 
                  onPointerDown={handlePointerDown} 
                  onPointerMove={handlePointerMove} 
                  onPointerUp={() => setIsDragging(false)} 
                  onPointerLeave={() => setIsDragging(false)}
                >
                  <button type="button" onClick={() => adjustExponent(1)} className="text-slate-300 hover:text-[#326fa0] p-1 text-xl">▲</button>
                  <input 
                    ref={expInputRef} 
                    type="number" 
                    value={exponent} 
                    onChange={(e) => setExponent(e.target.value)} 
                    className="w-16 text-4xl font-mono outline-none bg-transparent text-center border-none p-0 m-0" 
                  />
                  <button type="button" onClick={() => adjustExponent(-1)} className="text-slate-300 hover:text-[#326fa0] p-1 text-xl">▼</button>
                </div>
              </div>
              <button type="button" onClick={() => setShowExpModal(false)} className="btn btn-primary w-full py-4 text-lg">Apply Index</button>
              <button type="button" onClick={() => {setExponent(''); setShowExpModal(false);}} className="text-xs font-bold text-slate-400 mt-4 block w-full text-center">Clear</button>
            </div>
          </div>
        )}

        {feedback.message && (
          <div className={`feedback-box mt-6 ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcidsAndBases;
