"""Generate the figures for the A/B testing slides.

Run from the repo root:  python3 slides/assets/ab_testing/make_figures.py
All data is simulated (schematic), figures are written next to this script as SVG
with a transparent background so they fit the dark reveal.js theme.
"""

from pathlib import Path

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

matplotlib.use("Agg")

OUT = Path(__file__).parent

# same palette as slides/introduction/index.html
ACCENT, GREEN, BLUE, RED, MUTED, TEXT = (
    "#ffa726",
    "#90ee90",
    "#4fc3f7",
    "#ef5350",
    "#9e9e9e",
    "#dddddd",
)

plt.rcParams.update(
    {
        "figure.facecolor": "none",
        "axes.facecolor": "none",
        "savefig.facecolor": "none",
        "savefig.transparent": True,
        "text.color": TEXT,
        "axes.labelcolor": TEXT,
        "axes.edgecolor": MUTED,
        "xtick.color": TEXT,
        "ytick.color": TEXT,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "font.size": 13,
        "axes.titlesize": 14,
        "legend.frameon": False,
        "legend.fontsize": 11,
        "svg.fonttype": "none",
    }
)

rng = np.random.default_rng(2026)
P0 = 0.05  # baseline conversion rate of the ShopNow checkout


def save(fig, name):
    fig.tight_layout()
    fig.savefig(OUT / f"{name}.svg")
    plt.close(fig)
    print("wrote", name)


# ---------------------------------------------------------------- 1. A/A noise
def fig_aa_noise(n=5000, sims=3000):
    a = rng.binomial(n, P0, sims) / n
    b = rng.binomial(n, P0, sims) / n
    diff_pp = (b - a) * 100
    fig, ax = plt.subplots(figsize=(8, 4.2))
    ax.hist(diff_pp, bins=45, color=BLUE, alpha=0.85)
    ax.axvline(0, color=TEXT, lw=1.5, ls="--")
    ax.set_xlabel("observed difference B - A (percentage points)")
    ax.set_ylabel("number of A/A experiments")
    ax.set_title(f"{sims} A/A tests, same page in both groups, {n:,} users per group")
    sd = diff_pp.std()
    ax.annotate(
        f"typical chance difference: ±{sd:.2f} pp\n(2 out of 3 experiments)",
        xy=(sd, ax.get_ylim()[1] * 0.55),
        xytext=(0.97, 0.85),
        textcoords="axes fraction",
        ha="right",
        color=ACCENT,
        arrowprops=dict(color=ACCENT, arrowstyle="->"),
    )
    save(fig, "aa_noise")


# ------------------------------------------------------ 2. null distribution / p
def fig_null_pvalue(n=5000, observed_pp=0.9):
    se = np.sqrt(2 * P0 * (1 - P0) / n) * 100  # in pp
    x = np.linspace(-4 * se, 4 * se, 600)
    y = stats.norm.pdf(x, 0, se)
    fig, ax = plt.subplots(figsize=(8, 4.2))
    ax.plot(x, y, color=BLUE, lw=2.5, label="differences if there is NO effect (H0)")
    tail = x >= observed_pp
    ax.fill_between(x[tail], y[tail], color=RED, alpha=0.6)
    ax.fill_between(x[x <= -observed_pp], y[x <= -observed_pp], color=RED, alpha=0.6)
    ax.axvline(observed_pp, color=ACCENT, lw=2.5)
    p = 2 * stats.norm.sf(observed_pp, 0, se)
    ax.annotate(
        f"observed: +{observed_pp} pp",
        xy=(observed_pp, max(y) * 0.6),
        xytext=(observed_pp + 0.3, max(y) * 0.85),
        color=ACCENT,
        arrowprops=dict(color=ACCENT, arrowstyle="->"),
    )
    ax.annotate(
        f"p-value = red area = {p:.3f}",
        xy=(observed_pp + 0.25, max(y) * 0.05),
        xytext=(observed_pp + 0.4, max(y) * 0.35),
        color=RED,
        arrowprops=dict(color=RED, arrowstyle="->"),
    )
    ax.set_xlabel("difference B - A (percentage points)")
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.legend(loc="upper left")
    save(fig, "null_pvalue")


