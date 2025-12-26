import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWrappedStore } from "@/store/wrappedStore";
import StepLayout from "./StepLayout";
import { useNavigate } from "react-router-dom";

const StepCreatorName = () => {
  const navigate = useNavigate();
  const { wrappedData, updateWrappedData, prevStep } = useWrappedStore();
  const [name, setName] = useState(wrappedData.creatorName || "");

  const handleNext = () => {
    updateWrappedData({ creatorName: name.trim() });
    navigate('/preview');
  };

  return (
    <StepLayout
      stepNumber={8}
      totalSteps={8}
      onNext={handleNext}
      onBack={() => prevStep()}
      canProgress={name.trim().length > 0}
      nextLabel="Preview Wrapped"
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4 opacity-0 animate-fade-up">
          Last thing — what's your name?
        </h2>
        <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
          So {wrappedData.recipientName} knows who made this for them
        </p>

        <div className="opacity-0 animate-fade-up delay-200">
          <Input
            type="text"
            placeholder="Your name"
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

export default StepCreatorName;
