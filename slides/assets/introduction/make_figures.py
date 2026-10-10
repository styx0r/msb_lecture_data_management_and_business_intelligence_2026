import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

"""Generate the schematic figures for the introduction deck (slides/introduction).

All data is simulated. Run from anywhere:  python3 slides/assets/introduction/make_figures.py
"""
import os
OUT = os.path.dirname(os.path.abspath(__file__)) + "/"
FG = "#e6e6e6"
ORANGE = "#ffa726"
GREEN = "#90ee90"
BLUE = "#4fc3f7"
RED = "#ef5350"
GREY = "#9e9e9e"

plt.rcParams.update({
    "figure.facecolor": "none", "axes.facecolor": "none", "savefig.facecolor": "none",
    "axes.edgecolor": FG, "axes.labelcolor": FG, "xtick.color": FG, "ytick.color": FG,
    "text.color": FG, "font.size": 15, "axes.spines.top": False, "axes.spines.right": False,
    "legend.frameon": False, "font.family": "sans-serif",
})

rng = np.random.default_rng(7)

def model(t, A=0.99, alpha=0.55, B=0.01, beta=0.025):
    return 100 * (A * np.exp(-alpha * t) + B * np.exp(-beta * t))

# ---------- Figure 1: biphasic decline ----------
t = np.linspace(0, 60, 400)
fig, ax = plt.subplots(figsize=(9, 5.2))
ax.plot(t, model(t), color=ORANGE, lw=3, label="model fit")
tm = np.array([0, 1, 2, 3, 4, 6, 9, 12, 18, 24, 30, 36, 42, 48, 54, 60])
y = model(tm) * np.exp(rng.normal(0, 0.35, tm.size))
ax.scatter(tm, y, color=FG, s=55, zorder=3, label="patient measurements")
# phase annotations
ax.plot(t, 100 * 0.99 * np.exp(-0.55 * t), color=BLUE, lw=1.5, ls="--")
ax.plot(t, 100 * 0.01 * np.exp(-0.025 * t), color=GREEN, lw=1.5, ls="--")
ax.annotate("phase I: fast\ncycling leukemic cells die", xy=(5, 7), xytext=(10, 30), color=BLUE,
            arrowprops=dict(arrowstyle="->", color=BLUE))
ax.annotate("phase II: slow\nquiescent stem cells", xy=(40, model(40)), xytext=(28, 0.8), color=GREEN,
            arrowprops=dict(arrowstyle="->", color=GREEN))
ax.set_yscale("log")
ax.set_ylim(0.005, 200)
ax.set_xlim(0, 60)
ax.set_xlabel("months of TKI therapy")
ax.set_ylabel("BCR-ABL1 / ABL1 (%)")
ax.axhline(0.1, color=GREY, lw=1, ls=":")
ax.text(60, 0.12, "MMR (0.1 %)", ha="right", color=GREY, fontsize=12)
ax.axhline(0.01, color=GREY, lw=1, ls=":")
ax.text(60, 0.012, "MR4 (0.01 %)", ha="right", color=GREY, fontsize=12)
ax.legend(loc="upper right")
fig.tight_layout()
fig.savefig(OUT + "biphasic_decline.svg")
plt.close(fig)

# ---------- Figure 2: dose reduction scenario ----------
def scenario(t, t_red=36, factor=0.5):
    # before reduction: standard model
    y = model(t)
    # after reduction: transient rise of the fast compartment, same long-term slope
    after = t >= t_red
    tau = t[after] - t_red
    y_red = 100 * (0.01 * np.exp(-0.025 * t_red)) * (1 + 1.5 * (1 - np.exp(-0.4 * tau))) * np.exp(-0.025 * tau)
    out = y.copy()
    out[after] = y_red
    return out

