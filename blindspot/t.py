import re
import os
import subprocess

if 0:
    f = file("original_cards.html")
    TITLE = re.compile("<h1>(\d+): (.*)</h1>")

    fo = file("preface.html", "w")
    for line in f:
        if line.startswith("<hr>"): continue
        if line.startswith("<img"): continue

        m = re.match(TITLE, line)
        if m:
            id = m.groups()[0]
            title = m.groups()[1]
            fo = file("%s.html" % id, "w")
            fo.write("%s\n" % title)
        else:
            fo.write("%s\n" % line.strip())


FN = re.compile("(\d+)\.html$")
fo = file("cards.html", "w")
fo.write(file("preface.html").read())

ids = []
for name in os.listdir("."):
    m = FN.match(name)
    if m:
        ids.append(int(m.groups()[0]))

ids.sort()
for i in ids:
    print i
    f = file("%d.html" % i)
    title = f.readline().strip()
    body = f.read()
    fo.write("<h1 id='%s'>%s: %s</h1>\n" % (i, i, title))
    if os.path.isfile("%d.png" % i):
        fo.write("<img src='%d.png'><p>\n" % i)
    body = re.sub(r"(\[(\d+)\])", r"<a href='#\2'>\1</a>", body)
    fo.write(body)

fo.write(file("history.html").read())
fo.close()

subprocess.check_call("cp cards.html /media/sf_win_home/blindspot", shell=True)
