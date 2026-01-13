/* data/mock-db.js */

// --- BASE DATA (Tasks 1, 2, 3) ---
export const ELECTRICIANS = [
  { id: "e1", name: "Alex Ionescu", rating: 4.9, etaMin: 25, price: "120–180 RON", distanceKm: 2.1 },
  { id: "e2", name: "Mihai Pop", rating: 4.7, etaMin: 40, price: "100–160 RON", distanceKm: 3.8 },
  { id: "e3", name: "Radu Mureșan", rating: 4.6, etaMin: 55, price: "90–150 RON", distanceKm: 5.2 },
];

export const PLUMBERS = [
  { id: "p1", name: "Bogdan Matei", rating: 4.9, distanceKm: 2.4, visitFee: 150, warranty: "6 months", etaMin: 35 },
  { id: "p2", name: "Andrei Stoica", rating: 4.7, distanceKm: 4.8, visitFee: 120, warranty: "3 months", etaMin: 55 },
  { id: "p3", name: "Rareș Dima", rating: 4.6, distanceKm: 8.2, visitFee: 90,  warranty: "No warranty", etaMin: 80 },
  { id: "p4", name: "Vlad Iuga", rating: 4.8, distanceKm: 12.5, visitFee: 200, warranty: "12 months", etaMin: 70 },
];

export const APPLIANCE_TECHNICIANS = [
  { id: "a1", name: "Sorin Dinu", rating: 4.8, etaDays: 1, visitFee: 140, speciality: "Kitchen appliances" },
  { id: "a2", name: "Ioana Rusu", rating: 4.9, etaDays: 2, visitFee: 170, speciality: "Washing machines" },
  { id: "a3", name: "Cătălin Mureșan", rating: 4.6, etaDays: 3, visitFee: 120, speciality: "General repairs" },
];

export const TIME_SLOTS = [
  "08:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00",
];

// --- ADI'S DATA (Tasks 5, 6) ---
export const COMPLETED_JOBS = [
  {
    id: "job_101",
    title: "Fix Kitchen Outlet",
    provider: "Ion Pop",
    role: "Electrician",
    date: "Yesterday",
    price: "150 RON",
    canRate: true,
    canReport: true
  },
  {
    id: "job_102",
    title: "Leaking Pipe Repair",
    provider: "Andrei Stan",
    role: "Plumber",
    date: "08 Oct 2025",
    price: "200 RON",
    canRate: false,
    canReport: true
  },
  {
    id: "job_103",
    title: "Washing Machine Install",
    provider: "Maria Voicu",
    role: "Appliance Tech",
    date: "01 Oct 2025",
    price: "120 RON",
    canRate: true,
    canReport: false // Too old
  }
];

// --- PATRICIA'S DATA (Tasks 9, 11) ---
export const PROVIDER_APPOINTMENTS = [
  { id: 101, client: "Ana M.", job: "Oven Repair", address: "Str. Lalelelor 14", start: "09:00", end: "10:00", distanceKm: 2.8, status: "pending", date: "Today" },
  { id: 102, client: "Casa Verde", job: "Stove Ignition", address: "Bd. Eroilor 7", start: "10:15", end: "11:00", distanceKm: 1.2, status: "pending", date: "Today" },
  { id: 103, client: "Ion P.", job: "Dishwasher Leak", address: "Str. Plopilor 23", start: "10:45", end: "11:30", distanceKm: 4.7, status: "pending", date: "Today" },
  { id: 104, client: "Maria I.", job: "Fridge Cooling", address: "Str. Horea 5", start: "12:30", end: "13:30", distanceKm: 5.1, status: "pending", date: "Today" }
];

export const PENDING_PROVIDERS = [
  { id: "prov_new_1", name: "Ion Pop", role: "Electrician", submittedTime: "2 hours ago", status: "pending", 
    docs: { idFront: true, idBack: true, license: true, insurance: true },
    issues: [] 
  },
  { id: "prov_new_2", name: "Dan Repair SRL", role: "Appliance Tech", submittedTime: "5 hours ago", status: "pending",
    docs: { idFront: true, idBack: true, license: true, insurance: false },
    issues: ["Missing Insurance"] 
  }
];