# --------------------------------------------------------- 3. errors and power
def fig_errors_power(n=8000, true_pp=1.0):
    se = np.sqrt(2 * P0 * (1 - P0) / n) * 100
    crit = stats.norm.ppf(0.975, 0, se)
    x = np.linspace(-3.5 * se, true_pp + 3.5 * se, 800)
    y0 = stats.norm.pdf(x, 0, se)
    y1 = stats.norm.pdf(x, true_pp, se)
    fig, ax = plt.subplots(figsize=(9, 4.4))
    ax.plot(x, y0, color=BLUE, lw=2.5, label="no effect (H0)")
    ax.plot(x, y1, color=GREEN, lw=2.5, label=f"true effect +{true_pp} pp (H1)")
    ax.fill_between(x[x >= crit], y0[x >= crit], color=RED, alpha=0.7, label="α: false alarm (type I)")
    ax.fill_between(x[x < crit], y1[x < crit], color=MUTED, alpha=0.45, label="β: missed effect (type II)")
    ax.fill_between(x[x >= crit], y1[x >= crit], color=GREEN, alpha=0.25, label="power = 1 - β")
    ax.axvline(crit, color=ACCENT, lw=2, ls="--")
    ax.text(crit + 0.03, max(y0) * 1.02, "decision threshold", color=ACCENT)
    ax.set_xlabel("observed difference B - A (percentage points)")
    ax.set_yticks([])
    ax.spines["left"].set_visible(False)
    ax.legend(loc="upper left")
    save(fig, "errors_power")


# -------------------------------------------------------------- 4. power curve
def fig_power_curve():
    from statsmodels.stats.power import NormalIndPower
    from statsmodels.stats.proportion import proportion_effectsize

    ns = np.logspace(2.5, 5.3, 120)
    fig, ax = plt.subplots(figsize=(8, 4.4))
    for mde, col in [(0.0025, MUTED), (0.005, ACCENT), (0.01, GREEN), (0.02, BLUE)]:
        es = proportion_effectsize(P0 + mde, P0)
        pw = [NormalIndPower().power(es, nobs1=n, alpha=0.05, ratio=1.0) for n in ns]
        ax.plot(ns, pw, lw=2.5, color=col, label=f"MDE +{mde*100:.2g} pp ({mde/P0:.0%} relative)")
    ax.axhline(0.8, color=TEXT, ls="--", lw=1.2)
    ax.text(ns[0], 0.815, "80% power", color=TEXT, fontsize=11)
    ax.set_xscale("log")
    ax.set_xlabel("users per group (log scale)")
    ax.set_ylabel("power = chance to detect the effect")
    ax.set_title(f"baseline conversion {P0:.0%}, α = 5%")
    ax.legend(loc="lower right")
    save(fig, "power_curve")


# ------------------------------------------------------------------ 5. peeking
def fig_peeking(days=30, per_day=1000, runs=6, sims=1500):
    from statsmodels.stats.proportion import proportions_ztest

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.2))
    n = np.arange(1, days + 1) * per_day
    first_hit = []
    shown = {"clean": 0, "hit": 0}
    for s in range(sims):
        a = rng.binomial(per_day, P0, days).cumsum()
        b = rng.binomial(per_day, P0, days).cumsum()
        ps = np.array([proportions_ztest([a[d], b[d]], [n[d], n[d]])[1] for d in range(days)])
        hits = np.where(ps < 0.05)[0]
        first_hit.append(hits[0] + 1 if len(hits) else np.inf)
        kind = "hit" if len(hits) else "clean"
        if shown[kind] < runs // 2:  # plot half "clean" and half "false alarm" runs
            shown[kind] += 1
            ax1.plot(np.arange(1, days + 1), ps, lw=1.6, alpha=0.9, color=RED if kind == "hit" else BLUE)
    ax1.axhline(0.05, color=ACCENT, lw=2, ls="--")
    ax1.text(1, 0.07, "α = 0.05", color=ACCENT)
    ax1.set_xlabel("day of the experiment")
    ax1.set_ylabel("p-value if you test today")
    ax1.set_title(f"{runs} A/A tests (no real effect), checked daily")
    first_hit = np.array(first_hit)
    frac = [(first_hit <= d).mean() for d in range(1, days + 1)]
    ax2.plot(np.arange(1, days + 1), np.array(frac) * 100, color=RED, lw=2.5)
    ax2.axhline(5, color=ACCENT, lw=2, ls="--")
    ax2.text(1, 6.5, "promised: 5%", color=ACCENT)
    ax2.set_xlabel("days you have been peeking")
    ax2.set_ylabel("% of A/A tests declared 'significant'")
    ax2.set_title(f"stop at the first p < 0.05 ({sims} simulations)")
    ax2.set_ylim(0, max(frac) * 100 * 1.15)
    save(fig, "peeking")


