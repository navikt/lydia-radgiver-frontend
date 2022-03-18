import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import { Header } from "@navikt/ds-react-internal";
import styled from "styled-components";

import { useHentBrukerinformasjon } from "./api/lydia-api";
import { NavAnsatt } from "./domenetyper";
import Prioriteringsside from "./Pages/Prioritering/Prioriteringsside";
import { breakpoints, forBetween, forLargerThan } from "./style-breakpoints";

function App() {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    return brukerInformasjon && (
        <>
            <Dekoratør navAnsatt={brukerInformasjon} />
            <AppRamme>
                <Prioriteringsside />
            </AppRamme>
        </>
    );
}

const AppRamme = styled.div`
    display: flex;
    flex-direction: column;
    margin: 3rem 0;
    ${forLargerThan(breakpoints.largestPhone)} {
        padding: 0 5rem;
    }
    ${forBetween(breakpoints.largestTablet, breakpoints.largestLaptop)} {
        padding: 0 10rem;
    }
    ${forLargerThan(breakpoints.smallestDesktop)} {
        padding: 0 25rem;
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
