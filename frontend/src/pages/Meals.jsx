import React, { useState, useEffect } from 'react';
import { getGreeting } from '../utils/mockData';
import { initializeMealState, toggleMealExpansion, toggleMealSkipped, handleFoodInputChange, updateFoodPortion, setMealFeeling, toggleSymptom, updateMealNote } from '../utils/mealState';
import { updateSmartDefaults } from '../utils/storage';
import MealCard from '../components/meals/MealCard';
import { mealTypes } from '../utils/mockData';

export default function Meals() {

  const [meals, setMeals] = useState(() => initializeMealState());
  
  const handleToggleExpand = (mealType) => {
    setMeals(prev => toggleMealExpansion(prev, mealType));
  };
  
  const handleToggleSkipped = (mealType) => {
    setMeals(prev => toggleMealSkipped(prev, mealType));
  };
  
  const handleFoodInputChangeWrapper = (mealType, foodText) => {
    setMeals(prev => handleFoodInputChange(prev, mealType, foodText));
  };
  
  const handleSmartDefaultSelect = (mealType, defaultText) => {
    setMeals(prev => handleFoodInputChange(prev, mealType, defaultText));
    updateSmartDefaults(mealType, defaultText);
  };
  
  const handlePortionSelect = (mealType, foodId, portion) => {
    setMeals(prev => updateFoodPortion(prev, mealType, foodId, portion));
  };
  
  const handleFeelingSelect = (mealType, feeling) => {
    setMeals(prev => setMealFeeling(prev, mealType, feeling));
  };
  
  const handleSymptomToggle = (mealType, symptom) => {
    setMeals(prev => toggleSymptom(prev, mealType, symptom));
  };
  
  const handleNoteChange = (mealType, note) => {
    setMeals(prev => updateMealNote(prev, mealType, note));
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {getGreeting()}! 👋
        </h2>

        <p className="text-gray-600 text-lg">
          Let's log your meals for today - breakfast, lunch, dinner, and snacks.
        </p>
      </div>
      
      
      <div className="space-y-4">
        {mealTypes.map((mealType) => (
          <MealCard
            key={mealType.id}
            mealType={mealType.id}
            mealData={meals[mealType.id]}
            onToggleExpand={() => handleToggleExpand(mealType.id)}
            onToggleSkipped={() => handleToggleSkipped(mealType.id)}
            onFoodInputChange={(foodText) => handleFoodInputChangeWrapper(mealType.id, foodText)}
            onSmartDefaultSelect={(defaultText) => handleSmartDefaultSelect(mealType.id, defaultText)}
            onPortionSelect={(foodId, portion) => handlePortionSelect(mealType.id, foodId, portion)}
            onFeelingSelect={(feeling) => handleFeelingSelect(mealType.id, feeling)}
            onSymptomToggle={(symptom) => handleSymptomToggle(mealType.id, symptom)}
            onNoteChange={(note) => handleNoteChange(mealType.id, note)}
          />
        ))}
      </div>
      
    
      <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-emerald-800">
          💡 <strong>Tip:</strong> Your meal data is saved automatically and will help us learn your preferences for future quick selections.
        </p>
      </div>
    </div>
  );
}
