import { DollarSign } from "lucide-react";
import { COLORS } from "../../assets/color";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const TOOLTIP_STYLE = {
  backgroundColor: "white", border: "1px solid #e5e7eb",
  borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "12px",
};

interface PieEntry { name: string; value: number; }

const ExpensePieChart = ({ data }: { data: PieEntry[] }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
      <DollarSign className="w-5 h-5 text-teal-500" /> Expense Distribution
    </h2>
    <p className="text-sm text-gray-500 mb-4">Spending breakdown by category</p>
    {data.length > 0 ? (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={3} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Amount"]} />
            <Legend formatter={(v) => <span className="text-sm text-gray-600">{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <div className="h-72 flex flex-col items-center justify-center text-gray-400">
        <DollarSign className="w-12 h-12 mb-2 opacity-30" />
        <p className="text-sm">No expense data yet</p>
      </div>
    )}
  </div>
);

export default ExpensePieChart;
