import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import React from "react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { publiserSpørreundersøkelse } from "../../../api/lydia-api/dokumentpublisering";
import { MutatorCallback, MutatorOptions } from "swr";

interface PubliseringModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    spørreundersøkelse: Spørreundersøkelse;
    hentBehovsvurderingPåNytt: <MutationData = Spørreundersøkelse[]>(
        data?:
            | Promise<Spørreundersøkelse[] | undefined>
            | MutatorCallback<Spørreundersøkelse[]>
            | Spørreundersøkelse[],
        opts?: boolean | MutatorOptions<Spørreundersøkelse[], MutationData>,
    ) => Promise<Spørreundersøkelse[] | MutationData | undefined>;
}

export const PubliseringModal = ({
    open,
    setOpen,
    spørreundersøkelse,
    hentBehovsvurderingPåNytt,
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
                <Heading size="medium">Publiser behovsvurdering</Heading>
            </Modal.Header>
            <Modal.Body>
                <BodyLong>
                    Når du publiserer til Min side - Arbeidsgiver vil dokumentet
                    bli tilgjengelig for alle i virksomheten som har
                    Altinn-tilgangen &quot;Øvelser og verktøy&quot;. Husk å få
                    bekreftelse fra kontaktperson at det er greit at flere i
                    organisasjonen får se resultatet på den publiserte
                    spørreundersøkelsen.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={() => publiser()}>
                    Publiser behovsvurdering
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
