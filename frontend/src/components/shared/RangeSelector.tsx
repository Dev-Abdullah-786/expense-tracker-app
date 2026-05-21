interface RangeSelectorProps {
  value: string;
  onChange: (r: string) => void;
  activeColor?: string;
}

const RangeSelector = ({ value, onChange, activeColor = "teal" }: RangeSelectorProps) => (
  <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
    {["weekly", "monthly", "yearly"].map((r) => (
      <button
        key={r}
        onClick={() => onChange(r)}
        className={`px-4 py-1.5 text-sm rounded-lg capitalize font-medium transition-all ${
          value === r
            ? `bg-${activeColor}-500 text-white shadow-sm`
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {r}
      </button>
    ))}
  </div>
);

export default RangeSelector;
