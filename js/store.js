//Purpose of this: make it a central store for data that needs to be shared across multiple screens/components, basically a mocked storage for state management.
// it's allowing user data to persist across screens and enabling realistic navigation, validation, confirmation, and error flows without a backend.
const DEFAULT_STORE = {
  user: {
    name: "Mara",
    city: "Cluj-Napoca",
    savedAddress: "Str. Memorandumului 12, Ap. 5"
  },

  ui: {
    loading: false,
    loadingText: ""
  },

  task1: {
    category: null,          // e.g. "Power outage"
    symptoms: "",            // optional details
    urgency: null,           // "Emergency" | "Today" | "This week"
    address: "",             // input
    selectedProviderId: null,
    requestStatus: "draft"   // draft | sent
  },
  task2: {
  problem: null,                 // e.g. "Kitchen leak"
  filters: {
    maxDistanceKm: 10,
    minRating: 4.0,
    maxVisitFee: 200
  },
  results: [],                   // optional cache for last filtered results
  savedProviderIds: [],          // must pick 2 for comparison
  selectedProviderId: null,      // for contact / booking
  messageDraft: "",              // mock chat message
  bookingStatus: "draft"         // draft | confirmed
},
task3: {
  appliance: null,              // "Stove", "Washing machine", etc.
  issue: "",                    // description
  urgency: null,               // "Today" | "This week"
  date: "",                    // YYYY-MM-DD
  timeSlot: "",                // "10:00–12:00"
  address: "",                 // prefill from user
  selectedProviderId: null,
  notes: "",
  bookingStatus: "draft"       // draft | confirmed
}


};

const KEY = "ps_store_v1";

export const store = {
  state: load(),
  set(path, value) {
    const parts = path.split(".");
    let obj = store.state;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
    obj[parts[parts.length - 1]] = value;
    save(store.state);
  },
  get(path) {
    const parts = path.split(".");
    let obj = store.state;
    for (const p of parts) obj = obj?.[p];
    return obj;
  },
  reset() {
    store.state = structuredClone(DEFAULT_STORE);
    save(store.state);
  }
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STORE);
    return { ...structuredClone(DEFAULT_STORE), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_STORE);
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors in prototype
  }
}

