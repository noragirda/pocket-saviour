import { store } from "../store.js";
import { toast } from "../ui.js";

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
  
  mount(`
    <section class="screen">
      ${header("Task 8", "#/home")}
      <div class="title">Respond to a New Job Request</div>
      
      <div class="card">
        <div class="subtitle">Purpose & Motivation</div>
        <div class="body">
          Accept or decline an incoming service opportunity.
          Receive intelligently prioritized recommendations based on your route, energy level, and schedule.
        </div>
        <div class="divider"></div>
        <div class="row" style="flex-wrap:wrap; gap:8px;">
          <span class="badge">Context: Provider receives notification</span>
          <span class="badge">Starting point: Pending request</span>
          <span class="badge">AI-assisted scheduling</span>
        </div>
      </div>
      
      <div class="card">
        <div class="subtitle" style="font-size:14px;">Flow steps</div>
        <ol class="body" style="padding-left:20px; margin:8px 0;">
          <li>Review request summary (location, urgency, description)</li>
          <li>Receive push notification about job fit</li>
          <li>Decide availability / Enable Auto-Accept</li>
          <li>AI dynamically adjusts calendar</li>
          <li>Await confirmation from beneficiary</li>
        </ol>
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

      <div class="card">
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

      <div class="notif">
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

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Why this job?</div>
        <div class="body">AI matched this based on your schedule availability and client trust level.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="decideBtn">Decide availability</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

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

  mount(`
    <section class="screen">
      ${header("Task 8", "#/task8/notification")}
      <div class="title">Availability & Auto-Accept</div>
      <div class="body muted">Choose if you want to take this job, and how similar jobs should be handled.</div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">This job</div>
        <div class="body">You're available in the requested slot (2–3 PM).</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Auto-Accept future jobs</div>
        <div class="chips">
          <div class="chip ${autoAccept ? 'active' : ''}" id="autoAcceptChip" style="cursor:pointer;">
            Enable Auto-Accept
          </div>
        </div>
        <div class="body muted" style="font-size:14px; margin-top:8px;" id="autoText">
          ${autoAccept ? 'Auto-Accept enabled for high-fit jobs.' : 'Auto-Accept off.'}
        </div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Trust filter</div>
        <div class="chips" id="trustChips">
          <div class="chip ${trustFilter === 'High + Repeat' ? 'active' : ''}" data-trust="High + Repeat">High + Repeat</div>
          <div class="chip ${trustFilter === 'Medium+' ? 'active' : ''}" data-trust="Medium+">Medium+</div>
          <div class="chip ${trustFilter === 'All' ? 'active' : ''}" data-trust="All">All</div>
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
    text.textContent = newValue ? 'Auto-Accept enabled for high-fit jobs.' : 'Auto-Accept off.';
    
    toast(newValue ? "Auto-Accept enabled" : "Auto-Accept disabled", "success");
  });

  // Trust filter selection
  document.querySelectorAll("#trustChips .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const trust = chip.getAttribute("data-trust");
      store.set("task8.trustFilter", trust);
      
      document.querySelectorAll("#trustChips .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      
      toast(`Trust filter: ${trust}`, "info");
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
  const calendarAdjusted = store.get("task8.calendarAdjusted");

  mount(`
    <section class="screen">
      ${header("Task 8", "#/task8/availability")}
      <div class="title">AI calendar adjustment</div>
      <div class="body muted">We can slightly shift nearby jobs to accommodate this one.</div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Suggested adjustment</div>
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
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">AI Action</div>
        <div class="body muted" id="aiAdjustMsg">
          ${calendarAdjusted ? 'AI shifted earlier slot to make room at 14:30.' : 'Ready to apply adjustment.'}
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="applyBtn">Apply & Accept job</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  document.getElementById("applyBtn").addEventListener("click", () => {
    store.set("task8.calendarAdjusted", true);
    store.set("task8.jobAccepted", true);
    store.set("task8.status", "accepted");
    
    toast("Calendar updated & job accepted!", "success");
    
    setTimeout(() => {
      router.navigate("#/task8/await");
    }, 500);
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
