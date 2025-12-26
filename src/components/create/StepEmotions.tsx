import { useState } from "react";
import { useWrappedStore } from "@/store/wrappedStore";
import { EMOTIONS, EMOTIONS_VARIANTS } from "@/types/wrapped";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { cn } from "@/lib/utils";

const StepEmotions = () => {
  const { wrappedData, updateWrappedData, nextStep, prevStep } = useWrappedStore();
  const [selected, setSelected] = useState<string[]>(
    wrappedData.topEmotions || []
  );
  const [variant, setVariant] = useState(wrappedData.emotionsVariant || EMOTIONS_VARIANTS[0].id);

  const currentVariant = EMOTIONS_VARIANTS.find(v => v.id === variant) || EMOTIONS_VARIANTS[0];
  const currentOptions = currentVariant.options || EMOTIONS;

  const toggleEmotion = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((e) => e !== value));
    } else if (selected.length < 2) {
      setSelected([...selected, value]);
    }
  };

  const handleNext = () => {
    updateWrappedData({ topEmotions: selected, emotionsVariant: variant });
    nextStep();
  };

  return (
    <StepLayout
      stepNumber={5}
      totalSteps={9}
      onNext={handleNext}
      onBack={prevStep}
      canProgress={selected.length > 0}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-2 opacity-0 animate-fade-up">
          {wrappedData.recipientName}'s top emotions
        </h2>
        <div className="">
          <VariantSelector
            variants={EMOTIONS_VARIANTS}
            selectedVariant={variant}
            onSelect={(v) => {
              setVariant(v);
              setSelected([]);
            }}
          />
        </div>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          {currentVariant.question}
        </p>

        <div className="grid grid-cols-2 gap-3 opacity-0 animate-fade-up delay-200">
          {currentOptions.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => toggleEmotion(emotion.value)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                selected.includes(emotion.value)
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
              )}
            >
              <span className="text-xl">{emotion.emoji}</span>
              <span className="text-sm font-medium">{emotion.label}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          {selected.length}/2 selected
        </p>
      </div>
    </StepLayout>
  );
};

export default StepEmotions;
