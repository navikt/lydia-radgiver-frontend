import {useEffect, useState} from "react";

export function useDebounce<T>(input: T, delayIMillisekunder: number) {
    const [verdiDebounced, setVerdiDebounced] = useState(input);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setVerdiDebounced(input);
            }, delayIMillisekunder);
            return () => {
                clearTimeout(handler);
            };
        },
        [input, delayIMillisekunder]
    );

    return verdiDebounced;
}