import { store } from "../store.js";

export function HomeScreen({ mount, router }) {
  const user = store.get("user") || { name: "Mara", activeRole: "client" };
  const role = user.activeRole;

  if (role === 'admin') renderAdminView(mount, user);
  else if (role === 'provider') renderProviderView(mount, user);
  else renderClientView(mount, user);
}

window.setTab = (tabName) => {
  store.set("ui.activeHomeTab", tabName);
  location.reload(); 
};

function renderClientView(mount, user) {
  const activeTab = store.get("ui.activeHomeTab") || "services";
  const tab = (activeTab === "services" || activeTab === "activity") ? activeTab : "services";

  let content = "";
  
  if (tab === "services") {
    // === TAB 1: SERVICES (Start New Tasks) ===
    content = `
      <div class="subtitle" style="margin-bottom:8px;">Emergency</div>
      <div class="card" onclick="window.location.hash='#/task1'" style="background:#fef2f2; border-color:#fecaca; cursor:pointer; margin-bottom:24px;">
        <div class="row" style="align-items:center; gap:12px;">
          <div style="font-size:24px; background:#fff; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center;">⚡</div>
          <div class="col">
            <div class="subtitle" style="color:#991b1b;">Power Outage?</div>
            <div class="body" style="color:#7f1d1d; font-size:14px;">Task 1: Request Electrician</div>
          </div>
        </div>
      </div>

      <div class="subtitle" style="margin-bottom:12px;">Services (Non-Urgent)</div>
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:24px;">
        ${serviceCard("💧", "Plumbing", "Task 2", "#/task2")}
        ${serviceCard("⚙️", "Appliances", "Task 3", "#/task3")}
      </div>

      <div class="subtitle" style="margin-bottom:12px;">Support</div>
      <div class="card col" style="gap:0; padding:0; overflow:hidden; margin-bottom:24px;">
        ${menuItem("#/task6", "⚠️", "Report an Issue", "Task 6: Request refund or help")}
      </div>

      <div class="card" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color:white; border:none; margin-bottom:24px;">
        <div class="row" style="justify-content:space-between; align-items:center;">
          <div class="col">
            <div class="subtitle" style="color:white;">Join as Provider</div>
            <div class="body" style="color:#dbeafe; font-size:13px;">Task 7: Register as Provider</div>
          </div>
          <button class="btn" onclick="window.location.hash='#/task7'" style="background:white; color:#1e40af; border:none; font-size:13px; height:32px; padding:0 12px; font-weight:600;">
            Register
          </button>
        </div>
      </div>
    `;
  } else {
    // === TAB 2: ACTIVITY (Live & Actions) ===
    const live = getLiveSection();
    const actions = getActionsSection();
    const upcoming = getUpcomingSection();
    
    const isEmpty = !live && !actions && !upcoming;

    content = `
      ${isEmpty ? `<div class="card body muted" style="text-align:center; padding:32px; margin-top:40px;">No active services.</div>` : ''}

      ${live ? `
        <div class="subtitle" style="margin-bottom:12px; color:#d97706;">🚨 Live Status</div>
        <div class="col" style="gap:12px; margin-bottom:32px;">${live}</div>
      ` : ''}

      ${actions ? `
        <div class="subtitle" style="margin-bottom:12px; color:#2563eb;">📝 Action Required</div>
        <div class="col" style="gap:12px; margin-bottom:32px;">${actions}</div>
      ` : ''}

      ${upcoming ? `
        <div class="subtitle" style="margin-bottom:12px;">📅 Upcoming</div>
        <div class="col" style="gap:12px; margin-bottom:32px;">${upcoming}</div>
      ` : ''}
    `;
  }

  mount(`
    <section class="screen" style="padding-bottom:80px;">
      ${renderHeader(user)}
      ${content}
      ${renderBottomNav("client", activeTab)}
    </section>
  `);
}

