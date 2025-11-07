import { DollarSign } from "lucide-react";

interface BudgetSelectorProps {
  value: string;
  onChange: (budget: string) => void;
}

const budgetOptions = [
  { value: "Low", label: "Low", icon: "$", description: "Budget-friendly" },
  { value: "Moderate", label: "Moderate", icon: "$$", description: "Comfortable" },
  { value: "Luxury", label: "Luxury", icon: "$$$", description: "Premium" }
];

export default function BudgetSelector({ value, onChange }: BudgetSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {budgetOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-6 rounded-lg border-2 transition-all text-left hover-elevate active-elevate-2 ${
              isSelected
                ? "bg-card border-primary"
                : "bg-card border-card-border"
            }`}
            data-testid={`button-budget-${option.value.toLowerCase()}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-semibold text-lg">{option.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{option.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{option.icon}</p>
          </button>
        );
      })}
    </div>
  );
}
