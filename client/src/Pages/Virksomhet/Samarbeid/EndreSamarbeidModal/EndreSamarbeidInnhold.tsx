import {
	DEFAULT_SAMARBEIDSNAVN,
	defaultNavnHvisTomt,
	IaSakProsess,
} from "../../../../domenetyper/iaSakProsess";
import {
	Alert,
	BodyShort,
	Button,
	Detail,
	Heading,
	Modal,
	TextField,
} from "@navikt/ds-react";
import { IASak, IASakshendelseType } from "../../../../domenetyper/domenetyper";
import React, { useEffect, useState } from "react";
import {
	getKanGjennomføreStatusendring,
} from "../../../../api/lydia-api/virksomhet";
import { CheckmarkIcon, TrashIcon } from "@navikt/aksel-icons";
import { StyledSamarbeidModal } from "../NyttSamarbeidModal";
import { KanGjennomføreStatusendring, MuligSamarbeidsgandling } from "../../../../domenetyper/samarbeidsEndring";
import { EksternLenke } from "../../../../components/EksternLenke";
import { KeyedMutator } from "swr";
import styled from "styled-components";


export const ModalBodyInnholdFlex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const SlettFullførFlex = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    border-bottom: 1px solid var(--a-blue-500);
    padding-top: 1rem;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
`;

export const TextFieldStyled = styled(TextField)`
    min-width: fit-content;
    width: 100%;
`;

export const DetaljerWrapper = styled.div<{ $disabled?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    opacity: ${({ $disabled }) => ($disabled ? 0.25 : 1)};
`;
export const MAX_LENGDE_SAMARBEIDSNAVN = 50;

