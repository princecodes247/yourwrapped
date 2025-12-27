import { useWrappedStore } from "@/store/wrappedStore";
import GenericStep from "@/components/create/GenericStep";
import { steps } from "@/config/steps";

const Create = () => {
  const { currentStep, nextStep, prevStep, wrappedData } = useWrappedStore();
  const currentConfig = steps[currentStep] || steps[0];
  const nextConfig = steps[currentStep + 1];

  const hasNextValue = !!(nextConfig && (
    Array.isArray(wrappedData[nextConfig.dataKey])
      ? (wrappedData[nextConfig.dataKey] as any[]).length > 0
      : wrappedData[nextConfig.dataKey]
  ));

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
        hasNextValue={hasNextValue}
      />
    </>
  );
};

export default Create;
