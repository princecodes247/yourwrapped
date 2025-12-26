import { useWrappedStore } from "@/store/wrappedStore";
import GenericStep from "@/components/create/GenericStep";
import { steps } from "@/config/steps";

const Create = () => {
  const { currentStep, nextStep, prevStep } = useWrappedStore();
  const currentConfig = steps[currentStep] || steps[0];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <GenericStep
        key={currentConfig.id}
        config={currentConfig}
        stepNumber={currentStep + 1}
        totalSteps={steps.length}
        onNext={nextStep}
        onBack={prevStep}
      />
    </>
  );
};

export default Create;
