import type { CreateSheetInput } from "@/lib/schemas/sheet";
import type { Locale } from "@/lib/i18n/translate";

// Four ready-made heroes for a table that wants to start in ten minutes.
// Each is a complete level 1 sheet in the shape the character builder
// submits: standard array with the human's +1 on every score, the class's
// starting kit as the book's first choices, the background's tool pick
// made, the class's skills beside the background's and the languages the
// race and background give (scripts/test-starter.mjs holds them to it). They pass the same admission door as any player's character
// (src/lib/characters/admit.ts, scripts/test-starter.mjs proves it), so
// nothing here is special-cased at the table: once picked, a hero is a
// library character like any other.

export type Pregen = {
  id: string;
  // What the picker card says.
  tagline: string;
  blurb: string;
  sheet: CreateSheetInput;
};

const pack = (names: Array<[string, number?]>) => names.map(([name, qty]) => ({ name, qty: qty ?? 1 }));

const EXPLORER = pack([
  ["Backpack"], ["Bedroll"], ["Mess Kit"], ["Tinderbox"], ["Torch", 10], ["Rations (1 day)", 10], ["Waterskin"], ["Rope, Hempen (50 feet)"],
]);
const DUNGEONEER = pack([
  ["Backpack"], ["Crowbar"], ["Hammer"], ["Piton", 10], ["Torch", 10], ["Tinderbox"], ["Rations (1 day)", 10], ["Waterskin"], ["Rope, Hempen (50 feet)"],
]);
const BURGLAR = pack([
  ["Backpack"], ["Ball Bearings (bag of 1000)"], ["String (10 feet)"], ["Bell"], ["Candle", 5], ["Crowbar"], ["Hammer"], ["Piton", 10],
  ["Lantern, Hooded"], ["Oil (flask)", 2], ["Rations (1 day)", 5], ["Tinderbox"], ["Waterskin"], ["Rope, Hempen (50 feet)"],
]);
const PRIEST = pack([
  ["Backpack"], ["Blanket"], ["Candle", 10], ["Tinderbox"], ["Alms Box"], ["Block of Incense", 2], ["Censer"], ["Vestments"], ["Rations (1 day)", 2], ["Waterskin"],
]);

const base: Pick<
  CreateSheetInput,
  | "subclass" | "alignment" | "gender" | "appearance" | "speed" | "classes" | "hitDicePools" | "gold" | "copper"
  | "feats" | "features" | "asiChoices" | "spellcasting" | "portrait" | "notes" | "backstory" | "hopes"
> = {
  subclass: "",
  alignment: "",
  gender: "",
  appearance: "",
  speed: 30,
  classes: [],
  hitDicePools: null,
  gold: 0,
  copper: 0,
  feats: [],
  features: [],
  asiChoices: [],
  spellcasting: null,
  portrait: null,
  notes: "",
  backstory: "",
  hopes: "",
};

