import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWrappedStore } from "@/store/wrappedStore";
import { OBSESSIONS_VARIANTS } from "@/types/wrapped";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const StepObsessions = () => {
  const { wrappedData, updateWrappedData, nextStep, prevStep } = useWrappedStore();
  const [obsessions, setObsessions] = useState<string[]>(
    wrappedData.obsessions || []
  );
  const [currentInput, setCurrentInput] = useState("");
  const [variant, setVariant] = useState(wrappedData.obsessionsVariant || OBSESSIONS_VARIANTS[0].id);

  const currentVariant = OBSESSIONS_VARIANTS.find(v => v.id === variant) || OBSESSIONS_VARIANTS[0];
  const currentOptions = currentVariant.options;

  const addObsession = (value?: string) => {
    const textToAdd = value || currentInput.trim();
    if (textToAdd && obsessions.length < 3 && !obsessions.includes(textToAdd)) {
      setObsessions([...obsessions, textToAdd]);
      if (!value) setCurrentInput("");
    }
  };

  const removeObsession = (index: number) => {
    setObsessions(obsessions.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.key === "Enter") {
        e.preventDefault();
        addObsession();
      }
    }
  };

  const handleNext = () => {
    updateWrappedData({ obsessions, obsessionsVariant: variant });
    nextStep();
  };

  return (
    <StepLayout
      stepNumber={6}
      totalSteps={9}
      onNext={handleNext}
      onBack={prevStep}
      canProgress={obsessions.length >= 1}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-2 opacity-0 animate-fade-up">
          {wrappedData.recipientName}'s 2025 obsessions
        </h2>
        <div className="">
          <VariantSelector
            variants={OBSESSIONS_VARIANTS}
            selectedVariant={variant}
            onSelect={(v) => {
              setVariant(v);
              setObsessions([]);
            }}
          />
        </div>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          {currentVariant.question} (Add up to 3)
        </p>

        {/* Tags display */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[40px] opacity-0 animate-fade-up delay-200">
          {obsessions.map((obs, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30"
            >
              <span className="text-sm font-medium">{obs}</span>
              <button
                onClick={() => removeObsession(index)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {obsessions.length < 3 && (
          <div className="opacity-0 animate-fade-up delay-300">
            <Input
              type="text"
              placeholder="e.g. Taylor Swift, cold plunges, sourdough"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => addObsession()}
              className="text-center text-lg h-14"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-3">
              Press Enter to add · {obsessions.length}/3 added
            </p>
          </div>
        )}

        {currentOptions && obsessions.length < 3 && (
          <div className="mt-8 opacity-0 animate-fade-up delay-400">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Ideas</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {currentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => addObsession(option.label)}
                  disabled={obsessions.includes(option.label)}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5",
                    obsessions.includes(option.label)
                      ? "opacity-50 cursor-not-allowed bg-secondary/20 border-transparent"
                      : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                  <Plus className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  );
};

export default StepObsessions;
