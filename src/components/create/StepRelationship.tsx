import { useState } from "react";
import { useWrappedStore } from "@/store/wrappedStore";
import { RelationshipType, RELATIONSHIP_LABELS } from "@/types/wrapped";
import StepLayout from "./StepLayout";
import { cn } from "@/lib/utils";

const relationships: { value: RelationshipType; label: string; emoji: string }[] = [
  { value: 'partner', label: 'Partner', emoji: '💕' },
  { value: 'best-friend', label: 'Best Friend', emoji: '👯' },
  { value: 'friend', label: 'Friend', emoji: '🤝' },
  { value: 'sibling', label: 'Sibling', emoji: '👨‍👩‍👧‍👦' },
  { value: 'parent', label: 'Parent', emoji: '👨‍👧' },
  { value: 'child', label: 'Child', emoji: '👶' },
  { value: 'other', label: 'Someone Special', emoji: '✨' },
];

const StepRelationship = () => {
  const { wrappedData, updateWrappedData, nextStep, prevStep } = useWrappedStore();
  const [selected, setSelected] = useState<RelationshipType | undefined>(
    wrappedData.relationship
  );

  const handleSelect = (value: RelationshipType) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (selected) {
      updateWrappedData({ relationship: selected });
      nextStep();
    }
  };

  return (
    <StepLayout
      stepNumber={2}
      totalSteps={9}
      onNext={handleNext}
      onBack={prevStep}
      canProgress={!!selected}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4 opacity-0 animate-fade-up">
          {wrappedData.recipientName} is your...
        </h2>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          This helps us personalize the experience
        </p>

        <div className="grid grid-cols-2 gap-3 opacity-0 animate-fade-up delay-200">
          {relationships.map((rel, index) => (
            <button
              key={rel.value}
              onClick={() => handleSelect(rel.value)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                selected === rel.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
              )}
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <span className="text-2xl mb-2">{rel.emoji}</span>
              <span className="text-sm font-medium">{rel.label}</span>
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};

export default StepRelationship;
