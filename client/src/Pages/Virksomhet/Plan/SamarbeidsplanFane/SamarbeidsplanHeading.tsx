import { BodyShort, HStack } from "@navikt/ds-react";
import React from "react";
import { useHentPlan } from "../../../../api/lydia-api/plan";
import Samarbeidsfanemeny from "../../../../components/Samarbeidsfanemeny";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { Plan } from "../../../../domenetyper/plan";
import EksportVisning from "./EksportVisning";
import { PubliserSamarbeidsplan } from "../PubliserSamarbeidsplan";
import { usePollingAvSamarbeidsplan } from "./usePollingAvSamarbeidsplan";
import { lokalDatoMedKlokkeslett } from "../../../../util/dato";
import { PaperplaneIcon } from "@navikt/aksel-icons";

import styles from "./samarbeidsplanFane.module.scss"

export function SamarbeidsplanHeading({
	iaSak, samarbeid, samarbeidsplan,
}: {
	iaSak: IASak;
	samarbeid: IaSakProsess;
	samarbeidsplan: Plan;
}) {
	const [lagrer, setLagrer] = React.useState(false);

	const { mutate: hentSamarbeidsplanPåNytt } = useHentPlan(
		iaSak.orgnr,
		iaSak.saksnummer,
		samarbeid.id
	);

	const { henterSamarbeidsplanPånytt, forsøkPåÅHenteSamarbeidsplan } = usePollingAvSamarbeidsplan(samarbeidsplan, hentSamarbeidsplanPåNytt);

	return (
		<>
			<HStack className={styles.planheading} align="center" justify="space-between">
				<Publiseringsinformasjon samarbeidsplan={samarbeidsplan} />
				<HStack align="center" gap="8">
					<PubliserSamarbeidsplan
						plan={samarbeidsplan}
						iaSak={iaSak}
						hentSamarbeidsplanPåNytt={hentSamarbeidsplanPåNytt}
						pollerPåStatus={henterSamarbeidsplanPånytt ||
							forsøkPåÅHenteSamarbeidsplan < 10} />
					<Samarbeidsfanemeny type="SAMARBEIDSPLAN" laster={lagrer}>
						{samarbeidsplan && (
							<EksportVisning
								samarbeidsplan={samarbeidsplan}
								samarbeid={samarbeid}
								setLagrer={setLagrer} />
						)}
					</Samarbeidsfanemeny>
				</HStack>
			</HStack>
		</>
	);
}

function Publiseringsinformasjon({ samarbeidsplan }: { samarbeidsplan: Plan }) {
	return (
		<HStack align="center" gap="8" className={styles.publiseringsinformasjon}>
			<BodyShort>Oppdatert: {lokalDatoMedKlokkeslett(samarbeidsplan?.sistEndret)}</BodyShort>
			{samarbeidsplan?.publiseringStatus == "PUBLISERT" && (
				<HStack gap="2" align="center">
					<PaperplaneIcon aria-hidden fontSize="1.75rem" />
					{samarbeidsplan?.harEndringerSidenSistPublisert ? (
						<BodyShort>Planen er oppdatert og kan publiseres igjen</BodyShort>
					) : (
						samarbeidsplan?.sistPublisert && (<BodyShort>Publisert: {lokalDatoMedKlokkeslett(samarbeidsplan?.sistPublisert)}</BodyShort>)
					)}
				</HStack>
			)}
		</HStack>
	);
}