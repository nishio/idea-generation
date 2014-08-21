import sys, getopt
from PyPDF2 import PdfFileWriter, PdfFileReader
#This is where the application enters
def main(argv):
   size = '91x55'
   margin = '11x14'
   padding = '3'
   outputfile = ''
   inputfile = ''
   size_array=margin_array=padding_array = []
   try:
      opts, args = getopt.getopt(argv,"hi:o:s:m:p:",["ifile=","ofile=","size=","margin=","padding="])
   except getopt.GetoptError:
      print 'test.py -h  for help'
      sys.exit(2)
   for opt, arg in opts:
      if opt in ("-h"):
         help_printer()
         sys.exit()
      elif opt in ("-s", "--size"):
         #size = arg
         x=arg.split("x")
         if len(x)==2:
            if int(x[0])!=0 and int(x[1])!=0:
               size=arg
            else:
               print "Incorrect Format!! Using default value for size."
         else:
            print "Incorrect Format!! Using default value for size."
      elif opt in ("-m", "--margin"):
         #margin = arg
         x=arg.split("x")
         if len(x)==2:
            if int(x[0])!=0 and int(x[1])!=0:
               margin=arg
            else:
               print "Incorrect Format!! Using default value for margin."
         else:
            print "Incorrect Format!! Using default value for margin."
      elif opt in ("-p", "--padding"):
         #padding = arg
         x=arg.split("x")
         if len(x)==1:
            padding=arg
         elif len(x)==2:
            if int(x[0])!=0 and int(x[1])!=0:
               padding=arg
            else:
               print "Incorrect Format!! Using default value for padding."
         elif len(x)==4:
            if int(x[0])!=0 and int(x[1])!=0 and int(x[2])!=0 and int(x[3])!=0:
               padding=arg
            else:
               print "Incorrect Format!! Using default value for padding."
         else:
            print "Incorrect Format!! Using default value for padding."
      elif opt in ("-o", "--ofile"):
         if not arg.endswith(".pdf"):
            arg=arg+".pdf"
         outputfile = arg
      elif opt in ("-i", "--ifile"):
         inputfile = arg
   if inputfile=='':
      print 'Input file is not specified!!!'
      help_printer()
      sys.exit()
   if outputfile=='':
      print 'Output file is not specified!!!'
      help_printer()
      sys.exit()
   print 'The configuration is :\nSize:{}\nMargin:{}\nPadding:{}\nOutput file:{}'.format(size,margin,padding,outputfile)
   size_array=size.split("x")
   margin_array=margin.split("x")
   temp=padding.split("x")
   if len(temp)==1:
      padding_array=[temp[0],temp[0],temp[0],temp[0]]
   elif len(temp)==2:
      padding_array=[temp[0],temp[1],temp[0],temp[1]]
   elif len(temp)==4:
      padding_array=[temp[0],temp[1],temp[2],temp[3]]
   imp_exp_pdf(inputfile,outputfile,size_array,margin_array,padding_array)

##For displaying help.
def help_printer():
   print 'Usage: {} [-s <WxH>] [-m <TOPxLEFT>] [-p <PADDING>] -o <outputfile> -i <inputfile>'.format(__file__)
   print '-s, --size\t Size of each box in WIDTHxHEIGHT format'
   print '-m, --margin\t Margin between paper boundry and boxes in TOPxLEFT format'
   print '-p, --padding\t Padding between box boundry and slide boundry in format '
   print '\t\t PADDING'
   print '\t\t PADDING(top/bottom)xPADDING(left/right)'
   print '\t\t PADDING(top)xPADDING(right)xPADDING(bottom)xPADDING(left)'
   print '-i, --ifile\t PDF input file name'
   print '-o, --ofile\t PDF output file name'

##For Import and Export PDF files by resizing
def imp_exp_pdf(inputfile,outputfile,size,margin,padding):
   output=PdfFileWriter()
   input = PdfFileReader(file(inputfile, 'rb'))
   pages = 0
   totalPages = input.getNumPages()
   p=[]
   echoer = "Printed {} of {}  [{:.2f}%]".format(pages,totalPages,pages/float(totalPages)*100)
   print echoer,
   delete = "\b" * (len(echoer)+1)
   for i in range (0,input.getNumPages()):
       p.append(input.getPage(i))
       if len(p)==10:
           tmppdf=PdfFileReader(file('BlankA4.pdf', 'rb'))
           tmppage=tmppdf.getPage(0)
           (w, h) = tmppage.mediaBox.upperRight
           for (j,page) in enumerate(p):
               pages = pages+1
               echoer = "{}Printed {} of {}  [{:.2f}%]".format(delete,pages,totalPages,pages/float(totalPages)*100)
               delete = "\b" * (len(echoer)+1)
               page.scaleTo(inch_pixel(size[0]),inch_pixel(size[1]))
               xfactor = inch_pixel(int(margin[1])+int(size[0])+int(padding[1]))
               if j%2 == 0:
                   xfactor=inch_pixel(margin[1])
               
               tmppage.mergeTranslatedPage(page,xfactor,h-inch_pixel(margin[0])-inch_pixel(size[1])*(j/2+1)-inch_pixel(padding[2])*(j/2))
               print echoer,
           p=[]
           output.addPage(tmppage)
   if len(p)> 0 :
       tmppdf=PdfFileReader(file('BlankA4.pdf', 'rb'))
       tmppage=tmppdf.getPage(0)
       (w, h) = tmppage.mediaBox.upperRight
       for (j,page) in enumerate(p):
            pages = pages+1
            echoer = "{}Printed {} of {}  [{:.2f}%]".format(delete,pages,totalPages,pages/float(totalPages)*100)
            delete = "\b" * (len(echoer)+1)
            page.scaleTo(inch_pixel(size[0]),inch_pixel(size[1]))
            xfactor = inch_pixel(int(margin[1])+int(size[0])+int(padding[1]))
            if j%2 == 0:
               xfactor=inch_pixel(margin[1])
               
            tmppage.mergeTranslatedPage(page,xfactor,h-inch_pixel(margin[0])-inch_pixel(size[1])*(j/2+1)-inch_pixel(padding[2])*(j/2))
            print echoer,
       p=[]
       output.addPage(tmppage)
   print
   print 'Completed converting.'
   print 'Saving...'
   outputStream = file(outputfile, "wb")
   output.write(outputStream)
   outputStream.close()
   print 'END OF PROGRAM'

#inch to pixel calculator
def inch_pixel(inch):
   pix=int(float(inch)*2.834747474747475)
   return pix
   

if __name__ == "__main__":
   main(sys.argv[1:])
