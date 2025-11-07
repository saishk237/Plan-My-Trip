import { useState } from 'react';
import InterestChips from '../InterestChips';

export default function InterestChipsExample() {
  const [selected, setSelected] = useState<string[]>(['Culture', 'Food']);
  
  return (
    <div className="p-8">
      <InterestChips selected={selected} onChange={setSelected} />
    </div>
  );
}
