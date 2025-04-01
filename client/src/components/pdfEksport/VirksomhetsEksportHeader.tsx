import { BodyShort, Heading } from "@navikt/ds-react";
import NAVLogo from "../../img/NAV_logo_rød.jpg";
import { useVirksomhetContext } from "../../Pages/Virksomhet/VirksomhetContext";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { lokalDato } from "../../util/dato";
import styled from "styled-components";

const ImageContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const Body = styled(BodyShort)`
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
`;

const Image = styled.img`
    width: 6rem;
`;

export default function VirksomhetsEksportHeader({
    type,
    dato,
    visDato = true,
    samarbeid,
}: {
    type: string;
    dato?: Date | null;
    visDato?: boolean;
    samarbeid?: IaSakProsess;
}) {
    const vistDato = lokalDato(dato ?? new Date());
    const virksomhetsdata = useVirksomhetContext();

    return (
        <div>
            <ImageContainer>
                {/* className="nav-logo" er her for pdf-eksporten */}
                <Image className="nav-logo" src={NAVLogo} alt="NAV-logo" />
                {visDato && <BodyShort>{vistDato}</BodyShort>}
            </ImageContainer>
            <Body>{virksomhetsdata?.virksomhet?.navn}</Body>
            {samarbeid?.navn && samarbeid?.navn !== virksomhetsdata?.virksomhet?.navn ? (<Body>{samarbeid?.navn}</Body>) : undefined}
            <Heading level="1" size="xlarge" spacing={true}>
                {type} {visDato ? vistDato : ""}
            </Heading>
        </div>
    );
}
