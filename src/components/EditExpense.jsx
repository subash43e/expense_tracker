
import React from 'react';

const EditExpense = ({ expense, onClose, onSave }) => {
  const [description, setDescription] = React.useState(expense.description);
  const [amount, setAmount] = React.useState(expense.amount);
  const [category, setCategory] = React.useState(expense.category);

  const handleSave = () => {
    onSave(expense._id, { description, amount, category });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
        <div className="flex flex-col gap-4">
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
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="p-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;
