"use client";

import { supabase } from "./supabaseClient";

const STORAGE_KEY = "alt_endings_is_authed";

export async function signup({ email, password, username, role }) {
  // 1) Création de l’utilisateur Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // on ne throw plus, on renvoie l'erreur au caller
    return { user: null, error };
  }

  const user = data.user;
  if (!user) {
    return {
      user: null,
      error: new Error("Utilisateur non retourné par Supabase."),
    };
  }

  // 2) Création du profil
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    username,
    role,
  });

  if (profileError) {
    return { user: null, error: profileError };
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, "true");
  }

  return { user, error: null };
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error };
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, "true");
  }

  return { user: data.user, error: null };
}


export async function logout() {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function isAuthed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

export async function getCurrentUserRole() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) return null;
  return profile.role; // "user" ou "admin"
}
