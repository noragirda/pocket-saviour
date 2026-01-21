import { store } from "../store.js";
import { toast, renderLoading, required } from "../ui.js";
import { ELECTRICIANS } from "../../data/mock-db.js";

function header(title, backHref) {
  return `
    <div class="row" style="justify-content:space-between;">
      <a class="btn ghost" href="${backHref}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

// 1. Check for Status at Start
export function Task1Context({ mount, router }) {
  if (store.get("task1.requestStatus") === "submitted") {
    renderStatusView(mount, router);
    return;
  }

  mount(`
    <section class="screen">
      ${header("Task 1", "#/home")}
      <div class="title">Power outage help</div>
      <div class="body muted">
        Tell us what’s happening and we’ll match you with an available electrician (mocked).
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Safety check</div>
        <div class="body">
          If you smell burning, see sparks, or hear buzzing, stop using electricity and contact emergency services.
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="start">Start</button>
      </div>
    </section>
  `);

  document.getElementById("start").addEventListener("click", () => {
    router.navigate("#/task1/category");
  });
}

export function Task1Category({ mount, router }) {
  const selected = store.get("task1.category");

  mount(`
    <section class="screen">
      ${header("Task 1", "#/task1/context")}
      <div class="title">What best describes the issue?</div>
      <div class="chips" role="group" aria-label="Issue category">
        ${chip("Power outage", selected)}
        ${chip("Lights flickering", selected)}
        ${chip("Breaker keeps tripping", selected)}
        ${chip("Outlet not working", selected)}
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="next">Next</button>
      </div>
    </section>
  `);

  bindChipSelection("task1.category");

  document.getElementById("back").onclick = () => router.navigate("#/task1/context");
  document.getElementById("next").onclick = () => {
    if (!required(store.get("task1.category"))) {
      toast("Please select a category.", "error");
      return;
    }
    router.navigate("#/task1/symptoms");
  };
}

export function Task1Symptoms({ mount, router }) {
  const symptoms = store.get("task1.symptoms") || "";

  mount(`
    <section class="screen">
      ${header("Task 1", "#/task1/category")}
      <div class="title">Add details (optional)</div>
      <div class="body muted">This helps the electrician come prepared.</div>

      <div class="input">
        <label class="body">Symptoms / notes</label>
        <textarea id="symptoms" rows="6" placeholder="e.g., entire apartment has no power, neighbors OK…">${escapeHtml(symptoms)}</textarea>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="next">Next</button>
      </div>
    </section>
  `);

  document.getElementById("symptoms").addEventListener("input", (e) => {
    store.set("task1.symptoms", e.target.value);
  });

  document.getElementById("back").onclick = () => router.navigate("#/task1/category");
  document.getElementById("next").onclick = () => router.navigate("#/task1/urgency");
}

export function Task1UrgencyAddress({ mount, router }) {
  const urgency = store.get("task1.urgency");
  const address = store.get("task1.address") || store.get("user.savedAddress") || "";

  mount(`
    <section class="screen">
      ${header("Task 1", "#/task1/symptoms")}
      <div class="title">Urgency & address</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">How urgent is it?</div>
        <div class="chips" role="group" aria-label="Urgency">
          ${chip("Emergency", urgency)}
          ${chip("Today", urgency)}
          ${chip("This week", urgency)}
        </div>
      </div>

      <div class="input">
        <label class="body">Address</label>
        <input id="address" placeholder="Street, no., details…" value="${escapeAttr(address)}" />
        <div class="error-text" id="addressErr" style="display:none;">Address is required.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="find">Find electricians</button>
      </div>
    </section>
  `);

  bindChipSelection("task1.urgency", ["Emergency", "Today", "This week"]);

  const addressEl = document.getElementById("address");
  addressEl.addEventListener("input", (e) => store.set("task1.address", e.target.value));

  document.getElementById("back").onclick = () => router.navigate("#/task1/symptoms");
  document.getElementById("find").onclick = () => {
    const addr = store.get("task1.address") || addressEl.value;
    store.set("task1.address", addr);

    const addressOk = required(addr);
    const urgencyOk = required(store.get("task1.urgency"));

    document.getElementById("addressErr").style.display = addressOk ? "none" : "block";

    if (!urgencyOk) toast("Please choose an urgency level.", "error");
    if (!addressOk) return;

    router.navigate("#/task1/providers");
  };
}

export function Task1Providers({ mount, router }) {

  mount(`
    <section class="screen">
      ${header("Task 1", "#/task1/urgency")}
      <div class="title">Matching electricians…</div>
      ${renderLoading("Checking availability near you")}
    </section>
  `);
  setTimeout(() => {
    const urgency = store.get("task1.urgency");
    const list = sortByUrgency(ELECTRICIANS, urgency);

    if (urgency === "Emergency" && list.length === 0) {
      mount(emptyState(router));
      return;
    }

    mount(`
      <section class="screen">
        ${header("Task 1", "#/task1/urgency")}
        <div class="title">Available electricians</div>
        <div class="body muted">Pick one to send a request (mock).</div>

        <div class="grid">
          ${list.map(providerCard).join("")}
        </div>

        <div class="sticky-actions">
          <button class="btn secondary" id="back">Back</button>
        </div>
      </section>
    `);

    document.getElementById("back").onclick = () => router.navigate("#/task1/urgency");

    document.querySelectorAll("[data-pick]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-pick");
        store.set("task1.selectedProviderId", id);
        router.navigate("#/task1/confirm");
      });
    });
  }, 1400);
}

export function Task1Confirm({ mount, router }) {
  if (store.get("task1.requestStatus") === "submitted") {
    renderStatusView(mount, router);
    return;
  }

  const providerId = store.get("task1.selectedProviderId");
  const provider = ELECTRICIANS.find(p => p.id === providerId);

  if (!provider) {
    toast("Please select a provider first.", "error");
    router.navigate("#/task1/providers");
    return;
  }

  const summary = {
    category: store.get("task1.category"),
    symptoms: store.get("task1.symptoms"),
    urgency: store.get("task1.urgency"),
    address: store.get("task1.address"),
  };

  mount(`
    <section class="screen">
      ${header("Task 1", "#/task1/providers")}
      <div class="title">Confirm request</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Provider</div>
        <div class="body"><b>${provider.name}</b> • ⭐ ${provider.rating} • ETA ${provider.etaMin} min</div>
        <div class="body muted">${provider.price} • ${provider.distanceKm} km away</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Your request</div>
        <div class="body"><b>Issue:</b> ${escapeHtml(summary.category)}</div>
        <div class="body"><b>Urgency:</b> ${escapeHtml(summary.urgency)}</div>
        <div class="body"><b>Address:</b> ${escapeHtml(summary.address)}</div>
        ${summary.symptoms ? `<div class="body"><b>Notes:</b> ${escapeHtml(summary.symptoms)}</div>` : `<div class="body muted">No extra notes.</div>`}
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="edit">Edit</button>
        <button class="btn primary" id="send">Send request</button>
      </div>
    </section>
  `);

  document.getElementById("edit").onclick = () => router.navigate("#/task1/urgency");

  document.getElementById("send").onclick = () => {
    mount(`
      <section class="screen">
        ${header("Task 1", "#/task1/providers")}
        <div class="title">Sending request…</div>
        ${renderLoading("Notifying the electrician")}
      </section>
    `);

    setTimeout(() => {
      // simulate random failure 
      const fail = Math.random() < 0.15;

      if (fail) {
        toast("Request failed. Please try another provider.", "error");
        router.navigate("#/task1/providers");
        return;
      }

      store.set("task1.requestStatus", "submitted");
      toast("Request sent ✅", "success");

      mount(`
        <section class="screen">
          ${header("Task 1", "#/home")}
          <div class="title">Request sent</div>
          <div class="body muted">You’ll receive a reply shortly (mock).</div>

          <div class="card">
            <div class="subtitle" style="font-size:16px;">Next</div>
            <div class="body">Return to the dashboard to track status.</div>
          </div>

          <div class="sticky-actions">
            <button class="btn primary" id="finish">Dashboard</button>
          </div>
        </section>
      `);

      document.getElementById("finish").onclick = () => {
        store.set("ui.activeHomeTab", "activity"); 
        router.navigate("#/home");
      };
    }, 1200);
  };
}

// 7. NEW: Read-Only Status View
function renderStatusView(mount, router) {
  const providerId = store.get("task1.selectedProviderId");
  const provider = ELECTRICIANS.find(p => p.id === providerId) || { name: "Provider", etaMin: 15 };

  mount(`
    <section class="screen">
      <div class="row" style="justify-content:space-between;">
        <span class="badge" style="background:#fee2e2; color:#991b1b; border:1px solid #fecaca;">Live Emergency</span>
        <button class="btn ghost" id="home" style="height:32px; padding:0 8px;">✕</button>
      </div>

      <div class="title" style="margin-bottom:8px;">Technician En Route</div>
      <div class="body muted">Do not panic. Help is on the way.</div>

      <div class="card" style="text-align:center; margin-top:24px; padding:32px 16px;">
        <div style="font-size:40px; margin-bottom:16px;">🚚</div>
        <div class="subtitle" style="font-size:18px;">${provider.name}</div>
        <div class="body" style="color:#16a34a; font-weight:700; margin-top:4px;">ETA: ~${provider.etaMin} mins</div>
        <div class="body muted">1.2km away</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Safety Reminder</div>
        <div class="body muted">Keep the main breaker OFF until the electrician arrives.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" style="width:100%; color:red; border-color:red;" id="cancel">Cancel Request</button>
      </div>
    </section>
  `);

  document.getElementById("home").onclick = () => router.navigate("#/home");

  document.getElementById("cancel").onclick = () => {
    if(confirm("Are you sure you want to cancel?")) {
      store.set("task1.requestStatus", "draft");
      store.set("ui.activeHomeTab", "services");
      toast("Request cancelled.");
      router.navigate("#/home");
    }
  };
}

function chip(label, selected) {
  const pressed = selected === label ? "true" : "false";
  return `<button class="chip" type="button" aria-pressed="${pressed}" data-chip="${escapeAttr(label)}">${label}</button>`;
}

function bindChipSelection(storePath, allowed = null) {
  document.querySelectorAll("[data-chip]").forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-chip");
      if (allowed && !allowed.includes(value)) return;
      store.set(storePath, value);
      document.querySelectorAll("[data-chip]").forEach(b => {
        b.setAttribute("aria-pressed", b.getAttribute("data-chip") === value ? "true" : "false");
      });
    });
  });
}

function providerCard(p) {
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div class="subtitle" style="font-size:16px;">${p.name}</div>
        <span class="badge">⭐ ${p.rating}</span>
      </div>
      <div class="body muted">ETA ${p.etaMin} min • ${p.distanceKm} km • ${p.price}</div>
      <div class="divider"></div>
      <button class="btn primary" data-pick="${p.id}">Request</button>
    </div>
  `;
}

function emptyState(router) {
  return `
    <section class="screen">
      ${header("Task 1", "#/task1/urgency")}
      <div class="title">No electricians available</div>
      <div class="body muted">Try changing urgency or address.</div>
      <div class="sticky-actions">
        <button class="btn primary" id="backToUrgency">Back</button>
        <a class="btn secondary" href="#/home">Go home</a>
      </div>
      <script>
        document.getElementById("backToUrgency").onclick = () => location.hash = "#/task1/urgency";
      </script>
    </section>
  `;
}

function sortByUrgency(list, urgency) {
  const copy = [...list];
  if (urgency === "Emergency") return copy.sort((a,b) => a.etaMin - b.etaMin);
  if (urgency === "Today") return copy.sort((a,b) => (a.etaMin*0.6 + (5-b.rating)*20) - (b.etaMin*0.6 + (5-a.rating)*20));
  return copy.sort((a,b) => b.rating - a.rating);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
function escapeAttr(str){ return escapeHtml(str).replaceAll("\n"," "); }