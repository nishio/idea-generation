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
    file(request.form['filename'], 'w').write(request.form['data'])
    return 'ok'

if __name__ == '__main__':
    app.run(debug=True)
