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

    #  Create NEW batch (IMPORTANT)
    batch_id = create_import_batch(
        source_folder=str(pole_dir),
        imported_by="system",
        total_images=len(files)
    )

    today = date.today()
    saved_files = []

    #  THIS LOOP IS THE KEY FIX
    for index, file in enumerate(files, start=1):
        raw_path = pole_dir / file["filename"]

        with open(raw_path, "wb") as f:
            f.write(file["file"])

        # hash per file
        file_hash = hashlib.sha256(file["file"]).hexdigest()

        insert_image_record(
            file_hash=file_hash,
            original_filename=file["filename"],
            raw_path=str(raw_path),
            category="POLE",
            survey_date=today,
            batch_id=batch_id,
            pole_id=pole_code,
            sequence_no=index
        )

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
