import { LocalAlert } from "@navikt/ds-react";

export function Lagringsfeil() {
    return (
        <LocalAlert status="error">
            <LocalAlert.Header>
                <LocalAlert.Title as="h3">Kunne ikke lagre målet</LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
                Endringen er ikke lagret. Prøv igjen.
            </LocalAlert.Content>
        </LocalAlert>
    );
}
