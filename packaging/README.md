# Experimental candidate bundle

This is a portable evaluation snapshot, not a new Skill-Workshop release and not a replacement for 2.4.4. The current manifest contains 13 standalone candidate instructions, nine deterministic helper modules and 13 regression scripts. It does not silently retire any legacy skill or grant Research OS authority. The historical roster is not a development quota.

## Build and verify

From a Git checkout containing the pinned commit in `candidate-manifest.json`, with Python 3 and Git:

```sh
python -m unittest discover -s packaging -p "test_build_candidate.py"
python packaging/build_candidate.py Skill-Workshop-candidate.zip
```

The builder verifies each pinned Git blob, validates the supported skill header and referenced local helper/import paths, emits a sorted, fixed-metadata ZIP and a SHA-256 member inventory, then reads the archive back. It refuses to overwrite an existing archive. It does not install skills or execute helpers. The path checker covers the repository's current static import convention; it is not a general JavaScript dependency analyzer or host validator.

Extract into an isolated evaluation directory. The `candidates/<name>/SKILL.md` files may be inspected individually. Installation is host-specific and must follow the host's supported skill format; the bundle is not a verified ChatGPT or Claude plugin package. Optional helper paths are relative to the extracted bundle root, and the host must actually expose a compatible trusted execution surface.

## Current verification receipt

Pinned source: `d7af3994af08690903c0d7f134b2403004b6bfd4`. All 35 source paths were independently fetched at that revision and compared to the manifest. One historical transcription error in the method-composition test blob ID was found and corrected from the actual fetched blob. All 13 skill headers and literal helper references, and 22 module/test static relative import references, passed the supported inventory checks. Manifest is not a host conformance certificate.

The ten earlier JavaScript tests were rerun against the unchanged source blobs in V8 on the previous snapshot; the three new substitution/reuse tests were rerun on the current pinned revision (509 + 7 + 2,012 checks). These are deterministic engineering checks, not live model outcomes.

## Native packaging regression and real-source slice

The original builder and Python tests were copied into a local isolated runtime and their Git blob identities matched the exact repository versions. Python 3.13.5 and Git executed the seven original tests: four returned OK, three failed. The common module/test path regex wrongly excluded filenames ending in .test.mjs; some negative tests were consequently weak. The corrected kind-specific regex and stronger missing-dependency/kind tests passed all eight tests. Both fixed source files were checked by local Git blob hash and remote readback after commit.

A real-source slice, consisting of the AXIOM instruction, fiber-audit.mjs and its test, was copied into a local fixture repository after matching all three upstream Git blob hashes. Built twice, byte-identical ZIPs, 6 members, 9,300 bytes. Every listed SHA-256 member matched after extraction, and the native Node.js v22.16.0 test passed 1,751 assertions. The fixture commit is local, not the upstream commit; the manifest records both identities. ZIP SHA-256: cef2de4690cafa72ee0d4faf2efd0585d613be8db6829c4da5fb3846b5b3e4a6. This is a verified one-skill pilot, not the entire candidate bundle. No host installation or live model run.

The full upstream Git checkout is still unavailable in the local runtime (git ls-remote fails DNS resolution). Full 35-source-file ZIP generation remains open. Do not claim complete package or legacy equivalence from the slice. Future manifest updates should obtain blob IDs programmatically at the pinned commit, never manually transcribe hashes.

## Decision priorities

Provisional estimates, not performance measurements. P=.25R+.35V+.15E+.15F+.10(1-B). Keep blockers and expected value separate.

| Decision | R | V | E | F | B | Status |
|---|---:|---:|---:|---:|---:|---|
| Repair native builder failure | 1.00 | .99 | 1.00 | .99 | .10 | complete |
| Correct and verify pinned manifest | 1.00 | .99 | 1.00 | .99 | .14 | complete |
| Native real-source pilot smoke | 1.00 | .98 | .97 | .95 | .20 | complete |
| Full ZIP build from upstream | 1.00 | .98 | .95 | .20 | .25 | checkout blocked |
| Evaluate useful skill behavior on fresh tasks | 1.00 | 1.00 | .90 | .25 | .40 | independent model execution unresolved |
| Further infrastructure without failure witness | .45 | .40 | .30 | .95 | .45 | defer |
| Claim production release | .70 | .55 | .20 | .30 | .75 | hold |

Next product improvement: test actual instruction behavior on fresh tasks and reduce redundant skill guidance, rather than expand the helper roster. No Actions invocation or production migration.
