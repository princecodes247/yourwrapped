import { useEffect, useState } from 'react';
import { ThemeConfig } from '@/types/wrapped';
import { cn } from '@/lib/utils';

interface ThemeBackgroundProps {
    theme?: ThemeConfig;
}

export default function ThemeBackground({ theme }: ThemeBackgroundProps) {
    const [layers, setLayers] = useState<{ id: string; gradient?: string }[]>([]);

    useEffect(() => {
        if (!theme) return;

        setLayers(prev => {
            // If the new theme is the same as the last one, do nothing
            if (prev.length > 0 && prev[prev.length - 1].id === theme.id) {
                return prev;
            }

            // Add new layer
            const newLayer = { id: theme.id, gradient: theme.gradient };

            // Keep only the last 2 layers to manage performance
            const newLayers = [...prev, newLayer].slice(-2);
            return newLayers;
        });
    }, [theme]);

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-background transition-colors duration-500">
            {layers.map((layer, index) => (
                <div
                    key={layer.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-700 ease-in-out",
                        // If it's the last layer (current), opacity 1. Others opacity 0?
                        // Actually, we want the new one to fade IN on top of the old one.
                        // So all layers should be opacity 1, but stacked.
                        // But if we remove old layers, they disappear instantly.
                        // Strategy: Stack them. Newest on top. Newest starts opacity 0 then goes to 1.
                        // Wait, simpler: Just render the last 2. Bottom one is visible. Top one fades in.
                        index === layers.length - 1 ? "opacity-100" : "opacity-100"
                        // If we just stack them, the top one covers the bottom one.
                        // We need the *entering* one to fade in.
                    )}
                    style={{
                        backgroundImage: layer.gradient,
                        zIndex: index
                    }}
                >
                    {/* To animate entry, we need a mounting animation or CSS keyframes. 
                        Let's use a simple keyframe animation for the entering layer.
                    */}
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            ))}
            {/* 
                Alternative: 
                Just use a single div with transition-all. 
                Browsers can interpolate some gradients, but not all.
                Let's try the simple transition first as it's most performant.
             */}
            <div
                className="absolute inset-0 transition-[background-image] duration-1000 ease-in-out"
                style={{ backgroundImage: theme?.gradient }}
            />
        </div>
    );
}
