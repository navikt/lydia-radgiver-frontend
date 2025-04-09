import { Modal, Heading, Select, CheckboxGroup, Checkbox, Box, Alert, Button } from "@navikt/ds-react";
import React from "react";
import { hentÅrsakFraÅrsakType, Knappecontainer } from ".";
import { nyHendelsePåSak } from "../../../../../../api/lydia-api/sak";
import { useHentSakshistorikk, useHentAktivSakForVirksomhet } from "../../../../../../api/lydia-api/virksomhet";
import { GyldigNesteHendelse, IASak, Årsak, ValgtÅrsakDto } from "../../../../../../domenetyper/domenetyper";
import { loggStatusendringPåSak } from "../../../../../../util/amplitude-klient";

export function BegrunnelseFørstSeksjon({
	lukkModal, hendelse, sak, clearNesteSteg,
}: {
	lukkModal: () => void;
	hendelse: GyldigNesteHendelse | null;
	sak: IASak;
	clearNesteSteg: () => void;
}) {
	const [valgtÅrsak, setValgtÅrsak] = React.useState<Årsak | undefined>(
		() => {
			return hendelse?.gyldigeÅrsaker.length
				? hendelse.gyldigeÅrsaker[0]
				: undefined;
		}
	);
	const [valgteBegrunnelser, setValgteBegrunnelser] = React.useState<
		string[]
	>([]);
	const [valideringsfeil, setValideringsfeil] = React.useState<string[]>([]);

	const begrunnelserCheckboxId = "begrunnelser-checkbox";

	const { mutate: mutateSamarbeidshistorikk } = useHentSakshistorikk(
		sak.orgnr
	);
	const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr);

	const mutateIASakerOgSamarbeidshistorikk = () => {
		mutateHentSaker?.();
		mutateSamarbeidshistorikk?.();
	};

	const lagreBegrunnelsePåSak = (valgtÅrsak: ValgtÅrsakDto) => {
		if (hendelse) {
			nyHendelsePåSak(sak, hendelse, valgtÅrsak)
				.then(mutateIASakerOgSamarbeidshistorikk)
				.finally(() => {
					lukkModal();
				});
			loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status);
		}
	};

	if (!hendelse) {
		return <></>;
	}

	return (
		<Modal.Body>
			<Heading level="2" size="medium">
				Er du sikker på at du vil sette saken til &quot;Ikke
				aktuell&quot;?
			</Heading>
			<form onSubmit={(e) => e.preventDefault()}>
				<Select
					label="Begrunnelse for at samarbeid ikke er aktuelt:"
					onChange={(e) => {
						setValgtÅrsak(
							hentÅrsakFraÅrsakType(e.target.value, hendelse)
						);
						setValgteBegrunnelser([]);
					}}
					value={valgtÅrsak?.type}
				>
					{hendelse.gyldigeÅrsaker.map((årsak) => (
						<option key={årsak.type} value={årsak.type}>
							{årsak.navn}
						</option>
					))}
				</Select>
				<br />
				<CheckboxGroup
					size="medium"
					id={begrunnelserCheckboxId}
					legend="Velg en eller flere begrunnelser"
					hideLegend
					value={valgteBegrunnelser}
					onChange={(v) => {
						setValgteBegrunnelser(v);
						setValideringsfeil([]);
					}}
				>
					{valgtÅrsak?.begrunnelser.map((begrunnelse) => (
						<Checkbox
							value={begrunnelse.type}
							key={begrunnelse.type}
						>
							{begrunnelse.navn}
						</Checkbox>
					))}
				</CheckboxGroup>
				{valideringsfeil.length > 0 && (
					<Box
						background={"bg-default"}
						borderColor="border-danger"
						padding="4"
						borderWidth="2"
						borderRadius="xlarge"
					>
						{valideringsfeil.map((feil) => (
							<Alert key={feil} inline variant="error">
								{feil}
							</Alert>
						))}
					</Box>
				)}
			</form>
			<Knappecontainer>
				<Button variant="secondary" onClick={clearNesteSteg}>
					Avbryt
				</Button>
				<Button
					onClick={() => {
						if (!valgtÅrsak || valgteBegrunnelser.length == 0) {
							if (!valideringsfeil.includes(
								"Du må velge minst én begrunnelse"
							)) {
								setValideringsfeil([
									...valideringsfeil,
									"Du må velge minst én begrunnelse",
								]);
							}
							return;
						}
						const valgtÅrsakDto: ValgtÅrsakDto = {
							type: valgtÅrsak.type,
							begrunnelser: valgteBegrunnelser,
						};
						lagreBegrunnelsePåSak(valgtÅrsakDto);
						setValideringsfeil([]);
					}}
				>
					Lagre
				</Button>
			</Knappecontainer>
		</Modal.Body>
	);
}
