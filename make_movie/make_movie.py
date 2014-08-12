#!/usr/bin/env python
import sys
import subprocess
import shutil
import os
import argparse


parser = argparse.ArgumentParser(description='Convert PDF to movie.')
parser.add_argument('pdfs', metavar='PDF', nargs='+',
                   help='target PDF files')
parser.add_argument('--resolution', action='store', default='150x100',
                   help='resolution(default 150x100, good for book)')

args = parser.parse_args()

shutil.rmtree('tmp', ignore_errors=True)
os.makedirs('tmp')
for i, target in enumerate(args.pdfs):
    print i, target
    shutil.copyfile(target, 'tmp.pdf')

    print 'extracting pages'
    subprocess.check_call(
        "gs -q -dBATCH -dNOPAUSE -sDEVICE=png16m".split()
        + ["-r" + args.resolution]
        + ["-sOutputFile=tmp/%03d_%%04d.png" % i]
        + ["tmp.pdf"],
    stdout=sys.stdout, stderr=sys.stderr)

print 'renaming'
pages = 0
for f in os.listdir('tmp'):
    shutil.move(
        os.path.join('tmp', f),
        os.path.join('tmp', 'page_%04d.png' % pages))
    pages += 1

print 'making movie'
path, name = os.path.split(target)
outfile = name.replace('.pdf', '.mp4')
assert name != outfile

subprocess.check_call(
    'ffmpeg -y -f image2 -r 10 -sameq -i tmp/page_%04d.png'.split()
    + [outfile], stdout=sys.stdout, stderr=sys.stderr)

