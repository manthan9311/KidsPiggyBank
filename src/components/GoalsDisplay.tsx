import type { Goal } from '../lib/types';
import { Target, CheckCircle, Trash2 } from 'lucide-react';
import { getTheme } from '../lib/themes';
 
interface GoalsDisplayProps {
  goals: Goal[];
  currentBalance: number;
  onComplete: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  themeColor?: string;
}

export default function GoalsDisplay({ goals, currentBalance, onComplete, onDelete, themeColor }: GoalsDisplayProps) {
  const theme = getTheme(themeColor);
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Target className={`w-5 h-5 ${theme.accent}`} />
        Savings Goals
      </h3>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((currentBalance / goal.target_amount) * 100, 100);
          const isComplete = currentBalance >= goal.target_amount;

          return (
            <div
              key={goal.id}
              className={`p-4 bg-gradient-to-r ${theme.bg.replace('from-', 'from-white to-')} rounded-lg border-2 ${theme.border}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{goal.title}</h4>
                  <p className="text-sm text-gray-600">
                    ${currentBalance.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {isComplete && (
                    <button
                      onClick={() => onComplete(goal.id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      title="Mark as complete"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 flex items-center justify-center text-sm font-bold ${
                    isComplete ? 'bg-green-500' : theme.primary
                  } text-white`}
                  style={{ width: `${progress}%` }}
                >
                  {progress >= 20 && <span>{progress.toFixed(0)}%</span>}
                </div>
              </div>

              {isComplete && (
                <p className="text-green-600 font-semibold text-center mt-2">
                  Goal reached! Time to celebrate!
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
