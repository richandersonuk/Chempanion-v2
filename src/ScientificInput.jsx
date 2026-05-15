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
      setTimeout(() => {
        expInputRef.current.focus();
        expInputRef.current.select();
      }, 50);
    }
  }, [showModal]);

  const adjustExponent = (amount) => {
    const current = exponent === '' ? -5 : parseInt(exponent);
    onExponentChange((current + amount).toString());
  };

  const handlePointerDown = (e) => { setIsDragging(true); setStartY(e.clientY); };
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = startY - e.clientY;
    if (Math.abs(diff) > 25) {
      adjustExponent(diff > 0 ? 1 : -1);
      setStartY(e.clientY);
    }
  };

  return (
    <div className="input-group" style={{ justifyContent: 'center' }}>
      {label && <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '0.5rem' }}>{label}</span>}
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <input
          type="number"
          className={`chem-input ${status}`}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="0.00"
          style={{ width: '6rem', textAlign: 'right' }}
        />
        
        {exponent !== '' && (
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '1.1rem' }}>
            &times;10<sup>{exponent}</sup>
          </span>
        )}

        <button 
          type="button"
          onClick={() => { if(exponent === '') onExponentChange('-5'); setShowModal(true); }}
          className="btn btn-secondary"
          style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.7rem', height: 'auto' }}
        >
          &times;10<sup>x</sup>
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 100 }}>
          <div className="modal-content" style={{ maxWidth: '22rem', textAlign: 'center' }}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <p style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--chem-primary)', letterSpacing: '0.1em', marginBottom: '2rem' }}>
              SWIPE OR TAP TO ADJUST INDEX
            </p>
            
            {/* STAGGERED POSITIONING AREA */}
            <div className="flex justify-center items-start h-32 mb-8">
              {/* The "10" Base - aligned to bottom */}
              <div 
                style={{ 
                  fontSize: '3rem', 
                  fontWeight: '900', 
                  color: 'var(--chem-secondary-hover)', 
                  alignSelf: 'flex-end', 
                  lineHeight: '1',
                  transform: 'translateX(1rem)',
                  userSelect: 'none'
                }}
              >
                10
              </div>

              {/* The "Power" box - Sitting high */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  transform: 'translateX(1rem)',
                  cursor: 'ns-resize'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setIsDragging(false)}
                onPointerLeave={() => setIsDragging(false)}
              >

                
                <button type="button" style={{ color: 'var(--chem-border)', fontSize: '1.5rem' }} onClick={() => adjustExponent(1)}>▲</button>
                <input
                  ref={expInputRef}
                  type="number"
                  className="chem-input"
                  value={exponent}
                  onChange={(e) => onExponentChange(e.target.value)}
                  style={{ 
                    width: '5rem', 
                    textAlign: 'center', 
                    fontSize: '2.5rem', 
                    border: 'none', 
                    
                    fontWeight: 'var(--font-mono)',
                    padding: 0
                  }}
                />
                <button type="button" style={{ color: 'var(--chem-border)', fontSize: '1.5rem' }} onClick={() => adjustExponent(-1)}>▼</button>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setShowModal(false)}>Apply Index</button>
            <button 
              type="button"
              style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '1.5rem', color: 'var(--chem-text-muted)', display: 'block', width: '100%' }} 
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
