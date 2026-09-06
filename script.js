/* ===========================================================
 * script.js —— 高中英语阅读课堂互动讲解（第一阶段 + 第二阶段）
 * 纯前端逻辑，无网络请求、无外部依赖。
 *
 * 模式说明：
 *   solve     做题模式：隐藏答案、解析、证据高亮（可看单句翻译）
 *   teach     讲解模式：点题定位 + 显示答案解析 + 单句翻译
 *   intensive 精读模式：在讲解模式基础上，点击句子展开精读
 *                      （翻译 / 重点单词 / 固定搭配 / 语法 / 句子结构 / 长难句拆解）
 * =========================================================== */

(function () {
  "use strict";

  var DATA = window.READING_DATA;

  /* 各题型的解析重点（新增文章时如题目未写 focus，则按题型自动匹配） */
  var TYPE_FOCUS = {
    "细节理解题": "先抓题干关键词（专有名词、数字、时间、段落提示）回原文定位，再用同义替换比对选项。答案一定是原文的改写，不是原文照抄，也不是凭常识推断。",
    "推理判断题": "答案原文不会直说，必须由证据推出。重点看证据句“能推出什么、不能推出什么”，凡是超出原文范围的（过度推断、绝对化）一律排除。",
    "主旨大意题": "抓主题句（常在段首或转折词之后），用“谁 + 做了什么 + 结果/态度”概括；选项过宽（覆盖不到全文）或过窄（只讲某一段）都排除。",
    "最佳标题题": "标题要同时满足“覆盖全文主题 + 简洁醒目”。先定主题词，再排除只覆盖某一段或以偏概全的选项。",
    "词义猜测题": "绝不只看单词本身，要看上下文逻辑关系：并列（and）、转折（but/yet）、因果（because/so）、举例（for example）、定义（or/that is）、反义对比（rather than）。",
    "代词指代题": "向前找最近且“数、性、逻辑”都吻合的名词；把候选词代入原句，看句意是否通顺。",
    "段落作用题": "从“内容 + 结构”两方面答：内容上写了什么，结构上是否引出下文、承上启下、举例支撑或总结全文。",
    "作者态度题": "抓评价性形容词、副词与转折结构；含 completely / no value at all 等绝对化表达的选项通常可直接排除。",
    "文章结构题": "先判体裁与行文顺序（现象—原因—例证—评价—建议），再逐段概括段意并与选项比对。"
  };

  var MODE_TIP = {
    solve: "做题模式：只显示文章与题目，答案、解析和证据高亮已隐藏；仍可点击英文句子查看中文翻译。",
    teach: "讲解模式：点击题目卡片自动定位原文并高亮证据；点“显示答案与解析”展开 ABCD 逐项分析；点击英文句子查看中文翻译。",
    intensive: "精读模式：点击任意英文句子，展开该句的翻译、重点单词、固定搭配、重要语法、句子结构与长难句拆解；题目定位与答案解析同样可用。"
  };

  var el = {
    passage: document.getElementById("passage"),
    questions: document.getElementById("questions"),
    passageScroll: document.getElementById("passage-scroll"),
    questionsScroll: document.getElementById("questions-scroll"),
    layout: document.getElementById("layout"),
    panelLeft: document.getElementById("panel-left"),
    splitter: document.getElementById("splitter"),
    indicator: document.getElementById("q-indicator"),
    fontValue: document.getElementById("font-value"),
    tipText: document.getElementById("tip-text"),
    btnPrev: document.getElementById("btn-prev"),
    btnNext: document.getElementById("btn-next"),
    btnSolve: document.getElementById("btn-solve"),
    btnTeach: document.getElementById("btn-teach"),
    btnIntensive: document.getElementById("btn-intensive"),
    btnTrAll: document.getElementById("btn-tr-all"),
    btnTrNone: document.getElementById("btn-tr-none"),
    btnStructure: document.getElementById("btn-structure"),
    btnStructureClose: document.getElementById("btn-structure-close"),
    structureModal: document.getElementById("structure-modal"),
    structureBody: document.getElementById("structure-body"),
    btnClear: document.getElementById("btn-clear"),
    btnDown: document.getElementById("btn-font-down"),
    btnUp: document.getElementById("btn-font-up"),
    btnFull: document.getElementById("btn-fullscreen"),
    tabPassage: document.getElementById("tab-passage"),
    tabQuestions: document.getElementById("tab-questions"),
    btnJump: document.getElementById("btn-jump")
  };

  var state = {
    current: -1,          // 当前题目索引，-1 = 未选
    mode: "teach",        // solve | teach | intensive
    scale: 1,             // 字号缩放
    open: {},             // 已展开解析的题目
    trOpen: {},           // 已展开翻译的句子 sid
    readOpen: {},         // 已展开精读的句子 sid
    tab: "passage"        // 手机端当前标签
  };

  var sentenceEls = {};     // sid -> .sent 元素
  var sentenceData = {};    // sid -> 句子数据对象
  var sentenceText = {};    // sid -> 英文原文
  var trEls = {};           // sid -> 翻译容器
  var readEls = {};         // sid -> 精读容器
  var cardEls = [];         // index -> 题目卡片

  /* ============ 工具函数 ============ */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // P1-S2 -> "第 1 段第 2 句"
  function sidToLabel(sid) {
    var m = /^P(\d+)-S(\d+)$/.exec(sid);
    if (!m) return sid;
    return "第 " + m[1] + " 段第 " + m[2] + " 句";
  }

  // 把一段文本中的若干关键词包成 <mark>
  function markText(text, marks) {
    if (!marks || !marks.length) return esc(text);
    var hits = [];
    marks.forEach(function (m) {
      var idx = text.indexOf(m.text);
      if (idx >= 0) hits.push({ start: idx, end: idx + m.text.length, cls: m.cls });
    });
    if (!hits.length) return esc(text);

    hits.sort(function (a, b) { return a.start - b.start; });

    // 区间重叠时合并，并同时保留两种标记（关键词 + 同义替换）
    var out = [];
    hits.forEach(function (h) {
      var prev = out[out.length - 1];
      if (prev && h.start < prev.end) {
        prev.end = Math.max(prev.end, h.end);
        if (prev.cls.indexOf(h.cls) === -1) prev.cls += " " + h.cls;
      } else {
        out.push({ start: h.start, end: h.end, cls: h.cls });
      }
    });

    var html = "";
    var pos = 0;
    out.forEach(function (h) {
      html += esc(text.slice(pos, h.start));
      html += '<mark class="' + h.cls + '">' + esc(text.slice(h.start, h.end)) + "</mark>";
      pos = h.end;
    });
    html += esc(text.slice(pos));
    return html;
  }

  /* ============ 渲染原文 ============ */
  function buildPassage() {
    var html = "";
    html += '<h1 class="p-title">' + esc(DATA.title) + "</h1>";
    html += '<div class="p-meta">' + esc(DATA.meta) + "</div>";

    DATA.paragraphs.forEach(function (p) {
      html += '<div class="para">';
      p.sentences.forEach(function (s) {
        sentenceData[s.id] = s;
        sentenceText[s.id] = s.text;
        // 注意：.sent 为行内（文本自然流动），.s-tr / .s-read 为块级且默认隐藏，
        // 点击后通过 .is-open 类显示。不要再用 inline 容器包裹 block 元素。
        html +=
          '<span class="sent" data-sid="' + s.id + '" title="点击查看中文翻译 / 精读">' + esc(s.text) + "</span>" +
          '<span class="s-tr" data-tr="' + s.id + '"></span>' +
          '<span class="s-read" data-read="' + s.id + '"></span> ';
      });
      html += "</div>";
    });

    el.passage.innerHTML = html;

    var spans = el.passage.querySelectorAll(".sent");
    for (var i = 0; i < spans.length; i++) {
      sentenceEls[spans[i].getAttribute("data-sid")] = spans[i];
    }
    var trs = el.passage.querySelectorAll(".s-tr");
    for (var j = 0; j < trs.length; j++) {
      trEls[trs[j].getAttribute("data-tr")] = trs[j];
    }
    var rds = el.passage.querySelectorAll(".s-read");
    for (var k = 0; k < rds.length; k++) {
      readEls[rds[k].getAttribute("data-read")] = rds[k];
    }
  }

  /* ============ 精读内容 ============ */
  function readSection(title, body, cls) {
    if (!body) return "";
    return '<span class="rd-sec' + (cls ? " " + cls : "") + '">' +
             '<span class="rd-t">' + esc(title) + "</span>" +
             '<span class="rd-c">' + body + "</span>" +
           "</span>";
  }

  function readHTML(s) {
    var h = "";

    h += readSection("中文翻译", esc(s.tr || "（本句暂无翻译）"), "rd-translate");

    if (s.words && s.words.length) {
      h += readSection("重点单词", s.words.map(function (w) {
        return '<span class="w-item">' +
                 '<b>' + esc(w.w) + "</b> <i>" + esc(w.pos) + "</i> " + esc(w.cn) +
                 (w.tip ? '<span class="w-tip">' + esc(w.tip) + "</span>" : "") +
               "</span>";
      }).join(""));
    }

    if (s.phrases && s.phrases.length) {
      h += readSection("固定搭配", s.phrases.map(function (p) {
        return '<span class="ph-item">' +
                 '<b>' + esc(p.p) + "</b>　" + esc(p.cn) +
                 (p.tip ? '<span class="w-tip">' + esc(p.tip) + "</span>" : "") +
               "</span>";
      }).join(""));
    }

    if (s.grammar && s.grammar.length) {
      h += readSection("重要语法", s.grammar.map(function (g) {
        return '<span class="g-item"><b>【' + esc(g.name) + "】</b>" + esc(g.detail) + "</span>";
      }).join(""));
    }

    var a = s.analysis;
    if (a) {
      var rows = [
        ["句子主干", a.trunk],
        ["主语", a.subject],
        ["谓语", a.predicate],
        ["宾语", a.object],
        ["定语", a.attributive],
        ["状语", a.adverbial],
        ["从句", a.clause],
        ["非谓语结构", a.nonfinite]
      ];
      var body = rows.map(function (r) {
        if (!r[1]) return "";
        return '<span class="st-row"><span class="st-k">' + r[0] + '</span><span class="st-v">' + esc(r[1]) + "</span></span>";
      }).join("");
      h += readSection("句子结构", body);

      if (a.breakdown && a.breakdown.length) {
        h += readSection("长难句拆解", a.breakdown.map(function (b) {
          return '<span class="bd-item">' +
                   '<span class="bd-part">' + esc(b.part) + "</span>" +
                   '<span class="bd-role">' + esc(b.role) + "</span>" +
                 "</span>";
        }).join(""));
      }
    } else if (s.structure) {
      // 简单句：只给一句话的句子结构说明，避免空栏目
      h += readSection("句子结构", '<span class="st-simple">' + esc(s.structure) + "</span>");
    }

    return h;
  }

  /* ============ 单句翻译 / 精读 的显隐 ============ */
  function renderSentence(sid) {
    var s = sentenceData[sid];
    var trEl = trEls[sid];
    var rdEl = readEls[sid];
    if (!s || !trEl || !rdEl) return;

    var showRead = (state.mode === "intensive") && !!state.readOpen[sid];
    var showTr = !!state.trOpen[sid];

    if (showRead) {
      // 精读模式：显示精读面板，隐藏翻译
      trEl.classList.remove("is-open");
      trEl.textContent = "";
      rdEl.innerHTML = readHTML(s);
      rdEl.classList.add("is-open");
    } else {
      // 讲解 / 做题模式：显示或隐藏单句翻译
      rdEl.classList.remove("is-open");
      rdEl.textContent = "";
      if (showTr) {
        trEl.textContent = s.tr || "（本句暂无翻译）";
        trEl.classList.add("is-open");
      } else {
        trEl.classList.remove("is-open");
        trEl.textContent = "";
      }
    }
  }

  function renderAllSentences() {
    Object.keys(sentenceData).forEach(renderSentence);
  }

  function toggleSentence(sid) {
    if (state.mode === "intensive") {
      if (state.readOpen[sid]) delete state.readOpen[sid];
      else state.readOpen[sid] = true;
    } else {
      if (state.trOpen[sid]) delete state.trOpen[sid];
      else state.trOpen[sid] = true;
    }
    renderSentence(sid);
  }

  function showAllTranslations() {
    Object.keys(sentenceData).forEach(function (sid) { state.trOpen[sid] = true; });
    renderAllSentences();
  }

  function hideAllTranslations() {
    state.trOpen = {};
    state.readOpen = {};
    renderAllSentences();
  }

  /* ============ 渲染题目 ============ */
  function buildQuestions() {
    var html = "";
    DATA.questions.forEach(function (q, i) {
      var opts = ["A", "B", "C", "D"].map(function (k) {
        return '<li class="opt" data-key="' + k + '">' +
                 '<span class="opt-key">' + k + '.</span>' +
                 '<span class="opt-text">' + esc(q.options[k]) + "</span>" +
               "</li>";
      }).join("");

      html +=
        '<article class="qcard" data-index="' + i + '">' +
          '<div class="q-head">' +
            '<span class="q-no">Question ' + (i + 1) + "</span>" +
            '<span class="q-type">' + esc(q.type) + "</span>" +
          "</div>" +
          '<div class="q-stem">' + esc(q.stem) + "</div>" +
          '<ul class="q-options">' + opts + "</ul>" +
          '<div class="q-actions">' +
            '<button type="button" class="btn btn-answer" data-act="toggle">显示答案与解析</button>' +
          "</div>" +
          '<div class="q-analysis" hidden></div>' +
        "</article>";
    });

    el.questions.innerHTML = html;
    cardEls = Array.prototype.slice.call(el.questions.querySelectorAll(".qcard"));
  }

  /* ============ 同义替换（精确到词组） ============ */
  function synonymMarks(q) {
    var out = [];
    var syn = q.synonyms || {};
    (syn.pairs || []).forEach(function (p) {
      if (p.rightSid && p.right) out.push({ sid: p.rightSid, text: p.right, cls: "mk-syn" });
      if (p.leftSid && p.left) out.push({ sid: p.leftSid, text: p.left, cls: "mk-syn" });
    });
    (syn.marks || []).forEach(function (m) {
      out.push({ sid: m.sid, text: m.text, cls: "mk-syn" });
    });
    return out;
  }

  function synonymHTML(q) {
    var syn = q.synonyms || {};
    if (syn.pairs && syn.pairs.length) {
      return '<div class="syn-wrap">' + syn.pairs.map(function (p) {
        return '<div class="syn-pair">' +
                 '<span class="syn-side">' + esc(p.left) +
                   (p.leftNote ? '<span class="syn-note">' + esc(p.leftNote) + "</span>" : "") + "</span>" +
                 '<span class="syn-op">' + esc(p.op || "≈") + "</span>" +
                 '<span class="syn-side syn-right">' + esc(p.right) +
                   (p.rightNote ? '<span class="syn-note">' + esc(p.rightNote) + "</span>" : "") + "</span>" +
               "</div>";
      }).join("") + "</div>";
    }
    if (syn.display) return '<span class="syn-line">' + esc(syn.display) + "</span>";
    return "";
  }

  function typeFocusText(q) {
    if (q.focus) return q.focus;
    var keys = Object.keys(TYPE_FOCUS);
    for (var i = 0; i < keys.length; i++) {
      if (q.type && q.type.indexOf(keys[i]) >= 0) return TYPE_FOCUS[keys[i]];
    }
    return "";
  }

  /* ============ 解析面板 HTML ============ */
  function analysisHTML(q) {
    var keys = ["A", "B", "C", "D"];
    var h = "";

    h += '<div class="an-row"><span class="an-label">题型</span>' +
         '<div class="an-value"><span class="type-tag">' + esc(q.type) + "</span></div></div>";

    h += '<div class="an-row"><span class="an-label">正确答案</span>' +
         '<div class="an-value"><span class="answer-badge">' + esc(q.answer) + "</span>　" +
         esc(q.options[q.answer]) + "</div></div>";

    h += '<div class="an-row"><span class="an-label">定位关键词</span>' +
         '<div class="an-value">' + esc(q.keywords || "") + "</div></div>";

    h += '<div class="an-row"><span class="an-label">原文定位</span><div class="an-value">' +
         (q.locate.sids || []).map(function (s) { return sidToLabel(s); }).join("；") +
         "</div></div>";

    h += '<div class="an-row an-block"><span class="an-label">核心证据</span>' +
         '<div class="an-value">' +
         (q.evidence.quotes || []).map(function (t) {
           return '<span class="quote">“' + esc(t) + '”<br>—— ' +
                  (q.evidence.sids || []).map(sidToLabel).join("；") + "</span>";
         }).join("") +
         "</div></div>";

    h += '<div class="an-row an-block"><span class="an-label">同义替换</span>' +
         '<div class="an-value">' + synonymHTML(q) + "</div></div>";

    var focus = typeFocusText(q);
    if (focus) {
      h += '<div class="an-row an-block"><span class="an-label">本题突破重点</span>' +
           '<div class="an-value"><div class="focus-box">' + esc(focus) + "</div></div></div>";
    }

    h += '<div class="an-row an-block"><span class="an-label">正确选项分析</span>' +
         '<div class="an-value"><div class="opt-analysis is-correct-box">' +
         '<div class="oa-head">' + esc(q.answer) + '. <span class="tag">正确项</span></div>' +
         esc(q.correct) + "</div></div></div>";

    h += '<div class="an-row an-block"><span class="an-label">错误选项分析</span><div class="an-value">';
    keys.forEach(function (k) {
      if (k === q.answer) return;
      var w = q.wrong[k];
      h += '<div class="opt-analysis">' +
             '<div class="oa-head">' + k + '. <span class="tag">【' + esc(w.tag) + "】</span></div>" +
             esc(w.text) +
           "</div>";
    });
    h += "</div></div>";

    h += '<div class="an-row an-block"><span class="an-label">解题思路</span>' +
         '<div class="an-value"><div class="strategy-box">' + esc(q.strategy) + "</div></div></div>";

    return h;
  }

  /* ============ 高亮 ============ */
  function clearPassageHighlight() {
    Object.keys(sentenceEls).forEach(function (sid) {
      var node = sentenceEls[sid];
      node.className = "sent";
      node.innerHTML = esc(sentenceText[sid]);
    });
  }

  function applyPassageHighlight(q) {
    clearPassageHighlight();

    var marks = [];
    (q.locate.keywords || []).forEach(function (kw) {
      (q.locate.sids || []).forEach(function (sid) {
        marks.push({ sid: sid, text: kw, cls: "mk-key" });
      });
    });
    synonymMarks(q).forEach(function (m) { marks.push(m); });

    // 先上句子底色（绿色证据优先于黄色定位）
    (q.locate.sids || []).forEach(function (sid) {
      if (sentenceEls[sid]) sentenceEls[sid].classList.add("hl-locate");
    });
    (q.evidence.sids || []).forEach(function (sid) {
      var node = sentenceEls[sid];
      if (node) {
        node.classList.remove("hl-locate");
        node.classList.add("hl-evidence");
      }
    });

    // 再上词级标记（黄=关键词，蓝=同义替换）
    var touched = {};
    marks.forEach(function (m) { (touched[m.sid] = touched[m.sid] || []).push(m); });
    Object.keys(touched).forEach(function (sid) {
      var node = sentenceEls[sid];
      if (node) node.innerHTML = markText(sentenceText[sid], touched[sid]);
    });
  }

  /* ============ 滚动 ============ */
  function scrollIntoPanel(container, target) {
    if (!container || !target) return;
    var cr = container.getBoundingClientRect();
    var tr = target.getBoundingClientRect();
    var top = container.scrollTop + (tr.top - cr.top) - container.clientHeight / 2 + tr.height / 2;
    if (top < 0) top = 0;
    container.scrollTo({ top: top, behavior: "smooth" });
  }

  function scrollPassageTo(q) {
    var sids = (q.locate.sids || []).concat(q.evidence.sids || []);
    var target = null;
    for (var i = 0; i < sids.length; i++) {
      if (sentenceEls[sids[i]]) { target = sentenceEls[sids[i]]; break; }
    }
    scrollIntoPanel(el.passageScroll, target);
  }

  function scrollQuestionTo(index) {
    scrollIntoPanel(el.questionsScroll, cardEls[index]);
  }

  /* ============ 选题 / 导航 ============ */
  function updateCards() {
    cardEls.forEach(function (card, i) {
      if (i === state.current) card.classList.add("is-active");
      else card.classList.remove("is-active");
    });
    el.indicator.textContent = state.current >= 0
      ? "第 " + (state.current + 1) + " / " + DATA.questions.length + " 题"
      : "未选题";
    el.btnPrev.disabled = state.current <= 0;
    el.btnNext.disabled = state.current >= DATA.questions.length - 1;
    el.btnJump.hidden = state.current < 0;
  }

  function focusQuestion(index, scrollRight) {
    if (index < 0 || index >= DATA.questions.length) return;
    state.current = index;
    updateCards();

    var q = DATA.questions[index];
    if (state.mode === "solve") {
      clearPassageHighlight();
    } else {
      applyPassageHighlight(q);
      scrollPassageTo(q);
    }
    if (scrollRight !== false) scrollQuestionTo(index);
  }

  function clearAll() {
    state.current = -1;
    clearPassageHighlight();
    updateCards();
  }

  /* ============ 展开 / 收起解析 ============ */
  function toggleAnalysis(index) {
    var card = cardEls[index];
    var panel = card.querySelector(".q-analysis");
    var btn = card.querySelector(".btn-answer");
    var opts = card.querySelectorAll(".opt");

    if (!state.open[index]) {
      panel.innerHTML = analysisHTML(DATA.questions[index]);
      panel.hidden = false;
      state.open[index] = true;
      btn.textContent = "收起答案与解析";
      btn.classList.add("is-open");

      var ans = DATA.questions[index].answer;
      for (var i = 0; i < opts.length; i++) {
        var k = opts[i].getAttribute("data-key");
        if (k === ans) opts[i].classList.add("is-correct");
        else opts[i].classList.add("is-wrong");
      }
    } else {
      panel.hidden = true;
      panel.innerHTML = "";
      state.open[index] = false;
      btn.textContent = "显示答案与解析";
      btn.classList.remove("is-open");

      for (var j = 0; j < opts.length; j++) {
        opts[j].classList.remove("is-correct", "is-wrong");
      }
    }
  }

  /* ============ 模式切换 ============ */
  function setMode(mode) {
    state.mode = mode;
    document.body.classList.toggle("mode-solve", mode === "solve");
    document.body.classList.toggle("mode-teach", mode === "teach");
    document.body.classList.toggle("mode-intensive", mode === "intensive");

    el.btnSolve.classList.toggle("is-active", mode === "solve");
    el.btnTeach.classList.toggle("is-active", mode === "teach");
    el.btnIntensive.classList.toggle("is-active", mode === "intensive");

    if (mode === "solve") {
      clearPassageHighlight();
    } else if (state.current >= 0) {
      applyPassageHighlight(DATA.questions[state.current]);
    }

    renderAllSentences();
    el.tipText.textContent = MODE_TIP[mode] || "";
  }

  /* ============ 文章结构弹窗 ============ */
  function structureHTML() {
    var st = DATA.structure || {};
    var h = "";

    function block(title, body) {
      if (!body) return "";
      return '<div class="st-block"><span class="st-h">' + esc(title) + "</span>" +
             '<div class="st-p">' + body + "</div></div>";
    }

    h += block("文章主旨", esc(st.mainIdea));
    h += block("作者写作目的", esc(st.purpose));
    h += block("文章逻辑结构", esc(st.logic));

    if (st.outline && st.outline.length) {
      var inner = st.outline.map(function (o, i) {
        var item = '<div class="ot-item">' +
                     '<span class="ot-p">' + esc(o.p) + "</span>" +
                     '<span class="ot-role">' + esc(o.role) + "</span>" +
                     '<div class="ot-detail">' + esc(o.detail) + "</div>" +
                   "</div>";
        if (i < st.outline.length - 1) item += '<div class="ot-arrow">↓</div>';
        return item;
      }).join("");
      h += block("段落结构", '<div class="st-outline">' + inner + "</div>");
    }

    h += block("备考提示", esc(st.examTips));
    return h;
  }

  function openStructure() {
    el.structureBody.innerHTML = structureHTML();
    el.structureModal.hidden = false;
  }

  function closeStructure() {
    el.structureModal.hidden = true;
  }

  /* ============ 字号 ============ */
  function setScale(v) {
    state.scale = Math.min(1.6, Math.max(0.85, Math.round(v * 100) / 100));
    document.documentElement.style.setProperty("--fs", state.scale);
    el.fontValue.textContent = Math.round(state.scale * 100) + "%";
  }

  /* ============ 全屏 ============ */
  function toggleFullscreen() {
    var doc = document;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      var root = doc.documentElement;
      if (root.requestFullscreen) root.requestFullscreen();
      else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
      else if (root.msRequestFullscreen) root.msRequestFullscreen();
    } else {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
    }
  }

  /* ============ 左右栏拖动 ============ */
  function initSplitter() {
    var dragging = false;

    function moveTo(clientX) {
      var rect = el.layout.getBoundingClientRect();
      if (!rect.width) return;
      var pct = (clientX - rect.left) / rect.width * 100;
      pct = Math.min(80, Math.max(25, pct));
      el.panelLeft.style.flex = "0 0 " + pct.toFixed(1) + "%";
    }

    function start(e) {
      dragging = true;
      document.body.classList.add("dragging");
      if (e.cancelable) e.preventDefault();
    }
    function end() {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove("dragging");
    }

    el.splitter.addEventListener("mousedown", start);
    el.splitter.addEventListener("touchstart", start, { passive: false });
    document.addEventListener("mousemove", function (e) { if (dragging) moveTo(e.clientX); });
    document.addEventListener("touchmove", function (e) {
      if (dragging && e.touches && e.touches[0]) moveTo(e.touches[0].clientX);
    }, { passive: false });
    document.addEventListener("mouseup", end);
    document.addEventListener("touchend", end);
    el.splitter.addEventListener("dblclick", function () {
      el.panelLeft.style.flex = "0 0 60%";
    });
  }

  /* ============ 手机端标签切换 ============ */
  function setMobileTab(tab) {
    state.tab = tab;
    document.body.classList.toggle("m-tab-passage", tab === "passage");
    document.body.classList.toggle("m-tab-questions", tab === "questions");
    el.tabPassage.classList.toggle("is-active", tab === "passage");
    el.tabQuestions.classList.toggle("is-active", tab === "questions");
  }

  /* ============ 事件绑定 ============ */
  function bindEvents() {
    // 题目卡片：点击定位 / 展开解析
    el.questions.addEventListener("click", function (e) {
      var t = e.target;
      var btn = t.closest ? t.closest(".btn-answer") : null;
      var card = t.closest ? t.closest(".qcard") : null;
      if (!card) return;
      var index = parseInt(card.getAttribute("data-index"), 10);

      if (btn) {
        if (state.mode === "solve") return;
        toggleAnalysis(index);
        return;
      }
      focusQuestion(index, false);
    });

    // 原文句子：点击看翻译 / 精读
    el.passage.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest && t.closest(".s-read")) return;      // 精读面板内部不触发折叠
      var sent = t.closest ? t.closest(".sent") : null;
      if (!sent) return;
      toggleSentence(sent.getAttribute("data-sid"));
    });

    el.btnPrev.addEventListener("click", function () {
      if (state.current <= 0) return;
      focusQuestion(state.current - 1);
    });

    el.btnNext.addEventListener("click", function () {
      if (state.current < 0) { focusQuestion(0); return; }
      if (state.current >= DATA.questions.length - 1) return;
      focusQuestion(state.current + 1);
    });

    el.btnSolve.addEventListener("click", function () { setMode("solve"); });
    el.btnTeach.addEventListener("click", function () { setMode("teach"); });
    el.btnIntensive.addEventListener("click", function () { setMode("intensive"); });

    el.btnTrAll.addEventListener("click", showAllTranslations);
    el.btnTrNone.addEventListener("click", hideAllTranslations);

    el.btnStructure.addEventListener("click", openStructure);
    el.btnStructureClose.addEventListener("click", closeStructure);
    el.structureModal.addEventListener("click", function (e) {
      if (e.target === el.structureModal) closeStructure();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el.structureModal.hidden) closeStructure();
    });

    el.btnClear.addEventListener("click", clearAll);

    el.btnDown.addEventListener("click", function () { setScale(state.scale - 0.1); });
    el.btnUp.addEventListener("click", function () { setScale(state.scale + 0.1); });

    el.btnFull.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", function () {
      el.btnFull.textContent = document.fullscreenElement ? "退出全屏" : "全屏";
    });

    el.tabPassage.addEventListener("click", function () { setMobileTab("passage"); });
    el.tabQuestions.addEventListener("click", function () { setMobileTab("questions"); });

    el.btnJump.addEventListener("click", function () {
      if (state.current < 0) return;
      setMobileTab("passage");
      scrollPassageTo(DATA.questions[state.current]);
    });
  }

  /* ============ 初始化 ============ */
  function init() {
    if (!DATA) {
      document.body.innerHTML = '<p style="padding:40px;font-size:20px">未找到阅读数据，请检查 reading-data.js 是否存在。</p>';
      return;
    }
    buildPassage();
    buildQuestions();
    bindEvents();
    initSplitter();
    setMobileTab("passage");
    setMode("teach");
    setScale(1);
    updateCards();
  }

  init();
})();
