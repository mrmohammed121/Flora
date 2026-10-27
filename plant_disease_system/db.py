"""
db.py - Neon PostgreSQL Connection & Persistence Layer for FloraScan AI
Connects the Flask backend to Neon Serverless PostgreSQL using psycopg3 with connection pooling.
Enforces strict parameterization, connection pooling, SSL encryption, and user-isolated data access.
"""

import os
import time
import json
import logging
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
load_dotenv(os.path.join(ROOT_DIR, ".env"))
load_dotenv(os.path.join(BASE_DIR, ".env"))

logger = logging.getLogger("florascan.db")

_pool = None


def normalize_neon_url(url: str) -> str:
    """
    Ensure the Neon connection string enforces SSL (sslmode=require)
    mandatory for Neon serverless Postgres.
    """
    if not url:
        return url
    parsed = urlparse(url)
    query_params = parse_qs(parsed.query)
    if "sslmode" not in query_params:
        query_params["sslmode"] = ["require"]
    new_query = urlencode(query_params, doseq=True)
    return urlunparse(parsed._replace(query=new_query))


def get_connection_pool():
    """
    Initializes or returns a singleton psycopg_pool.ConnectionPool.
    Returns None gracefully if DATABASE_URL is not configured.
    """
    global _pool
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        return None

    if _pool is not None and not _pool.closed:
        return _pool

    try:
        from psycopg_pool import ConnectionPool
        conn_str = normalize_neon_url(raw_url)
        _pool = ConnectionPool(
            conninfo=conn_str,
            min_size=1,
            max_size=5,
            timeout=10.0,
            max_idle=300.0,
            kwargs={"autocommit": True}
        )
        _pool.open()
        logger.info("Connected to Neon PostgreSQL connection pool.")
        return _pool
    except Exception as e:
        logger.error(f"Failed to initialize Neon PostgreSQL pool: {e}")
        return None


def check_db_connection() -> dict:
    """
    Runs a fast ping test against Neon PostgreSQL:
    Executes SELECT 1, retrieves database name and Postgres version.
    """
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        return {
            "status": "not_configured",
            "connected": False,
            "message": "DATABASE_URL is not set in .env. Please configure your Neon PostgreSQL connection string.",
            "instructions": "Add DATABASE_URL=postgresql://user:pass@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require to .env"
        }

    try:
        import psycopg
        conn_str = normalize_neon_url(raw_url)
        start_time = time.time()

        with psycopg.connect(conn_str, connect_timeout=5) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 AS ping, current_database() AS db_name, version() AS pg_version;")
                row = cur.fetchone()
                latency_ms = round((time.time() - start_time) * 1000, 2)

                parsed = urlparse(raw_url)
                masked_host = parsed.hostname or "unknown"
                db_name = row[1] if row else "unknown"
                pg_ver = row[2] if row else "unknown"

                return {
                    "status": "connected",
                    "connected": True,
                    "provider": "Neon PostgreSQL",
                    "database": db_name,
                    "host": masked_host,
                    "latency_ms": latency_ms,
                    "version": pg_ver.split(" on ")[0] if pg_ver else "PostgreSQL"
                }
    except Exception as e:
        logger.error(f"Neon DB ping failed: {e}")
        return {
            "status": "error",
            "connected": False,
            "error": str(e),
            "message": "Could not connect to Neon PostgreSQL. Check your network, credentials, or pooler URL."
        }


