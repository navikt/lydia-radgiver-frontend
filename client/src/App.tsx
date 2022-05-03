import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import { Header } from "@navikt/ds-react-internal";
import styled from "styled-components";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useHentBrukerinformasjon } from "./api/lydia-api";
import { NavAnsatt } from "./domenetyper";
import Prioriteringsside from "./Pages/Prioritering/Prioriteringsside";
import { Breakpoint, forLargerThan } from "./styling/breakpoint";
import Virksomhetsside from "./Pages/Virksomhet/Virksomhetsside";
import { FeilmeldingBanner } from "./Pages/FeilmeldingBanner";

function App() {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    return brukerInformasjon ? (
        <>
            <Dekoratør navAnsatt={brukerInformasjon} />
            <FeilmeldingBanner />
            <BrowserRouter>
                <AppRamme>
                    <Routes>
                        <Route
                            path={"/"}
                            element={<Prioriteringsside />}
                        />
                        <Route
                            path={"/virksomhet/:orgnummer"}
                            element={<Virksomhetsside />}
                        />
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
    ${forLargerThan(Breakpoint.Tablet)} {
        padding: 0 5rem;
    }
    ${forLargerThan(Breakpoint.Desktop)} {
        padding: 0 10rem;
    }
`;

const Dekoratør = ({ navAnsatt }: { navAnsatt?: NavAnsatt }) => (
    <Header className="w-full">
        <Header.Title as="h1">Fia</Header.Title>
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
