import { useState, useEffect } from "react";

export const CountUp = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
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
