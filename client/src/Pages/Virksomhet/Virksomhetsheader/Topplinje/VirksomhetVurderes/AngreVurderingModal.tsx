import { Button, LocalAlert, Modal } from "@navikt/ds-react";
import { useState } from "react";
import { useOversiktMutate } from "@/Pages/Virksomhet/Debugside/Oversikt";
import { angreVurderingNyFlyt } from "@features/sak/api/nyFlyt";
import { Virksomhet } from "@features/virksomhet/types/virksomhet";

export function AngreVurderingModal({
    virksomhet,
    erÅpen,
    onClose,
}: {
    virksomhet: Virksomhet;
    erÅpen: boolean;
    onClose: () => void;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const [lagrer, setLagrer] = useState(false);
    const [error, setError] = useState<string>();

    const onAngreVurdering = () => {
        setLagrer(true);
        angreVurderingNyFlyt(virksomhet.orgnr)
            .then(() => {
                mutate();
                onClose();
            })
            .catch((error) => {
                setError(
                    error.message || "Noe gikk galt ved angre vurderingen",
                );
            })
            .finally(() => {
                setLagrer(false);
            });
    };

    return (
        <Modal
            open={erÅpen}
            onClose={onClose}
            header={{
                heading: "Angre vurdering",
            }}
            width="small"
        >
            <Modal.Body>
                Er du sikker på at du vil angre vurderingen? Dette vil slette
                historikken og følgere blir fjernet fra virksomheten.
            </Modal.Body>
            {error && (
                <Modal.Body>
                    <LocalAlert status="error">
                        <LocalAlert.Header>
                            <LocalAlert.Title>
                                Kunne ikke angre vurderingen
                            </LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>{error}</LocalAlert.Content>
                    </LocalAlert>
                </Modal.Body>
            )}
            <Modal.Footer>
                <Button
                    onClick={onAngreVurdering}
                    variant="primary"
                    disabled={error !== undefined}
                    loading={lagrer}
                >
                    Angre vurdering
                </Button>
                <Button
                    onClick={() => {
                        if (error) {
                            setError(undefined);
                        }

                        onClose();
                    }}
                    variant="secondary"
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
