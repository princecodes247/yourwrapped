import React from "react";

interface ProgressBarProps {
    totalSlides: number;
    currentSlide: number;
    progress: number;
}

export const ProgressBar = ({ totalSlides, currentSlide, progress }: ProgressBarProps) => {
    return (
        <div className="absolute top-4 left-0 right-0 z-50 flex gap-1.5 px-2 no-capture">
            {[...Array(totalSlides)].map((_, index) => (
                <div
                    key={index}
                    className="h-1 flex-1 bg-zinc-900/10 dark:bg-white/5 rounded-full overflow-hidden"
                >
                    <div
                        className="h-full bg-primary transition-all duration-100 ease-linear"
                        style={{
                            width: index < currentSlide ? '100%' :
                                index === currentSlide ? `${progress}%` : '0%'
                        }}
                    />
                </div>
            ))}
        </div>
    );
};
