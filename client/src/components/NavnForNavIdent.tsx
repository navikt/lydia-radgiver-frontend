import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { useHentEiere } from "../api/lydia-api/eiere";

interface NavnForNavIdentContextType {
    registrerNavIdent: (navIdent: string) => void;
    hentNavn: (navIdent: string) => string;
}

const NavnForNavIdentContext = createContext<NavnForNavIdentContextType>({
    registrerNavIdent: () => {},
    hentNavn: (navIdent) => navIdent,
});

export const NavnForNavIdentProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [navIdenter, setNavIdenter] = useState<string[]>([]);

    const registrerNavIdent = useCallback((navIdent: string) => {
        setNavIdenter((forrige) =>
            forrige.includes(navIdent) ? forrige : [...forrige, navIdent],
        );
    }, []);

    const eiere = useHentEiere(navIdenter);

    const hentNavn = useCallback(
        (navIdent: string) =>
            eiere.find((eier) => eier.navIdent === navIdent)?.navn ?? navIdent,
        [eiere],
    );

    const value = useMemo(
        () => ({ registrerNavIdent, hentNavn }),
        [registrerNavIdent, hentNavn],
    );

    return (
        <NavnForNavIdentContext.Provider value={value}>
            {children}
        </NavnForNavIdentContext.Provider>
    );
};

export const useNavnForNavIdent = () => useContext(NavnForNavIdentContext);
