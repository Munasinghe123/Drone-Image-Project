from config.db import get_db_connection
from config.folder_creation_helper import get_raw_uploads_root
from controllers.db_image_controller import insert_image_record
from controllers.db_batch_controller import create_import_batch
from datetime import date
import hashlib


def upload_pole_images(request):
    pole_code = request["form"].get("poleCode")
    files = request["files"]

    if not pole_code or not files:
        return {
            "status": 400,
            "body": {"error": "poleCode and files are required"}
        }

    pole_code = pole_code.strip().upper()

    raw_root = get_raw_uploads_root()
    pole_dir = raw_root / "Poles" / pole_code

    # Get last sequence number
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COALESCE(MAX(sequence_no), 0)
        FROM images
        WHERE category = 'POLE'
        AND UPPER(pole_id) = %s
    """, (pole_code,))

    last_sequence = cur.fetchone()[0]

    cur.close()
    conn.close()

    today = date.today()
    current_sequence = last_sequence
    duplicates_skipped = 0
    saved_files = []
    new_files_exist = False

    # First pass — detect duplicates and prepare inserts
    file_data_list = []

    for file in files:
        file_hash = hashlib.sha256(file["file"]).hexdigest()

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM images WHERE file_hash = %s", (file_hash,))
        exists = cur.fetchone()
        cur.close()
        conn.close()

        if exists:
            duplicates_skipped += 1
            continue

        new_files_exist = True
        current_sequence += 1

        raw_path = pole_dir / file["filename"]

        file_data_list.append((
            file,
            file_hash,
            raw_path,
            current_sequence
        ))

    # If ALL files are duplicates → stop here
    if not new_files_exist:
        return {
            "status": 400,
            "body": {
                "message": "All uploaded images are duplicates. Nothing saved."
            }
        }

    # Create folder only if needed
    pole_dir.mkdir(parents=True, exist_ok=True)

    # Create batch only if needed
    batch_id = create_import_batch(
        source_folder=str(pole_dir),
        imported_by="system",
        total_images=len(file_data_list)
    )

    # Insert + save valid files
    for file, file_hash, raw_path, sequence_no in file_data_list:

        insert_image_record(
            file_hash=file_hash,
            original_filename=file["filename"],
            raw_path=str(raw_path),
            category="POLE",
            survey_date=today,
            batch_id=batch_id,
            pole_id=pole_code,
            sequence_no=sequence_no
        )

        with open(raw_path, "wb") as f:
            f.write(file["file"])

        saved_files.append(file["filename"])

    # Mark batch as imported
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE import_batches
        SET status = 'IMPORTED'
        WHERE batch_id = %s
    """, (batch_id,))

    conn.commit()
    cur.close()
    conn.close()

    return {
        "status": 200,
        "body": {
            "message": "Pole images uploaded successfully",
            "batch_id": batch_id,
            "filesSaved": saved_files,
            "duplicatesSkipped": duplicates_skipped
        }
    }