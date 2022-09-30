import { Alert } from "@navikt/ds-react";
import { useEffect, useState } from "react";

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
    useEffect(() => {
        if (!melding) {
            return;
        }
        const timer = setTimeout(() => {
            setMelding("");
            setSynlig(false);
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
    }, [melding]);
    useEffect(() => {
        const handler = (({
            detail: {feilmelding},
        }: CustomEvent<EventData>) => {
            setMelding(feilmelding);
            setSynlig(true);
        }) as EventListener;
        document.addEventListener("feilmeldingFraBackend", handler);
        return () => {
            document.removeEventListener("feilmeldingFraBackend", handler);
        };
    }, []);
    return synlig ? <Alert variant="error">{melding}</Alert> : null;
};
