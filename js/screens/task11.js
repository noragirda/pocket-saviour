import { store } from "../store.js";
import { PENDING_PROVIDERS } from "../../data/mock-db.js";
import { toast, required } from "../ui.js";

function header(title, backPath) {
  return `
    <div class="row" style="justify-content:space-between; margin-bottom:16px;">
      <a class="btn ghost" href="${backPath}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

export function Task11Queue({ mount, router }) {
  const list = PENDING_PROVIDERS.filter(p => !store.get("task11.processedApplicants")?.includes(p.id));

  mount(`
    <section class="screen">
      ${header("Admin Workspace", "#/home")}
      <div class="title">Pending Verification</div>
      <div class="body muted">${list.length} pending applications</div>
      
      <div class="list">
        ${list.length === 0 ? '<div class="body muted">No pending applications.</div>' : ''}
        ${list.map(p => `
          <div class="card">
            <div class="row" style="justify-content:space-between;">
              <div class="subtitle">${p.name}</div>
              <span class="badge">Pending</span>
            </div>
            <div class="body muted">${p.role} • ${p.submittedTime}</div>
            <div class="divider"></div>
            <button class="btn primary" data-open="${p.id}">Open</button>
          </div>
        `).join("")}
      </div>
    </section>
  `);

  document.querySelectorAll("[data-open]").forEach(btn => {
    btn.onclick = () => {
      store.set("task11.selectedApplicantId", btn.dataset.open);
      router.navigate("#/task11/detail");
    };
  });
}

export function Task11Detail({ mount, router }) {
  const id = store.get("task11.selectedApplicantId");
  const p = PENDING_PROVIDERS.find(x => x.id === id);
  if (!p) return router.navigate("#/task11/queue");

  mount(`
    <section class="screen">
      ${header("Application", "#/task11/queue")}
      <div class="title">${p.name}</div>
      <div class="body muted">${p.role}</div>

      <div class="card">
        <div class="subtitle">Quick Checks</div>
        <div class="body">✓ Name matches ID</div>
        <div class="body">✓ Phone verified</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="reviewDocs">Review Documents</button>
      </div>
    </section>
  `);

  document.getElementById("reviewDocs").onclick = () => router.navigate("#/task11/docs");
}

export function Task11Docs({ mount, router }) {
  const id = store.get("task11.selectedApplicantId");
  const p = PENDING_PROVIDERS.find(x => x.id === id);

  const docRow = (label, hasDoc) => `
    <div class="card" style="flex-direction:row; align-items:center; justify-content:space-between; padding:12px;">
      <div>${label}</div>
      ${hasDoc 
        ? '<span class="badge" style="color:green; border-color:green;">Valid</span>' 
        : '<span class="badge" style="color:red; border-color:red;">Missing</span>'}
    </div>
  `;

  mount(`
    <section class="screen">
      ${header("Documents", "#/task11/detail")}
      <div class="title">Cross-check</div>
      
      <div class="grid" style="gap:8px;">
        ${docRow("ID Front", p.docs.idFront)}
        ${docRow("ID Back", p.docs.idBack)}
        ${docRow("License", p.docs.license)}
        ${docRow("Insurance", p.docs.insurance)}
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="approve">Approve</button>
        <button class="btn ghost" style="color:var(--error-500); border-color:var(--error-500);" id="reject">Reject</button>
      </div>
    </section>
  `);

  document.getElementById("approve").onclick = () => {
    store.set("task11.decision", "approve");
    router.navigate("#/task11/decision");
  };
  document.getElementById("reject").onclick = () => {
    store.set("task11.decision", "reject");
    router.navigate("#/task11/decision");
  };
}

export function Task11Decision({ mount, router }) {
  const decision = store.get("task11.decision");
  const isReject = decision === "reject";

  mount(`
    <section class="screen">
      ${header("Decision", "#/task11/docs")}
      <div class="title">${isReject ? "Reject Provider" : "Approve Provider"}</div>
      
      <div class="input">
        <label>${isReject ? "Rejection Reason (Required)" : "Note (Optional)"}</label>
        <textarea id="reason" rows="4" placeholder="${isReject ? "e.g. Insurance document missing..." : "e.g. All docs valid..."}"></textarea>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="submit">Submit Decision</button>
      </div>
    </section>
  `);

  document.getElementById("submit").onclick = () => {
    const reason = document.getElementById("reason").value;
    if (isReject && !required(reason)) {
      toast("Please provide a rejection reason.", "error");
      return;
    }
    store.set("task11.reason", reason);
    
    // Process completion
    const processed = store.get("task11.processedApplicants") || [];
    processed.push(store.get("task11.selectedApplicantId"));
    store.set("task11.processedApplicants", processed);

    router.navigate("#/task11/success");
  };
}

export function Task11Success({ mount, router }) {
  const decision = store.get("task11.decision");
  const pId = store.get("task11.selectedApplicantId");
  const p = PENDING_PROVIDERS.find(x => x.id === pId);

  mount(`
    <section class="screen">
      <div class="title">Status Updated</div>
      <div class="card">
        <div class="subtitle">${p.name}</div>
        <span class="badge" style="background:${decision === 'approve' ? '#dcfce7' : '#fee2e2'};">
          ${decision === 'approve' ? 'Approved' : 'Rejected'}
        </span>
        <div class="body" style="margin-top:8px;">${store.get("task11.reason") || "No note added."}</div>
      </div>
      <div class="sticky-actions">
        <a class="btn primary" href="#/task11/queue">Back to Queue</a>
      </div>
    </section>
  `);
}