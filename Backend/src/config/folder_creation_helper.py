from config.folder_config import RAW_UPLOADS_DIR

def get_raw_uploads_root():
    RAW_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    return RAW_UPLOADS_DIR