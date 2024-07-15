import { BodyShort, Heading, Link } from "@navikt/ds-react";
import LeggTilVerktøy from "./LeggTilVerktøy";
import { Verktøylenke } from "./UndertemaConfig";
import { FileIcon } from "@navikt/aksel-icons";
import styled from "styled-components";

const VerktøyConfigContainer = styled.div`
	display: grid;
	grid-gap: 1rem;
`;

export default function VerktøyConfig({ verktøy, setVerktøy }: {
	verktøy: Verktøylenke[];
	setVerktøy: (t: Verktøylenke[]) => void;
}) {
	return (
		<VerktøyConfigContainer>
			<Headerrad />
			<VerktøyListe verktøy={verktøy} />
			<LeggTilVerktøy verktøy={verktøy} setVerktøy={setVerktøy} />
		</VerktøyConfigContainer>
	);
}

function Headerrad() {
	return <Heading level="4" size="small" spacing={true}>Verktøy og ressurser</Heading>;
}

const VerktøyVisningContainer = styled.div`
	display: grid;
	grid-template-columns: max-content 1fr;
	grid-gap: 1.5rem 2rem;
	margin-bottom: 2rem;
`;

function VerktøyListe({ verktøy }: { verktøy: Verktøylenke[] }) {
	return (
		<VerktøyVisningContainer>
			{verktøy.map((v, i) => <VerktøyVisning key={i} verktøy={v} />)}
		</VerktøyVisningContainer>
	);
}

function VerktøyVisning({ verktøy }: { verktøy: Verktøylenke }) {
	if (verktøy.lenke.length) {
		return <><Link href={verktøy.lenke} target="_blank" rel="noopener noreferrer"><FileIcon /> {verktøy.tittel}</Link><BodyShort textColor="subtle">{verktøy.lenke}</BodyShort></>;
	}

	return <><span>{verktøy.tittel}</span><span>-</span></>;
}