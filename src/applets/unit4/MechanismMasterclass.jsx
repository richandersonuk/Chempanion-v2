import React from 'react';
import MechanismTrainer from '../../components/shared/MechanismTrainer';

const HEXAGON_BONDS = [
  { x1: 137, y1: 95, x2: 116, y2: 59 },
  { x1: 116, y1: 59, x2: 74, y2: 59 },
  { x1: 74, y1: 59, x2: 53, y2: 95 },
  { x1: 53, y1: 95, x2: 74, y2: 131 },
  { x1: 74, y1: 131, x2: 116, y2: 131 },
  { x1: 116, y1: 131, x2: 137, y2: 95 },
];

/**
 * Shared Wheland (arenium) intermediate rearomatisation step for benzene EAS.
 * Draws the open horseshoe facing the tetrahedral C1 carbon (holding H and incomingGroup).
 */
const buildWhelandStep = ({ id, incomingGroupLabel, productName, catalystNote }) => ({
  id,
  label: 'Step 2 Wheland',
  type: 'arrows',
  prompt: `Step 2: Restore aromaticity on the Wheland intermediate by drawing the curly arrow from the C—H bond back into the benzene ring.`,
  hint: 'Start on the C—H covalent bond midpoint and point back INTO the open delocalised horseshoe ring (never outward onto H).',
  viewBox: '0 0 340 200',
  staticBonds: [
    ...HEXAGON_BONDS,
    { x1: 137, y1: 95, x2: 182, y2: 62 },
    { x1: 137, y1: 95, x2: 182, y2: 128 },
  ],
  staticDecorators: () => (
    <g className="select-none pointer-events-none font-sans">
      {/* Open horseshoe arc spanning 5 sp² carbons; gap opens right toward C1 */}
      <path d="M 109 75 A 24 24 0 1 0 109 115" fill="none" stroke="#334155" strokeWidth="2.6" strokeLinecap="round" />
      <text x="92" y="95" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-blue-600">+</text>
      <text x="206" y="132" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-800">{incomingGroupLabel}</text>
      <text x="275" y="95" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold fill-slate-400">Wheland Intermediate</text>
    </g>
  ),
  elements: [
    { id: 'ring_interior', kind: 'ring', cx: 106, cy: 95, r: 22, label: 'Benzene π-ring' },
    { id: 'bond_CH', kind: 'bond', cx: 159.5, cy: 78.5, r: 17, label: 'C—H bond' },
    { id: 'node_H_wheland', kind: 'atom', cx: 192, cy: 55, r: 18, display: 'H', style: 'fill-slate-800 font-sans text-sm font-black', label: 'leaving H' },
  ],
  requiredArrows: [{ from: 'bond_CH', to: 'ring_interior', defaultFlip: 1 }],
  trapChecks: [
    {
      match: (a) => a.fromId === 'node_H_wheland',
      message: 'WJEC Trap: The curly arrow must start on the C—H bond midpoint, not on the H atom.',
    },
    {
      match: (a) => a.fromId === 'bond_CH' && a.toId === 'node_H_wheland',
      message: 'WJEC Examiner Trap: Electrons move BACK INTO the ring to restore the delocalised π-system, NOT outward onto H!',
    },
  ],
  successFeedback: `Aromaticity restored! ${productName} is formed and ${catalystNote}`,
});

/**
 * Build the 3 canvas steps shared by carbonyl + HCN nucleophilic addition mechanisms.
 */
