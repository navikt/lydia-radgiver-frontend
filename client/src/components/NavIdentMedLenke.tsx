import {EksternLenke} from "./EksternLenke";

export const NavIdentMedLenke = ({navIdent}: { navIdent: string | null }) =>
    navIdent
        ? <EksternLenke target={navIdent}
                        href={`https://teamkatalog.nav.no/resource/${navIdent}`}>{navIdent}</EksternLenke>
        : <></>
