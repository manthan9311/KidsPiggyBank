import { useState } from 'react';
import { X } from 'lucide-react';
 
interface AddKidModalProps {
  onAdd: (name: string, startingBalance: number) => void;
  onClose: () => void;
}

export default function AddKidModal({ onAdd, onClose }: AddKidModalProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), parseFloat(balance) || 0);
      setName('');
      setBalance('0');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Child</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Child's Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-semibold text-gray-700 mb-2">
              Starting Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
              <input
                type="number"
                id="balance"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Add Child
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
