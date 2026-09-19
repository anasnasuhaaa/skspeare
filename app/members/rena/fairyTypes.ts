export interface FairyAssetItem {
  id: string;
  name: string;
  preview: string;
  layerPath?: string;
  // For Hair 1 which has two distinct layers
  layerBehind?: string;
  layerFront?: string;
  description?: string;
  // Body-relative vertical alignment offset
  offsetY?: string;
}

export type FairyCategoryKey = "hair" | "dress" | "accessories" | "wings" | "pets";

export interface FairyCategory {
  key: FairyCategoryKey;
  label: string;
  icon: string;
  items: FairyAssetItem[];
  allowNone?: boolean;
}

export interface FaeOutfit {
  hairId: string;
  dressId: string;
  accessoryId: string | null;
  wingsId: string;
  petId: string | null;
  isCustom: boolean; // false when skipped, uses FaeContoh
}

export const BASE_BODY_ASSET = "/asset/rena/Fairy Dress Up Game/Body.png";
export const FAE_CONTOH_ASSET = "/asset/rena/Fairy Dress Up Game/FaeContoh.png";

export const HAIR_OPTIONS: FairyAssetItem[] = [
  {
    id: "hair-1",
    name: "Short Hair",
    preview: "/asset/rena/Fairy Dress Up Game/Hair/Hair 1-behind.png",
    layerBehind: "/asset/rena/Fairy Dress Up Game/Hair/Hair 1-behind.png",
    layerFront: "/asset/rena/Fairy Dress Up Game/Hair/Hair 1-Front.png",
    description: "Cascading golden locks that weave between fairy wings",
    offsetY: "-13.3%",
  },
  {
    id: "hair-bun",
    name: "Bun",
    preview: "/asset/rena/Fairy Dress Up Game/Hair/Hair Bun.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Hair/Hair Bun.png",
    description: "An elegant high bun favored by garden royalty",
    offsetY: "-18.5%",
  },
  {
    id: "short-hair",
    name: "Pixie Hair",
    preview: "/asset/rena/Fairy Dress Up Game/Hair/Short Hair.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Hair/Short Hair.png",
    description: "A breezy, playful cut for dancing among the flora",
    offsetY: "-13.5%",
  },
  {
    id: "two-braids",
    name: "Twin Braids",
    preview: "/asset/rena/Fairy Dress Up Game/Hair/Two Braids.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Hair/Two Braids.png",
    description: "Neatly woven twin plaits infused with forest dew",
    offsetY: "-5.5%",
  },
];

export const DRESS_OPTIONS: FairyAssetItem[] = [
  {
    id: "dress-1",
    name: "Queen of The Night",
    preview: "/asset/rena/Fairy Dress Up Game/Dress/dress 1.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Dress/dress 1.png",
    description: "Dress peri jahat",
    offsetY: "0%",
  },
  {
    id: "dress-2",
    name: "Baju Jamur",
    preview: "/asset/rena/Fairy Dress Up Game/Dress/dress 2.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Dress/dress 2.png",
    description: "Berasal dari kulit sapi jamur di menkrep",
    offsetY: "0%",
  },
  {
    id: "dress-3",
    name: "Peri Hogwarts",
    preview: "/asset/rena/Fairy Dress Up Game/Dress/dress 3.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Dress/dress 3.png",
    description: "Peri X Penyihir",
    offsetY: "0%",
  },
  {
    id: "dress-4",
    name: "Flower Dress",
    preview: "/asset/rena/Fairy Dress Up Game/Dress/dress 4.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Dress/dress 4.png",
    description: "Cocok untuk peri girly",
    offsetY: "0%",
  },
];

export const ACCESSORY_OPTIONS: FairyAssetItem[] = [
  {
    id: "acc-1",
    name: "Flower Crown",
    preview: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 1.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 1.png",
    description: "Bunga yang dicuri dari halaman rumah tetangga",
    offsetY: "-31.1%",
  },
  {
    id: "acc-2",
    name: "Hair Pin Proletar",
    preview: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 2.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 2.png",
    description: "Hair pin murah untuk peri ploretar",
    offsetY: "-32.6%",
  },
  {
    id: "acc-3",
    name: "Tiara Peri Borjuis",
    preview: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 3.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 3.png",
    description: "Tiara milik kaum borjuis yang kaya",
    offsetY: "-27.0%",
  },
  {
    id: "acc-4",
    name: "Duchess Hat",
    preview: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 4.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Hair Accesories/Acc 4.png",
    description: "topi coquette imup berenda",
    offsetY: "-32.5%",
  },
];

export const WINGS_OPTIONS: FairyAssetItem[] = [
  {
    id: "wings-1",
    name: "Broken Dragonfly",
    preview: "/asset/rena/Fairy Dress Up Game/Wings/wings 1.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Wings/wings 1.png",
    description: "Sayap rusak karena capungnya digigit cicak",
    offsetY: "-10.5%",
  },
  {
    id: "wings-2",
    name: "Butterfly",
    preview: "/asset/rena/Fairy Dress Up Game/Wings/wings 2.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Wings/wings 2.png",
    description: "Sayap kupu-kupu alami (paling murah)",
    offsetY: "-9.8%",
  },
  {
    id: "wings-3",
    name: "Prismatic Aurora",
    preview: "/asset/rena/Fairy Dress Up Game/Wings/wings 3.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Wings/wings 3.png",
    description: "Sayap kristal mahal hasil pengerukan tambang",
    offsetY: "0%",
  },
  {
    id: "wings-4",
    name: "Starlight Monarch",
    preview: "/asset/rena/Fairy Dress Up Game/Wings/wings 4.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Wings/wings 4.png",
    description: "Majestic fairy wings dotted with constellations",
    offsetY: "-4.5%",
  },
];

export const PET_OPTIONS: FairyAssetItem[] = [
  {
    id: "pet-1",
    name: "Mini Dragon",
    preview: "/asset/rena/Fairy Dress Up Game/Pets/Pet 1.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Pets/Pet 1.png",
    description: "A gentle dragon who loves to dance",
  },
  {
    id: "pet-2",
    name: "Kodok Zuma",
    preview: "/asset/rena/Fairy Dress Up Game/Pets/Pet 2.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Pets/Pet 2.png",
    description: "Mini frogs loves sleeping",
  },
  {
    id: "pet-3",
    name: "Bunny",
    preview: "/asset/rena/Fairy Dress Up Game/Pets/Pet 3.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Pets/Pet 3.png",
    description: "A timid baby bunny that leaves sparkling footsteps",
  },
  {
    id: "pet-4",
    name: "Kucing Ireng",
    preview: "/asset/rena/Fairy Dress Up Game/Pets/Pet 4.png",
    layerPath: "/asset/rena/Fairy Dress Up Game/Pets/Pet 4.png",
    description: "A witch",
  },
];

export const DEFAULT_OUTFIT: FaeOutfit = {
  hairId: "hair-1",
  dressId: "dress-1",
  accessoryId: "acc-1",
  wingsId: "wings-1",
  petId: "pet-1",
  isCustom: true,
};

export const SKIPPED_OUTFIT: FaeOutfit = {
  hairId: "hair-1",
  dressId: "dress-1",
  accessoryId: "acc-1",
  wingsId: "wings-1",
  petId: "pet-1",
  isCustom: false, // forces FaeContoh
};
