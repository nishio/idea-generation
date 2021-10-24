from_pdf

PDF からのテキスト化、画像化、動画化、など色々実験したが、それぞれのツールがちらばっていることが不便なので「PDF から何かをする」という観点で一本化していきたい。

from_pdf.py
`in/foo.pdf`から`out/foo/page-01.png`と`out/foo/line_per_page.txt`ができる

to_scrapbox.py
`--target out/foo/`すると`out/foo/scrapbox.txt`できる

2021-10-24
Python3 用にした
