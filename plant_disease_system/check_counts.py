import os

splits = ["train", "validation", "test"]
base = "dataset"

if os.path.exists(os.path.join(base, "train")):
    classes = sorted(os.listdir(os.path.join(base, "train")))
    print(f"Total classes found: {len(classes)}")
    total_imgs = 0
    for c in classes:
        counts = []
        for s in splits:
            p = os.path.join(base, s, c)
            cnt = len(os.listdir(p)) if os.path.exists(p) else 0
            counts.append(f"{s}={cnt}")
            total_imgs += cnt
        print(f"{c:32s}: " + ", ".join(counts))
    print(f"Total images across all splits: {total_imgs}")
else:
    print("Dataset directory does not exist yet.")
