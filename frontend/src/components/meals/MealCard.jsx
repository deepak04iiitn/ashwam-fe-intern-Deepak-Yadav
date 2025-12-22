import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { mealTypes } from '../../utils/mockData';
import FeelingSelector from './FeelingSelector';
import SymptomChips from './SymptomChips';
import FoodItemPortionSelector from './FoodItemPortionSelector';
import SmartDefaults from './SmartDefaults';

export default function MealCard({
  mealType,
  mealData,
  onToggleExpand,
  onToggleSkipped,
  onFoodInputChange,
  onSmartDefaultSelect,
  onPortionSelect,
  onFeelingSelect,
  onSymptomToggle,
  onNoteChange
}) {

  const mealConfig = mealTypes.find(m => m.id === mealType);
  
  if(!mealConfig) return null;
  
  const {
    isExpanded,
    isSkipped,
    foodItems,
    parsedFoods,
    feeling,
    symptoms,
    note
  } = mealData;
  
  return (
    <div className={`
      border-2 rounded-xl transition-all duration-300 overflow-hidden
      ${mealConfig.borderColor} ${mealConfig.bgColor}
      ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
    `}>
      
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-50 transition-colors"
      >
        <div className="flex items-center gap-3">

          <div className={`p-2 rounded-lg ${mealConfig.bgColor}`}>
            <span className="text-2xl">
              {mealConfig.icon === 'Coffee' && '☕'}
              {mealConfig.icon === 'Sun' && '☀️'}
              {mealConfig.icon === 'Moon' && '🌙'}
              {mealConfig.icon === 'Cookie' && '🍪'}
            </span>
          </div>

          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-800">{mealConfig.name}</h3>
            {isSkipped && (
              <p className="text-xs text-gray-500">Skipped</p>
            )}
            
            {!isSkipped && foodItems && (
              <p className="text-xs text-gray-600 truncate max-w-xs">{foodItems}</p>
            )}
          </div>

        </div>
        
        <div className="flex items-center gap-2">
          {isSkipped && (
            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
              Skipped
            </span>
          )}

          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>

      </button>
      
      {isExpanded && (
        <div className="px-6 py-4 space-y-4 border-t border-gray-200 bg-white">
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Didn't have {mealConfig.name.toLowerCase()} today?
            </label>

            <button
              type="button"
              onClick={onToggleSkipped}
              className={`
                relative w-14 h-7 rounded-full transition-colors duration-200
                ${isSkipped ? 'bg-emerald-500' : 'bg-gray-300'}
              `}
            >

              <span
                className={`
                  absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200
                  ${isSkipped ? 'translate-x-7' : 'translate-x-0'}
                `}
              />

            </button>
          </div>
          
          {!isSkipped && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What did you have?
                </label>

                <textarea
                  value={foodItems}
                  onChange={(e) => onFoodInputChange(e.target.value)}
                  placeholder="e.g., 2 ragi rotis, green moong dal, cucumber salad"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  rows="3"
                />
                
                <SmartDefaults
                  mealType={mealType}
                  onSelect={onSmartDefaultSelect}
                />
              </div>
              
              {parsedFoods.length > 0 && (
                <div className="space-y-2">

                  {parsedFoods.map((foodItem) => (
                    <FoodItemPortionSelector
                      key={foodItem.id}
                      foodItem={foodItem}
                      onPortionSelect={onPortionSelect}
                    />
                  ))}

                </div>
              )}
              
              {foodItems.trim() && (
                <FeelingSelector
                  feeling={feeling}
                  onSelect={onFeelingSelect}
                />
              )}
              
              {feeling && (
                <SymptomChips
                  symptoms={symptoms}
                  onToggle={onSymptomToggle}
                />
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Anything unusual about today's meals or timing? (Optional)
                </label>

                <textarea
                  value={note}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Add any notes..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  rows="2"
                />
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}

