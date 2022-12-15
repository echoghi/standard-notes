import { useEffect, useState } from 'react';
import { useStoreActions } from 'easy-peasy';
import { clearStoredNotes, getEncryptedNotes } from '../lib/encryption';
import { saveBulkNotes } from '../lib/mutations';

const OfflineSync = () => {
    const setSynced = useStoreActions((store: any) => store.setSynced);

    useEffect(() => {
        const checkIfOnline = setInterval(async () => {
            try {
                const statusRes = await saveBulkNotes();
                if (statusRes?.message === 'success') {
                    const storedNotes = getEncryptedNotes();
                    if (storedNotes) {
                        // @ts-ignore
                        const res = await saveBulkNotes({ data: storedNotes });

                        if (res?.message === 'Changes saved') {
                            setSynced(true);
                            clearStoredNotes();
                        }
                    }
                } else {
                    setSynced(false);
                }
            } catch (err) {
                setSynced(false);
            }
        }, 30000);

        return () => clearInterval(checkIfOnline);
    }, []);

    return null;
};

export default OfflineSync;
