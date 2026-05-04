import { useSuspenseQuery } from '@tanstack/react-query';
import { checkSession } from '../api/auth.api';

export const useCheckSession = () => {
    return useSuspenseQuery({
        queryKey: ['auth', 'session'],
        queryFn: checkSession,
        select: (data) => data.user,
    });
};