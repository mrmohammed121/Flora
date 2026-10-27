"""
Unit tests for PlantDoc pipeline and FastAPI endpoint.

Run with:
    python -m pytest tests/test_pipeline.py -v
"""

import io
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from PIL import Image

import plantdoc


@pytest.fixture
def mock_dummy_image(tmp_path):
    """Creates a temporary valid PNG image on disk for pipeline testing."""
    img_path = tmp_path / "test_leaf.png"
    img = Image.new("RGB", (224, 224), color=(34, 139, 34))
    img.save(img_path, format="PNG")
    return str(img_path)


@pytest.fixture
def client():
    """FastAPI test client fixture."""
    app = plantdoc.create_app()
    return TestClient(app)


# ----------------------------------------------------------------------------
# 1. Pipeline Test: Confidence below 0.40 (Guardrail 1 - Refusal)
# ----------------------------------------------------------------------------
def test_confidence_below_min_threshold_refuses_diagnosis(mock_dummy_image):
    low_conf_result = {
        "label": "Tomato___Early_blight",
        "confidence": 0.32,
        "top_k": [
            {"label": "Tomato___Early_blight", "score": 0.32},
            {"label": "Tomato___Late_blight", "score": 0.28},
            {"label": "Tomato___healthy", "score": 0.20},
        ],
    }
    with patch("plantdoc.classify_image", return_value=low_conf_result), \
         patch("plantdoc.retrieve") as mock_retrieve, \
         patch("plantdoc.ask_llm") as mock_ask:

        result = plantdoc.answer(mock_dummy_image)

        # Retrieval and LLM should be bypassed to avoid wild guesses and save cost
        mock_retrieve.assert_not_called()
        mock_ask.assert_not_called()

        assert result["detection"]["confidence"] == 0.32
        assert "confidence is too low" in result["answer"]
        assert plantdoc.DISCLAIMER_MESSAGES["en"] in result["answer"]


# ----------------------------------------------------------------------------
# 2. Pipeline Test: Confidence between 0.40 and 0.60 (Low Band - No Firm Diagnosis)
# ----------------------------------------------------------------------------
def test_confidence_low_band_between_min_and_mid(mock_dummy_image):
    """0.40 <= confidence < 0.60 triggers the 'low' band and retrieves alternatives."""
    low_band_result = {
        "label": "Tomato___Early_blight",
        "confidence": 0.48,
        "top_k": [
            {"label": "Tomato___Early_blight", "score": 0.48},
            {"label": "Tomato___Late_blight", "score": 0.35},
            {"label": "Tomato___healthy", "score": 0.17},
        ],
    }

    dummy_chunk = [{"text": "Sample text", "meta": {"section": "symptoms", "source": "test"}}]

    with patch("plantdoc.classify_image", return_value=low_band_result), \
         patch("plantdoc.retrieve", return_value=dummy_chunk) as mock_retrieve, \
         patch("plantdoc.ask_llm", return_value="Diagnosis: Unable to make a firm diagnosis.") as mock_ask:

        result = plantdoc.answer(mock_dummy_image, user_msg="What is this?")

        # When confidence < 0.85, alternatives are retrieved
        retrieved_labels = [call.args[0] for call in mock_retrieve.call_args_list]
        assert "Tomato___Early_blight" in retrieved_labels
        assert "Tomato___Late_blight" in retrieved_labels
        assert "Tomato___healthy" in retrieved_labels

        # Prompt must specify confidence_band: low
        prompt_passed = mock_ask.call_args[0][0]
        assert "confidence_band: low" in prompt_passed
        assert "confidence: 0.48" in prompt_passed
        assert plantdoc.DISCLAIMER_MESSAGES["en"] in result["answer"]


