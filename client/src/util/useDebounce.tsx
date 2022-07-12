import {useEffect, useState} from "react";

export function useDebounce<T>(input: T, delay: number) {
    const [verdiDebounced, setVerdiDebounced] = useState(input);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setVerdiDebounced(input);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        },
        [input, delay]
    );

    return verdiDebounced;
}