import urllib.request
import glob
import json

def test_live_predict():
    print("Testing live HTTP endpoint: http://127.0.0.1:5000/predict")
    
    # 1. Test Rose Black Spot image
    fpath = glob.glob('dataset/test/Rose___Black_spot/*.*')[0]
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    body = (
        f'--{boundary}\r\n'
        'Content-Disposition: form-data; name="file"; filename="rose.jpg"\r\n'
        'Content-Type: image/jpeg\r\n\r\n'
    ).encode() + open(fpath, 'rb').read() + f'\r\n--{boundary}--\r\n'.encode()

    req = urllib.request.Request(
        'http://127.0.0.1:5000/predict',
        data=body,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
    )
    import time
    t0 = time.perf_counter()
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
    t1 = time.perf_counter()
    
    print(f"\n--- ROSE BLACK SPOT HTTP RESULT (Round-trip Latency: {(t1 - t0)*1000:.2f} ms) ---")
    print(f"Prediction       : {data.get('prediction')}")
    print(f"Botanical Host   : {data.get('botanical_host', {}).get('host')} ({data.get('botanical_host', {}).get('botanical_name')})")
    print(f"Category         : {data.get('botanical_host', {}).get('category')}")
    print(f"Confidence       : {data.get('confidence_percent')}%")
    print(f"Lesion Morphology: {data.get('morphology', {}).get('pattern_display')}")
    print(f"Petal Safety     : {data.get('ornamental_care', {}).get('petal_safety')}")
    print(f"Spraying Schedule: {data.get('spraying_schedule', {}).get('special_warning')}")
    print(f"Chemicals Allowed: {data.get('chemical_treatments_allowed')}")

    # 2. Test Background Unrecognized Image
    bg_path = glob.glob('dataset/test/Background___unrecognized/*.*')[0]
    body_bg = (
        f'--{boundary}\r\n'
        'Content-Disposition: form-data; name="file"; filename="bg.jpg"\r\n'
        'Content-Type: image/jpeg\r\n\r\n'
    ).encode() + open(bg_path, 'rb').read() + f'\r\n--{boundary}--\r\n'.encode()

    req_bg = urllib.request.Request(
        'http://127.0.0.1:5000/predict',
        data=body_bg,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
    )
    with urllib.request.urlopen(req_bg) as resp_bg:
        data_bg = json.loads(resp_bg.read().decode())

    print("\n--- BACKGROUND UNRECOGNIZED HTTP RESULT ---")
    print(f"Status           : {data_bg.get('status_display')}")
    print(f"Is OOD           : {data_bg.get('is_ood')}")
    print(f"Safety Message   : {data_bg.get('safety_message')}")
    print(f"Chemicals Allowed: {data_bg.get('chemical_treatments_allowed')}")
    print(f"Clarification    : {data_bg.get('clarification', {}).get('question')}")

if __name__ == "__main__":
    test_live_predict()
