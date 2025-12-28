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
import { useState } from "react";

interface SlideContentProps {
    slideId: string;
    data: Partial<WrappedData>;
    recipientName: string;
    creatorName: string;
    previewId?: string;
    onAction?: () => void;
    actionLabel?: string;
    isActionLoading?: boolean;
}

export const SlideContent = ({
    slideId,
    data,
    recipientName,
    creatorName,
    previewId,
    onAction,
    actionLabel,
    isActionLoading
}: SlideContentProps) => {
    // Deterministic Logic
    const seed = getSeed(previewId, data);

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
                    <div className="space-y-4 max-w-sm mx-auto">
                        {data.topEmotions?.map((emotion, index) => {
                            const emotionData = getEmotionLabel(data, emotion);
                            const width = index === 0 ? 95 : index === 1 ? 75 : 50;
                            return (
                                <div
                                    key={emotion}
                                    className="opacity-0 animate-fade-up"
                                    style={{ animationDelay: `${200 + index * 150}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-medium text-foreground flex items-center gap-2">
                                            {emotionData?.emoji} {emotionData?.label}
                                        </span>
                                        <span className="text-muted-foreground">{width}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full progress-fill"
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
                    <p className="text-2xl md:text-3xl text-primary opacity-0 animate-fade-up delay-400">
                        {getImprovementLabel(data, data.quietImprovement || '')}
                    </p>
                    <p className="text-muted-foreground mt-8 text-lg opacity-0 animate-fade-up delay-600">
                        {IMPROVEMENT_OUTRO_ALTERNATES[getDeterministicIndex(seed, IMPROVEMENT_OUTRO_ALTERNATES.length, 5)]}
                    </p>
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
                                Defined by {getEmotionLabel(data, data.topEmotions?.[0] || '')?.label?.toLowerCase() || 'emotions'}, {data.obsessions?.[0] || 'obsessions'}, and being unapologetically you.
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
