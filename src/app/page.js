'use client'
import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import EditExpense from '@/components/EditExpense';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await fetch('/api/expenses');
      const { data } = await res.json();
      setExpenses(data);
    };
    fetchExpenses();
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, amount, category }),
    });
    const { data } = await res.json();
    setExpenses([...expenses, data]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const deleteExpense = async (id) => {
    await fetch(`/api/expenses/${id}`,
      { method: 'DELETE' });
    setExpenses(expenses.filter((expense) => expense._id !== id));
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setEditingExpense(null);
    setIsEditing(false);
  };

  const saveExpense = async (id, updatedExpense) => {
    const res = await fetch(`/api/expenses/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpense),
      });
    const { data } = await res.json();
    setExpenses(expenses.map((expense) => (expense._id === id ? data : expense)));
    closeEditModal();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Expense</h2>
        <form onSubmit={addExpense} className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Add
          </button>
        </form>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Expenses</h2>
        <ul className="space-y-4">
          {expenses.map((expense) => (
            <li key={expense._id} className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-bold text-lg text-gray-800">{expense.description}</span>
                <p className="text-gray-600">${expense.amount}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-gray-600">{expense.category}</div>
                <button onClick={() => openEditModal(expense)} className="text-blue-500 hover:text-blue-700">
                  <FiEdit />
                </button>
                <button onClick={() => deleteExpense(expense._id)} className="text-red-500 hover:text-red-700">
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {isEditing && (
        <EditExpense
          expense={editingExpense}
          onClose={closeEditModal}
          onSave={saveExpense}
        />
      )}
    </div>
  );
}
