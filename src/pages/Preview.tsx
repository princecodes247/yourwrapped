import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWrappedStore } from "@/store/wrappedStore";
import WrappedSlides from "@/components/WrappedSlides";
import { createWrapped } from "@/api/wrapped";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { ShareDialog } from "@/components/ShareDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MUSIC_OPTIONS } from "@/types/wrapped";
import { Music } from "lucide-react";

const Preview = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { wrappedData, updateWrappedData } = useWrappedStore();
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

  const handleMusicChange = (value: string) => {
    updateWrappedData({ bgMusic: value });
    setCurrentSlide(0);
  };

  // Redirect if no data(optional, but good UX)
  if (!wrappedData.recipientName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">Start creating your Wrapped to see a preview.</p>

        <Button variant="glossy" onClick={() => navigate('/create')}>Create your own</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white/10 text-primary py-2 px-4 text-sm font-medium z-50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span>Previewing your Wrapped.</span>
          <button onClick={() => navigate('/create')} className="underline hover:text-primary/80">Back to Editing</button>
        </div>

        <div className="flex relative items-center gap-2">
          <Music className="w-4 h-4" />
          <Select
            value={wrappedData.bgMusic || 'none'}
            onValueChange={handleMusicChange}
          >
            <SelectTrigger className="w-[180px] h-8 text-xs bg-background/50 border-primary/20">
              <SelectValue placeholder="Select Music" />
            </SelectTrigger>
            <SelectContent

            >
              {MUSIC_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <WrappedSlides
        data={wrappedData}
        isSharedView={false}
        onAction={handleCreateWrapped}
        actionLabel="Create & Share Wrapped"
        isActionLoading={isCreating}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
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
