import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import { useHentBrukerinformasjon } from "./api/lydia-api";
import { Prioriteringsside } from "./Pages/Prioritering/Prioriteringsside";
import { desktopAndUp, largeDesktopAndUp } from "./styling/breakpoints";
import { Virksomhetsside } from "./Pages/Virksomhet/Virksomhetsside";
import { FeilmeldingBanner } from "./components/Banner/FeilmeldingBanner";
import { Dekoratør } from "./components/Dekoratør/Dekoratør";
import { contentSpacing } from "./styling/contentSpacing";
import { Footer } from "./components/Footer/Footer";
import { Statusoversiktside } from "./Pages/Statusoversikt/Statusoversiktside";

const App = () =>
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>

const AppContent = () => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    return brukerInformasjon ? (
        <>
            <Dekoratør brukerInformasjon={brukerInformasjon} />
            <FeilmeldingBanner />
            <AppRamme>
                <Routes>
                    <Route
                        path={"/"}
                        element={<Prioriteringsside />}
                    />
                    <Route
                        path={"/statusoversikt"}
                        element={<Statusoversiktside />}
                    />
                    <Route
                        path={"/virksomhet/:orgnummer"}
                        element={<Virksomhetsside />}
                    />
                </Routes>
            </AppRamme>
            <Footer />
        </>
    ) : null;
}

const AppRamme = styled.main`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  padding: 0 ${contentSpacing.mobileX} 1.5rem;

  ${desktopAndUp} {
    padding-left: ${contentSpacing.desktopX};
    padding-right: ${contentSpacing.desktopX};
  }

  ${largeDesktopAndUp} {
    padding-left: ${contentSpacing.largeDesktopX};
    padding-right: ${contentSpacing.largeDesktopX};
  }
`;

export default App;
