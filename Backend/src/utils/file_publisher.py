import shutil
from pathlib import Path


def copy_and_rename(src_path, dest_dir, new_filename):
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / new_filename
    shutil.copy2(src_path, dest_path)
    return dest_path
