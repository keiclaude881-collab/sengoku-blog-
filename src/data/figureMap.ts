// /map ページ用：全記事の偉人を「思想」「時代」「テーマ」でグループ化するためのデータ。
// テーマのグルーピングは src/data/journeys.ts のカテゴリ×ステージ構造を再利用する。

export interface EraGroup {
  key: string;
  label: string;
  period: string;
}

export interface ThoughtGroup {
  key: string;
  label: string;
  tagline: string;
}

export const ERA_GROUPS: EraGroup[] = [
  { key: "ancient", label: "古代", period: "〜5世紀" },
  { key: "medieval", label: "中世・ルネサンス", period: "5〜16世紀" },
  { key: "sengoku", label: "戦国・安土桃山", period: "戦国時代の日本" },
  { key: "edo", label: "江戸時代", period: "17〜19世紀前半の日本" },
  { key: "bakumatsu", label: "幕末・明治", period: "19世紀後半の日本" },
  { key: "modern", label: "近世〜近代", period: "18〜20世紀の欧米" },
];

export const THOUGHT_GROUPS: ThoughtGroup[] = [
  { key: "self-control", label: "克己・感情コントロール", tagline: "感情に振り回されないための思想" },
  { key: "own-standard", label: "自分の基準・独立自尊", tagline: "他人と比べず、自分の軸で生きる思想" },
  { key: "information-strategy", label: "情報・戦略思考", tagline: "情報と戦略で勝ち筋を見抜く思想" },
  { key: "people-development", label: "人を動かす・育てる", tagline: "人を動かし、育て、託す思想" },
  { key: "saving-discipline", label: "蓄財・規律の経済思想", tagline: "貯めて増やす規律を仕組み化する思想" },
  { key: "morals-giving", label: "道徳と利益・与える経済思想", tagline: "利益と道徳を両立させ、与える思想" },
];

export interface FigureMeta {
  name: string;
  era: string;
  thought: string;
}

