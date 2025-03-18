import { Button, ExpansionCard } from "@navikt/ds-react";
import React, { useState } from "react";
import styled from "styled-components";
import { åpneSpørreundersøkelseINyFane } from "../../../../util/navigasjon";
import { SlettSpørreundersøkelseModal } from "../../Kartlegging/SlettSpørreundersøkelseModal";
import { StartSpørreundersøkelseModal } from "../../Kartlegging/StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "../../Kartlegging/FullførSpørreundersøkelseModal";
import ResultatEksportVisning from "../../Kartlegging/ResultatEksportVisning";
import { SpørreundersøkelseStatusBadge } from "../../../../components/Badge/SpørreundersøkelseStatusBadge";
import { TrashIcon } from "@navikt/aksel-icons";
import {
    CardHeaderProps,
    useSpørreundersøkelse,
} from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { useHentIASaksStatus } from "../../../../api/lydia-api/sak";
import {
    avsluttSpørreundersøkelse,
    slettSpørreundersøkelse,
    startSpørreundersøkelse,
    useHentSpørreundersøkelser,
} from "../../../../api/lydia-api/spørreundersøkelse";
import { SpørreundersøkelseMedInnholdVisning } from "../../Kartlegging/SpørreundersøkelseForhåndsvisningModal";

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
`;

const KartleggingDato = styled.span`
    width: 9rem;
    text-align: left;
    margin-left: 1rem;
`;

const KartleggingStatusWrapper = styled.div`
    min-width: 5rem;
`;

export const EvalueringCardHeaderInnhold = ({
    spørreundersøkelse,
    dato,
}: CardHeaderProps) => {
    const [
        bekreftFullførKartleggingModalÅpen,
        setBekreftFullførKartleggingModalÅpen,
    ] = useState(false);
    const [forhåndsvisModalÅpen, setForhåndsvisModalÅpen] = useState(false);
    const [
        slettSpørreundersøkelseModalÅpen,
        setSlettSpørreundersøkelseModalÅpen,
    ] = useState(false);
    const [
        bekreftStartKartleggingModalÅpen,
        setBekreftStartKartleggingModalÅpen,
    ] = useState(false);

    const [erIEksportMode, setErIEksportMode] = useState(false);

    const MINIMUM_ANTALL_DELTAKERE = 3;
    const deltakereSomHarFullført = 1;
    const harNokDeltakere = deltakereSomHarFullført >= MINIMUM_ANTALL_DELTAKERE;
    const spørreundersøkelseStatus = spørreundersøkelse.status;

    const { iaSak, brukerRolle, samarbeid, brukerErEierAvSak } =
        useSpørreundersøkelse();
    const { mutate: muterEvalueringer } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        samarbeid.id,
        "Evaluering",
    );

    const { mutate: oppdaterSaksStatus } = useHentIASaksStatus(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const startEvaluering = () => {
        startSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            muterEvalueringer();
        });
    };

    const slettEvaluering = () => {
        slettSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            muterEvalueringer();
            oppdaterSaksStatus();
            setSlettSpørreundersøkelseModalÅpen(false);
        });
    };

    const avsluttEvaluering = () => {
        avsluttSpørreundersøkelse(
            iaSak.orgnr,
            iaSak.saksnummer,
            spørreundersøkelse.id,
        ).then(() => {
            muterEvalueringer();
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
                    <ExpansionCard.Title>Evaluering</ExpansionCard.Title>
                    <HeaderRightContent>
                        <ActionButtonContainer>
                            <ResultatEksportVisning
                                iaSak={iaSak}
                                spørreundersøkelse={spørreundersøkelse}
                                erIEksportMode={erIEksportMode}
                                setErIEksportMode={setErIEksportMode}
                            />
                        </ActionButtonContainer>
                        <KartleggingStatusWrapper>
                            <SpørreundersøkelseStatusBadge
                                status={spørreundersøkelse.status}
                            />
                        </KartleggingStatusWrapper>
                        <KartleggingDato>{dato}</KartleggingDato>
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
                                            setBekreftStartKartleggingModalÅpen(
                                                true,
                                            )
                                        }
                                    >
                                        Start
                                    </StyledActionButton>
                                    <StyledActionButton
                                        variant="secondary"
                                        onClick={() =>
                                            setForhåndsvisModalÅpen(true)
                                        }
                                    >
                                        Forhåndsvis
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
                            erModalÅpen={bekreftStartKartleggingModalÅpen}
                            lukkModal={() =>
                                setBekreftStartKartleggingModalÅpen(false)
                            }
                            startSpørreundersøkelsen={startEvaluering}
                        />
                        <SpørreundersøkelseMedInnholdVisning
                            spørreundersøkelse={spørreundersøkelse}
                            erModalÅpen={forhåndsvisModalÅpen}
                            spørreundersøkelseid={spørreundersøkelse.id}
                            lukkModal={() => setForhåndsvisModalÅpen(false)} />
                        {brukerRolle && (
                            <SlettSpørreundersøkelseModal
                                spørreundersøkelse={spørreundersøkelse}
                                erModalÅpen={slettSpørreundersøkelseModalÅpen}
                                lukkModal={() =>
                                    setSlettSpørreundersøkelseModalÅpen(false)
                                }
                                slettSpørreundersøkelsen={slettEvaluering}
                            />
                        )}
                    </ActionButtonContainer>
                    <HeaderRightContent>
                        <KartleggingStatusWrapper>
                            <SpørreundersøkelseStatusBadge
                                status={spørreundersøkelse.status}
                            />
                        </KartleggingStatusWrapper>
                        <KartleggingDato>{dato}</KartleggingDato>
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
                                                    setBekreftFullførKartleggingModalÅpen(
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
                                            bekreftFullførKartleggingModalÅpen
                                        }
                                        lukkModal={() =>
                                            setBekreftFullførKartleggingModalÅpen(
                                                false,
                                            )
                                        }
                                        fullførSpørreundersøkelse={
                                            avsluttEvaluering
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
                                slettSpørreundersøkelsen={slettEvaluering}
                            />
                        )}
                    </ActionButtonContainer>
                    <HeaderRightContent>
                        <KartleggingStatusWrapper>
                            <SpørreundersøkelseStatusBadge
                                status={spørreundersøkelse.status}
                            />
                        </KartleggingStatusWrapper>
                        <KartleggingDato>{dato}</KartleggingDato>
                    </HeaderRightContent>
                </StyledEmptyCardHeader>
            );
        }
    }
};
