import React, { useState, useEffect } from 'react';

const ChiralCenters = () => {
  const [problem, setProblem] = useState(null);
  const [selectedCarbons, setSelectedCarbons] = useState([]);
  const [feedback, setFeedback] = useState({ message: '', status: '' });

  // COMREHENSIVE 21 WJEC REALISTIC SPECIFICATION MOLECULAR POOL
  const moleculesPool = [
    {
      name: "Butan-2-ol",
      id: "butan2ol",
      svgWidth: 240,
      svgHeight: 140,
      explanation: "Carbon 2 is the sole asymmetric chiral center. It is bonded to four unique environments: -H, -OH, a methyl group (-CH₃), and an ethyl group (-CH₂CH₃). All other aliphatic carbons are bonded to multiple identical hydrogen atoms.",
      correct: [2],
      lines: [
        { x1: 40, y1: 100, x2: 90, y2: 60 },
        { x1: 90, y1: 60,  x2: 140, y2: 100 },
        { x1: 140, y1: 100, x2: 190, y2: 60 },
        { x1: 90, y1: 60,  x2: 90, y2: 36 }
      ],
      labels: [
        { x: 90, y: 24, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 100, label: "C1" },
        { id: 2, cx: 90, cy: 60, label: "C2" },
        { id: 3, cx: 140, cy: 100, label: "C3" },
        { id: 4, cx: 190, cy: 60, label: "C4" }
      ]
    },
    {
      name: "2-Hydroxypropanal",
      id: "hydroxypropanal",
      svgWidth: 240,
      svgHeight: 150,
      explanation: "Carbon 2 is a chiral center attached to -H, -OH, an aldehyde group (-CHO), and a methyl group (-CH₃). Carbon 1 contains a planar double bond to oxygen (=O) and lacks four single bonds, disqualifying it from asymmetry.",
      correct: [2],
      lines: [
        { x1: 52.5, y1: 52.5, x2: 27.5, y2: 27.5 },
        { x1: 47.5, y1: 57.5, x2: 22.5, y2: 32.5 },
        { x1: 50, y1: 55, x2: 100, y2: 95 },
        { x1: 100, y1: 95, x2: 150, y2: 55 },
        { x1: 100, y1: 95, x2: 100, y2: 126 }
      ],
      labels: [
        { x: 16, y: 20, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 100, y: 136, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 50, cy: 55, label: "C1" },
        { id: 2, cx: 100, cy: 95, label: "C2" },
        { id: 3, cx: 150, cy: 55, label: "C3" }
      ]
    },
    {
      name: "Threonine (2-Amino-3-hydroxybutanoic acid)",
      id: "threonine",
      svgWidth: 280,
      svgHeight: 160,
      explanation: "This amino acid contains MULTIPLE chiral centers (Carbon 2 and Carbon 3). Carbon 2 is asymmetric because it binds to -H, -NH₂, -COOH, and the side chain. Carbon 3 is also asymmetric, binding to -H, -OH, -CH₃, and the amino acid backbone.",
      correct: [2, 3],
      lines: [
        { x1: 42.5, y1: 57.5, x2: 17.5, y2: 32.5 },
        { x1: 37.5, y1: 62.5, x2: 12.5, y2: 37.5 },
        { x1: 40, y1: 60, x2: 70, y2: 60 },
        { x1: 40, y1: 60, x2: 80, y2: 100 },
        { x1: 80, y1: 100, x2: 130, y2: 60 },
        { x1: 130, y1: 60, x2: 180, y2: 100 },
        { x1: 80, y1: 100, x2: 80, y2: 131 },
        { x1: 130, y1: 60, x2: 130, y2: 29 }
      ],
      labels: [
        { x: 8, y: 24, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 84, y: 60, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 80, y: 142, text: "NH₂", className: "fill-blue-600 font-black text-xs" },
        { x: 130, y: 20, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 60, label: "C1" },
        { id: 2, cx: 80, cy: 100, label: "C2" },
        { id: 3, cx: 130, cy: 60, label: "C3" },
        { id: 4, cx: 180, cy: 100, label: "C4" }
      ]
    },
    {
      name: "2-Phenylhydroxyethanoic acid (Mandelic Acid)",
      id: "mandelic",
      svgWidth: 320,
      svgHeight: 180,
      explanation: "Carbon 2 is the single chiral center on the side chain, bonded to -H, -OH, -COOH, and the aromatic ring. The six benzene ring carbons (C4 through C9) are entirely sp² hybridised and planar, meaning they cannot host asymmetric centers.",
      correct: [2],
      lines: [
        { x1: 252.5, y1: 57.5, x2: 227.5, y2: 32.5 },
        { x1: 247.5, y1: 62.5, x2: 222.5, y2: 37.5 },
        { x1: 250, y1: 60, x2: 282, y2: 60 },
        { x1: 250, y1: 60, x2: 200, y2: 100 },
        { x1: 200, y1: 100, x2: 200, y2: 131 },
        { x1: 200, y1: 100, x2: 150, y2: 100 },
        { x1: 150, y1: 100, x2: 125, y2: 57 },
        { x1: 125, y1: 57,  x2: 75,  y2: 57 },
        { x1: 75,  y1: 57,  x2: 50,  y2: 100 },
        { x1: 50,  y1: 100, x2: 75,  y2: 143 },
        { x1: 75,  y1: 143, x2: 125, y2: 143 },
        { x1: 125, y1: 143, x2: 150, y2: 100 }
      ],
      labels: [
        { x: 216, y: 24, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 294, y: 60, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 200, y: 142, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 250, cy: 60, label: "C1" },
        { id: 2, cx: 200, cy: 100, label: "C2" },
        { id: 3, cx: 150, cy: 100, label: "C3" },
        { id: 4, cx: 125, cy: 57, label: "C4" },
        { id: 5, cx: 75, cy: 57, label: "C5" },
        { id: 6, cx: 50, cy: 100, label: "C6" },
        { id: 7, cx: 75, cy: 143, label: "C7" },
        { id: 8, cx: 125, cy: 143, label: "C8" }
      ],
      isBenzene: true,
      ringCenter: { cx: 100, cy: 100, r: 32 }
    },
    {
      name: "2-Chlorobutane",
      id: "chlorobutane",
      svgWidth: 240,
      svgHeight: 140,
      explanation: "Carbon 2 is a chiral center bonded to four unique groups: -H, -Cl, a methyl group (-CH₃), and an ethyl group (-CH₂CH₃). All other aliphatic carbons are symmetric.",
      correct: [2],
      lines: [
        { x1: 40, y1: 100, x2: 90, y2: 60 },
        { x1: 90, y1: 60,  x2: 140, y2: 100 },
        { x1: 140, y1: 100, x2: 190, y2: 60 },
        { x1: 90, y1: 60,  x2: 90, y2: 36 }
      ],
      labels: [
        { x: 90, y: 24, text: "Cl", className: "fill-emerald-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 100, label: "C1" },
        { id: 2, cx: 90, cy: 60, label: "C2" },
        { id: 3, cx: 140, cy: 100, label: "C3" },
        { id: 4, cx: 190, cy: 60, label: "C4" }
      ]
    },
    {
      name: "Lactic Acid (2-Hydroxypropanoic acid)",
      id: "lactic",
      svgWidth: 240,
      svgHeight: 160,
      explanation: "Carbon 2 is the single asymmetric center, binding to -H, -OH, a carboxylic acid group (-COOH), and a methyl group (-CH₃). Carbon 1 contains planar carbonyl double bonds.",
      correct: [2],
      lines: [
        { x1: 52.5, y1: 52.5, x2: 27.5, y2: 27.5 },
        { x1: 47.5, y1: 57.5, x2: 22.5, y2: 32.5 },
        { x1: 50, y1: 55, x2: 100, y2: 95 },
        { x1: 100, y1: 95, x2: 150, y2: 55 },
        { x1: 100, y1: 95, x2: 100, y2: 126 },
        { x1: 50, y1: 55, x2: 50, y2: 86 }
      ],
      labels: [
        { x: 16, y: 20, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 50, y: 96, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 100, y: 136, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 50, cy: 55, label: "C1" },
        { id: 2, cx: 100, cy: 95, label: "C2" },
        { id: 3, cx: 150, cy: 55, label: "C3" }
      ]
    },
    {
      name: "3-Methylhexane (Hydrocarbon Trap)",
      id: "methylhexane",
      svgWidth: 280,
      svgHeight: 160,
      explanation: "Carbon 3 is a true chiral center. It binds to an implicit hydrogen, a small methyl group (-CH₃), an ethyl group (-CH₂CH₃), and a longer propyl group (-CH₂CH₂CH₃). Even though all branches are hydrocarbons, their differing lengths create four asymmetric configurations.",
      correct: [3],
      lines: [
        { x1: 30, y1: 100, x2: 70, y2: 60 },
        { x1: 70, y1: 60,  x2: 110, y2: 100 },
        { x1: 110, y1: 100, x2: 150, y2: 60 },
        { x1: 150, y1: 60,  x2: 190, y2: 100 },
        { x1: 190, y1: 100, x2: 230, y2: 60 },
        { x1: 110, y1: 100, x2: 110, y2: 135 }
      ],
      labels: [],
      atoms: [
        { id: 1, cx: 30, cy: 100, label: "C1" },
        { id: 2, cx: 70, cy: 60, label: "C2" },
        { id: 3, cx: 110, cy: 100, label: "C3" },
        { id: 4, cx: 150, cy: 60, label: "C4" },
        { id: 5, cx: 190, cy: 100, label: "C5" },
        { id: 6, cx: 230, cy: 60, label: "C6" },
        { id: 7, cx: 110, cy: 135, label: "C7" }
      ]
    },
    {
      name: "Pentan-3-ol (Symmetry Trap)",
      id: "pentan3ol",
      svgWidth: 260,
      svgHeight: 150,
      explanation: "This molecule has NO chiral centers. Students often guess Carbon 3, but auditing its positions reveals it is attached to two identical ethyl chains (-CH₂CH₃). Lacking four distinct groups, it remains fully symmetric.",
      correct: [],
      lines: [
        { x1: 30, y1: 90,  x2: 80, y2: 50 },
        { x1: 80, y1: 50,  x2: 130, y2: 90 },
        { x1: 130, y1: 90, x2: 180, y2: 50 },
        { x1: 180, y1: 50, x2: 230, y2: 90 },
        { x1: 130, y1: 90, x2: 130, y2: 121 }
      ],
      labels: [
        { x: 130, y: 132, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 30, cy: 90, label: "C1" },
        { id: 2, cx: 80, cy: 50, label: "C2" },
        { id: 3, cx: 130, cy: 90, label: "C3" },
        { id: 4, cx: 180, cy: 50, label: "C4" },
        { id: 5, cx: 230, cy: 90, label: "C5" }
      ]
    },
    {
      name: "Propan-2-ol (Symmetry Trap)",
      id: "propan2ol",
      svgWidth: 200,
      svgHeight: 140,
      explanation: "Propan-2-ol has no chiral center because Carbon 2 is attached to two identical methyl groups (-CH₃).",
      correct: [],
      lines: [
        { x1: 40, y1: 90, x2: 90, y2: 50 },
        { x1: 90, y1: 50, x2: 140, y2: 90 },
        { x1: 90, y1: 50, x2: 90, y2: 24 }
      ],
      labels: [
        { x: 90, y: 14, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 90, label: "C1" },
        { id: 2, cx: 90, cy: 50, label: "C2" },
        { id: 3, cx: 140, cy: 90, label: "C3" }
      ]
    },
    {
      name: "Alanine (2-Aminopropanoic acid)",
      id: "alanine",
      svgWidth: 240,
      svgHeight: 160,
      explanation: "Carbon 2 is a chiral center attached to -H, -NH₂, -COOH, and -CH₃. Carbon 1 contains planar double bonds.",
      correct: [2],
      lines: [
        { x1: 52.5, y1: 52.5, x2: 27.5, y2: 27.5 },
        { x1: 47.5, y1: 57.5, x2: 22.5, y2: 32.5 },
        { x1: 50, y1: 55, x2: 100, y2: 95 },
        { x1: 100, y1: 95, x2: 150, y2: 55 },
        { x1: 100, y1: 95, x2: 100, y2: 126 },
        { x1: 50, y1: 55, x2: 50, y2: 86 }
      ],
      labels: [
        { x: 16, y: 20, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 50, y: 96, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 100, y: 136, text: "NH₂", className: "fill-blue-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 50, cy: 55, label: "C1" },
        { id: 2, cx: 100, cy: 95, label: "C2" },
        { id: 3, cx: 150, cy: 55, label: "C3" }
      ]
    },
    {
      name: "Glyceraldehyde (2,3-Dihydroxypropanal)",
      id: "glyceraldehyde",
      svgWidth: 240,
      svgHeight: 160,
      explanation: "Carbon 2 binds to four unique groups: -H, -OH, -CHO, and -CH₂OH.",
      correct: [2],
      lines: [
        { x1: 52.5, y1: 52.5, x2: 27.5, y2: 27.5 },
        { x1: 47.5, y1: 57.5, x2: 22.5, y2: 32.5 },
        { x1: 50, y1: 55, x2: 100, y2: 95 },
        { x1: 100, y1: 95, x2: 150, y2: 55 },
        { x1: 100, y1: 95, x2: 100, y2: 126 },
        { x1: 150, y1: 55, x2: 180, y2: 55 }
      ],
      labels: [
        { x: 16, y: 20, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 100, y: 136, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 192, y: 55, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 50, cy: 55, label: "C1" },
        { id: 2, cx: 100, cy: 95, label: "C2" },
        { id: 3, cx: 150, cy: 55, label: "C3" }
      ]
    },
    {
      name: "2-Bromobutane",
      id: "bromobutane",
      svgWidth: 240,
      svgHeight: 140,
      explanation: "Carbon 2 is a chiral center bonded to -H, -Br, -CH₃, and -CH₂CH₃.",
      correct: [2],
      lines: [
        { x1: 40, y1: 100, x2: 90, y2: 60 },
        { x1: 90, y1: 60,  x2: 140, y2: 100 },
        { x1: 140, y1: 100, x2: 190, y2: 60 },
        { x1: 90, y1: 60,  x2: 90, y2: 36 }
      ],
      labels: [
        { x: 90, y: 24, text: "Br", className: "fill-amber-700 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 100, label: "C1" },
        { id: 2, cx: 90, cy: 60, label: "C2" },
        { id: 3, cx: 140, cy: 100, label: "C3" },
        { id: 4, cx: 190, cy: 60, label: "C4" }
      ]
    },
    {
      name: "3-Chloropentane (Symmetry Trap)",
      id: "chloropentane",
      svgWidth: 260,
      svgHeight: 150,
      explanation: "Carbon 3 is symmetric because it is attached to two identical ethyl chains (-CH₂CH₃).",
      correct: [],
      lines: [
        { x1: 30, y1: 90,  x2: 80, y2: 50 },
        { x1: 80, y1: 50,  x2: 130, y2: 90 },
        { x1: 130, y1: 90, x2: 180, y2: 50 },
        { x1: 180, y1: 50, x2: 230, y2: 90 },
        { x1: 130, y1: 90, x2: 130, y2: 121 }
      ],
      labels: [
        { x: 130, y: 132, text: "Cl", className: "fill-emerald-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 30, cy: 90, label: "C1" },
        { id: 2, cx: 80, cy: 50, label: "C2" },
        { id: 3, cx: 130, cy: 90, label: "C3" },
        { id: 4, cx: 180, cy: 50, label: "C4" },
        { id: 5, cx: 230, cy: 90, label: "C5" }
      ]
    },
    {
      name: "2-Methylbutanoic acid",
      id: "methylbutanoic",
      svgWidth: 240,
      svgHeight: 160,
      explanation: "Carbon 2 is a chiral center attached to -H, -CH₃, -COOH, and -CH₂CH₃.",
      correct: [2],
      lines: [
        { x1: 52.5, y1: 52.5, x2: 27.5, y2: 27.5 },
        { x1: 47.5, y1: 57.5, x2: 22.5, y2: 32.5 },
        { x1: 50, y1: 55, x2: 100, y2: 95 },
        { x1: 100, y1: 95, x2: 150, y2: 55 },
        { x1: 150, y1: 55, x2: 200, y2: 95 },
        { x1: 100, y1: 95, x2: 100, y2: 126 },
        { x1: 50, y1: 55, x2: 50, y2: 86 }
      ],
      labels: [
        { x: 16, y: 20, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 50, y: 96, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 50, cy: 55, label: "C1" },
        { id: 2, cx: 100, cy: 95, label: "C2" },
        { id: 3, cx: 150, cy: 55, label: "C3" },
        { id: 4, cx: 200, cy: 95, label: "C4" }
      ]
    },
    {
      name: "Malic Acid (2-Hydroxybutanedioic acid)",
      id: "malic",
      svgWidth: 280,
      svgHeight: 160,
      explanation: "Carbon 2 is chiral. Carbon 3 is symmetric because it holds two hydrogen atoms.",
      correct: [2],
      lines: [
        { x1: 42.5, y1: 57.5, x2: 17.5, y2: 32.5 },
        { x1: 37.5, y1: 62.5, x2: 12.5, y2: 37.5 },
        { x1: 40, y1: 60, x2: 70, y2: 60 },
        { x1: 40, y1: 60, x2: 80, y2: 100 },
        { x1: 80, y1: 100, x2: 130, y2: 60 },
        { x1: 130, y1: 60, x2: 170, y2: 100 },
        { x1: 80, y1: 100, x2: 80, y2: 131 },
        { x1: 172.5, y1: 97.5, x2: 197.5, y2: 122.5 },
        { x1: 167.5, y1: 102.5, x2: 192.5, y2: 127.5 },
        { x1: 170, y1: 100, x2: 170, y2: 69 }
      ],
      labels: [
        { x: 8, y: 24, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 84, y: 60, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 80, y: 142, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 202, y: 132, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 170, y: 59, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 60, label: "C1" },
        { id: 2, cx: 80, cy: 100, label: "C2" },
        { id: 3, cx: 130, cy: 60, label: "C3" },
        { id: 4, cx: 170, cy: 100, label: "C4" }
      ]
    },
    {
      name: "Aspartic Acid (2-Aminobutanedioic acid)",
      id: "aspartic",
      svgWidth: 280,
      svgHeight: 160,
      explanation: "Carbon 2 is chiral. Carbon 3 is symmetric as it carries two hydrogen atoms.",
      correct: [2],
      lines: [
        { x1: 42.5, y1: 57.5, x2: 17.5, y2: 32.5 },
        { x1: 37.5, y1: 62.5, x2: 12.5, y2: 37.5 },
        { x1: 40, y1: 60, x2: 70, y2: 60 },
        { x1: 40, y1: 60, x2: 80, y2: 100 },
        { x1: 80, y1: 100, x2: 130, y2: 60 },
        { x1: 130, y1: 60, x2: 170, y2: 100 },
        { x1: 80, y1: 100, x2: 80, y2: 131 },
        { x1: 172.5, y1: 97.5, x2: 197.5, y2: 122.5 },
        { x1: 167.5, y1: 102.5, x2: 192.5, y2: 127.5 },
        { x1: 170, y1: 100, x2: 170, y2: 69 }
      ],
      labels: [
        { x: 8, y: 24, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 84, y: 60, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 80, y: 142, text: "NH₂", className: "fill-blue-600 font-black text-xs" },
        { x: 202, y: 132, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 170, y: 59, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 60, label: "C1" },
        { id: 2, cx: 80, cy: 100, label: "C2" },
        { id: 3, cx: 130, cy: 60, label: "C3" },
        { id: 4, cx: 170, cy: 100, label: "C4" }
      ]
    },
    {
      name: "Phenylalanine (Amino Acid Profile)",
      id: "phenylalanine",
      svgWidth: 320,
      svgHeight: 180,
      explanation: "Carbon 2 is asymmetric, binding to -H, -NH₂, -COOH, and the benzyl side chain. Ring carbons are entirely planar.",
      correct: [2],
      lines: [
        { x1: 252.5, y1: 57.5, x2: 227.5, y2: 32.5 },
        { x1: 247.5, y1: 62.5, x2: 222.5, y2: 37.5 },
        { x1: 250, y1: 60, x2: 282, y2: 60 },
        { x1: 250, y1: 60, x2: 200, y2: 100 },
        { x1: 200, y1: 100, x2: 200, y2: 131 },
        { x1: 200, y1: 100, x2: 150, y2: 100 },
        { x1: 150, y1: 100, x2: 125, y2: 57 },
        { x1: 125, y1: 57,  x2: 75,  y2: 57 },
        { x1: 75,  y1: 57,  x2: 50,  y2: 100 },
        { x1: 50,  y1: 100, x2: 75,  y2: 143 },
        { x1: 75,  y1: 143, x2: 125, y2: 143 },
        { x1: 125, y1: 143, x2: 150, y2: 100 }
      ],
      labels: [
        { x: 216, y: 24, text: "O", className: "fill-rose-600 font-black text-xs" },
        { x: 294, y: 60, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 200, y: 142, text: "NH₂", className: "fill-blue-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 250, cy: 60, label: "C1" },
        { id: 2, cx: 200, cy: 100, label: "C2" },
        { id: 3, cx: 150, cy: 100, label: "C3" },
        { id: 4, cx: 125, cy: 57, label: "C4" },
        { id: 5, cx: 75, cy: 57, label: "C5" },
        { id: 6, cx: 50, cy: 100, label: "C6" },
        { id: 7, cx: 75, cy: 143, label: "C7" },
        { id: 8, cx: 125, cy: 143, label: "C8" }
      ],
      isBenzene: true,
      ringCenter: { cx: 100, cy: 100, r: 32 }
    },
    {
      name: "3-Methylpent-1-ene",
      id: "methylpentene",
      svgWidth: 260,
      svgHeight: 140,
      explanation: "Carbon 3 is chiral, bonded to -H, -CH₃, -CH₂CH₃, and the vinyl group (-CH=CH₂). Carbons 1 and 2 are sp² double bonds.",
      correct: [3],
      lines: [
        { x1: 30, y1: 97.5, x2: 80, y2: 57.5 },
        { x1: 30, y1: 102.5, x2: 80, y2: 62.5 },
        { x1: 80, y1: 60,  x2: 130, y2: 100 },
        { x1: 130, y1: 100, x2: 180, y2: 60 },
        { x1: 130, y1: 100, x2: 130, y2: 135 }
      ],
      labels: [],
      atoms: [
        { id: 1, cx: 30, cy: 100, label: "C1" },
        { id: 2, cx: 80, cy: 60, label: "C2" },
        { id: 3, cx: 130, cy: 100, label: "C3" },
        { id: 4, cx: 180, cy: 60, label: "C4" },
        { id: 5, cx: 130, cy: 135, label: "C5" }
      ]
    },
    {
      name: "Pentane-2,3-diol",
      id: "pentanediol",
      svgWidth: 260,
      svgHeight: 150,
      explanation: "Contains multiple chiral centers (C2 and C3), each hosting four unique substituent domains.",
      correct: [2, 3],
      lines: [
        { x1: 30, y1: 90,  x2: 80, y2: 50 },
        { x1: 80, y1: 50,  x2: 130, y2: 90 },
        { x1: 130, y1: 90, x2: 180, y2: 50 },
        { x1: 180, y1: 50, x2: 230, y2: 90 },
        { x1: 80, y1: 50,  x2: 80, y2: 19 },
        { x1: 130, y1: 90, x2: 130, y2: 121 }
      ],
      labels: [
        { x: 80, y: 10, text: "OH", className: "fill-rose-600 font-black text-xs" },
        { x: 130, y: 132, text: "OH", className: "fill-rose-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 30, cy: 90, label: "C1" },
        { id: 2, cx: 80, cy: 50, label: "C2" },
        { id: 3, cx: 130, cy: 90, label: "C3" },
        { id: 4, cx: 180, cy: 50, label: "C4" },
        { id: 5, cx: 230, cy: 90, label: "C5" }
      ]
    },
    {
      name: "3-Aminohexane",
      id: "aminohexane",
      svgWidth: 280,
      svgHeight: 160,
      explanation: "Carbon 3 is chiral, bonded to -H, -NH₂, an ethyl group (-CH₂CH₃), and a propyl group (-CH₂CH₂CH₃).",
      correct: [3],
      lines: [
        { x1: 30, y1: 100, x2: 70, y2: 60 },
        { x1: 70, y1: 60,  x2: 110, y2: 100 },
        { x1: 110, y1: 100, x2: 150, y2: 60 },
        { x1: 150, y1: 60,  x2: 190, y2: 100 },
        { x1: 190, y1: 100, x2: 230, y2: 60 },
        { x1: 110, y1: 100, x2: 110, y2: 131 }
      ],
      labels: [
        { x: 110, y: 142, text: "NH₂", className: "fill-blue-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 30, cy: 100, label: "C1" },
        { id: 2, cx: 70, cy: 60, label: "C2" },
        { id: 3, cx: 110, cy: 100, label: "C3" },
        { id: 4, cx: 150, cy: 60, label: "C4" },
        { id: 5, cx: 190, cy: 100, label: "C5" },
        { id: 6, cx: 230, cy: 60, label: "C6" }
      ]
    },
    {
      name: "2,3-Dichlorobutane",
      id: "dichlorobutane",
      svgWidth: 240,
      svgHeight: 140,
      explanation: "Both C2 and C3 are asymmetrical chiral centers matching identical substituted parameter sets.",
      correct: [2, 3],
      lines: [
        { x1: 40, y1: 100, x2: 90, y2: 60 },
        { x1: 90, y1: 60,  x2: 140, y2: 100 },
        { x1: 140, y1: 100, x2: 190, y2: 60 },
        { x1: 90, y1: 60,  x2: 90, y2: 36 },
        { x1: 140, y1: 100, x2: 140, y2: 124 }
      ],
      labels: [
        { x: 90, y: 24, text: "Cl", className: "fill-emerald-600 font-black text-xs" },
        { x: 140, y: 135, text: "Cl", className: "fill-emerald-600 font-black text-xs" }
      ],
      atoms: [
        { id: 1, cx: 40, cy: 100, label: "C1" },
        { id: 2, cx: 90, cy: 60, label: "C2" },
        { id: 3, cx: 140, cy: 100, label: "C3" },
        { id: 4, cx: 190, cy: 60, label: "C4" }
      ]
    }
  ];

  const generateProblem = () => {
    let nextProb = moleculesPool[Math.floor(Math.random() * moleculesPool.length)];
    while (problem && nextProb.id === problem.id) {
      nextProb = moleculesPool[Math.floor(Math.random() * moleculesPool.length)];
    }
    setProblem(nextProb);
    setSelectedCarbons([]);
    setFeedback({ message: '', status: '' });
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleNodeClick = (atomId) => {
    setFeedback({ message: '', status: '' });
    setSelectedCarbons((prev) =>
      prev.includes(atomId) ? prev.filter((id) => id !== atomId) : [...prev, atomId].sort((a, b) => a - b)
    );
  };

  const checkAnswer = () => {
    const isCorrectMatch =
      selectedCarbons.length === problem.correct.length &&
      selectedCarbons.every((val, index) => val === problem.correct[index]);

    if (isCorrectMatch) {
      setFeedback({ message: `Correct! ${problem.explanation}`, status: 'success' });
    } else {
      setFeedback({ 
        message: "Incorrect configuration. Review each carbon atom. Double bonds, aromatic rings, or duplicate alkyl chains break asymmetry.", 
        status: 'error' 
      });
    }
  };

  if (!problem) return null;

  return (
    <div className="applet-container" style={{ textTransform: 'none' }}>
      <div className="applet-header" style={{ textTransform: 'none' }}>
        Chiral Center Identification
      </div>
      
      <div className="question-text text-center px-4 leading-relaxed" style={{ textTransform: 'none' }}>
        Identify any and all chiral carbon atoms in the molecule below.
      </div>

      {/* --- INTERACTIVE STRUCTURAL MODEL CANVAS --- */}
      <div className="w-full max-w-md mx-auto my-6 flex flex-col items-center select-none bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative">
        <span className="text-[9px] font-black tracking-widest uppercase text-slate-400 mb-4 block">
          Interactive Model: {problem.name}
        </span>
        
        <svg 
          viewBox={`0 0 ${problem.svgWidth} ${problem.svgHeight}`} 
          className="w-full max-w-[300px] h-auto overflow-visible"
        >
          {/* Render Delocalised Aromatic Benzene Rings if Active */}
          {problem.isBenzene && problem.ringCenter && (
            <circle 
              cx={problem.ringCenter.cx} 
              cy={problem.ringCenter.cy} 
              r={problem.ringCenter.r} 
              fill="none" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeDasharray="4 3" 
            />
          )}

          {/* Render Backbone Bonds */}
          {problem.lines.map((line, idx) => (
            <line 
              key={idx} 
              x1={line.x1} 
              y1={line.y1} 
              x2={line.x2} 
              y2={line.y2} 
              stroke="#475569" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
          ))}

          {/* Render Heteroatom Text Labels with Central Midpoint Alignment */}
          {problem.labels.map((lbl, idx) => (
            <text 
              key={idx} 
              x={lbl.x} 
              y={lbl.y} 
              textAnchor="middle" 
              dominantBaseline="central" 
              className={lbl.className}
            >
              {lbl.text}
            </text>
          ))}

          {/* Render Interactive Carbon Nodes */}
          {problem.atoms.map((atom) => {
            const isSelected = selectedCarbons.includes(atom.id);
            return (
              <g 
                key={atom.id} 
                onClick={() => handleNodeClick(atom.id)}
                className="cursor-pointer group"
              >
                {/* Static interactive hitbox bounds */}
                <circle cx={atom.cx} cy={atom.cy} r="15" fill="transparent" />
                
                {/* Visual Node Core */}
                <circle 
                  cx={atom.cx} 
                  cy={atom.cy} 
                  r={isSelected ? 9 : 8} 
                  className={
                    isSelected 
                      ? 'fill-amber-500 stroke-amber-600 stroke-2' 
                      : 'fill-slate-100 stroke-slate-400 stroke-2 group-hover:fill-slate-200'
                  } 
                />
                
                {/* Text centered completely inside the coordinates */}
                <text 
                  x={atom.cx} 
                  y={atom.cy} 
                  textAnchor="middle" 
                  dominantBaseline="central"
                  className={`text-[8px] font-mono font-black select-none pointer-events-none ${
                    isSelected ? 'fill-white' : 'fill-slate-700'
                  }`}
                >
                  {atom.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* --- IUPAC CONVENTION EXAM NOTE --- */}
        <div className="mt-4 pt-2 border-t border-slate-100 w-full text-center">
          <span className="inline-block text-[8px] font-black tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
            IUPAC Nomenclature Note
          </span>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">
            Carbons are strictly numbered according to priority rules (lowest locants assigned to principal functional groups).
          </p>
        </div>
      </div>

      {/* --- REAL-TIME SELECTION FEEDBACK BAR --- */}
      <div className="text-center text-xs font-bold text-slate-400 min-h-[1.5rem] mb-6">
        {selectedCarbons.length > 0 ? (
          <span>
            Highlighted Asymmetric Nodes:{" "}
            <span className="font-mono text-amber-600 bg-amber-50 px-2.5 py-0.5 border border-amber-200 rounded-md font-black">
              {selectedCarbons.map(id => `C${id}`).join(', ')}
            </span>
          </span>
        ) : (
          <span className="italic">No carbons selected (Predicting symmetrical or achiral structure)</span>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={checkAnswer}>Verify Configuration</button>
        <button className="btn btn-secondary" onClick={() => generateProblem()}>Next Molecule</button>
      </div>

      {feedback.message && (
        <div className={`feedback-box ${feedback.status === 'success' ? 'feedback-success' : 'feedback-error'}`} style={{ textTransform: 'none' }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default ChiralCenters;
