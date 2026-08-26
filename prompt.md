# Proxy Shakespeare — Group Profile Website Brief

## 1. Context & Tech Stack

- **Framework:** Next.js (already scaffolded)
- **Animation libraries:**
  - **Framer Motion** (already installed) — use for React-native concerns:
    component mount/unmount transitions, modal open/close, layout animations,
    hover/tap micro-interactions on cards.
  - **GSAP** (newly added dependency) — use for more complex, timeline-based,
    or fine-grained sequenced animations that benefit from precise control:
    - The marquee's continuous scroll loop
    - The gallery carousel's auto-scroll + pause-on-hover behavior
    - The terminal "hacking" sequence (typing effect, glitch/scanline bursts,
      progress bars, "ACCESS GRANTED" reveal) for Anas's reference card
  - **Guideline:** don't mix both libraries to animate the *same* property on
    the *same* element — pick one per animated element/sequence to avoid
    conflicting transforms. Framer Motion owns component-level transitions;
    GSAP owns standalone timeline sequences.
- **Scope:** FRONTEND ONLY. No backend, no server, no database, no API routes.
  All content (member data, images, copy) is hardcoded/static — stored in
  local files (JSON/TS objects) and images under `/public`.
- **Goal:** A group profile website for **Proxy Shakespeare**, a student group
  project.

---

## 2. Design Style

- **Style:** Neobrutalism, rounded-corner variant ("neobrutalism rounded").
- Push it hard — thick black borders, bold hard drop-shadows (offset shadows,
  no blur), high-contrast/loud color palette, chunky typography, sticker/badge
  -like elements — but with rounded corners instead of sharp/square edges.
- Avoid a generic, templated, "default AI-generated" look. Make deliberate,
  characterful design choices (custom color palette, custom type pairing,
  unique shadow/border treatment, small illustrative details).

---

## 3. About Section

- Explain that this website is part of a group assignment for **Pekan
  Ilkomerz 62**, Computer Science Study Program (Program Studi Ilmu
  Komputer), IPB University.
- Introduce the group name **Proxy Shakespeare**.

---

## 4. Marquee

- A diagonally-rotated (slanted), infinitely-scrolling marquee banner.
- Text: `Proxy Shakespeare | Pekan Ilkomerz 62`
- Built with GSAP for a smooth, seamless infinite-loop scroll.

---

## 5. Gallery Section

- A horizontally auto-scrolling photo carousel showing event/activity
  documentation.
- Auto-plays continuously (GSAP-driven).
- Pauses when the cursor hovers over a photo; resumes smoothly on
  mouse-leave (ease in/out, not an abrupt stop/start).

---

## 6. Members Section

### 6.1 Roles & File/Folder Naming

Organize members into three role groups: **PJK**, **Ketua Kelompok**, and
**Anggota**. Each member gets their own file/folder using the slug below, so
each person can independently "decorate" their own card/modal without
touching anyone else's files.

| Role           | Name                       | File/Folder Slug |
|----------------|-----------------------------|-------------------|
| PJK            | Wafi                        | `wafi`            |
| Ketua Kelompok | Anas Nasuha                 | `anas`            |
| Anggota        | Muhamad Adiya Firmasyah      | `adit`            |
| Anggota        | Salman Al Farizi             | `salman`          |
| Anggota        | M. Dzikry Fairul Riza H       | `riza`            |
| Anggota        | Kesya Labibah                | `kesya`           |
| Anggota        | Keysha Sherazade              | `keke`            |
| Anggota        | M Radly Rayyan                | `radly`           |
| Anggota        | Kevin Fadli R                  | `kevin`           |
| Anggota        | Muhammad Abiyyu FA              | `abiyyu`          |
| Anggota        | Khansa Afifah A                 | `khansa`          |
| Anggota        | Farikha Renata VK                | `farikha`         |

> Note: "PJK" is kept as-is (internal group role term) and does not need to
> be translated or expanded.

### 6.2 Member Card (default closed state)

Each card displays:
- Photo (from `/public/member/{slug}.png` or similar)
- Name
- NIM
- LinkedIn icon (links out)
- CV icon (links to/downloads CV)

Clicking a card opens that member's modal.

### 6.3 Member Modal (shared structure, before individual styling)

All modals must show the same fields, even though visual styling can differ:
- Hometown / region of origin
- Hobbies
- Instagram handle/link
- A personal quote
- An embedded Spotify player that autoplays audio as soon as the modal opens
  (see **Section 7 — Spotify Autoplay Strategy** below)

### 6.4 Customization Architecture (important)

- Each member's card + modal lives in its own file/folder (named by slug).
- Inside each file, add clear comments marking:
  - `// LOCKED — do not change`: shared layout structure, required
    props/data fields, and anything needed to keep the modal consistent with
    the rest of the site.
  - `// FREE TO CUSTOMIZE`: colors, backgrounds, decorations, animations,
    fonts, icons — anything purely visual/stylistic.
