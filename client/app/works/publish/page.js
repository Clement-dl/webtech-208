"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";

export default function PublishWorkPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [kind, setKind] = useState("film");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("handleSubmit démarré");
  setErrorMsg("");

  if (!title.trim()) {
    setErrorMsg("Le titre est obligatoire.");
    return;
  }
  if (!file) {
    setErrorMsg("Merci de choisir une affiche (fichier image).");
    return;
  }

  setLoading(true);

  try {
    // 0) Récupérer l'utilisateur courant
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("Utilisateur non authentifié.");
    }
    const userId = userData.user.id;   

    // 1) Upload de l'image dans le bucket "posters"
    console.log("→ Upload de l'affiche dans Storage…");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const randomSlug = "w" + Math.random().toString(36).slice(2, 8);
    const storagePath = `${randomSlug}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("posters")
      .upload(storagePath, file);

    console.log("   Résultat upload:", uploadData, uploadError);

    if (uploadError) {
      throw new Error(
        "Échec de l'upload de l'affiche : " + uploadError.message
      );
    }

    // 2) URL publique
    const { data: publicUrlData } = supabase.storage
      .from("posters")
      .getPublicUrl(uploadData.path);

    const posterUrl = publicUrlData.publicUrl;
    console.log("→ URL publique de l'affiche :", posterUrl);

    // 3) Insertion dans works avec created_by = userId
    console.log("→ Insertion de l'œuvre dans works…");
    const { data: workData, error: workError } = await supabase
      .from("works")
      .insert({
        slug: randomSlug,
        title: title.trim(),
        year: year ? Number(year) : null,
        kind,
        genre: genre.trim() || null,
        description: description.trim() || null,
        poster_path: posterUrl,
        created_by: userId,          
      })
      .select("slug")
      .single();

    console.log("   Résultat insert works :", workData, workError);

    if (workError) {
      throw new Error(
        "Échec de l'enregistrement de l'œuvre : " + workError.message
      );
    }

    console.log("→ Publication OK, redirection /works/" + workData.slug);
    router.push(`/works/${workData.slug}`);
  } catch (err) {
    console.error("Erreur pendant la publication :", err);
    setErrorMsg(
      err?.message || "Erreur inattendue pendant la publication."
    );
  } finally {
    console.log("handleSubmit terminé (finally)");
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <section className="max-w-3xl mx-auto border border-neutral-800 rounded-lg p-6 bg-neutral-900">
        <h1 className="text-2xl font-bold mb-4">Publier une œuvre</h1>

        {errorMsg && (
          <p className="mb-4 text-sm text-red-400">{errorMsg}</p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Titre */}
          <div>
            <label className="block text-sm mb-1">Titre de l’œuvre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {/* Année */}
          <div>
            <label className="block text-sm mb-1">Année</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
              min="1900"
              max="2100"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="film">Film</option>
              <option value="serie">Série</option>
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm mb-1">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="ex : Thriller, Science-fiction…"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Fichier image */}
          <div>
            <label className="block text-sm mb-1">
              Affiche (image, bucket posters)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block text-sm"
              required
            />
           <p className="text-xs text-neutral-400 mt-1">
              L&apos;image sera uploadée dans le bucket Supabase{" "}
              <code>posters</code>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 mt-2 rounded-md bg-white text-black font-semibold disabled:opacity-60"
          >
            {loading ? "Publication..." : "Publier"}
          </button>
        </form>
      </section>
    </main>
  );
}
