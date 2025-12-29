import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useWrappedStore } from "@/store/wrappedStore";
import StepLayout from "./StepLayout";
import VariantSelector from "./VariantSelector";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";
import { StepConfig } from "@/types/step-config";
import { WrappedData, THEMES } from "@/types/wrapped";

interface GenericStepProps {
    config: StepConfig;
    stepNumber: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    hasNextValue?: boolean;
}

const GenericStep = ({
    config,
    stepNumber,
    totalSteps,
    onNext,
    onBack,
    hasNextValue,
}: GenericStepProps) => {
    const navigate = useNavigate();
    const { wrappedData, updateWrappedData } = useWrappedStore();

    // State for value and variant
    const [value, setValue] = useState<any>(() => {
        if (wrappedData[config.dataKey] !== undefined) {
            return wrappedData[config.dataKey];
        }
        // Default values based on type
        if (config.type === 'text' || config.type === 'text-with-suggestions') return '';
        if (config.type === 'list-builder' || config.type === 'multi-select') return [];
        return undefined;
    });
    const [variantId, setVariantId] = useState<string | undefined>(
        config.variantKey ? (wrappedData[config.variantKey] as string) : undefined
    );
    const [customInputValue, setCustomInputValue] = useState("");
    const [isCustomInputActive, setIsCustomInputActive] = useState(false);

    // Initialize variant if needed
    useEffect(() => {
        if (config.variants && !variantId) {
            setVariantId(config.variants[0].id);
        }
    }, [config.variants, variantId]);

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
        setCustomInputValue("");
        setIsCustomInputActive(false);
    };

    // Input handlers
    const handleTextChange = (text: string) => {
        setValue(text);
    };

    const handleSingleSelect = (option: any) => {
        if (option.allowCustomInput) {
            setIsCustomInputActive(true);
            setValue(customInputValue); // Set to current custom input value
        } else {
            setIsCustomInputActive(false);
            setValue(option.value);

            // Immediate update for theme to show color change instantly
            if (config.dataKey === 'accentTheme') {
                updateWrappedData({ [config.dataKey]: option.value });
            }
        }
    };

    const handleCustomInputChange = (text: string) => {
        setCustomInputValue(text);
        setValue(text);
    };

    const handleMultiSelect = (option: any) => {
        if (option.allowCustomInput) {
            // Toggle custom input visibility
            setIsCustomInputActive(!isCustomInputActive);
            if (!isCustomInputActive) {
                // If opening, maybe focus?
            }
        } else {
            if (config.showPercentages) {
                const selectedValue = option.value;
                const currentArray = (value as { id: string, percentage: number }[]) || [];
                const existingIndex = currentArray.findIndex(v => v.id === selectedValue);

                if (existingIndex >= 0) {
                    setValue(currentArray.filter((_, i) => i !== existingIndex));
                } else if (!config.maxSelections || currentArray.length < config.maxSelections) {
                    setValue([...currentArray, { id: selectedValue, percentage: 50 }]);
                }
            } else {
                const selectedValue = option.value;
                const currentArray = (value as string[]) || [];
                if (currentArray.includes(selectedValue)) {
                    setValue(currentArray.filter(v => v !== selectedValue));
                } else if (!config.maxSelections || currentArray.length < config.maxSelections) {
                    setValue([...currentArray, selectedValue]);
                }
            }
        }
    };

    const handleCustomMultiAdd = () => {
        if (!customInputValue.trim()) return;

        const currentArray = (value as string[]) || [];
        if (!config.maxSelections || currentArray.length < config.maxSelections) {
            setValue([...currentArray, customInputValue.trim()]);
            setCustomInputValue("");
            setIsCustomInputActive(false); // Close after adding? Or keep open? Let's close.
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
            // @ts-ignore
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
                        {currentOptions.map((option, index) => {
                            const isSelected = !option.allowCustomInput && value === option.value;
                            const isCustomSelected = option.allowCustomInput && isCustomInputActive;

                            if (config.dataKey === 'accentTheme') {
                                const theme = THEMES.find(t => t.id === option.value);
                                if (!theme) return null;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSingleSelect(option)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left min-h-[72px] active:scale-[0.98] backdrop-blur-sm",
                                            isSelected
                                                ? "btn-glossy-selected text-primary-foreground shadow-sm"
                                                : "btn-glossy-subtle text-foreground hover:bg-card/60"
                                        )}
                                        style={{ animationDelay: `${200 + index * 50}ms` }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full shadow-sm shrink-0"
                                            style={{
                                                background: `linear-gradient(135deg, hsl(${theme.styles['--background']}), hsl(${theme.styles['--primary']}))`
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{option.label}</span>
                                            <span className="text-[10px] opacity-70 capitalize">{theme.isDark ? 'Dark' : 'Light'} Theme</span>
                                        </div>
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSingleSelect(option)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left min-h-[72px] active:scale-[0.98] backdrop-blur-sm",
                                        isSelected || isCustomSelected
                                            ? "btn-glossy-selected text-primary-foreground shadow-sm"
                                            : "btn-glossy-subtle text-foreground hover:bg-card/60"
                                    )}
                                    style={{ animationDelay: `${200 + index * 50}ms` }}
                                >
                                    {option.emoji && <span className="text-2xl">{option.emoji}</span>}
                                    <span className="text-sm font-medium">{option.label}</span>
                                </button>
                            );
                        })}
                        {isCustomInputActive && (
                            <div className={cn("col-span-full animate-fade-up")}>
                                {(() => {
                                    const customOption = currentOptions.find(o => o.allowCustomInput);

                                    return customOption?.inputType === 'textarea' ? (
                                        <Textarea
                                            placeholder="Type your dedication..."
                                            value={customInputValue}
                                            onChange={(e) => handleCustomInputChange(e.target.value)}
                                            className="text-center text-lg min-h-[120px] p-4 text-foreground/70 italic resize-none"
                                            autoFocus
                                        />
                                    ) : (
                                        <Input
                                            type="text"
                                            placeholder="Type your answer..."
                                            value={customInputValue}
                                            onChange={(e) => handleCustomInputChange(e.target.value)}
                                            className="text-center text-lg h-14"
                                            autoFocus
                                        />
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                );

            case 'multi-select':
                return (
                    <div>
                        {/* Tags display for multi-select */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6 min-h-[40px]">
                            {config.showPercentages ? (
                                (value as { id: string, percentage: number }[])?.map((item, index) => {
                                    const option = currentOptions.find(o => o.value === item.id);
                                    return (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30"
                                        >
                                            <span className="text-sm font-medium">{option?.label || item.id}</span>
                                            <span className="text-xs opacity-70">({item.percentage}%)</span>
                                            <button
                                                onClick={() => handleListRemove(index)}
                                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    );
                                })
                            ) : (
                                (value as string[])?.map((item, index) => (
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
                                ))
                            )}
                        </div>

                        {config.showPercentages && (value as { id: string, percentage: number }[])?.length > 0 && (
                            <div className="mt-8 space-y-6 animate-fade-up text-left max-w-md mx-auto bg-card/30 p-6 rounded-xl border border-white/5">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">Adjust Intensity</p>
                                {(value as { id: string, percentage: number }[]).map((item, index) => {
                                    const option = currentOptions.find(o => o.value === item.id);
                                    return (
                                        <div key={item.id} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium flex items-center gap-2">
                                                    {option?.emoji} {option?.label || item.id}
                                                </span>
                                                <span className="text-sm text-muted-foreground font-mono">{item.percentage}%</span>
                                            </div>
                                            <Slider
                                                value={[item.percentage]}
                                                min={0}
                                                max={100}
                                                step={5}
                                                onValueChange={(vals) => {
                                                    const newValue = [...(value as { id: string, percentage: number }[])];
                                                    newValue[index] = { ...newValue[index], percentage: vals[0] };
                                                    setValue(newValue);
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            {currentOptions.map((option) => {
                                const isSelected = config.showPercentages
                                    ? (value as { id: string }[])?.some(v => v.id === option.value)
                                    : (value as string[])?.includes(option.value);

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handleMultiSelect(option)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 min-h-[60px] active:scale-[0.98] backdrop-blur-sm",
                                            isSelected || (option.allowCustomInput && isCustomInputActive)
                                                ? "btn-glossy-selected text-primary-foreground shadow-lg"
                                                : "btn-glossy-subtle text-foreground hover:bg-card/60"
                                        )}
                                    >
                                        {option.emoji && <span className="text-xl">{option.emoji}</span>}
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {isCustomInputActive && (
                            <div className="mt-4 animate-fade-up flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add your own..."
                                    value={customInputValue}
                                    onChange={(e) => setCustomInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomMultiAdd()}
                                    className="text-lg h-12"
                                    autoFocus
                                />
                                <button
                                    onClick={handleCustomMultiAdd}
                                    className="px-4 bg-primary text-primary-foreground rounded-md font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                        {config.maxSelections && (
                            <p className="text-xs text-muted-foreground mt-4">
                                {(value as any[])?.length || 0}/{config.maxSelections} selected
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
                                                "text-xs px-3 py-1.5 rounded-full border transition-all text-muted-foreground duration-200 flex items-center gap-1.5",
                                                (value as string[])?.includes(option.label)
                                                    ? "opacity-50 cursor-not-allowed bg-secondary/20 border-transparent grayscale"
                                                    : "bg-secondary/30 border-transparent hover:bg-secondary/50 hover:text-foreground"
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
            onForward={hasNextValue ? handleNextStep : undefined}
        >
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4 opacity-0 animate-fade-up">
                    {title}
                </h2>

                {config.variants && config.variants.length > 1 && (
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
