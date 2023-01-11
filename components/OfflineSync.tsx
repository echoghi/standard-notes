import { useCallback, useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { clearStoredNotes, getEncryptedNotes } from '../lib/encryption';
import { saveBulkNotes } from '../lib/mutations';

const OfflineSync = () => {
    const syncToken = useStoreState((store: any) => store.syncToken);

    const updateUser = useStoreActions((store: any) => store.updateUser);
    const setSynced = useStoreActions((store: any) => store.setSynced);
    const syncNotes = useStoreActions((store: any) => store.syncNotes);
    const setSyncToken = useStoreActions((store: any) => store.setSyncToken);
    const setError = useStoreActions((store: any) => store.setError);
    const setLoading = useStoreActions((store: any) => store.setLoading);

    const checkIfOnline = useCallback(async () => {
        try {
            const statusRes = await saveBulkNotes({ syncToken });

            if (statusRes?.message === 'success') {
                updateUser(statusRes.meta.auth);
                const storedNotes = getEncryptedNotes();

                if (storedNotes) {
                    setLoading(true);

                    // @ts-ignore
                    const res = await saveBulkNotes({ items: storedNotes, syncToken });
                    setSyncToken(res.data.syncToken);
                    if (res?.message === 'Changes saved') {
                        setLoading(false);
                        setError(false);
                        setSynced(true);
                        clearStoredNotes();
                    }
                } else {
                    if (statusRes.data.retrievedItems.length) {
                        syncNotes(statusRes.data.retrievedItems);
                    }
                    setSynced(true);
                    setError(false);
                    setSyncToken(statusRes.data.syncToken);
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
    }, [syncToken]);

    useEffect(() => {
        const ping = setInterval(() => {
            checkIfOnline();
        }, 30000);

        return () => clearInterval(ping);
    }, [checkIfOnline, syncToken]);

    return null;
};

export default OfflineSync;
