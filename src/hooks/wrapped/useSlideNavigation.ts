import { useEffect, useState, SetStateAction } from "react";

interface UseSlideNavigationProps {
    totalSlides: number;
    currentSlide: number;
    setCurrentSlide: (slide: number | SetStateAction<number>) => void;
    slideDuration?: number;
}

export const useSlideNavigation = ({
    totalSlides,
    currentSlide,
    setCurrentSlide,
    slideDuration = 5000
}: UseSlideNavigationProps) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

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
                    if (currentSlide < totalSlides - 1) {
                        setCurrentSlide((curr) => curr + 1);
                        return 0;
                    } else {
                        return 100;
                    }
                }
                return prev + (100 / (slideDuration / 100));
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentSlide, isPaused, totalSlides, slideDuration, setCurrentSlide]);

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
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

    return {
        isAnimating,
        progress,
        isPaused,
        setIsPaused,
        handleTap
    };
};
