// A title to start from, for someone who would rather name the campaign once
// they know what it is: the dice beside the title field roll one in the
// genre's own words. Always editable, never required to be kept. Pure, for
// scripts/test-campaign-creator-flow.mjs.
//
// Each language keeps its own banks, and the composer only ever
// concatenates, never agrees: a French thing carries its article ("le
// Serment"), a French mark is a phrase that never changes with the noun
// ("sans Voix", "de Fer"), and a French place carries its contraction
// ("du royaume de cendre", "de la Marche d'argent"), so « La Couronne sans
// Voix du royaume de cendre » assembles mechanically and always reads
// right. Evocative translations, not word-for-word ones.

import type { Locale } from "@/lib/i18n/translate";

type Bank = { things: string[]; places: string[]; marks: string[] };

const FANTASY: Bank = {
  things: ["Crown", "Oath", "Throne", "Ember", "Blade", "Hollow", "Tide", "Song", "Wyrm", "Lantern"],
  places: ["the Ash Kingdom", "Greywater", "the Sunken Keep", "Thornhold", "the Silver March", "Vael", "the Old Road", "Emberfall"],
  marks: ["Last", "Broken", "Hidden", "Forgotten", "Burning", "Silent", "Shattered"],
};

const BANKS: Record<string, Bank> = {
  high_fantasy: FANTASY,
  dark_fantasy: {
    things: ["Rot", "Hunger", "Pyre", "Bell", "Crown", "Wound", "Veil", "Grave"],
    places: ["the Blighted Vale", "Ravensmoor", "the Ashen Abbey", "Morrow's End", "the Drowned Choir"],
    marks: ["Black", "Weeping", "Hollow", "Bleeding", "Last", "Pale"],
  },
  mystery: {
    things: ["Letter", "Key", "Locket", "Ledger", "Portrait", "Clock", "Masquerade", "Will"],
    places: ["Blackwood Manor", "Harrow Street", "the Gilded Theatre", "Fenwick Hall", "the Night Train"],
    marks: ["Missing", "Thirteenth", "Silent", "Crimson", "Final", "Stolen"],
  },
  horror: {
    things: ["Hunger", "Whisper", "Bell", "Dark", "Door", "Lullaby", "Visitor", "Harvest"],
    places: ["Hollow Creek", "the Asylum", "Saltmarsh", "the Lighthouse", "Widow's Rest"],
    marks: ["Endless", "Drowned", "Crawling", "Quiet", "Last", "Pale"],
  },
  cyberpunk: {
    things: ["Signal", "Ghost", "Protocol", "Static", "Contract", "Circuit", "Glitch", "Neon"],
    places: ["Sector Nine", "the Undercity", "Kowloon Stack", "the Glass Spire", "Night Market"],
    marks: ["Dead", "Chrome", "Broken", "Black", "Zero", "Hollow"],
  },
  steampunk: {
    things: ["Engine", "Gear", "Airship", "Clockwork", "Furnace", "Compass", "Expedition", "Patent"],
    places: ["Brasshaven", "the Iron Quarter", "the Cloud Docks", "Gearmouth", "the Copper Line"],
    marks: ["Brass", "Final", "Lost", "Silent", "Clockwork", "Gilded"],
  },
  post_apocalyptic: {
    things: ["Wasteland", "Signal", "Convoy", "Water", "Fallout", "Radio", "Bunker", "Dust"],
    places: ["the Dry Sea", "Route 66", "the Glass Desert", "Rust Town", "the Dead Zone"],
    marks: ["Last", "Burning", "Lost", "Rusted", "Silent", "Final"],
  },
};

const FANTASY_FR: Bank = {
  things: ["la Couronne", "le Serment", "le Trône", "la Braise", "la Lame", "le Creux", "la Marée", "le Chant", "le Wyrm", "la Lanterne"],
  places: [
    "du royaume de cendre",
    "des Eaux grises",
    "du Donjon englouti",
    "de Fort-Épines",
    "de la Marche d'argent",
    "de Vael",
    "de la Vieille route",
    "des Chutes de braise",
  ],
  marks: ["sans Héritier", "en éclats", "des Brumes", "de l'Oubli", "en flammes", "sans Voix", "sans Fin"],
};

