from __future__ import annotations

import pathlib
import re
import sys


WIKI_CONTENT_DIRECTORY = pathlib.Path("documentation/wiki/content")
MARKDOWN_LINK_PATTERN = re.compile(r"\[[^\]]+\]\(([^)]+)\)")


def main() -> int:
    missing_targets: list[str] = []

    for markdown_path in WIKI_CONTENT_DIRECTORY.glob("*.md"):
        markdown_text = markdown_path.read_text(encoding="utf-8")

        for matched_link_target in MARKDOWN_LINK_PATTERN.findall(markdown_text):
            if matched_link_target.startswith("http://") or matched_link_target.startswith("https://"):
                continue

            resolved_target_path = (markdown_path.parent / matched_link_target).resolve()

            if not resolved_target_path.exists():
                missing_targets.append(f"{markdown_path.as_posix()} -> {matched_link_target}")

    if missing_targets:
        print("Wiki link validation failed. Missing targets:")

        for missing_target in missing_targets:
            print(missing_target)

        return 1

    print("Wiki link validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
