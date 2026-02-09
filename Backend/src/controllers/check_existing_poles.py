from config.db import get_db_connection


def check_existing_poles(request):
    query = request.get("query", {})
    pole_code = query.get("poleCode", "").strip().upper()
    
    if not pole_code:
        return {
            "status": 400,
            "body": {"error": "poleCode is required"}
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            """
            SELECT COUNT(*)
            FROM images
            WHERE category = 'POLE'
            AND UPPER(pole_id) = %s
            """,
            (pole_code,)
        )

        count = cur.fetchone()[0]

        return {
            "status": 200,
            "body": {
                "exists": count > 0,
                "count": count
            }
        }

    finally:
        cur.close()
        conn.close()
   