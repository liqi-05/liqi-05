import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, Edit3, Trash2, Target, Calendar } from 'lucide-react';

const PersonalFinanceDashboard = () => {
  // Sample data
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Grocery Shopping', amount: -85.50, category: 'Food & Dining', date: '2024-09-15', type: 'expense' },
    { id: 2, description: 'Salary', amount: 3200.00, category: 'Income', date: '2024-09-01', type: 'income' },
    { id: 3, description: 'Electric Bill', amount: -120.00, category: 'Utilities', date: '2024-09-10', type: 'expense' },
    { id: 4, description: 'Coffee Shop', amount: -15.75, category: 'Food & Dining', date: '2024-09-14', type: 'expense' },
    { id: 5, description: 'Gas Station', amount: -45.20, category: 'Transportation', date: '2024-09-12', type: 'expense' },
    { id: 6, description: 'Freelance Work', amount: 500.00, category: 'Income', date: '2024-09-08', type: 'income' },
    { id: 7, description: 'Movie Theater', amount: -25.00, category: 'Entertainment', date: '2024-09-07', type: 'expense' },
    { id: 8, description: 'Internet Bill', amount: -60.00, category: 'Utilities', date: '2024-09-05', type: 'expense' },
  ]);

  const [budgets, setBudgets] = useState([
    { category: 'Food & Dining', limit: 300, spent: 101.25, color: '#8884d8' },
    { category: 'Transportation', limit: 200, spent: 45.20, color: '#82ca9d' },
    { category: 'Utilities', limit: 250, spent: 180.00, color: '#ffc658' },
    { category: 'Entertainment', limit: 150, spent: 25.00, color: '#ff7c7c' },
  ]);

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense'
  });

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const netBalance = totalIncome - totalExpenses;

  // Prepare chart data
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: budgets.find(b => b.category === category)?.color || '#8884d8'
  }));

  // Monthly spending trend (mock data)
  const spendingTrend = [
    { month: 'Jun', amount: 1200 },
    { month: 'Jul', amount: 1350 },
    { month: 'Aug', amount: 1180 },
    { month: 'Sep', amount: totalExpenses }
  ];

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    
    const amount = newTransaction.type === 'expense' ? -Math.abs(parseFloat(newTransaction.amount)) : parseFloat(newTransaction.amount);
    const transaction = {
      id: Date.now(),
      description: newTransaction.description,
      amount: amount,
      category: newTransaction.category,
      date: new Date().toISOString().split('T')[0],
      type: newTransaction.type
    };
    
    setTransactions([transaction, ...transactions]);
    setNewTransaction({ description: '', amount: '', category: 'Food & Dining', type: 'expense' });
    setShowAddTransaction(false);
  };

  const StatCard = ({ title, amount, icon: Icon, trend, color = 'text-gray-700' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-2`}>
            RM{Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color === 'text-green-600' ? 'bg-green-50' : color === 'text-red-600' ? 'bg-red-50' : 'bg-blue-50'}`}>
          <Icon className={`w-6 h-6 ${color === 'text-green-600' ? 'text-green-600' : color === 'text-red-600' ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          {trend > 0 ? <TrendingUp className="w-4 h-4 text-green-500 mr-1" /> : <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}
    </div>
  );

  const BudgetCard = ({ budget }) => {
    const percentage = (budget.spent / budget.limit) * 100;
    const isOverBudget = percentage > 100;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">{budget.category}</h3>
          {isOverBudget && <AlertCircle className="w-5 h-5 text-red-500" />}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Spent: RM{budget.spent.toFixed(2)}</span>
            <span className="text-gray-600">Limit: RM{budget.limit.toFixed(2)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {percentage.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500">
              RM{(budget.limit - budget.spent).toFixed(2)} remaining
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Finance Dashboard</h1>
          <p className="text-gray-600">Track your expenses, monitor budgets, and visualize your financial health</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Income" 
            amount={totalIncome} 
            icon={TrendingUp} 
            trend={5.2}
            color="text-green-600"
          />
          <StatCard 
            title="Total Expenses" 
            amount={totalExpenses} 
            icon={TrendingDown} 
            trend={-2.1}
            color="text-red-600"
          />
          <StatCard 
            title="Net Balance" 
            amount={netBalance} 
            icon={DollarSign} 
            color={netBalance >= 0 ? "text-green-600" : "text-red-600"}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense Categories Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`RM${value.toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Spending Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Spending Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`RM${value}`, 'Spent']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Budget Overview</h2>
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgets.map((budget, index) => (
              <BudgetCard key={index} budget={budget} />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
            <button 
              onClick={() => setShowAddTransaction(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>

          {/* Add Transaction Modal */}
          {showAddTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter description..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Income">Income</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleAddTransaction}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Transaction
                    </button>
                    <button
                      onClick={() => setShowAddTransaction(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.slice(0, 6).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {transaction.type === 'income' ? 
                      <TrendingUp className="w-4 h-4 text-green-600" /> : 
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : ''}RM{Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalFinanceDashboard;
