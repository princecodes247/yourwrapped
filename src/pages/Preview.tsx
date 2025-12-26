import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWrappedStore } from "@/store/wrappedStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import {
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

} from "@/types/wrapped";
import { cn } from "@/lib/utils";
import { encodeData, decodeData } from "@/lib/share";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const Preview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wrappedData, updateWrappedData } = useWrappedStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    if (location.pathname === '/share') {
      setIsSharedView(true);
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get('id');
      if (id) {
        const decoded = decodeData(id);
        if (decoded) {
          updateWrappedData(decoded);
        }
      }
    }
  }, [location, updateWrappedData]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const recipientName = wrappedData.recipientName || "Someone";
  const creatorName = wrappedData.creatorName || "A friend";

  const getEraLabel = (value: string) => {
    const variant = ERA_VARIANTS.find(v => v.id === wrappedData.eraVariant) || ERA_VARIANTS[0];
    const options = variant.options || MAIN_CHARACTER_ERAS;
    return options.find(o => o.value === value);
  };

  const getEmotionLabel = (value: string) => {
    const variant = EMOTIONS_VARIANTS.find(v => v.id === wrappedData.emotionsVariant) || EMOTIONS_VARIANTS[0];
    const options = variant.options || EMOTIONS;
    const found = options.find(e => e.value === value);
    return found || { label: value, emoji: '✨', value };
  };

  const getImprovementLabel = (value: string) => {
    const variant = IMPROVEMENT_VARIANTS.find(v => v.id === wrappedData.improvementVariant) || IMPROVEMENT_VARIANTS[0];
    const options = variant.options || QUIET_IMPROVEMENTS;
    return options.find(i => i.value === value)?.label || value;
  };

  // Get variant display prefixes
  const eraVariant = ERA_VARIANTS.find(v => v.id === wrappedData.eraVariant) || ERA_VARIANTS[0];
  const phraseVariant = PHRASE_VARIANTS.find(v => v.id === wrappedData.phraseVariant) || PHRASE_VARIANTS[0];
  const emotionsVariant = EMOTIONS_VARIANTS.find(v => v.id === wrappedData.emotionsVariant) || EMOTIONS_VARIANTS[0];
  const obsessionsVariant = OBSESSIONS_VARIANTS.find(v => v.id === wrappedData.obsessionsVariant) || OBSESSIONS_VARIANTS[0];
  const favoritesVariant = FAVORITES_VARIANTS.find(v => v.id === wrappedData.favoritesVariant) || FAVORITES_VARIANTS[0];
  const improvementVariant = IMPROVEMENT_VARIANTS.find(v => v.id === wrappedData.improvementVariant) || IMPROVEMENT_VARIANTS[0];
  const creatorVariant = CREATOR_VARIANTS.find(v => v.id === wrappedData.creatorVariant) || CREATOR_VARIANTS[0];


  const handleShare = () => {
    const encoded = encodeData(wrappedData as any);
    const url = `${window.location.origin}/share?id=${encoded}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

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
            This year, I got to watch
            <br />
            <span className="text-primary">{wrappedData.relationship ? RELATIONSHIP_LABELS[wrappedData.relationship].toLowerCase() : 'someone special'}</span>
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
              {getEraLabel(wrappedData.mainCharacterEra || '')?.emoji}
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-foreground">
              {eraVariant.displaySuffix}{" "}
              <span className="text-primary">
                {getEraLabel(wrappedData.mainCharacterEra || '')?.label || 'Unknown Era'}
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
            "{wrappedData.topPhrase}"
          </h2>
          <p className="text-muted-foreground text-lg opacity-0 animate-fade-up delay-400 counter-reveal">
            Used approximately <span className="text-primary font-medium">{Math.floor(Math.random() * 500 + 200)}</span> times
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
            {wrappedData.topEmotions?.map((emotion, index) => {
              const emotionData = getEmotionLabel(emotion);
              const width = index === 0 ? 95 : 75;
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
            {wrappedData.obsessions?.map((obs, index) => (
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
            {wrappedData.favorites?.map((fav, index) => (
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
            This year, {recipientName} got better at
          </h2>
          <p className="text-2xl md:text-3xl text-primary opacity-0 animate-fade-up delay-400">
            {getImprovementLabel(wrappedData.quietImprovement || '')}
          </p>
          <p className="text-muted-foreground mt-8 text-lg opacity-0 animate-fade-up delay-600">
            And it didn't go unnoticed.
          </p>
        </div>
      )
    },
    // Slide 8: Outro
    {
      id: 'outro',
      content: (
        <div className="text-center">
          {wrappedData.outroMessage === 'summary' ? (
            <>
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                2025: The Year of
                <br />
                <span className="text-primary">{getEraLabel(wrappedData.mainCharacterEra || '')?.label || 'Change'}</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200">
                Defined by {getEmotionLabel(wrappedData.topEmotions?.[0] || '')?.label?.toLowerCase() || 'emotions'}, {wrappedData.obsessions?.[0] || 'obsessions'}, and being unapologetically you.
              </p>
            </>
          ) : wrappedData.outroMessage === 'default' ? (
            <>
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                Here's to {recipientName}
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200">
                For being exactly who they are. For growing. For showing up.
                For making 2025 unforgettable.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8 opacity-0 animate-fade-up">
                For {recipientName}
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto opacity-0 animate-fade-up delay-200 whitespace-pre-wrap italic">
                "{wrappedData.outroMessage || 'You are amazing.'}"
              </p>
            </>
          )}
          <div className="opacity-0 animate-fade-up delay-400">
            <p className="text-primary text-lg font-medium mb-6">
              {creatorVariant.id === 'message' ? creatorName : `With love, ${creatorName}`}
            </p>
            <Button variant="emotional" size="lg" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share this Wrapped
            </Button>
          </div>
        </div>
      )
    }
  ];

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 5000; // 5 seconds per slide

  useEffect(() => {
    if (location.pathname === '/share') {
      setIsSharedView(true);
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get('id');
      if (id) {
        const decoded = decodeData(id);
        if (decoded) {
          updateWrappedData(decoded);
        }
      }
    }
  }, [location, updateWrappedData]);

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
            // Stop at the end
            return 100;
          }
        }
        return prev + (100 / (SLIDE_DURATION / 100)); // Update every 100ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused, slides.length]);


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



  // // Redirect if no data
  // if (!wrappedData.recipientName) {
  //   navigate('/create');
  //   return null;
  // }

  return (
    <div>
      {!isSharedView && (
        <div className="bg-primary/10 text-primary text-center py-2 px-4 text-sm font-medium z-50">
          Previewing your Wrapped. <button onClick={() => navigate('/create')} className="underline hover:text-primary/80">Back to Editing</button>
        </div>
      )}
      <div className="min-h-[100dvh] relative bg-background flex flex-col supports-[min-height:100dvh]:min-h-[100dvh]">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow"
          />
        </div>

        {/* Progress Bars (Story Style) */}
        <div className="absolute top-4 left-0 right-0 z-50 flex gap-1.5 px-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: index < currentSlide ? '100%' :
                    index === currentSlide ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Tap Zones */}
        <div
          className="absolute inset-0 z-30 flex"
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
        <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-20 relative z-10">
          <div className="w-full max-w-2xl mx-auto">
            <div key={currentSlide} className={cn(isAnimating && "pointer-events-none")}>
              {slides[currentSlide].content}
            </div>
          </div>
        </main>

        {/* Keyboard navigation hint */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40">
          Use ← → arrows or tap sides to navigate
        </div>
      </div>
    </div>
  );
};

export default Preview;
