import { useEffect, useState } from 'react';
import { decrypt } from '../lib/encryption';
import { saveBulkNotes } from '../lib/mutations';
import { getLocalStorage, setLocalStorage } from '../lib/storage';
import { useStoreActions } from 'easy-peasy';

const OfflineSync = () => {
    const [isOnline, setIsOnline] = useState(true);
    const setSynced = useStoreActions((store: any) => store.setSynced);

    useEffect(() => {
        const checkIfOnline = setInterval(async () => {
            try {
                const statusRes = await saveBulkNotes();

                setIsOnline(statusRes.message === 'success');
            } catch (err) {
                setIsOnline(false);
                console.log(err);
            }
        }, 30000); // check connection every 30 seconds

        return () => clearInterval(checkIfOnline);
    }, []);

    useEffect(() => {
        if (!isOnline) {
            setSynced(false);
            const data = JSON.parse(decrypt(getLocalStorage('enc_notes')));

            try {
                const saveNotes = async () => {
                    const res = await saveBulkNotes(data);

                    if (res.status === 200) {
                        setSynced(true);
                        setLocalStorage('enc_notes', '');
                    }
                };

                saveNotes();
            } catch (err) {
                console.log('bulk save failed', err);
            }
        }
    }, [isOnline]);

    return null;
};

export default OfflineSync;
