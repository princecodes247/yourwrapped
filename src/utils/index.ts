import {
    WrappedData,
    ERA_VARIANTS,
    MAIN_CHARACTER_ERAS,
    EMOTIONS_VARIANTS,
    EMOTIONS,
    IMPROVEMENT_VARIANTS,
    QUIET_IMPROVEMENTS,
    RELATIONSHIP_LABELS
} from "@/types/wrapped";

// Deterministic Helpers
export const getSeed = (id?: string, data?: Partial<WrappedData>): number => {
    const str = id || JSON.stringify(data) || 'default-seed';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const getDeterministicIndex = (seed: number, length: number, offset: number = 0): number => {
    return (seed + offset) % length;
};

export const getDeterministicNumber = (seed: number, min: number, max: number, offset: number = 0): number => {
    const random = Math.sin(seed + offset) * 10000;
    const normalized = random - Math.floor(random);
    return Math.floor(normalized * (max - min + 1)) + min;
};

// Label Helpers
export const getEraLabel = (data: Partial<WrappedData>, value: string) => {
    const variant = ERA_VARIANTS.find(v => v.id === data.eraVariant) || ERA_VARIANTS[0];
    const options = variant.options || MAIN_CHARACTER_ERAS;
    return options.find(o => o.value === value);
};

export const getEmotionLabel = (data: Partial<WrappedData>, value: string) => {
    const variant = EMOTIONS_VARIANTS.find(v => v.id === data.emotionsVariant) || EMOTIONS_VARIANTS[0];
    const options = variant.options || EMOTIONS;
    const found = options.find(e => e.value === value);
    return found || { label: value, emoji: '✨', value };
};

export const getImprovementLabel = (data: Partial<WrappedData>, value: string) => {
    const variant = IMPROVEMENT_VARIANTS.find(v => v.id === data.improvementVariant) || IMPROVEMENT_VARIANTS[0];
    const options = variant.options || QUIET_IMPROVEMENTS;
    return options.find(i => i.value === value)?.label || value;
};

export const getRelationshipLabel = (value: string) => {
    return RELATIONSHIP_LABELS[value as keyof typeof RELATIONSHIP_LABELS] || 'someone special';
};
