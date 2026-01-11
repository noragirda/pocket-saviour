import { store } from "../store.js";
import { toast, renderLoading } from "../ui.js";

// Helper function for header with back button
function header(title, backHref) {
  return `
    <div class="row" style="justify-content:space-between;">
      <a class="btn ghost" href="${backHref}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

// Mock Job Data
const JOB_DATA = {
  id: 'REQ-32018',
  title: 'Fix kitchen outlet',
  desc: 'Client reports outlet not working after small power surge.',
  location: 'Strada Exemplu 12, Cluj',
  urgency: 'Fits between 2 PM and 3 PM',
  distance: '1.4 km',
  trust: 'High (5★, repeat client)'
};

// Initialize task8 data structure
function initTask8Store() {
  if (!store.get("task8")) {
    store.set("task8", {
      autoAccept: false,
      trustFilter: 'High + Repeat',
      availability: 'Available in 2–3 PM',
      calendarAdjusted: false,
      jobAccepted: false,
      status: "pending"  // pending | accepted | declined
    });
  }
}

// Task 8 Context Screen
export function Task8Context({ mount, router }) {
  initTask8Store();
  
  // Mock number of pending requests
  const pendingRequests = 1;
  
  mount(`
    <section class="screen">
      ${header("Task 8", "#/home")}
      <div class="title">Respond to a New Job Request</div>
      
      <div class="body">
        Accept or decline an incoming service opportunity. Receive intelligently prioritized recommendations based on your route, energy level, and schedule.
      </div>
      
      <div class="card">
        <div class="subtitle" style="font-size:16px;">Pending requests</div>
        <div class="title" style="font-size:48px; color:var(--primary-500);">${pendingRequests}</div>
        <div class="body muted">Jobs waiting for your response</div>
      </div>
      
      <div class="sticky-actions">
        <button class="btn primary" id="openRequestBtn">Open request</button>
      </div>
    </section>
  `);

  document.getElementById("openRequestBtn").addEventListener("click", () => {
    router.navigate("#/task8/review");
  });
}

// Review Request Summary Screen
export function Task8ReviewSummary({ mount, router }) {
  initTask8Store();

  mount(`
    <section class="screen">
      ${header("Task 8", "#/task8/context")}
      <div class="title">New request</div>

      <div class="card selectable" id="jobCard">
        <div class="subtitle" style="font-size:14px;">Job</div>
        <div class="body"><b>${JOB_DATA.title}</b></div>
        <div class="body muted">${JOB_DATA.desc}</div>
        <div class="divider"></div>
        <div class="subtitle" style="font-size:14px;">Location</div>
        <div class="body">${JOB_DATA.location} (${JOB_DATA.distance})</div>
        <div class="subtitle" style="font-size:14px; margin-top:8px;">Urgency</div>
        <div class="body">${JOB_DATA.urgency}</div>
        <div class="subtitle" style="font-size:14px; margin-top:8px;">Trust</div>
        <div class="body">${JOB_DATA.trust}</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="viewNotifBtn">View notification</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  // Make card selectable
  document.getElementById("jobCard").addEventListener("click", () => {
    document.getElementById("jobCard").classList.toggle("selected");
  });

  document.getElementById("viewNotifBtn").addEventListener("click", () => {
    router.navigate("#/task8/notification");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task8/context");
  });
}

