const DEFAULT_STORE = {
  user: {
    name: "Mara",
    city: "Cluj-Napoca",
    savedAddress: "Str. Memorandumului 12, Ap. 5",
    activeRole: "client"
  },

  ui: {
    loading: false,
    loadingText: "",
    activeHomeTab: "services" // services | activity
  },

  task1: {
    category: null,
    symptoms: "",
    urgency: null,
    address: "",
    selectedProviderId: null,
    requestStatus: "draft" // draft | submitted
  },
  task2: {
    problem: null,
    filters: { maxDistanceKm: 10, minRating: 4.0, maxVisitFee: 200 },
    results: [],
    savedProviderIds: [],
    selectedProviderId: null,
    messageDraft: "",
    bookingStatus: "draft" // draft | confirmed
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
    bookingStatus: "draft" // draft | confirmed
  },

  task4: {
    description: "",
    mediaFiles: [], 
    uploadStatus: "idle",
    status: "idle"
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
  },

  task8: {
    activeRequestId: null,
    chatHistory: [],
    negotiationStatus: "pending",
    status: "pending"
  },
  task9: {
    pendingInvoices: [],
    selectedMethod: null,
    paymentStatus: "pending"
  },
  task10: {
    activeJobId: null,
    currentStatus: "en_route",
    statusProof: [],
    status: "in_progress"
  },

  task11: {
    providerId: null,
    verificationSteps: { id: false, background: false, skills: false },
    approvalStatus: "pending"
  },
  task12: {
    selectedDisputeId: null,
    adminNotes: "",
    ruling: null,
    status: "pending"
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
  } catch {}
}