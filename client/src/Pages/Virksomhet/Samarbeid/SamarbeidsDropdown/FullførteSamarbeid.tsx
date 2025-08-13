import React from "react";
import { IASak } from "../../../../domenetyper/domenetyper";
import { ActionMenu } from "@navikt/ds-react";
import { SamarbeidStatusBadge } from "../../../../components/Badge/SamarbeidStatusBadge";
import { IaSakProsess, IASamarbeidStatusEnum } from "../../../../domenetyper/iaSakProsess";

import styles from "./samarbeidsdropdown.module.scss";
import Samarbeidslenke from "./Samarbeidslenke";

export default function FullførteSamarbeid({ iaSak, alleSamarbeid }: { iaSak: IASak | undefined, alleSamarbeid?: IaSakProsess[] }) {
	const fullførteSamarbeid = alleSamarbeid
		?.sort(sorterSamarbeidPåSistEndret)
		?.filter(({ status }) => status === IASamarbeidStatusEnum.enum.FULLFØRT || status === IASamarbeidStatusEnum.enum.AVBRUTT);

	if (!iaSak || fullførteSamarbeid === undefined || fullførteSamarbeid?.length === 0) {
		return null;
	}

	if (fullførteSamarbeid.length < 3) {
		return (
			<>
				<ActionMenu.Divider />
				<ActionMenu.Group label="Avsluttede samarbeid" className={styles.samarbeidsDropdownAvsluttetListe}>
					<FullførteSamarbeidListe fullførteSamarbeid={fullførteSamarbeid} iaSak={iaSak} />
				</ActionMenu.Group>
			</>
		);
	}

	return (
		<ActionMenu.Sub>
			<ActionMenu.Divider />
			<ActionMenu.SubTrigger>
				Avsluttede samarbeid ({fullførteSamarbeid.length})
			</ActionMenu.SubTrigger>
			<ActionMenu.SubContent className={styles.samarbeidsDropdownAvsluttetListe}>
				<FullførteSamarbeidListe fullførteSamarbeid={fullførteSamarbeid} iaSak={iaSak} />
			</ActionMenu.SubContent>
		</ActionMenu.Sub>
	)
}

function FullførteSamarbeidListe({ fullførteSamarbeid, iaSak }: { fullførteSamarbeid: IaSakProsess[], iaSak: IASak }) {
	return fullførteSamarbeid.map((samarbeid) => (
		<Samarbeidslenke key={samarbeid.id} className={styles.samarbeidsDropdownFullførtItem} orgnr={iaSak.orgnr} saksnummer={iaSak.saksnummer} samarbeid={samarbeid}>
			<SamarbeidStatusBadge status={samarbeid.status} slim />
		</Samarbeidslenke>
	));
}

function sorterSamarbeidPåSistEndret(a: IaSakProsess, b: IaSakProsess) {
	if (a.sistEndret === undefined || a.sistEndret === null) {
		if (b.sistEndret === undefined || b.sistEndret === null) {
			return 0;
		}

		return 1;
	}

	if (b.sistEndret === undefined || b.sistEndret === null) {
		return -1;

	}

	const aDate = new Date(a.sistEndret);
	const bDate = new Date(b.sistEndret);

	if (aDate > bDate) {
		return -1;
	}

	if (aDate < bDate) {
		return 1;
	}
	return 0;
}