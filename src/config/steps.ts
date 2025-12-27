import { StepConfig } from "@/types/step-config";
import {
    ERA_VARIANTS,
    PHRASE_VARIANTS,
    EMOTIONS_VARIANTS,
    OBSESSIONS_VARIANTS,
    FAVORITES_VARIANTS,
    IMPROVEMENT_VARIANTS,
    CREATOR_VARIANTS,
    THEMES,
    RelationshipType
} from "@/types/wrapped";

const RELATIONSHIP_OPTIONS = [
    { value: 'partner', label: 'Partner', emoji: '💕' },
    { value: 'other', label: 'Someone Special', emoji: '✨' },
    { value: 'best-friend', label: 'Best Friend', emoji: '👯' },
    { value: 'friend', label: 'Friend', emoji: '🤝' },
    { value: 'sibling', label: 'Sibling', emoji: '👨‍👩‍👧‍👦' },
    { value: 'parent', label: 'Parent', emoji: '👨‍👧' },
    { value: 'child', label: 'Child', emoji: '👶' },
    { value: 'enemy', label: 'Enemy', emoji: '😈' },
];

export const steps: StepConfig[] = [
    {
        id: 'name',
        type: 'text',
        dataKey: 'recipientName',
        title: 'Who is this Wrapped for?',
        subtitle: 'Enter their first name',
        placeholder: 'Their name',
        showBack: false,
    },
    {
        id: 'relationship',
        type: 'single-select',
        dataKey: 'relationship',
        title: (data) => `${data.recipientName} is your...`,
        subtitle: 'This helps us personalize the experience',
        staticOptions: RELATIONSHIP_OPTIONS,
    },
    {
        id: 'theme',
        type: 'single-select',
        dataKey: 'theme',
        title: 'Choose a vibe',
        subtitle: 'Select a color theme for the experience',
        staticOptions: THEMES.map(t => ({ value: t.id, label: t.label, emoji: t.emoji })),
    },
    {
        id: 'era',
        type: 'single-select',
        dataKey: 'mainCharacterEra',
        variantKey: 'eraVariant',
        title: (data) => `${data.recipientName}'s 2025 was their...`,
        variants: ERA_VARIANTS,
    },
    {
        id: 'phrase',
        type: 'text-with-suggestions',
        dataKey: 'topPhrase',
        variantKey: 'phraseVariant',
        title: (data) => `${data.recipientName}'s signature phrase`,
        variants: PHRASE_VARIANTS,
        placeholder: "e.g. That's wild, I'm so tired",
    },
    {
        id: 'emotions',
        type: 'multi-select',
        dataKey: 'topEmotions',
        variantKey: 'emotionsVariant',
        title: (data) => `${data.recipientName}'s top emotions`,
        variants: EMOTIONS_VARIANTS,
        maxSelections: 3,
    },
    {
        id: 'obsessions',
        type: 'list-builder',
        dataKey: 'obsessions',
        variantKey: 'obsessionsVariant',
        title: (data) => `${data.recipientName}'s 2025 obsessions`,
        variants: OBSESSIONS_VARIANTS,
        maxSelections: 3,
        placeholder: "e.g. Taylor Swift, cold plunges, sourdough",
    },
    {
        id: 'favorites',
        type: 'list-builder',
        dataKey: 'favorites',
        variantKey: 'favoritesVariant',
        title: (data) => `${data.recipientName}'s favorites`,
        variants: FAVORITES_VARIANTS,
        maxSelections: 3,
        placeholder: "e.g. Pop, Horror, Shonen",
    },
    {
        id: 'improvement',
        type: 'single-select',
        dataKey: 'quietImprovement',
        variantKey: 'improvementVariant',
        title: 'A quiet improvement',
        variants: IMPROVEMENT_VARIANTS,
    },
    {
        id: 'outro',
        type: 'single-select',
        dataKey: 'outroMessage',
        title: "How should we sign off?",
        staticOptions: [
            {
                value: 'default',
                label: "Keep the classic ending?",
            },
            {
                value: 'summary',
                label: "Show a summary of their year?",
            },
            {
                value: 'dedication',
                label: "Write a custom dedication?",
                allowCustomInput: true,
            }
        ],
    },
    {
        id: 'creator',
        type: 'text-with-suggestions',
        dataKey: 'creatorName',
        variantKey: 'creatorVariant',
        title: "One last thing...",
        subtitle: (data) => `So ${data.recipientName} knows who made this for them`,
        variants: CREATOR_VARIANTS,
        placeholder: 'Your name or sign-off',
        nextLabel: 'Preview Wrapped',
        customNextAction: (data, navigate) => {
            navigate('/preview');
        },
    },
];