export const PREGENS: Pregen[] = [
  {
    id: "brakk",
    tagline: "Brakk, human barbarian",
    blurb: "Hits first and asks later. Swing the greataxe, shrug off blows, and keep the others alive by standing in front of them.",
    sheet: {
      ...base,
      name: "Brakk",
      race: "human",
      class: "barbarian",
      background: "outlander",
      abilities: { str: 16, dex: 14, con: 15, int: 9, wis: 13, cha: 11 },
      maxHp: 14,
      ac: 14,
      hitDice: { die: "d12", total: 1, spent: 0 },
      proficiencies: {
        saves: ["str", "con"],
        // The outlander's Athletics and Survival, and the barbarian's own two.
        skills: ["athletics", "survival", "intimidation", "perception"],
        expertise: [],
        // Common, the human's extra language and the outlander's.
        languages: ["Common", "Giant", "Orc"],
        tools: ["drum"],
        armor: [],
        weapons: [],
      },
      equipment: [...pack([["Greataxe"], ["Handaxe", 2]]), ...EXPLORER, ...pack([["Javelin", 4]])],
      backstory: "Raised in the high passes, Brakk came down to the lowlands when the herds died, and has not found a reason to go back.",
    },
  },
  {
    id: "kara",
    tagline: "Kara, human fighter",
    blurb: "Shield, sword and chain mail. The steadiest hand at the table: hard to hit, harder to move, and always has a plan for the door.",
    sheet: {
      ...base,
      name: "Kara",
      race: "human",
      class: "fighter",
      background: "soldier",
      abilities: { str: 16, dex: 15, con: 14, int: 13, wis: 11, cha: 9 },
      maxHp: 12,
      ac: 18,
      hitDice: { die: "d10", total: 1, spent: 0 },
      proficiencies: {
        saves: ["str", "con"],
        // The soldier's Athletics and Intimidation, and the fighter's own two.
        skills: ["athletics", "intimidation", "perception", "survival"],
        expertise: [],
        // Common and the human's extra language.
        languages: ["Common", "Dwarvish"],
        tools: ["dice set"],
        armor: [],
        weapons: [],
      },
      equipment: [...pack([["Chain Mail"], ["Longsword"], ["Shield"], ["Light Crossbow"], ["Crossbow Bolts", 20]]), ...DUNGEONEER],
      // A fighter's 1st-level Fighting Style, which the sheet listed as owed
      // once fighting styles were (issue #833): Defense, for the chain mail.
      features: [{ name: "Fighting Style: Defense", source: "choice" }],
      backstory: "Ten years in a river baron's guard, mustered out when the baron ran out of money. Still salutes by habit.",
    },
  },
  {
    id: "vex",
    tagline: "Vex, human rogue",
    blurb: "Locks, shadows and a rapier. Scout ahead, find the trap before it finds you, and strike where it hurts.",
    sheet: {
      ...base,
      name: "Vex",
      race: "human",
      class: "rogue",
      background: "criminal",
      abilities: { str: 9, dex: 16, con: 14, int: 13, wis: 11, cha: 15 },
      maxHp: 10,
      ac: 14,
      hitDice: { die: "d8", total: 1, spent: 0 },
      proficiencies: {
        saves: ["dex", "int"],
        // The criminal's Deception and Stealth, and the rogue's own four.
        skills: ["deception", "stealth", "acrobatics", "perception", "investigation", "sleight_of_hand"],
        expertise: ["stealth", "perception"],
        // Common and the human's extra language; Thieves' Cant is the class's.
        languages: ["Common", "Halfling"],
        tools: ["thieves' tools", "dice set"],
        armor: [],
        weapons: [],
      },
      equipment: [...pack([["Rapier"], ["Shortbow"], ["Quiver"], ["Arrows", 20]]), ...BURGLAR, ...pack([["Leather"], ["Dagger", 2], ["Thieves' Tools"]])],
      backstory: "Left a city guild one step ahead of a debt. Keeps a list of people who are owed, and a shorter list of people who are owed by Vex.",
    },
  },
  {
    id: "sera",
    tagline: "Sera, human cleric of life",
    blurb: "Mace, shield and a healer's hands. Keeps the party standing with Cure Wounds and Bless, and can hold a line herself.",
    sheet: {
      ...base,
      name: "Sera",
      race: "human",
      class: "cleric",
      subclass: "life",
      background: "acolyte",
      abilities: { str: 14, dex: 9, con: 15, int: 11, wis: 16, cha: 13 },
      maxHp: 10,
      ac: 15,
      hitDice: { die: "d8", total: 1, spent: 0 },
      proficiencies: {
        saves: ["wis", "cha"],
        // The acolyte's Insight and Religion, and the cleric's own two.
        skills: ["insight", "religion", "medicine", "persuasion"],
        expertise: [],
        // Common, the human's extra language and the acolyte's two.
        languages: ["Common", "Celestial", "Elvish", "Halfling"],
        tools: [],
        armor: [],
        weapons: [],
      },
      equipment: [...pack([["Mace"], ["Scale Mail"], ["Spear"]]), ...PRIEST, ...pack([["Shield"], ["Holy Symbol"]])],
      spellcasting: {
        ability: "wis",
        slots: { "1": { max: 2, used: 0 } },
        prepared: ["Cure Wounds", "Bless", "Guiding Bolt", "Healing Word"],
        cantrips: ["Sacred Flame", "Guidance", "Light"],
        known: [],
      },
      backstory: "A chapel orphan who learned that a steady voice and a steadier hand do more good than a sermon.",
    },
  },
];

export function pregenById(id: string, locale: Locale = "en"): Pregen | null {
  const pregen = PREGENS.find((pregen) => pregen.id === id) ?? null;
  if (!pregen) {
    return pregen;
  }
  const text = PREGEN_TEXT[locale]?.[id];
  return text ? { ...pregen, tagline: text.tagline, blurb: text.blurb, sheet: { ...pregen.sheet, backstory: text.backstory } } : pregen;
}

