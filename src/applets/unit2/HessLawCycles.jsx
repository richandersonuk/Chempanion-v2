import React, { useState, useEffect, useRef } from 'react';
import { AdaptivePicker } from '../../components/shared/AdaptivePicker';

const DeltaH = ({ sub, std = true }) => (
  <span className="whitespace-nowrap">
    ΔH{sub ? <sub>{sub}</sub> : null}{std ? '°' : ''}
  </span>
);

const shuffleArray = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const MULTIPLIER_OPTIONS = [
  { val: '0', label: '0 (ΔH° = 0)' },
  { val: '0.5', label: '×½' },
  { val: '1', label: '×1' },
  { val: '2', label: '×2' },
  { val: '3', label: '×3' },
  { val: '4', label: '×4' },
];

const HESS_REACTIONS = [
  {
    id: 'ethene_hyd',
    type: 'formation',
    title: 'Hydration of Ethene',
    equation: 'C₂H₄(g) + H₂O(g) → C₂H₅OH(l)',
    bottomBox: '2C(s) + 3H₂(g) + ½O₂(g)',
    builderDistractors: [
      '2CO₂(g) + 3H₂O(l)',
      'C(s) + H₂(g) + O₂(g)',
      '2C(g) + 6H(g) + O(g)',
    ],
    reactants: [
      { label: 'C₂H₄(g)', coeff: 1, baseVal: 52 },
      { label: 'H₂O(g)', coeff: 1, baseVal: -242 },
    ],
    products: [
      { label: 'C₂H₅OH(l)', coeff: 1, baseVal: -278 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'iron_co',
    type: 'formation',
    title: 'Blast Furnace Reduction of Iron(III) Oxide',
    equation: 'Fe₂O₃(s) + 3CO(g) → 2Fe(s) + 3CO₂(g)',
    bottomBox: '2Fe(s) + 3C(s) + 3O₂(g)',
    builderDistractors: [
      'Fe₂O₃(s) + 3CO₂(g)',
      'Fe(s) + C(s) + O₂(g)',
      '2Fe(g) + 3C(g) + 6O(g)',
    ],
    reactants: [
      { label: 'Fe₂O₃(s)', coeff: 1, baseVal: -824 },
      { label: 'CO(g)', coeff: 3, baseVal: -111 },
    ],
    products: [
      { label: 'Fe(s)', coeff: 2, baseVal: 0, isElement: true },
      { label: 'CO₂(g)', coeff: 3, baseVal: -394 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'nh3_cuo',
    type: 'formation',
    title: 'Reduction of Copper(II) Oxide by Ammonia',
    equation: '2NH₃(g) + 3CuO(s) → N₂(g) + 3Cu(s) + 3H₂O(l)',
    bottomBox: 'N₂(g) + 3H₂(g) + 3Cu(s) + ³⁄₂O₂(g)',
    builderDistractors: [
      '2N(g) + 6H(g) + 3Cu(s) + 3O(g)',
      'N₂(g) + H₂(g) + Cu(s) + O₂(g)',
      '2NO₂(g) + 3CuO(s) + 3H₂O(l)',
    ],
    reactants: [
      { label: 'NH₃(g)', coeff: 2, baseVal: -46 },
      { label: 'CuO(s)', coeff: 3, baseVal: -157 },
    ],
    products: [
      { label: 'N₂(g)', coeff: 1, baseVal: 0, isElement: true },
      { label: 'Cu(s)', coeff: 3, baseVal: 0, isElement: true },
      { label: 'H₂O(l)', coeff: 3, baseVal: -286 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'steam_reform',
    type: 'formation',
    title: 'Steam Reforming of Methane',
    equation: 'CH₄(g) + H₂O(g) → CO(g) + 3H₂(g)',
    bottomBox: 'C(s) + 3H₂(g) + ½O₂(g)',
    builderDistractors: [
      'CO₂(g) + 3H₂O(l)',
      'C(s) + 2H₂(g) + O₂(g)',
      'C(g) + 6H(g) + O(g)',
    ],
    reactants: [
      { label: 'CH₄(g)', coeff: 1, baseVal: -75 },
      { label: 'H₂O(g)', coeff: 1, baseVal: -242 },
    ],
    products: [
      { label: 'CO(g)', coeff: 1, baseVal: -111 },
      { label: 'H₂(g)', coeff: 3, baseVal: 0, isElement: true },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'contact_so3',
    type: 'formation',
    title: 'Contact Process Oxidation of Sulfur Dioxide',
    equation: '2SO₂(g) + O₂(g) → 2SO₃(g)',
    bottomBox: '2S(s) + 3O₂(g)',
    builderDistractors: [
      'S(s) + O₂(g)',
      '2S(g) + 6O(g)',
      '2SO₂(g) + 2O₂(g)',
    ],
    reactants: [
      { label: 'SO₂(g)', coeff: 2, baseVal: -297 },
      { label: 'O₂(g)', coeff: 1, baseVal: 0, isElement: true },
    ],
    products: [
      { label: 'SO₃(g)', coeff: 2, baseVal: -396 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'nahco3_decomp',
    type: 'formation',
    title: 'Thermal Decomposition of Sodium Hydrogencarbonate',
    equation: '2NaHCO₃(s) → Na₂CO₃(s) + CO₂(g) + H₂O(l)',
    bottomBox: '2Na(s) + 2C(s) + H₂(g) + 3O₂(g)',
    builderDistractors: [
      'Na(s) + C(s) + ½H₂(g) + ³⁄₂O₂(g)',
      'Na₂O(s) + 2CO₂(g) + H₂O(l)',
      '2Na(g) + 2C(g) + 2H(g) + 6O(g)',
    ],
    reactants: [
      { label: 'NaHCO₃(s)', coeff: 2, baseVal: -951 },
    ],
    products: [
      { label: 'Na₂CO₃(s)', coeff: 1, baseVal: -1131 },
      { label: 'CO₂(g)', coeff: 1, baseVal: -394 },
      { label: 'H₂O(l)', coeff: 1, baseVal: -286 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'ethane_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Ethane (via Combustion)',
    equation: '2C(s) + 3H₂(g) → C₂H₆(g)',
    bottomBox: '2CO₂(g) + 3H₂O(l)',
    builderDistractors: [
      'CO₂(g) + H₂O(l)',
      '2C(s) + 3H₂(g)',
      '2CO(g) + 3H₂O(g)',
    ],
    reactants: [
      { label: 'C(s)', coeff: 2, baseVal: -394 },
      { label: 'H₂(g)', coeff: 3, baseVal: -286 },
    ],
    products: [
      { label: 'C₂H₆(g)', coeff: 1, baseVal: -1560 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'propane_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Propane (via Combustion)',
    equation: '3C(s) + 4H₂(g) → C₃H₈(g)',
    bottomBox: '3CO₂(g) + 4H₂O(l)',
    builderDistractors: [
      'CO₂(g) + H₂O(l)',
      '3C(s) + 4H₂(g)',
      '3CO₂(g) + 8H₂O(l)',
    ],
    reactants: [
      { label: 'C(s)', coeff: 3, baseVal: -394 },
      { label: 'H₂(g)', coeff: 4, baseVal: -286 },
    ],
    products: [
      { label: 'C₃H₈(g)', coeff: 1, baseVal: -2220 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'ethanol_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Ethanol (via Combustion)',
    equation: '2C(s) + 3H₂(g) + ½O₂(g) → C₂H₅OH(l)',
    bottomBox: '2CO₂(g) + 3H₂O(l)',
    builderDistractors: [
      '2CO₂(g) + 2H₂O(l)',
      '2C(s) + 3H₂(g) + ½O₂(g)',
      'CO₂(g) + H₂O(l)',
    ],
    reactants: [
      { label: 'C(s)', coeff: 2, baseVal: -394 },
      { label: 'H₂(g)', coeff: 3, baseVal: -286 },
      { label: 'O₂(g)', coeff: 0.5, baseVal: 0, isElement: true },
    ],
    products: [
      { label: 'C₂H₅OH(l)', coeff: 1, baseVal: -1367 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'ethene_hyd_c',
    type: 'combustion',
    title: 'Hydrogenation of Ethene (via Combustion)',
    equation: 'C₂H₄(g) + H₂(g) → C₂H₆(g)',
    bottomBox: '2CO₂(g) + 3H₂O(l)',
    builderDistractors: [
      '2C(s) + 3H₂(g)',
      '2CO₂(g) + 2H₂O(l)',
      '4CO₂(g) + 6H₂O(l)',
    ],
    reactants: [
      { label: 'C₂H₄(g)', coeff: 1, baseVal: -1411 },
      { label: 'H₂(g)', coeff: 1, baseVal: -286 },
    ],
    products: [
      { label: 'C₂H₆(g)', coeff: 1, baseVal: -1560 },
    ],
    unknownTarget: { side: 'reactant', index: 0 },
  },
  {
    id: 'methanoic_form_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Methanoic Acid',
    equation: 'C(s) + H₂(g) + O₂(g) → HCOOH(l)',
    bottomBox: 'CO₂(g) + H₂O(l)',
    builderDistractors: [
      'CO₂(g) + 2H₂O(l)',
      'C(s) + H₂(g) + O₂(g)',
      '2CO₂(g) + 2H₂O(l)',
    ],
    reactants: [
      { label: 'C(s)', coeff: 1, baseVal: -394 },
      { label: 'H₂(g)', coeff: 1, baseVal: -286 },
      { label: 'O₂(g)', coeff: 1, baseVal: 0, isElement: true },
    ],
    products: [
      { label: 'HCOOH(l)', coeff: 1, baseVal: -255 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
  {
    id: 'benzene_hyd_c',
    type: 'combustion',
    title: 'Enthalpy of Formation of Methane (via Combustion)',
    equation: 'C(s) + 2H₂(g) → CH₄(g)',
    bottomBox: 'CO₂(g) + 2H₂O(l)',
    builderDistractors: [
      'CO₂(g) + H₂O(l)',
      'C(s) + 2H₂(g)',
      'CO₂(g) + 4H₂O(l)',
    ],
    reactants: [
      { label: 'C(s)', coeff: 1, baseVal: -394 },
      { label: 'H₂(g)', coeff: 2, baseVal: -286 },
    ],
    products: [
      { label: 'CH₄(g)', coeff: 1, baseVal: -890 },
    ],
    unknownTarget: { side: 'product', index: 0 },
  },
];

export default function HessLawCycles({ onComplete }) {
  const [mode, setMode] = useState('cycle_builder');
  const [problem, setProblem] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Cycle Builder State
  const [builderBottom, setBuilderBottom] = useState('');
  const [builderLeftDir, setBuilderLeftDir] = useState('');
  const [builderRightDir, setBuilderRightDir] = useState('');
  const [builderMults, setBuilderMults] = useState({});
  const [builderVerified, setBuilderVerified] = useState(false);
  const [builderFeedback, setBuilderFeedback] = useState(null);
  const [builderRouteEq, setBuilderRouteEq] = useState('');
  const [showBuilderDetails, setShowBuilderDetails] = useState(false);
  const [intermediateMenuOpen, setIntermediateMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!intermediateMenuOpen) return undefined;
    const handlePointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIntermediateMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIntermediateMenuOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [intermediateMenuOpen]);

  // Step 1 Route Gate (calculation modes)
  const [gateEnabled, setGateEnabled] = useState(true);
  const [gateFormula, setGateFormula] = useState('');
  const [gateLeftSum, setGateLeftSum] = useState('');
  const [gateRightSum, setGateRightSum] = useState('');
  const [gateVerified, setGateVerified] = useState(false);
  const [gateFeedback, setGateFeedback] = useState(null);

  // Step 2 Final Calculation Answer
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const generateProblem = (forcedMode = null) => {
    const modes = ['cycle_builder', 'formation_cycle', 'combustion_cycle', 'unknown_species'];
    const selection = forcedMode || mode;
    const subMode =
      selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    if (selection !== 'random') {
      setMode(selection);
    }

    const eligible =
      subMode === 'formation_cycle'
        ? HESS_REACTIONS.filter((r) => r.type === 'formation')
        : subMode === 'combustion_cycle'
        ? HESS_REACTIONS.filter((r) => r.type === 'combustion')
        : HESS_REACTIONS;

    const nonRepeat =
      problem && eligible.length > 1 ? eligible.filter((r) => r.id !== problem.id) : eligible;
    const picked = nonRepeat[Math.floor(Math.random() * nonRepeat.length)];

    const applyJitter = (val, isElement) => {
      if (isElement || val === 0) return 0;
      return val + (Math.floor(Math.random() * 7) - 3);
    };

    const reactants = picked.reactants.map((sp) => ({
      ...sp,
      val: applyJitter(sp.baseVal, sp.isElement),
    }));
    const products = picked.products.map((sp) => ({
      ...sp,
      val: applyJitter(sp.baseVal, sp.isElement),
    }));

    const reactantSum = reactants.reduce((acc, s) => acc + s.coeff * s.val, 0);
    const productSum = products.reduce((acc, s) => acc + s.coeff * s.val, 0);

    // ΔHr calculation depends on cycle arrow direction
    const deltaHr =
      picked.type === 'formation' ? productSum - reactantSum : reactantSum - productSum;

    let unknownMeta = null;
    let knownLeftSum = reactantSum;
    let knownRightSum = productSum;
    let correctAnswer = deltaHr;

    if (subMode === 'unknown_species') {
      const sideList = picked.unknownTarget.side === 'product' ? products : reactants;
      const targetSp = sideList[picked.unknownTarget.index];
      correctAnswer = targetSp.val;
      if (picked.unknownTarget.side === 'product') {
        knownRightSum = productSum - targetSp.coeff * targetSp.val;
      } else {
        knownLeftSum = reactantSum - targetSp.coeff * targetSp.val;
      }
      unknownMeta = {
        side: picked.unknownTarget.side,
        index: picked.unknownTarget.index,
        label: targetSp.label,
        coeff: targetSp.coeff,
      };
    }

    const [lhsText, rhsText] = picked.equation.split(' → ');
    const bottomChoices = shuffleArray([picked.bottomBox, ...(picked.builderDistractors || [])]);

    setProblem({
      ...picked,
      subMode,
      lhsText: lhsText || 'Reactants',
      rhsText: rhsText || 'Products',
      bottomChoices,
      reactants,
      products,
      reactantSum,
      productSum,
      knownLeftSum,
      knownRightSum,
      deltaHr,
      unknownMeta,
      correctAnswer,
    });

    // Reset builder state
    setBuilderBottom('');
    setBuilderLeftDir('');
    setBuilderRightDir('');
    setBuilderMults({});
    setBuilderVerified(false);
    setBuilderFeedback(null);
    setBuilderRouteEq('');
    setShowBuilderDetails(false);
    setIntermediateMenuOpen(false);

    // Reset gate & answer state
    setGateFormula('');
    setGateLeftSum('');
    setGateRightSum('');
    setGateVerified(false);
    setGateFeedback(null);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
  };

  useEffect(() => {
    generateProblem('cycle_builder');
  }, []);

  const cycleArrowDir = (side) => {
    if (!problem || problem.subMode !== 'cycle_builder' || builderVerified) return;
    setBuilderFeedback(null);
    const nextDir = (cur) => (cur === '' ? 'up' : cur === 'up' ? 'down' : 'up');
    if (side === 'left') {
      setBuilderLeftDir((prev) => nextDir(prev));
    } else {
      setBuilderRightDir((prev) => nextDir(prev));
    }
  };

  const handleSetMultiplier = (key, val) => {
    if (builderVerified) return;
    setBuilderFeedback(null);
    setBuilderMults((prev) => ({ ...prev, [key]: val }));
  };

  const handleVerifyBuilder = () => {
    if (!problem) return;
    setIntermediateMenuOpen(false);
    const isFormationCycle = problem.type === 'formation';
    const subChar = isFormationCycle ? 'f' : 'c';
    const expectedDir = isFormationCycle ? 'up' : 'down';
    const messages = [];

    if (builderBottom !== problem.bottomBox) {
      messages.push(
        isFormationCycle ? (
          <span key="bottom">
            Check the Intermediate Species dropdown on the diagram: with <DeltaH sub="f" /> data, the bottom box must hold balanced{' '}
            <strong>constituent elements in their standard states at 298 K</strong> matching the atom counts on either side of the equation.
          </span>
        ) : (
          <span key="bottom">
            Check the Intermediate Species dropdown on the diagram: with <DeltaH sub="c" /> data, the bottom box must hold balanced{' '}
            <strong>complete combustion products (CO₂(g) + H₂O(l))</strong> matching every C and H atom in the equation.
          </span>
        )
      );
    }

    if (!builderLeftDir || !builderRightDir) {
      messages.push(
        <span key="dir-missing">
          Tap both diagonal legs directly on the Hess cycle diagram to set their arrow directions.
        </span>
      );
    } else if (builderLeftDir !== builderRightDir) {
      messages.push(
        <span key="dir-mismatch">
          Both diagonal arrows represent <DeltaH sub={subChar} /> definitions and must point the <strong>same vertical direction</strong> (rather than head-to-tail around the loop).
        </span>
      );
    } else if (builderLeftDir !== expectedDir || builderRightDir !== expectedDir) {
      messages.push(
        isFormationCycle ? (
          <span key="dir-wrong">
            Tap both arrows again to reverse them: <DeltaH sub="f" /> defines forming each compound <strong>from</strong> its elements, so both arrows point <strong>upwards</strong> from the intermediate box.
          </span>
        ) : (
          <span key="dir-wrong">
            Tap both arrows again to reverse them: <DeltaH sub="c" /> defines burning reactants and products <strong>into</strong> oxides, so both arrows point <strong>downwards</strong> to CO₂(g) + H₂O(l).
          </span>
        )
      );
    }

    const rMultWrong = problem.reactants.some(
      (sp, idx) => builderMults[`r-${idx}`] !== (sp.isElement ? '0' : String(sp.coeff))
    );
    const pMultWrong = problem.products.some(
      (sp, idx) => builderMults[`p-${idx}`] !== (sp.isElement ? '0' : String(sp.coeff))
    );

    if (rMultWrong || pMultWrong) {
      messages.push(
        <span key="mults">
          Check stoichiometric multipliers: match each species to its balancing coefficient in the equation, and select{' '}
          <strong>0 (ΔH° = 0)</strong> for any pure element in its standard state whose enthalpy change in this cycle is zero.
        </span>
      );
    }

    if (messages.length === 0) {
      setBuilderVerified(true);
      setBuilderFeedback({
        isCorrect: true,
        messages: [
          <span key="ok">
            ✅ Cycle diagram &amp; stoichiometry verified! Reactant leg ={' '}
            <strong>{problem.reactantSum} kJ mol⁻¹</strong> and Product leg ={' '}
            <strong>{problem.productSum} kJ mol⁻¹</strong>. Complete Step 2 to calculate <DeltaH sub="r" />.
          </span>,
        ],
      });
    } else {
      setBuilderFeedback({ isCorrect: false, messages });
    }
  };

  const handleVerifyGate = () => {
    if (!problem) return;
    const isFormationCycle = problem.type === 'formation';
    const subChar = isFormationCycle ? 'f' : 'c';
    const expectedFormula = isFormationCycle ? 'prod_minus_react' : 'react_minus_prod';
    const uLeft = parseFloat(gateLeftSum);
    const uRight = parseFloat(gateRightSum);
    const targetLeft = problem.subMode === 'unknown_species' ? problem.knownLeftSum : problem.reactantSum;
    const targetRight = problem.subMode === 'unknown_species' ? problem.knownRightSum : problem.productSum;

    const errs = [];
    if (gateFormula !== expectedFormula) {
      errs.push(
        isFormationCycle ? (
          <span key="eq">
            In a Formation cycle, arrows point <strong>up</strong> from elements →{' '}
            <DeltaH sub="r" /> = Σ<DeltaH sub={subChar} />(products) − Σ<DeltaH sub={subChar} />(reactants).
          </span>
        ) : (
          <span key="eq">
            In a Combustion cycle, arrows point <strong>down</strong> to combustion oxides →{' '}
            <DeltaH sub="r" /> = Σ<DeltaH sub={subChar} />(reactants) − Σ<DeltaH sub={subChar} />(products).
          </span>
        )
      );
    }
    if (isNaN(uLeft) || Math.abs(uLeft - targetLeft) > 1.5) {
      errs.push(
        <span key="left">
          Re-check the Reactant route sum (multiply each <DeltaH sub={subChar} /> by its balancing coefficient; elements in standard states have <DeltaH sub="f" /> = 0).
        </span>
      );
    }
    if (isNaN(uRight) || Math.abs(uRight - targetRight) > 1.5) {
      errs.push(
        <span key="right">
          Re-check the Product route sum (multiply each <DeltaH sub={subChar} /> by its balancing coefficient; check for any ΔH° = 0 elements).
        </span>
      );
    }

    if (errs.length === 0) {
      setGateVerified(true);
      setGateFeedback({
        isCorrect: true,
        messages: [
          <span key="ok">✅ Hess Route &amp; Stoichiometry Verified! Step 2 calculation is unlocked.</span>,
        ],
      });
    } else {
      setGateFeedback({ isCorrect: false, messages: errs });
    }
  };

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!problem) return;
    if (feedback?.isCorrect) {
      generateProblem(mode);
      return;
    }

    const isFormationCycle = problem.type === 'formation';
    const subChar = isFormationCycle ? 'f' : 'c';
    const expectedFormula = isFormationCycle ? 'prod_minus_react' : 'react_minus_prod';

    if (problem.subMode === 'cycle_builder' && builderRouteEq !== expectedFormula) {
      setFeedback({
        isCorrect: false,
        msg: isFormationCycle ? (
          <>
            Choose the correct indirect route from Reactants → Intermediate → Products: moving <strong>against</strong> the Reactants leg subtracts Σ(Reactants leg), and moving <strong>with</strong> the Products leg adds Σ(Products leg), giving{' '}
            <DeltaH sub="r" /> = +Σ(Products leg) − Σ(Reactants leg).
          </>
        ) : (
          <>
            Choose the correct indirect route from Reactants → Intermediate → Products: moving <strong>with</strong> the Reactants leg adds Σ(Reactants leg), and moving <strong>against</strong> the Products leg subtracts Σ(Products leg), giving{' '}
            <DeltaH sub="r" /> = +Σ(Reactants leg) − Σ(Products leg).
          </>
        ),
      });
      return;
    }

    const val = parseFloat(userAnswer);
    if (isNaN(val)) return;

    const expected = problem.correctAnswer;
    const reversedSignGuess =
      problem.subMode !== 'unknown_species'
        ? -expected
        : isFormationCycle
        ? problem.reactantSum - problem.productSum
        : problem.productSum - problem.reactantSum;

    if (Math.abs(val - expected) <= 1.5) {
      setFeedback({
        isCorrect: true,
        msg: (
          <>
            Correct!{' '}
            {problem.subMode === 'unknown_species' ? (
              <>
                <DeltaH sub={subChar} />({problem.unknownMeta.label})
              </>
            ) : (
              <DeltaH sub="r" />
            )}{' '}
            = {expected > 0 ? `+${expected}` : expected} kJ mol⁻¹.
          </>
        ),
      });
      onComplete?.(`hess_${problem.id}_${problem.subMode}`);
    } else if (problem.subMode !== 'unknown_species' && Math.abs(val - reversedSignGuess) <= 1.5) {
      setFeedback({
        isCorrect: false,
        msg: isFormationCycle ? (
          <>
            WJEC Route Reversal Trap! For <DeltaH sub="f" /> cycles, arrows point <strong>up</strong> from elements: subtract reactants from products,{' '}
            <DeltaH sub="r" /> = Σ<DeltaH sub="f" />(products) − Σ<DeltaH sub="f" />(reactants).
          </>
        ) : (
          <>
            WJEC Route Reversal Trap! For <DeltaH sub="c" /> cycles, arrows point <strong>down</strong> to oxides: subtract products from reactants,{' '}
            <DeltaH sub="r" /> = Σ<DeltaH sub="c" />(reactants) − Σ<DeltaH sub="c" />(products).
          </>
        ),
      });
    } else if (
      problem.subMode === 'unknown_species' &&
      problem.unknownMeta.coeff > 1 &&
      Math.abs(val - expected * problem.unknownMeta.coeff) <= 3
    ) {
      setFeedback({
        isCorrect: false,
        msg: (
          <>
            WJEC Stoichiometry Trap! The equation contains {problem.unknownMeta.coeff} mol of{' '}
            {problem.unknownMeta.label} — divide by {problem.unknownMeta.coeff} to report the molar value per 1 mole.
          </>
        ),
      });
    } else {
      setFeedback({
        isCorrect: false,
        msg: (
          <>
            Incorrect calculation. Trace the indirect Hess route from Reactants to Products via the bottom box (adding values moved <strong>with</strong> an arrow and subtracting values moved <strong>against</strong> an arrow), multiplying each data value by its equation coefficient.
          </>
        ),
      });
    }
  };

  if (!problem) return null;

  const isBuilder = problem.subMode === 'cycle_builder';
  const isFormation = problem.type === 'formation';
  const subChar = isFormation ? 'f' : 'c';
  const isStep2Locked = isBuilder ? !builderVerified : gateEnabled && !gateVerified;

  const svgLeftDir = isBuilder ? builderLeftDir : isFormation ? 'up' : 'down';
  const svgRightDir = isBuilder ? builderRightDir : isFormation ? 'up' : 'down';

  const allReactMultsSet = problem.reactants.every((_, idx) => builderMults[`r-${idx}`] !== undefined);
  const allProdMultsSet = problem.products.every((_, idx) => builderMults[`p-${idx}`] !== undefined);
  const liveReactSum = problem.reactants.reduce(
    (sum, sp, idx) => sum + (parseFloat(builderMults[`r-${idx}`] || '0') * sp.val),
    0
  );
  const liveProdSum = problem.products.reduce(
    (sum, sp, idx) => sum + (parseFloat(builderMults[`p-${idx}`] || '0') * sp.val),
    0
  );

  const modeOptions = [
    { value: 'cycle_builder', label: 'Hess Cycle Builder' },
    { value: 'formation_cycle', label: <><DeltaH sub="f" /> Cycles</> },
    { value: 'combustion_cycle', label: <><DeltaH sub="c" /> Cycles</> },
    { value: 'unknown_species', label: <>Unknown ΔH° from <DeltaH sub="r" /></> },
  ];

  return (
    <div className="applet-container space-y-4 sm:space-y-5" style={{ textTransform: 'none' }}>
      <AdaptivePicker
        label="Choose Hess Cycle Mode"
        collapseBelow="sm"
        options={modeOptions}
        value={mode}
        isRandomActive={mode === 'random'}
        onChange={(val) => {
          setMode(val);
          generateProblem(val);
        }}
        onRandom={() => {
          setMode('random');
          generateProblem('random');
        }}
        className="max-w-4xl"
      />

      <div className="applet-header !mb-0">{problem.title}</div>

      {/* Prompt & Collapsible Hint */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-2 text-center px-1">
        <p className="text-xs sm:text-sm font-black text-slate-700 leading-relaxed">
          {isBuilder ? (
            <>Tap the cycle diagram to pick the intermediate box and orient both arrows, then calculate <DeltaH sub="r" /> in kJ mol⁻¹.</>
          ) : problem.subMode === 'unknown_species' ? (
            <>Calculate <DeltaH sub={subChar} />({problem.unknownMeta.label}) in kJ mol⁻¹.</>
          ) : (
            <>Calculate the overall enthalpy change (<DeltaH sub="r" />) in kJ mol⁻¹.</>
          )}
        </p>
        <button
          type="button"
          onClick={() => setShowHint((prev) => !prev)}
          className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
        >
          💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
        {showHint && (
          <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 text-left leading-relaxed">
            <strong className="font-black text-amber-900">Hess’s Law Method: </strong>
            {isBuilder ? (
              <>
                Check the subscript in the Standard Enthalpy Data table first: <DeltaH sub="f" /> values define forming compounds from balanced <strong>elements in their standard states</strong> (tap both diagonal arrows <strong>up</strong>, choose the balanced elements from the bottom dropdown, and set standard-state elements to <DeltaH sub="f" /> = 0). <DeltaH sub="c" /> values define burning species completely into <strong>CO₂(g) + H₂O(l)</strong> (tap both diagonal arrows <strong>down</strong> and pick the balanced oxides in the bottom dropdown). Along any indirect path, add values moved <strong>with</strong> an arrow and subtract values moved <strong>against</strong> an arrow.
              </>
            ) : isFormation ? (
              <>
                Formation arrows point <strong>up</strong> from elements to compounds, so{' '}
                <DeltaH sub="r" /> = Σ<DeltaH sub="f" />(products) − Σ<DeltaH sub="f" />(reactants). Unlisted elements in their standard states (e.g. Fe(s), O₂(g), H₂(g), N₂(g)) always have <DeltaH sub="f" /> = 0.
              </>
            ) : (
              <>
                Combustion arrows point <strong>down</strong> from reactants and products to CO₂/H₂O, so{' '}
                <DeltaH sub="r" /> = Σ<DeltaH sub="c" />(reactants) − Σ<DeltaH sub="c" />(products). Always multiply each molar enthalpy by its stoichiometric coefficient.
              </>
            )}
          </div>
        )}
      </div>

      <div className="applet-workbench">
        {/* Left Sticky Workbench Column: Interactive Hybrid Hess Triangle Canvas + Thermodynamic Data Table */}
        <div className="applet-workbench-sticky space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                WJEC Unit 2.1 •{' '}
                {isBuilder && !builderVerified
                  ? 'Hess Cycle Builder'
                  : isFormation
                  ? 'Formation Cycle (Arrows Up)'
                  : 'Combustion Cycle (Arrows Down)'}
              </span>
              {isBuilder && !builderVerified ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                  Tap arrows &amp; pick bottom box
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold text-slate-500">kJ mol⁻¹</span>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center font-mono font-black text-xs sm:text-sm text-slate-800">
              {problem.equation}
            </div>

            {/* Interactive Hybrid HTML/CSS + SVG Hess Cycle Canvas (no overflow-hidden so dropdown renders freely) */}
            <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 p-2.5 sm:p-3.5 space-y-1">
              {/* Top Row: Reactants -- ΔHr° --> Products */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 sm:gap-2.5">
                <div className="bg-white border border-slate-300 rounded-xl px-2 py-2 text-center shadow-2xs">
                  <span className="block text-[9px] font-bold text-slate-400 leading-none mb-1">Reactants</span>
                  <span className="block font-mono font-black text-[11px] sm:text-xs text-slate-800 leading-snug break-words">
                    {problem.lhsText}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center px-0.5 sm:px-1">
                  <span className="font-mono font-black text-[10px] sm:text-xs text-[#235478] whitespace-nowrap">
                    <DeltaH sub="r" /> ={' '}
                    {problem.subMode === 'unknown_species'
                      ? `${problem.deltaHr > 0 ? '+' : ''}${problem.deltaHr}`
                      : '?'}
                  </span>
                  <svg viewBox="0 0 64 14" className="w-12 sm:w-16 h-3.5 overflow-visible" aria-hidden="true">
                    <line x1="2" y1="7" x2="54" y2="7" stroke="#235478" strokeWidth="2.4" strokeLinecap="round" />
                    <polygon points="52,2 62,7 52,12" fill="#235478" />
                  </svg>
                </div>

                <div className="bg-white border border-slate-300 rounded-xl px-2 py-2 text-center shadow-2xs">
                  <span className="block text-[9px] font-bold text-slate-400 leading-none mb-1">Products</span>
                  <span className="block font-mono font-black text-[11px] sm:text-xs text-slate-800 leading-snug break-words">
                    {problem.rhsText}
                  </span>
                </div>
              </div>

              {/* Middle Diagonal Arrow Connector Zone (tapping arrows on canvas is the ONLY way to set them) */}
              <div className="relative h-24 sm:h-28 w-full select-none">
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <defs>
                    <marker id="hess-arrow-amber" markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#d97706" />
                    </marker>
                  </defs>

                  {/* Left diagonal leg */}
                  {svgLeftDir === 'up' ? (
                    <line x1="148" y1="94" x2="82" y2="8" stroke="#d97706" strokeWidth="2.6" markerEnd="url(#hess-arrow-amber)" />
                  ) : svgLeftDir === 'down' ? (
                    <line x1="80" y1="6" x2="146" y2="92" stroke="#d97706" strokeWidth="2.6" markerEnd="url(#hess-arrow-amber)" />
                  ) : (
                    <line x1="148" y1="94" x2="80" y2="6" stroke="#94a3b8" strokeDasharray="5 4" strokeWidth="2.2" />
                  )}
                  {isBuilder && !builderVerified && (
                    <line
                      x1="148"
                      y1="94"
                      x2="80"
                      y2="6"
                      stroke="transparent"
                      strokeWidth="28"
                      className="cursor-pointer"
                      onClick={() => cycleArrowDir('left')}
                    />
                  )}

                  {/* Right diagonal leg */}
                  {svgRightDir === 'up' ? (
                    <line x1="252" y1="94" x2="318" y2="8" stroke="#d97706" strokeWidth="2.6" markerEnd="url(#hess-arrow-amber)" />
                  ) : svgRightDir === 'down' ? (
                    <line x1="320" y1="6" x2="254" y2="92" stroke="#d97706" strokeWidth="2.6" markerEnd="url(#hess-arrow-amber)" />
                  ) : (
                    <line x1="252" y1="94" x2="320" y2="6" stroke="#94a3b8" strokeDasharray="5 4" strokeWidth="2.2" />
                  )}
                  {isBuilder && !builderVerified && (
                    <line
                      x1="252"
                      y1="94"
                      x2="320"
                      y2="6"
                      stroke="transparent"
                      strokeWidth="28"
                      className="cursor-pointer"
                      onClick={() => cycleArrowDir('right')}
                    />
                  )}
                </svg>

                {/* Overlay Diagonal Leg Tap Buttons / Read-only Labels */}
                {isBuilder && !builderVerified ? (
                  <>
                    <button
                      type="button"
                      onClick={() => cycleArrowDir('left')}
                      aria-label="Toggle left diagonal arrow direction"
                      className={`absolute left-[22%] sm:left-[24%] top-1/2 -translate-x-1/2 -translate-y-1/2 min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-black shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                        builderLeftDir
                          ? 'bg-amber-50 border-amber-500 text-amber-900'
                          : 'bg-white border-dashed border-slate-400 text-slate-600 hover:border-[#326fa0] hover:text-[#326fa0]'
                      }`}
                    >
                      {builderLeftDir === 'up' ? '▲ Up' : builderLeftDir === 'down' ? '▼ Down' : '⇅ Tap arrow'}
                    </button>

                    <button
                      type="button"
                      onClick={() => cycleArrowDir('right')}
                      aria-label="Toggle right diagonal arrow direction"
                      className={`absolute right-[22%] sm:right-[24%] top-1/2 translate-x-1/2 -translate-y-1/2 min-h-[40px] px-2.5 py-1.5 rounded-xl border text-[11px] font-black shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                        builderRightDir
                          ? 'bg-amber-50 border-amber-500 text-amber-900'
                          : 'bg-white border-dashed border-slate-400 text-slate-600 hover:border-[#326fa0] hover:text-[#326fa0]'
                      }`}
                    >
                      {builderRightDir === 'up' ? '▲ Up' : builderRightDir === 'down' ? '▼ Down' : '⇅ Tap arrow'}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="absolute left-[22%] sm:left-[24%] top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-white/95 border border-amber-200 font-mono font-black text-[10px] sm:text-[11px] text-amber-700 shadow-2xs whitespace-nowrap">
                      Σ<DeltaH sub={subChar} />(React)
                    </span>
                    <span className="absolute right-[22%] sm:right-[24%] top-1/2 translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-white/95 border border-amber-200 font-mono font-black text-[10px] sm:text-[11px] text-amber-700 shadow-2xs whitespace-nowrap">
                      Σ<DeltaH sub={subChar} />(Prod)
                    </span>
                  </>
                )}
              </div>

              {/* Bottom Row: CSS-Styled Dropdown Selector for Intermediates */}
              {isBuilder && !builderVerified ? (
                <div ref={dropdownRef} className="relative w-full max-w-[20rem] mx-auto">
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={intermediateMenuOpen}
                    onClick={() => setIntermediateMenuOpen((prev) => !prev)}
                    className={`w-full rounded-xl border-2 px-3 py-2 text-left transition-all flex items-center justify-between gap-2 cursor-pointer shadow-xs ${
                      builderBottom
                        ? 'bg-blue-50/80 border-solid border-[#326fa0]'
                        : 'bg-white border-dashed border-slate-400 hover:border-[#326fa0]'
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="block text-[9px] font-bold text-slate-400 leading-none mb-1">
                        Intermediate Species (Bottom Box)
                      </span>
                      <span
                        className={
                          builderBottom
                            ? 'block font-mono font-black text-xs text-[#235478] break-words'
                            : 'block font-sans font-bold text-xs text-slate-500'
                        }
                      >
                        {builderBottom || 'Select intermediate species...'}
                      </span>
                    </div>
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-transform ${
                        intermediateMenuOpen
                          ? 'rotate-180 bg-[#326fa0] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {intermediateMenuOpen && (
                    <div
                      role="listbox"
                      aria-label="Intermediate species choices"
                      className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-1"
                    >
                      {problem.bottomChoices.map((choice) => {
                        const active = builderBottom === choice;
                        return (
                          <button
                            key={choice}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              setBuilderBottom(choice);
                              setIntermediateMenuOpen(false);
                              setBuilderFeedback(null);
                            }}
                            className={`w-full px-3 py-2.5 rounded-lg font-mono font-bold text-xs flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                              active
                                ? 'bg-blue-50 text-[#235478]'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="break-words">{choice}</span>
                            {active && <span className="text-[#326fa0] font-black shrink-0">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`w-full max-w-[20rem] mx-auto rounded-xl border px-3 py-2 text-center ${
                    builderVerified
                      ? 'bg-emerald-50 border-emerald-400'
                      : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <span className="block text-[9px] font-bold text-slate-500 leading-none mb-1">
                    {isFormation ? 'Elements in Standard States' : 'Combustion Oxides (CO₂ + H₂O)'}
                  </span>
                  <span className="block font-mono font-black text-xs text-[#235478] break-words">
                    {problem.bottomBox}
                  </span>
                </div>
              )}
            </div>

            {/* Standard Enthalpy Data Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 tracking-wider">
                <span>Standard Enthalpy Data (<DeltaH sub={subChar} />)</span>
                <span>{isFormation ? 'Elements in std. states = 0' : 'kJ mol⁻¹'}</span>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                {[
                  ...problem.reactants.map((r, i) => ({ ...r, side: 'reactant', idx: i })),
                  ...problem.products.map((p, i) => ({ ...p, side: 'product', idx: i })),
                ]
                  .filter((sp) => !sp.isElement)
                  .map((sp) => {
                    const isMasked =
                      problem.unknownMeta &&
                      problem.unknownMeta.side === sp.side &&
                      problem.unknownMeta.index === sp.idx;
                    return (
                      <div key={`${sp.side}-${sp.label}`} className="flex items-center justify-between px-3 py-2 font-mono">
                        <span className="font-bold text-slate-800">
                          <DeltaH sub={subChar} />({sp.label})
                        </span>
                        <span className={`font-black ${isMasked ? 'text-rose-600' : 'text-[#326fa0]'}`}>
                          {isMasked ? '?' : `${sp.val > 0 ? '+' : ''}${sp.val} kJ mol⁻¹`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Workbench Column */}
        <div className="space-y-4">
          {isBuilder ? (
            <>
              {/* Builder Step 1 Card: Collapses to sleek summary once verified unless expanded */}
              {builderVerified && !showBuilderDetails ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-emerald-900">
                    <span>✅ Step 1 Cycle Verified</span>
                    <span className="font-mono text-[11px] text-emerald-800">
                      Reactants: {problem.reactantSum} • Products: {problem.productSum} kJ mol⁻¹
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBuilderDetails(true)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-black transition-colors cursor-pointer shrink-0"
                  >
                    View details
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-slate-400">
                        Step 1: Species Multipliers &amp; Cycle Verification
                      </span>
                      <h4 className="text-xs font-black text-slate-800 mt-0.5">
                        Assign Stoichiometric Multipliers
                      </h4>
                    </div>
                    {builderVerified && (
                      <button
                        type="button"
                        onClick={() => setShowBuilderDetails(false)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-black transition-colors cursor-pointer shrink-0"
                      >
                        Hide details
                      </button>
                    )}
                  </div>

                  {/* Read-only Canvas Selection Status */}
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-between gap-1 ${
                        builderBottom
                          ? 'bg-blue-50/70 border-blue-200 text-[#235478]'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="truncate">
                        Intermediate: {builderBottom ? '✓ Selected' : 'Select on diagram'}
                      </span>
                    </div>
                    <div
                      className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-between gap-1 ${
                        builderLeftDir && builderRightDir
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="truncate">
                        Arrows:{' '}
                        {builderLeftDir || builderRightDir
                          ? `${builderLeftDir === 'up' ? '▲' : builderLeftDir === 'down' ? '▼' : '?'} / ${
                              builderRightDir === 'up' ? '▲' : builderRightDir === 'down' ? '▼' : '?'
                            }`
                          : 'Tap diagram'}
                      </span>
                    </div>
                  </div>

                  {/* Stoichiometric Multipliers */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-black text-slate-700">
                      Assign the stoichiometric multiplier for each species:
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { heading: 'Reactant Leg', prefix: 'r', list: problem.reactants, allSet: allReactMultsSet, liveSum: liveReactSum },
                        { heading: 'Product Leg', prefix: 'p', list: problem.products, allSet: allProdMultsSet, liveSum: liveProdSum },
                      ].map((group) => (
                        <div key={group.prefix} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
                            <span>{group.heading}</span>
                            {group.allSet && (
                              <span className="font-mono text-[#326fa0]">
                                Selected sum = {group.liveSum} kJ mol⁻¹
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            {group.list.map((sp, idx) => {
                              const key = `${group.prefix}-${idx}`;
                              return (
                                <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 pt-1.5 border-t border-slate-100 first:border-t-0 first:pt-0">
                                  <span className="font-mono font-black text-xs text-slate-800">{sp.label}</span>
                                  <div className="w-full sm:w-auto grid grid-cols-3 sm:flex flex-wrap gap-1">
                                    {MULTIPLIER_OPTIONS.map((opt) => (
                                      <button
                                        key={opt.val}
                                        type="button"
                                        disabled={builderVerified}
                                        onClick={() => handleSetMultiplier(key, opt.val)}
                                        className={`min-h-[34px] sm:min-h-0 px-2 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer disabled:cursor-default ${
                                          builderMults[key] === opt.val
                                            ? 'bg-blue-50 border-[#326fa0] text-[#235478]'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyBuilder}
                    disabled={builderVerified}
                    className="w-full py-2.5 bg-[#326fa0] hover:bg-[#255580] disabled:bg-emerald-600 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                  >
                    {builderVerified ? 'Step 1 Cycle Verified ✓' : 'Verify Constructed Hess Cycle'}
                  </button>

                  {builderFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold space-y-1.5 ${
                        builderFeedback.isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {builderFeedback.messages.map((msg, i) => (
                        <div key={i} className="leading-relaxed">
                          {!builderFeedback.isCorrect ? '⚠️ ' : null}
                          {msg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Builder Step 2 Card */}
              <form
                onSubmit={handleCheckAnswer}
                className={`bg-white border border-slate-200 rounded-2xl p-4 space-y-4 transition-opacity ${
                  isStep2Locked ? 'opacity-50 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                    Step 2: Apply Indirect Route &amp; Calculate <DeltaH sub="r" />
                  </span>
                  <h4 className="text-sm font-black text-slate-800 mt-0.5">
                    Deduce Route Equation &amp; Final Enthalpy Change
                  </h4>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[11px] font-bold text-slate-600">
                    Going indirectly from Reactants → Intermediate → Products (+ with arrow, − against arrow):
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: 'prod_minus_react',
                        label: (
                          <>
                            <DeltaH sub="r" /> = +Σ(Products leg) − Σ(Reactants leg)
                          </>
                        ),
                      },
                      {
                        id: 'react_minus_prod',
                        label: (
                          <>
                            <DeltaH sub="r" /> = +Σ(Reactants leg) − Σ(Products leg)
                          </>
                        ),
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isStep2Locked || feedback?.isCorrect}
                        onClick={() => {
                          setBuilderRouteEq(opt.id);
                          setFeedback(null);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold text-left transition-all cursor-pointer ${
                          builderRouteEq === opt.id
                            ? 'bg-blue-50 border-[#326fa0] text-[#235478] ring-1 ring-[#326fa0]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-slate-700">
                    <DeltaH sub="r" /> =
                  </span>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setFeedback(null);
                    }}
                    placeholder="e.g. -88"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:border-[#326fa0]"
                  />
                  <span className="font-mono font-bold text-xs text-slate-500">kJ mol⁻¹</span>
                </div>

                <div className="button-group">
                  <button type="submit" className="btn btn-primary" disabled={isStep2Locked}>
                    Check Answer
                  </button>
                  <button
                    type="button"
                    onClick={() => generateProblem(mode)}
                    className="btn btn-secondary"
                  >
                    Next Cycle &rarr;
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Calculation Modes: Step 1 Route & Sign Gate */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-slate-400">
                      Step 1: Cycle Direction &amp; Stoichiometry Gate
                    </span>
                    <h4 className="text-xs font-black text-slate-800 mt-0.5">
                      Confirm Hess Formula &amp; Route Totals
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGateEnabled(!gateEnabled)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 shrink-0 cursor-pointer"
                  >
                    {gateEnabled ? 'Skip Gate' : 'Enable Gate'}
                  </button>
                </div>

                {gateEnabled && (
                  <div className="space-y-3">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-500">
                        Select valid Hess equation for this cycle:
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          {
                            id: 'prod_minus_react',
                            label: (
                              <>
                                <DeltaH sub="r" /> = Σ<DeltaH sub={subChar} />(products) − Σ<DeltaH sub={subChar} />(reactants)
                              </>
                            ),
                          },
                          {
                            id: 'react_minus_prod',
                            label: (
                              <>
                                <DeltaH sub="r" /> = Σ<DeltaH sub={subChar} />(reactants) − Σ<DeltaH sub={subChar} />(products)
                              </>
                            ),
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={gateVerified}
                            onClick={() => setGateFormula(opt.id)}
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold text-left transition-all cursor-pointer disabled:cursor-default ${
                              gateFormula === opt.id
                                ? 'bg-blue-50 border-[#326fa0] text-[#235478] ring-1 ring-[#326fa0]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          {problem.subMode === 'unknown_species' && problem.unknownMeta.side === 'reactant'
                            ? `Known Reactant Sum (excl. ${problem.unknownMeta.label}):`
                            : 'Σ(Reactant Route) in kJ mol⁻¹:'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          onWheel={(e) => e.currentTarget.blur()}
                          disabled={gateVerified}
                          value={gateLeftSum}
                          onChange={(e) => setGateLeftSum(e.target.value)}
                          placeholder="e.g. -190"
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                        />
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          {problem.subMode === 'unknown_species' && problem.unknownMeta.side === 'product'
                            ? `Known Product Sum (excl. ${problem.unknownMeta.label}):`
                            : 'Σ(Product Route) in kJ mol⁻¹:'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          inputMode="decimal"
                          onWheel={(e) => e.currentTarget.blur()}
                          disabled={gateVerified}
                          value={gateRightSum}
                          onChange={(e) => setGateRightSum(e.target.value)}
                          placeholder="e.g. -278"
                          className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-[#326fa0]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyGate}
                      disabled={gateVerified}
                      className="w-full py-2 bg-[#326fa0] hover:bg-[#255580] disabled:bg-emerald-600 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                    >
                      {gateVerified ? 'Step 1 Verified ✓' : 'Verify Hess Route & Sums'}
                    </button>

                    {gateFeedback && (
                      <div className={`p-2.5 rounded-xl text-xs font-bold space-y-1 ${
                        gateFeedback.isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {gateFeedback.messages.map((msg, i) => (
                          <div key={i}>
                            {!gateFeedback.isCorrect ? '⚠️ ' : null}
                            {msg}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Calculation Modes: Step 2 Final Value */}
              <form
                onSubmit={handleCheckAnswer}
                className={`bg-white border border-slate-200 rounded-2xl p-4 space-y-4 transition-opacity ${
                  isStep2Locked ? 'opacity-50 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                    Step 2: Final Enthalpy Value
                  </span>
                  <h4 className="text-sm font-black text-slate-800 mt-0.5">
                    {problem.subMode === 'unknown_species' ? (
                      <>Solve for 1 mole of {problem.unknownMeta.label}</>
                    ) : (
                      <>Solve for <DeltaH sub="r" /></>
                    )}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-slate-700">
                    {problem.subMode === 'unknown_species' ? (
                      <><DeltaH sub={subChar} /> =</>
                    ) : (
                      <><DeltaH sub="r" /> =</>
                    )}
                  </span>
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      setFeedback(null);
                    }}
                    placeholder="e.g. -88"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:outline-none focus:border-[#326fa0]"
                  />
                  <span className="font-mono font-bold text-xs text-slate-500">kJ mol⁻¹</span>
                </div>

                <div className="button-group">
                  <button type="submit" className="btn btn-primary" disabled={isStep2Locked}>
                    Check Answer
                  </button>
                  <button
                    type="button"
                    onClick={() => generateProblem(mode)}
                    className="btn btn-secondary"
                  >
                    Next Cycle &rarr;
                  </button>
                </div>
              </form>
            </>
          )}

          {feedback && (
            <div className={`feedback-box !mt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 !text-left ${
              feedback.isCorrect ? 'feedback-success' : 'feedback-error'
            }`}>
              <span>{feedback.isCorrect ? '✅ ' : '❌ '}{feedback.msg}</span>
              {feedback.isCorrect && (
                <button
                  type="button"
                  onClick={() => generateProblem(mode)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Next Cycle &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
