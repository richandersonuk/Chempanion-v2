import React from 'react';

const FormulaInput = ({ value, onChange, placeholder, status = '', onKeyDown, disabled = false, wrapped = true }) => {
  // Mapping standard digits to Unicode subscripts for chemical formulas
  const subMap = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    let formatted = '';
    for (let char of rawValue) {
      formatted += subMap[char] || char;
    }
    onChange(formatted);
  };

  const inputElement = (
    <input
      type="text"
      className={`chem-input ${status}`}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      spellCheck="false"
      autoComplete="off"
      style={{ 
        fontSize: '1.3rem', 
        fontWeight: '800',
        letterSpacing: '0.05em', 
        textAlign: 'center', 
        maxWidth: '14rem',
        textTransform: 'none'
      }}
    />
  );

  if (!wrapped) return inputElement;

  return (
    <div className="input-group">
      {inputElement}
    </div>
  );
};

export default FormulaInput;
