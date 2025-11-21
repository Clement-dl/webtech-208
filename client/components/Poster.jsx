import Image from "next/image";

export default function Poster({
  work,
  className = "",
  width = 400,
  height = 600,
}) {
  const src = work?.poster_url || "/posters/placeholder.svg";

  return (
    <div className={`glass rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <Image
        src={src}
        alt={work?.title || "Affiche"}
        width={width}
        height={height}
        className="object-cover w-full h-auto transition-transform duration-300 hover:scale-105"
        priority={false}
      />
    </div>
  );
}
