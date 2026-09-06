from pathlib import Path

from PIL import Image, ImageOps

SOURCE = Path("source-assets/teacher-originals")
OUTPUT = Path("public/images/teachers")
MAX_WIDTH = 1000

def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source in sorted(SOURCE.glob("*.jpg")):
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            if image.width > MAX_WIDTH:
                height = round(image.height * MAX_WIDTH / image.width)
                image = image.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)
            image.save(OUTPUT / f"{source.stem}.webp", "WEBP", quality=84, method=6)
            print(f"{source.stem}.webp: {image.width}x{image.height}")

if __name__ == "__main__":
    main()
