# Abiyyu Special Warp — local preview

## Scope

Only Abiyyu's member data and custom modal are changed. The homepage and other member implementations are preserved. No commits, pushes or deployments are required for this preview.

Opening Abiyyu runs this deterministic demo sequence:

1. Astral Express five-star Warp, including the flying ticket and train, with sound.
2. Nine individual Computer Science course results, in the supplied order with exact names and codes: six three-star and three four-star results. Use **Hasil berikutnya** to advance.
3. Result 10 reveals the user's photo with a dark-to-color reveal, gold sweep, particles and portrait/name transitions, plus the five-star sound effect. This is rendered with CSS and the actual photo, not reference video footage.
4. The acquired-character view and profile details live in the same scroll container with one continuous background. Scroll down to the details; the photo is not replaced or unmounted when the reveal settles. The record below the profile contains all ten results, including Abiyyu as the five-star result.

This is a profile reveal, not a random banner simulator. Abiyyu is always the tenth result.

Use the speaker button to mute/unmute, **Lewati perjalanan** to skip the Express video, **Lewati reveal** to settle the photo animation immediately, **Gulir untuk melihat profil** to scroll to the details, **Ulangi Warp 10x** to replay, and the close button or Escape to leave. Native scrolling also works without clicking the scroll cue. The sound setting lasts for the current opening and resets when reopened. If the browser blocks playback with sound, **Putar animasi** or **Putar efek suara** provides an explicit user-initiated retry. Reduced-motion preference skips the photo's transforms and keeps the details scrollable.

`Download.mp4` and the YouTube example `https://www.youtube.com/watch?v=nhyqCXlkWd4` are design references only. No reference clip is embedded or copied into the site's public assets. The generated `five-star.mp4` copy from the earlier implementation has been removed; the original Downloads file is untouched.

## Local commands

From the repository directory:

```sh
npm ci
npx playwright install chromium
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

Open `http://127.0.0.1:3100`, find **Abiyyu** in Team, and click the member's detail button. The server binds to loopback only.

For development use `npm run dev -- --hostname 127.0.0.1 --port 3100` instead of `npm run start`.

For browser verification, stop the production server first so Playwright can start the development server:

```sh
npm run test:e2e
npx eslint app/members/abiyyu playwright.config.ts tests/abiyyu-warp.spec.ts
npm run lint
```

The browser suite uses Chromium desktop and a Chromium iPhone-sized emulation, not a physical iPhone or WebKit. It also checks layouts at 375, 768 and 1440 CSS pixels. Screenshots are test artifacts, not approved visual-regression baselines. Existing full-repository lint issues outside Abiyyu's files must be reported separately; they must not be hidden or disabled.

## Media provenance

All Warp playback assets are served locally from `public/member/abiyyu/`:

| Local asset | Source | Processing |
| --- | --- | --- |
| `photo.jpg` | User-supplied `C:\Users\ASUS\Downloads\Me.jpeg` | Resized to 1400 px wide, JPEG quality 90; original untouched |
| `express-warp.mp4` video | `https://hsr.wishsimulator.app/videos/event-5star.mp4` | Original H.264 video stream retained |
| `express-warp.mp4` sound | `https://hsr.wishsimulator.app/audiofx/express-5star.ogg` | Converted to AAC and muxed with the Express video |
| `reveal-3star.m4a` | `https://hsr.wishsimulator.app/audiofx/reveal-3star.ogg` | Converted to AAC for browser compatibility |
| `reveal-4star.m4a` | `https://hsr.wishsimulator.app/audiofx/reveal-4star.ogg` | Converted to AAC for browser compatibility |
| `reveal-5star.m4a` | `https://hsr.wishsimulator.app/audiofx/reveal-5star.ogg` | Converted to AAC for the photo reveal |
| `warp-background.webp` | `https://hsr.wishsimulator.app/internal/immutable/assets/warp-bg.BozwJvvh.webp` | Original background, shared across the character reveal and profile details |

Reference simulator: `https://hsr.wishsimulator.app/`.

The course cards and five-star photo transitions use CSS geometry and the project's lucide icons, not copied character illustrations or simulator code. No upstream simulator JavaScript was copied into this app. No redistribution license or permission has been verified for the downloaded game media; keep this experiment local and review provenance before any publication.

The CV remains a link to the supplied Google Drive document. Spotify remains a link and an embedded player; the track is not downloaded or used as the Warp soundtrack. Those two services require an internet connection.
