import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type {
  Transaction,
  TransactionRequest,
  GetAllExpenseResponse,
  ExpenseOverviewResponse,
  UpdateTransactionRequest,
} from "../types/api.types";
import { useEffect, useState } from "react";
import Select from "../components/shared/Select";
import axiosInstance from "../utils/axiosInstance";
import EmptyState from "../components/shared/EmptyState";
import { EXPENSE_CATEGORY_ICONS } from "../assets/color";
import PageSpinner from "../components/shared/PageSpinner";
import SectionCard from "../components/shared/SectionCard";
import RangeSelector from "../components/shared/RangeSelector";
import TransactionRow from "../components/shared/TransactionRow";
import TransactionModal from "../components/shared/TransactionModal";
import { Plus, Download, TrendingDown, DollarSign, Hash } from "lucide-react";

const EXPENSE_CATEGORIES = [
  "Food",
  "Housing",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Other",
];
const TOOLTIP_STYLE = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  padding: "12px",
};

const Expense = () => {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("monthly");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [editForm, setEditForm] = useState<UpdateTransactionRequest>({
    description: "",
    amount: 0,
  });
  const [overview, setOverview] = useState<{
    totalExpense: number;
    averageExpense: number;
    numberOfTransactions: number;
  } | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [listRes, overviewRes] = await Promise.all([
        axiosInstance.get<GetAllExpenseResponse>("/expense/get"),
        axiosInstance.get<ExpenseOverviewResponse>(
          `/expense/overview?range=${range}`,
        ),
      ]);
      setExpenses(listRes.data.expenses);
      setOverview(overviewRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [range]);

  const handleAdd = async (form: TransactionRequest) => {
    await axiosInstance.post("/expense/add", form);
    fetchAll();
  };
  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`/expense/delete/${id}`);
    setExpenses((p) => p.filter((e) => e._id !== id));
  };
  const handleEditSave = async (id: string) => {
    await axiosInstance.put(`/expense/update/${id}`, editForm);
    setExpenses((p) =>
      p.map((e) => (e._id === id ? { ...e, ...editForm } : e)),
    );
    setEditId(null);
  };
  const handleDownload = async () => {
    const res = await axiosInstance.get("/expense/downloadexcel", {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = Object.entries(
    expenses.reduce<Record<string, number>>((acc, tx) => {
      const d = new Date(tx.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[d] = (acc[d] || 0) + tx.amount;
      return acc;
    }, {}),
  )
    .slice(-10)
    .map(([date, amount]) => ({ date, amount }));

  const filtered =
    filterCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  if (loading) return <PageSpinner color="orange" />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {showModal && (
        <TransactionModal
          title="Add Expense"
          subtitle="Record a new expense entry"
          gradient="bg-gradient-to-r from-orange-500 to-amber-500"
          ringColor="focus:ring-orange-500"
          submitGradient="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          categories={EXPENSE_CATEGORIES}
          defaultCategory="Food"
          categoryIcons={EXPENSE_CATEGORY_ICONS}
          accentColor="orange"
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Expenses</h1>
            <p className="text-orange-100 mt-1 text-sm">
              Track and manage your spending
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>
        </div>
        {/* Summary badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            {
              label: "Total Expenses",
              value: `$${(overview?.totalExpense ?? 0).toLocaleString()}`,
              icon: <TrendingDown className="w-5 h-5" />,
            },
            {
              label: "Average Expense",
              value: `$${(overview?.averageExpense ?? 0).toFixed(2)}`,
              icon: <DollarSign className="w-5 h-5" />,
            },
            {
              label: "Transactions",
              value: String(overview?.numberOfTransactions ?? 0),
              icon: <Hash className="w-5 h-5" />,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-2 text-orange-100">
                {icon}
                <span className="text-sm">{label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <SectionCard
        title="Expense Trend"
        right={
          <div className="flex items-center gap-3 flex-wrap">
            <RangeSelector
              value={range}
              onChange={setRange}
              activeColor="orange"
            />
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        }
      >
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v) => [
                    `$${Number(v).toLocaleString()}`,
                    "Expense",
                  ]}
                  cursor={{ fill: "#fff7ed" }}
                />
                <Bar dataKey="amount" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            No data for this period
          </div>
        )}
      </SectionCard>

      {/* Transaction List */}
      <SectionCard
        title="All Expenses"
        right={
          <div className="flex items-center gap-2 w-48">
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              options={[
                { value: "All", label: "All Categories" },
                ...EXPENSE_CATEGORIES.map((c) => ({
                  value: c,
                  label: c,
                  icon: EXPENSE_CATEGORY_ICONS[
                    c as keyof typeof EXPENSE_CATEGORY_ICONS
                  ],
                })),
              ]}
              accentColor="orange"
              size="sm"
            />
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<TrendingDown className="w-8 h-8 text-orange-300" />}
            title="No expenses found"
            subtitle={
              filterCategory !== "All"
                ? `No expenses in "${filterCategory}"`
                : 'Click "Add Expense" to get started'
            }
            iconBg="bg-orange-50"
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((tx) => (
              <TransactionRow
                key={tx._id}
                tx={tx}
                editId={editId}
                editForm={editForm}
                onEditStart={(t) => {
                  setEditId(t._id);
                  setEditForm({ description: t.description, amount: t.amount });
                }}
                onEditChange={setEditForm}
                onEditSave={handleEditSave}
                onEditCancel={() => setEditId(null)}
                onDelete={handleDelete}
                icon={
                  EXPENSE_CATEGORY_ICONS[
                    tx.category as keyof typeof EXPENSE_CATEGORY_ICONS
                  ] ?? <DollarSign className="w-5 h-5 text-orange-600" />
                }
                amountColor="text-orange-600"
                amountPrefix="-"
                iconBg="bg-orange-50"
                iconBgHover="bg-orange-100"
                ringColor="focus:ring-orange-500"
                hoverBorder="hover:border-orange-100"
                hoverBg="hover:bg-orange-50/30"
                saveButtonClass="bg-orange-500 hover:bg-orange-600 text-white"
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default Expense;
