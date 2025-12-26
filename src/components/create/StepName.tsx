import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWrappedStore } from "@/store/wrappedStore";
import StepLayout from "./StepLayout";

const StepName = () => {
  const { wrappedData, updateWrappedData, nextStep } = useWrappedStore();
  const [name, setName] = useState(wrappedData.recipientName || "");

  const handleNext = () => {
    updateWrappedData({ recipientName: name.trim() });
    nextStep();
  };

  return (
    <StepLayout
      stepNumber={1}
      totalSteps={9}
      onNext={handleNext}
      canProgress={name.trim().length > 0}
      showBack={false}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4 opacity-0 animate-fade-up">
          Who is this Wrapped for?
        </h2>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          Enter their first name
        </p>

        <div className="opacity-0 animate-fade-up delay-200">
          <Input
            type="text"
            placeholder="Their name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-center text-xl h-14"
            autoFocus
          />
        </div>
      </div>
    </StepLayout>
  );
};

export default StepName;
