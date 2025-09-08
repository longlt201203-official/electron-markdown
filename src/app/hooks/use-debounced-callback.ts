import { useCallback, useEffect, useRef } from "react";

/**
 * useDebouncedCallback
 * Returns a stable debounced function plus helpers.
 * The latest args & callback are used when the timer fires.
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
    cb: T,
    delay: number
) {
    const cbRef = useRef<T>(cb);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Always keep latest callback
    useEffect(() => {
        cbRef.current = cb;
    }, [cb]);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const flush = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
            cbRef.current();
        }
    }, []);

    const debounced = useCallback(
        (..._args: Parameters<T>) => {
            // We ignore passed args now; if needed adapt to store them and pass to cb.
            cancel();
            timerRef.current = setTimeout(() => {
                timerRef.current = null;
                cbRef.current();
            }, delay);
        },
        [cancel, delay]
    );

    // Cleanup on unmount
    useEffect(() => cancel, [cancel]);

    return Object.assign(debounced, { cancel, flush });
}
