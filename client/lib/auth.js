export function isAuthed() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("alt_endings_token");
}
export function loginAs(name) {
  if (typeof window === "undefined") return;
  localStorage.setItem("alt_endings_token", name || "user");
}
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("alt_endings_token");
}
