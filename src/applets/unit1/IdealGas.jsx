import React, { useState, useEffect } from 'react';
import ScientificInput from '../../components/shared/ScientificInput';

const IdealGas = ({ onComplete }) => {
  const [mode, setMode] = useState('calculate_P');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // WJEC Examiner Unit-Conversion Gate State
  const [gateEnabled, setGateEnabled] = useState(true);
  const [gateVerified, setGateVerified] = useState(false);
  const [gateInputs, setGateInputs] = useState({ pPa: '', vM3: '', tK: '', nMol: '' });
  const [gateFeedback, setGateFeedback] = useState({ type: '', message: '' });

  const targetGases = [
    { name: 'carbon dioxide', formula: 'CO₂', mr: 44.0 },
    { name: 'oxygen', formula: 'O₂', mr: 32.0 },
    { name: 'nitrogen', formula: 'N₂', mr: 28.0 },
    { name: 'argon', formula: 'Ar', mr: 39.9 },
    { name: 'helium', formula: 'He', mr: 4.0 },
    { name: 'neon', formula: 'Ne', mr: 20.2 },
    { name: 'methane', formula: 'CH₄', mr: 16.0 },
    { name: 'ethane', formula: 'C₂H₆', mr: 30.0 },
    { name: 'ammonia', formula: 'NH₃', mr: 17.0 },
    { name: 'sulfur dioxide', formula: 'SO₂', mr: 64.1 },
    { name: 'chlorine', formula: 'Cl₂', mr: 71.0 },
    { name: 'nitrogen dioxide', formula: 'NO₂', mr: 46.0 }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['calculate_P', 'calculate_V', 'calculate_n', 'calculate_T'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    const gas = targetGases[Math.floor(Math.random() * targetGases.length)];
    const R = 8.31;

    const mass = (Math.random() * 4.0 + 0.5).toFixed(2);
    const moles = parseFloat(mass) / gas.mr;

    const tempCelsius = Math.floor(Math.random() * 150 - 30);
    const tempKelvin = tempCelsius + 273;

    const pressPa = Math.floor(Math.random() * 140000 + 80000);
    const pressKpa = (pressPa / 1000).toFixed(1);
    const pressAtm = (pressPa / 101000).toFixed(2);

    const volM3 = (moles * R * tempKelvin) / pressPa;
    const volDm3 = (volM3 * 1000).toFixed(2);
    const volCm3 = (volM3 * 1000000).toFixed(0);

    let questionText = '';
    let targetLabel = '';
    let correctAnswer = 0;
    let unitExpectation = '';

    const supplyAtm = Math.random() > 0.5;
    const useDm3 = Math.random() > 0.5;
    const volString = useDm3 ? `${volDm3} dm³` : `${volCm3} cm³`;

    // Expected SI values from given rounded numbers
    const expectedP_Pa = supplyAtm ? parseFloat(pressAtm) * 101000 : parseFloat(pressKpa) * 1000;
    const expectedV_M3 = useDm3 ? parseFloat(volDm3) / 1000 : parseFloat(volCm3) / 1000000;

    switch (targetMode) {
      case 'calculate_P': {
        const targetInAtm = Math.random() > 0.5;
        questionText = `A sample containing ${mass} g of ${gas.name} (${gas.formula}) occupies a fixed container with a volume of ${volString} at a temperature of ${tempCelsius} °C. Calculate the internal pressure inside the vessel in ${targetInAtm ? 'atmospheres (atm)' : 'pascals (Pa)'}.`;
        targetLabel = 'p =';
        correctAnswer = targetInAtm ? parseFloat(pressAtm) : pressPa;
        unitExpectation = targetInAtm ? 'atm' : 'Pa';
        break;
      }

      case 'calculate_V':
        questionText = `Determine the ideal geometric volume in cubic meters (m³) occupied by a mass of ${mass} g of gaseous ${gas.name} (${gas.formula}) under a recorded system pressure of ${supplyAtm ? `${pressAtm} atm` : `${pressKpa} kPa`} and a temperature of ${tempCelsius} °C.`;
        targetLabel = 'V =';
        correctAnswer = volM3;
        unitExpectation = 'm³';
        break;

      case 'calculate_n':
        questionText = `A sealed containment vessel contains an unestablished amount of ${gas.name} (${gas.formula}) gas. Instruments record the internal pressure at ${supplyAtm ? `${pressAtm} atm` : `${pressKpa} kPa`}, the enclosure volume at ${volString}, and the system temperature at ${tempCelsius} °C. Calculate the chemical amount of gas present in moles (mol).`;
        targetLabel = 'n =';
        correctAnswer = moles;
        unitExpectation = 'mol';
        break;

      case 'calculate_T':
        questionText = `A gas cylinder confines ${mass} g of ${gas.name} (${gas.formula}) gas inside an available space of ${volString}. If internal pressure sensors display a reading of ${supplyAtm ? `${pressAtm} atm` : `${pressKpa} kPa`}, calculate the thermodynamic temperature of the system in kelvin (K).`;
        targetLabel = 'T =';
        correctAnswer = tempKelvin;
        unitExpectation = 'K';
        break;

      default:
        break;
    }

    setProblem({
      questionText,
      targetLabel,
      correctAnswer,
      targetMode,
      unitExpectation,
      instanceId: `${targetMode}_${gas.formula}_${mass}_${tempCelsius}_${pressPa}`,
      siTargets: {
        pPa: expectedP_Pa,
        vM3: expectedV_M3,
        tK: tempKelvin,
        nMol: moles,
        pressDisplay: supplyAtm ? `${pressAtm} atm` : `${pressKpa} kPa`,
        volDisplay: volString,
        tempDisplay: `${tempCelsius} °C`,
        massDisplay: `${mass} g of ${gas.formula} (Mr = ${gas.mr})`
      }
    });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
    setGateVerified(false);
    setGateInputs({ pPa: '', vM3: '', tK: '', nMol: '' });
    setGateFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem('calculate_P');
  }, []);

  const verifyUnitGate = () => {
    if (!problem) return;
    const { siTargets, targetMode } = problem;
    const errors = [];

    if (targetMode !== 'calculate_P') {
      const uP = parseFloat(gateInputs.pPa);
      if (isNaN(uP) || Math.abs(uP - siTargets.pPa) / siTargets.pPa > 0.02) {
        errors.push(`Pressure p in Pa (convert ${siTargets.pressDisplay} → ${Math.round(siTargets.pPa)} Pa)`);
      }
    }
    if (targetMode !== 'calculate_V') {
      const uV = parseFloat(gateInputs.vM3);
      if (isNaN(uV) || Math.abs(uV - siTargets.vM3) / siTargets.vM3 > 0.02) {
        errors.push(`Volume V in m³ (convert ${siTargets.volDisplay} → ${siTargets.vM3.toExponential(2)} m³)`);
      }
    }
    if (targetMode !== 'calculate_T') {
      const uT = parseFloat(gateInputs.tK);
      if (isNaN(uT) || Math.abs(uT - siTargets.tK) > 1) {
        errors.push(`Temperature T in K (${siTargets.tempDisplay} + 273 = ${siTargets.tK} K)`);
      }
    }
    if (targetMode !== 'calculate_n') {
      const uN = parseFloat(gateInputs.nMol);
      if (isNaN(uN) || Math.abs(uN - siTargets.nMol) / siTargets.nMol > 0.02) {
        errors.push(`Moles n = m / Mr (${siTargets.nMol.toFixed(4)} mol)`);
      }
    }

    if (errors.length === 0) {
      setGateVerified(true);
      setGateFeedback({
        type: 'success',
        message: '✅ SI Unit Gate Verified! All values are in standard SI units (Pa, m³, K, mol). Step 2 is unlocked.'
      });
    } else {
      setGateFeedback({
        type: 'error',
        message: `⚠️ Unit Trap Alert — check: ${errors.join(' • ')}`
      });
    }
  };

  const checkAnswer = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;

    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctAnswer) / problem.correctAnswer);

    if (error < 0.025) {
      setFeedback({
        type: 'success',
        message: `Correct! Your calculated value matches the baseline specification standard.`
      });
      onComplete?.(problem.instanceId || `${problem.targetMode}_${problem.correctAnswer.toPrecision(3)}`);
    } else {
      let recoveryHint = 'Incorrect. Check your dimensional conversions: ';
      if (problem.targetMode === 'calculate_P') {
        recoveryHint += `Volume must be converted to m³, mass to moles (m/Mr), and temperature to Kelvin. Your target answer must be stated in ${problem.unitExpectation}.`;
      } else {
        recoveryHint += `Ensure pressure is converted to Pa (using 1.01 × 10⁵ Pa if given in atm), volume is converted to m³, and temperature is converted to Kelvin (${problem.correctAnswer < 200 ? 'Check your negative sign handling!' : 'T = °C + 273'}).`;
      }

      setFeedback({ type: 'error', message: recoveryHint });
    }
  };

  if (!problem) return null;

  const isStep2Locked = gateEnabled && !gateVerified;

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
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] focus:ring-1 focus:ring-[#326fa0] transition-all cursor-pointer shadow-sm text-center"
          >
            <option value="calculate_P">Calculate Pressure (p)</option>
            <option value="calculate_V">Calculate Volume (V)</option>
            <option value="calculate_n">Calculate Amount (n)</option>
            <option value="calculate_T">Calculate Temperature (T)</option>
          </select>

          <button
            type="button"
            onClick={() => { generateProblem('random'); }}
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

      <div className="applet-header">Ideal Gas Calculations</div>

      <div className="question-text text-center px-2 leading-relaxed">
        {problem.questionText}
      </div>

      {/* WJEC Step 1 SI Unit-Conversion Gate */}
      <div className="w-full max-w-xl mx-auto my-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm" style={{ textTransform: 'none' }}>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              WJEC Unit Trap Gate
            </span>
            <h4 className="text-xs font-black text-slate-800 mt-1">
              Step 1: Convert Given Quantities to SI Units (Pa, m³, K, mol)
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
              {problem.targetMode !== 'calculate_P' && (
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    p ({problem.siTargets.pressDisplay}) in Pa:
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    disabled={gateVerified}
                    value={gateInputs.pPa}
                    onChange={(e) => setGateInputs({ ...gateInputs, pPa: e.target.value })}
                    placeholder="e.g. 101000"
                    className="w-full px-2 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                  />
                </div>
              )}

              {problem.targetMode !== 'calculate_V' && (
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    V ({problem.siTargets.volDisplay}) in m³:
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    disabled={gateVerified}
                    value={gateInputs.vM3}
                    onChange={(e) => setGateInputs({ ...gateInputs, vM3: e.target.value })}
                    placeholder="e.g. 0.0025"
                    className="w-full px-2 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                  />
                </div>
              )}

              {problem.targetMode !== 'calculate_T' && (
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    T ({problem.siTargets.tempDisplay}) in K:
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    disabled={gateVerified}
                    value={gateInputs.tK}
                    onChange={(e) => setGateInputs({ ...gateInputs, tK: e.target.value })}
                    placeholder="°C + 273"
                    className="w-full px-2 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                  />
                </div>
              )}

              {problem.targetMode !== 'calculate_n' && (
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    n = m / M<sub>r</sub> in mol:
                  </label>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    disabled={gateVerified}
                    value={gateInputs.nMol}
                    onChange={(e) => setGateInputs({ ...gateInputs, nMol: e.target.value })}
                    placeholder="mol (3 s.f.)"
                    className="w-full px-2 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-medium">
                1 dm³ = 10⁻³ m³ • 1 cm³ = 10⁻⁶ m³ • 1 atm = 1.01 × 10⁵ Pa
              </span>
              <button
                type="button"
                onClick={verifyUnitGate}
                disabled={gateVerified}
                className="px-4 py-1.5 bg-[#326fa0] text-white text-xs font-black rounded-xl hover:bg-[#255580] disabled:bg-emerald-600 transition-colors shrink-0"
              >
                {gateVerified ? 'Units Verified ✓' : 'Verify SI Units'}
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

      {/* Step 2: Final pV = nRT Calculation */}
      <div className={`w-full flex items-center justify-center my-6 overflow-x-auto transition-opacity ${isStep2Locked ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-row items-center justify-center flex-nowrap whitespace-nowrap gap-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
          <ScientificInput
            value={coeff}
            exponent={exp}
            onValueChange={setCoeff}
            onExponentChange={setExp}
            label={problem.targetLabel}
            status={feedback.type}
          />
          <span className="text-sm font-bold text-slate-500 ml-1 select-none">
            {problem.unitExpectation}
          </span>
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer} disabled={isStep2Locked}>Check Answer</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>New Problem</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default IdealGas;
