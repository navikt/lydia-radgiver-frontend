import { useEffect, useState } from "react";
import { BannerMedLukkeknapp } from "./BannerMedLukkeknapp";

interface EventData {
    feilmelding: string;
}

export const dispatchFeilmelding = (data: EventData) => {
    document.dispatchEvent(
        new CustomEvent("feilmeldingFraBackend", {
            detail: data,
        })
    );
};

export const FeilmeldingBanner = () => {
    const [melding, setMelding] = useState("");
    const [synlig, setSynlig] = useState(false);

    const nullstillBanner = () => {

        setMelding("");
        setSynlig(false);
    }

    useEffect(() => {
        if (!melding) {
            return;
        }
        return () => {
            nullstillBanner()
        };
    }, [melding]);

    useEffect(() => {
        const handler = (({
            detail: { feilmelding },
        }: CustomEvent<EventData>) => {
            setMelding(feilmelding);
            setSynlig(true);
        }) as EventListener;
        document.addEventListener("feilmeldingFraBackend", handler);
        return () => {
            document.removeEventListener("feilmeldingFraBackend", handler);
        };
    }, []);

    return synlig
        ? (
            <BannerMedLukkeknapp variant="error">
                {melding}
            </BannerMedLukkeknapp>
        )
        : null;
};