export default function EndreSamarbeidModalInnhold({
	open,
	setOpen,
	samarbeid,
	iaSak,
	samarbeidData,
	navn,
	setNavn,
	setLagreNavnVellykket,
	setSisteType,
	setKanGjennomføreResultat,
	hentSamarbeidPåNytt,
	nyHendelse,
	lagreNavnVellykket,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	samarbeid: IaSakProsess;
	iaSak: IASak;
	samarbeidData?: IaSakProsess[];
	navn: string;
	setNavn: React.Dispatch<React.SetStateAction<string>>;
	setLagreNavnVellykket: React.Dispatch<React.SetStateAction<boolean>>;
	setSisteType: React.Dispatch<React.SetStateAction<MuligSamarbeidsgandling | null>>;
	setKanGjennomføreResultat: React.Dispatch<React.SetStateAction<KanGjennomføreStatusendring | undefined>>;
	hentSamarbeidPåNytt: KeyedMutator<IaSakProsess[]>;
	nyHendelse: (hendelsestype: IASakshendelseType) => Promise<void>;
	lagreNavnVellykket: boolean;
}) {
	const [antallTegn, setAntallTegn] = useState(samarbeid.navn?.length ?? 0);
	const [lasterKanGjennomføreHandling, setLasterKanGjennomføreHandling] = useState<string | null>(null);
	const navnErUbrukt =
		samarbeidData?.find(
			(s) =>
				s.navn?.toLowerCase() === navn.toLowerCase() ||
				(navn.toLowerCase() === DEFAULT_SAMARBEIDSNAVN.toLowerCase() &&
					s.navn === ""),
		) === undefined;

	const avbrytEndring = () => {
		setOpen(false);
		setLagreNavnVellykket(false);
		setLasterKanGjennomføreHandling(null);
		setSisteType(null);
		setKanGjennomføreResultat(undefined);
		hentSamarbeidPåNytt().then(() => {
			setNavn(defaultNavnHvisTomt(samarbeid.navn));
		});
	};

	const prøvÅGjennomføreHandling = (handling: MuligSamarbeidsgandling) => {
		setLasterKanGjennomføreHandling(handling);
		setSisteType(handling);
		getKanGjennomføreStatusendring(
			iaSak.orgnr,
			iaSak.saksnummer,
			samarbeid.id,
			handling,
		).then((kanGjennomføreResult) => {
			setLasterKanGjennomføreHandling(null);
			setKanGjennomføreResultat(kanGjennomføreResult);
		});
	};

	const endreNavn = () => {
		nyHendelse("ENDRE_PROSESS").then(() => {
			setOpen(false);
		});
	};

	useEffect(() => {
		setNavn(defaultNavnHvisTomt(samarbeid.navn));
		setAntallTegn(defaultNavnHvisTomt(samarbeid.navn)?.length ?? 0);
	}, [samarbeid]);

	useEffect(() => {
		setLagreNavnVellykket(false);
	}, [open]);

	return (
		<StyledSamarbeidModal
			open={open}
			onClose={() => {
				avbrytEndring();
			}}
			aria-label={"Administrer samarbeid"}
		>
			<Modal.Header closeButton={true}>
				<Heading size="medium">Administrer samarbeid</Heading>
			</Modal.Header>
			<Modal.Body>
				<SlettFullførFlex>
					<Button
						variant="primary"
						size="small"
						onClick={() => prøvÅGjennomføreHandling("fullfores")}
						icon={<CheckmarkIcon aria-hidden />}
						loading={lasterKanGjennomføreHandling === "fullfores"}
					>
						Fullfør samarbeid
					</Button>
					<Button
						icon={
							<TrashIcon
								title={`Slett "${samarbeid.navn}"`}
							/>
						}
						size="small"
						variant="secondary-neutral"
						title={`Slett "${samarbeid.navn}"`}
						onClick={() => prøvÅGjennomføreHandling("slettes")}
						loading={lasterKanGjennomføreHandling === "slettes"}
					/>
				</SlettFullførFlex>
				<ModalBodyInnholdFlex>
					<BodyShort>
						Her kan du endre navn på samarbeidet &quot;
						{defaultNavnHvisTomt(samarbeid.navn)}&quot;
						Samarbeidsnavn skal beskrive den avdelingen eller
						gruppen man samarbeider med. Navnet må være det samme
						som virksomheten bruker selv.
					</BodyShort>
					<br />
					<TextFieldStyled
						maxLength={MAX_LENGDE_SAMARBEIDSNAVN}
						size="small"
						label="Navngi samarbeid"
						value={navn}
						onChange={(nyttnavn) => {
							setNavn(nyttnavn.target.value);
							setLagreNavnVellykket(false);
							setAntallTegn(nyttnavn.target.value.length);
						}}
						error={
							navnErUbrukt || samarbeid.navn === navn
								? undefined
								: "Navnet er allerede i bruk"
						}
						onKeyDown={(event) => {
							// Submit på enter.
							if (event.key === "Enter" && navnErUbrukt) {
								endreNavn();
							}
						}}
						hideLabel
					/>
					<DetaljerWrapper>
						<Detail>
							<b>
								Husk, aldri skriv{" "}
								<EksternLenke
									href="https://www.datatilsynet.no/rettigheter-og-plikter/personopplysninger/"
									inlineText
								>
									personopplysninger
								</EksternLenke>
								.
							</b>
						</Detail>
						<Detail>
							{antallTegn}/{MAX_LENGDE_SAMARBEIDSNAVN} tegn
						</Detail>
					</DetaljerWrapper>
				</ModalBodyInnholdFlex>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="primary"
					onClick={() => {
						endreNavn();
					}}
					disabled={
						!navnErUbrukt ||
						navn === defaultNavnHvisTomt(samarbeid.navn)
					}
				>
					Lagre
				</Button>
				<Button
					variant="secondary"
					onClick={() => {
						avbrytEndring();
					}}
				>
					Avbryt
				</Button>
				{lagreNavnVellykket && (
					<div style={{ display: "flex", alignItems: "center" }}>
						<Alert inline variant="success" size="small">
							Lagret
						</Alert>
					</div>
				)}
			</Modal.Footer>
		</StyledSamarbeidModal>
	);
}