import { Detail } from "@navikt/ds-react";
import { NavIdentMedLenke } from "./NavIdentMedLenke";

export default function NavIdentMedFallback({
    navIdent,
}: {
    navIdent: string | undefined;
}) {
    if (!navIdent) return <Detail>-</Detail>;
    if (navIdent === "Fia system") return <Detail>Fia system</Detail>;
    return <NavIdentMedLenke navIdent={navIdent} />;
}
