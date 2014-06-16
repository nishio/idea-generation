import os
from flask import Flask, request, send_from_directory
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'ok'  # TODO: show index

@app.route('/collecting/<path:filename>')
def send_collecting(filename):
    return send_from_directory('../collecting', filename)

@app.route('/common/<path:filename>')
def send_common(filename):
    return send_from_directory('../common', filename)

@app.route('/api/save', methods=['POST'])
def save():
    filename = os.path.join('data', request.form['filename'])
    file(filename, 'w').write(request.form['data'])
    return 'ok'

@app.route('/api/load', methods=['POST'])
def load():
    filename = os.path.join('data', request.form['filename'])
    return file(filename).read()

if __name__ == '__main__':
    app.run(debug=True)
