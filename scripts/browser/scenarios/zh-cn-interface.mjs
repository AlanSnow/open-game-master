import { check, eventually } from "../lib.mjs";

export default {
  name: "simplified-chinese-interface",
  viewports: ["desktop", "phone"],
  async run(t) {
    const { page, root, ids } = t;
    const hydrationErrors = [];
    page.on("pageerror", (error) => hydrationErrors.push(String(error)));
    await t.open("/settings");
    await t.tap(page.locator(`${root}button[aria-pressed]`).filter({ hasText: "简体中文" }));
    await eventually(
      async () => (await page.evaluate(() => document.documentElement.lang)) === "zh-CN",
      { timeoutMs: 20_000, label: "the Chinese catalog loaded and the document language changed" },
    );
    await eventually(
      async () => (await page.locator(root || "body").first().innerText()).includes("界面语言保存在"),
      { label: "the settings help appears in Simplified Chinese" },
    );
    if (!t.app) {
      await page.reload();
      const ssr = await (await page.request.get(page.url())).text();
      check(/lang="zh-CN"/.test(ssr), "the server renders Simplified Chinese from the locale cookie");
    }
    await t.open(`/campaigns/${ids.lobbyId}`);
    await eventually(
      async () => /房间码|房间代码/.test(await page.locator(root || "body").first().innerText()),
      { timeoutMs: 25_000, label: "the room code is labeled in Simplified Chinese" },
    );
    await t.shot("zh-cn-lobby");
    await t.open(`/campaigns/${ids.campaignId}`);
    await eventually(
      async () => (await page.locator(root || "body").first().innerText()).includes("纪事"),
      { timeoutMs: 25_000, label: "the table opens with a translated chronicle" },
    );
    await t.shot("zh-cn-table");
    check(
      !hydrationErrors.some((error) => /hydrat|Minified React error #4(18|19|23|25)/i.test(error)),
      `no hydration error: ${hydrationErrors.join(" | ")}`,
    );
  },
};
