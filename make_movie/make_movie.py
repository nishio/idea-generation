#!/usr/bin/env python
import sys
import subprocess
import shutil
import os

target = sys.argv[1]

print target
shutil.copyfile(target, 'tmp.pdf')

shutil.rmtree('tmp', ignore_errors=True)
os.makedirs('tmp')

print 'extracting pages'
subprocess.check_call(
    "gs -q -dBATCH -dNOPAUSE -sDEVICE=png16m -r150x100 -sOutputFile=tmp/page_%04d.png tmp.pdf".split(),
    stdout=sys.stdout, stderr=sys.stderr)


print 'making movie'
path, name = os.path.split(target)
outfile = name.replace('.pdf', '.mp4')
assert name != outfile

subprocess.check_call(
    'ffmpeg -y -f image2 -r 10 -sameq -i tmp/page_%04d.png'.split()
    + [outfile], stdout=sys.stdout, stderr=sys.stderr)

