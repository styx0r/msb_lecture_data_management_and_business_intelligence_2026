"""Mock dashboard for the BI deck (case study: online retailer, Kitchen returns).

Run from the repo root:  python3 slides/assets/business_intelligence/make_dashboard.py
All numbers are invented to match the story on the slides.
"""
from pathlib import Path

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.gridspec import GridSpec

matplotlib.use("Agg")
OUT = Path(__file__).parent
ACCENT, GREEN, BLUE, RED, MUTED, TEXT = "#ffa726", "#90ee90", "#4fc3f7", "#ef5350", "#9e9e9e", "#dddddd"
plt.rcParams.update({
    "figure.facecolor": "none", "axes.facecolor": "none", "savefig.transparent": True,
    "text.color": TEXT, "axes.labelcolor": TEXT, "axes.edgecolor": MUTED,
    "xtick.color": TEXT, "ytick.color": TEXT, "axes.spines.top": False, "axes.spines.right": False,
    "font.size": 12, "legend.frameon": False, "svg.fonttype": "none",
})
rng = np.random.default_rng(7)

fig = plt.figure(figsize=(12, 5.2))
gs = GridSpec(2, 3, height_ratios=[1.1, 2.6], hspace=0.6, wspace=0.3, figure=fig)

# ---- KPI tiles -------------------------------------------------------------
tiles = [
    ("Return rate, Kitchen (Mar)", "18 %", "+12 pp vs. last year", RED),
    ("Repeat purchase rate (Mar)", "31 %", "was 38 % last year", RED),
    ("Open tickets, Kitchen", "412", "+230 since Feb 1", ACCENT),
]
for i, (label, value, sub, col) in enumerate(tiles):
    ax = fig.add_subplot(gs[0, i]); ax.axis("off")
    ax.add_patch(plt.Rectangle((0, 0), 1, 1, transform=ax.transAxes, facecolor="white", alpha=0.06, edgecolor=MUTED, lw=0.8))
    ax.text(0.05, 0.78, label, fontsize=10.5, color=MUTED, transform=ax.transAxes)
    ax.text(0.05, 0.36, value, fontsize=24, fontweight="bold", color=TEXT, transform=ax.transAxes)
    ax.text(0.05, 0.08, sub, fontsize=10, color=col, transform=ax.transAxes)

# ---- returns per week by supplier -----------------------------------------
weeks = np.arange(1, 17)
mueller = np.clip(rng.normal(14, 2.5, 16), 8, 20)
mueller[4:] *= np.linspace(1, 0.35, 12)              # Mueller phased out after the change
fastparts = np.zeros(16); fastparts[4:] = np.clip(np.linspace(10, 62, 12) + rng.normal(0, 4, 12), 5, 80)
ax = fig.add_subplot(gs[1, :2])
ax.plot(weeks, mueller, marker="o", ms=4, color=BLUE, lw=2, label="Mueller GmbH (old supplier)")
ax.plot(weeks, fastparts, marker="o", ms=4, color=RED, lw=2, label="FastParts Ltd (new supplier)")
ax.axvline(5, color=ACCENT, ls="--", lw=1.5)
ax.text(5.2, ax.get_ylim()[1] * 0.95, "supplier change\n2026-02-01", color=ACCENT, fontsize=10, va="top")
ax.set_title("Returns per week, category Kitchen, by supplier", loc="left", fontsize=12)
ax.set_xlabel("calendar week 2026"); ax.set_ylabel("returned items")
ax.legend(loc="center left", fontsize=10)

# ---- repeat purchase rate by month, this year vs last -----------------------
months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
last = np.array([37, 38, 39, 38, 38, 38]); this = np.array([38, 38, 39, 37, 34, 31])
ax = fig.add_subplot(gs[1, 2]); x = np.arange(6); w = 0.38
ax.bar(x - w / 2, last, w, color=MUTED, label="2024/25")
ax.bar(x + w / 2, this, w, color=ACCENT, label="2025/26")
for i, v in enumerate(this): ax.text(x[i] + w / 2, v + 0.6, f"{v}", ha="center", fontsize=9, color=TEXT)
ax.set_xticks(x); ax.set_xticklabels(months); ax.set_ylim(25, 46)
ax.set_title("Repeat purchase rate (%)", loc="left", fontsize=12)
ax.legend(loc="upper left", fontsize=8.5, ncol=2)

fig.savefig(OUT / "retailer_dashboard.svg")
print("wrote retailer_dashboard.svg")
