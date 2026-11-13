/* Interactive pieces for the Generative AI & Agents deck (slides/generative_ai_and_agents/index.html).
 *
 * Plain JavaScript, no dependencies, no API keys. Pieces:
 *   nextword  "You are the LLM"        a tiny trigram language model trained on ShopNow texts, with temperature
 *   attn      "Attention"              hover a word, see which words it attends to (hand-made weights)
 *   scale     "How big is big?"        parameter counts as circles, total vs active (MoE)
 *   moe       "Mixture of experts"     a router sends each token to two of eight experts
 *   gpu       "How many GPUs?"         memory, cards and cost from parameter count and precision
 *   ctx       "The context window"     a chat where the window fills up and the model forgets
 *   emap      "Embeddings"             a 2D map of ShopNow terms, click for nearest neighbours
 *   trace     RAG, agent, MCP          step-through traces
 *   gcard     quiz cards               click to reveal
 */
(function () {
  "use strict";

  const COL = { accent: "#ffa726", green: "#90ee90", blue: "#4fc3f7", red: "#ef5350", purple: "#ce93d8", muted: "#9e9e9e", text: "#dddddd", grid: "rgba(255,255,255,0.08)" };
  const FONT = '"Source Sans Pro", Helvetica, Arial, sans-serif';
  const $ = (id) => document.getElementById(id);
  const onClick = (id, fn) => { const el = $(id); if (el) el.addEventListener("click", fn); };
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ============================================================ 1. "You are the LLM": a trigram model
  const CORPUS = [
    "the coffee grinder arrived two days late but it works perfectly .",
    "the coffee grinder is loud but the grind is very even .",
    "the espresso machine makes great coffee every morning .",
    "the espresso machine stopped working after one week .",
    "my order arrived on time and the shoes fit perfectly .",
    "my order arrived late and the box was damaged .",
    "my order was cancelled without any explanation .",
    "the running shoes are very comfortable and light .",
    "the running shoes are too small , i need a bigger size .",
    "the hiking boots are waterproof and very warm .",
    "delivery was fast and the packaging was fine .",
    "delivery took three weeks , that is far too long .",
    "customer service answered within one hour .",
    "customer service never answered my email .",
    "i returned the shoes because they were too small .",
    "i returned the laptop because the screen was broken .",
    "the return was easy and the refund arrived after two days .",
    "the refund took two months and many emails .",
    "the headphones sound great and the battery lasts all day .",
    "the headphones broke after two weeks .",
    "the laptop is fast and the screen is very bright .",
    "the laptop is slow and the battery is weak .",
    "great coffee , great grinder , great shop .",
    "the milk frother is small but it works perfectly .",
    "i love this shop , delivery is always fast .",
    "i will never order here again , the refund never arrived .",
    "the coffee beans are fresh and smell great .",
    "the coffee beans arrived two weeks after the order .",
    "the price is fair and the quality is good .",
    "the price is too high for this quality .",
    "the shoes look great but they are too small .",
    "the box was damaged but the grinder works perfectly .",
    "the espresso machine is loud but the coffee is great .",
    "my order arrived two days early , great service .",
    "the screen is bright and the battery lasts all day .",
    "the refund arrived after two days , great service .",
    "the delivery was late but customer service was very friendly .",
    "the grinder is small , fast and very even .",
    "the sandals are comfortable but the size is too small .",
    "the invoice was wrong and customer service fixed it within one hour .",
  ];
  const END = "<end>";

  function buildModel() {
    const tri = new Map(), bi = new Map(), uni = new Map();
    const add = (m, k, w) => { if (!m.has(k)) m.set(k, new Map()); const d = m.get(k); d.set(w, (d.get(w) || 0) + 1); };
    for (const line of CORPUS) {
      const toks = ["<s>", "<s>", ...line.split(" "), END];
      for (let i = 2; i < toks.length; i++) {
        add(tri, toks[i - 2] + " " + toks[i - 1], toks[i]);
        add(bi, toks[i - 1], toks[i]);
        uni.set(toks[i], (uni.get(toks[i]) || 0) + 1);
      }
    }
    return { tri, bi, uni };
  }
  function nextDist(model, ctx) {
    const a = ctx.length >= 2 ? ctx[ctx.length - 2] : "<s>", b = ctx.length >= 1 ? ctx[ctx.length - 1] : "<s>";
    let d = model.tri.get(a + " " + b), level = "trigram";
    if (!d) { d = model.bi.get(b); level = "bigram"; }
    if (!d) { d = model.uni; level = "unigram"; }
    const total = [...d.values()].reduce((s, v) => s + v, 0);
    const items = [...d.entries()].map(([w, c]) => ({ w, p: c / total })).sort((x, y) => y.p - x.p);
    return { items, level };
  }
  function applyTemp(items, T) {
    if (T <= 0.01) return items.map((it, i) => ({ w: it.w, p: i === 0 ? 1 : 0 }));
    const z = items.map((it) => Math.pow(it.p, 1 / T));
    const s = z.reduce((a, b) => a + b, 0);
    return items.map((it, i) => ({ w: it.w, p: z[i] / s }));
  }

  function initNextword() {
    const barsEl = $("nw-bars"), textEl = $("nw-text"), temp = $("nw-temp"), tval = $("nw-tval"), lvl = $("nw-level");
    if (!barsEl) return;
    const model = buildModel();
    const rng = mulberry32(7);
    let ctx = [];
    let T = 1;

    function render() {
      const prompt = $("nw-start").value;
      textEl.innerHTML = `<span class="muted">${prompt}</span> ` + ctx.map((w) => (w === END ? '<span class="muted">[end]</span>' : w)).join(" ") + '<span class="cursor">▌</span>';
      const base = nextDist(model, [...prompt.split(" "), ...ctx]);
      const all = applyTemp(base.items, T);
      const items = all.slice(0, 8);
      lvl.textContent = base.level === "trigram" ? "context: last two words" : base.level === "bigram" ? "context: last word only (never saw this pair)" : "context: nothing (never saw this word), guessing from word frequency";
      barsEl.innerHTML = "";
      const done = ctx.length && ctx[ctx.length - 1] === END;
      if (done) {
        lvl.textContent = "";
        const stop = document.createElement("div");
        stop.className = "nw-more";
        stop.textContent = "The end token was sampled, so generation stops here. No next word is scored. Press reset or pick another start.";
        barsEl.appendChild(stop);
        return;
      }
      items.forEach((it) => {
        const row = document.createElement("div");
        row.className = "nw-row";
        const label = it.w === END ? "[end]" : it.w;
        row.innerHTML = `<span class="nw-w">${label}</span><span class="nw-bar"><span style="width:${Math.max(1, it.p * 100)}%"></span></span><span class="nw-p">${(it.p * 100).toFixed(0)}%</span>`;
        if (!done) row.addEventListener("click", () => { ctx.push(it.w); render(); });
        barsEl.appendChild(row);
      });
      const more = document.createElement("div");
      more.className = "nw-more";
      const rest = all.length - items.length;
      const restP = all.slice(items.length).reduce((acc, it) => acc + it.p, 0) * 100;
      more.textContent = rest > 0
        ? `top 8 of ${all.length} shown, cut off here: the other ${rest} words share ${restP < 0.5 ? "less than 1" : restP.toFixed(0)} % between them. A real LLM scores all ~100,000 tokens at every step.`
        : `nothing cut off: in 40 reviews these ${all.length} ${all.length === 1 ? "word is" : "words are"} all the model ever saw after this context. A real LLM scores all ~100,000 tokens at every step.`;
      barsEl.appendChild(more);
    }
    function sampleOne() {
      if (ctx.length && ctx[ctx.length - 1] === END) return false;
      const prompt = $("nw-start").value;
      const items = applyTemp(nextDist(model, [...prompt.split(" "), ...ctx]).items, T);
      let r = rng(), acc = 0, pick = items[items.length - 1].w;
      for (const it of items) { acc += it.p; if (r <= acc) { pick = it.w; break; } }
      ctx.push(pick);
      return pick !== END;
    }
    temp.addEventListener("input", () => { T = parseFloat(temp.value); tval.textContent = T.toFixed(1); render(); });
    $("nw-start").addEventListener("change", () => { ctx = []; render(); });
    onClick("nw-sample", () => { sampleOne(); render(); });
    onClick("nw-auto", () => { for (let i = 0; i < 25; i++) if (!sampleOne()) break; render(); });
    onClick("nw-reset", () => { ctx = []; render(); });
    tval.textContent = T.toFixed(1);
    render();
  }

  // ============================================================ 2. attention
  const ATT = {
    small: {
      words: ["The", "customer", "returned", "the", "shoes", "because", "they", "were", "too", "small", "."],
      focus: 6,
      w: { 1: 0.15, 4: 0.75, 6: 0.1 },
      note: "\"they\" points at the shoes: shoes can be too small, customers cannot.",
    },
    angry: {
      words: ["The", "customer", "returned", "the", "shoes", "because", "they", "were", "very", "angry", "."],
      focus: 6,
      w: { 1: 0.78, 4: 0.12, 6: 0.1 },
      note: "same word, same position: now \"they\" points at the customer. Only the last words changed.",
    },
  };
  function initAttention() {
    const box = $("attn");
    if (!box) return;
    let cur = "small";
    function render() {
      const s = ATT[cur];
      box.innerHTML = "";
      s.words.forEach((w, i) => {
        const span = document.createElement("span");
        span.className = "aw" + (i === s.focus ? " focus" : "");
        span.textContent = w;
        if (s.w[i] !== undefined && i !== s.focus) {
          span.style.background = `rgba(255,167,38,${0.15 + s.w[i] * 0.75})`;
          span.title = `attention weight ${s.w[i].toFixed(2)}`;
          const t = document.createElement("small"); t.textContent = (s.w[i] * 100).toFixed(0) + "%"; span.appendChild(t);
        }
        box.appendChild(span);
      });
      $("attn-note").textContent = s.note;
      document.querySelectorAll("[data-attn]").forEach((b) => b.classList.toggle("primary", b.dataset.attn === cur));
    }
    document.querySelectorAll("[data-attn]").forEach((b) => b.addEventListener("click", () => { cur = b.dataset.attn; render(); }));
    render();
  }

  // ============================================================ 3. scale: parameters as circles
  const MODELS = [
    { name: "GPT-2", year: 2019, total: 1.5, active: 1.5, open: true, note: "the first one that wrote readable paragraphs" },
    { name: "GPT-3", year: 2020, total: 175, active: 175, open: false, note: "100x bigger, the base of the first ChatGPT" },
    { name: "GPT-4", year: 2023, total: 1800, active: 280, open: false, note: "size never published, about 1.8 trillion by community estimates, mixture of experts", est: true },
    { name: "Llama 3.1", year: 2024, total: 405, active: 405, open: true, note: "Meta, open weights: you can download and run it" },
    { name: "DeepSeek-V3", year: 2024, total: 671, active: 37, open: true, note: "open weights, 671 B in total but only 37 B work on each token" },
    { name: "Kimi K2", year: 2025, total: 1000, active: 32, open: true, note: "one trillion parameters, open weights, 32 B active" },
    { name: "gpt-oss-120b", year: 2025, total: 117, active: 5, open: true, note: "OpenAI's open-weights model: 5 B active, runs on one 80 GB card" },
  ];
  function initScale() {
    const c = $("scale-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height;
    let shown = 1;
    const rmax = 150;
    const R = (p) => Math.max(4, Math.sqrt(p / 1800) * rmax);
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.font = `26px ${FONT}`; ctx.textAlign = "center";
      const n = MODELS.length, slot = (W - 80) / n;
      MODELS.forEach((m, i) => {
        if (i >= shown) return;
        const x = 40 + slot * (i + 0.5), y = 230;
        ctx.beginPath(); ctx.arc(x, y, R(m.total), 0, Math.PI * 2);
        ctx.fillStyle = m.open ? "rgba(144,238,144,0.18)" : "rgba(79,195,247,0.18)";
        ctx.strokeStyle = m.open ? COL.green : COL.blue; ctx.lineWidth = 3; ctx.fill(); ctx.stroke();
        if (m.active < m.total) {
          ctx.beginPath(); ctx.arc(x, y, R(m.active), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,167,38,0.55)"; ctx.fill();
        }
        ctx.fillStyle = COL.text; ctx.font = `bold 26px ${FONT}`;
        ctx.fillText(m.name, x, 420);
        ctx.font = `22px ${FONT}`; ctx.fillStyle = COL.muted;
        ctx.fillText(m.year, x, 450);
        ctx.fillStyle = COL.accent;
        ctx.fillText((m.total >= 1000 ? (m.total / 1000).toFixed(1) + " T" : m.total + " B") + (m.est ? " (est.)" : ""), x, 482);
        if (m.active < m.total) { ctx.fillStyle = COL.accent; ctx.fillText(m.active + " B active", x, 510); }
      });
      ctx.textAlign = "left"; ctx.font = `22px ${FONT}`;
      ctx.fillStyle = COL.green; ctx.fillText("green: open weights", 40, 40);
      ctx.fillStyle = COL.blue; ctx.fillText("blue: closed, API only", 300, 40);
      ctx.fillStyle = COL.accent; ctx.fillText("orange core: parameters active per token (mixture of experts)", 560, 40);
      const out = $("scale-out");
      const m = MODELS[shown - 1];
      out.innerHTML = `<b>${m.name} (${m.year})</b>: ${m.note}. Circle area = parameters.`;
    }
    onClick("scale-next", () => { shown = Math.min(MODELS.length, shown + 1); draw(); });
    onClick("scale-all", () => { shown = MODELS.length; draw(); });
    onClick("scale-reset", () => { shown = 1; draw(); });
    draw();
  }

  // ============================================================ 4. mixture of experts router
  const MOE_TOKENS = [
    { t: "espresso", e: [2, 5], why: "food and products" },
    { t: "invoice", e: [1, 7], why: "finance and forms" },
    { t: "def", e: [3, 6], why: "code" },
    { t: "München", e: [4, 8], why: "German and places" },
    { t: "refund", e: [1, 5], why: "finance and shopping" },
    { t: "SELECT", e: [3, 7], why: "code and tables" },
  ];
  function initMoe() {
    const svg = $("moe");
    if (!svg) return;
    let i = -1;
    function render() {
      const tok = i >= 0 ? MOE_TOKENS[i % MOE_TOKENS.length] : null;
      for (let k = 1; k <= 8; k++) {
        const el = svg.querySelector(`#moe-e${k}`);
        const on = tok && tok.e.includes(k);
        el.setAttribute("fill", on ? "rgba(255,167,38,0.75)" : "rgba(255,255,255,0.08)");
        el.setAttribute("stroke", on ? COL.accent : "rgba(255,255,255,0.3)");
        const line = svg.querySelector(`#moe-l${k}`);
        line.setAttribute("stroke", on ? COL.accent : "rgba(255,255,255,0.15)");
        line.setAttribute("stroke-width", on ? 5 : 2);
      }
      svg.querySelector("#moe-tok").textContent = tok ? `"${tok.t}"` : "token";
      $("moe-out").innerHTML = tok ? `token <b>${tok.t}</b> goes to experts ${tok.e.join(" and ")} (${tok.why}). The other six do nothing: 2 of 8 active.` : "click \"next token\"";
    }
    onClick("moe-next", () => { i++; render(); });
    render();
  }

  // ============================================================ 5. GPU calculator
  function initGpu() {
    const p = $("gpu-params");
    if (!p) return;
    const out = $("gpu-out"), prec = $("gpu-prec"), pv = $("gpu-pval");
    function calc() {
      const B = parseFloat(p.value), bytes = parseFloat(prec.value);
      pv.textContent = B >= 1000 ? (B / 1000).toFixed(1) + " T" : B + " B";
      const gb = B * bytes; // 1e9 params * bytes = GB
      const withCache = gb * 1.2;
      const cards = Math.ceil(withCache / 80);
      const buy = cards * 30000, rent = cards * 2.5 * 730;
      out.innerHTML = `<b>${B} billion</b> parameters x <b>${bytes}</b> bytes = <b>${gb.toFixed(0)} GB</b> of weights, about <b>${withCache.toFixed(0)} GB</b> with working memory for the context.<br>` +
        `That is <b>${cards}</b> card${cards > 1 ? "s" : ""} with 80 GB each (H100). Buying: about <b>${(buy / 1000).toFixed(0)} k$</b>. Renting: about <b>${rent.toFixed(0)} $ per month</b> at 2.5 $ per card-hour, running 24/7.`;
    }
    p.addEventListener("input", calc); prec.addEventListener("change", calc);
    document.querySelectorAll("[data-gpu]").forEach((b) => b.addEventListener("click", () => { p.value = b.dataset.gpu; calc(); }));
    calc();
  }

  // ============================================================ 6. the context window
  function initCtx() {
    const log = $("ctx-log");
    if (!log) return;
    const input = $("ctx-input"), bar = $("ctx-bar"), size = $("ctx-size"), out = $("ctx-out");
    const SYSTEM = "You are ShopNow's assistant. Be brief.";
    let msgs = [];
    let totalSent = 0;
    const tokens = (s) => Math.max(1, Math.round(s.trim().split(/\s+/).length * 1.3));
    function reply(text) {
      const t = text.toLowerCase();
      const m = t.match(/my name is (\w+)/);
      if (m) return `Nice to meet you, ${m[1][0].toUpperCase() + m[1].slice(1)}. How can I help with your order?`;
      if (t.includes("my name")) {
        for (let i = msgs.length - 1; i >= 0; i--) {
          const mm = msgs[i].role === "user" && msgs[i].text.toLowerCase().match(/my name is (\w+)/);
          if (mm) return `Your name is ${mm[1][0].toUpperCase() + mm[1].slice(1)}.`;
        }
        return "I do not know your name, you have not told me in this conversation.";
      }
      if (t.includes("order")) return "I can see order 1042: shipped yesterday, arriving tomorrow.";
      if (t.includes("refund") || t.includes("return")) return "Returns are free within 30 days, refunds take 2 to 5 days.";
      if (t.includes("coffee") || t.includes("grinder")) return "The ShopNow grinder G2 is our bestseller, 89 EUR, in stock.";
      return "Understood. Anything else about your order?";
    }
    function windowFit() {
      const limit = parseInt(size.value, 10);
      let used = tokens(SYSTEM);
      let keep = [];
      for (let i = msgs.length - 1; i >= 0; i--) {
        const tk = tokens(msgs[i].text);
        if (used + tk > limit) break;
        used += tk; keep.unshift(msgs[i]);
      }
      return { keep, used, limit };
    }
    function render(sentNow) {
      const { keep, used, limit } = windowFit();
      log.innerHTML = `<div class="msg sys">system: ${SYSTEM} <span class="muted">(${tokens(SYSTEM)} tokens)</span></div>`;
      msgs.forEach((m) => {
        const inWin = keep.includes(m);
        log.innerHTML += `<div class="msg ${m.role}${inWin ? "" : " dropped"}">${m.role}: ${m.text} <span class="muted">(${tokens(m.text)} tokens${inWin ? "" : ", fell out of the window"})</span></div>`;
      });
      log.scrollTop = log.scrollHeight;
      const pct = Math.min(100, (used / limit) * 100);
      bar.style.width = pct + "%";
      bar.style.background = pct > 85 ? COL.red : COL.accent;
      $("ctx-used").textContent = `${used} / ${limit} tokens in the window`;
      out.innerHTML = (sentNow ? `this request sent <b>${sentNow}</b> tokens (the whole window, again). ` : "") + `Total sent so far: <b>${totalSent}</b> tokens, about <b>${(totalSent / 1e6 * 1.25 * 100).toFixed(3)} cents</b> at 1.25 $ per million input tokens.`;
    }
    function send() {
      const text = input.value.trim();
      if (!text) return;
      msgs.push({ role: "user", text });
      // the model only sees what is in the window
      const { keep, used } = windowFit();
      const visible = msgs.filter((m) => keep.includes(m));
      const saved = msgs; msgs = visible; const r = reply(text); msgs = saved;
      totalSent += used;
      msgs.push({ role: "assistant", text: r });
      input.value = "";
      render(used);
    }
    onClick("ctx-send", send);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); send(); } });
    size.addEventListener("change", () => render());
    onClick("ctx-reset", () => { msgs = []; totalSent = 0; render(); });
    document.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => { input.value = b.dataset.say; send(); }));
    render();
  }

  // ============================================================ 7. embedding map
  const TERMS = [
    ["espresso machine", 130, 60], ["coffee grinder", 210, 100], ["Kaffeemühle", 240, 135], ["milk frother", 100, 125], ["coffee beans", 170, 180], ["French press", 60, 80],
    ["running shoes", 760, 60], ["Laufschuhe", 800, 100], ["sneakers", 700, 120], ["hiking boots", 840, 170], ["sandals", 690, 200],
    ["laptop", 440, 330], ["monitor", 500, 380], ["headphones", 370, 380], ["phone charger", 430, 430], ["USB cable", 500, 450],
    ["return policy", 800, 320], ["Rückgabe", 840, 355], ["refund", 740, 370], ["invoice", 690, 420], ["delivery time", 820, 410], ["track my order", 760, 450],
    ["birthday gift", 350, 200], ["for coffee lovers", 290, 150], ["gift card", 400, 250],
  ];
  function initEmap() {
    const c = $("emap");
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height;
    let sel = -1;
    const dist = (a, b) => Math.hypot(a[1] - b[1], a[2] - b[2]);
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.font = `24px ${FONT}`; ctx.textAlign = "left";
      let near = [];
      if (sel >= 0) {
        near = TERMS.map((t, i) => ({ i, d: dist(TERMS[sel], t) })).filter((x) => x.i !== sel).sort((a, b) => a.d - b.d).slice(0, 4);
        near.forEach((n) => {
          ctx.beginPath(); ctx.moveTo(TERMS[sel][1], TERMS[sel][2]); ctx.lineTo(TERMS[n.i][1], TERMS[n.i][2]);
          ctx.strokeStyle = "rgba(255,167,38,0.6)"; ctx.lineWidth = 2; ctx.stroke();
        });
      }
      TERMS.forEach((t, i) => {
        const isSel = i === sel, isNear = near.some((n) => n.i === i);
        ctx.beginPath(); ctx.arc(t[1], t[2], isSel ? 9 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? COL.accent : isNear ? "#ffd180" : COL.blue; ctx.fill();
        ctx.fillStyle = isSel || isNear ? "#fff" : COL.text;
        ctx.font = (isSel ? "bold " : "") + `24px ${FONT}`;
        ctx.fillText(t[0], t[1] + 10, t[2] + 6);
      });
      const out = $("emap-out");
      if (sel < 0) out.innerHTML = "click a term";
      else out.innerHTML = `nearest to <b>${TERMS[sel][0]}</b>: ` + near.map((n) => `${TERMS[n.i][0]} <span class="muted">(${n.d.toFixed(0)})</span>`).join(", ") + `. <span class="muted">Smaller number = closer = more similar meaning.</span>`;
    }
    c.addEventListener("click", (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
      let best = -1, bd = 40;
      TERMS.forEach((t, i) => { const d = Math.hypot(t[1] - x, t[2] - y); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { sel = best; draw(); }
    });
    draw();
  }

  // ============================================================ 8. step-through traces
  function initTraces() {
    document.querySelectorAll("[data-trace]").forEach((box) => {
      const steps = [...box.querySelectorAll(".tstep")];
      let n = 1;
      const show = () => steps.forEach((s, i) => s.classList.toggle("on", i < n));
      box.querySelectorAll(".trace-next").forEach((b) => b.addEventListener("click", () => { n = Math.min(steps.length, n + 1); show(); }));
      box.querySelectorAll(".trace-all").forEach((b) => b.addEventListener("click", () => { n = steps.length; show(); }));
      box.querySelectorAll(".trace-reset").forEach((b) => b.addEventListener("click", () => { n = 1; show(); }));
      show();
    });
  }

  // ============================================================ 9. quiz cards
  function initCards() {
    document.querySelectorAll(".gcard").forEach((el) => el.addEventListener("click", () => el.classList.add("on")));
    document.querySelectorAll("[data-reveal]").forEach((b) => b.addEventListener("click", () => {
      document.querySelectorAll(b.dataset.reveal + " .gcard").forEach((el) => el.classList.add("on"));
    }));
  }

  function init() {
    initNextword(); initAttention(); initScale(); initMoe(); initGpu(); initCtx(); initEmap(); initTraces(); initCards();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
