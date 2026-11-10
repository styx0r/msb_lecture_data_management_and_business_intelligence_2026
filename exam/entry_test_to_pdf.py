#!/usr/bin/env python3
"""Build a printable multiple-choice test with tick boxes from a markdown file.

Usage:
  python3 entry_test_to_pdf.py entry_test_day3.md                 # student version
  python3 entry_test_to_pdf.py entry_test_day3.md --solution      # correct boxes ticked, answer key, scoring

Markdown format: "# Title", one intro paragraph, "## Section" headings, questions as
"N. text" with options "   A. text" (A to D), then "Answer Key" with "1-B, 2-A, ..." and an
optional scoring paragraph. Same format as mock_exam.md.
"""
from __future__ import annotations

import argparse
import html
import re
from pathlib import Path

COURSE = "Data Management and Business Intelligence 2026"
DATE = "Saturday, 14 November 2026"


def parse(text: str):
    body, _, key_part = text.partition("Answer Key")
    title = re.search(r"^# (.+)$", body, re.M).group(1).strip()
    intro = ""
    sections = []
    cur = None
    q = None
    for line in body.splitlines():
        if line.startswith("# "):
            continue
        m = re.match(r"^## (.+)$", line)
        if m:
            cur = {"title": m.group(1).strip(), "questions": []}
            sections.append(cur)
            continue
        m = re.match(r"^(\d+)\. (.+)$", line)
        if m and cur is not None:
            q = {"n": int(m.group(1)), "text": m.group(2).strip(), "options": []}
            cur["questions"].append(q)
            continue
        m = re.match(r"^\s{3}([A-D])\. (.+)$", line)
        if m and q is not None:
            q["options"].append((m.group(1), m.group(2).strip()))
            continue
        if cur is None and line.strip():
            intro += (" " if intro else "") + line.strip()
    answers = dict(re.findall(r"(\d+)-([A-D])", key_part))
    scoring = ""
    m = re.search(r"^Scoring:.*$", key_part, re.M)
    if m:
        scoring = m.group(0)
    return title, intro, sections, {int(k): v for k, v in answers.items()}, scoring


def inline(s: str) -> str:
    s = html.escape(s)
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", s)


def build(title, intro, sections, answers, scoring, solution: bool) -> str:
    n_total = sum(len(s["questions"]) for s in sections)
    parts = []
    for sec in sections:
        parts.append(f'<h2>{html.escape(sec["title"])} <span class="pts">{len(sec["questions"])} points</span></h2>')
        for q in sec["questions"]:
            opts = []
            for letter, text in q["options"]:
                ok = solution and answers.get(q["n"]) == letter
                opts.append(
                    f'<div class="opt{" ok" if ok else ""}"><span class="box">{"&#10003;" if ok else ""}</span>'
                    f'<span class="letter">{letter}</span><span class="otext">{inline(text)}</span></div>'
                )
            parts.append(
                f'<div class="q"><div class="qhead"><span class="num">{q["n"]}</span><span class="qtext">{inline(q["text"])}</span></div>'
                f'<div class="opts">{"".join(opts)}</div></div>'
            )
    key_html = ""
    if solution:
        key = ", ".join(f"{n}-{answers[n]}" for n in sorted(answers))
        key_html = f'<div class="key"><b>Answer key.</b> {key}<br/>{html.escape(scoring)}</div>'
    header = f"""
    <div class="head">
      <div class="course">{COURSE}</div>
      <h1>{html.escape(title)}{" &middot; SOLUTION" if solution else ""}</h1>
      <div class="meta">{DATE}</div>
      <div class="fields">
        <div class="field"><span>Name</span><span class="line"></span></div>
        <div class="field short"><span>Points</span><span class="line"></span><span class="of">/ {n_total}</span></div>
      </div>
      <p class="intro">{inline(intro)}</p>
    </div>"""
    css = """
    @page { size: A4; margin: 16mm 16mm 18mm 16mm;
            @bottom-center { content: "Page " counter(page) " of " counter(pages); font-size: 8.5pt; color: #777; font-family: Helvetica, Arial, sans-serif; } }
    body { font-family: Helvetica, Arial, sans-serif; font-size: 10.5pt; color: #111; line-height: 1.3; }
    code { font-family: "DejaVu Sans Mono", Menlo, monospace; font-size: 9.3pt; background: #f1f1f1; padding: 0 2px; border-radius: 2px; }
    .head { border-bottom: 2px solid #111; padding-bottom: 6pt; margin-bottom: 8pt; }
    .course { font-size: 9pt; color: #555; text-transform: uppercase; letter-spacing: 0.06em; }
    h1 { font-size: 18pt; margin: 2pt 0 2pt 0; }
    .meta { font-size: 10pt; color: #333; margin-bottom: 8pt; }
    .fields { display: flex; gap: 18pt; margin: 6pt 0 8pt 0; }
    .field { display: flex; align-items: flex-end; gap: 6pt; flex: 1; }
    .field.short { flex: 0 0 150pt; }
    .field .line { display: inline-block; flex: 1; border-bottom: 1px solid #111; height: 12pt; }
    .field .of { color: #333; }
    .intro { margin: 0; font-size: 10pt; color: #222; }
    h2 { font-size: 12.5pt; margin: 12pt 0 4pt 0; padding-bottom: 2pt; border-bottom: 1px solid #999; break-after: avoid; }
    h2 .pts { float: right; font-weight: normal; font-size: 9.5pt; color: #555; }
    .q { break-inside: avoid; page-break-inside: avoid; margin: 0 0 7pt 0; }
    .qhead { display: flex; gap: 6pt; align-items: baseline; }
    .num { flex: 0 0 18pt; font-weight: bold; text-align: right; }
    .qtext { flex: 1; }
    .opts { margin: 2pt 0 0 24pt; }
    .opt { display: block; margin: 1.5pt 0; padding-left: 30pt; text-indent: -30pt; }
    .box { display: inline-block; width: 10pt; height: 10pt; border: 1px solid #111; border-radius: 2px; vertical-align: -1.5pt;
           font-size: 8.5pt; line-height: 10pt; text-align: center; text-indent: 0; margin-right: 5pt; }
    .letter { display: inline-block; width: 13pt; color: #444; text-indent: 0; }
    .otext { text-indent: 0; }
    .opt.ok .box { background: #111; color: #fff; }
    .opt.ok .otext { font-weight: bold; }
    .key { margin-top: 14pt; padding: 6pt 8pt; border: 1px solid #999; background: #f6f6f6; font-size: 10pt; }
    """
    return f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{header}{''.join(parts)}{key_html}</body></html>"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--solution", action="store_true")
    ap.add_argument("--output")
    args = ap.parse_args()
    src = Path(args.input)
    out = Path(args.output) if args.output else src.with_name(src.stem + ("_solution" if args.solution else "") + ".pdf")
    title, intro, sections, answers, scoring = parse(src.read_text(encoding="utf-8"))
    doc = build(title, intro, sections, answers, scoring, args.solution)
    from weasyprint import HTML
    HTML(string=doc).write_pdf(str(out))
    print("PDF created:", out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
