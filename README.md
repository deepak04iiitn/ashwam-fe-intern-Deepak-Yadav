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

Right now everything is in `localStorage`. If/when a backend exists, this is the API contract I would expect.

#### Authentication APIs

- **`POST /api/auth/register`**
  - **Purpose**: Register a new user account.
  - **Request**:
    - Headers: `Content-Type: application/json`
    - Body:
      ```json
      {
        "email": "user@example.com",
        "password": "securePassword123",
        "name": "John Doe"
      }
      ```
  - **Response 201**:
    ```json
    {
      "status": "created",
      "user": {
        "id": "user-123",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh_token_here"
    }
    ```
  - **Errors**:
    - `400` – invalid payload (missing fields, invalid email format, weak password).
    - `409` – email already exists.

- **`POST /api/auth/login`**
  - **Purpose**: Authenticate user and receive access token.
  - **Request**:
    - Headers: `Content-Type: application/json`
    - Body:
      ```json
      {
        "email": "user@example.com",
        "password": "securePassword123"
      }
      ```
  - **Response 200**:
    ```json
    {
      "status": "ok",
      "user": {
        "id": "user-123",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh_token_here",
      "expiresIn": 3600
    }
    ```
  - **Errors**:
    - `400` – invalid payload (missing email or password).
    - `401` – invalid credentials.

- **`POST /api/auth/logout`**
  - **Purpose**: Logout user and invalidate refresh token.
  - **Request**:
    - Headers: `Authorization: Bearer <token>`
    - Body (optional):
      ```json
      {
        "refreshToken": "refresh_token_here"
      }
      ```
  - **Response 200**:
    ```json
    {
      "status": "ok",
      "message": "Logged out successfully"
    }
    ```
  - **Errors**:
    - `401` – not authenticated.

- **`POST /api/auth/refresh`**
  - **Purpose**: Refresh access token using refresh token.
  - **Request**:
    - Headers: `Content-Type: application/json`
    - Body:
      ```json
      {
        "refreshToken": "refresh_token_here"
      }
      ```
  - **Response 200**:
    ```json
    {
      "status": "ok",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
    ```
  - **Errors**:
    - `400` – missing or invalid refresh token.
    - `401` – refresh token expired or invalid.

- **`GET /api/auth/me`**
  - **Purpose**: Get current authenticated user's information.
  - **Request**:
    - Headers: `Authorization: Bearer <token>`
  - **Response 200**:
    ```json
    {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-15T10:30:00Z"
    }
    ```
  - **Errors**:
    - `401` – not authenticated or token expired.

#### Meals APIs

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
    - Headers: `Authorization: Bearer <token>`
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
  - **Errors**:
    - `401` – not authenticated.

- **`GET /api/smart-defaults`**
  - **Purpose**: Fetch user-specific smart defaults for each meal type.
  - **Request**:
    - Headers: `Authorization: Bearer <token>`
  - **Response 200**:
    ```json
    {
      "breakfast": [ "2 ragi rotis, green moong dal, cucumber salad", "Oats with milk and banana" ],
      "lunch": [ "Rice, dal tadka, mixed vegetable curry" ],
      "dinner": [ "Khichdi with ghee and curd" ],
      "snacks": [ "Fruits (apple and banana)" ]
    }
    ```
  - **Errors**:
    - `401` – not authenticated.

- **`POST /api/smart-defaults`**
  - **Purpose**: Add a new smart default for a meal type.
  - **Request**:
    - Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
    - Body:
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
  - **Errors**:
    - `400` – invalid payload (missing mealType or text).
    - `401` – not authenticated.

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