import React, { useState, useEffect, useRef } from 'react';

export function AcidsAndBases() {
  const [prob, setProb] = useState(null);
  const [userAns, setUserAns] = useState('');
  const [feedback, setFeedback] = useState(null);
  const feedbackRef = useRef(null);

  const generateProblem = () => {
    setUserAns('');
    setFeedback(null);

    const modes = ['pH_strong_acid', 'pH_weak_acid', 'pH_buffer', 'kw_temp', 'ka_pka_conv'];
    const mode = modes[Math.floor(Math.random() * modes.length)];

    let newProb = {};

    if (mode === 'pH_strong_acid') {
      const isDibasic = Math.random() > 0.6;
      const acidFormula = isDibasic ? <>H<sub>2</sub>SO<sub>4</sub></> : <>HCl</>;
      const acidName = isDibasic ? "sulfuric acid" : "hydrochloric acid";
      const conc = parseFloat((0.005 + Math.random() * 0.195).toFixed(3));
      
      const H_conc = isDibasic ? conc * 2 : conc;
      const exactpH = -Math.log10(H_conc);

      newProb = {
        title: "pH of a Strong Acid",
        text: <>A student prepares an aqueous solution of {acidName}, {acidFormula}, with a concentration of {conc} mol dm<sup>-3</sup>.</>,
        question: "Calculate the pH of this solution at 298 K.",
        label: "pH =",
        correct: exactpH,
        validate: (val) => {
          const num = parseFloat(val);
          if (isNaN(num)) return { isCorrect: false, msg: "Please enter a valid numeric value." };
          const diff = Math.abs(num - exactpH);
          if (diff <= 0.02) return { isCorrect: true, msg: `Correct. pH calculated accurately using standard strong acid dissociation rules (${num.toFixed(2)}).` };
          if (Math.abs(num - (-Math.log10(conc))) <= 0.02 && isDibasic) {
            return { isCorrect: false, msg: `Incorrect. Remember that {acidFormula} is a dibasic acid and releases two moles of H⁺ ions per mole of acid.` };
          }
          return { isCorrect: false, msg: "Incorrect. For strong mono/dibasic acids, assume full dissociation to calculate the molar concentration of H⁺ directly." };
        }
      };
    } 
    else if (mode === 'pH_weak_acid') {
      const acids = [
        { name: "ethanoic acid", formula: <>CH<sub>3</sub>COOH</>, ka: 1.74e-5, pka: 4.76 },
        { name: "methanoic acid", formula: <>HCOOH</>, ka: 1.78e-4, pka: 3.75 },
        { name: "propanoic acid", formula: <>C<sub>2</sub>H<sub>5</sub>COOH</>, ka: 1.35e-5, pka: 4.87 }
      ];
      const selected = acids[Math.floor(Math.random() * acids.length)];
      const conc = parseFloat((0.02 + Math.random() * 0.18).toFixed(3));
      
      const exactH = Math.sqrt(selected.ka * conc);
      const exactpH = -Math.log10(exactH);

      newProb = {
        title: "pH of a Weak Acid",
        text: <>An aqueous solution of {selected.name}, {selected.formula}, has a concentration of {conc} mol dm<sup>-3</sup>. (Refer to the Data Booklet for any standard constants required.)</>,
        question: `Calculate the pH of this weak acid solution at 298 K.`,
        label: "pH =",
        correct: exactpH,
        validate: (val) => {
          const num = parseFloat(val);
          if (isNaN(num)) return { isCorrect: false, msg: "Please enter a valid numeric value." };
          if (Math.abs(num - exactpH) <= 0.02) return { isCorrect: true, msg: "Correct. Evaluated appropriately via the standard weak acid approximation [H⁺] = √(Ka × [HA])." };
          if (Math.abs(num - (-Math.log10(conc))) <= 0.1) return { isCorrect: false, msg: "Incorrect. You treated this compound as a fully dissociated strong acid instead of a weak acid." };
          return { isCorrect: false, msg: "Incorrect. State the expression for Ka, apply the standard approximations for weak acids, solve for [H⁺], and then compute the pH." };
        }
      };
    }
    else if (mode === 'pH_buffer') {
      const concAcid = parseFloat((0.05 + Math.random() * 0.15).toFixed(2));
      const concSalt = parseFloat((0.05 + Math.random() * 0.15).toFixed(2));
      const ka = 1.74e-5;
      
      const exactH = ka * (concAcid / concSalt);
      const exactpH = -Math.log10(exactH);

      newProb = {
        title: "Acidic Buffer Solutions",
        text: <>An acidic buffer solution contains ethanoic acid at a concentration of {concAcid} mol dm<sup>-3</sup> and sodium ethanoate at a concentration of {concSalt} mol dm<sup>-3</sup>. (Refer to the Data Booklet for any standard constants required.)</>,
        question: "Calculate the exact pH of this buffer mixture at 298 K.",
        label: "pH =",
        correct: exactpH,
        validate: (val) => {
          const num = parseFloat(val);
          if (isNaN(num)) return { isCorrect: false, msg: "Please enter a valid numeric value." };
          if (Math.abs(num - exactpH) <= 0.02) return { isCorrect: true, msg: "Correct. Buffer pH calculated successfully using Henderson-Hasselbalch principles or equilibrium ratios." };
          return { isCorrect: false, msg: "Incorrect. For an acidic buffer, rearrange the Ka expression to make [H⁺] the subject: [H⁺] = Ka × ([acid]/[salt])." };
        }
      };
    }
    else if (mode === 'kw_temp') {
      const systemData = [
        { temp: "310 K (Body Temperature)", kw: 2.4e-14, pH: 6.81 },
        { temp: "323 K", kw: 5.48e-14, pH: 6.63 },
        { temp: "273 K", kw: 1.14e-15, pH: 7.47 }
      ];
      const selected = systemData[Math.floor(Math.random() * systemData.length)];
      const askForMutedNeutral = Math.random() > 0.5;

      const base = (selected.kw * 10**15).toFixed(2);
      const exp = -15;

      if (askForMutedNeutral) {
        newProb = {
          title: "Ionic Product of Water (Kw)",
          text: <>At a different temperature, the ionic product of water, K<sub>w</sub>, has a value of <>{base} &times; 10<sup>{exp}</sup></> mol<sup>2</sup> dm<sup>-6</sup>.</>,
          question: `Calculate the pH of pure water at this temperature, and state whether it remains neutral.`,
          label: "pH =",
          correct: selected.pH,
          validate: (val) => {
            const num = parseFloat(val);
            if (isNaN(num)) return { isCorrect: false, msg: "Please provide a valid numeric value." };
            if (Math.abs(num - selected.pH) <= 0.03) {
              return { isCorrect: true, msg: `Correct! The pH is ${num.toFixed(2)}. Remember that water is still neutral because [H⁺] = [OH⁻] at all temperatures, even though the pH is not 7.00.` };
            }
            return { isCorrect: false, msg: "Incorrect. In pure water, [H⁺] = √Kw. Use this concentration value to determine the corresponding neutral pH line." };
          }
        };
      } else {
        const concNaOH = parseFloat((0.01 + Math.random() * 0.09).toFixed(3));
        const exactH = selected.kw / concNaOH;
        const exactpH = -Math.log10(exactH);

        newProb = {
          title: "pH of a Strong Base at Non-Standard Temp",
          text: <>A solution of sodium hydroxide, NaOH, has a concentration of {concNaOH} mol dm<sup>-3</sup>. At this specific elevated temperature, K<sub>w</sub> = <>{base} &times; 10<sup>{exp}</sup></> mol<sup>2</sup> dm<sup>-6</sup>.</>,
          question: "Calculate the precise pH of this strong alkaline solution at this altered thermal limit.",
          label: "pH =",
          correct: exactpH,
          validate: (val) => {
            const num = parseFloat(val);
            if (isNaN(num)) return { isCorrect: false, msg: "Enter a numerical result." };
            if (Math.abs(num - exactpH) <= 0.03) return { isCorrect: true, msg: "Correct. Successfully evaluated using non-standard Kw data boundaries." };
            return { isCorrect: false, msg: "Incorrect. Calculate [OH⁻] from the strong base, then use the provided temperature-specific Kw value to find [H⁺], and convert to pH." };
          }
        };
      }
    }
    else {
      // mode === 'ka_pka_conv'
      const askForKa = Math.random() > 0.5; // Fixed compilation scope mapping mismatch leak
      const valKa = parseFloat((1.0 + Math.random() * 8.9).toFixed(2)) * 10**-5;
      const valPka = -Math.log10(valKa);

      const baseKa = (valKa * 10**5).toFixed(2);

      newProb = {
        title: "Equilibrium Constant Conversions",
        text: askForKa 
          ? <>An organic weak chemical species possesses a pK<sub>a</sub> constant index profile of {valPka.toFixed(2)} at standard equilibrium conditions.</>
          : <>A particular weak carboxylic diagnostic substrate has a K<sub>a</sub> value of <>{baseKa} &times; 10<sup>-5</sup></> mol dm<sup>-3</sup>.</>,
        question: askForKa ? "Calculate the value of Ka for this acid." : "Calculate the precise pKa value for this acid.",
        label: askForKa ? "Kₐ =" : "pKₐ =",
        correct: askForKa ? valKa : valPka,
        validate: (val) => {
          const num = parseFloat(val);
          if (isNaN(num)) return { isCorrect: false, msg: "Provide a valid analytical number." };
          if (askForKa) {
            const ratio = num / valKa;
            if (ratio >= 0.95 && ratio <= 1.05) return { isCorrect: true, msg: "Correct. Ka calculated successfully from pKa." };
            return { isCorrect: false, msg: "Incorrect. To convert pKa back to Ka, evaluate the inverse log base operation: Ka = 10^(-pKa)." };
          } else {
            if (Math.abs(num - valPka) <= 0.02) return { isCorrect: true, msg: "Correct. pKa calculated successfully via -log₁₀(Ka)." };
            return { isCorrect: false, msg: "Incorrect. The conversion relationship follows standard logarithmic rules: pKa = -log₁₀(Ka)." };
          }
        }
      };
    }

    setProb(newProb);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!prob || !userAns.trim()) return;
    const res = prob.validate(userAns);
    setFeedback(res);

    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  if (!prob) return <div className="text-center p-8 text-[var(--chem-text-muted)]">Loading parameters...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-[var(--chem-border-subtle)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--chem-text-main)]">{prob.title}</h2>
          <p className="text-xs text-[var(--chem-text-muted)] font-medium mt-0.5">WJEC Unit 3: Acids, Bases and Buffer Equilibria</p>
        </div>
        <button
          onClick={generateProblem}
          className="px-3 py-1.5 text-xs font-bold bg-[var(--chem-bg-muted)] hover:bg-[var(--chem-border-subtle)] border border-[var(--chem-border-subtle)] rounded-lg transition-colors text-[var(--chem-text-main)] shrink-0 self-start sm:self-center"
        >
          🎲 New Variant
        </button>
      </div>

      <div className="bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl p-5 shadow-inner">
        <p className="text-sm text-[var(--chem-text-main)] leading-relaxed font-medium">
          {prob.text}
        </p>
        <p className="text-sm font-bold text-[var(--chem-primary)] mt-3">
          {prob.question}
        </p>
      </div>

      <form onSubmit={handleCheck} className="bg-[var(--chem-bg-card)] border border-[var(--chem-border-subtle)] rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-bold text-[var(--chem-text-main)] min-w-[50px]">
            {prob.label}
          </label>
          <input
            type="text"
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            placeholder="e.g. 4.76 or 1.8e-5"
            className="flex-1 min-w-[160px] max-w-xs px-3.5 py-2 text-sm bg-[var(--chem-bg-main)] border border-[var(--chem-border-subtle)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--chem-primary)] text-[var(--chem-text-main)] font-medium"
          />
          <button
            type="submit"
            className="px-5 py-2 text-sm font-bold bg-[var(--chem-primary)] text-white hover:bg-[var(--chem-primary-hover)] rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--chem-primary)]"
          >
            Submit Answer
          </button>
        </div>
      </form>

      {feedback && (
        <div
          ref={feedbackRef}
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-[fadeIn_0.2s_ease-out] ${
            feedback.isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-800'
          }`}
        >
          <span className="text-lg mt-0.5">{feedback.isCorrect ? '✅' : '❌'}</span>
          <div>
            <h4 className="text-sm font-bold">{feedback.isCorrect ? 'Mark Awarded' : 'Check Working'}</h4>
            <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">{feedback.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}