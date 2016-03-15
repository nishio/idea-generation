#!/usr/bin/env python
"""
given PDF (such as a presentation slide) and export HTML
with images of each page and texts of each page
"""
import sys
import subprocess
import shutil
import os
import argparse


parser = argparse.ArgumentParser(description='Convert PDF to movie.')
parser.add_argument('pdfs', metavar='PDF', nargs='+',
                   help='target PDF files')
#parser.add_argument('--resolution', action='store', default='150x100',
#                   help='resolution(default 150x100, good for book)')
parser.add_argument('--resolution', action='store', default='40x40',
                    help='resolution(default 40x40, good for slide)')

args = parser.parse_args()

def output_images():
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

def output_texts():
    subprocess.check_call(
        'pdf2txt.py -V -o tmp.txt tmp.pdf'.split(), stdout=sys.stdout, stderr=sys.stderr)

    data = file('tmp.txt').read().split('\x0c')
    return data

output_images()
data = output_texts()
fo = file('out.html', 'w')
fo.write('<html>')
pages = 0
for f in sorted(os.listdir('tmp')):
    fo.write('<p><img src="tmp/%s">' % f)
    fo.write('<p><pre>%s</pre>' % data[pages])
    pages += 1
fo.close()
