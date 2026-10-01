import { expect, test, type Page } from "@playwright/test";

const courses = [
  { name: "Pengantar Teori Komputasi", code: "KOM2201", rarity: 3 },
  { name: "Rangkaian Digital", code: "KOM2202", rarity: 3 },
  { name: "Aljabar Linear untuk Komputasi", code: "KOM2203", rarity: 3 },
  { name: "Struktur Diskrit", code: "KOM2204", rarity: 3 },
  { name: "Pemrograman", code: "KOM2205", rarity: 4 },
  { name: "Basis data", code: "KOM2206", rarity: 3 },
  { name: "Berpikir Komputasional", code: "KOM2102", rarity: 3 },
  { name: "Algoritme dan Dasar Pemrograman", code: "KOM2101", rarity: 4 },
  { name: "Metode Statistika", code: "STA2211", rarity: 4 },
] as const;

async function openWarp(page: Page) {
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.proxyReady === "true");
  await page.getByPlaceholder("Search member name, role, or hobby...").fill("abiyyu");
  await page.getByTitle("Buka Detail Card").click();
  return page.getByRole("dialog", { name: "Abiyyu Special Warp" });
}

test("all nine courses preserve the supplied order, codes and rarities", async ({ page }) => {
  const dialog = await openWarp(page);
  await dialog.getByRole("button", { name: "Lewati perjalanan" }).click();
  for (const [index, course] of courses.entries()) {
    await expect(dialog.getByRole("heading", { name: course.name, exact: true })).toBeVisible();
    await expect(dialog.getByText(course.code, { exact: true }).last()).toBeVisible();
    await expect(dialog.locator(`.warp-stars[aria-label="${course.rarity} bintang"]`)).toBeVisible();
    await expect(dialog.getByTestId("warp-result-count")).toHaveText(`${String(index + 1).padStart(2, "0")} / 10`);
    const next = dialog.getByRole("button", { name: "Hasil berikutnya" });
    const box = await next.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    if (index < courses.length - 1) await next.click();
  }
});

