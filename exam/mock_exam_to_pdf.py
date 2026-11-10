#!/usr/bin/env python3
"""
Convert mock_exam.md to a two-column PDF.

Usage:
  python3 mock_exam_to_pdf.py
  python3 mock_exam_to_pdf.py --interactive
  python3 mock_exam_to_pdf.py --input mock_exam.md --output mock_exam.pdf
  python3 mock_exam_to_pdf.py --include-answers

If dependencies are missing, install with:
  python3 -m pip install markdown weasyprint
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def _require_dependencies():
    try:
        from markdown import markdown  # noqa: F401
        from weasyprint import HTML  # noqa: F401
    except Exception:
        print(
            "Missing dependencies. Install with:\n"
            "  python3 -m pip install markdown weasyprint",
            file=sys.stderr,
        )
        sys.exit(1)


def _split_answer_key(text: str) -> tuple[str, str]:
    marker = "Answer Key"
    if marker in text:
        before, after = text.split(marker, 1)
        return before.strip(), (marker + after).strip()
    return text.strip(), ""


def _ensure_option_line_breaks(text: str) -> str:
    lines = text.splitlines()
    updated = []
    for idx, line in enumerate(lines):
        next_line = lines[idx + 1] if idx + 1 < len(lines) else ""
        is_option_line = (
            line.startswith("   ")
            and len(line) > 4
            and line[3] in "ABCD"
            and line[4] == "."
        )
        is_question_line = line.strip().startswith(tuple(f"{n}." for n in range(1, 1000)))
        next_is_option_line = (
            next_line.startswith("   ")
            and len(next_line) > 4
            and next_line[3] in "ABCD"
            and next_line[4] == "."
        )

        if is_question_line and next_is_option_line and not line.endswith("  "):
            line = line + "  "

        if is_option_line and not line.endswith("  "):
            line = line + "  "

        updated.append(line)
    return "\n".join(updated)


def _mark_intro_line(text: str) -> str:
    lines = text.splitlines()
    for idx, line in enumerate(lines):
        if line.startswith("# "):
            for j in range(idx + 1, len(lines)):
                candidate = lines[j].strip()
                if not candidate:
                    continue
                if candidate.startswith("#"):
                    return "\n".join(lines)
                if candidate.startswith("<"):
                    return "\n".join(lines)
                lines[j] = f'<p class="intro">{candidate}</p>'
                return "\n".join(lines)
    return text


def _split_sections(text: str) -> tuple[str, list[tuple[str, str]]]:
    lines = text.splitlines()
    preface: list[str] = []
    sections: list[tuple[str, str]] = []
    current_heading: str | None = None
    current_body: list[str] = []

    for line in lines:
        if line.startswith("## "):
            if current_heading is not None:
                sections.append((current_heading, "\n".join(current_body).strip()))
                current_body = []
            current_heading = line[3:].strip()
            continue

        if current_heading is None:
            preface.append(line)
        else:
            current_body.append(line)

    if current_heading is not None:
        sections.append((current_heading, "\n".join(current_body).strip()))

    return "\n".join(preface).strip(), sections



def _build_html(
    preface_md: str,
    sections: list[tuple[str, str]],
    answer_md: str,
    base_url: str,
    section_breaks: bool = True,
) -> str:
    from markdown import markdown

    preface_html = markdown(preface_md, extensions=["extra"]) if preface_md else ""
    sections_html = []
    for idx, (heading, body_md) in enumerate(sections):
        heading_html = markdown(f"## {heading}", extensions=["extra"])
        body_html = markdown(body_md, extensions=["extra"]) if body_md else ""
        # keep the question numbers from the markdown (each section is its own <ol>, which would restart at 1)
        first = re.search(r"^\s*(\d+)\.\s", body_md, re.M) if body_md else None
        if first and first.group(1) != "1":
            body_html = body_html.replace("<ol>", f'<ol start="{first.group(1)}">', 1)
        section_class = "section first-section" if (idx == 0 and preface_md) or not section_breaks else "section"
        sections_html.append(
            f'<div class="{section_class}">{heading_html}<div class="questions">{body_html}</div></div>'
        )
    answer_html = markdown(answer_md, extensions=["extra"]) if answer_md else ""

    preface_block = "<div class=\"questions preface\">" + preface_html + "</div>" if preface_html else ""

    sections_block = "".join(sections_html)

    answer_block = "<div class=\"answer-key\">" + answer_html + "</div>" if answer_html else ""

    return f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page {{
        size: A4;
        margin: 12mm;
      }}
      body {{
        font-family: "Helvetica", "Arial", sans-serif;
        font-size: 10.5pt;
        line-height: 1.25;
        color: #111;
      }}
      h1, h2 {{
        margin: 0 0 6pt 0;
      }}
      h1, h2 {{
        column-span: all;
      }}
      .section {{
        break-before: page;
        page-break-before: always;
      }}
      .section.first-section {{
        break-before: auto;
        page-break-before: auto;
      }}
      .intro {{
        white-space: nowrap;
        break-inside: avoid;
        margin: 0 0 6pt 0;
      }}
      .questions {{
        column-count: 2;
        column-gap: 18px;
      }}
      ol, ul {{
        margin: 0 0 6pt 18pt;
        padding: 0;
      }}
      li {{
        margin: 0 0 4pt 0;
        break-inside: avoid;
        page-break-inside: avoid;
      }}
      .answer-key {{
        margin-top: 12pt;
        column-count: 1;
      }}
    </style>
  </head>
  <body>
    {preface_block}
    {sections_block}
    {answer_block}
  </body>
</html>
"""


