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

### How to Run Locally

1. **Clone the project**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm i
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

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

This section explains how data moves through the app, from user input to storage and back.

#### Where the state lives

All meal data is stored in a single React state object in `Meals.jsx`. The structure looks like this:

```javascript
meals = {
  breakfast: {
    isExpanded: false,
    isSkipped: false,
    foodItems: "2 ragi rotis, green moong dal",
    parsedFoods: [
      { id: "food-1", name: "2 ragi rotis", portion: "small" },
      { id: "food-2", name: "green moong dal", portion: "medium" }
    ],
    feeling: "light",
    symptoms: ["none"],
    note: ""
  },
  lunch: { /* same structure */ },
  dinner: { /* same structure */ },
  snacks: { /* same structure */ }
}
```

#### App initialization (when the page loads)

1. **Check localStorage**: The app first checks if we have any saved meals for today using `loadMealsFromStorage()`.
2. **Load or create**: 
   - If saved meals exist for today → uses them to populate the state
   - If no saved meals exist → creates a fresh empty state for all meals
3. **Display**: The UI renders based on this initial state

**Example flow:**
```
Page loads → Check localStorage → Found today's breakfast? 
  → Yes: Load it → Display saved data
  → No: Create empty state → Display empty meal cards
```

#### How updates work (when user interacts)

When user interact with the app (type text, select a feeling, etc.), here's what happens:

1. **User action**: User click a button or type in a field (e.g., type "rice, dal" in the lunch text area)
2. **Component callback**: The child component (`MealCard`, `FeelingSelector`, etc.) calls a callback function passed down from `Meals.jsx`
3. **State update function**: The callback calls a pure function from `mealState.js` (like `handleFoodInputChange()`)
4. **Create new state**: The function creates a **new** meals object (React requires immutability) with user's changes
5. **Save to storage**: The new state is automatically saved to `localStorage` so it persists
6. **UI re-renders**: React detects the state change and updates the UI

**Example flow:**
```
User types "rice, dal" in lunch text area
  ↓
MealCard calls onFoodChange("rice, dal")
  ↓
Meals.jsx calls handleFoodInputChange(meals, "lunch", "rice, dal")
  ↓
Function creates new meals object with updated lunch.foodItems
  ↓
Function parses "rice, dal" into parsedFoods array
  ↓
Function saves new state to localStorage
  ↓
React re-renders → UI shows "rice, dal" and portion selectors appear
```

#### Derived fields (computed values)

Some values are automatically calculated from other data:

