import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepLayoutProps {
  children: ReactNode;
  stepNumber: number;
  totalSteps: number;
  onNext?: () => void;
  onBack?: () => void;
  canProgress?: boolean;
  nextLabel?: string;
  showBack?: boolean;
}

const StepLayout = ({
  children,
  stepNumber,
  totalSteps,
  onNext,
  onBack,
  canProgress = true,
  nextLabel = "Continue",
  showBack = true,
}: StepLayoutProps) => {
  return (
    <div className="min-h-[100svh] bg-background flex flex-col supports-[min-height:100svh]:min-h-[100svh]">


      {/* Back button */}
      {showBack && onBack && (
        <div className="fixed top-6 left-6 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Step indicator */}
      <div className="fixed top-6 right-6 z-40">
        <span className="text-sm text-muted-foreground">
          {stepNumber} / {totalSteps}
        </span>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-20 pb-24 md:pb-20">
        <div className="w-full max-w-lg mx-auto">
          {children}
        </div>
      </main>

      {/* Next button */}
      {onNext && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center px-6 pb-8 pt-4 bg-gradient-to-t from-background via-background to-transparent z-30 safe-area-bottom">
          <Button
            variant="hero"
            size="lg"
            onClick={onNext}
            disabled={!canProgress}
            className="min-w-[200px]"
          >
            {nextLabel}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepLayout;
