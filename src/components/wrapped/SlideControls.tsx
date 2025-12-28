import { Button } from "@/components/ui/button";
import { Loader2, Volume2, VolumeX, Download } from "lucide-react";

interface SlideControlsProps {
    hasMusic: boolean;
    isMuted: boolean;
    toggleMute: () => void;
    isAudioLoading: boolean;
    isSaving: boolean;
    onSave: () => void;
    isSharedView?: boolean;
}

export const SlideControls = ({
    hasMusic,
    isMuted,
    toggleMute,
    isAudioLoading,
    isSaving,
    onSave,
    isSharedView
}: SlideControlsProps) => {
    return (
        <div className="absolute top-8 right-4 z-50 no-capture flex gap-2">
            {hasMusic && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                    ) : (
                        <Volume2 className="w-5 h-5" />
                    )}
                </Button>
            )}
            {isAudioLoading && (
                <div className="flex items-center justify-center w-10 h-10">
                    <Loader2 className="w-4 h-4 text-primary/50 animate-spin" />
                </div>
            )}
            {isSharedView && <Button
                variant="ghost"
                size="icon"
                className="text-primary/50 hover:text-primary hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent slide navigation
                    onSave();
                }}
                disabled={isSaving}
            >
                {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
            </Button>}
        </div>
    );
};
