import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PageSpinner from "../components/shared/PageSpinner";
import DashStatCard from "../components/dashboard/DashStatCard";
import CategoryList from "../components/dashboard/CategoryList";
import type { DashboardOverviewResponse } from "../types/api.types";
import ExpensePieChart from "../components/dashboard/ExpensePieChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res =
        await axiosInstance.get<DashboardOverviewResponse>("/dashboard");
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <PageSpinner />;

  const pieData =
    data?.expenseDistribution?.map((d) => ({
      name: d.category,
      value: d.amount,
    })) ?? [];
  const income = data?.monthlyIncome ?? 0;
  const expense = data?.monthlyExpense ?? 0;
  const savings = data?.savings ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Your financial overview for this month
          </p>
        </div>
        <button
          onClick={() => fetchDashboard(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashStatCard
          title="Monthly Income"
          value={`$${income.toLocaleString()}`}
          sub="Earned this month"
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-teal-500 to-teal-700"
        />
        <DashStatCard
          title="Monthly Expenses"
          value={`$${expense.toLocaleString()}`}
          sub="Spent this month"
          icon={<TrendingDown className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-orange-500 to-orange-700"
        />
        <DashStatCard
          title="Savings"
          value={`$${savings.toLocaleString()}`}
          sub={`${data?.savingsRate ?? 0}% savings rate`}
          icon={<PiggyBank className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-cyan-500 to-cyan-700"
        />
        <DashStatCard
          title="Net Balance"
          value={`$${(income - expense).toLocaleString()}`}
          sub="Income minus expenses"
          icon={<Wallet className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-br from-violet-500 to-violet-700"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ExpensePieChart data={pieData} />
        <CategoryList spendByCategory={data?.spendByCategory ?? {}} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={data?.recentTransactions ?? []}
        refreshing={refreshing}
        onRefresh={() => fetchDashboard(true)}
      />
    </div>
  );
};

export default Dashboard;
