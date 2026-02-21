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

class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.String(50), nullable=False)  # future-ready
    month_key = db.Column(db.String(7), nullable=False)  # YYYY-MM

    income = db.Column(db.Integer, nullable=False)
    savings = db.Column(db.Integer, default=0)

    food = db.Column(db.Integer, nullable=False)
    shopping = db.Column(db.Integer, nullable=False)
    transport = db.Column(db.Integer, nullable=False)
    bills = db.Column(db.Integer, nullable=False)
    others = db.Column(db.Integer, nullable=False)

    inherited_from = db.Column(db.String(7))  # previous month_key
    is_auto_generated = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.String, default=lambda: datetime.now().isoformat())
    updated_at = db.Column(
        db.String,
        default=lambda: datetime.now().isoformat(),
        onupdate=lambda: datetime.now().isoformat()
    )

    __table_args__ = (
        db.UniqueConstraint("user_id", "month_key", name="unique_user_month"),
    )


@app.route("/budget/<month_key>", methods=["GET"])
def get_budget(month_key):

    # TEMP single user
    user_id = "demo"

    budget = Budget.query.filter_by(
        user_id=user_id,
        month_key=month_key
    ).first()

    if not budget:
        return jsonify(None)

    return jsonify({
        "id": budget.id,
        "month_key": budget.month_key,
        "income": budget.income,
        "savings": budget.savings,
        "categories": {
            "Food": budget.food,
            "Shopping": budget.shopping,
            "Transport": budget.transport,
            "Bills": budget.bills,
            "Others": budget.others,
        },
        "inherited_from": budget.inherited_from,
        "is_auto_generated": budget.is_auto_generated
    })
    
@app.route("/budget/<month_key>", methods=["POST"])
def save_budget(month_key):

    user_id = "demo"   # temp single user

    data = request.json

    existing = Budget.query.filter_by(
        user_id=user_id,
        month_key=month_key
    ).first()

    if existing:
        # UPDATE
        existing.income = data["income"]
        existing.savings = data["savings"]

        existing.food = data["categories"]["Food"]
        existing.shopping = data["categories"]["Shopping"]
        existing.transport = data["categories"]["Transport"]
        existing.bills = data["categories"]["Bills"]
        existing.others = data["categories"]["Others"]

    else:
        # CREATE
        existing = Budget(
            user_id=user_id,
            month_key=month_key,
            income=data["income"],
            savings=data["savings"],

            food=data["categories"]["Food"],
            shopping=data["categories"]["Shopping"],
            transport=data["categories"]["Transport"],
            bills=data["categories"]["Bills"],
            others=data["categories"]["Others"],
        )
        db.session.add(existing)

    db.session.commit()

    return jsonify({"success": True})



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)


