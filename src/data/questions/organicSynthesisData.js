// Curated data for WJEC Unit 4.7 Organic Synthesis Pathways & Reagents Map

export const SYNTHESIS_ROUTES = [
  {
    id: 'chain-ext-amine',
    category: 'aliphatic',
    unitRef: 'Unit 4.7 / 4.2',
    title: '1. Carbon-Chain Extension to a Primary Amine',
    start: { formula: 'CH₃CH₂Br', name: 'Bromoethane (2C)' },
    target: { formula: 'CH₃CH₂CH₂NH₂', name: 'Propylamine (3C)' },
    prompt:
      'Design a two-step laboratory synthesis to convert bromoethane into propylamine. Notice that the carbon chain increases from 2 to 3 carbons.',
    hint: 'To add exactly one carbon atom from a halogenoalkane, introduce a nitrile group first using ethanolic aqueous cyanide, then reduce the –C≡N triple bond cleanly to –CH₂NH₂.',
    step1: {
      reactionType: 'Nucleophilic substitution (chain extension)',
      options: [
        {
          id: 'kcn_aq_eth',
          label: 'KCN in aqueous ethanol, heat under reflux',
        },
        {
          id: 'nh3_alc',
          label: 'Excess concentrated NH₃ in ethanol, sealed tube',
          trapFeedback: 'Heating bromoethane with ammonia forms ethylamine (2 carbons), keeping the chain length unchanged.',
        },
        {
          id: 'naoh_aq',
          label: 'Warm aqueous NaOH(aq) under reflux',
          trapFeedback: 'Aqueous NaOH produces ethanol (still 2 carbons) and does not introduce nitrogen or extend the carbon skeleton.',
        },
      ],
      correctId: 'kcn_aq_eth',
    },
    intermediate: {
      options: [
        {
          id: 'propanenitrile',
          formula: 'CH₃CH₂CN',
          label: 'Propanenitrile (CH₃CH₂CN)',
        },
        {
          id: 'ethylamine',
          formula: 'CH₃CH₂NH₂',
          label: 'Ethylamine (CH₃CH₂NH₂)',
          trapFeedback: 'Ethylamine contains only 2 carbon atoms.',
        },
        {
          id: 'ethene',
          formula: 'CH₂=CH₂',
          label: 'Ethene (CH₂=CH₂)',
          trapFeedback: 'Elimination does not add a carbon atom or lead cleanly to propylamine in one step.',
        },
      ],
      correctId: 'propanenitrile',
    },
    step2: {
      reactionType: 'Reduction of nitrile',
      options: [
        {
          id: 'lialh4_ni',
          label: 'LiAlH₄ in dry ether (or H₂ with Ni catalyst, heat)',
        },
        {
          id: 'hcl_reflux',
          label: 'Dilute HCl(aq), heat under reflux',
          trapFeedback: 'Acidic hydrolysis of a nitrile converts –CN to a carboxylic acid (propanoic acid), not an amine.',
        },
        {
          id: 'k2cr2o7',
          label: 'Acidified K₂Cr₂O₇ under reflux',
          trapFeedback: 'Acidified dichromate is an oxidising agent; nitriles require reduction to reach a primary amine.',
        },
      ],
      correctId: 'lialh4_ni',
    },
    markScheme: [
      'Step 1: CH₃CH₂Br + KCN (in aqueous ethanol, heat under reflux) → CH₃CH₂CN + KBr (nucleophilic substitution extending chain to 3C).',
      'Step 2: Reduce CH₃CH₂CN using LiAlH₄ in dry ether (or H₂/Ni catalyst, heat) → CH₃CH₂CH₂NH₂.',
    ],
    examinerPitfall:
      'Always state the solvent/condition for KCN (aqueous ethanol, heat under reflux) and use a strong reducing agent like LiAlH₄ in dry ether (NaBH₄ is too mild to reduce nitriles).',
  },
  {
    id: 'chain-ext-acid',
    category: 'aliphatic',
    unitRef: 'Unit 4.7 / 4.4',
    title: '2. Halogenoalkane to Carboxylic Acid (+1 Carbon)',
    start: { formula: 'CH₃CH₂Cl', name: 'Chloroethane (2C)' },
    target: { formula: 'CH₃CH₂COOH', name: 'Propanoic acid (3C)' },
    prompt:
      'Convert chloroethane into propanoic acid in two steps without losing the carbon yield through combustion or Grignard air sensitivity.',
    hint: 'Extend the 2-carbon chain to a 3-carbon intermediate first, then hydrolyse that nitrogen-containing functional group under acidic conditions to isolate the free carboxylic acid.',
    step1: {
      reactionType: 'Nucleophilic substitution',
      options: [
        {
          id: 'naoh_aq',
          label: 'Warm aqueous NaOH(aq) under reflux',
          trapFeedback: 'Hydrolysing chloroethane to ethanol leaves only 2 carbons (oxidising ethanol gives ethanoic acid, not propanoic acid).',
        },
        {
          id: 'kcn_reflux',
          label: 'KCN in aqueous ethanol, heat under reflux',
        },
        {
          id: 'koh_eth',
          label: 'Hot ethanolic KOH under reflux',
          trapFeedback: 'Ethanolic KOH promotes elimination to ethene rather than carbon-chain extension.',
        },
      ],
      correctId: 'kcn_reflux',
    },
    intermediate: {
      options: [
        {
          id: 'propanenitrile',
          formula: 'CH₃CH₂CN',
          label: 'Propanenitrile (CH₃CH₂CN)',
        },
        {
          id: 'ethanol',
          formula: 'CH₃CH₂OH',
          label: 'Ethanol (CH₃CH₂OH)',
          trapFeedback: 'Ethanol only has 2 carbon atoms.',
        },
        {
          id: 'propanal',
          formula: 'CH₃CH₂CHO',
          label: 'Propanal (CH₃CH₂CHO)',
          trapFeedback: 'Propanal is not formed directly in a single halogenoalkane substitution step.',
        },
      ],
      correctId: 'propanenitrile',
    },
    step2: {
      reactionType: 'Acidic hydrolysis of nitrile',
      options: [
        {
          id: 'dil_hcl_reflux',
          label: 'Dilute HCl(aq) (or dilute H₂SO₄(aq)), heat under reflux',
        },
        {
          id: 'naoh_aq_only',
          label: 'Aqueous NaOH(aq) only (without subsequent acidification)',
          trapFeedback: 'Alkaline hydrolysis produces the sodium carboxylate salt (CH₃CH₂COO⁻Na⁺) and NH₃ rather than the free carboxylic acid.',
        },
        {
          id: 'h2_ni',
          label: 'H₂ with Ni catalyst, heat',
          trapFeedback: 'H₂/Ni reduces a nitrile to propylamine instead of hydrolysing it to propanoic acid.',
        },
      ],
      correctId: 'dil_hcl_reflux',
    },
    markScheme: [
      'Step 1: CH₃CH₂Cl + CN⁻ → CH₃CH₂CN + Cl⁻ using KCN in aqueous ethanol under reflux.',
      'Step 2: CH₃CH₂CN + 2H₂O + HCl → CH₃CH₂COOH + NH₄Cl using dilute HCl(aq) heated under reflux.',
    ],
    examinerPitfall:
      'If you write alkaline hydrolysis (NaOH(aq)), you MUST add an acidifying step (excess H⁺) to obtain CH₃CH₂COOH instead of the carboxylate ion CH₃CH₂COO⁻.',
  },
  {
    id: 'lactic-acid',
    category: 'aliphatic',
    unitRef: 'Unit 4.3 / 4.4',
    title: '3. Aldehyde to 2-Hydroxycarboxylic Acid (Lactic Acid)',
    start: { formula: 'CH₃CHO', name: 'Ethanal' },
    target: { formula: 'CH₃CH(OH)COOH', name: '2-Hydroxypropanoic acid' },
    prompt:
      'Synthesise racemic 2-hydroxypropanoic acid (lactic acid) from ethanal across two stages, forming a new C–C bond onto the carbonyl carbon.',
    hint: 'Perform nucleophilic addition on the carbonyl group first to introduce both –OH and –CN on the same carbon, then hydrolyse the nitrile.',
    step1: {
      reactionType: 'Nucleophilic addition',
      options: [
        {
          id: 'hcn_kcn',
          label: 'HCN with KCN catalyst (or NaCN + dilute H₂SO₄)',
        },
        {
          id: 'nabh4',
          label: 'NaBH₄ in aqueous ethanol',
          trapFeedback: 'NaBH₄ reduces ethanal straight to ethanol without extending the chain.',
        },
        {
          id: 'k2cr2o7_acid',
          label: 'Acidified K₂Cr₂O₇, heat under reflux',
          trapFeedback: 'Oxidation converts ethanal into ethanoic acid (2 carbons), not 2-hydroxypropanoic acid (3 carbons).',
        },
      ],
      correctId: 'hcn_kcn',
    },
    intermediate: {
      options: [
        {
          id: 'hydroxynitrile',
          formula: 'CH₃CH(OH)CN',
          label: '2-Hydroxypropanenitrile (CH₃CH(OH)CN)',
        },
        {
          id: 'ethanoic_acid',
          formula: 'CH₃COOH',
          label: 'Ethanoic acid (CH₃COOH)',
          trapFeedback: 'Ethanoic acid lacks both the extra carbon and the α-hydroxyl group.',
        },
        {
          id: 'propan_2_ol',
          formula: 'CH₃CH(OH)CH₃',
          label: 'Propan-2-ol (CH₃CH(OH)CH₃)',
          trapFeedback: 'Cyanide addition attaches –CN, not a methyl group.',
        },
      ],
      correctId: 'hydroxynitrile',
    },
    step2: {
      reactionType: 'Acid hydrolysis',
      options: [
        {
          id: 'dil_hcl_heat',
          label: 'Dilute HCl(aq), heat under reflux',
        },
        {
          id: 'lialh4_dry',
          label: 'LiAlH₄ in dry ether',
          trapFeedback: 'Reduction of the hydroxynitrile yields 1-amino-2-propanol (CH₃CH(OH)CH₂NH₂), not the carboxylic acid.',
        },
        {
          id: 'pcl5',
          label: 'PCl₅ at room temperature',
          trapFeedback: 'PCl₅ swaps –OH for –Cl and does not convert –CN into –COOH.',
        },
      ],
      correctId: 'dil_hcl_heat',
    },
    markScheme: [
      'Step 1: Nucleophilic addition of HCN (KCN / H⁺) to planar ethanal gives racemic 2-hydroxypropanenitrile, CH₃CH(OH)CN.',
      'Step 2: Acid hydrolysis with dilute HCl(aq) heated under reflux converts –CN into –COOH, giving 2-hydroxypropanoic acid.',
    ],
    examinerPitfall:
      'Because planar CH₃CHO is attacked equally from either side by :CN⁻, this WJEC Unit 4.1 + 4.3 synoptic route produces an optically inactive racemic mixture.',
  },
  {
    id: 'benzene-to-phenylamine',
    category: 'aromatic',
    unitRef: 'Unit 4.2',
    title: '4. Benzene to Phenylamine (Aniline)',
    start: { formula: 'C₆H₆', name: 'Benzene' },
    target: { formula: 'C₆H₅NH₂', name: 'Phenylamine' },
    prompt:
      'Prepare phenylamine directly from benzene via a two-step aromatic synthesis. Pay close attention to temperature control and basic work-up.',
    hint: 'Direct amination of benzene does not occur easily; nitrate the aromatic ring first below 55 °C, then reduce the –NO₂ group using tin and concentrated acid before liberating the free base.',
    step1: {
      reactionType: 'Electrophilic aromatic substitution (nitration)',
      options: [
        {
          id: 'nitration_55',
          label: 'Conc. HNO₃ + conc. H₂SO₄ at 50–55 °C',
        },
        {
          id: 'nh3_alcl3',
          label: 'NH₃ + anhydrous AlCl₃ catalyst',
          trapFeedback: 'NH₃ does not act as an electrophile towards benzene.',
        },
        {
          id: 'nitration_100',
          label: 'Boiling conc. HNO₃ at 120 °C without cooling',
          trapFeedback: 'Exceeding 55–60 °C promotes unwanted further nitration to 1,3-dinitrobenzene.',
        },
      ],
      correctId: 'nitration_55',
    },
    intermediate: {
      options: [
        {
          id: 'nitrobenzene',
          formula: 'C₆H₅NO₂',
          label: 'Nitrobenzene (C₆H₅NO₂)',
        },
        {
          id: 'chlorobenzene',
          formula: 'C₆H₅Cl',
          label: 'Chlorobenzene (C₆H₅Cl)',
          trapFeedback: 'Chlorobenzene cannot easily undergo nucleophilic substitution with NH₃ under mild conditions.',
        },
        {
          id: 'diazonium',
          formula: 'C₆H₅N₂⁺ Cl⁻',
          label: 'Benzenediazonium chloride',
          trapFeedback: 'Diazonium salts are made from phenylamine, not directly from benzene.',
        },
      ],
      correctId: 'nitrobenzene',
    },
    step2: {
      reactionType: 'Reduction (+ acid–base liberation)',
      options: [
        {
          id: 'sn_conc_hcl_naoh',
          label: 'Tin (Sn) + conc. HCl, heat under reflux, then add NaOH(aq)',
        },
        {
          id: 'nabh4_aq',
          label: 'NaBH₄ in aqueous ethanol at room temperature',
          trapFeedback: 'NaBH₄ is not strong enough to reduce aromatic nitro groups.',
        },
        {
          id: 'sn_conc_hcl_only',
          label: 'Sn + conc. HCl only (stopping without alkali addition)',
          trapFeedback: 'In excess concentrated HCl, basic phenylamine stays trapped as phenylammonium chloride salt (C₆H₅NH₃⁺Cl⁻).',
        },
      ],
      correctId: 'sn_conc_hcl_naoh',
    },
    markScheme: [
      'Step 1: Conc. HNO₃ + conc. H₂SO₄ kept at 50–55 °C → nitrobenzene (C₆H₅NO₂) via NO₂⁺ electrophile.',
      'Step 2: Heat with Sn + conc. HCl under reflux (forms C₆H₅NH₃⁺), then neutralise with NaOH(aq) to liberate free C₆H₅NH₂.',
    ],
    examinerPitfall:
      'WJEC mark schemes routinely penalise omitting NaOH(aq) after Sn/conc. HCl reduction, because the acidic mixture yields the protonated salt rather than free phenylamine.',
  },
  {
    id: 'phenylamine-to-azo',
    category: 'aromatic',
    unitRef: 'Unit 4.2',
    title: '5. Phenylamine to an Azo Dye (Diazotisation & Coupling)',
    start: { formula: 'C₆H₅NH₂', name: 'Phenylamine' },
    target: { formula: 'C₆H₅–N=N–C₆H₄OH', name: '4-Hydroxyphenylazobenzene' },
    prompt:
      'Synthesise a brightly coloured yellow-orange azo dye starting from phenylamine. Temperature discipline below 5–10 °C is critical throughout.',
    hint: 'Convert phenylamine into an ice-cold diazonium salt first using nitrous acid made in situ, then couple it with an activated aromatic ring dissolved in aqueous alkali.',
    step1: {
      reactionType: 'Diazotisation',
      options: [
        {
          id: 'nano2_hcl_ice',
          label: 'NaNO₂ + conc. HCl(aq) in an ice bath (below 5 °C)',
        },
        {
          id: 'nano2_hcl_boil',
          label: 'NaNO₂ + HCl(aq) heated under reflux at 80 °C',
          trapFeedback: 'Above 10 °C the unstable diazonium ion rapidly hydrolyses with water to form phenol and N₂ gas.',
        },
        {
          id: 'hno3_h2so4',
          label: 'Conc. HNO₃ + conc. H₂SO₄ at 55 °C',
          trapFeedback: 'Nitrating mixture puts –NO₂ onto aromatic rings rather than diazotising an –NH₂ group.',
        },
      ],
      correctId: 'nano2_hcl_ice',
    },
    intermediate: {
      options: [
        {
          id: 'diazonium_salt',
          formula: 'C₆H₅N₂⁺ Cl⁻',
          label: 'Benzenediazonium chloride (C₆H₅N₂⁺ Cl⁻)',
        },
        {
          id: 'phenol',
          formula: 'C₆H₅OH',
          label: 'Phenol (C₆H₅OH)',
          trapFeedback: 'Phenol forms only if the diazonium salt is warmed and decomposes.',
        },
        {
          id: 'phenylammonium',
          formula: 'C₆H₅NH₃⁺ Cl⁻',
          label: 'Phenylammonium chloride',
          trapFeedback: 'Acid alone protonates amine without creating the –N≡N⁺ diazonium ion needed for coupling.',
        },
      ],
      correctId: 'diazonium_salt',
    },
    step2: {
      reactionType: 'Electrophilic aromatic coupling',
      options: [
        {
          id: 'phenol_naoh_cold',
          label: 'Phenol dissolved in cold NaOH(aq) (< 10 °C)',
        },
        {
          id: 'benzene_alcl3',
          label: 'Benzene + anhydrous AlCl₃ heated to 70 °C',
          trapFeedback: 'Benzenediazonium is a weak electrophile that needs a strongly activated ring (phenoxide in alkali), and heating decomposes it.',
        },
        {
          id: 'conc_h2so4_only',
          label: 'Phenol in concentrated H₂SO₄',
          trapFeedback: 'Phenoxide ion (C₆H₅O⁻) formed in alkaline NaOH(aq) is required for rapid electrophilic coupling.',
        },
      ],
      correctId: 'phenol_naoh_cold',
    },
    markScheme: [
      'Step 1: Diazotise phenylamine using NaNO₂ and HCl(aq) kept below 5 °C (HNO₂ formed in situ) to give benzenediazonium chloride.',
      'Step 2: Couple the chilled diazonium solution (< 10 °C) with phenol dissolved in NaOH(aq) (sodium phenoxide) → bright azo dye.',
    ],
    examinerPitfall:
      'Explain clearly why the reaction is kept below 5–10 °C: above 10 °C, C₆H₅N₂⁺ decomposes into phenol + N₂(g). Also remember phenol is dissolved in NaOH(aq), not acid.',
  },
  {
    id: 'benzene-to-phenylethanol',
    category: 'aromatic',
    unitRef: 'Unit 4.2 / 4.3',
    title: '6. Benzene to 1-Phenylethanol (Friedel–Crafts & Reduction)',
    start: { formula: 'C₆H₆', name: 'Benzene' },
    target: { formula: 'C₆H₅CH(OH)CH₃', name: '1-Phenylethanol' },
    prompt:
      'Construct a C–C side chain on benzene and convert it into the secondary alcohol 1-phenylethanol in two steps.',
    hint: 'Acylate the benzene ring using an acyl chloride and Lewis acid catalyst to make an aromatic ketone first, then reduce the C=O bond cleanly.',
    step1: {
      reactionType: 'Friedel–Crafts acylation (electrophilic substitution)',
      options: [
        {
          id: 'ch3cocl_alcl3',
          label: 'CH₃COCl (ethanoyl chloride) + anhydrous AlCl₃ catalyst, heat under reflux',
        },
        {
          id: 'ch3ch2oh_h2so4',
          label: 'Ethanol + conc. H₂SO₄ at 170 °C',
          trapFeedback: 'Ethanol does not undergo Friedel–Crafts alkylation smoothly under dehydration conditions.',
        },
        {
          id: 'ch3cho_hcl',
          label: 'Ethanal + dilute HCl(aq)',
          trapFeedback: 'Aldehydes do not directly acylate benzene under simple dilute acid.',
        },
      ],
      correctId: 'ch3cocl_alcl3',
    },
    intermediate: {
      options: [
        {
          id: 'phenylethanone',
          formula: 'C₆H₅COCH₃',
          label: 'Phenylethanone (C₆H₅COCH₃)',
        },
        {
          id: 'ethylbenzene',
          formula: 'C₆H₅CH₂CH₃',
          label: 'Ethylbenzene (C₆H₅CH₂CH₃)',
          trapFeedback: 'Ethylbenzene has no oxygen atom on the side chain for mild reduction to an alcohol.',
        },
        {
          id: 'benzoic_acid',
          formula: 'C₆H₅COOH',
          label: 'Benzoic acid (C₆H₅COOH)',
          trapFeedback: 'Benzoic acid only adds 1 carbon to the ring and cannot be reduced to 1-phenylethanol in 2 carbons.',
        },
      ],
      correctId: 'phenylethanone',
    },
    step2: {
      reactionType: 'Nucleophilic addition (carbonyl reduction)',
      options: [
        {
          id: 'nabh4_etoh',
          label: 'NaBH₄ in aqueous ethanol (or LiAlH₄ in dry ether)',
        },
        {
          id: 'k2cr2o7_acid',
          label: 'Acidified K₂Cr₂O₇, heat under reflux',
          trapFeedback: 'Ketones resist further mild oxidation and cannot be turned into alcohols by an oxidising agent.',
        },
        {
          id: 'sn_hcl',
          label: 'Sn + conc. HCl under reflux',
          trapFeedback: 'Sn/conc. HCl is used for nitro-to-amine reductions, not standard ketone-to-alcohol synthesis.',
        },
      ],
      correctId: 'nabh4_etoh',
    },
    markScheme: [
      'Step 1: CH₃COCl + anhydrous AlCl₃ (heat under reflux) attaches –COCH₃ via electrophilic substitution → phenylethanone.',
      'Step 2: Reduce phenylethanone with NaBH₄ in aqueous ethanol (nucleophilic addition by :H⁻) → 1-phenylethanol.',
    ],
    examinerPitfall:
      'State “anhydrous AlCl₃” — water destroys the AlCl₃ catalyst (hydrolysis releasing HCl steamy fumes) and hydrolyses ethanoyl chloride.',
  },
  {
    id: 'alkene-to-ketone',
    category: 'aliphatic',
    unitRef: 'Unit 2.5 / 2.6',
    title: '7. Propene to Propanone (Alkene Hydration & Oxidation)',
    start: { formula: 'CH₃CH=CH₂', name: 'Propene' },
    target: { formula: 'CH₃COCH₃', name: 'Propanone' },
    prompt:
      'Plan a two-step aliphatic synthesis turning propene into propanone. Think carefully about which alcohol regioisomer predominates first.',
    hint: 'Hydrating propene under acid catalysis places the –OH group onto the central carbon (major Markovnikov alcohol), which oxidises straight to a ketone.',
    step1: {
      reactionType: 'Electrophilic addition (hydration)',
      options: [
        {
          id: 'steam_h3po4',
          label: 'Steam + H₃PO₄ catalyst (300 °C, 60 atm) — or cold conc. H₂SO₄ then warm H₂O',
        },
        {
          id: 'br2_rt',
          label: 'Br₂ in the dark at room temperature',
          trapFeedback: 'Br₂ forms 1,2-dibromopropane rather than a single alcohol ready to oxidise to propanone.',
        },
        {
          id: 'h2_ni_150',
          label: 'H₂ + Ni catalyst at 150 °C',
          trapFeedback: 'Hydrogenation converts propene into unreactive propane.',
        },
      ],
      correctId: 'steam_h3po4',
    },
    intermediate: {
      options: [
        {
          id: 'propan_2_ol',
          formula: 'CH₃CH(OH)CH₃',
          label: 'Propan-2-ol (CH₃CH(OH)CH₃)',
        },
        {
          id: 'propan_1_ol',
          formula: 'CH₃CH₂CH₂OH',
          label: 'Propan-1-ol (CH₃CH₂CH₂OH)',
          trapFeedback: 'Propan-1-ol is a minor product; when oxidised it gives propanal / propanoic acid, not propanone.',
        },
        {
          id: 'propanal',
          formula: 'CH₃CH₂CHO',
          label: 'Propanal (CH₃CH₂CHO)',
          trapFeedback: 'Hydrating an alkene produces an alcohol, not an aldehyde directly.',
        },
      ],
      correctId: 'propan_2_ol',
    },
    step2: {
      reactionType: 'Oxidation of secondary alcohol',
      options: [
        {
          id: 'k2cr2o7_reflux',
          label: 'Acidified K₂Cr₂O₇ (dilute H₂SO₄), heat under reflux',
        },
        {
          id: 'nabh4_aq',
          label: 'NaBH₄ in aqueous ethanol',
          trapFeedback: 'NaBH₄ reduces ketones to alcohols — the reverse of this oxidation step.',
        },
        {
          id: 'conc_h2so4_170',
          label: 'Excess conc. H₂SO₄ at 170 °C',
          trapFeedback: 'Dehydrates propan-2-ol straight back into propene.',
        },
      ],
      correctId: 'k2cr2o7_reflux',
    },
    markScheme: [
      'Step 1: Hydrate propene (H₂O(g) / H₃PO₄ catalyst) via the more stable secondary carbocation → propan-2-ol (major product).',
      'Step 2: Oxidise propan-2-ol with acidified K₂Cr₂O₇ heated under reflux → propanone (orange Cr₂O₇²⁻ turns green Cr³⁺).',
    ],
    examinerPitfall:
      'Ketones cannot be oxidised further by acidified K₂Cr₂O₇, so refluxing propan-2-ol gives propanone cleanly without risking over-oxidation.',
  },
  {
    id: 'halo-to-aldehyde',
    category: 'aliphatic',
    unitRef: 'Unit 2.6',
    title: '8. Bromoethane to Ethanal (Controlled Oxidation)',
    start: { formula: 'CH₃CH₂Br', name: 'Bromoethane' },
    target: { formula: 'CH₃CHO', name: 'Ethanal' },
    prompt:
      'Convert bromoethane into pure ethanal (not ethanoic acid). Both the choice of solvent in Step 1 and the glassware technique in Step 2 matter.',
    hint: 'Choose aqueous alkali first rather than ethanolic alkali, then control Step 2 oxidation so ethanal boils out before it can oxidise further.',
    step1: {
      reactionType: 'Nucleophilic substitution',
      options: [
        {
          id: 'aq_naoh_reflux',
          label: 'Warm aqueous NaOH(aq) / KOH(aq) under reflux',
        },
        {
          id: 'eth_koh_reflux',
          label: 'Hot ethanolic KOH under reflux',
          trapFeedback: 'Ethanolic KOH promotes elimination to ethene instead of nucleophilic substitution to ethanol.',
        },
        {
          id: 'kcn_eth',
          label: 'KCN in aqueous ethanol under reflux',
          trapFeedback: 'KCN adds a 3rd carbon (forming propanenitrile) instead of keeping 2 carbons for ethanal.',
        },
      ],
      correctId: 'aq_naoh_reflux',
    },
    intermediate: {
      options: [
        {
          id: 'ethanol',
          formula: 'CH₃CH₂OH',
          label: 'Ethanol (CH₃CH₂OH)',
        },
        {
          id: 'ethene',
          formula: 'CH₂=CH₂',
          label: 'Ethene (CH₂=CH₂)',
          trapFeedback: 'Ethene comes from elimination and cannot be oxidised cleanly to ethanal in 1 laboratory step.',
        },
        {
          id: 'ethanoic_acid',
          formula: 'CH₃COOH',
          label: 'Ethanoic acid (CH₃COOH)',
          trapFeedback: 'Carboxylic acids are not formed by aqueous NaOH substitution; moreover ethanal requires milder oxidation than ethanoic acid.',
        },
      ],
      correctId: 'ethanol',
    },
    step2: {
      reactionType: 'Partial oxidation (with immediate distillation)',
      options: [
        {
          id: 'k2cr2o7_distil',
          label: 'Acidified K₂Cr₂O₇ (excess ethanol), warm gently and distil off ethanal immediately',
        },
        {
          id: 'k2cr2o7_excess_reflux',
          label: 'Excess acidified K₂Cr₂O₇ heated under reflux for 30 minutes',
          trapFeedback: 'Heating under reflux with excess dichromate oxidises the intermediate aldehyde all the way to ethanoic acid.',
        },
        {
          id: 'fehlings_heat',
          label: 'Warm with Fehling’s solution',
          trapFeedback: 'Fehling’s oxidises aldehydes to acids — it does not oxidise primary alcohols into aldehydes.',
        },
      ],
      correctId: 'k2cr2o7_distil',
    },
    markScheme: [
      'Step 1: Warm CH₃CH₂Br with aqueous NaOH(aq) under reflux → ethanol (CH₃CH₂OH).',
      'Step 2: Warm ethanol gently with acidified K₂Cr₂O₇ and immediately distil off ethanal (boiling point 21 °C) to prevent over-oxidation to ethanoic acid.',
    ],
    examinerPitfall:
      'Always distinguish aqueous NaOH (substitution → alcohol) from ethanolic KOH (elimination → alkene), and distillation (aldehyde) from reflux (carboxylic acid).',
  },
  {
    id: 'acid-to-amide',
    category: 'aliphatic',
    unitRef: 'Unit 4.4',
    title: '9. Ethanoic Acid to Ethanamide (Acyl Chloride Route)',
    start: { formula: 'CH₃COOH', name: 'Ethanoic acid' },
    target: { formula: 'CH₃CONH₂', name: 'Ethanamide' },
    prompt:
      'Mixing ethanoic acid directly with cold ammonia merely triggers an acid–base neutralisation salt (CH₃COO⁻NH₄⁺). Route around this via a much more reactive acyl intermediate.',
    hint: 'Convert the –OH of ethanoic acid into a good –Cl leaving group first at room temperature using a chlorinating agent, then treat with excess ammonia.',
    step1: {
      reactionType: 'Chlorination of carboxylic acid',
      options: [
        {
          id: 'socl2_pcl5',
          label: 'SOCl₂ (or PCl₅) at room temperature (anhydrous conditions)',
        },
        {
          id: 'cl2_uv',
          label: 'Cl₂ gas under UV light',
          trapFeedback: 'UV free-radical substitution attacks the CH₃ alkyl group (forming ClCH₂COOH), not the –COOH hydroxyl.',
        },
        {
          id: 'conc_hcl',
          label: 'Concentrated HCl(aq) under reflux',
          trapFeedback: 'HCl cannot displace –OH from a carboxylic acid to yield an acyl chloride.',
        },
      ],
      correctId: 'socl2_pcl5',
    },
    intermediate: {
      options: [
        {
          id: 'ethanoyl_chloride',
          formula: 'CH₃COCl',
          label: 'Ethanoyl chloride (CH₃COCl)',
        },
        {
          id: 'chloroethanoic_acid',
          formula: 'ClCH₂COOH',
          label: 'Chloroethanoic acid (ClCH₂COOH)',
          trapFeedback: 'ClCH₂COOH leaves the carboxylic acid hydroxyl unchanged.',
        },
        {
          id: 'ethyl_ethanoate',
          formula: 'CH₃COOCH₂CH₃',
          label: 'Ethyl ethanoate (CH₃COOCH₂CH₃)',
          trapFeedback: 'No alcohol was introduced to form an ester.',
        },
      ],
      correctId: 'ethanoyl_chloride',
    },
    step2: {
      reactionType: 'Addition–elimination with ammonia',
      options: [
        {
          id: 'excess_nh3',
          label: 'Concentrated NH₃(aq) or excess NH₃(g) at room temperature',
        },
        {
          id: 'nano2_hcl',
          label: 'NaNO₂ + HCl below 5 °C',
          trapFeedback: 'Nitrous acid diazotises amines; it does not react with acyl chlorides to yield amides.',
        },
        {
          id: 'kcn_aq',
          label: 'Aqueous KCN under reflux',
          trapFeedback: 'Cyanide would hydrolyse acyl chloride in water and does not yield an amide.',
        },
      ],
      correctId: 'excess_nh3',
    },
    markScheme: [
      'Step 1: CH₃COOH + SOCl₂ → CH₃COCl + SO₂ + HCl (or with PCl₅ → CH₃COCl + POCl₃ + HCl).',
      'Step 2: CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl (rapid room-temperature addition–elimination; second mole of NH₃ neutralises HCl).',
    ],
    examinerPitfall:
      'Remember the 2:1 stoichiometry with ammonia: one NH₃ forms the amide, and the second NH₃ neutralises the HCl co-product into white NH₄Cl fumes.',
  },
  {
    id: 'alcohol-to-bromo-shift',
    category: 'aliphatic',
    unitRef: 'Unit 2.5 / 2.6',
    title: '10. Functional Group Relocation: Propan-1-ol to 2-Bromopropane',
    start: { formula: 'CH₃CH₂CH₂OH', name: 'Propan-1-ol' },
    target: { formula: 'CH₃CH(Br)CH₃', name: '2-Bromopropane' },
    prompt:
      'Notice that reacting propan-1-ol directly with HBr/NaBr places Br on C-1 (1-bromopropane). Design a 2-step route that moves the substituent onto C-2 instead.',
    hint: 'Eliminate water first to introduce a C=C double bond across C1=C2, then add HBr so Markovnikov carbocation stability selectively places Br on the middle carbon.',
    step1: {
      reactionType: 'Acid-catalysed dehydration (elimination)',
      options: [
        {
          id: 'conc_h2so4_170',
          label: 'Excess conc. H₂SO₄ (or conc. H₃PO₄), heat (~170 °C) / Al₂O₃ heat',
        },
        {
          id: 'nabr_h2so4',
          label: 'NaBr + conc. H₂SO₄ under reflux',
          trapFeedback: 'Direct nucleophilic substitution of propan-1-ol gives 1-bromopropane, not 2-bromopropane.',
        },
        {
          id: 'k2cr2o7_distil',
          label: 'Acidified K₂Cr₂O₇ with immediate distillation',
          trapFeedback: 'Oxidation converts propan-1-ol to propanal rather than shifting a substituent onto C-2.',
        },
      ],
      correctId: 'conc_h2so4_170',
    },
    intermediate: {
      options: [
        {
          id: 'propene',
          formula: 'CH₃CH=CH₂',
          label: 'Propene (CH₃CH=CH₂)',
        },
        {
          id: 'bromopropane_1',
          formula: 'CH₃CH₂CH₂Br',
          label: '1-Bromopropane (CH₃CH₂CH₂Br)',
          trapFeedback: 'Substitution yields 1-bromopropane instead of giving access to C-2.',
        },
        {
          id: 'propanal_shift',
          formula: 'CH₃CH₂CHO',
          label: 'Propanal (CH₃CH₂CHO)',
          trapFeedback: 'Propanal offers no direct 1-step route to 2-bromopropane.',
        },
      ],
      correctId: 'propene',
    },
    step2: {
      reactionType: 'Electrophilic addition (Markovnikov)',
      options: [
        {
          id: 'hbr_rt',
          label: 'HBr(g) at room temperature',
        },
        {
          id: 'br2_dark',
          label: 'Br₂ in the dark at room temperature',
          trapFeedback: 'Br₂ gives 1,2-dibromopropane instead of 2-bromopropane.',
        },
        {
          id: 'br2_uv',
          label: 'Br₂ under UV light',
          trapFeedback: 'Free-radical substitution creates mixed bromoalkane isomers rather than clean Markovnikov addition.',
        },
      ],
      correctId: 'hbr_rt',
    },
    markScheme: [
      'Step 1: Dehydrate propan-1-ol using conc. H₂SO₄ / conc. H₃PO₄ heated (~170 °C) → propene (CH₃CH=CH₂) + H₂O.',
      'Step 2: Electrophilic addition of HBr(g) proceeds via the more stable secondary carbocation (CH₃C⁺HCH₃) → 2-bromopropane (major product).',
    ],
    examinerPitfall:
      'Whenever an exam asks you to move a substituent from C-1 to C-2 (e.g. propan-1-ol → propan-2-ol or 2-bromopropane), go via the alkene (dehydration → Markovnikov addition).',
  },
];

