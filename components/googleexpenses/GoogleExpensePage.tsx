'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  GoogleExpensesSkeleton,
  GoogleExpensesHeader,
  GoogleExpensesStats,
  GoogleExpensesFilters,
  GoogleExpensesTable,
  GoogleExpensesPagination,
  GoogleExpensesEmpty,
  GoogleExpensesModal,
  Expense,
  Summary,
  FormData,
} from '@/components/googleexpenses';

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
  const [formData, setFormData] = useState<FormData>({
    title: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
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

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        setFormData({ 
          title: '', 
          amount: '', 
          category: 'food', 
          date: new Date().toISOString().split('T')[0], 
          description: '' 
        });
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
        alert('Failed to delete expense');
      }
    } catch (err) {
      console.error('DELETE error:', err);
      alert('Error deleting expense');
    }
  };

  const handleEdit = (expense: Expense) => {
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

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ 
      title: '', 
      amount: '', 
      category: 'food', 
      date: new Date().toISOString().split('T')[0], 
      description: '' 
    });
    setIsModalOpen(true);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  if (loading && expenses.length === 0) {
    return <GoogleExpensesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <GoogleExpensesHeader 
          onAddClick={handleAddClick} 
        />

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchExpenses}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <GoogleExpensesStats summary={summary} />

            <GoogleExpensesFilters 
              selectedCategory={category}
              onCategoryChange={handleCategoryChange}
            />

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {expenses.length > 0 ? (
                <>
                  <GoogleExpensesTable 
                    expenses={expenses}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                  <GoogleExpensesPagination 
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : (
                <GoogleExpensesEmpty onAddClick={handleAddClick} />
              )}
            </div>
          </>
        )}
      </div>

      <GoogleExpensesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onFormChange={handleFormChange}
        editingId={editingId}
      />
    </div>
  );
}