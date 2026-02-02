from config.folder_creation_helper import get_or_create_today_survey


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
    survey_dir = get_or_create_today_survey()

    #  Create line batch folder (PDF-defined name)
    line_folder_name = f"{start_pole_code}_{end_pole_code}"
    line_dir = survey_dir / "LineSections" / line_folder_name
    line_dir.mkdir(parents=True, exist_ok=True)

    # Save files
    saved_files = []

    for file in files:
        file_path = line_dir / file["filename"]

        with open(file_path, "wb") as f:
            f.write(file["file"])

        saved_files.append(file["filename"])

    #  Response
    return {
        "status": 200,
        "body": {
            "message": "Line images uploaded successfully",
            "survey": survey_dir.name,
            "lineSection": line_folder_name,
            "filesSaved": saved_files
        }
    }
