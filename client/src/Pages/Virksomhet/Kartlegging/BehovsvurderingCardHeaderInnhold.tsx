import { Button, ExpansionCard } from "@navikt/ds-react";
import React, { useState } from "react";
import styled from "styled-components";
import { åpneSpørreundersøkelseINyFane } from "../../../util/navigasjon";
import { SlettSpørreundersøkelseModal } from "./SlettSpørreundersøkelseModal";
import { StartSpørreundersøkelseModal } from "./StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "./FullførSpørreundersøkelseModal";
import ResultatEksportVisning from "./ResultatEksportVisning";
import { FlyttTilAnnenProsess } from "./FlyttTilAnnenProsess";
import { SpørreundersøkelseStatusBadge } from "../../../components/Badge/SpørreundersøkelseStatusBadge";
import { TrashIcon } from "@navikt/aksel-icons";
import {
    CardHeaderProps,
    useSpørreundersøkelse,
} from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { useHentIASaksStatus } from "../../../api/lydia-api/sak";
import {
    avsluttSpørreundersøkelse,
    flyttSpørreundersøkelse,
    slettSpørreundersøkelse,
    startSpørreundersøkelse,
    useHentSpørreundersøkelser,
} from "../../../api/lydia-api/spørreundersøkelse";

const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    margin-right: 2rem;
    gap: 1rem;
    z-index: 2;
    & > div {
        z-index: 3;
    }
`;

const StyledActionButton = styled(Button)``;

const StyledExpansionCardHeader = styled(ExpansionCard.Header)`
    z-index: 1;
    & > div {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-grow: 1;
        flex-wrap: wrap;
    }
`;

const StyledEmptyCardHeader = styled.div`
    align-items: center;
    width: 100%;
    display: flex;
    gap: var(--a-spacing-4);
    padding: var(--__ac-expansioncard-padding-block)
        var(--__ac-expansioncard-padding-inline);
    padding-right: 5.5rem;
    border-radius: var(--__ac-expansioncard-border-radius);
    background-color: var(
        --ac-expansioncard-header-bg,
        var(--a-surface-transparent)
    );
    position: relative;
    border: var(--__ac-expansioncard-border-width) solid
        var(--__ac-expansioncard-border-color);
    justify-content: space-between;
    flex-wrap: wrap;
`;

const HeaderRightContent = styled.span`
    display: flex;
    align-items: center;
    font-size: 1rem;
    align-self: center;
    flex-wrap: wrap;
`;

const BehovsvurderingDato = styled.span`
    width: 9rem;
    text-align: left;
    margin-left: 1rem;
`;

const BehovsvurderingStatusWrapper = styled.div`
    min-width: 5rem;
