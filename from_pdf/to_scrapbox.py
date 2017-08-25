# -*- coding: utf-8 -*-
"""
- upload pngs to Gyazo
- make scrapbox.txt for Scrapbox
"""

import requests
import os
import argparse

parser = argparse.ArgumentParser(description='Convert PDF to movie.')
parser.add_argument('--target', action='store')

args = parser.parse_args()


def upload_to_gyazo(filepath):
    url = 'https://upload.gyazo.com/upload.cgi'
    files = {'imagedata': (filepath, file(filepath).read())}
    r = requests.post(url, files=files)
    return r.text


def to_scrapbox(target):
    textfile = file(os.path.join(target, "line_per_page.txt"))
    outfile = file(os.path.join(target, "scrapbox.txt"), "w")

    page = 1
    for filename in sorted(os.listdir(target)):
        if not filename.startswith("page"): continue
        print(filename)

        filepath = os.path.join(target, filename)
        url = upload_to_gyazo(filepath)
        outfile.write("[{}]\n".format(url))
        text = textfile.readline()
        outfile.write("{}\n".format(text))
        page += 1


if __name__ == "__main__":
    if not args.target:
        print("Usage example: --target out/some_book")
    else:
        to_scrapbox(args.target)
