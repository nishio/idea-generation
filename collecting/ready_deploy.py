import os
dir = os.path.abspath(os.path.dirname(__file__))
data = file(os.path.join(dir, 'index.html')).read()
data = data.replace('<html>', '<html manifest="manifest.webapp">')
print data
