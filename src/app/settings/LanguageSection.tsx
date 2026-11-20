"use client";

import { PageSection } from "@/components/PageShell";
import { GameIcon } from "@/components/ui/GameIcon";
import { useLocaleChoice, useT, writeLocaleChoice, type LocaleChoice } from "@/lib/locale";

// Endonyms let someone facing a language they cannot read find their own.
const CHOICES: Array<{ id: LocaleChoice; label: string; glyph: string }> = [
  { id: "auto", label: "auto", glyph: "sense-darkvision" },
  { id: "en", label: "English", glyph: "daypart-dusk" },
  { id: "fr", label: "Français", glyph: "daypart-night" },
  { id: "zh-CN", label: "简体中文", glyph: "system-lore" },
];

export function LanguageSection() {
  const choice = useLocaleChoice();
  const t = useT();
  return (
    <PageSection
      heading={t("Language")}
      glyph="system-lore"
      intro={t("The language of the menus and screens, kept on this device. Automatic follows the server if its language is available, otherwise the browser. The Game Master narrates in whatever language the table speaks.")}
    >
      <div data-pill-group="" role="group" aria-label={t("Language")} className="flex flex-wrap gap-2">
        {CHOICES.map((entry) => {
          const label = entry.id === "auto" ? t("Automatic") : entry.label;
          return (
            <button
              data-on={choice === entry.id ? "" : undefined}
              key={entry.id}
              type="button"
              aria-pressed={choice === entry.id}
              onClick={() => writeLocaleChoice(entry.id)}
              className="theme-card motion-press"
            >
              <GameIcon icon={{ kind: "glyph", key: entry.glyph }} size="size-8" /> {label}
            </button>
          );
        })}
      </div>
    </PageSection>
  );
}
