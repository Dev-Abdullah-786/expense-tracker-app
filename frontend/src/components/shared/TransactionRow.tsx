import { Pencil, Trash2, Check, X } from "lucide-react";
import type {
  Transaction,
  UpdateTransactionRequest,
} from "../../types/api.types";

interface TransactionRowProps {
  tx: Transaction;
  editId: string | null;
  editForm: UpdateTransactionRequest;
  onEditStart: (tx: Transaction) => void;
  onEditChange: (form: UpdateTransactionRequest) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onDelete: (id: string) => void;
  icon: React.ReactNode;
  amountColor: string;
  amountPrefix: string;
  iconBg: string;
  iconBgHover: string;
  ringColor: string;
  hoverBorder: string;
  hoverBg: string;
  saveButtonClass: string;
}

const TransactionRow = ({
  tx,
  editId,
  editForm,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  icon,
  amountColor,
  amountPrefix,
  iconBg,
  iconBgHover,
  ringColor,
  hoverBorder,
  hoverBg,
  saveButtonClass,
}: TransactionRowProps) => {
  const isEditing = editId === tx._id;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border border-gray-100 ${hoverBorder} ${hoverBg} transition-all group`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`p-2.5 ${iconBg} rounded-xl flex-shrink-0 group-hover:${iconBgHover} transition-colors`}
        >
          {icon}
        </div>
        {isEditing ? (
          <div className="flex gap-2 flex-1 flex-wrap">
            <input
              className={`border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 ${ringColor}`}
              value={editForm.description}
              onChange={(e) =>
                onEditChange({ ...editForm, description: e.target.value })
              }
            />
            <input
              type="number"
              className={`border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 ${ringColor}`}
              value={editForm.amount}
              onChange={(e) =>
                onEditChange({
                  ...editForm,
                  amount: parseFloat(e.target.value),
                })
              }
            />
          </div>
        ) : (
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">
              {tx.description}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {tx.category} ·{" "}
              {new Date(tx.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {isEditing ? (
          <>
            <button
              onClick={() => onEditSave(tx._id)}
              className={`p-2 rounded-lg ${saveButtonClass}`}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onEditCancel}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </>
        ) : (
          <>
            <span className={`font-bold text-sm mr-1 ${amountColor}`}>
              {amountPrefix}${tx.amount.toLocaleString()}
            </span>
            <button
              onClick={() => onEditStart(tx)}
              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(tx._id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionRow;
