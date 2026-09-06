"""Prepare responsive copies of the existing, explicitly temporary photographs."""
from pathlib import Path
from PIL import Image, ImageOps
ROOT = Path(__file__).resolve().parent.parent / "public" / "images"
for name, sizes in (("stage", (480, 900, 1300)), ("studio", (480, 900, 1100))):
    original = ImageOps.exif_transpose(Image.open(ROOT / f"dance-{name}.jpg")).convert("RGB")
    print(name, original.size)
    for width in sizes:
        photo = original.copy()
        photo.thumbnail((width, width * 3), Image.Resampling.LANCZOS)
        target = ROOT / f"placeholder-{name}-{width}.webp"
        photo.save(target, "WEBP", quality=82, method=6)
        print(target.name, photo.size, target.stat().st_size)

