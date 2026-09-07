import { EksternLenke } from "./EksternLenke";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../util/analytics-klient";
import { useNavnForNavIdent } from "./NavnForNavIdent";

export const NavIdentMedLenke = ({
    navIdent,
    navn,
    className,
}: {
    navIdent: string | null;
    navn?: string;
    className?: string;
}) => {
    const hentNavn = useNavnForNavIdent();

    if (!navIdent) {
        return <></>;
    }

    const visningsnavn = navn ?? hentNavn(navIdent);

    return (
        <EksternLenke
            target={navIdent}
            className={className}
            title={visningsnavn}
            href={`https://teamkatalog.nav.no/resource/${navIdent}`}
            onClick={() =>
                loggNavigeringMedEksternLenke(
                    EksternNavigeringKategorier.TEAMKATALOGEN,
                )
            }
        >
            {visningsnavn}
        </EksternLenke>
    );
};
