from datetime import datetime
from pathlib import Path
from config.folder_config import RAW_UPLOADS_DIR


def get_or_create_today_survey():
    today = datetime.today().strftime("%Y_%m_%d")
    survey_dir = RAW_UPLOADS_DIR / f"Survey_{today}"
    survey_dir.mkdir(parents=True, exist_ok=True)
    return survey_dir
