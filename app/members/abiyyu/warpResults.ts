import data, { abiyyuNickname } from "./data";

export const warpResults = [
  { name: "Pengantar Teori Komputasi", code: "KOM2201", rarity: 3, symbol: "computation" },
  { name: "Rangkaian Digital", code: "KOM2202", rarity: 3, symbol: "digital" },
  { name: "Aljabar Linear untuk Komputasi", code: "KOM2203", rarity: 3, symbol: "linear" },
  { name: "Struktur Diskrit", code: "KOM2204", rarity: 3, symbol: "discrete" },
  { name: "Pemrograman", code: "KOM2205", rarity: 4, symbol: "programming" },
  { name: "Basis data", code: "KOM2206", rarity: 3, symbol: "database" },
  { name: "Berpikir Komputasional", code: "KOM2102", rarity: 3, symbol: "thinking" },
  { name: "Algoritme dan Dasar Pemrograman", code: "KOM2101", rarity: 4, symbol: "algorithm" },
  { name: "Metode Statistika", code: "STA2211", rarity: 4, symbol: "statistics" },
  { name: abiyyuNickname, code: data.nim, rarity: 5, symbol: "profile" },
] as const;
