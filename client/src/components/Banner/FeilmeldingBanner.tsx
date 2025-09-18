import { useEffect, useState } from "react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";

export interface EventData {
    feilmelding: string;
}

export const useFeilmelding = (onNyMelding?: (melding: string) => void) => {
    const [melding, setMelding] = useState("");

    const nullstillBanner = () => {
        setMelding("");
    };

    useEffect(() => {
        if (!melding) {
            return;
        }
        return () => {
            nullstillBanner();
        };
    }, [melding]);

    useEffect(() => {
        const handler = (({
            detail: { feilmelding },
        }: CustomEvent<EventData>) => {
            setMelding(feilmelding);
            onNyMelding?.(feilmelding);
        }) as EventListener;
        document.addEventListener("feilmeldingFraBackend", handler);
        return () => {
            document.removeEventListener("feilmeldingFraBackend", handler);
        };
    }, []);

    return [melding, setMelding] as [string, typeof setMelding];
}

export const FeilmeldingBanner = () => {
    const [synlig, setSynlig] = useState(false);
    const [melding] = useFeilmelding(() => {
        setSynlig(true);
    });

    return synlig ? (
        <BannerMedLukkeknapp variant="error" role="alert">
            {melding}
        </BannerMedLukkeknapp>
    ) : null;
};
