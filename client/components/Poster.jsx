import Image from "next/image";

export default function Poster({ work, className = "", width = 400, height = 600 }) {
  // On lit la colonne poster_url (BDD)
  // Pour l’instant tu peux mettre dans la BDD des valeurs comme "/posters/w1.jpg"
  const src = work?.poster_url || "/posters/placeholder.svg";

  return (
    <Image
      src={src}
      alt={work?.title || "Affiche"}
      width={width}
      height={height}
      className={`object-cover w-full h-auto ${className}`}
      priority={false}
    />
  );
}
