/* Interactive simulations for the A/B testing deck (slides/ab_testing/index.html).
 *
 * Plain JavaScript, no dependencies. Every sim* function wires one slide: it reads
 * the slide's controls, simulates with Math.random, draws on a <canvas> and writes
 * a summary line. All conversions are simulated as coin flips with the baseline
 * rate P0 (ShopNow checkout: 5%), the same model as make_figures.py.
 */
(function () {
  "use strict";

  const P0 = 0.05;
  const COL = {
    accent: "#ffa726",
    green: "#90ee90",
    blue: "#4fc3f7",
    red: "#ef5350",
    muted: "#9e9e9e",
    text: "#dddddd",
    grid: "rgba(255,255,255,0.08)",
  };
  const FONT = '"Source Sans Pro", Helvetica, Arial, sans-serif';
  const DPR = 2; // canvases are drawn at 2x their CSS size

  // ------------------------------------------------------------ statistics
  function erf(x) {
    // Abramowitz & Stegun 7.1.26, max error 1.5e-7
    const s = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y =
      1 -
      ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
        t *
        Math.exp(-x * x);
    return s * y;
  }
  const phi = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const Phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2));

  function zq(p) {
    // inverse normal CDF (Acklam's algorithm, relative error 1.15e-9)
    const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
    const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
    const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
    const plow = 0.02425;
    let q, r;
    if (p < plow) {
      q = Math.sqrt(-2 * Math.log(p));
      return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    if (p <= 1 - plow) {
      q = p - 0.5;
      r = q * q;
      return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    }
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  function gauss() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function binom(n, p) {
    // number of buyers among n visitors with conversion rate p
    if (p <= 0) return 0;
    if (p >= 1) return n;
    const v = n * p * (1 - p);
    if (v > 30) {
      const x = Math.round(n * p + Math.sqrt(v) * gauss());
      return Math.max(0, Math.min(n, x));
    }
    let k = 0;
    for (let i = 0; i < n; i++) if (Math.random() < p) k++;
    return k;
  }

  function ztest(xa, na, xb, nb) {
    // two-sample z-test for proportions (statsmodels.proportions_ztest), B minus A
    const pa = xa / na, pb = xb / nb;
    const pool = (xa + xb) / (na + nb);
    const se = Math.sqrt(pool * (1 - pool) * (1 / na + 1 / nb));
    const z = se > 0 ? (pb - pa) / se : 0;
    return { pa, pb, diff: pb - pa, z, p: 2 * (1 - Phi(Math.abs(z))) };
  }

  const cohenH = (p1, p2) => 2 * Math.asin(Math.sqrt(p2)) - 2 * Math.asin(Math.sqrt(p1));

  function powerFor(p0, delta, n, alpha) {
    // power of a two-sided test with n users per group (statsmodels NormalIndPower)
    const s = Math.abs(cohenH(p0, p0 + delta)) * Math.sqrt(n / 2);
    const za = zq(1 - alpha / 2);
    return Phi(-za - s) + 1 - Phi(za - s);
  }

  function nFor(p0, delta, alpha, power) {
    const h = Math.abs(cohenH(p0, p0 + delta));
    return 2 * Math.pow((zq(1 - alpha / 2) + zq(power)) / h, 2);
  }

  function mdeFor(p0, n, alpha, power) {
    // smallest absolute lift that reaches the target power with n users per group
    let lo = 1e-6, hi = 1 - p0 - 1e-6;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (powerFor(p0, mid, n, alpha) >= power) hi = mid;
      else lo = mid;
    }
    return hi;
  }

  // ---------------------------------------------------------- formatting
  const fmtInt = (x) => Math.round(x).toLocaleString("en-US");
  const fmtPct = (x, d = 1) => (x * 100).toFixed(d) + "%";
  const fmtPP = (x, d = 2) => (x >= 0 ? "+" : "") + x.toFixed(d) + " pp";
  const fmtP = (p) => (p < 0.0001 ? "p < 0.0001" : "p = " + p.toFixed(p < 0.01 ? 4 : 3));

  // -------------------------------------------------------------- canvas
  function canvas(id) {
    const el = document.getElementById(id);
    const ctx = el.getContext("2d");
    return { el, ctx, W: el.width / DPR, H: el.height / DPR };
  }

  function clear(c) {
    c.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.ctx.clearRect(0, 0, c.W, c.H);
    c.ctx.font = "15px " + FONT;
    c.ctx.lineJoin = "round";
  }

  function text(ctx, s, x, y, o = {}) {
    ctx.save();
    ctx.fillStyle = o.color || COL.text;
    ctx.font = (o.bold ? "600 " : "") + (o.size || 15) + "px " + FONT;
    ctx.textAlign = o.align || "left";
    ctx.textBaseline = o.baseline || "alphabetic";
    ctx.fillText(s, x, y);
    ctx.restore();
  }

  // a plot area inside a canvas with data-to-pixel scales
  function plot(c, o) {
    const ml = o.ml ?? 60, mr = o.mr ?? 20, mt = o.mt ?? 24, mb = o.mb ?? 46;
    const left = (o.left ?? 0) + ml, right = (o.right ?? c.W) - mr;
    const top = o.top ?? mt, bottom = o.bottom ?? c.H - mb; // top/bottom: explicit panel bounds (stacked plots)
    const fx = o.xlog ? Math.log10 : (v) => v;
    const x0 = fx(o.x0), x1 = fx(o.x1);
    return {
      c, ctx: c.ctx, left, right, top, bottom, x0: o.x0, x1: o.x1, y0: o.y0, y1: o.y1,
      x: (v) => left + ((fx(v) - x0) / (x1 - x0)) * (right - left),
      y: (v) => bottom - ((v - o.y0) / (o.y1 - o.y0)) * (bottom - top),
    };
  }

  function axes(p, o = {}) {
    const { ctx } = p;
    ctx.save();
    ctx.strokeStyle = COL.muted;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p.left, p.top);
    ctx.lineTo(p.left, p.bottom);
    ctx.lineTo(p.right, p.bottom);
    ctx.stroke();
    (o.xticks || []).forEach((v) => {
      const x = p.x(v);
      ctx.beginPath();
      ctx.moveTo(x, p.bottom);
      ctx.lineTo(x, p.bottom + 5);
      ctx.stroke();
      text(ctx, o.xfmt ? o.xfmt(v) : String(v), x, p.bottom + 19, { align: "center", size: 13 });
    });
    (o.yticks || []).forEach((v) => {
      const y = p.y(v);
      ctx.beginPath();
      ctx.moveTo(p.left - 5, y);
      ctx.lineTo(p.left, y);
      ctx.stroke();
      if (o.ygrid) {
        ctx.save();
        ctx.strokeStyle = COL.grid;
        ctx.beginPath();
        ctx.moveTo(p.left, y);
        ctx.lineTo(p.right, y);
        ctx.stroke();
        ctx.restore();
      }
      text(ctx, o.yfmt ? o.yfmt(v) : String(v), p.left - 8, y + 4, { align: "right", size: 13 });
    });
    if (o.xlabel) text(ctx, o.xlabel, (p.left + p.right) / 2, p.bottom + 38, { align: "center", size: 14 });
    if (o.ylabel) {
      ctx.save();
      ctx.translate(p.left - 44, (p.top + p.bottom) / 2);
      ctx.rotate(-Math.PI / 2);
      text(ctx, o.ylabel, 0, 0, { align: "center", size: 14 });
      ctx.restore();
    }
    if (o.title) text(ctx, o.title, (p.left + p.right) / 2, p.top - 8, { align: "center", size: 14, color: COL.muted });
    ctx.restore();
  }

  function polyline(p, xs, ys, color, width = 2.5, dash = []) {
    const { ctx } = p;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    xs.forEach((v, i) => (i ? ctx.lineTo(p.x(v), p.y(ys[i])) : ctx.moveTo(p.x(v), p.y(ys[i]))));
    ctx.stroke();
    ctx.restore();
  }

  function vline(p, v, color, dash = [6, 4], width = 2) {
    const { ctx } = p;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(p.x(v), p.top);
    ctx.lineTo(p.x(v), p.bottom);
    ctx.stroke();
    ctx.restore();
  }

  function hline(p, v, color, dash = [6, 4], width = 2) {
    const { ctx } = p;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(p.left, p.y(v));
    ctx.lineTo(p.right, p.y(v));
    ctx.stroke();
    ctx.restore();
  }

  function legend(ctx, x, y, items) {
    items.forEach(([label, color], i) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(x, y + i * 20 - 9, 18, 10);
      ctx.restore();
      text(ctx, label, x + 26, y + i * 20, { size: 13 });
    });
  }

  function niceTicks(lo, hi, n = 6) {
    const raw = (hi - lo) / n;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((s) => s * mag).find((s) => s >= raw);
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(6));
    return out;
  }

  // ------------------------------------------------------------ controls
  const $ = (id) => document.getElementById(id);

  // range input with a fixed list of values (for log-ish scales), shows the value in #id-v
  function stepSlider(id, values, fmt, onChange) {
    const el = $(id);
    el.min = 0;
    el.max = values.length - 1;
    el.step = 1;
    const get = () => values[+el.value];
    const show = () => ($(id + "-v").textContent = fmt(get()));
    el.addEventListener("input", () => { show(); onChange(); });
    show();
    return get;
  }

  function numSlider(id, fmt, onChange) {
    const el = $(id);
    const get = () => +el.value;
    const show = () => ($(id + "-v").textContent = fmt(get()));
    el.addEventListener("input", () => { show(); onChange(); });
    show();
    return get;
  }

  function onClick(id, fn) {
    const el = $(id);
    if (el) el.addEventListener("click", fn);
  }

  const N_STEPS = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000];
  const redraws = {}; // canvas id -> draw(), redrawn when the slide is shown

  // ================================================================ 1. noise
  // A/A (or A/B) test repeated many times: histogram of the observed lift
  function simNoise() {
    if (!$("noise-canvas")) return;
    const c = canvas("noise-canvas");
    let diffs = [], sig = [], last = null;
    const reset = () => { diffs = []; sig = []; last = null; draw(); };
    const getN = stepSlider("noise-n", N_STEPS, fmtInt, reset);
    const getD = numSlider("noise-d", (v) => fmtPP(v, 2), reset);

    // Significance on this slide uses the noise of the known 5% baseline (SE under H0), so that
    // "p < 0.05" and the grey band are exactly the same rule: orange = outside the band.
    const Z = zq(0.975);
    const seNull = (n) => Math.sqrt((2 * P0 * (1 - P0)) / n);
    function run(k) {
      const n = getN(), d = getD() / 100, se = seNull(n);
      for (let i = 0; i < k; i++) {
        const a = binom(n, P0), b = binom(n, P0 + d);
        const pa = a / n, pb = b / n, diff = pb - pa, z = diff / se;
        const t = { pa, pb, diff, z, p: 2 * (1 - Phi(Math.abs(z))) };
        diffs.push(diff * 100);
        sig.push(Math.abs(z) > Z);
        last = { a, b, n, t };
      }
      draw();
    }

    const N_total = () => diffs.length;
    function draw() {
      const n = getN(), d = getD();
      const se = seNull(n) * 100;
      const half = Math.max(4.5 * se, 0.75);
      // bins aligned to the band: 8 bins per half band, so the band edges are bin edges
      const w = (Z * se) / 8;
      const x0 = Math.floor((d - half) / w) * w, x1 = Math.ceil((d + half) / w) * w;
      const bins = Math.round((x1 - x0) / w);
      const cntAll = new Array(bins).fill(0), cntSig = new Array(bins).fill(0);
      diffs.forEach((v, i) => {
        const b = Math.min(bins - 1, Math.max(0, Math.floor((v - x0) / w)));
        cntAll[b]++;
        if (sig[i]) cntSig[b]++;
      });
      const ymax = Math.max(5, ...cntAll) * 1.45; // headroom for the band and lift labels
      clear(c);
      const p = plot(c, { x0, x1, y0: 0, y1: ymax, ml: 64 });
      // noise band: 95% of A/A experiments land inside +-1.96 SE (Z * se), set only by n and the baseline rate
      {
        const { ctx } = p, lo = Math.max(x0, -Z * se), hi = Math.min(x1, Z * se);
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fillRect(p.x(lo), p.top, p.x(hi) - p.x(lo), p.bottom - p.top);
        ctx.strokeStyle = COL.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(p.x(lo), p.top); ctx.lineTo(p.x(lo), p.bottom);
        ctx.moveTo(p.x(hi), p.top); ctx.lineTo(p.x(hi), p.bottom); ctx.stroke();
        ctx.restore();
      }
      axes(p, {
        xticks: niceTicks(x0, x1, 10), xfmt: (v) => (v > 0 ? "+" : "") + v,
        yticks: niceTicks(0, ymax, 4), ygrid: true,
        xlabel: "observed lift B - A (percentage points)", ylabel: "experiments",
      });
      const { ctx } = p;
      for (let b = 0; b < bins; b++) {
        if (!cntAll[b]) continue;
        const xl = p.x(x0 + b * w) + 1, xr = p.x(x0 + (b + 1) * w) - 1;
        ctx.fillStyle = COL.blue;
        ctx.fillRect(xl, p.y(cntAll[b] - cntSig[b]), xr - xl, p.bottom - p.y(cntAll[b] - cntSig[b]));
        ctx.fillStyle = COL.accent;
        ctx.fillRect(xl, p.y(cntAll[b]), xr - xl, p.y(cntAll[b] - cntSig[b]) - p.y(cntAll[b]));
      }
      if (N_total() >= 30) {
        // what the formula predicts: a bell curve with mean = true lift and SD = SE, scaled to counts per bin
        const xs = [], ys = [];
        for (let i = 0; i <= 120; i++) {
          const v = x0 + ((x1 - x0) * i) / 120;
          xs.push(v);
          ys.push((N_total() * w * Math.exp(-0.5 * Math.pow((v - d) / se, 2))) / (se * Math.sqrt(2 * Math.PI)));
        }
        polyline(p, xs, ys, COL.green, 2, [8, 5]);
      }
      if (last) {
        // marker on the bin of the most recent experiment
        const v = last.t.diff * 100, b = Math.min(bins - 1, Math.max(0, Math.floor((v - x0) / w)));
        const mx = p.x(x0 + (b + 0.5) * w), my = p.y(cntAll[b]) - 6;
        ctx.save();
        ctx.fillStyle = COL.text;
        ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx - 7, my - 12); ctx.lineTo(mx + 7, my - 12); ctx.closePath(); ctx.fill();
        ctx.restore();
        text(ctx, "last experiment", mx, my - 17, { align: "center", color: COL.text, size: 12 });
      }
      vline(p, 0, COL.text, [], 1);
      const bx = p.x(Math.min(x1, Z * se)) - 6;
      text(ctx, "noise alone: \u00b1" + (Z * se).toFixed(2) + " pp (95%)", bx, p.top + 34, { align: "right", color: COL.muted, size: 13 });
      text(ctx, "calculated from the expected bell curve (normal distribution), not from the reruns", bx, p.top + 50, { align: "right", color: COL.muted, size: 11 });
      if (d !== 0) {
        vline(p, d, COL.green);
        const inside = Math.abs(d) < Z * se;
        text(ctx, "true lift " + fmtPP(d, 2) + (inside ? " (inside the noise)" : " (outside the noise)"), p.x(d) + 6, p.top + 14, { color: COL.green, size: 13 });
      }
      legend(ctx, p.right - 210, p.top + 14, [["significant (p < α = 5%)", COL.accent], ["not significant", COL.blue], ["formula (bell curve)", COL.green]]);
      if (!diffs.length) text(ctx, "click 'run' to simulate", (p.left + p.right) / 2, (p.top + p.bottom) / 2, { align: "center", color: COL.muted, size: 18 });

      const N = diffs.length;
      if (!N) {
        $("noise-stats").innerHTML = `Every visitor converts with ${fmtPct(P0, 0)} in A and ${fmtPct(P0 + d / 100, 2)} in B. Noise alone moves the observed lift by about <b>&plusmn;${(Z * se).toFixed(2)} pp</b> (95% of the time, grey band). The band depends only on the users per group and the 5% baseline, there is no separate noise knob for yes/no data.`;
        return;
      }
      const lo = Math.min(...diffs), hi = Math.max(...diffs);
      const s = sig.filter(Boolean).length / N;
      const l = last.t;
      const first = d === 0
        ? `<b>${fmtInt(N)}</b> experiment${N === 1 ? "" : "s"}, nothing changed between A and B. Observed lifts ranged from <b>${fmtPP(lo, 2)}</b> to <b>${fmtPP(hi, 2)}</b>. ` +
          `The test said "significant" (outside the band) in <b>${fmtPct(s, 1)}</b> of them: that is &alpha;, the false alarm rate.`
        : `<b>${fmtInt(N)}</b> experiment${N === 1 ? "" : "s"}, B really is <b>${fmtPP(d, 2)}</b> better. Observed lifts ranged from <b>${fmtPP(lo, 2)}</b> to <b>${fmtPP(hi, 2)}</b>. ` +
          `The test found it (outside the band) in <b>${fmtPct(s, 1)}</b> of them: that is the power at this sample size and lift.`;
      $("noise-stats").innerHTML = first + `<br/>` +
        `last one: A ${fmtInt(last.a)} / ${fmtInt(last.n)} = ${fmtPct(l.pa, 2)}, B ${fmtInt(last.b)} / ${fmtInt(last.n)} = ${fmtPct(l.pb, 2)}, lift ${fmtPP(l.diff * 100, 2)}, ${fmtP(l.p)}`;
    }

    onClick("noise-run1", () => run(1));
    onClick("noise-run100", () => run(100));
    onClick("noise-run1000", () => run(1000));
    onClick("noise-reset", reset);
    redraws["noise-canvas"] = draw;
    draw();
  }

  // ====================================================== 1b. p-value as a picture
  function simPvalue() {
    if (!$("pv-canvas")) return;
    const c = canvas("pv-canvas");
    const REPS = 1000;
    const Z = zq(0.975);
    let reps = [], repsN = 0; // A/A reruns (lift in pp) for the current n
    const getN = stepSlider("pv-n", N_STEPS, fmtInt, draw);
    const getObs = numSlider("pv-d", (v) => fmtPP(v, 1), draw);
    $("pv-a").addEventListener("change", draw);

    function rerun(n) {
      reps = [];
      for (let i = 0; i < REPS; i++) reps.push(((binom(n, P0) - binom(n, P0)) / n) * 100);
      repsN = n;
    }

    function draw() {
      const n = getN(), obs = getObs(), alpha = +$("pv-a").value;
      if (repsN !== n) rerun(n);
      const se = Math.sqrt((2 * P0 * (1 - P0)) / n) * 100;
      const crit = zq(1 - alpha / 2) * se;
      const a = Math.abs(obs);
      const pval = 2 * (1 - Phi(a / se));
      const far = reps.filter((v) => Math.abs(v) >= a).length;
      // bins aligned to the 5% band as on the noise slide
      const w = (Z * se) / 8;
      const half = Math.max(4.5 * se, a + 1.4 * se);
      const x0 = Math.floor(-half / w) * w, x1 = -x0;
      const bins = Math.round((x1 - x0) / w);
      const cntAll = new Array(bins).fill(0), cntFar = new Array(bins).fill(0);
      reps.forEach((v) => {
        const k = Math.min(bins - 1, Math.max(0, Math.floor((v - x0) / w)));
        cntAll[k]++;
        if (Math.abs(v) >= a) cntFar[k]++;
      });
      const ymax = Math.max(5, ...cntAll) * 1.45;
      clear(c);
      const p = plot(c, { x0, x1, y0: 0, y1: ymax, ml: 64 });
      const { ctx } = p;
      // alpha band
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fillRect(p.x(-crit), p.top, p.x(crit) - p.x(-crit), p.bottom - p.top);
      ctx.strokeStyle = COL.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(p.x(-crit), p.top); ctx.lineTo(p.x(-crit), p.bottom);
      ctx.moveTo(p.x(crit), p.top); ctx.lineTo(p.x(crit), p.bottom); ctx.stroke();
      ctx.restore();
      axes(p, {
        xticks: niceTicks(x0, x1, 10), xfmt: (v) => (v > 0 ? "+" : "") + v,
        yticks: niceTicks(0, ymax, 4), ygrid: true,
        xlabel: "lift B - A in the rerun (percentage points)", ylabel: "A/A reruns",
      });
      for (let k = 0; k < bins; k++) {
        if (!cntAll[k]) continue;
        const xl = p.x(x0 + k * w) + 1, xr = p.x(x0 + (k + 1) * w) - 1;
        ctx.fillStyle = COL.blue;
        ctx.fillRect(xl, p.y(cntAll[k] - cntFar[k]), xr - xl, p.bottom - p.y(cntAll[k] - cntFar[k]));
        ctx.fillStyle = COL.red;
        ctx.fillRect(xl, p.y(cntAll[k]), xr - xl, p.y(cntAll[k] - cntFar[k]) - p.y(cntAll[k]));
      }
      // formula curve, as on the noise slide
      const xs = [], ys = [];
      for (let i = 0; i <= 120; i++) {
        const v = x0 + ((x1 - x0) * i) / 120;
        xs.push(v);
        ys.push((REPS * w * Math.exp(-0.5 * Math.pow(v / se, 2))) / (se * Math.sqrt(2 * Math.PI)));
      }
      polyline(p, xs, ys, COL.green, 2, [8, 5]);
      vline(p, 0, COL.text, [], 1);
      vline(p, obs, COL.accent, [], 3);
      if (a > 0) vline(p, -obs, COL.accent, [2, 4], 1);
      const rightSide = p.x(obs) < (p.left + p.right) / 2;
      text(ctx, "our one real experiment: " + fmtPP(obs, 1), p.x(obs) + (rightSide ? 8 : -8), p.top + 16, { color: COL.accent, size: 13, bold: true, align: rightSide ? "left" : "right" });
      text(ctx, "α = " + fmtPct(alpha, 0) + ": the band, ±" + crit.toFixed(2) + " pp, fixed before the test", p.x(0), p.top + 36, { color: COL.muted, size: 12, align: "center" });
      legend(ctx, p.left + 12, p.top + 16, [
        ["rerun with nothing changed (A/A)", COL.blue],
        ["rerun at least as far from 0 as ours", COL.red],
        ["formula (bell curve)", COL.green],
      ]);
      const sig = pval < alpha;
      const pTxt = pval < 0.0001 ? "less than 0.01%" : fmtPct(pval, 1);
      $("pv-stats").innerHTML =
        `Under H0, a difference of at least ${fmtPP(a, 1)} (either side) has probability <b class="red">p = ${pTxt}</b> (formula). ` +
        `Check with the reruns: <b class="red">${far}</b> of ${fmtInt(REPS)} landed that far out, ${fmtPct(far / REPS, 1)}.<br/>` +
        (sig
          ? `p &lt; &alpha; = ${fmtPct(alpha, 0)}, our line is <b class="accent">outside the band</b>: noise alone rarely does this, <b>statistically significant</b>, reject H0.`
          : `p &ge; &alpha; = ${fmtPct(alpha, 0)}, our line is <b class="accent">inside the band</b>: noise alone does this all the time, <b>not significant</b>, keep H0.`);
    }
    redraws["pv-canvas"] = draw;
    draw();
  }

  // ====================================================== 2. errors and power
  function simErrors() {
    if (!$("err-canvas")) return;
    const c = canvas("err-canvas");
    const REPS = 1000;
    const Z = zq(0.975);
    let reps = [], repsKey = ""; // reruns (lift in pp) in the world set by the true-lift slider
    const getN = stepSlider("err-n", N_STEPS, fmtInt, draw);
    const getD = numSlider("err-d", (v) => fmtPP(v, 1), draw);
    const getObs = numSlider("err-obs", (v) => fmtPP(v, 1), draw);
    $("err-a").addEventListener("change", draw);

    function rerun(n, d) {
      reps = [];
      for (let i = 0; i < REPS; i++) reps.push(((binom(n, P0 + d / 100) - binom(n, P0)) / n) * 100);
      repsKey = n + "/" + d;
    }

    function draw() {
      const n = getN(), d = getD(), obs = getObs(), alpha = +$("err-a").value;
      if (repsKey !== n + "/" + d) rerun(n, d);
      const h0 = d === 0; // world 1: B changes nothing
      const se = Math.sqrt((2 * P0 * (1 - P0)) / n) * 100;
      const crit = zq(1 - alpha / 2) * se;
      const beta = Phi((crit - d) / se) - Phi((-crit - d) / se);
      const w = (Z * se) / 8;
      const half = Math.max(4 * se, Math.abs(obs) + 1.2 * se);
      const x0 = Math.floor(-half / w) * w, x1 = Math.ceil((d + half) / w) * w;
      const bins = Math.round((x1 - x0) / w);
      const cnt = new Array(bins).fill(0), flag = new Array(bins).fill(0);
      // flagged reruns: outside the band in world 1 (false alarms), inside the band otherwise (missed effects)
      reps.forEach((v) => {
        const k = Math.min(bins - 1, Math.max(0, Math.floor((v - x0) / w)));
        cnt[k]++;
        if (h0 ? Math.abs(v) > crit : Math.abs(v) <= crit) flag[k]++;
      });
      const flagged = flag.reduce((a, b) => a + b, 0);
      const ymax = Math.max(5, ...cnt) * 1.5;
      clear(c);
      const p = plot(c, { x0, x1, y0: 0, y1: ymax, ml: 64 });
      const { ctx } = p;
      // band
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fillRect(p.x(-crit), p.top, p.x(crit) - p.x(-crit), p.bottom - p.top);
      ctx.strokeStyle = COL.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(p.x(-crit), p.top); ctx.lineTo(p.x(-crit), p.bottom);
      ctx.moveTo(p.x(crit), p.top); ctx.lineTo(p.x(crit), p.bottom); ctx.stroke();
      ctx.restore();
      axes(p, {
        xticks: niceTicks(x0, x1, 10), xfmt: (v) => (v > 0 ? "+" : "") + v,
        yticks: niceTicks(0, ymax, 4), ygrid: true,
        xlabel: "lift B - A in the rerun (percentage points)", ylabel: "reruns",
      });
      // H0 curve (formula) and, in world 2, its red tails = alpha
      const xs = [], y0s = [];
      for (let i = 0; i <= 200; i++) {
        const v = x0 + ((x1 - x0) * i) / 200;
        xs.push(v);
        y0s.push((REPS * w * phi(v / se)) / se);
      }
      // bars: the world we are in
      const base = h0 ? COL.blue : COL.green, flagCol = h0 ? COL.red : COL.muted;
      for (let k = 0; k < bins; k++) {
        if (!cnt[k]) continue;
        const xl = p.x(x0 + k * w) + 1, xr = p.x(x0 + (k + 1) * w) - 1;
        ctx.fillStyle = base;
        ctx.fillRect(xl, p.y(cnt[k] - flag[k]), xr - xl, p.bottom - p.y(cnt[k] - flag[k]));
        ctx.fillStyle = flagCol;
        ctx.fillRect(xl, p.y(cnt[k]), xr - xl, p.y(cnt[k] - flag[k]) - p.y(cnt[k]));
      }
      if (!h0) {
        const fill = (from, to) => {
          ctx.save();
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = COL.red;
          ctx.beginPath();
          ctx.moveTo(p.x(from), p.bottom);
          xs.forEach((x, i) => { if (x >= from && x <= to) ctx.lineTo(p.x(x), p.y(y0s[i])); });
          ctx.lineTo(p.x(to), p.bottom);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        };
        fill(crit, x1);
        fill(x0, -crit);
      }
      polyline(p, xs, y0s, COL.blue, 1.5, [8, 5]);
      if (!h0) {
        const y1s = xs.map((v) => (REPS * w * phi((v - d) / se)) / se);
        polyline(p, xs, y1s, COL.green, 1.5, [8, 5]);
        vline(p, d, COL.green, [6, 4], 2);
        text(ctx, "true lift " + fmtPP(d, 1), p.x(d) + 6, p.top + 36, { color: COL.green, size: 12 });
      }
      vline(p, 0, COL.text, [], 1);
      vline(p, obs, COL.accent, [], 3);
      text(ctx, "α = " + fmtPct(alpha, 0) + ": the band, ±" + crit.toFixed(2) + " pp", p.x(crit) - 6, p.top + 16, { color: COL.muted, size: 12, align: "right" });
      const rightSide = p.x(obs) < (p.left + p.right) / 2;
      text(ctx, "our one real experiment: " + fmtPP(obs, 1), p.x(obs) + (rightSide ? 8 : -8), p.top + 56, { color: COL.accent, size: 13, bold: true, align: rightSide ? "left" : "right" });
      legend(ctx, p.left + 12, p.top + 16, h0
        ? [["rerun, B changes nothing (H0)", COL.blue], ["outside the band: false alarm (α)", COL.red]]
        : [["rerun, B really adds " + fmtPP(d, 1), COL.green], ["inside the band: missed effect (β)", COL.muted], ["H0 curve, its tails outside the band: α", COL.red]]);

      const inside = Math.abs(obs) <= crit;
      let line1, verdict;
      if (h0) {
        line1 = `<span class="blue">World 1, B changes nothing:</span> <b class="red">${flagged}</b> of ${fmtInt(REPS)} reruns land outside the band = ${fmtPct(flagged / REPS, 1)}. Those are the false alarms, formula: &alpha; = ${fmtPct(alpha, 0)}. No effect to miss, so no &beta; here.`;
        verdict = inside
          ? `Our number is <b class="accent">inside the band</b>: "not significant", and in this world that is right.`
          : `Our number is <b class="accent">outside the band</b>: "significant", and in this world that is a <b>type I error</b>.`;
      } else {
        line1 = `<span class="green">World 2, B really adds ${fmtPP(d, 1)}:</span> <b>${flagged}</b> of ${fmtInt(REPS)} reruns land inside the band = ${fmtPct(flagged / REPS, 1)}. Those are the missed effects, formula: &beta; = ${fmtPct(beta, 0)}, power = ${fmtPct(1 - beta, 0)}. &alpha; = ${fmtPct(alpha, 0)} is still the red tail of the H0 curve: what world 1 would have produced.`;
        verdict = inside
          ? `Our number is <b class="accent">inside the band</b>: "not significant", and in this world that is a <b>type II error</b>.`
          : `Our number is <b class="accent">outside the band</b>: "significant", and in this world that is right.`;
      }
      $("err-stats").innerHTML = line1 + `<br/>` + verdict + ` We never know which world we are in.`;
    }
    redraws["err-canvas"] = draw;
    draw();
  }

  // ========================================================= 3. sample size
  function simPlan() {
    if (!$("plan-canvas")) return;
    const c = canvas("plan-canvas");
    const V_STEPS = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000, 100000];
    const getP = numSlider("plan-p", (v) => v.toFixed(1) + "%", draw);
    const getM = numSlider("plan-mde", (v) => fmtPP(v, 2), draw);
    const getV = stepSlider("plan-v", V_STEPS, fmtInt, draw);
    const getDays = numSlider("plan-days", (v) => v + " d", draw);
    $("plan-pow").addEventListener("change", draw);

    function draw() {
      const p0 = getP() / 100, mde = getM() / 100, v = getV(), days = getDays(), pow = +$("plan-pow").value;
      const alpha = 0.05;
      const n = nFor(p0, mde, alpha, pow);
      const rule = (16 * p0 * (1 - p0)) / (mde * mde);
      const daysNeeded = Math.ceil((2 * n) / v);
      const nAvail = (days * v) / 2;
      const pwAvail = powerFor(p0, mde, nAvail, alpha);
      const mdeMin = mdeFor(p0, nAvail, alpha, pow);
      clear(c);
      const p = plot(c, { x0: 100, x1: 1e6, y0: 0, y1: 1, xlog: true, ml: 64 });
      axes(p, {
        xticks: [100, 1000, 10000, 100000, 1000000], xfmt: (x) => (x >= 1000 ? x / 1000 + "k" : String(x)),
        yticks: [0, 0.2, 0.4, 0.6, 0.8, 1], yfmt: (y) => Math.round(y * 100) + "%", ygrid: true,
        xlabel: "users per group (log scale)", ylabel: "power",
        title: `baseline ${(p0 * 100).toFixed(1)}%, α = 5%`,
      });
      const xs = [], ys = [];
      for (let i = 0; i <= 200; i++) {
        const x = Math.pow(10, 2 + (4 * i) / 200);
        xs.push(x);
        ys.push(powerFor(p0, mde, x, alpha));
      }
      polyline(p, xs, ys, COL.accent, 3);
      hline(p, pow, COL.text, [6, 4], 1.2);
      text(p.ctx, fmtPct(pow, 0) + " power", p.left + 8, p.y(pow) - 6, { size: 13 });
      vline(p, Math.min(n, 1e6), COL.accent);
      text(p.ctx, "plan: " + fmtInt(n), p.x(Math.min(n, 1e6)) + 6, p.y(0.5) + 20, { color: COL.accent, size: 13, bold: true });
      vline(p, Math.max(100, Math.min(nAvail, 1e6)), COL.blue);
      text(p.ctx, `${days} days of traffic: ${fmtInt(nAvail)}`, p.x(Math.max(100, Math.min(nAvail, 1e6))) + 6, p.y(0.5) - 14, { color: COL.blue, size: 13, bold: true });
      ctx_dot(p, Math.min(n, 1e6), pow, COL.accent);
      ctx_dot(p, Math.max(100, Math.min(nAvail, 1e6)), pwAvail, COL.blue);
      $("plan-stats").innerHTML =
        `<b>Plan:</b> ${fmtInt(n)} users per group (rule of thumb: ${fmtInt(rule)}), ${fmtInt(2 * n)} in total, ` +
        `at ${fmtInt(v)} visitors/day that is <b>${daysNeeded} days</b>.<br/>` +
        (daysNeeded <= days
          ? `<b>Fits:</b> ${days} days give ${fmtInt(nAvail)} per group, more than needed. Run it for ${daysNeeded} days, not longer.`
          : `<b>Does not fit:</b> in ${days} days you get ${fmtInt(nAvail)} per group, power for ${fmtPP(mde * 100, 2)} is only <b>${fmtPct(pwAvail, 0)}</b>. ` +
            `What ${days} days <em>can</em> show: a lift of at least <b>${fmtPP(mdeMin * 100, 2)}</b> (${fmtPct(mdeMin / p0, 0)} relative). Smaller effects are invisible in this time, whatever you set the power to.`);
    }
    redraws["plan-canvas"] = draw;
    draw();
  }

  function ctx_dot(p, x, y, color) {
    p.ctx.save();
    p.ctx.fillStyle = color;
    p.ctx.beginPath();
    p.ctx.arc(p.x(x), p.y(y), 5, 0, 2 * Math.PI);
    p.ctx.fill();
    p.ctx.restore();
  }

  // ============================================================= 4. peeking
  function simPeek() {
    if (!$("peek-canvas")) return;
    const c = canvas("peek-canvas");
    const V_STEPS = [200, 500, 1000, 2000, 5000];
    let runs = 0, endSig = 0, everSig = 0, paths = [];
    const reset = () => { runs = 0; endSig = 0; everSig = 0; paths = []; draw(); };
    const getDays = numSlider("peek-days", (v) => v + " d", reset);
    const getV = stepSlider("peek-v", V_STEPS, fmtInt, reset);
    const getD = numSlider("peek-d", (v) => fmtPP(v, 1), reset);

    function run(k) {
      const days = getDays(), v = getV(), d = getD() / 100;
      for (let r = 0; r < k; r++) {
        let a = 0, b = 0;
        const ps = [];
        for (let day = 1; day <= days; day++) {
          a += binom(v, P0);
          b += binom(v, P0 + d);
          ps.push(ztest(a, day * v, b, day * v).p);
        }
        const hit = ps.some((x) => x < 0.05);
        runs++;
        if (hit) everSig++;
        if (ps[ps.length - 1] < 0.05) endSig++;
        paths.push({ ps, hit });
        if (paths.length > 8) paths.shift();
      }
      draw();
    }

    function draw() {
      const days = getDays(), d = getD();
      clear(c);
      const p = plot(c, { x0: 1, x1: days, y0: 0, y1: 1, ml: 56, right: c.W * 0.6, mr: 16 });
      axes(p, {
        xticks: niceTicks(1, days, 6).filter((v) => v >= 1), yticks: [0, 0.25, 0.5, 0.75, 1], ygrid: true,
        xlabel: "day of the experiment", ylabel: "p-value if you test today",
        title: d === 0 ? "A/A tests (no real effect), checked daily" : `A/B tests (true lift ${fmtPP(d, 1)}), checked daily`,
      });
      paths.forEach((path, i) => {
        const xs = path.ps.map((_, j) => j + 1);
        polyline(p, xs, path.ps, path.hit ? COL.red : COL.blue, i === paths.length - 1 ? 2.6 : 1.4);
      });
      hline(p, 0.05, COL.accent);
      text(p.ctx, "α = 0.05", p.left + 8, p.y(0.05) - 6, { color: COL.accent, size: 13 });
      if (!paths.length) text(p.ctx, "click 'run' to simulate", (p.left + p.right) / 2, (p.top + p.bottom) / 2, { align: "center", color: COL.muted, size: 18 });

      // right: bars
      const q = plot(c, { x0: 0, x1: 2, y0: 0, y1: 1, left: c.W * 0.62, ml: 50, mr: 20 });
      axes(q, {
        yticks: [0, 0.25, 0.5, 0.75, 1], yfmt: (y) => Math.round(y * 100) + "%", ygrid: true,
        title: runs ? `${fmtInt(runs)} simulated tests` : "share declared significant",
      });
      const bars = [["look once,\nat the end", runs ? endSig / runs : 0, COL.blue], ["peek daily, stop\nat first p < 0.05", runs ? everSig / runs : 0, COL.red]];
      bars.forEach(([label, val, color], i) => {
        const xl = q.x(i + 0.2), xr = q.x(i + 0.8);
        q.ctx.fillStyle = color;
        q.ctx.fillRect(xl, q.y(val), xr - xl, q.bottom - q.y(val));
        if (runs) text(q.ctx, fmtPct(val, 1), (xl + xr) / 2, q.y(val) - 6, { align: "center", color, size: 14, bold: true });
        label.split("\n").forEach((line, j) => text(q.ctx, line, (xl + xr) / 2, q.bottom + 17 + j * 15, { align: "center", size: 12 }));
      });
      if (d === 0) {
        hline(q, 0.05, COL.accent);
        text(q.ctx, "promised: 5%", q.right - 4, q.y(0.05) - 6, { color: COL.accent, size: 12, align: "right" });
      }
      $("peek-stats").innerHTML = runs
        ? `<b>${fmtInt(runs)}</b> tests &middot; decided once at the end: <b>${fmtPct(endSig / runs, 1)}</b> significant &middot; peeking daily: <b>${fmtPct(everSig / runs, 1)}</b> significant` +
          (d === 0 ? " &middot; both should be 5%, only one is." : " &middot; peeking also finds more, but with an exaggerated lift.")
        : `${fmtInt(getV())} users per group and day, ${days} days. Red paths crossed 0.05 at least once, blue never.`;
    }

    onClick("peek-run1", () => run(1));
    onClick("peek-run100", () => run(100));
    onClick("peek-reset", reset);
    redraws["peek-canvas"] = draw;
    draw();
  }

  // ================================================= 5. confidence intervals
  function simCI() {
    if (!$("ci-canvas")) return;
    const c = canvas("ci-canvas");
    const REPS = 20;
    let batch = [], tot = 0, cover = 0, sigTot = 0;
    const rerun = () => { tot = 0; cover = 0; sigTot = 0; run(); };
    const getN = stepSlider("ci-n", N_STEPS, fmtInt, rerun);
    const getD = numSlider("ci-d", (v) => fmtPP(v, 1), rerun);

    function run() {
      const n = getN(), d = getD();
      batch = [];
      for (let i = 0; i < REPS; i++) {
        const a = binom(n, P0), b = binom(n, P0 + d / 100);
        const pa = a / n, pb = b / n;
        const est = (pb - pa) * 100;
        const se = Math.sqrt((pa * (1 - pa)) / n + (pb * (1 - pb)) / n) * 100;
        const lo = est - 1.96 * se, hi = est + 1.96 * se;
        const ok = lo <= d && d <= hi, sig = !(lo <= 0 && 0 <= hi);
        batch.push({ est, lo, hi, ok, sig });
        tot++;
        if (ok) cover++;
        if (sig) sigTot++;
      }
      draw();
    }

    function draw() {
      const d = getD();
      const lo = Math.min(0, d, ...batch.map((b) => b.lo)) - 0.2;
      const hi = Math.max(0, d, ...batch.map((b) => b.hi)) + 0.2;
      clear(c);
      const p = plot(c, { x0: lo, x1: hi, y0: 0, y1: REPS + 1.5, ml: 64 });
      axes(p, {
        xticks: niceTicks(lo, hi, 8), xfmt: (v) => (v > 0 ? "+" : "") + v,
        yticks: [1, 5, 10, 15, 20], yfmt: (v) => String(v),
        xlabel: "estimated lift B - A with 95% confidence interval (pp)", ylabel: "experiment #",
        title: `the same experiment repeated ${REPS} times, ${fmtInt(getN())} users per group`,
      });
      vline(p, 0, COL.text, [], 1);
      vline(p, d, COL.accent);
      text(p.ctx, "true lift", p.x(d) + 6, p.top + 14, { color: COL.accent, size: 13 });
      batch.forEach((b, i) => {
        const y = p.y(REPS - i);
        const col = b.ok ? COL.green : COL.red;
        p.ctx.save();
        p.ctx.strokeStyle = col;
        p.ctx.lineWidth = 2.4;
        p.ctx.beginPath();
        p.ctx.moveTo(p.x(b.lo), y);
        p.ctx.lineTo(p.x(b.hi), y);
        p.ctx.stroke();
        p.ctx.fillStyle = col;
        p.ctx.beginPath();
        p.ctx.arc(p.x(b.est), y, 4, 0, 2 * Math.PI);
        p.ctx.fill();
        p.ctx.restore();
      });
      const okN = batch.filter((b) => b.ok).length, sigN = batch.filter((b) => b.sig).length;
      $("ci-stats").innerHTML =
        `this batch: <b>${okN} / ${REPS}</b> intervals contain the true lift, <b>${sigN} / ${REPS}</b> exclude 0 (significant) &middot; ` +
        `all ${fmtInt(tot)} so far: coverage <b>${fmtPct(cover / tot, 1)}</b> (promised 95%), significant <b>${fmtPct(sigTot / tot, 1)}</b>` +
        (d === 0 ? " (should be 5%)" : " (that is the power)");
    }

    onClick("ci-run", run);
    redraws["ci-canvas"] = draw;
    run();
  }

  // ===================================================== 6. multiple testing
  function simMulti() {
    if (!$("multi-canvas")) return;
    const c = canvas("multi-canvas");
    const KMAX = 50;
    let u = [];
    const roll = () => { u = Array.from({ length: KMAX }, Math.random); draw(); };
    const getK = numSlider("multi-k", (v) => String(v), draw);
    $("multi-a").addEventListener("change", draw);
    $("multi-bonf").addEventListener("change", draw);

    function draw() {
      const k = getK(), alpha = +$("multi-a").value, bonf = $("multi-bonf").checked;
      const thr = bonf ? alpha / k : alpha;
      const pAtLeastOne = (kk) => 1 - Math.pow(1 - (bonf ? alpha / kk : alpha), kk);
      clear(c);
      const p = plot(c, { x0: 1, x1: KMAX, y0: 0, y1: 1, ml: 60, right: c.W * 0.58, mr: 16 });
      axes(p, {
        xticks: [1, 10, 20, 30, 40, 50], yticks: [0, 0.25, 0.5, 0.75, 1], yfmt: (y) => Math.round(y * 100) + "%", ygrid: true,
        xlabel: "number of metrics (or segments) you test", ylabel: "chance of ≥ 1 false 'win'",
        title: "no real effect anywhere, and still ...",
      });
      const xs = [], ys = [];
      for (let kk = 1; kk <= KMAX; kk++) { xs.push(kk); ys.push(pAtLeastOne(kk)); }
      polyline(p, xs, ys, COL.red, 3);
      hline(p, alpha, COL.accent);
      text(p.ctx, `α = ${fmtPct(alpha, 0)} per metric`, p.left + 8, p.y(alpha) - 6, { color: COL.accent, size: 13 });
      ctx_dot(p, k, pAtLeastOne(k), COL.text);
      text(p.ctx, fmtPct(pAtLeastOne(k), 0), p.x(k) + 8, p.y(pAtLeastOne(k)) + (pAtLeastOne(k) > 0.85 ? 18 : -10), { size: 14, bold: true });

      // right: the dashboard, one tile per metric
      const left = c.W * 0.6 + 10, top = 30, w = c.W - left - 16, h = c.H - 70;
      const cols = Math.ceil(Math.sqrt(k * (w / h))), rows = Math.ceil(k / cols);
      const size = Math.min(w / cols, h / rows);
      let wins = 0;
      text(p.ctx, `your dashboard: ${k} metrics, all noise`, left + (cols * size) / 2, 18, { align: "center", size: 14, color: COL.muted });
      for (let i = 0; i < k; i++) {
        const x = left + (i % cols) * size, y = top + Math.floor(i / cols) * size;
        const win = u[i] < thr;
        if (win) wins++;
        p.ctx.fillStyle = win ? COL.red : "rgba(255,255,255,0.08)";
        p.ctx.fillRect(x + 2, y + 2, size - 4, size - 4);
        if (win) text(p.ctx, "win!", x + size / 2, y + size / 2 + 4, { align: "center", size: Math.max(9, Math.min(14, size / 3.2)), bold: true, color: "#111" });
      }
      $("multi-stats").innerHTML =
        `with ${k} metrics at α = ${fmtPct(alpha, 0)}${bonf ? ` and Bonferroni (threshold ${fmtPct(thr, 2)} each)` : ""}: ` +
        `chance of at least one false "win" = <b>${fmtPct(pAtLeastOne(k), 0)}</b> &middot; this dashboard shows <b>${wins}</b> false win${wins === 1 ? "" : "s"}`;
    }

    onClick("multi-run", roll);
    redraws["multi-canvas"] = draw;
    roll();
  }

  // ------------------------------------------------------------------ init
  function init() {
    simNoise();
    simPvalue();
    simErrors();
    simPlan();
    simPeek();
    simCI();
    simMulti();
    if (window.Reveal && Reveal.on) {
      Reveal.on("slidechanged", (e) => {
        e.currentSlide.querySelectorAll("canvas").forEach((el) => redraws[el.id] && redraws[el.id]());
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
