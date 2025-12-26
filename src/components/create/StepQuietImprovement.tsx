import { useState } from "react";
import { useWrappedStore } from "@/store/wrappedStore";
import { QUIET_IMPROVEMENTS, IMPROVEMENT_VARIANTS } from "@/types/wrapped";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { cn } from "@/lib/utils";

const StepQuietImprovement = () => {
  const { wrappedData, updateWrappedData, nextStep, prevStep } = useWrappedStore();
  const [selected, setSelected] = useState<string | undefined>(
    wrappedData.quietImprovement
  );
  const [variant, setVariant] = useState(wrappedData.improvementVariant || IMPROVEMENT_VARIANTS[0].id);

  const currentVariant = IMPROVEMENT_VARIANTS.find(v => v.id === variant) || IMPROVEMENT_VARIANTS[0];
  const currentOptions = currentVariant.options || QUIET_IMPROVEMENTS;

  const handleNext = () => {
    if (selected) {
      updateWrappedData({ quietImprovement: selected, improvementVariant: variant });
      nextStep();
    }
  };

  return (
    <StepLayout
      stepNumber={8}
      totalSteps={9}
      onNext={handleNext}
      onBack={prevStep}
      canProgress={!!selected}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-2 opacity-0 animate-fade-up">
          A quiet improvement
        </h2>
        <div className="">
          <VariantSelector
            variants={IMPROVEMENT_VARIANTS}
            selectedVariant={variant}
            onSelect={(v) => {
              setVariant(v);
              setSelected(undefined);
            }}
          />
        </div>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          {currentVariant.question}
        </p>

        <div className="grid grid-cols-1 gap-2 opacity-0 animate-fade-up delay-200">
          {currentOptions.map((improvement) => (
            <button
              key={improvement.value}
              onClick={() => setSelected(improvement.value)}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 text-left",
                selected === improvement.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
              )}
            >
              <span className="text-sm font-medium">{improvement.label}</span>
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};

export default StepQuietImprovement;
