import { Alert, Button } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

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
            <AlertMelding variant="error">
                {melding}
                <Lukkeknapp onClick={nullstillBanner} size="small" variant="secondary">Lukk</Lukkeknapp>
            </AlertMelding>
        )
        : null;
};

const AlertMelding = styled(Alert)`
  padding-right: 5rem;
  position: relative;
`;

const Lukkeknapp = styled(Button).attrs({size: "small", variant: "secondary"})`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
`;
