import { store } from "../store.js";
import { PROVIDER_APPOINTMENTS } from "../../data/mock-db.js";
import { toast } from "../ui.js";

function header(title, backPath) {
  return `
    <div class="row" style="justify-content:space-between; margin-bottom:16px;">
      <a class="btn ghost" href="${backPath}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

// Helper: Check time overlap
function checkConflicts(list) {
  const conflicts = new Set();
  const timeToMin = (t) => { const [h,m]=t.split(':').map(Number); return h*60+m; };
  for(let i=0; i<list.length; i++){
    for(let j=i+1; j<list.length; j++){
      const a = list[i], b = list[j];
      const startA = timeToMin(a.start), endA = timeToMin(a.end);
      const startB = timeToMin(b.start), endB = timeToMin(b.end);
      if(startA < endB && startB < endA) { conflicts.add(a.id); conflicts.add(b.id); }
    }
  }
  return conflicts;
}

export function Task9List({ mount, router }) {
  const sortMode = store.get("task9.sort") || "time";
  
  // Logic: Sort appointments
  let list = [...PROVIDER_APPOINTMENTS];
  if (sortMode === "time") {
    list.sort((a,b) => a.start.localeCompare(b.start));
  } else {
    list.sort((a,b) => a.distanceKm - b.distanceKm);
  }

  const conflicts = checkConflicts(list);

  // Render
  const renderItem = (appt) => `
    <div class="card" style="margin-bottom:8px; border-left: 4px solid ${conflicts.has(appt.id) ? 'var(--error-500)' : 'transparent'}">
      <div class="row" style="justify-content:space-between;">
        <div class="subtitle" style="font-size:16px;">${appt.start} – ${appt.end}</div>
        ${conflicts.has(appt.id) ? '<span class="badge" style="color:red;border-color:red;">Conflict</span>' : ''}
      </div>
      <div class="body"><b>${appt.client}</b> • ${appt.job}</div>
      <div class="body muted">${appt.address} • ${appt.distanceKm} km</div>
    </div>
  `;

  mount(`
    <section class="screen">
      ${header("My Schedule", "#/home")}
      <div class="title">Today • Active Jobs</div>
      
      ${conflicts.size > 0 ? `
        <div class="card" style="background:#FEF2F2; border-color:#FCA5A5;">
          <div class="body" style="color:#B91C1C;">⚠️ Overlapping jobs detected.</div>
        </div>
      ` : ''}

      <div class="row">
        <button class="chip" id="sortTime" aria-pressed="${sortMode==='time'}">Sort: Time</button>
        <button class="chip" id="sortDist" aria-pressed="${sortMode==='distance'}">Sort: Distance</button>
      </div>

      <div class="list">${list.map(renderItem).join("")}</div>

      <div class="sticky-actions">
        <button class="btn primary" id="checkProx">Check proximity & route</button>
      </div>
    </section>
  `);

  document.getElementById("sortTime").onclick = () => { store.set("task9.sort", "time"); Task9List({mount, router}); };
  document.getElementById("sortDist").onclick = () => { store.set("task9.sort", "distance"); Task9List({mount, router}); };
  document.getElementById("checkProx").onclick = () => router.navigate("#/task9/proximity");
}

export function Task9Proximity({ mount, router }) {
  const sortMode = store.get("task9.sort") || "time";
  
  // 1. Prepare data
  let list = [...PROVIDER_APPOINTMENTS];
  if (sortMode === "time") {
    list.sort((a,b) => a.start.localeCompare(b.start));
  } else {
    list.sort((a,b) => a.distanceKm - b.distanceKm);
  }

  // 2. Check for conflicts to decide the flow
  const conflicts = checkConflicts(list);
  const hasConflicts = conflicts.size > 0;

  // 3. Generate route visualization
  const routeString = list.map(a => a.address).join(' <br>↓<br> ');

  mount(`
    <section class="screen">
      ${header("Optimization", "#/task9/list")}
      <div class="title">Proximity & Order</div>
      <div class="body muted">Minimize travel by grouping nearby addresses.</div>

      <div class="card">
         <div class="subtitle" style="font-size:14px;">
            ${sortMode === 'time' ? 'Current Schedule (Fixed)' : 'Suggested Efficiency (Ideal)'}
         </div>
         
         <div style="background:#e2e8f0; border-radius:8px; padding: 20px; display:flex; flex-direction:column; align-items:center; text-align:center; color:#475569; font-weight:500;">
            <div style="font-size:24px; margin-bottom:10px;">🚗</div>
            ${routeString}
            <div style="font-size:24px; margin-top:10px;">🏁</div>
         </div>

         ${sortMode === 'distance' ? `
           <div class="body small" style="color:var(--warning-500); margin-top:8px;">
             ⚠️ Note: This order may differ from booked times.
           </div>
         ` : ''}
         
         ${!hasConflicts ? `
           <div class="divider"></div>
           <div class="row" style="gap:8px;">
             <span class="badge" style="background:#dcfce7; color:#166534; border-color:#bbf7d0;">✓ No conflicts detected</span>
           </div>
         ` : ''}
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="optimize">
          ${sortMode === 'time' ? 'Show Efficient Route' : 'Reset to Schedule'}
        </button>

        ${hasConflicts 
          ? `<button class="btn primary" id="resolveConflict">Resolve Conflicts (Adjust)</button>` 
          : `<button class="btn primary" id="goConfirm">Confirm Attendance</button>`
        }
        
        ${!hasConflicts 
          ? `<button class="btn ghost" id="manualAdjust">Adjust availability (Optional)</button>` 
          : ``
        }
      </div>
    </section>
  `);

  // Event Handlers
  document.getElementById("optimize").onclick = () => {
    const newSort = sortMode === "time" ? "distance" : "time";
    store.set("task9.sort", newSort);
    const msg = newSort === "distance" ? "Showing most efficient path" : "Restored scheduled order";
    toast(msg);
    Task9Proximity({ mount, router });
  };

  if (hasConflicts) {
    // If conflicts exist, force them to go to Adjust screen
    document.getElementById("resolveConflict").onclick = () => router.navigate("#/task9/adjust");
  } else {
    // If NO conflicts, allow skipping straight to Confirmation
    document.getElementById("goConfirm").onclick = () => router.navigate("#/task9/confirm");
    // But keep the manual adjust option just in case
    document.getElementById("manualAdjust").onclick = () => router.navigate("#/task9/adjust");
  }
}

export function Task9Adjust({ mount, router }) {
  const blocked = new Set(store.get("task9.blockedSlots") || []);

  const renderBlock = (time) => {
    const isActive = blocked.has(time);
    return `<button class="chip" data-time="${time}" aria-pressed="${isActive}" 
      style="${isActive ? 'border-color:orange; color:orange;' : ''}">${time}</button>`;
  };

  mount(`
    <section class="screen">
      ${header("Availability", "#/task9/proximity")}
      <div class="title">Resolve Conflicts</div>
      <div class="body">Block time windows to prevent new bookings or resolve overlaps.</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Block time windows</div>
        <div class="chips">
          ${["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00"].map(renderBlock).join("")}
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="confirm">Confirm Attendance</button>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-time]").forEach(btn => {
    btn.onclick = () => {
      const t = btn.dataset.time;
      if (blocked.has(t)) blocked.delete(t); else blocked.add(t);
      store.set("task9.blockedSlots", Array.from(blocked));
      Task9Adjust({ mount, router }); // Re-render to update style
    };
  });

  document.getElementById("confirm").onclick = () => router.navigate("#/task9/confirm");
}

