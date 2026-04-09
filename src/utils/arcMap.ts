export type ArcSlug = "rekishi" | "senryaku" | "monogatari";
export type CategoryName =
  | "battle" | "leader" | "world"
  | "strategy" | "whatif"
  | "anime" | "movie" | "novel"
  | "books";

export const CATEGORY_TO_ARC: Record<CategoryName, ArcSlug | null> = {
  battle:   "rekishi",
  leader:   "rekishi",
  world:    "rekishi",
  strategy: "senryaku",
  whatif:   "senryaku",
  anime:    "monogatari",
  movie:    "monogatari",
  novel:    "monogatari",
  books:    null,
};

export interface ArcInfo {
  chapter:     string;
  title:       string;
  slug:        ArcSlug;
  tagline:     string;
  description: string;
  color:       string;
  colorBg:     string;
  gradient:    string;
  categories:  CategoryName[];
  deco:        string;
}

export const ARC_INFO: Record<ArcSlug, ArcInfo> = {
  rekishi: {
    chapter:     "第一章",
    title:       "史実の決断",
    slug:        "rekishi",
    tagline:     "歴史の現場で、何が決まったか",
    description: "桶狭間、関ヶ原、ガウガメラ——追い詰められた人間が決断した瞬間の記録。武将・将軍・英傑たちの思考を読み解く。すべての物語はここから始まる。",
    color:       "#c0392b",
    colorBg:     "rgba(192, 57, 43, 0.08)",
    gradient:    "linear-gradient(135deg, #3d0a07 0%, #0d0d0d 100%)",
    categories:  ["battle", "leader", "world"],
    deco:        "壱",
  },
  senryaku: {
    chapter:     "第二章",
    title:       "戦略と思想",
    slug:        "senryaku",
    tagline:     "2500年前の問いが、今も答えを持っている",
    description: "孫子、マキャベリ、クラウゼヴィッツ——時代を超えて生き残った戦略思想の核心を読む。歴史IFで検証し、兵法の原則を現代の問いに接続する。",
    color:       "#2563eb",
    colorBg:     "rgba(37, 99, 235, 0.08)",
    gradient:    "linear-gradient(135deg, #071a3d 0%, #0d0d0d 100%)",
    categories:  ["strategy", "whatif"],
    deco:        "弐",
  },
  monogatari: {
    chapter:     "第三章",
    title:       "物語が映す真実",
    slug:        "monogatari",
    tagline:     "スクリーンの向こうに、本質が見える",
    description: "エルウィン、マキシマス、七人の侍——物語の登場人物たちは歴史の英傑と同じ構造の選択をしている。フィクションに宿る普遍の原則を読み解く。",
    color:       "#d4a017",
    colorBg:     "rgba(212, 160, 23, 0.08)",
    gradient:    "linear-gradient(135deg, #2a1a00 0%, #0d0d0d 100%)",
    categories:  ["anime", "movie", "novel"],
    deco:        "参",
  },
};

export const ARC_ORDER: ArcSlug[] = ["rekishi", "senryaku", "monogatari"];

export const NEXT_ARC: Partial<Record<ArcSlug, ArcSlug>> = {
  rekishi:   "senryaku",
  senryaku:  "monogatari",
};

export const CAT_LABEL: Record<CategoryName, string> = {
  battle:   "合戦と戦略",
  leader:   "武将の思想",
  world:    "世界史の決断",
  strategy: "兵法・戦略思想",
  whatif:   "歴史のIF",
  anime:    "アニメの知恵",
  movie:    "映画の知恵",
  novel:    "小説・物語",
  books:    "書籍レビュー",
};
