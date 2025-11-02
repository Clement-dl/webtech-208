export const WORKS = [
  { id: "w1", title: "Inception", year: 2010, type: "movie",  genre: "science-fiction" },
  { id: "w2", title: "Fight Club", year: 1999, type: "movie",  genre: "drame" },
  { id: "w3", title: "Star Wars VI", year: 2013, type: "movie", genre: "space opera" },
  
];


export const ENDINGS = [
  { id: "e1", workId: "w1", author: "Alice", content: "Et si..." , votes: 12 },
  { id: "e2", workId: "w1", author: "Bob", content: "La toupie..." , votes: 7 },
  { id: "e3", workId: "w2", author: "Chloe", content: "Narrateur révèle..." , votes: 3 },
];


// Liste déduite de tous les genres (ordonnée)
export const ALL_GENRES = Array.from(
  new Set(WORKS.flatMap(w => w.genres))
).sort();