def init_db() -> dict:
    """
    Idempotent schema initialization:
    Creates and migrates the 'plant_scans' table and indices for authenticated user isolation.
    """
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        return {"status": "skipped", "message": "DATABASE_URL not set; skipping schema init."}

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS plant_scans (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(128) NOT NULL DEFAULT 'anonymous',
        crop VARCHAR(128) NOT NULL,
        disease_name VARCHAR(256) NOT NULL,
        scientific_name VARCHAR(256),
        confidence DOUBLE PRECISION NOT NULL DEFAULT 0.0,
        severity VARCHAR(64) DEFAULT 'Moderate',
        lesion_area_pct DOUBLE PRECISION DEFAULT 0.0,
        status VARCHAR(64) DEFAULT 'Infected',
        diagnosis JSONB DEFAULT '{}'::jsonb,
        chemical_overview TEXT,
        tank_mix TEXT,
        thumbnail TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Idempotent column migrations for existing instances
    ALTER TABLE plant_scans ADD COLUMN IF NOT EXISTS user_id VARCHAR(128) NOT NULL DEFAULT 'anonymous';
    ALTER TABLE plant_scans ADD COLUMN IF NOT EXISTS diagnosis JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE plant_scans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

    -- User isolation & ordering performance indices
    CREATE INDEX IF NOT EXISTS idx_plant_scans_user_id ON plant_scans (user_id);
    CREATE INDEX IF NOT EXISTS idx_plant_scans_created_at ON plant_scans (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_plant_scans_user_created ON plant_scans (user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_plant_scans_crop ON plant_scans (crop);
    """

    try:
        import psycopg
        conn_str = normalize_neon_url(raw_url)
        with psycopg.connect(conn_str, connect_timeout=8) as conn:
            with conn.cursor() as cur:
                cur.execute(create_table_sql)
            conn.commit()
            return {"status": "success", "message": "Neon PostgreSQL schema initialized successfully (plant_scans table ready)."}
    except Exception as e:
        logger.error(f"Neon schema initialization failed: {e}")
        return {"status": "error", "error": str(e)}


def _row_to_scan_dict(row, cols) -> dict:
    """Helper to convert psycopg row tuple into clean frontend-ready dictionary."""
    data = dict(zip(cols, row))
    if data.get("created_at"):
        data["created_at"] = data["created_at"].isoformat()
        data["timestamp"] = data["created_at"]
    if data.get("updated_at"):
        data["updated_at"] = data["updated_at"].isoformat()
    # Map snake_case to camelCase convenience keys for existing frontend
    data["diseaseName"] = data.get("disease_name")
    data["scientificName"] = data.get("scientific_name")
    data["lesionArea"] = data.get("lesion_area_pct")
    data["chemicalOverview"] = data.get("chemical_overview")
    data["tankMix"] = data.get("tank_mix")
    return data


def create_scan(user_id: str, data: dict) -> dict:
    """
    Creates or updates a plant scan record belonging strictly to the authenticated user.
    Uses parameterized SQL to eliminate SQL injection vulnerabilities.
    """
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        raise ValueError("DATABASE_URL not configured")

    scan_id = str(data.get("id") or f"scan_{int(time.time() * 1000)}")
    crop = str(data.get("crop") or "Foliar Specimen")[:128]
    disease_name = str(data.get("diseaseName") or data.get("disease_name") or data.get("disease") or "Unknown Pathology")[:256]
    scientific_name = str(data.get("scientificName") or data.get("scientific_name") or "")[:256]
    confidence = float(data.get("confidence") or 0.0)
    severity = str(data.get("severity") or "Moderate")[:64]
    lesion_area = float(data.get("lesionArea") or data.get("affected_area_pct") or data.get("lesion_area_pct") or 0.0)
    status = str(data.get("status") or "Infected")[:64]
    chemical_overview = str(data.get("chemicalOverview") or data.get("chemical_overview") or "")
    tank_mix = str(data.get("tankMix") or data.get("tank_mix") or "")
    thumbnail = data.get("thumbnail") or data.get("previewUrl")
    if thumbnail and not str(thumbnail).startswith("data:image"):
        thumbnail = str(thumbnail)[:1024]
    elif thumbnail and len(str(thumbnail)) > 300000:
        # Prevent oversized base64 strings in database thumbnail column
        thumbnail = None
    notes = str(data.get("notes") or "")

    diagnosis_obj = data.get("diagnosis")
    if diagnosis_obj is None:
        diagnosis_obj = {
            "disease": disease_name,
            "crop": crop,
            "confidence": confidence,
            "severity": severity,
            "scientific_name": scientific_name,
            "status": status
        }
    diagnosis_json = json.dumps(diagnosis_obj)

    sql = """
    INSERT INTO plant_scans (
        id, user_id, crop, disease_name, scientific_name,
        confidence, severity, lesion_area_pct, status,
        diagnosis, chemical_overview, tank_mix, thumbnail, notes,
        created_at, updated_at
    ) VALUES (
        %s, %s, %s, %s, %s,
        %s, %s, %s, %s,
        %s::jsonb, %s, %s, %s, %s,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
        crop = EXCLUDED.crop,
        disease_name = EXCLUDED.disease_name,
        scientific_name = EXCLUDED.scientific_name,
        confidence = EXCLUDED.confidence,
        severity = EXCLUDED.severity,
        lesion_area_pct = EXCLUDED.lesion_area_pct,
        status = EXCLUDED.status,
        diagnosis = EXCLUDED.diagnosis,
        chemical_overview = EXCLUDED.chemical_overview,
        tank_mix = EXCLUDED.tank_mix,
        thumbnail = EXCLUDED.thumbnail,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id, user_id, crop, disease_name, scientific_name, confidence, severity, lesion_area_pct, status, diagnosis, chemical_overview, tank_mix, thumbnail, notes, created_at, updated_at;
    """

    params = (
        scan_id, user_id, crop, disease_name, scientific_name,
        confidence, severity, lesion_area, status,
        diagnosis_json, chemical_overview, tank_mix, thumbnail, notes
    )

    import psycopg
    conn_str = normalize_neon_url(raw_url)
    with psycopg.connect(conn_str, connect_timeout=8) as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            row = cur.fetchone()
            cols = [desc[0] for desc in cur.description]
        conn.commit()

    return _row_to_scan_dict(row, cols)


def get_user_scans(user_id: str, page: int = 1, page_size: int = 25) -> dict:
    """
    Retrieves paginated scan history for the authenticated user only.
    Always orders by created_at DESC (newest first).
    """
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        return {"items": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

    page = max(1, int(page))
    page_size = max(1, min(100, int(page_size)))
    offset = (page - 1) * page_size

    count_sql = "SELECT COUNT(*) FROM plant_scans WHERE user_id = %s;"
    query_sql = """
    SELECT id, user_id, crop, disease_name, scientific_name, confidence, severity,
           lesion_area_pct, status, diagnosis, chemical_overview, tank_mix, thumbnail, notes, created_at, updated_at
    FROM plant_scans
    WHERE user_id = %s
    ORDER BY created_at DESC
    LIMIT %s OFFSET %s;
    """

    import psycopg
    conn_str = normalize_neon_url(raw_url)
    with psycopg.connect(conn_str, connect_timeout=8) as conn:
        with conn.cursor() as cur:
            cur.execute(count_sql, (user_id,))
            total = cur.fetchone()[0]

            cur.execute(query_sql, (user_id, page_size, offset))
            rows = cur.fetchall()
            cols = [desc[0] for desc in cur.description]

    items = [_row_to_scan_dict(r, cols) for r in rows]
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


def get_user_scan_by_id(user_id: str, scan_id: str) -> dict | None:
    """
    Retrieves a single scan by ID strictly owned by user_id.
    Prevents User A from viewing User B's scans.
    """
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        return None

    sql = """
    SELECT id, user_id, crop, disease_name, scientific_name, confidence, severity,
           lesion_area_pct, status, diagnosis, chemical_overview, tank_mix, thumbnail, notes, created_at, updated_at
    FROM plant_scans
    WHERE id = %s AND user_id = %s;
    """

    import psycopg
    conn_str = normalize_neon_url(raw_url)
    with psycopg.connect(conn_str, connect_timeout=8) as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (scan_id, user_id))
            row = cur.fetchone()
            if not row:
                return None
            cols = [desc[0] for desc in cur.description]

    return _row_to_scan_dict(row, cols)


def delete_user_scan(user_id: str, scan_id: str) -> bool:
    """
    Deletes a single scan by ID strictly owned by user_id.
    Prevents User A from deleting User B's scans.
    """
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        return False

    sql = "DELETE FROM plant_scans WHERE id = %s AND user_id = %s RETURNING id;"

    import psycopg
    conn_str = normalize_neon_url(raw_url)
    with psycopg.connect(conn_str, connect_timeout=8) as conn:
        with conn.cursor() as cur:
            cur.execute(sql, (scan_id, user_id))
            deleted = cur.fetchone()
        conn.commit()

    return bool(deleted)
