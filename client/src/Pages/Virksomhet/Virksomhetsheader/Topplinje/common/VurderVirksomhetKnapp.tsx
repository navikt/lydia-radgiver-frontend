import React from "react";
import { Button, LocalAlert, Tooltip } from "@navikt/ds-react";
import { useHentBrukerinformasjon } from "../../../../../api/lydia-api/bruker";
import { vurderSakNyFlyt } from "../../../../../api/lydia-api/nyFlyt";
import { Virksomhet } from "../../../../../domenetyper/virksomhet";
import { useOversiktMutate } from "../../../Debugside/Oversikt";

export default function VurderVirksomhetKnapp({
    virksomhet,
}: {
    virksomhet: Virksomhet;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const [error, setError] = React.useState<string | null>(null);
    const [lasterHandling, setLasterHandling] = React.useState(false);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();

    const handleSubmit = async () => {
        setError(null);
        setLasterHandling(true);
        try {
            await vurderSakNyFlyt(virksomhet.orgnr);
            setLasterHandling(false);
            mutate();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setLasterHandling(false);
        }
    };

    if (error) {
        return (
            <LocalAlert status="error">
                <LocalAlert.Header>{error}</LocalAlert.Header>
                <LocalAlert.CloseButton onClick={() => setError(null)} />
            </LocalAlert>
        );
    }

    if (brukerInformasjon?.rolle === "Superbruker") {
        return (
            <Button
                onClick={handleSubmit}
                disabled={lasterHandling}
                loading={lasterHandling}
                size="small"
            >
                Vurder virksomheten
            </Button>
        );
    }

    return (
        <Tooltip content="Du må ha rollen som superbruker for å vurdere">
            <Button disabled size="small">
                Vurder virksomheten
            </Button>
        </Tooltip>
    );
}
