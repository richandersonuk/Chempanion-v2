import React, { useState, useEffect } from 'react';

const BufferSolutions = () => {
  const [mode, setMode] = useState('acidic_buffer');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['acidic_buffer', 'salt_addition'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    let newProb = {};
    const kaVal = 1.74e-5; // Ethanoic acid

    if (targetMode === 'acidic_buffer') {
      const concAcid = (0.1 + Math.random() * 0.2).toFixed(2);
      const concSalt = (0.05 + Math.random() * 0.1).toFixed(2);
      
      // pH = pKa + log([Salt]/[Acid])
      const pKa = -Math.log10(kaVal);
      const ph = pKa + Math.log10(parseFloat(concSalt) / parseFloat(concAcid));

      newProb = {
        title: 'Acidic Buffer pH',
        text: (
          <>
            A buffer solution contains ethanoic acid at a concentration of{' '}
            <b>{concAcid} mol dm<sup>-3</sup></b>{' '}
            and sodium ethanoate at{' '}
            <b>{concSalt} mol dm<sup>-3</sup></b>.
          </>
        ),
        question: 'Calculate the pH of this buffer solution.',
        correct: ph.toFixed(2),
        isScientific: false,
      };
    } else {
      const massSalt = (1.5 + Math.random() * 1.0).toFixed(2); // g of CH3COONa
      const vol = 500; // cm3
      const concAcid = 0.2;
      const molesSalt = parseFloat(massSalt) / 82.03;
      const concSalt = (molesSalt * 1000) / vol;
      const pKa = -Math.log10(kaVal);
      const ph = pKa + Math.log10(concSalt / concAcid);

      newProb = {
        title: 'Buffer Preparation',
        text: (
          <>
            A student adds <b>{massSalt} g</b> of sodium ethanoate (M<sub>r</sub> = 82.0) to{' '}
            <b>500 cm<sup>3</sup></b>{' '}
            of{' '}
            <b>0.20 mol dm<sup>-3</sup></b>{' '}
            ethanoic acid.
          </>
        ),
        question: 'Calculate the pH of the resulting solution.',
        correct: ph.toFixed(2),
        isScientific: false,
      };
    }

    setProblem(newProb);
    setCoeff('');
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem('acidic_buffer');
  }, []);

  const checkAnswer = () => {
    const userVal = parseFloat(coeff);
    if (!coeff || isNaN(userVal)) return;

    if (userVal.toFixed(2) === parseFloat(problem.correct).toFixed(2)) {
      setFeedback({
        message: 'Correct! pH = ' + problem.correct,
        status: 'success',
      });
    } else {
      setFeedback({
        message: 'Incorrect. Check your pKa calculation and [Salt]/[Acid] ratio.',
        status: 'error',
      });
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
      <option value="acidic_buffer">Standard Acidic Buffer pH</option>
      <option value="salt_addition">Buffer Salt Mass Additions</option>
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


      <div className="applet-header">{problem.title}</div>
      <div className="question-text text-center">{problem.text}</div>
      
      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        {problem.question}
      </div>

      {/* INPUT INTERFACE */}
      <div className="input-group">
        <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>pH = </label>
        <input
          type="number"
          className={`chem-input ${feedback.status}`}
          value={coeff}
          onChange={(e) => setCoeff(e.target.value)}
          placeholder="0.00"
          style={{ maxWidth: '12rem', textAlign: 'center' }}
        />
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>
          Check Answer
        </button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>
          New Problem
        </button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default BufferSolutions;