# ----------------------------------------------------------------------------
# 3. Pipeline Test: Confidence between 0.60 and 0.85 (Medium Band - Alternatives)
# ----------------------------------------------------------------------------
def test_confidence_between_mid_and_high_retrieves_alternatives(mock_dummy_image):
    mid_conf_result = {
        "label": "Tomato___Early_blight",
        "confidence": 0.72,
        "top_k": [
            {"label": "Tomato___Early_blight", "score": 0.72},
            {"label": "Tomato___Late_blight", "score": 0.18},
            {"label": "Tomato___healthy", "score": 0.08},
        ],
    }

    dummy_chunk = [{"text": "Sample text", "meta": {"section": "symptoms", "source": "test"}}]

    with patch("plantdoc.classify_image", return_value=mid_conf_result), \
         patch("plantdoc.retrieve", return_value=dummy_chunk) as mock_retrieve, \
         patch("plantdoc.ask_llm", return_value="Diagnosis: Early blight...") as mock_ask:

        result = plantdoc.answer(mock_dummy_image, user_msg="Can I save it?")

        # When confidence < 0.85, retrieve() must be queried for primary AND top alternatives
        retrieved_labels = [call.args[0] for call in mock_retrieve.call_args_list]
        assert "Tomato___Early_blight" in retrieved_labels
        assert "Tomato___Late_blight" in retrieved_labels
        assert "Tomato___healthy" in retrieved_labels

        prompt_passed = mock_ask.call_args[0][0]
        assert "confidence_band: medium" in prompt_passed
        assert plantdoc.DISCLAIMER_MESSAGES["en"] in result["answer"]


# ----------------------------------------------------------------------------
# 4. Pipeline Test: Label with No Knowledge Chunks (Guardrail 2)
# ----------------------------------------------------------------------------
def test_label_with_no_knowledge_chunks_returns_unverified_message(mock_dummy_image):
    detection_result = {
        "label": "Corn_(maize)___Unregistered_Disease",
        "confidence": 0.94,
        "top_k": [{"label": "Corn_(maize)___Unregistered_Disease", "score": 0.94}],
    }

    with patch("plantdoc.classify_image", return_value=detection_result), \
         patch("plantdoc.retrieve", return_value=[]) as mock_retrieve, \
         patch("plantdoc.ask_llm") as mock_ask:

        result = plantdoc.answer(mock_dummy_image)

        mock_retrieve.assert_called_with("Corn_(maize)___Unregistered_Disease", "")
        # LLM must NOT be called so it cannot hallucinate unverified remedies
        mock_ask.assert_not_called()

        assert "do not currently have verified extension records" in result["answer"]
        assert plantdoc.DISCLAIMER_MESSAGES["en"] in result["answer"]


# ----------------------------------------------------------------------------
# 5. Pipeline Test: Multilingual Localized Messages (Hindi & Kannada)
# ----------------------------------------------------------------------------
def test_multilingual_script_detection_and_explicit_lang(mock_dummy_image, client):
    low_conf_result = {
        "label": "Tomato___Early_blight",
        "confidence": 0.25,
        "top_k": [{"label": "Tomato___Early_blight", "score": 0.25}],
    }

    with patch("plantdoc.classify_image", return_value=low_conf_result):
        # 1. Hindi query via auto-detection (lang=None)
        hi_result = plantdoc.answer(mock_dummy_image, user_msg="इस पत्ते का क्या इलाज है?")
        assert "मैं इस पत्ते को स्पष्ट रूप से नहीं पहचान सका" in hi_result["answer"]
        assert "अस्वीकरण: केवल सलाह हेतु" in hi_result["answer"]

        # 2. Kannada query via auto-detection (lang=None)
        kn_result = plantdoc.answer(mock_dummy_image, user_msg="ನನ್ನ ಗಿಡಕ್ಕೆ ಏನಾಗಿದೆ?")
        assert "ನನಗೆ ಈ ಎಲೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ" in kn_result["answer"]
        assert "ಹಕ್ಕುತ್ಯಾಗ: ಕೇವಲ ಸಲಹೆಗಾಗಿ ಮಾತ್ರ" in kn_result["answer"]

        # 3. Explicit lang parameter overrides English text
        hi_explicit = plantdoc.answer(mock_dummy_image, user_msg="Help my plant", lang="hi")
        assert "मैं इस पत्ते को स्पष्ट रूप से नहीं पहचान सका" in hi_explicit["answer"]
        assert "अस्वीकरण: केवल सलाह हेतु" in hi_explicit["answer"]

        kn_explicit = plantdoc.answer(mock_dummy_image, user_msg="Help my plant", lang="kn")
        assert "ನನಗೆ ಈ ಎಲೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ" in kn_explicit["answer"]
        assert "ಹಕ್ಕುತ್ಯಾಗ: ಕೇವಲ ಸಲಹೆಗಾಗಿ ಮಾತ್ರ" in kn_explicit["answer"]

        # 4. Fallback on invalid lang code falls back to script detection -> English
        invalid_lang_result = plantdoc.answer(mock_dummy_image, user_msg="Help my plant", lang="xyz")
        assert "I couldn't recognise this leaf clearly" in invalid_lang_result["answer"]

    # 5. API /predict endpoint accepts form data 'lang'
    img_io = io.BytesIO()
    Image.new("RGB", (224, 224)).save(img_io, format="PNG")
    img_io.seek(0)
    with patch("plantdoc.classify_image", return_value=low_conf_result):
        api_resp = client.post(
            "/predict",
            files={"image": ("leaf.png", img_io, "image/png")},
            data={"message": "What is wrong?", "lang": "hi"},
        )
        assert api_resp.status_code == 200
        assert "मैं इस पत्ते को स्पष्ट रूप से नहीं पहचान सका" in api_resp.json()["answer"]


