import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/types/wrapped";
import { forwardRef, ReactNode } from "react";

interface SlideBackgroundProps {
    currentTheme: ThemeConfig;
    children: ReactNode;
    handleTap: (e: React.MouseEvent<HTMLDivElement>) => void;
    setIsPaused: (paused: boolean) => void;
}

export const SlideBackground = forwardRef<HTMLDivElement, SlideBackgroundProps>(({
    currentTheme,
    children,
    handleTap,
    setIsPaused
}, ref) => {
    return (
        <div
            ref={ref}
            data-capture="off"
            className={cn(
                "min-h-[100dvh] relative bg-background flex flex-col supports-[min-height:100dvh]:min-h-[100dvh] overflow-hidden transition-colors duration-500",
                currentTheme.isDark ? "dark" : ""
            )}
            style={{
                ...(currentTheme.styles as React.CSSProperties),
                backgroundImage: currentTheme.gradient
            }}
        >
            {/* Noise Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Creative Elements (Capture Only) */}
            <div className="absolute inset-0 z-10 pointer-events-none only-capture">
                {/* Add any capture-only elements here if needed */}
            </div>

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow"
                />
            </div>

            {/* Tap Zones */}
            <div
                className="absolute inset-0 z-30 flex no-capture"
                onClick={handleTap}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
            </div>

            {children}

            {/* Branding Footer */}
            <div className="absolute bottom-6 left-0 right-0 text-center z-40 pointer-events-none">
                <p className="text-[12px] uppercase tracking-[0.3em] text-primary/40 font-medium">
                    yourwrapped.com
                </p>
            </div>
            {/* Keyboard navigation hint */}
            <div className="fixed text-center bottom-16 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 no-capture">
                Tap sides to navigate
            </div>
        </div>
    );
});

SlideBackground.displayName = "SlideBackground";
