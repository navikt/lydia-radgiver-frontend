import { useEffect } from "react";
import { EksternLenke } from "./EksternLenke";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../util/analytics-klient";
import { useNavnForNavIdent } from "./NavnForNavIdent";

export const NavIdentMedLenke = ({ navIdent }: { navIdent: string | null }) => {
    const { registrerNavIdent, hentNavn } = useNavnForNavIdent();

    useEffect(() => {
        if (navIdent) {
            registrerNavIdent(navIdent);
        }
    }, [navIdent, registrerNavIdent]);

    return navIdent ? (
        <EksternLenke
            target={navIdent}
            href={`https://teamkatalog.nav.no/resource/${navIdent}`}
            onClick={() =>
                loggNavigeringMedEksternLenke(
                    EksternNavigeringKategorier.TEAMKATALOGEN,
                )
            }
        >
            {hentNavn(navIdent)}
        </EksternLenke>
    ) : (
        <></>
    );
};
