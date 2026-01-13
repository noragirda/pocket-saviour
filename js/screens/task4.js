import { store } from "../store.js";
import { toast, renderLoading } from "../ui.js";

// Helper function for header with back button
function header(title, backHref) {
  return `
    <div class="row" style="justify-content:space-between;">
      <a class="btn ghost" href="${backHref}" style="height:40px;padding:0 12px;">← Back</a>
      <span class="badge">${title}</span>
    </div>
  `;
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// AI Summary Mock Data
const AI_SUMMARY = {
  tags: [
    "Location: Kitchen electrical panel",
    "Issue: Circuit breaker tripping",
    "Possible cause: Overloaded circuit",
    "Secondary: Faulty switch or wiring"
  ],
  summary: "Analysis indicates a recurring kitchen electrical panel issue. The breaker keeps tripping, suggesting either an overloaded circuit from too many appliances on one line, or a faulty breaker/switch that needs replacement. Recommend provider to bring: circuit tester, replacement breaker (15A/20A), wire stripper, insulated tools, and multimeter for load testing."
};

// Initialize task4 data structure
function initTask4Store() {
  if (!store.get("task4")) {
    store.set("task4", {
      files: [],              // Array of {type: 'photo'|'video', id: unique}
      clarificationText: "",  // User's note
      requestId: "1842",      // Mock request ID
      requestTitle: "Power issue in kitchen",
      providerName: "Ion Pop – Electrician",
      status: "draft"         // draft | sent
    });
  }
}

// Task 4 Context Screen
export function Task4Context({ mount, router }) {
  initTask4Store();
  
  mount(`
    <section class="screen">
      ${header("Task 4", "#/home")}
      <div class="title">Share Media of the Problem</div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Your situation</div>
        <div class="body">
          You're experiencing a <b>power issue in the kitchen</b>. The electrical panel breaker keeps tripping, 
          and you suspect the circuit is overloaded or there's a faulty switch. The service provider needs 
          visual confirmation to bring the right tools and parts.
        </div>
        <div class="divider"></div>
        <div class="body muted" style="font-size:14px;">
           <b>Why share media?</b> Photos and videos help electricians assess the problem remotely, 
          estimate repair time accurately, and arrive fully prepared. This reduces waiting time and 
          prevents unnecessary follow-up visits.
        </div>
      </div>
      
      <div class="sticky-actions">
        <button class="btn primary" id="startBtn">Start</button>
      </div>
    </section>
  `);

  document.getElementById("startBtn").addEventListener("click", () => {
    router.navigate("#/task4/capture");
  });
}

// Capture Media Screen
export function Task4CaptureMedia({ mount, router }) {
  initTask4Store();

  function renderMediaGrid() {
    const files = store.get("task4.files") || [];
    if (!files || files.length === 0) {
      return '<div class="body muted">No media attached yet.</div>';
    }
    
    // Count each type independently
    const counts = { video: 0, photo: 0, file: 0 };
    
    return `
      <div class="media-grid">
        ${files.map((file) => {
          counts[file.type] = (counts[file.type] || 0) + 1;
          const emoji = file.type === 'video' ? '🎥' : file.type === 'file' ? '📄' : '📷';
          const label = file.type === 'video' ? 'Video' : file.type === 'file' ? 'File' : 'Photo';
          return `
            <div class="media-tile" data-file-id="${file.id}">
              <div style="font-size:32px;">${emoji}</div>
              <div class="body" style="font-size:12px;">${label} ${counts[file.type]}</div>
              <button class="media-delete-btn" data-delete-id="${file.id}" title="Delete">×</button>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  mount(`
    <section class="screen">
      ${header("Task 4", "#/task4/context")}
      <div class="title">Capture the problem</div>
      <div class="body muted">Record a short video or take 2–3 photos. Keep lighting as good as possible.</div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Capture options</div>
        <div class="row" style="gap:8px; flex-wrap:wrap;">
          <button class="btn secondary" id="recordVideo">🎥 Record video</button>
          <button class="btn ghost" id="takePhoto">📷 Take photo</button>
          <button class="btn ghost" id="uploadGallery">Upload from gallery</button>
        </div>
        <div class="body muted" style="font-size:13px; margin-top:8px;">Video under 30s recommended.</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Preview</div>
        <div id="mediaPreview">
          ${renderMediaGrid()}
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="attachBtn">Attach to request</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  // Add media handlers
  function addMedia(type) {
    const files = store.get("task4.files") || [];
    const newFile = {
      type: type,
      id: Date.now() + Math.random() // Simple unique ID
    };
    files.push(newFile);
    store.set("task4.files", files);
    
    // Re-render preview
    const preview = document.getElementById("mediaPreview");
    if (preview) {
      preview.innerHTML = renderMediaGrid();
      attachDeleteHandlers();
    }
    
    const label = type === 'video' ? 'Video' : type === 'file' ? 'File' : 'Photo';
    toast(`${label} added`, "success");
  }

  function deleteMedia(fileId) {
    let files = store.get("task4.files") || [];
    files = files.filter(f => f.id !== fileId);
    store.set("task4.files", files);
    
    // Re-render preview
    const preview = document.getElementById("mediaPreview");
    if (preview) {
      preview.innerHTML = renderMediaGrid();
      attachDeleteHandlers();
    }
    
    toast("Media removed", "info");
  }

  function attachDeleteHandlers() {
    document.querySelectorAll("[data-delete-id]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const fileId = parseFloat(btn.getAttribute("data-delete-id"));
        deleteMedia(fileId);
      });
    });
  }

  // Initial delete handlers
  attachDeleteHandlers();

  document.getElementById("recordVideo").addEventListener("click", () => addMedia("video"));
  document.getElementById("takePhoto").addEventListener("click", () => addMedia("photo"));
  document.getElementById("uploadGallery").addEventListener("click", () => addMedia("file"));

  document.getElementById("attachBtn").addEventListener("click", () => {
    const files = store.get("task4.files") || [];
    if (files.length === 0) {
      toast("Please add at least one photo or video", "error");
      return;
    }
    router.navigate("#/task4/attach");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task4/context");
  });
}

// Attach to Request Screen
export function Task4AttachToRequest({ mount, router }) {
  initTask4Store();
  const requestId = store.get("task4.requestId");
  const requestTitle = store.get("task4.requestTitle");

  function renderMediaGrid() {
    const files = store.get("task4.files") || [];
    if (!files || files.length === 0) {
      return '<div class="body muted">No media attached.</div>';
    }
    
    // Count each type independently
    const counts = { video: 0, photo: 0, file: 0 };
    
    return `
      <div class="media-grid">
        ${files.map((file) => {
          counts[file.type] = (counts[file.type] || 0) + 1;
          const emoji = file.type === 'video' ? '🎥' : file.type === 'file' ? '📄' : '📷';
          const label = file.type === 'video' ? 'Video' : file.type === 'file' ? 'File' : 'Photo';
          return `
            <div class="media-tile">
              <div style="font-size:32px;">${emoji}</div>
              <div class="body" style="font-size:12px;">${label} ${counts[file.type]}</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  mount(`
    <section class="screen">
      ${header("Task 4", "#/task4/capture")}
      <div class="title">Attach to request</div>
      <div class="body muted">You're adding media to: <b>Request #${requestId} – "${requestTitle}"</b></div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Current attachments</div>
        ${renderMediaGrid()}
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="clarifyBtn">Add clarification</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  document.getElementById("clarifyBtn").addEventListener("click", () => {
    router.navigate("#/task4/clarify");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task4/capture");
  });
}

// Clarify & AI Tagging Screen
export function Task4Clarify({ mount, router }) {
  initTask4Store();
  const savedText = store.get("task4.clarificationText") || "";
  const files = store.get("task4.files") || [];
  let aiLoaded = false;

  function renderAISection() {
    if (!aiLoaded) {
      return `
        <div class="card">
          <div class="subtitle" style="font-size:14px;">AI Vision Analysis</div>
          ${renderLoading("AI is analyzing your media... This may take up to 5 seconds")}
        </div>
      `;
    }

    return `
      <div class="card">
        <div class="subtitle" style="font-size:14px;">AI Vision result</div>
        <div class="body muted">Identified elements:</div>
        <div class="ai-tags">
          ${AI_SUMMARY.tags.map(tag => `<span class="ai-tag">${tag}</span>`).join("")}
        </div>
        <div class="divider"></div>
        <div class="subtitle" style="font-size:14px;">AI summary</div>
        <div class="body" style="font-size:14px;">
          ${AI_SUMMARY.summary}
        </div>
        <div class="subtitle" style="font-size:14px; margin-top:12px;">User note</div>
        <div id="userNotePreview" class="body muted">${savedText || '—'}</div>
      </div>
    `;
  }

  mount(`
    <section class="screen">
      ${header("Task 4", "#/task4/attach")}
      <div class="title">Clarify the problem</div>
      <div class="body muted">Add a short note. We'll let AI detect objects and likely issues.</div>

      <div class="col">
        <label class="subtitle" style="font-size:14px;" for="clarifyText">Your note</label>
        <textarea id="clarifyText" placeholder="E.g., breaker tripped, light switch sparked when turning on, now that room has no power." style="min-height:110px; resize:vertical;">${escapeHtml(savedText)}</textarea>
      </div>

      <div id="aiAnalysisSection">
        ${renderAISection()}
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="sendBtn" ${!aiLoaded ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>Send to provider</button>
        <button class="btn secondary" id="backBtn">Back</button>
      </div>
    </section>
  `);

  // Start AI loading simulation (5 seconds = 5000ms)
  setTimeout(() => {
    aiLoaded = true;
    const aiSection = document.getElementById("aiAnalysisSection");
    if (aiSection) {
      aiSection.innerHTML = renderAISection();
      // Update user note preview
      const preview = document.getElementById("userNotePreview");
      const text = store.get("task4.clarificationText") || "";
      if (preview) {
        preview.textContent = text || '—';
        preview.className = text ? "body" : "body muted";
      }
    }
    
    // Enable send button
    const sendBtn = document.getElementById("sendBtn");
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
      sendBtn.style.cursor = "pointer";
    }
    
    toast("AI analysis complete!", "success");
  }, 5000); // 5 seconds

  const textArea = document.getElementById("clarifyText");

  textArea.addEventListener("input", () => {
    const text = textArea.value.trim();
    store.set("task4.clarificationText", text);
    
    // Update preview if AI is loaded
    if (aiLoaded) {
      const preview = document.getElementById("userNotePreview");
      if (preview) {
        preview.textContent = text || '—';
        preview.className = text ? "body" : "body muted";
      }
    }
  });

  document.getElementById("sendBtn").addEventListener("click", () => {
    if (!aiLoaded) {
      toast("Please wait for AI analysis to complete", "error");
      return;
    }
    
    const text = store.get("task4.clarificationText");
    if (!text || text.trim().length === 0) {
      toast("Please add a clarification note", "error");
      return;
    }
    
    store.set("task4.status", "sent");
    router.navigate("#/task4/await");
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    router.navigate("#/task4/attach");
  });
}

// Await Provider Acknowledgment Screen
export function Task4AwaitAck({ mount, router }) {
  initTask4Store();
  const providerName = store.get("task4.providerName");
  const files = store.get("task4.files") || [];
  const text = store.get("task4.clarificationText") || "";

  // Count each type
  const counts = { video: 0, photo: 0, file: 0 };
  files.forEach(f => {
    counts[f.type] = (counts[f.type] || 0) + 1;
  });

  // Build media summary
  const mediaSummary = [];
  if (counts.video > 0) mediaSummary.push(`${counts.video} Video${counts.video > 1 ? 's' : ''}`);
  if (counts.photo > 0) mediaSummary.push(`${counts.photo} Photo${counts.photo > 1 ? 's' : ''}`);
  if (counts.file > 0) mediaSummary.push(`${counts.file} File${counts.file > 1 ? 's' : ''}`);

  mount(`
    <section class="screen">
      ${header("Task 4", "#/task4/clarify")}
      <div class="title">Waiting for provider 👀</div>
      <div class="body muted">We sent your media, note and AI summary to: </div>
      
      <div class="provider-pill">
        <div style="width:28px; height:28px; border-radius:14px; background:linear-gradient(135deg,#dbeafe,#bfdbfe);"></div>
        <div class="body" style="font-size:14px;">${providerName}</div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Status</div>
        <div class="status wait">● Awaiting acknowledgment</div>
        <div class="body muted" style="margin-top:8px;">You'll get a push notification once the provider opens it.</div>
        
        <div class="divider"></div>
        
        <div class="subtitle" style="font-size:14px; margin-top:8px;">Media sent</div>
        <div class="body" style="font-size:14px;">${mediaSummary.join(', ') || 'No media'}</div>
        
        <div class="subtitle" style="font-size:14px; margin-top:12px;">AI Identification</div>
        <div class="ai-tags" style="margin-top:4px;">
          ${AI_SUMMARY.tags.map(tag => `<span class="ai-tag">${tag}</span>`).join("")}
        </div>
        
        <div class="subtitle" style="font-size:14px; margin-top:12px;">AI Summary</div>
        <div class="body" style="font-size:14px; margin-top:4px;">
          ${AI_SUMMARY.summary}
        </div>
      </div>

      <div class="card">
        <div class="subtitle" style="font-size:14px;">Timeline</div>
        <div class="timeline">
          <div class="step"><span class="dot active"></span><span class="body" style="font-size:13px;">Media sent</span></div>
          <div class="step"><span class="dot" style="background:var(--warning-500);"></span><span class="body" style="font-size:13px;">Provider reviewing</span></div>
          <div class="step"><span class="dot" style="background:var(--success-500);"></span><span class="body" style="font-size:13px;">Arrival confirmed</span></div>
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn primary" id="doneBtn">Done</button>
        <a class="btn secondary" href="#/home">Go home</a>
      </div>
    </section>
  `);

  document.getElementById("doneBtn").addEventListener("click", () => {
    toast("Media and notes sent successfully!", "success");
    router.navigate("#/task4/context");
  });
}