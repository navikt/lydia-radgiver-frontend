import { Accordion, BodyShort, Button } from "@navikt/ds-react";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import styled from "styled-components";
import { useState } from "react";
import { IASakKartleggingStatusType } from "../../../domenetyper/domenetyper";


const AccordionHeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

interface PågåendeKartleggingProps {
    kartleggingId: string,
    kartleggingStatus: IASakKartleggingStatusType,
    index: number,
    avslutt: (id: string) => void
}

export const PågåendeKartleggingRad = ({ kartleggingId, kartleggingStatus, index, avslutt }: PågåendeKartleggingProps) => {
    const [bekreftValgModalÅpen, setBekreftValgModalÅpen] = useState(false);
    const [bekreftStartKartleggingModalÅpen, setBekreftStartKartleggingModalÅpen] = useState(false);


    return (
        <Accordion.Item>
            <Accordion.Header>
                <AccordionHeaderContent>
                    <StatusBadge status={kartleggingStatus} />
                    Kartlegging nr {index + 1}
                </AccordionHeaderContent>
            </Accordion.Header>

            <Accordion.Content>
                <Button variant={"secondary"} onClick={() => setBekreftStartKartleggingModalÅpen(true)}>
                    Start kartlegging
                </Button>
                <BekreftValgModal
                    onConfirm={() => window.open(`https://fia-arbeidsgiver.ekstern.dev.nav.no/${kartleggingId}/vert`)}
                    onCancel={() => {
                        setBekreftStartKartleggingModalÅpen(false)
                    }}
                    åpen={bekreftStartKartleggingModalÅpen}
                    title={"Før du går videre..."}
                    description={"Du er i ferd med å starte kartlegging med virksomhet.\n" +
                        "\n" +
                        "Når du klikker start åpnes det et nytt vindu du kan vise til deltakerne i møtet.\n" +
                        "\n" +
                        "Sørg for at alle partene er representert før du starter. " +
                        "Det er de som logger inn på neste side. Når alle har logget inn klikker du neste."}
                >
                </BekreftValgModal>

                <BodyShort>KartleggingId: {kartleggingId}</BodyShort>
                <Button onClick={() => setBekreftValgModalÅpen(true)}>
                    Fullfør
                </Button>
                <BekreftValgModal onConfirm={() => avslutt(kartleggingId)}
                                  onCancel={() => {
                                      setBekreftValgModalÅpen(false)
                                  }}
                                  åpen={bekreftValgModalÅpen}
                                  title="Er du sikker på at du vil fullføre denne kartleggingen?"
                                  description={`Kartleggingen som fullføres er "${kartleggingId}".`}
                    //TODO: husk å bytte id her til navn på kartlegging
                >
                </BekreftValgModal>
            </Accordion.Content>
        </Accordion.Item>
    )
}
