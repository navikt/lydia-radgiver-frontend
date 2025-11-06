import { EksternLenke } from "./EksternLenke";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../util/analytics-klient";

export const NavIdentMedLenke = ({ navIdent }: { navIdent: string | null }) =>
    navIdent ? (
        <EksternLenke
            target={navIdent}
            href={`https://teamkatalog.nav.no/resource/${navIdent}`}
            onClick={() =>
                loggNavigeringMedEksternLenke(
                    EksternNavigeringKategorier.TEAMKATALOGEN,
                )
            }
        >
            {navIdent}
        </EksternLenke>
    ) : (
        <></>
    );
