"""One-off: convert public/ PNG/JPG assets to WebP and remove originals."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).resolve().parents[1] / "public"
EXTS = {".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"}


def has_alpha(img: Image.Image) -> bool:
    return img.mode in ("RGBA", "LA") or (
        img.mode == "P" and "transparency" in img.info
    )


def main() -> None:
    results: list[tuple[str, int, int, float, bool]] = []
    total_before = 0
    total_after = 0

    for src in sorted(PUBLIC.iterdir()):
        if not src.is_file() or src.suffix not in EXTS:
            continue

        dst = src.with_suffix(".webp")
        before = src.stat().st_size
        img = Image.open(src)
        alpha = has_alpha(img)

        if alpha:
            img = img.convert("RGBA")
            img.save(dst, "WEBP", quality=90, method=6)
        else:
            img = img.convert("RGB")
            quality = 82
            img.save(dst, "WEBP", quality=quality, method=6)
            if src.name.lower().startswith("og-share") and dst.stat().st_size > 300 * 1024:
                for quality in (75, 68, 60, 52):
                    img.save(dst, "WEBP", quality=quality, method=6)
                    if dst.stat().st_size <= 300 * 1024:
                        break

        after = dst.stat().st_size
        total_before += before
        total_after += after
        pct = (1 - after / before) * 100 if before else 0.0
        results.append((src.name, before, after, pct, alpha))
        src.unlink()

    print(f"Converted {len(results)} files")
    print(f"Total before: {total_before / 1024 / 1024:.2f} MB")
    print(f"Total after:  {total_after / 1024 / 1024:.2f} MB")
    saved = total_before - total_after
    print(
        f"Saved:        {saved / 1024 / 1024:.2f} MB "
        f"({(saved / total_before) * 100:.1f}%)"
    )
    print("---")
    for name, before, after, pct, alpha in sorted(results, key=lambda x: -x[1]):
        kind = "alpha" if alpha else "photo"
        print(f"{name:45} {before / 1024:8.0f} KB -> {after / 1024:8.0f} KB ({pct:5.1f}%) {kind}")


if __name__ == "__main__":
    main()
