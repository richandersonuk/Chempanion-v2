import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Branding';

// --- AROMATIC SVG ENVIRONMENTS ---
const AromaticRingPlain = () => (
  <svg width="20" height="24" viewBox="0 0 28 36" className="inline-block text-slate-800 shrink-0" style={{ verticalAlign: 'middle' }}>
    <g transform="translate(2, 2)">
      <polygon points="12,4 24,11 24,25 12,32 0,25 0,11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="18" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </g>
  </svg>
);

const AromaticRingSubstituted = () => (
  <svg width="24" height="24" viewBox="0 0 32 36" className="inline-block text-slate-800 shrink-0" style={{ verticalAlign: 'middle' }}>
    <g transform="translate(2, 2)">
      <polygon points="12,4 24,11 24,25 12,32 0,25 0,11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="18" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24" y1="11" x2="30" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

const ZoomablePeriodicTable = () => {
  const [scale, setScale] = useState(0.65);
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(null);
  const scrollContainerRef = useRef(null);
  const elementRefs = useRef(new Map());
  const keyRef = useRef(null);

  const elementData = [
    { z: 1, s: 'H', n: 'hydrogen', m: '1.0', c: 1, r: 1 }, { z: 2, s: 'He', n: 'helium', m: '4.0', c: 18, r: 1 },
    { z: 3, s: 'Li', n: 'lithium', m: '6.9', c: 1, r: 2 }, { z: 4, s: 'Be', n: 'beryllium', m: '9.0', c: 2, r: 2 },
    { z: 5, s: 'B', n: 'boron', m: '10.8', c: 13, r: 2 }, { z: 6, s: 'C', n: 'carbon', m: '12.0', c: 14, r: 2 }, { z: 7, s: 'N', n: 'nitrogen', m: '14.0', c: 15, r: 2 }, { z: 8, s: 'O', n: 'oxygen', m: '16.0', c: 16, r: 2 }, { z: 9, s: 'F', n: 'fluorine', m: '19.0', c: 17, r: 2 }, { z: 10, s: 'Ne', n: 'neon', m: '20.2', c: 18, r: 2 },
    { z: 11, s: 'Na', n: 'sodium', m: '23.0', c: 1, r: 3 }, { z: 12, s: 'Mg', n: 'magnesium', m: '24.3', c: 2, r: 3 },
    { z: 13, s: 'Al', n: 'aluminium', m: '27.0', c: 13, r: 3 }, { z: 14, s: 'Si', n: 'silicon', m: '28.1', c: 14, r: 3 }, { z: 15, s: 'P', n: 'phosphorus', m: '31.0', c: 15, r: 3 }, { z: 16, s: 'S', n: 'sulfur', m: '32.1', c: 16, r: 3 }, { z: 17, s: 'Cl', n: 'chlorine', m: '35.5', c: 17, r: 3 }, { z: 18, s: 'Ar', n: 'argon', m: '39.9', c: 18, r: 3 },
    { z: 19, s: 'K', n: 'potassium', m: '39.1', c: 1, r: 4 }, { z: 20, s: 'Ca', n: 'calcium', m: '40.1', c: 2, r: 4 },
    { z: 21, s: 'Sc', n: 'scandium', m: '45.0', c: 3, r: 4 }, { z: 22, s: 'Ti', n: 'titanium', m: '47.9', c: 4, r: 4 }, { z: 23, s: 'V', n: 'vanadium', m: '50.9', c: 5, r: 4 }, { z: 24, s: 'Cr', n: 'chromium', m: '52.0', c: 6, r: 4 }, { z: 25, s: 'Mn', n: 'manganese', m: '54.9', c: 7, r: 4 }, { z: 26, s: 'Fe', n: 'iron', m: '55.8', c: 8, r: 4 }, { z: 27, s: 'Co', n: 'cobalt', m: '58.9', c: 9, r: 4 }, { z: 28, s: 'Ni', n: 'nickel', m: '58.7', c: 10, r: 4 }, { z: 29, s: 'Cu', n: 'copper', m: '63.5', c: 11, r: 4 }, { z: 30, s: 'Zn', n: 'zinc', m: '65.4', c: 12, r: 4 },
    { z: 31, s: 'Ga', n: 'gallium', m: '69.7', c: 13, r: 4 }, { z: 32, s: 'Ge', n: 'germanium', m: '72.6', c: 14, r: 4 }, { z: 33, s: 'As', n: 'arsenic', m: '74.9', c: 15, r: 4 }, { z: 34, s: 'Se', n: 'selenium', m: '79.0', c: 16, r: 4 }, { z: 35, s: 'Br', n: 'bromine', m: '79.9', c: 17, r: 4 }, { z: 36, s: 'Kr', n: 'krypton', m: '83.8', c: 18, r: 4 },
    { z: 37, s: 'Rb', n: 'rubidium', m: '85.5', c: 1, r: 5 }, { z: 38, s: 'Sr', n: 'strontium', m: '87.6', c: 2, r: 5 },
    { z: 39, s: 'Y', n: 'yttrium', m: '88.9', c: 3, r: 5 }, { z: 40, s: 'Zr', n: 'zirconium', m: '91.2', c: 4, r: 5 }, { z: 41, s: 'Nb', n: 'niobium', m: '92.9', c: 5, r: 5 }, { z: 42, s: 'Mo', n: 'molybdenum', m: '95.9', c: 6, r: 5 }, { z: 43, s: 'Tc', n: 'technetium', m: '', c: 7, r: 5 }, { z: 44, s: 'Ru', n: 'ruthenium', m: '101.1', c: 8, r: 5 }, { z: 45, s: 'Rh', n: 'rhodium', m: '102.9', c: 9, r: 5 }, { z: 46, s: 'Pd', n: 'palladium', m: '106.4', c: 10, r: 5 }, { z: 47, s: 'Ag', n: 'silver', m: '107.9', c: 11, r: 5 }, { z: 48, s: 'Cd', n: 'cadmium', m: '112.4', c: 12, r: 5 },
    { z: 49, s: 'In', n: 'indium', m: '114.8', c: 13, r: 5 }, { z: 50, s: 'Sn', n: 'tin', m: '118.7', c: 14, r: 5 }, { z: 51, s: 'Sb', n: 'antimony', m: '121.8', c: 15, r: 5 }, { z: 52, s: 'Te', n: 'tellurium', m: '127.6', c: 16, r: 5 }, { z: 53, s: 'I', n: 'iodine', m: '126.9', c: 17, r: 5 }, { z: 54, s: 'Xe', n: 'xenon', m: '131.3', c: 18, r: 5 },
    { z: 55, s: 'Cs', n: 'caesium', m: '132.9', c: 1, r: 6 }, { z: 56, s: 'Ba', n: 'barium', m: '137.3', c: 2, r: 6 },
    { z: 72, s: 'Hf', n: 'hafnium', m: '178.5', c: 4, r: 6 }, { z: 73, s: 'Ta', n: 'tantalum', m: '180.9', c: 5, r: 6 }, { z: 74, s: 'W', n: 'tungsten', m: '183.8', c: 6, r: 6 }, { z: 75, s: 'Re', n: 'rhenium', m: '186.2', c: 7, r: 6 }, { z: 76, s: 'Os', n: 'osmium', m: '190.2', c: 8, r: 6 }, { z: 77, s: 'Ir', n: 'iridium', m: '192.2', c: 9, r: 6 }, { z: 78, s: 'Pt', n: 'platinum', m: '195.1', c: 10, r: 6 }, { z: 79, s: 'Au', n: 'gold', m: '197.0', c: 11, r: 6 }, { z: 80, s: 'Hg', n: 'mercury', m: '200.6', c: 12, r: 6 },
    { z: 81, s: 'Tl', n: 'thallium', m: '204.4', c: 13, r: 6 }, { z: 82, s: 'Pb', n: 'lead', m: '207.2', c: 14, r: 6 }, { z: 83, s: 'Bi', n: 'bismuth', m: '209.0', c: 15, r: 6 }, { z: 84, s: 'Po', n: 'polonium', m: '', c: 16, r: 6 }, { z: 85, s: 'At', n: 'astatine', m: '', c: 17, r: 6 }, { z: 86, s: 'Rn', n: 'radon', m: '', c: 18, r: 6 },
    { z: 87, s: 'Fr', n: 'francium', m: '', c: 1, r: 7 }, { z: 88, s: 'Ra', n: 'radium', m: '', c: 2, r: 7 },
    { z: 104, s: 'Rf', n: 'rutherfordium', m: '', c: 4, r: 7 }, { z: 105, s: 'Db', n: 'dubnium', m: '', c: 5, r: 7 }, { z: 106, s: 'Sg', n: 'seaborgium', m: '', c: 6, r: 7 }, { z: 107, s: 'Bh', n: 'bohrium', m: '', c: 7, r: 7 }, { z: 108, s: 'Hs', n: 'hassium', m: '', c: 8, r: 7 }, { z: 109, s: 'Mt', n: 'meitnerium', m: '', c: 9, r: 7 }, { z: 110, s: 'Ds', n: 'darmstadtium', m: '', c: 10, r: 7 }, { z: 111, s: 'Rg', n: 'roentgenium', m: '', c: 11, r: 7 }, { z: 112, s: 'Cn', n: 'copernicium', m: '', c: 12, r: 7 }, { z: 113, s: 'Nh', n: 'nihonium', m: '', c: 13, r: 7 }, { z: 114, s: 'Fl', n: 'flerovium', m: '', c: 14, r: 7 }, { z: 115, s: 'Mc', n: 'moscovium', m: '', c: 15, r: 7 }, { z: 116, s: 'Lv', n: 'livermorium', m: '', c: 16, r: 7 }, { z: 117, s: 'Ts', n: 'tennessine', m: '', c: 17, r: 7 }, { z: 118, s: 'Og', n: 'oganesson', m: '', c: 18, r: 7 },
    { z: 57, s: 'La', n: 'lanthanum', m: '138.9', c: 4, r: 9 }, { z: 58, s: 'Ce', n: 'cerium', m: '140.1', c: 5, r: 9 }, { z: 59, s: 'Pr', n: 'praseodymium', m: '140.9', c: 6, r: 9 }, { z: 60, s: 'Nd', n: 'neodymium', m: '144.2', c: 7, r: 9 }, { z: 61, s: 'Pm', n: 'promethium', m: '', c: 8, r: 9 }, { z: 62, s: 'Sm', n: 'samarium', m: '150.4', c: 9, r: 9 }, { z: 63, s: 'Eu', n: 'europium', m: '152.0', c: 10, r: 9 }, { z: 64, s: 'Gd', n: 'gadolinium', m: '157.3', c: 11, r: 9 }, { z: 65, s: 'Tb', n: 'terbium', m: '158.9', c: 12, r: 9 }, { z: 66, s: 'Dy', n: 'dysprosium', m: '162.5', c: 13, r: 9 }, { z: 67, s: 'Ho', n: 'holmium', m: '164.9', c: 14, r: 9 }, { z: 68, s: 'Er', n: 'erbium', m: '167.3', c: 15, r: 9 }, { z: 69, s: 'Tm', n: 'thulium', m: '168.9', c: 16, r: 9 }, { z: 70, s: 'Yb', n: 'ytterbium', m: '173.0', c: 17, r: 9 }, { z: 71, s: 'Lu', n: 'lutetium', m: '175.0', c: 18, r: 9 },
    { z: 89, s: 'Ac', n: 'actinium', m: '', c: 4, r: 10 }, { z: 90, s: 'Th', n: 'thorium', m: '232.0', c: 5, r: 10 }, { z: 91, s: 'Pa', n: 'protactinium', m: '231.0', c: 6, r: 10 }, { z: 92, s: 'U', n: 'uranium', m: '238.0', c: 7, r: 10 }, { z: 93, s: 'Np', n: 'neptunium', m: '', c: 8, r: 10 }, { z: 94, s: 'Pu', n: 'plutonium', m: '', c: 9, r: 10 }, { z: 95, s: 'Am', n: 'americium', m: '', c: 10, r: 10 }, { z: 96, s: 'Cm', n: 'curium', m: '', c: 11, r: 10 }, { z: 97, s: 'Bk', n: 'berkelium', m: '', c: 12, r: 10 }, { z: 98, s: 'Cf', n: 'californium', m: '', c: 13, r: 10 }, { z: 99, s: 'Es', n: 'einsteinium', m: '', c: 14, r: 10 }, { z: 100, s: 'Fm', n: 'fermium', m: '', c: 15, r: 10 }, { z: 101, s: 'Md', n: 'mendelevium', m: '', c: 16, r: 10 }, { z: 102, s: 'No', n: 'nobelium', m: '', c: 17, r: 10 }, { z: 103, s: 'Lr', n: 'lawrencium', m: '', c: 18, r: 10 }
  ];

  const jumpToRef = (ref, targetZoom = 1.4) => {
    if (!ref || !scrollContainerRef.current) return;
    setScale(targetZoom);
    setTimeout(() => {
      const container = scrollContainerRef.current;
      const targetRect = ref.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (targetRect.left - containerRect.left) - (containerRect.width / 2) + (targetRect.width / 2);
      const scrollTop = container.scrollTop + (targetRect.top - containerRect.top) - (containerRect.height / 2) + (targetRect.height / 2);
      container.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'smooth' });
    }, 450);
  };

  useEffect(() => {
    setTimeout(() => jumpToRef(keyRef.current, 0.9), 600);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim().toLowerCase();
    const found = elementData.find(el => el.s.toLowerCase() === query || el.n.toLowerCase() === query || el.z.toString() === query);
    if (found) {
      setHighlighted(found.z);
      jumpToRef(elementRefs.current.get(found.z), 1.4);
    }
  };

  return (
    <div className="flex flex-col h-full py-2 bg-white">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4 items-center justify-between px-2">
        <div className="flex w-full sm:w-2/3 gap-2">
          <input type="text" placeholder="Search element..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-slate-300 rounded-md text-slate-800 shadow-sm" />
          <button type="submit" className="px-4 py-2 bg-[#326fa0] text-white rounded-md font-semibold">Jump</button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setScale(s => Math.max(s - 0.2, 0.2))} className="px-4 py-2 bg-slate-100 border border-slate-300 font-bold">&minus;</button>
          <button type="button" onClick={() => { setScale(0.65); setHighlighted(null); jumpToRef(keyRef.current, 0.65); }} className="px-4 py-2 bg-slate-100 border border-slate-300">Reset</button>
          <button type="button" onClick={() => setScale(s => Math.min(s + 0.4, 4))} className="px-4 py-2 bg-slate-100 border border-slate-300 font-bold">&#43;</button>
        </div>
      </form>

      <div className="flex-1 overflow-auto border border-slate-200 rounded-lg bg-white" ref={scrollContainerRef}>
        <div className="transition-transform duration-500 ease-out p-12 min-w-[1300px]" style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
            <div ref={keyRef} style={{ gridColumn: '4 / span 6', gridRow: '1 / span 3' }} className="border-2 border-slate-400 bg-slate-50 p-4 rounded-lg flex items-center justify-around my-2">
              <div className="flex flex-col items-center">
                <div className="w-16 h-24 border-2 border-slate-500 bg-white flex flex-col items-center justify-between py-1">
                  <span className="text-[11px] font-bold text-slate-700">12.0</span>
                  <span className="text-3xl font-black text-slate-900 mt-1">C</span>
                  <span className="text-[11px] font-bold text-slate-500">6</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-[10px] font-bold text-slate-600 pl-4 border-l border-slate-300">
                <span>Relative Atomic Mass (Ar)</span>
                <span>Atomic Symbol</span>
                <span>Atomic Number (z)</span>
              </div>
            </div>

            {elementData.map((el) => (
              <div key={el.z} ref={node => node ? elementRefs.current.set(el.z, node) : elementRefs.current.delete(el.z)}
                className={`flex flex-col items-center justify-between p-1 border rounded transition-all h-20 w-16 ${highlighted === el.z ? 'ring-4 ring-[#326fa0] bg-blue-50 scale-110 z-10' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
                style={{ gridColumn: el.c, gridRow: el.r }}
              >
                <span className="text-[10px] font-bold text-slate-700 leading-none">{el.m}</span>
                <span className="text-2xl font-black text-slate-900 leading-none">{el.s}</span>
                <span className={`uppercase text-slate-500 font-bold text-center leading-tight overflow-hidden ${el.n.length > 10 ? 'text-[5.5px]' : 'text-[7px]'}`}>{el.n}</span>
                <span className="text-[10px] font-bold text-slate-500 leading-none">{el.z}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DataBooklet = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('constants');

  if (!isOpen) return null;

  const tabs = [
    { id: 'constants', label: 'Constants' },
    { id: 'units', label: 'Units' },
    { id: 'periodic', label: 'Periodic Table' },
    { id: 'IR', label: 'IR Absorptions' },
    { id: '13C', label: <span><sup>13</sup>C NMR</span> },
    { id: '1H', label: <span><sup>1</sup>H NMR</span> }
  ];

  const constants = [
    { n: 'Avogadro constant', s: <>N<sub>A</sub></>, v: <>6.02 &times; 10<sup>23</sup> mol<sup>&minus;1</sup></> },
    { n: 'molar gas constant', s: 'R', v: <>8.31 J mol<sup>&minus;1</sup> K<sup>&minus;1</sup></> },
    { n: 'molar gas volume (273 K)', s: <>V<sub>m</sub></>, v: <>22.4 dm³ mol<sup>&minus;1</sup></> },
    { n: 'Planck constant', s: 'h', v: <>6.63 &times; 10<sup>&minus;34</sup> J s</> },
    { n: 'fundamental electronic charge', s: 'e', v: <>1.60 &times; 10<sup>&minus;19</sup> C</> }
  ];

  const irData = [
    { b: 'C-Br', w: '500 - 600' },
    { b: 'C-Cl', w: '650 - 800' },
    { b: 'C-O', w: '1000 - 1300' },
    { b: 'C=C', w: '1620 - 1670' },
    { b: 'C=O', w: '1650 - 1750' },
    { b: 'C≡N', w: '2100 - 2250' },
    { b: 'O-H (acid)', w: '2500 - 3200' },
    { b: 'C-H', w: '2800 - 3100' },
    { b: 'O-H (alcohol)', w: '3200 - 3550' },
    { b: 'N-H', w: '3300 - 3500' }
  ];

  const c13Data = [
    { t: 'C-R (alkane)', s: '5 - 40' },
    { t: 'C-Cl or C-Br', s: '10 - 70' },
    { t: 'C-N', s: '20 - 50' },
    { t: 'C-O', s: '50 - 90' },
    { t: 'C=C (alkene)', s: '90 - 150' },
    { t: 'C≡N', s: '110 - 125' },
    { t: <div className="flex items-center gap-2"><AromaticRingPlain /> <span>Arene C</span></div>, s: '110 - 160' },
    { t: 'C=O (acid/ester)', s: '160 - 185' },
    { t: 'C=O (aldehyde/ketone)', s: '190 - 220' }
  ];

  const h1Data = [
    { t: 'R-CH₃', s: '0.9' },
    { t: 'R-CH₂-R', s: '1.3' },
    { t: 'CH₃-C=O', s: '2.0 - 2.5' },
    { t: 'CH₃-Ar', s: '2.2 - 2.3' },
    { t: 'R-O-CH₃', s: '3.3 - 4.3' },
    { t: 'R-OH', s: '4.5 *' },
    { t: 'C=CH', s: '4.5 - 6.3' },
    { t: <div className="flex items-center gap-2"><AromaticRingSubstituted /> <span>Arene H</span></div>, s: '6.5 - 8.0' },
    { t: 'R-CHO', s: '9.8 *' },
    { t: 'R-COOH', s: '11.0 *' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 md:p-6 backdrop-blur-md">
      <div className="bg-white w-full max-w-5xl h-[90vh] md:h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* --- BRANDED HEADER --- */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Logo className="h-8" />
            <div className="flex items-baseline font-black tracking-tighter text-2xl select-none">
              <span className="text-[var(--chem-logo-darkblue)]">Data</span>
              <span className="text-[var(--chem-logo-lightblue)]">Book</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 p-2 rounded-md hover:bg-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- DUAL INTERACTIVE NAVIGATION SECTOR --- */}
        <div className="border-b border-slate-200 bg-slate-50 shrink-0 px-2">
          
          {/* Desktop Tab Layout Bar */}
          <div className="hidden lg:flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-5 py-3 font-semibold transition-all whitespace-nowrap text-sm ${
                  activeTab === tab.id 
                    ? 'border-b-4 border-[#326fa0] text-[#326fa0] bg-white' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* --- NEW HOUSESTYLE: COMPACT MOBILE MATRIX TOUCH GRID --- */}
          <div className="lg:hidden py-3 px-2 bg-white">
            <span className="chem-choice-label text-center">Select Data Section</span>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`chem-choice-btn text-center text-xs py-2 px-1 ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* --- DATA VIEWPORT SHEET AREA --- */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-white">
          {activeTab === 'periodic' && <ZoomablePeriodicTable />}

          {activeTab === 'constants' && (
            <div className="max-w-4xl mx-auto rounded-lg border border-slate-200 overflow-hidden text-slate-900">
              <table className="w-full text-left table-fixed">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold text-slate-700 w-auto">Constant</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-700 w-16 text-center">Symbol</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-700 w-36 md:w-48 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {constants.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate-600 leading-snug">{c.n}</td>
                      <td className="py-3 px-4 text-sm font-mono font-bold text-slate-800 text-center">{c.s}</td>
                      <td className="py-3 px-4 text-sm font-mono text-slate-800 text-right whitespace-nowrap">{c.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="max-w-3xl mx-auto space-y-12 animate-fade-in text-slate-900">
              <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-center font-mono font-bold text-slate-800 text-sm">
                  <tbody className="divide-y divide-slate-200">
                    <tr><td className="py-4">temperature (K) = temperature (°C) + 273</td></tr>
                    <tr><td className="py-4">1 dm³ = 1000 cm³</td></tr>
                    <tr><td className="py-4">1 m³ = 1000 dm³</td></tr>
                    <tr><td className="py-4">1 tonne = 1000 kg</td></tr>
                    <tr><td className="py-4">1 atm = 1.01 &times; 10⁵ Pa</td></tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-4">Prefixes</h3>
                <div className="max-w-sm mx-auto rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="p-3 text-xs">Prefix</th>
                        <th className="p-3 text-xs text-center">Symbol</th>
                        <th className="p-3 text-xs text-right">Multiple</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[{p:'giga',s:'G',m:'10⁹'},{p:'mega',s:'M',m:'10⁶'},{p:'kilo',s:'k',m:'10³'},{p:'milli',s:'m',m:'10⁻³'},{p:'micro',s:'μ',m:'10⁻⁶'},{p:'nano',s:'n',m:'10⁻⁹'}].map((p,i)=>(
                        <tr key={i}>
                          <td className="p-3 text-sm font-bold text-slate-700">{p.p}</td>
                          <td className="p-3 text-sm font-mono font-bold text-center text-[#326fa0]">{p.s}</td>
                          <td className="p-3 text-sm font-mono text-right text-slate-500">{p.m}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'IR' && (
            <div className="max-w-3xl mx-auto rounded-lg border border-slate-200 overflow-hidden shadow-sm text-slate-900">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Bond</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 text-right">Wavenumber / cm⁻¹</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {irData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-slate-800">{row.b}</td>
                      <td className="py-3 px-4 text-sm font-mono text-right text-[#326fa0] font-bold">{row.w}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === '13C' && (
            <div className="max-w-3xl mx-auto space-y-4 text-slate-900">
              <h3 className="font-black text-xl text-slate-800 text-center uppercase tracking-tighter"><sup>13</sup>C NMR Chemical Shifts</h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Type of carbon</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 lowercase text-right">&delta; / ppm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {c13Data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-bold text-slate-800">{row.t}</td>
                        <td className="py-4 px-4 font-mono font-black text-[#326fa0] text-right">{row.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === '1H' && (
            <div className="max-w-3xl mx-auto space-y-4 text-slate-900">
              <h3 className="font-black text-xl text-slate-800 text-center uppercase tracking-tighter"><sup>1</sup>H NMR Chemical Shifts</h3>
              <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Type of proton</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 lowercase text-right">&delta; / ppm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {h1Data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm font-bold text-slate-800">{row.t}</td>
                        <td className="py-4 px-4 font-mono font-black text-[#326fa0] text-right">{row.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DataBooklet;
