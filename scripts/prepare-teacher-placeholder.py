"""Generate a generic silhouette placeholder for a teacher without a photo yet."""
from pathlib import Path

from PIL import Image, ImageDraw

OUTPUT = Path("public/images/teachers")
PAPER = (242, 240, 233)
LINE = (204, 202, 194)
WIDTH, HEIGHT = 1000, 1250


def make_silhouette():
    img = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    draw = ImageDraw.Draw(img)

    cx, cy = WIDTH / 2, HEIGHT * 0.42
    head_r = WIDTH * 0.16
    draw.ellipse([cx - head_r, cy - head_r, cx + head_r, cy + head_r], fill=LINE)

    shoulder_w = WIDTH * 0.62
    sy = cy + head_r * 1.15
    draw.pieslice([cx - shoulder_w / 2, sy - shoulder_w / 2, cx + shoulder_w / 2, sy + shoulder_w / 2], 180, 360, fill=LINE)
    draw.rectangle([cx - shoulder_w / 2, sy, cx + shoulder_w / 2, HEIGHT], fill=LINE)
    return img


def main(name):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    img = make_silhouette()
    target = OUTPUT / f"{name}.webp"
    img.save(target, "WEBP", quality=84, method=6)
    print(f"{target}: {img.width}x{img.height}")


if __name__ == "__main__":
    import sys
    main(sys.argv[1] if len(sys.argv) > 1 else "agnese-pini")
