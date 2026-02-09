from datetime import date
from config.folder_creation_helper import get_raw_uploads_root
from controllers.db_batch_controller import create_import_batch, update_duplicates_skipped
from controllers.db_image_controller import insert_image_record
from utils.hash_helper import compute_sha256
from config.db import get_db_connection

def upload_line_images(request):
    #  Validate input
    start_pole_code = request["form"].get("startPoleCode")
    end_pole_code = request["form"].get("endPoleCode")
    files = request["files"]

    if not start_pole_code:
        return {
            "status": 400,
            "body": {"error": "startPoleCode is required"}
        }

    if not end_pole_code:
        return {
            "status": 400,
            "body": {"error": "endPoleCode is required"}
        }

    if not files:
        return {
            "status": 400,
            "body": {"error": "No files uploaded"}
        }

    #  Get or create today's survey
    survey_dir = get_raw_uploads_root()

    #  Create line section folder (PDF-defined)
    line_folder_name = f"{start_pole_code}_{end_pole_code}"
    line_dir = survey_dir / "LineSections" / line_folder_name
    line_dir.mkdir(parents=True, exist_ok=True)

    #  Create import batch
    batch_id = create_import_batch(
        source_folder=str(line_dir),
        imported_by="system",
        total_images=len(files)
    )

    duplicates_skipped = 0
    saved_files = []
    survey_date = date.today()

    #  Save files + insert DB records
    for index, file in enumerate(files, start=1):
        file_path = line_dir / file["filename"]

        # Save raw file
        with open(file_path, "wb") as f:
            f.write(file["file"])

        # Compute hash
        file_hash = compute_sha256(file["file"])

        # Insert DB record
        inserted = insert_image_record(
            file_hash=file_hash,
            original_filename=file["filename"],
            raw_path=str(file_path),
            category="LINE",
            survey_date=survey_date,
            batch_id=batch_id,
            start_pole=start_pole_code,
            end_pole=end_pole_code,
            sequence_no=index
        )

        if not inserted:
            duplicates_skipped += 1

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

    #  Update batch duplicates
    update_duplicates_skipped(batch_id, duplicates_skipped)

    #  Response
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
