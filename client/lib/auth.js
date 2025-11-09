"use client";

const STORAGE_KEY = "alt_endings_is_authed";

// Un id fixe pour l'utilisateur de démo (tu peux le réutiliser plus tard pour les votes)
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

export function isAuthed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export function login() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "true");
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUserId() {
  return isAuthed() ? DEMO_USER_ID : null;
}
