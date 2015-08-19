pdfThumbnails.py
=============

Makes thumbnails of the pdf file
--------------------------------

Requires:
---------

- python 2.7
- pip install pdfrw

Usage:
------

**help:**        pdfThumbnails.py

**usage:**       pdfThumbnails.py -i toCombine.pdf [-o out_pdf.pdf] [-x 5] [-y 5] [-g 0.01]

**test mode:**   pdfThumbnails.py -i toCombine.pdf -t


Required:
---------

- -i - input file name

Optional:
---------

- -o - output file name, out_pdf.pdf by default
- -x - columns count, 5 by default
- -y - rows count, 5 by default
- -g - gap between thumbnails in centimeters, 0.01 by default
- -t - test mode on

License:
--------

It was wrote by Sergey Starodubov on 23-Aug-2013. NISHIO Hirokazu bought it.