t = np.linspace(0, 84, 600)
fig, ax = plt.subplots(figsize=(9, 5.2))
ax.plot(t, model(t), color=ORANGE, lw=3, label="standard dose")
ax.plot(t, scenario(t), color=BLUE, lw=3, label="50 % dose after month 36")
ax.axvspan(36, 84, color=BLUE, alpha=0.08)
ax.axvline(36, color=BLUE, lw=1, ls="--")
ax.text(37, 60, "dose halved", color=BLUE)
ax.set_yscale("log")
ax.set_ylim(0.0005, 200)
ax.set_xlim(0, 84)
ax.set_xlabel("months")
ax.set_ylabel("BCR-ABL1 / ABL1 (%)")
ax.axhline(0.01, color=GREY, lw=1, ls=":")
ax.text(84, 0.012, "MR4", ha="right", color=GREY, fontsize=12)
ax.legend(loc="lower left")
fig.tight_layout()
fig.savefig(OUT + "dose_reduction.svg")
plt.close(fig)

# ---------- Figure 3: clonal dynamics (mRCE idea) ----------
T = 120
nclones = 12
tt = np.arange(T)
sizes = np.ones((nclones, T)) * 100
for i in range(nclones):
    walk = np.cumsum(rng.normal(0, 4, T))
    sizes[i] = np.clip(100 + walk, 10, None)
# malignant clone takes over from t=60
mal = 100 * np.exp(0.06 * np.clip(tt - 60, 0, None))
sizes[3] = np.where(tt < 60, sizes[3], mal + sizes[3][59] - 100)
frac = sizes / sizes.sum(axis=0)
fig, ax = plt.subplots(figsize=(9, 5.2))
colors = [plt.cm.Greys(0.35 + 0.04 * i) for i in range(nclones)]
colors[3] = RED
ax.stackplot(tt, frac, colors=[c for c in colors], alpha=0.9, linewidth=0.3, edgecolor="#222")
ax.axvline(60, color=FG, lw=1, ls="--")
ax.text(61, 0.93, "malignant clone starts expanding", color=FG, fontsize=13)
ax.set_xlim(0, T - 1)
ax.set_ylim(0, 1)
ax.set_xlabel("time")
ax.set_ylabel("clone share of all stem cells")
fig.tight_layout()
fig.savefig(OUT + "clonal_dynamics.svg")
plt.close(fig)

# ---------- Figure 4: complexity (computer science) ----------
n = np.arange(1, 31)
fig, ax = plt.subplots(figsize=(9, 5.2))
ax.plot(n, n, color=GREEN, lw=3, label="n  (read the data once)")
ax.plot(n, n * np.log2(n), color=BLUE, lw=3, label="n log n  (sorting)")
ax.plot(n, n ** 2, color=ORANGE, lw=3, label="n²  (compare everything with everything)")
ax.plot(n, 2.0 ** n, color=RED, lw=3, label="2ⁿ  (try all combinations)")
ax.set_yscale("log")
ax.set_ylim(1, 2e9)
ax.set_xlim(1, 30)
ax.set_xlabel("problem size n")
ax.set_ylabel("number of steps")
ax.axhline(1e9, color=GREY, lw=1, ls=":")
ax.text(29.5, 1.4e9, "one second on a laptop (~10⁹ steps)", color=GREY, fontsize=12, ha="right")
ax.legend(loc="upper left", bbox_to_anchor=(0.0, 0.93), fontsize=13)
fig.tight_layout()
fig.savefig(OUT + "complexity.svg")
plt.close(fig)

# ---------- Figure 5: A/B test (Dataqube) ----------
nA = nB = 60000
pA, pB = 0.0310, 0.0342
seA = np.sqrt(pA * (1 - pA) / nA)
seB = np.sqrt(pB * (1 - pB) / nB)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5.2), gridspec_kw={"width_ratios": [1, 1.4]})
ax1.bar([0, 1], [pA * 100, pB * 100], color=[GREY, ORANGE], width=0.6,
        yerr=[1.96 * seA * 100, 1.96 * seB * 100], capsize=8, ecolor=FG, error_kw={"lw": 2})
