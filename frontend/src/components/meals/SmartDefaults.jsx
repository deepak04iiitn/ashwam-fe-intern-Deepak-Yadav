import React from 'react';
import { loadSmartDefaults } from '../../utils/storage';
import { smartDefaults as defaultSmartDefaults } from '../../utils/mockData';

export default function SmartDefaults({ mealType, onSelect }) {

  const storedDefaults = loadSmartDefaults();
  const defaults = storedDefaults[mealType] || defaultSmartDefaults[mealType] || [];
  
  if(defaults.length === 0) return null;
  
  return (
    <div className="space-y-2">

      <p className="text-xs text-gray-500 font-medium">Quick select:</p>
      <div className="flex flex-wrap gap-2">
        
        {defaults.slice(0, 5).map((defaultText, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(defaultText)}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
          >
            {defaultText}
          </button>
        ))}

      </div>

    </div>
  );
}