- **`parsedFoods`**: When we type food items (e.g., "rice, dal, salad"), the app automatically splits this text by commas and creates an array of food objects. This happens every time the text changes.
- **`showPortionSelection`**: The portion selector buttons only appear when:
  - There are parsed food items (we've typed something)
  - The meal is not skipped

**Example:**
```
User types: "rice, dal"
  ↓
parseFoodItems() automatically creates:
  [
    { id: "food-1", name: "rice", portion: null },
    { id: "food-2", name: "dal", portion: null }
  ]
  ↓
showPortionSelection becomes true (because parsedFoods.length > 0)
  ↓
UI shows portion buttons for "rice" and "dal"
```

#### Data persistence

Every time the state changes, it's automatically saved to `localStorage` under the key `nutrilog_meals`. This means:
- Our data survives page refreshes
- If we close the browser and come back later (same day), our meals are still there
- Data is stored per day (if we come back tomorrow, we'll see a fresh state)

**Important**: The app only stores today's meals. Previous days are not kept in storage (this is by design for the current version).

---

### Proposed REST APIs (future backend)

Right now everything is in `localStorage`. If/when a backend exists, these are the APIs I would expect to use.

#### Authentication APIs (if auth is added later)

1. **Register a new user**
   - **Endpoint**: `POST /api/auth/register`
   - **Purpose**: Create a new user so meals can be stored per account instead of per browser.
   - **Request body**:
     ```json
     {
       "email": "user@example.com",
       "password": "StrongPassword123",
       "name": "Jane Doe"
     }
     ```
   - **Response**:
     - `201 Created` with:
       ```json
       {
         "user": {
           "id": "user-123",
           "email": "user@example.com",
           "name": "Jane Doe"
         },
         "token": "jwt-token-here",
         "refreshToken": "refresh-token-here"
       }
       ```
   - **Error cases**:
     - `400` invalid payload (missing fields, bad email, weak password), `409` email already exists.

2. **Login**
   - **Endpoint**: `POST /api/auth/login`
   - **Purpose**: Authenticate an existing user and issue tokens.
   - **Request body**:
     ```json
     {
       "email": "user@example.com",
       "password": "StrongPassword123"
     }
     ```
   - **Response**:
     - `200 OK` with:
       ```json
       {
         "user": {
           "id": "user-123",
           "email": "user@example.com",
           "name": "Jane Doe"
         },
         "token": "jwt-token-here",
         "refreshToken": "refresh-token-here",
         "expiresIn": 3600
       }
       ```
   - **Error cases**:
     - `400` invalid payload, `401` invalid credentials.

3. **Refresh access token**
   - **Endpoint**: `POST /api/auth/refresh`
   - **Purpose**: Issue a new access token when the old one expires.
   - **Request body**:
     ```json
     {
       "refreshToken": "refresh-token-here"
     }
     ```
   - **Response**:
     - `200 OK` with:
       ```json
       {
         "token": "new-jwt-token-here",
         "expiresIn": 3600
       }
       ```
   - **Error cases**:
     - `400` missing/invalid refresh token, `401` expired or revoked refresh token.

4. **Get current user**
   - **Endpoint**: `GET /api/auth/me`
   - **Purpose**: Fetch the profile of the currently authenticated user.
   - **Request**:
     - Header: `Authorization: Bearer <token>`
   - **Response**:
     - `200 OK` with:
       ```json
       {
         "id": "user-123",
         "email": "user@example.com",
         "name": "Jane Doe",
         "createdAt": "2025-01-15T10:30:00Z"
       }
       ```
   - **Error cases**:
     - `401` not authenticated or token expired.

#### Meal & logging APIs

1. **Save or update daily meals for a date**
   - **Endpoint**: `PUT /api/users/{userId}/meals/{date}`
   - **Purpose**: Persist the full meal log for a specific user and date.
   - **Request body (example shape)**:
     ```json
     {
       "date": "2025-12-23",
       "meals": {
         "breakfast": { "...": "..." },
         "lunch": { "...": "..." },
         "dinner": { "...": "..." },
         "snacks": { "...": "..." }
       }
     }
     ```
     **Each meal**:
     ```json
     {
       "isSkipped": false,
       "foodItems": "2 ragi rotis, green moong dal, cucumber salad",
       "parsedFoods": [
         { "id": "food-1", "name": "2 ragi rotis", "portion": "small" },
         { "id": "food-2", "name": "green moong dal", "portion": "medium" }
       ],
       "feeling": "light",
       "symptoms": ["none"],
       "note": ""
     }
     ```
   - **Response**:
     - `200 OK` with saved object (including server IDs/timestamps) or `201 Created` if new.
   - **Error cases**:
     - `400` invalid date/payload, `401`/`403` auth errors, `409` if conflicting concurrent updates, `500` internal errors.

2. **Fetch meals for a given date (or range)**
   - **Endpoint**: `GET /api/users/{userId}/meals?date=2025-12-23`
   - **Purpose**: Hydrate the app on load with stored data instead of `localStorage`.
   - **Response**:
     - `200 OK` with:
       ```json
       {
         "date": "2025-12-23",
         "meals": { "...": "..." }
       }
       ```
       or an empty structure if no data yet.
   - **Error cases**:
     - `400` invalid date format, `401`/`403` auth, `404` if user not found, `500` internal.

3. **Smart defaults: get personalized meal suggestions**
   - **Endpoint**: `GET /api/users/{userId}/meal-defaults?mealType=breakfast`
   - **Purpose**: Fetch a mix of static and learned suggestions for a given meal type.
   - **Response**:
     - `200 OK` with:
       ```json
       {
         "mealType": "breakfast",
         "defaults": [
           "2 ragi rotis, green moong dal, cucumber salad",
           "Oats with milk and banana"
         ]
       }
       ```
   - **Error cases**:
     - `400` invalid `mealType`, `401`/`403` auth, `500` internal.

4. **Smart defaults: record a selected/default meal**
   - **Endpoint**: `POST /api/users/{userId}/meal-defaults`
   - **Purpose**: Let the backend capture which defaults are picked, so it can learn and rank suggestions over time.
   - **Request body**:
     ```json
     {
       "mealType": "lunch",
       "text": "2 ragi rotis, green moong dal, cucumber salad",
       "source": "user"
     }
     ```
   - **Response**:
     - `201 Created` with default ID and any updated ordering or scores.
   - **Error cases**:
     - `400` invalid shape, `401`/`403` auth, `409` duplicate constraints, `500` internal.

5. **Get symptoms & feeling taxonomy / metadata**
   - **Endpoint**: `GET /api/meta/meal-experience`
   - **Purpose**: Drive `feelingOptions`, `symptomOptions`, and `portionSizes` from backend-configured metadata instead of hardcoding.
   - **Response**:
     - `200 OK` with:
       ```json
       {
         "feelings": [
           { "value": "light", "label": "Light", "emoji": "😌" },
           { "value": "okay", "label": "Okay", "emoji": "😐" },
           { "value": "heavy", "label": "Heavy", "emoji": "😣" }
         ],
         "symptoms": [
           { "value": "bloating", "label": "Bloating" },
           { "value": "reflux", "label": "Reflux" },
           { "value": "fatigue", "label": "Fatigue" },
           { "value": "stool-change", "label": "Stool change" },
           { "value": "none", "label": "None" }
         ],
         "portions": [
           { "value": "small", "label": "Small", "icon": "🥄" },
           { "value": "medium", "label": "Medium", "icon": "🍛" },
           { "value": "large", "label": "Large", "icon": "🍽️" },
           { "value": "skip", "label": "Skip", "icon": "⏭️" },
           { "value": "no-idea", "label": "No idea", "icon": "🤷" }
         ]
       }
       ```
   - **Error cases**:
     - `500` internal, optional `503` if configuration service unavailable.

6. **Analytics-friendly export of meal logs**
   - **Endpoint**: `GET /api/users/{userId}/meals/export?from=2025-12-01&to=2025-12-31`
   - **Purpose**: Provide the nutrition/clinical team a normalized export for analysis or coaching.
   - **Response**:
     - `200 OK` with array of daily meal objects or CSV/NDJSON stream.
   - **Error cases**:
     - `400` invalid range, `401`/`403` auth, `413` if result too large, `500` internal.

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

---

### If I had 2 more hours, I would:

- **Add basic analytics / history view** to browse previous days, trends in symptoms vs meals, and a simple “calendar” summary.
- **Add authentication** so that users can authenticate themselves and meals can be tracked per user.
- **Add backend integration** so data is synced to a real API while still using `localStorage` as a cache.

---

### Internship availability (college commitments)

- **Mid-semester exams**: Unavailable from **17th Feb to 27th Feb** (inclusive).
- **End-semester exams**: Unavailable from **3th May to 13th May** (inclusive).