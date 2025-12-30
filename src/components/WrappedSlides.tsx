import { SetStateAction, useRef, useState } from "react";
import { WrappedData, THEMES } from "@/types/wrapped";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/wrapped/useAudioPlayer";
import { useSlideNavigation } from "@/hooks/wrapped/useSlideNavigation";
import { useSlideCapture } from "@/hooks/wrapped/useSlideCapture";
import { ProgressBar } from "@/components/wrapped/ProgressBar";
import { SlideControls } from "@/components/wrapped/SlideControls";
import { SlideBackground } from "@/components/wrapped/SlideBackground";
import { SlideContent } from "@/components/wrapped/SlideContent";

interface WrappedSlidesProps {
    data: Partial<WrappedData>;
    isSharedView: boolean;
    onAction?: () => void;
    actionLabel?: string;
    isActionLoading?: boolean;
    currentSlide: number;
    setCurrentSlide: (slide: number | SetStateAction<number>) => void;
    previewId?: string;
}

const WrappedSlides = ({
    data,
    isSharedView,
    onAction,
    actionLabel = "Share this Wrapped",
    isActionLoading = false,
    currentSlide,
    setCurrentSlide,
    previewId
}: WrappedSlidesProps) => {
    const slideRef = useRef<HTMLDivElement>(null);
    const [showGuide, setShowGuide] = useState(isSharedView);
    // Slide IDs in order
    const ALL_SLIDE_IDS = [
        'cover',
        'relationship',
        'era',
        'phrase',
        'emotions',
        'obsessions',
        'favorites',
        'memories',
        'improvement',
        'outro'
    ];

    const SLIDE_IDS = ALL_SLIDE_IDS.filter(id => {
        if (id === 'memories') {
            const hasMemories = data.memories && data.memories.length > 0;
            const hasStory = data.funMoment && data.funMoment.trim().length > 0;
            return hasMemories || hasStory;
        }
        return true;
    });

    const { isAnimating, isPaused, progress, setIsPaused, handleTap } = useSlideNavigation({
        totalSlides: SLIDE_IDS.length, // Total number of slides
        currentSlide,
        setCurrentSlide,
        initialPaused: true
    });

    // Calculate if we are at the end
    const isFinished = false;

    // Hooks
    const { isMuted, setIsMuted, isAudioLoading, hasMusic, play } = useAudioPlayer(data.bgMusic, isFinished, !showGuide);

    const { isSaving, handleSaveSlide } = useSlideCapture(slideRef, currentSlide);

    const recipientName = data.recipientName || "Someone";
    const creatorName = data.creatorName || "A friend";
    const currentTheme = THEMES.find(t => t.id === data.accentTheme) || THEMES[0];

    const handleStart = () => {
        setShowGuide(false);
        setIsPaused(false);
        play();
    };

    return (
        <div>
            {showGuide && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="flex flex-col items-center gap-8 max-w-md px-6 text-center">
                        <div className="flex items-center gap-12 text-white/80">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                                    ←
                                </div>
                                <span className="text-sm">Tap Left<br />to go back</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
                                    →
                                </div>
                                <span className="text-sm">Tap Right<br />to go next</span>
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
            <SlideBackground
                ref={slideRef}
                currentTheme={currentTheme}
                handleTap={handleTap}
                setIsPaused={setIsPaused}
            >
                <ProgressBar
                    totalSlides={SLIDE_IDS.length}
                    currentSlide={currentSlide}
                    progress={progress}
                />

                <SlideControls
                    hasMusic={hasMusic}
                    isMuted={isMuted}
                    toggleMute={() => setIsMuted(!isMuted)}
                    isAudioLoading={isAudioLoading}
                    isSaving={isSaving}
                    isPaused={isPaused}
                    onSave={handleSaveSlide}
                    isSharedView={isSharedView}
                />

                {/* Main content */}
                <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-20 relative z-40 pointer-events-none">
                    <div className="w-full relative max-w-2xl mx-auto">
                        <div key={currentSlide} className={cn(isAnimating && "pointer-events-none", "relative")}>
                            <SlideContent
                                slideId={SLIDE_IDS[currentSlide]}
                                data={data}
                                recipientName={recipientName}
                                creatorName={creatorName}
                                previewId={previewId}
                                onAction={onAction}
                                actionLabel={actionLabel}
                                isActionLoading={isActionLoading}
                                setIsPaused={setIsPaused}
                            />
                        </div>
                    </div>
                </main>
            </SlideBackground>
        </div>
    );
};

export default WrappedSlides;

