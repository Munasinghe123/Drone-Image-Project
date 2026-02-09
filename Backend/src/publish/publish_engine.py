import time
from config.db import get_db_connection
from controllers.publish_controller import publish_batch


POLL_INTERVAL_SECONDS = 1 


def run_publish_engine():
    print("Publish engine started")

    while True:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT batch_id
            FROM import_batches
            WHERE status = 'IMPORTED'
            """
        )

        batches = cur.fetchall()
        cur.close()
        conn.close()

        for (batch_id,) in batches:
            print(f" Publishing batch {batch_id}")
            publish_batch(batch_id)

        time.sleep(POLL_INTERVAL_SECONDS)