# --------------------------------------------------------- 6. multiple testing
def fig_multiple_testing():
    k = np.arange(1, 21)
    fig, ax = plt.subplots(figsize=(7.5, 4.2))
    ax.plot(k, (1 - 0.95**k) * 100, color=RED, lw=2.5, marker="o")
    ax.axhline(5, color=ACCENT, lw=2, ls="--")
    ax.text(1, 7, "α = 5% per metric", color=ACCENT)
    for kk in (5, 10, 20):
        ax.annotate(f"{(1-0.95**kk)*100:.0f}%", (kk, (1 - 0.95**kk) * 100), textcoords="offset points", xytext=(-8, 10), color=TEXT)
    ax.set_xlabel("number of metrics (or segments) you test")
    ax.set_ylabel("% chance of ≥ 1 false 'win'")
    ax.set_title("no real effect anywhere, and still ...")
    ax.set_xticks([1, 5, 10, 15, 20])
    save(fig, "multiple_testing")


# ------------------------------------------------------------ 7. novelty effect
def fig_novelty():
    weeks = np.arange(1, 9)
    lift = 0.6 + 3.0 * np.exp(-(weeks - 1) / 1.6)
    noise = rng.normal(0, 0.25, len(weeks))
    fig, ax = plt.subplots(figsize=(7.5, 4))
    ax.plot(weeks, lift + noise, marker="o", color=GREEN, lw=2.5, label="measured lift of B")
    ax.axhline(0.6, color=MUTED, ls="--", lw=1.5, label="long-term effect")
    ax.axhline(0, color=TEXT, lw=1)
    ax.axvspan(0.8, 2.2, color=ACCENT, alpha=0.12)
    ax.text(0.9, 3.6, "if you stop here:\n'+3 pp, ship it!'", color=ACCENT, fontsize=11)
    ax.set_xlabel("week of the experiment")
    ax.set_ylabel("lift B - A (percentage points)")
    ax.legend(loc="upper right")
    save(fig, "novelty")


# ----------------------------------------------------------- 8. Simpson paradox
def fig_simpson():
    seg = ["mobile", "desktop", "overall"]
    users_a = np.array([1000, 4000])
    users_b = np.array([4000, 1000])
    conv_a = np.array([0.03, 0.08])
    conv_b = np.array([0.035, 0.09])
    overall_a = (users_a * conv_a).sum() / users_a.sum()
    overall_b = (users_b * conv_b).sum() / users_b.sum()
    rates_a = np.append(conv_a, overall_a) * 100
    rates_b = np.append(conv_b, overall_b) * 100
    x = np.arange(3)
    w = 0.36
    fig, ax = plt.subplots(figsize=(7.5, 4.2))
    ax.bar(x - w / 2, rates_a, w, color=BLUE, label="A (old checkout)")
    ax.bar(x + w / 2, rates_b, w, color=GREEN, label="B (new checkout)")
    for i in range(3):
        ax.text(x[i] - w / 2, rates_a[i] + 0.15, f"{rates_a[i]:.1f}%", ha="center", color=TEXT, fontsize=11)
        ax.text(x[i] + w / 2, rates_b[i] + 0.15, f"{rates_b[i]:.1f}%", ha="center", color=TEXT, fontsize=11)
    ax.set_xticks(x)
    ax.set_xticklabels(
        [
            f"mobile\nA {users_a[0]//1000}k / B {users_b[0]//1000}k users",
            f"desktop\nA {users_a[1]//1000}k / B {users_b[1]//1000}k users",
            "overall\nA 5k / B 5k users",
        ]
    )
    ax.set_ylabel("conversion rate (%)")
    ax.set_title("B wins in every segment ... and loses overall")
    ax.legend(loc="upper left")
    save(fig, "simpson")


# ------------------------------------------------------- 9. confidence intervals
def fig_ci(n=20000, true_pp=0.8, reps=20):
    fig, ax = plt.subplots(figsize=(7.5, 4.6))
    for i in range(reps):
        a = rng.binomial(n, P0) / n
        b = rng.binomial(n, P0 + true_pp / 100) / n
        d = (b - a) * 100
        se = np.sqrt(a * (1 - a) / n + b * (1 - b) / n) * 100
        lo, hi = d - 1.96 * se, d + 1.96 * se
        col = GREEN if lo <= true_pp <= hi else RED
        ax.plot([lo, hi], [i, i], color=col, lw=2.2)
        ax.plot(d, i, "o", color=col, ms=5)
    ax.axvline(true_pp, color=ACCENT, lw=2, ls="--")
    ax.text(true_pp + 0.03, reps - 0.5, "true effect", color=ACCENT)
    ax.axvline(0, color=TEXT, lw=1)
    ax.set_xlabel("estimated lift B - A with 95% confidence interval (pp)")
    ax.set_ylabel("experiment #")
    ax.set_title(f"the same experiment repeated {reps} times")
    save(fig, "ci")


if __name__ == "__main__":
    fig_aa_noise()
    fig_null_pvalue()
    fig_errors_power()
    fig_power_curve()
    fig_peeking()
    fig_multiple_testing()
    fig_novelty()
    fig_simpson()
    fig_ci()
