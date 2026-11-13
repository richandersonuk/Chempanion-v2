import React, { useState, useEffect } from 'react';

const BufferSolutions = ({ onComplete }) => {
  const [mode, setMode] = useState('acidic_buffer');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  const bufferSystems = [
    { acid: 'ethanoic acid', salt: 'sodium ethanoate', ka: 1.74e-5, kaMantissa: '1.74', kaExp: -5, saltMr: 82.0 },
    { acid: 'methanoic acid', salt: 'sodium methanoate', ka: 1.78e-4, kaMantissa: '1.78', kaExp: -4, saltMr: 68.0 },
    { acid: 'propanoic acid', salt: 'sodium propanoate', ka: 1.35e-5, kaMantissa: '1.35', kaExp: -5, saltMr: 96.0 },
    { acid: 'benzoic acid', salt: 'sodium benzoate', ka: 6.30e-5, kaMantissa: '6.30', kaExp: -5, saltMr: 144.0 },
    { acid: 'nitrous acid', salt: 'sodium nitrite', ka: 4.50e-4, kaMantissa: '4.50', kaExp: -4, saltMr: 69.0 }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['acidic_buffer', 'salt_addition', 'buffer_addition'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;
    setMode(targetMode);
    let newProb = {};
    const sys = bufferSystems[Math.floor(Math.random() * bufferSystems.length)];
    const pKa = -Math.log10(sys.ka);

    if (targetMode === 'acidic_buffer') {
      const concAcid = (0.08 + Math.random() * 0.25).toFixed(2);
      const concSalt = (0.05 + Math.random() * 0.20).toFixed(2);
      const ph = pKa + Math.log10(parseFloat(concSalt) / parseFloat(concAcid));

      newProb = {
        title: 'Acidic Buffer pH',
        text: (
          <>
            A buffer solution contains {sys.acid} (K<sub>a</sub> = {sys.kaMantissa} &times; 10<sup>{sys.kaExp}</sup> mol dm<sup>-3</sup>) at{' '}
            <b>{concAcid} mol dm<sup>-3</sup></b>{' '}
            and {sys.salt} at{' '}
            <b>{concSalt} mol dm<sup>-3</sup></b>.
          </>
        ),
        question: 'Calculate the pH of this buffer solution.',
        correct: ph.toFixed(2),
        hint: 'Use [H⁺] = Ka × ([Acid] / [Salt]) or pH = pKa + log₁₀([Salt] / [Acid]).',
        instanceId: `buf_${sys.acid}_${concAcid}_${concSalt}`,
        isScientific: false,
      };
    } else if (targetMode === 'salt_addition') {
      const volOptions = [100, 200, 250, 500, 1000];
      const vol = volOptions[Math.floor(Math.random() * volOptions.length)];
      const concAcid = parseFloat((0.10 + Math.random() * 0.30).toFixed(2));
      const massSalt = parseFloat(((vol / 500) * (1.2 + Math.random() * 2.2) * (sys.saltMr / 82.0)).toFixed(2));
      const molesSalt = massSalt / sys.saltMr;
      const concSalt = (molesSalt * 1000) / vol;
      const ph = pKa + Math.log10(concSalt / concAcid);

      newProb = {
        title: 'Buffer Preparation',
        text: (
          <>
            A student dissolves <b>{massSalt.toFixed(2)} g</b> of solid {sys.salt} (M<sub>r</sub> = {sys.saltMr.toFixed(1)}) in{' '}
            <b>{vol} cm<sup>3</sup></b>{' '}
            of{' '}
            <b>{concAcid.toFixed(2)} mol dm<sup>-3</sup></b>{' '}
            {sys.acid} (K<sub>a</sub> = {sys.kaMantissa} &times; 10<sup>{sys.kaExp}</sup> mol dm<sup>-3</sup>). Assume negligible volume change.
          </>
        ),
        question: 'Calculate the pH of the resulting buffer solution.',
        correct: ph.toFixed(2),
        hint: 'Find moles of salt added (mass / Mr), divide by volume in dm³ to get [Salt], then compute pH.',
        instanceId: `salt_${sys.acid}_${vol}_${massSalt}`,
        isScientific: false,
      };
    } else {
      const molAcid = parseFloat((0.15 + Math.random() * 0.20).toFixed(2));
      const molSalt = parseFloat((0.15 + Math.random() * 0.20).toFixed(2));
      const addAlkali = Math.random() > 0.5;
      const molAdded = parseFloat((0.005 + Math.random() * 0.015).toFixed(3));
      const newAcid = addAlkali ? molAcid - molAdded : molAcid + molAdded;
      const newSalt = addAlkali ? molSalt + molAdded : molSalt - molAdded;
      const ph = pKa + Math.log10(newSalt / newAcid);

      newProb = {
        title: `Buffer Action (+${addAlkali ? 'NaOH' : 'HCl'})`,
        text: (
          <>
            A 1.00 dm<sup>3</sup> buffer solution contains <b>{molAcid.toFixed(2)} mol</b> of {sys.acid} (K<sub>a</sub> = {sys.kaMantissa} &times; 10<sup>{sys.kaExp}</sup> mol dm<sup>-3</sup>) and <b>{molSalt.toFixed(2)} mol</b> of {sys.salt}.{' '}
            A student adds <b>{molAdded.toFixed(3)} mol</b> of {addAlkali ? 'solid NaOH' : 'gaseous HCl'} with no change in total volume.
          </>
        ),
        question: 'Calculate the new pH after addition.',
        correct: ph.toFixed(2),
        hint: addAlkali
          ? 'Added OH⁻ reacts with the weak acid: moles of acid decrease by n(OH⁻) while moles of salt increase by n(OH⁻).'
          : 'Added H⁺ reacts with the conjugate base (salt): moles of salt decrease by n(H⁺) while moles of acid increase by n(H⁺).',
        instanceId: `act_${addAlkali ? 'oh' : 'h'}_${sys.acid}_${molAcid}_${molAdded}`,
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

    if (Math.abs(userVal - parseFloat(problem.correct)) <= 0.02) {
      setFeedback({
        message: 'Correct! pH = ' + problem.correct,
        status: 'success',
      });
      onComplete?.(problem.instanceId || `${mode}_${problem.correct}`);
    } else {
      setFeedback({
        message: `Incorrect. ${problem.hint || 'Check your pKa calculation and [Salt]/[Acid] ratio.'}`,
        status: 'error',
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container">
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
            <option value="buffer_addition">Buffer Action (+NaOH / +HCl)</option>
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

      <div className="input-group">
        <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>pH = </label>
        <input
          type="number"
          step="any"
          inputMode="decimal"
          onWheel={(e) => e.currentTarget.blur()}
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
