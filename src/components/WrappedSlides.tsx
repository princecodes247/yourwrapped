import { useState, useEffect, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2, Download, Volume2, VolumeX } from "lucide-react";
import { toPng } from 'html-to-image';
import { useRef } from "react";
import {
    WrappedData,
    MAIN_CHARACTER_ERAS,
    EMOTIONS,
    QUIET_IMPROVEMENTS,
    RELATIONSHIP_LABELS,
    ERA_VARIANTS,
    PHRASE_VARIANTS,
    EMOTIONS_VARIANTS,
    OBSESSIONS_VARIANTS,
    IMPROVEMENT_VARIANTS,
    FAVORITES_VARIANTS,
    CREATOR_VARIANTS,
    THEMES,
    MUSIC_OPTIONS,
} from "@/types/wrapped";
import { cn } from "@/lib/utils";

const CountUp = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    const [blur, setBlur] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        // Start closer to the end number (e.g., 20% less)
        const start = Math.floor(end * 0.9);
        const range = end - start;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Elastic ease out
            // Simplified elastic/bounce feel:
            const c4 = (2 * Math.PI) / 3;
            const ease = percentage === 0
                ? 0
                : percentage === 1
                    ? 1
                    : Math.pow(2, -10 * percentage) * Math.sin((percentage * 10 - 0.75) * c4) + 1;

            const currentCount = Math.floor(start + (range * ease));
            setCount(currentCount);

            // // Calculate blur based on speed (derivative of ease)
            // // Simple approximation: high blur in middle, low at ends
            // if (percentage < 0.8) {
            //     setBlur(1);
            // } else {
            //     setBlur(0);
            // }

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return (
        <span style={{ filter: `blur(${blur}px)`, transition: 'filter 0.1s' }}>
            {count}
        </span>
    );
};

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
    currentSlide, setCurrentSlide,
    wrappedId
}: WrappedSlidesProps) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const slideRef = useRef<HTMLDivElement>(null);
    const slideRef2 = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Handle background music
    useEffect(() => {
        if (!data.bgMusic || data.bgMusic === 'none') return;

        const musicOption = MUSIC_OPTIONS.find(m => m.value === data.bgMusic);
        if (!musicOption) return;

        // Create audio element if it doesn't exist
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }

        let src = '';
        switch (data.bgMusic) {
            case 'upbeat':
                src = '/evening-sky.mp3';
                break;
            case 'chill':
                src = '/lofi.mp3';
                break;
            case 'calm':
                src = '/cine-guitar.mp3';
                break;
            case 'emotional':
                src = '/acoustic-guitar.mp3'; // Placeholder
                break;
        }

        if (src && audioRef.current.src !== src) {
            audioRef.current.src = src;
            setIsAudioLoading(true);
        }

        // Add event listeners for loading state
        const handleCanPlay = () => setIsAudioLoading(false);
        const handleWaiting = () => setIsAudioLoading(true);
        const handlePlaying = () => setIsAudioLoading(false);

        audioRef.current.addEventListener('canplay', handleCanPlay);
        audioRef.current.addEventListener('waiting', handleWaiting);
        audioRef.current.addEventListener('playing', handlePlaying);

        // Attempt to play
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    if (isMuted) {
                        audioRef.current.muted = true;
                    } else {
                        audioRef.current.muted = false;
                    }
                    await audioRef.current.play();
                } catch (err) {
                    console.log("Auto-play prevented:", err);
                    // User interaction will be needed
                }
            }
        };

        playAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('canplay', handleCanPlay);
                audioRef.current.removeEventListener('waiting', handleWaiting);
                audioRef.current.removeEventListener('playing', handlePlaying);
            }
        };
    }, [data.bgMusic]);

    // Handle mute toggle
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const handleSaveSlide = async () => {
        if (!slideRef.current) return;

        setIsSaving(true);
        try {
            const cloneRef = slideRef.current
            // const cloneRef = slideRef.current.cloneNode(true) as HTMLDivElement;
            cloneRef.setAttribute('data-capture', 'on');
            const dataUrl = await toPng(cloneRef, {
                cacheBust: true,
                pixelRatio: 2, // Higher quality
                filter: (node) => {
                    // Exclude elements with the 'no-capture' class
                    if (node instanceof HTMLElement && node.classList.contains('no-capture')) {
                        return false;
                    }
                    return true;
                },
            } as any); // Cast to any to avoid type error with onClone which might be missing in the types
            cloneRef.setAttribute('data-capture', 'off');

            const link = document.createElement('a');
            link.download = `wrapped-slide-${currentSlide + 1}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to save slide:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const SLIDE_DURATION = 5000;



    useEffect(() => {
        setIsAnimating(true);
        setProgress(0);
        const timer = setTimeout(() => setIsAnimating(false), 600);
        return () => clearTimeout(timer);
    }, [currentSlide]);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    if (currentSlide < slides.length - 1) {
                        setCurrentSlide((curr) => curr + 1);
                        return 0;
                    } else {
                        return 100;
                    }
                }
                return prev + (100 / (SLIDE_DURATION / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentSlide, isPaused]);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const width = e.currentTarget.offsetWidth;
        const x = e.clientX;

        if (x < width / 3) {
            prevSlide();
        } else if (x > (width * 2) / 3) {
            nextSlide();
        }
    };

    const recipientName = data.recipientName || "Someone";
    const creatorName = data.creatorName || "A friend";

    const getEraLabel = (value: string) => {
        const variant = ERA_VARIANTS.find(v => v.id === data.eraVariant) || ERA_VARIANTS[0];
        const options = variant.options || MAIN_CHARACTER_ERAS;
        return options.find(o => o.value === value);
    };

    const getEmotionLabel = (value: string) => {
        const variant = EMOTIONS_VARIANTS.find(v => v.id === data.emotionsVariant) || EMOTIONS_VARIANTS[0];
        const options = variant.options || EMOTIONS;
        const found = options.find(e => e.value === value);
        return found || { label: value, emoji: '✨', value };
    };

    const getImprovementLabel = (value: string) => {
        const variant = IMPROVEMENT_VARIANTS.find(v => v.id === data.improvementVariant) || IMPROVEMENT_VARIANTS[0];
        const options = variant.options || QUIET_IMPROVEMENTS;
        return options.find(i => i.value === value)?.label || value;
    };

    // Get variant display prefixes
    const eraVariant = ERA_VARIANTS.find(v => v.id === data.eraVariant) || ERA_VARIANTS[0];
    const phraseVariant = PHRASE_VARIANTS.find(v => v.id === data.phraseVariant) || PHRASE_VARIANTS[0];
    const emotionsVariant = EMOTIONS_VARIANTS.find(v => v.id === data.emotionsVariant) || EMOTIONS_VARIANTS[0];
    const obsessionsVariant = OBSESSIONS_VARIANTS.find(v => v.id === data.obsessionsVariant) || OBSESSIONS_VARIANTS[0];
    const favoritesVariant = FAVORITES_VARIANTS.find(v => v.id === data.favoritesVariant) || FAVORITES_VARIANTS[0];
    const improvementVariant = IMPROVEMENT_VARIANTS.find(v => v.id === data.improvementVariant) || IMPROVEMENT_VARIANTS[0];
    const creatorVariant = CREATOR_VARIANTS.find(v => v.id === data.creatorVariant) || CREATOR_VARIANTS[0];

    // Deterministic Helpers
    const getSeed = (id?: string, data?: Partial<WrappedData>): number => {
        const str = id || JSON.stringify(data) || 'default-seed';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    const getDeterministicIndex = (seed: number, length: number, offset: number = 0): number => {
        return (seed + offset) % length;
    };

    const getDeterministicNumber = (seed: number, min: number, max: number, offset: number = 0): number => {
        const random = Math.sin(seed + offset) * 10000;
        const normalized = random - Math.floor(random);
        return Math.floor(normalized * (max - min + 1)) + min;
    };

    const seed = getSeed(wrappedId, data);

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

    // Memoize the random number so it doesn't change on re-renders
    const phraseCount = useState(() => getDeterministicNumber(seed, 200, 700, 1))[0];

    const slides = [
        // Slide 1: Cover
        {
            id: 'cover',
            content: (
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
            )
        },
        // Slide 2: Relationship context
        {
            id: 'relationship',
            content: (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 opacity-0 animate-fade-up">
                        {creatorVariant.id === 'message' ? "A message for you" : `As told by ${creatorName}`}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4 opacity-0 animate-fade-up delay-200">
                        {INTRO_ALTERNATES[getDeterministicIndex(seed, INTRO_ALTERNATES.length, 2)]}
                        <br />
                        <span className="text-primary">{data.relationship ? RELATIONSHIP_LABELS[data.relationship].toLowerCase() : 'someone special'}</span>
                    </h2>
                    <p className="text-2xl text-muted-foreground opacity-0 animate-fade-up delay-400">
                        become even more themselves.
                    </p>
                </div>
            )
        },
        // Slide 3: Main Character Era
        {
            id: 'era',
            content: (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {eraVariant.displayPrefix}
                    </p>
                    <div className="opacity-0 animate-fade-up delay-200">
                        <span className="text-6xl md:text-7xl mb-6 block">
                            {getEraLabel(data.mainCharacterEra || '')?.emoji}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-light text-foreground">
                            <span className="text-primary">
                                {eraVariant.displaySuffix}{" "}
                                {getEraLabel(data.mainCharacterEra || '')?.label || 'Unknown Era'}
                            </span>
                        </h2>
                    </div>
                </div>
            )
        },
        // Slide 4: Top Phrase
        {
            id: 'phrase',
            content: (
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
            )
        },
        // Slide 5: Top Emotions
        {
            id: 'emotions',
            content: (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {emotionsVariant.displayPrefix}
                    </p>
                    <div className="space-y-4 max-w-sm mx-auto">
                        {data.topEmotions?.map((emotion, index) => {
                            const emotionData = getEmotionLabel(emotion);
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
            )
        },
        // Slide 6: Obsessions
        {
            id: 'obsessions',
            content: (
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
            )
        },
        // Slide 7: Favorites
        {
            id: 'favorites',
            content: (
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
            )
        },
        // Slide 8: Quiet Improvement
        {
            id: 'improvement',
            content: (
                <div className="text-center">
                    <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm opacity-0 animate-fade-up">
                        {improvementVariant.displayPrefix}
                    </p>
                    <h2 className="text-3xl md:text-4xl font-light text-foreground mb-6 opacity-0 animate-fade-up delay-200">
                        {IMPROVEMENT_INTRO_ALTERNATES[getDeterministicIndex(seed, IMPROVEMENT_INTRO_ALTERNATES.length, 4)]}
                    </h2>
                    <p className="text-2xl md:text-3xl text-primary opacity-0 animate-fade-up delay-400">
                        {getImprovementLabel(data.quietImprovement || '')}
                    </p>
                    <p className="text-muted-foreground mt-8 text-lg opacity-0 animate-fade-up delay-600">
                        {IMPROVEMENT_OUTRO_ALTERNATES[getDeterministicIndex(seed, IMPROVEMENT_OUTRO_ALTERNATES.length, 5)]}
                    </p>
                </div>
            )
        },
        // Slide 8: Outro
        {
            id: 'outro',
            content: (
                <div className="text-center">
                    {data.outroMessage === 'summary' ? (
                        <>
                            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                                2025: The Year of
                                <br />
                                <span className="text-primary">{getEraLabel(data.mainCharacterEra || '')?.label || 'Change'}</span>
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200">
                                Defined by {getEmotionLabel(data.topEmotions?.[0] || '')?.label?.toLowerCase() || 'emotions'}, {data.obsessions?.[0] || 'obsessions'}, and being unapologetically you.
                            </p>
                        </>
                    ) : data.outroMessage === 'default' ? (
                        <>
                            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                                Here's to {recipientName}
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200 whitespace-pre-wrap">
                                {OUTRO_DEFAULT_ALTERNATES[getDeterministicIndex(seed, OUTRO_DEFAULT_ALTERNATES.length, 6)]}
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
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
            )
        }
    ];

    const currentTheme = THEMES.find(t => t.id === data.accentTheme) || THEMES[0];

    return (
        <div>
            <div
                ref={slideRef}
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
                    {/* Corner Accents */}
                    {/* <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-white/20 rounded-tl-3xl" />
                    <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-tr-3xl" />
                    <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-white/20 rounded-bl-3xl" />
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-white/20 rounded-br-3xl" /> */}

                    {/* Decorative Grid */}
                    {/* <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                            backgroundSize: '100px 100px'
                        }}
                    /> */}

                    {/* Barcode / ID */}
                    {/* <div className="absolute bottom-12 left-12 flex flex-col gap-1">
                        <div className="flex gap-1 h-8 items-end opacity-50">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="bg-white w-1" style={{ height: `${Math.random() * 100}%` }} />
                            ))}
                        </div>
                        <div className="text-[10px] font-mono text-white/40 tracking-widest">
                            ID: 2025-WRAPPED-{Math.floor(Math.random() * 10000)}
                        </div>
                    </div> */}

                </div>

                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow"
                    />
                </div>

                {/* Progress Bars (Story Style) */}
                <div className="absolute top-4 left-0 right-0 z-50 flex gap-1.5 px-2 no-capture">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className="h-1 flex-1 bg-[hsl(var(--progress-track))] rounded-full overflow-hidden"
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

                {/* Save Button */}
                <div className="absolute top-8 right-4 z-50 no-capture flex gap-2">
                    {data.bgMusic && data.bgMusic !== 'none' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMuted(!isMuted);
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary/50 hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent slide navigation
                            handleSaveSlide();
                        }}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Download className="w-5 h-5" />
                        )}
                    </Button>
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
                    {/* Left Zone (Implicit) */}
                    {/* Center Zone (Implicit) */}
                    {/* Right Zone (Implicit) */}
                </div>

                {/* Main content */}
                <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-20 relative z-40 pointer-events-none">
                    <div className="w-full relative max-w-2xl mx-auto">
                        <div key={currentSlide} className={cn(isAnimating && "pointer-events-none", "relative")}>
                            {slides[currentSlide].content}
                        </div>
                    </div>
                </main>

                {/* Branding Footer */}
                <div className="absolute bottom-6 left-0 right-0 text-center z-40 pointer-events-none">
                    <p className="text-[12px] uppercase tracking-[0.3em] text-primary/40 font-medium">
                        yourwrapped.com
                    </p>
                    {/* <p className="text-[8px] text-white/20 mt-1">
                        Generated on {new Date().toLocaleDateString()}
                    </p> */}
                </div>
                {/* Keyboard navigation hint */}
                <div className="fixed text-center bottom-16 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 no-capture">
                    Tap sides to navigate
                </div>
            </div>
        </div>

    );
};

export default WrappedSlides;
