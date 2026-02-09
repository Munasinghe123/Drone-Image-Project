from config.db import get_db_connection

def check_existing_lines(request):
    query = request.get("query", {})

    start_pole = query.get("startPole", "").strip().upper()
    end_pole = query.get("endPole", "").strip().upper()

    if not start_pole or not end_pole:
        return {
            "status": 400,
            "body": {"error": "startPole and endPole are required"}
        }

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            SELECT COUNT(*)
            FROM images
            WHERE category = 'LINE'
            AND UPPER(start_pole) = %s
            AND UPPER(end_pole) = %s
            """,
            (start_pole, end_pole)
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