import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import styled from "styled-components";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useHentBrukerinformasjon} from "./api/lydia-api";
import Prioriteringsside from "./Pages/Prioritering/Prioriteringsside";
import {Breakpoint, forLargerThan} from "./styling/breakpoint";
import Virksomhetsside from "./Pages/Virksomhet/Virksomhetsside";
import {FeilmeldingBanner} from "./Pages/FeilmeldingBanner";
import {Dekoratør} from "./components/Dekoratør/Dekoratør";

function App() {
    const {data: brukerInformasjon} = useHentBrukerinformasjon();
    return brukerInformasjon ? (
        <>
            <Dekoratør brukerInformasjon={brukerInformasjon}/>
            <FeilmeldingBanner/>
            <BrowserRouter>
                <AppRamme>
                    <Routes>
                        <Route
                            path={"/"}
                            element={<Page title={"Fia - søk"} component={<Prioriteringsside/>}/>}
                        />
                        <Route
                            path={"/virksomhet/:orgnummer"}
                            element={<Page title={"Fia - virksomhet"} component={<Virksomhetsside/>}/>}
                        />
                    </Routes>
                </AppRamme>
            </BrowserRouter>
        </>
    ) : null;
}

export function Page({title, component}: { title: string, component: JSX.Element }) {
    document.title = title
    return component
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


export default App;
