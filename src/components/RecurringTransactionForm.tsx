import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
 
interface RecurringTransactionFormProps {
  onSubmit: (
    amount: number,
    description: string,
    frequency: 'weekly' | 'monthly' | 'yearly',
    dayOfWeek?: number,
    dayOfMonth?: number,
    month?: number,
    dayOfYear?: number
  ) => void;
}

export default function RecurringTransactionForm({ onSubmit }: RecurringTransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [dayOfWeek, setDayOfWeek] = useState('5');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [month, setMonth] = useState('1');
  const [dayOfYear, setDayOfYear] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && description.trim()) {
      const finalAmount = transactionType === 'credit' ? numAmount : -numAmount;

      let dow: number | undefined;
      let dom: number | undefined;
      let m: number | undefined;
      let doy: number | undefined;

      if (frequency === 'weekly') {
        dow = parseInt(dayOfWeek);
      } else if (frequency === 'monthly') {
        dom = parseInt(dayOfMonth);
      } else if (frequency === 'yearly') {
        m = parseInt(month);
        doy = parseInt(dayOfYear);
      }

      onSubmit(finalAmount, description.trim(), frequency, dow, dom, m, doy);
      setAmount('');
      setDescription('');
    }
  };

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
          Income
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
          Expense
        </button>
      </div>

      <div>
        <label htmlFor="rec-amount" className="block text-sm font-semibold text-gray-700 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-600 font-semibold">$</span>
          <input
            type="number"
            id="rec-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="rec-description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <input
          type="text"
          id="rec-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          placeholder="e.g., Weekly allowance, Monthly subscription"
          required
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block text-sm font-semibold text-gray-700 mb-2">
          Frequency
        </label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as 'weekly' | 'monthly' | 'yearly')}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {frequency === 'weekly' && (
        <div>
          <label htmlFor="day-of-week" className="block text-sm font-semibold text-gray-700 mb-2">
            Day of Week
          </label>
          <select
            id="day-of-week"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
          </select>
        </div>
      )}

      {frequency === 'monthly' && (
        <div>
          <label htmlFor="day-of-month" className="block text-sm font-semibold text-gray-700 mb-2">
            Day of Month
          </label>
          <select
            id="day-of-month"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      )}

      {frequency === 'yearly' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-semibold text-gray-700 mb-2">
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="day-of-year" className="block text-sm font-semibold text-gray-700 mb-2">
              Day
            </label>
            <select
              id="day-of-year"
              value={dayOfYear}
              onChange={(e) => setDayOfYear(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 px-4 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
      >
        Set Up Recurring Transaction
      </button>
    </form>
  );
}
