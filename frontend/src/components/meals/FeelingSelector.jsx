import React from 'react';
import { feelingOptions } from '../../utils/mockData';

export default function FeelingSelector({ feeling, onSelect }) {
  return (
    <div className="space-y-2">

      <p className="text-sm font-medium text-gray-700">How did it feel in your body?</p>

      <div className="flex gap-3">
        {feelingOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`
              flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
              ${feeling === option.value
                ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
              }
            `}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{option.emoji}</span>
              <span className={`text-sm font-medium ${
                feeling === option.value ? 'text-emerald-700' : 'text-gray-600'
              }`}>
                {option.label}
              </span>

            </div>
          </button>
        ))}

      </div>
    </div>
  );
}

