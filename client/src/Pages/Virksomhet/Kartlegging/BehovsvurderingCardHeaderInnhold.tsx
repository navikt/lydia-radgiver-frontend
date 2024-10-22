import { Button, ExpansionCard } from "@navikt/ds-react";
import React, { useState } from "react";
import { IASakKartlegging } from "../../../domenetyper/iaSakKartlegging";
import styled from "styled-components";
import { åpneKartleggingINyFane } from "../../../util/navigasjon";
import { SlettBehovsvurderingModal } from "./SlettBehovsvurderingModal";
import { StartSpørreundersøkelseModal } from "./StartSpørreundersøkelseModal";
import { FullførSpørreundersøkelseModal } from "./FullførSpørreundersøkelseModal";
import EksportVisning from "./EksportVisning";
import { FlyttTilAnnenProsess } from "./FlyttTilAnnenProsess";
import { KartleggingStatusBedge } from "../../../components/Badge/KartleggingStatusBadge";
import { TrashIcon } from "@navikt/aksel-icons";
import { useSpørreundersøkelse } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

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

const StyledActionButton = styled(Button)`
`;

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
    padding: var(--__ac-expansioncard-padding-block) var(--__ac-expansioncard-padding-inline);
	padding-right: 5.5rem;
    border-radius: var(--__ac-expansioncard-border-radius);
    background-color: var(--ac-expansioncard-header-bg, var(--a-surface-transparent));
    position: relative;
    border: var(--__ac-expansioncard-border-width) solid var(--__ac-expansioncard-border-color);
    justify-content: space-between;
`;

const HeaderRightContent = styled.span`
    display: flex;
    align-items: center;
    font-size: 1rem;
    align-self: center;
`;

const KartleggingDato = styled.span`
    width: 8rem;
    text-align: left;
	margin-left: 1rem;
`;

const KartleggingStatusWrapper = styled.div`
	min-width: 5rem;
`;

export const BehovsvurderingCardHeaderInnhold = ({
	behovsvurdering,
	dato,
}: {
	behovsvurdering: IASakKartlegging;
	dato?: string;
}) => {
	const [
		bekreftFullførKartleggingModalÅpen,
		setBekreftFullførKartleggingModalÅpen,
	] = useState(false);
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
	const behovsvurderingStatus = behovsvurdering.status;

	const {
		iaSak,
		brukerRolle,
		samarbeid,
		brukerErEierAvSak,
	} = useSpørreundersøkelse();

	if (iaSak !== undefined) {
		if (behovsvurderingStatus === "SLETTET") {
			return null;
		}

		if (behovsvurderingStatus === "AVSLUTTET") {
			return (
				<StyledExpansionCardHeader>
					<ExpansionCard.Title>
						Behovsvurdering
					</ExpansionCard.Title>
					<HeaderRightContent>
						<ActionButtonContainer>
							<EksportVisning
								iaSak={iaSak}
								kartlegging={behovsvurdering}
								erIEksportMode={erIEksportMode}
								setErIEksportMode={setErIEksportMode}
							/>
							{brukerErEierAvSak && (
								<FlyttTilAnnenProsess
									gjeldendeSamarbeid={samarbeid}
									iaSak={iaSak}
									behovsvurdering={behovsvurdering}
									dropdownSize="small"
								/>
							)}
						</ActionButtonContainer>
						<KartleggingStatusWrapper><KartleggingStatusBedge status={behovsvurdering.status} /></KartleggingStatusWrapper>
						<KartleggingDato>{dato}</KartleggingDato>
					</HeaderRightContent>
				</StyledExpansionCardHeader>
			);
		}

		if (behovsvurderingStatus === "OPPRETTET") {
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
									{brukerErEierAvSak && (
										<StyledActionButton
											variant={"danger"}
											onClick={() =>
												setSlettSpørreundersøkelseModalÅpen(
													true,
												)
											}
											icon={<TrashIcon />} />
									)}
								</>
							)}
						<StartSpørreundersøkelseModal
							iaSak={iaSak}
							spørreundersøkelse={behovsvurdering}
							samarbeid={samarbeid}
							erModalÅpen={bekreftStartKartleggingModalÅpen}
							lukkModal={() =>
								setBekreftStartKartleggingModalÅpen(false)
							}
						/>
						{brukerRolle && (
							<SlettBehovsvurderingModal
								iaSak={iaSak}
								samarbeid={samarbeid}
								behovsvurdering={behovsvurdering}
								erModalÅpen={slettSpørreundersøkelseModalÅpen}
								lukkModal={() =>
									setSlettSpørreundersøkelseModalÅpen(false)
								}
							/>
						)}
					</ActionButtonContainer>
					<HeaderRightContent>
						<ActionButtonContainer>
							<FlyttTilAnnenProsess
								gjeldendeSamarbeid={samarbeid}
								iaSak={iaSak}
								behovsvurdering={behovsvurdering}
								dropdownSize="small"
							/>
						</ActionButtonContainer>
						<KartleggingStatusWrapper><KartleggingStatusBedge status={behovsvurdering.status} /></KartleggingStatusWrapper>
						<KartleggingDato>{dato}</KartleggingDato>
					</HeaderRightContent>
				</StyledEmptyCardHeader>
			);
		}

		if (behovsvurderingStatus === "PÅBEGYNT") {
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
											åpneKartleggingINyFane(
												behovsvurdering.kartleggingId,
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
												icon={<TrashIcon />} />
										</>
									)}
									<FullførSpørreundersøkelseModal
										iaSak={iaSak}
										samarbeid={samarbeid}
										harNokDeltakere={harNokDeltakere}
										behovsvurdering={behovsvurdering}
										erModalÅpen={
											bekreftFullførKartleggingModalÅpen
										}
										lukkModal={() =>
											setBekreftFullførKartleggingModalÅpen(
												false,
											)
										}
									/>
								</>
							)}
						{brukerRolle && (
							<SlettBehovsvurderingModal
								iaSak={iaSak}
								samarbeid={samarbeid}
								behovsvurdering={behovsvurdering}
								erModalÅpen={slettSpørreundersøkelseModalÅpen}
								lukkModal={() =>
									setSlettSpørreundersøkelseModalÅpen(false)
								}
							/>
						)}
					</ActionButtonContainer>
					<HeaderRightContent>
						<ActionButtonContainer>

							<FlyttTilAnnenProsess
								gjeldendeSamarbeid={samarbeid}
								iaSak={iaSak}
								behovsvurdering={behovsvurdering}
								dropdownSize="small"
							/>
						</ActionButtonContainer>
						<KartleggingStatusWrapper><KartleggingStatusBedge status={behovsvurdering.status} /></KartleggingStatusWrapper>
						<KartleggingDato>{dato}</KartleggingDato>
					</HeaderRightContent>
				</StyledEmptyCardHeader>
			);
		}
	}
};