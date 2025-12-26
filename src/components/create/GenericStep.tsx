import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useWrappedStore } from "@/store/wrappedStore";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";
import { StepConfig } from "@/types/step-config";
import { WrappedData } from "@/types/wrapped";

interface GenericStepProps {
    config: StepConfig;
    stepNumber: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
}

const GenericStep = ({
    config,
    stepNumber,
    totalSteps,
    onNext,
    onBack,
}: GenericStepProps) => {
    const navigate = useNavigate();
    const { wrappedData, updateWrappedData } = useWrappedStore();

    // State for value and variant
    const [value, setValue] = useState<any>(wrappedData[config.dataKey]);
    const [variantId, setVariantId] = useState<string | undefined>(
        config.variantKey ? (wrappedData[config.variantKey] as string) : undefined
    );

    // Initialize variant if needed
    useEffect(() => {
        if (config.variants && !variantId) {
            setVariantId(config.variants[0].id);
        }
    }, [config.variants, variantId]);

    useEffect(() => {
        setValue(config.type === 'text' || config.type === 'text-with-suggestions' ? '' : config.type === "list-builder" || config.type === "multi-select" ? [] : undefined);
    }, [config.type]);

    // Get current variant and options
    const currentVariant = config.variants?.length ? (config.variants.find(v => v.id === variantId) || config.variants[0]) : undefined;
    const currentOptions = currentVariant?.options || config.staticOptions || [];

    // Handle variant change
    const handleVariantChange = (newVariantId: string) => {
        setVariantId(newVariantId);
        // Reset value on variant change
        if (Array.isArray(value)) {
            setValue([]);
        } else {
            setValue(config.type === 'text' || config.type === 'text-with-suggestions' ? '' : undefined);
        }
    };

    // Input handlers
    const handleTextChange = (text: string) => {
        setValue(text);
    };

    const handleSingleSelect = (selectedValue: string) => {
        setValue(selectedValue);
    };

    const handleMultiSelect = (selectedValue: string) => {
        const currentArray = (value as string[]) || [];
        if (currentArray.includes(selectedValue)) {
            setValue(currentArray.filter(v => v !== selectedValue));
        } else if (!config.maxSelections || currentArray.length < config.maxSelections) {
            setValue([...currentArray, selectedValue]);
        }
    };

    const [inputValue, setInputValue] = useState("");

    const handleListAdd = (itemToAdd?: string) => {
        const text = itemToAdd || inputValue.trim();
        const currentArray = (value as string[]) || [];

        if (text && (!config.maxSelections || currentArray.length < config.maxSelections) && !currentArray.includes(text)) {
            setValue([...currentArray, text]);
            if (!itemToAdd) setInputValue("");
        }
    };

    const handleListRemove = (index: number) => {
        const currentArray = (value as string[]) || [];
        setValue(currentArray.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleListAdd();
        }
    };

    // Validation
    const isValid = () => {
        if (currentVariant?.hideInput) return true;
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return !!value && (typeof value === 'string' ? value.trim().length > 0 : true);
    };

    // Navigation
    const handleNextStep = () => {
        const updates: Partial<WrappedData> = {
            [config.dataKey]: value as any,
        };
        if (config.variantKey && variantId) {
            updates[config.variantKey] = variantId as any;
        }

        updateWrappedData(updates);

        if (config.customNextAction) {
            config.customNextAction({ ...wrappedData, ...updates } as WrappedData, navigate);
        } else {
            onNext();
        }
    };

    // Render helpers
    const renderInput = () => {
        if (currentVariant?.hideInput) return null;

        switch (config.type) {
            case 'text':
            case 'text-with-suggestions':
                return (
                    <div className="w-full">
                        <Input
                            type="text"
                            placeholder={config.placeholder}
                            value={value as string || ""}
                            onChange={(e) => handleTextChange(e.target.value)}
                            className="text-center text-lg h-14"
                            autoFocus
                        />
                        {config.type === 'text-with-suggestions' && currentOptions.length > 0 && (
                            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                                {currentOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleTextChange(option.label)}
                                        className={cn(
                                            "text-xs px-3 py-1.5 rounded-full border transition-all duration-200",
                                            value === option.label
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                        )}
                                    >
                                        {option.emoji} {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'single-select':
                return (
                    <div className={cn(
                        "grid gap-3",
                        currentOptions.length > 6 ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2"
                    )}>
                        {currentOptions.map((option, index) => (
                            <button
                                key={option.value}
                                onClick={() => handleSingleSelect(option.value)}
                                className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left",
                                    value === option.value
                                        ? "border-primary bg-primary/10 text-foreground"
                                        : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
                                )}
                                style={{ animationDelay: `${200 + index * 50}ms` }}
                            >
                                {option.emoji && <span className="text-2xl">{option.emoji}</span>}
                                <span className="text-sm font-medium">{option.label}</span>
                            </button>
                        ))}
                    </div>
                );

            case 'multi-select':
                return (
                    <div>
                        <div className="grid grid-cols-2 gap-3">
                            {currentOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleMultiSelect(option.value)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                                        (value as string[])?.includes(option.value)
                                            ? "border-primary bg-primary/10 text-foreground"
                                            : "border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground/50 hover:bg-secondary/50"
                                    )}
                                >
                                    {option.emoji && <span className="text-xl">{option.emoji}</span>}
                                    <span className="text-sm font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>
                        {config.maxSelections && (
                            <p className="text-xs text-muted-foreground mt-4">
                                {(value as string[])?.length || 0}/{config.maxSelections} selected
                            </p>
                        )}
                    </div>
                );

            case 'list-builder':
                return (
                    <div>
                        {/* Tags display */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[40px]">
                            {(value as string[])?.map((item, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30"
                                >
                                    <span className="text-sm font-medium">{item}</span>
                                    <button
                                        onClick={() => handleListRemove(index)}
                                        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {(!config.maxSelections || (value as string[])?.length < config.maxSelections) && (
                            <div>
                                <Input
                                    type="text"
                                    placeholder={config.placeholder}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => handleListAdd()}
                                    className="text-center text-lg h-14"
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground mt-3">
                                    Press Enter to add · {(value as string[])?.length || 0}/{config.maxSelections} added
                                </p>
                            </div>
                        )}

                        {currentOptions.length > 0 && (!config.maxSelections || (value as string[])?.length < config.maxSelections) && (
                            <div className="mt-8">
                                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Ideas</p>
                                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                                    {currentOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleListAdd(option.label)}
                                            disabled={(value as string[])?.includes(option.label)}
                                            className={cn(
                                                "text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5",
                                                (value as string[])?.includes(option.label)
                                                    ? "opacity-50 cursor-not-allowed bg-secondary/20 border-transparent"
                                                    : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                            )}
                                        >
                                            {option.emoji && <span>{option.emoji}</span>}
                                            <span>{option.label}</span>
                                            <Plus className="w-3 h-3 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const title = typeof config.title === 'function' ? config.title(wrappedData) : config.title;
    const subtitle = typeof config.subtitle === 'function' ? config.subtitle(wrappedData) : config.subtitle;
    const question = currentVariant?.question;

    return (
        <StepLayout
            stepNumber={stepNumber}
            totalSteps={totalSteps}
            onNext={handleNextStep}
            onBack={onBack}
            canProgress={isValid()}
            showBack={config.showBack ?? true}
            nextLabel={config.nextLabel}
        >
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-light text-foreground mb-2 opacity-0 animate-fade-up">
                    {title}
                </h2>

                {config.variants && config.variants.length > 0 && (
                    <div className="mb-4">
                        <VariantSelector
                            variants={config.variants}
                            selectedVariant={variantId || config.variants[0].id}
                            onSelect={handleVariantChange}
                        />
                    </div>
                )}

                {(subtitle || question) && (
                    <p className="text-muted-foreground text-lg mb-10 opacity-0 animate-fade-up delay-100">
                        {question || subtitle}
                        {config.type === 'list-builder' && config.maxSelections && ` (Add up to ${config.maxSelections})`}
                    </p>
                )}

                <div className="opacity-0 animate-fade-up delay-200">
                    {renderInput()}
                </div>
            </div>
        </StepLayout>
    );
};

export default GenericStep;
