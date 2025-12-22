const STORAGE_KEY = 'nutrilog_meals';
const SMART_DEFAULTS_KEY = 'nutrilog_smart_defaults';

export const saveMealsToStorage = (meals) => {

  try {
    const today = new Date().toDateString();
    const data = {
      date: today,
      meals: meals
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;

  } catch (error) {
    console.error('Error saving meals to storage:', error);
    return false;
  }

};


export const loadMealsFromStorage = () => {

  try {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if(!stored) return null;
    
    const data = JSON.parse(stored);
    
    if(data.date === today) {
      return data.meals;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading meals from storage:', error);
    return null;
  }

};


export const saveSmartDefaults = (defaults) => {

  try {
    localStorage.setItem(SMART_DEFAULTS_KEY, JSON.stringify(defaults));
    return true;
  } catch (error) {
    console.error('Error saving smart defaults:', error);
    return false;
  }

};


export const loadSmartDefaults = () => {

  try {
    const stored = localStorage.getItem(SMART_DEFAULTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading smart defaults:', error);
    return {};
  }

};


export const updateSmartDefaults = (mealType, foodText) => {

  if(!foodText || !foodText.trim()) return;
  
  const defaults = loadSmartDefaults();
  const mealDefaults = defaults[mealType] || [];
  
  if(!mealDefaults.includes(foodText.trim())) {
    mealDefaults.unshift(foodText.trim());
    defaults[mealType] = mealDefaults.slice(0, 10);
    saveSmartDefaults(defaults);
  }

};

