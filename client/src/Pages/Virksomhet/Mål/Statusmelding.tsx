import { InlineMessage } from "@navikt/ds-react";

export type Status = {
    gjelder: "sykefravær" | "samarbeid";
    tekst: "Lagret" | "Slettet";
};

// Live-regionen må finnes før teksten kommer, ellers leser ikke skjermleseren den opp.
export function Statusmelding({
    status,
    gjelder,
}: {
    status?: Status;
    gjelder: Status["gjelder"];
}) {
    return (
        <div role="status">
            {status?.gjelder === gjelder && (
                <InlineMessage status="success" size="small">
                    {status.tekst}
                </InlineMessage>
            )}
        </div>
    );
}
