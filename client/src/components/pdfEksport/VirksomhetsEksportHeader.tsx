import { BodyShort, Heading } from "@navikt/ds-react";
import NAVLogo from "../../img/NAV_logo_rød.jpg";
import { useVirksomhetContext } from "../../Pages/Virksomhet/VirksomhetContext";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { lokalDato } from "../../util/dato";

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
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                }}
            >
                {/* className="nav-logo" er her for pdf-eksporten */}
                <img className="nav-logo" src={NAVLogo} alt="NAV-logo" style={{ width: "6rem" }} />
                {visDato && <BodyShort>{vistDato}</BodyShort>}
            </div>
            <BodyShort style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                {virksomhetsdata?.virksomhet?.navn}
            </BodyShort>
            {samarbeid?.navn ? (
                <BodyShort
                    style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                >
                    {samarbeid?.navn}
                </BodyShort>
            ) : undefined}
            <Heading level="1" size="xlarge" spacing={true}>
                {type} {visDato ? vistDato : ""}
            </Heading>
        </div>
    );
}
