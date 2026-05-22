import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  accentColor?: "teal" | "orange" | "violet" | "gray";
  size?: "sm" | "md";
}

const ACCENT = {
  teal: {
    ring: "ring-teal-500",
    check: "text-teal-600",
    activeBg: "bg-teal-50",
    activeText: "text-teal-700",
  },
  orange: {
    ring: "ring-orange-500",
    check: "text-orange-600",
    activeBg: "bg-orange-50",
    activeText: "text-orange-700",
  },
  violet: {
    ring: "ring-violet-500",
    check: "text-violet-600",
    activeBg: "bg-violet-50",
    activeText: "text-violet-700",
  },
  gray: {
    ring: "ring-gray-400",
    check: "text-gray-600",
    activeBg: "bg-gray-100",
    activeText: "text-gray-700",
  },
};

const Select = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  accentColor = "teal",
  size = "md",
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const accent = ACCENT[accentColor];
  const selected = options.find((o) => o.value === value);
  const padCls = size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-sm";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full flex items-center justify-between gap-2 bg-white border rounded-xl
          ${padCls} font-medium text-gray-700 text-left
          transition-all duration-150 shadow-sm
          ${
            open
              ? `border-transparent ring-2 ${accent.ring}`
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }
        `}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected?.icon && (
            <span className="flex-shrink-0 text-gray-500">{selected.icon}</span>
          )}
          <span
            className={`truncate ${selected ? "text-gray-800" : "text-gray-400"}`}
          >
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in">
          <div className="p-1.5 max-h-56 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm
                    transition-all duration-100 text-left
                    ${
                      isSelected
                        ? `${accent.activeBg} ${accent.activeText} font-semibold`
                        : "text-gray-700 hover:bg-gray-50 font-medium"
                    }
                  `}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    {opt.icon && (
                      <span
                        className={`flex-shrink-0 ${isSelected ? accent.check : "text-gray-400"}`}
                      >
                        {opt.icon}
                      </span>
                    )}
                    <span className="truncate">{opt.label}</span>
                  </span>
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${accent.check}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
