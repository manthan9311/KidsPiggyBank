export interface Database {
  public: { 
    Tables: {
      kids: {
        Row: {
          id: string;
          name: string;
          current_balance: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          current_balance?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          current_balance?: number;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          kid_id: string;
          amount: number;
          description: string;
          transaction_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          kid_id: string;
          amount: number;
          description: string;
          transaction_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          kid_id?: string;
          amount?: number;
          description?: string;
          transaction_date?: string;
          created_at?: string;
        };
      };
      recurring_transactions: {
        Row: {
          id: string;
          kid_id: string;
          amount: number;
          description: string;
          frequency: 'weekly' | 'monthly' | 'yearly';
          day_of_week: number | null;
          day_of_month: number | null;
          month: number | null;
          day_of_year: number | null;
          last_executed: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          kid_id: string;
          amount: number;
          description: string;
          frequency: 'weekly' | 'monthly' | 'yearly';
          day_of_week?: number | null;
          day_of_month?: number | null;
          month?: number | null;
          day_of_year?: number | null;
          last_executed?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          kid_id?: string;
          amount?: number;
          description?: string;
          frequency?: 'weekly' | 'monthly' | 'yearly';
          day_of_week?: number | null;
          day_of_month?: number | null;
          month?: number | null;
          day_of_year?: number | null;
          last_executed?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          kid_id: string;
          title: string;
          target_amount: number;
          is_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          kid_id: string;
          title: string;
          target_amount: number;
          is_completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          kid_id?: string;
          title?: string;
          target_amount?: number;
          is_completed?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type Kid = Database['public']['Tables']['kids']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type RecurringTransaction = Database['public']['Tables']['recurring_transactions']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
