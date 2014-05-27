from flask import Flask, request, send_from_directory
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'ok'  # TODO: show index

@app.route('/collecting/<path:filename>')
def send_foo(filename):
    return send_from_directory('../collecting', filename)

@app.route('/api/save/<filename>', methods=['POST', 'GET'])
def save(filename):
    file(filename, 'w').write(request.form['data'])
    return 'ok'

if __name__ == '__main__':
    app.run(debug=True)
