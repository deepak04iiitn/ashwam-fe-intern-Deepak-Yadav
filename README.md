## Daily Meal Logging 

### What this is

A **single-page React app** (Vite + React) for **logging daily meals** (breakfast, lunch, dinner, snacks).  
Users can:
- **Enter free-text meals** per meal (comma-separated items).
- **Use “smart defaults”** (quick-select common meals that auto-fill the text).
- **Select portions** for each parsed food item (small / medium / large / skip / no idea).
- **Log how the meal felt** (light / okay / heavy).
- **Toggle symptoms** (bloating, reflux, fatigue, stool change, none).
- **Add notes** for anything unusual.
- Have everything **auto-saved for the current day** in `localStorage`.

---

### Assumptions

- **Single user & single day focus**: Only today’s meals are stored; no multi-user or history UI.
- **Browser with `localStorage`**: App runs in a modern browser; no SSR / Node execution.
- **Simple time handling**: “Today” is defined via `new Date().toDateString()` (no timezone handling).
- **Comma-separated input**: Food items are separated by commas in the text area.
- **No backend yet**: All persistence is client-side; the API section below is a forward-looking design.

---

### Component breakdown

- **`Meals.jsx`**
  - Top-level page that owns the `meals` React state.
  - Initializes state with `initializeMealState()` (loads today’s data from storage or builds fresh state).
  - Renders one `MealCard` per meal type from `mockData.mealTypes`.
  - Passes callbacks for all updates: toggle expand/skip, food change, defaults, portions, feelings, symptoms, notes.

- **`MealCard.jsx`**
  - Visual card for a single meal.
  - Header: meal icon, name, skipped badge, and preview of logged food text.
  - Body (when expanded):
    - Skip toggle.
    - Meal text area (“What did you have?”).
    - `SmartDefaults` button chips.
    - One `FoodItemPortionSelector` per parsed food item.
    - `FeelingSelector` (enabled when there is any text).
    - `SymptomChips` (enabled once a feeling is chosen).
    - Optional notes text area.

- **`FeelingSelector.jsx`**
  - Shows 3 selectable cards (light / okay / heavy) from `mockData.feelingOptions`.
  - Calls `onSelect(feeling)` when a card is clicked.

- **`FoodItemPortionSelector.jsx`**
  - For each parsed food item, renders portion buttons from `mockData.portionSizes`.
  - Calls `onPortionSelect(foodId, portionValue)`.

- **`SmartDefaults.jsx`**
  - Merges user-specific smart defaults from `loadSmartDefaults()` with static defaults from `mockData.smartDefaults`.
  - Renders up to 5 “Quick select” buttons; clicking one calls `onSelect(defaultText)` to fill the meal.

- **`SymptomChips.jsx`**
  - Renders symptom chips from `mockData.symptomOptions`.
  - “None” is exclusive; selecting it clears others, selecting others removes “none”.

- **`mealState.js`**
  - `initializeMealState()` – read today’s meals from storage or construct `{ breakfast, lunch, dinner, snacks }` from `initialMealState`.
  - `updateMealState(meals, mealType, updates)` – immutable update for a single meal + `saveMealsToStorage`.
  - `handleFoodInputChange()` – update free-text food, parse into `parsedFoods` using `parseFoodItems`, toggle `showPortionSelection`.
  - `toggleMealExpansion()`, `toggleMealSkipped()`, `updateFoodPortion()`, `setMealFeeling()`, `toggleSymptom()`, `updateMealNote()` – pure helpers that return new `meals` objects and persist to storage.

- **`storage.js`**
  - `saveMealsToStorage(meals)` / `loadMealsFromStorage()` – persist meals for the current day under `nutrilog_meals`.
  - `saveSmartDefaults(defaults)` / `loadSmartDefaults()` / `updateSmartDefaults(mealType, foodText)` – maintain per-meal smart defaults in `nutrilog_smart_defaults`.

- **`mockData.js`**
  - `mealTypes`, `feelingOptions`, `symptomOptions`, `portionSizes`.
  - Static `smartDefaults` for each meal.
  - `parseFoodItems(text)` – splits comma-separated text and converts to `{ id, name, portion }` objects.
  - `getGreeting()` – “Good morning/afternoon/evening” based on current hour.

---

### State & data flow

- **Top-level state**: `Meals.jsx` holds a `meals` object keyed by `breakfast`, `lunch`, `dinner`, `snacks`.
- **Initialization**:
  - `initializeMealState` → checks `loadMealsFromStorage()` for today’s date.
  - If present and date matches today, use stored meals; otherwise create a fresh per-meal state.
