from config.db import get_db_connection


def create_import_batch(source_folder, imported_by, total_images):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO import_batches (
            source_folder,
            imported_by,
            total_images,
            status
        )
        VALUES (%s, %s, %s, %s)
        RETURNING batch_id
        """,
        (source_folder, imported_by, total_images, "IMPORTED")
    )

    batch_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return batch_id


def update_duplicates_skipped(batch_id, duplicates_skipped):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE import_batches
        SET duplicates_skipped = %s
        WHERE batch_id = %s
        """,
        (duplicates_skipped, batch_id)
    )

    conn.commit()
    cur.close()
    conn.close()
