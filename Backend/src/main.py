import sys
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from server import run_server


def main():
    print("Backend server starting...")
    run_server()


if __name__ == "__main__":
    main()
