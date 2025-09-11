from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    note = db.Column(db.String(200))
    date = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "category": self.category,
            "note": self.note,
            "date": self.date
        }

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Trackwise API is running 🚀"})

# ✅ Get all expenses
@app.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses])

# ✅ Add new expense
@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json
    new_expense = Expense(
        amount=data.get("amount"),
        category=data.get("category"),
        note=data.get("note", ""),
        date=data.get("date", datetime.now().strftime("%Y-%m-%d"))
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"message": "Expense added!", "data": new_expense.to_dict()}), 201

# ✅ Update expense by id
@app.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    data = request.json
    expense.amount = data.get("amount", expense.amount)
    expense.category = data.get("category", expense.category)
    expense.note = data.get("note", expense.note)
    expense.date = data.get("date", expense.date)
    db.session.commit()
    return jsonify(expense.to_dict()), 200

# ✅ Delete expense by id
@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    expense = Expense.query.get(id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({"success": True, "message": "Expense deleted"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
