"""Download verified Crazy Gang archive photos and create responsive WebP pairs."""
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
WIX = "https://static.wixstatic.com/media/"
SOURCES = {
    "sister-act": "ba68a2_a627e800cd514062845637f777ce34d4~mv2_d_3300_2156_s_2.png",
    "ensemble": "ba68a2_88e77d0232bc48e7b1c96b50b9edc501~mv2_d_2126_1414_s_2.jpg",
    "producers-01": "ba68a2_b9077a0bccde4360829167f5dfaf1e05.jpg",
    "producers-02": "ba68a2_c3c142cdd82a48f3aade1f59bf68a336.jpg",
    "producers-03": "ba68a2_44608e5b5cc04f7ba0643eb82b0aee4d.jpg",
    "producers-04": "ba68a2_19cc1732583442e8bd665d7065078a5e.jpg",
    "dracula-01": "ba68a2_01c2a9aa11114f14b99c7a427a42c1c7.jpg",
    "dracula-02": "ba68a2_03254c81939c42a18c21f9b4c649f7aa.jpg",
    "dracula-03": "ba68a2_94321a07ba5548ec9e404bcbdade4f8d.jpg",
    "dracula-04": "ba68a2_7626fb8d829d4921a4f0bf9b966a3b3f.jpg",
    "mary-poppins-01": "ba68a2_e11ba8ec8c9d4933be4fad73e8a3f7e4.jpg",
    "mary-poppins-02": "ba68a2_60e6429f9c2041e196f8200e80720cb8.jpg",
    "mary-poppins-03": "ba68a2_c265fb9618e74d42ac2991ae342d4949.jpg",
    "modern-01": "ba68a2_0df4654b846140e0bd143478c8c4f818.jpg",
    "modern-02": "ba68a2_19d8bcbb1bc34fd5a27d125858ce1e60.jpg",
    "modern-03": "ba68a2_1cced00faded4698ad260d361be34004~mv2_d_3104_4672_s_4_2.jpg",
    "modern-04": "ba68a2_5abf72d114ed416aad9bcae85ab43df1~mv2_d_3300_2194_s_2.jpg",
    "modern-05": "ba68a2_65833f9e16ec4974b5a000cc0e5c2e4e~mv2_d_2126_1414_s_2.jpg",
    "modern-06": "ba68a2_78c4e5bd2d7b4ab1b0649c5e24a0ebc0~mv2_d_3842_2546_s_4_2.jpg",
    "modern-07": "ba68a2_8e63f34464b54d41a37b114702f6d435~mv2_d_3008_2000_s_2.jpg",
    "modern-08": "ba68a2_9dd130c0c31c497d9bcbce1e4ca43b1e~mv2_d_2126_1414_s_2.jpg",
    "baby-01": "ba68a2_0e4ffad6b2754e88b2f4d989c2ba85c0~mv2.jpg",
    "baby-02": "ba68a2_2e8bb8138c5d45fb9588775c3ef3e433~mv2.jpg",
    "baby-03": "ba68a2_579683ac38f54c728fbdb998dede7249~mv2.jpg",
    "baby-04": "ba68a2_60b6b85723254de2a9606ccee8351a99~mv2.jpg",
    "baby-05": "ba68a2_6ecc576375d644168e9aa06e6cfe5215~mv2.jpg",
    "baby-06": "ba68a2_769d6c5d28bb440286a9d620268750d7~mv2.jpg",
    "classical": "ba68a2_9990dce66ac645bdac5b8910c1de387a~mv2_d_2560_1600_s_2.jpg",
}


def fetch(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "Crazy Gang local prototype asset prep"})
    with urlopen(request, timeout=90) as response:
        return response.read()


if __name__ == "__main__":
    folder = ROOT / "public" / "images" / "gallery"
    folder.mkdir(parents=True, exist_ok=True)
    for name, media_id in SOURCES.items():
        targets = [folder / f"{name}-{width}.webp" for width in (640, 960, 1600)]
        if all(target.exists() for target in targets):
            print(f"{name}: already prepared")
            continue
        try:
            original = ImageOps.exif_transpose(
                Image.open(BytesIO(fetch(WIX + media_id)))
            ).convert("RGB")
        except Exception as error:
            print(f"{name}: skipped ({error})")
            continue
        outputs = []
        for width, quality in ((640, 79), (960, 82), (1600, 84)):
            photo = original.copy()
            photo.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
            target = folder / f"{name}-{width}.webp"
            photo.save(target, "WEBP", quality=quality, method=6)
            outputs.append(f"{target.name} {photo.width}x{photo.height} {target.stat().st_size // 1024}KB")
        print(f"{name}: {original.width}x{original.height} -> " + ", ".join(outputs))
