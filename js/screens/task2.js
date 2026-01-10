import { store } from "../store.js";
import { toast, renderLoading, required } from "../ui.js";
import { PLUMBERS } from "../../data/mock-db.js";
import { validateTask2Filters } from "../screens/validators.js";

function header(title, backHref) {
  return `
    <div class="row" style="justify-content:space-between;">
      <a class="btn ghost" href="${backHref}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

export function Task2Context({ mount, router }) {
  mount(`
    <section class="screen">
      ${header("Task 2", "#/home")}
      <div class="title">Find a plumber</div>
      <div class="body muted">Search and compare plumbers nearby (mocked).</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">What’s the issue?</div>
        <div class="chips" role="group" aria-label="Problem">
          ${chip("Kitchen leak", store.get("task2.problem"))}
          ${chip("Bathroom clog", store.get("task2.problem"))}
          ${chip("Pipe burst", store.get("task2.problem"))}
          ${chip("Low water pressure", store.get("task2.problem"))}
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="continue">Continue</button>
      </div>
    </section>
  `);

  bindChipSelection("task2.problem");

  document.getElementById("continue").onclick = () => {
    if (!required(store.get("task2.problem"))) {
      toast("Please select an issue type.", "error");
      return;
    }
    router.navigate("#/task2/filters");
  };
}

export function Task2SearchFilters({ mount, router }) {
  const f = store.get("task2.filters");

  mount(`
    <section class="screen">
      ${header("Task 2", "#/task2/context")}
      <div class="title">Filters</div>
      <div class="body muted">Adjust what “best match” means for you.</div>

      <div class="card">
        <div class="input">
          <label class="body">Max distance (km)</label>
          <input id="dist" type="number" min="1" max="50" value="${f.maxDistanceKm}">
          <div class="error-text" id="distErr" style="display:none;"></div>
        </div>

        <div class="input" style="margin-top:12px;">
          <label class="body">Min rating</label>
          <input id="rating" type="number" step="0.1" min="1" max="5" value="${f.minRating}">
          <div class="error-text" id="ratingErr" style="display:none;"></div>
        </div>

        <div class="input" style="margin-top:12px;">
          <label class="body">Max visit fee (RON)</label>
          <input id="fee" type="number" min="0" max="1000" value="${f.maxVisitFee}">
          <div class="error-text" id="feeErr" style="display:none;"></div>
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="search">Search</button>
      </div>
    </section>
  `);

  document.getElementById("back").onclick = () => router.navigate("#/task2/context");

  document.getElementById("search").onclick = () => {
    const raw = {
      maxDistanceKm: document.getElementById("dist").value,
      minRating: document.getElementById("rating").value,
      maxVisitFee: document.getElementById("fee").value
    };

    const result = validateTask2Filters(raw);

    // clear errors
    setErr("distErr", "");
    setErr("ratingErr", "");
    setErr("feeErr", "");

    if (!result.ok) {
      if (result.errors.dist) setErr("distErr", result.errors.dist);
      if (result.errors.rating) setErr("ratingErr", result.errors.rating);
      if (result.errors.fee) setErr("feeErr", result.errors.fee);

      toast("Please fix filter errors.", "error");
      return;
    }

    // save validated values
    store.set("task2.filters.maxDistanceKm", result.values.maxDistanceKm);
    store.set("task2.filters.minRating", result.values.minRating);
    store.set("task2.filters.maxVisitFee", result.values.maxVisitFee);

    router.navigate("#/task2/results");
  };

  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg || "";
    el.style.display = msg ? "block" : "none";
  }
}

export function Task2Results({ mount, router }) {
  mount(`
    <section class="screen">
      ${header("Task 2", "#/task2/filters")}
      <div class="title">Searching plumbers…</div>
      ${renderLoading("Applying your filters")}
    </section>
  `);

  setTimeout(() => {
    const filtered = applyFilters(PLUMBERS, store.get("task2.filters"));

    if (filtered.length === 0) {
      mount(`
        <section class="screen">
          ${header("Task 2", "#/task2/filters")}
          <div class="title">No results</div>
          <div class="body muted">Try increasing distance or relaxing rating/fee.</div>

          <div class="sticky-actions">
            <button class="btn primary" id="backToFilters">Adjust filters</button>
            <a class="btn secondary" href="#/home">Go home</a>
          </div>
        </section>
      `);

      document.getElementById("backToFilters").onclick = () => router.navigate("#/task2/filters");
      return;
    }

    const savedIds = new Set(store.get("task2.savedProviderIds") || []);

    mount(`
      <section class="screen">
        ${header("Task 2", "#/task2/filters")}
        <div class="title">Results</div>
        <div class="body muted" id="hint">Save 2 plumbers to compare.</div>

        <div class="grid" id="list">
          ${filtered.map(p => plumberCard(p, savedIds.has(p.id))).join("")}
        </div>

        <div class="sticky-actions">
          <button class="btn secondary" id="back">Back</button>
          <button class="btn primary" id="compare">Compare saved</button>
        </div>
      </section>
    `);

    document.getElementById("back").onclick = () => router.navigate("#/task2/filters");
    updateCompareButton();

    document.querySelectorAll("[data-save]").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleSaveInPlace(btn);
        updateCompareButton();
      });
    });

    document.getElementById("compare").onclick = () => {
      const ids = store.get("task2.savedProviderIds") || [];
      if (ids.length !== 2) {
        toast("Please save exactly 2 plumbers to compare.", "error");
        return;
      }
      router.navigate("#/task2/compare");
    };
  }, 900);
}

export function Task2CompareSaved({ mount, router }) {
  const ids = store.get("task2.savedProviderIds") || [];
  if (ids.length !== 2) {
    toast("Save 2 plumbers first.", "error");
    router.navigate("#/task2/results");
    return;
  }

  const a = PLUMBERS.find(p => p.id === ids[0]);
  const b = PLUMBERS.find(p => p.id === ids[1]);

  const selectedId = store.get("task2.selectedProviderId");

  mount(`
    <section class="screen">
      ${header("Task 2", "#/task2/results")}
      <div class="title">Compare</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">${a.name} vs ${b.name}</div>
        <div class="divider"></div>
        ${compareRow("Rating", `⭐ ${a.rating}`, `⭐ ${b.rating}`)}
        ${compareRow("Distance", `${a.distanceKm} km`, `${b.distanceKm} km`)}
        ${compareRow("Visit fee", `${a.visitFee} RON`, `${b.visitFee} RON`)}
        ${compareRow("Warranty", a.warranty, b.warranty)}
        ${compareRow("ETA", `${a.etaMin} min`, `${b.etaMin} min`)}
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Choose who to contact</div>
        <div class="chips">
          ${pickChip(a.name, selectedId === a.id, a.id)}
          ${pickChip(b.name, selectedId === b.id, b.id)}
        </div>
        <div class="body muted" style="margin-top:8px;">You’ll send a quick message before booking.</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="message">Message to clarify</button>
      </div>
    </section>
  `);

  document.querySelectorAll("[data-pick]").forEach(btn => {
    btn.addEventListener("click", () => {
      store.set("task2.selectedProviderId", btn.getAttribute("data-pick"));
      router.navigate("#/task2/compare"); // re-render to show pressed state
    });
  });

  document.getElementById("back").onclick = () => router.navigate("#/task2/results");
  document.getElementById("message").onclick = () => {
    if (!required(store.get("task2.selectedProviderId"))) {
      toast("Pick one plumber to contact.", "error");
      return;
    }
    router.navigate("#/task2/message");
  };
}

export function Task2Message({ mount, router }) {
  const id = store.get("task2.selectedProviderId");
  const p = PLUMBERS.find(x => x.id === id);

  if (!p) {
    toast("Choose a plumber first.", "error");
    router.navigate("#/task2/compare");
    return;
  }

  const draft =
    store.get("task2.messageDraft") ||
    `Hi ${p.name}, can you confirm availability today and estimated total cost?`;

  mount(`
    <section class="screen">
      ${header("Task 2", "#/task2/compare")}
      <div class="title">Message</div>
      <div class="body muted">Mock message (no real chat in Phase 7).</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">To: ${p.name}</div>
        <div class="input" style="margin-top:12px;">
          <label class="body">Your message</label>
          <textarea id="msg" rows="6">${escapeHtml(draft)}</textarea>
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="send">Send</button>
      </div>
    </section>
  `);

  document.getElementById("msg").addEventListener("input", (e) => {
    store.set("task2.messageDraft", e.target.value);
  });

  document.getElementById("back").onclick = () => router.navigate("#/task2/compare");

  document.getElementById("send").onclick = () => {
    mount(`
      <section class="screen">
        ${header("Task 2", "#/task2/message")}
        <div class="title">Sending…</div>
        ${renderLoading("Delivering message")}
      </section>
    `);

    setTimeout(() => {
      toast("Message sent ✅ (mock)", "success");
      router.navigate("#/task2/confirm");
    }, 700);
  };
}

export function Task2Confirm({ mount, router }) {
  const id = store.get("task2.selectedProviderId");
  const p = PLUMBERS.find(x => x.id === id);

  if (!p) {
    toast("Choose a plumber first.", "error");
    router.navigate("#/task2/compare");
    return;
  }

  mount(`
    <section class="screen">
      ${header("Task 2", "#/home")}
      <div class="title">Booking request</div>
      <div class="body muted">Confirm you want to book ${p.name} (mock).</div>

      <div class="card">
        <div class="subtitle" style="font-size:16px;">Summary</div>
        <div class="body"><b>Issue:</b> ${escapeHtml(store.get("task2.problem"))}</div>
        <div class="body"><b>Chosen plumber:</b> ${p.name}</div>
        <div class="body"><b>Visit fee:</b> ${p.visitFee} RON</div>
        <div class="body"><b>ETA:</b> ${p.etaMin} min</div>
      </div>

      <div class="sticky-actions">
        <button class="btn secondary" id="back">Back</button>
        <button class="btn primary" id="confirm">Confirm booking</button>
      </div>
    </section>
  `);

  document.getElementById("back").onclick = () => router.navigate("#/task2/message");

  document.getElementById("confirm").onclick = () => {
    mount(`
      <section class="screen">
        ${header("Task 2", "#/home")}
        <div class="title">Confirming…</div>
        ${renderLoading("Finalizing booking")}
      </section>
    `);

    setTimeout(() => {
      const fail = Math.random() < 0.15;

      if (fail) {
        toast("Booking failed. Try again or choose another plumber.", "error");
        router.navigate("#/task2/results");
        return;
      }

      store.set("task2.bookingStatus", "confirmed");
      toast("Booking confirmed ✅", "success");

      mount(`
        <section class="screen">
          ${header("Task 2", "#/home")}
          <div class="title">You’re booked!</div>
          <div class="body muted">Prototype confirmation screen.</div>

          <div class="sticky-actions">
            <a class="btn primary" href="#/home">Done</a>
          </div>
        </section>
      `);
    }, 900);
  };
}

/* ------------ helpers ------------ */

function applyFilters(list, f) {
  return list.filter(p =>
    p.distanceKm <= f.maxDistanceKm &&
    p.rating >= f.minRating &&
    p.visitFee <= f.maxVisitFee
  );
}

function updateCompareButton() {
  const count = (store.get("task2.savedProviderIds") || []).length;
  const btn = document.getElementById("compare");
  const hint = document.getElementById("hint");
  if (!btn) return;

  btn.textContent = `Compare saved (${count}/2)`;

  if (hint) {
    hint.textContent = count === 2
      ? "Ready ✅ You saved 2 plumbers."
      : "Save 2 plumbers to compare.";
  }
}

function toggleSaveInPlace(btnEl) {
  const id = btnEl.getAttribute("data-save");
  const current = store.get("task2.savedProviderIds") || [];
  const isSaved = current.includes(id);

  if (isSaved) {
    const next = current.filter(x => x !== id);
    store.set("task2.savedProviderIds", next);
    toast("Removed from saved.", "info");

    btnEl.classList.remove("secondary");
    btnEl.classList.add("primary");
    btnEl.textContent = "Save for compare";
    return;
  }

  if (current.length >= 2) {
    toast("You can save only 2 plumbers for comparison.", "error");
    return;
  }

  const next = [...current, id];
  store.set("task2.savedProviderIds", next);
  toast("Saved ✅", "success");

  btnEl.classList.remove("primary");
  btnEl.classList.add("secondary");
  btnEl.textContent = "Saved";
}

function plumberCard(p, saved) {
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between;">
        <div class="subtitle" style="font-size:16px;">${p.name}</div>
        <span class="badge">⭐ ${p.rating}</span>
      </div>
      <div class="body muted">${p.distanceKm} km • ${p.visitFee} RON visit • ETA ${p.etaMin} min</div>
      <div class="body muted">Warranty: ${p.warranty}</div>
      <div class="divider"></div>
      <button class="btn ${saved ? "secondary" : "primary"}" data-save="${p.id}">
        ${saved ? "Saved" : "Save for compare"}
      </button>
    </div>
  `;
}

function compareRow(label, left, right) {
  return `
    <div class="row" style="justify-content:space-between;">
      <div class="body muted" style="width:30%;">${label}</div>
      <div class="body" style="width:35%; text-align:left;"><b>${left}</b></div>
      <div class="body" style="width:35%; text-align:right;"><b>${right}</b></div>
    </div>
  `;
}

function chip(label, selected) {
  const pressed = selected === label ? "true" : "false";
  return `<button class="chip" type="button" aria-pressed="${pressed}" data-chip="${escapeAttr(label)}">${label}</button>`;
}

function pickChip(label, pressed, id) {
  return `<button class="chip" type="button" aria-pressed="${pressed ? "true" : "false"}" data-pick="${id}">${escapeHtml(label)}</button>`;
}

function bindChipSelection(storePath) {
  document.querySelectorAll("[data-chip]").forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-chip");
      store.set(storePath, value);
      document.querySelectorAll("[data-chip]").forEach(b => {
        b.setAttribute("aria-pressed", b.getAttribute("data-chip") === value ? "true" : "false");
      });
    });
  });
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replaceAll("\n", " ");
}
