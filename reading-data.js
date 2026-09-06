/* ===========================================================
 * reading-data.js  ——  阅读文章与题目数据（唯一需要更换的文件）
 * 纯静态数据文件，不依赖任何网络资源。
 *
 * 句子 ID 规则：P(段号)-S(句号)，例如 P1-S2 = 第 1 段第 2 句
 *
 * 【句子字段说明】
 *   id      唯一 ID（必填）
 *   text    英文原文（必填）
 *   tr      中文翻译（必填）
 *   words   重点词汇：{ w 词, pos 词性, cn 中文, tip 点拨 }
 *   phrases 固定搭配：{ p 搭配, cn 中文, tip 点拨 }
 *   grammar 语法点：  { name 名称, detail 说明 }
 *   analysis 长难句结构（仅真正的长难句才写，不要机械拆解简单句）：
 *           { trunk 主干, subject 主语, predicate 谓语, object 宾语,
 *             attributive 定语, adverbial 状语, clause 从句, nonfinite 非谓语结构,
 *             breakdown: [ { part 片段, role 作用 } ] }
 *
 * 【题目标注】
 *   locate.sids     = 定位句（黄色）
 *   evidence.sids   = 核心答案证据句（绿色）
 *   synonyms.pairs  = 同义替换词组（蓝色，尽量精确到短语）
 *           { left 题干/选项表达, leftSid 可高亮的句 ID, right 原文表达, rightSid 句 ID, op 关系符号 }
 * =========================================================== */

