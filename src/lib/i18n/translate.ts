export type Locale = "en" | "fr" | "zh-CN";

export type TranslateVars = Record<string, string | number> & {
  context?: string;
};

type Catalog = {
  messages: Record<string, string>;
  contexts: Record<string, Record<string, string>>;
  plurals: Record<string, [string, string]>;
};

// The shared LocaleApplier and every useT pull this module in. Each catalog
// is installed on the server and loaded in a separate chunk in the browser
// (catalog-loader.ts), so selecting a language only fetches its own catalog.
// The store sits on globalThis so the server's route, page and SSR layers
// share it.
const STORE = "__odmI18nCatalogs";

function catalogs(): Partial<Record<Locale, Catalog>> {
  const holder = globalThis as typeof globalThis & { [STORE]?: Partial<Record<Locale, Catalog>> };
  holder[STORE] ??= {};
  return holder[STORE];
}

export function installCatalog(locale: Locale, catalog: unknown): void {
  if (locale !== "en") {
    catalogs()[locale] = catalog as Catalog;
  }
}

// English is the source and needs no catalog.
export function catalogInstalled(locale: Locale): boolean {
  return locale === "en" || Boolean(catalogs()[locale]);
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name) => {
    if (name === "context") return match;
    return name in vars ? String(vars[name]) : match;
  });
}

// Gettext-style translation: English is the key and fallback.
// When `vars.context` is given and an override exists in `contexts`,
// that disambiguated string wins over the default entry.
export function translate(locale: Locale, english: string, vars?: TranslateVars): string {
  const catalog = locale === "en" ? undefined : catalogs()[locale];
  const context = vars?.context;
  const variant = context && catalog && Object.hasOwn(catalog.contexts, english) ? catalog.contexts[english] : undefined;
  const message = variant && context && Object.hasOwn(variant, context)
    ? variant[context]
    : catalog && Object.hasOwn(catalog.messages, english) ? catalog.messages[english] : english;
  return interpolate(message, vars);
}

export function translatePlural(
  locale: Locale,
  englishOne: string,
  englishOther: string,
  vars: TranslateVars & { count: number },
): string {
  const isOne = locale === "fr" ? vars.count <= 1 : vars.count === 1;
  const pair = locale === "en" ? undefined : catalogs()[locale]?.plurals[`${englishOne}\0${englishOther}`];
  if (pair) {
    return interpolate(isOne && locale !== "zh-CN" ? pair[0] : pair[1], vars);
  }
  // Most Chinese labels use the same wording for every count. Let the
  // ordinary catalog carry this form when there is no pair-specific entry;
  // an untranslated term still follows the English count on the fallback.
  return translate(locale, isOne ? englishOne : englishOther, vars);
}
