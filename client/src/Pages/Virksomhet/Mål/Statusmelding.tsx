import { InlineMessage } from "@navikt/ds-react";

export type Status = "Lagret" | "Slettet";

// Live-regionen må finnes før teksten kommer, ellers leser ikke skjermleseren den opp.
export function Statusmelding({ status }: { status?: Status }) {
    return (
        <div role="status">
            {status && (
                <InlineMessage status="success" size="small">
                    {status}
                </InlineMessage>
            )}
        </div>
    );
}