function renderProviderView(mount, user) {
  const activeTab = store.get("ui.activeHomeTab") || "dashboard";
  let content = "";

  if (activeTab === "dashboard") {
    let updates = "";
    if (store.get("task10.status") === "submitted") {
      updates += activeCard("✅ Job Complete", "Proof submitted. Waiting for payment.", "bg-blue-50", "#/task10/submitted");
    }

    content = `
      <div class="grid" style="grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:24px;">
        <div class="card col" style="background:#eff6ff; border:none; padding:16px;">
          <div class="body muted" style="font-size:12px;">Earnings</div>
          <div class="title" style="color:#1e40af; margin:4px 0;">1,250 RON</div>
        </div>
        <div class="card col" style="background:#f0fdf4; border:none; padding:16px;">
          <div class="body muted" style="font-size:12px;">Success</div>
          <div class="title" style="color:#15803d; margin:4px 0;">98%</div>
        </div>
      </div>

      ${updates ? `<div class="subtitle" style="margin-bottom:12px;">Updates</div><div class="col" style="gap:12px; margin-bottom:24px;">${updates}</div>` : ''}

      <div class="subtitle" style="margin-bottom:12px;">Job Management</div>
      <div class="card col" style="gap:0; padding:0; overflow:hidden;">
        ${menuItem("#/task9", "📅", "Manage Appointments", "Task 9: Daily schedule")}
        <div class="divider" style="margin:0;"></div>
        ${menuItem("#/task10", "📍", "Update Work Status", "Task 10: Mark complete")}
      </div>
    `;
  } else {
    // Requests Tab
    let requests = "";
    if (store.get("task8.status") === "pending") {
      requests += activeCard("📩 New Job Request", "Electrician needed - Central District", "bg-yellow-50", "#/task8/context");
    } else {
       requests += activeCard("🔨 Active Job", "Fix Kitchen Outlet - 14:00", "bg-green-50", "#/task8/await");
    }
    content = `
      <div class="subtitle" style="margin-bottom:12px;">Incoming Jobs</div>
      <div class="col" style="gap:12px;">${requests}</div>
    `;
  }

  mount(`
    <section class="screen" style="padding-bottom:80px;">
      ${renderHeader(user)}
      ${content}
      ${renderBottomNav("provider", activeTab)}
    </section>
  `);
}

function renderAdminView(mount, user) {
  mount(`
    <section class="screen">
      ${renderHeader(user)}
      <div class="card" style="background:#334155; color:white; margin-bottom:24px;">
        <div class="subtitle" style="color:white;">Admin Workspace</div>
        <div class="body" style="color:#cbd5e1;">Platform Health: Good</div>
      </div>
      <div class="subtitle" style="margin-bottom:12px;">Moderation Queues</div>
      <div class="card col" style="gap:0; padding:0; overflow:hidden;">
        ${menuItem("#/task11", "🛡️", "Verify Credentials", "Task 11: Verify Credentials")}
        <div class="divider" style="margin:0;"></div>
        ${menuItem("#/task12", "⚖️", "Moderate Disputes", "Task 12: Dispute Resolution")}
      </div>
    </section>
  `);
}

// --- HELPERS ---

function getLiveSection() {
  let html = "";
  // Task 1: Emergency Active
  if (store.get("task1.requestStatus") === "submitted") {
    html += activeCard("⚡ Emergency Active", "Electrician requested. ETA 15 mins.", "bg-red-50", "#/task1/confirm");
  }
  // Task 10: Plumbing En Route
  if (store.get("task10.status") === "in_progress") {
    html += activeCard("🚚 Provider En Route", "Track arrival for 'Plumbing'", "bg-blue-50", "#/task10/active");
  }
  // Task 7: Pending Application
  if (store.get("task7.status") === "pending") {
    html += activeCard("👷 Provider App", "Submitted - Pending Verification", "bg-gray-50", "#/task7/success");
  }
  // Task 6: Pending Support Ticket
  if (store.get("task6.caseId")) {
    html += activeCard("⚠️ Issue Reported", `Case #${store.get("task6.caseId")} - Pending Review`, "bg-orange-50", "#/task6/success");
  }
  return html;
}

function getActionsSection() {
  let html = "";
  // Task 4: Media
  if (store.get("task4.status") !== "sent") {
    html += menuItem("#/task4", "📷", "Share Media", "Task 4: Add details to request");
  }
  // Task 5: Rating
  if (!store.get("task5.submitted")) {
    if(html) html += `<div class="divider" style="margin:0;"></div>`;
    html += menuItem("#/task5", "⭐", "Rate Completed Job", "Task 5: Review provider");
  }
  return html ? `<div class="card col" style="gap:0; padding:0; overflow:hidden;">${html}</div>` : "";
}

function getUpcomingSection() {
  let html = "";
  if (store.get("task2.bookingStatus") === "confirmed") {
    html += activeCard("📅 Plumbing Visit", "Confirmed for Wed, 14:00", "bg-green-50", "#/task2/confirm");
  }
  if (store.get("task3.bookingStatus") === "confirmed") {
    html += activeCard("⚙️ Appliance Repair", "Confirmed for Friday, 10:00", "bg-green-50", "#/task3/confirm");
  }
  return html;
}

