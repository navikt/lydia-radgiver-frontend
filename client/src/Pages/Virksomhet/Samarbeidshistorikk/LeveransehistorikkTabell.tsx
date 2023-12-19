import { useHentLeveranser } from "../../../api/lydia-api";
import { BodyShort, Loader, Table } from "@navikt/ds-react";
import { lokalDato } from "../../../util/dato";
import { StyledTable } from "../../../components/StyledTable";
import { ScrollUtTilKantenContainer } from "../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer";

interface LeveransehistorikkProps {
    orgnr: string;
    saksnummer: string;
}

export const LeveransehistorikkTabell = ({ orgnr, saksnummer }: LeveransehistorikkProps) => {
    const {
        data: leveranserPerIATjeneste,
        loading: lasterLeveranserPerIATjeneste
    } = useHentLeveranser(orgnr, saksnummer);

    if (lasterLeveranserPerIATjeneste) {
        return <Loader />
    }

    if (!leveranserPerIATjeneste) {
        return <BodyShort>Kunne ikke hente leveranser</BodyShort>
    }

    const leveranser = leveranserPerIATjeneste
        .flatMap((iaTjenesteMedLeveranser) => iaTjenesteMedLeveranser.leveranser
            .map(leveranse => {
                return { tjeneste: iaTjenesteMedLeveranser.iaTjeneste.navn, ...leveranse }
            }))

    const fullførteLeveranser = leveranser
        .filter(leveranse => leveranse.status === "LEVERT")

    return (
        <>
            <h3>Leverte IA-tjenester</h3>

            {fullførteLeveranser.length
                ?
                <ScrollUtTilKantenContainer $offsetLeft={1.5 + 2.75} $offsetRight={1.5 + 0.75}>
                    <StyledTable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    IA-Tjeneste
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Modul
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Levert tidspunkt
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {fullførteLeveranser.map(leveranse =>
                                <Table.Row key={leveranse.id}>
                                    <Table.DataCell>
                                        {leveranse.tjeneste}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {leveranse.modul.navn}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {leveranse.fullført && lokalDato(leveranse.fullført)}
                                    </Table.DataCell>
                                </Table.Row>)}
                        </Table.Body>
                    </StyledTable>
                </ScrollUtTilKantenContainer>
                :
                <BodyShort>Denne saken har ingen leveranser som er levert.</BodyShort>
            }
        </>
    )
};
