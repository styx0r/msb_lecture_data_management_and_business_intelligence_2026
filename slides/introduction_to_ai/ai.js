/* Interactive pieces for the Introduction to AI deck (slides/introduction_to_ai/index.html).
 *
 * Plain JavaScript, no dependencies. Four pieces:
 *   game    "Is this AI?"           click a card, the answer appears
 *   invest  "Follow the money"      private AI investment 2013-2025, bar by bar (AI Index 2026)
 *   fit     "Fit the line yourself" linear regression by hand, then by gradient descent
 *   kmeans  "Find the groups"       k-means step by step on ShopNow customers
 *   backprop "Training, live"       a 3-3-1 network on eight labelled orders, forward / compare / backward
 */
(function () {
  "use strict";

  const COL = {
    accent: "#ffa726",
    green: "#90ee90",
    blue: "#4fc3f7",
    red: "#ef5350",
    purple: "#ce93d8",
    muted: "#9e9e9e",
    text: "#dddddd",
    grid: "rgba(255,255,255,0.08)",
  };
  const CLUSTER = ["#4fc3f7", "#90ee90", "#ffa726", "#ce93d8", "#ef5350"];
  const FONT = '"Source Sans Pro", Helvetica, Arial, sans-serif';
  const $ = (id) => document.getElementById(id);
  const redraws = {}; // canvas id -> draw(), replayed when the slide is shown

  // ------------------------------------------------------------ deterministic random numbers
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rng) {
    const u = 1 - rng(), v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // ------------------------------------------------------------ canvas helpers
  function plot(c, o) {
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height;
    const ml = o.ml ?? 150, mr = o.mr ?? 60, mt = o.mt ?? 50, mb = o.mb ?? 110;
    const X = (x) => ml + ((x - o.x0) / (o.x1 - o.x0)) * (W - ml - mr);
    const Y = (y) => H - mb - ((y - o.y0) / (o.y1 - o.y0)) * (H - mt - mb);
    ctx.clearRect(0, 0, W, H);
    ctx.font = `28px ${FONT}`;
    ctx.fillStyle = COL.text;
    ctx.strokeStyle = COL.muted;
    ctx.lineWidth = 3;
    return { ctx, W, H, X, Y, ml, mr, mt, mb };
  }
  function axes(p, o) {
    const { ctx, W, H, X, Y, ml, mr, mt, mb } = p;
    ctx.strokeStyle = COL.muted;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ml, mt); ctx.lineTo(ml, H - mb); ctx.lineTo(W - mr, H - mb);
    ctx.stroke();
    ctx.fillStyle = COL.text;
    ctx.font = `26px ${FONT}`;
    ctx.textAlign = "center";
    (o.xt || []).forEach((t) => {
      ctx.fillText(typeof t === "object" ? t.l : t, X(typeof t === "object" ? t.v : t), H - mb + 36);
    });
    ctx.textAlign = "right";
    (o.yt || []).forEach((t) => {
      const y = Y(t);
      ctx.fillText(String(t), ml - 14, y + 9);
      ctx.strokeStyle = COL.grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ml, y); ctx.lineTo(W - mr, y); ctx.stroke();
    });
    ctx.textAlign = "center";
    ctx.fillStyle = COL.muted;
    if (o.xl) ctx.fillText(o.xl, (ml + W - mr) / 2, H - mb + 80);
    if (o.yl) {
      ctx.save(); ctx.translate(40, (mt + H - mb) / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText(o.yl, 0, 0); ctx.restore();
    }
    ctx.textAlign = "left";
  }
  function onClick(id, fn) { const el = $(id); if (el) el.addEventListener("click", fn); }
  function numSlider(id, fmt, onChange) {
    const el = $(id);
    const get = () => +el.value;
    const show = () => ($(id + "-v").textContent = fmt(get()));
    el.addEventListener("input", () => { show(); onChange(); });
    show();
    return { get, set: (v) => { el.value = v; show(); } };
  }
  function stepSlider(id, values, fmt, onChange) {
    const el = $(id);
    el.min = 0; el.max = values.length - 1; el.step = 1;
    const get = () => values[+el.value];
    const show = () => ($(id + "-v").textContent = fmt(get()));
    el.addEventListener("input", () => { show(); onChange(); });
    show();
    return get;
  }
  const fmt1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

  // ================================================================ 1. is this AI?
  function game() {
    const g = $("game");
    if (!g) return;
    g.querySelectorAll(".gcard").forEach((el) => el.addEventListener("click", () => el.classList.add("on")));
    onClick("game-all", () => g.querySelectorAll(".gcard").forEach((el) => el.classList.add("on")));
  }

  // ================================================================ 2. follow the money
  // Global private investment in AI (bn US$), AI Index Report 2026, Figure 4.2.2 / 4.2.3 (source: Quid).
  // 2013-2016 and the generative share before 2025 are read off the charts and rounded.
  function invest() {
    const c = $("inv-canvas");
    if (!c) return;
    const YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const PRIV = [5.6, 10.1, 13.5, 17.9, 25.72, 43.1, 58.18, 73.79, 145.4, 113.01, 104.34, 151.48, 344.66];
    const GEN = { 2019: 1.0, 2020: 2.5, 2021: 5.5, 2022: 4.0, 2023: 28.6, 2024: 50.6, 2025: 170.87 };
    const NOTE = {
      2013: "5.6 bn: a niche. A handful of deep-learning start-ups.",
      2014: "Google buys DeepMind for about 500 million dollars.",
      2015: "Google open-sources TensorFlow. Every start-up can now train networks.",
      2016: "AlphaGo beats Lee Sedol. The machine wins a game humans thought was safe.",
      2017: "\"Attention is all you need\": the transformer, the architecture behind every LLM.",
      2018: "GPT-1 and BERT: language models start to read.",
      2019: "OpenAI turns into a company, Microsoft invests 1 bn. Generative AI share: 1 bn.",
      2020: "GPT-3. The pandemic tech boom begins, everything digital gets money.",
      2021: "The boom peaks: 145 bn. Cheap money, every pitch deck says AI.",
      2022: "Interest rates rise, the money drops 22%. \"Was that the hype?\" In November: ChatGPT.",
      2023: "Down again, while ChatGPT reaches 100 million users in two months. Generative share: 29 bn.",
      2024: "The rebound: 151 bn. Generative AI is now a third of it.",
      2025: "345 bn, more than doubled. Half of it generative (171 bn). 2025 alone is more than 2013 to 2020 combined (248 bn).",
    };
    let shown = 0, timer = null;
    const gen = $("inv-gen");

    function draw() {
      const p = plot(c, { x0: -0.6, x1: YEARS.length - 0.4, y0: 0, y1: 380, ml: 150, mr: 60, mt: 60, mb: 110 });
      const { ctx, X, Y } = p;
      axes(p, { xt: YEARS.map((y, i) => ({ v: i, l: String(y) })), yt: [0, 50, 100, 150, 200, 250, 300, 350], yl: "bn US$ per year" });
      const bw = (X(1) - X(0)) * 0.62;
      for (let i = 0; i < shown; i++) {
        const v = PRIV[i], g = gen.checked ? GEN[YEARS[i]] || 0 : 0;
        ctx.fillStyle = COL.blue;
        ctx.fillRect(X(i) - bw / 2, Y(v), bw, Y(0) - Y(v));
        if (g) {
          ctx.fillStyle = COL.accent;
          ctx.fillRect(X(i) - bw / 2, Y(g), bw, Y(0) - Y(g));
        }
        ctx.fillStyle = COL.text;
        ctx.textAlign = "center";
        ctx.font = `${i === shown - 1 ? "bold " : ""}26px ${FONT}`;
        ctx.fillText(v < 20 ? v.toFixed(1) : Math.round(v), X(i), Y(v) - 12);
      }
      if (gen.checked && shown) {
        ctx.textAlign = "left";
        ctx.font = `26px ${FONT}`;
        ctx.fillStyle = COL.accent;
        ctx.fillRect(X(0) - bw / 2, 20, 30, 30);
        ctx.fillStyle = COL.text;
        ctx.fillText("of which generative AI companies", X(0) - bw / 2 + 44, 44);
      }
      if (shown === YEARS.length) {
        ctx.textAlign = "right";
        ctx.font = `bold 34px ${FONT}`;
        ctx.fillStyle = COL.accent;
        ctx.fillText("×60 since 2013", X(11) + bw / 2, Y(300));
      }
      ctx.textAlign = "left";
      const out = $("inv-out");
      if (!shown) out.innerHTML = "Press <b>play</b>. One bar per year.";
      else {
        const y = YEARS[shown - 1];
        out.innerHTML = `<b>${y}:</b> ${NOTE[y]}`;
      }
    }
    function next() { if (shown < YEARS.length) { shown++; draw(); } else stop(); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    onClick("inv-next", () => { stop(); next(); });
    onClick("inv-play", () => { stop(); if (shown === YEARS.length) shown = 0; next(); timer = setInterval(next, 900); });
    onClick("inv-reset", () => { stop(); shown = 0; draw(); });
    gen.addEventListener("change", draw);
    redraws["inv-canvas"] = draw;
    draw();
  }

  // ================================================================ 3. fit the line yourself
  function fit() {
    const c = $("fit-canvas");
    if (!c) return;
    const rng = mulberry32(7);
    const pts = [];
    for (let i = 0; i < 24; i++) {
      const x = 1 + Math.round(rng() * 190) / 10; // km, 1.0 .. 20.0
      const y = 12 + 2.2 * x + gauss(rng) * 5;
      pts.push([x, Math.max(2, Math.round(y * 10) / 10)]);
    }
    const n = pts.length;
    // closed-form best line (ordinary least squares)
    const mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n;
    const bw = pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) / pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
    const bb = my - bw * mx;

    let w = 1.0, b = 5, steps = 0, running = false, exploded = false, lastLoss = null;
    const sw = numSlider("fit-w", fmt1, () => { w = sw.get(); steps = 0; exploded = false; draw(); });
    const sb = numSlider("fit-b", (v) => String(Math.round(v)), () => { b = sb.get(); steps = 0; exploded = false; draw(); });
    const LR = [0.002, 0.005, 0.01, 0.02, 0.04];
    const lr = stepSlider("fit-lr", LR, (v) => (v >= 0.04 ? v + " (too big?)" : String(v)), () => {});
    $("fit-lr").value = 2;
    $("fit-lr-v").textContent = String(LR[2]);
    const best = $("fit-best");

    const loss = (w, b) => pts.reduce((s, p) => s + (w * p[0] + b - p[1]) ** 2, 0) / n;
    function step() {
      // gradient descent on centred x (x - mean), the usual standardisation step; the line is the same
      let gw = 0, gb = 0;
      pts.forEach(([x, y]) => { const e = w * x + b - y; gw += (2 / n) * e * (x - mx); gb += (2 / n) * e; });
      let bc = b + w * mx; // intercept at the mean distance
      w -= lr() * gw; bc -= lr() * gb; b = bc - w * mx; steps++;
      sw.set(Math.min(5, Math.max(0, w))); sb.set(Math.min(40, Math.max(0, b)));
      if (!isFinite(w) || Math.abs(w) > 1e6) exploded = true;
    }
    function draw() {
      const p = plot(c, { x0: 0, x1: 22, y0: 0, y1: 80, ml: 150, mr: 60, mt: 40, mb: 110 });
      const { ctx, X, Y } = p;
      axes(p, { xt: [0, 5, 10, 15, 20], yt: [0, 20, 40, 60, 80], xl: "distance to the customer (km)", yl: "delivery time (min)" });
      // residuals
      ctx.strokeStyle = "rgba(239,83,80,0.55)"; ctx.lineWidth = 3;
      pts.forEach(([x, y]) => { const yh = w * x + b; ctx.beginPath(); ctx.moveTo(X(x), Y(y)); ctx.lineTo(X(x), Y(Math.min(80, Math.max(0, yh)))); ctx.stroke(); });
      // best line
      if (best.checked) {
        ctx.setLineDash([14, 10]); ctx.strokeStyle = COL.green; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(X(0), Y(bb)); ctx.lineTo(X(22), Y(bw * 22 + bb)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = COL.green; ctx.font = `26px ${FONT}`; ctx.textAlign = "left";
        ctx.fillText(`best line: w = ${bw.toFixed(2)}, b = ${bb.toFixed(1)}, loss = ${loss(bw, bb).toFixed(1)}`, X(0.5), Y(74));
      }
      // current line (clipped to the plot)
      ctx.strokeStyle = COL.accent; ctx.lineWidth = 6;
      ctx.save(); ctx.beginPath(); ctx.rect(p.ml, p.mt, p.W - p.ml - p.mr, p.H - p.mt - p.mb); ctx.clip();
      ctx.beginPath(); ctx.moveTo(X(0), Y(b)); ctx.lineTo(X(22), Y(w * 22 + b)); ctx.stroke(); ctx.restore();
      // points
      pts.forEach(([x, y]) => { ctx.fillStyle = COL.blue; ctx.beginPath(); ctx.arc(X(x), Y(y), 11, 0, 2 * Math.PI); ctx.fill(); });
      const L = loss(w, b);
      ctx.fillStyle = COL.accent; ctx.font = `bold 34px ${FONT}`; ctx.textAlign = "right";
      ctx.fillText(exploded ? "loss: exploded" : `loss (MSE) = ${L > 9999 ? L.toExponential(1) : L.toFixed(1)}`, X(21.5), Y(74));
      ctx.textAlign = "left";
      const out = $("fit-out");
      if (exploded) out.innerHTML = `<b>The learning rate was too large:</b> every step overshoots, the loss grows instead of shrinking. Reset, choose a smaller step.`;
      else if (steps === 0) out.innerHTML = `Your line: ŷ = <b>${w.toFixed(2)}</b> · x + <b>${b.toFixed(1)}</b>. Loss = average squared red distance = <b>${L.toFixed(1)}</b>. Lower is better.`;
      else out.innerHTML = `After <b>${steps}</b> step${steps === 1 ? "" : "s"}: w = <b>${w.toFixed(2)}</b>, b = <b>${b.toFixed(1)}</b>, loss = <b>${L.toFixed(1)}</b>` +
        (lastLoss !== null && Math.abs(lastLoss - L) < 1e-3 ? `. The loss stopped improving: <b>training is done</b>.` : `. Each step: compute the gradient, move w and b against it.`);
    }
    function run() {
      if (running) return;
      running = true; exploded = false; lastLoss = null;
      let frames = 0;
      const tick = () => {
        const before = loss(w, b);
        for (let i = 0; i < 25 && !exploded; i++) step();
        const after = loss(w, b);
        frames++;
        if (!exploded && frames < 240 && !(Math.abs(before - after) < 1e-4)) { lastLoss = null; draw(); requestAnimationFrame(tick); }
        else { lastLoss = exploded ? null : after; running = false; draw(); }
      };
      tick();
    }
    onClick("fit-step", () => { if (!running) { exploded = false; lastLoss = null; step(); draw(); } });
    onClick("fit-run", run);
    onClick("fit-reset", () => { running = false; exploded = false; lastLoss = null; w = 1.0; b = 5; steps = 0; sw.set(w); sb.set(b); draw(); });
    best.addEventListener("change", draw);
    redraws["fit-canvas"] = draw;
    draw();
  }

  // ================================================================ 4. k-means
  function kmeans() {
    const c = $("km-canvas");
    if (!c) return;
    const rng = mulberry32(42);
    const pts = [];
    const add = (nn, mx, sx, my, sy) => { for (let i = 0; i < nn; i++) pts.push([Math.max(5, mx + gauss(rng) * sx), Math.max(0.3, my + gauss(rng) * sy)]); };
    add(40, 32, 8, 2.0, 0.7);   // value seekers: small baskets, rare orders
    add(35, 55, 10, 6.5, 1.1);  // loyalists: medium baskets, frequent orders
    add(25, 170, 28, 2.5, 0.9); // premium: large baskets, rare orders
    const XMAX = 240, YMAX = 10;
    // distances on the plot (both axes scaled to 0..1): standardisation
    const d2 = (p, q) => ((p[0] - q[0]) / XMAX) ** 2 + ((p[1] - q[1]) / YMAX) ** 2;

    let cents = [], assign = [], phase = "none", rounds = 0, moved = null, names = null, running = false;
    const sk = numSlider("km-k", (v) => String(v), () => reset());
    const K = () => sk.get();

    function init() {
      names = null; rounds = 0; moved = null; assign = [];
      const used = new Set(); cents = [];
      while (cents.length < K()) { const i = Math.floor(Math.random() * pts.length); if (!used.has(i)) { used.add(i); cents.push([pts[i][0], pts[i][1]]); } }
      phase = "init"; draw();
    }
    function doAssign() {
      if (!cents.length) return init();
      assign = pts.map((p) => { let bi = 0, bd = Infinity; cents.forEach((q, j) => { const d = d2(p, q); if (d < bd) { bd = d; bi = j; } }); return bi; });
      phase = "assigned"; names = null; draw();
    }
    function doUpdate() {
      if (!assign.length) return doAssign();
      moved = 0;
      cents = cents.map((q, j) => {
        const mine = pts.filter((_, i) => assign[i] === j);
        if (!mine.length) return q;
        const nq = [mine.reduce((s, p) => s + p[0], 0) / mine.length, mine.reduce((s, p) => s + p[1], 0) / mine.length];
        moved += Math.sqrt(d2(q, nq)); return nq;
      });
      rounds++; phase = "updated"; draw();
    }
    function run() {
      if (running) return;
      running = true;
      if (!cents.length) init();
      const loop = () => {
        doAssign();
        setTimeout(() => {
          doUpdate();
          if (moved > 1e-4 && rounds < 50) setTimeout(loop, 350);
          else { running = false; doAssign(); phase = "done"; draw(); }
        }, 350);
      };
      setTimeout(loop, 350);
    }
    function name() {
      if (!assign.length) return;
      names = cents.map(() => "");
      if (K() === 3) {
        const order = cents.map((q, j) => j).sort((a, b) => cents[b][0] - cents[a][0]);
        names[order[0]] = "premium";
        const rest = order.slice(1).sort((a, b) => cents[b][1] - cents[a][1]);
        names[rest[0]] = "loyalists"; names[rest[1]] = "value seekers";
      } else cents.forEach((q, j) => (names[j] = `group ${j + 1}: ${Math.round(q[0])} €, ${q[1].toFixed(1)} orders/month`));
      draw();
    }
    function reset() { cents = []; assign = []; phase = "none"; rounds = 0; moved = null; names = null; running = false; draw(); }

    function draw() {
      const p = plot(c, { x0: 0, x1: XMAX, y0: 0, y1: YMAX, ml: 150, mr: 60, mt: 40, mb: 110 });
      const { ctx, X, Y } = p;
      axes(p, { xt: [0, 50, 100, 150, 200], yt: [0, 2, 4, 6, 8, 10], xl: "average basket (€)", yl: "orders per month" });
      pts.forEach((pt, i) => {
        ctx.fillStyle = assign.length ? CLUSTER[assign[i]] : "#bbb";
        ctx.beginPath(); ctx.arc(X(pt[0]), Y(pt[1]), 10, 0, 2 * Math.PI); ctx.fill();
      });
      cents.forEach((q, j) => {
        ctx.strokeStyle = "#111"; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(X(q[0]) - 18, Y(q[1]) - 18); ctx.lineTo(X(q[0]) + 18, Y(q[1]) + 18); ctx.moveTo(X(q[0]) + 18, Y(q[1]) - 18); ctx.lineTo(X(q[0]) - 18, Y(q[1]) + 18); ctx.stroke();
        ctx.strokeStyle = CLUSTER[j]; ctx.lineWidth = 6; ctx.stroke();
        if (names) {
          ctx.font = `bold 30px ${FONT}`; ctx.textAlign = "center";
          const tw = ctx.measureText(names[j]).width + 24;
          ctx.fillStyle = "rgba(17,17,17,0.85)";
          ctx.fillRect(X(q[0]) - tw / 2, Y(q[1]) - 66, tw, 42);
          ctx.fillStyle = CLUSTER[j];
          ctx.fillText(names[j], X(q[0]), Y(q[1]) - 36);
        }
      });
      ctx.textAlign = "left";
      const out = $("km-out");
      const k = K();
      const msg = {
        none: `${pts.length} customers, no label, no colour. How many groups do you see? Then press <b>1</b>.`,
        init: `<b>Initialise:</b> ${k} centroids (the crosses) dropped at random. They know nothing yet. Press <b>2</b>.`,
        assigned: `<b>Assign:</b> every customer joins the nearest centroid. Press <b>3</b>.`,
        updated: `<b>Update:</b> every centroid moved to the mean of its customers (round ${rounds}, moved ${moved !== null ? (moved * 100).toFixed(1) : "?"}% of the plot). ${moved > 1e-4 ? "Still moving: press <b>2</b> again." : "<b>Nothing moved: done.</b>"}`,
        done: `<b>Converged after ${rounds} round${rounds === 1 ? "" : "s"}.</b> Output: a group number (0 to ${k - 1}) for every customer. Not a name. Press <b>name the groups</b>.`,
      }[phase];
      out.innerHTML = names
        ? (k === 3 ? `<b>Names are a human job.</b> The algorithm said "0, 1, 2". Marketing says premium, loyalists, value seekers, by looking at the centroids.`
                   : `<b>Names are a human job.</b> With k = ${k} the algorithm still delivers ${k} groups, it never says "there are really three". Marketing would have to invent ${k} names.`)
        : msg;
    }
    onClick("km-init", init);
    onClick("km-assign", doAssign);
    onClick("km-update", doUpdate);
    onClick("km-run", run);
    onClick("km-name", name);
    onClick("km-reset", reset);
    redraws["km-canvas"] = draw;
    draw();
  }

  // ------------------------------------------------------------ backprop: a 3-3-1 network, trained live
  // Eight labelled ShopNow orders. Inputs scaled to 0..1: value / 1000 €, new customer (0/1), night order (0/1).
  const BP_DATA = [
    { x: [0.05, 0, 0], y: 0, t: "50 €, known customer, daytime" },
    { x: [0.64, 1, 1], y: 1, t: "640 €, new customer, 03:14" },
    { x: [0.12, 1, 0], y: 0, t: "120 €, new customer, daytime" },
    { x: [0.75, 0, 1], y: 1, t: "750 €, known customer, 02:40" },
    { x: [0.30, 0, 0], y: 0, t: "300 €, known customer, daytime" },
    { x: [0.90, 1, 1], y: 1, t: "900 €, new customer, 01:05" },
    { x: [0.20, 0, 1], y: 0, t: "200 €, known customer, 23:50" },
    { x: [0.55, 1, 0], y: 1, t: "550 €, new customer, daytime" },
  ];
  const sig = (z) => 1 / (1 + Math.exp(-z));
  function bpNet(seed) {
    const rng = mulberry32(seed);
    const r = () => (rng() * 2 - 1) * 0.8;
    const net = {
      W1: [[r(), r(), r()], [r(), r(), r()], [r(), r(), r()]], b1: [r(), r(), r()],
      W2: [r(), r(), r()], b2: r(),
    };
    net.forward = (x) => {
      const h = net.W1.map((w, j) => sig(w[0] * x[0] + w[1] * x[1] + w[2] * x[2] + net.b1[j]));
      const o = sig(net.W2[0] * h[0] + net.W2[1] * h[1] + net.W2[2] * h[2] + net.b2);
      return { h, o };
    };
    net.backward = (x, y, lr) => {
      const { h, o } = net.forward(x);
      const d = o - y; // gradient of the cross-entropy loss at the output
      const dh = net.W2.map((w, j) => d * w * h[j] * (1 - h[j]));
      const changes = { W2: [], W1: [[], [], []] };
      for (let j = 0; j < 3; j++) { changes.W2[j] = -lr * d * h[j]; net.W2[j] += changes.W2[j]; }
      net.b2 -= lr * d;
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) { changes.W1[j][i] = -lr * dh[j] * x[i]; net.W1[j][i] += changes.W1[j][i]; }
        net.b1[j] -= lr * dh[j];
      }
      return { o, d, changes };
    };
    net.evaluate = () => {
      let loss = 0, correct = 0;
      BP_DATA.forEach((e) => {
        const o = net.forward(e.x).o;
        loss -= e.y ? Math.log(Math.max(o, 1e-9)) : Math.log(Math.max(1 - o, 1e-9));
        if ((o >= 0.5) === (e.y === 1)) correct++;
      });
      return { loss: loss / BP_DATA.length, correct };
    };
    return net;
  }
  if (typeof module !== "undefined") module.exports = { bpNet, BP_DATA };

  function backprop() {
    const svg = $("bp-svg");
    if (!svg) return;
    const NS = "http://www.w3.org/2000/svg";
    const LR = 1.0;
    const IX = 230, HX = 540, OX = 850;
    const IY = [100, 210, 320], HY = [80, 210, 340], OY = 210;
    const INP = ["value", "new customer", "night order"];
    let net, idx, phase, rounds, timer;
    const el = (tag, attrs, parent) => {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      (parent || svg).appendChild(e);
      return e;
    };
    // --- build once
    svg.innerHTML = "";
    const edges1 = [], edges2 = [], back1 = [], back2 = [];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) edges1.push(el("line", { x1: IX, y1: IY[i], x2: HX, y2: HY[j], "data-j": j, "data-i": i }));
    for (let j = 0; j < 3; j++) edges2.push(el("line", { x1: HX, y1: HY[j], x2: OX, y2: OY, "data-j": j }));
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) back1.push(el("line", { x1: HX, y1: HY[j], x2: IX, y2: IY[i], class: "bp-back", "data-j": j, "data-i": i }));
    for (let j = 0; j < 3; j++) back2.push(el("line", { x1: OX, y1: OY, x2: HX, y2: HY[j], class: "bp-back", "data-j": j }));
    const node = (x, y, cls) => {
      const g = el("g", { class: "bp-node " + cls });
      el("circle", { cx: x, cy: y, r: 34 }, g);
      const t = el("text", { x, y: y + 9, "text-anchor": "middle" }, g);
      return { g, t, c: g.firstChild };
    };
    const inN = IY.map((y) => node(IX, y, "in")), hN = HY.map((y) => node(HX, y, "hid")), oN = node(OX, OY, "out");
    const inLabel = IY.map((y, i) => { const t = el("text", { x: IX - 48, y: y + 8, "text-anchor": "end", class: "bp-lbl" }); t.textContent = INP[i]; return t; });
    const inVal = IY.map((y) => el("text", { x: IX - 48, y: y + 36, "text-anchor": "end", class: "bp-val" }));
    const outLbl = el("text", { x: OX, y: OY - 56, "text-anchor": "middle", class: "bp-lbl" }); outLbl.textContent = "P(fraud)";
    const truth = el("text", { x: OX, y: OY + 80, "text-anchor": "middle", class: "bp-truth" });
    const errT = el("text", { x: OX, y: OY + 118, "text-anchor": "middle", class: "bp-err" });
    const hdr = [el("text", { x: IX, y: 30, "text-anchor": "middle", class: "bp-hdr" }), el("text", { x: HX, y: 30, "text-anchor": "middle", class: "bp-hdr" }), el("text", { x: OX, y: 30, "text-anchor": "middle", class: "bp-hdr" })];
    hdr[0].textContent = "inputs"; hdr[1].textContent = "3 neurons"; hdr[2].textContent = "output";
    const out = $("bp-out");
    const fmt = (v) => v.toFixed(2);
    const fmtS = (v) => (v >= 0 ? "+" : "") + v.toFixed(2);

    function drawWeights(changes) {
      edges1.forEach((e) => {
        const w = net.W1[e.dataset.j][e.dataset.i];
        e.setAttribute("stroke", w >= 0 ? COL.blue : COL.red);
        e.setAttribute("stroke-width", 1 + Math.min(10, Math.abs(w) * 4));
      });
      edges2.forEach((e) => {
        const w = net.W2[e.dataset.j];
        e.setAttribute("stroke", w >= 0 ? COL.blue : COL.red);
        e.setAttribute("stroke-width", 1 + Math.min(10, Math.abs(w) * 4));
      });
      const showBack = !!changes;
      back1.forEach((e) => { e.style.opacity = showBack ? 1 : 0; if (showBack) e.setAttribute("stroke-width", 1 + Math.min(12, Math.abs(changes.W1[e.dataset.j][e.dataset.i]) * 60)); });
      back2.forEach((e) => { e.style.opacity = showBack ? 1 : 0; if (showBack) e.setAttribute("stroke-width", 1 + Math.min(12, Math.abs(changes.W2[e.dataset.j]) * 60)); });
    }
    function act(n, v) {
      // opaque fill so the weight lines stop at the node: blend background grey with the accent colour
      const m = v == null ? 0 : v, mix = (a, b) => Math.round(a + (b - a) * m);
      n.c.style.fill = `rgb(${mix(38, 255)}, ${mix(38, 167)}, ${mix(38, 38)})`;
      n.t.style.fill = m > 0.5 ? "#111" : "#eee";
      n.t.textContent = v == null ? "?" : fmt(v);
    }
    function showExample() {
      const e = BP_DATA[idx];
      inVal.forEach((t, i) => { t.textContent = i === 0 ? Math.round(e.x[0] * 1000) + " €" : e.x[i] ? "yes" : "no"; });
      inN.forEach((n, i) => act(n, e.x[i]));
      hN.forEach((n) => act(n, null));
      act(oN, null);
      truth.textContent = ""; errT.textContent = "";
      drawWeights(null);
    }
    function status(msg) {
      const ev = net.evaluate();
      out.innerHTML = `${msg}<br><span class="muted">weights updated ${rounds} ${rounds === 1 ? "time" : "times"} · average loss <b>${fmt(ev.loss)}</b> · ${ev.correct} of ${BP_DATA.length} orders classified correctly</span>`;
    }
    function reset() {
      clearInterval(timer);
      net = bpNet(11); idx = 0; phase = 0; rounds = 0;
      showExample();
      status(`Random weights (blue positive, red negative, thicker = larger). Order 1: ${BP_DATA[0].t}. Press <b>1. forward</b>.`);
    }
    function forward() {
      if (phase !== 0) return;
      const e = BP_DATA[idx];
      const { h, o } = net.forward(e.x);
      hN.forEach((n, j) => act(n, h[j]));
      act(oN, o);
      phase = 1;
      status(`Each neuron sums its inputs times its weights and squashes the result to 0..1. The output says <b>P(fraud) = ${fmt(o)}</b>. Now press <b>2. compare</b> with the label.`);
    }
    function compare() {
      if (phase !== 1) return;
      const e = BP_DATA[idx];
      const o = net.forward(e.x).o;
      truth.textContent = "label: " + (e.y ? "fraud" : "ok");
      truth.setAttribute("fill", e.y ? COL.red : COL.green);
      errT.textContent = "error " + fmtS(o - e.y);
      phase = 2;
      const big = Math.abs(o - e.y) > 0.4;
      status(`The label from the past says <b>${e.y ? "fraud" : "ok"}</b> (${e.y ? 1 : 0}), the network said ${fmt(o)}: error <b>${fmtS(o - e.y)}</b>. ${big ? "A big miss." : "Not bad."} Press <b>3. backward</b>.`);
    }
    function backward() {
      if (phase !== 2) return;
      const e = BP_DATA[idx];
      const { d, changes } = net.backward(e.x, e.y, LR);
      rounds++;
      drawWeights(changes);
      phase = 3;
      status(`The error travels backwards (orange). Every weight is nudged a little in the direction that makes <i>this</i> error smaller, the bigger the blame, the bigger the nudge (largest: ${fmtS(Math.max(...changes.W2.map(Math.abs), ...changes.W1.flat().map(Math.abs)) * (d > 0 ? -1 : 1))}). Press <b>next order</b>.`);
    }
    function next() {
      if (phase === 1 || phase === 2) return;
      idx = (idx + 1) % BP_DATA.length; phase = 0;
      showExample();
      status(`Order ${idx + 1}: ${BP_DATA[idx].t}. Press <b>1. forward</b>.`);
    }
    function train() {
      clearInterval(timer);
      let n = 0;
      timer = setInterval(() => {
        for (let k = 0; k < 4; k++) { net.backward(BP_DATA[idx].x, BP_DATA[idx].y, LR); rounds++; idx = (idx + 1) % BP_DATA.length; }
        n += 4; phase = 0;
        showExample();
        const { h, o } = net.forward(BP_DATA[idx].x);
        hN.forEach((nd, j) => act(nd, h[j])); act(oN, o);
        drawWeights(null);
        const ev = net.evaluate();
        status(`Training: forward, compare, backward, next, over and over.`);
        if (n >= 400 || (ev.correct === BP_DATA.length && ev.loss < 0.15)) {
          clearInterval(timer);
          status(`Done after ${rounds} updates. Nobody wrote a rule, the weights found it: value matters, and so does "new customer at night". Press <b>reset</b> to start from random weights again.`);
        }
      }, 120);
    }
    onClick("bp-fwd", forward);
    onClick("bp-cmp", compare);
    onClick("bp-back", backward);
    onClick("bp-next", next);
    onClick("bp-train", train);
    onClick("bp-reset", reset);
    reset();
  }

  // ------------------------------------------------------------------ init
  function init() {
    game();
    invest();
    fit();
    kmeans();
    backprop();
    if (window.Reveal && Reveal.on) {
      Reveal.on("slidechanged", (e) => {
        e.currentSlide.querySelectorAll("canvas").forEach((el) => redraws[el.id] && redraws[el.id]());
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
