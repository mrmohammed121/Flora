# PlantDoc: Plant Disease Detection + RAG Agent

PlantDoc is an agricultural assistant combining a computer vision model (PyTorch EfficientNet-B0) with a Retrieval-Augmented Generation (RAG) knowledge base (ChromaDB + multilingual-e5) and an LLM agent (Claude) to provide grounded diagnoses and recommendations.

---

## 1. Setup & Installation

```bash
# 1. Create and activate a Python virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux / macOS:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Export your Anthropic API key (Required for 'ask' and 'serve')
# On Linux/macOS:
export ANTHROPIC_API_KEY="sk-ant-..."
# On Windows (cmd):
set ANTHROPIC_API_KEY=sk-ant-...
# On Windows (PowerShell):
$env:ANTHROPIC_API_KEY="sk-ant-..."

# 4. (Optional) Set an API key to protect the FastAPI endpoint:
export PLANTDOC_API_KEY="my-secret-token"
```

---

## 2. Ingest the Knowledge Base

Build the ChromaDB vector database from `knowledge_crops.json`. Uses `intfloat/multilingual-e5-base` (supporting English, Hindi, and Kannada) with the required `passage: ` prefix.

```bash
# Ingest knowledge (use --reset to wipe any outdated chunks)
python plantdoc.py ingest --kb knowledge_crops.json --reset
```

---

## 3. Verify Label Alignment

Before training or deploying, verify that your dataset class folder names match the `label` fields in your knowledge JSON:

```bash
python plantdoc.py check-labels --data ./PlantVillage --kb knowledge_crops.json
```

---

## 4. Train the Image Classifier

Train the vision model on your local dataset. The dataset must be structured with disease names as immediate subfolders:

```text
PlantVillage/
├── Tomato___Early_blight/*.jpg
├── Tomato___Late_blight/*.jpg
├── Tomato___healthy/*.jpg
├── Potato___Early_blight/*.jpg
└── ...
```

Run training:
```bash
python plantdoc.py train --data ./PlantVillage --epochs 15 --batch-size 32
```
*Note on Windows:* `num_workers` defaults to `0` to prevent Windows multiprocessing crashes. You can override it with `--num-workers 2`.

Checkpoints are saved to `checkpoints/best.pt`.

---

## 5. CLI Diagnosis (`ask`)

Test a single leaf image from the command line:

```bash
# Default (English or auto-detected by script)
python plantdoc.py ask --image path/to/leaf.jpg --msg "What should I do?"

# Explicit language flag (--lang en|hi|kn)
python plantdoc.py ask --image path/to/leaf.jpg --msg "What should I do?" --lang hi
python plantdoc.py ask --image path/to/leaf.jpg --msg "What should I do?" --lang kn

# Or auto-detected by Unicode script:
python plantdoc.py ask --image path/to/leaf.jpg --msg "इस पत्ते पर काले धब्बे हैं, क्या करें?"
python plantdoc.py ask --image path/to/leaf.jpg --msg "ನನ್ನ ಗಿಡದ ಎಲೆಗಳಲ್ಲಿ ಚುಕ್ಕೆಗಳಿವೆ, ಏನು ಮಾಡಬೇಕು?"
```

---

## 6. Run the FastAPI Server (`serve`)

Start the production-ready API service:

```bash
python plantdoc.py serve --port 8000 --kb knowledge_crops.json
```

### Making an API Request:
```bash
curl -X POST "http://localhost:8000/predict" \
     -H "X-API-Key: my-secret-token" \
     -F "image=@leaf.jpg" \
     -F "message=What is wrong with my plant?" \
     -F "lang=hi"
```

---

## 7. Run Unit Tests

Execute the automated test suite using `python -m pytest`:

```bash
python -m pytest tests/test_pipeline.py -v
```
*(Running via `python -m pytest` ensures pytest runs using the exact Python executable and PATH of your active virtual environment).*
