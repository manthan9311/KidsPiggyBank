import { useState } from 'react';
 
interface GoalFormProps {
  onSubmit: (title: string, targetAmount: number) => void;
}

export default function GoalForm({ onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (title.trim() && !isNaN(amount) && amount > 0) {
      onSubmit(title.trim(), amount);
      setTitle('');
      setTargetAmount('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="goal-title" className="block text-sm font-semibold text-gray-700 mb-2">
          Goal Title
        </label>
        <input
          type="text"
          id="goal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          placeholder="e.g., New Lego Set, Nintendo Switch"
          required
        />
      </div>

      <div>
        <label htmlFor="target-amount" className="block text-sm font-semibold text-gray-700 mb-2">
          Target Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
          <input
            type="number"
            id="target-amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
      >
        Add Goal
      </button>
    </form>
  );
}