ax1.set_xticks([0, 1], ["A: old checkout", "B: one field less"])
ax1.set_ylabel("conversion rate (%)")
ax1.set_ylim(2.8, 3.7)
ax1.text(0, pA * 100 + 0.06, f"{pA*100:.2f} %", ha="center", color=FG, fontsize=14)
ax1.text(1, pB * 100 + 0.06, f"{pB*100:.2f} %", ha="center", color=ORANGE, fontsize=14, fontweight="bold")
ax1.set_title("+0.3 percentage points", color=ORANGE, fontsize=15)
# right: cumulative extra revenue over a year
months = np.arange(0, 13)
visitors_per_month = 400_000
basket = 45.0
extra = (pB - pA) * visitors_per_month * basket * months / 1000
se_month = np.sqrt(seA ** 2 + seB ** 2) * visitors_per_month * basket / 1000
lo = extra - 1.96 * se_month * np.sqrt(months)
hi = extra + 1.96 * se_month * np.sqrt(months)
ax2.plot(months, extra, color=ORANGE, lw=3)
ax2.fill_between(months, lo, hi, color=ORANGE, alpha=0.2, label="95 % interval")
ax2.set_xlabel("months after rollout")
ax2.set_ylabel("extra revenue (k€)")
ax2.set_xlim(0, 12)
ax2.set_ylim(0, None)
ax2.text(12, extra[-1], f"  ≈ {extra[-1]:.0f} k€ / year", color=ORANGE, fontsize=14, va="center", ha="left")
ax2.set_xlim(0, 15.5)
ax2.set_xticks(range(0, 13, 2))
ax2.set_title("same 0.3 pp, in money", color=ORANGE, fontsize=15)
ax2.legend(loc="upper left")
fig.tight_layout()
fig.savefig(OUT + "ab_test.svg")
plt.close(fig)

# ---------- Figure 6: user segments (Dataqube) ----------
fig, ax = plt.subplots(figsize=(9, 5.2))
segs = [
    ("one-timers", 1.3, 35, 0.25, 12, GREY, 500),
    ("bargain hunters", 6, 22, 0.35, 6, BLUE, 350),
    ("loyal regulars", 14, 55, 0.3, 14, GREEN, 300),
    ("big spenders", 5, 160, 0.4, 35, ORANGE, 120),
]
for name, mx, my, sx, sy, col, k in segs:
    x = np.exp(rng.normal(np.log(mx), sx, k))
    y = np.clip(rng.normal(my, sy, k), 5, None)
    ax.scatter(x, y, s=14, color=col, alpha=0.6, edgecolors="none")
    ax.text(mx, my + (sy * 2.3), name, color=col, ha="center", fontsize=14, fontweight="bold")
ax.set_xscale("log")
ax.set_xticks([1, 3, 10, 30], ["1", "3", "10", "30"])
ax.set_xlabel("orders per year")
ax.set_ylabel("average basket (€)")
ax.set_xlim(0.7, 60)
ax.set_ylim(0, 260)
fig.tight_layout()
fig.savefig(OUT + "segments.svg")
plt.close(fig)

# ---------- Figure 7: protein-protein interaction network (bioinformatics) ----------
import networkx as nx
G = nx.barabasi_albert_graph(260, 2, seed=7)
pos = nx.spring_layout(G, k=0.11, iterations=200, seed=7)
deg = np.array([d for _, d in G.degree()])
fig, ax = plt.subplots(figsize=(7.5, 5.6))
nx.draw_networkx_edges(G, pos, ax=ax, edge_color="#777", width=0.6, alpha=0.6)
hubs = deg >= 8
nx.draw_networkx_nodes(G, pos, ax=ax, nodelist=[n for n, h in zip(G.nodes, hubs) if not h],
                       node_size=18 + 6 * deg[~hubs], node_color=BLUE, alpha=0.85, linewidths=0)
nx.draw_networkx_nodes(G, pos, ax=ax, nodelist=[n for n, h in zip(G.nodes, hubs) if h],
                       node_size=18 + 6 * deg[hubs], node_color=ORANGE, alpha=0.95, linewidths=0)
ax.text(0.02, 0.98, "each dot: one protein\neach line: the two interact", transform=ax.transAxes,
        va="top", color=FG, fontsize=13)
ax.text(0.98, 0.02, "orange: hub proteins,\nmany partners", transform=ax.transAxes,
        va="bottom", ha="right", color=ORANGE, fontsize=13)
ax.set_axis_off()
fig.tight_layout()
fig.savefig(OUT + "ppi_network.svg")
plt.close(fig)
print("done")
