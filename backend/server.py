from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from logic import allocate_resource

app = Flask(__name__)
CORS(app)


# ✅ Health check route (important for testing)
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Backend is running"})


# ✅ Main API route
@app.route("/deploy", methods=["POST"])
def deploy():
    try:
        data = request.get_json()

        # Debug log (will show in Render logs)
        print("Incoming data:", data)

        if not data:
            return jsonify({"error": "No data received"}), 400

        location = data.get("location")
        emergency = data.get("emergency")

        result = allocate_resource(location, emergency)

        # Safety check (prevents {} error)
        if not result:
            return jsonify({
                "id": "NA",
                "type": "No Resource",
                "eta": 0,
                "efficiency": 0,
                "path": []
            })

        return jsonify(result)

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# ✅ Render-compatible run config (MOST IMPORTANT)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)