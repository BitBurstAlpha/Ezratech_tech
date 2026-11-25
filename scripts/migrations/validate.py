"""Validate filenames and reject changes to migrations already on the PR base."""
import datetime
from pathlib import Path
import re
import subprocess
import sys

directory = Path("supabase/migrations")
versions = set()
for path in sorted(directory.iterdir()):
    match = re.fullmatch(r"([0-9]{14})_[a-z][a-z0-9_]*\.sql", path.name)
    if not match or path.is_symlink() or not path.is_file() or not path.read_text().strip():
        sys.exit(f"Invalid or empty migration: {path}")
    version = match[1]
    datetime.datetime.strptime(version, "%Y%m%d%H%M%S")
    if version in versions:
        sys.exit(f"Duplicate migration timestamp: {version}")
    versions.add(version)

if "20261125202908" not in versions:
    sys.exit("Missing EzraTech baseline")

if len(sys.argv) == 2:
    base = sys.argv[1]
    changes = subprocess.check_output([
        "git", "diff", "--no-renames", "--diff-filter=MDT", "--name-only",
        base + "...HEAD", "--", str(directory),
    ], text=True)
    if changes:
        sys.exit("Add a new migration to change an existing version:\n" + changes)
print(f"Validated {len(versions)} migration(s)")
