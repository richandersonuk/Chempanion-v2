import React, { useState, useEffect } from 'react';
import ScientificInput from './ScientificInput';

const IdealGas = () => {
  const [mode, setMode] = useState('calculate_P');
  const [problem, setProblem] = useState(null);
  const [coeff, setCoeff] = useState('');
  const [exp, setExp] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const targetGases = [
    { name: 'carbon dioxide', formula: 'CO₂', mr: 44.01 },
    { name: 'oxygen', formula: 'O₂', mr: 32.00 },
    { name: 'nitrogen', formula: 'N₂', mr: 28.01 },
    { name: 'argon', formula: 'Ar', mr: 39.95 }
  ];

  const generateProblem = (forcedMode = null) => {
    const modes = ['calculate_P', 'calculate_V', 'calculate_n', 'calculate_T'];
    const selection = forcedMode || mode;
    const targetMode = selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    setMode(targetMode);

    const gas = targetGases[Math.floor(Math.random() * targetGases.length)];
    const R = 8.31; // Sourced from data booklet by student

    // Generate core random thermodynamic baselines
    const mass = (Math.random() * 4.0 + 0.5).toFixed(2); // 0.5g - 4.5g
    const moles = parseFloat(mass) / gas.mr;
    
    // Spec edge-case: including sub-zero temperatures like the real papers do (-30°C to 120°C)
    const tempCelsius = Math.floor(Math.random() * 150 - 30); 
    const tempKelvin = tempCelsius + 273;

    const pressPa = Math.floor(Math.random() * 140000 + 80000); // 80,000 Pa - 220,000 Pa
    const pressKpa = (pressPa / 1000).toFixed(1);
    // Convert to atm using the exact Data Booklet conversion scalar factor: 1.01 x 10^5 Pa
    const pressAtm = (pressPa / 101000).toFixed(2); 

    const volM3 = (moles * R * tempKelvin) / pressPa;
    const volDm3 = (volM3 * 1000).toFixed(2);
    const volCm3 = (volM3 * 1000000).toFixed(0);

    let questionText = '';
    let targetLabel = '';
    let correctAnswer = 0;
    let unitExpectation = '';

    // Randomize whether a question presents values in standard kPa or sneaky examiner 'atm'
    const supplyAtm = Math.random() > 0.5;
    const useDm3 = Math.random() > 0.5;
    const volString = useDm3 ? `${volDm3} dm³` : `${volCm3} cm³`;

    switch (targetMode) {
      case 'calculate_P':
        const targetInAtm = Math.random() > 0.5;
        questionText = `A sample containing ${mass} g of ${gas.name} (${gas.formula}) occupies a fixed container with a volume of ${volString} at a temperature of ${tempCelsius} °C. Calculate the internal pressure inside the vessel in ${targetInAtm ? 'atmospheres (atm)' : 'pascals (Pa)'}.`;
        targetLabel = 'p =';
        correctAnswer = targetInAtm ? parseFloat(pressAtm) : pressPa;
        unitExpectation = targetInAtm ? 'atm' : 'Pa';
        break;

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

    setProblem({ questionText, targetLabel, correctAnswer, targetMode, unitExpectation });
    setCoeff('');
    setExp('');
    setFeedback({ type: '', message: '' });
  };

  useEffect(() => {
    generateProblem('calculate_P');
  }, []);

  const checkAnswer = () => {
    if (!coeff || isNaN(parseFloat(coeff))) return;

    const userVal = parseFloat(coeff) * Math.pow(10, exp === '' ? 0 : parseInt(exp));
    const error = Math.abs((userVal - problem.correctAnswer) / problem.correctAnswer);

    // 2.5% tolerance buffer accounts for student rounding steps along the calculation pathway
    if (error < 0.025) {
      setFeedback({
        type: 'success',
        message: `Correct! Your calculated value matches the baseline specification standard.`
      });
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

  return (
    <div className="applet-container">
      
      {/* --- STANDARDIZED DROPDOWN + RANDOM LAYOUT BLOCK --- */}
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

      {/* --- NON-WRAPPING MOBILITY ROW FRAMEWORK --- */}
      <div className="w-full flex items-center justify-center my-6 overflow-x-auto">
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
        <button className="btn btn-primary" onClick={checkAnswer}>Check Answer</button>
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
