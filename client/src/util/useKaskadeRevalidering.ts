import { useEffect, useRef } from "react";

/**
 * Trigrer `mutate()` når foreldrekomponentens SWR-kall er ferdig revalidert.
 *
 * Detekterer overgangen `foreldreValiderer: true → false` slik at barnets cache
 * hentes på nytt etter at forelderen har fått ferske data — uten URL-matching
 * og uten ekstra nettverkskall (SWR dedupliserer kall med samme nøkkel).
 */
export function useKaskadeRevalidering(
    foreldreValiderer: boolean,
    mutate: () => void,
) {
    const forrigeValidering = useRef(foreldreValiderer);
    useEffect(() => {
        const ferdigMedRevalidering =
            forrigeValidering.current && !foreldreValiderer;
        forrigeValidering.current = foreldreValiderer;
        if (ferdigMedRevalidering) {
            mutate();
        }
    }, [foreldreValiderer, mutate]);
}
