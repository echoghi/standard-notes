import useSWR from 'swr';
import fetcher from './fetcher';

// export const useNotes = () => {
//     const { data, error } = useSWR('/items', fetcher);

//     return {
//         notes: (data as any) || [],
//         isLoading: !data && !error,
//         isError: error
//     };
// };
