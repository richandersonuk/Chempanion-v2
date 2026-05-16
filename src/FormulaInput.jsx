import React from 'react';

const FormulaInput = ({ value, onChange, placeholder, status, onKeyDown }) => {
  // Mapping standard digits to Unicode subscripts for chemical formulas
  const subMap = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    
    // Convert numbers to subscripts automatically to assist chemical formula input typing
    let formatted = '';
    for (let char of rawValue) {
      if (subMap[char]) {
        formatted += subMap[char];
      } else {
        formatted += char;
      }
    }
    onChange(formatted);
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className={`chem-input ${status}`}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{ 
          fontSize: '1.4rem', 
          letterSpacing: '0.05em', 
          textAlign: 'center', 
          maxWidth: '16rem' 
        }}
      />
    </div>
  );
};

export default FormulaInput;
