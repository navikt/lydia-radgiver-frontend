import { EksternLenke } from "./EksternLenke";
import {
    EksternNavigeringKategorier,
    loggNavigeringMedEksternLenke,
} from "../util/analytics-klient";
import { useNavnForNavIdent } from "./NavnForNavIdent";

export const NavIdentMedLenke = ({
    navIdent,
    className,
}: {
    navIdent: string | null;
    className?: string;
}) => {
    const hentNavn = useNavnForNavIdent();

    if (!navIdent) {
        return <></>;
    }

    const navn = hentNavn(navIdent);

    return (
        <EksternLenke
            target={navIdent}
            className={className}
            title={navn}
            href={`https://teamkatalog.nav.no/resource/${navIdent}`}
            onClick={() =>
                loggNavigeringMedEksternLenke(
                    EksternNavigeringKategorier.TEAMKATALOGEN,
                )
            }
        >
            {navn}
        </EksternLenke>
    );
};