- **Updates**:
  - All user actions in children (`MealCard`, selectors, chips) call callbacks from `Meals.jsx`.
  - Those callbacks call pure functions in `mealState.js` with `setMeals(prev => fn(prev, ...))`.
  - Each function returns a new `meals` object and writes it through `saveMealsToStorage`.
- **Derived fields**:
  - `parsedFoods` is derived from free-text via `parseFoodItems`.
  - `showPortionSelection` is controlled based on whether there are parsed foods and the meal is not skipped.

---

### Proposed REST APIs (future backend)

Right now everything is in `localStorage`. If/when a backend exists, this is the API contract I would expect.

- **`GET /api/meals/today`**
  - **Purpose**: Fetch the authenticated user’s meals for today (or a specific date).
  - **Request**:
    - Headers: `Authorization: Bearer <token>`
    - Query params (optional): `date=YYYY-MM-DD` (defaults to today).
  - **Response 200**:
    ```json
    {
      "date": "2025-12-22",
      "meals": {
        "breakfast": {
          "isSkipped": false,
          "foodItems": "2 ragi rotis, green moong dal, cucumber salad",
          "parsedFoods": [
            { "id": "food-1", "name": "2 ragi rotis", "portion": "small" },
            { "id": "food-2", "name": "green moong dal", "portion": "medium" }
          ],
          "feeling": "light",
          "symptoms": ["none"],
          "note": "Ate early today"
        },
        "lunch": { "...": "..." },
        "dinner": { "...": "..." },
        "snacks": { "...": "..." }
      }
    }
    ```
  - **Errors**:
    - `401` – not authenticated.
    - `404` – no meals recorded for that date (frontend can treat as empty state).

- **`PUT /api/meals/today`**
  - **Purpose**: Create or replace the user’s meals for a date (idempotent).
  - **Request**:
    - Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`.
    - Body:
      ```json
      {
        "date": "2025-12-22",
        "meals": { /* same shape as GET /api/meals/today response.meals */ }
      }
      ```
  - **Response 200**:
    ```json
    { "status": "ok" }
    ```
  - **Errors**:
    - `400` – invalid payload.
    - `401` – not authenticated.

- **`GET /api/meals/history`**
  - **Purpose**: (Future) Fetch a paginated list of past days with some summary stats.
  - **Request**:
    - Query params: `page`, `pageSize`, optional `fromDate`, `toDate`.
  - **Response 200** (example shape):
    ```json
    {
      "items": [
        { "date": "2025-12-21", "summary": { "mealsLogged": 3, "symptoms": ["bloating"] } },
        { "date": "2025-12-20", "summary": { "mealsLogged": 4, "symptoms": [] } }
      ],
      "page": 1,
      "pageSize": 20,
      "total": 42
    }
    ```

- **`GET /api/smart-defaults`**
  - **Purpose**: Fetch user-specific smart defaults for each meal type.
  - **Response 200**:
    ```json
    {
      "breakfast": [ "2 ragi rotis, green moong dal, cucumber salad", "Oats with milk and banana" ],
      "lunch": [ "Rice, dal tadka, mixed vegetable curry" ],
      "dinner": [ "Khichdi with ghee and curd" ],
      "snacks": [ "Fruits (apple and banana)" ]
    }
    ```

- **`POST /api/smart-defaults`**
  - **Purpose**: Add a new smart default for a meal type.
  - **Request body**:
    ```json
    {
      "mealType": "breakfast",
      "text": "2 ragi rotis, green moong dal, cucumber salad"
    }
    ```
  - **Response 201**:
    ```json
    { "status": "created" }
    ```

---

### Known edge cases / limitations

- **`localStorage` disabled or unavailable**:  
  If `localStorage` throws (private mode / restrictions), the app logs errors and falls back to in-memory state for that session only.
- **Date change while the tab is open**:  
  “Today” is only checked when loading/saving; if midnight passes while the tab stays open, the UI won’t auto-reset to a new day until refresh.
- **ID collisions for parsed foods**:  
  `parseFoodItems` uses `Date.now()` + index; very fast repeated edits could theoretically collide, though it’s unlikely in normal use.
- **No backend validation**:  
  With only client-side storage, there is no server-side validation, deduplication, or cross-device sync.
- **Very large text inputs**:  
  Extremely long meal descriptions or many items may make the UI scroll-heavy and could impact performance in older browsers.

---

### If I had 2 more hours (as a student)

- **Add basic analytics / history view** to browse previous days, trends in symptoms vs meals, and a simple “calendar” summary.
- **Improve parsing & UX** for food input (autocomplete from `commonFoods`, better natural-language parsing, per-item quantities).
- **Add backend integration** so data is synced to a real API while still using `localStorage` as a cache.