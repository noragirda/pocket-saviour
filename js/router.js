export function createRouter({ routes, onNotFound }) {
  function getPath() {
    const hash = window.location.hash || "#/home";
    return hash;
  }

  function matchRoute(path) {
    return routes[path] || null;
  }

  function render() {
    const path = getPath();
    const screen = matchRoute(path);

    if (!screen) {
      onNotFound?.(path);
      return;
    }
    screen();
  }

  function navigate(path) {
    if (!path.startsWith("#/")) path = "#/" + path.replace(/^#/, "");
    window.location.hash = path;
  }

  window.addEventListener("hashchange", render);

  return { render, navigate };
}
