import { Button, ButtonProps } from "@navikt/ds-react";
import React from "react";
import { GyldigNesteHendelse, IASak, IASakshendelseTypeEnum } from "../../../../../domenetyper/domenetyper";
import { nyHendelsePåSak, useHentAktivSakForVirksomhet, useHentKartlegginger, useHentLeveranser, useHentSamarbeidshistorikk } from "../../../../../api/lydia-api";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";
import { StatusHendelseSteg } from "./Statusknapper";
import { penskrivIASakshendelsestype } from "../EndreStatusKnappar/IASakshendelseKnapp";
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { useTrengerÅFullføreLeveranserFørst, useTrengerÅFullføreKartleggingerFørst } from "../EndreStatusKnappar/IASakshendelseKnapp"


export default function KnappForHendelse(
	{ hendelse, sak, setVisKonfetti, nesteSteg, setNesteSteg, variant = "secondary" }:
		{
			hendelse: GyldigNesteHendelse,
			sak: IASak,
			setVisKonfetti?: (visKonfetti: boolean) => void,
			nesteSteg: StatusHendelseSteg | null,
			setNesteSteg: (n: { nesteSteg: StatusHendelseSteg | null, hendelse: GyldigNesteHendelse | null }) => void,
			variant?: ButtonProps["variant"]
		}
) {
	const disabled = nesteSteg !== null;

	switch (hendelse.saksHendelsestype) {
		case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
			return <IkkeAktuellKnapp sak={sak} hendelse={hendelse} setNesteSteg={setNesteSteg} disabled={disabled} variant={variant} />;
		case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
		case IASakshendelseTypeEnum.enum.TILBAKE:
		case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
			return <HendelseMåBekreftesKnapp sak={sak} hendelse={hendelse} setNesteSteg={setNesteSteg} setVisKonfetti={setVisKonfetti} disabled={disabled} variant={variant} />;
		case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
		case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
		case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
		case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
		case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
		case IASakshendelseTypeEnum.enum.SLETT_SAK:
			return <RettTilNesteStatusKnapp sak={sak} hendelse={hendelse} disabled={disabled} variant={variant} />;
		case IASakshendelseTypeEnum.enum.ENDRE_PROSESS:
		default:
			return <></>;

	}
}

function IkkeAktuellKnapp(
	{ sak, hendelse, setNesteSteg, disabled, variant }: {
		sak: IASak,
		hendelse: GyldigNesteHendelse,
		setNesteSteg: (n: { nesteSteg: StatusHendelseSteg | null, hendelse: GyldigNesteHendelse | null }) => void,
		disabled: boolean,
		variant?: ButtonProps["variant"]
	}) {
	const { data: leveranserPåSak } = useHentLeveranser(
		sak.orgnr,
		sak.saksnummer,
	);
	const { data: kartleggingerPåSak } = useHentKartlegginger(
		sak.orgnr,
		sak.saksnummer,
	);
	const harLeveranserSomErUnderArbeid = leveranserPåSak
		?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
		.some((leveranse) => leveranse.status === "UNDER_ARBEID");
	const harKartleggingerSomErUnderArbeid = kartleggingerPåSak
		?.flatMap((kartlegging) => kartlegging.status)
		.some((status) => status !== "AVSLUTTET");

	return (
		<Button
			disabled={disabled}
			variant={variant}
			size="small"
			onClick={() => {
				if (harLeveranserSomErUnderArbeid) {
					setNesteSteg({ nesteSteg: "FULLFØR_LEVERANSE", hendelse });
				} else if (harKartleggingerSomErUnderArbeid) {
					setNesteSteg({ nesteSteg: "FULLFØR_KARTLEGGINGER", hendelse });
				} else {
					setNesteSteg({ nesteSteg: "BEGRUNNELSE", hendelse });
				}
			}}>{penskrivIASakshendelsestype(hendelse.saksHendelsestype)}</Button>
	);
}

function HendelseMåBekreftesKnapp({ hendelse, setNesteSteg, disabled, variant, sak }: {
	sak: IASak,
	hendelse: GyldigNesteHendelse,
	setVisKonfetti?: (visKonfetti: boolean) => void,
	setNesteSteg: (n: { nesteSteg: StatusHendelseSteg | null, hendelse: GyldigNesteHendelse | null }) => void,
	disabled: boolean,
	variant?: ButtonProps["variant"]
}) {
	const { data: leveranserPåSak } = useHentLeveranser(
		sak.orgnr,
		sak.saksnummer,
	);
	const ingenLeveranser = !leveranserPåSak?.length;
	const trengerÅFullføreLeveranserFørst = useTrengerÅFullføreLeveranserFørst(
		hendelse.saksHendelsestype,
		sak,
	);
	const trengerÅFullføreKartleggingerFørst =
		useTrengerÅFullføreKartleggingerFørst(hendelse.saksHendelsestype, sak);

	let nesteSteg: StatusHendelseSteg | null = "BEKREFT";
	if (hendelse.saksHendelsestype === "FULLFØR_BISTAND" && ingenLeveranser) {
		nesteSteg = "LEGG_TIL_LEVERANSE";
	} else if (trengerÅFullføreLeveranserFørst) {
		nesteSteg = "FULLFØR_LEVERANSE";
	} else if (trengerÅFullføreKartleggingerFørst) {
		nesteSteg = "FULLFØR_KARTLEGGINGER";
	}


	const bekreftNyHendelsePåSak = () => {
		setNesteSteg({ nesteSteg, hendelse })
	};

	const erTilbake = hendelse.saksHendelsestype === "TILBAKE";
	const Chevron = erTilbake ? ChevronLeftIcon : ChevronRightIcon;

	return (
		<Button
			icon={<Chevron />}
			iconPosition={erTilbake ? "left" : "right"}
			disabled={disabled}
			variant={variant}
			size="small"
			onClick={bekreftNyHendelsePåSak}>
			{penskrivIASakshendelsestype(hendelse.saksHendelsestype)}
		</Button>
	);
}

function RettTilNesteStatusKnapp({ sak, hendelse, disabled, variant }: { sak: IASak, hendelse: GyldigNesteHendelse, disabled: boolean, variant?: ButtonProps["variant"] }) {
	const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(sak.orgnr);
	const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr);

	const mutateIASakerOgSamarbeidshistorikk = () => {
		mutateHentSaker?.();
		mutateSamarbeidshistorikk?.();
	}

	const trykkPåSakhendelsesknapp = () => {
		nyHendelsePåSak(sak, hendelse).then(mutateIASakerOgSamarbeidshistorikk).then(() => {
			loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status);
		});
	}

	const erTilbake = hendelse.saksHendelsestype === "TILBAKE";
	const Chevron = erTilbake ? ChevronLeftIcon : ChevronRightIcon;

	return (
		<Button
			icon={<Chevron />}
			iconPosition={erTilbake ? "left" : "right"}
			disabled={disabled}
			variant={variant}
			size="small"
			onClick={trykkPåSakhendelsesknapp}>
			{penskrivIASakshendelsestype(hendelse.saksHendelsestype)}
		</Button>
	);
}