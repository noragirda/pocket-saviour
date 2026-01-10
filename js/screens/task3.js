import { store } from "../store.js";
import { toast, renderLoading, required } from "../ui.js";
import { APPLIANCE_TECHNICIANS, TIME_SLOTS } from "../../data/mock-db.js";

function header(title, backHref) {
  return `
    <div class="row" style="justify-content:space-between;">
      <a class="btn ghost" href="${backHref}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

export function Task3Context({ mount, router }) {
  mount(`
    <section class="screen">
      ${header("Task 3", "#/home")}
      <div class="title">Schedule appliance repair</div>
      <div class="body muted">Pick an appliance, describe the issue, then schedule a visit (mock).</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Tip</div>
        <div class="body">Having model/brand details helps technicians prepare.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="start">Start</button>
      </div>
    </section>
  `);

  document.getElementById("start").onclick = () => router.navigate("#/task3/details");
}

export function Task3ApplianceIssue({ mount, router }) {
  const selected = store.get("task3.appliance");
  const issue = store.get("task3.issue") || "";

  mount(`
    <section class="screen">
      ${header("Task 3", "#/task3/context")}
      <div class="title">Appliance & issue</div>
      <div class="body muted">What needs repair?</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Appliance</div>
        <div class="chips">
          ${chip("Stove", selected)}
          ${chip("Washing machine", selected)}
          ${chip("Fridge", selected)}
          ${chip("Dishwasher", selected)}
          ${chip("Microwave", selected)}
        </div>
        <div class="error-text" id="applianceErr" style="display:none;">Please select an appliance.</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Describe the issue</div>
        <div class="input" style="margin-top:10px;">
          <label class="body">Issue details</label>
          <textarea id="issue" rows="6" placeholder="e.g., stove won’t ignite, smells like gas, started yesterday…">${escapeHtml(issue)}</textarea>
        </div>
        <div class="error-text" id="issueErr" style="display:none;">Please describe the issue.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="next">Next</button>
      </div>
    </section>
  `);

  bindChipSelection("task3.appliance");

  document.getElementById("issue").addEventListener("input", (e) => {
    store.set("task3.issue", e.target.value);
  });

  document.getElementById("back").onclick = () => router.navigate("#/task3/context");

  document.getElementById("next").onclick = () => {
    const okAppliance = required(store.get("task3.appliance"));
    const okIssue = required(store.get("task3.issue"));

    document.getElementById("applianceErr").style.display = okAppliance ? "none" : "block";
    document.getElementById("issueErr").style.display = okIssue ? "none" : "block";

    if (!okAppliance || !okIssue) {
      toast("Please fill the required fields.", "error");
      return;
    }

    router.navigate("#/task3/schedule");
  };
}

export function Task3Schedule({ mount, router }) {
  const urgency = store.get("task3.urgency");
  const date = store.get("task3.date") || "";
  const slot = store.get("task3.timeSlot") || "";
  const address = store.get("task3.address") || store.get("user.savedAddress") || "";

  mount(`
    <section class="screen">
      ${header("Task 3", "#/task3/details")}
      <div class="title">Schedule</div>
      <div class="body muted">Choose urgency, date and time slot.</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Urgency</div>
        <div class="chips">
          ${chip("Today", urgency)}
          ${chip("This week", urgency)}
        </div>
        <div class="error-text" id="urgErr" style="display:none;">Please choose urgency.</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Date</div>
        <div class="input" style="margin-top:10px;">
          <input id="date" type="date" value="${escapeAttr(date)}" />
        </div>
        <div class="error-text" id="dateErr" style="display:none;">Please choose a date.</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Time slot</div>
        <div class="chips" id="slots">
          ${TIME_SLOTS.map(s => slotChip(s, slot)).join("")}
        </div>
        <div class="error-text" id="slotErr" style="display:none;">Please choose a time slot.</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Address</div>
        <div class="input" style="margin-top:10px;">
          <input id="address" placeholder="Street, number, details…" value="${escapeAttr(address)}" />
        </div>
        <div class="error-text" id="addrErr" style="display:none;">Address is required.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="find">Find technicians</button>
      </div>
    </section>
  `);

  bindChipSelection("task3.urgency", ["Today", "This week"]);

  document.getElementById("date").addEventListener("change", (e) => store.set("task3.date", e.target.value));
  document.getElementById("address").addEventListener("input", (e) => store.set("task3.address", e.target.value));

  document.querySelectorAll("[data-slot]").forEach(btn => {
    btn.addEventListener("click", () => {
      const v = btn.getAttribute("data-slot");
      store.set("task3.timeSlot", v);
      document.querySelectorAll("[data-slot]").forEach(b => {
        b.setAttribute("aria-pressed", b.getAttribute("data-slot") === v ? "true" : "false");
      });
    });
  });

  document.getElementById("back").onclick = () => router.navigate("#/task3/details");

  document.getElementById("find").onclick = () => {
    const okUrg = required(store.get("task3.urgency"));
    const okDate = required(store.get("task3.date"));
    const okSlot = required(store.get("task3.timeSlot"));
    const okAddr = required(store.get("task3.address"));

    document.getElementById("urgErr").style.display = okUrg ? "none" : "block";
    document.getElementById("dateErr").style.display = okDate ? "none" : "block";
    document.getElementById("slotErr").style.display = okSlot ? "none" : "block";
    document.getElementById("addrErr").style.display = okAddr ? "none" : "block";

    if (!okUrg || !okDate || !okSlot || !okAddr) {
      toast("Please complete scheduling details.", "error");
      return;
    }

    router.navigate("#/task3/providers");
  };
}

export function Task3Providers({ mount, router }) {
  mount(`
    <section class="screen">
      ${header("Task 3", "#/task3/schedule")}
      <div class="title">Matching technicians…</div>
      ${renderLoading("Checking availability")}
    </section>
  `);

  setTimeout(() => {
    const appliance = store.get("task3.appliance");
    const urgency = store.get("task3.urgency");

    const list = rankTechnicians(APPLIANCE_TECHNICIANS, appliance, urgency);

    if (urgency === "Today" && list.length === 0) {
      mount(`
        <section class="screen">
          ${header("Task 3", "#/task3/schedule")}
          <div class="title">No technicians available</div>
          <div class="body muted">Try “This week” or choose another time slot.</div>

          <div class="sticky-actions">
            <a class="btn primary" href="#/task3/schedule">Adjust schedule</a>
            <a class="btn secondary" href="#/home">Go home</a>
          </div>
        </section>
      `);
      return;
    }

    mount(`
      <section class="screen">
        ${header("Task 3", "#/task3/schedule")}
        <div class="title">Available technicians</div>
        <div class="body muted">Choose one to schedule the visit (mock).</div>

        <div class="grid">
          ${list.map(techCard).join("")}
        </div>

        <div class="sticky-actions">
          <button class="btn secondary" id="back">Back</button>
        </div>
      </section>
    `);

    document.getElementById("back").onclick = () => router.navigate("#/task3/schedule");

    document.querySelectorAll("[data-pick]").forEach(btn => {
      btn.addEventListener("click", () => {
        store.set("task3.selectedProviderId", btn.getAttribute("data-pick"));
        router.navigate("#/task3/confirm");
      });
    });
  }, 1000);
}

export function Task3Confirm({ mount, router }) {
  const providerId = store.get("task3.selectedProviderId");
  const tech = APPLIANCE_TECHNICIANS.find(t => t.id === providerId);

  if (!tech) {
    toast("Please select a technician first.", "error");
    router.navigate("#/task3/providers");
    return;
  }

  const summary = {
    appliance: store.get("task3.appliance"),
    issue: store.get("task3.issue"),
    urgency: store.get("task3.urgency"),
    date: store.get("task3.date"),
    slot: store.get("task3.timeSlot"),
    address: store.get("task3.address"),
  };

  mount(`
    <section class="screen">
      ${header("Task 3", "#/task3/providers")}
      <div class="title">Confirm visit</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Technician</div>
        <div class="body"><b>${tech.name}</b> • ⭐ ${tech.rating}</div>
        <div class="body muted">${tech.speciality} • Visit fee ${tech.visitFee} RON</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Schedule</div>
        <div class="body"><b>Date:</b> ${escapeHtml(summary.date)} • <b>Slot:</b> ${escapeHtml(summary.slot)}</div>
        <div class="body"><b>Urgency:</b> ${escapeHtml(summary.urgency)}</div>
        <div class="body"><b>Address:</b> ${escapeHtml(summary.address)}</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Issue</div>
        <div class="body"><b>${escapeHtml(summary.appliance)}</b></div>
        <div class="body muted">${escapeHtml(summary.issue)}</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="edit">Edit schedule</button>
        <button class="btn primary" id="confirm">Confirm visit</button>
      </div>
    </section>
  `);

  document.getElementById("edit").onclick = () => router.navigate("#/task3/schedule");

  document.getElementById("confirm").onclick = () => {
    mount(`
      <section class="screen">
        ${header("Task 3", "#/task3/confirm")}
        <div class="title">Confirming…</div>
        ${renderLoading("Scheduling visit")}
      </section>
    `);

    setTimeout(() => {
      const fail = Math.random() < 0.15; 
      if (fail) {
        toast("Could not confirm. Try another technician.", "error");
        router.navigate("#/task3/providers");
        return;
      }

      store.set("task3.bookingStatus", "confirmed");
      toast("Visit scheduled ✅", "success");
      router.navigate("#/task3/success");
    }, 1000);
  };
}

export function Task3Success({ mount }) {
  mount(`
    <section class="screen">
      ${header("Task 3", "#/home")}
      <div class="title">Visit scheduled</div>
      <div class="body muted">This is a prototype success screen.</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Summary</div>
        <div class="body"><b>Appliance:</b> ${escapeHtml(store.get("task3.appliance"))}</div>
        <div class="body"><b>Date:</b> ${escapeHtml(store.get("task3.date"))}</div>
        <div class="body"><b>Slot:</b> ${escapeHtml(store.get("task3.timeSlot"))}</div>
      </div>

      <div class="sticky-actions">
        <a class="btn primary" href="#/home">Done</a>
      </div>
    </section>
  `);
}


function chip(label, selected) {
  const pressed = selected === label ? "true" : "false";
  return `<button class="chip" type="button" aria-pressed="${pressed}" data-chip="${escapeAttr(label)}">${label}</button>`;
}

function slotChip(label, selected) {
  const pressed = selected === label ? "true" : "false";
  return `<button class="chip" type="button" aria-pressed="${pressed}" data-slot="${escapeAttr(label)}">${label}</button>`;
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

function rankTechnicians(list, appliance, urgency) {
  const prefersKitchen = ["Stove", "Microwave", "Dishwasher"].includes(appliance);
  const prefersLaundry = ["Washing machine"].includes(appliance);

  return [...list].sort((a, b) => {
    const aMatch = matchScore(a, prefersKitchen, prefersLaundry);
    const bMatch = matchScore(b, prefersKitchen, prefersLaundry);
    if (bMatch !== aMatch) return bMatch - aMatch;

    if (urgency === "Today") return a.etaDays - b.etaDays;

    return b.rating - a.rating;
  });
}

function matchScore(t, kitchen, laundry) {
  if (kitchen && t.speciality.includes("Kitchen")) return 2;
  if (laundry && t.speciality.includes("Washing")) return 2;
  if (t.speciality.includes("General")) return 1;
  return 0;
}

function techCard(t) {
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div class="subtitle" style="font-size:16px;">${t.name}</div>
        <span class="badge">⭐ ${t.rating}</span>
      </div>
      <div class="body muted">${t.speciality}</div>
      <div class="body muted">Next availability: ${t.etaDays} day(s) • Visit fee ${t.visitFee} RON</div>
      <div class="divider"></div>
      <button class="btn primary" data-pick="${t.id}">Select</button>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("\n", " ");
}
