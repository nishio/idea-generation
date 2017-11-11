# -*- coding: utf-8 -*-
"""
take a pdf and write text (a page to a line)

It uses PDFMiner's pdf2txt.py


"""
import os
import re
import sys
import subprocess
from neologdn import normalize
import time
import argparse
import shutil

parser = argparse.ArgumentParser(description='Convert PDF to movie.')
parser.add_argument('--indir', action='store', default='in',
                   help='directory for PDFs')
parser.add_argument('--outdir', action='store', default='out',
                   help='directory to output PNGs')
parser.add_argument('--resolution', action='store', default=200,
                   help='set resolution(default 200)')
parser.add_argument('--slide', action='store_true',
                   help='set resolution=45p')

args = parser.parse_args()

if args.slide:
    args.resolution = 45

def to_text(filename):
    outdir = os.path.join(args.outdir, filename).replace('.pdf', '')
    if not os.path.isdir(outdir):
        os.makedirs(outdir)

    outfile = os.path.join(outdir, "line_per_page.txt")
    if os.path.isfile(outfile):
        print 'text already exists'
        return

    infile = os.path.join(args.indir, filename)
    subprocess.check_call(['pdf2txt.py', '-V', '-o', 'tmp.txt', infile])


    data = file('tmp.txt').read()
    data = data.split('\x0c')
    data = [normalize(page.replace('\n', ' ').decode('utf-8')) for page in data]
    file(outfile, 'w').write('\n'.join(data).encode('utf-8'))


def to_pngs(filename):
    outdir = os.path.join(args.outdir, filename).replace('.pdf', '')
    if os.path.isdir(outdir):
        print 'folder already exists'
        return

    infile = os.path.join(args.indir, filename)
    print 'extracting pages'
    shutil.rmtree('tmp', ignore_errors=True)
    os.makedirs('tmp')
    starttime = time.time()

    if 1:
        subprocess.check_call( # -r 45 for slides, -r 200 for books
            ['pdftocairo', '-r', str(args.resolution), '-f', '0',
             #'-l', '10',
             '-png', infile, 'tmp/page'],
            stdout=sys.stdout, stderr=sys.stderr)
    else:
        subprocess.check_call(
            ['pdftocairo', '-r', '45', '-f', '0',
             '-png', infile, 'tmp/pages-%04d.png'],  # NOT WORKING
            stdout=sys.stdout, stderr=sys.stderr)

    print 'elapse', time.time() - starttime
    shutil.move('tmp', outdir)


for filename in sorted(os.listdir(args.indir)):
    # TODO: omit_pattern を指定できるようにする
    #if filename.startswith('iphone4_'): continue
    if filename.startswith('.'): continue
    if not filename.endswith('.pdf'): continue
    print(filename)

    to_pngs(filename)
    to_text(filename)
