from config.db import get_db_connection
from config.folder_creation_helper import get_raw_uploads_root
from controllers.db_image_controller import insert_image_record
from controllers.db_batch_controller import create_import_batch
from datetime import date
from pathlib import Path
import hashlib


def upload_pole_images(request):
    pole_code = request["form"].get("poleCode")
    files = request["files"]

    if not pole_code or not files:
        return {
            "status": 400,
            "body": {"error": "poleCode and files are required"}
        }

    raw_root = get_raw_uploads_root()
    pole_dir = raw_root / "Poles" / pole_code
    pole_dir.mkdir(parents=True, exist_ok=True)
    
    # checks ALL batches for a given pole
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COALESCE(MAX(sequence_no), 0)
        FROM images
        WHERE category = 'POLE'
        AND UPPER(pole_id) = %s
    """, (pole_code.upper(),))

    last_sequence = cur.fetchone()[0]

    cur.close()
    conn.close()

    #  Create NEW batch (IMPORTANT)
    batch_id = create_import_batch(
        source_folder=str(pole_dir),
        imported_by="system",
        total_images=len(files)
    )

    today = date.today()
    saved_files = []
    
    duplicates_skipped = 0

    today = date.today()
    saved_files = []
    duplicates_skipped = 0
    valid_files = []

# First pass: check duplicates only
    for index, file in enumerate(files, start=last_sequence + 1):

        file_hash = hashlib.sha256(file["file"]).hexdigest()

        raw_path = pole_dir / file["filename"]

        inserted = insert_image_record(
            file_hash=file_hash,
            original_filename=file["filename"],
            raw_path=str(raw_path),
            category="POLE",
            survey_date=today,
            batch_id=batch_id,
            pole_id=pole_code,
            sequence_no=index
        )

        if not inserted:
            duplicates_skipped += 1
        else:
            valid_files.append((file, raw_path))

    # If NO valid files → delete batch + return
    if not valid_files:
        # Optional: delete empty batch record
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM import_batches WHERE batch_id = %s", (batch_id,))
        conn.commit()
        cur.close()
        conn.close()

        return {
            "status": 400,
            "body": {
                "message": "All uploaded images are duplicates. Nothing saved."
            }
        }

    # Create folder only now
    pole_dir.mkdir(parents=True, exist_ok=True)

    # Save only valid files
    for file, raw_path in valid_files:
        with open(raw_path, "wb") as f:
            f.write(file["file"])
        saved_files.append(file["filename"])
        
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE import_batches
        SET status = 'IMPORTED'
        WHERE batch_id = %s
        """,
        (batch_id,)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        "status": 200,
        "body": {
            "message": "Pole images uploaded successfully",
            "batch_id": batch_id,
            "filesSaved": saved_files
        }
    }
