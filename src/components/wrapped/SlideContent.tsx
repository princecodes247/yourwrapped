import {
    WrappedData,
    RELATIONSHIP_LABELS,
    ERA_VARIANTS,
    PHRASE_VARIANTS,
    EMOTIONS_VARIANTS,
    OBSESSIONS_VARIANTS,
    FAVORITES_VARIANTS,
    IMPROVEMENT_VARIANTS,
    CREATOR_VARIANTS
} from "@/types/wrapped";
import {
    getEraLabel,
    getEmotionLabel,
    getImprovementLabel,
    getDeterministicIndex,
    getDeterministicNumber,
    getSeed
} from "@/utils";
import { CountUp } from "./CountUp";
import { Button } from "@/components/ui/button";
import { Loader2, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-client";

interface SlideContentProps {
    slideId: string;
    data: Partial<WrappedData>;
    recipientName: string;
    creatorName: string;
    previewId?: string;
    onAction?: () => void;
    actionLabel?: string;
    isActionLoading?: boolean;
    setIsPaused?: (paused: boolean) => void;
}

export const SlideContent = ({
    slideId,
    data,
    recipientName,
    creatorName,
    previewId,
    onAction,
    actionLabel,
    isActionLoading,
    setIsPaused
}: SlideContentProps) => {
    // Deterministic Logic
    const seed = getSeed(previewId, data);
    const [expandedMemory, setExpandedMemory] = useState<number | null>(null);

    // Pause progress when memory is expanded
    useEffect(() => {
        if (setIsPaused) {
            setIsPaused(expandedMemory !== null);
        }
    }, [expandedMemory, setIsPaused]);

    // Alternate Texts
    const INTRO_ALTERNATES = [
        "This year, I got to watch",
        "This year, I witnessed",
        "2025 was the year I saw",
        "I had the front row seat to watch"
    ];

    const PHRASE_COUNT_ALTERNATES = [
        "Used approximately",
        "Said about",
        "Dropped",
        "Heard",
        "Repeated"
    ];

    const IMPROVEMENT_INTRO_ALTERNATES = [
        `This year, ${recipientName} got better at`,
        `In 2025, ${recipientName} mastered`,
        `${recipientName} quietly improved at`,
        `I watched ${recipientName} grow in`
    ];

    const IMPROVEMENT_OUTRO_ALTERNATES = [
        "And it didn't go unnoticed.",
        "And I saw every bit of it.",
        "And it made all the difference.",
        "And it was beautiful to see."
    ];

    const OUTRO_DEFAULT_ALTERNATES = [
        "For being exactly who they are. For growing. For showing up.\nFor making 2025 unforgettable.",
        "For the laughs, the growth, and the memories.\nHere's to you.",
        "For simply existing and making the world brighter.\nThank you.",
        "For every moment, big and small.\nYou made 2025 yours."
    ];

    const phraseCount = useState(() => getDeterministicNumber(seed, 200, 700, 1))[0];

    // Variant Helpers
    const eraVariant = ERA_VARIANTS.find(v => v.id === data.eraVariant) || ERA_VARIANTS[0];
    const phraseVariant = PHRASE_VARIANTS.find(v => v.id === data.phraseVariant) || PHRASE_VARIANTS[0];
    const emotionsVariant = EMOTIONS_VARIANTS.find(v => v.id === data.emotionsVariant) || EMOTIONS_VARIANTS[0];
    const obsessionsVariant = OBSESSIONS_VARIANTS.find(v => v.id === data.obsessionsVariant) || OBSESSIONS_VARIANTS[0];
    const favoritesVariant = FAVORITES_VARIANTS.find(v => v.id === data.favoritesVariant) || FAVORITES_VARIANTS[0];
    const improvementVariant = IMPROVEMENT_VARIANTS.find(v => v.id === data.improvementVariant) || IMPROVEMENT_VARIANTS[0];
    const creatorVariant = CREATOR_VARIANTS.find(v => v.id === data.creatorVariant) || CREATOR_VARIANTS[0];

    switch (slideId) {
        case 'cover':
            return (
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest opacity-0 animate-fade-up">
                        Wrapped 2025
                    </p>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 opacity-0 animate-fade-up delay-200">
                        {recipientName}'s
                        <br />
                        <span className="text-primary glow-text">Year in Review</span>
                    </h1>
                    <p className="text-muted-foreground text-lg opacity-0 animate-fade-up delay-400">
                        {creatorVariant.id === 'message' ? creatorName : `Curated by ${creatorName}`}
                    </p>
                </div>
            );
        case 'relationship':
            return (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 opacity-0 animate-fade-up">
                        {creatorVariant.id === 'message' ? "A message for you" : `As told by ${creatorName}`}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-light text-foreground mb-4 opacity-0 animate-fade-up delay-200">
                        {INTRO_ALTERNATES[getDeterministicIndex(seed, INTRO_ALTERNATES.length, 2)]}
                        {/* <br /> */}{" "}
                        <span className="text-primary">{data.relationship ? RELATIONSHIP_LABELS[data.relationship].toLowerCase() : 'someone special'}</span>
                    </h2>
                    <p className="text-xl text-muted-foreground opacity-0 animate-fade-up delay-400">
                        become even more themselves.
                    </p>
                </div>
            );
        case 'era':
            return (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {eraVariant.displayPrefix}
                    </p>
                    <div className="opacity-0 animate-fade-up delay-200">
                        <span className="text-5xl md:text-7xl mb-6 block">
                            {getEraLabel(data, data.mainCharacterEra || '')?.emoji}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-light text-foreground">
                            <span className="text-primary">
                                {eraVariant.displaySuffix}{" "}
                                {getEraLabel(data, data.mainCharacterEra || '')?.label || 'Unknown Era'}
                            </span>
                        </h2>
                    </div>
                </div>
            );
        case 'phrase':
            return (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {phraseVariant.displayPrefix}
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up delay-200">
                        "{data.topPhrase}"
                    </h2>
                    <p className="text-muted-foreground text-lg opacity-0 animate-fade-up delay-400 counter-reveal">
                        {PHRASE_COUNT_ALTERNATES[getDeterministicIndex(seed, PHRASE_COUNT_ALTERNATES.length, 3)]} <span className="text-primary font-medium"><CountUp end={phraseCount} duration={3000} /></span> times
                    </p>
                </div>
            );
        case 'emotions':
            return (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {emotionsVariant.displayPrefix}
                    </p>
                    <div className="space-y-6 max-w-sm mx-auto mt-12">
                        {data.topEmotions?.map((emotion, index) => {
                            const emotionData = getEmotionLabel(data, typeof emotion === 'string' ? emotion : emotion?.id);
                            const width = !!emotion?.percentage ? emotion.percentage : index === 0 ? 95 : index === 1 ? 75 : 50;
                            return (
                                <div
                                    key={typeof emotion === 'string' ? emotion : emotion?.id}
                                    className="opacity-0 animate-fade-up group"
                                    style={{ animationDelay: `${200 + index * 150}ms` }}
                                >
                                    <div className="flex items-end justify-between mb-2 px-1">
                                        <span className="text-xl font-light text-foreground flex items-center gap-3">
                                            <span className="text-2xl filter drop-shadow-lg">{emotionData?.emoji}</span>
                                            <span className="tracking-wide">{emotionData?.label}</span>
                                        </span>
                                        <span className="text-sm font-mono text-muted-foreground/80">{width}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-900/10 dark:bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary/60 via-primary/80 to-primary rounded-full progress-fill shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                            style={{ width: `${width}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        case 'obsessions':
            return (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {obsessionsVariant.displayPrefix}
                    </p>
                    <div className="space-y-4">
                        {data.obsessions?.map((obs, index) => (
                            <div
                                key={index}
                                className="opacity-0 animate-fade-up"
                                style={{ animationDelay: `${200 + index * 150}ms` }}
                            >
                                <span className="text-muted-foreground text-lg mr-3">#{index + 1}</span>
                                <span className="text-2xl md:text-3xl font-light text-foreground">{obs}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'favorites':
            return (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {favoritesVariant.displayPrefix}
                    </p>
                    <div className="space-y-4">
                        {data.favorites?.map((fav, index) => (
                            <div
                                key={index}
                                className="opacity-0 animate-fade-up"
                                style={{ animationDelay: `${200 + index * 150}ms` }}
                            >
                                <span className="text-muted-foreground text-lg mr-3">#{index + 1}</span>
                                <span className="text-2xl md:text-3xl font-light text-foreground">{fav}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'improvement':
            return (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {improvementVariant.displayPrefix}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 opacity-0 animate-fade-up delay-200">
                        {IMPROVEMENT_INTRO_ALTERNATES[getDeterministicIndex(seed, IMPROVEMENT_INTRO_ALTERNATES.length, 4)]}
                    </h2>
                    <div className="space-y-4">

                        {Array.isArray(data.quietImprovement) ? data.quietImprovement?.map((imp, index) => (
                            <p
                                key={index}
                                className="text-2xl md:text-3xl text-primary opacity-0 animate-fade-up"
                                style={{ animationDelay: `${400 + index * 150}ms` }}
                            >
                                {getImprovementLabel(data, imp)}
                            </p>
                        )) : <p className="text-2xl md:text-3xl text-primary opacity-0 animate-fade-up delay-400">
                            {getImprovementLabel(data, data.quietImprovement || '')}
                        </p>
                        }
                    </div>
                    <p className="text-muted-foreground mt-8 text-lg opacity-0 animate-fade-up delay-600">
                        {IMPROVEMENT_OUTRO_ALTERNATES[getDeterministicIndex(seed, IMPROVEMENT_OUTRO_ALTERNATES.length, 5)]}
                    </p>
                </div>
            );
        case 'memories':
            const isGallery = data.memoriesVariant === 'gallery';
            return (
                <div className="text-center w-full max-w-4xl mx-auto relative min-h-[60vh] flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {isGallery ? "Captured Moments" : "A Story to Tell"}
                    </p>

                    {isGallery ? (
                        <>
                            <div className="grid grid-cols-2 gap-2 md:gap-4 w-full max-w-2xl mx-auto p-4">
                                {data.memories?.map((img, index) => {
                                    // Deterministic random rotation
                                    const rotation = getDeterministicNumber((seed + index) * (index + 1), -20, 20)
                                    return (
                                        <div
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedMemory(index);
                                            }}
                                            data-rotation={rotation}
                                            className={cn(
                                                "polaroid-image-frame",
                                                "bg-[#fffdfb] p-2 md:p-3 pb-8 md:pb-10 relative z-50 transition-all duration-500 cursor-pointer pointer-events-auto hover:scale-105 hover:z-[60]",
                                                "shadow-[0_3px_15px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.05)]", // Realistic layered shadow
                                                "hover:shadow-[0_20px_40px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1)]", // Lifted shadow on hover
                                                "before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/paper.png')] before:opacity-20 before:mix-blend-multiply before:pointer-events-none" // Subtle paper texture
                                            )}
                                            style={{
                                                animationDelay: `${index * 150}ms`,
                                            }}
                                        >
                                            <div className="aspect-square overflow-hidden bg-zinc-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                                                <img src={`${API_BASE_URL}${img}`} alt="Memory" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {(!data.memories || data.memories.length === 0) && (
                                <div className="text-muted-foreground italic">No photos added</div>
                            )}

                            {/* Expanded View Overlay */}
                            {expandedMemory !== null && data.memories && (
                                <div
                                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md p-4 pointer-events-auto"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedMemory(null);
                                    }}
                                >
                                    <div
                                        className="relative max-w-4xl max-h-[80vh] min-h-[300px] w-full bg-white p-2 md:p-4 pb-10 shadow-2xl transform scale-100 animate-fade-up"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => setExpandedMemory(null)}
                                            className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
                                        >
                                            <span className="sr-only">Close</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                        <div className="w-full h-full max-w-4xl max-h-[70vh] flex items-center justify-center bg-zinc-100 overflow-hidden">
                                            <img
                                                src={`${API_BASE_URL}${data.memories[expandedMemory]}`}
                                                alt="Memory Expanded"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative w-full max-w-lg mx-auto opacity-0 animate-fade-up delay-200">
                            <div className="absolute inset-0 bg-white/5 transform rotate-2 rounded-lg blur-sm"></div>
                            <div className="relative bg-[#f8f5e6] text-zinc-800 p-8 md:p-12 rounded-lg shadow-xl transform -rotate-1">
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                </div>
                                <div className="font-handwriting text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap font-medium">
                                    {data.funMoment || "No story shared..."}
                                </div>
                                <div className="mt-6 text-right font-handwriting text-xl text-zinc-500">
                                    — {creatorName}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        case 'outro':
            return (
                <div className="text-center">
                    {data.outroMessage === 'summary' ? (
                        <>
                            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                                2025
                                <br />
                                <span className="text-primary">The {getEraLabel(data, data.mainCharacterEra || '')?.label || 'Change'}</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200">
                                Defined by {getEmotionLabel(data, data.topEmotions?.[0]?.id || '')?.label?.toLowerCase() || 'emotions'}, {data.obsessions?.[0] || 'obsessions'}, and being unapologetically you.
                            </p>
                        </>
                    ) : data.outroMessage === 'default' ? (
                        <>
                            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                                Here's to {recipientName}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200 whitespace-pre-wrap">
                                {OUTRO_DEFAULT_ALTERNATES[getDeterministicIndex(seed, OUTRO_DEFAULT_ALTERNATES.length, 6)]}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                                For {recipientName}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200 whitespace-pre-wrap italic">
                                "{data.outroMessage || 'You are amazing.'}"
                            </p>
                        </>
                    )}
                    <div className="">
                        <p className="text-primary text-lg font-medium mb-6">
                            {creatorVariant.id === 'message' ? creatorName : `With love, ${creatorName}`}
                        </p>
                        {onAction && (
                            <Button
                                variant="glossy"
                                size="lg"
                                onClick={onAction}
                                disabled={isActionLoading}
                                className="cursor-pointer relative z-50 pointer-events-auto no-capture"
                            >
                                {isActionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
                                {actionLabel}
                            </Button>
                        )}
                    </div>
                </div>
            );
        default:
            return null;
    }
};
