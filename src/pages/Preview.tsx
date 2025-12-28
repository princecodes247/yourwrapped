import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWrappedStore } from "@/store/wrappedStore";
import WrappedSlides from "@/components/WrappedSlides";
import { createWrapped } from "@/api/wrapped";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { ShareDialog } from "@/components/ShareDialog";

const Preview = () => {
  const navigate = useNavigate();
  const { wrappedData } = useWrappedStore();
  const [isCreating, setIsCreating] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [createdId, setCreatedId] = useState<string>("");

  const handleCreateWrapped = async () => {
    console.log("jo")
    try {
      setIsCreating(true);
      const id = await createWrapped(wrappedData as any);
      setCreatedId(id);
      toast.success("Wrapped created successfully!");

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Open share dialog
      setShareDialogOpen(true);
    } catch (error) {
      console.error("Failed to create wrapped:", error);
      toast.error("Failed to create your Wrapped. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Redirect if no data (optional, but good UX)
  // if (!wrappedData.recipientName) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
  //       <h1 className="text-2xl font-bold mb-4">No Data Found</h1>
  //       <p className="text-muted-foreground mb-8">Start creating your Wrapped to see a preview.</p>
  //       <Button onClick={() => navigate('/create')}>Start Creating</Button>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="bg-white/10 text-primary text-center py-2 px-4 text-sm font-medium z-50">
        Previewing your Wrapped. <button onClick={() => navigate('/create')} className="underline text-primary">Back to Editing</button>
      </div>

      <WrappedSlides
        data={wrappedData}
        isSharedView={false}
        onAction={handleCreateWrapped}
        actionLabel="Create & Share Wrapped"
        isActionLoading={isCreating}
      />

      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        wrappedId={createdId}
      />
    </div>
  );
};

export default Preview;
