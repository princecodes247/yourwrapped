import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWrappedStore } from "@/store/wrappedStore";
import { FAVORITES_VARIANTS } from "@/types/wrapped";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const StepFavorites = () => {
    const { wrappedData, updateWrappedData, nextStep, prevStep } = useWrappedStore();
    const [favorites, setFavorites] = useState<string[]>(
        wrappedData.favorites || []
    );
    const [currentInput, setCurrentInput] = useState("");
    const [variant, setVariant] = useState(wrappedData.favoritesVariant || FAVORITES_VARIANTS[0].id);

    const currentVariant = FAVORITES_VARIANTS.find(v => v.id === variant) || FAVORITES_VARIANTS[0];
    const currentOptions = currentVariant.options;

    const addFavorite = (value?: string) => {
        const textToAdd = value || currentInput.trim();
        if (textToAdd && favorites.length < 3 && !favorites.includes(textToAdd)) {
            setFavorites([...favorites, textToAdd]);
            if (!value) setCurrentInput("");
        }
    };

    const removeFavorite = (index: number) => {
        setFavorites(favorites.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addFavorite();
        }
    };

    const handleNext = () => {
        updateWrappedData({ favorites, favoritesVariant: variant });
        nextStep();
    };

    return (
        <StepLayout
            stepNumber={7}
            totalSteps={9}
            onNext={handleNext}
            onBack={prevStep}
            canProgress={favorites.length >= 1}
        >
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-light text-foreground mb-2 opacity-0 animate-fade-up">
                    {wrappedData.recipientName}'s favorites
                </h2>
                <div className="">
                    <VariantSelector
                        variants={FAVORITES_VARIANTS}
                        selectedVariant={variant}
                        onSelect={(v) => {
                            setVariant(v);
                            setFavorites([]);
                        }}
                    />
                </div>
                <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
                    {currentVariant.question} (Add up to 3)
                </p>

                {/* Tags display */}
                <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[40px] opacity-0 animate-fade-up delay-200">
                    {favorites.map((fav, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30"
                        >
                            <span className="text-sm font-medium">{fav}</span>
                            <button
                                onClick={() => removeFavorite(index)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>

                {favorites.length < 3 && (
                    <div className="opacity-0 animate-fade-up delay-300">
                        <Input
                            type="text"
                            placeholder="e.g. Pop, Horror, Shonen"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => addFavorite()}
                            className="text-center text-lg h-14"
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground mt-3">
                            Press Enter to add · {favorites.length}/3 added
                        </p>
                    </div>
                )}

                {currentOptions && favorites.length < 3 && (
                    <div className="mt-8 opacity-0 animate-fade-up delay-400">
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Ideas</p>
                        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                            {currentOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => addFavorite(option.label)}
                                    disabled={favorites.includes(option.label)}
                                    className={cn(
                                        "text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5",
                                        favorites.includes(option.label)
                                            ? "opacity-50 cursor-not-allowed bg-secondary/20 border-transparent"
                                            : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                >
                                    <span>{option.emoji}</span>
                                    <span>{option.label}</span>
                                    <Plus className="w-3 h-3 opacity-50" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StepLayout>
    );
};

export default StepFavorites;
