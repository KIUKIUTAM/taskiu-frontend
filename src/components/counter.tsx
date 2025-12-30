import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '@/stores/modules/counterSlice';

export function Counter() {
  const count = useSelector((state: any) => state.counter.value);

  const dispatch = useDispatch();

  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button aria-label="Increment value" onClick={() => dispatch(increment())}>
          +
        </button>

        <span>{count}</span>

        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          -
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <input value={incrementAmount} onChange={(e) => setIncrementAmount(e.target.value)} />
        <button onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))}>
          Add Amount
        </button>
      </div>
    </div>
  );
}