export const PATHWAY_MAPS = {
  aliphatic: [
    {
      id: 'alkene-alkane',
      from: 'Alkene (C=C)',
      to: 'Alkane (C–C)',
      reagent: 'H₂(g)',
      conditions: 'Ni catalyst, ~150 °C',
      reactionType: 'Catalytic hydrogenation (addition)',
      example: 'CH₂=CH₂ + H₂ → CH₃CH₃',
      tip: 'Industrial margarine hardening uses this addition reaction.',
    },
    {
      id: 'alkene-halo',
      from: 'Alkene (C=C)',
      to: 'Halogenoalkane (R–X)',
      reagent: 'HX(g) (e.g. HBr)',
      conditions: 'Room temperature',
      reactionType: 'Electrophilic addition',
      example: 'CH₃CH=CH₂ + HBr → CH₃CH(Br)CH₃ (major)',
      tip: 'Major product goes via the more stable secondary/tertiary carbocation.',
    },
    {
      id: 'alkene-alcohol',
      from: 'Alkene (C=C)',
      to: 'Alcohol (R–OH)',
      reagent: 'H₂O(g) (steam)',
      conditions: 'H₃PO₄ catalyst, 300 °C, 60 atm',
      reactionType: 'Electrophilic addition (hydration)',
      example: 'CH₂=CH₂ + H₂O → CH₃CH₂OH',
      tip: 'Or laboratory 2-step: cold conc. H₂SO₄ followed by warming with H₂O.',
    },
    {
      id: 'halo-alcohol',
      from: 'Halogenoalkane (R–X)',
      to: 'Alcohol (R–OH)',
      reagent: 'NaOH(aq) or KOH(aq)',
      conditions: 'Warm aqueous alkali, heat under reflux',
      reactionType: 'Nucleophilic substitution',
      example: 'CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻',
      tip: 'Must specify AQUEOUS alkali (ethanolic KOH causes elimination to an alkene).',
    },
    {
      id: 'halo-alkene',
      from: 'Halogenoalkane (R–X)',
      to: 'Alkene (C=C)',
      reagent: 'KOH in ethanol',
      conditions: 'Hot ethanolic alkali, heat under reflux',
      reactionType: 'Elimination',
      example: 'CH₃CH₂Br + OH⁻ → CH₂=CH₂ + H₂O + Br⁻',
      tip: 'OH⁻ acts as a base extracting H⁺ rather than a nucleophile.',
    },
    {
      id: 'halo-nitrile',
      from: 'Halogenoalkane (R–X)',
      to: 'Nitrile (+1 C, R–CN)',
      reagent: 'KCN or NaCN',
      conditions: 'Aqueous ethanol solvent, heat under reflux',
      reactionType: 'Nucleophilic substitution (chain extension)',
      example: 'CH₃CH₂Br + KCN → CH₃CH₂CN + KBr',
      tip: 'Key carbon-chain extension step (+1 carbon atom).',
    },
    {
      id: 'halo-amine',
      from: 'Halogenoalkane (R–X)',
      to: 'Primary amine (R–NH₂)',
      reagent: 'Excess NH₃ in ethanol',
      conditions: 'Heat in sealed pressure tube',
      reactionType: 'Nucleophilic substitution',
      example: 'CH₃CH₂Br + 2NH₃ → CH₃CH₂NH₂ + NH₄Br',
      tip: 'Excess NH₃ prevents further substitution into secondary/tertiary amines.',
    },
    {
      id: 'nitrile-amine',
      from: 'Nitrile (R–CN)',
      to: 'Primary amine (R–CH₂NH₂)',
      reagent: 'LiAlH₄ (or H₂ / Ni)',
      conditions: 'Dry ether (for LiAlH₄) or heat (Ni)',
      reactionType: 'Reduction',
      example: 'CH₃CH₂CN + 4[H] → CH₃CH₂CH₂NH₂',
      tip: 'NaBH₄ is NOT reactive enough to reduce –CN.',
    },
    {
      id: 'nitrile-acid',
      from: 'Nitrile / Hydroxynitrile',
      to: 'Carboxylic acid (–COOH)',
      reagent: 'Dilute HCl(aq) or H₂SO₄(aq)',
      conditions: 'Heat under reflux',
      reactionType: 'Acidic hydrolysis',
      example: 'CH₃CH₂CN + 2H₂O + H⁺ → CH₃CH₂COOH + NH₄⁺',
      tip: 'Forms the free acid directly (no separate acidification needed).',
    },
    {
      id: 'alcohol-alkene',
      from: 'Alcohol (R–OH)',
      to: 'Alkene (C=C)',
      reagent: 'Excess conc. H₂SO₄ or H₃PO₄',
      conditions: 'Heat (~170 °C) or Al₂O₃ catalyst',
      reactionType: 'Elimination (dehydration)',
      example: 'CH₃CH₂OH → CH₂=CH₂ + H₂O',
      tip: 'Allows C-1 → C-2 positional shifts when paired with Markovnikov HX addition.',
    },
    {
      id: 'pri-alcohol-ald',
      from: 'Primary alcohol',
      to: 'Aldehyde (R–CHO)',
      reagent: 'K₂Cr₂O₇ + dilute H₂SO₄',
      conditions: 'Excess alcohol, warm gently & distil immediately',
      reactionType: 'Partial oxidation',
      example: 'CH₃CH₂OH + [O] → CH₃CHO + H₂O',
      tip: 'Orange dichromate(VI) turns green Cr³⁺; distillation prevents further oxidation.',
    },
    {
      id: 'pri-alcohol-acid',
      from: 'Primary alcohol / Aldehyde',
      to: 'Carboxylic acid (R–COOH)',
      reagent: 'Excess K₂Cr₂O₇ + dilute H₂SO₄',
      conditions: 'Heat under vertical reflux',
      reactionType: 'Complete oxidation',
      example: 'CH₃CH₂OH + 2[O] → CH₃COOH + H₂O',
      tip: 'Reflux returns evaporating aldehyde back into oxidising mixture.',
    },
    {
      id: 'sec-alcohol-ketone',
      from: 'Secondary alcohol',
      to: 'Ketone (RCOR′)',
      reagent: 'K₂Cr₂O₇ + dilute H₂SO₄',
      conditions: 'Heat under reflux',
      reactionType: 'Oxidation',
      example: 'CH₃CH(OH)CH₃ + [O] → CH₃COCH₃ + H₂O',
      tip: 'Ketones do not oxidise further with acidified dichromate.',
    },
    {
      id: 'carbonyl-hcn',
      from: 'Aldehyde / Ketone (C=O)',
      to: 'Hydroxynitrile (–CH(OH)CN)',
      reagent: 'HCN + KCN catalyst (or NaCN / H⁺)',
      conditions: 'Room temperature',
      reactionType: 'Nucleophilic addition',
      example: 'CH₃CHO + HCN → CH₃CH(OH)CN',
      tip: 'Planar carbonyl attack gives a racemic mixture if 4 different groups form.',
    },
    {
      id: 'carbonyl-alcohol',
      from: 'Aldehyde / Ketone (C=O)',
      to: 'Primary / Secondary alcohol',
      reagent: 'NaBH₄',
      conditions: 'Aqueous ethanol, warm / room temperature',
      reactionType: 'Nucleophilic addition (reduction)',
      example: 'CH₃COCH₃ + 2[H] → CH₃CH(OH)CH₃',
      tip: 'Provides hydride :H⁻ nucleophile without damaging C=C bonds.',
    },
    {
      id: 'acid-acyl',
      from: 'Carboxylic acid (R–COOH)',
      to: 'Acyl chloride (R–COCl)',
      reagent: 'SOCl₂ or PCl₅',
      conditions: 'Anhydrous, room temperature',
      reactionType: 'Chlorination',
      example: 'CH₃COOH + SOCl₂ → CH₃COCl + SO₂ + HCl',
      tip: 'Both SO₂ and HCl escape as gases when using SOCl₂.',
    },
    {
      id: 'acyl-ester-amide',
      from: 'Acyl chloride (R–COCl)',
      to: 'Ester or Amide',
      reagent: 'Alcohol (→ ester) or Excess NH₃ / Amine (→ amide)',
      conditions: 'Room temperature (vigorous, anhydrous)',
      reactionType: 'Addition–elimination',
      example: 'CH₃COCl + 2NH₃ → CH₃CONH₂ + NH₄Cl',
      tip: 'Reacts much faster and goes to completion vs equilibrium carboxylic acid esterification.',
    },
  ],
  aromatic: [
    {
      id: 'benz-nitro',
      from: 'Benzene (C₆H₆)',
      to: 'Nitrobenzene (C₆H₅NO₂)',
      reagent: 'Conc. HNO₃ + conc. H₂SO₄',
      conditions: '50–55 °C',
      reactionType: 'Electrophilic substitution (nitration)',
      example: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O',
      tip: 'H₂SO₄ acts as acid protonating HNO₃ to generate the NO₂⁺ electrophile.',
    },
    {
      id: 'nitro-phenylamine',
      from: 'Nitrobenzene (C₆H₅NO₂)',
      to: 'Phenylamine (C₆H₅NH₂)',
      reagent: 'Sn + conc. HCl, then NaOH(aq)',
      conditions: 'Heat under reflux, followed by alkali work-up',
      reactionType: 'Reduction',
      example: 'C₆H₅NO₂ + 6[H] → C₆H₅NH₂ + 2H₂O',
      tip: 'NaOH(aq) is essential to convert C₆H₅NH₃⁺ back into free C₆H₅NH₂.',
    },
    {
      id: 'phenylamine-diazo',
      from: 'Phenylamine (C₆H₅NH₂)',
      to: 'Benzenediazonium chloride (C₆H₅N₂⁺Cl⁻)',
      reagent: 'NaNO₂ + conc. HCl(aq)',
      conditions: 'Ice bath (< 5 °C)',
      reactionType: 'Diazotisation',
      example: 'C₆H₅NH₂ + HNO₂ + HCl → C₆H₅N₂⁺Cl⁻ + 2H₂O',
      tip: 'Above 10 °C, C₆H₅N₂⁺ decomposes to phenol and nitrogen gas.',
    },
    {
      id: 'diazo-azo',
      from: 'C₆H₅N₂⁺Cl⁻ + Phenol',
      to: 'Azo dye (C₆H₅–N=N–C₆H₄OH)',
      reagent: 'Phenol in NaOH(aq)',
      conditions: 'Ice bath (< 10 °C)',
      reactionType: 'Electrophilic coupling',
      example: 'C₆H₅N₂⁺ + C₆H₅O⁻ → C₆H₅–N=N–C₆H₄O⁻ + H⁺',
      tip: 'Extended delocalisation across the –N=N– azo bridge creates intense colour.',
    },
    {
      id: 'benz-bromo',
      from: 'Benzene (C₆H₆)',
      to: 'Bromobenzene (C₆H₅Br)',
      reagent: 'Br₂ + anhydrous FeBr₃ (or Fe)',
      conditions: 'Room temperature / gentle warming',
      reactionType: 'Electrophilic substitution (halogenation)',
      example: 'C₆H₆ + Br₂ → C₆H₅Br + HBr',
      tip: 'Benzene needs a halogen carrier catalyst; phenol decolourises Br₂(aq) without any catalyst!',
    },
    {
      id: 'benz-acyl',
      from: 'Benzene (C₆H₆)',
      to: 'Phenylethanone (C₆H₅COCH₃)',
      reagent: 'CH₃COCl + anhydrous AlCl₃',
      conditions: 'Anhydrous, heat under reflux',
      reactionType: 'Friedel–Crafts acylation',
      example: 'C₆H₆ + CH₃COCl → C₆H₅COCH₃ + HCl',
      tip: 'AlCl₃ polarises CH₃COCl to form the acylium ion CH₃C⁺=O.',
    },
    {
      id: 'alkylbenz-acid',
      from: 'Methylbenzene (C₆H₅CH₃)',
      to: 'Benzoic acid (C₆H₅COOH)',
      reagent: 'Alkaline KMnO₄, then dilute H₂SO₄(aq)',
      conditions: 'Heat under reflux, then acidify',
      reactionType: 'Side-chain oxidation',
      example: 'C₆H₅CH₃ + 3[O] → C₆H₅COOH + H₂O',
      tip: 'Oxidises any unbranched alkylbenzene side chain down to –COOH.',
    },
  ],
};