const BANKS_FR: Record<string, Bank> = {
  high_fantasy: FANTASY_FR,
  dark_fantasy: {
    things: ["la Pourriture", "la Faim", "le Bûcher", "la Cloche", "la Couronne", "la Plaie", "le Voile", "la Tombe"],
    places: [
      "du Vallon rongé",
      "de Corbeaumont",
      "de l'Abbaye cendrée",
      "du Bout de demain",
      "du Chœur noyé",
    ],
    marks: ["de Nuit", "en larmes", "sans Fond", "qui saigne", "sans Héritier", "de Cendre"],
  },
  mystery: {
    things: ["la Lettre", "la Clé", "le Médaillon", "le Registre", "le Portrait", "l'Horloge", "le Bal masqué", "le Testament"],
    places: [
      "du Manoir Bois-Noir",
      "de la rue Harrow",
      "du Théâtre doré",
      "de la demeure Fenwick",
      "du Train de nuit",
    ],
    marks: ["sans Adresse", "de Minuit", "sans Mot", "en Rouge", "de la Dernière Heure", "sans Trace"],
  },
  horror: {
    things: ["la Faim", "le Murmure", "la Cloche", "le Noir", "la Porte", "la Berceuse", "le Visiteur", "la Moisson"],
    places: [
      "du Ruisseau creux",
      "de l'Asile",
      "de Salcombemarée",
      "du Phare",
      "du Repos de la Veuve",
    ],
    marks: ["sans Fin", "des Noyés", "qui rampe", "sans Bruit", "du Dernier Soupir", "sans Visage"],
  },
  cyberpunk: {
    things: ["le Signal", "le Fantôme", "le Protocole", "la Statique", "le Contrat", "le Circuit", "le Bug", "le Néon"],
    places: [
      "du Secteur Neuf",
      "de la Basse-ville",
      "des Tours de Kowloon",
      "de la Flèche de verre",
      "du Marché de nuit",
    ],
    marks: ["hors Ligne", "de Chrome", "en Panne", "au Noir", "à Zéro", "sans Écho"],
  },
  steampunk: {
    things: ["la Machine", "l'Engrenage", "le Dirigeable", "l'Automate", "la Fournaise", "le Compas", "l'Expédition", "le Brevet"],
    places: [
      "de Laitonhaven",
      "du Quartier de fer",
      "des Docks des nuages",
      "d'Engreneville",
      "de la Ligne de cuivre",
    ],
    marks: ["de Laiton", "du Dernier Voyage", "sans Retour", "sans Bruit", "à ressort", "à l'Or fin"],
  },
  post_apocalyptic: {
    things: ["le Désert", "le Signal", "le Convoi", "l'Eau", "les Retombées", "la Radio", "le Bunker", "la Poussière"],
    places: [
      "de la Mer sèche",
      "de la Route 66",
      "du Désert de verre",
      "de la Ville-de-Rouille",
      "de la Zone morte",
    ],
    marks: ["du Dernier Jour", "en flammes", "sans Fréquence", "de Rouille", "sans Onde", "de l'Après"],
  },
};

const pickOne = <T,>(list: T[], random: () => number) => list[Math.floor(random() * list.length) % list.length];

const FANTASY_ZH: Bank = {
  things: ["王冠", "誓言", "剑刃", "灯火", "余烬", "龙吟"],
  places: ["灰烬王国", "银岭", "沉没要塞", "荆棘堡", "旧道"],
  marks: ["失落的", "破碎的", "隐秘的", "最后的", "燃烧的"],
};