const buildCarbonylHcnSteps = ({ prefix, substituentLeft, isAldehyde }) => [
  {
    id: `${prefix}_dipoles`,
    label: 'Dipoles',
    type: 'dipoles',
    prompt: `Assign the permanent δ⁺ and δ⁻ dipole across the polar carbonyl (C=O) bond of ${isAldehyde ? 'ethanal' : 'propanone'}.`,
    hint: 'Oxygen (3.5) is much more electronegative than carbon (2.5), pulling π-electrons toward O.',
    viewBox: '0 0 340 200',
    staticBonds: [
      { x1: 190, y1: 86, x2: 190, y2: 40, order: 2 },
      { x1: 190, y1: 86, x2: 142, y2: 114 },
      { x1: 190, y1: 86, x2: 238, y2: 114 },
      { x1: 58, y1: 154, x2: 102, y2: 154, order: 3 },
    ],
    staticDecorators: () => (
      <g className="select-none pointer-events-none font-sans">
        <text x="128" y="120" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">{substituentLeft}</text>
        <text x="252" y="120" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">{isAldehyde ? 'H' : 'CH₃'}</text>
        <text x="45" y="154" textAnchor="middle" dominantBaseline="central" className="text-base font-black fill-blue-700">N</text>
        <text x="115" y="154" textAnchor="middle" dominantBaseline="central" className="text-base font-black fill-slate-800">C</text>
        <text x="131" y="150" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
      </g>
    ),
    elements: [
      { id: 'node_O', kind: 'atom', cx: 190, cy: 26, r: 20, display: 'O', style: 'fill-rose-600 font-sans text-base font-black', dipoleCandidate: true, label: 'Carbonyl O', badgeOffset: { dx: 18, dy: -8 } },
      { id: 'node_C_carb', kind: 'atom', cx: 190, cy: 86, r: 22, dipoleCandidate: true, label: 'Carbonyl C', badgeOffset: { dx: -18, dy: -12 } },
    ],
    correctDipoles: { node_C_carb: 'plus', node_O: 'minus' },
    successFeedback: 'Dipoles verified! The carbonyl carbon carries δ⁺ and is ready for nucleophilic attack.',
  },
  {
    id: `${prefix}_step1`,
    label: 'Step 1 Attack',
    type: 'arrows',
    prompt: 'Step 1: Draw 2 curly arrows: (1) :CN⁻ carbon lone pair attacking Cδ⁺, and (2) C=O π-bond breaking onto Oδ⁻.',
    hint: 'Start arrow 1 on the CARBON lone pair (••) of :CN⁻ (not N!), and start arrow 2 on the C=O double bond midpoint toward O.',
    viewBox: '0 0 340 200',
    fixedDipoles: { node_C_carb: 'plus', node_O: 'minus' },
    staticBonds: [
      { x1: 190, y1: 86, x2: 190, y2: 40, order: 2 },
      { x1: 190, y1: 86, x2: 142, y2: 114 },
      { x1: 190, y1: 86, x2: 238, y2: 114 },
      { x1: 58, y1: 154, x2: 102, y2: 154, order: 3 },
    ],
    staticDecorators: () => (
      <g className="select-none pointer-events-none font-sans">
        <text x="128" y="120" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">{substituentLeft}</text>
        <text x="252" y="120" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">{isAldehyde ? 'H' : 'CH₃'}</text>
        <text x="131" y="150" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
      </g>
    ),
    elements: [
      { id: 'node_O', kind: 'atom', cx: 190, cy: 26, r: 19, display: 'O', style: 'fill-rose-600 font-sans text-base font-black', label: 'O (δ⁻)', badgeOffset: { dx: 18, dy: -8 } },
      { id: 'bond_CO', kind: 'bond', cx: 190, cy: 58, r: 17, label: 'C=O π-bond' },
      { id: 'node_C_carb', kind: 'atom', cx: 190, cy: 86, r: 20, label: 'Carbonyl C (δ⁺)', badgeOffset: { dx: -18, dy: -12 } },
      { id: 'node_CN_N', kind: 'atom', cx: 45, cy: 154, r: 18, display: 'N', style: 'fill-blue-700 font-sans text-base font-black', label: 'N of CN⁻' },
      { id: 'node_CN_lone', kind: 'lone_pair', cx: 115, cy: 133, r: 17, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':CN⁻ carbon lone pair' },
      { id: 'node_CN_C', kind: 'atom', cx: 115, cy: 154, r: 18, display: 'C', style: 'fill-slate-800 font-sans text-base font-black', aliasTo: 'node_CN_lone', label: 'C of CN⁻' },
    ],
    requiredArrows: [
      { from: 'node_CN_lone', to: 'node_C_carb', defaultFlip: 1 },
      { from: 'bond_CO', to: 'node_O', defaultFlip: 1 },
    ],
    trapChecks: [
      {
        match: (a) => a.fromId === 'node_CN_N',
        message: 'WJEC Examiner Trap: Nucleophilic attack MUST start on the CARBON lone pair of :C⁻≡N to form the C—C bond, NEVER on Nitrogen!',
      },
      {
        match: (a) => a.fromId === 'node_C_carb' && a.toId === 'node_O',
        message: 'Start the C=O π-bond breaking arrow on the C=O bond midpoint, not on the carbon atom.',
      },
    ],
    successFeedback: 'Step 1 complete! This produces the negatively charged tetrahedral alkoxide intermediate.',
  },
  {
    id: `${prefix}_step2`,
    label: 'Step 2 Protonation',
    type: 'arrows',
    prompt: 'Step 2: Draw the curly arrow from the alkoxide oxygen lone pair (:O⁻) onto H⁺ to form the hydroxynitrile.',
    hint: 'Connect the amber lone pair (••) on the negatively charged oxygen atom directly to H⁺.',
    viewBox: '0 0 340 200',
    staticBonds: [
      { x1: 145, y1: 100, x2: 195, y2: 65 },
      { x1: 145, y1: 100, x2: 95, y2: 72 },
      { x1: 145, y1: 100, x2: 95, y2: 128 },
      { x1: 145, y1: 100, x2: 145, y2: 152 },
    ],
    staticDecorators: () => (
      <g className="select-none pointer-events-none font-sans">
        <text x="79" y="68" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">{substituentLeft}</text>
        <text x="79" y="132" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">{isAldehyde ? 'H' : 'CH₃'}</text>
        <text x="145" y="166" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-800">CN</text>
        <text x="206" y="42" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-rose-700">⁻</text>
        <circle cx="293" cy="60" r="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.6" />
        <text x="293" y="60" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-black fill-blue-600">+</text>
      </g>
    ),
    elements: [
      { id: 'node_O_alk', kind: 'atom', cx: 204, cy: 58, r: 19, display: 'O', style: 'fill-rose-600 font-sans text-base font-black', aliasTo: 'node_O_lone', label: 'Alkoxide O⁻' },
      { id: 'node_O_lone', kind: 'lone_pair', cx: 224, cy: 66, r: 17, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':O⁻ lone pair' },
      { id: 'node_H_acid', kind: 'atom', cx: 278, cy: 76, r: 20, display: 'H', style: 'fill-slate-800 font-sans text-base font-black', label: 'H⁺' },
    ],
    requiredArrows: [{ from: 'node_O_lone', to: 'node_H_acid', defaultFlip: 1 }],
    successFeedback: 'Protonation complete! The hydroxynitrile product is formed.',
  },
];

