# Experimental candidate bundle

This is a portable evaluation snapshot, not a new Skill-Workshop release and not a replacement for 2.4.4. It contains eight standalone candidate instructions and optional deterministic research helpers, plus regression tests. It does not silently retire any legacy skill or grant Research OS authority.

## Build and verify

From a Git checkout containing the pinned commit in `candidate-manifest.json`, with Python 3 and Git:

```sh
python packaging/build_candidate.py Skill-Workshop-candidate.zip
python -m unittest discover -s packaging -p "test_build_candidate.py"
```

The builder verifies each pinned Git blob, validates the supported skill header and referenced local helper/import paths, emits a sorted, fixed-metadata ZIP and a SHA-256 member inventory, then reads the archive back. It refuses to overwrite an existing archive. It does not install skills or execute helpers. The path checker covers the repository's current static import convention; it is not a general JavaScript dependency analyzer or host validator.

Extract into an isolated evaluation directory. The eight `candidates/<name>/SKILL.md` files may be inspected individually. Installation is host-specific and must follow the host's supported skill format; the bundle is not a verified ChatGPT or Claude plugin package. Optional helper paths are relative to the extracted bundle root, and the host must actually expose a compatible trusted execution surface.

## Current verification receipt

Pinned source: `6f862ecd7d956235a24db8f4283c1d4d89e67787`. Manifest: 8 instructions, 7 JavaScript helper modules, 10 JavaScript tests. All ten pinned JavaScript test scripts reran in a V8 tool runtime with explicit import injection, and returned the expected pass results. No native Node CLI execution claimed. The packager and its seven Python unittest cases have been committed and read back but not executed: the local runtime could not resolve github.com, and a verified local checkout of the pinned commit was unavailable. No ZIP bytes, archive checksum, installation, or model activation are claimed here.

## Decision priorities

Scores are provisional design estimates, not performance measurements. With the existing priority heuristic P=.25R+.35V+.15E+.15F+.10(1-B), maintain separate blockers and expected product value. Do not rank an unavailable action as executable.

| Decision | R | V | E | F | B | Status |
|---|---:|---:|---:|---:|---:|---|
| Immutable manifest and reproducible build | .98 | .97 | .88 | .95 | .20 | implemented |
| Re-run all pinned helper regressions | 1.00 | .97 | .97 | .99 | .12 | executed in V8 |
| Execute real ZIP build and unpack smoke | 1.00 | .98 | .92 | .20 | .20 | local checkout blocked |
| Actual isolated model comparison | 1.00 | 1.00 | .90 | .20 | .45 | execution surface unresolved |
| Claim production release | .70 | .55 | .20 | .30 | .75 | hold |

Next feasible work should improve the execution side of the skill suite, with a focus on FORGE and TRACE only if that closes a real product gap. Revisit the blocked packaging and live model tests before claiming a release. No Actions invocation or production migration.
