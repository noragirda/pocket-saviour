const DEFAULT_STORE = {
  user: {
    name: "Mara",
    city: "Cluj-Napoca",
    savedAddress: "Str. Memorandumului 12, Ap. 5",
    activeRole: "client" 
  },

  ui: {
    loading: false,
    loadingText: ""
  },

  task1: {
    category: null,
    symptoms: "",
    urgency: null,
    address: "",
    selectedProviderId: null,
    requestStatus: "draft"
  },
  task2: {
    problem: null,
    filters: { maxDistanceKm: 10, minRating: 4.0, maxVisitFee: 200 },
    results: [],
    savedProviderIds: [],
    selectedProviderId: null,
    messageDraft: "",
    bookingStatus: "draft"
  },
  task3: {
    appliance: null,
    issue: "",
    urgency: null,
    date: "",
    timeSlot: "",
    address: "",
    selectedProviderId: null,
    notes: "",
    bookingStatus: "draft"
  },

  task5: {
    selectedJobId: null,
    reflection: {},
    rating: 0,
    feedback: "",
    submitted: false
  },
  task6: {
    selectedJobId: null,
    complaint: "",
    evidenceFiles: [],
    resolution: null,
    caseId: null
  },
  task7: {
    identity: { name: "", phone: "", email: "" },
    credentials: [],
    services: [],
    coverageArea: "",
    availability: [],
    status: "draft"
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
  }
}