"""
test_db.py - CLI tool to verify Neon PostgreSQL connectivity
Usage:
    python plant_disease_system/test_db.py
"""

import sys
import json
from db import check_db_connection, init_db

def main():
    print("=" * 60)
    print(" FloraScan AI - Neon PostgreSQL Connection Test")
    print("=" * 60)

    res = check_db_connection()
    print(json.dumps(res, indent=2))

    if res.get("connected"):
        print("\n--> Database connected successfully! Initializing schema...")
        init_res = init_db()
        print(json.dumps(init_res, indent=2))
        sys.exit(0)
    else:
        print("\n--> Database connection test failed or DATABASE_URL is missing.")
        sys.exit(1)

if __name__ == "__main__":
    main()
