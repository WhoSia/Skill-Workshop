#!/usr/bin/env python3
"""Build the private skills-only Workshop plugin from a portable source tree."""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path


def build(source: Path, output: Path):
    manifest = (source / 'plugin.json').read_bytes()
    meta = json.loads(manifest)
    if meta.get('$schema') != 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json' or meta.get('name') != 'skill-workshop-dev':
        raise ValueError('unexpected plugin identity or schema')
    if not re.fullmatch(r'\d+\.\d+\.\d+', meta['version']):
        raise ValueError('expected numeric semantic version')
    skill = source / 'workshop'
    paths = [skill / 'SKILL.md', *sorted((skill / 'references').glob('*.md'))]
    if any(p.is_symlink() or not p.is_file() or not p.resolve().is_relative_to(source.resolve()) for p in paths):
        raise ValueError('invalid skill source')
    files = {p.relative_to(source).as_posix(): p.read_bytes() for p in paths}
    entry = files['workshop/SKILL.md'].decode('utf-8')
    if not re.match(r'\A---\nname: workshop\ndescription: [^\n]+\n---\n', entry):
        raise ValueError('invalid Workshop skill header')
    for ref in re.findall(r'\]\((references/[^)]+)\)', entry):
        if 'workshop/' + ref not in files:
            raise ValueError('missing reference: ' + ref)
    # Package the existing canonical algorithms, not independent copies in Git.
    scripts = skill / 'scripts'
    cli = scripts / 'finite-observation.mjs'
    helpers = source.parent.parent / 'experiments' / 'bounded-control'
    for p in [cli, helpers / 'fiber-audit.mjs', helpers / 'refinement-selector.mjs']:
        if p.is_symlink() or not p.is_file() or not p.resolve().is_relative_to(source.parent.parent.resolve()):
            raise ValueError('invalid helper source: ' + str(p))
        files['workshop/scripts/' + p.name] = p.read_bytes()
    oracle = source.parent.parent / 'evaluation' / 'exact-inquiry' / 'oracle.mjs'
    if oracle.is_symlink() or not oracle.is_file() or not oracle.resolve().is_relative_to(source.parent.parent.resolve()):
        raise ValueError('invalid inquiry oracle source')
    files['workshop/scripts/inquiry-oracle.mjs'] = oracle.read_bytes()
    root = meta['name'] + '/'
    entries = {root + 'plugin.json': manifest, **{root + 'skills/' + k: v for k, v in files.items()}}
    with zipfile.ZipFile(output, 'x', compression=zipfile.ZIP_STORED) as archive:
        for name, data in sorted(entries.items()):
            info = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data)
    with zipfile.ZipFile(output) as archive:
        if archive.testzip() is not None or archive.namelist() != sorted(entries) or any(archive.read(k) != v for k, v in entries.items()):
            raise ValueError('archive verification failed')
    return {'version': meta['version'], 'members': len(entries), 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path)
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    print(json.dumps(build(args.source, args.output), sort_keys=True))