test("the five-star photo reveal stays mounted when scrolling into profile details", async ({ page }) => {
  const referenceRequests: string[] = [];
  page.on("request", (request) => { if (/five-star\.mp4|Download\.mp4/.test(request.url())) referenceRequests.push(request.url()); });
  const dialog = await openWarp(page);
  await dialog.getByRole("button", { name: "Lewati perjalanan" }).click();
  for (let index = 0; index < 9; index++) await dialog.getByRole("button", { name: "Hasil berikutnya" }).click();
  const scene = dialog.getByTestId("character-scene");
  const reveal = dialog.getByTestId("five-star-character");
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveAttribute("data-reveal-state", "revealing");
  expect(await reveal.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
  await expect(dialog.getByTestId("warp-result-count")).toHaveText("10 / 10");
  const photo = await dialog.getByTestId("profile-photo").elementHandle();
  const background = await scene.evaluate((element) => getComputedStyle(element).backgroundImage);
  await expect(reveal).toHaveAttribute("data-reveal-state", "ready");
  const cue = await dialog.getByRole("button", { name: "Gulir untuk melihat profil" }).boundingBox();
  expect(cue!.y + cue!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  await expect(dialog.getByTestId("profile-details")).not.toBeInViewport();
  await scene.hover();
  await page.mouse.wheel(0, 650);
  await expect.poll(() => scene.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(dialog.getByRole("heading", { name: "Detail profil", exact: true })).toBeInViewport();
  expect(await photo?.evaluate((element) => element === document.querySelector('[data-testid="profile-photo"]'))).toBe(true);
  expect(await scene.evaluate((element) => getComputedStyle(element).backgroundImage)).toBe(background);
  await expect(dialog.getByTestId("five-star-video")).toHaveCount(0);
  expect(referenceRequests).toEqual([]);
});

test("reduced motion reveals a stationary photo without blocking profile scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const dialog = await openWarp(page);
  await dialog.getByRole("button", { name: "Lewati perjalanan" }).click();
  for (let index = 0; index < 9; index++) await dialog.getByRole("button", { name: "Hasil berikutnya" }).click();
  const reveal = dialog.getByTestId("five-star-character");
  await expect(reveal).toHaveAttribute("data-reveal-state", "ready");
  expect(await reveal.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  expect(await dialog.locator(".warp-character-visual").evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  await dialog.getByRole("button", { name: "Gulir untuk melihat profil" }).click();
  await expect(dialog.getByRole("heading", { name: "Detail profil", exact: true })).toBeInViewport();
});

test("a failed video keeps the route to the profile usable", async ({ page }) => {
  await page.route("**/member/abiyyu/express-warp.mp4", (route) => route.abort());
  const dialog = await openWarp(page);
  await expect(dialog.getByRole("alert")).toContainText("Video tidak dapat diputar");
  await dialog.getByRole("button", { name: "Lanjutkan tanpa video" }).click();
  await expect(dialog.getByTestId("warp-result-count")).toHaveText("01 / 10");
});

test("a failed reveal sound is reported without blocking results", async ({ page }) => {
  await page.route("**/member/abiyyu/reveal-3star.m4a", (route) => route.abort());
  const dialog = await openWarp(page);
  await dialog.getByRole("button", { name: "Lewati perjalanan" }).click();
  await expect(dialog.getByRole("status")).toContainText("Efek suara tidak tersedia");
  await dialog.getByRole("button", { name: "Hasil berikutnya" }).click();
  await expect(dialog.getByTestId("warp-result-count")).toHaveText("02 / 10");
});

test("blocked playback offers a user-initiated sound-enabled retry", async ({ page }) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    let blockOnce = true;
    HTMLMediaElement.prototype.play = function () {
      if (this instanceof HTMLVideoElement && blockOnce) {
        blockOnce = false;
        this.pause();
        return Promise.reject(new DOMException("Playback requires user activation", "NotAllowedError"));
      }
      return play.call(this);
    };
  });
  const dialog = await openWarp(page);
  await expect(dialog.getByRole("button", { name: "Putar animasi" })).toBeVisible();
  await dialog.getByRole("button", { name: "Putar animasi" }).click();
  await expect.poll(() => dialog.getByTestId("express-video").evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(dialog.getByRole("button", { name: "Putar animasi" })).toHaveCount(0);
  await expect(dialog.getByTestId("express-video")).toHaveJSProperty("muted", false);
});

test("results and profile fit phone, tablet and desktop widths", async ({ page }) => {
  const dialog = await openWarp(page);
  await dialog.getByRole("button", { name: "Lewati perjalanan" }).click();
  const viewports = [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const next = await dialog.getByRole("button", { name: "Hasil berikutnya" }).boundingBox();
    expect(next).not.toBeNull();
    expect(next!.x).toBeGreaterThanOrEqual(0);
    expect(next!.x + next!.width).toBeLessThanOrEqual(viewport.width);
    expect(next!.y + next!.height).toBeLessThanOrEqual(viewport.height);
    await page.screenshot({ path: test.info().outputPath(`result-${viewport.width}.png`) });
  }
  for (let index = 0; index < 9; index++) await dialog.getByRole("button", { name: "Hasil berikutnya" }).click();
  await expect(dialog.getByTestId("five-star-character")).toHaveAttribute("data-reveal-state", "ready");
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    expect(await dialog.getByTestId("character-scene").evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: test.info().outputPath(`profile-${viewport.width}.png`) });
  }
});

test("mute, skip, replay, keyboard focus and close behave consistently", async ({ page }) => {
  const dialog = await openWarp(page);
  const trigger = page.getByTitle("Buka Detail Card");
  const close = dialog.getByRole("button", { name: "Tutup Warp" });
  await expect(close).toBeFocused();
  await expect(page.locator(".shakespeare-stage")).toHaveJSProperty("inert", true);
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Lewati perjalanan" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Matikan suara" })).toBeFocused();
  await dialog.getByRole("button", { name: "Matikan suara" }).click();
  await expect(dialog.getByTestId("express-video")).toHaveJSProperty("muted", true);
  await dialog.getByRole("button", { name: "Lewati perjalanan" }).click();
  await expect(dialog.getByTestId("reveal-audio")).toHaveJSProperty("muted", true);
  for (let index = 0; index < 9; index++) await dialog.getByRole("button", { name: "Hasil berikutnya" }).click();
  await expect(dialog.getByTestId("character-audio")).toHaveJSProperty("muted", true);
  await dialog.getByRole("button", { name: "Lewati reveal" }).click();
  await expect(dialog.getByTestId("five-star-character")).toHaveAttribute("data-reveal-state", "ready");
  await dialog.getByRole("button", { name: "Ulangi Warp 10x" }).click();
  await expect(dialog.getByTestId("express-video")).toBeVisible();
  const video = await dialog.getByTestId("express-video").elementHandle();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".shakespeare-stage")).toHaveJSProperty("inert", false);
  await expect(trigger).toBeFocused();
  expect(await video?.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await trigger.click();
  await expect(dialog.getByRole("button", { name: "Matikan suara" })).toBeVisible();
  await dialog.getByRole("button", { name: "Tutup Warp" }).click();
  await expect(dialog).toHaveCount(0);
});