- Personal data fields (NIM, hobby, hometown, CV link, Instagram, quote,
  Spotify embed link, etc.) are left as clearly commented placeholders/TODOs
  for each member to fill in themselves, e.g.:
  ```ts
  // TODO: replace with your own NIM
  nim: "",
  ```
- Define a shared `MemberData` type/interface (e.g. in a central `types.ts`)
  that every member's data file must conform to, so the structure stays
  consistent even as visuals diverge.

---

## 7. Spotify Autoplay Strategy

Browsers restrict autoplay-with-sound to protect users, so a naive
`?autoplay=1` query param on the embed URL is **not reliable on its own**,
especially on Safari/iOS. Use this layered approach:

1. **Use the official Spotify iFrame API, not just a static `<iframe>`.**
   Load `https://open.spotify.com/embed/iframe-api/v1`, and control playback
   programmatically via `EmbedController.play()` rather than relying purely
   on the `autoplay` URL parameter. This gives explicit control over *when*
   playback starts, which matters for point 2 below.

2. **Call `play()` inside the user-gesture call stack.**
   Since opening a modal is itself triggered by a click, call
   `EmbedController.play()` as early as possible in that same click handler
   (or immediately after the iFrame API reports `ready`, without long
   `setTimeout`/animation delays in between). Browsers generally allow
   audio to start if it's initiated close to a real user gesture — the
   longer the delay or the more async steps in between, the more likely
   Safari/Chrome will silently block it.

3. **For Anas's terminal-hack flow specifically:** the modal doesn't open on
   the first click — it opens after a "successful hack" animation. To keep
   the gesture chain valid:
   - Treat the **credential submit** (the click/Enter that triggers the
     "correct password" branch) as the real user gesture.
   - Immediately kick off `EmbedController.play()` (or a muted `play()`,
     see step 4) right when that submit fires, running in parallel with the
     glitch/reveal animation — don't wait for the animation to finish before
     calling `play()`.
   - Only reveal/unmute audio once the biodata modal is actually visible.

4. **Muted-first fallback trick.** If a direct unmuted `play()` gets
   blocked, fall back to: start the track muted (`EmbedController.setVolume`
   or embed `muted` state) immediately, then unmute a beat later once
   playback has actually started. Muted autoplay is permitted almost
   universally, and unmuting an already-playing element is treated more
   leniently by browsers than starting playback with sound.

5. **Always provide a visible fallback control.** If autoplay is blocked
   despite the above (can still happen, especially first-visit Safari), show
   a small "🔊 Tap to play" button overlaid on the embed so the experience
   never looks broken — this becomes the manual trigger.

6. **Pause on modal close.** Call `EmbedController.pause()` (or destroy/
   unmount the iframe) when the modal closes, so multiple members' tracks
   never overlap if a user clicks through several cards quickly.

---

## 8. Reference Implementation — Anas Nasuha (Ketua Kelompok), Cybersecurity Theme

Build **one fully polished example first**, to serve as the template/
reference for everyone else:

- **Card visual style:** cybersecurity/hacker aesthetic — combine with the
  base neobrutalism-rounded system (e.g. terminal green-on-black accents,
  monospace font, glitch/scanline details, but still rounded + bold-bordered).
- Clicking the card does **not** open the biodata modal directly. Instead:
  1. It opens a terminal-style "hacking mini-game" overlay first.
  2. Fake login credentials are shown somewhere in the UI (as a "leaked
     note" or hint the user needs to find/use).
  3. Wrong credentials → terminal-styled error/alert; allow retry.
  4. Correct credentials → play a "system breached" animation (GSAP-driven:
     glitch effect, scanlines, progress bar, matrix-rain, "ACCESS GRANTED"
     text) before transitioning into the actual biodata modal — and kick off
     the Spotify play call per Section 7, point 3, in parallel.
- Leave all biodata fields as placeholder/TODO comments — actual content
  will be filled in manually later.
- **Priority:** make it feel genuinely polished and intentional — avoid
  generic, templated, "AI slop" execution. Favor a distinctive
  interaction/animation design over safe defaults.

---

## 9. Deliverables Checklist

- [ ] Base layout: About, Members grid, Gallery, Marquee
- [ ] Neobrutalism-rounded design system (colors, borders, shadows, type scale)
- [ ] Shared `MemberCard` + `MemberModal` component contract (props/types)
- [ ] Per-member folder structure with `LOCKED` / `FREE TO CUSTOMIZE` comments
- [ ] Placeholder data file per member (NIM, hobby, etc. as TODOs)
- [ ] Spotify embed component implementing the layered autoplay strategy
      (Section 7), reusable across all member modals
- [ ] Full reference implementation: Anas Nasuha's terminal-hack card + modal