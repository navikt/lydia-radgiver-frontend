import { BodyShort, Heading } from "@navikt/ds-react";
import NAVLogo from "../../img/NAV_logo_rød.png";

export default function VirksomhetsEksportHeader({ type, dato }: { type: string, dato?: Date | null }) {
	const vistDato = (dato ?? new Date()).toLocaleDateString("nb-NO");
	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
				<img src={NAVLogo} alt="NAV-logo" style={{ width: "6rem" }} />
				<BodyShort>{vistDato}</BodyShort>
			</div>
			<Heading level="1" size="xlarge" spacing={true}>
				{type} {vistDato}
			</Heading>
		</div>
	);
}