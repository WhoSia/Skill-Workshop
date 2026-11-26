import hashlib
import json
import subprocess
import tempfile
import unittest
import zipfile
from pathlib import Path
from build_candidate import build

class BundleTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.repo = self.root / "repo"
        self.repo.mkdir()
        self.git("init", "-q")
        self.git("config", "user.name", "Fixture")
        self.git("config", "user.email", "fixture@example.invalid")
        self.files = {
            "candidates/test-skill/SKILL.md": b"---\nname: test-skill\ndescription: Test fixture\n---\n# Test\n",
            "experiments/bounded-control/a.mjs": b"export const x=1;\n",
            "experiments/bounded-control/a.test.mjs": b"import {x} from './a.mjs';\n"
        }
        for path, data in self.files.items():
            p = self.repo / path
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(data)
        self.git("add", ".")
        self.git("commit", "-qm", "fixture")
        self.manifest = {
            "format": "skill-workshop-candidate-bundle-v1",
            "status": "EXPERIMENTAL_NOT_RELEASE",
            "sourceCommit": self.git("rev-parse", "HEAD").strip(),
            "files": [
                {"path": path, "gitBlob": self.git("rev-parse", "HEAD:" + path).strip(),
                 "kind": "skill" if path.endswith(".md") else "test" if path.endswith(".test.mjs") else "module"}
                for path in self.files
            ]
        }
        self.path = self.root / "manifest.json"

    def git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.repo), *args], text=True)

    def run_build(self, name="bundle.zip"):
        self.path.write_text(json.dumps(self.manifest), encoding="utf-8")
        return build(self.repo, self.path, self.root / name)

    def test_reproducible_and_integrity(self):
        a, b = self.run_build("a.zip"), self.run_build("b.zip")
        self.assertEqual(a, b)
        self.assertEqual((self.root / "a.zip").read_bytes(), (self.root / "b.zip").read_bytes())
        with zipfile.ZipFile(self.root / "a.zip") as z:
            for line in z.read("SHA256SUMS").decode().splitlines():
                digest, path = line.split("  ", 1)
                self.assertEqual(digest, hashlib.sha256(z.read(path)).hexdigest())
            for path, data in self.files.items():
                self.assertEqual(z.read(path), data)

    def test_dirty_checkout_does_not_change_pinned_bytes(self):
        a = self.run_build("a.zip")
        (self.repo / "candidates/test-skill/SKILL.md").write_text("dirty")
        self.assertEqual(a, self.run_build("b.zip"))

    def test_blob_mismatch(self):
        self.manifest["files"][0]["gitBlob"] = "0" * 40
        with self.assertRaises(ValueError):
            self.run_build()
        self.assertFalse((self.root / "bundle.zip").exists())

    def test_missing_import(self):
        self.manifest["files"] = [x for x in self.manifest["files"] if x["path"] != "experiments/bounded-control/a.mjs"]
        with self.assertRaisesRegex(ValueError, "missing module dependency"):
            self.run_build()

    def test_kind_mismatch(self):
        self.manifest["files"][2]["kind"] = "module"
        with self.assertRaisesRegex(ValueError, "invalid or duplicate member"):
            self.run_build()

    def test_path_traversal(self):
        self.manifest["files"][0]["path"] = "../outside"
        with self.assertRaises(ValueError):
            self.run_build()

    def test_duplicate(self):
        self.manifest["files"].append(self.manifest["files"][0])
        with self.assertRaises(ValueError):
            self.run_build()

    def test_refuse_overwrite(self):
        self.run_build()
        with self.assertRaises(FileExistsError):
            self.run_build()

if __name__ == "__main__":
    unittest.main()
