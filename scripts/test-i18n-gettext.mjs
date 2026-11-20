import assert from "node:assert/strict";
import fs from "node:fs";
import { register } from "node:module";

register("./lib/register-routes.mjs", import.meta.url);

const { translate, translatePlural, catalogInstalled, installCatalog } = await import("../src/lib/i18n/translate.ts");
const { localeTag, pluralCategory } = await import("../src/lib/messages-logic.ts");

// 0. The catalog is installed, never imported by the translator: imported, its
// 1 MB rode in every page's first load (scripts/bundle-budget.json). Until it
// is in, French reads English; the server's modules install it, a browser
// fetches it as its own chunk.
assert.equal(catalogInstalled("fr"), false);
assert.equal(catalogInstalled("zh-CN"), false);
assert.equal(translate("fr", "Loading…"), "Loading…", "no catalog yet: the English source");
assert.equal(translate("zh-CN", "Language"), "Language");
for (const file of ["../src/lib/i18n/translate.ts", "../src/lib/messages-logic.ts", "../src/lib/locale.tsx"]) {
  const source = fs.readFileSync(new URL(file, import.meta.url), "utf8");
  assert.doesNotMatch(source, /^import[^;]*(fr|zh-CN)\.json/m, `${file} imports a catalog into every page`);
}
assert.match(fs.readFileSync(new URL("../src/lib/i18n/catalog-loader.ts", import.meta.url), "utf8"), /import\("\.\/fr\.json"\)/, "the browser fetches the catalog on demand");
assert.match(fs.readFileSync(new URL("../src/lib/i18n/catalog-loader.ts", import.meta.url), "utf8"), /import\("\.\/zh-CN\.json"\)/, "the browser fetches the Chinese catalog on demand");
for (const file of ["../src/lib/request-locale.ts", "../src/app/layout.tsx", "../src/instrumentation.ts"]) {
  const source = fs.readFileSync(new URL(file, import.meta.url), "utf8");
  assert.match(source, /i18n\/fr-catalog/, `${file} installs the French catalog on the server`);
  assert.match(source, /i18n\/zh-catalog/, `${file} installs the Chinese catalog on the server`);
}
// A translated count uses its one Chinese form, while a missing pair keeps
// the English singular/plural distinction on fallback.
installCatalog("zh-CN", { messages: {}, contexts: {}, plurals: { ["{count} test day\0{count} test days"]: ["{count} 个单数日", "{count} 天"] } });
assert.equal(translatePlural("zh-CN", "{count} test day", "{count} test days", { count: 1 }), "1 天");
assert.equal(translatePlural("zh-CN", "{count} test item", "{count} test items", { count: 1 }), "1 test item");
assert.equal(pluralCategory("zh-CN", 1), "other");
await import("../src/lib/i18n/fr-catalog.ts");
await import("../src/lib/i18n/zh-catalog.ts");
assert.equal(catalogInstalled("fr"), true);
assert.equal(catalogInstalled("zh-CN"), true);
assert.equal(localeTag("zh-CN"), "zh-CN");
const { localeFromAcceptLanguage, localeFromLanguageTags, localeOfServerLanguage, parseLocale, resolveLocale, resolveRequestLocale } = await import("../src/lib/i18n/locale.ts");
const frCatalog = JSON.parse(fs.readFileSync(new URL("../src/lib/i18n/fr.json", import.meta.url), "utf8"));
const zhCatalog = JSON.parse(fs.readFileSync(new URL("../src/lib/i18n/zh-CN.json", import.meta.url), "utf8"));

// 1. English returns the source string verbatim with interpolation
assert.equal(translate("en", "Loading…"), "Loading…");
assert.equal(translate("en", "Level {level}", { level: 5 }), "Level 5");

// 2. French resolves from fr.json catalog and falls back to English for unknown strings
assert.equal(translate("fr", "Loading…"), "Chargement…");
assert.equal(translate("fr", "Some brand new untranslated UI string"), "Some brand new untranslated UI string");
assert.equal(translate("zh-CN", "Language"), "语言");
assert.equal(translate("zh-CN", "Some brand new untranslated UI string"), "Some brand new untranslated UI string");

// 3. Context disambiguation resolves collisions cleanly
assert.equal(translate("fr", "On"), "Activé");
assert.equal(translate("fr", "On", { context: "workshop.homebrew.spellMore.on" }), "Sur");