const BANKS_ZH: Record<string, Bank> = {
  high_fantasy: FANTASY_ZH,
  dark_fantasy: {
    things: ["大钟", "火葬堆", "面纱", "墓碑", "伤痕"],
    places: ["枯谷", "乌鸦沼泽", "灰烬修道院", "荒原尽头"],
    marks: ["无声的", "苍白的", "腐朽的", "碎裂的"],
  },
  mystery: {
    things: ["信", "钥匙", "账簿", "遗嘱", "时钟"],
    places: ["黑木庄园", "金色剧院", "夜行列车", "狭巷"],
    marks: ["失踪的", "深红的", "密封的", "被盗的"],
  },
  horror: {
    things: ["低语", "门", "摇篮曲", "来客", "钟声"],
    places: ["空溪镇", "旧灯塔", "荒村", "白石疗养院"],
    marks: ["无尽的", "悄然的", "无面的", "最后的"],
  },
  cyberpunk: {
    things: ["信号", "协议", "幽灵", "电路", "合约"],
    places: ["第九区", "地下城", "玻璃尖塔", "霓虹夜市"],
    marks: ["断线的", "失控的", "加密的", "褪色的"],
  },
  steampunk: {
    things: ["引擎", "飞空艇", "罗盘", "发条", "专利"],
    places: ["铜港", "铁城区", "云端码头", "黄铜铁道"],
    marks: ["失灵的", "镀金的", "失落的", "停摆的"],
  },
  post_apocalyptic: {
    things: ["电台", "车队", "掩体", "信号", "尘埃"],
    places: ["干涸之海", "玻璃沙漠", "锈镇", "禁区"],
    marks: ["断续的", "生锈的", "燃烧的", "最后的"],
  },
};

function rollChineseCampaignTitle(genre: string, current: string, random: () => number): string {
  const bank = BANKS_ZH[genre] ?? FANTASY_ZH;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const shape = Math.floor(random() * 3);
    const thing = pickOne(bank.things, random);
    const title = shape === 0
      ? `${pickOne(bank.marks, random)}${thing}`
      : shape === 1
        ? `${pickOne(bank.places, random)}的${thing}`
        : `${pickOne(bank.places, random)}·${pickOne(bank.marks, random)}${thing}`;
    if (title !== current) return title;
  }
  return `${pickOne(bank.places, random)}·${pickOne(bank.things, random)}`;
}

// Titles start the sentence they are, so the thing's article is capitalised
// ("le Serment" -> "Le Serment"); marks and places keep their case.
const cap = (title: string) => title.charAt(0).toUpperCase() + title.slice(1);

export function rollCampaignTitle(genre: string, current = "", random: () => number = Math.random, locale: Locale = "en"): string {
  if (locale === "zh-CN") {
    return rollChineseCampaignTitle(genre, current, random);
  }
  const french = locale === "fr";
  const bank = french ? BANKS_FR[genre] ?? FANTASY_FR : BANKS[genre] ?? FANTASY;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const shape = Math.floor(random() * 3);
    // The three shapes: « Le X Y », « Le X de Z », « Le X Y de Z » in
    // French; "The X Y", "X of Z", "The X Y of Z" in English.
    const title = french
      ? cap(
          shape === 0
            ? `${pickOne(bank.things, random)} ${pickOne(bank.marks, random)}`
            : shape === 1
              ? `${pickOne(bank.things, random)} ${pickOne(bank.places, random)}`
              : `${pickOne(bank.things, random)} ${pickOne(bank.marks, random)} ${pickOne(bank.places, random)}`,
        )
      : shape === 0
        ? `The ${pickOne(bank.marks, random)} ${pickOne(bank.things, random)}`
        : shape === 1
          ? `${pickOne(bank.things, random)} of ${pickOne(bank.places, random)}`
          : `The ${pickOne(bank.marks, random)} ${pickOne(bank.things, random)} of ${pickOne(bank.places, random)}`;
    if (title !== current) return title;
  }
  return french
    ? cap(`${pickOne(bank.things, random)} ${pickOne(bank.places, random)}`)
    : `${pickOne(bank.things, random)} of ${pickOne(bank.places, random)}`;
}
