import useSWR from 'swr';
import { User } from '../types';
import fetcher from './fetcher';

export const useUser = () => {
    const { data, error } = useSWR('/user', fetcher);

    return {
        user: (data as User) || null,
        isLoading: !data && !error,
        isError: error
    };
};
