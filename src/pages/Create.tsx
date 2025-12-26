import { useWrappedStore } from "@/store/wrappedStore";
import StepName from "@/components/create/StepName";
import StepRelationship from "@/components/create/StepRelationship";
import StepMainCharacterEra from "@/components/create/StepMainCharacterEra";
import StepTopPhrase from "@/components/create/StepTopPhrase";
import StepEmotions from "@/components/create/StepEmotions";
import StepObsessions from "@/components/create/StepObsessions";
import StepFavorites from "@/components/create/StepFavorites";
import StepQuietImprovement from "@/components/create/StepQuietImprovement";
import StepCreatorName from "@/components/create/StepCreatorName";

const Create = () => {
  const { currentStep } = useWrappedStore();

  const steps = [
    <StepName key="name" />,
    <StepRelationship key="relationship" />,
    <StepMainCharacterEra key="era" />,
    <StepTopPhrase key="phrase" />,
    <StepEmotions key="emotions" />,
    <StepObsessions key="obsessions" />,
    <StepFavorites key="favorites" />,
    <StepQuietImprovement key="improvement" />,
    <StepCreatorName key="creator" />,
  ];

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
      {steps[currentStep] || steps[0]}
    </>
  );
};

export default Create;
