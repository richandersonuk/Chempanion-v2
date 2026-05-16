import React, { useState, useRef, useEffect } from 'react';

const ScientificInput = ({ 
  value, 
  exponent, 
  onValueChange, 
  onExponentChange, 
  label, 
  status 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const expInputRef = useRef(null);

  useEffect(() => {
    if (showModal && expInputRef.current) {
      const timer = setTimeout(() => {
        expInputRef.current.focus();
        expInputRef.current.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const adjustExponent = (amount) => {
    const current = exponent === '' ? -5 : parseInt(exponent);
    onExponentChange((current + amount).toString());
  };

  const handlePointerDown = (e) => { 
    setIsDragging(true); 
    setStartY(e.clientY); 
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = startY - e.clientY;
    if (Math.abs(diff) > 25) { // Vertical drag step threshold sensitivity
      adjustExponent(diff > 0 ? 1 : -1);
      setStartY(e.clientY);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mb-6 px-4">
      <div className="flex items-center justify-center bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 focus-within:border-[#326fa0] transition-colors shadow-sm w-full max-w-[16rem]">
        
        {label && (
          <span className="font-black text-[#326fa0] text-lg mr-2 leading-none select-none">
            {label}
          </span>
        )}
        
        <div className="flex items-baseline gap-1 leading-none w-full justify-center">
          <input
            type="number"
            className={`w-16 text-lg font-mono outline-none bg-transparent m-0 p-0 text-center ${status}`}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="0.00"
          />
          
          {exponent !== '' && (
            <span className="text-lg font-mono font-bold text-slate-800 ml-0.5 select-none leading-none">
              &times;10<sup className="text-xs">{exponent}</sup>
            </span>
          )}

          <button 
            type="button"
            onClick={() => { if(exponent === '') onExponentChange('-5'); setShowModal(true); }}
            className="ml-3 bg-slate-100 text-[#326fa0] text-[10px] font-black px-2 py-1 rounded border border-slate-300 transition-colors hover:bg-slate-200"
          >
            &times;10<sup>x</sup>
          </button>
        </div>
      </div>

      {/* --- HOUSESTYLE COMPLIANT SWIPE/TAP INDEX ADJUSTMENT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-slate-900 p-8 rounded-3xl shadow-2xl max-w-xs w-full text-center relative animate-scale-up">
            
            <button 
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <span className="chem-choice-label block mb-6">
              Swipe or tap to adjust Index
            </span>

            {/* STAGGERED SCIENTIFIC INDEX POSITIONING CELL */}
            <div className="flex justify-center items-start h-24 mb-8">
              {/* Base '10' notation framework */}
              <div className="text-4xl font-black text-slate-300 self-end skimming-none translate-x-4 select-none leading-none">
                10
              </div>

              {/* Responsive interactive power container column */}
              <div 
                className="flex flex-col items-center cursor-ns-resize select-none translate-x-4"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setIsDragging(false)}
                onPointerLeave={() => setIsDragging(false)}
              >
                <button 
                  type="button" 
                  className="text-slate-300 hover:text-[#326fa0] p-1 text-xl transition-colors"
                  onClick={() => adjustExponent(1)}
                >
                  ▲
                </button>
                
                <input
                  ref={expInputRef}
                  type="number"
                  className="w-16 text-4xl font-mono outline-none bg-transparent text-center border-none p-0 m-0 font-black"
                  value={exponent}
                  onChange={(e) => onExponentChange(e.target.value)}
                />
                
                <button 
                  type="button" 
                  className="text-slate-300 hover:text-[#326fa0] p-1 text-xl transition-colors"
                  onClick={() => adjustExponent(-1)}
                >
                  ▼
                </button>
              </div>
            </div>

            <button 
              type="button"
              className="btn btn-primary w-full py-3.5 text-base rounded-xl font-bold shadow-md" 
              onClick={() => setShowModal(false)}
            >
              Apply Index
            </button>
            
            <button 
              type="button"
              className="text-xs font-bold text-slate-400 mt-4 block w-full text-center hover:text-slate-600 transition-colors"
              onClick={() => { onExponentChange(''); setShowModal(false); }}
            >
              Clear Exponent
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScientificInput;
