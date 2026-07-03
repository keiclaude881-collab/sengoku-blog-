// 各記事の末尾に置く「次の扉」セクション用データ。
// 単なる関連記事ではなく、偉人同士の思想・時代・テーマのつながりを一文で示す。
// slug は src/content/posts/*.mdx のファイル名（拡張子なし）と一致させる。

export interface NextDoor {
  slug: string;
  hook: string;
}

export const NEXT_DOORS: Record<string, NextDoor[]> = {
  "aristotle-habit-character": [
    { slug: "hokusai-growth-no-limit", hook: "習慣が人格を作るとアリストテレスは説いた。その習慣を72歳まで積み重ね続けた男がいる。" },
    { slug: "tokugawa-ieyasu-power-of-patience", hook: "繰り返しが人格を作るという思想の先には、繰り返し待ち続けて天下を取った男がいる。" },
  ],
  "babylon-pay-yourself-first": [
    { slug: "rockefeller-money-discipline", hook: "「先取りで貯める」という古代の知恵を、10代から実践し続けた億万長者がいる。" },
    { slug: "honda-seiroku-money-allocation", hook: "貯め方を極めた先には、「貯めた金をどう使うか」まで考え抜いた日本人がいる。" },
  ],
  "caesar-speed-decision": [
    { slug: "oda-nobunaga-adapt-to-change", hook: "速さで決断したカエサルの先には、速さで時代を切り捨てた信長がいる。" },
    { slug: "marcus-aurelius-morning-rehearsal", hook: "即断する力の根には、感情に振り回されない朝の準備をしていた皇帝がいる。" },
  ],
  "carnegie-wealth-philosophy": [
    { slug: "shibusawa-eiichi-morals-money", hook: "富は使い切るために稼ぐと語ったカーネギーの先には、道徳と算盤を両立させた渋沢栄一がいる。" },
    { slug: "rockefeller-money-discipline", hook: "稼いだ金の哲学を持つ前には、稼ぎ方そのものを規律にした男がいる。" },
  ],
  "churchill-adversity-leadership": [
    { slug: "tokugawa-ieyasu-power-of-patience", hook: "逆境でこそ力を発揮したチャーチルの先には、逆境をひたすら耐え抜いた家康がいる。" },
    { slug: "takeda-shingen-people-management", hook: "一人で立ち向かったリーダーの先には、人を動かして立ち向かわせた武将がいる。" },
  ],
  "cleopatra-language-career": [
    { slug: "genghis-khan-information-strategy", hook: "相手の言語を学んだクレオパトラの先には、情報そのものを武器にしたチンギス・ハンがいる。" },
    { slug: "caesar-speed-decision", hook: "言葉で相手の心を掴んだ女王の隣には、決断の速さで歴史を作った男がいる。" },
  ],
  "coco-chanel-be-different": [
    { slug: "marco-polo-unknown-market", hook: "「違い」を武器にしたシャネルの先には、誰も知らない市場に飛び込んだ男がいる。" },
    { slug: "oda-nobunaga-adapt-to-change", hook: "同じであることをリスクと見たシャネルの先には、変化に適応し続けた信長がいる。" },
  ],
  "confucius-self-investment": [
    { slug: "madam-cj-walker-self-investment", hook: "学びの優先順位を説いた孔子の先には、種銭がなくても自分に投資した女性がいる。" },
    { slug: "hokusai-growth-no-limit", hook: "学び続けることを説いた孔子の答えの続きは、何歳からでも成長できると示した北斎が知っている。" },
  ],
  "dale-carnegie-workplace-relationships": [
    { slug: "kuroda-kanbei-win-without-fighting", hook: "人を動かす方法を説いたカーネギーの先には、戦わずに人を制した軍師がいる。" },
    { slug: "epictetus-freedom-mindset", hook: "人間関係に疲れたときの答えの続きは、他人の評価から自由になったエピクテトスが知っている。" },
  ],
  "date-masamune-personal-branding": [
    { slug: "sanada-yukimura-underdog-strategy", hook: "個性を武器にした政宗の先には、弱者の立場から強者に挑んだ幸村がいる。" },
    { slug: "murasaki-shikibu-career-synergy", hook: "独眼竜と呼ばれた個性の先には、自分の経験をそのまま作品にした紫式部がいる。" },
  ],
  "davinci-multiple-income-streams": [
    { slug: "ninomiya-sontoku-side-business-balance", hook: "スキルを掛け算したダ・ヴィンチの先には、本業と副業を両立させた二宮尊徳がいる。" },
    { slug: "toyoda-sakichi-systemization", hook: "複数の才能を活かしたダ・ヴィンチの先には、頑張らずに仕組みで成果を出した豊田佐吉がいる。" },
  ],
  "dogen-present-moment": [
    { slug: "seneca-time-management", hook: "今この瞬間に集中した道元の先には、人生の短さを説いたセネカがいる。" },
    { slug: "socrates-questioning-thinking", hook: "雑念を払った道元の答えの続きは、問い続けることを説いたソクラテスが知っている。" },
  ],
  "edison-reskilling-too-late": [
    { slug: "ino-tadataka-second-career", hook: "失敗を重ねながら学び直したエジソンの先には、50歳から学び直した伊能忠敬がいる。" },
    { slug: "grace-hopper-ask-forgiveness", hook: "今から遅いという不安への答えの続きは、許可を待たずに動いたグレース・ホッパーが知っている。" },
  ],
  "einstein-compound-interest-ideco": [
    { slug: "sunzi-investment-principles", hook: "複利を人類最大の発明と呼んだアインシュタインの先には、負けない投資を説いた孫子がいる。" },
    { slug: "babylon-pay-yourself-first", hook: "時間を味方にする発想の根には、先取りで貯めることを説いた古代の知恵がある。" },
  ],
  "eleanor-roosevelt-inferiority-consent": [
    { slug: "miyamoto-musashi-own-path", hook: "他人の同意なしに劣等感は生まれないと説いたルーズベルトの先には、他人と比べることをやめた宮本武蔵がいる。" },
    { slug: "epictetus-freedom-mindset", hook: "劣等感を手放す答えの続きは、奴隷の身分でも自由でいられたエピクテトスが知っている。" },
  ],
  "epictetus-freedom-mindset": [
    { slug: "marcus-aurelius-morning-rehearsal", hook: "制御できることだけに集中したエピクテトスの先には、その思想を実践した皇帝マルクス・アウレリウスがいる。" },
    { slug: "dogen-present-moment", hook: "心の自由を説いたエピクテトスの答えの続きは、只管打坐でその境地に至った道元が知っている。" },
  ],
  "estee-lauder-give-first": [
    { slug: "mansa-musa-spending-power", hook: "先に与えたエスティ・ローダーの先には、与えすぎて経済を崩しかけたマンサ・ムーサがいる。" },
    { slug: "machiavelli-sidehustle", hook: "広告費がない中で与え続けた発想の続きは、副業のリスク管理を説いたマキャヴェリが知っている。" },
  ],
  "franklin-money-habits": [
    { slug: "rockefeller-money-discipline", hook: "バフェットが尊敬したフランクリンの習慣の先には、収入の10%を守り続けたロックフェラーがいる。" },
    { slug: "sunzi-investment-principles", hook: "お金の習慣を極めた先には、負けないことを最優先にした孫子の投資思想がある。" },
  ],
  "fukuzawa-independence-mindset": [
    { slug: "oda-nobunaga-adapt-to-change", hook: "独立自尊を説いた福沢諭吉の先には、誰にも頼らず時代を変え続けた信長がいる。" },
    { slug: "epictetus-freedom-mindset", hook: "自分の足で立つという思想の続きは、何にも依存しない自由を説いたエピクテトスが知っている。" },
  ],
  "genghis-khan-information-strategy": [
    { slug: "ino-tadataka-second-career", hook: "情報を制した者が勝つと示したチンギス・ハンの先には、自ら歩いて日本中の情報を集めた伊能忠敬がいる。" },
    { slug: "lincoln-resilience-career", hook: "情報戦略を極めた先には、何度負けても情報を活かして立て直したリンカーンがいる。" },
  ],
  "grace-hopper-ask-forgiveness": [
    { slug: "toyoda-sakichi-systemization", hook: "許可を待たずに動いたホッパーの先には、頑張らずに仕組みで成果を出した豊田佐吉がいる。" },
    { slug: "ino-tadataka-second-career", hook: "前例がないことを恐れなかった答えの続きは、前例のない測量を成し遂げた伊能忠敬が知っている。" },
  ],
  "graham-margin-of-safety": [
    { slug: "mori-motonari-diversification", hook: "暴落に動じない安全余裕率を説いたグラハムの先には、三本の矢で分散の力を示した毛利元就がいる。" },
    { slug: "sunzi-investment-principles", hook: "安全を最優先する投資哲学の続きは、負けないことを兵法の核心に置いた孫子が知っている。" },
  ],
  "hetty-green-cash-strategy": [
    { slug: "uesugi-yozan-household-rebuild", hook: "現金を持つことを武器にしたヘティ・グリーンの先には、借金まみれの藩を倹約で立て直した上杉鷹山がいる。" },
    { slug: "rome-fiscal-collapse", hook: "倹約を極めた大富豪の対極には、倹約を忘れて崩壊した帝国の物語がある。" },
  ],
  "hirooka-asako-protect-vs-grow": [
    { slug: "sakamoto-ryoma-risk-management", hook: "「増やす」と「守る」を分けた広岡浅子の先には、リスクと逃げ道を同時に考えた坂本龍馬がいる。" },
    { slug: "mori-motonari-diversification", hook: "守りの発想を極めた先には、分散という仕組みでリスクを抑えた毛利元就がいる。" },
  ],
  "hokusai-growth-no-limit": [
    { slug: "ino-tadataka-second-career", hook: "何歳からでも成長できると示した北斎の先には、50歳から学び直し73歳で地図を完成させた伊能忠敬がいる。" },
    { slug: "yoshida-shoin-remaining-time", hook: "年齢を理由にしなかった北斎の答えの続きは、残り時間から逆算して生きた吉田松陰が知っている。" },
  ],
  "honda-seiroku-money-allocation": [
    { slug: "carnegie-wealth-philosophy", hook: "貯めて増やして使うことまで設計した本多静六の先には、富を使い切るために稼いだカーネギーがいる。" },
    { slug: "rockefeller-money-discipline", hook: "お金の優先順位を極めた答えの続きは、収入の10%という規律を守り続けたロックフェラーが知っている。" },
  ],
  "ino-tadataka-second-career": [
    { slug: "katsu-kaishu-career-change-timing", hook: "50歳から第二のキャリアを始めた伊能忠敬の先には、組織の終わりを見極めて場所を変えた勝海舟がいる。" },
    { slug: "hokusai-growth-no-limit", hook: "「もう遅い」を覆した答えの続きは、何歳からでも成長できると説いた北斎が知っている。" },
  ],
  "iwasaki-yataro-concentration-strategy": [
    { slug: "napoleon-focus-side-business", hook: "一点突破で財閥を築いた岩崎弥太郎の先には、選択と集中で成果を出したナポレオンがいる。" },
    { slug: "sakamoto-ryoma-risk-management", hook: "船3隻から始めた集中投資の答えの続きは、リスクと逃げ道を同時に用意した坂本龍馬が知っている。" },
  ],
  "kamo-no-chomei-dont-want-promotion": [
    { slug: "katsu-kaishu-career-change-timing", hook: "役職から降りる生き方を選んだ鴨長明の先には、組織を見極めて場所を変えた勝海舟がいる。" },
    { slug: "dale-carnegie-workplace-relationships", hook: "出世を望まない答えの続きは、人間関係に疲れたときの考え方を説いたデール・カーネギーが知っている。" },
  ],
  "katsu-kaishu-career-change-timing": [
    { slug: "ino-tadataka-second-career", hook: "組織の終わりを見極めた勝海舟の先には、本業引退後に本当の仕事を始めた伊能忠敬がいる。" },
    { slug: "kuroda-kanbei-win-without-fighting", hook: "恨まれずに次へ進んだ海舟の答えの続きは、戦わずに対立を制した黒田官兵衛が知っている。" },
  ],
  "kuroda-kanbei-win-without-fighting": [
    { slug: "takeda-shingen-people-management", hook: "戦わずに制した黒田官兵衛の先には、人を動かして自ら戦わせた武田信玄がいる。" },
    { slug: "lincoln-resilience-career", hook: "交渉で対立を制した答えの続きは、何度失敗してもキャリアを立て直したリンカーンが知っている。" },
  ],
  "laozi-water-philosophy": [
    { slug: "tokugawa-ieyasu-power-of-patience", hook: "争わずに結果を出す水のような思想を説いた老子の先には、争わず耐え続けて天下を取った家康がいる。" },
    { slug: "miyamoto-musashi-own-path", hook: "柔弱が剛強に勝るという老子の答えの続きは、他人と比べず自分の基準で強くなった宮本武蔵が知っている。" },
  ],
  "lincoln-resilience-career": [
    { slug: "grace-hopper-ask-forgiveness", hook: "何度失敗しても立て直したリンカーンの先には、前例がないことを恐れず動いたグレース・ホッパーがいる。" },
    { slug: "kuroda-kanbei-win-without-fighting", hook: "逆境を乗り越えた答えの続きは、対立そのものを戦わずに制した黒田官兵衛が知っている。" },
  ],
  "machiavelli-sidehustle": [
    { slug: "napoleon-focus-side-business", hook: "副業で失敗しない原則を説いたマキャヴェリの先には、絞り込み不足を解消したナポレオンの選択と集中がある。" },
    { slug: "davinci-multiple-income-streams", hook: "リスク管理を極めた副業論の続きは、スキルの掛け算で市場価値を上げたダ・ヴィンチが知っている。" },
  ],
  "madam-cj-walker-self-investment": [
    { slug: "davinci-multiple-income-streams", hook: "種銭がなくても自分に投資したウォーカーの先には、スキルの掛け算で市場価値を上げたダ・ヴィンチがいる。" },
    { slug: "confucius-self-investment", hook: "自己投資という発想の根には、何から学ぶべきかの優先順位を説いた孔子の論語がある。" },
  ],
  "mansa-musa-spending-power": [
    { slug: "hetty-green-cash-strategy", hook: "与えすぎて経済を崩しかけたマンサ・ムーサの対極には、現金を持ち続けたヘティ・グリーンがいる。" },
    { slug: "babylon-pay-yourself-first", hook: "臨時収入の使い方を誤った教訓の続きは、先取りで貯める原則を説いたバビロンの大富豪が知っている。" },
  ],
  "marco-polo-unknown-market": [
    { slug: "genghis-khan-information-strategy", hook: "未知の市場へ飛び込んだマルコ・ポーロの先には、情報そのものを武器にしたチンギス・ハンがいる。" },
    { slug: "coco-chanel-be-different", hook: "誰も知らない場所へ向かった答えの続きは、みんなと同じであることをリスクと見たシャネルが知っている。" },
  ],
  "marcus-aurelius-morning-rehearsal": [
    { slug: "socrates-questioning-thinking", hook: "感情に振り回されない準備をした皇帝の先には、問い続けることで思考を鍛えたソクラテスがいる。" },
    { slug: "nightingale-data-thinking", hook: "感情より理性を選んだ皇帝の答えの続きは、データで感情に打ち勝ったナイチンゲールが知っている。" },
  ],
  "marie-curie-understanding-fear": [
    { slug: "stoicism-index-investing", hook: "理解が不安に勝ると示したキュリー夫人の先には、感情に流されず投資を続けるストア哲学がある。" },
    { slug: "epictetus-freedom-mindset", hook: "「なんとなく怖い」を解いた答えの続きは、制御できることだけに集中したエピクテトスが知っている。" },
  ],
  "matsushita-konosuke-furusato-nozei": [
    { slug: "shibusawa-eiichi-morals-money", hook: "水道哲学で「公平な分配」を説いた松下幸之助の先には、道徳と算盤を両立させた渋沢栄一がいる。" },
    { slug: "einstein-compound-interest-ideco", hook: "制度を使い切る発想の続きは、時間を味方にする複利の力を説いたアインシュタインが知っている。" },
  ],
  "miyamoto-musashi-own-path": [
    { slug: "eleanor-roosevelt-inferiority-consent", hook: "他人と比べることをやめた宮本武蔵の先には、劣等感は自分の同意なしに生まれないと説いたルーズベルトがいる。" },
    { slug: "aristotle-habit-character", hook: "自分の基準を作った武蔵の答えの続きは、習慣の繰り返しが人格を作ると説いたアリストテレスが知っている。" },
  ],
  "mori-motonari-diversification": [
    { slug: "iwasaki-yataro-concentration-strategy", hook: "三本の矢で分散を説いた毛利元就の対極には、一点突破で財閥を築いた岩崎弥太郎がいる。" },
    { slug: "hirooka-asako-protect-vs-grow", hook: "リスクを抑える分散の発想の続きは、増やすと守るを分けて考えた広岡浅子が知っている。" },
  ],
  "murasaki-shikibu-career-synergy": [
    { slug: "davinci-multiple-income-streams", hook: "仕事の経験を作品にした紫式部の先には、スキルの掛け算で複業を作ったダ・ヴィンチがいる。" },
    { slug: "ino-tadataka-second-career", hook: "本業を土台にした生き方の答えの続きは、商人経験を測量事業に転用した伊能忠敬が知っている。" },
  ],
  "napoleon-focus-side-business": [
    { slug: "ninomiya-sontoku-side-business-balance", hook: "絞り込みで成果を出したナポレオンの先には、本業と副業を無理なく両立させた二宮尊徳がいる。" },
    { slug: "seneca-time-management", hook: "集中する力を極めた答えの続きは、人生は浪費されているだけだと説いたセネカの時間管理が知っている。" },
  ],
  "nightingale-data-thinking": [
    { slug: "socrates-questioning-thinking", hook: "データで感情に打ち勝ったナイチンゲールの先には、問い続けることで思考を鍛えたソクラテスがいる。" },
    { slug: "stoicism-index-investing", hook: "客観的な判断を貫いた答えの続きは、感情に流されず投資を続けるストア哲学が知っている。" },
  ],
  "ninomiya-sontoku-side-business-balance": [
    { slug: "seneca-time-management", hook: "本業と副業を両立させた二宮尊徳の先には、人生の浪費を戒めたセネカの時間管理がある。" },
    { slug: "machiavelli-sidehustle", hook: "無理のない両立を説いた答えの続きは、副業で失敗しない原則を説いたマキャヴェリが知っている。" },
  ],
  "oda-nobunaga-adapt-to-change": [
    { slug: "toyoda-sakichi-systemization", hook: "「捨てる」ことで時代に適応した信長の先には、仕組みで成果を出した豊田佐吉がいる。" },
    { slug: "date-masamune-personal-branding", hook: "変化を恐れなかった信長の答えの続きは、個性を武器にした伊達政宗が知っている。" },
  ],
  "rockefeller-money-discipline": [
    { slug: "franklin-money-habits", hook: "10代から収入の10%を守ったロックフェラーの先には、バフェットが尊敬したフランクリンのお金の習慣がある。" },
    { slug: "honda-seiroku-money-allocation", hook: "収入管理を極めた答えの続きは、貯金・投資・消費の優先順位まで設計した本多静六が知っている。" },
  ],
  "rome-fiscal-collapse": [
    { slug: "uesugi-yozan-household-rebuild", hook: "家計崩壊の構造を示したローマ帝国の対極には、借金まみれの藩を倹約で立て直した上杉鷹山がいる。" },
    { slug: "graham-margin-of-safety", hook: "崩壊した帝国の教訓の続きは、暴落に動じない安全余裕率を説いたグラハムが知っている。" },
  ],
  "sakamoto-ryoma-risk-management": [
    { slug: "mori-motonari-diversification", hook: "逃げ道を用意した坂本龍馬の先には、三本の矢で分散の力を説いた毛利元就がいる。" },
    { slug: "hetty-green-cash-strategy", hook: "リスクをとる前提を整えた答えの続きは、現金を持つことを武器にしたヘティ・グリーンが知っている。" },
  ],
  "sanada-yukimura-underdog-strategy": [
    { slug: "date-masamune-personal-branding", hook: "弱者の戦略で強者に挑んだ幸村の先には、個性を武器に独自の地位を築いた伊達政宗がいる。" },
    { slug: "napoleon-focus-side-business", hook: "不利な状況で勝つ答えの続きは、選択と集中で成果を出したナポレオンが知っている。" },
  ],
  "seneca-time-management": [
    { slug: "yoshida-shoin-remaining-time", hook: "人生は浪費されているだけだと説いたセネカの先には、残り時間から逆算して生きた吉田松陰がいる。" },
    { slug: "marcus-aurelius-morning-rehearsal", hook: "時間管理の本質を説いた答えの続きは、感情に振り回されない朝を過ごした皇帝マルクス・アウレリウスが知っている。" },
  ],
  "shibusawa-eiichi-morals-money": [
    { slug: "hirooka-asako-protect-vs-grow", hook: "道徳と算盤を両立させた渋沢栄一の先には、増やすと守るを分けて考えた広岡浅子がいる。" },
    { slug: "mori-motonari-diversification", hook: "独占を避け産業を成熟させた答えの続きは、三本の矢で分散の力を説いた毛利元就が知っている。" },
  ],
  "shibusawa-money-mindset": [
    { slug: "mansa-musa-spending-power", hook: "お金への罪悪感を手放した渋沢栄一の先には、臨時収入をどう使うべきか考えたマンサ・ムーサがいる。" },
    { slug: "madam-cj-walker-self-investment", hook: "後ろめたさを乗り越えた答えの続きは、種銭がなくても自分に投資したウォーカーが知っている。" },
  ],
  "socrates-questioning-thinking": [
    { slug: "nightingale-data-thinking", hook: "問い続けることを説いたソクラテスの先には、データで感情に打ち勝ったナイチンゲールがいる。" },
    { slug: "aristotle-habit-character", hook: "「無知の知」を説いた答えの続きは、習慣の繰り返しが人格を作ると説いた弟子筋アリストテレスが知っている。" },
  ],
  "stoicism-index-investing": [
    { slug: "graham-margin-of-safety", hook: "感情に流されず投資を続けるストア哲学の先には、暴落に動じない安全余裕率を説いたグラハムがいる。" },
    { slug: "marcus-aurelius-morning-rehearsal", hook: "投資メンタルを鍛える発想の根には、感情に振り回されない朝を過ごした皇帝の思想がある。" },
  ],
  "sunzi-investment-principles": [
    { slug: "graham-margin-of-safety", hook: "負けないことを最優先にした孫子の先には、安全余裕率という同じ思想を投資に応用したグラハムがいる。" },
    { slug: "hetty-green-cash-strategy", hook: "守りを説いた孫子の答えの続きは、現金を持ち続けることで守りを徹底したヘティ・グリーンが知っている。" },
  ],
  "takeda-shingen-people-management": [
    { slug: "yamamoto-isoroku-people-development", hook: "部下が自分から動くチームを作った信玄の先には、「やってみせ、言って聞かせて」育てた山本五十六がいる。" },
    { slug: "dale-carnegie-workplace-relationships", hook: "人を動かす組織論の答えの続きは、人を動かす技術そのものを説いたデール・カーネギーが知っている。" },
  ],
  "tokugawa-ieyasu-power-of-patience": [
    { slug: "sanada-yukimura-underdog-strategy", hook: "焦らず待ち続けた家康の隣には、不利な状況で果敢に攻めた真田幸村がいる。" },
    { slug: "ino-tadataka-second-career", hook: "待つ力を鍛えた家康の答えの続きは、50歳まで待ってから本当の仕事を始めた伊能忠敬が知っている。" },
  ],
  "toyoda-sakichi-systemization": [
    { slug: "toyotomi-hideyoshi-career-strategy", hook: "頑張りに頼らず仕組みで成果を出した豊田佐吉の先には、出世の仕組みそのものを見抜いた豊臣秀吉がいる。" },
    { slug: "napoleon-focus-side-business", hook: "属人化を解消した答えの続きは、絞り込みで成果を出したナポレオンの選択と集中が知っている。" },
  ],
  "toyotomi-hideyoshi-career-strategy": [
    { slug: "yamamoto-isoroku-people-development", hook: "信頼を積み上げて出世した秀吉の先には、部下を育てることに信頼を積み上げた山本五十六がいる。" },
    { slug: "date-masamune-personal-branding", hook: "出世の仕組みを見抜いた答えの続きは、個性を武器に独自の地位を築いた伊達政宗が知っている。" },
  ],
  "uesugi-yozan-household-rebuild": [
    { slug: "ninomiya-sontoku-side-business-balance", hook: "借金まみれの藩を立て直した上杉鷹山の先には、同じ報徳思想で本業と副業を両立させた二宮尊徳がいる。" },
    { slug: "babylon-pay-yourself-first", hook: "家計再建の3ステップの根には、先取りで貯めるという古代から続く原則がある。" },
  ],
  "yamamoto-isoroku-people-development": [
    { slug: "takeda-shingen-people-management", hook: "「やってみせ、言って聞かせて」育てた山本五十六の先には、部下が自分から動く組織を作った武田信玄がいる。" },
    { slug: "kuroda-kanbei-win-without-fighting", hook: "育てることに徹した答えの続きは、戦わずに人を制した黒田官兵衛が知っている。" },
  ],
  "yoshida-shoin-remaining-time": [
    { slug: "seneca-time-management", hook: "残り時間から逆算して生きた吉田松陰の先には、人生は浪費されているだけだと説いたセネカがいる。" },
    { slug: "yamamoto-isoroku-people-development", hook: "限られた時間で多くの弟子を育てた松陰の答えの続きは、部下を育てる4ステップを説いた山本五十六が知っている。" },
  ],
  "takahashi-korekiyo-recession-money": [
    { slug: "hetty-green-cash-strategy", hook: "不況の嵐でマストを守れと説いた高橋是清の先には、現金を最大の武器にしたヘティ・グリーンがいる。" },
    { slug: "uesugi-yozan-household-rebuild", hook: "家計防衛の発想の続きは、借金まみれの藩を倹約と仕組みで立て直した上杉鷹山が知っている。" },
  ],
  "inamori-kazuo-work-equation": [
    { slug: "yamamoto-isoroku-people-development", hook: "「考え方 × 熱意 × 能力」を説いた稲盛の先には、人を育てる4つのステップを体現した山本五十六がいる。" },
    { slug: "shibusawa-eiichi-morals-money", hook: "仕事の哲学を極めた答えの続きは、道徳と算盤を両立させ経済と倫理は矛盾しないと示した渋沢栄一が知っている。" },
  ],
  "frankl-meaning-in-suffering": [
    { slug: "epictetus-freedom-mindset", hook: "思考の最後の自由を発見したフランクルの先には、奴隷の身分でも内なる自由を持ち続けたエピクテトスがいる。" },
    { slug: "seneca-time-management", hook: "意味を持って生きることを説いたフランクルの答えの続きは、人生の時間を無駄にするなと説いたセネカが知っている。" },
  ],
  "takeda-shingen-if-he-survived": [
    { slug: "sunzi-investment-principles", hook: "「もしも」を先に想定した信玄の発想の根には、先に勝つ態勢を整えてから戦えと説いた孫子がいる。" },
    { slug: "tokugawa-ieyasu-power-of-patience", hook: "もしも思考で戦略を練った信玄の対極には、焦らず待つことで最後に天下を取った家康がいる。" },
  ],
  "napoleon-russia-campaign-failure": [
    { slug: "epictetus-freedom-mindset", hook: "過信で失敗したナポレオンの先には、制御できることだけに集中する哲学で自由を保ったエピクテトスがいる。" },
    { slug: "tokugawa-ieyasu-power-of-patience", hook: "速く動きすぎた天才の対極には、焦らず待ち続けることで信長・秀吉の後に天下を取った家康がいる。" },
  ],
  "oda-nobunaga-1570-reversal-strategy": [
    { slug: "lincoln-resilience-career", hook: "包囲網の中で逆転した信長の先には、何度も失敗してもキャリアを立て直したリンカーンがいる。" },
    { slug: "sanada-yukimura-underdog-strategy", hook: "逆境での逆転戦略の答えの続きは、圧倒的な不利の中から強者に挑んだ真田幸村が知っている。" },
  ],
};
