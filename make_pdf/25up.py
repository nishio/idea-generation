#!/usr/bin/env python

'''
Combiner PDF file.

help:        pdfCombiner.py
usage:       pdfCombiner.py -i to_combine.pdf [-o out_pdf.pdf] [-x 5] [-y 5] [-g 0]
test mode:   pdfCombiner.py -i to_combine.pdf -t
'''

import time
import os

from pdfrw import PdfReader, PdfWriter, PdfDict, PdfName, PdfArray
from pdfrw.buildxobj import pagexobj

def getPages(allpages, x, y, gap):

    # Number of pages to combine
    count = x * y

    # Pull pages off the list
    pages = [pagexobj(p) for p in allpages[:count]]
    del allpages[:count]

    # Out page size
    width_max  = max(page.BBox[2] for page in pages)
    height_max = max(page.BBox[3] for page in pages)

    stream = []
    xobjdict = PdfDict()

    line = y
    for index, page in enumerate(pages):

        width = (index % x) * width_max / x
        if not width:
            line = line - 1
        height = line * height_max / y

        # Page number
        index = PdfName('P{}'.format(index))

        format_stream = {
            "x": 1./x - gap,
            "y": 1./y - gap,
            "w": width,
            "h": height,
            "i": index
        }
        stream.append('q {x} 0 0 {y} {w} {h} cm {i} Do Q\n'.format(**format_stream))

        xobjdict[index] = page

    return PdfDict(
        Type = PdfName.Page,
        Contents = PdfDict(stream=''.join(stream)),
        MediaBox = PdfArray([-1000*gap, -1000*gap, width_max, height_max]),
        Resources = PdfDict(XObject = xobjdict),
    )

def combine(inpfn, outfn, x, y, gap):
    # Read all pages from input file
    pages = PdfReader(inpfn).pages
    
    # Object to write output PDF
    writer = PdfWriter()

    while pages:
        writer.addpage(getPages(pages, x, y, gap))
    
    writer.write(outfn)

def testCase(inp_file_name):
    combine(inp_file_name, "test_5_5_gap0.01.pdf", 5, 5, 0.01)
    combine(inp_file_name, "test_4_4_gap0.01.pdf", 4, 4, 0.01)
    combine(inp_file_name, "test_3_3_gap0.01.pdf", 3, 3, 0.01)
    combine(inp_file_name, "test_2_2_gap0.01.pdf", 2, 2, 0.01)
    combine(inp_file_name, "test_5_5_gap0.pdf", 5, 5, 0)
    combine(inp_file_name, "test_4_4_gap0.pdf", 4, 4, 0)
    combine(inp_file_name, "test_3_3_gap0.pdf", 3, 3, 0)
    combine(inp_file_name, "test_2_2_gap0.pdf", 2, 2, 0)

if __name__ == "__main__":
    
    # Parse options
    from optparse import OptionParser
    parser = OptionParser(description = __doc__)
    parser.add_option('-i', dest='input_file_name', help='file name to be combined (pdf)')
    parser.add_option('-x', dest='pages_horizont', help='pages combined on one page HORIZONT [5]', default=5)
    parser.add_option('-y', dest='pages_vertical', help='pages combined on one page VERTICAL [5]', default=5)
    parser.add_option('-g', dest='gap', help='margin between pages in centimeters [0.01]', default=0.01)
    parser.add_option('-o', dest='output_file_name', help='output file')
    parser.add_option('-t', dest='test_mode', action="store_true", help='test mode on')
    options, args = parser.parse_args()

    if options.input_file_name:

        inp_file_name = options.input_file_name
        out_file_name = options.output_file_name
        if not out_file_name:
            out_file_name  = inp_file_name.replace(".pdf", "_25up.pdf")
        x = options.pages_horizont
        y = options.pages_vertical
        gap = options.gap

        if options.test_mode:
            testCase(inp_file_name)
        else:
            combine(inp_file_name, out_file_name, x, y, gap)
    
    else:
        parser.print_help()
