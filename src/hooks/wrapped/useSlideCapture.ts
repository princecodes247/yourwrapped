import { useState, RefObject } from "react";
import { toPng } from 'html-to-image';

export const useSlideCapture = (slideRef: RefObject<HTMLDivElement>, currentSlide: number) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSlide = async () => {
        if (!slideRef.current) return;

        setIsSaving(true);
        try {
            const cloneRef = slideRef.current;
            cloneRef.setAttribute('data-capture', 'on');
            const dataUrl = await toPng(cloneRef, {
                cacheBust: true,
                pixelRatio: 2,
                filter: (node) => {
                    if (node instanceof HTMLElement && node.classList.contains('no-capture')) {
                        return false;
                    }
                    return true;
                },
            });
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

    return {
        isSaving,
        handleSaveSlide
    };
};
