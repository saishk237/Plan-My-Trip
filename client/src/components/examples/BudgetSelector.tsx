import { useState } from 'react';
import BudgetSelector from '../BudgetSelector';

export default function BudgetSelectorExample() {
  const [budget, setBudget] = useState('Moderate');
  
  return (
    <div className="p-8">
      <BudgetSelector value={budget} onChange={setBudget} />
    </div>
  );
}
