from flask import Flask, request, jsonify
from flask_cors import CORS
from logic import allocate_resource

app = Flask(__name__)
CORS(app)

@app.route("/deploy", methods=["POST"])
def deploy():
    data = request.get_json()

    location = data.get("location")
    emergency = data.get("emergency")

    result = allocate_resource(location, emergency)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)