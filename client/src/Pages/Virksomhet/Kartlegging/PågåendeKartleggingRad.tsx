import { Accordion, BodyShort, Button } from "@navikt/ds-react";
import { StatusBadge } from "../../../components/Badge/StatusBadge";
import { EksternLenke } from "../../../components/EksternLenke";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import styled from "styled-components";
import { useState } from "react";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";


const AccordionHeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
`;

interface PågåendeKartleggingProps {
    item: IASakKartlegging,
    index: number
    avslutt: (id: string) => void
}

export const PågåendeKartleggingRad = ({ item, index, avslutt }: PågåendeKartleggingProps) => {
    const [bekreftValgModalÅpen, setBekreftValgModalÅpen] = useState(false);


    return (
        <Accordion.Item>
            <Accordion.Header>
                <AccordionHeaderContent>
                    <StatusBadge
                        status={item.status}
                    />
                    Kartlegging nr {index + 1}
                </AccordionHeaderContent>
            </Accordion.Header>

            <Accordion.Content>
                <EksternLenke
                    key={item.kartleggingId}
                    style={{ display: "block" }}
                    href={`https://fia-arbeidsgiver.ekstern.dev.nav.no/${item.kartleggingId}/vert`}
                    target={`https://fia-arbeidsgiver.ekstern.dev.nav.no/${item.kartleggingId}/vert`}
                >
                    Lenke til spørreundersøkelse
                </EksternLenke>
                <BodyShort>KartleggingId: {item.kartleggingId}</BodyShort>
                <Button onClick={() => setBekreftValgModalÅpen(true)}>
                    Fullfør
                </Button>
                <BekreftValgModal onConfirm={() => avslutt(item.kartleggingId)}
                                  onCancel={() => {
                                      setBekreftValgModalÅpen(false)
                                  }}
                                  åpen={bekreftValgModalÅpen}
                                  title="Er du sikker på at du vil fullføre denne kartleggingen?"
                                  description={`Kartleggingen som fullføres er "${item.kartleggingId}".`}
                    //TODO: husk å bytte id her til navn på kartlegging
                >
                </BekreftValgModal>
            </Accordion.Content>
        </Accordion.Item>
    )
}
