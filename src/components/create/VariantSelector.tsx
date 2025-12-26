import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionVariant } from "@/types/wrapped";

interface VariantSelectorProps {
  variants: QuestionVariant[];
  selectedVariant: string;
  onSelect: (variantId: string) => void;
}

const VariantSelector = ({ variants, selectedVariant, onSelect }: VariantSelectorProps) => {
  const currentVariant = variants.find(v => v.id === selectedVariant) || variants[0];

  return (
    <div className="relative group mb-2 z-40">
      <button
        className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          const menu = e.currentTarget.nextElementSibling;
          menu?.classList.toggle('hidden');
        }}
      >
        <span>Change question</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      <div className="hidden space-y-1 absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 min-w-[280px] max-w-[320px] p-2 rounded-xl bg-card border border-border shadow-xl bg-black">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(variant.id);
              e.currentTarget.parentElement?.classList.add('hidden');
            }}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              selectedVariant === variant.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {variant.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;
