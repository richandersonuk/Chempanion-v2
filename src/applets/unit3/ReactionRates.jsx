import React, { useState, useEffect } from 'react';
import ScientificInput from '../../components/shared/ScientificInput';

const ReactionRates = ({ onComplete }) => {
  const [mode, setMode] = useState('calculate_k');
  const [problem, setProblem] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [studentUnit, setStudentUnit] = useState('');
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // WJEC Arrhenius Unit-Conversion Gate State
  const [gateEnabled, setGateEnabled] = useState(true);
  const [gateVerified, setGateVerified] = useState(false);
  const [gateInputs, setGateInputs] = useState({ tK: '', lnRatio: '' });
  const [gateFeedback, setGateFeedback] = useState({ type: '', message: '' });

  const generateProblem = (forcedMode = null) => {
    const modes = ['calculate_k', 'determine_order', 'arrhenius'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;
    setMode(targetMode);
    let newProb = {};

    if (targetMode === 'calculate_k') {
      const concA = (0.10 + Math.random() * 0.15).toFixed(2);
      const concB = (0.20 + Math.random() * 0.20).toFixed(2);
      const kVal = (0.5 + Math.random() * 2.5).toFixed(2);
      const rate = parseFloat(kVal) * parseFloat(concA) * Math.pow(parseFloat(concB), 2);

      newProb = {
        title: "Calculating the Rate Constant (k)",
        text: (
          <>
            A reaction follows the rate equation: <b>Rate = k[A][B]<sup>2</sup></b>.<br />
            At a specific temperature, an experiment yields the following data:<br />
            [A] = <b>{concA} mol dm<sup>-3</sup></b><br />
            [B] = <b>{concB} mol dm<sup>-3</sup></b><br />
            Initial Rate = <b>{rate.toFixed(5)} mol dm<sup>-3</sup> s<sup>-1</sup></b>
          </>
        ),
        question: "Calculate the value of the rate constant (k) and select its correct units.",
        label: "k =",
        correctAnswer: kVal,
        correctUnit: "mol-2 dm6 s-1",
        hasUnits: true,
        useSciInput: true
      };
    } else if (targetMode === 'determine_order') {
      const order = Math.floor(Math.random() * 3);
      const baseRate = 0.0012;
      const rate2 = order === 0 ? baseRate : (order === 1 ? baseRate * 2 : baseRate * 4);

      newProb = {
        title: "Deducing Reaction Order",
        text: (
          <>
            The table below shows initial rate data obtained for a reactant, <b>X</b>, at a constant temperature:<br /><br />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', border: '1px solid var(--chem-border)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--chem-bg-box)' }}>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--chem-border)' }}>Expt</th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--chem-border)' }}>Initial [X] / mol dm<sup>-3</sup></th>
                  <th style={{ padding: '0.5rem', border: '1px solid var(--chem-border)' }}>Initial Rate / mol dm<sup>-3</sup> s<sup>-1</sup></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>1</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>0.10</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>{baseRate.toFixed(4)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>2</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>0.20</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid var(--chem-border)' }}>{rate2.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </>
        ),
        question: "Deduce the order of reaction with respect to reactant X.",
        label: "Order =",
        correctAnswer: order.toString(),
        hasUnits: false,
        useSciInput: false
      };
    } else {
      // WJEC Data Booklet Constants: T(K) = T(°C) + 273, R = 8.31 J K⁻¹ mol⁻¹
      const tempCelsius = Math.floor(20 + Math.random() * 30);
      const tempK = tempCelsius + 273;
      const ea_kj = Math.floor(50 + Math.random() * 40);
      const A = 1.0e11;
      const R = 8.31;
      const k = A * Math.exp(-(ea_kj * 1000) / (R * tempK));
      const lnRatio = Math.log(k / A);

      newProb = {
        title: "The Arrhenius Equation",
        text: (
          <>
            A reaction has a frequency factor (A) of <b>1.00 × 10<sup>11</sup> s<sup>-1</sup></b>.<br />
            At a temperature of <b>{tempCelsius} °C</b>, the rate constant (k) is determined to be <b>{k.toExponential(3)} s<sup>-1</sup></b>.<br />
            <span className="text-xs text-slate-500">(Use WJEC Data Booklet constants: R = 8.31 J K⁻¹ mol⁻¹, T(K) = T(°C) + 273)</span>
          </>
        ),
        question: "Calculate the activation energy (Eₐ) for this reaction in kJ mol⁻¹.",
        label: "Eₐ =",
        correctAnswer: ea_kj.toString(),
        unit: "kJ mol⁻¹",
        hasUnits: false,
        useSciInput: false,
        arrheniusTargets: {
          tempCelsius,
          tempK,
          lnRatio,
          eaJoules: ea_kj * 1000
        }
      };
    }

    setProblem(newProb);
    setStudentAnswer('');
    setCoeff('');
    setExp('');
    setStudentUnit('');
    setFeedback({ message: '', status: '' });
    setGateVerified(false);
    setGateInputs({ tK: '', lnRatio: '' });
    setGateFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem('calculate_k');
  }, []);

  const verifyArrheniusGate = () => {
    if (!problem?.arrheniusTargets) return;
    const { tempCelsius, tempK, lnRatio } = problem.arrheniusTargets;
    const uT = parseFloat(gateInputs.tK);
    const uLn = parseFloat(gateInputs.lnRatio);
    const errors = [];

    if (isNaN(uT) || Math.abs(uT - tempK) > 0.5) {
      errors.push(`Temperature T in K (${tempCelsius} + 273 = ${tempK} K)`);
    }
    if (isNaN(uLn) || Math.abs(uLn - lnRatio) > 0.25) {
      errors.push(`ln(k / A) = ${lnRatio.toFixed(2)} (note the negative sign!)`);
    }

    if (errors.length === 0) {
      setGateVerified(true);
      setGateFeedback({
        type: 'success',
        message: '✅ Step 1 Verified! Now calculate Eₐ = −R × T × ln(k/A) and divide by 1000 to convert J mol⁻¹ to kJ mol⁻¹.'
      });
    } else {
      setGateFeedback({
        type: 'error',
        message: `⚠️ Check: ${errors.join(' • ')}`
      });
    }
  };

  const checkAnswer = () => {
    if (!problem) return;

    const userAns = problem.useSciInput
      ? parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp, 10))
      : parseFloat(studentAnswer);

    if (isNaN(userAns) && !problem.title.includes("Order")) return;

    const correctAns = parseFloat(problem.correctAnswer);
    const error = Math.abs((userAns - correctAns) / (correctAns || 1));

    if (problem.hasUnits) {
      if (error < 0.02 && studentUnit === problem.correctUnit) {
        setFeedback({ message: "Correct! Both the rate constant value and units are perfectly accurate.", status: 'success' });
        onComplete?.(`k_${problem.correctAnswer}`);
      } else if (error < 0.02 && studentUnit !== problem.correctUnit) {
        setFeedback({ message: "Value correct! However, your units are incorrect. Carefully write out the rate equation units and cancel them down.", status: 'error' });
      } else {
        setFeedback({ message: "Incorrect. Check your rearrangement: k = Rate / ([A][B]²).", status: 'error' });
      }
    } else {
      if (problem.title.includes("Order")) {
        if (studentAnswer.trim() === problem.correctAnswer) {
          setFeedback({ message: `Correct! The reaction is order ${problem.correctAnswer}.`, status: 'success' });
          onComplete?.(`order_${problem.correctAnswer}`);
        } else {
          setFeedback({ message: "Incorrect. Compare how doubling the concentration changes the initial rate.", status: 'error' });
        }
      } else {
        if (error < 0.02) {
          setFeedback({ message: `Correct! The value is ${problem.correctAnswer} ${problem.unit}.`, status: 'success' });
          onComplete?.(`arrhenius_${problem.correctAnswer}`);
        } else if (Math.abs(userAns - correctAns * 1000) / (correctAns * 1000) < 0.03) {
          setFeedback({ message: "Unit Trap! You calculated Eₐ in J mol⁻¹. Divide by 1000 to convert to kJ mol⁻¹.", status: 'error' });
        } else {
          setFeedback({ message: "Incorrect. Remember to convert temperature to Kelvin (T = °C + 273), use R = 8.31 J K⁻¹ mol⁻¹, and divide by 1000 for kJ mol⁻¹.", status: 'error' });
        }
      }
    }
  };

  if (!problem) return null;

  const isArrheniusLocked = mode === 'arrhenius' && gateEnabled && !gateVerified;

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
            <option value="calculate_k">Rate Constant (k)</option>
            <option value="determine_order">Deduce Reaction Order</option>
            <option value="arrhenius">Arrhenius Equation (Ea)</option>
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

      {/* WJEC Step 1 Unit Gate for Arrhenius Mode */}
      {mode === 'arrhenius' && problem.arrheniusTargets && (
        <div className="w-full max-w-lg mx-auto my-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs" style={{ textTransform: 'none' }}>
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                WJEC Unit Trap Gate
              </span>
              <h4 className="text-xs font-black text-slate-800 mt-1">
                Step 1: Convert T to Kelvin & Evaluate ln(k / A)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setGateEnabled(!gateEnabled)}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shrink-0"
            >
              {gateEnabled ? 'Skip Gate' : 'Enable Gate'}
            </button>
          </div>

          {gateEnabled && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    Temperature T in K (°C + 273):
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    disabled={gateVerified}
                    value={gateInputs.tK}
                    onChange={(e) => setGateInputs({ ...gateInputs, tK: e.target.value })}
                    placeholder="e.g. 298"
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                  />
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    ln(k / A) (to 1 d.p.):
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    disabled={gateVerified}
                    value={gateInputs.lnRatio}
                    onChange={(e) => setGateInputs({ ...gateInputs, lnRatio: e.target.value })}
                    placeholder="e.g. -24.5"
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-medium">
                  ln(k / A) = −Eₐ / (RT) ⇒ Eₐ (J mol⁻¹) = −R × T × ln(k / A)
                </span>
                <button
                  type="button"
                  onClick={verifyArrheniusGate}
                  disabled={gateVerified}
                  className="px-4 py-1.5 bg-[#326fa0] text-white text-xs font-black rounded-xl hover:bg-[#255580] disabled:bg-emerald-600 transition-colors shrink-0"
                >
                  {gateVerified ? 'Verified ✓' : 'Verify Step 1'}
                </button>
              </div>

              {gateFeedback.message && (
                <div className={`p-2.5 rounded-xl text-xs font-bold ${
                  gateFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {gateFeedback.message}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        {problem.question}
      </div>

      <div className={`flex flex-col items-center gap-4 w-full max-w-md mx-auto mb-4 transition-opacity ${isArrheniusLocked ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center justify-center w-full">
          {problem.useSciInput ? (
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
              <ScientificInput
                value={coeff}
                exponent={exp}
                onValueChange={setCoeff}
                onExponentChange={setExp}
                label={problem.label}
                status={feedback.status}
              />
            </div>
          ) : (
            <>
              <span style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{problem.label}</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                onWheel={(e) => e.currentTarget.blur()}
                className={`chem-input ${feedback.status}`}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="0.00"
                style={{ maxWidth: '12rem', textAlign: 'center' }}
              />
              {!problem.hasUnits && <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{problem.unit}</span>}
            </>
          )}
        </div>

        {problem.hasUnits && (
          <div className="chem-choice-section mt-2">
            <span className="chem-choice-label">Select Units</span>
            <div className="chem-choice-group">
              {[
                { id: 's-1', display: <>s<sup>-1</sup></> },
                { id: 'mol-1 dm3 s-1', display: <>mol<sup>-1</sup> dm<sup>3</sup> s<sup>-1</sup></> },
                { id: 'mol-2 dm6 s-1', display: <>mol<sup>-2</sup> dm<sup>6</sup> s<sup>-1</sup></> }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStudentUnit(opt.id)}
                  className={`chem-choice-btn ${studentUnit === opt.id ? 'active' : ''}`}
                >
                  {opt.display}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer} disabled={isArrheniusLocked}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default ReactionRates;
