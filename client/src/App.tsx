import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import { Header } from "@navikt/ds-react-internal";
import styled from "styled-components";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import { useHentBrukerinformasjon } from "./api/lydia-api";
import { NavAnsatt } from "./domenetyper";
import Prioriteringsside from "./Pages/Prioritering/Prioriteringsside";
import { breakpoints, forBetween, forLargerThan } from "./styling/breakpoints";
import Virksomhetsside from "./Pages/Virksomhet/Virsomhetsside";

const LYDIA_BASEPATH = "lydia-radgiver"

function App() {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    return brukerInformasjon ? (
        <>
            <Dekoratør navAnsatt={brukerInformasjon} />
            <BrowserRouter>
                <AppRamme>
                    <Routes>
                        <Route path={`${LYDIA_BASEPATH}/`} element={<Prioriteringsside/>}/>
                        <Route path={`${LYDIA_BASEPATH}/virksomhet/:orgnummer`} element={<Virksomhetsside/>}/>
                    </Routes>
                </AppRamme>
            </BrowserRouter>
        </>
    ) : null;
}

const AppRamme = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    ${forLargerThan(breakpoints.largestPhone)} {
        padding: 0 5rem;
    }
    ${forBetween(breakpoints.largestTablet, breakpoints.largestLaptop)} {
        padding: 0 10rem;
    }
`;

const Dekoratør = ({ navAnsatt }: { navAnsatt?: NavAnsatt }) => (
    <Header className="w-full">
        <Header.Title as="h1">Lydia</Header.Title>
        {navAnsatt && (
            <Header.User
                name={navAnsatt.navn}
                description={navAnsatt.ident}
                style={{ marginLeft: "auto" }}
            />
        )}
    </Header>
);

export default App;
