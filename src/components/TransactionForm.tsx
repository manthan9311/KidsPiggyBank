import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { getTheme } from '../lib/themes';

interface TransactionFormProps {
  onSubmit: (amount: number, description: string) => void;
  themeColor?: string;
}
  
export default function TransactionForm({ onSubmit, themeColor }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && description.trim()) {
      const finalAmount = transactionType === 'credit' ? numAmount : -numAmount;
      onSubmit(finalAmount, description.trim());
      setAmount('');
      setDescription('');
    }
  };

  const theme = getTheme(themeColor);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTransactionType('credit')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
            transactionType === 'credit'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Plus className="w-5 h-5" />
          Add Money
        </button>
        <button
          type="button"
          onClick={() => setTransactionType('debit')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
            transactionType === 'debit'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Minus className="w-5 h-5" />
          Subtract Money
        </button>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none ${theme.border.replace('border-', 'focus:border-')}`}
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none ${theme.border.replace('border-', 'focus:border-')}`}
          placeholder="What is this for?"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
          transactionType === 'credit'
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {transactionType === 'credit' ? 'Add' : 'Subtract'} ${amount || '0.00'}
      </button>
    </form>
  );
}
