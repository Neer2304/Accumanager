'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  Filter, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Expense {
  id: string;
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface Summary {
  totalAmount: number;
  totalExpenses: number;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories', color: 'bg-slate-500' },
  { value: 'food', label: 'Food', color: 'bg-orange-500' },
  { value: 'transport', label: 'Transport', color: 'bg-blue-500' },
  { value: 'shopping', label: 'Shopping', color: 'bg-purple-500' },
  { value: 'entertainment', label: 'Entertainment', color: 'bg-pink-500' },
  { value: 'bills', label: 'Bills', color: 'bg-red-500' },
  { value: 'other', label: 'Other', color: 'bg-emerald-500' }
];

export default function SimpleExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalAmount: 0, totalExpenses: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/simple-expenses?category=${category}&page=${page}&limit=10`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setExpenses(data.expenses);
        setSummary(data.summary);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(data.error || 'Failed to fetch expenses');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/simple-expenses/${editingId}` : '/api/expenses';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], description: '' });
        fetchExpenses();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      alert('Error submitting form');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      const res = await fetch(`/api/simple-expenses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchExpenses();
      } else {
        console.error('❌ Delete failed:', data);
      }
    } catch (err) {
      console.error('DELETE error:', err);
    }
  };

  const openEdit = (expense: Expense) => {
    setEditingId(expense._id);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Simple Expenses</h1>
            <p className="text-slate-500">Track and manage your daily spending</p>
          </div>
          <button 
            onClick={() => { setEditingId(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={20} /> Add Expense
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Spent</p>
                <h2 className="text-2xl font-black text-slate-900">${summary.totalAmount.toLocaleString()}</h2>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                <PieChartIcon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Transactions</p>
                <h2 className="text-2xl font-black text-slate-900">{summary.totalExpenses}</h2>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Current Month</p>
                <h2 className="text-2xl font-black text-slate-900">
                  {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date())}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                category === cat.value 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <Loader2 className="animate-spin" size={40} />
              <p className="font-medium">Loading your data...</p>
            </div>
          ) : expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Date</th>
                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Expense</th>
                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Category</th>
                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Amount</th>
                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{expense.title}</div>
                        {expense.description && (
                          <div className="text-xs text-slate-400 line-clamp-1">{expense.description}</div>
                        )}
                      </td>
                      <td className="p-4 capitalize">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${
                          CATEGORIES.find(c => c.value === expense.category)?.color || 'bg-slate-400'
                        }`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900">
                        ${expense.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(expense)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 text-slate-600 transition-all">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(expense._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4 text-slate-400">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No expenses found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Try changing your category filter or add a new expense to get started.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-bold text-slate-500">Page {page} of {totalPages}</span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-50 hover:bg-slate-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none"
                    placeholder="e.g. Weekly Groceries"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amount ($)</label>
                  <input 
                    required
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl p-4 text-slate-900 transition-all outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black tracking-wide shadow-lg transition-all active:scale-[0.98] mt-4"
              >
                {editingId ? 'Save Changes' : 'Add Expense'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}