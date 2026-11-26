import React, { useState, useEffect } from 'react';
import ScientificInput from '../../components/shared/ScientificInput';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';

const MODE_OPTIONS = [
  { value: 'calculate_k', label: 'Rate Constant (k)' },
  { value: 'determine_order', label: 'Deduce Reaction Order' },
  { value: 'arrhenius', label: 'Arrhenius Equation (Ea)' },
];

const ReactionRates = ({ onComplete }) => {
  const [mode, setMode] = useState('calculate_k');
  const [isRandomMode, setIsRandomMode] = useState(false);
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
  const [showHint, setShowHint] = useState(false);

  const generateProblem = (forcedMode = null) => {
    const modes = ['calculate_k', 'determine_order', 'arrhenius'];
    const selection = forcedMode || (isRandomMode ? 'random' : mode);
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;
    setMode(targetMode);
    let newProb = {};

    if (targetMode === 'calculate_k') {
      const rateLaws = [
        {
          eq: <>Rate = k[A]</>,
          unit: 's⁻¹',
          hasB: false,
          calcRate: (k, a) => k * a,
          rearrangeHint: 'k = Rate / [A]'
        },
        {
          eq: <>Rate = k[A][B]</>,
          unit: 'mol⁻¹ dm³ s⁻¹',
          hasB: true,
          calcRate: (k, a, b) => k * a * b,
          rearrangeHint: 'k = Rate / ([A][B])'
        },
        {
          eq: <>Rate = k[A]<sup>2</sup></>,
          unit: 'mol⁻¹ dm³ s⁻¹',
          hasB: false,
          calcRate: (k, a) => k * a * a,
          rearrangeHint: 'k = Rate / [A]²'
        },
        {
          eq: <>Rate = k[A][B]<sup>2</sup></>,
          unit: 'mol⁻² dm⁶ s⁻¹',
          hasB: true,
          calcRate: (k, a, b) => k * a * b * b,
          rearrangeHint: 'k = Rate / ([A][B]²)'
        },
        {
          eq: <>Rate = k[A]<sup>2</sup>[B]<sup>2</sup></>,
          unit: 'mol⁻³ dm⁹ s⁻¹',
          hasB: true,
          calcRate: (k, a, b) => k * a * a * b * b,
          rearrangeHint: 'k = Rate / ([A]²[B]²)'
        }
      ];
      const law = rateLaws[Math.floor(Math.random() * rateLaws.length)];
      const concA = (0.10 + Math.random() * 0.25).toFixed(2);
      const concB = (0.15 + Math.random() * 0.25).toFixed(2);
      const kVal = (0.4 + Math.random() * 3.6).toFixed(2);
      const rate = law.calcRate(parseFloat(kVal), parseFloat(concA), parseFloat(concB));

      newProb = {
        title: "Calculating the Rate Constant (k)",
        text: (
          <div className="space-y-1.5">
            <p>
              A reaction follows the rate equation: <b>{law.eq}</b>.
            </p>
            <p>At a specific temperature, an experiment yields the following data:</p>
            <ul className="space-y-1 font-mono text-xs sm:text-sm bg-white p-3 rounded-xl border border-slate-200">
              <li>[A] = <b>{concA} mol dm<sup>-3</sup></b></li>
              {law.hasB && <li>[B] = <b>{concB} mol dm<sup>-3</sup></b></li>}
              <li>Initial Rate = <b>{rate >= 0.001 ? rate.toFixed(5) : rate.toExponential(3)} mol dm<sup>-3</sup> s<sup>-1</sup></b></li>
            </ul>
          </div>
        ),
        question: "Calculate the value of the rate constant (k) and select its correct units.",
        label: "k =",
        correctAnswer: kVal,
        correctUnit: law.unit,
        rearrangeHint: law.rearrangeHint,
        instanceId: `k_${law.unit}_${kVal}_${concA}`,
        hasUnits: true,
        useSciInput: true
      };
    } else if (targetMode === 'determine_order') {
      const order = Math.floor(Math.random() * 3);
      const speciesList = ['X', 'A', 'NO', 'BrO₃⁻', 'H₂O₂'];
      const species = speciesList[Math.floor(Math.random() * speciesList.length)];
      const concOptions = [0.05, 0.10, 0.15, 0.20, 0.25];
      const conc1 = concOptions[Math.floor(Math.random() * concOptions.length)];
      const mult = Math.random() > 0.4 ? 2 : 3;
      const conc2 = conc1 * mult;
      const baseRate = parseFloat((0.0012 + Math.random() * 0.0053).toFixed(4));
      const rate2 = baseRate * Math.pow(mult, order);

      newProb = {
        title: "Deducing Reaction Order",
        text: (
          <div className="space-y-3">
            <p>
              The table below shows initial rate data obtained for reactant <b>{species}</b>, at a constant temperature:
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full border-collapse text-[11px] sm:text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-2 py-1.5 text-center font-bold text-slate-600 border-r border-slate-200">Expt</th>
                    <th className="px-2 py-1.5 text-center font-bold text-slate-600 border-r border-slate-200">Initial [{species}] / mol dm<sup>-3</sup></th>
                    <th className="px-2 py-1.5 text-center font-bold text-slate-600">Initial Rate / mol dm<sup>-3</sup> s<sup>-1</sup></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="px-2 py-1.5 text-center border-r border-slate-200">1</td>
                    <td className="px-2 py-1.5 text-center border-r border-slate-200">{conc1.toFixed(2)}</td>
                    <td className="px-2 py-1.5 text-center">{baseRate.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1.5 text-center border-r border-slate-200">2</td>
                    <td className="px-2 py-1.5 text-center border-r border-slate-200">{conc2.toFixed(2)}</td>
                    <td className="px-2 py-1.5 text-center">{rate2.toFixed(4)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ),
        question: `Deduce the order of reaction with respect to reactant ${species}.`,
        label: "Order =",
        correctAnswer: order.toString(),
        instanceId: `order_${order}_${species}_${conc1}_${mult}_${baseRate}`,
        hasUnits: false,
        useSciInput: false
      };
    } else {
      // WJEC Data Booklet Constants: T(K) = T(°C) + 273, R = 8.31 J K⁻¹ mol⁻¹
      const tempCelsius = Math.floor(15 + Math.random() * 45);
      const tempK = tempCelsius + 273;
      const ea_kj = Math.floor(42 + Math.random() * 55);
      const aChoices = [
        { val: 2.5e9, mantissa: '2.50', exp: 9 },
        { val: 5.0e10, mantissa: '5.00', exp: 10 },
        { val: 1.0e11, mantissa: '1.00', exp: 11 },
        { val: 4.0e12, mantissa: '4.00', exp: 12 },
        { val: 8.0e13, mantissa: '8.00', exp: 13 }
      ];
      const selectedA = aChoices[Math.floor(Math.random() * aChoices.length)];
      const A = selectedA.val;
      const R = 8.31;
      const k = A * Math.exp(-(ea_kj * 1000) / (R * tempK));
      const lnRatio = Math.log(k / A);

      newProb = {
        title: "The Arrhenius Equation",
        text: (
          <div className="space-y-2">
            <p>
              A reaction has a frequency factor (A) of <b>{selectedA.mantissa} &times; 10<sup>{selectedA.exp}</sup> s<sup>-1</sup></b>.
            </p>
            <p>
              At a temperature of <b>{tempCelsius} °C</b>, the rate constant (k) is determined to be <b>{k.toExponential(3)} s<sup>-1</sup></b>.
            </p>
            <p className="text-xs text-slate-500">
              (Use WJEC Data Booklet constants: R = 8.31 J K⁻¹ mol⁻¹, T(K) = T(°C) + 273)
            </p>
          </div>
        ),
        question: "Calculate the activation energy (Eₐ) for this reaction in kJ mol⁻¹.",
        label: "Eₐ =",
        correctAnswer: ea_kj.toString(),
        unit: "kJ mol⁻¹",
        instanceId: `arrhenius_${ea_kj}_${tempCelsius}_${selectedA.exp}`,
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
    setShowHint(false);
  };

  useEffect(() => {
    generateProblem('calculate_k');
  }, []);

  const verifyArrheniusGate = () => {
    if (!problem?.arrheniusTargets) return;
    const { tempK, lnRatio } = problem.arrheniusTargets;
    const uT = parseFloat(gateInputs.tK);
    const uLn = parseFloat(gateInputs.lnRatio);
    const errors = [];

    if (isNaN(uT) || Math.abs(uT - tempK) > 0.5) {
      errors.push('Convert °C to Kelvin by adding 273');
    }
    if (isNaN(uLn) || Math.abs(uLn - lnRatio) > 0.25) {
      errors.push('Check ln(k / A): use the natural logarithm (ln, not log₁₀) and keep the negative sign');
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
        onComplete?.(problem.instanceId || `k_${problem.correctAnswer}`);
      } else if (error < 0.02 && studentUnit !== problem.correctUnit) {
        setFeedback({ message: "Value correct! However, your units are incorrect. Carefully write out the rate equation units and cancel them down.", status: 'error' });
      } else {
        setFeedback({ message: `Incorrect. Check your rearrangement: ${problem.rearrangeHint || 'k = Rate / [A][B]...'}.`, status: 'error' });
      }
    } else {
      if (problem.title.includes("Order")) {
        if (studentAnswer.trim() === problem.correctAnswer) {
          setFeedback({ message: `Correct! The reaction is order ${problem.correctAnswer}.`, status: 'success' });
          onComplete?.(problem.instanceId || `order_${problem.correctAnswer}`);
        } else {
          setFeedback({ message: "Incorrect. Compare how changing the concentration changes the initial rate.", status: 'error' });
        }
      } else {
        if (error < 0.02) {
          setFeedback({ message: `Correct! The value is ${problem.correctAnswer} ${problem.unit}.`, status: 'success' });
          onComplete?.(problem.instanceId || `arrhenius_${problem.correctAnswer}`);
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
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="applet-header !mb-0">{problem.title}</div>

      <AdaptivePicker
        label="Choose Practice Mode"
        options={MODE_OPTIONS}
        value={mode}
        isRandomActive={isRandomMode}
        onChange={(val) => {
          setIsRandomMode(false);
          generateProblem(val);
        }}
        onRandom={() => {
          setIsRandomMode(true);
          generateProblem('random');
        }}
        collapseBelow="sm"
      />

      <div className="applet-workbench">
        {/* Left Column: Experimental / Initial-Rates Table or Arrhenius Data Card + Hint */}
        <div className="applet-workbench-sticky space-y-3.5">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="question-text !mb-0 text-left text-sm sm:text-base leading-relaxed">
              {problem.text}
            </div>

            <div className="flex flex-col items-start">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="min-h-[34px] px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
              >
                💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
              {showHint && (
                <div className="mt-2.5 w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
                  <strong className="font-black text-amber-900">Kinetics Method: </strong>
                  {mode === 'arrhenius' || problem.title.includes('Arrhenius')
                    ? 'Take natural logs of k = A e^(−Eₐ/RT) to give ln(k/A) = −Eₐ/(RT). Multiply R (8.31) × T(K) × −ln(k/A), then divide by 1000 to convert J mol⁻¹ into kJ mol⁻¹.'
                    : problem.title.includes('Order')
                    ? 'Compare the factor change in concentration ([X]₂ ÷ [X]₁ = f) against the factor change in initial rate (Rate₂ ÷ Rate₁ = fⁿ), where n is the reaction order.'
                    : 'Rearrange Rate = k[A]^m[B]^n to make k the subject, and substitute (mol dm⁻³) into every concentration term to cancel units cleanly.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Gate, Inputs, Unit Selector, Actions & Feedback */}
        <div className="space-y-4">
          {/* WJEC Step 1 Unit Gate for Arrhenius Mode */}
          {mode === 'arrhenius' && problem.arrheniusTargets && (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-slate-400">
                    WJEC Unit Trap Gate
                  </span>
                  <h4 className="text-xs font-black text-slate-800 mt-1">
                    Step 1: Convert T to Kelvin &amp; Evaluate ln(k / A)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setGateEnabled(!gateEnabled)}
                  className="min-h-[34px] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shrink-0 cursor-pointer"
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
                        className="w-full min-h-[38px] px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
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
                        className="w-full min-h-[38px] px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-medium">
                      ln(k / A) = −Eₐ / (RT) ⇒ Eₐ (J mol⁻¹) = −R × T × ln(k / A)
                    </span>
                    <button
                      type="button"
                      onClick={verifyArrheniusGate}
                      disabled={gateVerified}
                      className="min-h-[36px] px-4 py-1.5 bg-[#326fa0] text-white text-xs font-black rounded-xl hover:bg-[#255580] disabled:bg-emerald-600 transition-colors shrink-0 cursor-pointer"
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

          <div className="font-bold text-center md:text-left text-[0.95rem] px-1 text-[var(--chem-text-main)]">
            {problem.question}
          </div>

          <div className={`flex flex-col items-center gap-4 w-full transition-opacity ${isArrheniusLocked ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
              {problem.useSciInput ? (
                <div className="px-3 sm:px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm w-full sm:w-auto">
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
                <div className="flex flex-wrap items-center justify-center gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm w-full sm:w-auto">
                  <span className="font-bold text-sm text-[var(--chem-text-main)]">{problem.label}</span>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    className={`chem-input min-h-[40px] bg-white !max-w-[10rem] ${feedback.status}`}
                    value={studentAnswer}
                    onChange={(e) => { setStudentAnswer(e.target.value); if (feedback.message) setFeedback({ message: '', status: '' }); }}
                    onKeyDown={(e) => e.key === 'Enter' && (feedback.status === 'success' ? generateProblem() : checkAnswer())}
                    placeholder="0.00"
                  />
                  {!problem.hasUnits && problem.unit && (
                    <span className="font-bold text-sm text-[var(--chem-text-main)]">{problem.unit}</span>
                  )}
                </div>
              )}
            </div>

            {problem.hasUnits && (
              <div className="w-full text-center">
                <span className="chem-choice-label">Select Units</span>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {[
                    { id: 's⁻¹', display: <>s<sup>−1</sup></> },
                    { id: 'mol⁻¹ dm³ s⁻¹', display: <>mol<sup>−1</sup> dm<sup>3</sup> s<sup>−1</sup></> },
                    { id: 'mol⁻² dm⁶ s⁻¹', display: <>mol<sup>−2</sup> dm<sup>6</sup> s<sup>−1</sup></> },
                    { id: 'mol⁻³ dm⁹ s⁻¹', display: <>mol<sup>−3</sup> dm<sup>9</sup> s<sup>−1</sup></> }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStudentUnit(opt.id)}
                      className={`chem-choice-btn min-h-[40px] ${studentUnit === opt.id ? 'active' : ''}`}
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
            <button className="btn btn-secondary" onClick={() => generateProblem()}>Next Problem &rarr;</button>
          </div>

          {feedback.message && (
            <div className={`feedback-box flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`}>
              <span>{feedback.message}</span>
              {feedback.status === 'success' && (
                <button
                  type="button"
                  onClick={() => generateProblem()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Next Problem &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionRates;
