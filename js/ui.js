export function toast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.textContent = message;
  document.body.appendChild(el);

  requestAnimationFrame(() => el.classList.add("toast--show"));

  setTimeout(() => {
    el.classList.remove("toast--show");
    setTimeout(() => el.remove(), 200);
  }, 2200);
}

export function renderLoading(text = "Loading...") {
  return `
    <div class="loading">
      <div class="spinner"></div>
      <div class="body muted">${text}</div>
    </div>
  `;
}

export function required(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}
