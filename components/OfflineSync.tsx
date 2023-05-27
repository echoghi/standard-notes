import { useCallback, useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { clearStoredNotes, getEncryptedNotes, saveBulkNotes } from '../services';

const SYNC_INTERVAL_MS = 30000;

const OfflineSync = () => {
  const syncToken = useStoreState((store: any) => store.syncToken);

  const updateUser = useStoreActions((store: any) => store.updateUser);
  const setSynced = useStoreActions((store: any) => store.setSynced);
  const syncNotes = useStoreActions((store: any) => store.syncNotes);
  const setSyncToken = useStoreActions((store: any) => store.setSyncToken);
  const setError = useStoreActions((store: any) => store.setError);
  const setLoading = useStoreActions((store: any) => store.setLoading);

  const syncStoredNotes = useCallback(async () => {
    const storedNotes = getEncryptedNotes();
    if (storedNotes.length) {
      setLoading(true);
      const res = await saveBulkNotes({ items: storedNotes, syncToken });
      setSyncToken(res.data.syncToken);
      if (res?.message === 'changes saved') {
        setLoading(false);
        setError(false);
        setSynced(true);
        clearStoredNotes();
      }
    }
  }, [syncToken]);

  const handleOnlineStatus = useCallback(async () => {
    try {
      const statusRes = await saveBulkNotes({ syncToken });

      if (statusRes?.message === 'success') {
        updateUser(statusRes.meta.auth);
        await syncStoredNotes();
        if (statusRes.data.retrievedItems.length) {
          syncNotes(statusRes.data.retrievedItems);
        }
        setSynced(true);
        setError(false);
        setSyncToken(statusRes.data.syncToken);
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
  }, [syncToken, syncStoredNotes]);

  useEffect(() => {
    const ping = setInterval(() => {
      handleOnlineStatus();
    }, SYNC_INTERVAL_MS);

    return () => clearInterval(ping);
  }, [handleOnlineStatus, syncToken]);

  return null;
};

export default OfflineSync;
