import { WrappedData, QuestionVariant, Option } from './wrapped';
import { NavigateFunction } from 'react-router-dom';

export type StepInputType =
    | 'text'
    | 'text-with-suggestions'
    | 'single-select'
    | 'multi-select'
    | 'list-builder';

export interface StepConfig {
    id: string;
    type: StepInputType;

    // Data binding
    dataKey: keyof WrappedData;
    variantKey?: keyof WrappedData;

    // Content
    title: string | ((data: Partial<WrappedData>) => string);
    subtitle?: string | ((data: Partial<WrappedData>) => string);

    // Variants & Options
    variants?: QuestionVariant[];
    staticOptions?: Option[]; // For steps without variants like Relationship

    // Input specific
    placeholder?: string;
    maxSelections?: number; // For multi-select and list-builder

    // Navigation
    showBack?: boolean;
    nextLabel?: string;
    customNextAction?: (data: Partial<WrappedData>, navigate: NavigateFunction) => void;

    // Custom features
    showPercentages?: boolean;
}
