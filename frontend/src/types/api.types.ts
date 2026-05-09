// ─── Base ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface GetCurrentUserResponse {
  success: boolean;
  user: User;
}

export interface UpdateProfileResponse {
  success: boolean;
  user: User;
}

// ─── Transaction (shared shape for income & expense) ─────────────────────────

export interface Transaction {
  _id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
  createdAt: string;
  updatedAt: string;
}

export interface TransactionRequest {
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface UpdateTransactionRequest {
  description: string;
  amount: number;
}

// ─── Income ──────────────────────────────────────────────────────────────────

export interface GetAllIncomeResponse {
  success: boolean;
  income: Transaction[];
}

export interface IncomeOverviewData {
  totalIncome: number;
  averageIncome: number;
  numberOfTransactions: number;
  recentTransactions: Transaction[];
  range: string;
}

export interface IncomeOverviewResponse {
  success: boolean;
  message: string;
  data: IncomeOverviewData;
}

export interface UpdateIncomeResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

// ─── Expense ─────────────────────────────────────────────────────────────────

export interface GetAllExpenseResponse {
  success: boolean;
  expenses: Transaction[];
}

export interface ExpenseOverviewData {
  totalExpense: number;
  averageExpense: number;
  numberOfTransactions: number;
  recentTransactions: Transaction[];
  range: string;
}

export interface ExpenseOverviewResponse {
  success: boolean;
  message: string;
  data: ExpenseOverviewData;
}

export interface UpdateExpenseResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface ExpenseDistributionItem {
  category: string;
  amount: number;
  percent: number;
}

export interface DashboardOverviewResponse {
  success: boolean;
  monthlyIncome: number;
  monthlyExpense: number;
  savings: number;
  savingsRate: number;
  recentTransactions: Transaction[];
  spendByCategory: Record<string, number>;
  expenseDistribution: ExpenseDistributionItem[];
}

// ─── Overview range query ─────────────────────────────────────────────────────

export type OverviewRange = "weekly" | "monthly" | "yearly";

// ─── Component Props ──────────────────────────────────────────────────────────

export interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children?: React.ReactNode;
}
