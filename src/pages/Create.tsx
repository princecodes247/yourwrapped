import { useWrappedStore } from "@/store/wrappedStore";
import StepName from "@/components/create/StepName";
import StepRelationship from "@/components/create/StepRelationship";
import StepMainCharacterEra from "@/components/create/StepMainCharacterEra";
import StepTopPhrase from "@/components/create/StepTopPhrase";
import StepEmotions from "@/components/create/StepEmotions";
import StepObsessions from "@/components/create/StepObsessions";
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
    <StepQuietImprovement key="improvement" />,
    <StepCreatorName key="creator" />,
  ];

  return steps[currentStep] || steps[0];
};

export default Create;
