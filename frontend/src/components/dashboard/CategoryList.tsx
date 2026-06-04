import { DollarSign } from "lucide-react";
import { COLORS, EXPENSE_CATEGORY_ICONS } from "../../assets/color";

interface CategoryListProps {
  spendByCategory: Record<string, number>;
}

const CategoryList = ({ spendByCategory }: CategoryListProps) => {
  const entries = Object.entries(spendByCategory).slice(0, 6);
  const total = Object.values(spendByCategory).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Top Categories</h2>
      {entries.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No spending data yet
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map(([cat, amt], i) => {
            const pct = total > 0 ? Math.round((amt / total) * 100) : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-50 rounded-lg">
                      {EXPENSE_CATEGORY_ICONS[
                        cat as keyof typeof EXPENSE_CATEGORY_ICONS
                      ] ?? <DollarSign className="w-4 h-4 text-orange-500" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {cat}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    ${amt.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
