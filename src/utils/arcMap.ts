export type ArcSlug = "rekishi" | "gendai" | "monogatari";
export type CategoryName =
  | "battle" | "leader" | "strategy" | "whatif"
  | "business" | "sports"
  | "anime" | "movie" | "novel"
  | "books";

export const CATEGORY_TO_ARC: Record<CategoryName, ArcSlug | null> = {
  battle:   "rekishi",
  leader:   "rekishi",
  strategy: "rekishi",
  whatif:   "rekishi",
  business: "gendai",
  sports:   "gendai",
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
    description: "桶狭間、関ヶ原、ガウガメラ——追い詰められた人間が決断した瞬間の記録。武将・将軍・英傑たちの思考を、孫子の原則で読み解く。すべての物語はここから始まる。",
    color:       "#c0392b",
    colorBg:     "rgba(192, 57, 43, 0.08)",
    gradient:    "linear-gradient(135deg, #3d0a07 0%, #0d0d0d 100%)",
    categories:  ["battle", "leader", "strategy", "whatif"],
    deco:        "壱",
  },
  gendai: {
    chapter:     "第二章",
    title:       "現代への継承",
    slug:        "gendai",
    tagline:     "同じ原則が、今も世界を動かしている",
    description: "ジョブズ、ベゾス、トヨタ、グアルディオラ——2500年前の知恵を知らずに実践していた。第一章で読んだ原則が、現代でどう生きているかを追う。",
    color:       "#2563eb",
    colorBg:     "rgba(37, 99, 235, 0.08)",
    gradient:    "linear-gradient(135deg, #071a3d 0%, #0d0d0d 100%)",
    categories:  ["business", "sports"],
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

export const ARC_ORDER: ArcSlug[] = ["rekishi", "gendai", "monogatari"];

export const NEXT_ARC: Partial<Record<ArcSlug, ArcSlug>> = {
  rekishi:    "gendai",
  gendai:     "monogatari",
};

export const CAT_LABEL: Record<CategoryName, string> = {
  battle:   "合戦と戦略",
  leader:   "武将の思想",
  strategy: "兵法・知恵",
  whatif:   "歴史IF",
  business: "ビジネス戦略",
  sports:   "スポーツ戦略",
  anime:    "アニメの知恵",
  movie:    "映画の知恵",
  novel:    "小説・物語",
  books:    "書籍レビュー",
};
