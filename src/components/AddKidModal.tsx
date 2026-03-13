import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { themes } from '../lib/themes';
 
interface AddKidModalProps {
  onAdd: (name: string, startingBalance: number, themeColor: string) => void;
  onClose: () => void;
}

export default function AddKidModal({ onAdd, onClose }: AddKidModalProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [selectedTheme, setSelectedTheme] = useState('pink');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), parseFloat(balance) || 0, selectedTheme);
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
              className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none transition-colors ${themes[selectedTheme].border.replace('border-', 'focus:border-')}`}
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
                className={`w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none transition-colors ${themes[selectedTheme].border.replace('border-', 'focus:border-')}`}
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Theme Color
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`w-10 h-10 rounded-full ${theme.primary} flex items-center justify-center transition-transform hover:scale-110 ${
                    selectedTheme === theme.id ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                  }`}
                  title={theme.name}
                >
                  {selectedTheme === theme.id && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
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
              className={`flex-1 px-4 py-3 text-white rounded-lg font-semibold transition-colors ${themes[selectedTheme].primary} ${themes[selectedTheme].secondary.replace('bg-', 'hover:bg-')}`}
            >
              Add Child
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
