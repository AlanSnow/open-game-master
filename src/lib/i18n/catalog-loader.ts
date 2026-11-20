// A catalog in the browser, fetched only when the reader's language needs
// it. One fetch per locale however many components ask.
import { installFrTables } from "./fr-tables.ts";
import { catalogInstalled, installCatalog, type Locale } from "./translate.ts";

const loading = new Map<Locale, Promise<void>>();

export function loadCatalog(locale: Locale): Promise<void> {
  let pending = loading.get(locale);
  if (pending) {
    return pending;
  }
  if (catalogInstalled(locale)) {
    pending = Promise.resolve();
    loading.set(locale, pending);
    return pending;
  }
  const bundle = locale === "zh-CN"
    ? import("./zh-CN.json").then(({ default: catalog }) => installCatalog(locale, catalog))
    : Promise.all([
        import("./fr.json"),
        import("../content/names-fr.ts"),
        import("../content/names-fr-translated.ts"),
        import("../srd/class-resources-fr-data.ts"),
      ]).then(([catalog, names, translated, resources]) => {
        // The tables first: the catalog's arrival is what re-renders.
        installFrTables({ names: names.FR_NAMES_BY_TABLE, translated: translated.FR_TRANSLATED_NAMES_BY_TABLE, resources: resources.RESOURCE_FR });
        installCatalog(locale, catalog.default);
      });
  pending = bundle.catch((error) => {
    // A failed fetch leaves English on screen and lets a later ask retry.
    loading.delete(locale);
    console.error(`[i18n] the ${locale} catalog did not load`, error);
  });
  loading.set(locale, pending);
  return pending;
}
