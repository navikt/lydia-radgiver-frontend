import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { NavnOppslag, useHentNavnForSaksnumre } from "../api/lydia-api/navn";

type HentNavn = (navIdent: string) => string;

const NavnForNavIdentContext = createContext<HentNavn | null>(null);

export const NavnForNavIdentProvider = ({
    saksnumre,
    oppslag,
    children,
}: {
    saksnumre: string[];
    oppslag: NavnOppslag;
    children: ReactNode;
}) => {
    const navn = useHentNavnForSaksnumre(saksnumre, oppslag);

    const navnPerNavIdent = useMemo(
        () => new Map(navn.map((person) => [person.navIdent, person.navn])),
        [navn],
    );

    const hentNavn = useCallback(
        (navIdent: string) => navnPerNavIdent.get(navIdent) ?? navIdent,
        [navnPerNavIdent],
    );

    return (
        <NavnForNavIdentContext.Provider value={hentNavn}>
            {children}
        </NavnForNavIdentContext.Provider>
    );
};

export const useNavnForNavIdent = (): HentNavn =>
    useContext(NavnForNavIdentContext) ?? ((navIdent) => navIdent);