# ----------------------------------------------------------------------------
# 6. Pipeline Test: Healthy Leaf Processing
# ----------------------------------------------------------------------------
def test_healthy_leaf_flow(mock_dummy_image):
    healthy_result = {
        "label": "Tomato___healthy",
        "confidence": 0.96,
        "top_k": [
            {"label": "Tomato___healthy", "score": 0.96},
            {"label": "Tomato___Early_blight", "score": 0.02},
        ],
    }
    healthy_chunks = [
        {"text": "Tomato - Healthy - symptoms: Leaves are uniform green.", "meta": {"section": "symptoms", "source": "test"}},
        {"text": "Tomato - Healthy - prevention: Balanced watering.", "meta": {"section": "prevention", "source": "test"}},
    ]

    with patch("plantdoc.classify_image", return_value=healthy_result), \
         patch("plantdoc.retrieve", return_value=healthy_chunks), \
         patch("plantdoc.ask_llm", return_value="Diagnosis: The plant appears healthy.") as mock_ask:

        result = plantdoc.answer(mock_dummy_image)
        assert result["detection"]["label"] == "Tomato___healthy"
        prompt_passed = mock_ask.call_args[0][0]
        assert "confidence_band: high" in prompt_passed
        assert "Diagnosis: The plant appears healthy." in result["answer"]
        assert plantdoc.DISCLAIMER_MESSAGES["en"] in result["answer"]


# ----------------------------------------------------------------------------
# 7. API Endpoint Tests: Security and Invalid Upload Validation
# ----------------------------------------------------------------------------
def test_api_rejects_non_image_file(client):
    """Uploading a text or shell script file must be rejected with HTTP 400."""
    fake_file = io.BytesIO(b"This is not a real JPEG image.")
    response = client.post(
        "/predict",
        files={"image": ("malicious.txt", fake_file, "text/plain")},
        data={"message": "Help"},
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_api_rejects_corrupted_image_bytes(client):
    """A file named .jpg with corrupt random bytes must fail image verification with HTTP 400."""
    corrupted_bytes = io.BytesIO(b"\xFF\xD8\xFF" + b"garbage_non_image_payload_bytes" * 50)
    response = client.post(
        "/predict",
        files={"image": ("corrupted.jpg", corrupted_bytes, "image/jpeg")},
        data={"message": "Help"},
    )
    assert response.status_code == 400
    assert "corrupted or not a valid image" in response.json()["detail"]


def test_api_rejects_oversized_file(client):
    """Uploading a file exceeding 5 MB must return HTTP 400."""
    large_payload = io.BytesIO(b"0" * (6 * 1024 * 1024))  # 6 MB
    response = client.post(
        "/predict",
        files={"image": ("huge.png", large_payload, "image/png")},
    )
    assert response.status_code == 400
    assert "File too large" in response.json()["detail"]


def test_api_key_header_authorization(client, monkeypatch):
    """When PLANTDOC_API_KEY is set, unauthorized requests must receive HTTP 401."""
    monkeypatch.setenv("PLANTDOC_API_KEY", "secret-test-token-12345")

    img_io = io.BytesIO()
    Image.new("RGB", (224, 224)).save(img_io, format="PNG")
    img_io.seek(0)

    # Missing API key header
    resp_unauth = client.post(
        "/predict",
        files={"image": ("leaf.png", img_io, "image/png")},
    )
    assert resp_unauth.status_code == 401

    # Valid API key header (verified via secrets.compare_digest)
    img_io.seek(0)
    with patch("plantdoc.answer", return_value={"detection": {}, "answer": "OK"}):
        resp_auth = client.post(
            "/predict",
            files={"image": ("leaf.png", img_io, "image/png")},
            headers={"X-API-Key": "secret-test-token-12345"},
        )
        assert resp_auth.status_code == 200
