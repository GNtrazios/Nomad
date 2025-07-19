import qrcode
from PIL import Image, ImageDraw, ImageOps, ImageFilter

# === CONFIGURATION ===
url = "https://nomad-matchandtaste.vercel.app/"
output_path = "pretty_qr.png"
final_size = 600  # Final image size in pixels (2x upscale for sharp print)
qr_size = 400     # Size of actual QR in center
bg_color = "#f4f4f6"
qr_fill = "#111111"
qr_back = "white"
corner_radius = 50
border_padding = (final_size - qr_size) // 2
logo_path = "logo.png"
embed_logo = False

# === Generate QR ===
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

qr_img = qr.make_image(fill_color=qr_fill, back_color=qr_back).convert("RGBA")
qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)

# === Create background with rounded corners ===
canvas = Image.new("RGBA", (final_size, final_size), bg_color)
mask = Image.new("L", (final_size, final_size), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle([0, 0, final_size, final_size], radius=corner_radius, fill=255)
bg_rounded = Image.new("RGBA", (final_size, final_size), bg_color)
canvas = Image.composite(canvas, Image.new("RGBA", (final_size, final_size)), mask)

# === Paste QR onto center ===
qr_position = (
    (final_size - qr_size) // 2,
    (final_size - qr_size) // 2
)
canvas.paste(qr_img, qr_position, qr_img)

# === Optional: Add logo ===
if embed_logo:
    try:
        logo = Image.open(logo_path).convert("RGBA")
        logo_size = qr_size // 4
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

        # Optional: round logo
        logo_mask = Image.new("L", logo.size, 0)
        draw = ImageDraw.Draw(logo_mask)
        draw.ellipse((0, 0, logo_size, logo_size), fill=255)
        logo.putalpha(logo_mask)

        # Optional: drop shadow
        shadow = Image.new("RGBA", logo.size, (0, 0, 0, 64))
        shadow = shadow.filter(ImageFilter.GaussianBlur(4))

        logo_pos = (
            (final_size - logo_size) // 2,
            (final_size - logo_size) // 2
        )
        canvas.paste(shadow, logo_pos, shadow)
        canvas.paste(logo, logo_pos, logo)
    except FileNotFoundError:
        print("⚠️ Logo not found, skipping logo.")

# === Save final image ===
canvas.save(output_path)
print(f"✅ Pretty QR code saved as: {output_path}")
