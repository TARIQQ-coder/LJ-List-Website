import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  buttonClassName?: string;
  menuClassName?: string;
}

export const SelectDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
  buttonClassName,
  menuClassName,
}: SelectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "w-full flex items-center justify-between gap-2 bg-surface-raised border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white cursor-pointer hover:border-surface-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
          buttonClassName,
        )}
      >
        <span className={cn(!selected && "text-surface-muted")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-surface-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute z-20 mt-2 w-full rounded-xl border border-surface-border bg-surface-raised p-1 shadow-xl",
              menuClassName,
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2 text-sm transition-colors",
                  value === option.value
                    ? "bg-white/10 text-white"
                    : "text-surface-muted hover:bg-surface-overlay hover:text-white",
                )}
              >
                <span className="block">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-xs text-surface-muted">
                    {option.description}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
