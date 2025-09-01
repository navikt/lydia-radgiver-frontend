import { BodyLong, Button, Heading, List, Modal } from "@navikt/ds-react";
import { Knappecontainer } from ".";
import { IaSakProsess } from "../../../../../../domenetyper/iaSakProsess";
import { LenkeTilSamarbeid } from "./LenkeTilFanePåSamarbeid";

export function FullførSamarbeidFørstSeksjon({
    lukkModal,
    alleSamarbeid,
}: {
    lukkModal: () => void;
    clearNesteSteg: () => void;
    alleSamarbeid: IaSakProsess[] | undefined;
}) {
    const harAktiveSamarbeid = alleSamarbeid?.some(
        (samarbeid) => samarbeid.status === "AKTIV",
    );

    return (
        <Modal.Body>
            <Heading level="2" size="medium">
                Virksomheten har aktive samarbeid
            </Heading>
            <br />
            <BodyLong>
                For å gå videre må du avslutte følgende samarbeid:
            </BodyLong>
            <br />
            {harAktiveSamarbeid && (
                <>
                    <Heading level="3" size="xsmall">
                        Aktive samarbeid:
                    </Heading>
                    <List as="ul" size="small">
                        {alleSamarbeid
                            ?.filter(
                                (samarbeid) => samarbeid.status === "AKTIV",
                            )
                            .map((aktivtSamarbeid) => {
                                return (
                                    <List.Item key={aktivtSamarbeid.id}>
                                        <LenkeTilSamarbeid
                                            samarbeidId={aktivtSamarbeid.id}
                                            onClick={() => lukkModal()}
                                        >
                                            {aktivtSamarbeid.navn}
                                        </LenkeTilSamarbeid>
                                    </List.Item>
                                );
                            })}
                    </List>
                </>
            )}
            <Knappecontainer>
                <Button variant="secondary" onClick={lukkModal}>
                    Avbryt
                </Button>
            </Knappecontainer>
        </Modal.Body>
    );
}