var READING_DATA = {
  title: "Velas Turtle Festival",
  meta: "词数：约 280　|　体裁：说明文　|　建议用时：6 分钟",

  /* =======================================================
   * 一、文章结构 / 主旨 / 写作目的
   * ======================================================= */
  structure: {
    mainIdea: "本文介绍了印度西海岸韦拉斯海龟节的由来与运作：环保人士在 21 世纪初意外发现榄蠵龟筑巢后，创办人乌帕德耶建立孵化室并设立节日以保护这一濒危物种；但节日也带来海滩污染等新问题，专家进一步指出数量恢复后保护力度可能反被削弱，警示人们勿因数量回升而掉以轻心。",
    purpose: "向读者介绍韦拉斯海龟节保护榄蠵龟的背景与方式，同时借专家之口提出警示：即使物种数量回升，栖息地保护仍不应被削弱，引导读者关注人与自然共处中的长期责任。",
    logic: "P1 提出节日场景 → P2 介绍节日的具体做法（收集蛋、孵化、放归）与高死亡率 → P3 交代节日创立的原因（环保人士曾以为榄蠵龟已消失，蛋壳的意外发现促使乌帕德耶建立孵化室并创办节日）→ P4 指出节日运营中的新问题（游客带来海滩污染）→ P5 借专家观点进一步警示（数量回升后保护可能被削弱）。属于说明文典型的“场景引入—运作说明—背景溯源—新问题—深度警示”结构。",
    outline: [
      { p: "P1", role: "场景引入，点出话题", detail: "描写每年四五月游客聚集中印度西海岸韦拉斯海龟节，志愿者邀请他们观看放归小榄蠵龟的情景，引出本文核心话题：节日如何保护榄蠵龟。" },
      { p: "P2", role: "运作方式 + 数据反差", detail: "说明志愿者的工作流程——收集蛋、孵化、放归；紧接着用“千分之一活到成年”的高死亡率凸显保护的必要性。" },
      { p: "P3", role: "背景溯源与创立动机", detail: "追述环保人士曾认为榄蠵龟已消失数十年，21 世纪初因意外发现蛋壳重燃希望；乌帕德耶帮助识别筑巢地、建立孵化室并创办节日，原因直指“保护筑巢地即保护物种”。" },
      { p: "P4", role: "提出新问题：游客污染", detail: "节日吸引游客的同时也带来海滩垃圾问题；节日经理帕特尔证实垃圾是问题，并付钱给村民保持海滩整洁。" },
      { p: "P5", role: "借专家观点深度警示", detail: "海龟专家桑克尔对比 20 年前与现在的巢穴数量，指出数量回升后反而面临“取消保护”的压力，举港口管理局为例印证这种担心。" }
    ],
    examTips: "主旨大意题：抓 P3 中“保护筑巢地即保护物种”以及 P5 中专家“数量恢复反而面临压力”的转折，把节日定位为“保护行动”而非“旅游活动”。段落作用题：P3 交代节日的由来，是回答“为何办节”的核心来源；P5 用专家观点收束全文，是主旨升华段。推理判断题：注意 Shanker 的“worry”是合理推测（数量恢复 → 保护削弱），需找体现“推—证”关系的证据句。"
  },

  /* =======================================================
   * 二、原文（逐句拆分 + 翻译 + 精读数据）
   * ======================================================= */
  paragraphs: [
    {
      id: "P1",
      sentences: [
        {
          id: "P1-S1",
          text: "Every April and May, tourists gather at daybreak for the Velas Turtle Festival on the western Indian coast, where volunteers invite visitors to watch them set baby olive ridleys, which are a species of turtle, free from a hatchery.",
          tr: "每年四月和五月，游客们会在黎明时分聚集到印度西海岸的韦拉斯海龟节，志愿者在那里邀请游客们观看他们把榄蠵龟幼崽——一种海龟——从孵化室中放归大海。",
          words: [
            { w: "festival", pos: "n.", cn: "节日", tip: "常见搭配：music festival 音乐节；the Spring Festival 春节" },
            { w: "gather", pos: "v.", cn: "聚集，集合", tip: "gather at + 地点 在某地聚集" },
            { w: "daybreak", pos: "n.", cn: "黎明，破晓", tip: "同义表达：dawn；与 daybreak 同义" },
            { w: "volunteer", pos: "n./v.", cn: "志愿者；自愿做", tip: "动词 volunteer to do 自愿做某事" },
            { w: "hatchery", pos: "n.", cn: "（鱼/家禽的）孵化室", tip: "来自动词 hatch（孵化）+ -ery 表地点" }
          ],
          phrases: [
            { p: "set ... free", cn: "释放，放……自由", tip: "set + 宾语 + 形容词/副词，宾语补足语结构" },
            { p: "a species of", cn: "一种……的物种", tip: "species 单复数同形：one species / many species" }
          ],
          grammar: [
            { name: "非限制性定语从句（where 引导）", detail: "where volunteers invite visitors to watch them set baby olive ridleys 修饰 the Velas Turtle Festival；where = at the festival。" },
            { name: "非限制性定语从句（which 引导）", detail: "which are a species of turtle 修饰 olive ridleys，对先行词做补充说明。" },
            { name: "感官动词复合宾语", detail: "watch them set ... free 中，set 是不带 to 的不定式，作 them 的宾语补足语。" }
          ],
          analysis: {
            trunk: "tourists gather at daybreak for the Velas Turtle Festival",
            subject: "tourists",
            predicate: "gather",
            object: "无（不及物动词 gather；介词短语 for the festival 作状语）",
            attributive: "无",
            adverbial: "Every April and May（频率/时间状语）；at daybreak（时间状语）；for the Velas Turtle Festival（目的状语）；on the western Indian coast（地点状语）",
            clause: "where volunteers invite visitors to watch them set baby olive ridleys, which are a species of turtle（非限制性定语从句，修饰 the Velas Turtle Festival）",
            nonfinite: "watch them set ... free（不带 to 的不定式复合宾语结构，set 作宾语补足语）",
            breakdown: [
              { part: "Every April and May", role: "时间状语，说明节日举办的时间" },
              { part: "tourists gather at daybreak", role: "主句主干：游客们在黎明聚集" },
              { part: "for the Velas Turtle Festival on the western Indian coast", role: "目的状语 + 地点状语，说明聚集的原因与地点" },
              { part: "where volunteers invite visitors to watch them set baby olive ridleys", role: "where 引导的非限制性定语从句，修饰 festival，说明节日上发生的事" },
              { part: "which are a species of turtle", role: "which 引导的非限制性定语从句，补充说明 olive ridleys" },
              { part: "free from a hatchery", role: "副词短语作状语，说明放归动作的结果——从孵化室回到自由" }
            ]
          }
        }
      ]
    },
    {
      id: "P2",
      sentences: [
        {
          id: "P2-S1",
          text: "The volunteers collect the eggs from turtle nests on the beach.",
          tr: "志愿者们在海滩上从海龟巢穴中收集蛋。",
          structure: "简单句（主谓宾 SVO）：主语 The volunteers + 谓语 collect + 宾语 the eggs；from turtle nests 是地点来源状语，on the beach 是后置地点状语。",
          words: [
            { w: "collect", pos: "v.", cn: "收集，采集", tip: "collect A from B 从 B 处采集 A" },
            { w: "nest", pos: "n.", cn: "鸟巢；本句指海龟的巢穴", tip: "动词 nest 意为“筑巢”" }
          ],
          phrases: [
            { p: "collect A from B", cn: "从 B 处采集 A", tip: "collect 后直接接宾语，from 引出来源" }
          ],
          grammar: [
            { name: "主谓宾结构", detail: "The volunteers（主语）+ collect（谓语）+ the eggs（宾语），结构最简明。" }
          ]
        },
        {
          id: "P2-S2",
          text: "The eggs are taken inside the hatchery.",
          tr: "这些蛋被带入孵化室。",
          structure: "简单句（被动结构）：主语 The eggs + 谓语 are taken + 地点状语 inside the hatchery；动作的执行者 by the volunteers 被省略。",
          grammar: [
            { name: "一般现在时被动语态", detail: "are taken 表明“蛋被带”这一被动关系；执行者（志愿者）上文已交代，省略以保持行文简洁。" }
          ]
        },
        {
          id: "P2-S3",
          text: "Once the babies hatch, they're set free.",
          tr: "一旦小龟孵化出来，它们就会被放归大海。",
          structure: "主从复合句：Once 引导时间状语从句；主句 they're set free 是被动句。",
          words: [
            { w: "hatch", pos: "v.", cn: "（蛋）孵化", tip: "不及物动词，强调“从蛋中出来”；hatchery（孵化室）来自动词 hatch + -ery" }
          ],
          phrases: [
            { p: "set free", cn: "放……自由", tip: "承接 P1-S1 的 set ... free，强调从人工环境回到自然" }
          ],
          grammar: [
            { name: "时间状语从句", detail: "Once the babies hatch 中 Once = as soon as，意为“一旦……就……" },
            { name: "被动语态", detail: "they're set free（= they are set free），动作承受者为 they。" }
          ]
        },
        {
          id: "P2-S4",
          text: "Even with all those efforts, most of them will be killed in the waters.",
          tr: "即使有这么多努力，它们中的大多数仍会在大海里被杀死。",
          structure: "简单句：句首 Even with all those efforts 是让步状语；主句 most of them will be killed in the waters 是一般将来时被动结构。",
          words: [
            { w: "effort", pos: "n.", cn: "努力", tip: "常用复数 efforts；make efforts to do 努力做某事" }
          ],
          phrases: [
            { p: "even with ...", cn: "即使有……", tip: "让步状语，后接名词；与 even if + 从句 形式不同" }
          ],
          grammar: [
            { name: "一般将来时被动语态", detail: "will be killed 表示对未来可能发生的被动动作的预测。" },
            { name: "让步状语", detail: "Even with all those efforts 表示“尽管付出了所有努力”，但结果仍然不乐观。" }
          ]
        },
        {
          id: "P2-S5",
          text: "Only one out of every 1,000 olive ridleys is likely to ever reach adulthood.",
          tr: "每 1000 只榄蠵龟中只有 1 只可能活到成年。",
          structure: "简单句（主系表）：主语 Only one out of every 1,000 olive ridleys + 系动词 is + 表语 likely to ever reach adulthood；句首 Only 起强调作用。",
          words: [
            { w: "adult", pos: "n./adj.", cn: "成年人；成年的", tip: "名词 adulthood（成年）；形容词 adult 与 child 相对" },
            { w: "likely", pos: "adj.", cn: "可能的", tip: "be likely to do 可能做某事" }
          ],
          phrases: [
            { p: "out of every 1,000", cn: "每 1000 中", tip: "out of 表示“从……之中”；常用于比例表达" },
            { p: "be likely to do", cn: "可能做某事", tip: "形容词 likely 后接不定式，比 possible 更带主观推测色彩" }
          ],
          grammar: [
            { name: "only 强调句", detail: "句首 Only 强调主语 one，表“仅仅一只”，形成强烈的数据反差。" }
          ]
        }
      ]
    },
    {
      id: "P3",
      sentences: [
        {
          id: "P3-S1",
          text: "Conservationists thought olive ridleys had been gone from this area for tens of years, but in the early 2000s, a worker from an environmental charity accidentally discovered a turtle eggshell nearby.",
          tr: "环保人士曾认为榄蠵龟已经在该地区消失了数十年，但在 21 世纪初，一个环保慈善机构的工人意外地在附近发现了一个海龟蛋壳。",
          words: [
            { w: "conservationist", pos: "n.", cn: "环保人士，自然资源保护者", tip: "来自 conserve（保护）+ -ist 表人" },
            { w: "charity", pos: "n.", cn: "慈善机构，慈善事业", tip: "形容词 charitable 慈善的" },
            { w: "accidentally", pos: "adv.", cn: "意外地", tip: "副词；形容词 accidental（偶然的）" },
            { w: "eggshell", pos: "n.", cn: "蛋壳", tip: "合成词：egg（蛋）+ shell（壳）" }
          ],
          phrases: [
            { p: "had been gone", cn: "已经消失", tip: "过去完成时，强调“过去某时之前已持续的状态”" }
          ],
          grammar: [
            { name: "过去完成时", detail: "had been gone from this area for tens of years 表示“过去某时（21 世纪初）之前已消失数十年”，强调过去的状态。" },
            { name: "转折并列句", detail: "but 连接两个分句：前一分句讲“以为已经消失”，后一分句讲“意外发现蛋壳”，形成转折反差，是 Q2 题的定位句。" }
          ],
          analysis: {
            trunk: "Conservationists thought ... but a worker ... discovered ...",
            subject: "① Conservationists；② a worker from an environmental charity",
            predicate: "① thought；② accidentally discovered",
            object: "① that 引导的宾语从句（橄榄蠵龟已消失数十年）；② a turtle eggshell",
            attributive: "无",
            adverbial: "from this area（地点状语，修饰 had been gone）；in the early 2000s（时间状语）；nearby（地点状语）",
            clause: "olive ridleys had been gone from this area for tens of years（宾语从句，省略了 that）",
            nonfinite: "from an environmental charity（介词短语作后置定语，修饰 a worker）",
            breakdown: [
              { part: "Conservationists thought olive ridleys had been gone from this area for tens of years", role: "前一分句：环保人士曾以为榄蠵龟已消失数十年；had been gone 用过去完成时强调持续状态" },
              { part: "but", role: "转折连词，把“以为消失”与“实际仍存在”连接起来，形成反差" },
              { part: "in the early 2000s", role: "时间状语，标记“发现”这一关键时间节点" },
              { part: "a worker from an environmental charity", role: "后一分句的主语；from ... 是介词短语作后置定语，修饰 worker" },
              { part: "accidentally discovered a turtle eggshell nearby", role: "后一分句的谓语和宾语，是本句信息重心：蛋壳的意外发现彻底改变了人们的认知" }
            ]
          }
        },
        {
          id: "P3-S2",
          text: "Soon, Mohan Upadhye, the founder of the Velas Turtle Festival, helped the charity identify turtle nesting sites.",
          tr: "不久，韦拉斯海龟节创办人莫汉·乌帕德耶帮助该慈善机构识别海龟的筑巢地点。",
          structure: "简单句（主谓宾）：主语 Mohan Upadhye（同位语 the founder of the Velas Turtle Festival）+ 谓语 helped + 宾语 the charity + 复合宾语 identify turtle nesting sites（不带 to 的不定式）。",
          words: [
            { w: "founder", pos: "n.", cn: "创办人，创立者", tip: "来自 found（创立）+ -er；动词 found /faʊnd/ 与名词 founder /ˈfaʊndər/ 词根同形" },
            { w: "identify", pos: "v.", cn: "识别，确认", tip: "名词 identification；identify A with B 把 A 与 B 等同" }
          ],
          phrases: [
            { p: "help sb. (to) do sth.", cn: "帮助某人做某事", tip: "help 后接不带 to 或带 to 的不定式均可" }
          ],
          grammar: [
            { name: "同位语", detail: "the founder of the Velas Turtle Festival 作 Mohan Upadhye 的同位语，补充说明其身份。" },
            { name: "复合宾语", detail: "helped the charity identify ... 中，identify 是不带 to 的不定式，与 the charity 构成复合宾语。" }
          ]
        },
        {
          id: "P3-S3",
          text: "Some of the surviving females born on this beach will return to lay their own eggs.",
          tr: "一些在这片海滩上出生的幸存雌龟将返回产下自己的蛋。",
          structure: "简单句（主谓宾）：主语 Some of the surviving females born on this beach + 谓语 will return + 不定式 to lay their own eggs 作目的状语。",
          words: [
            { w: "survive", pos: "v.", cn: "存活，幸存", tip: "形容词 surviving 作定语；名词 survival（生存）" },
            { w: "female", pos: "n./adj.", cn: "雌性；女性的", tip: "与 male 相对" },
            { w: "lay", pos: "v.", cn: "产（卵）；放置", tip: "lay—laid—laid—laid；lie—lay—lain—lying 容易混淆" }
          ],
          phrases: [
            { p: "lay eggs", cn: "产蛋，下蛋", tip: "lay 作及物动词：lay an egg / lay eggs" }
          ],
          grammar: [
            { name: "一般将来时", detail: "will return 表示对未来的预测：幸存雌龟会回到出生地产卵。" },
            { name: "现在分词作后置定语", detail: "surviving（现在分词）和 born（过去分词）并列修饰 females，区分出“幸存且出生在此地”的雌龟。" }
          ]
        },
        {
          id: "P3-S4",
          text: "Upadhye says that's why protecting nesting sites is key to protecting the species.",
          tr: "乌帕德耶说，这就是为什么保护筑巢地点对保护该物种至关重要。",
          structure: "主从复合句：主句 Upadhye says + 表语从句（省略连接词 that? No, that's why 是一个整体）。",
          words: [
            { w: "species", pos: "n.", cn: "物种；种类", tip: "单复数同形：one species / many species" },
            { w: "key", pos: "adj./n.", cn: "关键的；钥匙", tip: "be key to 对……至关重要；与 crucial / essential 近义" }
          ],
          phrases: [
            { p: "be key to doing sth.", cn: "对做某事至关重要", tip: "key to 后接动名词或名词；同义表达：be crucial to / be vital to" },
            { p: "that's why ...", cn: "这就是为什么……", tip: "why 引导表语从句，承接上文原因，给出结论" }
          ],
          grammar: [
            { name: "表语从句", detail: "that's why protecting nesting sites is key to protecting the species 中，why 引导表语从句，整句作 says 的宾语。" },
            { name: "动名词作主语", detail: "protecting nesting sites 是动名词短语，作表语从句的主语。" }
          ]
        },
        {
          id: "P3-S5",
          text: "Then Upadhye set up hatcheries and established the festival.",
          tr: "然后，乌帕德耶建立了孵化室并创办了这个节日。",
          structure: "简单句：主语 Upadhye + 并列谓语 set up hatcheries and established the festival；句首 Then 是时间副词。",
          words: [
            { w: "establish", pos: "v.", cn: "创立，建立", tip: "近义词：found / set up；区别：found 更正式" }
          ],
          phrases: [
            { p: "set up", cn: "建立，搭建", tip: "set up 强调“从无到有”地筹建；此处与 established 并列，强调创办动作" }
          ],
          grammar: [
            { name: "并列谓语", detail: "set up hatcheries 和 established the festival 是两个并列谓语，共用主语 Upadhye。" }
          ]
        }
      ]
    },
    {
      id: "P4",
      sentences: [
        {
          id: "P4-S1",
          text: "The festival lasts for the two-month hatching season that starts in April.",
          tr: "该节日持续两个月，恰好是从四月开始的孵化季。",
          structure: "主从复合句：主句 The festival lasts for the two-month hatching season + that 引导的定语从句 that starts in April。",
          words: [
            { w: "last", pos: "v.", cn: "持续；最后的", tip: "last for + 时间段 持续多久" },
            { w: "hatching", pos: "n./adj.", cn: "孵化；孵化的", tip: "来自动词 hatch；the hatching season 孵化季" }
          ],
          phrases: [
            { p: "last for", cn: "持续", tip: "last 为不及物动词，介词 for 引导时间段" }
          ],
          grammar: [
            { name: "定语从句", detail: "that starts in April 修饰 the two-month hatching season，说明孵化季的开始时间。" }
          ]
        },
        {
          id: "P4-S2",
          text: "It attracts visitors, but some experts worry that if more tourists come, they will make the place dirty by throwing rubbish on the beach.",
          tr: "它吸引着游客，但一些专家担心，如果有更多游客到来，他们会在海滩上乱扔垃圾，让这个地方变得肮脏。",
          words: [
            { w: "attract", pos: "v.", cn: "吸引", tip: "名词 attraction（吸引力）；attract visitors 吸引游客" },
            { w: "worry", pos: "v.", cn: "担心", tip: "worry about sth. 担心某事；worry that ... 担心……" },
            { w: "rubbish", pos: "n.", cn: "垃圾，废物", tip: "不可数名词；近义词：garbage / litter" }
          ],
          phrases: [
            { p: "make sth. + adj.", cn: "使某物变得……", tip: "make 是使役动词，后接宾语 + 形容词：make the place dirty" },
            { p: "throw rubbish on the beach", cn: "在海滩上扔垃圾", tip: "throw 后接具体物品，介词 on 表示地点" }
          ],
          grammar: [
            { name: "转折并列句", detail: "but 连接 It attracts visitors 与 some experts worry that ...，形成“吸引 vs. 担忧”的对比。" },
            { name: "宾语从句", detail: "worry 后接 that 引导的宾语从句，从句内又嵌套 if 引导的条件状语从句。" },
            { name: "条件状语从句", detail: "if more tourists come 是真实条件从句，用一般现在时表将来，主句用一般将来时。" }
          ],
          analysis: {
            trunk: "It attracts visitors, but some experts worry that ... they will make the place dirty.",
            subject: "① It；② some experts",
            predicate: "① attracts；② worry",
            object: "② that 引导的宾语从句（包含 if 条件状语从句）",
            attributive: "无",
            adverbial: "by throwing rubbish on the beach（方式状语，说明“脏”的原因）",
            clause: "that if more tourists come, they will make the place dirty by throwing rubbish on the beach（宾语从句）",
            nonfinite: "throwing rubbish on the beach（动名词短语作介词 by 的宾语，构成方式状语）",
            breakdown: [
              { part: "It attracts visitors", role: "前一分句：节日吸引游客" },
              { part: "but", role: "转折连词，引出与前句相反的担忧" },
              { part: "some experts worry that ...", role: "后一分句主干：专家担忧某事" },
              { part: "if more tourists come", role: "if 引导的条件状语从句，提出假设" },
              { part: "they will make the place dirty", role: "条件状语从句对应的主句，make + 宾语 + 形容词" },
              { part: "by throwing rubbish on the beach", role: "方式状语，具体说明让海滩变脏的方式" }
            ]
          }
        },
        {
          id: "P4-S3",
          text: "Rubbish is a problem, confirms festival manager Virendra Ramesh Patel.",
          tr: "垃圾是一个问题，节日经理维伦德拉·拉梅什·帕特尔证实说。",
          structure: "全倒装句（主谓倒装）：陈述句 Rubbish is a problem 位于句首，后置主语 festival manager Virendra Ramesh Patel 与谓语 confirms；为了保持叙事平衡，作者把较短的陈述提前，把较长的人物身份信息后置。",
          words: [
            { w: "confirm", pos: "v.", cn: "证实，确认", tip: "近义词：verify；confirms 后可接 that 从句或直接宾语" },
            { w: "manager", pos: "n.", cn: "经理", tip: "festival manager 节日经理；由 manage + -er 构成" }
          ],
          phrases: [
            { p: "festival manager", cn: "节日经理", tip: "作 confirms 的主语，等同于 the festival's manager" }
          ],
          grammar: [
            { name: "主谓倒装", detail: "陈述部分 Rubbish is a problem 提前，confirms festival manager ... Patel 后置；这种结构在新闻与说明文中常见，用于平衡句子、把较长的主语放到末尾。" }
          ]
        },
        {
          id: "P4-S4",
          text: "He says he pays villagers to keep the beach tidy—about $3 a week.",
          tr: "他说他付钱给村民们以保持海滩整洁——每周大约 3 美元。",
          structure: "复合句：主句 He says + 宾语从句 he pays villagers to keep the beach tidy；破折号后 about $3 a week 是同位语，说明“付多少钱”。",
          words: [
            { w: "villager", pos: "n.", cn: "村民", tip: "来自 village（村庄）+ -er" },
            { w: "tidy", pos: "adj./v.", cn: "整洁的；整理", tip: "keep sth. tidy 保持某物整洁" }
          ],
          phrases: [
            { p: "keep sth. + adj.", cn: "保持某物处于……状态", tip: "keep 是使役动词，后接宾语 + 形容词：keep the beach tidy" },
            { p: "pay sb. to do sth.", cn: "付钱让某人做某事", tip: "不定式作宾语补足语" }
          ],
          grammar: [
            { name: "宾语从句", detail: "he pays villagers to keep the beach tidy 是 says 的宾语，从句中 villagers 后接不定式作宾补。" },
            { name: "同位语", detail: "破折号后 about $3 a week 是对 pay villagers to keep the beach tidy 中报酬数额的补充说明。" }
          ]
        }
      ]
    },
    {
      id: "P5",
      sentences: [
        {
          id: "P5-S1",
          text: "Kartik Shanker, a leading Indian sea turtle expert, says around 20 years ago, conservationists counted no more than 100,000 turtle nests across the country, but during the past winter's nesting season, he says conservationists counted about a million nests.",
          tr: "印度顶尖海龟专家卡尔蒂克·桑克尔说，大约 20 年前，环保人士在全国范围内只统计到不超过 10 万个海龟巢；但在去年冬天的筑巢季，环保人士统计到了约 100 万个巢。",
          words: [
            { w: "leading", pos: "adj.", cn: "顶尖的，主要的", tip: "a leading expert 顶尖专家；近义词：top / prominent" },
            { w: "count", pos: "v.", cn: "数，统计", tip: "counted 是过去式，强调“当年盘点”" },
            { w: "nest", pos: "n.", cn: "本句指海龟的巢", tip: "此处用作可数名词：a turtle nest" }
          ],
          phrases: [
            { p: "no more than", cn: "不超过", tip: "强调“上限”；注意与 not more than（不多于）的语气差异" },
            { p: "across the country", cn: "在全国", tip: "across 表示“遍及、跨越”" }
          ],
          grammar: [
            { name: "并列复合句", detail: "but 连接两个并列分句，每个分句内都嵌入 says + 宾语从句，是典型的“专家观点 + 数据对比”结构。" },
            { name: "同位语", detail: "a leading Indian sea turtle expert 作 Kartik Shanker 的同位语，补充人物身份。" }
          ],
          analysis: {
            trunk: "Kartik Shanker says ... conservationists counted no more than 100,000 nests, but ... they counted about a million nests.",
            subject: "① Kartik Shanker；② conservationists；③ conservationists（he says 承前省略主语）",
            predicate: "① says；② counted；③ counted",
            object: "① says 后的整个宾语从句；② no more than 100,000 turtle nests；③ about a million nests",
            attributive: "a leading Indian sea turtle expert（同位语，修饰 Kartik Shanker）",
            adverbial: "around 20 years ago（时间状语）；across the country（地点状语）；during the past winter's nesting season（时间状语）",
            clause: "无独立从句，但每个 counted 分句内嵌间接引语结构",
            nonfinite: "winter's nesting season 中 winter's 是名词所有格作定语",
            breakdown: [
              { part: "Kartik Shanker, a leading Indian sea turtle expert", role: "主语 + 同位语：说明观点来源" },
              { part: "says around 20 years ago", role: "谓语 + 时间状语：引出 20 年前的数据" },
              { part: "conservationists counted no more than 100,000 turtle nests across the country", role: "前一分句：环保人士过去统计到的巢数上限" },
              { part: "but", role: "转折连词" },
              { part: "during the past winter's nesting season", role: "时间状语，对比当下" },
              { part: "he says conservationists counted about a million nests", role: "后一分句：现在统计到的巢数，与 100,000 形成 10 倍反差" }
            ]
          }
        },
        {
          id: "P5-S2",
          text: "So he worries that now that their numbers appear to be recovering, there will be more pressure to reduce protections.",
          tr: "因此他担心，既然它们的数量似乎正在恢复，将会有更大的压力来减少保护措施。",
          words: [
            { w: "recover", pos: "v.", cn: "恢复，康复", tip: "名词 recovery（恢复）；recover from 从……中恢复" },
            { w: "protection", pos: "n.", cn: "保护", tip: "动词 protect；reduce protections 减少保护（措施）" }
          ],
          phrases: [
            { p: "appear to do", cn: "似乎做某事", tip: "系动词 appear 后接不定式，表“似乎……”" },
            { p: "pressure to do sth.", cn: "做某事的压力", tip: "pressure 后接不定式：pressure to reduce protections" }
          ],
          grammar: [
            { name: "宾语从句", detail: "worry 后接 that 引导的宾语从句，从句内部还嵌套 now that 引导的原因状语从句。" },
            { name: "原因状语从句", detail: "now that their numbers appear to be recovering 表示“既然数量正在恢复”，作为整句担心的逻辑前提。" }
          ],
          analysis: {
            trunk: "he worries that ... there will be more pressure to reduce protections.",
            subject: "he",
            predicate: "worries",
            object: "that 引导的宾语从句（整个从句）",
            attributive: "无",
            adverbial: "So（连接副词，承接上文数据对比）；now that their numbers appear to be recovering（原因状语从句）",
            clause: "that now that their numbers appear to be recovering, there will be more pressure to reduce protections（宾语从句）；now that their numbers appear to be recovering（原因状语从句，作宾语从句内部的原因）",
            nonfinite: "to reduce protections（不定式作定语，修饰 more pressure）",
            breakdown: [
              { part: "So", role: "因果副词，承接 P5-S1 的数据对比，引出专家的担心" },
              { part: "he worries", role: "主句主干：桑克尔担心" },
              { part: "that ...", role: "that 引导的宾语从句，引出担心的内容" },
              { part: "now that their numbers appear to be recovering", role: "now that 引导的原因状语从句，说明担心的逻辑前提" },
              { part: "there will be more pressure", role: "宾语从句中的主句：存在更多压力" },
              { part: "to reduce protections", role: "不定式作后置定语，修饰 more pressure，具体说明压力的方向" }
            ]
          }
        },
        {
          id: "P5-S3",
          text: "\"I can see a Port Development Authority saying, why shouldn't we build a port here? You said that the ridleys were endangered, but obviously they're not,\" Shanker said.",
          tr: "\"我能想象港口管理局会这么说：我们为什么不能在这里建一个港口？你们说榄蠵龟是濒危物种，但显然它们不是了，\"桑克尔说道。",
          words: [
            { w: "port", pos: "n.", cn: "港口", tip: "port authority 港口管理局" },
            { w: "authority", pos: "n.", cn: "当局，管理部门", tip: "复数 authorities 也可作“当局”" },
            { w: "endangered", pos: "adj.", cn: "濒危的", tip: "动词 endanger（危及）；endangered species 濒危物种" },
            { w: "obviously", pos: "adv.", cn: "明显地，显然", tip: "形容词 obvious（明显的）" }
          ],
          phrases: [
            { p: "build a port", cn: "建港口", tip: "build—built—built；build a port / build a road / build a bridge" },
            { p: "a Port Development Authority", cn: "港口发展局", tip: "专有名词，本句用其作为“主张取消保护者”的代表" }
          ],
          grammar: [
            { name: "直接引语", detail: "引号内是桑克尔的原话；他先用 I can see ... saying 引出，再现对方可能的反驳。" },
            { name: "疑问句 + 陈述句", detail: "引号内含 why shouldn't we ...? 反问句与 You said ... , but obviously ... 的转折陈述句，构成想象中的反对声音。" }
          ],
          analysis: {
            trunk: "Shanker said (直接引语内容)",
            subject: "I（说话者 Shanker）",
            predicate: "said（间接引出）",
            object: "引号内的全部内容",
            attributive: "无",
            adverbial: "here（地点状语，引号内）",
            clause: "why shouldn't we build a port here（直接引语内的反问句）；that the ridleys were endangered（直接引语内的宾语从句）",
            nonfinite: "a Port Development Authority saying（现在分词复合宾语，see sb. doing 结构）",
            breakdown: [
              { part: "\"I can see a Port Development Authority saying, why shouldn't we build a port here?", role: "引语第一句：桑克尔设想港口管理局的反问" },
              { part: "You said that the ridleys were endangered, but obviously they're not,\"", role: "引语第二句：港口管理局可能的反驳逻辑——既然不再濒危，为什么要保护" },
              { part: "Shanker said.", role: "引语出处标记" }
            ]
          }
        }
      ]
    }
  ],

  /* =======================================================
   * 三、题目
   * ======================================================= */
  questions: [
    {
      id: "Q1",
      type: "主旨大意题",
      stem: "What is the main purpose of the Velas Turtle Festival?",
      options: {
        A: "To attract tourists.",
        B: "To clean the beach.",
        C: "To collect turtle eggs.",
        D: "To protect olive ridleys."
      },
      answer: "D",
      keywords: "main purpose / Velas Turtle Festival",
      locate: {
        sids: ["P3-S4", "P3-S5"],
        keywords: ["key to protecting the species", "set up hatcheries and established the festival"]
      },
      evidence: {
        sids: ["P3-S4", "P3-S5"],
        quotes: [
          "Upadhye says that's why protecting nesting sites is key to protecting the species",
          "Then Upadhye set up hatcheries and established the festival"
        ]
      },
      synonyms: {
        pairs: [
          { left: "the main purpose", leftNote: "题干", right: "that's why protecting nesting sites is key to protecting the species", rightSid: "P3-S4", rightNote: "第 3 段第 4 句", op: "≈" },
          { left: "protect olive ridleys", leftNote: "选项 D", right: "protecting nesting sites is key to protecting the species", rightSid: "P3-S4", rightNote: "第 3 段第 4 句", op: "≈" }
        ]
      },
      correct: "D 项与第 3 段第 4 句的核心陈述一致：保护筑巢地是保护物种的关键。第 3 段第 5 句紧接着说“然后乌帕德耶建立孵化室并创办了节日”，可见节日是实现“保护榄蠵龟”这一目的的具体手段，因此 D 是对节日核心目的的准确概括。",
      wrong: {
        A: {
          tag: "部分正确",
          text: "文章确实在第 1 段和第 4 段提到节日吸引游客，但这只是节日带来的客观效果，不是创办者的初衷。A 把“吸引游客”当作目的，属于把副作用当主目的。"
        },
        B: {
          tag: "偷换概念",
          text: "第 4 段第 4 句提到节日经理付钱给村民保持海滩整洁，但这只是节日运营中的一环，不是节日的根本目的。B 把“清洁海滩”这种运营措施当作主旨，属于偷换概念。"
        },
        C: {
          tag: "范围缩小",
          text: "第 2 段第 1 句提到志愿者收集蛋，但这只是孵化保护流程中的一个动作，并非节日的最终目的。C 只看流程中“收集”这一步，属于把节日的小部分做法当作全部目的。"
        }
      },
      strategy: "主旨大意题要找“目的”，而不是“动作”。回到 P3 段，段中 Upadhye 直接给出因果关系——保护筑巢地即保护物种，因此建立孵化室、创办节日；抓住了“目的→手段”的链条，就能排除只讲手段的 A/B/C，确认 D。"
    },

    {
      id: "Q2",
      type: "细节理解题",
      stem: "What made people believe olive ridleys still lived in this area?",
      options: {
        A: "The discovery of an eggshell.",
        B: "The planned scientific survey.",
        C: "The villagers' extra protection.",
        D: "The search started by Upadhye."
      },
      answer: "A",
      keywords: "believe olive ridleys still lived / this area",
      locate: {
        sids: ["P3-S1"],
        keywords: ["accidentally discovered", "eggshell"]
      },
      evidence: {
        sids: ["P3-S1"],
        quotes: ["a worker from an environmental charity accidentally discovered a turtle eggshell nearby"]
      },
      synonyms: {
        pairs: [
          { left: "made people believe olive ridleys still lived", leftNote: "题干", right: "accidentally discovered a turtle eggshell nearby", rightSid: "P3-S1", rightNote: "第 3 段第 1 句", op: "≈" },
          { left: "The discovery of an eggshell", leftNote: "选项 A", right: "accidentally discovered a turtle eggshell", rightSid: "P3-S1", rightNote: "第 3 段第 1 句", op: "≈" }
        ]
      },
      correct: "A 项与 P3-S1 末尾的 accidentally discovered a turtle eggshell nearby 几乎逐词对应。这枚蛋壳的发现推翻了“已经消失数十年”的判断，让人们重新相信榄蠵龟仍存在于这一地区，证据句与选项完全吻合。",
      wrong: {
        B: {
          tag: "无中生有",
          text: "第 3 段第 1 句强调发现是 accidentally（意外地），并非任何“planned scientific survey”。全文也没有提到任何科学调查计划，B 属于无中生有。"
        },
        C: {
          tag: "因果倒置",
          text: "村民保持海滩整洁是 P4 段节日运营期间发生的事情，远在发现榄蠵龟之后。C 把“村民保护”当作“相信榄蠵龟还在此地”的原因，时间与因果都倒置了。"
        },
        D: {
          tag: "偷换概念",
          text: "乌帕德耶是在发现之后才加入帮助识别筑巢地的（helped the charity identify turtle nesting sites），并不是“search started by Upadhye”。D 把发现主体偷换成了乌帕德耶。"
        }
      },
      strategy: "细节题先抓题干关键词 believe olive ridleys still lived / this area；回到原文找到转折连词 but，但之后出现 accidentally discovered a turtle eggshell nearby，正是“让人们改变看法”的关键证据；用选项 A 中的“eggshell”与证据句对比即可锁定；其余 B/C/D 都与时间或人物身份不符。"
    },

    {
      id: "Q3",
      type: "细节理解题",
      stem: "What trouble may more tourists bring to the festival?",
      options: {
        A: "The challenge of organizing the festival.",
        B: "The difficulty of counting turtle nests.",
        C: "The danger to turtle hatching.",
        D: "The pollution of the beach."
      },
      answer: "D",
      keywords: "more tourists bring / trouble",
      locate: {
        sids: ["P4-S2"],
        keywords: ["if more tourists come", "rubbish on the beach"]
      },
      evidence: {
        sids: ["P4-S2", "P4-S3"],
        quotes: [
          "if more tourists come, they will make the place dirty by throwing rubbish on the beach",
          "Rubbish is a problem"
        ]
      },
      synonyms: {
        pairs: [
          { left: "The pollution of the beach", leftNote: "选项 D", right: "make the place dirty by throwing rubbish on the beach", rightSid: "P4-S2", rightNote: "第 4 段第 2 句", op: "≈" },
          { left: "trouble", leftNote: "题干", right: "Rubbish is a problem", rightSid: "P4-S3", rightNote: "第 4 段第 3 句", op: "≈" }
        ]
      },
      correct: "D 项对应 P4-S2 的核心结论：如果游客增多，他们会往海滩上扔垃圾（throw rubbish on the beach），让地方变得脏（make the place dirty），P4-S3 又用 Rubbish is a problem 进一步确认垃圾就是节日面临的问题。cause-effect（游客增加 → 海滩污染）与原文一致。",
      wrong: {
        A: {
          tag: "无中生有",
          text: "第 4 段提到垃圾问题和付钱给村民保持整洁，但没有说组织节日本身遇到挑战。A 凭“节日越大越难办”的常识推测，原文中没有对应表述。"
        },
        B: {
          tag: "张冠李戴",
          text: "P5 段中桑克尔提到 conservationists counted 巢数，但那是科学统计工作，与“游客带来的麻烦”无关。B 把 P5 段的研究场景错误地放到了 P4 段的游客话题里。"
        },
        C: {
          tag: "过度推断",
          text: "原文只说游客会让海滩变脏，并未说脏海滩会直接威胁小龟的孵化过程。C 在“污染”和“孵化危险”之间补了一连串原文没有的环节，属于过度推断。"
        }
      },
      strategy: "题干关键词 more tourists / trouble 限定在 P4 段。第 4 段第 2 句由 but 转折引出专家担心，紧接着出现 if more tourists come ... make the place dirty by throwing rubbish on the beach，是最直接的定位—证据；之后第 3 句用 Rubbish is a problem 强化确认，两句合起来指向海滩污染；其余 A/B/C 或无中生有，或张冠李戴，或过度推断。"
    },

    {
      id: "Q4",
      type: "推理判断题",
      stem: "Why is Port Development Authority mentioned?",
      options: {
        A: "To introduce ways to protect ridleys.",
        B: "To stress it is easy to build more nests.",
        C: "To describe a new port construction plan.",
        D: "To prove Shanker's worry makes sense."
      },
      answer: "D",
      keywords: "Port Development Authority / mentioned",
      locate: {
        sids: ["P5-S2", "P5-S3"],
        keywords: ["more pressure to reduce protections", "Port Development Authority"]
      },
      evidence: {
        sids: ["P5-S2", "P5-S3"],
        quotes: [
          "So he worries that now that their numbers appear to be recovering, there will be more pressure to reduce protections",
          "I can see a Port Development Authority saying, why shouldn't we build a port here? You said that the ridleys were endangered, but obviously they're not"
        ]
      },
      synonyms: {
        pairs: [
          { left: "Shanker's worry", leftNote: "题干", right: "he worries that ... there will be more pressure to reduce protections", rightSid: "P5-S2", rightNote: "第 5 段第 2 句", op: "≈" },
          { left: "a Port Development Authority saying, why shouldn't we build a port here", leftNote: "选项 D（理由）", right: "I can see a Port Development Authority saying, why shouldn't we build a port here", rightSid: "P5-S3", rightNote: "第 5 段第 3 句", op: "≈" }
        ]
      },
      correct: "D 项与全文逻辑链吻合：P5-S2 先说桑克尔担心数量恢复后会有人推动减少保护，紧接着 P5-S3 用港口管理局的反问（“为什么不能在这里建港口？你们说榄蠵龟是濒危的，但显然不是了”）作为典型例子，证明这种担心不是空穴来风，因此引用港口管理局是为了印证桑克尔的担心有道理。",
      wrong: {
        A: {
          tag: "与原文相反",
          text: "港口管理局在原文里代表的恰恰是“主张取消保护”的声音（why shouldn't we build a port here），而不是介绍保护方法。A 把作者批驳的对象说成了保护者，与原文相反。"
        },
        B: {
          tag: "无中生有",
          text: "原文既没有讨论筑巢容易，也没有把港口建设与筑巢联系起来。B 把“港口”和“巢”两个完全无关的概念拼在一起，属于无中生有。"
        },
        C: {
          tag: "偷换概念",
          text: "港口管理局的话是桑克尔 can see 设想的（I can see ... saying），并不是现实存在的港口建设计划。C 把假想情景误读为真实计划，偷换了引语性质。"
        }
      },
      strategy: "推理题要还原作者的写作意图。先到 P5 段找 Shanker 的观点句——P5-S2 中 he worries that ... there will be more pressure to reduce protections 是论点；P5-S3 中港口管理局的反问是论据，两者形成“观点→例证”的关系。因此引用港口管理局是为了支持 Shanker 的担心成立——选 D。A/B/C 都与论据的实际指向相反或无关。"
    }
  ]
};

/* 同时支持浏览器全局与 Node 校验 */
if (typeof window !== "undefined") {
  window.READING_DATA = READING_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = READING_DATA;
}