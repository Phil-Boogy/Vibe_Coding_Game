from flask import Flask, request, jsonify
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials

app = Flask(__name__)

# Google Sheets setup (you'll add credentials later)
# For now, we'll use mock data

def get_monthly_budget(category, month):
    """
    Query Budgets tab for the category's budget this month
    Returns None if no budget set
    """
    # TODO: Real implementation with gspread
    # Mock data for now
    budgets = {
        'Eating out': 800,
        'Groceries': 1200,
        'Transportation': 300,
    }
    return budgets.get(category)

def get_monthly_spending(category, month):
    """
    Sum all expenses for this category this month
    """
    # TODO: Real implementation with gspread
    # Mock data for now
    spending = {
        'Eating out': 300,
        'Groceries': 450,
        'Other': 187
    }
    return spending.get(category, 0)

@app.route('/')
def home():
    return "Expense tracker is running!"

@app.route('/submit-expense', methods=['POST'])
def submit_expense():
    data = request.get_json()
    
    description = data.get('description')
    category = data.get('category')
    amount = float(data.get('amount'))
    
    timestamp = datetime.now()
    month = timestamp.strftime('%Y-%m')
    
    # TODO: Write to Google Sheets "Expenses" tab
    
    # Get budget info
    budget = get_monthly_budget(category, month)
    current_spending = get_monthly_spending(category, month)
    new_total = current_spending + amount
    
    # Build response message
    if budget is not None:
        remaining = budget - new_total
        message = f"✓ Logged ₪{amount} for {category}. ₪{remaining} remaining this month (₪{new_total}/₪{budget})"
    else:
        message = f"✓ Logged ₪{amount} for {category}. ₪{new_total} spent this month"
    
    expense = {
        'timestamp': timestamp.isoformat(),
        'description': description,
        'category': category,
        'amount': amount,
        'message': message
    }
    
    return jsonify({
        'status': 'success',
        'expense': expense,
        'message': message
    })

if __name__ == '__main__':
    app.run(debug=True)