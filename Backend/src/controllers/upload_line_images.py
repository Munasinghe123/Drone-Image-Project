from datetime import date
from config.folder_creation_helper import get_raw_uploads_root
from controllers.db_batch_controller import create_import_batch
from controllers.db_image_controller import insert_image_record
from utils.hash_helper import compute_sha256
from config.db import get_db_connection


def upload_line_images(request):

    start_pole_code = request["form"].get("startPoleCode")
    end_pole_code = request["form"].get("endPoleCode")
    files = request["files"]

    if not start_pole_code:
        return {"status": 400, "body": {"error": "startPoleCode is required"}}

    if not end_pole_code:
        return {"status": 400, "body": {"error": "endPoleCode is required"}}

    if not files:
        return {"status": 400, "body": {"error": "No files uploaded"}}

    # Normalize
    start_pole_code = start_pole_code.strip().upper()
    end_pole_code = end_pole_code.strip().upper()

    survey_dir = get_raw_uploads_root()
    line_folder_name = f"{start_pole_code}_{end_pole_code}"
    line_dir = survey_dir / "LineSections" / line_folder_name

    # Get last sequence
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT COALESCE(MAX(sequence_no), 0)
        FROM images
        WHERE category = 'LINE'
        AND UPPER(start_pole) = %s
        AND UPPER(end_pole) = %s
    """, (start_pole_code, end_pole_code))

    last_sequence = cur.fetchone()[0]

    cur.close()
    conn.close()

    current_sequence = last_sequence
    duplicates_skipped = 0
    saved_files = []
    new_files_exist = False

    survey_date = date.today()

    # FIRST PASS — detect duplicates only
    file_data_list = []

    for file in files:

        file_hash = compute_sha256(file["file"])

        # Check global duplicate
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

        raw_path = line_dir / file["filename"]

        file_data_list.append((
            file,
            file_hash,
            raw_path,
            current_sequence
        ))

    # If ALL duplicates → stop here
    if not new_files_exist:
        return {
            "status": 400,
            "body": {
                "message": "All uploaded images are duplicates. Nothing saved."
            }
        }

    # Create folder only if needed
    line_dir.mkdir(parents=True, exist_ok=True)

    # Create batch only if needed
    batch_id = create_import_batch(
        source_folder=str(line_dir),
        imported_by="system",
        total_images=len(file_data_list)
    )

    # Insert + save valid files
    for file, file_hash, raw_path, sequence_no in file_data_list:

        insert_image_record(
            file_hash=file_hash,
            original_filename=file["filename"],
            raw_path=str(raw_path),
            category="LINE",
            survey_date=survey_date,
            batch_id=batch_id,
            start_pole=start_pole_code,
            end_pole=end_pole_code,
            sequence_no=sequence_no
        )

        with open(raw_path, "wb") as f:
            f.write(file["file"])

        saved_files.append(file["filename"])

    # Mark batch imported
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
            "message": "Line images uploaded successfully",
            "lineSection": line_folder_name,
            "batch_id": batch_id,
            "duplicatesSkipped": duplicates_skipped,
            "filesSaved": saved_files
        }
    }