import { SetStateAction, useRef } from "react";
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
    wrappedId?: string;
}

const WrappedSlides = ({
    data,
    isSharedView,
    onAction,
    actionLabel = "Share this Wrapped",
    isActionLoading = false,
    currentSlide,
    setCurrentSlide,
    wrappedId
}: WrappedSlidesProps) => {
    const slideRef = useRef<HTMLDivElement>(null);

    // Hooks
    const { isMuted, setIsMuted, isAudioLoading, hasMusic } = useAudioPlayer(data.bgMusic);

    const { isAnimating, progress, setIsPaused, handleTap } = useSlideNavigation({
        totalSlides: 9, // Total number of slides
        currentSlide,
        setCurrentSlide
    });

    const { isSaving, handleSaveSlide } = useSlideCapture(slideRef, currentSlide);

    const recipientName = data.recipientName || "Someone";
    const creatorName = data.creatorName || "A friend";
    const currentTheme = THEMES.find(t => t.id === data.accentTheme) || THEMES[0];

    // Slide IDs in order
    const SLIDE_IDS = [
        'cover',
        'relationship',
        'era',
        'phrase',
        'emotions',
        'obsessions',
        'favorites',
        'improvement',
        'outro'
    ];

    return (
        <div>
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
                    onSave={handleSaveSlide}
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
                                wrappedId={wrappedId}
                                onAction={onAction}
                                actionLabel={actionLabel}
                                isActionLoading={isActionLoading}
                            />
                        </div>
                    </div>
                </main>
            </SlideBackground>
        </div>
    );
};

export default WrappedSlides;

