import React from "react";
import { Link } from "react-router-dom";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { ActionMenu } from "@navikt/ds-react";

import styles from "./samarbeidsdropdown.module.scss";

export default function Samarbeidslenke({
	orgnr,
	saksnummer,
	samarbeid,
	className = "",
	children,
}: {
	orgnr: string;
	saksnummer: string;
	samarbeid: IaSakProsess;
	className?: string;
	children?: React.ReactNode;
}) {
	return (<ActionMenu.Item
		as={Link}
		to={`/virksomhet/${orgnr}/sak/${saksnummer}/samarbeid/${samarbeid.id}`}
		title={`Gå til samarbeid '${samarbeid.navn}'`}
		className={`${styles.samarbeidslenke} ${className}`}
	>
		{children ?
			<>
				<span>{samarbeid.navn}</span>
				{children}
			</> : samarbeid.navn
		}
	</ActionMenu.Item>
	);
}