export type ThemeSlug = "decide" | "lead" | "recover" | "strategy" | "change";
export type CategoryName =
  | "decide" | "lead" | "recover" | "strategy" | "change"
  | "anime" | "movie" | "novel"
  | "books";

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
    label:       "決断できない時",
    icon:        "⚔",
    tagline:     "正解がわからない夜に、誰もが迷ってきた",
    description: "桶狭間の信長も、テルモピュライのレオニダスも、「これで本当にいいのか」と思いながら決めた。迷いを抱えたまま前へ進んだ人たちの記録。",
    color:       "#3B8C6E",
    gradient:    "linear-gradient(135deg, #1E4A35 0%, #0d0d0d 100%)",
  },
  lead: {
    slug:        "lead",
    label:       "チームがうまくいかない時",
    icon:        "将",
    tagline:     "人を動かすことの難しさは、いつの時代も同じだ",
    description: "信長はなぜ部下に信頼されたのか。家康はどうやって組織を束ねたのか。リーダーの悩みへの答えが、歴史の武将たちの判断の中にある。",
    color:       "#3B8C6E",
    gradient:    "linear-gradient(135deg, #1E4A35 0%, #0d0d0d 100%)",
  },
  recover: {
    slug:        "recover",
    label:       "逆境・失敗した時",
    icon:        "復",
    tagline:     "敗北は終わりではなく、始まりだった",
    description: "三方ヶ原で大敗した家康も、ウォータールーで失脚したナポレオンも。どん底から立ち上がった人たちの共通点が見えてくる。",
    color:       "#3B8C6E",
    gradient:    "linear-gradient(135deg, #1E4A35 0%, #0d0d0d 100%)",
  },
  strategy: {
    slug:        "strategy",
    label:       "戦略・方向性に迷った時",
    icon:        "謀",
    tagline:     "2500年前の孫子が、今日の問いに答えている",
    description: "孫子、クラウゼヴィッツ、ハンニバル——時代を超えて生き残った戦略の核心。競合に勝てない、方向性が見えない、そんな時のための知恵。",
    color:       "#3B8C6E",
    gradient:    "linear-gradient(135deg, #1E4A35 0%, #0d0d0d 100%)",
  },
  change: {
    slug:        "change",
    label:       "自分を変えたい時",
    icon:        "変",
    tagline:     "変わった人は、みな「変わる前の夜」を持っていた",
    description: "桶狭間後の信長、長篠後の武将たち——現状を打ち破るために動いた人たちの覚悟と行動。「このままじゃいけない」という気持ちへの答え。",
    color:       "#3B8C6E",
    gradient:    "linear-gradient(135deg, #1E4A35 0%, #0d0d0d 100%)",
  },
};

export const THEME_ORDER: ThemeSlug[] = ["decide", "lead", "recover", "strategy", "change"];

export const CAT_LABEL: Record<CategoryName, string> = {
  decide:   "決断できない時",
  lead:     "チームがうまくいかない時",
  recover:  "逆境・失敗した時",
  strategy: "戦略・方向性に迷った時",
  change:   "自分を変えたい時",
  anime:    "アニメの知恵",
  movie:    "映画の知恵",
  novel:    "小説・物語",
  books:    "書籍レビュー",
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
  anime:    null,
  movie:    null,
  novel:    null,
  books:    null,
};
