import { BodyShort } from "@navikt/ds-react";
import { useVirksomhetContext } from "../../Pages/Virksomhet/VirksomhetContext";
import NAVLogo from "../../img/NAV_logo_rød.png";

export default function VirksomhetsEksportHeader({ type, dato }: { type: string, dato?: Date | null }) {
	const { virksomhet } = useVirksomhetContext();
	const { navn: virksomhetsnavn } = virksomhet;
	const vistDato = dato ?? new Date();
	return (
		<div style={{ marginBottom: "4rem" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
				<BodyShort>{type} for {virksomhetsnavn}</BodyShort>
				<BodyShort>{vistDato.toLocaleDateString()}</BodyShort>
			</div>
			<img src={NAVLogo} alt="NAV-logo" style={{ width: "10rem", height: "auto", margin: "auto", display: "block" }} />
		</div>
	);
}