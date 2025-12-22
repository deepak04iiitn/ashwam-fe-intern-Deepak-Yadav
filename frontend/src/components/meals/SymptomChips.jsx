import React from 'react';
import { symptomOptions } from '../../utils/mockData';

export default function SymptomChips({ symptoms = [], onToggle }) {
  return (
    <div className="space-y-2">

      <p className="text-sm font-medium text-gray-700">Any symptoms?</p>

      <div className="flex flex-wrap gap-2">

        {symptomOptions.map((option) => {
          const isSelected = symptoms.includes(option.value);
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'bg-emerald-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}

      </div>

    </div>
  );
}

