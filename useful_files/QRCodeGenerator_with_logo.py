import qrcode
from PIL import Image

# === Configuration ===
url = "https://nomad-matchandtaste.vercel.app/"
logo_path = "public/images/nomad_logo.jpg"
output_path = "public/images/qr_code_with_logo.png"
qr_size = 300  # Final size in pixels (for 2.5x2.5 cm @ 300 DPI)
logo_scale = 3  # Logo will be 1/logo_scale the size of the QR code

# === Generate QR Code ===
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for logo embedding
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Create QR code image
qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)

# === Embed Logo ===
logo = Image.open(logo_path)

# Resize logo
logo_size = qr_size // logo_scale
logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

# Calculate position and paste
pos = ((qr_size - logo_size) // 2, (qr_size - logo_size) // 2)
qr_img.paste(logo, pos, mask=logo if logo.mode == 'RGBA' else None)

# Save result
qr_img.save(output_path)
print(f"QR code with logo saved as: {output_path}")
