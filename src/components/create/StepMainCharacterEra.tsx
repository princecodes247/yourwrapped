import { useState, useEffect } from "react";
import { useWrappedStore } from "@/store/wrappedStore";
import { MAIN_CHARACTER_ERAS, ERA_VARIANTS } from "@/types/wrapped";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { cn } from "@/lib/utils";

const StepMainCharacterEra = () => {
  const { wrappedData, updateWrappedData, nextStep, prevStep } = useWrappedStore();
  const [selected, setSelected] = useState<string | undefined>(
    wrappedData.mainCharacterEra
  );
  const [variant, setVariant] = useState(wrappedData.eraVariant || ERA_VARIANTS[0].id);

  const currentVariant = ERA_VARIANTS.find(v => v.id === variant) || ERA_VARIANTS[0];
  const currentOptions = currentVariant.options || MAIN_CHARACTER_ERAS;

  const handleNext = () => {
    if (selected) {
      updateWrappedData({ mainCharacterEra: selected, eraVariant: variant });
      nextStep();
    }
  };

  return (
    <StepLayout
      stepNumber={3}
      totalSteps={9}
      onNext={handleNext}
      onBack={prevStep}
      canProgress={!!selected}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-2 opacity-0 animate-fade-up">
          {wrappedData.recipientName}'s 2025 was their...
        </h2>
        <div className="">
          <VariantSelector
            variants={ERA_VARIANTS}
            selectedVariant={variant}
            onSelect={setVariant}
          />
        </div>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          {currentVariant.question}
        </p>

        <div className="grid grid-cols-2 gap-3 opacity-0 animate-fade-up delay-200">
          {currentOptions.map((era, index) => (
            <button
              key={era.value}
              onClick={() => setSelected(era.value)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left",
                selected === era.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
              )}
            >
              <span className="text-2xl">{era.emoji}</span>
              <span className="text-sm font-medium">{era.label}</span>
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};

export default StepMainCharacterEra;
