import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Traditional casino chip denominations and colors
const CHIP_DENOMINATIONS = [
  { value: 1, color: 'white', border: '#999999' },
  { value: 5, color: 'red', border: '#990000' },
  { value: 25, color: 'green', border: '#006600' },
  { value: 100, color: 'black', border: '#333333' },
  { value: 500, color: 'purple', border: '#660066' },
  { value: 1000, color: 'orange', border: '#CC6600' }
];

export const ChipStack = ({ amount }) => {
  const [chips, setChips] = useState([]);

  // Calculate optimal chip distribution based on denominations
  useEffect(() => {
    if (amount <= 0) {
      setChips([]);
      return;
    }

    const newChips = [];
    let remainingAmount = amount;
    let chipId = 0;

    // Start with highest denomination and work down
    for (let i = CHIP_DENOMINATIONS.length - 1; i >= 0; i--) {
      const denomination = CHIP_DENOMINATIONS[i];
      const count = Math.floor(remainingAmount / denomination.value);
      
      for (let j = 0; j < count; j++) {
        newChips.push({
          id: chipId++,
          color: denomination.color,
          value: denomination.value
        });
      }
      
      remainingAmount -= count * denomination.value;
    }

    // If we still have a remainder and it's not zero, add a single chip of the lowest denomination
    if (remainingAmount > 0 && CHIP_DENOMINATIONS.length > 0) {
      newChips.push({
        id: chipId,
        color: CHIP_DENOMINATIONS[0].color,
        value: CHIP_DENOMINATIONS[0].value
      });
    }

    setChips(newChips);
  }, [amount]);

  const stack = chips.map((chip, index) => (
    <div
      key={chip.id}
      className="bet-chip animated"
      style={{
        backgroundColor: chip.color,
        border: `2px solid ${chip.border}`,
        bottom: `${(index * 2) + 10}px`, // slight offset to show stacking
        zIndex: index,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title={`$${chip.value}`}
    >
      <span>${chip.value}</span>
    </div>
  ));

  return (
    <div className="chip-stack-container">
      {stack}
    </div>
  );
};

ChipStack.propTypes = {
  amount: PropTypes.number.isRequired,
  label: PropTypes.string
};
