from datetime import date
from config.folder_creation_helper import get_or_create_today_survey
from controllers.db_batch_controller import create_import_batch, update_duplicates_skipped
from controllers.db_image_controller import insert_image_record
from utils.hash_helper import compute_sha256


def upload_pole_images(request):
    #  Validate input
    pole_code = request["form"].get("poleCode")
    files = request["files"]

    if not pole_code:
        return {
            "status": 400,
            "body": {"error": "poleCode is required"}
        }

    if not files:
        return {
            "status": 400,
            "body": {"error": "No files uploaded"}
        }

    #  Get or create today's survey
    survey_dir = get_or_create_today_survey()

    #  Create raw pole folder
    pole_dir = survey_dir / "Poles" / pole_code
    pole_dir.mkdir(parents=True, exist_ok=True)

    #  Create import batch
    batch_id = create_import_batch(
        source_folder=str(pole_dir),
        imported_by="system",
        total_images=len(files)
    )

    duplicates_skipped = 0
    saved_files = []
    survey_date = date.today()

    #  Save files + insert DB records
    for index, file in enumerate(files, start=1):
        file_path = pole_dir / file["filename"]

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
            category="POLE",
            survey_date=survey_date,
            batch_id=batch_id,
            pole_id=pole_code,
            sequence_no=index
        )

        if not inserted:
            duplicates_skipped += 1

        saved_files.append(file["filename"])

    #  Update duplicates_skipped in batch
    update_duplicates_skipped(batch_id, duplicates_skipped)

    return {
        "status": 200,
        "body": {
            "message": "Pole images uploaded successfully",
            "survey": survey_dir.name,
            "poleCode": pole_code,
            "batch_id": batch_id,
            "duplicatesSkipped": duplicates_skipped,
            "filesSaved": saved_files
        }
    }