test("nine courses lead to the animated photo and the completed Abiyyu profile", async ({ page }) => {
  const keyErrors: string[] = [];
  page.on("console", (message) => { if (message.text().includes("same key")) keyErrors.push(message.text()); });
  const dialog = await openWarp(page);
  await page.getByRole("button", { name: "Lewati perjalanan" }).click();
  for (const [index, course] of courses.entries()) {
    await expect(page.getByTestId("warp-result-count")).toHaveText(`${String(index + 1).padStart(2, "0")} / 10`);
    await expect(dialog.getByRole("heading", { name: course.name, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Hasil berikutnya" }).click();
  }
  const reveal = dialog.getByTestId("five-star-character");
  await expect(reveal).toBeVisible();
  await expect(page.getByTestId("warp-result-count")).toHaveText("10 / 10");
  const sound = dialog.getByTestId("character-audio");
  await expect.poll(() => sound.evaluate((element: HTMLAudioElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(sound).toHaveJSProperty("muted", false);
  await expect(reveal).toHaveAttribute("data-reveal-state", "ready");
  await expect(dialog.getByRole("heading", { name: "Muhammad Abiyyu Fatih Athaya", exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Gulir untuk melihat profil" }).click();
  await expect(dialog.getByText("M0403251119", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Kabupaten Bogor", { exact: true })).toBeVisible();
  for (const hobby of ["Vibecoding", "Gaming", "Youtube"]) await expect(page.getByText(hobby, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://instagram.com/mhmd.byfa");
  await expect(page.getByRole("dialog").getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/muhammad-abiyyu-fatih-athaya-374309381");
  await expect(page.getByRole("link", { name: "Lihat CV" }).last()).toHaveAttribute("href", "https://drive.google.com/file/d/1j3M-nqdj9i4KXzUSXDH7_KqTm5sutxmb/view?usp=sharing");
  await expect(page.getByText("The world is only temporary; the Hereafter is eternal.", { exact: true })).toBeVisible();
  await expect(page.getByTitle("Lagu pilihan Abiyyu di Spotify")).toHaveAttribute("src", /2PLMiHYcVixnjsG8QPiHFo/);
  await expect(page.getByTestId("profile-photo")).toHaveJSProperty("naturalWidth", 1400);
  await expect(dialog.locator(".warp-summary-grid > li")).toHaveCount(10);
  expect(keyErrors).toEqual([]);
  await page.screenshot({ path: test.info().outputPath("profile.png") });
});

test("the Express journey leads to the first of ten individual results", async ({ page }) => {
  await openWarp(page);
  await page.getByRole("button", { name: "Lewati perjalanan" }).click();
  await expect(page.getByTestId("warp-result-count")).toHaveText("01 / 10");
  await expect(page.getByRole("heading", { name: "Pengantar Teori Komputasi", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hasil berikutnya" })).toBeVisible();
  const sound = page.getByTestId("reveal-audio");
  await expect.poll(() => sound.evaluate((element: HTMLAudioElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(sound).toHaveJSProperty("muted", false);
});

test("opening Abiyyu starts the Express Warp with sound controls", async ({ page }) => {
  const dialog = await openWarp(page);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Matikan suara" })).toBeVisible();
  await expect(dialog.getByTestId("express-video")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Lewati perjalanan" })).toBeVisible();
  const video = dialog.getByTestId("express-video");
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  await expect(video).toHaveJSProperty("videoWidth", 1920);
  await expect(video).toHaveJSProperty("muted", false);
  await video.evaluate((element: HTMLVideoElement) => { element.currentTime = element.duration - 0.15; });
  await expect(dialog.getByTestId("warp-result-count")).toHaveText("01 / 10");
});
