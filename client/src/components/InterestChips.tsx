import { Check } from "lucide-react";

interface InterestChipsProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

const interests = [
  "Adventure",
  "Culture",
  "Food",
  "Shopping",
  "Relaxation",
  "Offbeat"
];

export default function InterestChips({ selected, onChange }: InterestChipsProps) {
  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      onChange(selected.filter(i => i !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {interests.map((interest) => {
        const isSelected = selected.includes(interest);
        return (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`px-4 py-3 rounded-full border-2 transition-all flex items-center justify-center gap-2 hover-elevate active-elevate-2 ${
              isSelected
                ? "bg-primary text-primary-foreground border-primary-border"
                : "bg-background text-foreground border-border"
            }`}
            data-testid={`chip-interest-${interest.toLowerCase()}`}
          >
            {isSelected && <Check className="w-4 h-4" />}
            <span className="font-medium">{interest}</span>
          </button>
        );
      })}
    </div>
  );
}
