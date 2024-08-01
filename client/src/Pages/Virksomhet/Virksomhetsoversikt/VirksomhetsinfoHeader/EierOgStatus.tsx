import { BodyShort, Button, HStack, VStack } from "@navikt/ds-react";
import { IAProsessStatusEnum, IAProsessStatusType, IASak, IASakshendelseTypeEnum } from "../../../../domenetyper/domenetyper";
import { NyttStatusBadge } from "../../../../components/Badge/StatusBadge";
import { NavIdentMedLenke } from "../../../../components/NavIdentMedLenke";
import { NotePencilIcon } from "@navikt/aksel-icons";
import { opprettSak, useHentAktivSakForVirksomhet, useHentBrukerinformasjon, useHentSamarbeidshistorikk, useHentTeam } from "../../../../api/lydia-api";
import styled from "styled-components";
import React from "react";
import { TeamModal } from "../../../MineSaker/TeamModal";
import { HendelseMåBekreftesKnapp } from "../IASakStatus/EndreStatusKnappar/HendelseMåBekreftesKnapp";
import { loggStatusendringPåSak } from "../../../../util/amplitude-klient";
import { RolleEnum } from "../../../../domenetyper/brukerinformasjon";
import { IASakshendelseKnapp } from "../IASakStatus/EndreStatusKnappar/IASakshendelseKnapp";

export default function EierOgStatus({ iaSak, orgnummer }: { iaSak?: IASak, orgnummer: string }) {
	if (iaSak === undefined) {
		return (
			<HStack gap="4" align="start" justify="end" flexGrow="1">
				<Statusseksjon status={IAProsessStatusEnum.Enum.IKKE_AKTIV} eidAv={null} />
				<VurderSeksjon orgnummer={orgnummer} />
			</HStack>
		);
	}

	if (iaSak.status === IAProsessStatusEnum.Enum.VURDERES && !iaSak.eidAv) {
		return (
			<HStack gap="4" align="start" justify="end" flexGrow="1">
				<Statusseksjon status={iaSak.status} eidAv={iaSak.eidAv} />
				<TaEierskapSeksjon iaSak={iaSak} />
			</HStack>
		);

	}

	return (
		<HStack gap="4" align="start" justify="end" flexGrow="1">
			<Statusseksjon status={iaSak.status} eidAv={iaSak.eidAv} />
			<Eierseksjon iaSak={iaSak} />
		</HStack>
	);
}

function VurderSeksjon({ orgnummer }: { orgnummer: string }) {
	const { data: brukerInformasjon } = useHentBrukerinformasjon();
	const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(orgnummer);
	const { mutate: mutateAktivSak } = useHentAktivSakForVirksomhet(orgnummer);

	const mutateIASakerOgSamarbeidshistorikk = () => {
		mutateAktivSak?.();
		mutateSamarbeidshistorikk?.();
	}

	const vurderes = () => {
		opprettSak(orgnummer).then(() => mutateIASakerOgSamarbeidshistorikk());
		loggStatusendringPåSak(IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES, IAProsessStatusEnum.enum.NY);
	}
	if (brukerInformasjon?.rolle === RolleEnum.enum.Superbruker) {
		return (
			<IASakshendelseKnapp
				hendelsesType={IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES}
				onClick={vurderes}
			/>
		);
	}

	return null;
}

function TaEierskapSeksjon({ iaSak }: { iaSak: IASak }) {
	return (
		<HStack gap="1" align="stretch">
			{iaSak.gyldigeNesteHendelser.map((hendelse) => (
				<HendelseMåBekreftesKnapp sak={iaSak} hendelse={hendelse} key={hendelse.saksHendelsestype} />
			))}
		</HStack>
	);
}

function kanEndreProsess(status: IAProsessStatusType, eidAv: string | null) {
	return status !== IAProsessStatusEnum.Enum.VURDERES || eidAv !== null;
}

function Statusseksjon({ status, eidAv }: { status: IAProsessStatusType, eidAv: string | null }) {
	return (
		<HStack gap="1" align="center" justify="end">
			<NyttStatusBadge status={status} />
			{kanEndreProsess(status, eidAv) && (
				<Button size="xsmall" variant="tertiary-neutral">
					<NotePencilIcon fontSize="1.5rem" />
				</Button>
			)}
		</HStack>
	);
}

const FollowersCount = styled.span`
    font-weight: normal;
`;

function Eierseksjon({ iaSak }: { iaSak: IASak }) {
	const [erÅpen, setErÅpen] = React.useState(false);
	const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);

	return (
		<HStack gap="1" align="start" justify="end">
			<VStack gap="1" align="stretch">
				<HStack gap="1" align="start" justify="end">
					<BodyShort weight="semibold">Eier</BodyShort>
					{iaSak.eidAv ? <NavIdentMedLenke navIdent={iaSak.eidAv} /> : "Ikke satt"}
				</HStack>
				<BodyShort weight="semibold">
					Følgere{" "}
					<FollowersCount>({følgere?.length})</FollowersCount>
				</BodyShort>
			</VStack>
			<Button size="xsmall" variant="tertiary-neutral" onClick={() => setErÅpen(true)}>
				<NotePencilIcon fontSize="1.5rem" />
			</Button>
			<TeamModal
				open={erÅpen}
				setOpen={setErÅpen}
				iaSak={iaSak}
			/>
		</HStack>
	);
}