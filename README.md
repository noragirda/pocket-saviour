# PocketSaviour – High-Fidelity Coded Prototype (Phase 7)

This repository contains the **high-fidelity coded prototype** for the UID project  
**PocketSaviour – social platform for contracting services from individuals**.

The prototype is **UI-focused an UX-focused**, and works entirely with **mocked data**.

---

##  Project Goal 

- Implement realistic user flows for possible user scenarios
- Focus on **interaction, navigation, validation, UI states**
- No backend or real API calls
- Data is mocked, but behavior should feel like a real app

---

## 📁 Folder Structure
/
├── index.html # App entry point (single-page shell)
│
├── data/
│ └── mock-db.js # Mock backend data (providers, time slots, etc.)
│
├── js/
│ └── screens/
│ ├── home.js # Home screen
│ ├── app.js # Route definitions & app bootstrap
│ ├── router.js # Simple hash-based router
│ ├── store.js # Global app state (user progress &   selections)
│  ├── ui.js # Shared UI helpers (toast, loading, validation)
│ ├── task1.js # Task 1 screens (multi-step)
│ ├── task2.js # Task 2 screens (multi-step)
│ └── task3.js # Task 3 screens (multi-step)
│
├── styles/
│ └── main.css # Global styles & UI tokens
│
└── README.md # This file
## 🧩 Core Files Explained

### `index.html`
- Single-page application shell
- Contains the root `<div id="app"></div>`
- No logic inside

---

### `app.js`
- Central place where **all routes are defined**
- Connects routes to screen-rendering functions
- Example:

```js
"#/task2/results": () => Task2Results({ mount, router })

```

When adding new screens, routes must be added here
The routes are hash-based

### `store.js`
- Globalo application state(a sort of frontend memory)

### `mock-db.js`
- Mock backend data

### `screens/`
-Each user scenario lives in its own file and is split into multiple screens