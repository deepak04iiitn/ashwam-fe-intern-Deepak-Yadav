import React from 'react';
import { portionSizes } from '../../utils/mockData';

export default function FoodItemPortionSelector({ foodItem, onPortionSelect }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">

      <p className="text-sm font-medium text-gray-700">
        {foodItem.name} <span className="text-gray-500 font-normal">- portion?</span>
      </p>

      <div className="flex flex-wrap gap-2">

        {portionSizes.map((size) => (
          <button
            key={size.value}
            type="button"
            onClick={() => onPortionSelect(foodItem.id, size.value)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
              ${foodItem.portion === size.value
                ? 'bg-emerald-500 text-white shadow-md scale-105'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
              }
            `}
          >
            <span className="mr-1">{size.icon}</span>
            {size.label}
          </button>
        ))}

      </div>
    </div>
  );
}