// Push Notification View Screen
export function Task8PushNotification({ mount, router }) {
  initTask8Store();

  mount(`
    <section class="screen">
      ${header("Task 8", "#/task8/review")}
      <div class="title">Notification</div>

      <div class="notif selectable" id="notifCard">
        <div class="avatar"></div>
        <div class="col" style="flex:1;">
          <div class="subtitle" style="font-size:14px;">New job nearby</div>
          <div class="body" style="font-size:14px;">
            <b>${JOB_DATA.title}</b><br/>
            Fits between your 2 PM and 3 PM slots.<br/>
            Distance: ${JOB_DATA.distance} • High trust
          </div>
        </div>
      </div>

      <div class="card selectable" id="whyJobCard">
        <div class="subtitle" style="font-size:14px;">Why this job?</div>
        <div class="body">AI matched this based on your schedule availability and client trust level.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="decideBtn">Decide availability</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  // Make cards selectable
  document.getElementById("notifCard").addEventListener("click", () => {
    document.getElementById("notifCard").classList.toggle("selected");
  });

  document.getElementById("whyJobCard").addEventListener("click", () => {
    document.getElementById("whyJobCard").classList.toggle("selected");
  });

  document.getElementById("decideBtn").addEventListener("click", () => {
    router.navigate("#/task8/availability");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task8/review");
  });
}

// Decide Availability / Auto-Accept Screen
export function Task8DecideAvailability({ mount, router }) {
  initTask8Store();
  const autoAccept = store.get("task8.autoAccept");
  const trustFilter = store.get("task8.trustFilter");
  const distanceFilter = store.get("task8.distanceFilter") || "≤ 2 km";

  mount(`
    <section class="screen">
      ${header("Task 8", "#/task8/notification")}
      <div class="title">Availability & Auto-Accept</div>
      <div class="body muted">Choose if you want to take this job, and how similar jobs should be handled.</div>

      <div class="card">
        <div class="label">Current slot</div>
        <div class="body">Free: 14:00–15:00</div>
        <div class="body muted">Job duration estimate: 35–45 minutes.</div>
      </div>

      <div class="card">
        <div class="label">Auto-Accept</div>
        <div class="row" style="align-items:center; gap:12px;">
          <button class="chip selectable ${autoAccept ? 'active' : ''}" id="autoAcceptChip">
            Toggle
          </button>
          <div class="body muted" id="autoText">
            ${autoAccept ? 'Auto-Accept on.' : 'Auto-Accept off.'}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="label">Trust / distance filter</div>
        <div class="chips" id="filterChips">
          <div class="chip selectable ${trustFilter === 'High + Repeat' ? 'active' : ''}" data-type="trust" data-value="High + Repeat">High + Repeat</div>
          <div class="chip selectable ${trustFilter === 'High Trust only' ? 'active' : ''}" data-type="trust" data-value="High Trust only">High Trust only</div>
          <div class="chip selectable ${distanceFilter === '≤ 2 km' ? 'active' : ''}" data-type="distance" data-value="≤ 2 km">≤ 2 km</div>
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="acceptBtn">Accept this job</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  // Auto-Accept toggle
  document.getElementById("autoAcceptChip").addEventListener("click", () => {
    const newValue = !store.get("task8.autoAccept");
    store.set("task8.autoAccept", newValue);
    
    const chip = document.getElementById("autoAcceptChip");
    const text = document.getElementById("autoText");
    
    chip.classList.toggle("active", newValue);
    text.textContent = newValue ? 'Auto-Accept on.' : 'Auto-Accept off.';
    
    toast(newValue ? "Auto-Accept enabled" : "Auto-Accept disabled", "success");
  });

  // Filter chips selection
  document.querySelectorAll("#filterChips .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const filterType = chip.getAttribute("data-type");
      const filterValue = chip.getAttribute("data-value");
      
      if (filterType === "trust") {
        // Remove active from all trust chips
        document.querySelectorAll("#filterChips .chip[data-type='trust']").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        store.set("task8.trustFilter", filterValue);
        toast(`Trust filter: ${filterValue}`, "info");
      } else if (filterType === "distance") {
        // Toggle distance filter
        chip.classList.toggle("active");
        const isActive = chip.classList.contains("active");
        store.set("task8.distanceFilter", isActive ? filterValue : null);
        toast(isActive ? `Distance filter: ${filterValue}` : "Distance filter removed", "info");
      }
    });
  });

  document.getElementById("acceptBtn").addEventListener("click", () => {
    router.navigate("#/task8/calendar");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task8/notification");
  });
}

