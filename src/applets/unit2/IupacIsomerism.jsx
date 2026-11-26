import React, { useState, useMemo } from 'react';

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const EZ_PROBLEMS = [
  {
    id: 'ez_but2ene',
    name: 'But-2-ene',
    formula: 'CH₃CH=CHCH₃',
    canHaveEZ: true,
    c1Groups: [
      { id: 'c1_ch3', label: 'CH₃', atomicNum: 6, isHighest: true },
      { id: 'c1_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_ch3', label: 'CH₃', atomicNum: 6, isHighest: true },
      { id: 'c2_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    hint: 'On both C1 and C2, carbon (Z = 6 in —CH₃) outranks hydrogen (Z = 1). Check whether the two —CH₃ groups sit on the same side (Z) or opposite sides (E) of C=C.',
  },
  {
    id: 'ez_pent2ene',
    name: 'Pent-2-ene',
    formula: 'CH₃CH=CHCH₂CH₃',
    canHaveEZ: true,
    c1Groups: [
      { id: 'c1_ch3', label: 'CH₃', atomicNum: 6, isHighest: true },
      { id: 'c1_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_et', label: 'CH₂CH₃', atomicNum: 6, isHighest: true },
      { id: 'c2_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    hint: 'Left C carries —CH₃ (Z=6) and —H (Z=1); right C carries —CH₂CH₃ (Z=6) and —H (Z=1). Compare whether the two alkyl groups lie on the same side (Z) or diagonally opposite (E).',
  },
  {
    id: 'ez_1br_1cl_propene',
    name: '1-bromo-1-chloroprop-1-ene',
    formula: 'CBrCl=CHCH₃',
    canHaveEZ: true,
    c1Groups: [
      { id: 'c1_br', label: 'Br', atomicNum: 35, isHighest: true },
      { id: 'c1_cl', label: 'Cl', atomicNum: 17, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_ch3', label: 'CH₃', atomicNum: 6, isHighest: true },
      { id: 'c2_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    hint: 'Assign Cahn–Ingold–Prelog priorities by atomic number: on C1 compare Br (Z=35) vs Cl (Z=17); on C2 compare C of CH₃ (Z=6) vs H (Z=1).',
  },
  {
    id: 'ez_1cl_2me_but1ene',
    name: '1-chloro-2-methylbut-1-ene',
    formula: 'CHCl=C(CH₃)CH₂CH₃',
    canHaveEZ: true,
    c1Groups: [
      { id: 'c1_cl', label: 'Cl', atomicNum: 17, isHighest: true },
      { id: 'c1_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_et', label: 'CH₂CH₃', atomicNum: 6, isHighest: true },
      { id: 'c2_ch3', label: 'CH₃', atomicNum: 6, isHighest: false },
    ],
    hint: 'On C2 both attached atoms are carbon (Z=6): move one bond outward to break the tie — ethyl (C bonded to C,H,H) outranks methyl (C bonded to H,H,H).',
  },
  {
    id: 'ez_2br_3cl_but2ene',
    name: '2-bromo-3-chlorobut-2-ene',
    formula: 'CH₃C(Br)=C(Cl)CH₃',
    canHaveEZ: true,
    c1Groups: [
      { id: 'c1_br', label: 'Br', atomicNum: 35, isHighest: true },
      { id: 'c1_ch3', label: 'CH₃', atomicNum: 6, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_cl', label: 'Cl', atomicNum: 17, isHighest: true },
      { id: 'c2_ch3', label: 'CH₃', atomicNum: 6, isHighest: false },
    ],
    hint: 'Compare the first atom directly attached to each alkene carbon: Br (Z=35) > C (Z=6) on the left, and Cl (Z=17) > C (Z=6) on the right.',
  },
  {
    id: 'ez_1_2_dibromoethene',
    name: '1,2-dibromoethene',
    formula: 'CHBr=CHBr',
    canHaveEZ: true,
    c1Groups: [
      { id: 'c1_br', label: 'Br', atomicNum: 35, isHighest: true },
      { id: 'c1_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_br', label: 'Br', atomicNum: 35, isHighest: true },
      { id: 'c2_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    hint: 'Each C=C carbon carries one Br (Z=35) and one H (Z=1). Are the two Br atoms on the same side (Z) or opposite sides (E)?',
  },
  {
    id: 'ez_propene_trap',
    name: 'Propene',
    formula: 'CH₃CH=CH₂',
    canHaveEZ: false,
    c1Groups: [
      { id: 'c1_ch3', label: 'CH₃', atomicNum: 6, isHighest: false },
      { id: 'c1_h', label: 'H', atomicNum: 1, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_h1', label: 'H', atomicNum: 1, isHighest: false },
      { id: 'c2_h2', label: 'H', atomicNum: 1, isHighest: false },
    ],
    hint: 'Look carefully at BOTH ends of the C=C double bond: does each alkene carbon hold two DIFFERENT groups?',
  },
  {
    id: 'ez_2me_propene_trap',
    name: '2-methylpropene',
    formula: '(CH₃)₂C=CH₂',
    canHaveEZ: false,
    c1Groups: [
      { id: 'c1_m1', label: 'CH₃', atomicNum: 6, isHighest: false },
      { id: 'c1_m2', label: 'CH₃', atomicNum: 6, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_h1', label: 'H', atomicNum: 1, isHighest: false },
      { id: 'c2_h2', label: 'H', atomicNum: 1, isHighest: false },
    ],
    hint: 'Check whether swapping the two groups on either carbon creates a genuinely different 3D arrangement.',
  },
  {
    id: 'ez_1_1_dichloro_trap',
    name: '1,1-dichloroethene',
    formula: 'CCl₂=CH₂',
    canHaveEZ: false,
    c1Groups: [
      { id: 'c1_cl1', label: 'Cl', atomicNum: 17, isHighest: false },
      { id: 'c1_cl2', label: 'Cl', atomicNum: 17, isHighest: false },
    ],
    c2Groups: [
      { id: 'c2_h1', label: 'H', atomicNum: 1, isHighest: false },
      { id: 'c2_h2', label: 'H', atomicNum: 1, isHighest: false },
    ],
    hint: 'Even though halogens have high atomic numbers, check whether the two groups attached to the SAME C=C carbon are different.',
  },
];

const IUPAC_PROBLEMS = [
  {
    id: 'iupac_2me_butane',
    answer: '2-methylbutane',
    chainLen: '4 (but-)',
    suffix: '-ane',
    hint: 'Longest continuous chain is 4 carbons; number from the end giving the methyl branch locant 2 rather than 3.',
    reversedNumTrap: '3-methylbutane',
    nodes: [
      { label: 'CH₃', x: 55, y: 110 },
      { label: 'CH', x: 130, y: 75 },
      { label: 'CH₂', x: 205, y: 110 },
      { label: 'CH₃', x: 280, y: 75 },
    ],
    branches: [{ fromIdx: 1, label: 'CH₃', dx: 0, dy: -42 }],
  },
  {
    id: 'iupac_2_3_dime_butane',
    answer: '2,3-dimethylbutane',
    chainLen: '4 (but-)',
    suffix: '-ane',
    hint: 'Four-carbon longest chain with two identical methyl groups on C2 and C3 (use di- prefix with comma-separated locants).',
    nodes: [
      { label: 'CH₃', x: 55, y: 105 },
      { label: 'CH', x: 130, y: 105 },
      { label: 'CH', x: 205, y: 105 },
      { label: 'CH₃', x: 280, y: 105 },
    ],
    branches: [
      { fromIdx: 1, label: 'CH₃', dx: 0, dy: -44 },
      { fromIdx: 2, label: 'CH₃', dx: 0, dy: 44 },
    ],
  },
  {
    id: 'iupac_2br_3me_butane',
    answer: '2-bromo-3-methylbutane',
    chainLen: '4 (but-)',
    suffix: '-ane',
    hint: 'Longest chain is 4 carbons; list substituent prefixes strictly alphabetically (bromo before methyl), numbering so the lowest locant set is 2,3 with bromo at C2.',
    reversedAlphaTrap: '3-methyl-2-bromobutane',
    nodes: [
      { label: 'CH₃', x: 55, y: 105 },
      { label: 'CH', x: 130, y: 105 },
      { label: 'CH', x: 205, y: 105 },
      { label: 'CH₃', x: 280, y: 105 },
    ],
    branches: [
      { fromIdx: 1, label: 'Br', dx: 0, dy: -44 },
      { fromIdx: 2, label: 'CH₃', dx: 0, dy: -44 },
    ],
  },
  {
    id: 'iupac_3me_but1ene',
    answer: '3-methylbut-1-ene',
    chainLen: '4 (but-)',
    suffix: '-1-ene',
    hint: 'The C=C double bond takes numbering priority over the alkyl branch, placing C=C at C1–C2 and the methyl branch on C3.',
    reversedNumTrap: '2-methylbut-3-ene',
    nodes: [
      { label: 'CH₂', x: 55, y: 105, doubleNext: true },
      { label: 'CH', x: 135, y: 105 },
      { label: 'CH', x: 215, y: 105 },
      { label: 'CH₃', x: 290, y: 105 },
    ],
    branches: [{ fromIdx: 2, label: 'CH₃', dx: 0, dy: -44 }],
  },
  {
    id: 'iupac_4me_pent2ene',
    answer: '4-methylpent-2-ene',
    chainLen: '5 (pent-)',
    suffix: '-2-ene',
    hint: 'Longest chain containing C=C is 5 carbons; number from the left so C=C sits on C2 (not C3) and methyl is at C4.',
    reversedNumTrap: '2-methylpent-3-ene',
    nodes: [
      { label: 'CH₃', x: 40, y: 105 },
      { label: 'CH', x: 105, y: 105, doubleNext: true },
      { label: 'CH', x: 175, y: 105 },
      { label: 'CH', x: 245, y: 105 },
      { label: 'CH₃', x: 310, y: 105 },
    ],
    branches: [{ fromIdx: 3, label: 'CH₃', dx: 0, dy: -44 }],
  },
  {
    id: 'iupac_2me_propan2ol',
    answer: '2-methylpropan-2-ol',
    chainLen: '3 (prop-)',
    suffix: '-2-ol',
    hint: 'Find the longest chain passing through the C bonded to —OH (3 carbons = prop-), with both the —OH and —CH₃ on C2.',
    nodes: [
      { label: 'CH₃', x: 65, y: 105 },
      { label: 'C', x: 170, y: 105 },
      { label: 'CH₃', x: 275, y: 105 },
    ],
    branches: [
      { fromIdx: 1, label: 'OH', dx: 0, dy: -44 },
      { fromIdx: 1, label: 'CH₃', dx: 0, dy: 44 },
    ],
  },
  {
    id: 'iupac_3cl_butan1ol',
    answer: '3-chlorobutan-1-ol',
    chainLen: '4 (but-)',
    suffix: '-1-ol',
    hint: 'The principal —OH group takes C1 priority over the chloro group, placing Cl at C3.',
    reversedNumTrap: '2-chlorobutan-4-ol',
    nodes: [
      { label: 'CH₃', x: 55, y: 105 },
      { label: 'CH', x: 130, y: 105 },
      { label: 'CH₂', x: 205, y: 105 },
      { label: 'CH₂', x: 275, y: 105 },
    ],
    branches: [
      { fromIdx: 1, label: 'Cl', dx: 0, dy: -44 },
      { fromIdx: 3, label: 'OH', dx: 0, dy: -44 },
    ],
  },
  {
    id: 'iupac_2me_propanoic',
    answer: '2-methylpropanoic acid',
    chainLen: '3 (prop-)',
    suffix: '-anoic acid',
    hint: 'Carboxylic acid carbon (COOH) is always C1; three-carbon chain with a methyl substituent on C2.',
    nodes: [
      { label: 'CH₃', x: 70, y: 105 },
      { label: 'CH', x: 165, y: 105 },
      { label: 'COOH', x: 265, y: 105 },
    ],
    branches: [{ fromIdx: 1, label: 'CH₃', dx: 0, dy: -44 }],
  },
  {
    id: 'iupac_2cl_3me_pentane',
    answer: '2-chloro-3-methylpentane',
    chainLen: '5 (pent-)',
    suffix: '-ane',
    hint: 'Five-carbon longest chain numbered from the end nearest the substituents (2,3 vs 3,4); list prefixes alphabetically (chloro before methyl).',
    reversedNumTrap: '4-chloro-3-methylpentane',
    nodes: [
      { label: 'CH₃', x: 42, y: 105 },
      { label: 'CH', x: 108, y: 105 },
      { label: 'CH', x: 174, y: 105 },
      { label: 'CH₂', x: 240, y: 105 },
      { label: 'CH₃', x: 306, y: 105 },
    ],
    branches: [
      { fromIdx: 1, label: 'Cl', dx: 0, dy: -44 },
      { fromIdx: 2, label: 'CH₃', dx: 0, dy: 44 },
    ],
  },
  {
    id: 'iupac_butan2ol',
    answer: 'butan-2-ol',
    chainLen: '4 (but-)',
    suffix: '-2-ol',
    hint: 'Unbranched 4-carbon chain with —OH numbered from the closer end (C2 rather than C3).',
    reversedNumTrap: 'butan-3-ol',
    nodes: [
      { label: 'CH₃', x: 55, y: 105 },
      { label: 'CH₂', x: 130, y: 105 },
      { label: 'CH', x: 205, y: 105 },
      { label: 'CH₃', x: 280, y: 105 },
    ],
    branches: [{ fromIdx: 2, label: 'OH', dx: 0, dy: -44 }],
  },
];

const ISOMER_PAIRS = [
  {
    id: 'iso_chain_c4',
    molFormula: 'C₄H₁₀',
    aName: 'CH₃CH₂CH₂CH₃',
    aSub: '(Butane)',
    bName: 'CH₃CH(CH₃)CH₃',
    bSub: '(Methylpropane)',
    type: 'chain',
    hint: 'Same molecular formula and functional class (alkane), but the carbon skeleton changes from unbranched to branched.',
    summary: 'Chain isomerism: both have formula C₄H₁₀ but differ in carbon chain branching.',
  },
  {
    id: 'iso_pos_c4oh',
    molFormula: 'C₄H₁₀O',
    aName: 'CH₃CH₂CH₂CH₂OH',
    aSub: '(Butan-1-ol)',
    bName: 'CH₃CH₂CH(OH)CH₃',
    bSub: '(Butan-2-ol)',
    type: 'position',
    hint: 'Both molecules share the same 4-carbon unbranched skeleton and —OH functional group; only the locant shifts.',
    summary: 'Position isomerism: the —OH group sits on C1 vs C2 of the same carbon chain.',
  },
  {
    id: 'iso_fg_c3h6o',
    molFormula: 'C₃H₆O',
    aName: 'CH₃CH₂CHO',
    aSub: '(Propanal)',
    bName: 'CH₃COCH₃',
    bSub: '(Propanone)',
    type: 'functional',
    hint: 'One molecule is an aldehyde (—CHO) while the other is a ketone (>C=O) with the exact same molecular formula.',
    summary: 'Functional group isomerism: aldehyde vs ketone sharing formula C₃H₆O.',
  },
  {
    id: 'iso_fg_c4h8',
    molFormula: 'C₄H₈',
    aName: 'CH₃CH₂CH=CH₂',
    aSub: '(But-1-ene)',
    bName: 'CH₂–CH₂–CH₂–CH₂ (ring)',
    bSub: '(Cyclobutane)',
    type: 'functional',
    hint: 'One compound contains a C=C alkene double bond while the other is a saturated cycloalkane.',
    summary: 'Functional group isomerism: alkene vs cycloalkane with formula C₄H₈.',
  },
  {
    id: 'iso_fg_c3h6o2',
    molFormula: 'C₃H₆O₂',
    aName: 'CH₃CH₂COOH',
    aSub: '(Propanoic acid)',
    bName: 'CH₃COOCH₃',
    bSub: '(Methyl ethanoate)',
    type: 'functional',
    hint: 'Compare their homologous families: carboxylic acid (—COOH) vs ester (—COO—).',
    summary: 'Functional group isomerism: carboxylic acid vs ester sharing formula C₃H₆O₂.',
  },
  {
    id: 'iso_pos_c4h8',
    molFormula: 'C₄H₈',
    aName: 'CH₂=CHCH₂CH₃',
    aSub: '(But-1-ene)',
    bName: 'CH₃CH=CHCH₃',
    bSub: '(But-2-ene)',
    type: 'position',
    hint: 'Same 4-carbon unbranched alkene backbone, with the C=C double bond located at position 1 vs position 2.',
    summary: 'Position isomerism: the C=C double bond shifts from C1 to C2.',
  },
  {
    id: 'iso_chain_c5h12',
    molFormula: 'C₅H₁₂',
    aName: 'CH₃(CH₂)₃CH₃',
    aSub: '(Pentane)',
    bName: 'C(CH₃)₄',
    bSub: '(2,2-dimethylpropane)',
    type: 'chain',
    hint: 'Both are saturated alkanes with five carbons and twelve hydrogens, arranged with different skeletal branching.',
    summary: 'Chain isomerism: straight-chain pentane vs highly branched 2,2-dimethylpropane (C₅H₁₂).',
  },
  {
    id: 'iso_pos_c3cl',
    molFormula: 'C₃H₇Cl',
    aName: 'CH₃CH₂CH₂Cl',
    aSub: '(1-chloropropane)',
    bName: 'CH₃CHClCH₃',
    bSub: '(2-chloropropane)',
    type: 'position',
    hint: 'Same 3-carbon propane skeleton and halogen functional group; only the attachment position of —Cl changes.',
    summary: 'Position isomerism: —Cl atom is attached at C1 vs C2.',
  },
  {
    id: 'iso_not_homologue',
    molFormula: 'C₄H₁₀ vs C₅H₁₂',
    aName: 'CH₃CH₂CH₂CH₃',
    aSub: '(Butane)',
    bName: 'CH₃CH₂CH₂CH₂CH₃',
    bSub: '(Pentane)',
    type: 'not_isomers',
    hint: 'Isomers MUST have the exact same molecular formula. Count total carbons and hydrogens in both compounds first.',
    summary: 'Not isomers: butane (C₄H₁₀) and pentane (C₅H₁₂) are adjacent members of a homologous series, differing by CH₂.',
  },
  {
    id: 'iso_not_identical',
    molFormula: 'C₄H₉Cl',
    aName: 'ClCH₂CH₂CH₂CH₃',
    aSub: '(drawn left-to-right)',
    bName: 'CH₃CH₂CH₂CH₂Cl',
    bSub: '(drawn right-to-left)',
    type: 'not_isomers',
    hint: 'Number each chain from the end closest to the —Cl substituent to compare their IUPAC names.',
    summary: 'Not isomers (identical molecule): both diagrams represent 1-chlorobutane rotated end-for-end.',
  },
];

function AlkeneEZSvg({ problem, flipLeft, flipRight }) {
  const topLeft = flipLeft ? problem.c1Groups[1] : problem.c1Groups[0];
  const botLeft = flipLeft ? problem.c1Groups[0] : problem.c1Groups[1];
  const topRight = flipRight ? problem.c2Groups[1] : problem.c2Groups[0];
  const botRight = flipRight ? problem.c2Groups[0] : problem.c2Groups[1];

  return (
    <svg viewBox="0 0 340 200" className="w-full h-auto select-none bg-white border border-slate-200 rounded-2xl">
      {/* Central C=C double bond */}
      <line x1="126" y1="96" x2="214" y2="96" stroke="#1e293b" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="126" y1="104" x2="214" y2="104" stroke="#1e293b" strokeWidth="3.2" strokeLinecap="round" />

      {/* Four single bonds at ~120 deg */}
      <line x1="114" y1="92" x2="66" y2="48" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="114" y1="108" x2="66" y2="152" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="226" y1="92" x2="274" y2="48" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="226" y1="108" x2="274" y2="152" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

      {/* Alkene carbons */}
      <circle cx="120" cy="100" r="14" fill="#eff6ff" stroke="#326fa0" strokeWidth="2" />
      <text x="120" y="100" textAnchor="middle" dominantBaseline="central" className="text-xs font-mono font-black fill-[#235478]">
        C1
      </text>
      <circle cx="220" cy="100" r="14" fill="#eff6ff" stroke="#326fa0" strokeWidth="2" />
      <text x="220" y="100" textAnchor="middle" dominantBaseline="central" className="text-xs font-mono font-black fill-[#235478]">
        C2
      </text>

      {/* Four substituent labels */}
      {[
        { x: 52, y: 40, grp: topLeft },
        { x: 52, y: 160, grp: botLeft },
        { x: 288, y: 40, grp: topRight },
        { x: 288, y: 160, grp: botRight },
      ].map((pos, idx) => (
        <g key={idx}>
          <rect x={pos.x - 30} y={pos.y - 14} width="60" height="28" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" className="text-xs font-mono font-black fill-slate-900">
            {pos.grp.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function IupacStructureSvg({ problem }) {
  return (
    <svg viewBox="0 0 350 205" className="w-full h-auto select-none bg-white border border-slate-200 rounded-2xl">
      {/* Main chain bonds */}
      {problem.nodes.slice(0, -1).map((node, idx) => {
        const next = problem.nodes[idx + 1];
        if (node.doubleNext) {
          return (
            <g key={`b-${idx}`}>
              <line x1={node.x + 14} y1={node.y - 3} x2={next.x - 14} y2={next.y - 3} stroke="#334155" strokeWidth="2.4" />
              <line x1={node.x + 14} y1={node.y + 3} x2={next.x - 14} y2={next.y + 3} stroke="#334155" strokeWidth="2.4" />
            </g>
          );
        }
        return (
          <line key={`b-${idx}`} x1={node.x + 14} y1={node.y} x2={next.x - 14} y2={next.y} stroke="#334155" strokeWidth="2.6" />
        );
      })}

      {/* Branches */}
      {(problem.branches || []).map((br, idx) => {
        const anchor = problem.nodes[br.fromIdx];
        const bx = anchor.x + br.dx;
        const by = anchor.y + br.dy;
        return (
          <g key={`br-${idx}`}>
            <line
              x1={anchor.x}
              y1={anchor.y + (br.dy < 0 ? -12 : 12)}
              x2={bx}
              y2={by + (br.dy < 0 ? 12 : -12)}
              stroke="#475569"
              strokeWidth="2.2"
            />
            <rect
              x={bx - 22}
              y={by - 12}
              width="44"
              height="24"
              rx="6"
              fill={br.label === 'OH' ? '#ecfdf5' : br.label === 'Br' || br.label === 'Cl' ? '#fef3c7' : '#f8fafc'}
              stroke="#cbd5e1"
            />
            <text x={bx} y={by} textAnchor="middle" dominantBaseline="central" className="text-xs font-mono font-black fill-slate-900">
              {br.label}
            </text>
          </g>
        );
      })}

      {/* Main chain labels */}
      {problem.nodes.map((node, idx) => (
        <g key={`n-${idx}`}>
          <rect
            x={node.x - 19}
            y={node.y - 13}
            width="38"
            height="26"
            rx="6"
            fill="#eff6ff"
            stroke="#bfdbfe"
          />
          <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" className="text-xs font-mono font-black fill-slate-900">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function IupacIsomerism({ onComplete }) {
  const [mode, setMode] = useState('ez_isomerism');
  const [state, setState] = useState(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Inputs
  const [c1TopChoice, setC1TopChoice] = useState('');
  const [c2TopChoice, setC2TopChoice] = useState('');
  const [ezResult, setEzResult] = useState('');
  const [chainGuess, setChainGuess] = useState('');
  const [iupacText, setIupacText] = useState('');
  const [isoChoice, setIsoChoice] = useState('');
  const [feedback, setFeedback] = useState(null);

  const generateProblem = (forcedMode = null) => {
    const modes = ['ez_isomerism', 'iupac_naming', 'structural_isomers'];
    const selection = forcedMode || mode;
    const targetMode =
      selection === 'random' ? modes[Math.floor(Math.random() * modes.length)] : selection;

    if (selection !== 'random') setMode(selection);

    if (targetMode === 'ez_isomerism') {
      const pool = state?.subMode === 'ez_isomerism'
        ? EZ_PROBLEMS.filter((p) => p.id !== state.problem.id)
        : EZ_PROBLEMS;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const flipLeft = Math.random() > 0.5;
      const flipRight = Math.random() > 0.5;
      let expectedEz = 'no_ez';
      if (picked.canHaveEZ) {
        const leftHighIsTop = !flipLeft;
        const rightHighIsTop = !flipRight;
        expectedEz = leftHighIsTop === rightHighIsTop ? 'Z' : 'E';
      }
      setState({
        subMode: 'ez_isomerism',
        problem: picked,
        flipLeft,
        flipRight,
        expectedEz,
      });
    } else if (targetMode === 'iupac_naming') {
      const pool = state?.subMode === 'iupac_naming'
        ? IUPAC_PROBLEMS.filter((p) => p.id !== state.problem.id)
        : IUPAC_PROBLEMS;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setState({
        subMode: 'iupac_naming',
        problem: picked,
      });
    } else {
      const pool = state?.subMode === 'structural_isomers'
        ? ISOMER_PAIRS.filter((p) => p.id !== state.problem.id)
        : ISOMER_PAIRS;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setState({
        subMode: 'structural_isomers',
        problem: picked,
      });
    }

    setShuffleSeed((s) => s + 1);
    setC1TopChoice('');
    setC2TopChoice('');
    setEzResult('');
    setChainGuess('');
    setIupacText('');
    setIsoChoice('');
    setFeedback(null);
    setShowHint(false);
  };

  React.useEffect(() => {
    generateProblem('ez_isomerism');
  }, []);

  const ezOutcomeOptions = useMemo(
    () =>
      shuffleArray([
        { id: 'Z', label: 'Z-isomer (higher-priority groups on the SAME side)' },
        { id: 'E', label: 'E-isomer (higher-priority groups on OPPOSITE sides)' },
        { id: 'no_ez', label: 'No E/Z stereoisomerism (at least one C=C carbon carries two identical groups)' },
      ]),
    [state, shuffleSeed]
  );

  const isomerClassOptions = useMemo(
    () =>
      shuffleArray([
        { id: 'chain', label: 'Chain isomerism (same functional group, different carbon branching)' },
        { id: 'position', label: 'Position isomerism (same chain & functional group, different locant)' },
        { id: 'functional', label: 'Functional group isomerism (same formula, different functional group)' },
        { id: 'not_isomers', label: 'Not structural isomers (different formula or identical molecule)' },
      ]),
    [state, shuffleSeed]
  );

  const normalizeName = (s) =>
    s.trim().toLowerCase().replace(/\s+/g, ' ');

  const handleCheck = (e) => {
    e.preventDefault();
    if (!state) return;

    if (state.subMode === 'ez_isomerism') {
      const { problem, expectedEz } = state;
      if (!ezResult || (problem.canHaveEZ && (!c1TopChoice || !c2TopChoice))) {
        setFeedback({
          isCorrect: false,
          msg: 'Please complete the CIP priority selections (when applicable) and the final E/Z classification.',
        });
        return;
      }

      if (!problem.canHaveEZ) {
        if (ezResult === 'no_ez') {
          setFeedback({
            isCorrect: true,
            msg: `Correct! ${problem.name} (${problem.formula}) does not show E/Z stereoisomerism because one alkene carbon carries two identical groups.`,
          });
          onComplete?.(`${problem.id}_no_ez`);
        } else {
          setFeedback({
            isCorrect: false,
            msg: 'Incorrect. Check both alkene carbons: E/Z isomerism only exists when BOTH C=C carbons have two different attached groups (in addition to restricted π-bond rotation).',
          });
        }
        return;
      }

      const c1HighestId = problem.c1Groups.find((g) => g.isHighest)?.id;
      const c2HighestId = problem.c2Groups.find((g) => g.isHighest)?.id;
      const c1Ok = c1TopChoice === c1HighestId;
      const c2Ok = c2TopChoice === c2HighestId;
      const ezOk = ezResult === expectedEz;

      if (c1Ok && c2Ok && ezOk) {
        setFeedback({
          isCorrect: true,
          msg: `Spot on! This arrangement is ${expectedEz}-${problem.name} (${expectedEz === 'Z' ? 'zusammen — same side' : 'entgegen — opposite sides'}). Restricted rotation about the C=C π-bond prevents interconversion.`,
        });
        onComplete?.(`${problem.id}_${expectedEz}`);
      } else {
        const errs = [];
        if (!c1Ok) errs.push('Check higher CIP priority on C1 (highest atomic number directly bonded to C1).');
        if (!c2Ok) errs.push('Check higher CIP priority on C2 (move outward along carbon chains if first atoms tie).');
        if (!ezOk) errs.push('Re-check whether your two higher-priority groups sit on the SAME side (Z) or OPPOSITE sides (E) across C=C.');
        setFeedback({ isCorrect: false, msg: errs.join(' ') });
      }
      return;
    }

    if (state.subMode === 'iupac_naming') {
      const { problem } = state;
      if (!chainGuess || !iupacText.trim()) {
        setFeedback({
          isCorrect: false,
          msg: 'Please select the parent chain stem and type the systematic IUPAC name.',
        });
        return;
      }

      const cleaned = normalizeName(iupacText);
      const chainOk = chainGuess === problem.chainLen;
      const nameOk = cleaned === normalizeName(problem.answer);

      if (chainOk && nameOk) {
        setFeedback({
          isCorrect: true,
          msg: `Correct! Systematic IUPAC name: ${problem.answer}.`,
        });
        onComplete?.(problem.id);
      } else if (!chainOk) {
        setFeedback({
          isCorrect: false,
          msg: 'Check the longest continuous carbon chain containing the principal functional group (prop- = 3, but- = 4, pent- = 5).',
        });
      } else if (problem.reversedNumTrap && cleaned === normalizeName(problem.reversedNumTrap)) {
        setFeedback({
          isCorrect: false,
          msg: 'WJEC Locant Direction Trap! Number the parent chain from the end that gives the principal functional group (or lowest overall substituent set) the smallest number.',
        });
      } else if (problem.reversedAlphaTrap && cleaned === normalizeName(problem.reversedAlphaTrap)) {
        setFeedback({
          isCorrect: false,
          msg: 'WJEC Alphabetical Prefix Rule! Write substituent prefixes in alphabetical order (e.g. bromo before methyl, ignoring di-/tri- multipliers).',
        });
      } else {
        setFeedback({
          isCorrect: false,
          msg: 'Check your IUPAC locant numbers, commas between numbers, hyphens between numbers and letters, and alphabetical substituent ordering.',
        });
      }
      return;
    }

    if (state.subMode === 'structural_isomers') {
      const { problem } = state;
      if (!isoChoice) {
        setFeedback({ isCorrect: false, msg: 'Select a classification option first.' });
        return;
      }
      if (isoChoice === problem.type) {
        setFeedback({ isCorrect: true, msg: `Correct! ${problem.summary}` });
        onComplete?.(problem.id);
      } else {
        setFeedback({
          isCorrect: false,
          msg: 'Not quite. Check first whether both structures actually have identical molecular formulas and distinct connectivity, then compare carbon skeleton branching, locant position, and functional group class.',
        });
      }
    }
  };

  if (!state) return null;

  return (
    <div className="applet-container space-y-5" style={{ textTransform: 'none' }}>
      <div className="w-full max-w-2xl mx-auto px-4">
        <span className="block text-[10px] font-black tracking-widest text-slate-400 mb-1.5 text-center">
          Choose Practice Mode
        </span>
        <div className="flex items-center gap-2">
          <select
            value={mode === 'random' ? '' : mode}
            onChange={(e) => {
              setMode(e.target.value);
              generateProblem(e.target.value);
            }}
            className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold outline-none focus:border-[#326fa0] shadow-sm cursor-pointer"
          >
            <option value="ez_isomerism">E/Z Stereoisomerism &amp; CIP Priority</option>
            <option value="iupac_naming">Systematic IUPAC Naming</option>
            <option value="structural_isomers">Structural Isomer Classification</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setMode('random');
              generateProblem('random');
            }}
            className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all shrink-0 cursor-pointer ${
              mode === 'random'
                ? 'bg-blue-50 border-[#326fa0] text-[#326fa0] shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Random 🎲
          </button>
        </div>
      </div>

      <div className="applet-header !mb-0">
        {state.subMode === 'ez_isomerism'
          ? 'E/Z Stereoisomerism & CIP Priority'
          : state.subMode === 'iupac_naming'
          ? 'Systematic IUPAC Nomenclature'
          : 'Structural Isomerism Classifier'}
      </div>

      <div className="applet-workbench">
        {/* Left Sticky Workbench Column: Structure Visualiser */}
        <div className="applet-workbench-sticky space-y-3">
          {state.subMode === 'ez_isomerism' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                  WJEC Unit 2.4 • Displayed Alkene
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {state.problem.formula}
                </span>
              </div>
              <AlkeneEZSvg
                problem={state.problem}
                flipLeft={state.flipLeft}
                flipRight={state.flipRight}
              />
              <div className="text-center text-sm font-black text-slate-800">
                {state.problem.name}
              </div>
            </div>
          )}

          {state.subMode === 'iupac_naming' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="block text-[10px] font-black tracking-widest text-[#326fa0]">
                WJEC Unit 2.4 • Deduce Systematic IUPAC Name
              </span>
              <IupacStructureSvg problem={state.problem} />
            </div>
          )}

          {state.subMode === 'structural_isomers' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-[#326fa0]">
                  WJEC Unit 2.4 • Compare Compound Pair
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {state.problem.molFormula}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-[10px] font-black text-slate-400 mb-1">Structure A</div>
                  <div className="font-mono text-base font-black text-slate-900">{state.problem.aName}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{state.problem.aSub}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-[10px] font-black text-slate-400 mb-1">Structure B</div>
                  <div className="font-mono text-base font-black text-slate-900">{state.problem.bName}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{state.problem.bSub}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Workbench Column: Hint, Inputs & Feedback */}
        <form onSubmit={handleCheck} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black text-slate-800">
              {state.subMode === 'ez_isomerism'
                ? 'Step-by-Step Cahn–Ingold–Prelog (CIP) Check'
                : state.subMode === 'iupac_naming'
                ? 'Build the IUPAC Name'
                : 'Classify the Relationship'}
            </span>
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition-colors cursor-pointer"
            >
              💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>
          </div>

          {showHint && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 leading-relaxed">
              <strong className="font-black text-amber-900">Hint: </strong>
              {state.problem.hint}
            </div>
          )}

          {state.subMode === 'ez_isomerism' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <label className="block text-[11px] font-black text-slate-700 mb-1.5">
                    Higher CIP Priority on C1:
                  </label>
                  <select
                    value={c1TopChoice}
                    onChange={(e) => {
                      setC1TopChoice(e.target.value);
                      setFeedback(null);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                  >
                    <option value="">-- Select or N/A --</option>
                    {state.problem.c1Groups.map((g) => (
                      <option key={g.id} value={g.id}>—{g.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <label className="block text-[11px] font-black text-slate-700 mb-1.5">
                    Higher CIP Priority on C2:
                  </label>
                  <select
                    value={c2TopChoice}
                    onChange={(e) => {
                      setC2TopChoice(e.target.value);
                      setFeedback(null);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                  >
                    <option value="">-- Select or N/A --</option>
                    {state.problem.c2Groups.map((g) => (
                      <option key={g.id} value={g.id}>—{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-black text-slate-700">Stereochemical Classification:</div>
                {ezOutcomeOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      ezResult === opt.id
                        ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ez-outcome"
                      checked={ezResult === opt.id}
                      onChange={() => {
                        setEzResult(opt.id);
                        setFeedback(null);
                      }}
                      className="mt-0.5 accent-[#326fa0]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {state.subMode === 'iupac_naming' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Step 1: Longest Carbon Chain Stem (with principal group)
                </label>
                <select
                  value={chainGuess}
                  onChange={(e) => {
                    setChainGuess(e.target.value);
                    setFeedback(null);
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                >
                  <option value="">-- Select Longest Chain --</option>
                  <option value="3 (prop-)">3 carbons (prop-)</option>
                  <option value="4 (but-)">4 carbons (but-)</option>
                  <option value="5 (pent-)">5 carbons (pent-)</option>
                  <option value="6 (hex-)">6 carbons (hex-)</option>
                </select>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  Step 2: Type Full Systematic IUPAC Name
                </label>
                <input
                  type="text"
                  value={iupacText}
                  onChange={(e) => {
                    setIupacText(e.target.value);
                    setFeedback(null);
                  }}
                  placeholder="e.g. 2-methylbutane"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono text-sm font-bold text-slate-800"
                />
                <span className="block text-[11px] font-medium text-slate-500 mt-1">
                  Use commas between numbers and hyphens between numbers and words (prefixes alphabetical).
                </span>
              </div>
            </div>
          )}

          {state.subMode === 'structural_isomers' && (
            <div className="space-y-2">
              {isomerClassOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    isoChoice === opt.id
                      ? 'bg-blue-50/70 border-[#326fa0] text-slate-900'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="iso-class"
                    checked={isoChoice === opt.id}
                    onChange={() => {
                      setIsoChoice(opt.id);
                      setFeedback(null);
                    }}
                    className="mt-0.5 accent-[#326fa0]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          )}

          <div className="button-group pt-1">
            <button type="submit" className="btn btn-primary">
              Check Answer
            </button>
            <button type="button" onClick={() => generateProblem(mode)} className="btn btn-secondary">
              Next Problem &rarr;
            </button>
          </div>

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
                  Next Problem &rarr;
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
