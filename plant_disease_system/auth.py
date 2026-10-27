"""
auth.py - JWKS & JWT Authentication Middleware for FloraScan AI & Neon Auth
Validates EdDSA / Ed25519 / RS256 JWT tokens against Neon's official JWKS endpoint.
Enforces user data isolation by deriving user identity strictly from cryptographically verified tokens.
"""

import os
import logging
from functools import wraps
from flask import request, jsonify, g
import jwt
from jwt import PyJWKClient, ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
load_dotenv(os.path.join(ROOT_DIR, ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"))

logger = logging.getLogger("florascan.auth")

JWKS_URL = os.getenv("JWKS_URL")
AUTH_API_URL = os.getenv("AUTH_API_URL")

# Singleton cached JWKS client (caches keys for 1 hour)
_jwks_client = None

def get_jwks_client():
    global _jwks_client
    url = os.getenv("JWKS_URL")
    if not url:
        return None
    if _jwks_client is None:
        try:
            _jwks_client = PyJWKClient(url, cache_jwk_set=True, lifespan=3600)
            logger.info(f"Initialized PyJWKClient with JWKS_URL: {url}")
        except Exception as e:
            logger.error(f"Failed to initialize PyJWKClient: {e}")
            return None
    return _jwks_client


def validate_jwt(token: str) -> dict:
    """
    Validates a JWT against the Neon JWKS endpoint.
    Checks:
    - Signature using the matching public key (EdDSA / Ed25519 / RS256)
    - Expiration (exp)
    - Not Before (nbf)
    Returns decoded claims or raises InvalidTokenError / ExpiredSignatureError.
    """
    client = get_jwks_client()
    if not client:
        raise ValueError("JWKS_URL is not configured in server environment.")

    # Retrieve signing key based on 'kid' in header
    signing_key = client.get_signing_key_from_jwt(token)

    # Allowed algorithms (Neon Auth uses EdDSA / Ed25519)
    allowed_algs = ["EdDSA", "Ed25519", "RS256", "ES256"]

    # Decode and verify token
    expected_aud = os.getenv("AUTH_AUDIENCE")
    expected_iss = os.getenv("AUTH_ISSUER")

    # If not explicitly overridden, extract canonical auth origin from AUTH_API_URL / JWKS_URL
    if not expected_aud and (AUTH_API_URL or JWKS_URL):
        url_for_origin = AUTH_API_URL or JWKS_URL
        from urllib.parse import urlparse
        p = urlparse(url_for_origin)
        expected_aud = f"{p.scheme}://{p.netloc}"

    decode_kwargs = {
        "algorithms": allowed_algs,
        "options": {
            "verify_signature": True,
            "verify_exp": True,
            "verify_nbf": True,
            "require": ["exp"]
        }
    }

    if expected_aud:
        decode_kwargs["audience"] = expected_aud
    else:
        decode_kwargs["options"]["verify_aud"] = False

    if expected_iss:
        decode_kwargs["issuer"] = expected_iss
    else:
        decode_kwargs["options"]["verify_iss"] = False

    payload = jwt.decode(
        token,
        signing_key.key,
        **decode_kwargs
    )

    # Extract user ID (sub or id or userId)
    user_id = payload.get("sub") or payload.get("id") or payload.get("userId")
    if not user_id:
        raise InvalidTokenError("JWT missing user identity subject ('sub') claim.")

    payload["derived_user_id"] = str(user_id)
    return payload


def require_auth(f):
    """
    Decorator for Flask routes requiring cryptographic JWT validation.
    Extracts Bearer token from 'Authorization' header, validates against Neon JWKS,
    and sets flask.g.user with the verified identity.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "error": "Authentication required. Missing or malformed 'Authorization: Bearer <token>' header."
            }), 401

        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return jsonify({
                "success": False,
                "error": "Bearer token is empty."
            }), 401

        try:
            payload = validate_jwt(token)
            g.user = {
                "id": payload["derived_user_id"],
                "email": payload.get("email"),
                "name": payload.get("name"),
                "claims": payload
            }
        except ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": "Session token has expired. Please sign in again."
            }), 401
        except (InvalidTokenError, ValueError) as e:
            logger.warning(f"Rejected invalid JWT token: {e}")
            return jsonify({
                "success": False,
                "error": f"Invalid session token: {str(e)}"
            }), 401
        except Exception as e:
            logger.error(f"Unexpected error validating JWT: {e}")
            return jsonify({
                "success": False,
                "error": "Authentication validation failed."
            }), 401

        return f(*args, **kwargs)
    return decorated_function


def optional_auth(f):
    """
    Optional authentication decorator:
    If a valid Bearer token is provided, populates g.user with authenticated claims.
    If no token is provided, sets g.user = None and proceeds.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        g.user = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
            if token:
                try:
                    payload = validate_jwt(token)
                    g.user = {
                        "id": payload["derived_user_id"],
                        "email": payload.get("email"),
                        "name": payload.get("name"),
                        "claims": payload
                    }
                except Exception as e:
                    logger.debug(f"Optional auth token ignored: {e}")
                    g.user = None
        return f(*args, **kwargs)
    return decorated_function
