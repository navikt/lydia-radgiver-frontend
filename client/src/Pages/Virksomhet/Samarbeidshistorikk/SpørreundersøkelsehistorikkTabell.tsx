import { BodyShort, Loader, Table } from "@navikt/ds-react";
import { StyledTable } from "../../../components/StyledTable";
import { ScrollUtTilKantenContainer } from "../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer";
import { NavIdentMedLenke } from "../../../components/NavIdentMedLenke";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import {
    useHentSpørreundersøkelser,
    useHentSamarbeid,
} from "../../../api/lydia-api/spørreundersøkelse";

interface LeveransehistorikkProps {
    orgnr: string;
    saksnummer: string;
}

export const sorterPåDato = (a: Spørreundersøkelse, b: Spørreundersøkelse) => {
    return b.endretTidspunkt!.getTime() - a.endretTidspunkt!.getTime();
};
export const SpørreundersøkelsehistorikkTabell = ({
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
    const { data: behovsvurderinger, loading: lasterBehovsvurderinger } =
        useHentSpørreundersøkelser(
            orgnummer,
            saksnummer,
            prosess.id,
            "Behovsvurdering",
        );

    if (lasterBehovsvurderinger) {
        return <Loader />;
    }

    if (!behovsvurderinger) {
        return <BodyShort>Kunne ikke hente behovsvurderinger</BodyShort>;
    }
    const avsluttedeBehovsvurderinger = behovsvurderinger
        .filter((kartlegging) => kartlegging.status === "AVSLUTTET")
        .sort(sorterPåDato);

    return (
        <>
            <h3>Gjennomførte behovsvurderinger for {prosess.navn}</h3>

            {avsluttedeBehovsvurderinger.length ? (
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
                            {avsluttedeBehovsvurderinger.map(
                                (behovsvurdering) => (
                                    <Table.Row key={behovsvurdering.id}>
                                        <Table.DataCell>
                                            {lokalDatoMedKlokkeslett(
                                                behovsvurdering.opprettetTidspunkt,
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {lokalDatoMedKlokkeslett(
                                                behovsvurdering.endretTidspunkt!,
                                            )}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <NavIdentMedLenke
                                                navIdent={
                                                    behovsvurdering.opprettetAv
                                                }
                                            />
                                        </Table.DataCell>
                                    </Table.Row>
                                ),
                            )}
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
