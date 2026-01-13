import { store } from "../store.js";

export function HomeScreen({ mount, router }) {
  const user = store.get("user") || { name: "Mara", activeRole: "client" };

  window.switchRole = (role) => {
    store.set("user.activeRole", role);
    HomeScreen({ mount, router });
  };

  const role = user.activeRole;
  if (role === 'admin') renderAdminView(mount, user);
  else if (role === 'provider') renderProviderView(mount, user);
  else renderClientView(mount, user);
}

function renderClientView(mount, user) {
  mount(`
    <section class="screen">
      ${renderHeader(user)}
      
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

      <div class="card" style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color:white; border:none; margin-bottom:24px;">
        <div class="row" style="justify-content:space-between; align-items:center;">
          <div class="col">
            <div class="subtitle" style="color:white;">Join as Provider</div>
            <div class="body" style="color:#dbeafe; font-size:13px;">Task 7: Registration</div>
          </div>
          <button class="btn" onclick="window.location.hash='#/task7'" style="background:white; color:#1e40af; border:none; font-size:13px; height:32px; padding:0 12px; font-weight:600;">
            Register
          </button>
        </div>
      </div>

      <div class="subtitle" style="margin-bottom:12px;">Active Requests & History</div>
      <div class="card col" style="gap:0; padding:0; overflow:hidden;">
        ${menuItem("#/task4", "📷", "Share Media", "Task 4: Add details to request")}
        <div class="divider" style="margin:0;"></div>
        ${menuItem("#/task5", "⭐", "Rate Completed Job", "Task 5: Review provider")}
        <div class="divider" style="margin:0;"></div>
        ${menuItem("#/task6", "⚠️", "Report an Issue", "Task 6: Request refund")}
      </div>
    </section>
  `);
}

function renderProviderView(mount, user) {
  mount(`
    <section class="screen">
      ${renderHeader(user)}
      
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

      <div class="subtitle" style="margin-bottom:12px;">Job Management</div>
      <div class="card col" style="gap:0; padding:0; overflow:hidden;">
        ${menuItem("#/task8", "📩", "New Job Requests", "Task 8: Accept/Decline")}
        <div class="divider" style="margin:0;"></div>
        ${menuItem("#/task9", "📅", "Active Appointments", "Task 9: Daily schedule")}
        <div class="divider" style="margin:0;"></div>
        ${menuItem("#/task10", "📍", "Update Work Status", "Task 10: Mark complete / Proof")}
      </div>

      <div class="subtitle" style="margin:24px 0 12px 0;">Profile</div>
      <div class="card col" style="gap:0; padding:0; overflow:hidden;">
        ${menuItem("#/task7", "👷", "Edit Profile", "Task 7: Update skills/docs")}
      </div>
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
        ${menuItem("#/task11", "🛡️", "Verify Credentials", "Task 11: Provider onboarding")}
        <div class="divider" style="margin:0;"></div>
        ${menuItem("#/task12", "⚖️", "Dispute Resolution", "Task 12: Moderate complaints")}
      </div>
    </section>
  `);
}

function renderHeader(user) {
  const roleColors = {
    client: { bg: "#eff6ff", text: "#1e40af", border: "#dbeafe" },
    provider: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    admin: { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" }
  };
  const style = roleColors[user.activeRole] || roleColors.client;

  // Mapping internal role names to PDF terminology
  const roleDisplay = {
    client: "Beneficiary",
    provider: "Service Provider",
    admin: "Administrator"
  };

  return `
    <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:24px;">
      <div class="col" style="gap:4px;">
        <div class="row" style="align-items:center; gap:8px;">
          <div style="width:32px; height:32px; background:var(--neutral-200); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px;">👤</div>
          <div class="title" style="margin:0; font-size:18px;">${user.name}</div>
        </div>
        <div style="position:relative; display:inline-block; margin-top:4px;">
          <select onchange="window.switchRole(this.value)" 
            style="appearance:none; background:${style.bg}; color:${style.text}; border:1px solid ${style.border}; padding:6px 28px 6px 12px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; outline:none;">
            <option value="client" ${user.activeRole === 'client' ? 'selected' : ''}>View: ${roleDisplay.client}</option>
            <option value="provider" ${user.activeRole === 'provider' ? 'selected' : ''}>View: ${roleDisplay.provider}</option>
            <option value="admin" ${user.activeRole === 'admin' ? 'selected' : ''}>View: ${roleDisplay.admin}</option>
          </select>
          <div style="position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; font-size:10px; color:${style.text};">▼</div>
        </div>
      </div>
      <button onclick="if(confirm('Reset all data?')){ localStorage.clear(); location.reload(); }" 
        style="background:none; border:none; color:var(--neutral-400); font-size:12px; cursor:pointer;">Reset</button>
    </div>
  `;
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