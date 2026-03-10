import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import type { Kid, Transaction, RecurringTransaction, Goal } from './lib/types';
import { PiggyBank, Plus, TrendingUp, Target, Calendar, Clock, Trash2 } from 'lucide-react';
import KidSelector from './components/KidSelector';
import AddKidModal from './components/AddKidModal';
import TransactionForm from './components/TransactionForm';
import RecurringTransactionForm from './components/RecurringTransactionForm';
import GoalForm from './components/GoalForm';
import TransactionHistory from './components/TransactionHistory';
import GoalsDisplay from './components/GoalsDisplay';

function App() {
  const [kidsList, setKidsList] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddKid, setShowAddKid] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'recurring' | 'goals'>('dashboard');

  useEffect(() => {
    loadKids();
  }, []);

  useEffect(() => {
    if (selectedKid) {
      loadTransactions(selectedKid.id);
      loadRecurringTransactions(selectedKid.id, selectedKid.current_balance);
      loadGoals(selectedKid.id);
    }
  }, [selectedKid?.id]);

  const loadKids = async () => {
    const { data, error } = await supabase
      .from('kids')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading kids:', error);
      return;
    }

    setKidsList(data || []);
    if (data && data.length > 0 && !selectedKid) {
      setSelectedKid(data[0]);
    }
  };

  const loadTransactions = async (kidId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('kid_id', kidId)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error loading transactions:', error);
      return;
    }

    setTransactions(data || []);
  };

  const loadRecurringTransactions = async (kidId: string, currentBalance: number) => {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('kid_id', kidId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading recurring transactions:', error);
      return;
    }

    const transactions = data || [];
    setRecurringTransactions(transactions);

    // Process any due recurring transactions immediately after loading
    await processRecurringTransactions(kidId, transactions, currentBalance);
  };

  const processRecurringTransactions = async (kidId: string, rTransactions: RecurringTransaction[], currentBalance: number) => {
    let balanceUpdated = false;
    let newBalance = currentBalance;
    const now = new Date();

    for (const rt of rTransactions) {
      if (!rt.is_active) continue;

      // Start calculating from either last_executed or created_at
      const startDateStr = rt.last_executed || rt.created_at;
      const startDate = new Date(startDateStr);
      // Let's reset times to midnight for accurate date comparison
      startDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // If scheduled in the future, skip
      if (startDate >= today) continue;

      let nextRun = new Date(startDate);
      let executedCount = 0;

      // Calculate how many times it should have executed until 'today'
      while (true) {
        if (rt.frequency === 'weekly') {
          nextRun.setDate(nextRun.getDate() + 1);
          if (nextRun > today) break;
          // Only execute if it matches the specified day_of_week
          if (nextRun.getDay() === rt.day_of_week) {
            executedCount++;
          }
        } else if (rt.frequency === 'monthly') {
          nextRun.setDate(nextRun.getDate() + 1);
          if (nextRun > today) break;
          if (nextRun.getDate() === rt.day_of_month) {
            executedCount++;
          }
        } else if (rt.frequency === 'yearly') {
          nextRun.setDate(nextRun.getDate() + 1);
          if (nextRun > today) break;
          if (nextRun.getMonth() + 1 === rt.month && nextRun.getDate() === rt.day_of_year) {
            executedCount++;
          }
        } else {
          break;
        }
      }

      if (executedCount > 0) {
        // Create transactions and update balance for missed periods
        const totalAmount = rt.amount * executedCount;

        // @ts-ignore - Supabase type inference issue with generic Database
        const { error: transError } = await supabase
          .from('transactions')
          .insert({
            kid_id: kidId,
            amount: totalAmount, // Grouped sum to simplify, or could be individual entries
            description: `${rt.description} (Processed ${executedCount} time${executedCount > 1 ? 's' : ''})`,
          });

        if (transError) {
          console.error('Error adding transaction for recurring:', transError);
          continue; // Skip updating this recurring if transaction failed
        }

        // @ts-ignore - Supabase type inference issue with generic Database
        const { error: rtUpdateError } = await supabase
          .from('recurring_transactions')
          .update({ last_executed: now.toISOString() })
          .eq('id', rt.id);

        if (rtUpdateError) {
          console.error('Error updating recurring transaction execution time:', rtUpdateError);
        } else {
          newBalance += totalAmount;
          balanceUpdated = true;

          // Update local state to reflect the execution date update
          rt.last_executed = now.toISOString();
        }
      }
    }

    if (balanceUpdated) {
      // @ts-ignore - Supabase type inference issue with generic Database
      const { error: balanceError } = await supabase
        .from('kids')
        .update({ current_balance: newBalance })
        .eq('id', kidId);

      if (!balanceError) {
        setSelectedKid(prevKid => prevKid ? { ...prevKid, current_balance: newBalance } : null);
        // Reload transactions to show the new ones generated
        await loadTransactions(kidId);
        await loadKids();
      }
    }
  };

  const loadGoals = async (kidId: string) => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('kid_id', kidId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading goals:', error);
      return;
    }

    setGoals(data || []);
  };

  const addKid = async (name: string, startingBalance: number) => {
    // @ts-ignore
    const { data, error } = await supabase
      .from('kids')
      .insert({ name, current_balance: startingBalance })
      .select()
      .single();

    if (error) {
      console.error('Error adding kid:', error);
      return;
    }

    await loadKids();
    setSelectedKid(data);
    setShowAddKid(false);
  };

  const addTransaction = async (amount: number, description: string) => {
    if (!selectedKid) return;

    const { error: transError } = await supabase
      .from('transactions')
      .insert({
        kid_id: selectedKid.id,
        amount,
        description,
      });

    if (transError) {
      console.error('Error adding transaction:', transError);
      return;
    }

    const newBalance = selectedKid.current_balance + amount;
    const { error: updateError } = await supabase
      .from('kids')
      .update({ current_balance: newBalance })
      .eq('id', selectedKid.id);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return;
    }

    setSelectedKid({ ...selectedKid, current_balance: newBalance });
    await loadTransactions(selectedKid.id);
  };

  const addRecurringTransaction = async (
    amount: number,
    description: string,
    frequency: 'weekly' | 'monthly' | 'yearly',
    dayOfWeek?: number,
    dayOfMonth?: number,
    month?: number,
    dayOfYear?: number
  ) => {
    if (!selectedKid) return;

    // We optionally subtract a day on created_at or explicitly set last_executed to null 
    // so it processes properly tomorrow, but if we want it to apply IMMEDIATELY if created on the same day it's due,
    // setting last_executed to null handles the "has it executed" check.
    // @ts-ignore
    // @ts-ignore
    const { error } = await supabase
      .from('recurring_transactions')
      .insert({
        kid_id: selectedKid.id,
        amount,
        description,
        frequency,
        day_of_week: dayOfWeek ?? null,
        day_of_month: dayOfMonth ?? null,
        month: month ?? null,
        day_of_year: dayOfYear ?? null,
        last_executed: null // Explicitly null initially
      });

    if (error) {
      console.error('Error adding recurring transaction:', error);
      return;
    }

    await loadRecurringTransactions(selectedKid.id, selectedKid.current_balance);
  };

  const deleteRecurringTransaction = async (id: string) => {
    const { error } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recurring transaction:', error);
      return;
    }

    if (selectedKid) {
      await loadRecurringTransactions(selectedKid.id, selectedKid.current_balance);
    }
  };

  const addGoal = async (title: string, targetAmount: number) => {
    if (!selectedKid) return;

    const { error } = await supabase
      .from('goals')
      .insert({
        kid_id: selectedKid.id,
        title,
        target_amount: targetAmount,
      });

    if (error) {
      console.error('Error adding goal:', error);
      return;
    }

    await loadGoals(selectedKid.id);
  };

  const completeGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('goals')
      .update({ is_completed: true })
      .eq('id', goalId);

    if (error) {
      console.error('Error completing goal:', error);
      return;
    }

    if (selectedKid) {
      await loadGoals(selectedKid.id);
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting goal:', error);
      return;
    }

    if (selectedKid) {
      await loadGoals(selectedKid.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PiggyBank className="w-12 h-12 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-800">Pocket Money Tracker</h1>
          </div>
          <p className="text-gray-600">Virtual piggy banks for kids</p>
        </header>

        <KidSelector
          kidsList={kidsList}
          selectedKid={selectedKid}
          onSelectKid={setSelectedKid}
          onAddKid={() => setShowAddKid(true)}
        />

        {showAddKid && (
          <AddKidModal
            onAdd={addKid}
            onClose={() => setShowAddKid(false)}
          />
        )}

        {selectedKid && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-pink-200">
              <div className="text-center">
                <PiggyBank className="w-20 h-20 mx-auto mb-4 text-pink-500" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedKid.name}'s Balance</h2>
                <div className="text-6xl font-bold text-pink-600 mb-4">
                  ${selectedKid.current_balance.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100">
              <div className="flex border-b-2 border-gray-100">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'dashboard'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'transactions'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('recurring')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'recurring'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Recurring
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${activeTab === 'goals'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Goals
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-green-600" />
                          Quick Add/Subtract
                        </h3>
                        <TransactionForm onSubmit={addTransaction} />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Recent Activity
                        </h3>
                        <div className="space-y-2">
                          {transactions.slice(0, 5).map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800">{transaction.description}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(transaction.transaction_date).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}
                              >
                                {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                          {transactions.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No transactions yet</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {goals.length > 0 && (
                      <GoalsDisplay
                        goals={goals}
                        currentBalance={selectedKid.current_balance}
                        onComplete={completeGoal}
                        onDelete={deleteGoal}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <TransactionHistory transactions={transactions} />
                )}

                {activeTab === 'recurring' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Set Up Recurring Transaction
                      </h3>
                      <RecurringTransactionForm onSubmit={addRecurringTransaction} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Active Recurring Transactions
                      </h3>
                      <div className="space-y-3">
                        {recurringTransactions
                          .filter((rt) => rt.is_active)
                          .map((rt) => (
                            <div
                              key={rt.id}
                              className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200"
                            >
                              <div>
                                <p className="font-semibold text-gray-800">{rt.description}</p>
                                <p className="text-sm text-gray-600">
                                  {rt.frequency === 'weekly' && `Every ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][rt.day_of_week || 0]}`}
                                  {rt.frequency === 'monthly' && `${rt.day_of_month}${getOrdinalSuffix(rt.day_of_month || 1)} of every month`}
                                  {rt.frequency === 'yearly' && `${getMonthName(rt.month || 1)} ${rt.day_of_year}${getOrdinalSuffix(rt.day_of_year || 1)} every year`}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`font-bold text-lg ${rt.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                  {rt.amount >= 0 ? '+' : ''}${rt.amount.toFixed(2)}
                                </span>
                                <button
                                  onClick={() => deleteRecurringTransaction(rt.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        {recurringTransactions.filter((rt) => rt.is_active).length === 0 && (
                          <p className="text-gray-500 text-center py-8">No recurring transactions set up yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'goals' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Add New Goal
                      </h3>
                      <GoalForm onSubmit={addGoal} />
                    </div>

                    {goals.length > 0 && (
                      <GoalsDisplay
                        goals={goals}
                        currentBalance={selectedKid.current_balance}
                        onComplete={completeGoal}
                        onDelete={deleteGoal}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {kidsList.length === 0 && !showAddKid && (
          <div className="text-center py-16">
            <PiggyBank className="w-24 h-24 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No Kids Added Yet</h2>
            <p className="text-gray-500 mb-6">Add your first child to start tracking their pocket money</p>
            <button
              onClick={() => setShowAddKid(true)}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
            >
              Add First Child
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

function getMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1] || '';
}

export default App;
