import { Detail } from "@navikt/ds-react";
import { NavIdentMedLenke } from "./NavIdentMedLenke";

export default function NavIdentMedFallback({
    navIdent,
    navn,
}: {
    navIdent: string | undefined;
    navn?: string;
}) {
    if (!navIdent) return <Detail>-</Detail>;
    if (navIdent === "Fia system") return <Detail>Fia system</Detail>;
    return <NavIdentMedLenke navIdent={navIdent} navn={navn} />;
}
