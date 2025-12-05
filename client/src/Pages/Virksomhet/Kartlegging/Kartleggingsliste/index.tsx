import React from 'react';
import { erSaksbehandler, useHentBrukerinformasjon } from "../../../../api/lydia-api/bruker";
import { opprettSpørreundersøkelse, useSpørreundersøkelsesliste } from "../../../../api/lydia-api/spørreundersøkelse";
import { useHentTeam } from "../../../../api/lydia-api/team";
import { SpørreundersøkelseProvider } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import Spørreundersøkelseliste from '../../../../components/Spørreundersøkelse/Spørreundersøkelseliste';
import { SpørreundersøkelseHeading } from '../../../../components/Spørreundersøkelse/SpørreundersøkelseHeading';
import { SpørreundersøkelseHjelpetekst } from '../../../../components/Spørreundersøkelse/SpørreundersøkelseHjelpetekst';
import { VisHvisSamarbeidErÅpent } from '../../Samarbeid/SamarbeidContext';
import OpprettNySpørreundersøkelseKnapp from '../../../../components/Spørreundersøkelse/OpprettNySpørreundersøkelseKnapp';
import { SpørreundersøkelseType, SpørreundersøkelseTypeEnum } from '../../../../domenetyper/spørreundersøkelseMedInnhold';
import { useHentIASaksStatus } from '../../../../api/lydia-api/sak';
import { HStack } from '@navikt/ds-react';

export function Kartleggingsliste({ iaSak, gjeldendeSamarbeid }: { iaSak?: IASak; gjeldendeSamarbeid: IaSakProsess; }) {
	if (!iaSak) {
		return null;
	}
	return (<Innhold iaSak={iaSak} gjeldendeSamarbeid={gjeldendeSamarbeid} />);
}

function Innhold({ iaSak, gjeldendeSamarbeid }: { iaSak: IASak; gjeldendeSamarbeid: IaSakProsess; }) {
	const [sistOpprettetType, setSistOpprettetType] = React.useState<SpørreundersøkelseType | null>(null);
	const [sisteOpprettedeId, setSisteOpprettedeId] = React.useState("");
	const { data, loading, validating, mutate: hentSpørreundersøkelserPåNytt } = useSpørreundersøkelsesliste(iaSak.orgnr, iaSak.saksnummer, gjeldendeSamarbeid.id);
	const {
		mutate: oppdaterSaksStatus
	} = useHentIASaksStatus(iaSak.orgnr, iaSak.saksnummer);
	const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
	const { data: brukerInformasjon } = useHentBrukerinformasjon();
	const brukerFølgerSak = følgere.some(
		(følger) => følger === brukerInformasjon?.ident,
	);
	const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
	const kanEndreSpørreundersøkelser =
		(erSaksbehandler(brukerInformasjon) && (brukerFølgerSak ||
			brukerErEierAvSak) || false);

	const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);

	const opprettSpørreundersøkelseOgMuter = (type: SpørreundersøkelseType) => {
		if (sistOpprettetType !== null) return;
		setSistOpprettetType(type);
		opprettSpørreundersøkelse(
			iaSak.orgnr,
			iaSak.saksnummer,
			gjeldendeSamarbeid.id,
			type,
		).then(({ id }) => {
			setSisteOpprettedeId(id);
			hentSpørreundersøkelserPåNytt();
			oppdaterSaksStatus();
			setSistOpprettetType(null);
		});

	}

	if (loading || !data) {
		return <div>Laster kartlegginger...</div>;
	}

	return (
		<SpørreundersøkelseProvider
			spørreundersøkelseType={sistOpprettetType ?? "EVALUERING"} {/* TODO: Drop type her */ ...{}}
			spørreundersøkelseliste={data}
			iaSak={iaSak}
			samarbeid={gjeldendeSamarbeid}
			brukerRolle={brukerInformasjon?.rolle}
			kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
			sisteOpprettedeSpørreundersøkelseId={sisteOpprettedeId}
			setSisteOpprettedeSpørreundersøkelseId={setSisteOpprettedeId}
			lasterSpørreundersøkelser={loading}
			validererSpørreundersøkelser={validating}
			hentSpørreundersøkelserPåNytt={hentSpørreundersøkelserPåNytt}
		>
			<SpørreundersøkelseHeading samarbeid={gjeldendeSamarbeid}>
				<VisHvisSamarbeidErÅpent>
					<HStack gap="4">
						<OpprettNySpørreundersøkelseKnapp
							onClick={() => opprettSpørreundersøkelseOgMuter(SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING)}
							disabled={
								!(sakErIRettStatus && kanEndreSpørreundersøkelser)
							}
							loading={false}
							type={SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING}
						/>
						<OpprettNySpørreundersøkelseKnapp
							onClick={() => opprettSpørreundersøkelseOgMuter(SpørreundersøkelseTypeEnum.enum.EVALUERING)}
							disabled={
								!(sakErIRettStatus && kanEndreSpørreundersøkelser)
							}
							loading={false}
							type={SpørreundersøkelseTypeEnum.enum.EVALUERING}
						/>
					</HStack>
				</VisHvisSamarbeidErÅpent>
			</SpørreundersøkelseHeading>
			<SpørreundersøkelseHjelpetekst
				type="BEHOVSVURDERING" {/* TODO: Drop type her */ ...{}}
				kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
				sakErIRettStatus={["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status)}
				erLesebruker={brukerInformasjon?.rolle === "Lesetilgang"}
			/>
			<Spørreundersøkelseliste />
		</SpørreundersøkelseProvider>
	);

}