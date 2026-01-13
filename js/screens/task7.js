import { store } from "../store.js";
import { toast, renderLoading, required } from "../ui.js";

export function Task7Identity({ mount, router }) {
  const data = store.get("task7.identity") || {};

  mount(`
    <section class="screen">
      ${header("Step 1 of 5", "#/home")}
      <div class="title">Identity</div>
      <div class="body muted">Basic contact information.</div>

      <div class="card">
        <div class="input">
          <label class="body">Full Name</label>
          <input id="name" type="text" value="${escapeAttr(data.name)}" placeholder="e.g. Andrei Pop">
        </div>
        
        <div class="input" style="margin-top:12px;">
          <label class="body">Phone</label>
          <input id="phone" type="tel" value="${escapeAttr(data.phone)}" placeholder="07xx xxx xxx">
        </div>

        <div class="input" style="margin-top:12px;">
          <label class="body">Email</label>
          <input id="email" type="email" value="${escapeAttr(data.email)}" placeholder="name@example.com">
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="next">Next: Credentials</button>
      </div>
    </section>
  `);

  document.getElementById("next").onclick = () => {
    const vals = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value
    };

    if (!required(vals.name) || !required(vals.phone)) {
      toast("Name and Phone are required.", "error");
      return;
    }
    
    store.set("task7.identity", vals);
    router.navigate("#/task7/credentials");
  };
}

export function Task7Credentials({ mount, router }) {
  const docs = store.get("task7.credentials") || [];

  mount(`
    <section class="screen">
      ${header("Step 2 of 5", "#/task7/identity")}
      <div class="title">Credentials</div>
      <div class="body muted">Upload required documents.</div>

      <div class="card col">
        ${docRow("ID Front", docs, true)}
        ${docRow("ID Back", docs, true)}
        <div class="divider"></div>
        ${docRow("License", docs, false)}
        ${docRow("Insurance", docs, false)}
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="next">Next: Services</button>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-upload]").forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.upload;
      const current = store.get("task7.credentials") || [];
      
      if (current.includes(type)) {
        const next = current.filter(x => x !== type);
        store.set("task7.credentials", next);
        toast(`Removed ${type}`);
      } else {
        current.push(type);
        store.set("task7.credentials", current);
        toast(`Uploaded ${type}`);
      }
      Task7Credentials({ mount, router });
    };
  });

  document.getElementById("next").onclick = () => {
    const current = store.get("task7.credentials") || [];
    if (!current.includes("ID Front") || !current.includes("ID Back")) {
      toast("ID Front and Back are required.", "error");
      return;
    }
    router.navigate("#/task7/services");
  };
}

export function Task7Services({ mount, router }) {
  const services = store.get("task7.services") || [];
  const area = store.get("task7.coverageArea") || "";

  const options = ["Plumbing", "Electrical", "Appliance Repair", "Carpentry", "Painting", "Cleaning"];

  mount(`
    <section class="screen">
      ${header("Step 3 of 5", "#/task7/credentials")}
      <div class="title">Services & Area</div>
      <div class="body muted">What do you offer?</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Select Services</div>
        <div class="chips" id="svc-chips">
          ${options.map(opt => svcChip(opt, services.includes(opt))).join("")}
        </div>
      </div>

      <div class="card">
        <div class="input">
          <label class="body">Coverage Area</label>
          <input id="area" type="text" value="${escapeAttr(area)}" placeholder="e.g. Cluj-Napoca + 15km">
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="next">Next: Schedule</button>
      </div>
    </section>
  `);

  document.getElementById("svc-chips").onclick = (e) => {
    if (e.target.dataset.svc) {
      const val = e.target.dataset.svc;
      let current = store.get("task7.services") || [];
      
      if (current.includes(val)) current = current.filter(x => x !== val);
      else current.push(val);
      
      store.set("task7.services", current);
      Task7Services({ mount, router });
    }
  };

  document.getElementById("next").onclick = () => {
    const areaVal = document.getElementById("area").value;
    const currentSvcs = store.get("task7.services") || [];

    if (currentSvcs.length === 0) {
      toast("Select at least one service.", "error");
      return;
    }
    if (!required(areaVal)) {
      toast("Coverage area is required.", "error");
      return;
    }
    store.set("task7.coverageArea", areaVal);
    router.navigate("#/task7/schedule");
  };
}

export function Task7Schedule({ mount, router }) {
  const slots = store.get("task7.availability") || [];

  mount(`
    <section class="screen">
      ${header("Step 4 of 5", "#/task7/services")}
      <div class="title">Availability</div>
      <div class="body muted">Select your typical working hours.</div>

      <div class="card col" style="gap:0;">
        ${scheduleGrid(slots)}
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="submit">Submit Application</button>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-slot]").forEach(btn => {
    btn.onclick = () => {
      const slot = btn.dataset.slot;
      let current = store.get("task7.availability") || [];
      
      if (current.includes(slot)) current = current.filter(x => x !== slot);
      else current.push(slot);
      
      store.set("task7.availability", current);
      
      const isActive = current.includes(slot);
      btn.style.background = isActive ? "var(--primary-500)" : "#fff";
      btn.style.color = isActive ? "#fff" : "var(--neutral-900)";
      btn.style.borderColor = isActive ? "var(--primary-500)" : "var(--neutral-300)";
    };
  });

  document.getElementById("submit").onclick = () => {
    const current = store.get("task7.availability") || [];
    if (current.length === 0) {
      toast("Please select at least one time slot.", "error");
      return;
    }

    mount(`
      <section class="screen">
        ${header("Sending...", "#")}
        <div class="title">Submitting Profile...</div>
        ${renderLoading("Verifying documents")}
      </section>
    `);

    setTimeout(() => {
      store.set("task7.status", "pending");
      router.navigate("#/task7/success");
    }, 1500);
  };
}

