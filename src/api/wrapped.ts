import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { WrappedData } from '@/types/wrapped';


// Define Zod schema matching WrappedData
export const WrappedDataSchema = z.object({
    recipientName: z.string(),
    relationship: z.enum(['partner', 'other', 'best-friend', 'friend', 'sibling', 'parent', 'child', 'enemy']),
    accentTheme: z.string().optional(),
    bgMusic: z.string().optional(),
    mainCharacterEra: z.string().optional(),
    eraVariant: z.string().optional(),
    topPhrase: z.string().optional(),
    phraseVariant: z.string().optional(),
    topEmotions: z.array(z.object({ id: z.string(), percentage: z.number() })).optional(),
    emotionsVariant: z.string().optional(),
    obsessions: z.array(z.string()).optional(),
    obsessionsVariant: z.string().optional(),
    favorites: z.array(z.string()).optional(),
    favoritesVariant: z.string().optional(),
    quietImprovement: z.array(z.string()).optional(),
    improvementVariant: z.string().optional(),
    outroMessage: z.string().optional(),
    outroVariant: z.string().optional(), // Kept for compatibility if needed
    creatorName: z.string().optional(),
    creatorVariant: z.string().optional(),
});

export type WrappedDataResponse = z.infer<typeof WrappedDataSchema>;

export const getWrapped = async (id: string): Promise<WrappedData> => {
    if (!id) {
        throw new Error('Invalid ID');
    }

    const data = await apiClient.get<WrappedData>(`/wrapped/${id}`);
    // return WrappedDataSchema.parse(data) as WrappedData;
    return data;
};

export const createWrapped = async (data: WrappedData, previewId?: string): Promise<string> => {
    const payload = previewId ? { ...data, previewId } : data;
    const response = await apiClient.post<{ slug: string }>('/wrapped', payload);
    console.log({ response })
    return response.slug;
};
