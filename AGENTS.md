# CHEMpanion Workspace Guidelines

Always apply these rules when working on files in `CHEMpanion` (`Chempanion-v2`):

## 1. Typography & Chemical Lettercase
- **Never force all-caps styling** on any text element (body copy, headings, labels, badges, table headers, or buttons).
- Do **not** add CSS `text-transform: uppercase`, Tailwind `uppercase`, or JavaScript `.toUpperCase()` calls in UI markup — chemical symbols (`Cl`, `Br`, `Be`, `NaCl`), thermodynamic quantities (`pV = nRT`, `kJ mol⁻¹`, `dm³`), and units are strictly case-sensitive.

## 2. Feature & Applet Update Checklist
Whenever adding, updating, or removing an applet or external resource tile, always keep all three files in sync:
1. **Registry:** `src/data/appletRegistry.js` (correct WJEC 2015 unit label and `targetMastery`).
2. **Guides:** `src/data/howToGuides.jsx` (matching ID entry for every internal applet).
3. **Homepage Status:** The **Platform Updates & Status** panel in `src/App.jsx`.

## 3. Pedagogy, Prompts & Hints
- **No placement or answer spoilers in visible prompts.** Keep step-by-step placement clues, reagent giveaways, or elimination hints inside a collapsible **Need a Hint?** drawer that starts closed by default and resets whenever the student switches questions or scenarios.
- All new internal applets should integrate with `onComplete` / `useProgress()` rather than marking tasks complete without checking student answers.

## 4. WJEC 2015 Spec & UK Chemistry Conventions
- Verify unit numbers against the official WJEC 2015 GCE Chemistry specification (e.g. `1.4` Bonding & VSEPR, `1.5` Solid Structures, `1.6` Periodic Table & Qualitative Analysis, `2.5 / 2.6` AS Organic, `3.2` Redox, `4.2 – 4.4` A2 Organic).
- Use **British English** throughout prose, labels, and feedback (`colour`, `colourless`, `polarisation`, `delocalised`, `neighbouring`, `penalise`, `neutralisation`).
- Render chemical formulas, subscripts, superscripts, and arrows in JSX using standard **Unicode or HTML (`<sub>` / `<sup>`)** rather than raw unrendered LaTeX strings.

## 5. Git & Environment Workflow
- Work on `dev-branch`. **Never push (`git push`) or push/merge to `main` unless explicitly instructed by the user.**
- Check if `node` / `npm` is available before assuming a local build can run; never report a build or runtime check as passing unless it was actually executed cleanly.

## 6. Adaptive Multi-Device Layout (Mobile, Tablet & HD Desktop)
- **Universal Workbench Architecture:** Every internal applet should use `.applet-workbench` + `.applet-workbench-sticky` (stacking cleanly on phones, splitting into 2 balanced columns from `768px` tablet through `82rem` HD desktop) with **zero container width jumps** when switching tabs, modes, or steps.
- **Adaptive Selectors Only (`AdaptivePicker` / `StyledSelect`):** Never use raw unstyled OS `<select>` elements or tall multi-row mobile button walls. Use `AdaptivePicker` (compact CSS-styled dropdown on mobile, horizontal pills on tablet/desktop) and `StyledSelect` for in-form choices.
- **360px Mobile & Touch Safety:** Prevent horizontal overflow on `360px` viewports, maintain `>= 36–40px` touch targets on interactive pills/steppers, and keep SVG labels legible across screen sizes without placing HTML `<sub>`/`<sup>` inside `<svg>`.
