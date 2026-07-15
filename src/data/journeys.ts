// カテゴリページを「旅程表」として描画するための、読む順番つきステージ定義。
// 各カテゴリは4段階。slugは src/content/posts/*.mdx のファイル名（拡張子なし）と一致させる。

export interface JourneyStage {
  step: number;
  title: string;
  lead: string;
  slugs: string[];
}

export interface Journey {
  intro: string;
  stages: JourneyStage[];
}

export const JOURNEYS: Record<"money" | "career" | "mindset", Journey> = {
  career: {
    intro: "「仕事・副業」の記事は、思いつきで並んでいるわけではない。今の自分を知り、壁にぶつかり、突破し、極める——この4段階を、偉人たちは順番に歩いてきた。",
    stages: [
      {
        step: 1,
        title: "今の自分を知る",
        lead: "自分の強み・立ち位置・本当にやりたいことを把握する段階。",
        slugs: [
          "jobs-connecting-the-dots",
          "drucker-self-management-career",
          "date-masamune-personal-branding",
          "coco-chanel-be-different",
          "cleopatra-language-career",
          "murasaki-shikibu-career-synergy",
        ],
      },
      {
        step: 2,
        title: "壁に当たる",
        lead: "逆境・対立・転職の迷い——前に進めなくなる段階。",
        slugs: [
          "churchill-adversity-leadership",
          "lincoln-resilience-career",
          "kuroda-kanbei-win-without-fighting",
          "sanada-yukimura-underdog-strategy",
          "katsu-kaishu-career-change-timing",
          "edison-reskilling-too-late",
          "oda-nobunaga-1570-reversal-strategy",
          "hannibal-environment-design-career",
        ],
      },
      {
        step: 3,
        title: "突破する",
        lead: "情報・行動・戦略を使って、壁を越えて動き出す段階。",
        slugs: [
          "grace-hopper-ask-forgiveness",
          "kitasato-shibasaburo-own-research",
          "genghis-khan-information-strategy",
          "marco-polo-unknown-market",
          "napoleon-focus-side-business",
          "machiavelli-sidehustle",
          "ninomiya-sontoku-side-business-balance",
          "davinci-multiple-income-streams",
          "toyotomi-hideyoshi-career-strategy",
          "ford-model-t-focus-strategy",
          "alexander-strategic-learning-career",
        ],
      },
      {
        step: 4,
        title: "極める",
        lead: "人を育て、仕組みを作り、次のキャリアへ進む段階。",
        slugs: [
          "takeda-shingen-people-management",
          "yamamoto-isoroku-people-development",
          "toyoda-sakichi-systemization",
          "ino-tadataka-second-career",
          "inamori-kazuo-work-equation",
          "zhuge-liang-manager-isolation",
        ],
      },
    ],
  },
  money: {
    intro: "お金の記事も、読む順番に意味がある。お金と向き合い、貯める仕組みを作り、増やし、最後に使う——偉人たちが辿った順番のままに並べた。",
    stages: [
      {
        step: 1,
        title: "お金と向き合う",
        lead: "罪悪感や思い込みを外し、今の自分の家計と向き合う段階。",
        slugs: [
          "adam-smith-wealth-of-nations",
          "oda-nobunaga-rakuichi-money",
          "shibusawa-money-mindset",
          "rome-fiscal-collapse",
          "madam-cj-walker-self-investment",
          "shibusawa-eiichi-morals-money",
          "rockefeller-money-discipline",
        ],
      },
      {
        step: 2,
        title: "貯める仕組みを作る",
        lead: "意志力に頼らず、自動的にお金が残る仕組みを設計する段階。",
        slugs: [
          "babylon-pay-yourself-first",
          "franklin-money-habits",
          "honda-seiroku-money-allocation",
          "tokugawa-ieyasu-money-defense",
          "matsushita-konosuke-furusato-nozei",
          "uesugi-yozan-household-rebuild",
          "hirooka-asako-protect-vs-grow",
        ],
      },
      {
        step: 3,
        title: "増やす・リスクを管理する",
        lead: "貯めたお金を投資に回し、リスクと向き合いながら増やす段階。",
        slugs: [
          "buffett-investment-philosophy",
          "peter-lynch-everyday-investing-money",
          "jp-morgan-crisis-capital",
          "mori-motonari-diversification",
          "sunzi-investment-principles",
          "graham-margin-of-safety",
          "einstein-compound-interest-ideco",
          "hetty-green-cash-strategy",
          "sakamoto-ryoma-risk-management",
          "iwasaki-yataro-concentration-strategy",
          "rothschild-zero-to-wealth",
          "newton-south-sea-bubble",
        ],
      },
      {
        step: 4,
        title: "使う・活かす",
        lead: "増やしたお金を、何のために使うのかを考える段階。",
        slugs: [
          "carnegie-wealth-philosophy",
          "estee-lauder-give-first",
          "bill-gates-giving-pledge",
          "mansa-musa-spending-power",
          "takahashi-korekiyo-recession-money",
        ],
      },
    ],
  },
  mindset: {
    intro: "思考法の記事は、心の状態が整っていく順番に並んでいる。自分を知り、感情と向き合い、判断力を鍛え、生き方の軸を持つ——その4段階だ。",
    stages: [
      {
        step: 1,
        title: "自分を知る・受け入れる",
        lead: "自分の現在地と可能性を、ありのまま認める段階。",
        slugs: [
          "adler-purpose-theory-mindset",
          "aristotle-habit-character",
          "confucius-self-investment",
          "eleanor-roosevelt-inferiority-consent",
          "hokusai-growth-no-limit",
          "miyamoto-musashi-own-path",
          "matsushita-konosuke-three-blessings",
        ],
      },
      {
        step: 2,
        title: "感情・不安と向き合う",
        lead: "怒り・不安・人間関係のストレスに振り回されなくなる段階。",
        slugs: [
          "dale-carnegie-workplace-relationships",
          "freud-unconscious-mindset",
          "jung-shadow-introvert-mindset",
          "dogen-present-moment",
          "epictetus-freedom-mindset",
          "marcus-aurelius-morning-rehearsal",
          "marie-curie-understanding-fear",
          "stoicism-index-investing",
          "napoleon-russia-campaign-failure",
        ],
      },
      {
        step: 3,
        title: "判断力・行動力を鍛える",
        lead: "迷わず決め、変化に適応し、淡々と動き続ける段階。",
        slugs: [
          "munger-mental-models",
          "plato-cave-allegory-thinking",
          "caesar-speed-decision",
          "nightingale-data-thinking",
          "darwin-change-your-mind",
          "oda-nobunaga-adapt-to-change",
          "seneca-time-management",
          "socrates-questioning-thinking",
          "tokugawa-ieyasu-power-of-patience",
          "takeda-shingen-if-he-survived",
          "inamori-kazuo-pure-motive",
        ],
      },
      {
        step: 4,
        title: "生き方の軸を持つ",
        lead: "何を大事にして生きるか、自分なりの哲学を持つ段階。",
        slugs: [
          "nietzsche-amor-fati-suffering",
          "schopenhauer-desire-mindset",
          "fukuzawa-independence-mindset",
          "kamo-no-chomei-dont-want-promotion",
          "laozi-water-philosophy",
          "yoshida-shoin-remaining-time",
          "frankl-meaning-in-suffering",
        ],
      },
    ],
  },
};
