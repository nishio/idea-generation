#!/usr/bin/env python
# -*- encoding: utf-8 -*-
"""
テキストを25upでPDFにする
"""
import os
import json
from reportlab.pdfgen import canvas
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.pagesizes import landscape, A4

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

fontname = "HeiseiKakuGo-W5"
pdfmetrics.registerFont(UnicodeCIDFont(fontname))


style = getSampleStyleSheet()['Normal']
style.fontName = fontname
style.wordWrap = "CJK"
pagesize = landscape(A4)

WIDTH, HEIGHT = pagesize
NUM = 5
PADDING_PAGE = 30  # padding between page boundary and contents
MARGIN_BOX = 20  # margin between boxs

WIDTH_BOX = (WIDTH - 2 * PADDING_PAGE - 4 * MARGIN_BOX) / 5
HEIGHT_BOX = (HEIGHT - 2 * PADDING_PAGE - 4 * MARGIN_BOX) / 5
START_FONT_SIZE = 30

def calc_xy(i, j):
    x = PADDING_PAGE + (WIDTH_BOX + MARGIN_BOX) * i
    y = PADDING_PAGE + (HEIGHT_BOX + MARGIN_BOX) * j
    return x, y


def make_para(text):
    "make Paragraph object which fit in given box"
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
        try:
            if any(rest < 0 for rest, _text in lines):
                style.fontSize -= 1
                style.leading -= 1
                continue
        except:
            print lines
        break
    return para

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

    items = [x['text'] for x in items]
    return items


def make_pdf(items=None):
    if not items: items = get_items()
    c = canvas.Canvas("hello.pdf", pagesize=pagesize)

    c.saveState()

    from math import ceil
    NUM_PAGES = int(ceil(len(items) / 25.0))
    for pages in range(NUM_PAGES):
        for i in range(6):
            for j in range(6):
                x, y = calc_xy(i, j)
                c.setStrokeColorRGB(0.8, 0.8, 0.8)
                c.setLineWidth(MARGIN_BOX / 2)
                c.line(0, y - MARGIN_BOX / 2, WIDTH, y - MARGIN_BOX / 2)
                c.line(x - MARGIN_BOX / 2, 0, x - MARGIN_BOX / 2, HEIGHT)

        for i in range(5):
            for j in range(5):
                card_index = pages * 25 + i * 5 + j
                if card_index >= len(items): continue  # no more cards

                text = items[card_index]

                para = make_para(text)
                x, y = calc_xy(i, j)
                para.drawOn(c, x, y + HEIGHT_BOX - para.height)

        c.showPage()

    c.save()

def main():
    make_pdf()



if __name__ == '__main__':
    main()
