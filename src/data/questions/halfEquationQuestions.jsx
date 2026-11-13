import React from 'react';

export const HALF_EQUATIONS_DATA = [
  {
    id: 'manganate',
    name: 'Manganate(VII) Reduction',
    context: 'Acidified potassium manganate(VII) titration in redox volumetric analysis.',
    elementSymbol: 'Mn',
    elementName: 'Manganese',
    reactantName: <>MnO<sub>4</sub><sup>-</sup></>,
    productName: <>Mn<sup>2+</sup></>,
    reactantCoeff: 1,
    productCoeff: 1,
    osBefore: '+7',
    osAfter: '+2',
    electronCount: 5,
    electronSide: 'LHS',
    hPlusCount: 8,
    hPlusSide: 'LHS',
    waterCount: 4,
    waterSide: 'RHS',
    fullEqJSX: (
      <>
        MnO<sub>4</sub><sup>-</sup> + 8H<sup>+</sup> + 5e<sup>-</sup> &rarr; Mn<sup>2+</sup> + 4H<sub>2</sub>O
      </>
    )
  },
  {
    id: 'dichromate',
    name: 'Dichromate(VI) Reduction',
    context: 'Acidified potassium dichromate(VI) oxidation of primary alcohols or Fe²⁺.',
    elementSymbol: 'Cr',
    elementName: 'Chromium',
    reactantName: <>Cr<sub>2</sub>O<sub>7</sub><sup>2-</sup></>,
    productName: <>Cr<sup>3+</sup></>,
    reactantCoeff: 1,
    productCoeff: 2,
    osBefore: '2@+6',
    osAfter: '2@+3',
    electronCount: 6,
    electronSide: 'LHS',
    hPlusCount: 14,
    hPlusSide: 'LHS',
    waterCount: 7,
    waterSide: 'RHS',
    fullEqJSX: (
      <>
        Cr<sub>2</sub>O<sub>7</sub><sup>2-</sup> + 14H<sup>+</sup> + 6e<sup>-</sup> &rarr; 2Cr<sup>3+</sup> + 7H<sub>2</sub>O
      </>
    )
  },
  {
    id: 'dioxovanadium',
    name: 'Dioxovanadium(V) Reduction',
    context: 'Reduction of V(V) species by zinc in acidic solution.',
    elementSymbol: 'V',
    elementName: 'Vanadium',
    reactantName: <>VO<sub>2</sub><sup>+</sup></>,
    productName: <>VO<sup>2+</sup></>,
    reactantCoeff: 1,
    productCoeff: 1,
    osBefore: '+5',
    osAfter: '+4',
    electronCount: 1,
    electronSide: 'LHS',
    hPlusCount: 2,
    hPlusSide: 'LHS',
    waterCount: 1,
    waterSide: 'RHS',
    fullEqJSX: (
      <>
        VO<sub>2</sub><sup>+</sup> + 2H<sup>+</sup> + e<sup>-</sup> &rarr; VO<sup>2+</sup> + H<sub>2</sub>O
      </>
    )
  },
  {
    id: 'oxovanadium',
    name: 'Oxovanadium(IV) Reduction',
    context: 'Stepwise reduction of vanadium oxoanions in acidic media.',
    elementSymbol: 'V',
    elementName: 'Vanadium',
    reactantName: <>VO<sup>2+</sup></>,
    productName: <>V<sup>3+</sup></>,
    reactantCoeff: 1,
    productCoeff: 1,
    osBefore: '+4',
    osAfter: '+3',
    electronCount: 1,
    electronSide: 'LHS',
    hPlusCount: 2,
    hPlusSide: 'LHS',
    waterCount: 1,
    waterSide: 'RHS',
    fullEqJSX: (
      <>
        VO<sup>2+</sup> + 2H<sup>+</sup> + e<sup>-</sup> &rarr; V<sup>3+</sup> + H<sub>2</sub>O
      </>
    )
  },
  {
    id: 'thiosulfate',
    name: 'Thiosulfate Oxidation to Tetrathionate',
    context: 'Iodine-thiosulfate redox titration in quantitative chemical analysis.',
    elementSymbol: 'S',
    elementName: 'Sulfur',
    reactantName: <>S<sub>2</sub>O<sub>3</sub><sup>2-</sup></>,
    productName: <>S<sub>4</sub>O<sub>6</sub><sup>2-</sup></>,
    reactantCoeff: 2,
    productCoeff: 1,
    osBefore: '4@+2',
    osAfter: '4@+2.5',
    electronCount: 2,
    electronSide: 'RHS',
    hPlusCount: 0,
    hPlusSide: 'NONE',
    waterCount: 0,
    waterSide: 'NONE',
    fullEqJSX: (
      <>
        2S<sub>2</sub>O<sub>3</sub><sup>2-</sup> &rarr; S<sub>4</sub>O<sub>6</sub><sup>2-</sup> + 2e<sup>-</sup>
      </>
    )
  },
  {
    id: 'chlorate',
    name: 'Chlorate(I) / Hypochlorite Reduction',
    context: 'Reaction of bleach (ClO⁻) in acidic solution.',
    elementSymbol: 'Cl',
    elementName: 'Chlorine',
    reactantName: <>ClO<sup>-</sup></>,
    productName: <>Cl<sup>-</sup></>,
    reactantCoeff: 1,
    productCoeff: 1,
    osBefore: '+1',
    osAfter: '-1',
    electronCount: 2,
    electronSide: 'LHS',
    hPlusCount: 2,
    hPlusSide: 'LHS',
    waterCount: 1,
    waterSide: 'RHS',
    fullEqJSX: (
      <>
        ClO<sup>-</sup> + 2H<sup>+</sup> + 2e<sup>-</sup> &rarr; Cl<sup>-</sup> + H<sub>2</sub>O
      </>
    )
  },
  {
    id: 'hydrogenPeroxide',
    name: 'Hydrogen Peroxide Oxidation',
    context: 'H₂O₂ acting as a reducing agent in acidified redox reactions.',
    elementSymbol: 'O',
    elementName: 'Oxygen',
    reactantName: <>H<sub>2</sub>O<sub>2</sub></>,
    productName: <>O<sub>2</sub></>,
    reactantCoeff: 1,
    productCoeff: 1,
    osBefore: '2@-1',
    osAfter: '2@0',
    electronCount: 2,
    electronSide: 'RHS',
    hPlusCount: 2,
    hPlusSide: 'RHS',
    waterCount: 0,
    waterSide: 'NONE',
    fullEqJSX: (
      <>
        H<sub>2</sub>O<sub>2</sub> &rarr; O<sub>2</sub> + 2H<sup>+</sup> + 2e<sup>-</sup>
      </>
    )
  },
  {
    id: 'ethanedioate',
    name: 'Ethanedioate (Oxalate) Oxidation',
    context: 'Warm acidified potassium manganate(VII) titration with ethanedioic acid.',
    elementSymbol: 'C',
    elementName: 'Carbon',
    reactantName: <>C<sub>2</sub>O<sub>4</sub><sup>2-</sup></>,
    productName: <>CO<sub>2</sub></>,
    reactantCoeff: 1,
    productCoeff: 2,
    osBefore: '2@+3',
    osAfter: '2@+4',
    electronCount: 2,
    electronSide: 'RHS',
    hPlusCount: 0,
    hPlusSide: 'NONE',
    waterCount: 0,
    waterSide: 'NONE',
    fullEqJSX: (
      <>
        C<sub>2</sub>O<sub>4</sub><sup>2-</sup> &rarr; 2CO<sub>2</sub> + 2e<sup>-</sup>
      </>
    )
  }
];
