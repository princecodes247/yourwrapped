import { useQuery } from '@tanstack/react-query';
import { getWrapped } from '@/api/wrapped';
import { WrappedData } from '@/types/wrapped';

export const useWrapped = (id: string | null) => {
    return useQuery<WrappedData, Error>({
        queryKey: ['wrapped', id],
        queryFn: () => getWrapped(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};
