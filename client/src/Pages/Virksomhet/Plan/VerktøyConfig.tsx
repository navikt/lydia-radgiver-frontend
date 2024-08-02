import { BodyShort, Heading, Link } from "@navikt/ds-react";
import LeggTilVerktøy from "./LeggTilVerktøy";
import { FileIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { PlanRessurs } from "../../../domenetyper/plan";

const VerktøyConfigContainer = styled.div`
    display: grid;
    grid-gap: 1rem;
`;

export default function VerktøyConfig({ verktøy }: { verktøy: PlanRessurs[] }) {
    return (
        <VerktøyConfigContainer>
            <Headerrad />
            <VerktøyListe ressurs={verktøy} />
            <LeggTilVerktøy verktøy={verktøy} />
        </VerktøyConfigContainer>
    );
}

function Headerrad() {
    return (
        <Heading level="4" size="small" spacing={true}>
            Verktøy og ressurser
        </Heading>
    );
}

const VerktøyVisningContainer = styled.div`
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 1.5rem 2rem;
    margin-bottom: 2rem;
`;

function VerktøyListe({ ressurs }: { ressurs: PlanRessurs[] }) {
    return (
        <VerktøyVisningContainer>
            {ressurs.map((v, i) => (
                <VerktøyVisning key={i} verktøy={v} />
            ))}
        </VerktøyVisningContainer>
    );
}

function VerktøyVisning({ verktøy }: { verktøy: PlanRessurs }) {
    if (verktøy.url !== null) {
        return (
            <>
                <Link
                    href={verktøy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FileIcon /> {verktøy.beskrivelse}
                </Link>
                <BodyShort textColor="subtle">{verktøy.url}</BodyShort>
            </>
        );
    }

    return (
        <>
            <span>{verktøy.beskrivelse}</span>
            <span>-</span>
        </>
    );
}
