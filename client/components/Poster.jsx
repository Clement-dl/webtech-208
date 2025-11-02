// components/Poster.jsx
import Image from "next/image";

export default function Poster({ workId, alt, className }) {
  const src = `/posters/${workId}.jpg`;
  return (
    <Image
      src={src}
      alt={alt}
      width={600}        
      height={900}
      quality={90}      
      
      className={`w-full h-auto ${className ?? ""}`}
      sizes="(min-width:1024px) 300px, (min-width:640px) 45vw, 90vw"
      priority={false}
    />
  );
}
