import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWrappedStore } from "@/store/wrappedStore";
import { PHRASE_VARIANTS } from "@/types/wrapped";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { cn } from "@/lib/utils";

const StepTopPhrase = () => {
  const { wrappedData, updateWrappedData, nextStep, prevStep } = useWrappedStore();
  const [phrase, setPhrase] = useState(wrappedData.topPhrase || "");
  const [variant, setVariant] = useState(wrappedData.phraseVariant || PHRASE_VARIANTS[0].id);

  const currentVariant = PHRASE_VARIANTS.find(v => v.id === variant) || PHRASE_VARIANTS[0];
  const currentOptions = currentVariant.options;

  const handleNext = () => {
    updateWrappedData({ topPhrase: phrase.trim(), phraseVariant: variant });
    nextStep();
  };

  return (
    <StepLayout
      stepNumber={4}
      totalSteps={8}
      onNext={handleNext}
      onBack={prevStep}
      canProgress={phrase.trim().length > 0}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-2 opacity-0 animate-fade-up">
          {wrappedData.recipientName}'s signature phrase
        </h2>
        <div className="opacity-0 animate-fade-up delay-100">
          <VariantSelector
            variants={PHRASE_VARIANTS}
            selectedVariant={variant}
            onSelect={setVariant}
          />
        </div>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          {currentVariant.question}
        </p>

        <div className="">
          <Input
            type="text"
            placeholder="e.g. That's wild, I'm so tired"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value.slice(0, 40))}
            className="text-center text-lg h-14"
            autoFocus
          />
          <p className="text-xs text-muted-foreground mt-3">
            {phrase.length}/40 characters
          </p>

          {currentOptions && (
            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {currentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPhrase(option.label)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-all duration-200",
                    phrase === option.label
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </StepLayout>
  );
};

export default StepTopPhrase;
