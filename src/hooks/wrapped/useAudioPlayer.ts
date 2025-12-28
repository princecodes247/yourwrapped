import { useEffect, useRef, useState } from "react";
import { MUSIC_OPTIONS } from "@/types/wrapped";

export const useAudioPlayer = (bgMusic?: string) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!bgMusic || bgMusic === 'none') return;

        const musicOption = MUSIC_OPTIONS.find(m => m.value === bgMusic);
        if (!musicOption) return;

        // Create audio element if it doesn't exist
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }

        let src = '';
        switch (bgMusic) {
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
                src = '/acoustic-guitar.mp3';
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
                    audioRef.current.muted = isMuted;
                    await audioRef.current.play();
                } catch (err) {
                    console.log("Auto-play prevented:", err);
                    // Add one-time click listener to start audio
                    const handleInteraction = async () => {
                        if (audioRef.current) {
                            try {
                                await audioRef.current.play();
                                document.removeEventListener('click', handleInteraction);
                                document.removeEventListener('touchstart', handleInteraction);
                            } catch (e) {
                                console.log("Interaction play failed:", e);
                            }
                        }
                    };

                    document.addEventListener('click', handleInteraction);
                    document.addEventListener('touchstart', handleInteraction);
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
    }, [bgMusic]);

    // Handle mute toggle
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    return {
        isMuted,
        setIsMuted,
        isAudioLoading,
        hasMusic: bgMusic && bgMusic !== 'none'
    };
};
