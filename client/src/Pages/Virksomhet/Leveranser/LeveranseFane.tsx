import styled from "styled-components";
import { BodyShort, Heading } from "@navikt/ds-react";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { LeggTilLeveranse } from "./LeggTilLeveranse";
import { LeveranseOversikt } from "./LeveranseOversikt";
import { tabInnholdStyling } from "../../../styling/containere";
import { EksternLenke } from "../../../components/EksternLenke";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../../../util/amplitude-klient";
import { useHentLeveranser } from "../../../api/lydia-api/leveranse";

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;

    ${tabInnholdStyling};
`;

interface Props {
    iaSak: IASak;
}

export const LeveranseFane = ({ iaSak }: Props) => {
    const sakenErIViBistår =
        iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR;

    const {
        data: leveranserPerIATjeneste,
        loading: lasterLeveranserPerIATjeneste,
    } = useHentLeveranser(iaSak.orgnr, iaSak.saksnummer);

    return (
        <Container>
            <div>
                <Heading level="3" size="large" spacing={true}>
                    IA-tjenester
                </Heading>
                <BodyShort>
                    Her legger du inn og får oversikt over IA-tjenester som gis
                    til virksomheten. Du må være på status “Vi bistår” for å
                    registrere tjenesten.
                </BodyShort>
                <BodyShort>
                    Du kan bare legge inn IA-tjenester som er beskrevet i{" "}
                    <EksternLenke
                        href="https://navno.sharepoint.com/sites/fag-og-ytelser-veileder-for-inkluderende-arbeidsliv"
                        onClick={() =>
                            loggNavigeringMedEksternLenke(
                                EksternNavigeringKategorier.IAVEILEDER,
                            )
                        }
                    >
                        IA-veilederen 4.1-4.3
                    </EksternLenke>
                    .
                </BodyShort>
            </div>
            <LeveranseOversikt
                iaSak={iaSak}
                leveranserPerIATjeneste={leveranserPerIATjeneste}
                lasterLeveranserPerIATjeneste={lasterLeveranserPerIATjeneste}
            />
            {sakenErIViBistår && (
                <LeggTilLeveranse
                    iaSak={iaSak}
                    leveranserPerIATjeneste={leveranserPerIATjeneste}
                />
            )}
        </Container>
    );
};
