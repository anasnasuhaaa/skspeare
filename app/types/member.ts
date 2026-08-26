// ============================================================
// LOCKED — do not change
// This interface defines the contract that every member's data
// file must satisfy. Changing it will break all member cards/modals.
// ============================================================

export interface MemberData {
  /** URL-safe identifier, used for file/folder naming */
  slug: string;

  /** Display name */
  name: string;

  /** Group role */
  role: "PJK" | "Ketua" | "Anggota";

  /** Student ID number */
  nim: string;

  /** Path to photo in /public/member/{slug}.png */
  photo: string;

  /** LinkedIn profile URL */
  linkedinUrl: string;

  /** CV download URL or path */
  cvUrl: string;

  /** Hometown / region of origin */
  hometown: string;

  /** List of hobbies */
  hobbies: string[];

  /** Instagram handle (without @) */
  instagramHandle: string;

  /** Personal quote */
  quote: string;

  /** Spotify track URI for the embed player, e.g. "https://open.spotify.com/track/..." */
  spotifyTrackUri: string;
}

/** Role display order for the members grid */
export const ROLE_ORDER: MemberData["role"][] = [
  "PJK",
  "Ketua",
  "Anggota",
];

/** Role labels for display (Indonesian) */
export const ROLE_LABELS: Record<MemberData["role"], string> = {
  PJK: "PJK",
  Ketua: "Ketua Kelompok",
  Anggota: "Anggota",
};