export const PRACTICAL_TECHNIQUES = [
  {
    id: 'reflux-distil',
    title: 'Heating Under Reflux vs Distillation',
    badge: 'Reaction & Separation',
    points: [
      'Use vertical reflux (open top — NEVER sealed with a stopper!) with anti-bumping granules to boil reacting mixtures safely without losing volatile reactants.',
      'Use distillation (thermometer bulb level with sidearm, water entering bottom of Liebig condenser and exiting top) when separating a lower-boiling liquid (e.g. ethanal, 21 °C) before further reaction.',
    ],
  },
  {
    id: 'solvent-dry',
    title: 'Solvent Extraction & Drying Organic Layers',
    badge: 'Liquid Purification',
    points: [
      'Shake aqueous/organic mixtures in a separating funnel, invert and vent pressure regularly, then separate the desired layer cleanly.',
      'Swirl organic liquid with an anhydrous drying agent (e.g. anhydrous MgSO₄ or CaCl₂) until solid stops clumping and cloudy liquid turns clear, then filter off before redistilling.',
    ],
  },
  {
    id: 'recrystallisation',
    title: 'Recrystallisation of Crude Solids',
    badge: 'Solid Purification',
    points: [
      'Dissolve crude solid in the MINIMUM volume of hot suitable solvent (just enough to saturate at boiling point).',
      'Filter HOT quickly through a fluted filter funnel to remove insoluble solid impurities, then cool slowly in ice to crystallise.',
      'Filter crystals under reduced pressure (Buchner funnel), wash with a small amount of ice-cold solvent, and dry.',
    ],
  },
  {
    id: 'melting-point',
    title: 'Melting Point Purity Assessment',
    badge: 'Purity Verification',
    points: [
      'A pure crystalline organic solid melts sharply over a narrow 1–2 °C range matching data-book values.',
      'Impurities both LOWER the melting temperature and BROADEN the melting range.',
    ],
  },
];
