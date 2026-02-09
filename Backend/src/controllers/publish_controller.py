from pathlib import Path
from config.db import get_db_connection
from utils.file_publisher import copy_and_rename
from config.folder_config import PUBLISHED_DIR


def publish_batch(batch_id):
    conn = get_db_connection()
    cur = conn.cursor()

    # Get batch info
    cur.execute(
        """
        SELECT source_folder
        FROM import_batches
        WHERE batch_id = %s AND status = 'IMPORTED'
        """,
        (batch_id,)
    )
    batch = cur.fetchone()
    if not batch:
        cur.close()
        conn.close()
        return


    published_root = PUBLISHED_DIR

    # Fetch images in correct order
    cur.execute(
        """
        SELECT
            id,
            raw_path,
            category,
            pole_id,
            start_pole,
            end_pole,
            sequence_no
        FROM images
        WHERE batch_id = %s
        ORDER BY sequence_no
        """,
        (batch_id,)
    )
    images = cur.fetchall()

    # Publish each image
    for index, (
        image_id,
        raw_path,
        category,
        pole_id,
        start_pole,
        end_pole,
        _
    ) in enumerate(images, start=1):

        raw_path = Path(raw_path)

        if category == "POLE":
            dest_dir = published_root / "Poles" / pole_id
            new_name = f"{pole_id}_{index:02d}{raw_path.suffix}"

        else:  # LINE
            section = f"{start_pole}_{end_pole}"
            dest_dir = published_root / "LineSections" / section
            new_name = f"{section}_{index:02d}{raw_path.suffix}"

        published_path = copy_and_rename(
            raw_path,
            dest_dir,
            new_name
        )

        # Update published path
        cur.execute(
            """
            UPDATE images
            SET published_path = %s
            WHERE id = %s
            """,
            (str(published_path), image_id)
        )

    # Mark batch published
    cur.execute(
        """
        UPDATE import_batches
        SET status = 'PUBLISHED'
        WHERE batch_id = %s
        """,
        (batch_id,)
    )

    conn.commit()
    cur.close()
    conn.close()