// AI Adjusts Calendar Screen
export function Task8AIAdjustCalendar({ mount, router }) {
  initTask8Store();
  const calendarChoice = store.get("task8.calendarChoice") || null; // 'ai-adjust' or 'keep-current'

  mount(`
    <section class="screen">
      ${header("Task 8", "#/task8/availability")}
      <div class="title">AI calendar adjustment</div>
      <div class="body muted">We can slightly shift nearby jobs to accommodate this one.</div>

      <div class="card">
        <div class="label">Your day</div>
        <div class="body">
          <b>Before:</b><br/>
          • 13:00–14:00: Plumbing job<br/>
          • 14:30–15:00: Inspection visit<br/>
          <br/>
          <b>After (optimized):</b><br/>
          • 13:00–14:00: Plumbing job<br/>
          • <span style="color:var(--primary-500);"><b>14:00–15:00: Fix kitchen outlet (NEW)</b></span><br/>
          • 15:00–15:30: Inspection visit (shifted)
        </div>
        <div class="body muted" style="margin-top:8px;">No adjustments yet.</div>
        <div class="row" style="gap:8px; margin-top:12px; flex-wrap:wrap;">
          <button class="chip selectable ${calendarChoice === 'ai-adjust' ? 'active' : ''}" id="aiAdjustBtn">Let AI adjust</button>
          <button class="chip selectable ${calendarChoice === 'keep-current' ? 'active' : ''}" id="keepCurrentBtn">Keep current</button>
        </div>
      </div>

      <div class="card">
        <div class="label">What changes</div>
        <div class="body muted">
          If earlier job ends at 13:40, we advance this job to 14:10 automatically.
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="acceptBtn">Accept job</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  // Let AI adjust button
  document.getElementById("aiAdjustBtn").addEventListener("click", () => {
    store.set("task8.calendarChoice", "ai-adjust");
    document.getElementById("aiAdjustBtn").classList.add("active");
    document.getElementById("keepCurrentBtn").classList.remove("active");
    toast("AI will adjust your calendar", "success");
  });

  // Keep current button
  document.getElementById("keepCurrentBtn").addEventListener("click", () => {
    store.set("task8.calendarChoice", "keep-current");
    document.getElementById("keepCurrentBtn").classList.add("active");
    document.getElementById("aiAdjustBtn").classList.remove("active");
    toast("Calendar will stay as-is", "info");
  });

  document.getElementById("acceptBtn").addEventListener("click", () => {
    const btn = document.getElementById("acceptBtn");
    btn.disabled = true;
    btn.textContent = "Processing...";
    
    // Show loading animation
    mount(`
      <section class="screen">
        ${header("Task 8", "#/task8/availability")}
        <div class="title">Processing your request</div>
        ${renderLoading("Confirming job acceptance and updating calendar...")}
      </section>
    `);
    
    // Wait 5 seconds before navigating
    setTimeout(() => {
      store.set("task8.calendarAdjusted", true);
      store.set("task8.jobAccepted", true);
      store.set("task8.status", "accepted");
      
      toast("Job accepted!", "success");
      router.navigate("#/task8/await");
    }, 5000);
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task8/availability");
  });
}

// Await Confirmation Screen
export function Task8AwaitConfirmation({ mount, router }) {
  initTask8Store();

  mount(`
    <section class="screen">
      ${header("Task 8", "#/task8/calendar")}
      <div class="title">Awaiting client confirmation ✅</div>
      <div class="body muted">You accepted the job. We sent a confirmation to the beneficiary.</div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Job details</div>
        <div class="body">
          <b>${JOB_DATA.title}</b><br/>
          ${JOB_DATA.location}<br/>
          Scheduled: 14:00–15:00
        </div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Status</div>
        <div class="status wait">● Waiting for client response</div>
        <div class="body muted" style="margin-top:8px;">
          You'll be notified once the client confirms or if they need to reschedule.
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="doneBtn">Done</button>
        <a class="btn secondary" href="#/home">Go home</a>
      </div>
    </section>
  `);

  document.getElementById("doneBtn").addEventListener("click", () => {
    toast("Job request handled successfully!", "success");
    router.navigate("#/task8/context");
  });
}