function renderHeader(user) {
  const roleColors = {
    client: { bg: "#eff6ff", text: "#1e40af", border: "#dbeafe" },
    provider: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    admin: { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" }
  };
  const style = roleColors[user.activeRole] || roleColors.client;
  const roleDisplay = { client: "Client", provider: "Provider", admin: "Admin" };

  return `
    <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:24px;">
      <div class="col" style="gap:4px;">
        <div class="row" style="align-items:center; gap:8px;">
          <div style="width:32px; height:32px; background:var(--neutral-200); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">👤</div>
          <div class="title" style="margin:0; font-size:18px;">${user.name}</div>
        </div>
        <div style="display:inline-block; margin-top:4px;">
           <span style="font-size:12px; background:${style.bg}; color:${style.text}; padding:2px 8px; border-radius:4px; font-weight:600;">${roleDisplay[user.activeRole]} View</span>
        </div>
      </div>
    </div>
  `;
}

function renderBottomNav(role, activeTab) {
  if (role === 'admin') return "";

  const btnStyle = (isActive) => `
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
    padding:12px; cursor:pointer; color: ${isActive ? 'var(--primary-600)' : 'var(--neutral-400)'};
    border-top: 2px solid ${isActive ? 'var(--primary-600)' : 'transparent'};
  `;

  if (role === 'client') {
    return `
      <div style="position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:390px; background:white; border-top:1px solid var(--neutral-200); display:flex; box-shadow:0 -4px 10px rgba(0,0,0,0.05); z-index:100;">
        <div onclick="window.setTab('services')" style="${btnStyle(activeTab === 'services')}">
          <div style="font-size:20px;">🔍</div>
          <div style="font-size:11px; font-weight:600;">Services</div>
        </div>
        <div onclick="window.setTab('activity')" style="${btnStyle(activeTab === 'activity')}">
          <div style="font-size:20px;">⚡</div>
          <div style="font-size:11px; font-weight:600;">Activity</div>
        </div>
      </div>
    `;
  }

  if (role === 'provider') {
    return `
      <div style="position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:390px; background:white; border-top:1px solid var(--neutral-200); display:flex; box-shadow:0 -4px 10px rgba(0,0,0,0.05); z-index:100;">
        <div onclick="window.setTab('dashboard')" style="${btnStyle(activeTab === 'dashboard')}">
          <div style="font-size:20px;">📊</div>
          <div style="font-size:11px; font-weight:600;">Dashboard</div>
        </div>
        <div onclick="window.setTab('requests')" style="${btnStyle(activeTab === 'requests')}">
          <div style="font-size:20px;">📩</div>
          <div style="font-size:11px; font-weight:600;">Jobs</div>
        </div>
      </div>
    `;
  }
}

function serviceCard(icon, title, subtitle, link) {
  return `
    <div class="card col" onclick="window.location.hash='${link}'" style="align-items:center; text-align:center; padding:16px; cursor:pointer;">
      <div style="font-size:32px; margin-bottom:8px;">${icon}</div>
      <div class="subtitle" style="font-size:14px;">${title}</div>
      <div class="body muted" style="font-size:11px;">${subtitle}</div>
    </div>
  `;
}

function menuItem(href, icon, title, sub) {
  return `
    <div onclick="window.location.hash='${href}'" style="padding:16px; cursor:pointer; display:flex; align-items:center; gap:12px; transition:background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
      <div style="font-size:20px;">${icon}</div>
      <div class="col" style="flex:1;">
        <div class="subtitle" style="font-size:14px;">${title}</div>
        <div class="body muted" style="font-size:12px;">${sub}</div>
      </div>
      <div style="color:var(--neutral-400);">→</div>
    </div>
  `;
}

function activeCard(title, body, bgClass, link) {
  const colors = {
    "bg-red-50": "#fef2f2",
    "bg-blue-50": "#eff6ff",
    "bg-green-50": "#f0fdf4",
    "bg-yellow-50": "#fefce8",
    "bg-orange-50": "#fff7ed",
    "bg-gray-50": "#f8fafc"
  };
  const bg = colors[bgClass] || "#fff";
  
  return `
    <div class="card" onclick="window.location.hash='${link}'" style="background:${bg}; border:1px solid rgba(0,0,0,0.05); cursor:pointer; padding:16px;">
      <div class="subtitle" style="font-size:14px; margin-bottom:4px; font-weight:700;">${title}</div>
      <div class="body" style="font-size:13px; opacity:0.9;">${body}</div>
    </div>
  `;
}