import { useHentKartlegginger } from "../../../api/lydia-api";
import { BodyShort, Loader, Table } from "@navikt/ds-react";
import { StyledTable } from "../../../components/StyledTable";
import { ScrollUtTilKantenContainer } from "../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer";
import { NavIdentMedLenke } from "../../../components/NavIdentMedLenke";
import {IASakKartlegging} from "../../../domenetyper/iaSakKartlegging";

interface LeveransehistorikkProps {
    orgnr: string;
    saksnummer: string;
}


export const sorterPåDato = (a: IASakKartlegging, b: IASakKartlegging) => {
    return b.endretTidspunkt!.getTime()- a.endretTidspunkt!.getTime();
}
export const KartlegginghistorikkTabell = ({
    orgnr,
    saksnummer,
}: LeveransehistorikkProps) => {

    const {
        data: iaSakKartlegginger,
        loading: lasterIASakKartlegging,
    } = useHentKartlegginger(orgnr, saksnummer);

    if (lasterIASakKartlegging) {
        return <Loader />;
    }

    if (!iaSakKartlegginger) {
        return <BodyShort>Kunne ikke hente kartlegginger</BodyShort>;
    }
    const avsluttedeKarltegginger = iaSakKartlegginger.filter(
        (kartlegging) => kartlegging.status === "AVSLUTTET",
    ).sort(sorterPåDato);

    return (
        <>
            <h3>Gjennomførte kartlegginger</h3>

            {avsluttedeKarltegginger.length ? (
                <ScrollUtTilKantenContainer
                    $offsetLeft={1.5 + 2.75}
                    $offsetRight={1.5 + 0.75}
                >
                    <StyledTable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Opprettet</Table.HeaderCell>
                                <Table.HeaderCell>Sist endret</Table.HeaderCell>
                                <Table.HeaderCell>Opprettet av</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {avsluttedeKarltegginger.map((kartlegging) => (
                                <Table.Row key={kartlegging.kartleggingId}>
                                    <Table.DataCell>
                                        {formaterDatoMedKlokkeslett(kartlegging.opprettetTidspunkt)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {formaterDatoMedKlokkeslett(kartlegging.endretTidspunkt!)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <NavIdentMedLenke navIdent={kartlegging.opprettetAv}/>
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </StyledTable>
                </ScrollUtTilKantenContainer>
            ) : (
                <BodyShort>
                    Denne saken har ingen kartlegginger som er levert.
                </BodyShort>
            )}
        </>
    );
};
function formaterDatoMedKlokkeslett(dato: Date): string {
    return `${dato.toLocaleDateString("nb-NO")}, ${dato.getHours()}:${dato.getMinutes().toString().padStart(2, "0")}`;
}