// 4. Pluralization follows EN (count === 1) vs FR (count <= 1)
assert.equal(translatePlural("en", "{count} round", "{count} rounds", { count: 0 }), "0 rounds");
assert.equal(translatePlural("en", "{count} round", "{count} rounds", { count: 1 }), "1 round");
assert.equal(translatePlural("fr", "{count} day", "{count} days", { count: 0 }), "0 jour");
assert.equal(translatePlural("fr", "{count} day", "{count} days", { count: 2 }), "2 jours");

// 5. Server-side locale resolution priority: saved > cookie > Accept-Language > en
assert.equal(resolveLocale({ savedLocale: "fr", cookieHeader: "odm_locale=en", acceptLanguage: "en-US" }), "fr");
assert.equal(resolveLocale({ cookieHeader: "foo=1; odm_locale=fr", acceptLanguage: "en-US" }), "fr");
assert.equal(resolveLocale({ acceptLanguage: "fr-CA,fr;q=0.9,en;q=0.8" }), "fr");
assert.equal(localeFromAcceptLanguage("de-DE,es;q=0.8"), "en");
// A French server opens in French for a reader who chose nothing; their own
// choice still wins, and an English server (every server's default) leaves
// it to the browser.
assert.equal(localeOfServerLanguage("french"), "fr");
assert.equal(localeOfServerLanguage("chinese"), "zh-CN");
assert.equal(localeOfServerLanguage("english"), null);
assert.equal(localeOfServerLanguage("italian"), null);
assert.equal(resolveLocale({ serverLocale: "fr", acceptLanguage: "en-US" }), "fr");
assert.equal(resolveLocale({ cookieHeader: "odm_locale=en", serverLocale: "fr", acceptLanguage: "fr-FR" }), "en");
assert.equal(resolveLocale({ serverLocale: localeOfServerLanguage("english"), acceptLanguage: "fr-FR" }), "fr");
assert.equal(localeFromAcceptLanguage("en-US;q=0.5,fr;q=0.9"), "fr");
assert.equal(localeFromAcceptLanguage("fr;q=0,en;q=0.8"), "en");
assert.equal(localeFromAcceptLanguage("en-US;q=0.5,zh-CN;q=0.9"), "zh-CN");
assert.equal(localeFromAcceptLanguage("zh-CN;q=0,fr;q=0.8"), "fr");
assert.equal(localeFromLanguageTags(["zh-TW", "zh-Hant", "fr-CA"]), "fr");
assert.equal(localeFromLanguageTags(["ja-JP", "zh-Hans-SG"]), "zh-CN");
assert.equal(parseLocale("zh"), "zh-CN");
assert.equal(parseLocale("zh-CN"), "zh-CN");
assert.equal(parseLocale("zh-TW"), null);
assert.equal(resolveLocale({ cookieHeader: "odm_locale=zh-CN", serverLocale: "fr", acceptLanguage: "en-US" }), "zh-CN");
assert.equal(
  resolveRequestLocale(
    new Request("http://localhost/", {
      headers: { cookie: "odm_locale=invalid", "accept-language": "fr-FR,fr;q=0.9" },
    }),
  ),
  "fr",
);
assert.equal(translate("fr", "On", { context: "unknown.context" }), "Activé");

// 6. Catalog integrity: every French entry preserves the English {placeholders}
// (omitting English-only {article} where French uses no indefinite article).
const varsOf = (s) =>
  [...s.matchAll(/\{([a-zA-Z0-9_]+)\}/g)]
    .map((m) => m[1])
    .filter((v) => v !== "article")
    .sort();
for (const [language, catalog] of [["fr", frCatalog], ["zh-CN", zhCatalog]]) {
  for (const [en, localized] of Object.entries(catalog.messages)) {
    assert.deepEqual(varsOf(localized), varsOf(en), `${language}: Placeholder mismatch in messages for: ${en}`);
  }
  for (const [en, ctxMap] of Object.entries(catalog.contexts)) {
    for (const [ctx, localized] of Object.entries(ctxMap)) {
      assert.deepEqual(varsOf(localized), varsOf(en), `${language}: Placeholder mismatch in contexts[${ctx}] for: ${en}`);
    }
  }
  for (const [key, pair] of Object.entries(catalog.plurals)) {
    assert.ok(Array.isArray(pair) && pair.length === 2, `${language}: Expected [one, other] tuple for plural: ${key}`);
    const [enOne, enOther] = key.split("\0");
    assert.deepEqual(varsOf(pair[0]), varsOf(enOne), `${language}: Placeholder mismatch in plural[0] for: ${key}`);
    assert.deepEqual(varsOf(pair[1]), varsOf(enOther), `${language}: Placeholder mismatch in plural[1] for: ${key}`);
  }
}

console.log("test-i18n-gettext: all assertions and catalog placeholder checks passed");