def _prompt_with_default(label: str, default_value: str) -> str:
    prompt = f"{label} [{default_value}]: "
    value = input(prompt).strip()
    return value or default_value


def main() -> int:
    _require_dependencies()

    script_dir = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(
        description="Convert mock exam markdown to two-column PDF."
    )
    parser.add_argument(
        "--input",
        default=str(script_dir / "mock_exam.md"),
        help="Path to input markdown file.",
    )
    parser.add_argument(
        "--output",
        default=str(script_dir / "mock_exam.pdf"),
        help="Path to output PDF file.",
    )
    parser.add_argument(
        "--interactive",
        action="store_true",
        help="Prompt for input/output paths.",
    )
    parser.add_argument(
        "--include-answers",
        action="store_true",
        help="Include the answer key at the end of the PDF.",
    )
    parser.add_argument(
        "--no-section-breaks",
        action="store_true",
        help="Do not start every section on a new page (for short tests).",
    )
    args = parser.parse_args()

    run_interactive = args.interactive or len(sys.argv) == 1
    if run_interactive:
        print("Mock exam PDF generator (two-column layout)")
        input_value = _prompt_with_default("Input markdown", args.input)
        output_value = _prompt_with_default("Output PDF", args.output)
        include_value = _prompt_with_default("Include answer key? (y/N)", "N")
        include_answers = include_value.strip().lower().startswith("y")
    else:
        input_value = args.input
        output_value = args.output
        include_answers = args.include_answers

    input_path = Path(input_value).expanduser().resolve()
    output_path = Path(output_value).expanduser().resolve()

    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        return 1

    text = input_path.read_text(encoding="utf-8")
    questions_md, answer_md = _split_answer_key(text)
    preface_md, sections = _split_sections(questions_md)
    if preface_md:
        preface_md = _mark_intro_line(preface_md)
        preface_md = _ensure_option_line_breaks(preface_md)
    formatted_sections = []
    for heading, body_md in sections:
        body_md = _ensure_option_line_breaks(body_md)
        formatted_sections.append((heading, body_md))
    if not include_answers:
        answer_md = ""
    html = _build_html(
        preface_md, formatted_sections, answer_md, base_url=str(input_path.parent),
        section_breaks=not args.no_section_breaks,
    )

    from weasyprint import HTML

    HTML(string=html, base_url=str(input_path.parent)).write_pdf(str(output_path))
    print(f"PDF created: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
