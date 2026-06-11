// Shared theme switching — single source of truth for the dark/light class,
// localStorage persistence, and the slow cross-fade view transition.

export function isDarkTheme() {
  if (typeof document === "undefined") return true;
  return !document.documentElement.classList.contains("light");
}

function applyTheme(dark) {
  const c = document.documentElement.classList;
  c.toggle("dark", dark);
  c.toggle("light", !dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
  window.dispatchEvent(new CustomEvent("themechange", { detail: { dark } }));
}

/**
 * Switch theme. When the View Transitions API is available (and the user
 * hasn't requested reduced motion) the old and new themes cross-dissolve
 * slowly — like light changing with the weather. Duration/easing live in
 * globals.css under the html.theme-vt scope.
 */
export function setTheme(dark) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduced) {
    applyTheme(dark);
    return;
  }

  const root = document.documentElement;
  root.classList.add("theme-vt");
  const transition = document.startViewTransition(() => applyTheme(dark));
  transition.finished.finally(() => root.classList.remove("theme-vt"));
}
