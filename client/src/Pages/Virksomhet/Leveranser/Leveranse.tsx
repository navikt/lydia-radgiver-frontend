import styled from "styled-components";
import { BodyLong, BodyShort, Button } from "@navikt/ds-react";
import {
    ExclamationmarkTriangleIcon,
    TrashFillIcon as Delete,
} from "@navikt/aksel-icons";
import {
    Leveranse as LeveranseType,
    LeveranseStatusEnum,
} from "../../../domenetyper/leveranse";
import { lokalDato } from "../../../util/dato";
import { NavFarger } from "../../../styling/farger";
import {
    merkLeveranseSomLevert,
    slettLeveranse,
    useHentLeveranser,
} from "../../../api/lydia-api/leveranse";
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";
import { useHentAktivSakForVirksomhet } from "../../../api/lydia-api/virksomhet";
import { IAProsessStatusEnum, IASak } from "../../../domenetyper/domenetyper";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { useState } from "react";
import { RolleEnum } from "../../../domenetyper/brukerinformasjon";
import { tabletAndUp } from "../../../styling/breakpoints";

const Container = styled.li`
    display: flex;
    flex-direction: column;
    --ia-tjeneste-rad-gap: 2rem; // CSS-variabel slik at avstanden mellom knappar vert den same som mellom andre ting
    column-gap: var(--ia-tjeneste-rad-gap);
    row-gap: 0.5rem;

    // Viser leveranse som rad på større skjermar
    ${tabletAndUp} {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    // Etterliknar stylinga til tabell-rader
    padding: ${12 / 16}rem;
    border-bottom: 1px solid var(--ac-table-row-border, var(--a-border-default));

    &:first-of-type {
        border-top: 2px solid
            var(--ac-table-row-border, var(--a-border-default));
    }
`;

const Modulnavn = styled(BodyShort)`
    flex-grow: 1;
    flex-basis: fit-content;
`;

const Dato = styled(BodyShort)`
    flex-basis: fit-content;

    /* Innrykk på små skjermar 
   * slik at det er lettare for lesaren å skilje modulnamn frå datoar */
    padding-left: 1rem;

    ${tabletAndUp} {
        padding-left: 0;
    }
`;

const KnappeContainer = styled.div`
    display: flex;
    gap: var(--ia-tjeneste-rad-gap);

    align-self: end;

    ${tabletAndUp} {
        align-self: auto; // bruk forelder sin align-items
    }
`;

const LevertKnapp = styled(Button)`
    padding-left: 1.5rem;
    padding-right: 1.5rem;
`;

const FjernLeveranseKnapp = styled(Button)`
    color: ${NavFarger.text};
    padding: 0; // Nullstiller padding innebygga i knapp-komponenten

    &:hover {
        background: none;
    }

    &:disabled:hover {
        color: ${NavFarger.text};
    }
`;

const DeaktivertAdvarsel = styled.div`
    display: flex;
    gap: 0.5rem;
    padding-top: 1.5rem;

    & p {
        flex: 1;
    }

    & svg {
        margin-top: 0.3rem; // Får ikonet til å sjå vertikalt sentrert ut saman med teksten
        color: ${NavFarger.warning};
    }
`;

interface Props {
    leveranse: LeveranseType;
    iaSak: IASak;
}

export const Leveranse = ({ leveranse, iaSak }: Props) => {
    const [bekreftValgModalÅpen, setBekreftValgModalÅpen] = useState(false);
    const erLevert = leveranse.status === LeveranseStatusEnum.enum.LEVERT;
    const { mutate: hentLeveranserPåNytt } = useHentLeveranser(
        iaSak.orgnr,
        leveranse.saksnummer,
    );
    const { mutate: hentSakPåNytt } = useHentAktivSakForVirksomhet(iaSak.orgnr);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerMedLesetilgang =
        brukerInformasjon?.rolle === RolleEnum.enum.Lesetilgang;
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const sakenErIViBistår =
        iaSak.status === IAProsessStatusEnum.enum.VI_BISTÅR;

    const vedMerkLeveranseSomLevert = () => {
        merkLeveranseSomLevert(
            iaSak.orgnr,
            leveranse.saksnummer,
            leveranse.id,
        ).then(() => {
            hentLeveranserPåNytt();
            hentSakPåNytt();
        });
    };

    const vedSlettLeveranse = () => {
        slettLeveranse(iaSak.orgnr, leveranse.saksnummer, leveranse.id).then(
            () => {
                setBekreftValgModalÅpen(false);
                hentLeveranserPåNytt();
                hentSakPåNytt();
            },
        );
    };

    return (
        <Container>
            <Modulnavn>{leveranse.modul.navn}</Modulnavn>
            <Dato>{`Tentativ frist: ${lokalDato(leveranse.frist)}`}</Dato>
            {!leveranse.fullført ? null : (
                <Dato>Levert: {lokalDato(leveranse.fullført)}</Dato>
            )}
            {brukerMedLesetilgang || !sakenErIViBistår ? null : (
                <KnappeContainer>
                    {erLevert || !brukerErEierAvSak ? null : (
                        <LevertKnapp
                            onClick={vedMerkLeveranseSomLevert}
                            size="small"
                        >
                            Lever
                        </LevertKnapp>
                    )}

                    <FjernLeveranseKnapp
                        onClick={() => setBekreftValgModalÅpen(true)}
                        disabled={!brukerErEierAvSak}
                        variant="tertiary"
                        icon={<Delete title="Fjern leveranse" />}
                    />
                    <BekreftValgModal
                        onConfirm={vedSlettLeveranse}
                        onCancel={() => {
                            setBekreftValgModalÅpen(false);
                        }}
                        åpen={bekreftValgModalÅpen}
                        title="Er du sikker på at du vil fjerne leveransen?"
                        description={`Leveransen som fjernes er "${leveranse.modul.navn}" med frist ${lokalDato(leveranse.frist)}.`}
                    >
                        {leveranse.modul.deaktivert && (
                            <DeaktivertAdvarsel>
                                <ExclamationmarkTriangleIcon
                                    aria-hidden="true"
                                    title="Advarsel"
                                    fontSize="3rem"
                                />
                                <BodyLong>
                                    Leveransen er ikke lenger i bruk. Hvis du
                                    sletter den, kan du ikke legge den til på
                                    nytt.
                                </BodyLong>
                            </DeaktivertAdvarsel>
                        )}
                    </BekreftValgModal>
                </KnappeContainer>
            )}
        </Container>
    );
};