const A2_MECHANISMS = [
  {
    completionId: 'u4_mech_0',
    shortLabel: '1. Ethanal + HCN',
    title: '1. Nucleophilic Addition: Ethanal + HCN (Unit 4.4)',
    subtitle: 'CH₃CHO + HCN → CH₃CH(OH)CN (2-hydroxypropanenitrile, racemic mixture)',
    reagents: 'KCN + dilute H₂SO₄ (HCN generated in situ)',
    markScheme: [
      'M1: Permanent dipole Cδ⁺=Oδ⁻ assigned correctly.',
      'M2: Curly arrow from CARBON lone pair on :C⁻≡N → Cδ⁺ and C=O π-bond → Oδ⁻.',
      'M3: Curly arrow from alkoxide :O⁻ lone pair → H⁺ (or H—CN) to form 2-hydroxypropanenitrile.',
      'M4: Planar C=O group attacked equally from above and below, giving an optically inactive 50:50 racemic mixture.',
    ],
    summary:
      'Aldehydes undergo nucleophilic addition with :CN⁻ at the planar carbonyl carbon followed by protonation. Because ethanal is unsymmetrical, attack occurs equally from both faces to produce a racemic mixture of enantiomers.',
    steps: [
      ...buildCarbonylHcnSteps({ prefix: 'u4_0', substituentLeft: 'CH₃', isAldehyde: true }),
      {
        id: 'u4_0_stereo',
        label: 'Racemic Check',
        type: 'choice',
        prompt: 'Exam Checkpoint: Why does ethanal + HCN produce an optically INACTIVE racemic mixture?',
        hint: 'Consider the 3D geometry around the carbonyl carbon (sp², trigonal planar) before :CN⁻ attacks.',
        options: [
          {
            id: 'planar',
            label: 'Planar C=O is attacked equally from above and below → 50:50 mixture of enantiomers',
            detail: 'Equal probability of attack on both faces cancels out optical rotation.',
            isCorrect: true,
            feedback: 'Correct! Equal nucleophilic attack from either face of the trigonal planar C=O forms an equimolar (racemic) mixture whose opposing rotations cancel.',
          },
          {
            id: 'achiral',
            label: 'The product 2-hydroxypropanenitrile has no chiral carbon centre',
            detail: 'It has two identical groups attached to C2.',
            isCorrect: false,
            feedback: 'Look closely at C2: it is bonded to four DIFFERENT groups (—H, —OH, —CN, and —CH₃), so it IS a chiral centre.',
          },
          {
            id: 'steric',
            label: 'Cyanide only attacks from the less sterically hindered side',
            detail: 'Only one enantiomer is produced.',
            isCorrect: false,
            feedback: 'A trigonal planar carbonyl carbon is equally exposed above and below the plane, giving equal amounts of both enantiomers.',
          },
        ],
      },
    ],
  },
  {
    completionId: 'u4_mech_1',
    shortLabel: '2. Benzene Nitration',
    title: '2. Electrophilic Substitution: Nitration of Benzene (Unit 4.2)',
    subtitle: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O (conc. H₂SO₄ catalyst, 50–55 °C)',
    reagents: 'conc. HNO₃ + conc. H₂SO₄ (50–55 °C)',
    markScheme: [
      'M1: Electrophile generation: HNO₃ + 2H₂SO₄ → NO₂⁺ + 2HSO₄⁻ + H₃O⁺.',
      'M2: Curly arrow from benzene delocalised π-ring to the N⁺ atom of NO₂⁺.',
      'M3: Wheland intermediate drawn with open horseshoe facing C1(H)(NO₂) and + charge inside.',
      'M4: Curly arrow from C—H bond back INTO the ring to restore aromaticity and regenerate H⁺ (catalyst).',
    ],
    summary:
      'Concentrated sulfuric acid protonates nitric acid to form the nitronium electrophile (NO₂⁺). Benzene preserves its aromatic stability by undergoing substitution rather than addition: a proton is lost from the Wheland intermediate to restore the delocalised π-system.',
    steps: [
      {
        id: 'u4_1_gen',
        label: 'Electrophile Gen',
        type: 'choice',
        prompt: 'Select the balanced equation showing how conc. H₂SO₄ generates the nitronium electrophile (NO₂⁺).',
        hint: 'Sulfuric acid acts as a stronger acid than HNO₃, protonating it twice to release water as H₃O⁺.',
        options: [
          {
            id: 'nitronium_eq',
            label: 'HNO₃ + 2H₂SO₄ → NO₂⁺ + 2HSO₄⁻ + H₃O⁺',
            detail: 'Generates linear O=N⁺=O (+1 charge on Nitrogen) as the active electrophile.',
            isCorrect: true,
            feedback: 'Correct! Two equivalents of H₂SO₄ protonate HNO₃ to form the powerful nitronium electrophile NO₂⁺ (with the positive charge on N).',
          },
          {
            id: 'wrong_anion',
            label: 'HNO₃ + H₂SO₄ → NO₂⁻ + HSO₄⁺ + H₂O',
            detail: 'Forms a negatively charged nitrite-type ion.',
            isCorrect: false,
            feedback: 'Check charge: benzene has a high-electron-density π-ring, so it must react with a positively charged electrophile (NO₂⁺), not NO₂⁻.',
          },
          {
            id: 'wrong_stoich',
            label: 'HNO₃ + H₂SO₄ → NO₂⁺ + SO₄²⁻ + H₂O',
            detail: '1:1 stoichiometry producing sulfate ions.',
            isCorrect: false,
            feedback: 'Check both atom and charge balance! Protonating the released H₂O gives H₃O⁺ and requires 2 mol H₂SO₄ → 2HSO₄⁻.',
          },
        ],
      },
      {
        id: 'u4_1_step1',
        label: 'Step 1 Attack',
        type: 'arrows',
        prompt: 'Step 1: Draw the curly arrow from benzene’s delocalised π-ring to the positively charged Nitrogen of NO₂⁺.',
        hint: 'Start inside/on the benzene π-circle and point directly to N⁺ (not to an Oxygen atom!).',
        viewBox: '0 0 340 200',
        staticBonds: [
          ...HEXAGON_BONDS,
          { x1: 235, y1: 81, x2: 235, y2: 46, order: 2 },
          { x1: 235, y1: 109, x2: 235, y2: 144, order: 2 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <circle cx="95" cy="95" r="24" fill="none" stroke="#334155" strokeWidth="2.4" />
            <circle cx="250" cy="79" r="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.6" />
            <text x="250" y="79" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-black fill-blue-600">+</text>
          </g>
        ),
        elements: [
          { id: 'bond_ring', kind: 'ring', cx: 110, cy: 95, r: 26, label: 'Benzene π-ring' },
          { id: 'node_O1_nitro', kind: 'atom', cx: 235, cy: 36, r: 17, display: 'O', style: 'fill-rose-600 font-sans text-sm font-black', label: 'O of NO₂⁺' },
          { id: 'node_N_nitro', kind: 'atom', cx: 235, cy: 95, r: 21, display: 'N', style: 'fill-blue-600 font-sans text-base font-black', label: 'N⁺ of NO₂⁺' },
          { id: 'node_O2_nitro', kind: 'atom', cx: 235, cy: 154, r: 17, display: 'O', style: 'fill-rose-600 font-sans text-sm font-black', label: 'O of NO₂⁺' },
        ],
        requiredArrows: [{ from: 'bond_ring', to: 'node_N_nitro', defaultFlip: -1 }],
        trapChecks: [
          {
            match: (a) => a.toId === 'node_O1_nitro' || a.toId === 'node_O2_nitro',
            message: 'WJEC Trap: The nitronium ion bonds to benzene through NITROGEN (N⁺), not Oxygen!',
          },
        ],
        successFeedback: 'Step 1 complete! Aromaticity is temporarily broken to form the Wheland (arenium) intermediate.',
      },
      buildWhelandStep({
        id: 'u4_1_step2',
        incomingGroupLabel: 'NO₂',
        productName: 'Nitrobenzene',
        catalystNote: 'H⁺ combines with HSO₄⁻ to regenerate the H₂SO₄ catalyst.',
      }),
    ],
  },
  {
    completionId: 'u4_mech_2',
    shortLabel: '3. Tertiary Sₙ1',
    title: '3. Nucleophilic Substitution (Sₙ1): 2-bromo-2-methylpropane (Unit 4.3)',
    subtitle: '(CH₃)₃CBr + OH⁻ → (CH₃)₃COH + Br⁻ (2-step carbocation pathway)',
    reagents: 'NaOH(aq) / aqueous ethanol, warm',
    markScheme: [
      'M1: Permanent dipole Cδ⁺—Brδ⁻ identified.',
      'M2: Step 1 (slow RDS): SINGLE curly arrow from C—Br bond midpoint onto Brδ⁻ (OH⁻ is NOT involved in Step 1).',
      'M3: Planar tertiary carbocation intermediate (CH₃)₃C⁺ formed (stabilised by three +I methyl groups).',
      'M4: Step 2 (fast): curly arrow from :OH⁻ lone pair onto C⁺.',
    ],
    summary:
      'Three bulky methyl groups sterically block backside Sₙ2 attack and strongly stabilise a tertiary carbocation via +I electron donation. Therefore, C—Br breaks first in a slow unimolecular step (rate = k[RBr]) before :OH⁻ attacks.',
    steps: [
      {
        id: 'u4_2_dipoles',
        label: 'Dipoles',
        type: 'dipoles',
        prompt: 'Assign the permanent partial dipoles on the polar C—Br bond of the tertiary haloalkane.',
        hint: 'Bromine pulls bonding electrons away from the tertiary carbon.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 128, y1: 82, x2: 205, y2: 82 },
          { x1: 128, y1: 82, x2: 128, y2: 34 },
          { x1: 128, y1: 82, x2: 86, y2: 56 },
          { x1: 128, y1: 82, x2: 86, y2: 108 },
          { x1: 134, y1: 156, x2: 96, y2: 156 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="128" y="22" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">CH₃</text>
            <text x="70" y="50" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">H₃C</text>
            <text x="70" y="114" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">H₃C</text>
            <text x="144" y="156" textAnchor="middle" dominantBaseline="central" className="text-base font-black fill-rose-600">O</text>
            <text x="86" y="156" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="160" y="152" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C_tert', kind: 'atom', cx: 128, cy: 82, r: 22, dipoleCandidate: true, label: 'Tertiary C', badgeOffset: { dx: -14, dy: -16 } },
          { id: 'node_Br', kind: 'atom', cx: 218, cy: 82, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Br', badgeOffset: { dx: 16, dy: -15 } },
        ],
        correctDipoles: { node_C_tert: 'plus', node_Br: 'minus' },
        successFeedback: 'Dipoles verified! Now map Step 1 (the slow rate-determining step).',
      },
      {
        id: 'u4_2_step1',
        label: 'Step 1 (RDS)',
        type: 'arrows',
        prompt: 'Step 1 (Slow RDS): Draw ONLY the single curly arrow needed for heterolytic fission of the C—Br bond.',
        hint: 'Remember: in Sₙ1, :OH⁻ waits on the sidelines during Step 1! Only the C—Br bond breaks.',
        viewBox: '0 0 340 200',
        fixedDipoles: { node_C_tert: 'plus', node_Br: 'minus' },
        staticBonds: [
          { x1: 128, y1: 82, x2: 205, y2: 82 },
          { x1: 128, y1: 82, x2: 128, y2: 34 },
          { x1: 128, y1: 82, x2: 86, y2: 56 },
          { x1: 128, y1: 82, x2: 86, y2: 108 },
          { x1: 134, y1: 156, x2: 96, y2: 156 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="128" y="22" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">CH₃</text>
            <text x="70" y="50" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">H₃C</text>
            <text x="70" y="114" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">H₃C</text>
            <text x="86" y="156" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="160" y="152" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C_tert', kind: 'atom', cx: 128, cy: 82, r: 20, label: 'Tertiary C (δ⁺)', badgeOffset: { dx: -14, dy: -16 } },
          { id: 'bond_CBr', kind: 'bond', cx: 168, cy: 82, r: 17, label: 'C—Br bond' },
          { id: 'node_Br', kind: 'atom', cx: 218, cy: 82, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁻)', badgeOffset: { dx: 16, dy: -15 } },
          { id: 'node_OH_lone', kind: 'lone_pair', cx: 144, cy: 136, r: 17, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':OH⁻ lone pair' },
          { id: 'node_OH_O', kind: 'atom', cx: 144, cy: 156, r: 18, display: 'O', style: 'fill-rose-600 font-sans text-base font-black', aliasTo: 'node_OH_lone', label: 'O of OH⁻' },
        ],
        requiredArrows: [{ from: 'bond_CBr', to: 'node_Br', defaultFlip: -1 }],
        trapChecks: [
          {
            match: (a) => a.fromId === 'node_OH_lone' || a.fromId === 'node_OH_O',
            message: 'Sₙ1 Examiner Trap! Tertiary haloalkanes are too sterically hindered for :OH⁻ attack in Step 1. Only C—Br bond fission occurs in the slow RDS (rate = k[RBr]).',
          },
          {
            match: (a) => a.fromId === 'node_C_tert' && a.toId === 'node_Br',
            message: 'WJEC Trap: Bond fission arrows must start on the C—Br bond midpoint, not on the carbon atom.',
          },
        ],
        successFeedback: 'Step 1 (RDS) verified! The tertiary carbocation (CH₃)₃C⁺ forms slowly.',
      },
      {
        id: 'u4_2_step2',
        label: 'Step 2 (Fast)',
        type: 'arrows',
        prompt: 'Step 2 (Fast): Draw the curly arrow from the hydroxide lone pair (:OH⁻) onto the planar tertiary carbocation.',
        hint: 'Connect the :OH⁻ lone pair (••) directly to the central C⁺ atom.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 155, y1: 78, x2: 155, y2: 32 },
          { x1: 155, y1: 78, x2: 105, y2: 102 },
          { x1: 155, y1: 78, x2: 205, y2: 102 },
          { x1: 192, y1: 158, x2: 230, y2: 158 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="155" y="21" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">CH₃</text>
            <text x="89" y="108" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">H₃C</text>
            <text x="221" y="108" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">CH₃</text>
            <circle cx="140" cy="60" r="8.5" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.8" />
            <text x="140" y="60" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-black fill-blue-600">+</text>
            <text x="240" y="158" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="166" y="147" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C_tert', kind: 'atom', cx: 155, cy: 78, r: 22, label: 'Tertiary C⁺' },
          { id: 'node_OH_lone', kind: 'lone_pair', cx: 175, cy: 140, r: 17, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':OH⁻ lone pair' },
          { id: 'node_OH_O', kind: 'atom', cx: 181, cy: 158, r: 19, display: 'O', style: 'fill-rose-600 font-sans text-base font-black', aliasTo: 'node_OH_lone', label: 'O of OH⁻' },
        ],
        requiredArrows: [{ from: 'node_OH_lone', to: 'node_C_tert', defaultFlip: 1 }],
        successFeedback: 'Perfect! Fast capture by :OH⁻ gives 2-methylpropan-2-ol.',
      },
    ],
  },
  {
    completionId: 'u4_mech_3',
    shortLabel: '4. Propanone + HCN',
    title: '4. Nucleophilic Addition: Propanone + HCN (Unit 4.4)',
    subtitle: '(CH₃)₂C=O + HCN → (CH₃)₂C(OH)CN (achiral hydroxynitrile)',
    reagents: 'KCN + dilute H₂SO₄ (HCN generated in situ)',
    markScheme: [
      'M1: Permanent dipole Cδ⁺=Oδ⁻ identified.',
      'M2: Curly arrow from CARBON lone pair on :C⁻≡N → Cδ⁺ and C=O π-bond → Oδ⁻.',
      'M3: Alkoxide :O⁻ lone pair → H⁺ protonation arrow.',
      'M4: Product is achiral (no optical isomers) because C2 bears two identical —CH₃ groups.',
    ],
    summary:
      'Propanone follows the exact same two-step nucleophilic addition mechanism as ethanal, but its two identical methyl groups prevent the formation of a chiral carbon centre.',
    steps: [
      ...buildCarbonylHcnSteps({ prefix: 'u4_3', substituentLeft: 'CH₃', isAldehyde: false }),
      {
        id: 'u4_3_achiral',
        label: 'Chirality Check',
        type: 'choice',
        prompt: 'Exam Comparison: Unlike ethanal + HCN, why does propanone + HCN NOT show optical isomerism?',
        hint: 'Count the four groups attached to C2 in 2-hydroxy-2-methylpropanenitrile: —OH, —CN, —CH₃, and —CH₃.',
        options: [
          {
            id: 'two_methyls',
            label: 'The product has two identical —CH₃ groups on C2, so there is no chiral centre',
            detail: 'A carbon needs four different attached groups to be chiral.',
            isCorrect: true,
            feedback: 'Correct! Even though the C=O bond is planar and attacked from both sides, both attacks form the exact same achiral molecule.',
          },
          {
            id: 'one_side',
            label: 'The two methyl groups block attack from one side of the ketone',
            detail: 'Only a single enantiomer is produced.',
            isCorrect: false,
            feedback: 'Both faces of propanone’s planar C=O are identical; the reason there are no optical isomers is that the product lacks a chiral carbon.',
          },
          {
            id: 'no_reaction',
            label: 'Ketones only react by substitution, not addition',
            detail: 'No tetrahedral carbon is formed.',
            isCorrect: false,
            feedback: 'Both aldehydes and ketones undergo nucleophilic addition with HCN to form tetrahedral hydroxynitriles.',
          },
        ],
      },
    ],
  },
  {
    completionId: 'u4_mech_4',
    shortLabel: '5. Benzene Bromination',
    title: '5. Electrophilic Substitution: Bromination of Benzene (Unit 4.2)',
    subtitle: 'C₆H₆ + Br₂ → C₆H₅Br + HBr (FeBr₃ halogen carrier catalyst)',
    reagents: 'Br₂ + anhydrous FeBr₃ (or Fe filings), room temp',
    markScheme: [
      'M1: Halogen carrier reaction: Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻.',
      'M2: Curly arrow from benzene delocalised π-ring → Br⁺.',
      'M3: Wheland intermediate with open horseshoe facing C1(H)(Br).',
      'M4: Curly arrow from C—H bond back INTO the ring to form bromobenzene + HBr + FeBr₃.',
    ],
    summary:
      'Benzene’s stable delocalised π-cloud cannot polarise Br₂ enough on its own. An FeBr₃ halogen carrier generates the powerful Br⁺ electrophile, allowing electrophilic aromatic substitution to occur.',
    steps: [
      {
        id: 'u4_4_gen',
        label: 'Halogen Carrier',
        type: 'choice',
        prompt: 'Why is FeBr₃ required, and how does it generate the active electrophile from Br₂?',
        hint: 'FeBr₃ acts as a Lewis acid (electron-pair acceptor), pulling a bromide ion off Br₂.',
        options: [
          {
            id: 'br_plus',
            label: 'Br₂ + FeBr₃ → Br⁺ + FeBr₄⁻ (generates the Br⁺ electrophile)',
            detail: 'FeBr₃ accepts Br⁻ to polarise/cleave Br₂ heterolytically.',
            isCorrect: true,
            feedback: 'Correct! FeBr₃ acts as a halogen carrier, generating Br⁺ (or a strongly polarised Brδ⁺—Brδ⁻—FeBr₃ complex) and FeBr₄⁻.',
          },
          {
            id: 'radicals',
            label: 'Br₂ + FeBr₃ → 2Br• + FeBr₃ (generates bromine radicals)',
            detail: 'Initiates free-radical substitution on the ring.',
            isCorrect: false,
            feedback: 'Examiner trap! Benzene undergoes ionic ELECTROPHILIC substitution via Br⁺, not free-radical substitution.',
          },
          {
            id: 'br_minus',
            label: 'Br₂ + FeBr₃ → Br⁻ + FeBr₂⁺',
            detail: 'Forms bromide ions to attack benzene nucleophilically.',
            isCorrect: false,
            feedback: 'Benzene’s electron-rich π-ring repels nucleophiles like Br⁻; it requires an electron-deficient electrophile (Br⁺).',
          },
        ],
      },
      {
        id: 'u4_4_step1',
        label: 'Step 1 Attack',
        type: 'arrows',
        prompt: 'Step 1: Draw the curly arrow from benzene’s delocalised π-ring to the bromonium electrophile (Br⁺).',
        hint: 'Start on the inner π-ring circle and point directly to Br⁺.',
        viewBox: '0 0 340 200',
        staticBonds: [...HEXAGON_BONDS],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <circle cx="95" cy="95" r="24" fill="none" stroke="#334155" strokeWidth="2.4" />
            <circle cx="242" cy="79" r="8.5" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.6" />
            <text x="242" y="79" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-black fill-blue-600">+</text>
          </g>
        ),
        elements: [
          { id: 'bond_ring', kind: 'ring', cx: 110, cy: 95, r: 26, label: 'Benzene π-ring' },
          { id: 'node_Br_elec', kind: 'atom', cx: 226, cy: 95, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-lg font-black', label: 'Br⁺ electrophile' },
        ],
        requiredArrows: [{ from: 'bond_ring', to: 'node_Br_elec', defaultFlip: -1 }],
        successFeedback: 'Step 1 complete! Now restore aromaticity on the Wheland intermediate.',
      },
      buildWhelandStep({
        id: 'u4_4_step2',
        incomingGroupLabel: 'Br',
        productName: 'Bromobenzene',
        catalystNote: 'H⁺ reacts with FeBr₄⁻ to form HBr(g) and regenerate the FeBr₃ catalyst.',
      }),
    ],
  },
  {
    completionId: 'u4_mech_5',
    shortLabel: '6. Friedel–Crafts Acylation',
    title: '6. Friedel–Crafts Acylation: Benzene + Ethanoyl Chloride (Unit 4.2)',
    subtitle: 'C₆H₆ + CH₃COCl → C₆H₅COCH₃ + HCl (anhydrous AlCl₃ catalyst)',
    reagents: 'CH₃COCl + anhydrous AlCl₃, reflux',
    markScheme: [
      'M1: Acylium electrophile generation: CH₃COCl + AlCl₃ → CH₃C⁺=O + AlCl₄⁻.',
      'M2: Curly arrow from benzene delocalised π-ring → positively charged C⁺ of CH₃C⁺=O.',
      'M3: Wheland intermediate with open horseshoe facing C1(H)(COCH₃).',
      'M4: Curly arrow from C—H bond back INTO the ring to form phenylethanone + HCl + AlCl₃.',
    ],
    summary:
      'Anhydrous AlCl₃ abstracts Cl⁻ from ethanoyl chloride to create the acylium ion (CH₃C⁺=O). Electrophilic substitution introduces the acyl group onto the benzene ring, yielding phenylethanone (acetophenone).',
    steps: [
      {
        id: 'u4_5_gen',
        label: 'Acylium Gen',
        type: 'choice',
        prompt: 'Select the equation showing how anhydrous AlCl₃ generates the active electrophile from ethanoyl chloride.',
        hint: 'AlCl₃ acts as a halogen carrier (Lewis acid), pulling Cl⁻ away from CH₃COCl.',
        options: [
          {
            id: 'acylium',
            label: 'CH₃COCl + AlCl₃ → CH₃C⁺=O + AlCl₄⁻',
            detail: 'Forms the electrophilic acylium cation with positive charge on carbon.',
            isCorrect: true,
            feedback: 'Correct! Abstracting Cl⁻ yields the acylium ion CH₃C⁺=O, which undergoes electrophilic attack by benzene.',
          },
          {
            id: 'methyl_plus',
            label: 'CH₃COCl + AlCl₃ → CH₃⁺ + COCl⁻ + AlCl₃',
            detail: 'Cleaves the C—C bond instead of the C—Cl bond.',
            isCorrect: false,
            feedback: 'The C—Cl bond breaks heterolytically to form AlCl₄⁻, keeping the C=O carbonyl attached as CH₃C⁺=O.',
          },
          {
            id: 'acyl_anion',
            label: 'CH₃COCl + AlCl₃ → CH₃CO⁻ + AlCl₂⁺ + Cl₂',
            detail: 'Forms a negatively charged acyl group.',
            isCorrect: false,
            feedback: 'AlCl₃ accepts a chloride ion (forming AlCl₄⁻), leaving behind the positively charged acylium electrophile CH₃C⁺=O.',
          },
        ],
      },
      {
        id: 'u4_5_step1',
        label: 'Step 1 Attack',
        type: 'arrows',
        prompt: 'Step 1: Draw the curly arrow from benzene’s π-ring to the positively charged carbonyl CARBON (C⁺) of the acylium ion.',
        hint: 'Point the arrow from the benzene π-ring straight onto C⁺ (not onto Oxygen or CH₃).',
        viewBox: '0 0 340 200',
        staticBonds: [
          ...HEXAGON_BONDS,
          { x1: 222, y1: 81, x2: 222, y2: 44, order: 2 },
          { x1: 234, y1: 95, x2: 274, y2: 95 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <circle cx="95" cy="95" r="24" fill="none" stroke="#334155" strokeWidth="2.4" />
            <circle cx="236" cy="78" r="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.6" />
            <text x="236" y="78" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-black fill-blue-600">+</text>
            <text x="292" y="95" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">CH₃</text>
          </g>
        ),
        elements: [
          { id: 'bond_ring', kind: 'ring', cx: 110, cy: 95, r: 26, label: 'Benzene π-ring' },
          { id: 'node_O_acyl', kind: 'atom', cx: 222, cy: 34, r: 17, display: 'O', style: 'fill-rose-600 font-sans text-sm font-black', label: 'O of acylium' },
          { id: 'node_C_acyl', kind: 'atom', cx: 222, cy: 95, r: 21, display: 'C', style: 'fill-slate-800 font-sans text-base font-black', label: 'C⁺ of CH₃C⁺=O' },
        ],
        requiredArrows: [{ from: 'bond_ring', to: 'node_C_acyl', defaultFlip: -1 }],
        trapChecks: [
          {
            match: (a) => a.toId === 'node_O_acyl',
            message: 'WJEC Trap: The ring forms a new C—C bond directly to the electrophilic CARBON (C⁺) of CH₃C⁺=O, not to Oxygen!',
          },
        ],
        successFeedback: 'Step 1 complete! Now complete the Wheland intermediate rearomatisation step.',
      },
      buildWhelandStep({
        id: 'u4_5_step2',
        incomingGroupLabel: 'COCH₃',
        productName: 'Phenylethanone',
        catalystNote: 'H⁺ reacts with AlCl₄⁻ to evolve HCl(g) and regenerate anhydrous AlCl₃.',
      }),
    ],
  },
];

const MechanismMasterclass = ({ onComplete }) => {
  return (
    <MechanismTrainer
      headerTitle="Synoptic A2 Mechanism Masterclass"
      selectorPrefix="A2 Path"
      problems={A2_MECHANISMS}
      onComplete={onComplete}
    />
  );
};

export default MechanismMasterclass;
export { MechanismMasterclass };
