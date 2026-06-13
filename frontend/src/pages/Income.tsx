import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type {
  Transaction,
  TransactionRequest,
  GetAllIncomeResponse,
  IncomeOverviewResponse,
  UpdateTransactionRequest,
} from "../types/api.types";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { INCOME_CATEGORY_ICONS } from "../assets/color";
import EmptyState from "../components/shared/EmptyState";
import PageSpinner from "../components/shared/PageSpinner";
import SectionCard from "../components/shared/SectionCard";
import RangeSelector from "../components/shared/RangeSelector";
import TransactionRow from "../components/shared/TransactionRow";
import TransactionModal from "../components/shared/TransactionModal";
import { Plus, Download, TrendingUp, DollarSign, Hash } from "lucide-react";

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
];
const TOOLTIP_STYLE = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  padding: "12px",
};

const Income = () => {
  const [overview, setOverview] = useState<{
    totalIncome: number;
    averageIncome: number;
    numberOfTransactions: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("monthly");
  const [showModal, setShowModal] = useState(false);
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateTransactionRequest>({
    description: "",
    amount: 0,
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [listRes, overviewRes] = await Promise.all([
        axiosInstance.get<GetAllIncomeResponse>("/income/get"),
        axiosInstance.get<IncomeOverviewResponse>(
          `/income/overview?range=${range}`,
        ),
      ]);
      setIncomes(listRes.data.income);
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
    await axiosInstance.post("/income/add", form);
    fetchAll();
  };
  const handleDelete = async (id: string) => {
    await axiosInstance.delete(`/income/delete/${id}`);
    setIncomes((p) => p.filter((i) => i._id !== id));
  };
  const handleEditSave = async (id: string) => {
    await axiosInstance.put(`/income/update/${id}`, editForm);
    setIncomes((p) => p.map((i) => (i._id === id ? { ...i, ...editForm } : i)));
    setEditId(null);
  };
  const handleDownload = async () => {
    const res = await axiosInstance.get("/income/downloadexcel", {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "income.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = Object.entries(
    incomes.reduce<Record<string, number>>((acc, tx) => {
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

  if (loading) return <PageSpinner color="teal" />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {showModal && (
        <TransactionModal
          title="Add Income"
          subtitle="Record a new income entry"
          gradient="bg-gradient-to-r from-teal-500 to-emerald-600"
          ringColor="focus:ring-teal-500"
          submitGradient="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
          categories={INCOME_CATEGORIES}
          defaultCategory="Salary"
          categoryIcons={INCOME_CATEGORY_ICONS}
          accentColor="teal"
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Income</h1>
            <p className="text-teal-100 mt-1 text-sm">
              Track and manage all your income sources
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
              className="flex items-center gap-2 bg-white text-teal-600 hover:bg-teal-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Income
            </button>
          </div>
        </div>
        {/* Summary badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            {
              label: "Total Income",
              value: `$${(overview?.totalIncome ?? 0).toLocaleString()}`,
              icon: <TrendingUp className="w-5 h-5" />,
            },
            {
              label: "Average Income",
              value: `$${(overview?.averageIncome ?? 0).toFixed(2)}`,
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
              <div className="flex items-center gap-2 mb-2 text-teal-100">
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
        title="Income Trend"
        right={
          <RangeSelector value={range} onChange={setRange} activeColor="teal" />
        }
      >
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                    "Income",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  fill="url(#incomeGrad)"
                  strokeWidth={2.5}
                  dot={{ fill: "#10b981", r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            No data for this period
          </div>
        )}
      </SectionCard>

      {/* Transaction List */}
      <SectionCard title="All Income Records">
        {incomes.length === 0 ? (
          <EmptyState
            icon={<TrendingUp className="w-8 h-8 text-teal-400" />}
            title="No income records yet"
            subtitle='Click "Add Income" to get started'
            iconBg="bg-teal-50"
          />
        ) : (
          <div className="space-y-2">
            {incomes.map((tx) => (
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
                  INCOME_CATEGORY_ICONS[
                    tx.category as keyof typeof INCOME_CATEGORY_ICONS
                  ] ?? <DollarSign className="w-5 h-5 text-teal-600" />
                }
                amountColor="text-teal-600"
                amountPrefix="+"
                iconBg="bg-teal-50"
                iconBgHover="bg-teal-100"
                ringColor="focus:ring-teal-500"
                hoverBorder="hover:border-teal-100"
                hoverBg="hover:bg-teal-50/30"
                saveButtonClass="bg-teal-500 hover:bg-teal-600 text-white"
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default Income;
