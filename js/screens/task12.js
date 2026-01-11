import { store } from "../store.js";
import { toast } from "../ui.js";

// Mock data - disputes to moderate
const DISPUTES = [
  {
    id: "DSP-10041",
    title: "Refund requested – leak reappeared",
    complainant: "User: Ana M.",
    provider: "Provider: Andrei Pop – Plumbing",
    date: "Nov 1, 2025",
    policy: "Service redo / partial refund",
    evidence: ["Photo – pipe", "Chat – repair", "Invoice"]
  },
  {
    id: "DSP-10042",
    title: "Extra time billed dispute",
    complainant: "User: Casa Verde",
    provider: "Provider: Dan Electric SRL",
    date: "Oct 30, 2025",
    policy: "Fair billing",
    evidence: []
  }
];

function initTask12Store() {
  const task12 = store.get("task12");
  if (!task12 || !task12.selectedId) {
    store.set("task12", {
      selectedId: null,
      decision: null,
      complainantMessage: "",
      providerMessage: "",
      moderatorNote: "",
      status: "pending"
    });
  }
}

function header({ router }) {
  return `
    <div class="row" style="justify-content:space-between; align-items:center;">
      <div class="title">Moderate Disputes</div>
      <a href="#/home" class="btn ghost" style="height:36px; padding:0 12px; font-size:14px;">Home</a>
    </div>
  `;
}

