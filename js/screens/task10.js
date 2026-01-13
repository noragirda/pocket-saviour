import { store } from "../store.js";
import { toast } from "../ui.js";

// Helper: Consistent Header with Back Button
function header(title, backPath) {
  return `
    <div class="row" style="justify-content:space-between; margin-bottom:16px;">
      <a class="btn ghost" href="${backPath}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

export function Task10Active({ mount, router }) {
  mount(`
    <section class="screen">
      ${header("Active Job", "#/home")}
      
      <div class="title">Fix Kitchen Outlet</div>
      <div class="card">
        <div class="subtitle">Client: Ana M.</div>
        <div class="body">Str. Lalelelor 14</div>
        <div class="body muted" style="margin-top:8px;">Status: In Progress</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="markComp">Mark as Completed</button>
        </div>
    </section>
  `);
  
  document.getElementById("markComp").onclick = () => {
    store.set("task10.status", "completed_site");
    router.navigate("#/task10/mark");
  };
}

export function Task10Mark({ mount, router }) {
  mount(`
    <section class="screen">
      ${header("Job Completed", "#/task10/active")}
      
      <div class="title" style="color:var(--success-500);">● Completed on-site</div>
      <div class="body">Client will be notified after proof upload.</div>
      
      <div class="sticky-actions">
        <button class="btn primary" id="addProof">Add Proof</button>
        <button class="btn secondary" id="undo">Undo</button>
      </div>
    </section>
  `);

  document.getElementById("addProof").onclick = () => router.navigate("#/task10/proof");
  document.getElementById("undo").onclick = () => router.navigate("#/task10/active");
}

export function Task10Proof({ mount, router }) {
  const photos = store.get("task10.photos") || [];
  
  mount(`
    <section class="screen">
      ${header("Proof of Work", "#/task10/mark")}
      
      <div class="title">Add details</div>
      
      <div class="card">
        <div class="subtitle">Media</div>
        <div class="row" style="gap:8px;">
          <button class="btn ghost" id="addPhoto">📷 Add Photo</button>
        </div>
        <div class="row" style="margin-top:8px; flex-wrap:wrap;">
          ${photos.map((p,i) => `<span class="badge">Photo ${i+1}</span>`).join("")}
        </div>
      </div>

      <div class="input">
        <label>Summary Note (Optional)</label>
        <textarea id="note" rows="3" placeholder="e.g. Replaced socket, tested OK...">${store.get("task10.note") || ""}</textarea>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="submit">Submit Completion</button>
      </div>
    </section>
  `);

  document.getElementById("addPhoto").onclick = () => {
    photos.push(`photo_${Date.now()}.jpg`);
    store.set("task10.photos", photos);
    Task10Proof({ mount, router }); // Re-render
  };

  document.getElementById("note").oninput = (e) => store.set("task10.note", e.target.value);

  document.getElementById("submit").onclick = () => {
    // Change this to 'false' if you want to disable the offline simulation
    const isOffline = Math.random() > 0.7; 
    store.set("task10.isOfflineMode", isOffline);
    store.set("task10.status", "submitted");
    router.navigate("#/task10/submitted");
  };
}

export function Task10Submitted({ mount, router }) {
  const isOffline = store.get("task10.isOfflineMode");
  const photos = store.get("task10.photos") || [];

  mount(`
    <section class="screen">
      ${header("Summary", "#/task10/proof")}
      
      <div class="title">Completion Submitted</div>
      
      ${isOffline ? `
        <div class="card" style="background:#FEF3C7; border-color:#F59E0B;">
          <div class="body" style="color:#B45309;">⚠️ Offline: Photos queued for sync.</div>
        </div>
      ` : ''}

      <div class="card">
        <div class="subtitle">Proof attached</div>
        <div class="body">${photos.length > 0 ? photos.length + " photos" : "No photos"}</div>
        <div class="body muted">Note: ${store.get("task10.note") || "—"}</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="wait">Wait for Feedback</button>
      </div>
    </section>
  `);
  document.getElementById("wait").onclick = () => router.navigate("#/task10/feedback");
}

export function Task10Feedback({ mount, router }) {
  mount(`
    <section class="screen">
      ${header("Feedback", "#/home")} <div class="title">Pending Client Feedback</div>
      <div class="body muted">● Waiting for Ana M. to rate the job...</div>
      
      <div class="card">
        <div class="subtitle">Timeline</div>
        <div class="body">✓ Work Completed</div>
        <div class="body">✓ Proof Submitted</div>
        <div class="body" style="font-weight:bold;">→ Client Feedback</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="finishTask">Back to Home</button>
      </div>
    </section>
  `);

  document.getElementById("finishTask").onclick = () => {
    // 1. Clear Data
    store.set("task10.photos", []);
    store.set("task10.note", "");
    store.set("task10.status", "in_progress");
    store.set("task10.isOfflineMode", false);

    // 2. Navigate Home
    router.navigate("#/home");
  };
}