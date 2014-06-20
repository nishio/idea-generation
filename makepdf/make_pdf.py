#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import os
import json
from reportlab.pdfgen import canvas
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.pagesizes import landscape, A4

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def get_items(files=[]):
    if files == []:
        PATH = '../localserver/data'
        for filename in os.listdir(PATH):
            if filename.startswith('test'): continue
            if '_copy' in filename: continue
            files.append(os.path.join(PATH, filename))

    items = []
    for filename in files:
        newitems = json.load(file(filename))
        items.extend(newitems)
    return items

items = get_items()
if len(items) < 25:
    items.extend([{'text': ''}] * (25 - len(items)))


fontname = "HeiseiKakuGo-W5"
pdfmetrics.registerFont(UnicodeCIDFont(fontname))


style = getSampleStyleSheet()['Normal']
style.fontName = fontname
style.wordWrap = "CJK"
pagesize = landscape(A4)
c = canvas.Canvas("hello.pdf", pagesize=pagesize)

c.saveState()
#c.setFont("HeiseiKakuGo-W5",18)

#canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, Title)
WIDTH, HEIGHT = pagesize
NUM = 5
PADDING_PAGE = 30  # padding between page boundary and contents
MARGIN_BOX = 20  # margin between boxs

WIDTH_BOX = (WIDTH - 2 * PADDING_PAGE - 4 * MARGIN_BOX) / 5
HEIGHT_BOX = (HEIGHT - 2 * PADDING_PAGE - 4 * MARGIN_BOX) / 5
START_FONT_SIZE = 30
for i in range(5):
    for j in range(5):
        x = PADDING_PAGE + (WIDTH_BOX + MARGIN_BOX) * i
        y = PADDING_PAGE + (HEIGHT_BOX + MARGIN_BOX) * j
        text = items[i * 5 + j]['text']
        if 0:
            c.line(0, y, WIDTH, y)
            c.line(x, 0, x, HEIGHT)
            c.line(0, y + HEIGHT_BOX, WIDTH, y + HEIGHT_BOX)
            c.line(x + WIDTH_BOX, 0, x + WIDTH_BOX, HEIGHT)

        style.fontSize = START_FONT_SIZE
        style.leading = START_FONT_SIZE
        while True:
            para = Paragraph(text, style)
            w, h = para.wrap(WIDTH_BOX, HEIGHT_BOX)
            if w > WIDTH_BOX or h > HEIGHT_BOX:
                style.fontSize -= 1
                style.leading -= 1
                continue

            # in some case of 禁則処理 overflow can happen
            para2 = Paragraph(text, style)
            lines = para2.breakLinesCJK([WIDTH_BOX, WIDTH_BOX]).lines
            if any(rest < 0 for rest, _text in lines):
                style.fontSize -= 1
                style.leading -= 1
                continue

            break

        para.drawOn(c, x, y + HEIGHT_BOX - h)

        #c.drawString(x, y, text)



c.restoreState()

c.showPage()

c.save()

"""
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch


PAGE_HEIGHT=defaultPageSize[1]
PAGE_WIDTH=defaultPageSize[0]

styles = getSampleStyleSheet()
my_style = styles["Normal"]
my_style.name = "bonlife"
my_style.fontName = "HeiseiKakuGo-W5"

Title = u"ReportLabで日本語を扱うサンプルなんだぜ？"
pageinfo = u"日本語PDFのサンプルなんだぜ？"

def myFirstPage(canvas, doc):
    canvas.saveState()
    canvas.setFont("HeiseiKakuGo-W5",18)
    canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-70, Title)
    canvas.setFont("HeiseiKakuGo-W5",9)
    canvas.drawString(inch, 0.75*inch, u'これは "%s" の表紙なんだぜ？' % pageinfo)
    canvas.restoreState()

def myLaterPages(canvas, doc):
    canvas.saveState()
    canvas.setFont("HeiseiKakuGo-W5", 9)
    canvas.drawString(inch, 0.75*inch, u'これは "%s" の %d ページなんだぜ？' % (pageinfo, doc.page))
    canvas.restoreState()

def go():
    doc = SimpleDocTemplate("reportlab_japanese.pdf")
    Story = [Spacer(1, 0.2*inch)]
    style = my_style
    for i in range(5):
        bogustext = (u"「覚悟」とは！！ 暗闇の荒野に！！進むべき道を切り開く事だッ！ (段落番号は %s) " % (i + 1)) * 50
        p = Paragraph(bogustext, style)
        Story.append(p)
        Story.append(Spacer(1, 0.2*inch))
    doc.build(Story, onFirstPage=myFirstPage, onLaterPages=myLaterPages)

go()
"""
