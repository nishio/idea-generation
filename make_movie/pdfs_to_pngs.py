#!/usr/bin/env python
"""
convert PDFs to PNGs
PDFs are in 'input' dir.
PNGs are put as 'output/<pdfname>/page_0000.png'
"""

import sys
import subprocess
import shutil
import os
import argparse
import time
import re

"""
parser = argparse.ArgumentParser(description='Convert PDF to movie.')
parser.add_argument('pdfs', metavar='PDF', nargs='+',
                   help='target PDF files')
parser.add_argument('--resolution', action='store', default='150x100',
                   help='resolution(default 150x100, good for book)')

args = parser.parse_args()
"""

INDIR = 'input'
#INDIR = '/media/winhome/Documents/BOOKSCAN'

pdfs = sorted(os.listdir(INDIR))
for pdf in pdfs:
    print pdf
    root = os.path.splitext(pdf)[0]
    outdir = os.path.join('output', root)
    if os.path.exists(outdir):
        print 'exists'
        continue

    shutil.rmtree('tmp', ignore_errors=True)
    os.makedirs('tmp')

    shutil.copyfile(os.path.join(INDIR, pdf), 'tmp.pdf')

    print 'scale keeping aspect ratio'
    pdfinfo = subprocess.check_output(['pdfinfo', 'tmp.pdf'])
    m = re.search("Page size: +([\d.]+) x ([\d.]+) pts", pdfinfo)
    w, h = map(float, m.groups())
    height = 1280  #640
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
    print time.time() - starttime

    #shutil.rmtree('tmp', ignore_errors=True)

    shutil.move(
        os.path.join('tmp'),
        os.path.join(outdir))

