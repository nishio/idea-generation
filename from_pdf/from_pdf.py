# -*- coding: utf-8 -*-
"""
take a pdf and write text (a page to a line)

It uses PDFMiner's pdf2txt.py


"""
import os
import re
import subprocess
from neologdn import normalize

# TODO: 入出力場所を指定できるようにする
INDIR = 'in/'
OUTDIR = 'out/'

for filename in sorted(os.listdir(INDIR)):
    # TODO: omit_pattern を指定できるようにする
    #if filename.startswith('iphone4_'): continue
    if filename.startswith('.'): continue
    if not filename.endswith('.pdf'): continue
    print(filename)
    outfile = os.path.join(OUTDIR, filename).replace('.pdf', '.txt')
    if os.path.isfile(outfile):
        print 'already exists'
        continue
    infile = os.path.join(INDIR, filename)
    subprocess.check_call(['pdf2txt.py', '-V', '-o', 'tmp.txt', infile])


    data = file('tmp.txt').read()
    data = data.split('\x0c')
    data = [normalize(page.replace('\n', ' ').decode('utf-8')) for page in data]
    file(outfile, 'w').write('\n'.join(data).encode('utf-8'))
