export type ThemeSlug = "decide" | "lead" | "recover" | "strategy" | "change";
export type CategoryName =
  | "decide" | "lead" | "recover" | "strategy" | "change"

export interface ThemeInfo {
  slug:        ThemeSlug;
  label:       string;
  icon:        string;
  tagline:     string;
  description: string;
  color:       string;
  gradient:    string;
}

export const THEME_INFO: Record<ThemeSlug, ThemeInfo> = {
  decide: {
    slug:        "decide",
    label:       "決断できない",
    icon:        "決",
    tagline:     "迷いの夜に、偉人たちはこう動いた",
    description: "シーザーもナポレオンも、正解がわからないまま決断した。歴史の偉人たちの「決断の瞬間」から、今日の選択のヒントを探す。",
    color:       "#7C3AED",
    gradient:    "linear-gradient(135deg, #4C1D95 0%, #1e1b4b 100%)",
  },
  lead: {
    slug:        "lead",
    label:       "人間関係・チーム",
    icon:        "人",
    tagline:     "人を動かすことの難しさは、いつの時代も同じだ",
    description: "カーネギーが語り、信長が実践し、孫子が理論化した。チームが機能しない、部下が動かない——そんな悩みへの偉人たちの答え。",
    color:       "#7C3AED",
    gradient:    "linear-gradient(135deg, #4C1D95 0%, #1e1b4b 100%)",
  },
  recover: {
    slug:        "recover",
    label:       "逆境・失敗した",
    icon:        "復",
    tagline:     "どん底から這い上がった偉人たちの思考法",
    description: "ナポレオンの流刑、リンカーンの落選、家康の大敗——歴史の偉人たちは何度も失敗した。その後どう動いたかが、今日の答えになる。",
    color:       "#7C3AED",
    gradient:    "linear-gradient(135deg, #4C1D95 0%, #1e1b4b 100%)",
  },
  strategy: {
    slug:        "strategy",
    label:       "戦略・方向性に迷う",
    icon:        "謀",
    tagline:     "勝ち方がわからない時、偉人の戦略論が動く",
    description: "孫子、クラウゼヴィッツ、マキャヴェリ——時代を超えて生き残った戦略の本質。競合に勝てない、方向性が見えない時の処方箋。",
    color:       "#7C3AED",
    gradient:    "linear-gradient(135deg, #4C1D95 0%, #1e1b4b 100%)",
  },
  change: {
    slug:        "change",
    label:       "自分を変えたい",
    icon:        "変",
    tagline:     "変わった人は、みな「変わる前の夜」を持っていた",
    description: "龍馬、ガンジー、マンデラ——現状を打ち破った人たちには共通の思考があった。「このままじゃいけない」という夜のための記録。",
    color:       "#7C3AED",
    gradient:    "linear-gradient(135deg, #4C1D95 0%, #1e1b4b 100%)",
  },
};

export const THEME_ORDER: ThemeSlug[] = ["decide", "lead", "recover", "strategy", "change"];

export const CAT_LABEL: Record<CategoryName, string> = {
  decide:   "決断できない時",
  lead:     "チームがうまくいかない時",
  recover:  "逆境・失敗した時",
  strategy: "戦略・方向性に迷った時",
  change:   "自分を変えたい時",
  philosophy: "哲学の知恵",
};

// 後方互換用（arcページが残っている場合のフォールバック）
export type ArcSlug = ThemeSlug;
export const ARC_INFO = {} as Record<string, ThemeInfo>;
export const ARC_ORDER = THEME_ORDER;
export const NEXT_ARC: Partial<Record<ThemeSlug, ThemeSlug>> = {
  decide:   "lead",
  lead:     "recover",
  recover:  "strategy",
  strategy: "change",
};
export const CATEGORY_TO_ARC: Record<CategoryName, ThemeSlug | null> = {
  decide:   "decide",
  lead:     "lead",
  recover:  "recover",
  strategy: "strategy",
  change:   "change",
  philosophy: null,
};
