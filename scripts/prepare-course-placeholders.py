from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-assets" / "course-placeholders"
OUTPUT = ROOT / "public" / "images" / "courses"
WIDTHS = (640, 1200, 1800)

OUTPUT.mkdir(parents=True, exist_ok=True)
for source in SOURCE.glob("*.jpg"):
    with Image.open(source) as image:
        image = image.convert("RGB")
        for width in WIDTHS:
            target_width = min(width, image.width)
            height = round(image.height * target_width / image.width)
            resized = image.resize((target_width, height), Image.Resampling.LANCZOS)
            output = OUTPUT / f"{source.stem}-{width}.webp"
            resized.save(output, "WEBP", quality=82, method=6)
            print(f"{output.relative_to(ROOT)} {target_width}x{height}")
