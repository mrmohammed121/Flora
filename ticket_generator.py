"""
ticket_generator.py
Populate and render the event ticket card dynamically from JSON using Python and Pillow (PIL).
Features:
- Scalloped perforated top and bottom edges
- Left and right side notches
- Dotted tear-off line with scissor icon
- Holographic pearlescent pastel gradient
- Barcode rendering
- JSON data mapping
- High-res PNG export
"""

import json
import math
import os
from PIL import Image, ImageDraw, ImageFont

def create_holographic_gradient(width, height):
    """Generate a pearlescent / holographic pastel sheen gradient (soft green, purple, and pink)."""
    base = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(base)

    # Multi-directional pastel holographic wash
    for y in range(height):
        # Vertical blend from mint green to lavender pink
        t = y / max(1, height - 1)
        # Soft mint green: (180, 240, 210)
        # Soft lavender: (210, 180, 240)
        # Soft rose pink: (240, 190, 220)
        if t < 0.5:
            interp = t / 0.5
            r = int(190 + (215 - 190) * interp)
            g = int(235 + (195 - 235) * interp)
            b = int(215 + (240 - 215) * interp)
        else:
            interp = (t - 0.5) / 0.5
            r = int(215 + (245 - 215) * interp)
            g = int(195 + (205 - 195) * interp)
            b = int(240 + (225 - 240) * interp)

        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    # Add diagonal metallic sheen overlay
    sheen = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    sheen_draw = ImageDraw.Draw(sheen)
    center_x, center_y = width * 0.6, height * 0.45
    max_radius = math.hypot(width, height)

    for radius in range(int(max_radius), 0, -8):
        alpha = int(20 * (1 - radius / max_radius))
        # Subtle iridescent highlights
        sheen_draw.ellipse(
            [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
            outline=(255, 255, 255, alpha),
            width=6
        )

    return Image.alpha_composite(base, sheen)

def create_ticket_mask(width, height, scallop_radius=10, notch_radius=14, notch_y=110):
    """Create a ticket alpha mask with scalloped edges and side notches."""
    mask = Image.new("L", (width, height), 255)
    draw = ImageDraw.Draw(mask)

    # Top scalloped / perforated teeth
    diameter = scallop_radius * 2
    count = int(width / diameter) + 2
    offset = (width - (count * diameter)) // 2

    for i in range(count + 1):
        cx = offset + i * diameter
        draw.ellipse([cx - scallop_radius, -scallop_radius, cx + scallop_radius, scallop_radius], fill=0)

    # Bottom scalloped / perforated teeth
    for i in range(count + 1):
        cx = offset + i * diameter
        draw.ellipse([cx - scallop_radius, height - scallop_radius, cx + scallop_radius, height + scallop_radius], fill=0)

    # Left side notch
    draw.ellipse([-notch_radius, notch_y - notch_radius, notch_radius, notch_y + notch_radius], fill=0)

    # Right side notch
    draw.ellipse([width - notch_radius, notch_y - notch_radius, width + notch_radius, notch_y + notch_radius], fill=0)

    return mask

def draw_barcode(draw, x_start, y_start, width, height, code_seed="98421074523"):
    """Render procedural barcode lines at the specified coordinates."""
    # Pattern of bar widths
    pattern = [1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 1, 2, 1, 2]
    curr_x = x_start
    for i, bar_w in enumerate(pattern):
        # Draw black bar every other index
        if i % 2 == 0:
            draw.rectangle([curr_x, y_start, curr_x + bar_w, y_start + height], fill=(20, 20, 20, 255))
        curr_x += bar_w + 1
        if curr_x >= x_start + width:
            break

def generate_ticket(json_path_or_dict, output_path="output_ticket.png"):
    """Load JSON data and render ticket image card."""
    # 1. Ingest JSON
    if isinstance(json_path_or_dict, str):
        with open(json_path_or_dict, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = json_path_or_dict

    # Scale 2x for retina quality
    width, height = 360, 640
    notch_y = 135

    # 2. Build gradient & ticket shape
    ticket = create_holographic_gradient(width, height)
    mask = create_ticket_mask(width, height, scallop_radius=12, notch_radius=16, notch_y=notch_y)
    ticket.putalpha(mask)

    draw = ImageDraw.Draw(ticket)

    # Load system or default font
    try:
        font_header = ImageFont.truetype("impact.ttf", 52)
        font_italic = ImageFont.truetype("ariali.ttf", 26)
        font_main = ImageFont.truetype("arial.ttf", 24)
        font_bold = ImageFont.truetype("arialbd.ttf", 25)
        font_small = ImageFont.truetype("arial.ttf", 21)
    except IOError:
        font_header = ImageFont.load_default()
        font_italic = font_main = font_bold = font_small = font_header

    # 3. Header: "TICKET"
    header_val = data.get("header", "TICKET")
    if isinstance(header_val, dict):
        header_text = str(header_val.get("title", "TICKET")).upper()
        scissor_symbol = str(header_val.get("cutoutIcon", "✂"))
    else:
        header_text = str(header_val).upper()
        scissor_symbol = str(data.get("symbol", "✂"))

    draw.text((width // 2, 45), header_text, fill=(35, 30, 45, 230), font=font_header, anchor="mm")

    # Dotted tear-off line below header
    dot_y = notch_y
    for x in range(25, width - 25, 10):
        draw.ellipse([x - 2, dot_y - 2, x + 2, dot_y + 2], fill=(120, 110, 130, 180))

    # Scissor symbol
    draw.text((width - 50, dot_y - 12), scissor_symbol, fill=(140, 130, 150, 180), font=font_small)

    # 4. Middle Section: Pass Type, Date, Venue
    body_data = data.get("body", {}) if isinstance(data.get("body"), dict) else {}
    pass_type = body_data.get("passType") or data.get("passType", "Day pass")
    draw.text((40, 200), pass_type, fill=(20, 25, 35, 255), font=font_italic)

    date_str = body_data.get("date") or data.get("date", "May 14th 2026")
    draw.text((40, 240), date_str, fill=(30, 35, 45, 255), font=font_main)

    # Venue lines
    venue_val = body_data.get("venue") or data.get("venue", "Venue address,\nState, #####")
    if isinstance(venue_val, dict):
        venue_lines = []
        if venue_val.get("name"): venue_lines.append(venue_val["name"])
        if venue_val.get("line1"): venue_lines.append(venue_val["line1"])
        elif venue_val.get("address"): venue_lines.append(venue_val["address"])
        cs = venue_val.get("line2") or f"{venue_val.get('state', '')} {venue_val.get('zip', '')}".strip()
        if cs: venue_lines.append(cs)
        venue_text = "\n".join(venue_lines)
    else:
        venue_text = str(venue_val)

    draw.multiline_text((40, 280), venue_text, fill=(50, 60, 75, 240), font=font_small, spacing=6)

    # 5. Bottom Section: Seat Assignment & Barcode
    footer_data = data.get("footer", {}) if isinstance(data.get("footer"), dict) else {}
    seat_label = footer_data.get("seatLabel", "Seat")
    seat_num = footer_data.get("seatNumber") or data.get("seat", "E7")
    seat_text = f"{seat_label} {seat_num}"
    draw.text((width // 2 - 35, 520), seat_text, fill=(10, 15, 25, 255), font=font_bold, anchor="mm")

    # Barcode
    barcode_data = footer_data.get("barcode", {})
    if isinstance(barcode_data, dict):
        barcode_code = barcode_data.get("code", "98421074523")
    else:
        barcode_code = str(data.get("barcode", "98421074523"))

    draw_barcode(draw, width - 110, 495, 75, 45, barcode_code)

    # Save output
    ticket.save(output_path, "PNG")
    print(f"[OK] Ticket successfully generated and exported to: {output_path}")
    return output_path

if __name__ == "__main__":
    sample_json_path = os.path.join(os.path.dirname(__file__), "src", "data", "eventTicket.json")
    generate_ticket(sample_json_path, "exported_ticket_card.png")
