import { initialMealState } from './InitialState';
import { parseFoodItems } from './mockData';
import { loadMealsFromStorage, saveMealsToStorage } from './storage';

export const initializeMealState = () => {

  const storedMeals = loadMealsFromStorage();
  
  if(storedMeals) {
    return storedMeals;
  }
  
  return {
    breakfast: { ...initialMealState },
    lunch: { ...initialMealState },
    dinner: { ...initialMealState },
    snacks: { ...initialMealState }
  };
};


export const updateMealState = (meals, mealType, updates) => {
  const updatedMeals = {
    ...meals,
    [mealType]: {
      ...meals[mealType],
      ...updates
    }
  };
  
  saveMealsToStorage(updatedMeals);
  
  return updatedMeals;
};


export const handleFoodInputChange = (meals, mealType, foodText) => {

  const parsedFoods = parseFoodItems(foodText);
  
  return updateMealState(meals, mealType, {
    foodItems: foodText,
    parsedFoods: parsedFoods,
    showPortionSelection: parsedFoods.length > 0 && !meals[mealType].isSkipped
  });

};


export const toggleMealExpansion = (meals, mealType) => {

  return updateMealState(meals, mealType, {
    isExpanded: !meals[mealType].isExpanded
  });

};


export const toggleMealSkipped = (meals, mealType) => {

  const newSkippedState = !meals[mealType].isSkipped;
  
  return updateMealState(meals, mealType, {
    isSkipped: newSkippedState,
    foodItems: newSkippedState ? '' : meals[mealType].foodItems,
    parsedFoods: newSkippedState ? [] : meals[mealType].parsedFoods,
    showPortionSelection: false,
    feeling: '',
    symptoms: [],
    note: ''
  });

};


export const updateFoodPortion = (meals, mealType, foodId, portion) => {

  const updatedParsedFoods = meals[mealType].parsedFoods.map(food =>
    food.id === foodId ? { ...food, portion } : food
  );
  
  return updateMealState(meals, mealType, {
    parsedFoods: updatedParsedFoods
  });

};


export const setMealFeeling = (meals, mealType, feeling) => {

  return updateMealState(meals, mealType, {
    feeling: feeling,
    showFeelingSelection: false
  });

};


export const toggleSymptom = (meals, mealType, symptom) => {

  const currentSymptoms = meals[mealType].symptoms || [];
  const updatedSymptoms = currentSymptoms.includes(symptom)
    ? currentSymptoms.filter(s => s !== symptom)
    : [...currentSymptoms, symptom];
  
  if(symptom === 'none') {
    return updateMealState(meals, mealType, {
      symptoms: ['none']
    });
  }
  
  const filteredSymptoms = updatedSymptoms.filter(s => s !== 'none');
  
  return updateMealState(meals, mealType, {
    symptoms: filteredSymptoms
  });

};


export const updateMealNote = (meals, mealType, note) => {

  return updateMealState(meals, mealType, {
    note: note
  });

};

