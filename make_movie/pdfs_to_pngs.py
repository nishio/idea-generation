#!/usr/bin/env python
"""
convert PDFs to PNGs
PDFs are in 'input' dir.
PNGs are put as 'output/<pdfname>/pages_0000.png'
"""

import sys
import subprocess
import shutil
import os
import argparse
import time
import re


parser = argparse.ArgumentParser(description='Convert PDF to movie.')
parser.add_argument('--indir', action='store', default='input',
                   help='directory for PDFs')
parser.add_argument('--outdir', action='store', default='output',
                   help='directory to output PNGs')
parser.add_argument('--height', type=int, default=1280,
                   help='output height')

args = parser.parse_args()

pdfs = sorted(os.listdir(args.indir))
for pdf in pdfs:
    print pdf
    root = os.path.splitext(pdf)[0]
    outdir = os.path.join(args.outdir, root)
    if os.path.exists(outdir):
        print 'already exists'
        continue

    shutil.rmtree('tmp', ignore_errors=True)
    os.makedirs('tmp')

    shutil.copyfile(os.path.join(args.indir, pdf), 'tmp.pdf')

    pdfinfo = subprocess.check_output(['pdfinfo', 'tmp.pdf'])
    m = re.search("Page size: +([\d.]+) x ([\d.]+) pts", pdfinfo)
    w, h = map(float, m.groups())
    height = args.height
    width = int(height / h * w)
    resolution = 1280 / (h / 72) # pixel/inch. 1 point = 1/72 inch

    print 'extracting pages'
    starttime = time.time()
    subprocess.check_call(
        "gs -q -dBATCH -dNOPAUSE -sDEVICE=png16m".split()
        + ["-g{}x{}".format(width, height)]
        + ["-r{}".format(resolution)]
        + ["-sOutputFile=tmp/pages_%04d.png"]
        + ["tmp.pdf"],
        stdout=sys.stdout, stderr=sys.stderr)
    print 'elapse', time.time() - starttime

    shutil.move('tmp', outdir)