`;

export const BehovsvurderingCardHeaderInnhold = ({
    spørreundersøkelse,
    dato,
}: CardHeaderProps) => {
    const [
        bekreftFullførBehovsvurderingModalÅpen,
        setBekreftFullførBehovsvurderingModalÅpen,
    ] = useState(false);
    const [
        slettSpørreundersøkelseModalÅpen,
        setSlettSpørreundersøkelseModalÅpen,
    ] = useState(false);
    const [
        bekreftStartBehovsvurderingModalÅpen,
        setBekreftStartBehovsvurderingModalÅpen,
    ] = useState(false);

    const [erIEksportMode, setErIEksportMode] = useState(false);

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const deltakereSomHarFullført = 1;
    const harNokDeltakere = deltakereSomHarFullført >= MINIMUM_ANTALL_DELTAKERE;
    const spørreundersøkelseStatus = spørreundersøkelse.status;

    const { iaSak, brukerRolle, samarbeid, brukerErEierAvSak } =
        useSpørreundersøkelse();

    const { mutate: hentBehovsvurderingPåNytt } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        "Behovsvurdering",
    );

    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const flyttTilValgtSamarbeid = (samarbeidId: number) => {
        flyttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            samarbeidId,
            spørreundersøkelse.id,
        ).then(() => hentBehovsvurderingPåNytt?.());
    };

    const startSpørreundersøkelsen = () => {
        startSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentBehovsvurderingPåNytt();
        });
    };

    const slettSpørreundersøkelsen = () => {
        slettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentBehovsvurderingPåNytt();
            oppdaterSaksStatus();
            setSlettSpørreundersøkelseModalÅpen(false);
        });
    };

    const fullførSpørreundersøkelse = () => {
        avsluttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            hentBehovsvurderingPåNytt();
            oppdaterSaksStatus();
        });
    };

    if (iaSak !== undefined) {
        if (spørreundersøkelseStatus === "SLETTET") {
            return null;
        }

        if (spørreundersøkelseStatus === "AVSLUTTET") {
            return (
                <StyledExpansionCardHeader>
                    <ExpansionCard.Title>Behovsvurdering</ExpansionCard.Title>
                    <HeaderRightContent>
                        <ActionButtonContainer>
                            <ResultatEksportVisning
                                iaSak={iaSak}
                                spørreundersøkelse={spørreundersøkelse}
                                erIEksportMode={erIEksportMode}
                                setErIEksportMode={setErIEksportMode}
                            />
                            {brukerErEierAvSak && (
                                <FlyttTilAnnenProsess
                                    gjeldendeSamarbeid={samarbeid}
                                    iaSak={iaSak}
                                    flyttTilValgtSamarbeid={
                                        flyttTilValgtSamarbeid
                                    }
                                    dropdownSize="small"
                                />
                            )}
                        </ActionButtonContainer>
                        <BehovsvurderingStatusWrapper>
                            <SpørreundersøkelseStatusBadge
                                status={spørreundersøkelse.status}
                            />
                        </BehovsvurderingStatusWrapper>
                        <BehovsvurderingDato>{dato}</BehovsvurderingDato>
                    </HeaderRightContent>
                </StyledExpansionCardHeader>
            );
        }

        if (spørreundersøkelseStatus === "OPPRETTET") {
            return (
                <StyledEmptyCardHeader>
                    <ActionButtonContainer>
                        {(iaSak.status === "KARTLEGGES" ||
                            iaSak.status === "VI_BISTÅR") &&
                            brukerRolle !== "Lesetilgang" && (
                                <>
                                    <StyledActionButton
                                        onClick={() =>
                                            setBekreftStartBehovsvurderingModalÅpen(
                                                true,
                                            )
                                        }
                                    >
                                        Start
                                    </StyledActionButton>
                                    {brukerErEierAvSak && (
                                        <StyledActionButton
                                            variant="tertiary"
                                            onClick={() =>
                                                setSlettSpørreundersøkelseModalÅpen(
                                                    true,
                                                )
                                            }
                                            icon={<TrashIcon aria-hidden />}
                                            aria-label="Slett behovsvurdering"
                                        />
                                    )}
                                </>
                            )}
                        <StartSpørreundersøkelseModal
                            spørreundersøkelse={spørreundersøkelse}
                            erModalÅpen={bekreftStartBehovsvurderingModalÅpen}
                            lukkModal={() =>
                                setBekreftStartBehovsvurderingModalÅpen(false)
                            }
                            startSpørreundersøkelsen={startSpørreundersøkelsen}
                        />
                        {brukerRolle && (
                            <SlettSpørreundersøkelseModal
                                spørreundersøkelse={spørreundersøkelse}
                                erModalÅpen={slettSpørreundersøkelseModalÅpen}
                                lukkModal={() =>
                                    setSlettSpørreundersøkelseModalÅpen(false)
                                }
                                slettSpørreundersøkelsen={
                                    slettSpørreundersøkelsen
                                }
                            />
                        )}
                    </ActionButtonContainer>
                    <HeaderRightContent>
                        <BehovsvurderingStatusWrapper>
                            <SpørreundersøkelseStatusBadge
                                status={spørreundersøkelse.status}
                            />
                        </BehovsvurderingStatusWrapper>
                        <BehovsvurderingDato>{dato}</BehovsvurderingDato>
                    </HeaderRightContent>
                </StyledEmptyCardHeader>
            );
        }

        if (spørreundersøkelseStatus === "PÅBEGYNT") {
            return (
                <StyledEmptyCardHeader>
                    <ActionButtonContainer>
                        {(iaSak.status === "KARTLEGGES" ||
                            iaSak.status === "VI_BISTÅR") &&
                            brukerRolle !== "Lesetilgang" && (
                                <>
                                    <StyledActionButton
                                        variant={"secondary"}
                                        onClick={() =>
                                            åpneSpørreundersøkelseINyFane(
                                                spørreundersøkelse.id,
                                                "PÅBEGYNT",
                                            )
                                        }
                                    >
                                        Fortsett
                                    </StyledActionButton>
                                    {brukerErEierAvSak && (
                                        <>
                                            <StyledActionButton
                                                onClick={() =>
                                                    setBekreftFullførBehovsvurderingModalÅpen(
                                                        true,
                                                    )
                                                }
                                            >
                                                Fullfør
                                            </StyledActionButton>
                                            <StyledActionButton
                                                variant={"danger"}
                                                onClick={() =>
                                                    setSlettSpørreundersøkelseModalÅpen(
                                                        true,
                                                    )
                                                }
                                                icon={<TrashIcon aria-hidden />}
                                                aria-label="Slett behovsvurdering"
                                            />
                                        </>
                                    )}
                                    <FullførSpørreundersøkelseModal
                                        harNokDeltakere={harNokDeltakere}
                                        erModalÅpen={
                                            bekreftFullførBehovsvurderingModalÅpen
                                        }
                                        lukkModal={() =>
                                            setBekreftFullførBehovsvurderingModalÅpen(
                                                false,
                                            )
                                        }
                                        fullførSpørreundersøkelse={
                                            fullførSpørreundersøkelse
                                        }
                                    />
                                </>
                            )}
                        {brukerRolle && (
                            <SlettSpørreundersøkelseModal
                                spørreundersøkelse={spørreundersøkelse}
                                erModalÅpen={slettSpørreundersøkelseModalÅpen}
                                lukkModal={() =>
                                    setSlettSpørreundersøkelseModalÅpen(false)
                                }
                                slettSpørreundersøkelsen={
                                    slettSpørreundersøkelsen
                                }
                            />
                        )}
                    </ActionButtonContainer>
                    <HeaderRightContent>
                        <BehovsvurderingStatusWrapper>
                            <SpørreundersøkelseStatusBadge
                                status={spørreundersøkelse.status}
                            />
                        </BehovsvurderingStatusWrapper>
                        <BehovsvurderingDato>{dato}</BehovsvurderingDato>
                    </HeaderRightContent>
                </StyledEmptyCardHeader>
            );
        }
    }
};
