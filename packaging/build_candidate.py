#!/usr/bin/env python3
"""Build a deterministic experimental bundle from pinned Git blobs; never install it."""
import argparse
import hashlib
import json
import re
import subprocess
import zipfile
from pathlib import Path

def git(repo, *args):
    return subprocess.check_output(["git", "-C", str(repo), *args])

def build(repo, manifest_path, output):
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("format") != "skill-workshop-candidate-bundle-v1" or manifest.get("status") != "EXPERIMENTAL_NOT_RELEASE":
        raise ValueError("invalid candidate manifest")
    commit = manifest["sourceCommit"]
    if not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise ValueError("source must be an immutable Git commit")
    entries = {}
    names = set()
    for item in manifest["files"]:
        path, blob, kind = item["path"], item["gitBlob"], item["kind"]
        valid = (kind == "skill" and re.fullmatch(r"candidates/[a-z0-9-]+/SKILL\.md", path)) or (kind in ("module", "test") and re.fullmatch(r"experiments/bounded-control/[a-z0-9-]+\.mjs", path))
        if not valid or path in entries or not re.fullmatch(r"[0-9a-f]{40}", blob):
            raise ValueError("invalid or duplicate member: " + path)
        data = git(repo, "show", commit + ":" + path)
        actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
        if actual != blob:
            raise ValueError("blob mismatch: " + path)
        if kind == "skill":
            text = data.decode("utf-8")
            match = re.match(r"\A---\nname: ([a-z0-9-]+)\ndescription: ([^\n]+)\n---\n", text)
            if not match or match[1] != path.split("/")[1] or match[1] in names or len(match[2]) > 1024:
                raise ValueError("invalid skill header: " + path)
            names.add(match[1])
        entries[path] = data
    if not names:
        raise ValueError("empty skill bundle")
    for path, data in entries.items():
        if path.endswith(".mjs"):
            for dependency in re.findall(r"""from\s+['"]\./([a-z0-9.-]+\.mjs)['"]""", data.decode("utf-8")):
                if str(Path(path).parent / dependency).replace("\\", "/") not in entries:
                    raise ValueError("missing module dependency: " + dependency)
        elif path.endswith("SKILL.md"):
            for dependency in re.findall(r"`(experiments/[^\n`]+\.mjs)`", data.decode("utf-8")):
                if dependency not in entries:
                    raise ValueError("missing optional helper: " + dependency)
    entries["MANIFEST.json"] = (json.dumps(manifest, sort_keys=True, indent=2) + "\n").encode()
    entries["README.txt"] = (
        "EXPERIMENTAL candidate bundle; not a replacement for 2.4.4.\n"
        "Each candidates/<name>/ folder is an independent instruction prototype.\n"
        "Use only in an isolated evaluation environment; no automatic installation.\n"
        "Optional JavaScript helpers require a compatible trusted runtime.\n"
        "Run node experiments/bounded-control/<name>.test.mjs from the bundle root.\n"
        "Live host activation, legacy equivalence and model benefit remain unverified.\n"
    ).encode()
    entries["SHA256SUMS"] = "".join(hashlib.sha256(data).hexdigest() + "  " + path + "\n" for path, data in sorted(entries.items())).encode()
    # Validate all members before creating an output; refuse overwrite.
    with zipfile.ZipFile(output, "x", compression=zipfile.ZIP_STORED) as archive:
        for path, data in sorted(entries.items()):
            info = zipfile.ZipInfo(path, (1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None or archive.namelist() != sorted(entries):
            raise ValueError("archive verification failed")
        for path, data in entries.items():
            if archive.read(path) != data:
                raise ValueError("archive member mismatch: " + path)
    return {"skills": len(names), "members": len(entries), "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--repo", type=Path, default=Path("."))
    parser.add_argument("--manifest", type=Path, default=Path("packaging/candidate-manifest.json"))
    args = parser.parse_args()
    print(json.dumps(build(args.repo, args.manifest, args.output), sort_keys=True))
