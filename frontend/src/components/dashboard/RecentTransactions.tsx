import {
  INCOME_CATEGORY_ICONS,
  EXPENSE_CATEGORY_ICONS,
} from "../../assets/color";
import type { Transaction } from "../../types/api.types";
import { ArrowUpRight, ArrowDownRight, RefreshCw, Wallet } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  refreshing: boolean;
  onRefresh: () => void;
}

const RecentTransactions = ({
  transactions,
  refreshing,
  onRefresh,
}: RecentTransactionsProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
      <button
        onClick={onRefresh}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <RefreshCw
          className={`w-4 h-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`}
        />
      </button>
    </div>

    {transactions.length === 0 ? (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Wallet className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No transactions yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Add income or expenses to get started
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {transactions.slice(0, 10).map((tx) => (
          <div
            key={tx._id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${tx.type === "income" ? "bg-teal-50" : "bg-orange-50"}`}
              >
                {tx.type === "income"
                  ? (INCOME_CATEGORY_ICONS[
                      tx.category as keyof typeof INCOME_CATEGORY_ICONS
                    ] ?? <ArrowUpRight className="w-4 h-4 text-teal-600" />)
                  : (EXPENSE_CATEGORY_ICONS[
                      tx.category as keyof typeof EXPENSE_CATEGORY_ICONS
                    ] ?? (
                      <ArrowDownRight className="w-4 h-4 text-orange-600" />
                    ))}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm truncate max-w-[140px]">
                  {tx.description}
                </p>
                <p className="text-xs text-gray-400">
                  {tx.category} · {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span
              className={`font-bold text-sm ${tx.type === "income" ? "text-teal-600" : "text-orange-600"}`}
            >
              {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default RecentTransactions;
