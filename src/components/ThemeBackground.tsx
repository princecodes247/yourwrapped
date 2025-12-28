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
            <div
                className="absolute inset-0 transition-[background-image] duration-1000 ease-in-out"
                style={{ backgroundImage: theme?.gradient }}
            />
        </div>
    );
}
