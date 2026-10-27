"""
Utility script to populate sample training and validation images
so that train.py and app.py can be tested immediately.
Users can replace these with the full Kaggle PlantVillage dataset anytime.
"""
import os
import numpy as np
from PIL import Image, ImageDraw

CLASSES = ["Bacterial_Spot", "Early_Blight", "Healthy", "Late_Blight"]
SPLITS = {"train": 24, "val": 8}

def create_leaf_image(disease_type, seed):
    np.random.seed(seed)
    img = Image.new("RGB", (224, 224), color=(245, 245, 245))
    draw = ImageDraw.Draw(img)

    # Base leaf lamina
    if disease_type == "Healthy":
        leaf_color = (34, 197, 94)
    elif disease_type == "Bacterial_Spot":
        leaf_color = (74, 222, 128)
    elif disease_type == "Early_Blight":
        leaf_color = (134, 239, 172)
    else:  # Late_Blight
        leaf_color = (101, 163, 13)

    draw.ellipse([30, 15, 194, 209], fill=leaf_color, outline=(22, 101, 52), width=3)
    # Midrib vein
    draw.line([112, 15, 112, 209], fill=(22, 101, 52), width=3)
    # Lateral veins
    for y in range(45, 185, 25):
        draw.line([112, y, 60, y - 15], fill=(22, 101, 52), width=2)
        draw.line([112, y, 164, y - 15], fill=(22, 101, 52), width=2)

    # Add pathology spots
    if disease_type == "Bacterial_Spot":
        # Numerous small speckles with chlorotic yellow halo
        for _ in range(25):
            x = np.random.randint(55, 165)
            y = np.random.randint(35, 185)
            r = np.random.randint(3, 6)
            draw.ellipse([x - r - 2, y - r - 2, x + r + 2, y + r + 2], fill=(234, 179, 8))
            draw.ellipse([x - r, y - r, x + r, y + r], fill=(120, 53, 15))

    elif disease_type == "Early_Blight":
        # Distinct concentric bullseye target rings
        num_spots = np.random.randint(3, 6)
        for _ in range(num_spots):
            x = np.random.randint(65, 155)
            y = np.random.randint(45, 175)
            rad = np.random.randint(14, 24)
            # Outer chlorotic halo
            draw.ellipse([x - rad - 4, y - rad - 4, x + rad + 4, y + rad + 4], fill=(245, 158, 11))
            # Outer necrotic ring
            draw.ellipse([x - rad, y - rad, x + rad, y + rad], fill=(180, 83, 9), outline=(120, 53, 15), width=2)
            # Middle target ring
            draw.ellipse([x - int(rad * 0.6), y - int(rad * 0.6), x + int(rad * 0.6), y + int(rad * 0.6)], fill=(217, 119, 6), outline=(69, 26, 3), width=2)
            # Dark necrotic center
            draw.ellipse([x - int(rad * 0.3), y - int(rad * 0.3), x + int(rad * 0.3), y + int(rad * 0.3)], fill=(69, 26, 3))

    elif disease_type == "Late_Blight":
        # Large irregular water-soaked dark necrotic blotches
        for _ in range(3):
            x = np.random.randint(65, 155)
            y = np.random.randint(50, 170)
            rx = np.random.randint(22, 38)
            ry = np.random.randint(16, 28)
            draw.ellipse([x - rx - 3, y - ry - 3, x + rx + 3, y + ry + 3], fill=(113, 63, 18))
            draw.ellipse([x - rx, y - ry, x + rx, y + ry], fill=(45, 20, 3))

    return img

def generate_dataset(base_dir="dataset"):
    for split, count in SPLITS.items():
        for cls in CLASSES:
            folder = os.path.join(base_dir, split, cls)
            os.makedirs(folder, exist_ok=True)
            for i in range(count):
                filepath = os.path.join(folder, f"{cls}_{split}_{i+1}.jpg")
                img = create_leaf_image(cls, seed=hash(cls + str(i) + split) % 100000)
                img.save(filepath, "JPEG")
    print(f"[SUCCESS] High-fidelity sample dataset created under '{base_dir}/'")

if __name__ == "__main__":
    generate_dataset()
