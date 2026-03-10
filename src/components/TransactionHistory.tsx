import type { Transaction } from '../lib/types';
import { Calendar } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
} 

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        Complete Transaction History
      </h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-start p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800 mb-1">{transaction.description}</p>
              <p className="text-sm text-gray-600">{formatDate(transaction.transaction_date)}</p>
            </div>
            <div className="text-right">
              <span
                className={`font-bold text-xl ${
                  transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
