from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

expenses = []

@app.route("/expense", methods=["POST"])
def add_expense():
    data = request.json
    expenses.append(data)
    return jsonify({"message": "Expense added!", "data": data}), 201

@app.route("/expenses", methods=["GET"])
def get_expenses():
    return jsonify(expenses)

# DELETE an expense by index
@app.route("/expense/<int:index>", methods=["DELETE"])
def delete_expense(index):
    if 0 <= index < len(expenses):
        removed = expenses.pop(index)
        return jsonify({"success": True, "deleted": removed}), 200
    else:
        return jsonify({"success": False, "error": "Invalid index"}), 404


# UPDATE an expense by index
@app.route("/expense/<int:index>", methods=["PUT"])
def update_expense(index):
    if 0 <= index < len(expenses):
        data = request.json
        expenses[index] = {
            "amount": data.get("amount", expenses[index]["amount"]),
            "category": data.get("category", expenses[index]["category"]),
            "note": data.get("note", expenses[index]["note"]),
        }
        return jsonify(expenses[index]), 200
    else:
        return jsonify({"error": "Invalid index"}), 404

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Trackwise API is running 🚀"})


if __name__ == "__main__":
    app.run(debug=True)
