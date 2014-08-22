import sys
import getopt
from PyPDF2 import PdfFileWriter, PdfFileReader

def main(argv):
    size = (91, 55)
    margin = (11, 14)
    padding = '5'
    outputfile = ''
    inputfile = ''
    try:
        opts, args = getopt.getopt(
            argv, "hi:o:s:m:p:", ["ifile=", "ofile=", "size=", "margin=", "padding="])
    except getopt.GetoptError:
        print 'test.py -h  for help'
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-h"):
            help_printer()
            sys.exit()
        elif opt in ("-s", "--size"):
            try:
                items = map(int, arg.split("x"))
                assert len(items) == 2
                assert items[0] != 0 and items[1] != 0
                size = items
            except:
                print "Incorrect Format!! Using default value for size."

        elif opt in ("-m", "--margin"):
            try:
                items = map(int, arg.split("x"))
                assert len(items) == 2
                assert items[0] != 0 and items[1] != 0

                margin = items
            except:
                print "Incorrect Format!! Using default value for margin."

        elif opt in ("-p", "--padding"):
            try:
                items = map(int, arg.split("x"))
                if len(items) == 1:
                    padding = (items[0], items[0], items[0], items[0])
                elif len(x) == 2:
                    assert items[0] != 0 and items[1] != 0
                    padding = (items[0], items[1], items[0], items[1])
                elif len(x) == 4:
                    assert all(x != 0 for x in items)
                    padding = tuple(items)
                else:
                    raise AssertionError('not here')
            except:
                print "Incorrect Format!! Using default value for padding."

        elif opt in ("-o", "--ofile"):
            if not arg.endswith(".pdf"):
                arg = arg + ".pdf"
            outputfile = arg
        elif opt in ("-i", "--ifile"):
            inputfile = arg
    if inputfile == '':
        print 'Input file is not specified!!!'
        help_printer()
        sys.exit()
    if outputfile == '':
        print 'Output file is not specified!!!'
        help_printer()
        sys.exit()

    print 'The configuration is :\nSize:{}\nMargin:{}\nPadding:{}\nOutput file:{}'.format(size, margin, padding, outputfile)
    imp_exp_pdf(inputfile, outputfile, size, margin, padding)


def help_printer():
    "For displaying help."
    print 'Usage: {} [-s <WxH>] [-m <TOPxLEFT>] [-p <PADDING>] -o <outputfile> -i <inputfile>'.format(__file__)
    print '-s, --size\t Size of each box in WIDTHxHEIGHT format'
    print '-m, --margin\t Margin between paper boundry and boxes in TOPxLEFT format'
    print '-p, --padding\t Padding between box boundry and slide boundry in format '
    print '\t\t PADDING'
    print '\t\t PADDING(top/bottom)xPADDING(left/right)'
    print '\t\t PADDING(top)xPADDING(right)xPADDING(bottom)xPADDING(left)'
    print '-i, --ifile\t PDF input file name'
    print '-o, --ofile\t PDF output file name'


def output_one_page(pages, size, margin, padding, output):
    tmppdf = PdfFileReader(file('BlankA4.pdf', 'rb'))
    tmppage = tmppdf.getPage(0)
    (w, h) = tmppage.mediaBox.upperRight

    slide_width = size[0] - padding[1] - padding[3]
    slide_height = size[1] - padding[0] - padding[2]

    for (j, page) in enumerate(pages):
        if j % 2 == 0:
            xfactor = inch_pixel(margin[1] + padding[3])
        else:
            xfactor = inch_pixel(margin[1] + size[0] + padding[3])

        yfactor = h - inch_pixel(
            margin[0] +
            size[1] * (j / 2 + 1) +
            padding[0])

        w2, h2 = page.mediaBox.upperRight
        scaled_height = float(slide_width) / w2 * h2
        if scaled_height < slide_height:
            # fit with width
            page.scaleTo(inch_pixel(slide_width),
                         inch_pixel(scaled_height))
            yfactor -= inch_pixel(slide_height - scaled_height) / 2
        else:
            # fit with height
            scaled_width = float(slide_height) / h2 * w2
            page.scaleTo(inch_pixel(scaled_width),
                         inch_pixel(slide_height))
            xfactor += inch_pixel(slide_width - scaled_width) / 2

        tmppage.mergeTranslatedPage(page, xfactor, yfactor)
    output.addPage(tmppage)


def imp_exp_pdf(inputfile, outputfile, size, margin, padding):
    "For Import and Export PDF files by resizing"
    output = PdfFileWriter()
    input = PdfFileReader(file(inputfile, 'rb'))
    totalPages = input.getNumPages()
    p = []

    for i in range(0, input.getNumPages()):
        p.append(input.getPage(i))
        if len(p) == 10:
            output_one_page(p, size, margin, padding, output)
            p = []

            echoer = "Printed {} of {}  [{:.2f}%]".format(
                i + 1, totalPages, (i + 1) / float(totalPages) * 100)
            print echoer


    if len(p) > 0:
        tmppdf = PdfFileReader(file('BlankA4.pdf', 'rb'))
        tmppage = tmppdf.getPage(0)
        (w, h) = tmppage.mediaBox.upperRight
        output_one_page(p, size, margin, padding, output)
        p = []

    print
    print 'Completed converting.'
    print 'Saving...'
    outputStream = file(outputfile, "wb")
    output.write(outputStream)
    outputStream.close()
    print 'END OF PROGRAM'


def inch_pixel(inch):
    "inch to pixel calculator"
    pix = int(float(inch) * 2.834747474747475)
    return pix


if __name__ == "__main__":
    main(sys.argv[1:])
