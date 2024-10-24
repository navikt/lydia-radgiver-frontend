import {
    useHentSamarbeid,
} from "../../../api/lydia-api/kartlegging";
import { useHentBehovsvurderingerMedProsess } from "../../../api/lydia-api/kartlegging";
import { BodyShort, Loader, Table } from "@navikt/ds-react";
import { StyledTable } from "../../../components/StyledTable";
import { ScrollUtTilKantenContainer } from "../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer";
import { NavIdentMedLenke } from "../../../components/NavIdentMedLenke";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";

interface LeveransehistorikkProps {
    orgnr: string;
    saksnummer: string;
}

export const sorterPåDato = (a: IASakKartlegging, b: IASakKartlegging) => {
    return b.endretTidspunkt!.getTime() - a.endretTidspunkt!.getTime();
};
export const KartlegginghistorikkTabell = ({
    orgnr,
    saksnummer,
}: LeveransehistorikkProps) => {
    const { data: iaSamarbeid, loading: lasterSamarbeid } = useHentSamarbeid(
        orgnr,
        saksnummer,
    );

    if (lasterSamarbeid) {
        return <Loader />;
    }

    if (iaSamarbeid === undefined || iaSamarbeid.length === 0) {
        return <BodyShort>Kunne ikke hente behovsvurderinger</BodyShort>;
    }

    return iaSamarbeid.map((samarbeid) => (
        <BehovsVurderingISamarbeid
            key={samarbeid.id}
            orgnummer={orgnr}
            saksnummer={saksnummer}
            prosess={samarbeid}
        />
    ));
};

interface BehovsVurderingISamarbeidProps {
    orgnummer: string;
    saksnummer: string;
    prosess: IaSakProsess;
}

const BehovsVurderingISamarbeid = ({
    orgnummer,
    saksnummer,
    prosess,
}: BehovsVurderingISamarbeidProps) => {
    const { data: iaSakKartlegginger, loading: lasterKartlegginger } =
        useHentBehovsvurderingerMedProsess(orgnummer, saksnummer, prosess.id);

    if (lasterKartlegginger) {
        return <Loader />;
    }

    if (!iaSakKartlegginger) {
        return <BodyShort>Kunne ikke hente behovsvurderinger</BodyShort>;
    }
    const avsluttedeKarltegginger = iaSakKartlegginger
        .filter((kartlegging) => kartlegging.status === "AVSLUTTET")
        .sort(sorterPåDato);

    return (
        <>
            <h3>Gjennomførte behovsvurderinger for {prosess.navn}</h3>

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
                                <Table.HeaderCell>
                                    Opprettet av
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {avsluttedeKarltegginger.map((kartlegging) => (
                                <Table.Row key={kartlegging.kartleggingId}>
                                    <Table.DataCell>
                                        {lokalDatoMedKlokkeslett(
                                            kartlegging.opprettetTidspunkt,
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {lokalDatoMedKlokkeslett(
                                            kartlegging.endretTidspunkt!,
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <NavIdentMedLenke
                                            navIdent={kartlegging.opprettetAv}
                                        />
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </StyledTable>
                </ScrollUtTilKantenContainer>
            ) : (
                <BodyShort>
                    Dette samarbeidet har ingen gjennomførte behovsvurderinger.
                </BodyShort>
            )}
        </>
    );
};