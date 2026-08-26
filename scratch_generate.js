const fs = require('fs');
const path = require('path');

const members = [
  { slug: 'wafi', role: 'PJK', name: 'Wafi' },
  { slug: 'adit', role: 'Anggota', name: 'Muhamad Adiya Firmasyah' },
  { slug: 'salman', role: 'Anggota', name: 'Salman Al Farizi' },
  { slug: 'riza', role: 'Anggota', name: 'M. Dzikry Fairul Riza H' },
  { slug: 'kesya', role: 'Anggota', name: 'Kesya Labibah' },
  { slug: 'keke', role: 'Anggota', name: 'Keysha Sherazade' },
  { slug: 'radly', role: 'Anggota', name: 'M Radly Rayyan' },
  { slug: 'kevin', role: 'Anggota', name: 'Kevin Fadli R' },
  { slug: 'abiyyu', role: 'Anggota', name: 'Muhammad Abiyyu FA' },
  { slug: 'khansa', role: 'Anggota', name: 'Khansa Afifah A' },
  { slug: 'farikha', role: 'Anggota', name: 'Farikha Renata VK' }
];

const basePath = path.join(__dirname, 'app');

members.forEach(m => {
  const dirPath = path.join(basePath, 'members', m.slug);
  fs.mkdirSync(dirPath, { recursive: true });

  const dataContent = `import { MemberData } from "@/app/types/member";

const ${m.slug}Data: MemberData = {
  slug: "${m.slug}",
  name: "${m.name}",
  role: "${m.role}",
  // TODO: replace with your own NIM
  nim: "",
  photo: "/member/${m.slug}.png",
  // TODO: replace with your LinkedIn profile URL
  linkedinUrl: "",
  // TODO: replace with your CV link or file path
  cvUrl: "",
  // TODO: replace with your hometown/region
  hometown: "",
  // TODO: replace with your hobbies
  hobbies: [],
  // TODO: replace with your Instagram handle (without @)
  instagramHandle: "",
  // TODO: replace with your personal quote
  quote: "",
  // TODO: replace with your Spotify track URL
  spotifyTrackUri: "",
};

export default ${m.slug}Data;
`;
  fs.writeFileSync(path.join(dirPath, 'data.ts'), dataContent);

  const cardContent = `"use client";

import MemberCard from "@/app/components/MemberCard";
import data from "./data";

// ============================================================
// LOCKED — do not change
// This component must accept onClick and pass member data to MemberCard.
// The structural props and data binding below must stay intact.
// ============================================================

export default function Card({ onClick }: { onClick: () => void }) {
  // ============================================================
  // FREE TO CUSTOMIZE
  // You can wrap MemberCard in your own styled container,
  // add decorations, change the background color, add badges,
  // stickers, animations, or completely replace with your own
  // card design — as long as you keep the onClick handler and
  // display the required info (photo, name, NIM, linkedin, cv).
  // ============================================================
  return <MemberCard member={data} onClick={onClick} />;
}
`;
  fs.writeFileSync(path.join(dirPath, 'Card.tsx'), cardContent);

  const modalContent = `"use client";

import MemberModal from "@/app/components/MemberModal";
import data from "./data";

// ============================================================
// LOCKED — do not change
// This component must accept isOpen and onClose props.
// The modal must display all required fields from MemberData.
// ============================================================

export default function Modal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // ============================================================
  // FREE TO CUSTOMIZE
  // You can pass children to MemberModal for extra decorations,
  // or completely replace MemberModal with your own modal design.
  // Change colors, backgrounds, fonts, add animations, stickers,
  // custom layouts — as long as the required data fields are shown
  // and isOpen/onClose behavior is preserved.
  // ============================================================
  return <MemberModal member={data} isOpen={isOpen} onClose={onClose} />;
}
`;
  fs.writeFileSync(path.join(dirPath, 'Modal.tsx'), modalContent);
});

const dataDirPath = path.join(basePath, 'data');
fs.mkdirSync(dataDirPath, { recursive: true });

const membersContent = `import { MemberData } from "@/app/types/member";
import wafiData from "@/app/members/wafi/data";
import anasData from "@/app/members/anas/data";
import aditData from "@/app/members/adit/data";
import salmanData from "@/app/members/salman/data";
import rizaData from "@/app/members/riza/data";
import kesyaData from "@/app/members/kesya/data";
import kekeData from "@/app/members/keke/data";
import radlyData from "@/app/members/radly/data";
import kevinData from "@/app/members/kevin/data";
import abiyyuData from "@/app/members/abiyyu/data";
import khansaData from "@/app/members/khansa/data";
import farikhaData from "@/app/members/farikha/data";

const members: MemberData[] = [
  wafiData,
  anasData,
  aditData,
  salmanData,
  rizaData,
  kesyaData,
  kekeData,
  radlyData,
  kevinData,
  abiyyuData,
  khansaData,
  farikhaData,
];

export default members;
`;
fs.writeFileSync(path.join(dataDirPath, 'members.ts'), membersContent);

console.log("Done generating files.");
