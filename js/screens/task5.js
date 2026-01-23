import { store } from "../store.js";
import { toast, renderLoading, required } from "../ui.js";
import { COMPLETED_JOBS } from "../../data/mock-db.js";

export function Task5JobList({ mount, router }) {
  const ratedIds = store.get("task5.ratedJobIds") || [];
  
  const jobs = COMPLETED_JOBS.filter(j => j.canRate && !ratedIds.includes(j.id));

  mount(`
    <section class="screen">
      ${header("Reviews", "#/home")}
      <div class="title">Rate a Job</div>
      <div class="body muted">Select a recently completed service to review.</div>

      <div class="grid">
        ${jobs.length === 0 
          ? `<div class="card body muted" style="text-align:center; padding:40px;">No pending reviews. All caught up!</div>` 
          : jobs.map(jobCard).join("")}
      </div>

      <div class="sticky-actions">
        <a class="btn ghost" href="#/home">Back to Home</a>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-rate-id]").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.rateId;
      store.set("task5.selectedJobId", id);
      store.set("task5.reflection", {});
      store.set("task5.rating", 0);
      store.set("task5.feedback", "");
      router.navigate("#/task5/reflect");
    };
  });
}

export function Task5Reflect({ mount, router }) {
  const job = getSelectedJob();
  if (!job) return router.navigate("#/task5");

  const reflection = store.get("task5.reflection") || {};

  mount(`
    <section class="screen">
      ${header("Step 1 of 3", "#/task5")}
      <div class="title">Reflect on experience</div>
      <div class="body muted">Quick impressions for ${escapeHtml(job.provider)}.</div>

      <div class="card">
        ${reflectionGroup("Timeliness", ["On time", "Slightly late", "Very late"], reflection.timeliness, "timeliness")}
        <div class="divider"></div>
        ${reflectionGroup("Quality", ["Excellent", "Good", "Needs improvement"], reflection.quality, "quality")}
        <div class="divider"></div>
        ${reflectionGroup("Communication", ["Clear", "Average", "Poor"], reflection.communication, "communication")}
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="continue">Continue</button>
      </div>
    </section>
  `);

  bindChipGroups();

  document.getElementById("continue").onclick = () => {
    router.navigate("#/task5/rate");
  };
}

export function Task5Rating({ mount, router }) {
  const job = getSelectedJob();
  if (!job) return router.navigate("#/task5");

  const currentRating = store.get("task5.rating") || 0;

  mount(`
    <section class="screen">
      ${header("Step 2 of 3", "#/task5/reflect")}
      <div class="title">Overall Rating</div>
      <div class="body muted">Tap the stars to rate your provider.</div>

      <div class="card col" style="align-items:center; padding:32px 16px;">
        <div class="row" id="star-container">
          ${renderStars(currentRating)}
        </div>
        <div class="subtitle" id="rating-label" style="margin-top:16px; color:var(--primary-500);">
          ${currentRating > 0 ? `Selected: ${currentRating} stars` : "Tap to rate"}
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="continue">Continue</button>
      </div>
    </section>
  `);

  const container = document.getElementById("star-container");
  container.onclick = (e) => {
    const target = e.target.closest("[data-star-val]");
    if (target) {
      const val = parseInt(target.dataset.starVal, 10);
      store.set("task5.rating", val);
      container.innerHTML = renderStars(val);
      document.getElementById("rating-label").textContent = `Selected: ${val} stars`;
    }
  };

  document.getElementById("continue").onclick = () => {
    if (!store.get("task5.rating")) {
      toast("Please select a star rating.", "error");
      return;
    }
    router.navigate("#/task5/feedback");
  };
}

export function Task5Feedback({ mount, router }) {
  const job = getSelectedJob();
  if (!job) return router.navigate("#/task5");

  const draft = store.get("task5.feedback") || "";

  mount(`
    <section class="screen">
      ${header("Step 3 of 3", "#/task5/rate")}
      <div class="title">Optional Feedback</div>
      <div class="body muted">Share details to help others.</div>

      <div class="card">
        <div class="input">
          <label class="body">Your review</label>
          <textarea id="feedback" rows="6" placeholder="Arrived on time, clearly explained the issue...">${escapeHtml(draft)}</textarea>
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="submit">Submit Review</button>
      </div>
    </section>
  `);

  document.getElementById("feedback").addEventListener("input", (e) => {
    store.set("task5.feedback", e.target.value);
  });

  document.getElementById("submit").onclick = () => {
    mount(`
      <section class="screen">
        ${header("Submitting...", "#")}
        <div class="title">Posting review...</div>
        ${renderLoading("Updating provider profile")}
      </section>
    `);

    setTimeout(() => {
      router.navigate("#/task5/success");
    }, 1200);
  };
}

export function Task5Success({ mount, router }) {
  const rating = store.get("task5.rating");
  const job = getSelectedJob();

  const id = store.get("task5.selectedJobId");
  let ratedIds = store.get("task5.ratedJobIds") || [];
  
  if (id && !ratedIds.includes(id)) {
    ratedIds.push(id);
    store.set("task5.ratedJobIds", ratedIds);
  }
  
  const allRateable = COMPLETED_JOBS.filter(j => j.canRate);
  const allDone = allRateable.every(j => ratedIds.includes(j.id));
  
  store.set("task5.submitted", allDone);

  mount(`
    <section class="screen" style="text-align:center; align-items:center; justify-content:center;">
      <div style="font-size:48px; margin-bottom:16px;">🎉</div>
      <div class="title">Thank you!</div>
      <div class="body muted">Your review for <b>${job?.provider}</b> has been posted.</div>

      <div class="card" style="width:100%; margin-top:24px; text-align:left;">
        <div class="row" style="justify-content:space-between;">
           <span class="subtitle">You rated</span>
           <span class="badge" style="background:#fef3c7; color:#d97706;">${rating} Stars</span>
        </div>
        <div class="divider"></div>
        <div class="body muted">Provider's new rating: <b>4.9</b> (122 reviews)</div>
      </div>

      <div class="sticky-actions" style="width:100%">
        ${!allDone 
          ? `<a class="btn primary" href="#/task5">Rate Next Job</a>` 
          : `<div class="body muted" style="margin-bottom:12px;">All jobs reviewed!</div>`
        }
        <a class="btn secondary" href="#/home">Back to Home</a>
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
      <div class="row" style="justify-content:space-between;">
        <div class="subtitle">${escapeHtml(job.title)}</div>
        <span class="badge">${job.price}</span>
      </div>
      <div class="body muted">${escapeHtml(job.provider)} • ${job.date}</div>
      <div class="divider"></div>
      <button class="btn secondary" data-rate-id="${job.id}">Rate this Job</button>
    </div>
  `;
}

function reflectionGroup(title, opts, current, key) {
  return `
    <div class="subtitle" style="font-size:16px;">${title}</div>
    <div class="chips">
      ${opts.map(o => chip(o, current, key)).join("")}
    </div>
  `;
}

function chip(label, selectedVal, groupKey) {
  const isSelected = selectedVal === label;
  return `
    <button class="chip" type="button" 
            aria-pressed="${isSelected}" 
            data-chip-group="${groupKey}" 
            data-chip-val="${label}">
      ${label}
    </button>
  `;
}

function bindChipGroups() {
  document.querySelectorAll("[data-chip-group]").forEach(btn => {
    btn.onclick = () => {
      const group = btn.dataset.chipGroup;
      const val = btn.dataset.chipVal;
      
      store.set(`task5.reflection.${group}`, val);
      
      const siblings = document.querySelectorAll(`[data-chip-group="${group}"]`);
      siblings.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
    };
  });
}

function renderStars(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const fill = i <= rating ? "#fbbf24" : "#e2e8f0";
    html += `
      <div data-star-val="${i}" style="cursor:pointer; padding:2px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="${fill}" stroke="${fill === '#e2e8f0' ? '#94a3b8' : fill}" stroke-width="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
    `;
  }
  return html;
}

function getSelectedJob() {
  const id = store.get("task5.selectedJobId");
  return COMPLETED_JOBS.find(j => j.id === id);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}