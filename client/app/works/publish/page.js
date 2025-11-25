"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Orb from "@/components/Background";

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
    setErrorMsg("");

    if (!title.trim()) return setErrorMsg("Le titre est obligatoire.");
    if (!file) return setErrorMsg("Merci de choisir une affiche (fichier image).");

    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("Utilisateur non authentifié.");
      const userId = userData.user.id;

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const randomSlug = "w" + Math.random().toString(36).slice(2, 8);
      const storagePath = `${randomSlug}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("posters")
        .upload(storagePath, file);

      if (uploadError) throw new Error("Échec de l'upload de l'affiche : " + uploadError.message);

      const { data: publicUrlData } = supabase.storage.from("posters").getPublicUrl(uploadData.path);
      const posterUrl = publicUrlData.publicUrl;

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

      if (workError) throw new Error("Échec de l'enregistrement de l'œuvre : " + workError.message);

      router.push(`/works/${workData.slug}`);
    } catch (err) {
      console.error("Erreur pendant la publication :", err);
      setErrorMsg(err?.message || "Erreur inattendue pendant la publication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-start justify-center overflow-hidden px-4 py-8">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <section className="glass w-full max-w-3xl p-6 rounded-2xl shadow-lg animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-6 gradient-text text-center">Publier une œuvre</h1>

        {errorMsg && <p className="mb-4 text-sm text-red-400">{errorMsg}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Titre de l’œuvre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Année</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-field"
              min="1900"
              max="2100"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="input-field"
            >
              <option value="film">Film</option>
              <option value="serie">Série</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="input-field"
              placeholder="ex : Thriller, Science-fiction…"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[120px]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Affiche (image, bucket posters)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block text-sm"
              required
            />
            <p className="text-xs text-foreground/60 mt-1">
              L image sera uploadée dans le bucket <code>posters</code>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 text-center disabled:opacity-60"
          >
            {loading ? "Publication..." : "Publier"}
          </button>
        </form>
      </section>
    </main>
  );
}
