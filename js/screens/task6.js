import { store } from "../store.js";
import { toast, renderLoading, required } from "../ui.js";
import { COMPLETED_JOBS } from "../../data/mock-db.js";

export function Task6History({ mount, router }) {
  const jobs = COMPLETED_JOBS.filter(j => j.canReport);

  mount(`
    <section class="screen">
      ${header("Support", "#/home")}
      <div class="title">Report an Issue</div>
      <div class="body muted">Select the service you had a problem with.</div>

      <div class="grid">
        ${jobs.length === 0 ? `<div class="card body muted">No eligible jobs found.</div>` : jobs.map(jobCard).join("")}
      </div>

      <div class="sticky-actions">
        <a class="btn ghost" href="#/home">Cancel</a>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-report-id]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.reportId;
      store.set("task6.selectedJobId", id);
      store.set("task6.complaint", "");
      store.set("task6.evidenceFiles", []);
      store.set("task6.resolution", null);
      router.navigate("#/task6/form");
    };
  });
}

export function Task6Form({ mount, router }) {
  const job = getSelectedJob();
  if (!job) return router.navigate("#/task6");

  const complaint = store.get("task6.complaint") || "";
  const evidence = store.get("task6.evidenceFiles") || [];

  mount(`
    <section class="screen">
      ${header("Details", "#/task6")}
      <div class="title">Describe the problem</div>
      <div class="body muted">Job: <b>${escapeHtml(job.title)}</b></div>

      <div class="card">
        <div class="input">
          <label class="body">What went wrong?</label>
          <textarea id="complaint" rows="5" placeholder="Leak reappeared, provider arrived late...">${escapeHtml(complaint)}</textarea>
        </div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Evidence (Optional)</div>
        <div class="body muted" style="margin-bottom:8px;">Add photos or invoices.</div>
        
        <div class="row">
           <button class="btn secondary" id="add-photo" style="flex:1;">📷 Add Photo</button>
           <button class="btn secondary" id="add-doc" style="flex:1;">📄 Add File</button>
        </div>

        <div id="file-list" class="chips" style="margin-top:12px;">
          ${renderFileList(evidence)}
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="continue">Continue</button>
      </div>
    </section>
  `);

  const complaintInput = document.getElementById("complaint");
  
  complaintInput.addEventListener("input", (e) => {
    store.set("task6.complaint", e.target.value);
  });

  document.getElementById("add-photo").onclick = () => addMockFile("photo");
  document.getElementById("add-doc").onclick = () => addMockFile("doc");

  document.getElementById("file-list").onclick = (e) => {
    if (e.target.classList.contains("remove-file")) {
      const idx = parseInt(e.target.dataset.idx, 10);
      const current = store.get("task6.evidenceFiles") || [];
      current.splice(idx, 1);
      store.set("task6.evidenceFiles", current);
      document.getElementById("file-list").innerHTML = renderFileList(current);
    }
  };

  document.getElementById("continue").onclick = () => {
    if (!required(store.get("task6.complaint"))) {
      toast("Please describe the problem.", "error");
      return;
    }
    router.navigate("#/task6/resolution");
  };
}

export function Task6Resolution({ mount, router }) {
  const selected = store.get("task6.resolution");

  mount(`
    <section class="screen">
      ${header("Resolution", "#/task6/form")}
      <div class="title">How should we fix this?</div>
      <div class="body muted">Select your preferred outcome.</div>

      <div class="grid">
        ${optionCard("Refund", "Request money back", selected)}
        ${optionCard("Redo service", "Provider returns to fix", selected)}
        ${optionCard("Mediation", "Admin intervention", selected)}
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="submit">Submit Claim</button>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-option]").forEach(card => {
    card.onclick = () => {
      const val = card.dataset.option;
      store.set("task6.resolution", val);
      Task6Resolution({ mount, router });
    };
  });

  document.getElementById("submit").onclick = () => {
    if (!store.get("task6.resolution")) {
      toast("Please select a resolution option.", "error");
      return;
    }

    mount(`
      <section class="screen">
        ${header("Submitting...", "#")}
        <div class="title">Sending claim...</div>
        ${renderLoading("Generating ticket ID")}
      </section>
    `);

    setTimeout(() => {
      const caseId = "CASE-" + Math.floor(1000 + Math.random() * 9000);
      store.set("task6.caseId", caseId);
      router.navigate("#/task6/success");
    }, 1500);
  };
}

export function Task6Success({ mount, router }) {
  const caseId = store.get("task6.caseId");
  const resolution = store.get("task6.resolution");

  mount(`
    <section class="screen" style="text-align:center; justify-content:center; align-items:center;">
      <div style="font-size:48px; margin-bottom:16px;">📂</div>
      <div class="title">Claim Submitted</div>
      
      <div class="card" style="width:100%; margin-top:20px; text-align:left;">
        <div class="row" style="justify-content:space-between;">
           <span class="subtitle">Case Number</span>
           <span class="badge">${caseId}</span>
        </div>
        <div class="divider"></div>
        <div class="body"><b>Resolution:</b> ${resolution}</div>
        <div class="body muted" style="margin-top:8px;">Status: <span style="color:#d97706;">Pending Admin Review</span></div>
      </div>

      <div class="body muted" style="margin-top:20px;">We usually respond within 24 hours.</div>

      <div class="sticky-actions" style="width:100%;">
        <a class="btn primary" href="#/home">Done</a>
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

function jobCard(job) {
  return `
    <div class="card col">
      <div class="subtitle">${escapeHtml(job.title)}</div>
      <div class="body muted">${escapeHtml(job.provider)} • ${job.date}</div>
      <div class="divider"></div>
      <button class="btn secondary" data-report-id="${job.id}">Report Issue</button>
    </div>
  `;
}

function renderFileList(files) {
  if (!files || files.length === 0) return `<span class="body muted">No files attached yet.</span>`;
  
  return files.map((f, i) => `
    <div class="chip" style="padding-right:8px;">
      <span>${f.includes("jpg") ? "📷" : "📄"} ${f}</span>
      <span class="remove-file" data-idx="${i}" style="margin-left:8px; cursor:pointer; color:var(--error-500); font-weight:bold;">✕</span>
    </div>
  `).join("");
}

function addMockFile(type) {
  const current = store.get("task6.evidenceFiles") || [];
  const name = type === "photo" 
    ? `Photo_${Math.floor(Math.random()*100)}.jpg`
    : `Invoice_${Math.floor(Math.random()*100)}.pdf`;
  
  current.push(name);
  store.set("task6.evidenceFiles", current);
  toast(type === "photo" ? "Photo added" : "Document added");
  document.getElementById("file-list").innerHTML = renderFileList(current);
}

function optionCard(label, sub, selected) {
  const isSelected = selected === label;
  const border = isSelected ? "2px solid var(--primary-500)" : "1px solid var(--neutral-200)";
  const bg = isSelected ? "#eff6ff" : "#fff";
  
  return `
    <div class="card" data-option="${label}" style="cursor:pointer; border:${border}; background:${bg};">
      <div class="subtitle" style="font-size:16px;">${label}</div>
      <div class="body muted">${sub}</div>
    </div>
  `;
}

function getSelectedJob() {
  const id = store.get("task6.selectedJobId");
  return COMPLETED_JOBS.find(j => j.id === id);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}