export const FIGURES: Record<string, FigureMeta> = {
  "aristotle-habit-character": { name: "アリストテレス", era: "ancient", thought: "own-standard" },
  "babylon-pay-yourself-first": { name: "バビロンの大富豪", era: "ancient", thought: "saving-discipline" },
  "caesar-speed-decision": { name: "カエサル", era: "ancient", thought: "self-control" },
  "carnegie-wealth-philosophy": { name: "アンドリュー・カーネギー", era: "modern", thought: "morals-giving" },
  "churchill-adversity-leadership": { name: "チャーチル", era: "modern", thought: "people-development" },
  "cleopatra-language-career": { name: "クレオパトラ", era: "ancient", thought: "information-strategy" },
  "coco-chanel-be-different": { name: "ココ・シャネル", era: "modern", thought: "own-standard" },
  "confucius-self-investment": { name: "孔子", era: "ancient", thought: "own-standard" },
  "dale-carnegie-workplace-relationships": { name: "デール・カーネギー", era: "modern", thought: "self-control" },
  "date-masamune-personal-branding": { name: "伊達政宗", era: "sengoku", thought: "own-standard" },
  "davinci-multiple-income-streams": { name: "ダ・ヴィンチ", era: "medieval", thought: "people-development" },
  "dogen-present-moment": { name: "道元", era: "medieval", thought: "self-control" },
  "edison-reskilling-too-late": { name: "エジソン", era: "modern", thought: "people-development" },
  "einstein-compound-interest-ideco": { name: "アインシュタイン", era: "modern", thought: "saving-discipline" },
  "eleanor-roosevelt-inferiority-consent": { name: "エレノア・ルーズベルト", era: "modern", thought: "self-control" },
  "epictetus-freedom-mindset": { name: "エピクテトス", era: "ancient", thought: "self-control" },
  "estee-lauder-give-first": { name: "エスティ・ローダー", era: "modern", thought: "morals-giving" },
  "franklin-money-habits": { name: "フランクリン", era: "modern", thought: "saving-discipline" },
  "fukuzawa-independence-mindset": { name: "福沢諭吉", era: "bakumatsu", thought: "own-standard" },
  "genghis-khan-information-strategy": { name: "チンギス・ハン", era: "medieval", thought: "information-strategy" },
  "grace-hopper-ask-forgiveness": { name: "グレース・ホッパー", era: "modern", thought: "information-strategy" },
  "graham-margin-of-safety": { name: "ベンジャミン・グラハム", era: "modern", thought: "information-strategy" },
  "hetty-green-cash-strategy": { name: "ヘティ・グリーン", era: "modern", thought: "saving-discipline" },
  "hirooka-asako-protect-vs-grow": { name: "広岡浅子", era: "bakumatsu", thought: "saving-discipline" },
  "hokusai-growth-no-limit": { name: "葛飾北斎", era: "edo", thought: "own-standard" },
  "honda-seiroku-money-allocation": { name: "本多静六", era: "bakumatsu", thought: "saving-discipline" },
  "ino-tadataka-second-career": { name: "伊能忠敬", era: "edo", thought: "people-development" },
  "iwasaki-yataro-concentration-strategy": { name: "岩崎弥太郎", era: "bakumatsu", thought: "information-strategy" },
  "kamo-no-chomei-dont-want-promotion": { name: "鴨長明", era: "medieval", thought: "own-standard" },
  "katsu-kaishu-career-change-timing": { name: "勝海舟", era: "bakumatsu", thought: "people-development" },
  "kuroda-kanbei-win-without-fighting": { name: "黒田官兵衛", era: "sengoku", thought: "information-strategy" },
  "laozi-water-philosophy": { name: "老子", era: "ancient", thought: "own-standard" },
  "lincoln-resilience-career": { name: "リンカーン", era: "modern", thought: "people-development" },
  "machiavelli-sidehustle": { name: "マキャヴェリ", era: "medieval", thought: "information-strategy" },
  "madam-cj-walker-self-investment": { name: "マダム・C・J・ウォーカー", era: "modern", thought: "morals-giving" },
  "mansa-musa-spending-power": { name: "マンサ・ムーサ", era: "medieval", thought: "saving-discipline" },
  "marco-polo-unknown-market": { name: "マルコ・ポーロ", era: "medieval", thought: "information-strategy" },
  "marcus-aurelius-morning-rehearsal": { name: "マルクス・アウレリウス", era: "ancient", thought: "self-control" },
  "marie-curie-understanding-fear": { name: "キュリー夫人", era: "modern", thought: "self-control" },
  "matsushita-konosuke-furusato-nozei": { name: "松下幸之助", era: "modern", thought: "saving-discipline" },
  "miyamoto-musashi-own-path": { name: "宮本武蔵", era: "sengoku", thought: "own-standard" },
  "mori-motonari-diversification": { name: "毛利元就", era: "sengoku", thought: "information-strategy" },
  "murasaki-shikibu-career-synergy": { name: "紫式部", era: "medieval", thought: "people-development" },
  "napoleon-focus-side-business": { name: "ナポレオン", era: "modern", thought: "information-strategy" },
  "nightingale-data-thinking": { name: "ナイチンゲール", era: "modern", thought: "self-control" },
  "ninomiya-sontoku-side-business-balance": { name: "二宮尊徳", era: "edo", thought: "people-development" },
  "oda-nobunaga-adapt-to-change": { name: "織田信長", era: "sengoku", thought: "own-standard" },
  "rockefeller-money-discipline": { name: "ロックフェラー", era: "modern", thought: "saving-discipline" },
  "rome-fiscal-collapse": { name: "古代ローマ", era: "ancient", thought: "saving-discipline" },
  "sakamoto-ryoma-risk-management": { name: "坂本龍馬", era: "bakumatsu", thought: "saving-discipline" },
  "sanada-yukimura-underdog-strategy": { name: "真田幸村", era: "sengoku", thought: "information-strategy" },
  "seneca-time-management": { name: "セネカ", era: "ancient", thought: "self-control" },
  "shibusawa-eiichi-morals-money": { name: "渋沢栄一", era: "bakumatsu", thought: "morals-giving" },
  "shibusawa-money-mindset": { name: "渋沢栄一", era: "bakumatsu", thought: "morals-giving" },
  "socrates-questioning-thinking": { name: "ソクラテス", era: "ancient", thought: "self-control" },
  "stoicism-index-investing": { name: "ストア哲学", era: "ancient", thought: "self-control" },
  "sunzi-investment-principles": { name: "孫子", era: "ancient", thought: "information-strategy" },
  "takeda-shingen-people-management": { name: "武田信玄", era: "sengoku", thought: "people-development" },
  "tokugawa-ieyasu-power-of-patience": { name: "徳川家康", era: "sengoku", thought: "self-control" },
  "toyoda-sakichi-systemization": { name: "豊田佐吉", era: "bakumatsu", thought: "people-development" },
  "toyotomi-hideyoshi-career-strategy": { name: "豊臣秀吉", era: "sengoku", thought: "people-development" },
  "uesugi-yozan-household-rebuild": { name: "上杉鷹山", era: "edo", thought: "saving-discipline" },
  "yamamoto-isoroku-people-development": { name: "山本五十六", era: "modern", thought: "people-development" },
  "yoshida-shoin-remaining-time": { name: "吉田松陰", era: "bakumatsu", thought: "own-standard" },
  "takahashi-korekiyo-recession-money": { name: "高橋是清", era: "modern", thought: "information-strategy" },
  "inamori-kazuo-work-equation": { name: "稲盛和夫", era: "modern", thought: "people-development" },
  "frankl-meaning-in-suffering": { name: "フランクル", era: "modern", thought: "self-control" },
};
