import type { Locale } from "./translate";

export const LOCALE_COOKIE = "odm_locale";

export function parseLocale(raw: string | null | undefined): Locale | null {
  const tag = raw?.trim().toLowerCase();
  if (tag === "fr" || tag === "en") return tag;
  if (tag === "zh" || tag === "zh-cn") return "zh-CN";
  return null;
}

// The server's table language is an automatic menu preference where that
// translation exists. English is the default, so it lets the device choose.
export function localeOfServerLanguage(language: string | null | undefined): Locale | null {
  if (language === "french") return "fr";
  if (language === "chinese") return "zh-CN";
  return null;
}

export function localeFromLanguageTags(tags: readonly string[]): Locale {
  for (const raw of tags) {
    const tag = raw.trim().toLowerCase();
    const language = tag.split("-")[0];
    if (language === "en" || language === "fr") return language;
    if (language === "zh") {
      try {
        // Traditional Chinese falls through to the next device preference.
        if (new Intl.Locale(tag).maximize().script === "Hans") return "zh-CN";
      } catch {
        // Ignore malformed language tags supplied by callers.
      }
    }
  }
  return "en";
}

export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return "en";
  const tags = header
    .split(",")
    .map((part, at) => {
      const [tag, ...params] = part.split(";");
      const q = params.map((param) => /^\s*q\s*=\s*([0-9.]+)\s*$/i.exec(param)?.[1]).find((value) => value !== undefined);
      const weight = q === undefined ? 1 : Number(q);
      return { tag, weight: Number.isFinite(weight) ? weight : 0, at };
    })
    .filter(({ weight }) => weight > 0)
    .sort((a, b) => b.weight - a.weight || a.at - b.at);
  return localeFromLanguageTags(tags.map(({ tag }) => tag));
}

function cookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return null;
}

// Server-side locale resolution (per @mcerina's design in #919):
// 1. User's saved profile setting (when signed in)
// 2. `odm_locale` cookie (set by the client when switching language / pre-login)
// 3. the server's own language, where the menus have it (localeOfServerLanguage)
// 4. `Accept-Language` header
// 5. Default `"en"`
export function resolveLocale(options: {
  savedLocale?: string | null;
  cookieHeader?: string | null;
  serverLocale?: Locale | null;
  acceptLanguage?: string | null;
}): Locale {
  return (
    parseLocale(options.savedLocale) ??
    parseLocale(cookieValue(options.cookieHeader ?? null, LOCALE_COOKIE)) ??
    options.serverLocale ??
    localeFromAcceptLanguage(options.acceptLanguage)
  );
}

export function resolveRequestLocale(request: Request, savedLocale?: string | null, serverLocale?: Locale | null): Locale {
  return resolveLocale({
    savedLocale,
    cookieHeader: request.headers.get("cookie"),
    serverLocale,
    acceptLanguage: request.headers.get("accept-language"),
  });
}
