import { BodyShort, Heading } from "@navikt/ds-react";
import { useVirksomhetContext } from "../../Pages/Virksomhet/VirksomhetContext";
import NAVLogo from "../../img/NAV_logo_rød.png";

export default function VirksomhetsEksportHeader({ type, dato }: { type: string, dato?: Date | null }) {
	const { virksomhet } = useVirksomhetContext();
	const { navn: virksomhetsnavn } = virksomhet;
	const vistDato = (dato ?? new Date()).toLocaleDateString("nb-NO");
	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
				<img src={NAVLogo} alt="NAV-logo" style={{ width: "6rem" }} />
				<BodyShort>{vistDato}</BodyShort>
			</div>
			<div style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
				<Heading level="1" size="large" spacing={true}>
					{type} {vistDato}
				</Heading>
				<BodyShort>{virksomhetsnavn}</BodyShort>{/* TODO: Legg til " - avdeling {avdeling}" når vi har avdeling tilgjengelig. */}
			</div>
		</div>
	);
}