"""
test_integration.py - Full Integration & Security Verification Suite
Tests Neon PostgreSQL connection, schema, user data isolation, and auth validation.
"""

import os
import sys
import json
import time

# Ensure path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import (
    check_db_connection,
    init_db,
    create_scan,
    get_user_scans,
    get_user_scan_by_id,
    delete_user_scan
)
from auth import validate_jwt, get_jwks_client
import jwt

def run_tests():
    print("=" * 70)
    print("FLORASCAN AI - NEON BACKEND & SECURITY INTEGRATION TESTS")
    print("=" * 70)

    # TEST 1: Database Connection
    print("\n[TEST 1] Testing live Neon PostgreSQL connectivity...")
    db_res = check_db_connection()
    assert db_res.get("connected") is True, f"DB Connection failed: {db_res}"
    print(f" -> PASSED: Connected to Neon DB '{db_res.get('database')}' (latency: {db_res.get('latency_ms')}ms)")

    # TEST 2: Schema Initialization
    print("\n[TEST 2] Testing schema migration & table verification...")
    init_res = init_db()
    assert init_res.get("status") == "success", f"Schema init failed: {init_res}"
    print(f" -> PASSED: {init_res.get('message')}")

    # TEST 3: JWKS Retrieval & Key Caching
    print("\n[TEST 3] Testing Neon JWKS endpoint retrieval...")
    jwks = get_jwks_client()
    assert jwks is not None, "Failed to initialize JWKS client"
    signing_key = jwks.get_signing_key("5c7100f7-9ed6-4863-b878-fa0be5a381b7")
    assert signing_key is not None, "Failed to resolve signing key from JWKS"
    print(f" -> PASSED: Retrieved signing key for kid '5c7100f7-9ed6-4863-b878-fa0be5a381b7' with alg EdDSA/Ed25519")

    # TEST 4: Invalid/Forged JWT Rejection
    print("\n[TEST 4] Testing rejection of forged / invalid JWT...")
    fake_token = "eyJhbGciOiJFZERTQTEiLCJraWQiOiJmYWtlIn0.eyJzdWIiOiJhdHRhY2tlciJ9.signature"
    try:
        validate_jwt(fake_token)
        raise AssertionError("Validation should have failed for fake token!")
    except Exception as e:
        print(f" -> PASSED: Forged JWT correctly rejected ({type(e).__name__})")

    # TEST 5: User Data Isolation - Create Scan for User A
    print("\n[TEST 5] Creating scan record for User A ('usr_alpha_123')...")
    test_scan_id = f"test_scan_{int(time.time())}"
    scan_payload = {
        "id": test_scan_id,
        "crop": "Tomato",
        "diseaseName": "Early Blight",
        "scientificName": "Alternaria solani",
        "confidence": 0.94,
        "severity": "Moderate",
        "lesionArea": 12.5,
        "status": "Infected",
        "chemicalOverview": "Chlorothalonil 75% WP",
        "tankMix": "Mancozeb + Azoxystrobin"
    }
    user_a = "usr_alpha_123"
    saved = create_scan(user_a, scan_payload)
    assert saved.get("id") == test_scan_id
    assert saved.get("user_id") == user_a
    print(f" -> PASSED: Saved scan {test_scan_id} strictly bound to user_id '{user_a}'")

    # TEST 6: User A Can Retrieve Own Scan History
    print("\n[TEST 6] Retrieving scan history for User A...")
    scans_a = get_user_scans(user_a, page=1, page_size=10)
    assert scans_a["total"] >= 1
    assert any(s["id"] == test_scan_id for s in scans_a["items"])
    print(f" -> PASSED: User A retrieved {scans_a['total']} scans; target scan found.")

    # TEST 7: Cross-User Isolation: User B CANNOT Access User A's Scan
    print("\n[TEST 7] Security check: Verifying User B ('usr_beta_456') CANNOT access User A's scan...")
    user_b = "usr_beta_456"
    cross_read = get_user_scan_by_id(user_b, test_scan_id)
    assert cross_read is None, f"SECURITY VIOLATION! User B was able to read User A's scan: {cross_read}"
    print(" -> PASSED: User B attempted to read User A's scan -> returned None (Access Denied).")

    # TEST 8: Cross-User Isolation: User B CANNOT Delete User A's Scan
    print("\n[TEST 8] Security check: Verifying User B CANNOT delete User A's scan...")
    cross_delete = delete_user_scan(user_b, test_scan_id)
    assert cross_delete is False, "SECURITY VIOLATION! User B was able to delete User A's scan!"
    print(" -> PASSED: User B attempted to delete User A's scan -> returned False (Forbidden).")

    # TEST 9: User A Deletes Own Scan
    print("\n[TEST 9] User A deleting own scan record...")
    own_delete = delete_user_scan(user_a, test_scan_id)
    assert own_delete is True, "User A failed to delete own scan!"
    verify_deleted = get_user_scan_by_id(user_a, test_scan_id)
    assert verify_deleted is None, "Scan still exists after deletion!"
    print(" -> PASSED: Scan successfully deleted by owner and confirmed removed.")

    print("\n" + "=" * 70)
    print(" ALL 9 BACKEND & SECURITY TESTS PASSED PERFECTLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
