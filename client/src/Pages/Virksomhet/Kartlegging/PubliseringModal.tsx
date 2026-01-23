import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import React from "react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { publiserSpørreundersøkelse } from "../../../api/lydia-api/dokumentpublisering";

interface PubliseringModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    spørreundersøkelse: Spørreundersøkelse;
    hentBehovsvurderingPåNytt: () => void;
    type: "BEHOVSVURDERING" | "EVALUERING";
}

export const PubliseringModal = ({
    open,
    setOpen,
    spørreundersøkelse,
    hentBehovsvurderingPåNytt,
    type,
}: PubliseringModalProps) => {
    const publiser = () => {
        publiserSpørreundersøkelse(spørreundersøkelse).then(() => {
            hentBehovsvurderingPåNytt();
            setOpen(false);
        });
    };
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-label={"Publiser behovsvurdering"}
        >
            <Modal.Header closeButton={true}>
                <Heading size="medium">
                    Publiser {type.toLocaleLowerCase()}
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <BodyLong>
                    Når du publiserer til Min side - Arbeidsgiver, blir
                    resultatene tilgjengelig for alle i virksomheten med
                    Altinn-tilgangen “Virksomhetens IA-samarbeid”. Husk å
                    informere din kontaktperson om at flere i organisasjonen kan
                    se resultatene.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={() => publiser()}>
                    Publiser {type.toLocaleLowerCase()}
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpen(false)}
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
