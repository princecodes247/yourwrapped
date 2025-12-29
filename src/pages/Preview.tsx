import { useEffect, useState } from "react";
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
import { MUSIC_OPTIONS, THEMES } from "@/types/wrapped";
import { Music } from "lucide-react";

const Preview = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { wrappedData, updateWrappedData } = useWrappedStore();
  const [isCreating, setIsCreating] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [previewId] = useState(() => crypto.randomUUID());
  const [createdId, setCreatedId] = useState<string>("");

  useEffect(() => {
    updateWrappedData({ bgMusic: 'calm' });
  }, [updateWrappedData]);

  const handleCreateWrapped = async () => {
    console.log("jo")
    try {
      setIsCreating(true);
      const id = await createWrapped(wrappedData as any, previewId);
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

        <div className="flex flex-wrap relative items-center gap-2">
          <Select
            value={wrappedData.accentTheme || 'blue'}
            onValueChange={(value) => updateWrappedData({ accentTheme: value as any })}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs bg-background/50 border-primary/20 p-2">
              {(() => {
                const selectedTheme = THEMES.find(t => t.id === (wrappedData.accentTheme || 'blue'));
                if (selectedTheme) {
                  return (
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm shrink-0"
                        style={{
                          background: `linear-gradient(135deg, hsl(${selectedTheme.styles['--background']}), hsl(${selectedTheme.styles['--primary']}))`
                        }}
                      />
                      <span className="truncate">{selectedTheme.label}</span>
                    </div>
                  );
                }
                return <SelectValue placeholder="Select Theme" />;
              })()}
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((theme) => (
                <SelectItem key={theme.id} value={theme.id} className="py-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full shadow-sm shrink-0"
                      style={{
                        background: `linear-gradient(135deg, hsl(${theme.styles['--background']}), hsl(${theme.styles['--primary']}))`
                      }}
                    />
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-xs">{theme.label}</span>
                      <span className="text-[10px] text-muted-foreground opacity-70 capitalize">{theme.isDark ? 'Dark' : 'Light'} Theme</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-4 bg-primary/20 mx-1" />

          <Music className="w-4 h-4 text-muted-foreground" />
          <Select
            value={wrappedData.bgMusic || 'calm'}
            onValueChange={handleMusicChange}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs bg-background/50 border-primary/20">
              <SelectValue placeholder="Select Music" />
            </SelectTrigger>
            <SelectContent>
              {MUSIC_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </span>
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
        previewId={createdId || previewId}
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