// The heroes' own words in French: the picker's line, the card's pitch and
// the backstory the character keeps, chosen when the hero takes a seat, so
// a French table's library reads French and an English table's stays as it
// was. Equipment, spells and traits are not here: those translate at render
// (src/lib/content/names.ts).
type PregenText = { tagline: string; blurb: string; backstory: string };

const PREGEN_TEXT_FR: Record<string, PregenText> = {
  brakk: {
    tagline: "Brakk, barbare humain",
    blurb: "Frappe d’abord, demande ensuite. Brandis la hache à deux mains, encaisse les coups et garde les autres en vie en te tenant devant eux.",
    backstory: "Né dans les hauts cols, Brakk est redescendu dans les terres basses quand les troupeaux ont péri, et il n’a jamais trouvé de raison d’y remonter.",
  },
  kara: {
    tagline: "Kara, guerrière humaine",
    blurb: "Bouclier, épée et cotte de mailles. La main la plus sûre de la table : difficile à toucher, plus difficile encore à déplacer, et toujours un plan face à une porte.",
    backstory: "Dix ans dans la garde d’un baron du fleuve, renvoyée quand le baron n’a plus eu d’argent. Elle salue encore par habitude.",
  },
  vex: {
    tagline: "Vex, roublard humain",
    blurb: "Serrures, ombres et rapière. Pars en éclaireur, trouve le piège avant qu’il ne te trouve, et frappe où ça fait mal.",
    backstory: "A quitté une guilde citadine juste avant qu’une dette ne le rattrape. Vex tient la liste de ceux à qui l’on doit quelque chose, et une plus courte de ceux à qui Vex doit.",
  },
  sera: {
    tagline: "Sera, clerc humaine de la Vie",
    blurb: "Masse d’armes, bouclier et des mains de soigneuse. Elle garde le groupe debout avec Mot de guérison et Bénédiction, et sait tenir la ligne elle-même.",
    backstory: "Orpheline de la chapelle, elle a appris qu’une voix posée et une main plus ferme encore font plus de bien qu’un sermon.",
  },
};

const PREGEN_TEXT_ZH: Record<string, PregenText> = {
  brakk: {
    tagline: "布拉克，人类野蛮人",
    blurb: "挥动巨斧，扛住迎面而来的攻击，为队友守住前线。",
    backstory: "布拉克出生在高山隘口。牧群死去后，他下到平原生活，从此没找到回去的理由。",
  },
  kara: {
    tagline: "卡拉，人类战士",
    blurb: "长剑、盾牌和锁子甲。她难以被击中，也几乎没人能把她从守住的位置上推开。遇到关着的门，她总有主意。",
    backstory: "卡拉在一位河畔男爵的卫队服役十年。男爵付不起军饷，她才离开。她如今仍习惯行礼。",
  },
  vex: {
    tagline: "维克斯，人类游荡者",
    blurb: "开锁、潜行、用细剑找敌人的破绽。走在队伍前头，赶在陷阱被触发前发现它。",
    backstory: "一笔债追上维克斯之前，他离开了城里的行会。他把欠别人情的人记在一张清单上，自己欠谁则记在另一张更短的清单上。",
  },
  sera: {
    tagline: "塞拉，人类牧师，生命领域",
    blurb: "拿着硬头锤和盾牌，用治疗真言稳住队友，用祝福术为队伍助力。她自己也能守住阵线。",
    backstory: "塞拉在礼拜堂长大。她发现，平静的声音和稳当的双手，往往比布道更能帮助人。",
  },
};

const PREGEN_TEXT: Partial<Record<Locale, Record<string, PregenText>>> = {
  fr: PREGEN_TEXT_FR,
  "zh-CN": PREGEN_TEXT_ZH,
};

// What the picker shows: no sheet, nothing to tamper with.
export function pregenSummaries(locale: Locale = "en") {
  return PREGENS.map((pregen) => {
    const text = PREGEN_TEXT[locale]?.[pregen.id];
    return {
      id: pregen.id,
      name: pregen.sheet.name,
      tagline: text?.tagline ?? pregen.tagline,
      blurb: text?.blurb ?? pregen.blurb,
      race: pregen.sheet.race,
      class: pregen.sheet.class,
    };
  });
}