export function Task9Confirm({ mount, router }) {
  const confirmed = new Set(store.get("task9.confirmedIds") || []);
  const list = PROVIDER_APPOINTMENTS; // Showing original time order usually

  const renderRow = (appt) => {
    const isConfirmed = confirmed.has(appt.id);
    return `
      <div class="card" style="flex-direction:row; align-items:center; justify-content:space-between;">
        <div style="flex: 1;">
          <div class="row" style="gap: 8px; margin-bottom: 4px;">
            <div class="subtitle" style="font-size:16px;">${appt.start}</div>
            <span class="badge" style="${isConfirmed ? 'background:#dcfce7; color:#166534; border-color:#bbf7d0;' : 'background:#f1f5f9; color:#64748b; border-color:#e2e8f0;'}">
              ${isConfirmed ? 'Confirmed' : 'Pending'}
            </span>
          </div>
          <div class="body small">${appt.client} • ${appt.job}</div>
        </div>
        
        <button class="btn ${isConfirmed ? 'secondary' : 'primary'}" style="height:36px; padding:0 12px; margin-left: 12px;" data-conf="${appt.id}">
          ${isConfirmed ? 'Undo' : 'Confirm'}
        </button>
      </div>
    `;
  };

  mount(`
    <section class="screen">
      ${header("Confirmation", "#/task9/adjust")}
      <div class="title">Confirm Attendance</div>
      <div class="body muted">${confirmed.size} / ${list.length} confirmed</div>
      
      <div class="grid" style="gap:8px; margin-top: 16px;">
        ${list.map(renderRow).join("")}
      </div>

      <div class="sticky-actions">
        <a class="btn primary" href="#/task9/list">Done & back to list</a>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-conf]").forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.conf);
      if (confirmed.has(id)) confirmed.delete(id); else confirmed.add(id);
      store.set("task9.confirmedIds", Array.from(confirmed));
      Task9Confirm({ mount, router }); // Re-render to update tags and counters
    };
  });
}