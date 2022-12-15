import { useEffect } from 'react';
import { useStoreActions } from 'easy-peasy';
import { clearStoredNotes, getEncryptedNotes } from '../lib/encryption';
import { saveBulkNotes } from '../lib/mutations';

const OfflineSync = () => {
    const setSynced = useStoreActions((store: any) => store.setSynced);
    const setError = useStoreActions((store: any) => store.setError);
    const setLoading = useStoreActions((store: any) => store.setLoading);

    useEffect(() => {
        const checkIfOnline = setInterval(async () => {
            try {
                const statusRes = await saveBulkNotes();
                if (statusRes?.message === 'success') {
                    const storedNotes = getEncryptedNotes();
                    if (storedNotes) {
                        setLoading(true);
                        setError(false);
                        // @ts-ignore
                        const res = await saveBulkNotes({ data: storedNotes });

                        if (res?.message === 'Changes saved') {
                            setLoading(false);
                            setError(false);
                            setSynced(true);
                            clearStoredNotes();
                        }
                    }
                } else {
                    setLoading(false);
                    setError(true);
                    setSynced(false);
                }
            } catch (err) {
                setLoading(false);
                setError(true);
                setSynced(false);
            }
        }, 30000);

        return () => clearInterval(checkIfOnline);
    }, []);

    return null;
};

export default OfflineSync;
