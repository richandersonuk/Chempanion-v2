import React from 'react';
import MechanismTrainer from '../../components/shared/MechanismTrainer';

const AS_MECHANISMS = [
  {
    completionId: 'u2_mech_0',
    shortLabel: '1. Ethene + HBr',
    title: '1. Electrophilic Addition: Ethene + HBr (Unit 2.5)',
    subtitle: 'CH₂=CH₂ + HBr → CH₃CH₂Br (2-step carbocation mechanism)',
    reagents: 'HBr(g), room temp',
    markScheme: [
      'M1: Permanent dipole shown cleanly on Hδ⁺—Brδ⁻.',
      'M2: Curly arrow from C=C double bond to Hδ⁺, and curly arrow from H—Br bond onto Brδ⁻.',
      'M3: Planar/ethyl carbocation intermediate (CH₃C⁺H₂) + :Br⁻ drawn with correct charges.',
      'M4: Curly arrow from lone pair on :Br⁻ strictly to the positively charged C⁺.',
    ],
    summary:
      'Ethene acts as a nucleophile via its high-electron-density π-bond, attacking Hδ⁺ of HBr while the H—Br bond cleaves heterolytically. The resulting bromide ion (:Br⁻) then donates a lone pair to the carbocation intermediate to yield bromoethane.',
    steps: [
      {
        id: 'u2_0_dipoles',
        label: 'Dipoles',
        type: 'dipoles',
        prompt: 'Assign the permanent partial charges (δ⁺ and δ⁻) to the polar bond in this reaction.',
        hint: 'Bromine (electronegativity 3.0) pulls electrons away from hydrogen (2.2). The symmetrical C=C bond has zero dipole.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 95, y1: 65, x2: 175, y2: 65, order: 2 },
          { x1: 95, y1: 65, x2: 65, y2: 38 },
          { x1: 95, y1: 65, x2: 65, y2: 92 },
          { x1: 175, y1: 65, x2: 205, y2: 38 },
          { x1: 175, y1: 65, x2: 205, y2: 92 },
          { x1: 147, y1: 152, x2: 217, y2: 152 },
        ],
        staticDecorators: () => (
          <g className="text-[11px] font-sans font-bold fill-slate-600 select-none pointer-events-none">
            <text x="57" y="32" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="57" y="98" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="32" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="98" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="260" y="65" textAnchor="start" dominantBaseline="central" className="text-[10px] fill-slate-400 font-semibold">Ethene</text>
          </g>
        ),
        elements: [
          { id: 'node_C1', kind: 'atom', cx: 95, cy: 65, r: 20, dipoleCandidate: true, label: 'C1', badgeOffset: { dx: -14, dy: -16 } },
          { id: 'node_C2', kind: 'atom', cx: 175, cy: 65, r: 20, dipoleCandidate: true, label: 'C2', badgeOffset: { dx: 14, dy: -16 } },
          { id: 'node_H', kind: 'atom', cx: 135, cy: 152, r: 20, display: 'H', style: 'fill-slate-800 font-sans text-base font-black', dipoleCandidate: true, label: 'H', badgeOffset: { dx: -15, dy: -15 } },
          { id: 'node_Br', kind: 'atom', cx: 229, cy: 152, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Br', badgeOffset: { dx: 16, dy: -15 } },
        ],
        correctDipoles: { node_H: 'plus', node_Br: 'minus' },
        customDiagnostic: (states) => {
          if (states.node_C1 || states.node_C2) {
            return 'Ethene is symmetrical — the C=C bond between identical carbons is non-polar. Assign δ⁺/δ⁻ only to H—Br.';
          }
          return null;
        },
        successFeedback: 'Dipoles verified! H is δ⁺ (electrophilic centre) and Br is δ⁻.',
      },
      {
        id: 'u2_0_step1',
        label: 'Step 1 Arrows',
        type: 'arrows',
        prompt: 'Draw 2 curly arrows for Step 1: (1) attack from the C=C π-bond onto Hδ⁺, and (2) heterolytic fission of the H—Br bond.',
        hint: 'Arrow 1 starts at the C=C double bond midpoint and points to H. Arrow 2 starts on the H—Br bond midpoint and points to Br.',
        viewBox: '0 0 340 200',
        fixedDipoles: { node_H: 'plus', node_Br: 'minus' },
        staticBonds: [
          { x1: 95, y1: 65, x2: 175, y2: 65, order: 2 },
          { x1: 95, y1: 65, x2: 65, y2: 38 },
          { x1: 95, y1: 65, x2: 65, y2: 92 },
          { x1: 175, y1: 65, x2: 205, y2: 38 },
          { x1: 175, y1: 65, x2: 205, y2: 92 },
          { x1: 147, y1: 152, x2: 217, y2: 152 },
        ],
        staticDecorators: () => (
          <g className="text-[11px] font-sans font-bold fill-slate-600 select-none pointer-events-none">
            <text x="57" y="32" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="57" y="98" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="32" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="98" textAnchor="middle" dominantBaseline="central">H</text>
          </g>
        ),
        elements: [
          { id: 'bond_alkene', kind: 'bond', cx: 135, cy: 65, r: 22, label: 'C=C π-bond' },
          { id: 'node_C1', kind: 'atom', cx: 95, cy: 65, r: 16, label: 'C1' },
          { id: 'node_C2', kind: 'atom', cx: 175, cy: 65, r: 16, label: 'C2' },
          { id: 'node_H', kind: 'atom', cx: 135, cy: 152, r: 19, display: 'H', style: 'fill-slate-800 font-sans text-base font-black', label: 'H (δ⁺)', badgeOffset: { dx: -15, dy: -15 } },
          { id: 'bond_HBr', kind: 'bond', cx: 182, cy: 152, r: 17, label: 'H—Br bond' },
          { id: 'node_Br', kind: 'atom', cx: 229, cy: 152, r: 19, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁻)', badgeOffset: { dx: 16, dy: -15 } },
        ],
        requiredArrows: [
          { from: 'bond_alkene', to: 'node_H', defaultFlip: 1 },
          { from: 'bond_HBr', to: 'node_Br', defaultFlip: -1 },
        ],
        trapChecks: [
          {
            match: (a) => a.fromId === 'node_H' && a.toId === 'node_Br',
            message: 'WJEC Trap: Bond-breaking arrows must start on the H—Br covalent bond midpoint, not on the H atom.',
          },
          {
            match: (a) => (a.fromId === 'node_C1' || a.fromId === 'node_C2') && a.toId === 'node_H',
            message: 'Start the curly arrow on the C=C π-bond midpoint (electron pair), not on an individual carbon atom.',
          },
        ],
        successFeedback: 'Step 1 complete! Electrophilic attack forms the ethyl carbocation intermediate and a bromide ion (:Br⁻).',
      },
      {
        id: 'u2_0_step2',
        label: 'Step 2 Intermediate',
        type: 'arrows',
        prompt: 'Step 2: Draw the curly arrow from the bromide lone pair (:Br⁻) to the positively charged carbon of the carbocation.',
        hint: 'Start the arrow on the amber lone pair (••) of :Br⁻ and point directly to the C⁺ carbon centre.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 95, y1: 75, x2: 165, y2: 75 },
          { x1: 165, y1: 75, x2: 165, y2: 33 },
          { x1: 165, y1: 75, x2: 215, y2: 75 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none">
            <text x="80" y="75" textAnchor="middle" dominantBaseline="central" className="text-sm font-sans font-black fill-slate-700">H₃C</text>
            <text x="165" y="22" textAnchor="middle" dominantBaseline="central" className="text-xs font-sans font-bold fill-slate-600">H</text>
            <text x="225" y="75" textAnchor="middle" dominantBaseline="central" className="text-xs font-sans font-bold fill-slate-600">H</text>
            <circle cx="151" cy="57" r="8.5" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.8" />
            <text x="151" y="57" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-sans font-black fill-blue-600">+</text>
            <text x="228" y="145" textAnchor="middle" dominantBaseline="central" className="text-xs font-sans font-black fill-slate-700">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C2', kind: 'atom', cx: 165, cy: 75, r: 22, label: 'C⁺ carbocation' },
          { id: 'node_Br_lone', kind: 'lone_pair', cx: 196, cy: 142, r: 18, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':Br⁻ lone pair' },
          { id: 'node_Br_ion', kind: 'atom', cx: 214, cy: 156, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', aliasTo: 'node_Br_lone', label: 'Br⁻' },
        ],
        requiredArrows: [{ from: 'node_Br_lone', to: 'node_C2', defaultFlip: 1 }],
        successFeedback: 'Spot on! Nucleophilic coordination of :Br⁻ to the carbocation yields bromoethane (CH₃CH₂Br).',
      },
    ],
  },
  {
    completionId: 'u2_mech_1',
    shortLabel: '2. Propene + HBr',
    title: '2. Electrophilic Addition: Propene + HBr (Markovnikov, Unit 2.5)',
    subtitle: 'CH₃CH=CH₂ + HBr → CH₃CHBrCH₃ (major) vs CH₃CH₂CH₂Br (minor)',
    reagents: 'HBr(g), room temp',
    markScheme: [
      'M1: Permanent dipole Hδ⁺—Brδ⁻ identified.',
      'M2: Curly arrows from C=C π-bond → Hδ⁺ and H—Br bond → Brδ⁻.',
      'M3: Major pathway proceeds via the more stable 2° carbocation (CH₃C⁺HCH₃) due to +I inductive effect of two alkyl groups.',
      'M4: Curly arrow from :Br⁻ lone pair → C⁺ on the secondary carbocation to form 2-bromopropane.',
    ],
    summary:
      'When an unsymmetrical alkene reacts with HBr, hydrogen bonds to the carbon carrying more hydrogens so that the positive charge rests on the more substituted carbon, forming the more stable secondary carbocation.',
    steps: [
      {
        id: 'u2_1_dipoles',
        label: 'Dipoles',
        type: 'dipoles',
        prompt: 'Assign the permanent partial dipoles (δ⁺ and δ⁻) on the attacking H—Br reagent.',
        hint: 'Focus on the polar H—Br bond. The alkene C=C bond has no permanent dipole.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 68, y1: 88, x2: 105, y2: 62 },
          { x1: 105, y1: 62, x2: 185, y2: 62, order: 2 },
          { x1: 105, y1: 62, x2: 105, y2: 26 },
          { x1: 185, y1: 62, x2: 215, y2: 36 },
          { x1: 185, y1: 62, x2: 215, y2: 88 },
          { x1: 157, y1: 152, x2: 227, y2: 152 },
        ],
        staticDecorators: () => (
          <g className="font-sans font-bold fill-slate-600 select-none pointer-events-none">
            <text x="50" y="94" textAnchor="middle" dominantBaseline="central" className="text-xs fill-slate-700 font-black">H₃C</text>
            <text x="105" y="16" textAnchor="middle" dominantBaseline="central" className="text-[11px]">H</text>
            <text x="223" y="30" textAnchor="middle" dominantBaseline="central" className="text-[11px]">H</text>
            <text x="223" y="94" textAnchor="middle" dominantBaseline="central" className="text-[11px]">H</text>
          </g>
        ),
        elements: [
          { id: 'node_C2', kind: 'atom', cx: 105, cy: 62, r: 18, dipoleCandidate: true, label: 'C2', badgeOffset: { dx: -14, dy: -15 } },
          { id: 'node_C1', kind: 'atom', cx: 185, cy: 62, r: 18, dipoleCandidate: true, label: 'C1', badgeOffset: { dx: 14, dy: -15 } },
          { id: 'node_H', kind: 'atom', cx: 145, cy: 152, r: 20, display: 'H', style: 'fill-slate-800 font-sans text-base font-black', dipoleCandidate: true, label: 'H', badgeOffset: { dx: -15, dy: -15 } },
          { id: 'node_Br', kind: 'atom', cx: 239, cy: 152, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Br', badgeOffset: { dx: 16, dy: -15 } },
        ],
        correctDipoles: { node_H: 'plus', node_Br: 'minus' },
        successFeedback: 'Correct! Hδ⁺—Brδ⁻ is polarised toward Br.',
      },
      {
        id: 'u2_1_step1',
        label: 'Step 1 Arrows',
        type: 'arrows',
        prompt: 'Draw the 2 curly arrows for Step 1: C=C π-bond attacking Hδ⁺, and H—Br bond breaking onto Brδ⁻.',
        hint: 'Start arrow 1 from the C=C π-bond midpoint to Hδ⁺, and arrow 2 from the H—Br bond midpoint to Brδ⁻.',
        viewBox: '0 0 340 200',
        fixedDipoles: { node_H: 'plus', node_Br: 'minus' },
        staticBonds: [
          { x1: 68, y1: 88, x2: 105, y2: 62 },
          { x1: 105, y1: 62, x2: 185, y2: 62, order: 2 },
          { x1: 105, y1: 62, x2: 105, y2: 26 },
          { x1: 185, y1: 62, x2: 215, y2: 36 },
          { x1: 185, y1: 62, x2: 215, y2: 88 },
          { x1: 157, y1: 152, x2: 227, y2: 152 },
        ],
        staticDecorators: () => (
          <g className="font-sans font-bold fill-slate-600 select-none pointer-events-none">
            <text x="50" y="94" textAnchor="middle" dominantBaseline="central" className="text-xs fill-slate-700 font-black">H₃C</text>
            <text x="105" y="16" textAnchor="middle" dominantBaseline="central" className="text-[11px]">H</text>
            <text x="223" y="30" textAnchor="middle" dominantBaseline="central" className="text-[11px]">H</text>
            <text x="223" y="94" textAnchor="middle" dominantBaseline="central" className="text-[11px]">H</text>
          </g>
        ),
        elements: [
          { id: 'bond_alkene', kind: 'bond', cx: 145, cy: 62, r: 22, label: 'C=C π-bond' },
          { id: 'node_H', kind: 'atom', cx: 145, cy: 152, r: 19, display: 'H', style: 'fill-slate-800 font-sans text-base font-black', label: 'H (δ⁺)', badgeOffset: { dx: -15, dy: -15 } },
          { id: 'bond_HBr', kind: 'bond', cx: 192, cy: 152, r: 17, label: 'H—Br bond' },
          { id: 'node_Br', kind: 'atom', cx: 239, cy: 152, r: 19, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁻)', badgeOffset: { dx: 16, dy: -15 } },
        ],
        requiredArrows: [
          { from: 'bond_alkene', to: 'node_H', defaultFlip: 1 },
          { from: 'bond_HBr', to: 'node_Br', defaultFlip: -1 },
        ],
        trapChecks: [
          {
            match: (a) => a.fromId === 'node_H' && a.toId === 'node_Br',
            message: 'WJEC Trap: Bond cleavage arrows start at the H—Br bond midpoint, not on H.',
          },
        ],
        successFeedback: 'Great! Now determine which carbocation intermediate governs the major product.',
      },
      {
        id: 'u2_1_markovnikov',
        label: 'Carbocation Stability',
        type: 'choice',
        prompt: 'Which carbocation intermediate leads to the MAJOR product, and why?',
        hint: 'Alkyl groups release electron density (+I inductive effect), dispersing the positive charge on the carbocation.',
        viewBox: '0 0 340 165',
        staticBonds: [],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <rect x="14" y="20" width="148" height="125" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="88" y="42" textAnchor="middle" className="text-[11px] font-black fill-[#235478]">Pathway A (2°)</text>
            <text x="88" y="84" textAnchor="middle" className="text-sm font-black fill-slate-800">CH₃—CH—CH₃</text>
            <text x="88" y="64" textAnchor="middle" className="text-xs font-black fill-blue-600">+</text>
            <text x="88" y="120" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">Two +I alkyl groups</text>

            <rect x="178" y="20" width="148" height="125" rx="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="252" y="42" textAnchor="middle" className="text-[11px] font-black fill-slate-700">Pathway B (1°)</text>
            <text x="252" y="84" textAnchor="middle" className="text-sm font-black fill-slate-800">CH₃—CH₂—CH₂</text>
            <text x="289" y="64" textAnchor="middle" className="text-xs font-black fill-blue-600">+</text>
            <text x="252" y="120" textAnchor="middle" className="text-[10px] font-bold fill-slate-500">One +I alkyl group</text>
          </g>
        ),
        elements: [],
        options: [
          {
            id: 'opt_2deg',
            label: 'Pathway A: Secondary (2°) carbocation — CH₃C⁺HCH₃',
            detail: 'Stabilised by the electron-donating (+I) inductive effect of two alkyl groups.',
            isCorrect: true,
            feedback: 'Correct! Two alkyl groups push electron density toward C⁺ (+I effect), lowering its energy so 2-bromopropane is the major product.',
          },
          {
            id: 'opt_1deg',
            label: 'Pathway B: Primary (1°) carbocation — CH₃CH₂C⁺H₂',
            detail: 'Less sterically hindered at the terminal CH₂ carbon.',
            isCorrect: false,
            feedback: 'Not quite: primary carbocations only receive inductive electron donation from one alkyl group, making them less stable and only a minor pathway.',
          },
          {
            id: 'opt_equal',
            label: '50:50 mixture of both carbocations',
            detail: 'Electrophilic addition shows no preference between C1 and C2.',
            isCorrect: false,
            feedback: 'Incorrect: carbocation stability (3° > 2° > 1°) causes Pathway A to dominate strongly.',
          },
        ],
      },
      {
        id: 'u2_1_step2',
        label: 'Step 2 Intermediate',
        type: 'arrows',
        prompt: 'Complete the major pathway: draw the curly arrow from :Br⁻ to C2⁺ on the secondary carbocation.',
        hint: 'Connect the lone pair (••) on :Br⁻ to the central C⁺ atom between the two methyl groups.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 88, y1: 82, x2: 155, y2: 82 },
          { x1: 155, y1: 82, x2: 222, y2: 82 },
          { x1: 155, y1: 82, x2: 155, y2: 36 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none">
            <text x="72" y="82" textAnchor="middle" dominantBaseline="central" className="text-sm font-sans font-black fill-slate-700">H₃C</text>
            <text x="238" y="82" textAnchor="middle" dominantBaseline="central" className="text-sm font-sans font-black fill-slate-700">CH₃</text>
            <text x="155" y="24" textAnchor="middle" dominantBaseline="central" className="text-xs font-sans font-bold fill-slate-600">H</text>
            <circle cx="141" cy="64" r="8.5" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.8" />
            <text x="141" y="64" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-sans font-black fill-blue-600">+</text>
            <text x="218" y="148" textAnchor="middle" dominantBaseline="central" className="text-xs font-sans font-black fill-slate-700">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C2', kind: 'atom', cx: 155, cy: 82, r: 22, label: 'C2⁺ carbocation' },
          { id: 'node_Br_lone', kind: 'lone_pair', cx: 185, cy: 145, r: 18, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':Br⁻ lone pair' },
          { id: 'node_Br_ion', kind: 'atom', cx: 204, cy: 159, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', aliasTo: 'node_Br_lone', label: 'Br⁻' },
        ],
        requiredArrows: [{ from: 'node_Br_lone', to: 'node_C2', defaultFlip: 1 }],
        successFeedback: 'Llongyfarchiadau! 2-bromopropane forms as the major product via the secondary carbocation.',
      },
    ],
  },
  {
    completionId: 'u2_mech_2',
    shortLabel: '3. Bromoethane + OH⁻',
    title: '3. Nucleophilic Substitution (Sₙ2): Bromoethane + OH⁻ (Unit 2.6)',
    subtitle: 'CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻ (single concerted step)',
    reagents: 'NaOH(aq), warm under reflux',
    markScheme: [
      'M1: Permanent dipole assigned across the polar Cδ⁺—Brδ⁻ bond.',
      'M2: Curly arrow from the oxygen lone pair on :OH⁻ to Cδ⁺.',
      'M3: Simultaneous curly arrow from the C—Br bond midpoint onto Brδ⁻.',
      'M4: Hydrolysis rate increases down Group 7 (C—I fastest) because C—X bond enthalpy weakens.',
    ],
    summary:
      'Primary haloalkanes react via a concerted one-step Sₙ2 mechanism with minimal steric hindrance: the hydroxide nucleophile donates a lone pair to Cδ⁺ at the same instant the C—Br bond breaks heterolytically.',
    steps: [
      {
        id: 'u2_2_dipoles',
        label: 'Dipoles',
        type: 'dipoles',
        prompt: 'Identify the permanent δ⁺ and δ⁻ dipole across the carbon–halogen bond.',
        hint: 'Bromine is much more electronegative than carbon, pulling electron density along the C—Br bond.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 82, y1: 78, x2: 150, y2: 78 },
          { x1: 150, y1: 78, x2: 228, y2: 78 },
          { x1: 150, y1: 78, x2: 128, y2: 40 },
          { x1: 150, y1: 78, x2: 172, y2: 40 },
          { x1: 102, y1: 154, x2: 65, y2: 154 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="64" y="78" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-700">H₃C</text>
            <text x="122" y="30" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="178" y="30" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="112" y="154" textAnchor="middle" dominantBaseline="central" className="text-base font-black fill-rose-600">O</text>
            <text x="55" y="154" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="128" y="151" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C_alpha', kind: 'atom', cx: 150, cy: 78, r: 22, dipoleCandidate: true, label: 'α-Carbon', badgeOffset: { dx: 0, dy: 20 } },
          { id: 'node_Br', kind: 'atom', cx: 240, cy: 78, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Br', badgeOffset: { dx: 16, dy: -15 } },
        ],
        correctDipoles: { node_C_alpha: 'plus', node_Br: 'minus' },
        successFeedback: 'Dipoles verified! Cδ⁺ is now clearly marked as the electrophilic target.',
      },
      {
        id: 'u2_2_arrows',
        label: 'Sₙ2 Arrows',
        type: 'arrows',
        prompt: 'Draw 2 simultaneous curly arrows: (1) :OH⁻ lone pair attacking Cδ⁺, and (2) heterolytic C—Br bond cleavage.',
        hint: 'Arrow 1 starts on the oxygen lone pair (••) and ends at Cδ⁺. Arrow 2 starts on the C—Br bond midpoint and ends on Br.',
        viewBox: '0 0 340 200',
        fixedDipoles: { node_C_alpha: 'plus', node_Br: 'minus' },
        staticBonds: [
          { x1: 82, y1: 78, x2: 150, y2: 78 },
          { x1: 150, y1: 78, x2: 228, y2: 78 },
          { x1: 150, y1: 78, x2: 128, y2: 40 },
          { x1: 150, y1: 78, x2: 172, y2: 40 },
          { x1: 102, y1: 154, x2: 65, y2: 154 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="64" y="78" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-700">H₃C</text>
            <text x="122" y="30" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="178" y="30" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="55" y="154" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="128" y="151" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C_alpha', kind: 'atom', cx: 150, cy: 78, r: 20, label: 'α-Carbon (δ⁺)', badgeOffset: { dx: 0, dy: 20 } },
          { id: 'bond_CBr', kind: 'bond', cx: 194, cy: 78, r: 17, label: 'C—Br bond' },
          { id: 'node_Br', kind: 'atom', cx: 240, cy: 78, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁻)', badgeOffset: { dx: 16, dy: -15 } },
          { id: 'node_OH_lone', kind: 'lone_pair', cx: 115, cy: 134, r: 17, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':OH⁻ lone pair' },
          { id: 'node_OH_O', kind: 'atom', cx: 112, cy: 154, r: 18, display: 'O', style: 'fill-rose-600 font-sans text-base font-black', aliasTo: 'node_OH_lone', label: 'O of OH⁻' },
        ],
        requiredArrows: [
          { from: 'node_OH_lone', to: 'node_C_alpha', defaultFlip: 1 },
          { from: 'bond_CBr', to: 'node_Br', defaultFlip: -1 },
        ],
        trapChecks: [
          {
            match: (a) => a.fromId === 'node_C_alpha' && a.toId === 'node_Br',
            message: 'WJEC Trap: Bond-breaking arrows start on the C—Br bond midpoint, not on the carbon atom.',
          },
        ],
        successFeedback: 'Both concerted Sₙ2 curly arrows are spot on! Ethanol and Br⁻ are produced.',
      },
      {
        id: 'u2_2_rate',
        label: 'Bond Enthalpy Check',
        type: 'choice',
        prompt: 'Exam Checkpoint: Comparing 1-chlorobutane, 1-bromobutane, and 1-iodobutane with OH⁻(aq), which hydrolyses fastest and why?',
        hint: 'Consider whether bond polarity or C—X bond enthalpy controls the activation energy of breaking the carbon–halogen bond.',
        options: [
          {
            id: 'iodo',
            label: '1-iodobutane — lowest C—I bond enthalpy',
            detail: 'Weakest C—X bond breaks most easily (lowest Eₐ), outweighing smaller bond polarity.',
            isCorrect: true,
            feedback: 'Correct! Because C—I has the weakest bond enthalpy, less energy is needed to break it in the substitution step—so 1-iodobutane reacts fastest.',
          },
          {
            id: 'chloro',
            label: '1-chlorobutane — highest C—Cl bond polarity',
            detail: 'Largest δ⁺ on carbon attracts OH⁻ most strongly.',
            isCorrect: false,
            feedback: 'Examiner trap! While C—Cl is indeed the most polar bond, its very high bond enthalpy means C—Cl breaks slowest.',
          },
          {
            id: 'same',
            label: 'All three react at the exact same rate',
            detail: 'Because the nucleophile OH⁻ is identical in each experiment.',
            isCorrect: false,
            feedback: 'Incorrect: C—X bond cleavage is part of the rate-determining Sₙ2 step, so bond strength directly governs rate.',
          },
        ],
      },
    ],
  },
  {
    completionId: 'u2_mech_3',
    shortLabel: '4. Ethene + Br₂',
    title: '4. Electrophilic Addition: Ethene + Br₂ (Induced Dipole, Unit 2.5)',
    subtitle: 'CH₂=CH₂ + Br₂ → CH₂BrCH₂Br (alkene test for unsaturation)',
    reagents: 'Br₂(aq) or Br₂ in inert solvent (orange-brown → colourless)',
    markScheme: [
      'M1: Induced dipole shown on Br₂ (Brδ⁺ closer to C=C, Brδ⁻ further away).',
      'M2: Curly arrow from C=C π-bond → Brδ⁺ and heterolytic fission arrow from Br—Br bond → Brδ⁻.',
      'M3: Bromomethyl carbocation intermediate (BrCH₂C⁺H₂) + :Br⁻.',
      'M4: Curly arrow from :Br⁻ lone pair → C⁺ to form 1,2-dibromoethane.',
    ],
    summary:
      'Although Br₂ is normally non-polar, the electron-dense C=C π-bond repels electrons in the approaching bromine molecule, inducing a δ⁺–δ⁻ dipole that allows electrophilic addition to proceed.',
    steps: [
      {
        id: 'u2_3_dipoles',
        label: 'Induced Dipole',
        type: 'dipoles',
        prompt: 'Assign the temporary INDUCED dipole (δ⁺ and δ⁻) on Br₂ as it approaches the electron-rich C=C bond.',
        hint: 'Electrons in the Br—Br bond are repelled AWAY from the high electron density of the C=C double bond.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 95, y1: 62, x2: 175, y2: 62, order: 2 },
          { x1: 95, y1: 62, x2: 65, y2: 36 },
          { x1: 95, y1: 62, x2: 65, y2: 88 },
          { x1: 175, y1: 62, x2: 205, y2: 36 },
          { x1: 175, y1: 62, x2: 205, y2: 88 },
          { x1: 147, y1: 138, x2: 215, y2: 162 },
        ],
        staticDecorators: () => (
          <g className="text-[11px] font-sans font-bold fill-slate-600 select-none pointer-events-none">
            <text x="57" y="30" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="57" y="94" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="30" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="94" textAnchor="middle" dominantBaseline="central">H</text>
          </g>
        ),
        elements: [
          { id: 'node_C1', kind: 'atom', cx: 95, cy: 62, r: 18, dipoleCandidate: true, label: 'C1', badgeOffset: { dx: -14, dy: -15 } },
          { id: 'node_C2', kind: 'atom', cx: 175, cy: 62, r: 18, dipoleCandidate: true, label: 'C2', badgeOffset: { dx: 14, dy: -15 } },
          { id: 'node_Br1', kind: 'atom', cx: 135, cy: 134, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Closer Br', badgeOffset: { dx: -16, dy: -14 } },
          { id: 'node_Br2', kind: 'atom', cx: 227, cy: 166, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Further Br', badgeOffset: { dx: 16, dy: -14 } },
        ],
        correctDipoles: { node_Br1: 'plus', node_Br2: 'minus' },
        customDiagnostic: (states) => {
          if (states.node_Br1 === 'minus' && states.node_Br2 === 'plus') {
            return 'Flipped induced dipole! The C=C π-electrons push electrons AWAY from the closer Br—making the closer Br δ⁺ and the further Br δ⁻.';
          }
          return null;
        },
        successFeedback: 'Induced dipole verified! The closer bromine carries δ⁺ and acts as the electrophile.',
      },
      {
        id: 'u2_3_step1',
        label: 'Step 1 Arrows',
        type: 'arrows',
        prompt: 'Draw 2 curly arrows: C=C π-bond attacking the closer Brδ⁺, and Br—Br bond breaking onto the further Brδ⁻.',
        hint: 'Arrow 1 goes from C=C π-bond to the closer Br (δ⁺). Arrow 2 goes from the Br—Br bond midpoint to the further Br (δ⁻).',
        viewBox: '0 0 340 200',
        fixedDipoles: { node_Br1: 'plus', node_Br2: 'minus' },
        staticBonds: [
          { x1: 95, y1: 62, x2: 175, y2: 62, order: 2 },
          { x1: 95, y1: 62, x2: 65, y2: 36 },
          { x1: 95, y1: 62, x2: 65, y2: 88 },
          { x1: 175, y1: 62, x2: 205, y2: 36 },
          { x1: 175, y1: 62, x2: 205, y2: 88 },
          { x1: 147, y1: 138, x2: 215, y2: 162 },
        ],
        staticDecorators: () => (
          <g className="text-[11px] font-sans font-bold fill-slate-600 select-none pointer-events-none">
            <text x="57" y="30" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="57" y="94" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="30" textAnchor="middle" dominantBaseline="central">H</text>
            <text x="213" y="94" textAnchor="middle" dominantBaseline="central">H</text>
          </g>
        ),
        elements: [
          { id: 'bond_alkene', kind: 'bond', cx: 135, cy: 62, r: 22, label: 'C=C π-bond' },
          { id: 'node_Br1', kind: 'atom', cx: 135, cy: 134, r: 19, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁺)', badgeOffset: { dx: -16, dy: -14 } },
          { id: 'bond_BrBr', kind: 'bond', cx: 181, cy: 150, r: 17, label: 'Br—Br bond' },
          { id: 'node_Br2', kind: 'atom', cx: 227, cy: 166, r: 19, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁻)', badgeOffset: { dx: 16, dy: -14 } },
        ],
        requiredArrows: [
          { from: 'bond_alkene', to: 'node_Br1', defaultFlip: 1 },
          { from: 'bond_BrBr', to: 'node_Br2', defaultFlip: -1 },
        ],
        trapChecks: [
          {
            match: (a) => a.fromId === 'node_Br1' && a.toId === 'node_Br2',
            message: 'WJEC Trap: Heterolytic cleavage arrows start on the Br—Br bond midpoint, not on Br1.',
          },
        ],
        successFeedback: 'Step 1 complete! A carbocation intermediate and Br⁻ ion are formed.',
      },
      {
        id: 'u2_3_step2',
        label: 'Step 2 Intermediate',
        type: 'arrows',
        prompt: 'Draw the curly arrow from the bromide ion (:Br⁻) lone pair to C⁺ to form 1,2-dibromoethane.',
        hint: 'Point the arrow from the :Br⁻ lone pair (••) directly to the C⁺ centre.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 68, y1: 78, x2: 112, y2: 78 },
          { x1: 112, y1: 78, x2: 178, y2: 78 },
          { x1: 178, y1: 78, x2: 178, y2: 34 },
          { x1: 178, y1: 78, x2: 228, y2: 78 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="54" y="78" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-amber-700">Br</text>
            <text x="112" y="96" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">CH₂</text>
            <text x="178" y="22" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="238" y="78" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <circle cx="164" cy="60" r="8.5" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.8" />
            <text x="164" y="60" textAnchor="middle" dominantBaseline="central" className="text-[11px] font-black fill-blue-600">+</text>
            <text x="234" y="148" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C2', kind: 'atom', cx: 178, cy: 78, r: 22, label: 'C⁺ carbocation' },
          { id: 'node_Br_lone', kind: 'lone_pair', cx: 202, cy: 145, r: 18, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':Br⁻ lone pair' },
          { id: 'node_Br_ion', kind: 'atom', cx: 220, cy: 159, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', aliasTo: 'node_Br_lone', label: 'Br⁻' },
        ],
        requiredArrows: [{ from: 'node_Br_lone', to: 'node_C2', defaultFlip: 1 }],
        successFeedback: 'Spot on! 1,2-dibromoethane forms, decolourising orange-brown bromine water.',
      },
    ],
  },
  {
    completionId: 'u2_mech_4',
    shortLabel: '5. Bromoethane + NH₃',
    title: '5. Nucleophilic Substitution: Bromoethane + Excess NH₃ (Unit 2.6)',
    subtitle: 'CH₃CH₂Br + 2NH₃ → CH₃CH₂NH₂ + NH₄Br (substitution + deprotonation)',
    reagents: 'Excess conc. NH₃ in ethanol, sealed tube under pressure',
    markScheme: [
      'M1: Permanent dipole Cδ⁺—Brδ⁻ identified on bromoethane.',
      'M2: Step 1 arrows from :NH₃ lone pair → Cδ⁺ and C—Br bond → Brδ⁻.',
      'M3: Alkylammonium intermediate (CH₃CH₂N⁺H₃) formed.',
      'M4: Step 2 deprotonation arrows: second :NH₃ lone pair → H, and N—H bond → N⁺.',
    ],
    summary:
      'Ammonia attacks Cδ⁺ with its nitrogen lone pair to form an ethylammonium ion intermediate. A second ammonia molecule then acts as a base, removing H⁺ so neutral ethylamine is released.',
    steps: [
      {
        id: 'u2_4_dipoles',
        label: 'Dipoles',
        type: 'dipoles',
        prompt: 'Assign the permanent partial dipoles across the C—Br bond.',
        hint: 'Bromine is more electronegative than carbon, leaving the α-carbon δ⁺.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 82, y1: 72, x2: 150, y2: 72 },
          { x1: 150, y1: 72, x2: 228, y2: 72 },
          { x1: 150, y1: 72, x2: 128, y2: 34 },
          { x1: 150, y1: 72, x2: 172, y2: 34 },
          { x1: 92, y1: 152, x2: 62, y2: 152 },
          { x1: 118, y1: 152, x2: 148, y2: 152 },
          { x1: 105, y1: 164, x2: 105, y2: 184 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="64" y="72" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-700">H₃C</text>
            <text x="122" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="178" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="105" y="152" textAnchor="middle" dominantBaseline="central" className="text-base font-black fill-blue-600">N</text>
            <text x="53" y="152" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="157" y="152" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="105" y="191" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
          </g>
        ),
        elements: [
          { id: 'node_C_alpha', kind: 'atom', cx: 150, cy: 72, r: 22, dipoleCandidate: true, label: 'α-Carbon', badgeOffset: { dx: 0, dy: 20 } },
          { id: 'node_Br', kind: 'atom', cx: 240, cy: 72, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Br', badgeOffset: { dx: 16, dy: -15 } },
        ],
        correctDipoles: { node_C_alpha: 'plus', node_Br: 'minus' },
        successFeedback: 'Dipoles verified! Now map the initial attack by ammonia.',
      },
      {
        id: 'u2_4_step1',
        label: 'Step 1 Substitution',
        type: 'arrows',
        prompt: 'Draw 2 curly arrows: :NH₃ lone pair attacking Cδ⁺, and C—Br bond cleavage onto Brδ⁻.',
        hint: 'Start arrow 1 on the nitrogen lone pair (••) toward Cδ⁺, and arrow 2 on the C—Br bond midpoint toward Br.',
        viewBox: '0 0 340 200',
        fixedDipoles: { node_C_alpha: 'plus', node_Br: 'minus' },
        staticBonds: [
          { x1: 82, y1: 72, x2: 150, y2: 72 },
          { x1: 150, y1: 72, x2: 228, y2: 72 },
          { x1: 150, y1: 72, x2: 128, y2: 34 },
          { x1: 150, y1: 72, x2: 172, y2: 34 },
          { x1: 92, y1: 152, x2: 62, y2: 152 },
          { x1: 118, y1: 152, x2: 148, y2: 152 },
          { x1: 105, y1: 164, x2: 105, y2: 184 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="64" y="72" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-700">H₃C</text>
            <text x="122" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="178" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="53" y="152" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="157" y="152" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="105" y="191" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
          </g>
        ),
        elements: [
          { id: 'node_C_alpha', kind: 'atom', cx: 150, cy: 72, r: 20, label: 'α-Carbon (δ⁺)', badgeOffset: { dx: 0, dy: 20 } },
          { id: 'bond_CBr', kind: 'bond', cx: 194, cy: 72, r: 17, label: 'C—Br bond' },
          { id: 'node_Br', kind: 'atom', cx: 240, cy: 72, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁻)', badgeOffset: { dx: 16, dy: -15 } },
          { id: 'node_NH3_lone', kind: 'lone_pair', cx: 105, cy: 132, r: 17, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':NH₃ lone pair' },
          { id: 'node_NH3_N', kind: 'atom', cx: 105, cy: 152, r: 18, display: 'N', style: 'fill-blue-600 font-sans text-base font-black', aliasTo: 'node_NH3_lone', label: 'N of NH₃' },
        ],
        requiredArrows: [
          { from: 'node_NH3_lone', to: 'node_C_alpha', defaultFlip: 1 },
          { from: 'bond_CBr', to: 'node_Br', defaultFlip: -1 },
        ],
        successFeedback: 'Step 1 complete! Now complete Step 2 to deprotonate the ethylammonium ion.',
      },
      {
        id: 'u2_4_step2',
        label: 'Step 2 Deprotonation',
        type: 'arrows',
        prompt: 'Step 2: Draw 2 curly arrows showing a second :NH₃ molecule removing H⁺ and returning the N—H bond electrons to N⁺.',
        hint: 'Arrow 1: second :NH₃ lone pair (••) → H. Arrow 2: N—H bond midpoint → N⁺.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 80, y1: 95, x2: 126, y2: 95 },
          { x1: 140, y1: 81, x2: 140, y2: 45 },
          { x1: 140, y1: 109, x2: 140, y2: 145 },
          { x1: 154, y1: 95, x2: 206, y2: 95 },
          { x1: 292, y1: 81, x2: 292, y2: 46 },
          { x1: 292, y1: 109, x2: 292, y2: 144 },
          { x1: 304, y1: 95, x2: 325, y2: 95 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="50" y="95" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-700">CH₃CH₂</text>
            <text x="140" y="34" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="140" y="156" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <circle cx="126" cy="76" r="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.6" />
            <text x="126" y="76" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-black fill-blue-600">+</text>
            <text x="292" y="36" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="292" y="154" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="331" y="95" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
          </g>
        ),
        elements: [
          { id: 'node_N_plus', kind: 'atom', cx: 140, cy: 95, r: 19, display: 'N', style: 'fill-blue-600 font-sans text-base font-black', label: 'N⁺' },
          { id: 'bond_NH', kind: 'bond', cx: 179, cy: 95, r: 17, label: 'N—H bond' },
          { id: 'node_H_leave', kind: 'atom', cx: 215, cy: 95, r: 18, display: 'H', style: 'fill-slate-800 font-sans text-sm font-black', label: 'leaving H' },
          { id: 'node_NH3_lone2', kind: 'lone_pair', cx: 266, cy: 95, r: 18, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: '2nd :NH₃ lone pair' },
          { id: 'node_NH3_N2', kind: 'atom', cx: 292, cy: 95, r: 19, display: 'N', style: 'fill-blue-600 font-sans text-base font-black', aliasTo: 'node_NH3_lone2', label: 'N of 2nd NH₃' },
        ],
        requiredArrows: [
          { from: 'node_NH3_lone2', to: 'node_H_leave', defaultFlip: 1 },
          { from: 'bond_NH', to: 'node_N_plus', defaultFlip: 1 },
        ],
        trapChecks: [
          {
            match: (a) => a.fromId === 'node_H_leave' && a.toId === 'node_N_plus',
            message: 'WJEC Trap: The arrow must start on the N—H bond midpoint, not on the H atom.',
          },
        ],
        successFeedback: 'Excellent! Ethylamine (CH₃CH₂NH₂) and NH₄⁺Br⁻ are produced.',
      },
    ],
  },
  {
    completionId: 'u2_mech_5',
    shortLabel: '6. Bromoethane + CN⁻',
    title: '6. Nucleophilic Substitution: Bromoethane + CN⁻ (Unit 2.6)',
    subtitle: 'CH₃CH₂Br + CN⁻ → CH₃CH₂CN + Br⁻ (carbon-chain extension)',
    reagents: 'KCN in aqueous ethanol, heated under reflux',
    markScheme: [
      'M1: Permanent dipole Cδ⁺—Brδ⁻ identified.',
      'M2: Curly arrow strictly from the CARBON lone pair on :C⁻≡N to Cδ⁺ (not from N!).',
      'M3: Simultaneous curly arrow from C—Br bond midpoint onto Brδ⁻.',
      'M4: Product is propanenitrile (chain increased from 2 carbons to 3 carbons).',
    ],
    summary:
      'Cyanide (:C⁻≡N) attacks via its carbon lone pair in a concerted Sₙ2 substitution to forge a new C—C bond, extending the chain by one carbon atom to produce propanenitrile.',
    steps: [
      {
        id: 'u2_5_dipoles',
        label: 'Dipoles',
        type: 'dipoles',
        prompt: 'Assign the δ⁺ and δ⁻ partial charges across the polar C—Br bond.',
        hint: 'Focus on the C—Br bond on bromoethane.',
        viewBox: '0 0 340 200',
        staticBonds: [
          { x1: 82, y1: 72, x2: 150, y2: 72 },
          { x1: 150, y1: 72, x2: 228, y2: 72 },
          { x1: 150, y1: 72, x2: 128, y2: 34 },
          { x1: 150, y1: 72, x2: 172, y2: 34 },
          { x1: 68, y1: 154, x2: 114, y2: 154, order: 3 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="64" y="72" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-700">H₃C</text>
            <text x="122" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="178" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="54" y="154" textAnchor="middle" dominantBaseline="central" className="text-base font-black fill-blue-700">N</text>
            <text x="126" y="154" textAnchor="middle" dominantBaseline="central" className="text-base font-black fill-slate-800">C</text>
            <text x="142" y="149" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C_alpha', kind: 'atom', cx: 150, cy: 72, r: 22, dipoleCandidate: true, label: 'α-Carbon', badgeOffset: { dx: 0, dy: 20 } },
          { id: 'node_Br', kind: 'atom', cx: 240, cy: 72, r: 22, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', dipoleCandidate: true, label: 'Br', badgeOffset: { dx: 16, dy: -15 } },
        ],
        correctDipoles: { node_C_alpha: 'plus', node_Br: 'minus' },
        successFeedback: 'Dipoles verified! Now draw the concerted Sₙ2 arrows.',
      },
      {
        id: 'u2_5_arrows',
        label: 'Sₙ2 Arrows',
        type: 'arrows',
        prompt: 'Draw 2 curly arrows: (1) from the :CN⁻ CARBON lone pair to Cδ⁺, and (2) heterolytic C—Br bond fission onto Brδ⁻.',
        hint: 'Be careful to start the nucleophilic attack on the CARBON lone pair (••) of :CN⁻, NOT on the Nitrogen atom!',
        viewBox: '0 0 340 200',
        fixedDipoles: { node_C_alpha: 'plus', node_Br: 'minus' },
        staticBonds: [
          { x1: 82, y1: 72, x2: 150, y2: 72 },
          { x1: 150, y1: 72, x2: 228, y2: 72 },
          { x1: 150, y1: 72, x2: 128, y2: 34 },
          { x1: 150, y1: 72, x2: 172, y2: 34 },
          { x1: 68, y1: 154, x2: 114, y2: 154, order: 3 },
        ],
        staticDecorators: () => (
          <g className="select-none pointer-events-none font-sans">
            <text x="64" y="72" textAnchor="middle" dominantBaseline="central" className="text-sm font-black fill-slate-700">H₃C</text>
            <text x="122" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="178" y="25" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-600">H</text>
            <text x="142" y="149" textAnchor="middle" dominantBaseline="central" className="text-xs font-black fill-slate-800">⁻</text>
          </g>
        ),
        elements: [
          { id: 'node_C_alpha', kind: 'atom', cx: 150, cy: 72, r: 20, label: 'α-Carbon (δ⁺)', badgeOffset: { dx: 0, dy: 20 } },
          { id: 'bond_CBr', kind: 'bond', cx: 194, cy: 72, r: 17, label: 'C—Br bond' },
          { id: 'node_Br', kind: 'atom', cx: 240, cy: 72, r: 20, display: 'Br', style: 'fill-amber-700 font-sans text-base font-black', label: 'Br (δ⁻)', badgeOffset: { dx: 16, dy: -15 } },
          { id: 'node_CN_N', kind: 'atom', cx: 54, cy: 154, r: 18, display: 'N', style: 'fill-blue-700 font-sans text-base font-black', label: 'N of CN⁻' },
          { id: 'node_CN_lone', kind: 'lone_pair', cx: 126, cy: 133, r: 17, display: '••', style: 'fill-amber-500 font-mono text-base font-black', label: ':CN⁻ carbon lone pair' },
          { id: 'node_CN_C', kind: 'atom', cx: 126, cy: 154, r: 18, display: 'C', style: 'fill-slate-800 font-sans text-base font-black', aliasTo: 'node_CN_lone', label: 'C of CN⁻' },
        ],
        requiredArrows: [
          { from: 'node_CN_lone', to: 'node_C_alpha', defaultFlip: 1 },
          { from: 'bond_CBr', to: 'node_Br', defaultFlip: -1 },
        ],
        trapChecks: [
          {
            match: (a) => a.fromId === 'node_CN_N',
            message: 'WJEC Examiner Trap: The nucleophilic curly arrow MUST start from the CARBON lone pair on :C⁻≡N to form a C—C bond—never from the Nitrogen atom!',
          },
          {
            match: (a) => a.fromId === 'node_C_alpha' && a.toId === 'node_Br',
            message: 'WJEC Trap: Bond cleavage arrows start on the C—Br bond midpoint, not on the carbon atom.',
          },
        ],
        successFeedback: 'Superb! Cyanide attacks via its carbon lone pair to extend the carbon chain.',
      },
      {
        id: 'u2_5_product',
        label: 'Synthetic Utility',
        type: 'choice',
        prompt: 'Name the organic product formed and state its key role in organic synthesis.',
        hint: 'Remember to include the cyanide carbon atom when counting the longest carbon chain!',
        options: [
          {
            id: 'propanenitrile',
            label: 'Propanenitrile (CH₃CH₂CN) — extends the carbon chain by +1 C',
            detail: 'Forms a new C—C bond (2 carbons → 3 carbons).',
            isCorrect: true,
            feedback: 'Correct! Bromoethane (2 C) becomes propanenitrile (3 C), a crucial chain-extension step before hydrolysis to propanoic acid or reduction to propylamine.',
          },
          {
            id: 'ethanenitrile',
            label: 'Ethanenitrile (CH₃CN) — keeps the 2-carbon chain length unchanged',
            detail: 'Only replaces Br with N without adding a carbon.',
            isCorrect: false,
            feedback: 'Check the carbon count! The incoming —C≡N group adds a third carbon to the ethyl chain, giving propanenitrile.',
          },
          {
            id: 'isonitrile',
            label: 'Ethyl isonitrile (CH₃CH₂NC) — bonded through nitrogen',
            detail: 'Forms a C—N bond using the nitrogen lone pair.',
            isCorrect: false,
            feedback: 'In nucleophilic substitution with KCN, the reaction proceeds via the carbon lone pair of :CN⁻ to yield the nitrile (R—C≡N).',
          },
        ],
      },
    ],
  },
];

const MechanismUnit2 = ({ onComplete }) => {
  return (
    <MechanismTrainer
      headerTitle="AS-Level Organic Mechanism Trainer"
      selectorPrefix="AS Mechanism"
      problems={AS_MECHANISMS}
      onComplete={onComplete}
    />
  );
};

export default MechanismUnit2;
export { MechanismUnit2 };
