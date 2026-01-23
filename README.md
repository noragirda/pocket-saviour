# PocketSaviour – High-Fidelity Coded Prototype (Phase 7)

This repository contains the **high-fidelity coded prototype** for the UID project  
**PocketSaviour – social platform for contracting services from individuals**.

The prototype is **UI-focused and UX-focused**, working entirely with **mocked data** to simulate a fully functional application without a backend.

---

## 🎯 Project Goal

- Implement realistic user flows for **12 distinct user scenarios** (Beneficiary, Provider, Admin).
- Focus on **interaction, navigation, validation, and UI states**.
- **Role-Based Experience**: The app simulates three different user perspectives (Client, Provider, Admin) via a dashboard switcher.
- **No backend**: Data is mocked but persists during the session via local state.

---

## 📁 Folder Structure

```text
/
├── index.html             # App entry point (loads styles & modules)
│
├── data/
│   └── mock-db.js         # Unified mock database (Providers, Jobs, Disputes, etc.)
│
├── js/
│   ├── app.js             # Route definitions & app bootstrap
│   ├── router.js          # Simple hash-based router
│   ├── store.js           # Global app state (handles all 12 tasks + User Role)
│   ├── ui.js              # Shared UI helpers (toast, loading, validation)
│   │
│   └── screens/           # Logic for each specific user task
│       ├── home.js        # Smart Dashboard (Role Switcher: Client/Provider/Admin)
│       ├── task1.js       # Task 1: Emergency Power Outage
│       ├── task2.js       # Task 2: Find Plumber (Filtering)
│       ├── task3.js       # Task 3: Schedule Appliance Repair
│       ├── task4.js       # Task 4: Share Media (AI Vision mock)
│       ├── task5.js       # Task 5: Review & Rate Job
│       ├── task6.js       # Task 6: Report an Issue
│       ├── task7.js       # Task 7: Register as Provider
│       ├── task8.js       # Task 8: Respond to Job Request (Provider)
│       ├── task9.js       # Task 9: Manage Appointments
│       ├── task10.js      # Task 10: Update Work Status
│       ├── task11.js      # Task 11: Verify Credentials (Admin)
│       └── task12.js      # Task 12: Moderate Disputes (Admin)
│
├── styles/
│   ├── base.css           # Reset & Layout
│   ├── tokens.css         # Colors, Typography, Variables
│   ├── components.css     # Buttons, Cards, Inputs, Chips
│   ├── task4.css          # Specific styles for Media Capture
│   ├── task8.css          # Specific styles for Provider Notifications
│   └── task12.css         # Specific styles for Admin Disputes
│
└── README.md              # This file

Developer Commands:
Shift + R = Reset the state of the app to the initial one
Shift + 1 = Client View
Shift + 2 = Provider View
Shift + 3 = Admin View
