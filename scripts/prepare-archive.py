"""Download documented originals and prepare responsive assets. Requires Pillow."""
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCES = {
    "ensemble": "https://static.wixstatic.com/media/ba68a2_88e77d0232bc48e7b1c96b50b9edc501~mv2_d_2126_1414_s_2.jpg",
    "sister-act": "https://static.wixstatic.com/media/ba68a2_a627e800cd514062845637f777ce34d4~mv2_d_3300_2156_s_2.png",
}
LOGO = "https://static.wixstatic.com/media/ba68a2_19e22ae6d0e446b3bf0048459054a510~mv2.png"

def fetch(url):
    with urlopen(url, timeout=60) as response:
        return response.read()

if __name__ == "__main__":
    folder = ROOT / "public" / "images"
    for name, url in SOURCES.items():
        original = ImageOps.exif_transpose(Image.open(BytesIO(fetch(url)))).convert("RGB")
        print(name, "original:", original.size)
        for width in (640, 1100, 1600):
            photo = original.copy()
            photo.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
            target = folder / f"archive-{name}-{width}.webp"
            photo.save(target, "WEBP", quality=84, method=6)
            print(target.name, photo.size, target.stat().st_size)
    brand = ROOT / "public" / "brand"
    brand.mkdir(exist_ok=True)
    data = fetch(LOGO)
    (brand / "crazy-gang-original.png").write_bytes(data)
    logo = Image.open(BytesIO(data)).convert("RGBA")
    for width in (320, 640, 960):
        resized = logo.copy()
        resized.thumbnail((width, width), Image.Resampling.LANCZOS)
        resized.save(brand / f"crazy-gang-{width}.webp", "WEBP", lossless=True, method=6)
    icon = Image.new("RGBA", (64, 64), (24, 25, 23, 255))
    small = logo.copy()
    small.thumbnail((64, 64), Image.Resampling.LANCZOS)
    icon.alpha_composite(small, (0, (64 - small.height) // 2))
    icon.save(ROOT / "public" / "favicon.png")

