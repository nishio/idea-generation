import os
import datetime
dir = os.path.abspath(os.path.dirname(__file__))

data = file(os.path.join(dir, 'index.html')).read()
data = data.replace('<html>', '<html manifest="manifest.webapp">')
file(os.path.join(dir, 'deploy/index.html'), 'w').write(data)


data = file(os.path.join(dir, 'manifest.webapp')).read()
now = datetime.datetime.now().isoformat()
data = data.replace('# version', '# version: ' + now)
file(os.path.join(dir, 'deploy/manifest.webapp'), 'w').write(data)

