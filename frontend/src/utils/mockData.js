export const mealTypes = [
    {
      id: 'breakfast',
      name: 'Breakfast',
      icon: 'Coffee',
      color: 'from-orange-400 to-amber-400',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'lunch',
      name: 'Lunch',
      icon: 'Sun',
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'dinner',
      name: 'Dinner',
      icon: 'Moon',
      color: 'from-indigo-400 to-purple-400',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'snacks',
      name: 'Snacks',
      icon: 'Cookie',
      color: 'from-pink-400 to-rose-400',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      iconColor: 'text-pink-600'
    }
];
  

export const feelingOptions = [
    { value: 'light', label: 'Light', emoji: '😌' },
    { value: 'okay', label: 'Okay', emoji: '😐' },
    { value: 'heavy', label: 'Heavy', emoji: '😣' }
];
  

export const symptomOptions = [
    { value: 'bloating', label: 'Bloating' },
    { value: 'reflux', label: 'Reflux' },
    { value: 'fatigue', label: 'Fatigue' },
    { value: 'stool-change', label: 'Stool change' },
    { value: 'none', label: 'None' }
];
  

export const portionSizes = [
    { value: 'small', label: 'Small', icon: '🥄' },
    { value: 'medium', label: 'Medium', icon: '🍛' },
    { value: 'large', label: 'Large', icon: '🍽️' },
    { value: 'skip', label: 'Skip', icon: '⏭️' },
    { value: 'no-idea', label: 'No idea', icon: '🤷' }
];
  

export const smartDefaults = {
    breakfast: [
      '2 ragi rotis, green moong dal, cucumber salad',
      'Oats with milk and banana',
      'Poha with peanuts and curry leaves',
      '2 eggs, brown bread toast, orange juice',
      'Idli with sambar and coconut chutney'
    ],
    lunch: [
      '2 ragi rotis, green moong dal, cucumber salad',
      'Rice, dal tadka, mixed vegetable curry',
      'Chicken curry with 2 chapatis',
      'Rajma chawal with curd',
      'Vegetable biryani with raita'
    ],
    dinner: [
      'Khichdi with ghee and curd',
      'Grilled fish with steamed vegetables',
      'Dal, rice, and sabzi',
      'Soup and salad',
      'Paneer tikka with roti'
    ],
    snacks: [
      'Fruits (apple and banana)',
      'Tea with biscuits',
      'Namkeen and coffee',
      'Smoothie bowl',
      'Nuts and dry fruits'
    ]
};
  

export const commonFoods = [
    'roti', 'chapati', 'paratha', 'naan', 'rice', 'brown rice', 'poha', 'upma',
    'idli', 'dosa', 'uttapam', 'bread', 'brown bread',
    'dal', 'moong dal', 'toor dal', 'chana dal', 'masoor dal', 'rajma', 'chole',
    'sambhar', 'kadhi',
    'mixed vegetables', 'sabzi', 'aloo gobi', 'bhindi', 'palak', 'baingan',
    'salad', 'cucumber salad', 'tomato', 'onion',
    'paneer', 'chicken', 'fish', 'eggs', 'tofu',
    'milk', 'curd', 'yogurt', 'ghee', 'butter', 'cheese', 'raita',
    'banana', 'apple', 'orange', 'mango', 'papaya', 'watermelon',
    'namkeen', 'biscuits', 'nuts', 'dry fruits', 'chips', 'samosa', 'pakora',
    'tea', 'coffee', 'juice', 'smoothie', 'lassi', 'buttermilk'
];
  

export const parseFoodItems = (text) => {

    if(!text.trim()) return [];
    
    const items = text
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return items.map((item, index) => ({
      id: `food-${Date.now()}-${index}`,
      name: item,
      portion: null
    }));
};
  

export const getGreeting = () => {

    const hour = new Date().getHours();
    
    if(hour < 12) return 'Good morning';
    if(hour < 17) return 'Good afternoon';

    return 'Good evening';
};
  