export function Task7Success({ mount, router }) {
  const name = store.get("task7.identity")?.name || "Provider";

  mount(`
    <section class="screen" style="text-align:center; justify-content:center; align-items:center;">
      <div style="font-size:48px; margin-bottom:16px;">🚀</div>
      <div class="title">Application Sent!</div>
      <div class="body muted">Thanks, <b>${escapeHtml(name)}</b>.</div>

      <div class="card" style="width:100%; margin-top:20px; text-align:left;">
        <div class="subtitle">Next Steps</div>
        <div class="body muted">1. Admin reviews documents (24-48h).</div>
        <div class="body muted">2. You receive an email confirmation.</div>
        <div class="body muted">3. You can start accepting jobs!</div>
        <div class="divider"></div>
        <div class="row" style="align-items:center; gap:8px;">
          <div style="width:10px; height:10px; border-radius:50%; background:#d97706;"></div>
          <span class="body">Status: <b>Pending Review</b></span>
        </div>
      </div>

      <div class="sticky-actions" style="width:100%;">
        <a class="btn primary" href="#/home">Back to Home</a>
      </div>
    </section>
  `);
}

function header(title, backHref) {
  return `
    <div class="row" style="justify-content:space-between; margin-bottom:10px;">
      <a class="btn ghost" href="${backHref}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

function docRow(label, currentList, required) {
  const isUploaded = currentList.includes(label);
  return `
    <div class="row" style="justify-content:space-between; padding:12px 0;">
      <div class="col" style="gap:2px;">
        <div class="subtitle" style="font-size:16px;">${label}</div>
        <div class="body muted" style="font-size:12px;">${required ? "Required" : "Optional"}</div>
      </div>
      <button class="btn ${isUploaded ? "secondary" : "ghost"}" data-upload="${label}">
        ${isUploaded ? "✅ Uploaded" : "Upload"}
      </button>
    </div>
  `;
}

function svcChip(label, selected) {
  const pressed = selected ? "true" : "false";
  return `<button class="chip" type="button" aria-pressed="${pressed}" data-svc="${label}">${label}</button>`;
}

function scheduleGrid(slots) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const periods = ["AM", "PM"];
  
  return days.map(day => `
    <div class="row" style="justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--neutral-100);">
      <div class="body" style="width:40px; font-weight:600;">${day}</div>
      <div class="row" style="gap:8px;">
        ${periods.map(p => {
          const key = `${day} ${p}`;
          const active = slots.includes(key);
          const bg = active ? "var(--primary-500)" : "#fff";
          const color = active ? "#fff" : "var(--neutral-900)";
          const border = active ? "var(--primary-500)" : "var(--neutral-300)";
          
          return `
            <button class="btn" data-slot="${key}" 
              style="height:32px; font-size:14px; width:60px; padding:0; background:${bg}; color:${color}; border:1px solid ${border};">
              ${p}
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}