function getSelectedDispute() {
  const selectedId = store.get("task12.selectedId");
  return DISPUTES.find(d => d.id === selectedId) || DISPUTES[0];
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Screen 1: Context & flow overview
export function Task12Context({ mount, router }) {
  initTask12Store();
  
  mount(`
    <section class="screen">
      ${header({ router })}
      
      <div class="card">
        <div class="subtitle">Purpose & Motivation</div>
        <div class="body">Resolve complaints fairly and keep the platform's reputation healthy.</div>
        <div class="divider"></div>
        <div class="row" style="flex-wrap:wrap; gap:8px;">
          <span class="badge">Admin</span>
          <span class="badge">Dispute resolution</span>
          <span class="badge">Fairness</span>
        </div>
      </div>

      <div class="card">
        <div class="label">Flow steps</div>
        <ol class="body" style="padding-left:20px;">
          <li>Read claim details and supporting materials</li>
          <li>Contact both parties if clarification needed</li>
          <li>Evaluate evidence and policy compliance</li>
          <li>Decide resolution and update system records</li>
          <li>Notify both users of the decision</li>
        </ol>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="openCasesBtn">Open dispute cases</button>
      </div>
    </section>
  `);

  document.getElementById("openCasesBtn").addEventListener("click", () => {
    router.navigate("#/task12/cases");
  });
}

// Screen 2: Open cases list
export function Task12OpenCases({ mount, router }) {
  initTask12Store();

  const renderCasesList = () => {
    return DISPUTES.map(d => `
      <div class="dispute-item">
        <div class="avatar" aria-hidden="true"></div>
        <div style="flex:1;">
          <div class="row" style="justify-content:space-between;">
            <div class="col" style="gap:2px;">
              <div><b>${escapeHtml(d.title)}</b></div>
              <div class="small">${escapeHtml(d.complainant)} vs ${escapeHtml(d.provider)}</div>
              <div class="small">Opened: ${escapeHtml(d.date)}</div>
            </div>
            <button class="btn ghost" data-case-id="${d.id}">Open</button>
          </div>
        </div>
      </div>
    `).join('');
  };

  mount(`
    <section class="screen">
      ${header({ router })}
      <div class="body muted">Pick a case to moderate.</div>

      <div class="col">
        ${renderCasesList()}
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task12/context");
  });

  document.querySelectorAll('[data-case-id]').forEach(btn => {
    btn.addEventListener("click", () => {
      const caseId = btn.getAttribute("data-case-id");
      store.set("task12.selectedId", caseId);
      router.navigate("#/task12/details");
    });
  });
}

// Screen 3: Claim details & evidence
export function Task12ClaimDetails({ mount, router }) {
  initTask12Store();
  const dispute = getSelectedDispute();

  const renderEvidence = () => {
    if (!dispute.evidence || dispute.evidence.length === 0) {
      return '<div class="body muted">No files attached.</div>';
    }
    return dispute.evidence.map(e => `
      <div class="evidence-tile">
        <div style="font-size:32px;">📄</div>
        <div class="body" style="font-size:12px;">${escapeHtml(e)}</div>
      </div>
    `).join('');
  };

  mount(`
    <section class="screen">
      ${header({ router })}

      <div class="card">
        <div class="label">Case ID</div>
        <div class="body">${escapeHtml(dispute.id)}</div>
        <div class="label" style="margin-top:8px;">Title</div>
        <div class="body">${escapeHtml(dispute.title)}</div>
        <div class="label" style="margin-top:8px;">Parties</div>
        <div class="body">${escapeHtml(dispute.complainant)} • ${escapeHtml(dispute.provider)}</div>
        <div class="label" style="margin-top:8px;">Opened</div>
        <div class="body muted">${escapeHtml(dispute.date)}</div>
      </div>

      <div class="card">
        <div class="label">Supporting materials</div>
        <div class="evidence-grid">
          ${renderEvidence()}
        </div>
      </div>

      <div class="card">
        <div class="label">Policy to check</div>
        <div class="body">${escapeHtml(dispute.policy || '—')}</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="contactBtn">Contact parties</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  document.getElementById("contactBtn").addEventListener("click", () => {
    router.navigate("#/task12/contact");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task12/cases");
  });
}

// Screen 4: Contact both parties
export function Task12ContactParties({ mount, router }) {
  initTask12Store();
  const task12 = store.get("task12");

  mount(`
    <section class="screen">
      ${header({ router })}
      <div class="body muted">Ask for clarifications, missing receipts, or context.</div>

      <div class="card">
        <div class="label">To: Complainant</div>
        <div class="chat-bubble">
          <div class="body" style="font-size:14px;">
            <b>Admin:</b> "Hi, I need to verify the claim. Can you send..."
          </div>
        </div>
        <textarea id="complainantMsg" placeholder="Write a message to the complainant...">${escapeHtml(task12.complainantMessage || '')}</textarea>
      </div>

      <div class="card">
        <div class="label">To: Provider</div>
        <div class="chat-bubble">
          <div class="body" style="font-size:14px;">
            <b>Admin:</b> "Please provide clarification on..."
          </div>
        </div>
        <textarea id="providerMsg" placeholder="Write a message to the provider...">${escapeHtml(task12.providerMessage || '')}</textarea>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="evaluateBtn">Evaluate & resolve</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  document.getElementById("evaluateBtn").addEventListener("click", () => {
    const complainantMsg = document.getElementById("complainantMsg").value;
    const providerMsg = document.getElementById("providerMsg").value;
    
    store.set("task12.complainantMessage", complainantMsg);
    store.set("task12.providerMessage", providerMsg);
    
    router.navigate("#/task12/evaluate");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task12/details");
  });
}

// Screen 5: Evaluate evidence & decide resolution
export function Task12EvaluateResolution({ mount, router }) {
  initTask12Store();
  const task12 = store.get("task12");

  const decisions = [
    { value: "refund", label: "Refund to client" },
    { value: "provider-wins", label: "Provider decision upheld" },
    { value: "redo", label: "Redo service" },
    { value: "split", label: "Split responsibility" }
  ];

  mount(`
    <section class="screen">
      ${header({ router })}
      <div class="body muted">Match evidence against policy and pick an outcome.</div>

      <div class="card">
        <div class="label">Policy compliance checklist</div>
        <div class="col">
          <label class="row"><input type="checkbox"> Claim filed within timeframe</label>
          <label class="row"><input type="checkbox"> Evidence supports claim</label>
          <label class="row"><input type="checkbox"> Provider had opportunity to respond</label>
        </div>
      </div>

      <div class="card">
        <div class="label">Resolution</div>
        <div class="chips" id="decisionChips">
          ${decisions.map(d => `
            <div class="chip ${task12.decision === d.value ? 'active' : ''}" data-decision="${d.value}">
              ${escapeHtml(d.label)}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="label">Moderator note</div>
        <textarea id="moderatorNote" placeholder="E.g., Client reported within 24h; photo shows issue persists; approve partial refund.">${escapeHtml(task12.moderatorNote || '')}</textarea>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="submitBtn">Save & notify</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  document.querySelectorAll('[data-decision]').forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll('[data-decision]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      store.set("task12.decision", chip.getAttribute("data-decision"));
    });
  });

  document.getElementById("submitBtn").addEventListener("click", () => {
    const decision = store.get("task12.decision");
    const moderatorNote = document.getElementById("moderatorNote").value;

    if (!decision) {
      toast("Please select a resolution decision");
      return;
    }

    store.set("task12.moderatorNote", moderatorNote);
    store.set("task12.status", "resolved");
    
    router.navigate("#/task12/notify");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task12/contact");
  });
}

// Screen 6: Notify both users (success)
export function Task12NotifyUsers({ mount, router }) {
  initTask12Store();
  const dispute = getSelectedDispute();
  const task12 = store.get("task12");

  const decisionMap = {
    "refund": "Refund to client",
    "provider-wins": "Provider decision upheld",
    "redo": "Redo service",
    "split": "Split responsibility"
  };

  const resolutionText = decisionMap[task12.decision] || '—';

  mount(`
    <section class="screen">
      ${header({ router })}
      <div class="body muted">We notified both the complainant and the provider.</div>

      <div class="card">
        <div class="label">Case</div>
        <div class="body">${escapeHtml(dispute.id)}</div>
        <div class="label" style="margin-top:8px;">Resolution</div>
        <div class="body">${escapeHtml(resolutionText)}</div>
      </div>

      <div class="card">
        <div class="label">Notifications</div>
        <ul class="body" style="padding-left:20px;">
          <li>Email sent to ${escapeHtml(dispute.complainant)}</li>
          <li>Email sent to ${escapeHtml(dispute.provider)}</li>
          <li>Case updated in system records</li>
        </ul>
      </div>

      <div class="card">
        <div class="label">Status</div>
        <div class="status ok">● Closed</div>
        <div class="body muted">This improves the platform's fairness score.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="nextCaseBtn">Back to open cases</button>
        <button class="btn secondary" id="overviewBtn">Flow overview</button>
      </div>
    </section>
  `);

  document.getElementById("nextCaseBtn").addEventListener("click", () => {
    // Clear selection for next case
    store.set("task12.selectedId", null);
    store.set("task12.decision", null);
    store.set("task12.moderatorNote", "");
    router.navigate("#/task12/cases");
  });

  document.getElementById("overviewBtn").addEventListener("click", () => {
    router.navigate("#/task12/context");
  });
}
