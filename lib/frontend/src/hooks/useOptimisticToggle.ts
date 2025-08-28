// פתרון פשוט יותר עם Custom Hook
import { useState, useCallback } from 'react'

export const useOptimisticToggle = (
  initialValue: boolean,
  updateFunction: (newValue: boolean) => Promise<void>
) => {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async (newValue: boolean) => {
    const previousValue = value;
    setValue(newValue); // Optimistic update
    setIsLoading(true);
    setError(null);

    try {
      await updateFunction(newValue);
    } catch (err: unknown) {
      setValue(previousValue); // Rollback on error
      setError(err instanceof Error ? err.message : 'שגיאה בעדכון');
    } finally {
      setIsLoading(false);
    }
  }, [value, updateFunction]);

  const updateFromServer = useCallback((serverValue: boolean) => {
    if (!isLoading) { // Only update if not currently updating
      setValue(serverValue);
    }
  }, [isLoading]);

  return { value, isLoading, error, toggle, updateFromServer };
};

// שימוש בתוך קומפוננטה:
// const lineSuspension = useOptimisticToggle(false, handleFreezeUnFreezeMobile);
// const imeiLock = useOptimisticToggle(false, handleLockUnlockImei);
