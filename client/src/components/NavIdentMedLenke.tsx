export const NavIdentMedLenke = ({navIdent}: { navIdent: string | null }) =>
    navIdent
        ? <a href={`https://teamkatalog.nav.no/resource/${navIdent}`}>{navIdent}</a>
        : <></>
